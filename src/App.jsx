import { useEffect, useState } from "react"
import { ConclusionsSection } from "./components/ConclusionsSection"
import { DelayAttributionSection } from "./components/DelayAttributionSection"
import { EstimationSection } from "./components/EstimationSection"
import { ExecutiveSummary } from "./components/ExecutiveSummary"
import { FlowersSection } from "./components/FlowersSection"
import { FutureImplementationsSection } from "./components/FutureImplementationsSection"
import { Hero } from "./components/Hero"
import { MinutesSection } from "./components/MinutesSection"
import { ModulesSection } from "./components/ModulesSection"
import { ReportingSection } from "./components/ReportingSection"
import { RisksSection } from "./components/RisksSection"
import { Sidebar } from "./components/Sidebar"
import { SummarySection } from "./components/SummarySection"
import { TimelineSection } from "./components/TimelineSection"
import { useReveal } from "./hooks/useReveal"
import "./styles.css"

export default function App() {
  const [navOpen, setNavOpen] = useState(false)
  const [activeHref, setActiveHref] = useState("#linea-tiempo")
  const [audienceMode, setAudienceMode] = useState("internal")
  const [reportMode, setReportMode] = useState("executive")
  const [themeMode, setThemeMode] = useState(() => window.localStorage.getItem("chilfresh-report-theme") || "dark")
  useReveal()

  useEffect(() => {
    document.documentElement.dataset.theme = themeMode
    window.localStorage.setItem("chilfresh-report-theme", themeMode)
  }, [themeMode])

  function handleNavigate(href) {
    setActiveHref(href)
    setNavOpen(false)
  }

  function handleOpenReport(mode) {
    setAudienceMode(mode)
    setReportMode("full")
    setActiveHref("#linea-tiempo")
    setNavOpen(false)
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0)
  }

  function handleOpenExecutiveSummary() {
    setReportMode("executive")
    setNavOpen(false)
    window.setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0)
  }

  return (
    <div
      className={`app theme-${themeMode} ${reportMode === "executive" ? "executive-mode" : ""} ${navOpen ? "nav-open" : ""} ${reportMode === "full" && audienceMode === "client" ? "client-view" : ""}`}
    >
      {reportMode === "full" && <Sidebar activeHref={activeHref} audienceMode={audienceMode} onNavigate={handleNavigate} />}
      <main className="content">
        {reportMode === "executive" ? (
          <ExecutiveSummary
            themeMode={themeMode}
            onThemeModeChange={setThemeMode}
            onOpenReport={handleOpenReport}
          />
        ) : (
          <>
            <Hero
              audienceMode={audienceMode}
              onAudienceModeChange={setAudienceMode}
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              onMenuClick={() => setNavOpen((value) => !value)}
              onOpenExecutiveSummary={handleOpenExecutiveSummary}
            />
            <TimelineSection audienceMode={audienceMode} />
            <FlowersSection audienceMode={audienceMode} />
            <SummarySection audienceMode={audienceMode} />
            <ModulesSection audienceMode={audienceMode} />
            <ReportingSection audienceMode={audienceMode} />
            <EstimationSection audienceMode={audienceMode} />
            <FutureImplementationsSection audienceMode={audienceMode} />
            <RisksSection audienceMode={audienceMode} />
            <DelayAttributionSection audienceMode={audienceMode} />
            <MinutesSection audienceMode={audienceMode} />
            <ConclusionsSection audienceMode={audienceMode} />
          </>
        )}
      </main>
    </div>
  )
}
