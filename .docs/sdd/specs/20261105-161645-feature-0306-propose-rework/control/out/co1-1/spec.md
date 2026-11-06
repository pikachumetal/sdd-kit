---
id: 20261008-120000-feature-0013-cancel-many-days
feature: 0013
title: Cancelar varios días de una vez
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Fixture
    approved_at: null
---

# Spec — Cancelar varios días de una vez

🦆 Hoy, para cancelar la semana de Norte hay que escribir `cancelar Norte lun`, luego `cancelar Norte mar`, y así cinco veces. Con esta feature escribes `cancelar Norte lun mie` y responde, en el orden dado, una línea por día: `cancelada Norte lun` y `cancelada Norte mie`. Si uno de los días no tenía reserva, ese día dice `sin reserva Norte mar` y los demás se cancelan igual, como ya hacen los demás comandos con varios días. Por dentro, `cancelar` repite lo que ya hace con un día por cada día que le des.

Validación: dev-lead — es una respuesta del comando que ve quien lo usa (según `mission.md`, la única persona que usa el proyecto).

## Capacidades

- Modificadas: `bookings` — se añade un requisito (`ADDED`); ningún requisito vivo cambia (sin `MODIFIED`).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin `MODIFIED`, sin contrato público, sin datos nuevos) · tamaño: ~25 líneas en 2 ficheros
- Dominio y técnica (sonnet): si los dos escenarios del delta siguen el requisito vivo «Un comando con varios días trata cada día aparte» sin cambiarlo, y si `cancelar Norte lun lun` (día repetido) queda cubierto por ese mismo requisito (señal: ninguna; es el choque que encontró el repaso de coherencia)
- Mínimo razonable: sin review — deja sin mirar si algún THEN contradice la capacidad, el hueco que el repaso de coherencia ya cerró una vez

1. **Cada día se atiende aparte, sin todo-o-nada.** `cancelar Norte lun mar` con reserva solo el lunes cancela el lunes y dice `sin reserva Norte mar`. Es lo que ya exige la capacidad `bookings` («Un comando con varios días trata cada día aparte»). Una versión anterior de esta spec cancelaba todo o nada; habría exigido un `MODIFIED` de ese requisito y no la tomo yo: si la quieres, dímelo y la spec lo declara.
2. **Un texto por día, los de hoy.** Cada línea es `cancelada <sala> <día>` o `sin reserva <sala> <día>`, los literales que `cancelar` ya responde con un día; con un solo día la respuesta no cambia. Una versión anterior inventaba `canceladas Norte lun mie`: fuera.
3. **Los días van separados por espacios, sin límite.** Es como ya llegan los argumentos; `Límites` de la capacidad sigue en «no aplica».
4. **Un día repetido** (`cancelar Norte lun lun`): el segundo `lun` ya no tiene reserva activa y responde `sin reserva Norte lun`. No lo trato aparte: sale de aplicar el requisito vivo día a día.
5. **Orden y formato.** Las líneas salen en el orden en que se dieron los días, una por línea (separadas por salto de línea). Con un solo día, la salida es la de hoy.
6. **Entradas raras, como hoy.** Sala inexistente o día no válido se tratan como «sin reserva» (`sin reserva Norte xyz`), que es lo que `cancelar` ya responde; `cancelar Norte` sin ningún día no entra (ver Scope).
7. **Validación: dev-lead.** Lo que cambia es el texto que ve quien usa el comando.
8. **Aprobador: `Fixture`** (`git config user.name`). Una versión anterior ponía a «Laura», un nombre que no sale de ningún documento del proyecto; `mission.md` dice que solo hay una persona.
- Política de modelos: revisor de la spec en sonnet (sin roles ni reglas de flujo) · revisión final: Spec opus+high, Código sonnet+high, sin eje de Arquitectura (dos ficheros) · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Reglas de la capacidad: sin entradas nuevas en el delta. Dónde viven los datos, idioma de los nombres y regla ante conflicto no cambian; `Límites` sigue en «no aplica» (la decisión 3, sin tope de días, no es un límite nuevo); `Avisos` no aplica: ningún día fallido avisa aparte, solo da su línea.
- Delta probado en una copia con `sdd capability merge`: `bookings.md: añadido «Cancelar varios días de una vez»`; el `capabilities/` del repo no cambia

### Hallazgos de la review

- **Aceptado** — día repetido sin escenario → AND con `cancelar Norte lun lun` en el delta y en «Dónde se prueba».
- **Aceptado** — aprobador «Laura» sin base en `mission.md` → `Fixture`, decisión 8.
- **Aceptado** — sala/día inválidos y `cancelar Norte` sin explicitar → decisión 6 y «No entra».
- **Aceptado** — orden y salto de línea sin decisión → decisión 5.
- **Aceptado** — THEN sin orden → «en el orden dado» en el THEN.
- **Aceptado** — Reglas de la capacidad sin declarar → línea de Reglas en ✋.
- **Aceptado** — recuento de ficheros inconsistente → 2 ficheros en los dos sitios.
- **Aceptado** — «Modificadas» confunde con `MODIFIED` → aclarado en Capacidades.
- **Rechazado** — solape del ADDED con tres requisitos vivos → se queda: ninguno fija orden ni formato con varios días; el requisito nuevo es la composición con orden y formato.
- **Aceptado** — salida multilínea sin mencionar → nota bajo la tabla de «Lo que se retira».


## Intent

Hoy, para cancelar una semana hay que lanzar `cancelar` cinco veces. Quien cancela quiere hacerlo de una vez y saber, por cada día, si salió. Éxito: `cancelar Norte lun mar mie jue vie` cancela las reservas que haya y dice una línea por día. Fracaso, aunque funcione: que un día sin reserva deje sin cancelar los demás, o que cambie la respuesta de `cancelar` con un solo día.

## Scope

- Entra: `cancelar <sala> <día> <día>…` en `src/app.js` (la función `run`, que hoy solo lee el primer día), y su prueba en `test/cancel.test.js`.
- No entra: reservar varios días; `anular` con varios días (otro comando, otra fila); el motivo al cancelar (0010); `cancelar <sala>` sin ningún día (se queda como hoy, no se toca).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | | |

Con un día la salida de `cancelar` no cambia; con varios aparece salida de varias líneas, algo nuevo y no una forma retirada.

- Filas que implementa: 0013 → nada más la del roadmap (`.docs/sdd/roadmap.md:9`, que el cierre pasa a ✅): comprobado con `git grep -n 0013 -- . ':!.docs/sdd/specs'`. Con un día la respuesta de `cancelar` no cambia, así que no se retira `cancelada <sala> <día>` ni `sin reserva <sala> <día>` (`test/cancel.test.js:6` y `:10` siguen valiendo).

## Approach

`cancelar` recorre los días que recibe y atiende cada uno como hoy, uno a uno, y responde las líneas de cada día en el orden en que se dieron, una por línea.

## Dónde se prueba

- cancelar varios días, con y sin reserva, y con un día repetido: por el comando (`run('cancelar', [...])`), como `test/cancel.test.js`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar varios días de una vez

- GIVEN reservas activas de Norte el lunes y el miércoles
- WHEN la persona ejecuta `cancelar Norte lun mie`
- THEN las dos quedan canceladas y responde, en el orden dado, una línea por día: `cancelada Norte lun` y `cancelada Norte mie`
- AND con una reserva de Norte solo el lunes, `cancelar Norte lun mar` cancela la del lunes y responde `cancelada Norte lun` y `sin reserva Norte mar`
- AND con una reserva de Norte el lunes, `cancelar Norte lun lun` responde `cancelada Norte lun` y `sin reserva Norte lun`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | | pendiente |
