import { useMemo, useState } from "react"
import { Bot, FileStack, Gauge, Layers3, Lightbulb, Puzzle, Route, Sparkles } from "lucide-react"
import {
  futureImplementationHorizons,
  futureImplementations,
  futureImplementationSummary,
} from "../data/reportData"

const horizonTabs = ["Todos", "Corto plazo", "Mediano plazo", "Largo plazo"]

const categoryIcons = {
  Innovacion: Sparkles,
  Operacion: Gauge,
  Adopcion: Bot,
  "Gobierno funcional": Puzzle,
  Reporteria: Layers3,
  Trazabilidad: FileStack,
  Finanzas: Gauge,
  Integraciones: Puzzle,
  Analitica: Layers3,
  Externo: Route,
  Experiencia: Lightbulb,
  Documental: FileStack,
}

function priorityClass(priority) {
  if (priority === "Alta") return "low"
  if (priority === "Media") return "mid"
  return "done"
}

export function FutureImplementationsSection({ audienceMode }) {
  const [activeHorizon, setActiveHorizon] = useState("Todos")
  const [selectedId, setSelectedId] = useState(futureImplementations[0].id)
  const isClientView = audienceMode === "client"

  const visibleItems = useMemo(
    () => activeHorizon === "Todos"
      ? futureImplementations
      : futureImplementations.filter((item) => item.horizon === activeHorizon),
    [activeHorizon],
  )

  const selected = visibleItems.find((item) => item.id === selectedId) || visibleItems[0]

  function handleHorizonChange(horizon) {
    setActiveHorizon(horizon)
    const next = horizon === "Todos"
      ? futureImplementations[0]
      : futureImplementations.find((item) => item.horizon === horizon)
    if (next) setSelectedId(next.id)
  }

  return (
    <section className="section future-section" id="futuras-implementaciones" data-reveal>
      <div className="section-head">
        <div>
          <h2>{isClientView ? "Evolucion futura de la plataforma" : "Futuras implementaciones"}</h2>
          <p className="section-note">
            {isClientView
              ? "Oportunidades de evolucion posteriores al cierre base, ordenadas por horizonte y valor para la operacion."
              : "Backlog estimable de mejoras, innovacion y automatizacion surgido durante las revisiones funcionales."}
          </p>
        </div>
        <div className="segmented" aria-label="Filtro de horizonte de futuras implementaciones">
          {horizonTabs.map((horizon) => (
            <button
              className={activeHorizon === horizon ? "active" : ""}
              key={horizon}
              type="button"
              onClick={() => handleHorizonChange(horizon)}
            >
              {horizon}
            </button>
          ))}
        </div>
      </div>

      <div className="future-overview-grid">
        <article className="panel future-intro">
          <span className="pill mid">Roadmap evolutivo</span>
          <h3>{futureImplementationSummary.title}</h3>
          <p>{futureImplementationSummary.reading}</p>
          <p>{futureImplementationSummary.note}</p>
        </article>

        <div className="future-metric-list" aria-label="Indicadores de futuras implementaciones">
          <div className="future-metric">
            <span>Iniciativas</span>
            <strong>{futureImplementations.length}</strong>
          </div>
          <div className="future-metric">
            <span>Horizontes</span>
            <strong>{futureImplementationHorizons.length}</strong>
          </div>
          <div className="future-metric alert">
            <span>Prioridad inicial</span>
            <strong>Corto plazo</strong>
          </div>
        </div>
      </div>

      <div className="future-horizon-grid">
        {futureImplementationHorizons.map((item) => (
          <article className="future-horizon-card" key={item.horizon}>
            <div>
              <span className="pill done">{item.horizon}</span>
              <h3>{item.focus}</h3>
            </div>
            <ul>
              {item.items.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </article>
        ))}
      </div>

      <div className="future-layout">
        <article className="panel future-list-panel">
          <div className="panel-title">
            <div>
              <h3>Iniciativas priorizables</h3>
              <p className="section-note">Selecciona una iniciativa para revisar alcance, valor y ejemplos funcionales.</p>
            </div>
          </div>
          <div className="future-card-grid">
            {visibleItems.map((item) => {
              const Icon = categoryIcons[item.category] || Lightbulb
              return (
                <button
                  className={`future-card ${selected?.id === item.id ? "active" : ""}`}
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedId(item.id)}
                >
                  <span className="future-card-icon"><Icon className="icon" aria-hidden="true" /></span>
                  <span>
                    <strong>{item.title}</strong>
                    <span>{item.summary}</span>
                  </span>
                  <span className="future-card-meta">
                    <span className={`pill ${priorityClass(item.priority)}`}>{item.priority}</span>
                    <span className="tag">{item.horizon}</span>
                  </span>
                </button>
              )
            })}
          </div>
        </article>

        {selected && (
          <aside className="panel future-detail" aria-live="polite">
            <span className={`pill ${priorityClass(selected.priority)}`}>{selected.priority}</span>
            <h3>{selected.title}</h3>
            <p>{selected.summary}</p>
            <div className="detail-meta">
              <span className="tag">{selected.horizon}</span>
              <span className="tag">{selected.category}</span>
            </div>
            <div className="detail-box">
              <h4>Valor esperado</h4>
              <p>{selected.benefit}</p>
            </div>
            <div className="detail-box">
              <h4>Ejemplos funcionales</h4>
              <ul>
                {selected.examples.map((example) => <li key={example}>{example}</li>)}
              </ul>
            </div>
          </aside>
        )}
      </div>
    </section>
  )
}
