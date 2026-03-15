'use client'

import { useState } from 'react'
import type { Skill } from '@/lib/skills'

const T = {
  bg: 'hsl(0deg 0% 7.1%)',
  surface: 'hsl(0deg 0% 12.2%)',
  surface200: 'hsl(0deg 0% 12.9%)',
  border: 'hsl(0deg 0% 18%)',
  fg: 'hsl(0deg 0% 98%)',
  fgLight: 'hsl(0deg 0% 70.6%)',
  fgMuted: 'hsl(0deg 0% 30.2%)',
  brand: 'hsl(153.1deg 60.2% 52.7%)',
  brandDark: 'hsl(155.5deg 100% 9.6%)',
}

const DOMAIN_LABELS: Record<string, string> = {
  'legal-data': 'Dados Jurídicos',
  'contratos': 'Contratos',
  'contingencia': 'Contingência',
  'audiencias': 'Audiências',
  'contencioso': 'Contencioso',
  'processual': 'Processual',
  'legal-ops': 'Legal Ops',
  'compliance': 'Compliance',
}

function buildClaudeUrl(skill: Skill) {
  const prompt = encodeURIComponent(
    `Você é um assistente jurídico especializado.\n\n${skill.description}\n\n${skill.content}`
  )
  return `https://claude.ai/new?q=${prompt}`
}

function buildChatGPTUrl(skill: Skill) {
  const prompt = encodeURIComponent(
    `Você é um assistente jurídico especializado.\n\n${skill.description}`
  )
  return `https://chatgpt.com/?q=${prompt}`
}

export default function SkillDetailClient({ skill }: { skill: Skill }) {
  const [copied, setCopied] = useState(false)

  const copyPrompt = async () => {
    await navigator.clipboard.writeText(skill.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="px-6 py-12 max-w-3xl mx-auto">
      {/* Back */}
      <a href="/#skills" className="inline-flex items-center gap-1.5 text-xs mb-8 transition-colors hover:text-white"
        style={{ color: T.fgMuted }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        Todas as skills
      </a>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded font-mono"
            style={{ background: T.brandDark, color: T.brand, border: `1px solid hsl(153.1deg 60.2% 52.7% / 0.2)` }}>
            {DOMAIN_LABELS[skill.domain] ?? skill.domain}
          </span>
          <span className="text-xs font-mono" style={{ color: T.fgMuted }}>v{skill.version}</span>
          <a href={`https://github.com/autodevx/legal-skills/tree/main/skills/${skill.slug}`}
            target="_blank" rel="noopener noreferrer"
            className="text-xs flex items-center gap-1 transition-colors hover:text-white"
            style={{ color: T.fgMuted }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            Ver no GitHub
          </a>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-3" style={{ color: T.fg }}>
          {skill.name}
        </h1>
        <p className="text-sm leading-relaxed" style={{ color: T.fgLight }}>
          {skill.description}
        </p>
      </div>

      {/* Personas */}
      {skill.personas.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-8">
          {skill.personas.map(p => (
            <span key={p} className="text-xs px-2.5 py-1 rounded"
              style={{ border: `1px solid ${T.border}`, color: T.fgLight }}>
              {p}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mb-10">
        <button onClick={copyPrompt}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-opacity hover:opacity-90"
          style={{ background: T.brand, color: 'hsl(0deg 0% 7%)' }}>
          {copied ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>Copiado!</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar prompt</>
          )}
        </button>
        <a href={buildClaudeUrl(skill)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:text-white"
          style={{ border: `1px solid ${T.border}`, color: T.fgLight }}>
          Abrir no Claude
        </a>
        <a href={buildChatGPTUrl(skill)} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:text-white"
          style={{ border: `1px solid ${T.border}`, color: T.fgLight }}>
          Abrir no ChatGPT
        </a>
      </div>

      {/* Prompt content */}
      <div className="rounded-lg overflow-hidden" style={{ border: `1px solid ${T.border}` }}>
        <div className="flex items-center justify-between px-4 py-2.5"
          style={{ background: T.surface200, borderBottom: `1px solid ${T.border}` }}>
          <span className="text-xs font-mono" style={{ color: T.fgMuted }}>prompt</span>
          <button onClick={copyPrompt}
            className="text-xs flex items-center gap-1 transition-colors hover:text-white"
            style={{ color: T.fgMuted }}>
            {copied ? (
              <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>copiado</>
            ) : (
              <><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>copiar</>
            )}
          </button>
        </div>
        <pre className="px-5 py-5 text-xs leading-relaxed overflow-x-auto whitespace-pre-wrap"
          style={{ background: T.bg, color: T.fgLight, fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}>
          {skill.content}
        </pre>
      </div>

      {/* Tags */}
      {skill.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-6">
          {skill.tags.map(t => (
            <span key={t} className="text-xs font-mono px-2 py-0.5 rounded"
              style={{ color: T.fgMuted, border: `1px solid ${T.border}` }}>
              #{t}
            </span>
          ))}
        </div>
      )}
    </main>
  )
}
