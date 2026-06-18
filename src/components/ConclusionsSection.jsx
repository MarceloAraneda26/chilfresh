import { findings } from "../data/reportData"

const clientFindings = [
  ["El proyecto tiene base real construida", "Hay plataforma de pruebas, mantenedores, logistica, bodega, Packing List base, SII/DTE y avances en Flores. La continuidad debe enfocarse en estabilizar el cierre productivo."],
  ["El 78% muestra avance relevante", "La cifra global es positiva, pero debe leerse por capas: operacion muy avanzada y modulos financieros con dependencias de cierre."],
  ["Finanzas concentra el mayor foco", "Liquidaciones, Cuentas Corrientes, Facturacion/Documentos y Contratos dependen de definiciones, integraciones y homologacion Frutas/Flores."],
  ["La ruta recomendada es piloto controlado", "Estabilizar Packing List, Shipment Confirmation y facturacion antes de perseguir cierre integral de todos los modulos financieros."],
]

export function ConclusionsSection({ audienceMode }) {
  const isClientView = audienceMode === "client"
  const visibleFindings = isClientView ? clientFindings : findings

  return (
    <>
      <section className="section" id="conclusiones" data-reveal>
        <div className="section-head">
          <div>
            <h2>Conclusiones ejecutivas</h2>
            <p className="section-note">
              {isClientView
                ? "Sintesis preparada para conversacion con gerencia cliente y equipos de decision."
                : "Sintesis para conversacion con equipo tecnico, negocio y stakeholders."}
            </p>
          </div>
        </div>
        <div className="findings-grid">
          {visibleFindings.map(([title, text]) => (
            <article className="finding" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="footer">
        {isClientView
          ? "Vista ejecutiva preparada para revision con gerencia del cliente. Cifras y escenarios sujetos a validacion formal de alcance."
          : "Reporte interactivo React generado desde el assessment Chilfresh. No reemplaza una cotizacion formal ni una prueba funcional autenticada con datos productivos."}
      </footer>
    </>
  )
}
