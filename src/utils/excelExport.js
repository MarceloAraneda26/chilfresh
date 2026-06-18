import {
  flowerClosingFactors,
  flowerLiquidationTypes,
  flowerOpenItems,
  flowerOverview,
  futureImplementationHorizons,
  futureImplementations,
  futureImplementationSummary,
  modules,
} from "../data/reportData"

const fileName = "Reporte_Chilfresh_Tareas_Avance_2026-06-18.xls"

function escapeXml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
}

function cell(value, type = "String", style = "") {
  const styleAttr = style ? ` ss:StyleID="${style}"` : ""
  if (type === "Number") {
    const numeric = Number.isFinite(Number(value)) ? Number(value) : 0
    return `<Cell${styleAttr}><Data ss:Type="Number">${numeric}</Data></Cell>`
  }
  return `<Cell${styleAttr}><Data ss:Type="String">${escapeXml(value)}</Data></Cell>`
}

function row(values, style = "") {
  return `<Row>${values.map((item) => {
    if (Array.isArray(item)) return cell(item[0], item[1], item[2] || style)
    return cell(item, "String", style)
  }).join("")}</Row>`
}

function worksheet(name, rows, columnWidths = []) {
  const columns = columnWidths.map((width) => `<Column ss:Width="${width}"/>`).join("")
  return `
    <Worksheet ss:Name="${escapeXml(name)}">
      <Table>
        ${columns}
        ${rows.join("\n")}
      </Table>
      <WorksheetOptions xmlns="urn:schemas-microsoft-com:office:excel">
        <FreezePanes/>
        <FrozenNoSplit/>
        <SplitHorizontal>1</SplitHorizontal>
        <TopRowBottomPane>1</TopRowBottomPane>
        <ActivePane>2</ActivePane>
      </WorksheetOptions>
    </Worksheet>
  `
}

function buildSummaryRows() {
  const average = modules.reduce((sum, item) => sum + item.progress, 0) / modules.length
  const completed = modules.filter((item) => item.progress >= 80).length
  const inProgress = modules.filter((item) => item.progress > 0 && item.progress < 80).length
  const pending = modules.filter((item) => item.progress === 0).length

  return [
    row(["Indicador", "Valor"], "Header"),
    row(["Avance global reportado", ["0.78", "Number", "Percent"]]),
    row(["Promedio simple de tareas/modulos", [average / 100, "Number", "Percent"]]),
    row(["Total tareas/modulos", [modules.length, "Number"]]),
    row(["Avanzados o completados", [completed, "Number"]]),
    row(["En progreso", [inProgress, "Number"]]),
    row(["Sin avance reportado", [pending, "Number"]]),
    row(["Corte documental", "17 de junio de 2026"]),
    row(["Archivo generado", new Date().toLocaleString("es-CL")]),
  ]
}

function buildTaskRows() {
  const rows = [
    row([
      "ID",
      "Tarea / modulo",
      "Avance %",
      "Valor visible",
      "Estado",
      "Grupo",
      "Lectura",
      "Pendientes principales",
    ], "Header"),
  ]

  modules.forEach((item, index) => {
    rows.push(row([
      [`${index + 1}`, "Number"],
      item.name,
      [item.progress / 100, "Number", "Percent"],
      item.display || `${item.progress}%`,
      item.status,
      item.group,
      item.reading,
      item.pending.join(" | "),
    ]))
  })

  return rows
}

function buildPendingRows() {
  const rows = [
    row(["ID", "Tarea / modulo", "Avance %", "Estado", "Pendiente / foco", "Tipo"], "Header"),
  ]

  modules.forEach((item, moduleIndex) => {
    item.pending.forEach((pending, pendingIndex) => {
      rows.push(row([
        `${moduleIndex + 1}.${pendingIndex + 1}`,
        item.name,
        [item.progress / 100, "Number", "Percent"],
        item.status,
        pending,
        item.progress >= 80 ? "Validacion / cierre" : item.progress > 0 ? "Definicion / avance" : "Pendiente",
      ]))
    })
  })

  return rows
}

function buildFlowersRows() {
  return [
    row(["Bloque", "Detalle", "Avance / estado"], "Header"),
    row(["Estado general", flowerOverview.status, flowerOverview.progress]),
    row(["Riesgo", flowerOverview.risk, "Medio-alto"]),
    row(["Lectura", flowerOverview.reading, ""]),
    row(["Contexto", flowerOverview.context, ""]),
    ...flowerOpenItems.map((item, index) => row([`Definicion abierta ${index + 1}`, item, "Pendiente"])),
    ...flowerLiquidationTypes.map(([title, text]) => row([`Liquidacion ${title}`, text, "Por definir"])),
    ...flowerClosingFactors.map((item, index) => row([`Factor de cierre ${index + 1}`, item, "Necesario para cierre"])),
  ]
}

function buildFutureRows() {
  return [
    row(["Bloque", "Titulo", "Horizonte", "Categoria", "Prioridad", "Resumen / foco", "Beneficio / ejemplos"], "Header"),
    row(["Resumen", futureImplementationSummary.title, "", "", "", futureImplementationSummary.reading, futureImplementationSummary.note]),
    ...futureImplementationHorizons.map((item) => row([
      "Horizonte",
      item.horizon,
      item.horizon,
      "",
      "",
      item.focus,
      item.items.join(" | "),
    ])),
    ...futureImplementations.map((item) => row([
      "Iniciativa",
      item.title,
      item.horizon,
      item.category,
      item.priority,
      item.summary,
      `${item.benefit} | ${item.examples.join(" | ")}`,
    ])),
  ]
}

function buildWorkbookXml() {
  const styles = `
    <Styles>
      <Style ss:ID="Default" ss:Name="Normal">
        <Alignment ss:Vertical="Top" ss:WrapText="1"/>
        <Font ss:FontName="Aptos" ss:Size="10" ss:Color="#1E2C45"/>
      </Style>
      <Style ss:ID="Header">
        <Font ss:FontName="Aptos" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
        <Interior ss:Color="#1E2C45" ss:Pattern="Solid"/>
        <Alignment ss:Vertical="Center" ss:WrapText="1"/>
      </Style>
      <Style ss:ID="Percent">
        <NumberFormat ss:Format="0%"/>
        <Alignment ss:Vertical="Top"/>
      </Style>
    </Styles>
  `

  return `<?xml version="1.0" encoding="UTF-8"?>
    <?mso-application progid="Excel.Sheet"?>
    <Workbook
      xmlns="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
      xmlns:html="http://www.w3.org/TR/REC-html40">
      ${styles}
      ${worksheet("Resumen", buildSummaryRows(), [190, 180])}
      ${worksheet("Tareas y avance", buildTaskRows(), [42, 230, 78, 90, 110, 88, 380, 420])}
      ${worksheet("Pendientes por modulo", buildPendingRows(), [54, 230, 78, 110, 430, 130])}
      ${worksheet("Flores", buildFlowersRows(), [150, 520, 160])}
      ${worksheet("Futuras implementaciones", buildFutureRows(), [120, 230, 110, 130, 90, 360, 520])}
    </Workbook>`
}

export function downloadTasksExcel() {
  const blob = new Blob([buildWorkbookXml()], {
    type: "application/vnd.ms-excel;charset=utf-8",
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}
