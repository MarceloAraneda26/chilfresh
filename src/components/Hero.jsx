import { useState } from "react"
import { Eye, FileDown, FileText, LayoutDashboard, Menu, Moon, Printer, Settings2, Sun } from "lucide-react"
import chilfreshMark from "../assets/brand/chilfresh-mark.png"
import tiboxMark from "../assets/brand/tibox-mark.png"
import { downloadTasksExcel } from "../utils/excelExport"
import { downloadProjectPpt, downloadProjectPptLight } from "../utils/pptExport"

export function Hero({ audienceMode, onAudienceModeChange, themeMode, onThemeModeChange, onMenuClick, onOpenExecutiveSummary }) {
  const [generatingPptMode, setGeneratingPptMode] = useState(null)
  const [generatingExcel, setGeneratingExcel] = useState(false)
  const isClientView = audienceMode === "client"
  const reportHref = `${import.meta.env.BASE_URL}Reporte_Assessment_Estimacion_Estado_Real_Chilfresh_2026-06-17.md`

  async function handleDownloadPpt(mode) {
    setGeneratingPptMode(mode)
    try {
      if (mode === "light") {
        await downloadProjectPptLight(audienceMode)
      } else {
        await downloadProjectPpt(audienceMode)
      }
    } catch {
      window.alert("No se pudo generar el PPT. Intenta nuevamente desde el navegador.")
    } finally {
      setGeneratingPptMode(null)
    }
  }

  function handleDownloadExcel() {
    setGeneratingExcel(true)
    try {
      downloadTasksExcel()
    } catch {
      window.alert("No se pudo generar el Excel. Intenta nuevamente desde el navegador.")
    } finally {
      window.setTimeout(() => setGeneratingExcel(false), 300)
    }
  }

  return (
    <header className="topbar">
      <div className="topbar-layout">
        <div className="topbar-main">
          <div className="topbar-head">
            <div className="brand-zone">
              <button className="btn mobile-toggle" type="button" onClick={onMenuClick} aria-label="Abrir menu">
                <Menu className="icon" aria-hidden="true" />
                Menu
              </button>

              <div className="project-brand-lockup" aria-label="Participantes del proyecto">
                <article className="project-brand-card tibox">
                  <img src={tiboxMark} alt="Logo TIBOX" />
                  <div>
                    <span>Equipo de desarrollo y liderazgo</span>
                    <strong>TIBOX</strong>
                  </div>
                </article>
                <article className="project-brand-card chilfresh">
                  <img src={chilfreshMark} alt="Logo Chilfresh" />
                  <div>
                    <span>Cliente</span>
                    <strong>Chilfresh</strong>
                  </div>
                </article>
              </div>
            </div>

            <div className="utility-actions" aria-label="Utilidades del reporte">
              <button className="btn" type="button" onClick={onOpenExecutiveSummary}>
                <LayoutDashboard className="icon" aria-hidden="true" />
                Resumen ejecutivo
              </button>
              <div className="audience-toggle theme-toggle" aria-label="Selector de tema de la pagina">
                <button
                  className={themeMode === "dark" ? "active" : ""}
                  type="button"
                  onClick={() => onThemeModeChange("dark")}
                >
                  <Moon className="icon" aria-hidden="true" />
                  Oscura
                </button>
                <button
                  className={themeMode === "light" ? "active" : ""}
                  type="button"
                  onClick={() => onThemeModeChange("light")}
                >
                  <Sun className="icon" aria-hidden="true" />
                  Clara
                </button>
              </div>
            </div>
          </div>

          <div className="hero-copy">
            <div className="hero-eyebrow">Assessment tecnologico y estado real</div>
            <h1 className="hero-title" aria-label="Proyecto Chilfresh Timeline">
              <span className="title-cyan">Proyecto</span>
              <span className="title-gradient">Chilfresh</span>
              <span className="title-white">Timeline</span>
            </h1>
            <p className="lead">
              {isClientView
                ? "Vista ejecutiva para gerencia: resume los hitos relevantes, avance construido, decisiones de negocio, riesgos de cierre y ruta recomendada para continuidad productiva."
                : "Vista interactiva del desarrollo completo: desde el levantamiento inicial y las definiciones internas, hasta los avances construidos, mesas de trabajo, validaciones, estado real actual y margen pendiente para cierre productivo."}
            </p>
            <div className="hero-metrics" aria-label="Indicadores principales">
              <span><strong>78%</strong> avance global</span>
              <span><strong>26</strong> hitos trazados</span>
              {isClientView ? (
                <span><strong>15</strong> modulos visibles</span>
              ) : (
                <span><strong>25</strong> tareas sin duracion</span>
              )}
            </div>
          </div>
        </div>

        <aside className="action-panel" aria-label="Acciones del reporte">
          <div className="action-group">
            <span className="action-label">Vista</span>
            <div className="audience-toggle" aria-label="Selector de vista del reporte">
              <button
                className={audienceMode === "internal" ? "active" : ""}
                type="button"
                onClick={() => onAudienceModeChange("internal")}
              >
                <Settings2 className="icon" aria-hidden="true" />
                Interna
              </button>
              <button
                className={audienceMode === "client" ? "active" : ""}
                type="button"
                onClick={() => onAudienceModeChange("client")}
              >
                <Eye className="icon" aria-hidden="true" />
                Cliente
              </button>
            </div>
          </div>

          <div className="action-group">
            <span className="action-label">Exportar</span>
            <div className="action-grid">
              <button className="btn" type="button" onClick={() => window.print()}>
                <Printer className="icon" aria-hidden="true" />
                Imprimir
              </button>
              <button
                className="btn ppt-download"
                type="button"
                onClick={() => handleDownloadPpt("dark")}
                disabled={Boolean(generatingPptMode)}
              >
                <FileDown className="icon" aria-hidden="true" />
                {generatingPptMode === "dark" ? "Generando..." : "PPT oscuro"}
              </button>
              <button
                className="btn ppt-download light"
                type="button"
                onClick={() => handleDownloadPpt("light")}
                disabled={Boolean(generatingPptMode)}
              >
                <Sun className="icon" aria-hidden="true" />
                {generatingPptMode === "light" ? "Generando..." : "PPT claro"}
              </button>
              <button
                className="btn excel-download"
                type="button"
                onClick={handleDownloadExcel}
                disabled={generatingExcel}
              >
                <FileDown className="icon" aria-hidden="true" />
                {generatingExcel ? "Generando..." : "Excel tareas"}
              </button>
            </div>
          </div>

          <a className="btn primary action-document" href={reportHref}>
            <FileText className="icon" aria-hidden="true" />
            Ver reporte completo
          </a>
        </aside>
      </div>
    </header>
  )
}
