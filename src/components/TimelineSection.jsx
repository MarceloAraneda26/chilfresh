import { useMemo, useState } from "react"
import { evidenceCards, projectMilestones, projectStages } from "../data/reportData"
import { includesQuery, milestoneClass, milestonePillClass } from "../utils"

const clientEvidenceCards = [
  {
    title: "Avance real construido",
    text: "La evidencia documental muestra una plataforma con base operativa, mantenedores, logistica, bodega, Packing List, Flores y componentes financieros ya construidos o en validacion.",
  },
  {
    title: "Definiciones Chilfresh",
    text: "Las minutas concentran decisiones sobre actores, acuerdos, reglas comerciales, homologacion Frutas/Flores, PL, SC, costos, liquidaciones y cuentas corrientes.",
  },
  {
    title: "Ruta de continuidad",
    text: "El cierre requiere foco en datos reales, integracion Softland/SII, validacion funcional, liquidaciones y Cuentas Corrientes. El 78% confirma avance relevante, con un tramo final de alta importancia.",
  },
]

const clientMilestoneCopy = {
  "h-kickoff": {
    title: "Kick-off y linea base de planificacion",
    summary: "Se formaliza una linea base inicial, organizada en sprints bajo un esquema de avance incremental.",
    impact: "Entrega una referencia de planificacion, aunque luego el alcance real incorpora ajustes, Flores, validaciones financieras y nuevas definiciones.",
    evidence: [
      "Roadmap inicial de construccion.",
      "Metodologia Scrumban/incremental.",
      "Alcance sujeto a evolucion funcional y definiciones de negocio.",
    ],
  },
  "h-2026-06-16": {
    title: "Estado actual: 78% global con avance desigual",
    summary: "El nuevo desglose muestra 78% global, con capa operativa muy avanzada y modulos financieros criticos en etapa de cierre.",
    impact: "La lectura real es positiva pero no homogenea: el riesgo del proyecto se concentra en definiciones Chilfresh, integracion financiera, validacion funcional y cierre de datos.",
    evidence: [
      "Base, Logistica y Bodega al 100%; Mantenedores 94%.",
      "Finanzas 89%, Produccion/Flores 85%, Costos 78%.",
      "CC 4%, Contratos 36%, Liquidaciones 46%, Facturacion 57%.",
      "Foco de continuidad: cierre financiero, datos reales y validacion integral.",
    ],
  },
  "h-pend-uat": {
    title: "Validacion integral y marcha blanca",
    summary: "Falta ejecutar validacion funcional, cierre de observaciones, permisos, capacitacion y marcha blanca controlada.",
    impact: "Convierte construccion en readiness real. Es la diferencia entre sistema construido y plataforma lista para uso productivo.",
    evidence: [
      "Validacion integral con casos reales.",
      "Cierre de observaciones con negocio.",
      "Marcha blanca controlada.",
      "Preparacion de trazabilidad para uso productivo.",
    ],
  },
}

function toClientMilestone(item) {
  if (!clientMilestoneCopy[item.id]) return item
  return { ...item, ...clientMilestoneCopy[item.id] }
}

function getMilestoneSearchParts(item) {
  return [
    item.date,
    item.title,
    item.stage,
    item.kind,
    item.summary,
    item.impact,
    ...item.evidence,
  ]
}

function RoadmapStats({ audienceMode, items }) {
  const isClientView = audienceMode === "client"
  const stats = [
    ["Hitos visibles", String(items.length)],
    ["Mesas/def.", String(items.filter((item) => item.kind === "Mesa" || item.kind === "Definicion" || item.tone === "definition").length)],
    ["Avances/valid.", String(items.filter((item) => item.tone === "advance").length)],
    [isClientView ? "Focos abiertos" : "Pendientes", String(items.filter((item) => item.stage === "pendiente").length)],
  ]

  return (
    <div className="roadmap-stats">
      {stats.map(([label, value]) => (
        <div className="roadmap-stat" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  )
}

export function TimelineSection({ audienceMode }) {
  const [stageFilter, setStageFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [selectedId, setSelectedId] = useState(projectMilestones[0].id)
  const isClientView = audienceMode === "client"
  const visibleMilestones = useMemo(
    () => (isClientView ? projectMilestones.map(toClientMilestone) : projectMilestones),
    [isClientView],
  )
  const visibleEvidenceCards = isClientView ? clientEvidenceCards : evidenceCards

  const filtered = useMemo(
    () => visibleMilestones.filter((item) => {
      const matchesStage = stageFilter === "all" || item.stage === stageFilter
      return matchesStage && includesQuery(getMilestoneSearchParts(item), query)
    }),
    [stageFilter, query, visibleMilestones],
  )

  const selected = useMemo(() => {
    if (filtered.some((item) => item.id === selectedId)) {
      return visibleMilestones.find((item) => item.id === selectedId)
    }
    return filtered[0] || visibleMilestones[0]
  }, [filtered, selectedId, visibleMilestones])

  return (
    <section className="section timeline-hero" id="linea-tiempo" data-reveal>
      <div className="section-head">
        <div>
          <h2>Desarrollo del proyecto por hitos</h2>
          <p className="section-note">
            {isClientView
              ? "La lectura prioriza hitos, decisiones de negocio y avances funcionales relevantes para cierre productivo."
              : "La lectura prioriza hitos, decisiones y avances funcionales sobre duracion calendario. Incluye margen explicito para lo que aun falta cerrar."}
          </p>
        </div>
      </div>

      <div className="story-layout">
        <article className="panel story-panel">
          <div className="story-controls">
            <div className="stage-filter" aria-label="Filtro de etapas de la linea de tiempo">
              <button className={stageFilter === "all" ? "active" : ""} type="button" onClick={() => setStageFilter("all")}>Todos</button>
              {projectStages.map((stage) => (
                <button
                  className={stageFilter === stage.key ? "active" : ""}
                  key={stage.key}
                  type="button"
                  onClick={() => setStageFilter(stage.key)}
                >
                  {stage.key === "pendiente" ? "Falta" : stage.title.split(" ")[0]}
                </button>
              ))}
            </div>
            <input
              className="search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isClientView ? "Buscar hito o decision..." : "Buscar hito, mesa o definicion..."}
              aria-label="Buscar hito del proyecto"
            />
          </div>

          <RoadmapStats audienceMode={audienceMode} items={filtered} />

          <div className="narrative-timeline">
            {filtered.length === 0 ? (
              <div className="detail-box"><p>No hay hitos que coincidan con la busqueda o etapa seleccionada.</p></div>
            ) : (
              projectStages.map((stage) => {
                const events = filtered.filter((item) => item.stage === stage.key)
                if (!events.length) return null
                return (
                  <div className="timeline-stage" key={stage.key}>
                    <div className="stage-label">
                      <strong>{stage.title}</strong>
                      <span>{stage.range}</span>
                    </div>
                    <div className="stage-events">
                      {events.map((item) => (
                        <button
                          className={`timeline-event ${milestoneClass(item)} ${selected?.id === item.id ? "active" : ""}`}
                          data-milestone={item.id}
                          key={item.id}
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                        >
                          <time className="event-date">{item.date}</time>
                          <span className="event-body">
                            <strong>{item.title}</strong>
                            <span>{item.summary}</span>
                          </span>
                          <span className={`pill ${milestonePillClass(item)} event-kind`}>{item.kind}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })
            )}
          </div>
        </article>

        <aside className="panel story-detail" aria-live="polite">
          <span className={`pill ${milestonePillClass(selected)}`}>
            {projectStages.find((stage) => stage.key === selected.stage)?.title}
          </span>
          <h3>{selected.title}</h3>
          <p>{selected.summary}</p>
          <div className="detail-meta">
            <span className="tag">{selected.date}</span>
            <span className="tag">{selected.kind}</span>
            <span className="tag">{projectStages.find((stage) => stage.key === selected.stage)?.range}</span>
          </div>
          <div className="detail-box">
            <h4>Impacto en el proyecto</h4>
            <p>{selected.impact}</p>
          </div>
          <ul>
            {selected.evidence.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </aside>
      </div>

      <div className="evidence-strip">
        {visibleEvidenceCards.map((card) => (
          <article className="evidence-card" key={card.title}>
            <h3>{card.title}</h3>
            <p>{card.text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
