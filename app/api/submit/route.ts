import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    return NextResponse.json({ error: 'GitHub token not configured' }, { status: 500 })
  }

  const body = await req.json()
  const { name, persona, domain, description, example, email } = body

  if (!name || !persona || !domain || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const slug = name
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')

  const skillDraft = `---
name: ${name}
description: >
  ${description.replace(/\n/g, '\n  ')}
license: MIT
metadata:
  domain: ${domain.toLowerCase().replace(/\s+/g, '-')}
  personas:
    - ${persona.toLowerCase().replace(/\s+\//g, '-').replace(/\s+/g, '-')}
  tags: []
  author: community
  version: 1.0.0
---

# ${name}

<!-- Descreva aqui o prompt completo da skill. -->

${description}

${example ? `## Exemplo de uso\n\n${example}` : ''}
`.trim()

  const issueBody = `## Sugestão de nova skill

**Nome:** ${name}
**Slug sugerido:** \`${slug}\`
**Persona:** ${persona}
**Domínio:** ${domain}
${email ? `**Contato:** ${email}` : ''}

### Descrição
${description}

${example ? `### Exemplo de uso\n${example}` : ''}

---

### Rascunho do SKILL.md

\`\`\`markdown
${skillDraft}
\`\`\`

---

*Enviado via [legalskills.sh/submit](https://legalskills.sh/submit)*`

  const res = await fetch('https://api.github.com/repos/autodevx/legal-skills/issues', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: `[skill] ${name}`,
      body: issueBody,
      labels: ['skill-suggestion', 'community'],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    console.error('GitHub API error:', err)
    return NextResponse.json({ error: 'Failed to create issue' }, { status: 502 })
  }

  const issue = await res.json()
  return NextResponse.json({ url: issue.html_url }, { status: 201 })
}
