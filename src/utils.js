export function statusClass(progress) {
  if (progress >= 80) return "done"
  if (progress >= 35) return "mid"
  return "low"
}

export function milestoneClass(item) {
  if (item.tone === "pending") return "pending"
  if (item.tone === "definition") return "definition"
  return "advance"
}

export function milestonePillClass(item) {
  if (item.tone === "pending") return "low"
  if (item.tone === "definition") return "mid"
  return "done"
}

export function includesQuery(parts, query) {
  const q = query.trim().toLowerCase()
  if (!q) return true
  return parts.filter(Boolean).join(" ").toLowerCase().includes(q)
}
