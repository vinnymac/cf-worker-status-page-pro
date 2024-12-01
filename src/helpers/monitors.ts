import type { Monitor } from '#src/types'

import { config } from '#src/config'

export const fetchFailedMsg = 'Fetch failed'

const openBracketIndex = 47
const closeBracketIndex = -2
function parseGvizText(gvizText: string) {
  return JSON.parse(gvizText.slice(openBracketIndex, closeBracketIndex))
}

function getMonitorsFromGvizJson(data: { table: { rows: ({ c: ({ v: any })[] })[] } }): Monitor[] {
  const [headerRow, ...rows]: ({ c: ({ v: keyof Monitor })[] })[] = data.table.rows
  const headers = headerRow.c.map((header) => header.v)
  const monitors = rows.map((row) =>
    headers.reduce((acc: Record<string, unknown>, header: string, index: number) => {
      const value = row.c[index]?.v
      acc[header] = header === 'followRedirect' ? Boolean(value) : value
      return acc
    }, {}) as unknown as Monitor,
  )
  return monitors
}

export default async function getRemoteMonitors() {
  if (!config.monitorsGvizUrl) {
    return []
  }
  const response = await fetch(config.monitorsGvizUrl)

  if (!response.ok) {
    throw new Error(fetchFailedMsg)
  }

  const data = parseGvizText(await response.text())
  return getMonitorsFromGvizJson(data)
}
