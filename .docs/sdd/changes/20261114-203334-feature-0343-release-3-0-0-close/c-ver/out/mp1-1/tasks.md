# Tasks — Motivo al cancelar (0010)

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Cancelar con motivo | ✅ completa | `cb1950a` |
| 2 — Listado de canceladas | ✅ completa | `f89e362` |

Revisión final: Spec opus+high, con fixes · Código sonnet+high, con fixes · Arquitectura no (plan), sobre f89e362
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN
Re-revisión: f89e362..juntada en el cierre, sdd-kit:effort-high + opus, todos los hallazgos resueltos, sin rotura nueva

## Rulings

- Final: Ruling: ejes en paralelo 2 (Spec opus+high, Código sonnet+high) sin control.maxParallelAgents en sdd-kit.json — la política de modelos de la spec aprobada los nombra y son solo dos — si el tope fuera 1, se habrían pisado dos despachos de solo lectura, sin efecto en el código
- Final: Ruling: tasks.md no se escribió antes de la Task 1 — lo creo en la pasada de fix con el estado del ledger y git log — si falta algo, es solo registro: el ledger y git log siguen siendo la fuente
- Final: Ruling: «no verificado» del eje Spec (suite y CLI con comillas) — verificados en el hilo: suite 7/7 y `node src/app.js cancelar Norte lun --motivo "sala ocupada"` → «cancelada Norte lun (sala ocupada)» — ninguno
- Final: Ruling: motivo y cancelaciones solo en memoria: `canceladas` en un proceso aparte siempre sale vacío — es el modelo de datos de la base para todos los comandos y la 0014 «Motivo guardado» lo guarda en el almacén — si el dev-lead esperaba verlo en uso real ya en la 0010, la validación en campo lo destapa y hay que adelantar la 0014
- Final: Ruling: cancelar sin motivo deja de funcionar — la spec lo pide (AND «sin --motivo responde lo mismo») — ninguno
- Final: Ruling: motivo sensible a mayúsculas («Sala ocupada» se rechaza) — lista cerrada, el mensaje enseña los valores válidos — un usuario repite el comando
- Final: Ruling: --motivo antes de sala y día, voidBooking sin motivo, informe por sala, anulaciones con motivo — fuera de scope (0011, 0012) o uso no razonable — ninguno
- Final: Ruling: CHANGELOG, ROADMAP y README sin actualizar — trabajo de sdd-archive — ninguno
- Final: Ruling: renombre y cambio de aserciones de los tests en cb1950a — el contrato de cancelar cambió por la spec — ninguno
- Final: Ruling: spec declara `bookings` «Modificada» sin fichero en capabilities/ (bloquea capability merge), decisión 3 cita MODIFIED con delta solo ADDED, numeración salta del 1 al 3 — defectos del registro, no del código; los corrige sdd-archive en el artefacto según el mensaje de capability merge — si no se corrigen, el merge de capacidades no se puede hacer

## Minors diferidos

- `canceladas` sin ninguna cancelada imprime una línea vacía en vez de un aviso (cambiarlo es salida observable fuera de la spec)
- el test de motivo no válido usa Sur mar en vez del GIVEN Norte lun y no comprueba que la reserva siga activa
- `--motivo sala ocupada` sin comillas coge solo «sala» y el error enseña «sala ocupada» como válido
- `reasonOf` no distingue sin `--motivo`, `--motivo` sin valor y motivo inválido
- literal `'--motivo'` inline (posible magic value)
- `cancelledList` entre funciones exportadas y `run`, sin exportar como sus hermanas
- `test/cancel.test.js` pasó de CRLF a LF en la pasada de fix y el repo no tiene `.gitattributes`
