import { useState } from "react"
import { clientScenarioTimeModel, scenarios } from "../data/reportData"

const scenarioLabels = [
  ["pilot", "Piloto"],
  ["essential", "Esencial"],
  ["full", "Integral"],
]

const clientEstimateLabels = new Map([
  ["QA/UAT y material de apoyo", "Validacion funcional y material de apoyo"],
  ["Datos, logs y UAT", "Datos, trazabilidad y validacion"],
  ["Logs, permisos y carga de datos", "Trazabilidad, permisos y carga de datos"],
  ["Pruebas, capacitacion y marcha blanca", "Validacion, capacitacion y marcha blanca"],
])

const clientScenarioDescriptions = {
  pilot: clientScenarioTimeModel.pilot.description,
  essential: clientScenarioTimeModel.essential.description,
  full: clientScenarioTimeModel.full.description,
}

function getEstimateLabel(label, isClientView) {
  return isClientView ? clientEstimateLabels.get(label) || label : label
}

export function EstimationSection({ audienceMode }) {
  const [active, setActive] = useState("pilot")
  const scenario = scenarios[active]
  const clientScenario = clientScenarioTimeModel[active]
  const isClientView = audienceMode === "client"
  const max = Math.max(...(isClientView ? clientScenario.rows.map((row) => row[3]) : scenario.rows.map((row) => row[2])))

  return (
    <section className="section" id="estimacion" data-reveal>
      <div className="section-head">
        <div>
          <h2>Estimacion actualizada</h2>
          <p className="section-note">
            {isClientView
              ? "Tiempo restante estimado por escenario. La duracion depende de avances, definiciones e insumos entregados por Chilfresh."
              : "Tres escenarios para separar piloto, productivo esencial y cierre integral."}
          </p>
        </div>
        <div className="segmented" aria-label="Selector de escenario">
          {scenarioLabels.map(([key, label]) => (
            <button className={active === key ? "active" : ""} key={key} type="button" onClick={() => setActive(key)}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="estimate-grid">
        <article className="scenario-card">
          <span className={`pill ${active === "full" ? "low" : active === "essential" ? "mid" : "done"}`}>
            {isClientView ? clientScenario.label : scenario.calendar}
          </span>
          <h3>{scenario.title}</h3>
          <div className="scenario-value">{isClientView ? clientScenario.value : scenario.range}</div>
          <p>{isClientView ? clientScenarioDescriptions[active] : scenario.description}</p>
        </article>
        <article className="panel">
          <div className="panel-title">
            <div>
              <h3>{isClientView ? "Tiempo restante por bloque" : "Rangos HH por bloque"}</h3>
              <p className="section-note">
                {isClientView
                  ? "Rangos calendario referenciales, sujetos a disponibilidad de informacion, aprobaciones y validaciones del cliente."
                  : "Los rangos son tecnicos y deben formalizarse si pasan a cotizacion."}
              </p>
            </div>
          </div>
          <div className="stacked-estimate">
            {(isClientView ? clientScenario.rows : scenario.rows).map((row) => {
              const [label, low, high] = row
              const weight = isClientView ? row[3] : high
              const left = isClientView ? 0 : Math.max(0, (low / max) * 100 - 2)
              const width = isClientView ? Math.max(12, (weight / max) * 100) : Math.max(4, ((high - low) / max) * 100)
              return (
                <div className="estimate-row" key={label}>
                  <div className="estimate-label">
                    <strong>{getEstimateLabel(label, isClientView)}</strong>
                    {isClientView && <span>{row[2]}</span>}
                  </div>
                  <div className="range-track">
                    <div className="range-fill" style={{ left: `${left}%`, width: `${width}%` }} />
                  </div>
                  <strong>{isClientView ? low : `${low}-${high}`}</strong>
                </div>
              )
            })}
          </div>
        </article>
      </div>
    </section>
  )
}
