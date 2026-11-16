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
  - name: Laura
    approved_at: null
---

# Spec — Cancelar varios días de una vez

## Capacidades

- Modificadas: `bookings` — ampliada con dos requisitos `ADDED` para `cancelar` con varios días. No hay `MODIFIED`: «Cancelar una reserva propia» y «Cancelar sin reserva» (un día) no cambian, y «Un comando con varios días trata cada día aparte» se cumple tal cual.

## Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: ninguna (sin contrato público nuevo, sin `MODIFIED`, sin datos, sin dependencias) · tamaño: ~25 líneas en 3 ficheros
- Dominio y técnica (sonnet): que el requisito nuevo no contradiga «Un comando con varios días trata cada día aparte» y que cada THEN lo pase `test/cancel.test.js` sin acertar por casualidad (señal: ninguna; riesgo de la regla ya viva)
- Mínimo razonable: el mismo revisor — sin revisión quedaría sin mirar si otro requisito de `bookings` pisa la nueva forma de `cancelar`

Política de modelos: sesión Native en la gama que haya; el revisor de la spec fue Sonnet (la spec no toca reglas de negocio de roles ni permisos).

Delta probado sobre una copia de `.docs/sdd` fuera del repo: `sdd capability merge` → añadido «Cancelar varios días de una vez», añadido «Cancelar varios días con alguno sin reserva», `capabilities/` del repo sin tocar. Repetido con la spec ya corregida: mismo resultado.

1. **Cada día va aparte**: `cancelar` cancela los días que tienen reserva y dice `sin reserva …` de los que no, una línea por día. Es lo que exige el requisito vivo; todo-o-nada sería un `MODIFIED` de todos los comandos de varios días, que nadie ha pedido (si lo quieres, es otra spec).
2. **Los días van separados por espacios, sin límite** (`cancelar Norte lun mie vie`). «Límites: no aplica» en `bookings` sigue siendo cierto con esta entrada, pero que no haya tope es elección mía: valídala.
3. **La respuesta es una línea por día, separadas por salto de línea y en el orden escrito**, con las frases de hoy (`cancelada Norte lun`, `sin reserva Norte mar`), para que quien cancela una semana vea qué día falló.
4. **Un día repetido** (`cancelar Norte lun lun`) cuenta como dos días: la primera línea cancela, la segunda dice `sin reserva Norte lun`. No se deduplica.
5. **Un día que no existe o no se reconoce** (`cancelar Norte xyz`) se trata como un día sin reserva: `sin reserva Norte xyz`. No se valida el nombre del día, como hoy.
6. **Enfoque: A, frente a B y C** (ver Approach).

### Hallazgos de la review

- **Aceptado** — el escenario «alguno sin reserva» repite el requisito vivo → se queda como instancia concreta de «Un comando con varios días trata cada día aparte» sobre `cancelar`, dicho así en Capacidades; no se presenta como comportamiento nuevo.
- **Aceptado** — «Modificadas» sin `MODIFIED` → Capacidades dice «ampliada con `ADDED`» y el Scope declara que los requisitos de un día no cambian.
- **Aceptado** — el THEN del primer escenario pasaba sin cancelar → ahora fija orden y salto de línea y comprueba el estado repitiendo el comando (`sin reserva` en ambos días).
- **Aceptado** — faltaban escenarios para el día repetido; «sin días» sin precisar → escenario nuevo del día repetido; «sin días» sale de las decisiones y pasa a «No entra».
- **Aceptado** — decisiones fuera de la lista y la nº 1 redactada como historial → añadida la 5 (día no reconocido), reescrita la 1 como decisión actual.
- **Aceptado** — «sin límite» presentado como derivación → ahora se dice que es elección mía, a validar.
- **Aceptado** — bloque de review mezclado con «(pendiente)» → hallazgos rellenados.
- **Aceptado** — la fila 0013 y el test de un día sin salida esperada → salida esperada del `git grep` y nombre exacto del test.
- **Aceptado** — mención a `anular` fuera de la capacidad → quitada del Scope.
- **Aceptado** — un test por escenario y gate → «Dónde se prueba» los lista y declara `node --test` entero.

## Intent

Hoy, para cancelar una semana hay que lanzar `cancelar` cinco veces. Quien cancela quiere hacerlo de una vez y ver, día por día, qué salió y qué no.

Éxito: `cancelar Norte lun mie` hace lo mismo que las dos órdenes sueltas, en un solo comando, y la respuesta dice cada día. Sería un fracaso, aunque «funcione», que un día sin reserva escondiera el resultado de los demás o que cancelara reservas sin decirlo.

## Scope

- Entra: `cancelar <sala> <día> <día>…` en `src/app.js` (la rama `cancelar` de `run`) y sus tests en `test/cancel.test.js`.
- Entra: los dos requisitos nuevos en `.docs/sdd/capabilities/bookings.md`, al archivar.
- No entra: reservar varios días. `cancelar` con un solo día se queda como hoy (lo cubren «Cancelar una reserva propia» y «Cancelar sin reserva»). `cancelar` sin ningún día no cambia y no se especifica aquí.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada | | |

- Filas que implementa: 0013 → solo su fila de `ROADMAP.md` (Now), que pasa a hecha al archivar. Comprobado con `git grep -n 0013 -- . ':!.docs/sdd/specs'`: una única línea, `ROADMAP.md:9`.
- Respuesta de `cancelar` con un día: igual que hoy (`cancelada Norte lun`); lo prueba el test existente `cancelar una reserva activa` de `test/cancel.test.js`, que debe seguir en verde sin tocarse.

## Approach

- **A (elegido) — recorrer los días y atender cada uno con la lógica de hoy**: `run` pasa cada día de `params.slice(1)` por `cancelBooking` y une las respuestas con salto de línea. Es lo que ya exige el requisito vivo, no toca `cancelBooking` y mantiene idéntica la respuesta de un día.
- B — comprobar todos los días antes y no tocar nada si uno falla (todo-o-nada): contradice el requisito vivo y habría que modificarlo para todos los comandos; se descarta salvo que lo pidas.
- C — un comando aparte (`cancelar-semana`): duplica el comando y deja `cancelar` con un solo día, sin que nadie lo haya pedido.

## Dónde se prueba

Por el comando, como `test/cancel.test.js`, un test por escenario del delta, con el gate de la constitución (`node --test` entero en verde):

- cancelar varios días: `run('cancelar', ['Norte','lun','mie'])` con las dos reservas activas → `cancelada Norte lun\ncancelada Norte mie`; repetir el mismo comando → `sin reserva Norte lun\nsin reserva Norte mie`.
- alguno sin reserva: `run('cancelar', ['Norte','lun','mar'])` → `cancelada Norte lun\nsin reserva Norte mar`.
- día repetido: `run('cancelar', ['Norte','lun','lun'])` → `cancelada Norte lun\nsin reserva Norte lun`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Cancelar varios días de una vez

- GIVEN reservas activas de Norte el lunes y el miércoles
- WHEN la persona ejecuta `cancelar Norte lun mie`
- THEN las dos quedan canceladas y responde una línea por día, en ese orden: `cancelada Norte lun` y `cancelada Norte mie`
- AND al repetir `cancelar Norte lun mie` responde `sin reserva Norte lun` y `sin reserva Norte mie`
- AND con una reserva activa de Norte el lunes, `cancelar Norte lun lun` responde `cancelada Norte lun` y `sin reserva Norte lun`

#### ADDED — Cancelar varios días con alguno sin reserva

- GIVEN una reserva activa de Norte el lunes y Norte sin reserva el martes
- WHEN la persona ejecuta `cancelar Norte lun mar`
- THEN la del lunes queda cancelada y responde `cancelada Norte lun` y `sin reserva Norte mar`

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
