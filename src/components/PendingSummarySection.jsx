import { CalendarClock, ClipboardList, FileWarning, ListChecks, Send, UsersRound } from "lucide-react"
import { pendingSummaryReport } from "../data/reportData"

function priorityClass(priority) {
  if (priority === "Alta") return "low"
  if (priority.includes("Alta")) return "mid"
  return ""
}

function frontClass(tone) {
  if (tone === "danger") return "danger"
  if (tone === "warn") return "warn"
  return ""
}

export function PendingSummarySection({ audienceMode }) {
  if (audienceMode === "client") return null

  return (
    <section className="section pending-section" id="pendientes-chilfresh" data-reveal>
      <div className="section-head">
        <div>
          <h2>Pendientes actuales con Chilfresh</h2>
          <p className="section-note">
            Vista interna basada en {pendingSummaryReport.source}. Fuente: {pendingSummaryReport.basis}
          </p>
        </div>
      </div>

      <div className="pending-intro-grid">
        <article className="panel pending-reading">
          <div className="panel-title">
            <div>
              <h3>Lectura ejecutiva de pendientes</h3>
              <p className="section-note">{pendingSummaryReport.date}</p>
            </div>
          </div>
          <p>{pendingSummaryReport.reading}</p>
        </article>

        <aside className="pending-availability-card">
          <CalendarClock className="pending-card-icon" aria-hidden="true" />
          <span>Coordinacion critica</span>
          <strong>Mesa Flores desde 30 Jun</strong>
          <p>Camila informa retorno el 30 de junio, con disponibilidad aproximada de 14:30 a 17:00.</p>
        </aside>
      </div>

      <div className="delay-kpi-strip pending-kpi-strip">
        {pendingSummaryReport.kpis.map(([label, value, help]) => (
          <article className="delay-kpi pending-kpi" key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{help}</p>
          </article>
        ))}
      </div>

      <article className="pending-priority-panel">
        <div className="delay-cause-head">
          <FileWarning aria-hidden="true" />
          <h3>Pendientes prioritarios</h3>
        </div>
        <div className="pending-priority-list">
          {pendingSummaryReport.priorityRows.map((item) => (
            <article className="pending-priority-row" key={`${item.front}-${item.pending}`}>
              <div>
                <span className={`pill ${priorityClass(item.priority)}`}>{item.priority}</span>
                <strong>{item.front}</strong>
              </div>
              <p>{item.pending}</p>
              <small>{item.owner} - {item.status}</small>
              <em>{item.impact}</em>
            </article>
          ))}
        </div>
      </article>

      <div className="pending-front-grid">
        {pendingSummaryReport.fronts.map((front) => (
          <article className={`pending-front-card ${frontClass(front.tone)}`} key={front.title}>
            <div className="pending-front-head">
              <ClipboardList aria-hidden="true" />
              <div>
                <h3>{front.title}</h3>
                <span>{front.status} - {front.owner}</span>
              </div>
            </div>
            <p>{front.summary}</p>
            <ul>
              {front.items.map((item) => <li key={item}>{item}</li>)}
            </ul>
            <strong>{front.next}</strong>
          </article>
        ))}
      </div>

      <div className="pending-action-grid">
        <article className="pending-action-card">
          <div className="delay-cause-head">
            <UsersRound aria-hidden="true" />
            <h3>Compromisos pendientes de Chilfresh</h3>
          </div>
          <ol>
            {pendingSummaryReport.chilfreshActions.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </article>

        <article className="pending-action-card">
          <div className="delay-cause-head">
            <ListChecks aria-hidden="true" />
            <h3>Acciones asociadas de TIBOX</h3>
          </div>
          <ol>
            {pendingSummaryReport.tiboxActions.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </article>
      </div>

      <div className="pending-close-grid">
        <article className="pending-action-card">
          <div className="delay-cause-head">
            <ListChecks aria-hidden="true" />
            <h3>Proximos pasos recomendados</h3>
          </div>
          <div className="pending-next-grid">
            {pendingSummaryReport.nextSteps.map((item) => <p key={item}>{item}</p>)}
          </div>
        </article>

        <article className="pending-action-card">
          <div className="delay-cause-head">
            <Send aria-hidden="true" />
            <h3>Mensaje sugerido de seguimiento</h3>
          </div>
          <ul className="pending-message-list">
            {pendingSummaryReport.followUpMessage.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </article>
      </div>
    </section>
  )
}
