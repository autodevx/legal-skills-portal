'use client'

import { useState } from 'react'

const T = {
  bg: 'hsl(0deg 0% 7.1%)',
  surface: 'hsl(0deg 0% 12.2%)',
  border: 'hsl(0deg 0% 18%)',
  borderStrong: 'hsl(0deg 0% 21.2%)',
  fg: 'hsl(0deg 0% 98%)',
  fgLight: 'hsl(0deg 0% 70.6%)',
  fgMuted: 'hsl(0deg 0% 30.2%)',
  brand: 'hsl(153.1deg 60.2% 52.7%)',
  brandDark: 'hsl(155.5deg 100% 9.6%)',
}

const PERSONAS = [
  'Advogado contencioso',
  'Advogado consultivo',
  'Controller / CFO',
  'Legal Ops',
  'Paralegal',
  'Outro',
]

const DOMAINS = [
  'Contratos',
  'Contingência',
  'Dados Jurídicos',
  'Audiências',
  'Compliance',
  'Tributário',
  'Trabalhista',
  'Outro',
]

type Status = 'idle' | 'sending' | 'success' | 'error'

export default function SubmitPage() {
  const [form, setForm] = useState({
    name: '',
    persona: '',
    domain: '',
    description: '',
    example: '',
    email: '',
  })
  const [status, setStatus] = useState<Status>('idle')
  const [issueUrl, setIssueUrl] = useState<string | null>(null)

  const set = (field: string, value: string) =>
    setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (res.ok) {
        const data = await res.json()
        setIssueUrl(data.url ?? null)
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <main className="px-6 py-20 max-w-xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6"
          style={{ background: T.brandDark, border: `1px solid ${T.brand}` }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={T.brand} strokeWidth="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </div>
        <h1 className="text-2xl font-bold mb-3" style={{ color: T.fg }}>Sugestão enviada!</h1>
        <p className="text-sm leading-relaxed mb-6" style={{ color: T.fgLight }}>
          Obrigado pela contribuição. Criamos um issue no GitHub com o rascunho da sua skill.
          Vamos revisar e publicar em breve.
        </p>
        {issueUrl && (
          <a href={issueUrl} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium mb-8 transition-colors hover:opacity-90"
            style={{ background: T.surface, border: `1px solid ${T.border}`, color: T.fgLight }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Ver issue no GitHub
          </a>
        )}
        <div>
          <a href="/" className="text-sm font-medium hover:underline" style={{ color: T.brand }}>
            ← Voltar para as skills
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="px-6 py-16 max-w-xl mx-auto">
      {/* Header */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-6 font-mono"
          style={{ border: `1px solid ${T.border}`, color: T.fgMuted, background: T.surface }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: T.brand }} />
          Contribuição de skill
        </div>
        <h1 className="text-3xl font-bold tracking-tight mb-3" style={{ color: T.fg }}>
          Sugira uma skill
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: T.fgLight }}>
          Sem necessidade de GitHub ou programação.
          Descreva a tarefa jurídica que você faz no dia a dia e a gente transforma em skill.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Nome da skill */}
        <div>
          <label className="block text-xs font-mono font-medium mb-1.5" style={{ color: T.fgLight }}>
            Nome da skill <span style={{ color: T.brand }}>*</span>
          </label>
          <input
            required
            type="text"
            placeholder="ex: Revisão de cláusula de rescisão"
            value={form.name}
            onChange={e => set('name', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.fg,
            }}
            onFocus={e => (e.target.style.borderColor = T.brand)}
            onBlur={e => (e.target.style.borderColor = T.border)}
          />
        </div>

        {/* Persona + Domínio */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-mono font-medium mb-1.5" style={{ color: T.fgLight }}>
              Quem usa <span style={{ color: T.brand }}>*</span>
            </label>
            <select
              required
              value={form.persona}
              onChange={e => set('persona', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                color: form.persona ? T.fg : T.fgMuted,
              }}
              onFocus={e => (e.target.style.borderColor = T.brand)}
              onBlur={e => (e.target.style.borderColor = T.border)}
            >
              <option value="" disabled>Persona</option>
              {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-mono font-medium mb-1.5" style={{ color: T.fgLight }}>
              Área <span style={{ color: T.brand }}>*</span>
            </label>
            <select
              required
              value={form.domain}
              onChange={e => set('domain', e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
              style={{
                background: T.surface,
                border: `1px solid ${T.border}`,
                color: form.domain ? T.fg : T.fgMuted,
              }}
              onFocus={e => (e.target.style.borderColor = T.brand)}
              onBlur={e => (e.target.style.borderColor = T.border)}
            >
              <option value="" disabled>Domínio</option>
              {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        </div>

        {/* Descrição */}
        <div>
          <label className="block text-xs font-mono font-medium mb-1.5" style={{ color: T.fgLight }}>
            O que essa skill faz? <span style={{ color: T.brand }}>*</span>
          </label>
          <textarea
            required
            rows={4}
            placeholder="Descreva a tarefa jurídica que o assistente deve executar. Seja específico: qual é a entrada? qual é o resultado esperado?"
            value={form.description}
            onChange={e => set('description', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.fg,
            }}
            onFocus={e => (e.target.style.borderColor = T.brand)}
            onBlur={e => (e.target.style.borderColor = T.border)}
          />
        </div>

        {/* Exemplo */}
        <div>
          <label className="block text-xs font-mono font-medium mb-1.5" style={{ color: T.fgLight }}>
            Exemplo de uso <span style={{ color: T.fgMuted }}>(opcional)</span>
          </label>
          <textarea
            rows={3}
            placeholder="Ex: &quot;Preciso revisar uma cláusula de rescisão imotivada e verificar se o aviso prévio está correto conforme CLT&quot;"
            value={form.example}
            onChange={e => set('example', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors resize-none"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.fg,
            }}
            onFocus={e => (e.target.style.borderColor = T.brand)}
            onBlur={e => (e.target.style.borderColor = T.border)}
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-mono font-medium mb-1.5" style={{ color: T.fgLight }}>
            Seu e-mail <span style={{ color: T.fgMuted }}>(opcional — para avisar quando publicarmos)</span>
          </label>
          <input
            type="email"
            placeholder="voce@escritorio.com.br"
            value={form.email}
            onChange={e => set('email', e.target.value)}
            className="w-full px-3 py-2.5 rounded-lg text-sm outline-none transition-colors"
            style={{
              background: T.surface,
              border: `1px solid ${T.border}`,
              color: T.fg,
            }}
            onFocus={e => (e.target.style.borderColor = T.brand)}
            onBlur={e => (e.target.style.borderColor = T.border)}
          />
        </div>

        {status === 'error' && (
          <p className="text-xs" style={{ color: 'hsl(0deg 84% 60%)' }}>
            Erro ao enviar. Tente novamente ou mande um e-mail para pedro@autodev.com.br
          </p>
        )}

        <button
          type="submit"
          disabled={status === 'sending'}
          className="w-full py-2.5 rounded-lg text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
          style={{ background: T.brand, color: 'hsl(0deg 0% 7%)' }}
        >
          {status === 'sending' ? 'Enviando...' : 'Enviar sugestão'}
        </button>

        <p className="text-center text-xs" style={{ color: T.fgMuted }}>
          Desenvolvedor?{' '}
          <a
            href="https://github.com/autodevx/legal-skills/blob/main/CONTRIBUTING.md"
            target="_blank" rel="noopener noreferrer"
            className="hover:underline"
            style={{ color: T.fgLight }}
          >
            Abra um PR no GitHub
          </a>
        </p>
      </form>
    </main>
  )
}
