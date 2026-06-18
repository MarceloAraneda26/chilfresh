import { risks } from "../data/reportData"

const clientHiddenRisks = new Set([
  "Pruebas integradas sin dato visible",
  "25 tareas sin duracion determinada",
])

const clientRiskCopy = {
  "Logistica 100% con reglas pendientes": [
    "Reglas logisticas pendientes de cierre",
    "Media/Alta",
    "Se debe confirmar propagacion de tarifas, flete y rebate hacia costos y liquidaciones.",
  ],
  "Carga de datos y logs en 0%": [
    "Datos y trazabilidad pendientes",
    "Media",
    "Afecta la preparacion de informacion real, saldos historicos y trazabilidad productiva.",
  ],
}

export function RisksSection({ audienceMode }) {
  const isClientView = audienceMode === "client"
  const visibleRisks = isClientView
    ? risks
      .filter(([name]) => !clientHiddenRisks.has(name))
      .map(([name, severity, comment]) => clientRiskCopy[name] || [name, severity, comment])
    : risks

  return (
    <section className="section" id="riesgos" data-reveal>
      <div className="section-head">
        <div>
          <h2>Riesgos actuales</h2>
          <p className="section-note">
            {isClientView
              ? "Priorizacion ejecutiva basada en impacto sobre cierre financiero y salida productiva."
              : "Priorizacion basada en impacto sobre cierre financiero, pruebas y operacion productiva."}
          </p>
        </div>
      </div>

      <div className="risk-grid">
        <div className="risk-list">
          {visibleRisks.map(([name, severity, comment]) => {
            const cls = severity === "Alta" ? "low" : severity.includes("Alta") ? "mid" : ""
            return (
              <article className="risk-row" key={name}>
                <div className="risk-name">{name}</div>
                <div><span className={`pill ${cls}`}>{severity}</span></div>
                <div className="risk-comment">{comment}</div>
              </article>
            )
          })}
        </div>
        <article className="panel">
          <div className="panel-title">
            <div>
              <h3>Matriz de concentracion</h3>
              <p className="section-note">
                {isClientView
                  ? "La zona critica se concentra en reglas de negocio e integracion financiera."
                  : "La zona critica se concentra en reglas, pruebas e integracion financiera."}
              </p>
            </div>
          </div>
          <div className="matrix" aria-label="Matriz de riesgo">
            {isClientView ? (
              <>
                <div className="matrix-cell">Bajo impacto</div>
                <div className="matrix-cell medium">Reportes por cliente</div>
                <div className="matrix-cell medium">Datos maestros</div>
                <div className="matrix-cell medium">Validacion operativa</div>
                <div className="matrix-cell medium">Softland / SII</div>
                <div className="matrix-cell hot">Liquidaciones</div>
                <div className="matrix-cell medium">Packing List real</div>
                <div className="matrix-cell hot">Cuentas Corrientes</div>
                <div className="matrix-cell hot">Validacion integral</div>
              </>
            ) : (
              <>
                <div className="matrix-cell">Bajo impacto</div>
                <div className="matrix-cell medium">Reportes por cliente</div>
                <div className="matrix-cell medium">Datos maestros</div>
                <div className="matrix-cell medium">Logs / auditoria</div>
                <div className="matrix-cell medium">Softland / SII</div>
                <div className="matrix-cell hot">Liquidaciones</div>
                <div className="matrix-cell medium">Packing List real</div>
                <div className="matrix-cell hot">Cuentas Corrientes</div>
                <div className="matrix-cell hot">Pruebas sin dato</div>
              </>
            )}
          </div>
        </article>
      </div>
    </section>
  )
}
