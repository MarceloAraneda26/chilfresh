import { mkdir, readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import {
  evidenceCards,
  findings,
  kpis,
  minuteConsolidated,
  minuteSummaries,
  modules,
  projectMilestones,
  projectStages,
  risks,
  scenarios,
} from "../src/data/reportData.js"

const __dirname = dirname(fileURLToPath(import.meta.url))
const projectRoot = resolve(__dirname, "..")
const workspaceRoot = resolve(projectRoot, "..")
const tmpDir = resolve(workspaceRoot, "tmp", "pdfs")
const outputHtml = resolve(tmpDir, "reporte_chilfresh_pdf.html")
const brandAssetsDir = resolve(projectRoot, "src", "assets", "brand")

async function imageDataUri(filename) {
  const buffer = await readFile(resolve(brandAssetsDir, filename))
  return `data:image/png;base64,${buffer.toString("base64")}`
}

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
}

function list(items) {
  return `<ul>${items.map((item) => `<li>${esc(item)}</li>`).join("")}</ul>`
}

function progressColor(value) {
  if (value >= 80) return "#0E9BDB"
  if (value >= 35) return "#0884D6"
  return "#CE3F5E"
}

function progressBar(value) {
  const width = value === 0 ? 0 : Math.max(value, 3)
  return `
    <div class="bar-track">
      <span class="bar-fill" style="width:${width}%; background:${progressColor(value)}"></span>
    </div>
  `
}

function groupedMilestones() {
  return projectStages.map((stage) => {
    const events = projectMilestones.filter((item) => item.stage === stage.key)
    return `
      <section class="stage-block">
        <div class="stage-title">
          <strong>${esc(stage.title)}</strong>
          <span>${esc(stage.range)}</span>
        </div>
        <div class="stage-events">
          ${events.map((item) => `
            <article class="timeline-card ${item.tone}">
              <div class="timeline-meta">
                <time>${esc(item.date)}</time>
                <span>${esc(item.kind)}</span>
              </div>
              <div>
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.summary)}</p>
                <div class="impact"><strong>Impacto:</strong> ${esc(item.impact)}</div>
              </div>
            </article>
          `).join("")}
        </div>
      </section>
    `
  }).join("")
}

function modulesTable() {
  return modules.map((item) => `
    <tr>
      <td>
        <strong>${esc(item.name)}</strong>
        <small>${esc(item.reading)}</small>
      </td>
      <td class="status">${esc(item.status)}</td>
      <td class="progress-cell">
        ${progressBar(item.progress)}
        <span>${esc(item.display || `${item.progress}%`)}</span>
      </td>
    </tr>
  `).join("")
}

function scenarioCards() {
  return Object.values(scenarios).map((scenario) => `
    <article class="scenario">
      <div class="scenario-head">
        <span>${esc(scenario.calendar)}</span>
        <strong>${esc(scenario.range)}</strong>
      </div>
      <h3>${esc(scenario.title)}</h3>
      <p>${esc(scenario.description)}</p>
      <div class="scenario-bars">
        ${scenario.rows.map(([label, low, high]) => `
          <div class="mini-row">
            <span>${esc(label)}</span>
            <div>${progressBar(Math.min(100, Math.round((high / 480) * 100)))}</div>
            <strong>${low}-${high}</strong>
          </div>
        `).join("")}
      </div>
    </article>
  `).join("")
}

function minutesRows() {
  return minuteSummaries.map((item) => `
    <tr>
      <td>${esc(item.date)}</td>
      <td><strong>${esc(item.title)}</strong><small>${esc(item.focus)}</small></td>
      <td>${esc(item.phase)}</td>
    </tr>
  `).join("")
}

const tiboxLogo = await imageDataUri("tibox-mark.png")
const chilfreshLogo = await imageDataUri("chilfresh-mark.png")

const html = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <title>Reporte PDF Chilfresh</title>
  <style>
    @page { size: A4; margin: 13mm 11mm 17mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #1E2C45;
      background: #fff;
      font-family: "Segoe UI", Arial, Helvetica, sans-serif;
      font-size: 10.4px;
      line-height: 1.38;
    }
    .cover {
      position: relative;
      overflow: hidden;
      min-height: 236mm;
      padding: 20mm 14mm;
      border: 1px solid #DDE6F2;
      border-radius: 14px;
      background:
        linear-gradient(130deg, rgba(8,132,214,0.10), transparent 32%),
        repeating-linear-gradient(90deg, rgba(8,132,214,0.06) 0 1px, transparent 1px 34px),
        #FFFFFF;
    }
    .cover::after {
      content: "";
      position: absolute;
      right: -18mm;
      top: 0;
      width: 88mm;
      height: 240mm;
      transform: skewX(-16deg);
      background: linear-gradient(180deg, #000E3D, #0884D6 65%, #0E9BDB);
      opacity: 0.96;
    }
    .cover-content { position: relative; z-index: 1; max-width: 138mm; }
    .brand-lockup {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      max-width: 126mm;
      margin-bottom: 11mm;
    }
    .brand-card {
      min-height: 19mm;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 7px 9px;
      border: 1px solid #DDE6F2;
      border-left: 4px solid #0E9BDB;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.92);
      box-shadow: 0 8px 22px rgba(0, 14, 61, 0.08);
    }
    .brand-card.client { border-left-color: #00910A; }
    .brand-card img {
      width: 14mm;
      height: 14mm;
      flex: 0 0 auto;
      object-fit: contain;
    }
    .brand-card.client img {
      width: 15mm;
      height: 15mm;
      border-radius: 7px;
    }
    .brand-card span {
      display: block;
      color: #627089;
      font-size: 7.5px;
      font-weight: 800;
      line-height: 1.2;
      text-transform: uppercase;
    }
    .brand-card strong {
      display: block;
      margin-top: 2px;
      color: #000E3D;
      font-size: 13px;
      line-height: 1;
    }
    .eyebrow {
      display: inline-block;
      padding: 5px 9px;
      color: #0884D6;
      border: 1px solid #BEE9FA;
      border-radius: 999px;
      background: #EFFAFF;
      font-size: 9px;
      font-weight: 800;
      text-transform: uppercase;
    }
    h1 {
      margin: 12mm 0 6mm;
      font-size: 38px;
      line-height: 0.93;
      letter-spacing: 0;
      text-transform: uppercase;
    }
    .cyan { color: #0E9BDB; }
    .gradient {
      color: #285BE6;
      background: linear-gradient(90deg, #B0BEE8, #285BE6, #D6F2FC, #0045F0);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    .cover p { max-width: 112mm; color: #4E5D73; font-size: 12px; }
    .hero-metrics, .kpi-grid, .evidence-grid, .findings-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
      margin-top: 10mm;
    }
    .metric, .kpi, .card, .scenario, .timeline-card, .risk-row, .finding {
      border: 1px solid #DDE6F2;
      border-radius: 10px;
      background: #fff;
      box-shadow: 0 8px 22px rgba(0, 14, 61, 0.07);
    }
    .metric, .kpi { padding: 10px; }
    .metric strong, .kpi strong { display: block; color: #000E3D; font-size: 22px; line-height: 1; }
    .metric span, .kpi span { color: #627089; font-size: 9px; font-weight: 700; text-transform: uppercase; }
    .page-break { break-before: page; }
    .section { margin-top: 10mm; break-inside: avoid; }
    .section-title {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 10px;
      margin-bottom: 6mm;
      border-bottom: 2px solid #E6EEF8;
      padding-bottom: 4mm;
    }
    h2 { margin: 0; color: #000E3D; font-size: 21px; line-height: 1.1; }
    .section-title p { margin: 0; color: #627089; max-width: 86mm; }
    .card { padding: 10px; }
    .card h3, .scenario h3, .timeline-card h3, .finding h3 { margin: 0 0 5px; color: #000E3D; font-size: 12px; }
    .card p, .scenario p, .timeline-card p, .finding p { margin: 0; color: #4E5D73; }
    .evidence-grid { grid-template-columns: repeat(3, 1fr); margin-top: 0; }
    .stakeholder-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 8px;
      margin-top: 7mm;
    }
    .stakeholder {
      display: grid;
      grid-template-columns: 18mm 1fr;
      gap: 8px;
      align-items: center;
      padding: 10px;
      border: 1px solid #DDE6F2;
      border-left: 4px solid #0E9BDB;
      border-radius: 10px;
      background: #F8FBFF;
    }
    .stakeholder.client { border-left-color: #00910A; }
    .stakeholder img {
      width: 16mm;
      height: 16mm;
      object-fit: contain;
    }
    .stakeholder.client img { border-radius: 7px; }
    .stakeholder span {
      display: block;
      color: #627089;
      font-size: 8px;
      font-weight: 800;
      text-transform: uppercase;
    }
    .stakeholder strong {
      display: block;
      margin: 2px 0 3px;
      color: #000E3D;
      font-size: 13px;
    }
    .stakeholder p { margin: 0; color: #4E5D73; }
    .stage-block { display: grid; grid-template-columns: 36mm 1fr; gap: 7mm; margin-bottom: 6mm; break-inside: avoid; }
    .stage-title {
      align-self: start;
      padding: 8px;
      border-left: 4px solid #0E9BDB;
      border-radius: 8px;
      background: #F4FAFE;
    }
    .stage-title strong { display: block; color: #000E3D; }
    .stage-title span { color: #627089; font-size: 9px; }
    .stage-events { display: grid; gap: 6px; }
    .timeline-card { display: grid; grid-template-columns: 25mm 1fr; gap: 7px; padding: 8px; break-inside: avoid; }
    .timeline-card.pending { border-color: #F2C8D2; }
    .timeline-card.definition { border-color: #CBE8F8; }
    .timeline-meta time { display: block; color: #0884D6; font-weight: 800; }
    .timeline-meta span {
      display: inline-block;
      margin-top: 4px;
      padding: 3px 6px;
      border-radius: 999px;
      color: #0E4D77;
      background: #EAF8FE;
      font-size: 8px;
      font-weight: 800;
    }
    .impact { margin-top: 5px; color: #56657B; font-size: 9.5px; }
    .modules-table, .minutes-table {
      width: 100%;
      border-collapse: collapse;
      border: 1px solid #DDE6F2;
      border-radius: 10px;
      overflow: hidden;
    }
    th {
      color: #FFFFFF;
      background: #000E3D;
      text-align: left;
      padding: 7px;
      font-size: 9px;
      text-transform: uppercase;
    }
    td { border-top: 1px solid #E6EEF8; padding: 7px; vertical-align: top; }
    td small { display: block; margin-top: 3px; color: #627089; }
    .status { color: #0884D6; font-weight: 800; }
    .progress-cell { width: 48mm; }
    .progress-cell span { display: inline-block; margin-top: 3px; font-weight: 800; color: #000E3D; }
    .bar-track { width: 100%; height: 7px; overflow: hidden; border-radius: 999px; background: #E8EEF6; }
    .bar-fill { display: block; height: 100%; border-radius: 999px; }
    .scenario-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
    .scenario { padding: 10px; break-inside: avoid; }
    .scenario-head { display: flex; justify-content: space-between; gap: 6px; margin-bottom: 6px; color: #0884D6; font-size: 9px; font-weight: 800; }
    .mini-row { display: grid; grid-template-columns: 1fr 34mm 16mm; gap: 5px; align-items: center; margin-top: 5px; font-size: 8.5px; }
    .risks { display: grid; grid-template-columns: 1fr 70mm; gap: 8px; }
    .risk-list { display: grid; gap: 5px; }
    .risk-row { display: grid; grid-template-columns: 1fr 22mm 1.1fr; gap: 6px; padding: 7px; }
    .risk-row strong { color: #000E3D; }
    .pill { display: inline-block; padding: 3px 6px; border-radius: 999px; color: #FFFFFF; background: #CE3F5E; font-size: 8px; font-weight: 800; text-align: center; }
    .matrix { display: grid; grid-template-columns: repeat(3, 1fr); gap: 5px; }
    .matrix div { min-height: 17mm; display: grid; place-items: center; padding: 5px; border-radius: 8px; border: 1px solid #DDE6F2; color: #4E5D73; text-align: center; font-size: 8.5px; }
    .matrix .hot { color: #fff; background: #CE3F5E; border-color: #CE3F5E; }
    .matrix .mid { color: #000E3D; background: #EAF8FE; border-color: #BEE9FA; }
    .minutes-summary { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .box { padding: 9px; border: 1px solid #DDE6F2; border-radius: 10px; background: #F8FBFF; }
    .box h3 { margin: 0 0 5px; color: #000E3D; font-size: 12px; }
    ul { margin: 0; padding-left: 16px; color: #4E5D73; }
    li { margin-bottom: 3px; }
    .minutes-table td:first-child { width: 20mm; color: #0884D6; font-weight: 800; }
    .findings-grid { grid-template-columns: repeat(4, 1fr); margin-top: 0; }
    .finding { padding: 10px; border-top: 4px solid #0E9BDB; }
    .finding:nth-child(3), .finding:nth-child(4) { border-top-color: #CE3F5E; }
    .small-note { color: #748096; font-size: 8.5px; }
  </style>
</head>
<body>
  <main>
    <section class="cover">
      <div class="cover-content">
        <div class="brand-lockup">
          <article class="brand-card">
            <img src="${tiboxLogo}" alt="Logo TIBOX" />
            <div>
              <span>Equipo de desarrollo y liderazgo</span>
              <strong>TIBOX</strong>
            </div>
          </article>
          <article class="brand-card client">
            <img src="${chilfreshLogo}" alt="Logo Chilfresh" />
            <div>
              <span>Cliente</span>
              <strong>Chilfresh</strong>
            </div>
          </article>
        </div>
        <span class="eyebrow">Assessment tecnologico y estado real</span>
        <h1><span class="cyan">Proyecto</span><br><span class="gradient">Chilfresh</span><br>Reporte ejecutivo</h1>
        <p>Vista consolidada del desarrollo del proyecto: levantamiento inicial, definiciones internas, avance real, mesas de trabajo, riesgos actuales y margen pendiente para cierre productivo.</p>
        <div class="hero-metrics">
          <div class="metric"><span>Avance global</span><strong>78%</strong></div>
          <div class="metric"><span>Hitos trazados</span><strong>${projectMilestones.length}</strong></div>
          <div class="metric"><span>Modulos</span><strong>${modules.length}</strong></div>
          <div class="metric"><span>Tareas sin duracion</span><strong>25</strong></div>
        </div>
      </div>
    </section>

    <section class="section page-break">
      <div class="section-title">
        <h2>Resumen ejecutivo</h2>
        <p>El proyecto presenta alto avance global, pero con una distribucion desigual: la capa operativa esta solida y el riesgo se concentra en definiciones financieras.</p>
      </div>
      <div class="kpi-grid">
        ${kpis.map((kpi) => `<div class="kpi"><span>${esc(kpi.label)}</span><strong>${esc(kpi.value)}</strong><p>${esc(kpi.help)}</p></div>`).join("")}
      </div>
      <div class="stakeholder-grid">
        <article class="stakeholder">
          <img src="${tiboxLogo}" alt="Logo TIBOX" />
          <div>
            <span>Equipo de desarrollo y liderazgo</span>
            <strong>TIBOX</strong>
            <p>Responsable de la ejecucion tecnica, seguimiento del assessment, lectura de avance y consolidacion ejecutiva del proyecto.</p>
          </div>
        </article>
        <article class="stakeholder client">
          <img src="${chilfreshLogo}" alt="Logo Chilfresh" />
          <div>
            <span>Cliente</span>
            <strong>Chilfresh</strong>
            <p>Responsable de definiciones de negocio, validaciones funcionales, reglas financieras y criterios de cierre productivo.</p>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <div class="section-title">
        <h2>Evidencia de contexto</h2>
        <p>Lectura sintetica desde assessment, minutas y tracking de modulos.</p>
      </div>
      <div class="evidence-grid">
        ${evidenceCards.map((card) => `<article class="card"><h3>${esc(card.title)}</h3><p>${esc(card.text)}</p></article>`).join("")}
      </div>
    </section>

    <section class="section page-break">
      <div class="section-title">
        <h2>Linea de tiempo por hitos</h2>
        <p>No se presenta como cronograma de plazos, sino como historia de decisiones, avances y pendientes relevantes.</p>
      </div>
      ${groupedMilestones()}
    </section>

    <section class="section page-break">
      <div class="section-title">
        <h2>Desglose por modulo</h2>
        <p>El 78% global debe leerse junto a la diferencia entre modulos operativos avanzados y modulos financieros criticos.</p>
      </div>
      <table class="modules-table">
        <thead><tr><th>Modulo y lectura real</th><th>Estado</th><th>Avance</th></tr></thead>
        <tbody>${modulesTable()}</tbody>
      </table>
    </section>

    <section class="section page-break">
      <div class="section-title">
        <h2>Estimacion actualizada</h2>
        <p>Escenarios para piloto operativo, productivo esencial e integral.</p>
      </div>
      <div class="scenario-grid">${scenarioCards()}</div>
    </section>

    <section class="section">
      <div class="section-title">
        <h2>Riesgos actuales</h2>
        <p>Concentrados en reglas financieras, integraciones, datos y calidad del tracking.</p>
      </div>
      <div class="risks">
        <div class="risk-list">
          ${risks.map(([name, severity, comment]) => `
            <article class="risk-row">
              <strong>${esc(name)}</strong>
              <span class="pill">${esc(severity)}</span>
              <span>${esc(comment)}</span>
            </article>
          `).join("")}
        </div>
        <div class="matrix">
          <div>Bajo impacto</div><div class="mid">Reportes por cliente</div><div class="mid">Datos maestros</div>
          <div class="mid">Logs / auditoria</div><div class="mid">Softland / SII</div><div class="hot">Liquidaciones</div>
          <div class="mid">Packing List real</div><div class="hot">Cuentas Corrientes</div><div class="hot">Pruebas sin dato</div>
        </div>
      </div>
    </section>

    <section class="section page-break">
      <div class="section-title">
        <h2>Resumen de minutas</h2>
        <p>Lectura consolidada y resumen por reunion.</p>
      </div>
      <div class="minutes-summary">
        <div class="box">
          <h3>${esc(minuteConsolidated.title)}</h3>
          <p>${esc(minuteConsolidated.focus)}</p>
        </div>
        <div class="box">
          <h3>Decisiones y pendientes consolidados</h3>
          ${list([...minuteConsolidated.decisions.slice(0, 2), ...minuteConsolidated.pending.slice(0, 3)])}
        </div>
      </div>
      <table class="minutes-table" style="margin-top:8px">
        <thead><tr><th>Fecha</th><th>Resumen</th><th>Fase</th></tr></thead>
        <tbody>${minutesRows()}</tbody>
      </table>
    </section>

    <section class="section page-break">
      <div class="section-title">
        <h2>Conclusiones ejecutivas</h2>
        <p>Sintesis para conversacion con equipo tecnico, negocio y stakeholders.</p>
      </div>
      <div class="findings-grid">
        ${findings.map(([title, text]) => `<article class="finding"><h3>${esc(title)}</h3><p>${esc(text)}</p></article>`).join("")}
      </div>
      <p class="small-note" style="margin-top:12mm">Este PDF no reemplaza una cotizacion formal ni una prueba funcional autenticada con datos productivos. La lectura se basa en fuentes documentales disponibles al corte del 17-06-2026 y actualizacion de avance a 78%.</p>
    </section>
  </main>
</body>
</html>`

await mkdir(tmpDir, { recursive: true })
await writeFile(outputHtml, html, "utf8")
console.log(outputHtml)
