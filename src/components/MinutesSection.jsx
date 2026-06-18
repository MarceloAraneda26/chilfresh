import { useMemo, useState } from "react"
import { minuteConsolidated, minuteSummaries } from "../data/reportData"
import { includesQuery } from "../utils"

function minuteParts(item) {
  return [
    item.date,
    item.title,
    item.phase,
    item.focus,
    ...item.decisions,
    ...item.pending,
    ...item.tags,
  ]
}

const clientMinuteLineCopy = new Map([
  [
    "Ejecutar UAT integral; el nuevo tracking no muestra dato visible de pruebas integradas y mantiene una alerta de calidad.",
    "Ejecutar validacion integral con casos reales y cierre formal de observaciones.",
  ],
])

function sanitizeClientText(text) {
  if (clientMinuteLineCopy.has(text)) return clientMinuteLineCopy.get(text)
  return text
    .replace(/pruebas integradas/gi, "validacion integral")
    .replace(/tracking/gi, "seguimiento")
    .replace(/auditoria/gi, "trazabilidad")
}

function toClientMinute(item) {
  return {
    ...item,
    focus: sanitizeClientText(item.focus),
    decisions: item.decisions.map(sanitizeClientText),
    pending: item.pending.map(sanitizeClientText),
    tags: item.tags.map((tag) => (tag === "Pruebas" ? "Validacion" : tag)),
  }
}

export function MinutesSection({ audienceMode }) {
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState("total")
  const isClientView = audienceMode === "client"
  const allMinutes = useMemo(
    () => {
      const source = [minuteConsolidated, ...minuteSummaries]
      return isClientView ? source.map(toClientMinute) : source
    },
    [isClientView],
  )

  const filtered = useMemo(
    () => allMinutes.filter((item) => includesQuery(minuteParts(item), query)),
    [allMinutes, query],
  )

  const selected = filtered.find((item) => item.id === selectedId) || filtered[0] || minuteConsolidated
  const metrics = selected.metrics || [
    ["Fecha", selected.date],
    ["Fase", selected.phase],
    ["Acuerdos", String(selected.decisions.length)],
    ["Pendientes", String(selected.pending.length)],
  ]

  return (
    <section className="section" id="minutas" data-reveal>
      <div className="section-head">
        <div>
          <h2>Resumen de minutas</h2>
          <p className="section-note">
            {isClientView
              ? "Consulta decisiones por reunion o revisa la lectura consolidada en formato ejecutivo."
              : "Consulta una reunion especifica o revisa la lectura consolidada de todas las minutas del proyecto."}
          </p>
        </div>
        <div className="filters">
          <input
            className="search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isClientView ? "Buscar decision..." : "Buscar reunion..."}
            aria-label="Buscar reunion o tema en minutas"
          />
        </div>
      </div>

      <div className="minutes-grid">
        <aside className="panel">
          <div className="panel-title">
            <div>
              <h3>Reuniones</h3>
              <p className="section-note">
                {isClientView
                  ? "Lectura ejecutiva de reuniones y definiciones relevantes del proyecto."
                  : "18 reuniones unicas; el 20-10 consolida dos archivos equivalentes."}
              </p>
            </div>
          </div>
          <div className="minute-list">
            {filtered.length === 0 ? (
              <div className="detail-box"><p>No hay minutas que coincidan con la busqueda.</p></div>
            ) : (
              filtered.map((item) => (
                <button
                  className={`minute-button ${selected.id === item.id ? "active" : ""}`}
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                >
                  <time>{item.id === "total" ? "Total" : item.date}</time>
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.phase}</span>
                  </span>
                </button>
              ))
            )}
          </div>
        </aside>

        <article className="panel">
          <div className="panel-title">
            <div>
              <h3>{selected.title}</h3>
              <p className="section-note">{selected.date} - {selected.phase}</p>
            </div>
          </div>
          <div className="minute-metrics">
            {metrics.map(([label, value]) => (
              <div className="minute-metric" key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>
          <p className="minute-focus">{selected.focus}</p>
          <div className="detail-grid">
            <div className="detail-box">
              <h4>Decisiones y acuerdos</h4>
              <ul>{selected.decisions.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
            <div className="detail-box">
              <h4>{isClientView ? "Focos abiertos" : "Pendientes y focos abiertos"}</h4>
              <ul>{selected.pending.map((item) => <li key={item}>{item}</li>)}</ul>
            </div>
          </div>
          <div className="tag-cloud" aria-label="Temas de la minuta">
            {selected.tags.map((tag) => <span className="tag" key={tag}>{tag}</span>)}
          </div>
        </article>
      </div>
    </section>
  )
}
