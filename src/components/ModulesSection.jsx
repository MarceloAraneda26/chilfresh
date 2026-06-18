import { useMemo, useState } from "react"
import { modules, palette } from "../data/reportData"
import { includesQuery, statusClass } from "../utils"

const filters = [
  ["all", "Todos"],
  ["done", "Avanzados"],
  ["mid", "En progreso"],
  ["low", "Criticos"],
]

const clientHiddenModuleNames = new Set([
  "Pruebas Integradas",
  "I+D",
  "Generacion y Listado de logs del sistema",
])

const clientModuleCopy = {
  "Logistica y Transporte": {
    reading: "Desarrollo tecnico base consolidado. El cierre funcional depende de validar reglas de tarifas, flete y rebate conectadas al flujo financiero.",
    pending: ["Cerrar reglas de tarifas, flete y rebate.", "Validar propagacion hacia costos y liquidaciones.", "Confirmar flujo con casos reales."],
  },
  "Carga de datos": {
    reading: "Frente pendiente asociado a calidad de datos, saldos historicos y preparacion de informacion real para operacion.",
    pending: ["Cargas iniciales.", "Homologacion.", "Depuracion de duplicidades.", "Validacion por areas."],
  },
}

function getClientModule(item) {
  if (!clientModuleCopy[item.name]) return item
  return { ...item, ...clientModuleCopy[item.name] }
}

export function ModulesSection({ audienceMode }) {
  const [filter, setFilter] = useState("all")
  const [query, setQuery] = useState("")
  const [selectedName, setSelectedName] = useState(modules[0].name)
  const isClientView = audienceMode === "client"
  const sourceModules = useMemo(
    () => (isClientView
      ? modules.filter((item) => !clientHiddenModuleNames.has(item.name)).map(getClientModule)
      : modules),
    [isClientView],
  )

  const filtered = useMemo(
    () => sourceModules.filter((item) => {
      const matchesFilter = filter === "all" || item.group === filter
      return matchesFilter && includesQuery([item.name, item.status, item.reading, ...item.pending], query)
    }),
    [filter, query, sourceModules],
  )

  const selected = filtered.find((item) => item.name === selectedName) || filtered[0] || sourceModules[0]

  return (
    <section className="section" id="modulos" data-reveal>
      <div className="section-head">
        <div>
          <h2>{isClientView ? "Modulos y estado ejecutivo" : "Modulos y estado real"}</h2>
          <p className="section-note">
            {isClientView
              ? "Vista filtrada para cliente: prioriza componentes funcionales, avance de negocio y pendientes de cierre."
              : "Filtra por estado o busca un modulo. Al seleccionar una fila se actualiza el detalle funcional."}
          </p>
        </div>
        <div className="filters">
          <input
            className="search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={isClientView ? "Buscar componente..." : "Buscar modulo..."}
            aria-label="Buscar modulo"
          />
          <div className="segmented" aria-label="Filtro de modulos">
            {filters.map(([key, label]) => (
              <button className={filter === key ? "active" : ""} key={key} type="button" onClick={() => setFilter(key)}>
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="module-list">
          {filtered.length === 0 ? (
            <div className="panel">No hay modulos que coincidan con el filtro.</div>
          ) : (
            filtered.map((item) => {
              const css = statusClass(item.progress)
              const color = css === "done" ? palette.cyan : css === "mid" ? palette.blue : palette.red
              return (
                <button
                  className={`module-row ${selected.name === item.name ? "selected" : ""}`}
                  key={item.name}
                  type="button"
                  onClick={() => setSelectedName(item.name)}
                >
                  <div className="module-name">{item.name}</div>
                  <div className="module-status"><span className={`pill ${css}`}>{item.status}</span></div>
                  <div className="mini-track"><div className="mini-fill" style={{ width: `${item.progress}%`, background: color }} /></div>
                  <div className="module-progress">{item.display || `${item.progress}%`}</div>
                </button>
              )
            })
          )}
        </div>

        <article className="panel">
          <div className="panel-title">
            <div>
              <h3>{selected.name}</h3>
              <p className="section-note">
                {isClientView
                  ? `${selected.status} - avance informado ${selected.display || `${selected.progress}%`}`
                  : selected.display ? `${selected.status}: ${selected.display} en tracking` : `${selected.status} - ${selected.progress}% de avance reportado`}
              </p>
            </div>
          </div>
          <div className="detail-grid">
            <div className="detail-box">
              <h4>Lectura real</h4>
              <p>{selected.reading}</p>
            </div>
            <div className="detail-box">
              <h4>{isClientView ? "Focos de cierre" : "Pendientes principales"}</h4>
              <ul>
                {selected.pending.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          </div>
        </article>
      </div>
    </section>
  )
}
