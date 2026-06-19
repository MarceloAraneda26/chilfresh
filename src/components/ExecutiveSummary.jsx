import { AlertTriangle, ArrowRight, BarChart3, CheckCircle2, Eye, Home, Leaf, Moon, Settings2, Sun } from "lucide-react"
import chilfreshMark from "../assets/brand/chilfresh-mark.png"
import tiboxMark from "../assets/brand/tibox-mark.png"
import {
  clientScenarioTimeModel,
  evidenceCards,
  flowerOverview,
  modules,
  projectMilestones,
} from "../data/reportData"

const executiveMilestoneIds = [
  "h-assessment",
  "h-2026-01-29",
  "h-2026-03-31",
  "h-2026-06-09",
  "h-2026-06-16",
  "h-pend-liq",
]

const criticalModuleNames = [
  "Cuentas Corrientes",
  "Liquidaciones",
  "Facturacion y Documentos Internos",
  "Contratos y Acuerdos Comerciales",
]

function getModule(name) {
  return modules.find((item) => item.name === name)
}

export function ExecutiveSummary({ themeMode, onThemeModeChange, onOpenReport, onGoHome }) {
  const executiveMilestones = executiveMilestoneIds
    .map((id) => projectMilestones.find((item) => item.id === id))
    .filter(Boolean)
  const solidModules = modules.filter((item) => item.progress >= 85)
  const criticalModules = criticalModuleNames.map(getModule).filter(Boolean)
  const pilotEstimate = clientScenarioTimeModel.pilot.value

  return (
    <div className="executive-shell">
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

            <div className="toolbar-group versions">
              <span className="action-label">Versiones</span>
              <div className="executive-version-actions">
                <button className="btn" type="button" onClick={onGoHome}>
                  <Home className="icon" aria-hidden="true" />
                  Inicio
                </button>
                <button className="btn primary" type="button" onClick={() => onOpenReport("client")}>
                  <Eye className="icon" aria-hidden="true" />
                  Cliente
                  <ArrowRight className="icon" aria-hidden="true" />
                </button>
                <button className="btn" type="button" onClick={() => onOpenReport("internal")}>
                  <Settings2 className="icon" aria-hidden="true" />
                  Interna
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="executive-hero-grid">
          <div>
            <div className="hero-eyebrow">Resumen ejecutivo</div>
            <h1 className="executive-title">Estado del proyecto Chilfresh</h1>
            <p className="lead">
              Sintesis ejecutiva del assessment, avance real, riesgos de cierre y ruta recomendada.
              El proyecto presenta una base operativa solida, con el mayor foco pendiente en definiciones
              financieras, homologacion Frutas/Flores e integraciones de cierre.
            </p>
          </div>

          <div className="executive-readout" aria-label="Indicadores principales del resumen">
            <div>
              <span>Avance global</span>
              <strong>78%</strong>
            </div>
            <div>
              <span>Capa operativa</span>
              <strong>Solida</strong>
            </div>
            <div>
              <span>Flores</span>
              <strong>{flowerOverview.progress}</strong>
            </div>
            <div>
              <span>Primer horizonte</span>
              <strong>{pilotEstimate}</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="executive-grid" data-reveal>
        <article className="executive-panel executive-main-reading">
          <div className="panel-title">
            <div>
              <h2>Lectura central</h2>
              <p className="section-note">Lo esencial del estado actual, separado de los detalles operativos.</p>
            </div>
          </div>
          <p>
            El proyecto no esta detenido: existe una plataforma con base tecnica y operativa real. La capa
            de ordenes, instructivos, logistica, bodega y Packing List muestra avance alto; Flores cuenta con
            base funcional implementada, pero aun requiere revalidacion especifica. El tramo
            pendiente es menor en volumen, pero mayor en complejidad: liquidaciones, cuentas corrientes,
            facturacion, Softland/SII, datos reales y validacion transversal.
          </p>
          <div className="executive-verdict">
            <CheckCircle2 className="icon" aria-hidden="true" />
            <span>Recomendacion: avanzar con piloto controlado y cerrar definiciones financieras por prioridad.</span>
          </div>
        </article>

        <article className="executive-panel">
          <div className="executive-panel-icon good">
            <BarChart3 className="icon" aria-hidden="true" />
          </div>
          <h3>Modulos solidos</h3>
          <strong>{solidModules.length}</strong>
          <p>Base, logistica, bodega, mantenedores, finanzas general y produccion sostienen la plataforma operativa.</p>
        </article>

        <article className="executive-panel">
          <div className="executive-panel-icon warn">
            <AlertTriangle className="icon" aria-hidden="true" />
          </div>
          <h3>Foco de cierre</h3>
          <strong>Finanzas</strong>
          <p>Liquidaciones, cuentas corrientes, facturacion, acuerdos, datos reales e integraciones concentran el riesgo.</p>
        </article>

        <article className="executive-panel">
          <div className="executive-panel-icon good">
            <Leaf className="icon" aria-hidden="true" />
          </div>
          <h3>Flores</h3>
          <strong>{flowerOverview.status}</strong>
          <p>{flowerOverview.reading}</p>
        </article>
      </section>

      <section className="executive-split" data-reveal>
        <article className="executive-panel">
          <div className="panel-title">
            <div>
              <h2>Hitos relevantes</h2>
              <p className="section-note">Linea ejecutiva desde levantamiento hasta lo pendiente.</p>
            </div>
          </div>
          <div className="executive-timeline">
            {executiveMilestones.map((item) => (
              <div className={`executive-timeline-item ${item.tone}`} key={item.id}>
                <time>{item.date}</time>
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="executive-panel">
          <div className="panel-title">
            <div>
              <h2>Modulos criticos</h2>
              <p className="section-note">Donde el avance restante tiene mas peso funcional.</p>
            </div>
          </div>
          <div className="executive-module-list">
            {criticalModules.map((item) => (
              <div className="executive-module-row" key={item.name}>
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.status}</span>
                </div>
                <div className="executive-progress" aria-label={`${item.name}: ${item.progress}%`}>
                  <span style={{ width: `${item.progress}%` }} />
                </div>
                <strong>{item.progress}%</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="executive-split compact" data-reveal>
        <article className="executive-panel">
          <div className="panel-title">
            <div>
              <h2>Evidencia</h2>
              <p className="section-note">Tres mensajes que resumen el assessment documental.</p>
            </div>
          </div>
          <div className="executive-evidence-list">
            {evidenceCards.map((item) => (
              <div className="executive-evidence" key={item.title}>
                <strong>{item.title}</strong>
                <p>{item.text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="executive-panel executive-next">
          <div className="panel-title">
            <div>
              <h2>Siguiente decision</h2>
              <p className="section-note">Camino recomendado para gerencia y equipo de proyecto.</p>
            </div>
          </div>
          <ol>
            <li>Validar piloto operativo controlado con PL/SC, facturacion/proforma y casos reales.</li>
            <li>Cerrar reglas de liquidaciones, cuentas corrientes, Softland/SII y homologacion Frutas/Flores.</li>
            <li>Definir responsables Chilfresh para datos, validaciones funcionales y aprobaciones de negocio.</li>
            <li>Priorizar futuras implementaciones en horizontes corto, mediano y largo plazo.</li>
          </ol>
          <div className="executive-actions inline">
            <button className="btn primary" type="button" onClick={() => onOpenReport("client")}>Ver cliente</button>
            <button className="btn" type="button" onClick={() => onOpenReport("internal")}>Ver interna</button>
          </div>
        </article>
      </section>
    </div>
  )
}
