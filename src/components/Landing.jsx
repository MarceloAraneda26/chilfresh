import { ArrowRight, ArrowUpRight, BarChart3, ClipboardList, Eye, KeyRound, Moon, Settings2, Sun } from "lucide-react"
import chilfreshMark from "../assets/brand/chilfresh-mark.png"
import tiboxMark from "../assets/brand/tibox-mark.png"
import { projectMilestones } from "../data/reportData"

const timelinePreviewIds = ["h-assessment", "h-2026-01-29", "h-2026-03-31", "h-2026-06-09", "h-2026-06-16", "h-pend-liq"]

const GESTION_CHILFRESH_URL = "https://gestionchilfresh.tiboxlab.cl/login"

export function Landing({ themeMode, onThemeModeChange, onOpenReport, onOpenExecutiveSummary, onOpenPendingDetail }) {
  const timelinePreview = timelinePreviewIds
    .map((id) => projectMilestones.find((item) => item.id === id))
    .filter(Boolean)

  return (
    <div className="executive-shell landing-shell">
      <section className="executive-hero" data-reveal>
        <div className="executive-topline">
          <div className="brand-zone executive-brand-zone">
            <div className="project-brand-lockup" aria-label="Participantes del proyecto">
              <article className="project-brand-card tibox">
                <img src={tiboxMark} alt="Logo TIBOX" />
                <div>
                  <span>Equipo de desarrollo y liderazgo</span>
                  <strong>TIBOX</strong>
                </div>
              </article>
              <article className="project-brand-card chilfresh">
                <img src={chilfreshMark} alt="Logo Chilfresh" />
                <div>
                  <span>Cliente</span>
                  <strong>Chilfresh</strong>
                </div>
              </article>
            </div>
          </div>

          <div className="executive-toolbar" aria-label="Controles principales">
            <div className="toolbar-group">
              <span className="action-label">Tema</span>
              <div className="audience-toggle theme-toggle" aria-label="Selector de tema de la pagina">
                <button
                  className={themeMode === "dark" ? "active" : ""}
                  type="button"
                  onClick={() => onThemeModeChange("dark")}
                >
                  <Moon className="icon" aria-hidden="true" />
                  Oscura
                </button>
                <button
                  className={themeMode === "light" ? "active" : ""}
                  type="button"
                  onClick={() => onThemeModeChange("light")}
                >
                  <Sun className="icon" aria-hidden="true" />
                  Clara
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="landing-hero-copy">
          <div className="hero-eyebrow">Portal del proyecto</div>
          <h1 className="executive-title">Reporte Chilfresh</h1>
          <p className="lead">
            Elige la version del reporte que necesitas revisar. Cada vista esta preparada para su
            publico: seguimiento interno de TIBOX, lectura ejecutiva para Chilfresh, o una sintesis
            de una pagina para decisiones rapidas.
          </p>
        </div>
      </section>

      <section className="landing-options" data-reveal aria-label="Versiones disponibles del reporte">
        <button type="button" className="landing-option-card internal" onClick={() => onOpenReport("internal")}>
          <div className="landing-option-icon">
            <Settings2 className="icon" aria-hidden="true" />
          </div>
          <h2>Version interna TIBOX</h2>
          <p>Vista completa de equipo: hitos, modulos, tareas sin duracion, riesgos y minutas con el detalle operativo del desarrollo.</p>
          <span className="landing-option-cta">
            Entrar a la version interna
            <ArrowRight className="icon" aria-hidden="true" />
          </span>
        </button>

        <button type="button" className="landing-option-card client" onClick={() => onOpenReport("client")}>
          <div className="landing-option-icon">
            <Eye className="icon" aria-hidden="true" />
          </div>
          <h2>Version para cliente</h2>
          <p>Reporte curado para Chilfresh: avance, hitos relevantes, riesgos de cierre y ruta recomendada, sin el detalle interno de equipo.</p>
          <span className="landing-option-cta">
            Entrar a la version cliente
            <ArrowRight className="icon" aria-hidden="true" />
          </span>
        </button>

        <button type="button" className="landing-option-card executive" onClick={onOpenExecutiveSummary}>
          <div className="landing-option-icon">
            <BarChart3 className="icon" aria-hidden="true" />
          </div>
          <h2>Version resumen ejecutivo</h2>
          <p>Sintesis de una pagina con el estado global, modulos criticos, evidencia del assessment y la siguiente decision a tomar.</p>
          <span className="landing-option-cta">
            Ver resumen ejecutivo
            <ArrowRight className="icon" aria-hidden="true" />
          </span>
        </button>
      </section>

      <section className="executive-split" data-reveal>
        <article className="executive-panel">
          <div className="panel-title">
            <div>
              <h2>Resumen de la linea de tiempo</h2>
              <p className="section-note">Hitos principales desde el levantamiento hasta lo pendiente.</p>
            </div>
          </div>
          <div className="executive-timeline">
            {timelinePreview.map((item) => (
              <div className={`executive-timeline-item ${item.tone}`} key={item.id}>
                <time>{item.date}</time>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="executive-actions inline">
            <button className="btn" type="button" onClick={() => onOpenReport("internal")}>
              Ver linea de tiempo completa
              <ArrowRight className="icon" aria-hidden="true" />
            </button>
            <button className="btn ppt-download" type="button" onClick={onOpenPendingDetail}>
              <ClipboardList className="icon" aria-hidden="true" />
              Revisar pendientes
            </button>
          </div>
        </article>

        <article className="executive-panel landing-access-panel">
          <div className="panel-title">
            <div>
              <h2>Acceso al sistema</h2>
              <p className="section-note">Ingreso directo a la plataforma de gestion Chilfresh en produccion.</p>
            </div>
          </div>
          <a
            className="landing-access-link"
            href={GESTION_CHILFRESH_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="landing-access-icon">
              <KeyRound className="icon" aria-hidden="true" />
            </div>
            <div className="landing-access-text">
              <strong>Sistema de Gestion Chilfresh</strong>
              <span>gestionchilfresh.tiboxlab.cl/login</span>
            </div>
            <ArrowUpRight className="icon landing-access-arrow" aria-hidden="true" />
          </a>
        </article>
      </section>
    </div>
  )
}
