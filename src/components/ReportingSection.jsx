import { useMemo, useState } from "react"
import { reportingAreas, reportingModules } from "../data/reportData"

const chartTabs = [
  ["criticality", "Criticidad"],
  ["effort", "Esfuerzo"],
  ["areas", "Areas"],
  ["indicators", "Indicadores"],
]

const areaColors = {
  TIBOX: "#0E9BDB",
  Finanzas: "#CE3F5E",
  Logistica: "#FF7900",
  Operaciones: "#00910A",
  Comercial: "#C0C700",
  Flores: "#8CC76A",
  "Datos/Integraciones": "#6B4DBA",
}

const clientHiddenModuleNames = new Set([
  "Pruebas Integradas",
  "I+D",
  "Generacion y Listado de logs del sistema",
])

function criticalityLabel(value) {
  if (value >= 85) return "Critico"
  if (value >= 70) return "Alto"
  if (value >= 50) return "Medio"
  return "Controlado"
}

function formatPercent(value) {
  return `${Math.round(value)}%`
}

function moduleTimeEstimate(effort) {
  const months = effort / 180
  if (months < 0.5) return "2 a 3 sem."
  if (months < 0.75) return "3 a 4 sem."
  if (months < 1) return "3 a 5 sem."
  const low = Math.max(1, months * 0.85)
  const high = months * 1.15
  return `${low.toLocaleString("es-CL", { maximumFractionDigits: 1 })} a ${high.toLocaleString("es-CL", { maximumFractionDigits: 1 })} meses`
}

function shortModuleName(name) {
  const replacements = {
    "Facturacion y Documentos Internos": "Facturacion",
    "Packing List y Confirmacion": "PL/SC",
    "Contratos y Acuerdos Comerciales": "Contratos",
    "Cuentas Corrientes": "Ctas. Corrientes",
    "Pruebas Integradas": "Pruebas",
    "Integracion Flores": "Flores",
  }
  return replacements[name] || name
}

function sortBy(key, items) {
  return [...items].sort((a, b) => b[key] - a[key])
}

function BarRanking({ items, metric, suffix = "", maxValue, tone = "blue", valueFormatter }) {
  const max = maxValue || Math.max(...items.map((item) => item[metric]), 1)
  return (
    <div className="report-bar-list">
      {items.map((item) => {
        const value = item[metric]
        return (
          <div className="report-bar-row" key={item.name}>
            <div className="report-bar-label">
              <strong>{item.name}</strong>
              <span>{item.category}</span>
            </div>
            <div className="report-bar-track">
              <div
                className={`report-bar-fill ${tone}`}
                style={{ width: `${Math.max(3, (value / max) * 100)}%` }}
              />
            </div>
            <div className="report-bar-value">{valueFormatter ? valueFormatter(item, value) : `${value}${suffix}`}</div>
          </div>
        )
      })}
    </div>
  )
}

function CriticalityChart({ modules }) {
  const top = sortBy("criticality", modules).slice(0, 10)

  return (
    <div className="report-chart-grid">
      <article className="panel report-main-chart">
        <div className="panel-title">
          <div>
            <h3>Criticidad por modulo</h3>
            <p className="section-note">Indice 0-100 combinando avance, dependencia funcional, definiciones pendientes e impacto de cierre.</p>
          </div>
        </div>
        <BarRanking items={top} metric="criticality" suffix="%" tone="red" />
      </article>
      <article className="panel report-side-chart">
        <h3>Mapa avance vs criticidad</h3>
        <p className="section-note">Arriba y a la izquierda se concentran los frentes mas delicados.</p>
        <svg className="report-scatter" viewBox="0 0 420 270" role="img" aria-label="Mapa de avance contra criticidad">
          <line x1="44" y1="222" x2="390" y2="222" />
          <line x1="44" y1="24" x2="44" y2="222" />
          <text x="44" y="250">0% avance</text>
          <text x="326" y="250">100%</text>
          <text x="4" y="34">Alta</text>
          <text x="4" y="218">Baja</text>
          {modules.map((item) => {
            const x = 44 + item.progress * 3.46
            const y = 222 - item.criticality * 1.98
            const radius = Math.max(5, Math.min(16, item.effort / 18))
            return (
              <g key={item.name}>
                <circle
                  cx={x}
                  cy={y}
                  r={radius}
                  className={item.criticality >= 80 ? "hot" : item.criticality >= 60 ? "warm" : ""}
                />
                {item.criticality >= 78 && (
                  <text x={Math.min(x + 9, 322)} y={y - 8}>{shortModuleName(item.name)}</text>
                )}
              </g>
            )
          })}
        </svg>
      </article>
    </div>
  )
}

function EffortChart({ isClientView, modules }) {
  const top = sortBy("effort", modules).slice(0, 12)
  const total = modules.reduce((sum, item) => sum + item.effort, 0)
  const topTime = moduleTimeEstimate(top[0].effort)

  return (
    <div className="report-chart-grid">
      <article className="panel report-main-chart">
        <div className="panel-title">
          <div>
            <h3>{isClientView ? "Tiempo estimado por modulo" : "Esfuerzo por modulo"}</h3>
            <p className="section-note">
              {isClientView
                ? "Rangos calendario referenciales. Dependen de avance real, definiciones, datos y validaciones del cliente."
                : "HH referenciales de continuidad. No corresponden a timesheet historico."}
            </p>
          </div>
        </div>
        <BarRanking
          items={top}
          metric="effort"
          suffix=" HH"
          tone="green"
          valueFormatter={isClientView ? (item) => moduleTimeEstimate(item.effort) : undefined}
        />
      </article>
      <article className="panel report-side-chart">
        <h3>{isClientView ? "Condicion del mayor bloque" : "Distribucion del esfuerzo"}</h3>
        <div className="effort-ring" style={{ "--progress": `${Math.min(100, (top[0].effort / total) * 100)}%` }}>
          <strong>{isClientView ? topTime : `${top[0].effort} HH`}</strong>
          <span>{top[0].name}</span>
        </div>
        <p className="section-note">
          {isClientView
            ? "Este plazo supone insumos disponibles, responsables asignados y validaciones funcionales oportunas."
            : `El mayor bloque individual representa ${formatPercent((top[0].effort / total) * 100)} del esfuerzo referencial visible.`}
        </p>
        <div className="report-mini-list">
          {top.slice(0, 4).map((item) => (
            <div key={item.name}>
              <span>{item.name}</span>
              <strong>{isClientView ? moduleTimeEstimate(item.effort) : formatPercent((item.effort / total) * 100)}</strong>
            </div>
          ))}
        </div>
      </article>
    </div>
  )
}

function AreasChart({ modules }) {
  const visible = sortBy("criticality", modules).slice(0, 10)
  const totals = reportingAreas.map((area) => ({
    area,
    value: modules.reduce((sum, item) => sum + (item.areas[area] || 0) * item.effort, 0),
  }))
  const totalWeight = totals.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className="report-chart-grid">
      <article className="panel report-main-chart">
        <div className="panel-title">
          <div>
            <h3>Participacion de areas por modulo</h3>
            <p className="section-note">Distribucion relativa de participacion necesaria para construir, validar y cerrar cada modulo.</p>
          </div>
        </div>
        <div className="area-stack-list">
          {visible.map((item) => (
            <div className="area-stack-row" key={item.name}>
              <div className="area-stack-name">{item.name}</div>
              <div className="area-stack-track">
                {reportingAreas.map((area) => {
                  const value = item.areas[area] || 0
                  if (!value) return null
                  return (
                    <span
                      key={area}
                      title={`${area}: ${value}%`}
                      style={{ width: `${value}%`, background: areaColors[area] }}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </article>
      <article className="panel report-side-chart">
        <h3>Peso total por area</h3>
        <div className="area-legend">
          {totals
            .sort((a, b) => b.value - a.value)
            .map(({ area, value }) => (
              <div key={area}>
                <span className="dot" style={{ background: areaColors[area] }} />
                <span>{area}</span>
                <strong>{formatPercent((value / totalWeight) * 100)}</strong>
              </div>
            ))}
        </div>
      </article>
    </div>
  )
}

function IndicatorsChart({ isClientView, modules }) {
  const avgProgress = modules.reduce((sum, item) => sum + item.progress, 0) / modules.length
  const avgCriticality = modules.reduce((sum, item) => sum + item.criticality, 0) / modules.length
  const totalEffort = modules.reduce((sum, item) => sum + item.effort, 0)
  const highCritical = modules.filter((item) => item.criticality >= 70).length
  const financialFocus = modules.filter((item) => /Financiero|Comercial financiero|Flores/.test(item.category)).length

  const indicators = [
    ["Avance promedio", formatPercent(avgProgress), "Promedio simple de modulos visibles"],
    ["Criticidad media", formatPercent(avgCriticality), "Indice agregado de riesgo funcional"],
    isClientView
      ? ["Gran hito", "2 a 3 meses", "Piloto operativo controlado, sujeto a insumos y validaciones disponibles"]
      : ["Esfuerzo total ref.", `${totalEffort} HH`, "Continuidad estimada por modulo"],
    ["Criticos/altos", String(highCritical), "Modulos con criticidad sobre 70"],
    ["Foco financiero", String(financialFocus), "Modulos con dependencia financiera o comercial"],
  ]

  return (
    <div className="report-indicator-grid">
      {indicators.map(([label, value, help]) => (
        <article className="report-indicator" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <p>{help}</p>
        </article>
      ))}
      <article className="panel report-readiness-panel">
        <div className="panel-title">
          <div>
            <h3>Readiness por modulo</h3>
            <p className="section-note">Readiness = 100 - criticidad. Ayuda a separar avance construido de cierre real.</p>
          </div>
        </div>
        <BarRanking items={sortBy("readiness", modules).slice(0, 8)} metric="readiness" suffix="%" tone="blue" maxValue={100} />
      </article>
    </div>
  )
}

export function ReportingSection({ audienceMode }) {
  const [activeChart, setActiveChart] = useState("criticality")
  const isClientView = audienceMode === "client"

  const visibleModules = useMemo(
    () => (isClientView
      ? reportingModules.filter((item) => !clientHiddenModuleNames.has(item.name))
      : reportingModules),
    [isClientView],
  )

  const sortedCritical = sortBy("criticality", visibleModules)
  const topCritical = sortedCritical[0]

  return (
    <section className="section reporting-section" id="reporteria" data-reveal>
      <div className="section-head">
        <div>
          <h2>Reporteria</h2>
          <p className="section-note">
            {isClientView
              ? "Graficos para analizar criticidad, tiempo restante estimado, participacion de areas e indicadores de cierre por modulo."
              : "Graficos para analizar criticidad, esfuerzo referencial, participacion de areas e indicadores de cierre por modulo."}
          </p>
        </div>
        <div className="segmented" aria-label="Selector de grafico de reportería">
          {chartTabs.map(([key, label]) => (
            <button className={activeChart === key ? "active" : ""} key={key} type="button" onClick={() => setActiveChart(key)}>
              {isClientView && key === "effort" ? "Tiempo" : label}
            </button>
          ))}
        </div>
      </div>

      <div className="report-kpi-strip">
        <div className="report-kpi">
          <span>Mayor criticidad</span>
          <strong>{topCritical.name}</strong>
          <small>{topCritical.criticality}% - {criticalityLabel(topCritical.criticality)}</small>
        </div>
        <div className="report-kpi">
          <span>{isClientView ? "Mayor tiempo estimado" : "Mayor esfuerzo"}</span>
          <strong>{sortBy("effort", visibleModules)[0].name}</strong>
          <small>
            {isClientView
              ? `${moduleTimeEstimate(sortBy("effort", visibleModules)[0].effort)} sujeto a insumos`
              : `${sortBy("effort", visibleModules)[0].effort} HH ref.`}
          </small>
        </div>
        <div className="report-kpi">
          <span>Modulos visibles</span>
          <strong>{visibleModules.length}</strong>
          <small>{isClientView ? "Vista cliente filtrada" : "Vista interna completa"}</small>
        </div>
      </div>

      {activeChart === "criticality" && <CriticalityChart modules={visibleModules} />}
      {activeChart === "effort" && <EffortChart isClientView={isClientView} modules={visibleModules} />}
      {activeChart === "areas" && <AreasChart modules={visibleModules} />}
      {activeChart === "indicators" && <IndicatorsChart isClientView={isClientView} modules={visibleModules} />}
    </section>
  )
}
