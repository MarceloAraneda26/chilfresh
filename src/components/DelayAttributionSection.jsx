import { useMemo, useState } from "react"
import { AlertTriangle, CalendarClock, ClipboardList, FileWarning, ListChecks, UsersRound } from "lucide-react"
import { delayAttributionReport } from "../data/reportData"

const viewTabs = [
  ["timeline", "Cronologia"],
  ["causes", "Causas"],
  ["fronts", "Frentes"],
  ["control", "Control"],
]

const filterTabs = [
  ["all", "Todos"],
  ["Critico", "Criticos"],
  ["Alto", "Altos"],
  ["Insumos", "Insumos"],
  ["Definiciones", "Definiciones"],
  ["Flores", "Flores"],
  ["Finanzas", "Finanzas"],
]

const levelClasses = {
  Critico: "low",
  Alto: "low",
  "Medio-Alto": "mid",
  Medio: "",
}

function levelClass(level) {
  return levelClasses[level] || ""
}

function categoryClass(tone) {
  if (tone === "danger") return "danger"
  if (tone === "warn") return "warn"
  return ""
}

function DelayKpis() {
  return (
    <div className="delay-kpi-strip">
      {delayAttributionReport.kpis.map(([label, value, help]) => (
        <article className="delay-kpi" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <p>{help}</p>
        </article>
      ))}
    </div>
  )
}

function TimelineView({ activeFilter, onFilterChange }) {
  const visibleEvents = useMemo(() => {
    if (activeFilter === "all") return delayAttributionReport.timeline
    if (activeFilter === "Critico") return delayAttributionReport.timeline.filter((event) => event.level === "Critico")
    if (activeFilter === "Alto") return delayAttributionReport.timeline.filter((event) => event.level === "Alto" || event.level === "Medio-Alto")
    return delayAttributionReport.timeline.filter((event) => event.type === activeFilter)
  }, [activeFilter])

  const criticalEvent = delayAttributionReport.timeline.find((event) => event.level === "Critico")

  return (
    <div className="delay-timeline-layout">
      <div className="delay-timeline-main">
        <div className="delay-filter-row" aria-label="Filtro cronologico de atrasos atribuibles">
          {filterTabs.map(([key, label]) => (
            <button className={activeFilter === key ? "active" : ""} key={key} type="button" onClick={() => onFilterChange(key)}>
              {label}
            </button>
          ))}
        </div>

        <div className="delay-event-list">
          {visibleEvents.map((event, index) => (
            <article className="delay-event-row" key={`${event.date}-${event.title}-${index}`}>
              <time>{event.date}</time>
              <div>
                <div className="delay-event-title">
                  <strong>{event.title}</strong>
                  <span className={`pill ${levelClass(event.level)}`}>{event.level}</span>
                </div>
                <p>{event.reason}</p>
                <small>{event.impact}</small>
              </div>
              <span className="tag">{event.type}</span>
            </article>
          ))}
        </div>
      </div>

      <aside className="delay-side-panel">
        <FileWarning className="delay-panel-icon" aria-hidden="true" />
        <span>Principal respaldo documental</span>
        <strong>{criticalEvent.date}</strong>
        <p>{criticalEvent.title}. {criticalEvent.impact}</p>
      </aside>
    </div>
  )
}

function CausesView() {
  return (
    <div className="delay-cause-grid">
      {delayAttributionReport.categories.map((item) => (
        <article className={`delay-cause-card ${categoryClass(item.tone)}`} key={item.title}>
          <div className="delay-cause-head">
            <AlertTriangle aria-hidden="true" />
            <h3>{item.title}</h3>
          </div>
          <p>{item.summary}</p>
          <ul>
            {item.facts.map((fact) => <li key={fact}>{fact}</li>)}
          </ul>
          <strong>{item.impact}</strong>
        </article>
      ))}
    </div>
  )
}

function FrontsView() {
  return (
    <div className="delay-front-layout">
      <div className="delay-front-list">
        {delayAttributionReport.fronts.map((front) => (
          <article className="delay-front-row" key={front.name}>
            <div>
              <strong>{front.name}</strong>
              <span>{front.dependency}</span>
            </div>
            <p>{front.effect}</p>
            <span className={`pill ${levelClass(front.level)}`}>{front.level}</span>
          </article>
        ))}
      </div>

      <aside className="delay-side-panel">
        <UsersRound className="delay-panel-icon" aria-hidden="true" />
        <span>Lectura funcional</span>
        <strong>Dependencias de cliente</strong>
        <p>El mayor riesgo no esta en desarrollo aislado, sino en acuerdos interareas que habilitan cierre financiero y validacion end-to-end.</p>
      </aside>
    </div>
  )
}

function ControlView() {
  return (
    <div className="delay-control-layout">
      <article className="delay-control-block">
        <div className="delay-cause-head">
          <ClipboardList aria-hidden="true" />
          <h3>Matriz de pendientes recomendada</h3>
        </div>
        <div className="delay-field-grid">
          {delayAttributionReport.controls.matrixFields.map((field) => <span key={field}>{field}</span>)}
        </div>
      </article>

      <article className="delay-control-block">
        <div className="delay-cause-head">
          <CalendarClock aria-hidden="true" />
          <h3>Mesas prioritarias</h3>
        </div>
        <ol className="delay-priority-list">
          {delayAttributionReport.controls.priorityTables.map((table) => <li key={table}>{table}</li>)}
        </ol>
      </article>

      <article className="delay-control-block wide">
        <div className="delay-cause-head">
          <ListChecks aria-hidden="true" />
          <h3>Conclusiones internas</h3>
        </div>
        <div className="delay-conclusion-grid">
          {delayAttributionReport.controls.conclusions.map((item) => <p key={item}>{item}</p>)}
        </div>
      </article>
    </div>
  )
}

export function DelayAttributionSection({ audienceMode }) {
  const [activeView, setActiveView] = useState("timeline")
  const [activeFilter, setActiveFilter] = useState("all")

  if (audienceMode === "client") return null

  return (
    <section className="section delay-section" id="retrasos-atribuibles" data-reveal>
      <div className="section-head">
        <div>
          <h2>Atrasos atribuibles a Chilfresh</h2>
          <p className="section-note">
            Vista interna basada en {delayAttributionReport.source}. Fuente: {delayAttributionReport.basis}
          </p>
        </div>
        <div className="segmented" aria-label="Selector de vista de atrasos atribuibles">
          {viewTabs.map(([key, label]) => (
            <button className={activeView === key ? "active" : ""} key={key} type="button" onClick={() => setActiveView(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="delay-intro-grid">
        <article className="panel delay-reading">
          <div className="panel-title">
            <div>
              <h3>Lectura interna del reporte</h3>
              <p className="section-note">{delayAttributionReport.date}</p>
            </div>
          </div>
          <p>{delayAttributionReport.objective}</p>
          <p>{delayAttributionReport.reading}</p>
        </article>
        <article className="delay-document-card">
          <span>Documento base</span>
          <strong>15 paginas</strong>
          <p>Objetivo, criterio de inclusion, matriz cronologica, analisis por tipo, eventos criticos, responsables funcionales y recomendacion de control.</p>
        </article>
      </div>

      <DelayKpis />

      {activeView === "timeline" && <TimelineView activeFilter={activeFilter} onFilterChange={setActiveFilter} />}
      {activeView === "causes" && <CausesView />}
      {activeView === "fronts" && <FrontsView />}
      {activeView === "control" && <ControlView />}
    </section>
  )
}
