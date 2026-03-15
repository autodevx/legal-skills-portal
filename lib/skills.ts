import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const SKILLS_PATH = path.join(process.cwd(), '../legal-skills/legal-skills-repo/skills')

export interface Skill {
  slug: string
  name: string
  description: string
  license: string
  domain: string
  personas: string[]
  tags: string[]
  author: string
  version: string
  content: string
}

export function getAllSkills(): Skill[] {
  if (!fs.existsSync(SKILLS_PATH)) return []

  return fs.readdirSync(SKILLS_PATH)
    .filter(dir => fs.statSync(path.join(SKILLS_PATH, dir)).isDirectory())
    .map(slug => {
      const skillFile = path.join(SKILLS_PATH, slug, 'SKILL.md')
      if (!fs.existsSync(skillFile)) return null
      const raw = fs.readFileSync(skillFile, 'utf-8')
      const { data, content } = matter(raw)
      return {
        slug,
        name: data.name ?? slug,
        description: data.description ?? '',
        license: data.license ?? 'MIT',
        domain: data.metadata?.domain ?? '',
        personas: data.metadata?.personas ?? [],
        tags: data.metadata?.tags ?? [],
        author: data.metadata?.author ?? 'autodev-tecnologia',
        version: data.metadata?.version ?? '1.0.0',
        content,
      } as Skill
    })
    .filter(Boolean) as Skill[]
}

export function getSkillBySlug(slug: string): Skill | null {
  const skills = getAllSkills()
  return skills.find(s => s.slug === slug) ?? null
}

