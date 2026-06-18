import chilfreshMarkUrl from "../assets/brand/chilfresh-mark.png"
import tiboxMarkUrl from "../assets/brand/tibox-mark.png"
import {
  clientScenarioTimeModel,
  findings,
  flowerClosingFactors,
  flowerLiquidationTypes,
  flowerOverview,
  flowerTimeline,
  futureImplementationHorizons,
  futureImplementations,
  futureImplementationSummary,
  minuteConsolidated,
  minuteSummaries,
  modules,
  projectMilestones,
  projectStages,
  risks,
  scenarios,
} from "../data/reportData"

const SLIDE_W = 13.333
const SLIDE_H = 7.5

const P = {
  white: "FFFFFF",
  black: "000000",
  gray: "777777",
  grayLight: "BFBFBF",
  navy: "001F4E",
  navyDeep: "001A45",
  cyan: "00AEEF",
  orange: "FF7900",
  yellow: "FFD200",
  green: "8CC76A",
  purple: "6B4DBA",
  pink: "E84A8A",
  softBlue: "EAF7FE",
  softGray: "F5F7FA",
  darkText: "D8DEE9",
}

const dots = [P.pink, P.cyan, P.yellow, P.orange, P.green, P.purple]

const services = [
  ["NOC", "Infraestructura TI & NOC", P.orange],
  ["CLOUD", "Soluciones Cloud", P.cyan],
  ["SOC", "Ciberseguridad & SOC", P.purple],
  ["AUTO", "Soluciones Inteligentes & Automatizacion", P.yellow],
  ["AI", "Analitica de Datos & Inteligencia Artificial", P.green],
  ["TI", "Consultoria TI & Transformacion Digital", P.pink],
]

const clientHiddenModuleNames = new Set([
  "Pruebas Integradas",
  "I+D",
  "Generacion y Listado de logs del sistema",
])

const clientHiddenRiskNames = new Set([
  "Pruebas integradas sin dato visible",
  "25 tareas sin duracion determinada",
])

const clientRiskCopy = {
  "Logistica 100% con reglas pendientes": [
    "Reglas logisticas pendientes de cierre",
    "Media/Alta",
    "Confirmar propagacion de tarifas, flete y rebate hacia costos y liquidaciones.",
  ],
  "Carga de datos y logs en 0%": [
    "Datos y trazabilidad pendientes",
    "Media",
    "Afecta informacion real, saldos historicos y trazabilidad productiva.",
  ],
}

const clientFindings = [
  ["El proyecto tiene base real construida", "Hay plataforma de pruebas, mantenedores, logistica, bodega, Packing List base, SII/DTE y avances en Flores. La continuidad debe enfocarse en estabilizar el cierre productivo."],
  ["El 78% muestra avance relevante", "La cifra global es positiva, pero debe leerse por capas: operacion muy avanzada y modulos financieros con dependencias de cierre."],
  ["Finanzas concentra el mayor foco", "Liquidaciones, Cuentas Corrientes, Facturacion/Documentos y Contratos dependen de definiciones, integraciones y homologacion Frutas/Flores."],
]

const clientMinuteLineCopy = new Map([
  [
    "Ejecutar UAT integral; el nuevo tracking no muestra dato visible de pruebas integradas y mantiene una alerta de calidad.",
    "Ejecutar validacion integral con casos reales y cierre formal de observaciones.",
  ],
])

function isClientAudience(audience) {
  return audience === "client"
}

function sanitizeClientText(text) {
  if (clientMinuteLineCopy.has(text)) return clientMinuteLineCopy.get(text)
  return String(text)
    .replace(/pruebas integradas/gi, "validacion integral")
    .replace(/tracking/gi, "seguimiento")
    .replace(/auditoria/gi, "trazabilidad")
    .replace(/logs/gi, "trazabilidad")
}

function deckModules(audience) {
  return isClientAudience(audience)
    ? modules.filter((mod) => !clientHiddenModuleNames.has(mod.name))
    : modules
}

function deckRisks(audience) {
  return isClientAudience(audience)
    ? risks
      .filter(([name]) => !clientHiddenRiskNames.has(name))
      .map(([name, severity, comment]) => clientRiskCopy[name] || [name, severity, sanitizeClientText(comment)])
    : risks
}

function scenarioDescription(key, scenario, audience) {
  return isClientAudience(audience) ? clientScenarioTimeModel[key].description : scenario.description
}

function deckFindings(audience) {
  return isClientAudience(audience) ? clientFindings : findings
}

function shortText(text, max = 130) {
  const value = String(text)
  return value.length > max ? `${value.slice(0, max - 1).trim()}...` : value
}

async function imageToDataUri(url) {
  const response = await fetch(url)
  const blob = await response.blob()
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

async function imageToWhiteDataUri(url) {
  const src = await imageToDataUri(url)
  return new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = image.naturalWidth
      canvas.height = image.naturalHeight
      const ctx = canvas.getContext("2d")
      ctx.drawImage(image, 0, 0)
      const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < pixels.data.length; i += 4) {
        if (pixels.data[i + 3] > 8) {
          pixels.data[i] = 255
          pixels.data[i + 1] = 255
          pixels.data[i + 2] = 255
        }
      }
      ctx.putImageData(pixels, 0, 0)
      resolve(canvas.toDataURL("image/png"))
    }
    image.src = src
  })
}

async function loadBrandLogos() {
  return {
    tibox: await imageToDataUri(tiboxMarkUrl),
    tiboxWhite: await imageToWhiteDataUri(tiboxMarkUrl),
    chilfresh: await imageToDataUri(chilfreshMarkUrl),
  }
}

function setupPresentation(pptxgen, mode) {
  const pptx = new pptxgen()
  pptx.layout = "LAYOUT_WIDE"
  pptx.author = "TIBOX"
  pptx.company = "TIBOX"
  pptx.lang = "es-CL"
  pptx.subject = `Assessment tecnologico Chilfresh - modo ${mode}`
  pptx.title = `Proyecto Chilfresh - Reporte ejecutivo ${mode}`
  pptx.theme = {
    headFontFace: "Aptos Display",
    bodyFontFace: "Aptos",
    lang: "es-CL",
  }
  return pptx
}

function textColor(mode, secondary = false) {
  if (mode === "dark") return secondary ? P.darkText : P.white
  return secondary ? P.gray : P.black
}

function addFooterBand(slide) {
  const y = 7.36
  const h = 0.14
  const blocks = [
    [-0.2, 2.55, P.orange],
    [2.08, 3.35, P.yellow],
    [5.18, 3.72, P.cyan],
    [8.6, 4.95, P.navy],
  ]
  blocks.forEach(([x, w, color]) => {
    slide.addShape("parallelogram", {
      x,
      y,
      w,
      h,
      fill: { color },
      line: { color, transparency: 100 },
    })
  })
}

function addColorDots(slide, x, y) {
  dots.forEach((color, index) => {
    slide.addShape("ellipse", {
      x: x + index * 0.15,
      y,
      w: 0.07,
      h: 0.07,
      fill: { color },
      line: { color, transparency: 100 },
    })
  })
}

function addContactPills(slide, mode, x, y, centered = false) {
  const fill = mode === "dark" ? P.navyDeep : P.navy
  const line = mode === "dark" ? P.white : P.navy
  const w = 1.35
  const gap = 0.12
  const startX = centered ? x - (w * 2 + gap) / 2 : x
  ;[
    ["www.tibox.cl", 0],
    ["LinkedIn / Tibox", 1],
  ].forEach(([label, index]) => {
    slide.addShape("roundRect", {
      x: startX + index * (w + gap),
      y,
      w,
      h: 0.24,
      fill: { color: fill, transparency: mode === "dark" ? 100 : 0 },
      line: { color: line, transparency: mode === "dark" ? 0 : 100, width: 0.7 },
    })
    slide.addText(label, {
      x: startX + index * (w + gap),
      y: y + 0.055,
      w,
      h: 0.1,
      color: P.white,
      fontSize: 6.8,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })
}

function addLogo(slide, logos, mode, x, y, scale = 1, centered = false) {
  const mark = mode === "dark" ? logos.tiboxWhite : logos.tibox
  const markW = 0.5 * scale
  const textW = 1.05 * scale
  const groupW = markW + 0.14 * scale + textW
  const startX = centered ? x - groupW / 2 : x
  slide.addImage({ data: mark, x: startX, y, w: markW, h: markW })
  slide.addText("TIBOX", {
    x: startX + markW + 0.14 * scale,
    y: y + 0.12 * scale,
    w: textW,
    h: 0.2 * scale,
    color: mode === "dark" ? P.white : P.navy,
    fontSize: 15 * scale,
    bold: true,
    margin: 0,
    fit: "shrink",
  })
}

function addTopChrome(slide, logos, mode) {
  addLogo(slide, logos, mode, 0.55, 0.36, 0.72)
  addColorDots(slide, 9.4, 0.43)
  addContactPills(slide, mode, 10.45, 0.34)
}

function addBase(slide, mode, logos, internal = true) {
  slide.background = { color: mode === "dark" ? P.navy : P.white }
  if (mode === "light") {
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: SLIDE_H,
      fill: { color: P.white },
      line: { color: P.white },
    })
  } else {
    slide.addShape("rect", {
      x: 0,
      y: 0,
      w: SLIDE_W,
      h: SLIDE_H,
      fill: { color: P.navy },
      line: { color: P.navy },
    })
  }
  if (internal) addTopChrome(slide, logos, mode)
  addFooterBand(slide)
}

function addTitle(slide, title, subtitle, mode) {
  slide.addText(title, {
    x: 0.82,
    y: 1.18,
    w: 7.2,
    h: 0.42,
    color: textColor(mode),
    fontFace: "Aptos Display",
    fontSize: 23,
    bold: true,
    margin: 0,
    fit: "shrink",
  })
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.84,
      y: 1.66,
      w: 7.8,
      h: 0.22,
      color: textColor(mode, true),
      fontSize: 10.5,
      margin: 0,
      fit: "shrink",
    })
  }
}

function addServiceIcon(slide, item, x, y, mode, label = false, size = 0.62) {
  const [code, name, color] = item
  slide.addShape("ellipse", {
    x: x + 0.05,
    y: y + 0.08,
    w: size,
    h: size,
    fill: { color, transparency: 16 },
    line: { color, transparency: 100 },
  })
  slide.addShape("cube", {
    x,
    y,
    w: size,
    h: size,
    fill: { color },
    line: { color, transparency: 100 },
  })
  slide.addText(code, {
    x: x + 0.04,
    y: y + size * 0.42,
    w: size * 0.92,
    h: 0.16,
    color: P.white,
    fontSize: size > 0.65 ? 8.5 : 6.5,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
  if (label) {
    slide.addText(name, {
      x: x - 0.38,
      y: y + size + 0.18,
      w: size + 0.76,
      h: 0.34,
      color: textColor(mode),
      fontSize: 8.2,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  }
}

function addServiceRow(slide, mode, y = 5.88, x = 0.78, size = 0.38) {
  services.forEach((service, index) => {
    addServiceIcon(slide, service, x + index * 0.58, y, mode, false, size)
  })
}

function addMinimalPanel(slide, mode, x, y, w, h, title, body, accent = P.cyan) {
  const light = mode === "light"
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    fill: { color: light ? P.white : P.navyDeep, transparency: light ? 0 : 8 },
    line: { color: light ? "E6EAF0" : P.white, transparency: light ? 0 : 80, width: 0.7 },
  })
  slide.addShape("rect", {
    x,
    y,
    w,
    h: 0.04,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  })
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.18,
    w: w - 0.36,
    h: 0.2,
    color: textColor(mode),
    fontSize: 11.2,
    bold: true,
    margin: 0,
    fit: "shrink",
  })
  slide.addText(shortText(body, 150), {
    x: x + 0.18,
    y: y + 0.52,
    w: w - 0.36,
    h: h - 0.62,
    color: textColor(mode, true),
    fontSize: 9.2,
    margin: 0,
    fit: "shrink",
  })
}

function addBullets(slide, mode, items, x, y, w, gap = 0.46) {
  items.forEach((item, index) => {
    slide.addShape("ellipse", {
      x,
      y: y + index * gap + 0.03,
      w: 0.09,
      h: 0.09,
      fill: { color: index === items.length - 1 ? P.orange : P.cyan },
      line: { color: index === items.length - 1 ? P.orange : P.cyan },
    })
    slide.addText(shortText(item, 135), {
      x: x + 0.22,
      y: y + index * gap,
      w,
      h: 0.22,
      color: textColor(mode, index !== 0),
      fontSize: 11.2,
      bold: index === 0,
      margin: 0,
      fit: "shrink",
    })
  })
}

function addCover(pptx, logos, mode) {
  const slide = pptx.addSlide()
  addBase(slide, mode, logos, false)
  addLogo(slide, logos, mode, SLIDE_W / 2, 0.6, 0.95, true)
  slide.addText("PROYECTO CHILFRESH", {
    x: 0.92,
    y: 2.55,
    w: 11.5,
    h: 0.44,
    color: textColor(mode),
    fontFace: "Aptos Display",
    fontSize: 28,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
  slide.addText("Reporte ejecutivo de assessment, estimacion y estado real", {
    x: 2.05,
    y: 3.14,
    w: 9.2,
    h: 0.25,
    color: textColor(mode, true),
    fontSize: 12.8,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
  slide.addText("18 de junio de 2026", {
    x: 4.75,
    y: 6.72,
    w: 3.8,
    h: 0.18,
    color: textColor(mode, true),
    fontSize: 9,
    align: "center",
    margin: 0,
  })
  addServiceRow(slide, mode, 6.3, 0.78, 0.35)
  addColorDots(slide, 9.24, 6.24)
  addContactPills(slide, mode, 10.1, 6.16)
}

function addServicesSlide(pptx, logos, mode) {
  const slide = pptx.addSlide()
  addBase(slide, mode, logos, false)
  addLogo(slide, logos, mode, SLIDE_W / 2, 1.18, mode === "dark" ? 1.35 : 1.15, true)
  slide.addText("Equipo de desarrollo y liderazgo del proyecto", {
    x: 2.2,
    y: 2.1,
    w: 8.95,
    h: 0.2,
    color: textColor(mode, true),
    fontSize: 11,
    align: "center",
    margin: 0,
  })
  const start = 1.05
  services.forEach((service, index) => {
    addServiceIcon(slide, service, start + index * 1.9, 3.16, mode, true, 0.78)
  })
  addColorDots(slide, 5.88, 5.82)
  addContactPills(slide, mode, SLIDE_W / 2, 6.02, true)
}

function addSummary(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  const visibleModules = deckModules(audience)
  addBase(slide, mode, logos)
  addTitle(
    slide,
    "Resumen ejecutivo",
    client
      ? "Avance alto, base operativa consolidada y foco de cierre financiero."
      : "Avance alto, distribucion desigual y riesgo concentrado en definiciones financieras.",
    mode,
  )
  const stats = [
    ["78%", "Avance global actualizado"],
    [`${projectMilestones.length}`, "Hitos trazados"],
    [`${visibleModules.length}`, client ? "Modulos visibles" : "Modulos analizados"],
    [client ? "Piloto" : "25", client ? "Ruta sugerida" : "Tareas sin duracion"],
  ]
  stats.forEach(([value, label], index) => {
    const x = 1.1 + index * 3.02
    slide.addText(value, {
      x,
      y: 2.48,
      w: 2.1,
      h: 0.48,
      color: index === 3 ? P.orange : P.cyan,
      fontFace: "Aptos Display",
      fontSize: 30,
      bold: true,
      align: "center",
      margin: 0,
    })
    slide.addText(label, {
      x,
      y: 3.04,
      w: 2.1,
      h: 0.18,
      color: textColor(mode, true),
      fontSize: 9.5,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })
  addBullets(slide, mode, [
    "La capa operativa esta construida y validada en gran medida.",
    "Los modulos financieros criticos concentran el riesgo real.",
    client
      ? "La ruta sugerida es avanzar con piloto controlado y validacion funcional."
      : "El 78% no debe interpretarse como cierre homogeneo del proyecto.",
  ], 1.3, 4.22, 10.4, 0.52)
}

function addTimeline(pptx, logos, mode) {
  const slide = pptx.addSlide()
  addBase(slide, mode, logos)
  addTitle(slide, "Linea de tiempo por hitos", "Historia de decisiones, avances y pendientes, no solo cronograma de plazos.", mode)
  const y = 3.2
  slide.addShape("line", {
    x: 0.92,
    y,
    w: 11.45,
    h: 0,
    line: { color: mode === "dark" ? P.white : P.grayLight, transparency: mode === "dark" ? 35 : 0, width: 1.2 },
  })
  projectStages.forEach((stage, index) => {
    const x = 0.92 + index * 2.28
    const pending = stage.key === "pendiente"
    slide.addShape("ellipse", {
      x: x - 0.08,
      y: y - 0.08,
      w: 0.16,
      h: 0.16,
      fill: { color: pending ? P.orange : P.cyan },
      line: { color: pending ? P.orange : P.cyan },
    })
    slide.addText(stage.title, {
      x: x - 0.55,
      y: index % 2 === 0 ? 2.18 : 3.55,
      w: 1.3,
      h: 0.34,
      color: textColor(mode),
      fontSize: 9.2,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
    slide.addText(stage.range, {
      x: x - 0.55,
      y: index % 2 === 0 ? 2.58 : 3.95,
      w: 1.3,
      h: 0.16,
      color: pending ? P.orange : textColor(mode, true),
      fontSize: 7.8,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })
  slide.addText("El proyecto evoluciona desde levantamiento y datos maestros hacia operacion documental, finanzas, estado real y margen pendiente de cierre.", {
    x: 1.45,
    y: 5.18,
    w: 10.45,
    h: 0.42,
    color: textColor(mode),
    fontSize: 15,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
}

function addFlowers(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(
    slide,
    "Flores: incorporacion y avances",
    client
      ? "Base funcional implementada, con validacion operativa y financiera pendiente."
      : "Implementacion parcial; requiere mesa exclusiva para revalidar flujo completo y reglas propias.",
    mode,
  )

  addMinimalPanel(
    slide,
    mode,
    0.95,
    1.92,
    4.05,
    1.7,
    "Contexto",
    shortText(flowerOverview.context, 245),
    P.cyan,
  )

  const metrics = [
    [flowerOverview.progress, "Avance estimado"],
    [flowerOverview.risk, "Riesgo"],
    [`${flowerLiquidationTypes.length}`, "Liquidaciones"],
  ]
  metrics.forEach(([value, label], index) => {
    const x = 0.95 + index * 1.35
    slide.addText(value, {
      x,
      y: 4.05,
      w: 1.18,
      h: 0.32,
      color: index === 1 ? P.orange : P.cyan,
      fontSize: 17,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
    slide.addText(label, {
      x: x - 0.04,
      y: 4.43,
      w: 1.26,
      h: 0.16,
      color: textColor(mode, true),
      fontSize: 7.5,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })

  const timelineItems = [
    flowerTimeline[0],
    flowerTimeline[1],
    flowerTimeline[2],
    flowerTimeline[4],
    flowerTimeline[5],
    flowerTimeline[7],
  ]
  timelineItems.forEach((item, index) => {
    const y = 1.86 + index * 0.58
    slide.addText(item.date, {
      x: 5.55,
      y,
      w: 1.05,
      h: 0.18,
      color: item.tone === "pending" ? P.orange : P.cyan,
      fontSize: 8,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(item.title, {
      x: 6.7,
      y,
      w: 4.85,
      h: 0.18,
      color: textColor(mode),
      fontSize: 8.8,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(shortText(item.summary, 110), {
      x: 6.7,
      y: y + 0.2,
      w: 5.02,
      h: 0.15,
      color: textColor(mode, true),
      fontSize: 7.2,
      margin: 0,
      fit: "shrink",
    })
  })

  addMinimalPanel(
    slide,
    mode,
    0.95,
    5.18,
    4.05,
    0.95,
    "Cierre requerido",
    flowerClosingFactors.join("\n"),
    P.orange,
  )
  addMinimalPanel(
    slide,
    mode,
    5.55,
    5.18,
    6.25,
    0.95,
    "Lectura",
    "El riesgo principal no es solo desarrollo: depende de definiciones internas Chilfresh, costos reales y alineacion Flores/Frutas.",
    P.cyan,
  )
}

function addModules(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  const visibleModules = deckModules(audience)
  addBase(slide, mode, logos)
  addTitle(
    slide,
    client ? "Estado ejecutivo por modulo" : "Estado por modulo",
    client
      ? "Vista filtrada para componentes funcionales y focos de cierre."
      : "La lectura real muestra una brecha entre operacion consolidada y finanzas pendientes.",
    mode,
  )
  slide.addText("78%", {
    x: 0.95,
    y: 2.28,
    w: 2.6,
    h: 0.72,
    color: P.cyan,
    fontFace: "Aptos Display",
    fontSize: 46,
    bold: true,
    align: "center",
    margin: 0,
  })
  slide.addText("avance global", {
    x: 0.95,
    y: 3.12,
    w: 2.6,
    h: 0.2,
    color: textColor(mode, true),
    fontSize: 11,
    align: "center",
    margin: 0,
  })
  const strong = visibleModules.filter((mod) => mod.progress >= 78).slice(0, 6).map((mod) => `${mod.name} (${mod.display || `${mod.progress}%`})`)
  const critical = visibleModules.filter((mod) => mod.progress < 60).slice(0, 6).map((mod) => `${mod.name} (${mod.display || `${mod.progress}%`})`)
  addMinimalPanel(slide, mode, 4.0, 2.02, 3.7, 3.25, "Mas solido", strong.join("\n"), P.cyan)
  addMinimalPanel(slide, mode, 8.05, 2.02, 3.85, 3.25, client ? "Focos de cierre" : "Mas critico", critical.join("\n"), P.orange)
}

function addEstimation(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(
    slide,
    client ? "Estimacion de continuidad" : "Estimacion de trabajo",
    client
      ? "Escenarios referenciales para priorizacion y formalizacion de alcance."
      : "Escenarios referenciales para convertir avance construido en readiness productiva.",
    mode,
  )
  Object.entries(scenarios).forEach(([key, scenario], index) => {
    const x = 0.95 + index * 4.1
    const clientTime = clientScenarioTimeModel[key]
    const body = client
      ? `${clientTime.value}\n${clientTime.label}\n${shortText(scenarioDescription(key, scenario, audience), 105)}`
      : `${scenario.range}\n${scenario.calendar}\n${shortText(scenarioDescription(key, scenario, audience), 105)}`
    addMinimalPanel(slide, mode, x, 2.05, 3.35, 2.9, scenario.title, body, index === 0 ? P.orange : P.cyan)
  })
  slide.addText(client
    ? "Los tiempos dependen de definiciones, datos reales, responsables de validacion e insumos entregados por Chilfresh."
    : "El piloto controlado reduce riesgo: valida flujo real antes de perseguir cierre integral de todos los modulos financieros.", {
    x: 1.1,
    y: 5.62,
    w: 11.1,
    h: 0.28,
    color: mode === "dark" ? P.white : P.navy,
    fontSize: 13,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
}

function addFutureImplementations(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(
    slide,
    client ? "Evolucion futura de la plataforma" : "Futuras implementaciones",
    client
      ? "Oportunidades posteriores al cierre base, ordenadas por horizonte y valor operacional."
      : "Backlog estimable de mejoras, automatizacion, trazabilidad e innovacion.",
    mode,
  )

  addMinimalPanel(
    slide,
    mode,
    0.95,
    1.88,
    4.2,
    1.82,
    futureImplementationSummary.title,
    shortText(futureImplementationSummary.reading, 250),
    P.cyan,
  )

  futureImplementationHorizons.forEach((item, index) => {
    const x = 5.45 + index * 2.18
    addMinimalPanel(
      slide,
      mode,
      x,
      1.88,
      1.95,
      1.82,
      item.horizon,
      shortText(`${item.focus}\n${item.items.slice(0, 3).join("\n")}`, 138),
      index === 0 ? P.orange : index === 1 ? P.cyan : P.pink,
    )
  })

  const priorityItems = futureImplementations
    .filter((item) => item.priority === "Alta")
    .slice(0, 6)
  priorityItems.forEach((item, index) => {
    const y = 4.14 + index * 0.33
    slide.addText(`${index + 1}. ${item.title}`, {
      x: 1.05,
      y,
      w: 4.1,
      h: 0.18,
      color: textColor(mode),
      fontSize: 8.8,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(`${item.horizon} / ${item.category}`, {
      x: 5.34,
      y,
      w: 2.1,
      h: 0.16,
      color: P.orange,
      fontSize: 7.8,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(shortText(item.benefit, 105), {
      x: 7.65,
      y,
      w: 4.35,
      h: 0.16,
      color: textColor(mode, true),
      fontSize: 7.8,
      margin: 0,
      fit: "shrink",
    })
  })

  slide.addText(futureImplementationSummary.note, {
    x: 1.1,
    y: 6.12,
    w: 11.1,
    h: 0.26,
    color: textColor(mode),
    fontSize: 10.5,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
}

function addRisks(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(
    slide,
    "Riesgos y consideraciones",
    client
      ? "El foco se concentra en reglas financieras, datos, integraciones y validacion."
      : "El cuello de botella se concentra en reglas financieras, datos, integraciones y pruebas.",
    mode,
  )
  deckRisks(audience).slice(0, 6).forEach(([name, severity, comment], index) => {
    const y = 2.12 + index * 0.52
    slide.addText(`${index + 1}.`, {
      x: 1.0,
      y,
      w: 0.32,
      h: 0.2,
      color: index < 4 ? P.orange : P.cyan,
      fontSize: 12,
      bold: true,
      margin: 0,
    })
    slide.addText(name, {
      x: 1.42,
      y,
      w: 3.6,
      h: 0.2,
      color: textColor(mode),
      fontSize: 10.4,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(severity, {
      x: 5.24,
      y,
      w: 1.0,
      h: 0.18,
      color: index < 4 ? P.orange : P.cyan,
      fontSize: 8.2,
      bold: true,
      margin: 0,
    })
    slide.addText(shortText(comment, 100), {
      x: 6.4,
      y,
      w: 5.3,
      h: 0.2,
      color: textColor(mode, true),
      fontSize: 9,
      margin: 0,
      fit: "shrink",
    })
  })
  addMinimalPanel(slide, mode, 1.0, 5.7, 10.9, 0.62, "Lectura", "El riesgo del tramo pendiente no es volumen, sino dependencia de terceros, reglas de negocio y validacion integral.", P.orange)
}

function addMinutes(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Resumen de minutas", client ? "Consolidado ejecutivo y decisiones relevantes." : "Consolidado total y lectura de reuniones recientes.", mode)
  addMinimalPanel(slide, mode, 0.95, 2.0, 5.2, 2.25, minuteConsolidated.title, client ? sanitizeClientText(minuteConsolidated.focus) : minuteConsolidated.focus, P.cyan)
  minuteSummaries.slice(-5).forEach((minute, index) => {
    const y = 2.0 + index * 0.55
    slide.addText(minute.date, {
      x: 6.7,
      y,
      w: 1.0,
      h: 0.18,
      color: P.cyan,
      fontSize: 8.4,
      bold: true,
      margin: 0,
    })
    slide.addText(minute.title, {
      x: 7.82,
      y,
      w: 3.85,
      h: 0.18,
      color: textColor(mode),
      fontSize: 8.7,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(shortText(client ? sanitizeClientText(minute.focus) : minute.focus, 112), {
      x: 7.82,
      y: y + 0.2,
      w: 4.0,
      h: 0.16,
      color: textColor(mode, true),
      fontSize: 7.4,
      margin: 0,
      fit: "shrink",
    })
  })
}

function addCurrentState(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const visibleFindings = deckFindings(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Estado actual real", "Construccion avanzada, cierre funcional pendiente.", mode)
  slide.addText("El proyecto existe y tiene base real.", {
    x: 1.0,
    y: 2.35,
    w: 10.8,
    h: 0.36,
    color: textColor(mode),
    fontFace: "Aptos Display",
    fontSize: 23,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
  addBullets(slide, mode, [
    visibleFindings[0][1],
    visibleFindings[1][1],
    visibleFindings[2][1],
  ], 2.0, 3.45, 9.0, 0.62)
}

function addRoadmap(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Ruta recomendada", "Piloto controlado antes de cierre integral.", mode)
  const steps = [
    ["01", "Estabilizar PL y SC"],
    ["02", "Cerrar facturacion base"],
    ["03", "Reglas financieras"],
    ["04", client ? "Datos, validacion y marcha blanca" : "Datos, UAT y marcha blanca"],
  ]
  steps.forEach(([num, label], index) => {
    const x = 1.08 + index * 3.0
    slide.addText(num, {
      x,
      y: 2.38,
      w: 1.0,
      h: 0.36,
      color: index === 3 ? P.orange : P.cyan,
      fontSize: 20,
      bold: true,
      align: "center",
      margin: 0,
    })
    slide.addShape("line", {
      x: x + 0.95,
      y: 2.58,
      w: index === 3 ? 0 : 1.65,
      h: 0,
      line: { color: index === 3 ? P.orange : P.cyan, transparency: 12, width: 1.2 },
    })
    slide.addText(label, {
      x: x - 0.34,
      y: 3.0,
      w: 1.7,
      h: 0.34,
      color: textColor(mode),
      fontSize: 10.2,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })
  slide.addShape("roundRect", {
    x: 3.4,
    y: 5.35,
    w: 6.55,
    h: 0.42,
    fill: { color: P.orange },
    line: { color: P.orange },
  })
  slide.addText("Alinear responsables de definicion Chilfresh y validar el flujo financiero end-to-end.", {
    x: 3.58,
    y: 5.49,
    w: 6.2,
    h: 0.13,
    color: P.white,
    fontSize: 9.4,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
}

function buildDeck(pptxgen, logos, mode, audience = "internal") {
  const pptx = setupPresentation(pptxgen, mode)
  addCover(pptx, logos, mode)
  addServicesSlide(pptx, logos, mode)
  addSummary(pptx, logos, mode, audience)
  addTimeline(pptx, logos, mode)
  addFlowers(pptx, logos, mode, audience)
  addModules(pptx, logos, mode, audience)
  addEstimation(pptx, logos, mode, audience)
  addFutureImplementations(pptx, logos, mode, audience)
  addRisks(pptx, logos, mode, audience)
  addMinutes(pptx, logos, mode, audience)
  addCurrentState(pptx, logos, mode, audience)
  addRoadmap(pptx, logos, mode, audience)
  return pptx
}

export async function downloadProjectPpt(audience = "internal") {
  const { default: pptxgen } = await import("pptxgenjs")
  const logos = await loadBrandLogos()
  const pptx = buildDeck(pptxgen, logos, "dark", audience)
  const suffix = isClientAudience(audience) ? "_Cliente" : ""
  await pptx.writeFile({
    fileName: `Reporte_Chilfresh_Assessment_Timeline${suffix}_2026-06-18.pptx`,
    compression: true,
  })
}

export async function downloadProjectPptLight(audience = "internal") {
  const { default: pptxgen } = await import("pptxgenjs")
  const logos = await loadBrandLogos()
  const pptx = buildDeck(pptxgen, logos, "light", audience)
  const suffix = isClientAudience(audience) ? "_Cliente" : ""
  await pptx.writeFile({
    fileName: `Reporte_Chilfresh_Assessment_Timeline_Claro${suffix}_2026-06-18.pptx`,
    compression: true,
  })
}
