import { kpis, modules, palette } from "../data/reportData"

const clientKpis = [
  {
    label: "Avance global",
    value: "78%",
    tone: "good",
    help: "Avance general actualizado con foco en cierre productivo.",
  },
  {
    label: "Capa operativa",
    value: "Solida",
    tone: "good",
    help: "Base, logistica, bodega y mantenedores muestran alto nivel de consolidacion.",
  },
  {
    label: "Foco pendiente",
    value: "Finanzas",
    tone: "warn",
    help: "El cierre depende de liquidaciones, cuentas corrientes, facturacion e integraciones.",
  },
  {
    label: "Ruta sugerida",
    value: "Piloto",
    tone: "good",
    help: "Se recomienda avanzar con piloto controlado y validacion funcional progresiva.",
  },
]

const clientHiddenModuleNames = new Set([
  "Pruebas Integradas",
  "I+D",
  "Generacion y Listado de logs del sistema",
])

export function SummarySection({ audienceMode }) {
  const isClientView = audienceMode === "client"
  const visibleKpis = isClientView ? clientKpis : kpis
  const moduleSource = isClientView
    ? modules.filter((item) => !clientHiddenModuleNames.has(item.name))
    : modules
  const topModules = [...moduleSource].sort((a, b) => b.progress - a.progress).slice(0, 12)
  const circumference = 2 * Math.PI * 60
  const progress = 0.78

  return (
    <>
      <section className="section" id="resumen" data-reveal>
        <div className="section-head">
          <div>
            <h2>Resumen ejecutivo del informe</h2>
            <p className="section-note">
              {isClientView
                ? "Indicadores ejecutivos para revision con gerencia del cliente."
                : "Indicadores de estado real para complementar la historia del proyecto."}
            </p>
          </div>
        </div>
        <div className="kpi-grid">
          {visibleKpis.map((item) => (
            <article className={`kpi-card ${item.tone === "danger" ? "danger" : item.tone === "warn" ? "warn" : ""}`} key={item.label}>
              <div className="kpi-label">{item.label}</div>
              <div className="kpi-value">{item.value}</div>
              <p className="kpi-help">{item.help}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section" data-reveal>
        <div className="dashboard-grid">
          <article className="panel">
            <div className="panel-title">
              <div>
                <h3>Avance por modulo</h3>
                <p className="section-note">
                  {isClientView
                    ? "Vista ejecutiva por modulo, enfocada en componentes funcionales relevantes para negocio."
                    : "Ordenado por progreso reportado en el tracking del 16-06-2026."}
                </p>
              </div>
            </div>
            <div className="chart-wrap">
              <div className="bar-chart">
                {topModules.map((item) => {
                  const color = item.progress >= 80 ? palette.cyan : item.progress >= 35 ? palette.blue : palette.red
                  return (
                    <div className="bar-item" key={item.name}>
                      <div className="bar-label" title={item.name}>{item.name}</div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${item.progress}%`, background: color }} />
                      </div>
                      <div className="bar-value">{item.display || `${item.progress}%`}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          </article>

          <article className="panel">
            <div className="panel-title">
              <div>
                <h3>Lectura de readiness</h3>
                <p className="section-note">
                  {isClientView
                    ? "El 78% muestra una base relevante construida y un foco claro de cierre financiero."
                    : "El 78% se debe leer junto a la desigualdad entre operacion avanzada y finanzas criticas atrasadas."}
                </p>
              </div>
            </div>
            <div className="donut-area">
              <svg className="donut" viewBox="0 0 160 160" aria-label="Donut de avance">
                <circle cx="80" cy="80" r="60" stroke="rgba(214,242,252,0.12)" strokeWidth="18" fill="none" />
                <circle
                  cx="80"
                  cy="80"
                  r="60"
                  stroke={palette.cyan}
                  strokeWidth="18"
                  fill="none"
                  strokeLinecap="round"
                  transform="rotate(-90 80 80)"
                  strokeDasharray={`${circumference * progress} ${circumference}`}
                />
                <text x="80" y="74" textAnchor="middle" fontSize="28">78%</text>
                <text x="80" y="96" textAnchor="middle" fontSize="11">avance</text>
              </svg>
              <ul className="legend">
                {isClientView ? (
                  <>
                    <li><span className="dot" style={{ background: "var(--green)" }} /><span>Avance global reportado</span><strong>78%</strong></li>
                    <li><span className="dot" style={{ background: "var(--blue)" }} /><span>Capa operativa</span><strong>Consolidada</strong></li>
                    <li><span className="dot" style={{ background: "var(--red)" }} /><span>Foco pendiente</span><strong>Financiero</strong></li>
                    <li><span className="dot" style={{ background: "var(--accent)" }} /><span>Ruta sugerida</span><strong>Piloto</strong></li>
                  </>
                ) : (
                  <>
                    <li><span className="dot" style={{ background: "var(--green)" }} /><span>Avance global reportado</span><strong>78%</strong></li>
                    <li><span className="dot" style={{ background: "var(--red)" }} /><span>Pruebas integradas</span><strong>Sin dato</strong></li>
                    <li><span className="dot" style={{ background: "var(--accent)" }} /><span>Tareas sin duracion determinada</span><strong>25</strong></li>
                    <li><span className="dot" style={{ background: "var(--blue)" }} /><span>Lectura sugerida</span><strong>Avance desigual</strong></li>
                  </>
                )}
              </ul>
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
