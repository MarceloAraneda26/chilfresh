import chilfreshMarkUrl from "../assets/brand/chilfresh-mark.png"
import tiboxMarkUrl from "../assets/brand/tibox-mark.png"
import {
  clientScenarioTimeModel,
  findings,
  flowerOverview,
  futureImplementationHorizons,
  futureImplementations,
  futureImplementationSummary,
  minuteConsolidated,
  modules,
  projectMilestones,
  projectStages,
  risks,
  scenarios,
} from "../data/reportData"

const SLIDE_W = 13.333
const SLIDE_H = 7.5
const REPORT_DATE = "18 de junio de 2026"

const P = {
  white: "FFFFFF",
  black: "000000",
  gray: "6B7280",
  grayMid: "777777",
  grayLight: "D8E3EF",
  navy: "001F4E",
  navyDeep: "001A45",
  navyCard: "062B5C",
  cyan: "00AEEF",
  orange: "FF7900",
  yellow: "FFD200",
  green: "8CC76A",
  purple: "6B4DBA",
  pink: "E84A8A",
  softBlue: "EEF4FA",
  softGray: "F7F9FC",
  darkText: "D8DEE9",
}

const dots = [P.pink, P.cyan, P.yellow, P.orange, P.green, P.purple]

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
  [
    "El proyecto tiene base real construida",
    "Hay plataforma de pruebas, mantenedores, logistica, bodega, Packing List base, SII/DTE y avances en Flores. La continuidad debe enfocarse en estabilizar el cierre productivo.",
  ],
  [
    "El 78% muestra avance relevante",
    "La cifra global es positiva, pero debe leerse por capas: operacion muy avanzada y modulos financieros con dependencias de cierre.",
  ],
  [
    "Finanzas concentra el mayor foco",
    "Liquidaciones, Cuentas Corrientes, Facturacion/Documentos y Contratos dependen de definiciones, integraciones y homologacion Frutas/Flores.",
  ],
]

function isClientAudience(audience) {
  return audience === "client"
}

function sanitizeClientText(text) {
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

function deckFindings(audience) {
  return isClientAudience(audience) ? clientFindings : findings
}

function shortText(text, max = 130) {
  const value = String(text)
  return value.length > max ? `${value.slice(0, max - 1).trim()}...` : value
}

function moduleValue(module) {
  return module.display || `${module.progress}%`
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

function isLight(mode) {
  return mode === "light"
}

function textColor(mode, secondary = false) {
  if (isLight(mode)) return secondary ? P.gray : P.black
  return secondary ? P.darkText : P.white
}

function titleColor(mode) {
  return isLight(mode) ? P.navy : P.white
}

function cardFill(mode, alt = false) {
  if (isLight(mode)) return alt ? P.softGray : P.white
  return alt ? P.navyDeep : P.navyCard
}

function cardLine(mode) {
  return isLight(mode) ? P.grayLight : "31557A"
}

function addFooterBand(slide) {
  const y = 7.36
  const h = 0.14
  const blocks = [
    [-0.18, 2.72, P.orange],
    [2.22, 3.4, P.yellow],
    [5.34, 3.72, P.cyan],
    [8.74, 4.88, P.navy],
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
      x: x + index * 0.16,
      y,
      w: 0.075,
      h: 0.075,
      fill: { color },
      line: { color, transparency: 100 },
    })
  })
}

function addContactPills(slide, mode, x, y, centered = false) {
  const fill = isLight(mode) ? P.navy : P.navyDeep
  const line = isLight(mode) ? P.navy : P.white
  const w = 1.32
  const gap = 0.13
  const startX = centered ? x - (w * 2 + gap) / 2 : x
  ;[
    ["tibox.cl", 0],
    ["LinkedIn TIBOX", 1],
  ].forEach(([label, index]) => {
    slide.addShape("roundRect", {
      x: startX + index * (w + gap),
      y,
      w,
      h: 0.28,
      fill: { color: fill, transparency: isLight(mode) ? 0 : 100 },
      line: { color: line, transparency: isLight(mode) ? 100 : 0, width: 0.75 },
    })
    slide.addText(label, {
      x: startX + index * (w + gap),
      y: y + 0.075,
      w,
      h: 0.11,
      color: P.white,
      fontSize: 7.2,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })
}

function addBrandLockup(slide, logos, mode, x, y, scale = 1, centered = false) {
  const tiboxMark = isLight(mode) ? logos.tibox : logos.tiboxWhite
  const mark = 0.38 * scale
  const startX = centered ? x - 1.72 * scale : x
  const tiboxTextColor = isLight(mode) ? P.black : P.white
  const chilTextColor = isLight(mode) ? P.navy : P.white

  slide.addImage({ data: tiboxMark, x: startX, y, w: mark, h: mark })
  slide.addText("TIBOX", {
    x: startX + mark + 0.1 * scale,
    y: y + 0.09 * scale,
    w: 0.82 * scale,
    h: 0.18 * scale,
    color: tiboxTextColor,
    fontSize: 12.2 * scale,
    bold: true,
    margin: 0,
    fit: "shrink",
  })
  slide.addShape("line", {
    x: startX + 1.26 * scale,
    y: y - 0.01 * scale,
    w: 0,
    h: 0.38 * scale,
    line: { color: isLight(mode) ? P.grayLight : "54759A", width: 0.65 },
  })
  slide.addImage({
    data: logos.chilfresh,
    x: startX + 1.43 * scale,
    y: y - 0.01 * scale,
    w: mark,
    h: mark,
  })
  slide.addText("CHIL", {
    x: startX + 1.86 * scale,
    y: y + 0.095 * scale,
    w: 0.36 * scale,
    h: 0.16 * scale,
    color: chilTextColor,
    fontSize: 10 * scale,
    bold: true,
    margin: 0,
    fit: "shrink",
  })
  slide.addText("fresh", {
    x: startX + 2.22 * scale,
    y: y + 0.075 * scale,
    w: 0.58 * scale,
    h: 0.18 * scale,
    color: isLight(mode) ? "00910A" : P.green,
    fontSize: 11.2 * scale,
    margin: 0,
    fit: "shrink",
  })
}

function addTopChrome(slide, logos, mode) {
  addBrandLockup(slide, logos, mode, 0.72, 0.32, 0.78)
  addColorDots(slide, 9.32, 0.42)
  addContactPills(slide, mode, 10.38, 0.32)
}

function addBase(slide, mode, logos, internal = true) {
  const bg = isLight(mode) ? P.white : P.navy
  slide.background = { color: bg }
  slide.addShape("rect", {
    x: 0,
    y: 0,
    w: SLIDE_W,
    h: SLIDE_H,
    fill: { color: bg },
    line: { color: bg },
  })
  if (internal) addTopChrome(slide, logos, mode)
  addFooterBand(slide)
}

function addTitle(slide, title, subtitle, mode) {
  slide.addText(title, {
    x: 0.72,
    y: 1.02,
    w: 7.8,
    h: 0.42,
    color: titleColor(mode),
    fontFace: "Aptos Display",
    fontSize: 24.5,
    bold: true,
    margin: 0,
    fit: "shrink",
  })
  if (subtitle) {
    slide.addText(subtitle, {
      x: 0.74,
      y: 1.5,
      w: 8.25,
      h: 0.22,
      color: textColor(mode, true),
      fontSize: 10.5,
      margin: 0,
      fit: "shrink",
    })
  }
}

function addCard(slide, mode, x, y, w, h, title, body, accent = P.cyan, options = {}) {
  const fill = options.fill || cardFill(mode, options.alt)
  slide.addShape("roundRect", {
    x,
    y,
    w,
    h,
    fill: { color: fill, transparency: isLight(mode) ? 0 : 5 },
    line: { color: options.line || cardLine(mode), transparency: isLight(mode) ? 0 : 35, width: 0.8 },
    radius: 0.18,
  })
  slide.addShape("rect", {
    x: x + 0.14,
    y: y + 0.13,
    w: w - 0.28,
    h: 0.045,
    fill: { color: accent },
    line: { color: accent, transparency: 100 },
  })
  slide.addText(title, {
    x: x + 0.18,
    y: y + 0.28,
    w: w - 0.36,
    h: options.titleH || 0.28,
    color: options.titleColor || titleColor(mode),
    fontSize: options.titleSize || 12,
    bold: true,
    margin: 0,
    fit: "shrink",
  })
  slide.addText(shortText(body, options.max || 175), {
    x: x + 0.18,
    y: y + (options.bodyY || 0.66),
    w: w - 0.36,
    h: h - (options.bodyY || 0.66) - 0.15,
    color: options.bodyColor || textColor(mode, true),
    fontSize: options.bodySize || 9.2,
    breakLine: false,
    margin: 0,
    fit: "shrink",
  })
}

function addKpi(slide, mode, x, y, value, label, accent = P.cyan, w = 1.9) {
  slide.addText(value, {
    x,
    y,
    w,
    h: 0.45,
    color: accent,
    fontFace: "Aptos Display",
    fontSize: 28,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
  slide.addText(label, {
    x,
    y: y + 0.52,
    w,
    h: 0.2,
    color: textColor(mode, true),
    fontSize: 8.8,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
}

function addCover(pptx, logos, mode) {
  const slide = pptx.addSlide()
  addBase(slide, mode, logos, false)
  addBrandLockup(slide, logos, mode, SLIDE_W / 2, 0.56, 1.08, true)

  slide.addText("PROYECTO CHILFRESH", {
    x: 1,
    y: 2.35,
    w: 11.35,
    h: 0.52,
    color: titleColor(mode),
    fontFace: "Aptos Display",
    fontSize: 33,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
  slide.addText("Reporte ejecutivo de assessment, estado real y continuidad", {
    x: 2,
    y: 3.02,
    w: 9.35,
    h: 0.28,
    color: textColor(mode, true),
    fontSize: 14.2,
    align: "center",
    margin: 0,
    fit: "shrink",
  })

  addCard(
    slide,
    mode,
    4.3,
    3.92,
    4.75,
    0.88,
    "78%",
    "avance global con capa operacional consolidada y cierre financiero por validar",
    P.green,
    { titleSize: 24, titleH: 0.36, bodySize: 9.4, bodyY: 0.33, max: 115, fill: isLight(mode) ? P.softGray : P.navyCard },
  )

  slide.addText(REPORT_DATE, {
    x: 4.7,
    y: 6.55,
    w: 3.95,
    h: 0.18,
    color: textColor(mode, true),
    fontSize: 9,
    align: "center",
    margin: 0,
  })
  addColorDots(slide, 9.55, 6.2)
  addContactPills(slide, mode, 10.35, 6.12)
}

function addExecutiveSummary(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  const visibleModules = deckModules(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Resumen ejecutivo", "Lectura gerencial del sitio: avance construido, foco de cierre y ruta recomendada.", mode)

  const cards = [
    [
      "Base operacional construida",
      "Base, mantenedores, logistica, bodega y flujos documentales ya sostienen la operacion principal.",
      P.cyan,
    ],
    [
      "Avance alto, no homogeneo",
      "El 78% global es positivo, pero esconde una distribucion desigual: operacion fuerte y finanzas con dependencias.",
      P.orange,
    ],
    [
      "Ruta recomendada",
      client
        ? "Piloto operativo controlado en horizonte 2 a 3 meses, sujeto a insumos y validaciones disponibles."
        : "Piloto operativo controlado antes de perseguir cierre integral de todos los modulos financieros.",
      P.green,
    ],
  ]

  cards.forEach(([title, body, accent], index) => {
    addCard(slide, mode, 0.75 + index * 4.1, 2.0, 3.45, 1.75, title, body, accent, { bodySize: 9.4, max: 165 })
  })

  const stats = [
    ["78%", "avance global"],
    [`${projectMilestones.length}`, "hitos trazados"],
    [`${visibleModules.length}`, client ? "modulos visibles" : "modulos analizados"],
    [client ? "2-3" : "Piloto", client ? "meses gran hito" : "ruta sugerida"],
  ]
  stats.forEach(([value, label], index) => {
    addKpi(slide, mode, 1.25 + index * 2.75, 4.42, value, label, index === 3 ? P.orange : P.cyan, 1.9)
  })

  addCard(
    slide,
    mode,
    2.05,
    5.85,
    9.25,
    0.55,
    "Lectura central",
    "El proyecto no esta detenido: esta en etapa de convertir desarrollo construido en flujo validado, con decisiones de negocio cerradas y casos reales.",
    P.cyan,
    { titleSize: 8.6, bodySize: 8.7, bodyY: 0.2, max: 190, alt: true },
  )
}

function addContext(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Contexto general", "El sitio consolida assessment, hitos, minutas, avances, riesgos y continuidad.", mode)

  addCard(
    slide,
    mode,
    0.78,
    1.92,
    4.2,
    2.55,
    "Proposito del proyecto",
    "Consolidar procesos comerciales, logisticos, productivos y financieros en una plataforma unica, reduciendo dispersion de datos y aumentando trazabilidad entre areas.",
    P.cyan,
    { bodySize: 10, max: 210 },
  )

  addCard(
    slide,
    mode,
    5.28,
    1.92,
    3.35,
    2.55,
    "Lectura de minutas",
    sanitizeClientText(minuteConsolidated.focus),
    P.green,
    { bodySize: 9.2, max: 210 },
  )

  addCard(
    slide,
    mode,
    8.95,
    1.92,
    3.45,
    2.55,
    "Flores",
    client
      ? "Se incorporo progresivamente desde fines de 2025; hoy cuenta con base funcional y requiere validacion de particularidades."
      : flowerOverview.context,
    P.orange,
    { bodySize: 9.1, max: 210 },
  )

  const x0 = 1.1
  const y = 5.28
  slide.addShape("line", {
    x: x0,
    y,
    w: 10.95,
    h: 0,
    line: { color: isLight(mode) ? P.grayLight : "54759A", width: 1.1, transparency: isLight(mode) ? 0 : 30 },
  })
  projectStages.slice(0, 5).forEach((stage, index) => {
    const x = x0 + index * 2.72
    slide.addShape("ellipse", {
      x: x - 0.075,
      y: y - 0.075,
      w: 0.15,
      h: 0.15,
      fill: { color: index > 2 ? P.green : P.cyan },
      line: { color: index > 2 ? P.green : P.cyan },
    })
    slide.addText(stage.title, {
      x: x - 0.58,
      y: y + 0.22,
      w: 1.2,
      h: 0.26,
      color: titleColor(mode),
      fontSize: 8.8,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
    slide.addText(stage.range, {
      x: x - 0.58,
      y: y + 0.57,
      w: 1.2,
      h: 0.16,
      color: textColor(mode, true),
      fontSize: 7.4,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })
}

function addSiteStructure(pptx, logos, mode) {
  const slide = pptx.addSlide()
  addBase(slide, mode, logos)
  addTitle(slide, "Estructura del informe web", "La PPT reorganiza el contenido del sitio en una narrativa ejecutiva.", mode)

  const sections = [
    ["Resumen ejecutivo", "lectura gerencial"],
    ["Linea de tiempo", "hitos y decisiones"],
    ["Flores", "avance y validacion"],
    ["Modulos", "estado funcional"],
    ["Reporteria", "indicadores clave"],
    ["Estimacion", "continuidad"],
    ["Futuras implementaciones", "roadmap posterior"],
    ["Riesgos y minutas", "puntos de atencion"],
  ]
  sections.forEach(([title, body], index) => {
    const col = index % 4
    const row = Math.floor(index / 4)
    addCard(
      slide,
      mode,
      0.78 + col * 3.12,
      2.02 + row * 1.72,
      2.52,
      1.18,
      title,
      body,
      [P.cyan, P.green, P.orange, P.yellow][col],
      { bodySize: 8.6, max: 70 },
    )
  })

  addCard(
    slide,
    mode,
    1.65,
    5.55,
    10.05,
    0.66,
    "Criterio de conversion a PPT",
    "Se sintetizan secciones extensas del sitio, se eliminan elementos de gestion interna en vista cliente y se priorizan bloques, KPIs y lineas de tiempo simples.",
    P.cyan,
    { titleSize: 8.7, bodySize: 8.5, bodyY: 0.21, max: 185, alt: true },
  )
}

function addGeneralState(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  const visibleModules = deckModules(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Estado general", "Alto avance global con distribucion desigual entre capa operativa y cierre financiero.", mode)

  addCard(
    slide,
    mode,
    0.82,
    1.95,
    3.0,
    3.35,
    "78%",
    "avance global tracker. La lectura real separa software construido de validacion funcional completa.",
    P.green,
    { titleSize: 36, titleH: 0.62, bodySize: 10.2, bodyY: 1.02, max: 150, alt: true },
  )

  const strong = visibleModules
    .filter((mod) => mod.progress >= 78)
    .slice(0, 6)
    .map((mod) => `${mod.name} (${moduleValue(mod)})`)
  const critical = visibleModules
    .filter((mod) => mod.progress < 60)
    .slice(0, 6)
    .map((mod) => `${mod.name} (${moduleValue(mod)})`)

  addCard(slide, mode, 4.18, 1.95, 3.85, 3.35, "Mas solido", strong.join("\n"), P.cyan, { bodySize: 9.2, max: 230 })
  addCard(
    slide,
    mode,
    8.38,
    1.95,
    3.95,
    3.35,
    client ? "Focos de cierre" : "Por reforzar",
    critical.join("\n"),
    P.orange,
    { bodySize: 9.2, max: 230 },
  )

  slide.addText(client
    ? "El hito recomendado es un piloto operativo controlado de 2 a 3 meses, condicionado a insumos, datos y validacion del cliente."
    : "El 78% no significa cierre homogeneo: el tramo pendiente concentra reglas, datos, integraciones y validacion transversal.", {
    x: 1.12,
    y: 5.85,
    w: 11.1,
    h: 0.28,
    color: titleColor(mode),
    fontSize: 12.2,
    bold: true,
    align: "center",
    margin: 0,
    fit: "shrink",
  })
}

function addModuleDetail(pptx, logos, mode) {
  const slide = pptx.addSlide()
  addBase(slide, mode, logos)
  addTitle(slide, "Detalle por componente", "Componentes mas relevantes para cierre, adopcion y valor operacional.", mode)

  const cards = [
    ["Operacion logistica", "Base, logistica, bodega y mantenedores sostienen ordenes, itinerarios e instructivos.", "100% / 94%", P.cyan],
    ["Packing List / SC", "Packing List opera como eje documental para reportes, facturacion, costos y liquidaciones.", "En validacion", P.green],
    ["Flores", "Puede crear itinerarios, tarifas, ordenes, instructivos y Packing List; se trabaja en facturas y liquidaciones.", flowerOverview.progress, P.green],
    ["Facturacion", "Proformas, documentos internos, DTE/SII y Softland requieren validacion end-to-end.", "57%", P.orange],
    ["Liquidaciones", "Reglas de calculo, rebates, prorrateos y homologacion Frutas/Flores siguen como definicion clave.", "46%", P.orange],
    ["Cuentas Corrientes", "Saldos, anticipos, pagos y conciliaciones deben priorizarse cuando el flujo financiero este estable.", "4%", P.pink],
  ]

  cards.forEach(([title, body, status, accent], index) => {
    const col = index % 3
    const row = Math.floor(index / 3)
    addCard(slide, mode, 0.78 + col * 4.1, 1.95 + row * 1.86, 3.45, 1.36, title, `${body}\n\nEstado: ${status}`, accent, {
      bodySize: 8.5,
      max: 185,
    })
  })
}

function addGapsAndRisks(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(
    slide,
    "Brechas y puntos de atencion",
    client
      ? "Validaciones y definiciones necesarias para convertir avance en uso productivo."
      : "Riesgo concentrado en reglas financieras, datos, integraciones y validacion integral.",
    mode,
  )

  const riskItems = deckRisks(audience).slice(0, 5)
  riskItems.forEach(([name, severity, comment], index) => {
    const y = 1.95 + index * 0.74
    slide.addText(`${index + 1}.`, {
      x: 0.9,
      y,
      w: 0.32,
      h: 0.2,
      color: index < 3 ? P.orange : P.cyan,
      fontSize: 12.5,
      bold: true,
      margin: 0,
    })
    slide.addText(name, {
      x: 1.35,
      y,
      w: 3.55,
      h: 0.2,
      color: titleColor(mode),
      fontSize: 10.6,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(severity, {
      x: 5.05,
      y,
      w: 1.05,
      h: 0.18,
      color: index < 3 ? P.orange : P.cyan,
      fontSize: 8.4,
      bold: true,
      margin: 0,
    })
    slide.addText(shortText(comment, 112), {
      x: 6.25,
      y,
      w: 5.35,
      h: 0.22,
      color: textColor(mode, true),
      fontSize: 8.9,
      margin: 0,
      fit: "shrink",
    })
  })

  addCard(
    slide,
    mode,
    1.05,
    5.78,
    10.95,
    0.58,
    "Mitigacion",
    "Priorizar piloto controlado, cerrar reglas por bloque, validar con datos reales y formalizar responsables de definicion Chilfresh.",
    P.cyan,
    { titleSize: 8.7, bodySize: 8.7, bodyY: 0.2, max: 180, alt: true },
  )
}

function addNextSteps(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const client = isClientAudience(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Proximos pasos", "Secuencia recomendada para llevar el avance construido a validacion productiva.", mode)

  const steps = [
    ["01", "Mesa Flores", "Validar particularidades, ventas, costos, facturas y liquidaciones."],
    ["02", "PL/SC real", "Probar multi-supplier, contenedores, reportes y excepciones."],
    ["03", "Reglas financieras", "Cerrar facturacion, liquidaciones, rebates y prorrateos."],
    ["04", "Softland/SII", "Validar equivalencias, documentos y trazabilidad."],
    ["05", client ? "Marcha blanca" : "UAT / marcha blanca", "Capacitacion, observaciones y salida controlada por etapas."],
  ]

  const y = 2.7
  slide.addShape("line", {
    x: 1.18,
    y,
    w: 10.8,
    h: 0,
    line: { color: isLight(mode) ? P.grayLight : "54759A", width: 1.2, transparency: isLight(mode) ? 0 : 30 },
  })
  steps.forEach(([num, title, body], index) => {
    const x = 1.05 + index * 2.55
    const accent = index === 0 ? P.green : index === 2 ? P.orange : P.cyan
    slide.addShape("ellipse", {
      x: x + 0.26,
      y: y - 0.23,
      w: 0.46,
      h: 0.46,
      fill: { color: accent },
      line: { color: accent },
    })
    slide.addText(num, {
      x: x + 0.26,
      y: y - 0.08,
      w: 0.46,
      h: 0.12,
      color: P.white,
      fontSize: 8.5,
      bold: true,
      align: "center",
      margin: 0,
    })
    slide.addText(title, {
      x: x - 0.28,
      y: y + 0.62,
      w: 1.55,
      h: 0.24,
      color: titleColor(mode),
      fontSize: 10.4,
      bold: true,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
    slide.addText(shortText(body, 75), {
      x: x - 0.42,
      y: y + 1.0,
      w: 1.84,
      h: 0.52,
      color: textColor(mode, true),
      fontSize: 8.1,
      align: "center",
      margin: 0,
      fit: "shrink",
    })
  })

  const scenario = client ? clientScenarioTimeModel.pilot.value : scenarios.pilot.calendar
  addCard(
    slide,
    mode,
    2.55,
    5.55,
    8.2,
    0.72,
    client ? "Horizonte del gran hito" : "Escenario piloto",
    client
      ? `${scenario}: sujeto a insumos, reglas y responsables de validacion disponibles.`
      : `${scenario}: validar flujo real antes de cierre integral.`,
    P.orange,
    { titleSize: 9.2, bodySize: 8.7, bodyY: 0.22, max: 160, alt: true },
  )
}

function addFutureImplementations(pptx, logos, mode) {
  const slide = pptx.addSlide()
  addBase(slide, mode, logos)
  addTitle(slide, "Evolucion futura de la plataforma", "Oportunidades posteriores al cierre base, ordenadas por horizonte y valor operacional.", mode)

  addCard(
    slide,
    mode,
    0.8,
    1.92,
    4.25,
    2.05,
    futureImplementationSummary.title,
    futureImplementationSummary.reading,
    P.cyan,
    { bodySize: 9.2, max: 245 },
  )

  futureImplementationHorizons.forEach((item, index) => {
    addCard(
      slide,
      mode,
      5.38 + index * 2.22,
      1.92,
      1.98,
      2.05,
      item.horizon,
      `${item.focus}\n${item.items.slice(0, 3).join("\n")}`,
      index === 0 ? P.orange : index === 1 ? P.cyan : P.purple,
      { titleSize: 10.2, bodySize: 7.6, max: 150 },
    )
  })

  const priorityItems = futureImplementations.filter((item) => item.priority === "Alta").slice(0, 5)
  priorityItems.forEach((item, index) => {
    const y = 4.6 + index * 0.33
    slide.addText(`${index + 1}. ${item.title}`, {
      x: 1.05,
      y,
      w: 4.4,
      h: 0.18,
      color: titleColor(mode),
      fontSize: 8.8,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(`${item.horizon} / ${item.category}`, {
      x: 5.68,
      y,
      w: 2.25,
      h: 0.16,
      color: P.orange,
      fontSize: 7.8,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(shortText(item.benefit, 105), {
      x: 8.05,
      y,
      w: 4.0,
      h: 0.16,
      color: textColor(mode, true),
      fontSize: 7.8,
      margin: 0,
      fit: "shrink",
    })
  })
}

function addConclusion(pptx, logos, mode, audience) {
  const slide = pptx.addSlide()
  const visibleFindings = deckFindings(audience)
  addBase(slide, mode, logos)
  addTitle(slide, "Conclusion", "Sintesis ejecutiva para orientar continuidad con foco y control.", mode)

  addCard(
    slide,
    mode,
    1.15,
    1.78,
    11.05,
    1.15,
    "Chilfresh ya cuenta con una base funcional relevante",
    "El cierre debe priorizar definiciones, validacion con casos reales e integracion financiera.",
    P.cyan,
    { titleSize: 17, bodySize: 11.2, bodyY: 0.58, max: 145, alt: true },
  )

  const cards = [
    ["1", visibleFindings[0][0], "La plataforma existe y tiene avances reales, especialmente en la capa operacional.", P.green],
    ["2", visibleFindings[1][0], "El avance global es alto, pero el tramo pendiente concentra mayor complejidad funcional.", P.orange],
    ["3", visibleFindings[2][0], "La continuidad debe ordenar reglas, datos, integraciones y validacion con usuarios clave.", P.cyan],
  ]
  cards.forEach(([num, title, body, accent], index) => {
    const x = 1.16 + index * 3.9
    slide.addShape("ellipse", {
      x,
      y: 3.75,
      w: 0.38,
      h: 0.38,
      fill: { color: accent },
      line: { color: accent },
    })
    slide.addText(num, {
      x,
      y: 3.88,
      w: 0.38,
      h: 0.1,
      color: P.white,
      fontSize: 7.8,
      bold: true,
      align: "center",
      margin: 0,
    })
    slide.addText(title, {
      x: x + 0.52,
      y: 3.7,
      w: 2.8,
      h: 0.3,
      color: titleColor(mode),
      fontSize: 11.2,
      bold: true,
      margin: 0,
      fit: "shrink",
    })
    slide.addText(shortText(body, 105), {
      x: x + 0.52,
      y: 4.16,
      w: 2.8,
      h: 0.48,
      color: textColor(mode, true),
      fontSize: 8.5,
      margin: 0,
      fit: "shrink",
    })
  })

  addColorDots(slide, 5.92, 6.02)
  addContactPills(slide, mode, SLIDE_W / 2, 6.22, true)
}

function buildDeck(pptxgen, logos, mode, audience = "internal") {
  const pptx = setupPresentation(pptxgen, mode)
  addCover(pptx, logos, mode)
  addExecutiveSummary(pptx, logos, mode, audience)
  addContext(pptx, logos, mode, audience)
  addSiteStructure(pptx, logos, mode)
  addGeneralState(pptx, logos, mode, audience)
  addModuleDetail(pptx, logos, mode, audience)
  addGapsAndRisks(pptx, logos, mode, audience)
  addNextSteps(pptx, logos, mode, audience)
  addFutureImplementations(pptx, logos, mode, audience)
  addConclusion(pptx, logos, mode, audience)
  return pptx
}

export async function downloadProjectPpt(audience = "internal") {
  const { default: pptxgen } = await import("pptxgenjs")
  const logos = await loadBrandLogos()
  const pptx = buildDeck(pptxgen, logos, "dark", audience)
  const suffix = isClientAudience(audience) ? "_Cliente" : ""
  await pptx.writeFile({
    fileName: `Reporte_Chilfresh_Sitio_Ejecutivo${suffix}_Oscuro_2026-06-18.pptx`,
    compression: true,
  })
}

export async function downloadProjectPptLight(audience = "internal") {
  const { default: pptxgen } = await import("pptxgenjs")
  const logos = await loadBrandLogos()
  const pptx = buildDeck(pptxgen, logos, "light", audience)
  const suffix = isClientAudience(audience) ? "_Cliente" : ""
  await pptx.writeFile({
    fileName: `Reporte_Chilfresh_Sitio_Ejecutivo${suffix}_Claro_2026-06-18.pptx`,
    compression: true,
  })
}
