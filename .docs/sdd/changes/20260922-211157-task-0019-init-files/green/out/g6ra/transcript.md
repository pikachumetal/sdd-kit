### dev-lead

Abre la release 0.2.0 con sdd-start-release. El scope está decidido y entran estas tres: exportar facturas a CSV, filtrar el listado por cliente, y avisar cuando una factura vence. Reserva los ids y escribe la sección en el roadmap; no arranques ninguna task.

### agente

Release 0.2.0 abierta en preparación, ids reservados (0001-0003), ninguna task arrancada.

| id | Task | Ficheros que toca |
| --- | --- | --- |
| 0001 | Filtrar listado de facturas por cliente | src/invoice.js |
| 0002 | Exportar facturas a CSV | src/invoice.js |
| 0003 | Avisar cuando factura vence | src/invoice.js |

Orden propuesto: filtro primero (base para listado), CSV después (exporta lo listado/filtrado), aviso vencimiento último (más riesgo, lógica de fechas nueva). `release.hasRecipient: false` → estado fijo "en preparación", no pregunté destinatario.

Siguiente paso, si quieres arrancar: `sdd-start-task` con id 0001.
