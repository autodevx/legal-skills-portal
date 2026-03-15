import { getAllSkills } from '@/lib/skills'
import SkillCard from '@/components/SkillCard'

const bg = 'hsl(0deg 0% 7.1%)'
const surface = 'hsl(0deg 0% 12.2%)'
const border = 'hsl(0deg 0% 18%)'
const fg = 'hsl(0deg 0% 98%)'
const fgLight = 'hsl(0deg 0% 70.6%)'
const fgMuted = 'hsl(0deg 0% 30.2%)'
const brand = 'hsl(153.1deg 60.2% 52.7%)'
const brandDim = 'hsl(155.5deg 100% 9.6%)'

export default function Home() {
  const skills = getAllSkills()

  return (
    <main>
      {/* Hero */}
      <section className="px-6 py-20 max-w-4xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs mb-8 font-mono"
          style={{ border: `1px solid ${border}`, color: fgMuted, background: surface }}>
          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: brand }} />
          {skills.length} skills disponíveis · MIT License
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-5 leading-tight" style={{ color: fg }}>
          IA pronta para o{' '}
          <span style={{ color: brand }}>direito brasileiro</span>
        </h1>
        <p className="text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: fgLight }}>
          Skills de IA para advogados, controllers e equipes de Legal Ops.
          Use no Claude, ChatGPT ou qualquer assistente — sem instalar nada.
        </p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a href="#skills"
            className="px-5 py-2.5 rounded-lg font-medium text-sm transition-opacity hover:opacity-90"
            style={{ background: brand, color: 'hsl(0deg 0% 7%)' }}>
            Ver skills
          </a>
          <a href="/submit"
            className="px-5 py-2.5 rounded-lg font-medium text-sm transition-colors hover:text-white"
            style={{ border: `1px solid ${border}`, color: fgLight }}>
            Sugerir uma skill
          </a>
        </div>
      </section>

      {/* Como usar */}
      <section className="px-6 pb-16 max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { step: '01', title: 'Escolha uma skill', desc: 'Filtre por área ou persona e encontre a skill certa.' },
            { step: '02', title: 'Copie o prompt', desc: 'Clique em "Copiar prompt" e cole no Claude, ChatGPT ou Gemini.' },
            { step: '03', title: 'Use imediatamente', desc: 'Sem instalação. Sem API key. Funciona em qualquer assistente.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="p-4 rounded-lg" style={{ border: `1px solid ${border}`, background: surface }}>
              <div className="font-mono text-xs mb-2" style={{ color: brand }}>{step}</div>
              <div className="font-medium text-sm mb-1" style={{ color: fg }}>{title}</div>
              <div className="text-xs leading-relaxed" style={{ color: fgLight }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section id="skills" className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: fg }}>Skills disponíveis</h2>
          <a href="/submit" className="text-sm hover:underline" style={{ color: brand }}>
            + Sugerir skill
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {skills.map(skill => (
            <SkillCard key={skill.slug} skill={skill} />
          ))}
        </div>
        {skills.length === 0 && (
          <div className="text-center py-16" style={{ color: fgLight }}>
            Nenhuma skill encontrada.
          </div>
        )}
      </section>
    </main>
  )
}
