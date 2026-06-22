import { useState } from "react"
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  Flag,
  Home,
  Layers3,
  Moon,
  Route,
  Sun,
  Target,
  UsersRound,
} from "lucide-react"
import chilfreshMark from "../assets/brand/chilfresh-mark.png"
import tiboxMark from "../assets/brand/tibox-mark.png"
import { pendingSummaryReport } from "../data/reportData"

const GESTION_CHILFRESH_URL = "https://gestionchilfresh.tiboxlab.cl/login"

function toneClass(tone) {
  if (tone === "danger") return "tone-danger"
  if (tone === "warn") return "tone-warn"
  return "tone-info"
}

export function PendingDetailPage({ themeMode, onThemeModeChange, onGoHome, onBackToReport }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const slides = pendingSummaryReport.detailSlides
  const slide = slides[activeSlide]
  const relatedPriorities = pendingSummaryReport.priorityRows.filter((item) => slide.fronts.includes(item.front))

  function moveSlide(direction) {
    setActiveSlide((current) => (current + direction + slides.length) % slides.length)
  }

  return (
    <div className="pending-detail-shell">
      <header className="pending-detail-hero" data-reveal>
        <div className="pending-detail-topline">
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

          <div className="pending-detail-actions" aria-label="Navegacion de pendientes">
            <button className="btn" type="button" onClick={onGoHome}>
              <Home className="icon" aria-hidden="true" />
              Inicio
            </button>
            <button className="btn" type="button" onClick={onBackToReport}>
              <ArrowLeft className="icon" aria-hidden="true" />
              Reporte completo
            </button>
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

        <div className="pending-detail-hero-grid">
          <div>
            <div className="hero-eyebrow">Vista interna de seguimiento</div>
            <h1 className="pending-detail-title">Pendientes Chilfresh</h1>
            <p className="lead">{pendingSummaryReport.reading}</p>
            <div className="pending-detail-source">
              <ClipboardList className="icon" aria-hidden="true" />
              Base: {pendingSummaryReport.source} | Corte: {pendingSummaryReport.date}
            </div>
          </div>

          <aside className="pending-detail-callout">
            <CalendarDays aria-hidden="true" />
            <span>Ventana critica</span>
            <strong>30 de junio</strong>
            <p>Mesa Flores puede reactivarse desde el retorno informado, entre 14:30 y 17:00 aprox.</p>
            <a className="btn primary" href={GESTION_CHILFRESH_URL} target="_blank" rel="noopener noreferrer">
              Sistema Chilfresh
              <ArrowRight className="icon" aria-hidden="true" />
            </a>
          </aside>
        </div>
      </header>

      <section className="pending-detail-section" data-reveal>
        <div className="section-head">
          <div>
            <h2>Vista general</h2>
            <p className="section-note">Frentes abiertos, dependencia principal y lectura de ruta critica.</p>
          </div>
        </div>

        <div className="pending-detail-kpis">
          {pendingSummaryReport.kpis.map(([label, value, help]) => (
            <article className="pending-detail-kpi" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{help}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pending-detail-section" data-reveal>
        <div className="section-head">
          <div>
            <h2>Linea de tiempo de pendientes</h2>
            <p className="section-note">Hitos que explican como se consolidaron los pendientes actualmente abiertos.</p>
          </div>
        </div>

        <div className="pending-detail-timeline">
          {pendingSummaryReport.timeline.map((item) => (
            <article className={`pending-timeline-item ${toneClass(item.tone)}`} key={`${item.date}-${item.title}`}>
              <time>{item.date}</time>
              <div>
                <h3>{item.title}</h3>
                <p>{item.summary}</p>
                <span>{item.impact}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="pending-detail-section" data-reveal>
        <div className="section-head">
          <div>
            <h2>Roadmap de abordaje</h2>
            <p className="section-note">Secuencia recomendada para cerrar pendientes sin abrir reprocesos innecesarios.</p>
          </div>
        </div>

        <div className="pending-roadmap-grid">
          {pendingSummaryReport.roadmap.map((item) => (
            <article className="pending-roadmap-card" key={item.stage}>
              <div className="pending-roadmap-stage">
                <Flag aria-hidden="true" />
                <span>Etapa {item.stage}</span>
              </div>
              <h3>{item.title}</h3>
              <div className="pending-roadmap-meta">
                <span>{item.window}</span>
                <span>{item.owner}</span>
              </div>
              <ul>
                {item.actions.map((action) => <li key={action}>{action}</li>)}
              </ul>
              <strong>{item.result}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="pending-detail-section pending-carousel-section" data-reveal>
        <div className="section-head">
          <div>
            <h2>Detalle por pendiente</h2>
            <p className="section-note">Carrusel de frentes abiertos, dependencias y siguiente accion recomendada.</p>
          </div>
          <div className="pending-carousel-count">
            {activeSlide + 1} / {slides.length}
          </div>
        </div>

        <div className="pending-slide-tabs" aria-label="Selector de frente pendiente">
          {slides.map((item, index) => (
            <button
              className={index === activeSlide ? "active" : ""}
              key={item.title}
              type="button"
              onClick={() => setActiveSlide(index)}
            >
              {index + 1}
              <span>{item.title}</span>
            </button>
          ))}
        </div>

        <div className="pending-carousel">
          <button className="pending-carousel-control" type="button" onClick={() => moveSlide(-1)} aria-label="Pendiente anterior">
            <ArrowLeft aria-hidden="true" />
          </button>

          <article className={`pending-slide ${toneClass(slide.tone)}`}>
            <div className="pending-slide-head">
              <div>
                <span className="pending-slide-urgency">{slide.urgency}</span>
                <h3>{slide.title}</h3>
                <p>{slide.status} | {slide.owner}</p>
              </div>
              <Target aria-hidden="true" />
            </div>

            <p className="pending-slide-objective">{slide.objective}</p>

            <div className="pending-slide-columns">
              <div>
                <h4><Layers3 aria-hidden="true" /> Dependencias</h4>
                <ul>
                  {slide.dependencies.map((dependency) => <li key={dependency}>{dependency}</li>)}
                </ul>
              </div>
              <div>
                <h4><UsersRound aria-hidden="true" /> Compromisos</h4>
                <p><strong>Chilfresh:</strong> {slide.chilfresh}</p>
                <p><strong>TIBOX:</strong> {slide.tibox}</p>
              </div>
              <div>
                <h4><CheckCircle2 aria-hidden="true" /> Siguiente accion</h4>
                <p>{slide.next}</p>
                {relatedPriorities.length > 0 && (
                  <ul className="pending-related-list">
                    {relatedPriorities.map((item) => (
                      <li key={`${slide.title}-${item.pending}`}>
                        <strong>{item.priority}</strong>
                        {item.pending}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </article>

          <button className="pending-carousel-control" type="button" onClick={() => moveSlide(1)} aria-label="Pendiente siguiente">
            <ArrowRight aria-hidden="true" />
          </button>
        </div>

        <div className="pending-detail-footer-actions">
          <button className="btn" type="button" onClick={onBackToReport}>
            <Route className="icon" aria-hidden="true" />
            Volver al reporte completo
          </button>
        </div>
      </section>
    </div>
  )
}
