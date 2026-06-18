import { useState } from "react"
import {
  flowerClosingFactors,
  flowerKnownItems,
  flowerLiquidationTypes,
  flowerOpenItems,
  flowerOverview,
  flowerTimeline,
} from "../data/reportData"

function tonePill(tone) {
  if (tone === "pending") return "low"
  if (tone === "definition") return "mid"
  return "done"
}

export function FlowersSection({ audienceMode }) {
  const [selectedIndex, setSelectedIndex] = useState(flowerTimeline.length - 1)
  const selected = flowerTimeline[selectedIndex]
  const isClientView = audienceMode === "client"

  return (
    <section className="section flowers-section" id="flores" data-reveal>
      <div className="section-head">
        <div>
          <h2>Flores: incorporacion y avances</h2>
          <p className="section-note">
            {isClientView
              ? "Lectura ejecutiva del frente Flores, su incorporacion progresiva y los focos necesarios para alinear el flujo con Frutas."
              : "Revision cronologica del frente Flores, desde su entrada posterior al levantamiento hasta las definiciones abiertas actuales."}
          </p>
        </div>
      </div>

      <div className="flowers-overview-grid">
        <article className="panel flowers-intro">
          <span className="pill mid">Contexto inicial</span>
          <h3>Flores no tuvo levantamiento inicial dedicado</h3>
          <p>{flowerOverview.context}</p>
          <p>{flowerOverview.reading}</p>
        </article>

        <div className="flower-metric-list" aria-label="Indicadores del frente Flores">
          <div className="flower-metric">
            <span>Estado</span>
            <strong>{flowerOverview.status}</strong>
          </div>
          <div className="flower-metric">
            <span>Avance estimado</span>
            <strong>{flowerOverview.progress}</strong>
          </div>
          <div className="flower-metric alert">
            <span>Riesgo</span>
            <strong>{flowerOverview.risk}</strong>
          </div>
        </div>
      </div>

      <div className="flowers-layout">
        <article className="panel flowers-timeline-panel">
          <div className="panel-title">
            <div>
              <h3>Cronologia de incorporacion</h3>
              <p className="section-note">Selecciona un hito para revisar su impacto y evidencia funcional.</p>
            </div>
          </div>
          <div className="flower-rail">
            {flowerTimeline.map((item, index) => (
              <button
                className={`flower-step ${selectedIndex === index ? "active" : ""} ${item.tone}`}
                key={`${item.date}-${item.title}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
              >
                <time>{item.date}</time>
                <span>
                  <strong>{item.title}</strong>
                  <span>{item.summary}</span>
                </span>
                <span className={`pill ${tonePill(item.tone)}`}>{item.kind}</span>
              </button>
            ))}
          </div>
        </article>

        <aside className="panel flowers-detail" aria-live="polite">
          <span className={`pill ${tonePill(selected.tone)}`}>{selected.kind}</span>
          <h3>{selected.title}</h3>
          <p>{selected.summary}</p>
          <div className="detail-meta">
            <span className="tag">{selected.date}</span>
            <span className="tag">{selected.tone === "pending" ? "Por cerrar" : "Avance trazado"}</span>
          </div>
          <div className="detail-box">
            <h4>Evidencia funcional</h4>
            <ul>
              {selected.evidence.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        </aside>
      </div>

      <div className="detail-grid flowers-detail-grid">
        <div className="detail-box">
          <h4>Lo que ya esta claro</h4>
          <ul>{flowerKnownItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="detail-box">
          <h4>Definiciones abiertas</h4>
          <ul>{flowerOpenItems.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>

      <div className="flowers-bottom-grid">
        <article className="panel">
          <div className="panel-title">
            <div>
              <h3>Tres liquidaciones por definir</h3>
              <p className="section-note">Flores agrega una complejidad distinta a Frutas: no basta una sola lectura de liquidacion.</p>
            </div>
          </div>
          <div className="flower-liquidation-grid">
            {flowerLiquidationTypes.map(([title, text]) => (
              <div className="flower-liquidation" key={title}>
                <strong>{title}</strong>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-title">
            <div>
              <h3>Proximos pasos recomendados</h3>
              <p className="section-note">El siguiente hito critico es una mesa exclusiva de Flores para revalidar operacion, datos y reglas financieras.</p>
            </div>
          </div>
          <ol className="flower-close-list">
            {flowerClosingFactors.map((item) => <li key={item}>{item}</li>)}
          </ol>
        </article>
      </div>
    </section>
  )
}
