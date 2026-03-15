import { getAllSkills, getSkillBySlug } from '@/lib/skills'
import { notFound } from 'next/navigation'
import SkillDetailClient from './SkillDetailClient'

export function generateStaticParams() {
  return getAllSkills().map(s => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const skill = getSkillBySlug(slug)
  if (!skill) return {}
  return {
    title: `${skill.name} — legalskills.sh`,
    description: skill.description,
  }
}

export default async function SkillPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const skill = getSkillBySlug(slug)
  if (!skill) notFound()
  return <SkillDetailClient skill={skill} />
}
