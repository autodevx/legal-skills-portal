import { ImageResponse } from 'next/og'

export const alt = 'legalskills.sh — IA para o jurídico brasileiro'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const BG = '#121212'
const FG = '#FAFAFA'
const MUTED = '#A1A1A1'
const GREEN = '#3FCF8E'
const BORDER = '#2E2E2E'

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: BG,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          border: `2px solid ${BORDER}`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 40, fontWeight: 700, color: FG }}>
          legal<span style={{ color: GREEN }}>skills</span>.sh
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 82, fontWeight: 800, color: FG, lineHeight: 1.05, letterSpacing: -2 }}>
            IA pronta para o
          </div>
          <div style={{ fontSize: 82, fontWeight: 800, color: GREEN, lineHeight: 1.05, letterSpacing: -2 }}>
            jurídico brasileiro
          </div>
          <div style={{ fontSize: 34, color: MUTED, marginTop: 28 }}>
            Skills para Claude, ChatGPT e outros — advocacia, contencioso e Legal Ops.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 26, color: MUTED }}>
          <div style={{ width: 18, height: 18, borderRadius: 9, background: GREEN }} />
          Open source · MIT · por Autodev Tecnologia
        </div>
      </div>
    ),
    size
  )
}
