---
id: 20261008-100000-feature-0010-cancel-reason
feature: 0010
title: Motivo al cancelar
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Laura
    approved_at: null
---

# Spec — Motivo al cancelar

🦆 Al cancelar una reserva hay que decir por qué, eligiendo de una lista corta: `cancelar Norte lun --motivo "sala ocupada"` responde «cancelada Norte lun (sala ocupada)». Sin motivo, o con uno que no está en la lista, no se cancela y la respuesta enseña los motivos válidos. Un comando nuevo, `canceladas`, lista lo cancelado con su motivo («Norte lun — sala ocupada»). Las anulaciones del responsable de sala no salen ahí, porque son la 0011.

Validación: dev-lead — es la salida de un comando que usa una persona.

## Capacidades

- Nuevas: `reservas` — cancelar una reserva con motivo y listar las canceladas.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva (`reservas`), datos (el motivo se guarda con la reserva) · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `test/cancel.test.js`)
- Dominio (opus): si «Cancelar exige un motivo de la lista» deja sin decir qué pasa con la cancelación sin `--motivo` que hoy funciona, y si `canceladas` deja fuera las anulaciones como pide la terminología de PRODUCT (señal: capacidad nueva + datos)
- Mínimo razonable: sin review — deja sin mirar si el cambio de respuesta de `cancelar` rompe algo que la spec no lista y si los avisos tienen su literal completo
```

1. Capacidad nueva `reservas`: no hay `capabilities/` en el proyecto (`sdd capability index` → «Sin capacidades»), así que la spec la crea en vez de modificarla como decía el borrador. Nombre en castellano porque PRODUCT dice «Reserva — evitar: booking».
2. Lista cerrada de motivos: `cambio de planes`, `sala ocupada`, `otro`. Se comparan tal cual, distinguiendo mayúsculas y sin recortar espacios: «Sala ocupada» no vale.
3. Fuera «quién canceló» del listado: el borrador lo metía citando «saber quién y por qué», pero esa frase no está en la fila 0010. Hoy la reserva no guarda su titular en el código, aunque PRODUCT diga «a nombre de quien la pide», así que añadirlo amplía el alcance. Ojo: PRODUCT se contradice («para los equipos de una oficina» frente a «no hay más usuarios»), y eso lo decides tú, no esta spec.
4. `cancelar` sin `--motivo` deja de cancelar y responde «falta el motivo: cambio de planes, sala ocupada, otro» (ver «Lo que se retira o cambia de forma»).
5. Un motivo fuera de la lista responde «motivo no válido: cambio de planes, sala ocupada, otro» y la reserva sigue activa.
6. El motivo se comprueba antes de buscar la reserva: `cancelar Sur mar --motivo "xyz"` responde «motivo no válido…», no «sin reserva Sur mar».
7. Respuesta al cancelar: «cancelada <sala> <día> (<motivo>)». Línea del listado: «<sala> <día> — <motivo>», una por reserva y en el orden en que se cancelaron. Sin ninguna, «sin canceladas».
8. `canceladas` no lista las anuladas (estado `voided`, que ya existe: comando `anular`, `src/app.js:20`). Según PRODUCT, anulación ≠ cancelación.
9. Una reserva ya cancelada no se vuelve a cancelar: responde «sin reserva <sala> <día>», como hoy, y conserva su primer motivo. `libres` sigue contando solo las activas: la franja cancelada queda libre, como hoy.
10. El motivo vive en memoria, en la propia reserva, igual que hoy el estado: cancelar marca la reserva, no la borra (`src/app.js:16`). `canceladas` solo ve lo cancelado en el mismo proceso. Persistir entre ejecuciones no entra.
11. El límite de 24 h que PRODUCT pone a la cancelación no entra: hoy no está implementado y las reservas no guardan fecha. Va a «No entra» y queda como candidato a fila del roadmap.
12. Para probar con más de una reserva, los tests montan las reservas de partida con una función de prueba exportada de `src/app.js`, porque hoy el array fijo solo tiene Norte lun y `reservar` no crea nada.
13. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` → crea `reservas.md` con 3 requisitos añadidos y 5 reglas, sin rechazos (exit 0). El `capabilities/` del repo no cambia.
- Enfoque: A (motivo como campo de la reserva), frente a B (registro aparte de cancelaciones) (ver Approach).
- Política de modelos: revisor de la spec: uno, dominio en opus (hecho) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

- **Aceptado** — Límite de 24 h de PRODUCT ignorado → decisión 11 y «No entra»; «Límites» dice por qué no aplica.
- **Aceptado** — Capacidad `bookings` contra la terminología de PRODUCT → renombrada a `reservas`; «Idioma de los nombres» acotado a interfaz y documentos.
- **Aceptado** — Argumento falso en la decisión 3 → reescrita: la fila no lo pide; la incoherencia de PRODUCT queda anotada para ti.
- **Rechazado** — Estado `voided` quizá inexistente (sería la 0011) → existe hoy: `anular` y `voidBooking` en `src/app.js:20-25`; se cita en la decisión 8.
- **Aceptado** — «La reserva sigue activa» no observable → AND: un `cancelar … --motivo "otro"` posterior responde «cancelada Norte lun (otro)».
- **Aceptado** — Precedencia motivo/reserva sin escenario → AND con `cancelar Sur mar --motivo "xyz"` y `cancelar Sur mar`.
- **Aceptado** — Orden del listado probado con una sola → escenario con Sur mar cancelada antes que Norte lun; decisión 12 dice cómo se montan.
- **Aceptado** — Recancelar sin decidir → decisión 9 y AND de recancelación.
- **Rechazado** — ¿Hoy se borra la reserva? → no: se marca `cancelled` (`src/app.js:16`); el 0007 arregló otra cosa (comparar solo por hora). Lo aclara la decisión 10.
- **Aceptado** — Franja en el GIVEN, término y comparación → franja fuera del GIVEN; término «Motivo de cancelación»; comparación exacta en la decisión 2.

### Decisiones tomadas con el dev-lead

- Lista cerrada de motivos — decidida en la entrevista.

## Intent

Hoy cancelar no deja rastro: nadie sabe por qué se liberó una sala. Cada cancelación tiene que llevar un motivo de una lista cerrada, y ese motivo se tiene que poder consultar después. Fracasaría si se pudiera cancelar sin motivo o si el listado mezclara cancelaciones con anulaciones.

## Scope

- Entra: `cancelar <sala> <día> --motivo <motivo>` con el motivo obligatorio; el comando `canceladas`; una función de prueba para montar las reservas de partida.
- No entra: anulaciones del responsable de sala (0011); quién canceló; el límite de 24 h; guardar las reservas entre ejecuciones; varias reservas de la misma sala el mismo día.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelar <sala> <día>` sin motivo cancela y responde «cancelada Norte lun» | `src/app.js:17`, `src/app.js:30`, `test/cancel.test.js:6` | decisiones 4 y 7; el test pasa a llevar `--motivo` |
| «sin reserva Sur mar» sin motivo | `test/cancel.test.js:10` | decisión 6; el test pasa a llevar un motivo válido |

- Filas que implementa: 0010 → `ROADMAP.md:7` (fila de Now, la cierra `sdd-archive`) | comprobado con `git grep -n 0010`

## Approach

- A: el motivo como campo de la reserva cancelada (`reason`). Son dos líneas en `cancelBooking`, y `canceladas` filtra por estado `cancelled`.
- B: un registro aparte de cancelaciones. Duplica sala y día y obliga a mantenerlo en sincronía con la reserva; nada lo pide.
- Elegido: A, porque es lo mínimo y sigue la forma en que el código ya guarda el estado.

## Dónde se prueba

- Motivo: por `run('cancelar', …)`, como `test/cancel.test.js`.
- Listado: por la salida de `run('canceladas', [])`, en `test/cancel.test.js`, con las reservas de partida montadas con la función de prueba (decisión 12).

## Términos y ADR

- Términos resueltos: Motivo de cancelación — la razón de una cancelación, elegida de una lista cerrada (la anulación no lo lleva).
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `reservas`

#### ADDED — Cancelar exige un motivo de la lista

- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "sala ocupada"`
- THEN responde «cancelada Norte lun (sala ocupada)»
- AND después, `cancelar Norte lun --motivo "otro"` responde «sin reserva Norte lun» y `canceladas` sigue respondiendo «Norte lun — sala ocupada»

#### ADDED — Sin motivo válido no se cancela

- GIVEN la reserva activa de Norte del lunes
- WHEN `cancelar Norte lun --motivo "me aburro"`, y luego `cancelar Norte lun`
- THEN responden «motivo no válido: cambio de planes, sala ocupada, otro» y «falta el motivo: cambio de planes, sala ocupada, otro»
- AND después, `cancelar Norte lun --motivo "otro"` responde «cancelada Norte lun (otro)»
- AND `cancelar Sur mar --motivo "xyz"` responde «motivo no válido: cambio de planes, sala ocupada, otro» y `cancelar Sur mar` responde «falta el motivo: cambio de planes, sala ocupada, otro», sin reserva de Sur el martes
- AND `cancelar Sur mar --motivo "otro"` responde «sin reserva Sur mar»

#### ADDED — El listado de canceladas enseña el motivo

- GIVEN las reservas activas de Sur del martes, Norte del lunes y Sur del miércoles
- WHEN `cancelar Sur mar --motivo "otro"`, `cancelar Norte lun --motivo "sala ocupada"`, `anular Sur mie` y `canceladas`
- THEN `canceladas` responde dos líneas, en este orden: «Sur mar — otro» y «Norte lun — sala ocupada»
- AND sin ninguna cancelada responde «sin canceladas»

#### Reglas de la capacidad — reservas

- **Dónde viven los datos**: en memoria, en la propia reserva (`status`, `reason`), mientras dura el proceso
- **Idioma de los nombres**: texto de la interfaz y de los documentos en castellano (constitution, art. 4); los identificadores del código siguen como están
- **Límites**: no aplica
- **Avisos**: «motivo no válido: cambio de planes, sala ocupada, otro» · «falta el motivo: cambio de planes, sala ocupada, otro»
- **Regla ante conflicto**: no aplica

## Enmiendas

- (ninguna)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Laura | | pendiente |
