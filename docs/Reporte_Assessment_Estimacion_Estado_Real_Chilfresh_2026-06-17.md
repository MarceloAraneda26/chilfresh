# Reporte consolidado - Assessment, estimacion y estado real del desarrollo Chilfresh

Fecha de corte: 17 de junio de 2026  
Base documental: carpetas `Assessment`, `Minutas`, documentos raiz, resumenes funcionales, tracking de modulos, Lighthouse y reportes internos.  
Elaborado desde revision documental cruzada.

## 1. Resumen ejecutivo

El proyecto Chilfresh no esta detenido ni en una fase solamente conceptual. Existe una plataforma de pruebas activa, con base de datos, login, mantenedores, modulos operativos, filtros, cargas Excel, documentos y flujos funcionales ya implementados o parcialmente implementados.

El estado real, sin embargo, no debe leerse solo desde el avance de pantallas o tareas completadas. El tracking de modulos al 16-06-2026 muestra un avance global de 58%, pero las pruebas integradas estan solo al 4%. Esto indica que el sistema tiene una base funcional importante, aunque todavia no esta cerrado como plataforma productiva integral.

La diferencia principal entre la estimacion inicial y el estado actual se explica por tres factores:

1. El assessment original estimo 923 HH y 12 sprints sobre supuestos de definicion funcional relativamente estable.
2. El alcance real crecio durante el proyecto: Flores, Comet, saldos historicos, Softland/SII, prorrateos, liquidaciones masivas, versionamiento, cierre de embarque, auditoria, cuentas corrientes y reglas por tipo de operacion.
3. Los modulos que hoy concentran la brecha no son los mas tecnicos, sino los que dependen de reglas de negocio internas de Chilfresh: Liquidaciones, Cuentas Corrientes, Facturacion, Contratos/Royalties, reportes por cliente, cierre logistico y homologacion Frutas/Flores.

Lectura ejecutiva: Chilfresh cuenta con un MVP operacional avanzado en ambiente de pruebas, pero aun no con una plataforma productiva cerrada de punta a punta. El cuello de botella real esta en definiciones, validaciones integradas y estabilizacion de los flujos financiero-documentales.

## 2. Fuentes revisadas

Se procesaron 33 fuentes iniciales y se recuperaron 2 fuentes que estaban abiertas en Office mediante copia local para analisis. Las fuentes mas relevantes fueron:

| Fuente | Aporte principal |
|---|---|
| `Assessment/Diagnostico y Propuesta de Rediseno del Ecosistema Tecnologico de Chilfresh.pdf` | Diagnostico inicial, alcance propuesto, metodologia y roadmap. |
| `Assessment/Kick-off Chilfresh.pptx` | Linea base de 923 HH, 12 sprints, distribucion de esfuerzo y enfoque Scrumban. |
| `Assessment/Reporte_Modulos_Sistema_de_Gestion_-_Chilfresh_16-06-2026.xlsx` | Estado cuantitativo por modulo al 16-06-2026. |
| `Minutas/Informe Comparativo - Estimacion vs Real - Proyecto Chilfresh.docx` | Explicacion documentada del desfase entre estimacion y desarrollo real. |
| `Minutas/Informe de Estado - Proyecto Chilfresh v2.docx` | Estado funcional por modulo, pendientes y riesgos consolidados. |
| Minutas de sprint review desde 08-09-2025 hasta 09-06-2026 | Evolucion cronologica del alcance, avances, validaciones y pendientes. |
| `Resumen_Modulo_Logistica_Chilfresh.pdf` | Estado funcional del modulo Logistica y pendientes de cierre, flete, rebate y tracking. |
| `resumen_modulo_packing_list_chilfresh_ampliado.pdf` | Estado funcional de Packing List, tipos, flujos, pendientes y validaciones. |
| `Resumen_Modulo_Liquidaciones_Chilfresh.pdf` | Definicion conceptual, riesgos y pendientes del modulo Liquidaciones. |
| `Glosario_Maestro_Chilfresh_v3.docx` | Terminologia oficial, 192 terminos en 9 categorias. |
| `analisis_contenido_chilfresh.md` y Lighthouse JSON | Revision funcional visible de la plataforma y evidencia tecnica del login. |

Limitacion: no se realizo prueba funcional autenticada creando registros reales ni revision de codigo fuente. El reporte cruza evidencia documental, planilla de avance, minutas, resumenes funcionales y revision tecnica de login.

## 3. Assessment realizado

El assessment inicial identifico un ecosistema tecnologico fragmentado, compuesto por:

| Sistema / fuente | Situacion diagnosticada |
|---|---|
| Sistema Verde | Gestion comercial historica, logistica, liquidaciones y cuentas corrientes; monolitico y con alta carga manual. |
| Sistema Azul | Plataforma documental/exportadora con instructivos, packing list y reportes; mejor interfaz, pero sin integracion completa con Verde. |
| Liquidacion de Flores | Sistema separado, con dependencia de Excel y criterios de calculo no integrados. |
| Visitas Flores | Registro tecnico separado, con bajo cruce con calidad, produccion o exportacion. |
| Calidad | Sistema web independiente, sin conexion directa con embarques, liquidaciones o finanzas. |
| Excel y procesos manuales | Itinerarios, reservas, consolidaciones, reportes, cierres y validaciones con alta intervencion manual. |

El assessment propuso una plataforma web unificada, modular y escalable, con base de datos relacional, mantenedores transversales, trazabilidad, validaciones automaticas, auditoria, reportes Excel/PDF, integracion futura con Softland/BI y control por perfiles.

La metodologia propuesta fue Scrumban, con desarrollo iterativo, validacion funcional continua, ambiente de pruebas, sprint reviews y ajustes por feedback.

## 4. Estimacion original

La linea base del kick-off definio:

| Elemento | Estimacion inicial |
|---|---:|
| Esfuerzo total | 923 HH |
| Plan inicial | 12 sprints |
| Mayor bloque | Mantenedores, 26% |
| Otros bloques relevantes | Packing List 11%, Cuentas Corrientes 10%, Contratos Comerciales 8% |
| Enfoque | Desarrollo por sprints, validacion por usuarios, marcha blanca y despliegue final |

El roadmap marco fases de levantamiento, diseno, desarrollo iterativo, validacion, integracion, pruebas, capacitacion, marcha blanca y despliegue.

Supuesto critico de la estimacion: que las reglas funcionales y de negocio estarian suficientemente disponibles cuando cada modulo entrara a desarrollo. Ese supuesto no se cumplio en modulos financieros, liquidaciones, cuentas corrientes, Softland/SII, Flores, reportes por cliente y cierre logistico.

## 5. Estado actual reportado al 16-06-2026

Segun el tracking de modulos:

| Modulo | Estado tracker | Progreso |
|---|---|---:|
| Base del proyecto | Completado | 100% |
| Mantenedores | En progreso | 98% |
| Logistica y Transporte | Completado | 100% |
| Bodega | Completado | 100% |
| Integracion Flores | En progreso | 90% |
| Produccion | En progreso | 60% |
| Costos | En progreso | 50% |
| Packing List y Confirmacion de Embarque | En progreso | 40% |
| Finanzas | En progreso | 40% |
| Liquidaciones | En progreso | 33% |
| Contrato y Acuerdos Comerciales | En progreso | 20% |
| Pruebas Integradas | En progreso | 4% |
| Cuentas Corrientes | Pendiente | 0% |
| Facturacion y Documentos Internos | Pendiente | 0% |
| Presupuestos | Pendiente | 0% |
| I + D | Pendiente | 0% |
| Generacion y listado de logs | Pendiente | 0% |
| Carga de datos | Pendiente | 0% |
| Total proyecto | En progreso | 58% |

Lectura real del 58%: representa avance de construccion funcional y de componentes, no readiness productiva. El dato que corrige la lectura optimista es `Pruebas Integradas: 4%`.

## 6. Estado real por dominio

### 6.1 Base, mantenedores y datos maestros

Estado real: avanzado, casi completo.

Evidencia:

- Mantenedores al 98%.
- Base del proyecto al 100%.
- Usuarios, actores, transporte, contenedores, fletes, centros de costo, unidades de negocio, roles, paises, ciudades, regiones, especies, variedades, puertos, areas, colores, calibres, etiquetas, embalajes, categorias, bodegas, plantas de carga, contactos, proveedores, envases, cuentas, zonas, incoterms y temporadas figuran completados.

Pendientes reales:

- Visualizador de documentos.
- Carga de datos.
- Revision de mantenedores dentro de pruebas integradas.
- Homologacion de nombres/codigos para evitar duplicidad de datos maestros.

Riesgo: el modulo puede estar tecnicamente completo, pero la calidad final depende de la carga, depuracion y validacion de datos reales por Chilfresh.

### 6.2 Logistica y Transporte

Estado tracker: 100%.  
Estado real: implementado como base operativa, pero con pendientes criticos para cierre financiero-documental.

Completado o avanzado:

- Ordenes de embarque.
- Generacion de documento de embarque.
- Instructivo de embarque.
- Itinerarios.
- Reservas/booking.
- Tarifas.
- Stacking.
- Programa de carga.

Pendientes reales detectados en resumen funcional y minutas:

- Formalizar procedimiento de cierre de embarque.
- Definir carga documental de BL.
- Mover flete y rebate hacia Logistica como origen del dato.
- Implementar tratamiento diferenciado prepaid/collect.
- Implementar cierre y bloqueo de campos criticos.
- Implementar prorrateo de flete/rebate por kilo, caja, pallet o porcentaje.
- Crear historial visible de cambios.
- Completar tracking con ETD/ETA iniciales y actualizaciones.
- Configurar SharePoint como repositorio documental.

Conclusion: el 100% del tracker debe entenderse como construccion del modulo base, no como cierre operacional-financiero total.

### 6.3 Packing List y Shipment Confirmation

Estado tracker: 40%.  
Estado real: base funcional construida, aun no estabilizada con casos reales.

Avances:

- Packing List aparece completado.
- Descarga de plantillas completada.
- Carga Excel y validacion contra mantenedores.
- Diferenciacion Broker vs Chilfresh/Exportadora.
- Campo `varas` incorporado inicialmente para Flores.
- Generacion inicial de PDFs desde Shipment Confirmation.
- Flujo conectado con ordenes, instructivos y datos logisticos.

Pendientes:

- Confirmacion de Embarque figura en curso.
- Consolidado PL-SC pendiente.
- Excel detalle PL individual pendiente.
- Matriz definitiva de campos.
- Reglas de multiple contenedor y multiple supplier.
- Carga de PL sin orden previa para clientes excepcionales.
- Estado formal para PL pendiente de numero o pendiente de shipment.
- Formato oficial de contenedores y control de duplicidad.
- Impacto de `varas` en facturacion, reportes y liquidaciones.
- Reportes por cliente, con distincion PDF/Excel, supplier visible/no visible, calibre/milimetraje.

Conclusion: Packing List es el eje critico del flujo actual. Esta desarrollado en su base, pero aun necesita pruebas reales con un PL de Frutas y uno de Flores, mas validaciones de consolidados, excepciones y documentos posteriores.

### 6.4 Facturacion, Proformas, DTE/SII y Softland

Estado tracker: Facturacion y Documentos Internos 0%; Finanzas 40%.  
Estado real: existen componentes desarrollados o demostrados, pero el flujo integral no esta cerrado.

Avances:

- Implementar facturacion SII: 100% en Finanzas.
- Implementar solicitud SII DTE: 100% en Finanzas.
- Proformas granel y embalada: completadas en Produccion.
- Proforma producto terminado: en revision.
- Se han mostrado proformas editables, PDFs, lineas, precios y datos bancarios.
- Se han presentado avances de invoices desde Shipment Confirmation.

Pendientes:

- Gestion de Documento Interno Factura SII.
- Listado de facturas.
- Generar factura/proforma dentro del modulo de Facturacion.
- Mantenedores de listados de facturas.
- Versionamiento de proformas y facturas comerciales.
- Validacion de DTE/SII con flujo real.
- Integracion Softland aun no operativa.
- Homologacion de tipos de documentos, clientes, paises, puertos y equivalencias con Softland.
- Separar facturacion logistica vs facturacion comercial.

Conclusion: hay piezas funcionales, pero el flujo PL -> invoice -> DTE/SII -> Softland todavia requiere prueba controlada y definiciones.

### 6.5 Costos

Estado tracker: 50%.  
Estado real: avance medio, con base operativa y pendientes de integracion.

Avances:

- Costos genericos completados.
- Creacion de costos desde PL completada.
- Detalles de costos desde documentos completado.
- Prorrateos trabajados por pallet, kilo, caja, shipment y otras variables.
- Open/Close para bloquear liquidaciones si costos no estan cerrados.

Pendientes:

- Informe de costos.
- Ingreso de documentos logisticos.
- Automatizar flete y seguro desde Logistica.
- Definir costos imputables vs informativos.
- Validar criterios de prorrateo con usuarios.
- Integrar documentos, facturas y costos con liquidaciones y cuentas corrientes.

### 6.6 Liquidaciones

Estado tracker: 33%.  
Estado real: conceptual y parcialmente funcional, pero no listo para cierre productivo.

Avances:

- Validacion y aprobacion de liquidaciones marcada como completada.
- Liquidacion de productores en curso.
- En minutas se evidencia liquidacion masiva con versiones, deteccion de duplicados e historico.
- NC/ND, ajustes y prorrateos estan definidos o parcialmente implementados.
- Integracion Flores muestra modulo de liquidacion completado dentro de su bloque.

Pendientes criticos:

- Generacion de liquidaciones.
- Definir desde que hito se habilita liquidacion: Shipment Confirmation, cierre de ventas, factura comercial o cierre de embarque.
- Construir matriz de origen de datos por campo.
- Definir estados formales: borrador, pendiente, calculada, aprobada, emitida, bloqueada, ajustada, anulada.
- Cerrar reglas de precio, costos, fletes, descuentos, comisiones, royalty, rebate y volumen discount.
- Definir liquidacion cliente, supplier/exporter y productor.
- Definir tratamiento de Frutas vs Flores.
- Definir liquidacion masiva, criterios de agrupacion, correlativo, versionamiento y reportes.
- Validar impacto en cuentas corrientes y documentos tributarios.

Conclusion: Liquidaciones es el principal riesgo funcional. No conviene considerarlo cerrado hasta tener reglas aprobadas, matriz de datos, casos reales y pruebas integradas.

### 6.7 Cuentas Corrientes

Estado tracker: 0%.  
Estado real: aparece en conversaciones y vistas parciales, pero como modulo completo esta pendiente.

Pendientes:

- Asociar documento a proforma.
- Control de documentos y pagos.
- Consolidado de cuenta corriente.
- Gestion de anticipos.
- Reportes financieros y consolidacion.
- Alimentacion automatica desde liquidacion final.
- Tratamiento de saldos historicos por actor.

Riesgo: cuentas corrientes depende de facturacion, liquidaciones, costos, saldos, anticipos y documentos. Mientras esos modulos no cierren, CC no puede quedar productiva.

### 6.8 Produccion, Bodega y Materiales

Estado real: Produccion 60%, Bodega 100%.

Avances:

- Recepcion de frutas granel.
- Procesamiento de productos.
- Recepcion de fruta embalada.
- Procesos.
- Proformas granel y embalada.
- Ingreso/salida de materiales.
- Gestion de stock.
- Ordenes de compra.
- Recepcion de materiales.

Pendientes:

- Manejo de existencias.
- Repaletizaje.
- Despachos.
- Producto terminado en revision o en curso.
- Integracion con costos, guias de despacho y saldos.

### 6.9 Contratos, acuerdos, royalties y comisiones

Estado tracker: 20%.

Observaciones:

- Comisiones figura completada.
- Royalties pendiente.
- Mantenedor de acuerdos y condiciones comerciales figuran cancelados.
- Vinculacion centro costo / unidad de negocio pendiente.

Riesgo: el assessment original asignaba peso importante a contratos comerciales. La cancelacion de tareas debe formalizarse como cambio de alcance, no quedar como ambiguedad.

### 6.10 Pruebas integradas, logs y carga de datos

Estado real: bajo.

Datos:

- Pruebas Integradas: 4%.
- Logs mantenedores: pendiente.
- Logs modulos: pendiente.
- Carga de datos: pendiente/en curso 0%.

Conclusion: esta es la brecha mas importante entre "desarrollo construido" y "sistema listo". Sin pruebas integradas, logs y datos reales depurados, el sistema no deberia considerarse listo para operacion productiva completa.

## 7. Diferencia entre estimacion y realidad

### 7.1 Lo que cambio frente al assessment

El proyecto paso de ser un reemplazo/unificacion de sistemas a representar una plataforma operacional integral. Durante el desarrollo se incorporaron o profundizaron:

- Flujo de masa.
- Recepcion de fruta.
- Bodegas e inventario de materiales.
- Costos de proceso.
- Softland y SII.
- Cuentas corrientes por actor.
- Royalties.
- Flores y Comet.
- Varas y reglas especificas de Flores.
- Diferenciacion Exportadora vs Broker.
- Prorrateos de flete, rebate y costos.
- Cierre de nave y cierre de embarque.
- Snapshot/versionamiento de liquidaciones.
- Reportes especiales por cliente.
- Versionamiento de proformas y facturas.
- Logs/auditoria.

### 7.2 Causas principales del desfase

| Causa | Impacto |
|---|---|
| Definiciones internas pendientes de Chilfresh | Bloquean Liquidaciones, CC, reportes, reglas por cliente, Flores y Softland. |
| Ampliacion de alcance | El esfuerzo original de 923 HH no consideraba todo el detalle hoy levantado. |
| Doble linea Frutas/Flores | Requiere reglas, campos y fuentes distintas, especialmente Comet y varas. |
| Doble modalidad Exportadora/Broker | Afecta origen de datos, Packing List, instrucciones, facturacion y liquidacion. |
| Sistemas legados cambiando durante el proyecto | Genera sincronizacion y adaptaciones. |
| Temporadas altas de Chilfresh | Reduce disponibilidad para validaciones y mesas de trabajo. |
| Interdependencia modular | Un atraso aguas arriba bloquea modulos aguas abajo. |
| Baja madurez de pruebas integradas | Impide cerrar como produccion aunque existan componentes implementados. |

## 8. Estimacion actualizada de trabajo

Esta estimacion no reemplaza una cotizacion formal. Es una estimacion tecnica razonada sobre la base documental revisada.

### 8.1 Escenario A - Cerrar un piloto operativo controlado

Objetivo: validar flujo operativo minimo desde datos maestros hasta Packing List, Shipment Confirmation, invoice/proforma y reportes base, con casos reales controlados de Frutas y Flores.

| Bloque | HH estimadas |
|---|---:|
| Ajustes Packing List y Shipment Confirmation | 90 - 140 |
| Pruebas con PL real Frutas/Flores, errores de homologacion y ajustes | 60 - 100 |
| Reportes base PDF/Excel y versionamiento minimo documentos | 60 - 90 |
| Facturacion/proforma con flujo controlado DTE/SII sin integracion Softland completa | 70 - 120 |
| Datos, mantenedores, permisos y carga inicial minima | 50 - 90 |
| QA/UAT, correcciones y material de apoyo | 80 - 130 |
| Total estimado piloto | 410 - 670 HH |

Calendario probable: 6 a 10 semanas efectivas, si Chilfresh cierra definiciones y agenda usuarios clave sin pausas prolongadas.

### 8.2 Escenario B - Cierre productivo integral de plataforma

Objetivo: cerrar flujo completo con liquidaciones, cuentas corrientes, Softland/SII, costos, logs, datos reales, auditoria, reportes por cliente, versionamiento y pruebas integradas.

| Bloque | HH estimadas |
|---|---:|
| Logistica avanzada: flete/rebate, prepaid/collect, cierre, BL, tracking, historial | 160 - 240 |
| Packing List avanzado: matriz campos, multi-contenedor, multi-supplier, Flores/Comet, reportes cliente | 160 - 260 |
| Facturacion, proformas, DTE/SII, preparacion/integracion Softland | 180 - 280 |
| Liquidaciones: reglas, origen de datos, individual/masiva, versionamiento, prorrateos | 300 - 480 |
| Cuentas corrientes, anticipos, pagos, saldos historicos y movimientos por actor | 180 - 320 |
| Costos, documentos logisticos, informes y cruce con liquidaciones | 100 - 180 |
| Contratos/Royalties/Comisiones/Presupuestos/I+D segun alcance vigente | 120 - 240 |
| Logs, auditoria, permisos, carga de datos y homologacion | 140 - 240 |
| Pruebas integradas, UAT, capacitacion, marcha blanca y soporte inicial | 180 - 300 |
| Hardening tecnico: performance mobile, accesibilidad, cache, seguridad HTTP | 60 - 120 |
| Total estimado cierre integral | 1.580 - 2.660 HH |

Calendario probable: 4 a 7 meses calendario, dependiendo menos de la velocidad de desarrollo y mas de la disponibilidad de definiciones, usuarios para UAT, datos reales y priorizacion de alcance.

### 8.3 Estimacion puente

Si se recorta alcance y se posterga parte de Contratos, Presupuestos, I+D, Calidad avanzada, IA/logistica automatica y reportes especiales por cliente, el cierre productivo esencial podria ubicarse en un rango intermedio:

| Escenario | HH estimadas | Uso recomendado |
|---|---:|---|
| Piloto operativo controlado | 410 - 670 | Validar flujo real y reducir incertidumbre. |
| Productivo esencial priorizado | 850 - 1.350 | Operar nucleo con finanzas controladas y deuda tecnica aceptada. |
| Productivo integral | 1.580 - 2.660 | Completar plataforma con trazabilidad, CC, Softland/SII, logs y UAT robusto. |

## 9. Riesgos actuales

| Riesgo | Severidad | Comentario |
|---|---|---|
| Liquidaciones sin reglas cerradas | Alta | Mayor riesgo funcional y financiero. |
| Cuentas corrientes en 0% | Alta | Depende de liquidacion, facturacion, saldos y pagos. |
| Pruebas integradas en 4% | Alta | Impide declarar readiness real. |
| Softland/SII no validado end-to-end | Alta | Riesgo tributario/operativo si se pasa a produccion sin prueba controlada. |
| Packing List no validado con casos reales completos | Alta | Afecta todos los procesos posteriores. |
| Falta de logs/auditoria | Media/Alta | Debilita trazabilidad en cambios criticos. |
| Datos maestros duplicados o no homologados | Media/Alta | Puede contaminar PL, facturacion, costos y liquidaciones. |
| Reportes por cliente no levantados | Media | Puede generar retrabajo documental. |
| Ambiguedad de alcance cancelado | Media | Contratos, acuerdos, facturas y Calidad deben formalizar decision. |
| Performance mobile y accesibilidad | Media | Lighthouse mobile 49 y accesibilidad 82 en login. |

## 10. Recomendaciones priorizadas

1. Formalizar alcance vigente.
   - Confirmar que modulos quedan dentro/fuera: Contratos, Acuerdos, Calidad, Presupuestos, I+D, Gestion de Facturas cancelada.

2. Cerrar definiciones bloqueantes en mesas cortas y con decision.
   - Liquidaciones.
   - Cuentas corrientes.
   - Facturacion/Softland/SII.
   - Packing List Frutas/Flores.
   - Reportes por cliente.

3. Convertir Packing List en hito de estabilizacion.
   - Probar un caso real de Frutas y uno de Flores.
   - Resolver homologaciones, contenedores, multiples suppliers y PL sin orden previa.

4. Separar "piloto operativo" de "plataforma integral".
   - Evita que el proyecto parezca detenido por no cerrar todo el ecosistema al mismo tiempo.

5. Armar matriz de origen de datos para Liquidaciones.
   - Campo, modulo origen, editable/bloqueado, regla, responsable, validacion y salida contable.

6. Ejecutar prueba controlada end-to-end.
   - Orden/Itinerario/Reserva -> PL -> SC -> Invoice/Proforma -> DTE/SII -> Costos -> Liquidacion -> Cuenta Corriente.

7. Implementar logs/auditoria antes de operar procesos financieros.
   - Cambios en tarifa, flete, rebate, BL, ETA/ETD, liquidacion, factura y cuenta corriente deben tener usuario, fecha, valor anterior y valor nuevo.

8. Usar el 58% como avance de construccion, no como readiness.
   - Para readiness, el indicador mas relevante hoy es pruebas integradas 4%.

## 11. Conclusiones

El assessment inicial fue correcto en el diagnostico de fragmentacion y en la direccion de redisenar una plataforma unificada. La estimacion de 923 HH, sin embargo, quedo superada por el alcance real descubierto durante el proyecto.

El desarrollo real muestra avances concretos: mantenedores, base del proyecto, logistica, bodega, packing list base, produccion parcial, costos, SII/DTE y Flores tienen evidencia de construccion. El proyecto no esta parado.

La brecha real esta en cierre funcional, reglas de negocio, integracion financiera, datos reales, auditoria y pruebas integradas. En terminos ejecutivos: el sistema existe, pero aun no esta consolidado como plataforma productiva integral.

La ruta mas sana es declarar un piloto operativo controlado, estabilizar el flujo Packing List -> Shipment Confirmation -> Facturacion, y en paralelo cerrar la matriz de Liquidaciones y Cuentas Corrientes. Sin esas definiciones, agregar mas desarrollo sobre liquidaciones aumentara el riesgo de retrabajo.

## 12. Anexo - Estado sintetico por modulo

| Modulo | Estado real recomendado |
|---|---|
| Base del proyecto | Cerrado tecnicamente. |
| Mantenedores | Casi cerrado; falta validacion de datos reales y visualizador documental. |
| Logistica | Base implementada; faltan cierres, flete/rebate, tracking, BL, bloqueo y auditoria. |
| Packing List | Base funcional; falta estabilizacion con casos reales y reglas de consolidacion. |
| Shipment Confirmation | En curso; clave para desbloquear documentos posteriores. |
| Costos | Medio avance; requiere integracion con logistica/liquidaciones. |
| Facturacion/DTE/SII | Componentes parciales; falta flujo end-to-end y Softland. |
| Liquidaciones | Mayor riesgo; requiere reglas, matriz de datos y UAT real. |
| Cuentas Corrientes | Pendiente; no debe iniciarse fuerte sin liquidaciones/facturacion cerradas. |
| Produccion | Avance parcial; producto terminado y existencias pendientes. |
| Bodega | Cerrado tecnicamente; falta validacion integrada. |
| Flores | Alto avance, pero costos de flores en pausa y Comet requiere definicion. |
| Logs/auditoria | Pendiente; necesario antes de operacion financiera. |
| Pruebas integradas | Muy bajo; principal brecha de readiness. |
