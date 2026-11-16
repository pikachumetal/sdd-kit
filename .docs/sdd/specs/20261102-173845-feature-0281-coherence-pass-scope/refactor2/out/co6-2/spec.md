---
id: 20261008-150000-feature-0030-retire-close-notice
feature: 0030
title: Retirar la skill aviso-cierre
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — Retirar la skill aviso-cierre

🦆 Hoy, al cerrar una feature, salen dos mensajes: el de `aviso-cierre` («Di qué se cierra», «Corre el gate») y el de `resumen-cierre` (commits y filas del roadmap). Tras este cambio sale uno solo: `resumen-cierre` empieza diciendo «Se cierra la feature 0030 — Retirar la skill aviso-cierre», sigue con sus dos pasos de siempre y acaba corriendo el gate. Por dentro se borra la carpeta `skills/aviso-cierre/`, se añade ese texto a `resumen-cierre` y se corrigen dos requisitos de `quality-gate` que llamaban «paso 2» al gate de la skill retirada.

Validación: dev-lead — el mensaje de cierre lo lee una persona, y el orden de sus pasos es lo que hay que ver con los ojos.

## Capacidades

- Modificadas: `closing` — el aviso de cierre lo da `resumen-cierre`.
- Modificadas: `quality-gate` — el gate corre en el paso 3 de `resumen-cierre`, no en el paso 2 de la skill retirada.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (tres requisitos entre `closing` y `quality-gate`) · tamaño: ~25 líneas en 4 ficheros (menos de ~50, y una sola señal: 0–3 no proponen review)
- Mínimo razonable: ninguna — deja sin mirar si queda otro sitio que llame «paso 2» al gate; lo cubre el `grep` de «Lo que se retira o cambia de forma».

1. `resumen-cierre` gana una línea con lo que se cierra — es **sin número**, encima del paso 1, con el literal «Di qué se cierra.» (el que ya tenía `aviso-cierre`). Sin número para que los pasos 1 y 2 de `resumen-cierre` (que `closing` ya fija: commits y filas del roadmap) no cambien de sitio.
2. El gate no se pierde: el paso 2 de `aviso-cierre` («Corre el gate.») pasa a `resumen-cierre` como **paso 3**, con ese mismo literal. Si se retirara la skill sin moverlo, el cierre dejaría de correr el gate sin que ninguna spec lo dijera. Alternativa que descarto: ponerlo como paso 1 (corre antes de resumir), porque renumera los pasos que `closing` fija.
3. `quality-gate` se corrige en sus dos requisitos que dicen «paso 2» («El gate corre una sola vez» y «Un gate en rojo para el cierre»): pasan a «el paso 3 de `resumen-cierre`». Lo que cada uno exige no cambia.
4. `aviso-apertura` no se toca, y su «paso 2» (`closing.md:18`) es el suyo propio: se queda como está.
5. Validación `dev-lead`, no `agente`: lo que cambia es un mensaje que lee una persona, y en duda va `dev-lead`.
6. Sin review de la spec (señales y mínimo, arriba): una sola señal y un delta pequeño.
7. Pasada de coherencia: la spec que me llegó tenía la tabla de «Lo que se retira» vacía y decía que la 0030 no la nombraba nada (la nombra `roadmap.md:9`); al buscar `aviso-cierre` y los «paso N» en `capabilities/` aparecieron los dos requisitos de `quality-gate` que colgaban del paso 2 de la skill retirada, que la spec no tocaba. Todo corregido arriba (decisiones 2 y 3, tabla, Scope y delta).
- Prueba del delta sobre una copia de `.docs/sdd` en una carpeta temporal: `sdd capability merge` → «closing.md: sustituido "Quien cierra sabe qué se cierra"» · «quality-gate.md: sustituido "El gate corre una sola vez"» · «quality-gate.md: sustituido "Un gate en rojo para el cierre"» (sin rechazos; el `capabilities/` del repo no cambia).
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

## Intent

Al cerrar una feature se lanzan dos skills que dicen casi lo mismo, y nadie lee la segunda. Quien cierra quiere un solo mensaje. Éxito: tras el cierre sale un único mensaje, el de `resumen-cierre`, que dice qué se cierra, cuenta los commits, lista las filas del roadmap y corre el gate una sola vez; fracaso, aunque «funcione»: que el gate deje de correr, o que `quality-gate` siga hablando de una skill que ya no existe.

## Scope

- Entra: se retira `skills/aviso-cierre/`; `skills/resumen-cierre/SKILL.md` dice también qué se cierra (línea sin número, antes del paso 1) y corre el gate (paso 3).
- Entra: `.docs/sdd/capabilities/closing.md` (requisito «Quien cierra sabe qué se cierra») y `.docs/sdd/capabilities/quality-gate.md` (sus dos requisitos con «paso 2»), por el delta; los aplica el cierre.
- No entra: cambiar `aviso-apertura`; cambiar qué comando es el gate (`operations.md`).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| la skill `aviso-cierre` | `skills/aviso-cierre/SKILL.md` (toda la carpeta) | Scope: se borra |
| la skill `aviso-cierre`, nombrada como quien dice qué se cierra | `.docs/sdd/capabilities/closing.md:13` | delta, `MODIFIED` de «Quien cierra sabe qué se cierra» |
| el «paso 2» de `aviso-cierre` («Corre el gate.») | `.docs/sdd/capabilities/quality-gate.md:18` y `:23` | delta, `MODIFIED` de «El gate corre una sola vez» y «Un gate en rojo para el cierre»; el gate pasa al paso 3 de `resumen-cierre` (decisión 2) |
| los pasos 1 y 2 de `resumen-cierre` (podrían correrse al añadir líneas) | `.docs/sdd/capabilities/closing.md:25` y `:26` | sin cambio: la línea nueva va sin número (decisión 1) |
| el «paso 2» de `aviso-apertura` | `.docs/sdd/capabilities/closing.md:18` | sin cambio: es de otra skill (decisión 4) |

- Filas que implementa: 0030 → `.docs/sdd/roadmap.md:9` (su propia fila, en «Próximo»), que el cierre pasa a hecha; ningún otro fichero la nombra: comprobado con `grep -rnIE 0030 . --exclude-dir=.git` (README.md, PRODUCT.md, `src/`, `test/` y `scripts/` no la nombran)

## Approach

`resumen-cierre` abre con lo que se cierra (sin número); sus pasos 1 y 2 siguen igual y se le añade el paso 3, «Corre el gate.». Se borra `skills/aviso-cierre/`.

## Dónde se prueba

- el mensaje de cierre: leyendo la salida de `resumen-cierre`, que empieza por lo que se cierra y trae los pasos 1, 2 y 3 en ese orden.
- el gate corre una sola vez y para en rojo: leyendo `resumen-cierre/SKILL.md` y `quality-gate.md` con el mismo «paso 3», y con `node --test && node scripts/lint.mjs` (gate de cierre de `operations.md`) en verde sobre la rama.
- no queda ninguna mención a la skill retirada: `grep -rn aviso-cierre .docs skills README.md` sin resultados salvo la fila del roadmap y el walkthrough.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `closing`

#### MODIFIED — Quien cierra sabe qué se cierra

- GIVEN una feature terminada
- WHEN la persona la cierra
- THEN `resumen-cierre` dice qué se cierra

### Capacidad: `quality-gate`

#### MODIFIED — El gate corre una sola vez

- GIVEN un cierre en marcha
- WHEN llega el paso 3 de `resumen-cierre`
- THEN el gate corre una vez, y no se repite aunque el cierre se retome

#### MODIFIED — Un gate en rojo para el cierre

- GIVEN el paso 3 de `resumen-cierre` con un test en rojo
- WHEN acaba
- THEN el cierre para y dice qué test falló

## Enmiendas

- (ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
