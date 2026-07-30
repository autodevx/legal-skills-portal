import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'

// Simple in-memory rate limiter: max 5 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

function toSlug(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

async function generateSkillPrompt(form: {
  name: string; persona: string; domain: string
  description: string; example: string
}): Promise<string> {
  const { text } = await generateText({
    // Anthropic direto — requer ANTHROPIC_API_KEY no ambiente
    model: anthropic('claude-sonnet-5'),
    prompt: `Você é um especialista em prompt engineering jurídico.

Crie o conteúdo (body) de um SKILL.md para a skill abaixo.
O conteúdo é o prompt que o usuário vai colar no Claude/ChatGPT.

Regras:
- Comece definindo o papel do assistente em 1 parágrafo
- Inclua seção "## Dados de entrada" com campos claros a preencher
- Inclua seção "## Formato de saída" com estrutura esperada (tabelas, listas)
- Tom profissional, direto, jurídico brasileiro
- Sem introduções ou meta-comentários — só o prompt

Skill:
- Nome: ${form.name}
- Persona: ${form.persona}
- Domínio: ${form.domain}
- Descrição: ${form.description}
- Exemplo de uso: ${form.example || 'Não fornecido'}

Retorne APENAS o markdown do prompt, sem frontmatter YAML.`,
  })
  return text
}

async function githubRequest(path: string, method: string, token: string, body?: object) {
  const res = await fetch(`https://api.github.com${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.text()
    throw new Error(`GitHub ${method} ${path} → ${res.status}: ${err}`)
  }
  return res.json()
}

export async function POST(req: NextRequest) {
  // Rate limiting
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Muitas solicitações. Tente novamente em 1 hora.' },
      { status: 429 }
    )
  }

  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
  }

  const form = await req.json()
  const { name, persona, domain, description, example = '', email = '' } = form

  if (!name || !persona || !domain || !description) {
    return NextResponse.json({ error: 'Campos obrigatórios ausentes' }, { status: 400 })
  }

  try {

  const slug = toSlug(name)
  const branch = `skill-suggestion/${slug}-${Date.now()}`
  const repo = 'autodevx/legal-skills'

  // 1. Gerar conteúdo do prompt via AI SDK
  const promptContent = await generateSkillPrompt({ name, persona, domain, description, example })

  // 2. Montar SKILL.md completo
  const domainSlug = domain.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-')
  const personaSlug = persona.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9-]/g, '-')

  const skillMd = `---
name: ${name}
description: >
  ${description.replace(/\n/g, '\n  ')}
license: MIT
metadata:
  domain: ${domainSlug}
  personas:
    - ${personaSlug}
  tags: []
  author: community
  version: 1.0.0
---

${promptContent}
`.trim()

  // 3. SHA do main
  const { object: { sha: mainSha } } = await githubRequest(
    `/repos/${repo}/git/ref/heads/main`, 'GET', token
  )

  // 4. Criar branch
  await githubRequest(`/repos/${repo}/git/refs`, 'POST', token, {
    ref: `refs/heads/${branch}`,
    sha: mainSha,
  })

  // 5. Criar SKILL.md na branch
  await githubRequest(`/repos/${repo}/contents/skills/${slug}/SKILL.md`, 'PUT', token, {
    message: `feat: add skill ${slug} (community suggestion)`,
    content: Buffer.from(skillMd).toString('base64'),
    branch,
  })

  // 6. Abrir PR
  const prBody = `## Nova skill: ${name}

**Persona:** ${persona}
**Domínio:** ${domain}
${email ? `**Contato:** ${email}` : ''}

### Descrição original do contribuidor
${description}

${example ? `### Exemplo de uso\n${example}` : ''}

---

> Prompt gerado automaticamente via Claude API. Revise o arquivo \`skills/${slug}/SKILL.md\` antes de mergear.

*Enviado via [legalskills.sh/submit](https://legalskills.sh/submit)*`

  const pr = await githubRequest(`/repos/${repo}/pulls`, 'POST', token, {
    title: `[skill] ${name}`,
    body: prBody,
    head: branch,
    base: 'main',
  })

  return NextResponse.json({ prUrl: pr.html_url }, { status: 201 })
  } catch (err) {
    console.error('[submit] falhou:', err)
    return NextResponse.json(
      { error: 'Falha ao processar a solicitação. Tente novamente.' },
      { status: 502 }
    )
  }
}
