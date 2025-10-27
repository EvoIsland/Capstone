// scripts/fetch_official.ts
import fs from 'node:fs/promises'
import path from 'node:path'
import * as cheerio from 'cheerio'

const OUT = path.join(process.cwd(), 'data', 'kimal_context.txt')

const URLS = [
  'https://www.conexionenergia.com/',
  'https://www.conexionenergia.com/quienes-somos/',
  'https://www.conexionenergia.com/kimal-lo-aguirre/',
  'https://www.conexionenergia.com/gobernanza/',
  'https://www.conexionenergia.com/medio-ambiente/',
  'https://www.conexionenergia.com/comunidades/tecnologia-hvdc/',
  'https://www.conexionenergia.com/ubicacion/',
  'https://www.conexionenergia.com/comunidades/etapa-actual/',
]

function cleanText(html: string) {
  const $ = cheerio.load(html)
  $('nav, footer, script, style, noscript, form, iframe').remove()
  $('[role="navigation"], .menu, .header, .sidebar, .cookies, .cookie, .banner').remove()
  const text = $('body').text().replace(/\s+/g, ' ').trim()
  return text
}

async function fetchText(u: string) {
  const res = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0' } })
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${u}`)
  const html = await res.text()
  return cleanText(html)
}

async function main() {
  const chunks: string[] = []
  for (const u of URLS) {
    try {
      console.log('Descargando:', u)
      const t = await fetchText(u)
      chunks.push(`FUENTE: ${u}\n${t}\n`)
    } catch (e) {
      console.warn('Error al bajar', u, e)
    }
  }

  let all = chunks.join('\n---\n')
  const MAX = 120_000
  if (all.length > MAX) all = all.slice(0, MAX)

  await fs.mkdir(path.dirname(OUT), { recursive: true })
  await fs.writeFile(OUT, all, 'utf8')
  console.log(`✅ Contexto guardado en ${OUT} (${all.length} chars)`)
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
