// Fonte única da verdade: as skills vivem em autodevx/legal-skills.
// Este script clona o repo (raso) e copia skills/ para o portal no build/dev.
// Rode via `npm run build` / `npm run dev` (embutido nos scripts).
import { execSync } from 'node:child_process'
import { rmSync, mkdtempSync, cpSync, existsSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const REPO = 'https://github.com/autodevx/legal-skills.git'
const BRANCH = 'main'
const dest = join(process.cwd(), 'skills')

function nonEmptyDir(p) {
  try { return existsSync(p) && readdirSync(p).length > 0 } catch { return false }
}

const tmp = mkdtempSync(join(tmpdir(), 'legal-skills-'))
try {
  console.log(`[sync-skills] clonando ${REPO}#${BRANCH}…`)
  execSync(`git clone --depth 1 --branch ${BRANCH} ${REPO} "${tmp}"`, { stdio: 'inherit' })
  const src = join(tmp, 'skills')
  if (!nonEmptyDir(src)) throw new Error('pasta skills/ vazia ou ausente no repo clonado')
  rmSync(dest, { recursive: true, force: true })
  cpSync(src, dest, { recursive: true })
  const n = readdirSync(dest).length
  console.log(`[sync-skills] ${n} entradas sincronizadas em ./skills`)
} catch (err) {
  // Offline/repo indisponível: se já existe cópia local, segue com ela; senão falha.
  if (nonEmptyDir(dest)) {
    console.warn(`[sync-skills] clone falhou (${err.message}); usando ./skills existente.`)
  } else {
    console.error(`[sync-skills] clone falhou e não há ./skills local — abortando build.`)
    throw err
  }
} finally {
  rmSync(tmp, { recursive: true, force: true })
}
