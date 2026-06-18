import {
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  FileText,
  LayoutDashboard,
  Leaf,
  LineChart,
  Menu,
  Rocket,
  Route,
  ScrollText,
} from "lucide-react"

const navItems = [
  { href: "#linea-tiempo", label: "Linea de tiempo", icon: Route },
  { href: "#flores", label: "Flores", icon: Leaf },
  { href: "#resumen", label: "Resumen", icon: LayoutDashboard },
  { href: "#modulos", label: "Modulos", icon: BarChart3 },
  { href: "#reporteria", label: "Reporteria", icon: LineChart },
  { href: "#estimacion", label: "Estimacion", icon: CheckCircle2 },
  { href: "#futuras-implementaciones", label: "Futuras impl.", icon: Rocket },
  { href: "#riesgos", label: "Riesgos", icon: AlertTriangle },
  { href: "#minutas", label: "Minutas", icon: ScrollText },
  { href: "#conclusiones", label: "Conclusiones", icon: FileText },
]

export function Sidebar({ activeHref, audienceMode, onNavigate }) {
  const isClientView = audienceMode === "client"

  return (
    <aside className="sidebar" aria-label="Navegacion del reporte interactivo">
      <div className="brand">
        <div className="brand-mark">CF</div>
        <div>
          <p className="brand-title">Chilfresh</p>
          <p className="brand-subtitle">Linea de tiempo y estado real</p>
        </div>
      </div>

      <nav className="nav">
        {navItems.map(({ href, label, icon: Icon }) => (
          <a
            className={activeHref === href ? "active" : ""}
            href={href}
            key={href}
            onClick={() => onNavigate(href)}
          >
            <Icon className="icon" aria-hidden="true" />
            {label}
          </a>
        ))}
      </nav>

      <div className="sidebar-note">
        {isClientView
          ? "Vista ejecutiva para presentacion cliente. Corte documental: 17 de junio de 2026. Avance general actualizado: 78%."
          : "Corte documental: 17 de junio de 2026. Avance tracker actualizado: 78%. Pruebas integradas: sin dato visible."}
      </div>

      {!isClientView && (
        <div className="sidebar-mini">
          <Menu className="icon" aria-hidden="true" />
          React/Vite build
        </div>
      )}
    </aside>
  )
}
