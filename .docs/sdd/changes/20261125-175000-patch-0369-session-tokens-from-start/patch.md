---
id: 20261125-175000-patch-0369-session-tokens-from-start
task: 0369
title: Patch — `sdd session tokens` cuenta el esfuerzo real desde el `Inicio:` del artefacto
type: patch
solution: ticket
status: done
created: 2026-11-25
branch: patch/0369-session-tokens-from-start
commit: f9307bafc
---

# Patch 0369 — `sdd session tokens` cuenta el esfuerzo real desde el `Inicio:` del artefacto

Validación: agente, «Perfil delegate» con `validation.mode: field` — cambia un verbo de la CLI que mide transcripts: lo que vería una persona es la línea `Esfuerzo real`, y el test la mide con una sesión fabricada.

## Capacidades

- Modificadas: `estimation` — añade «Con un `Inicio:` en el artefacto, la sesión se mide desde él» y cambia «El cierre guarda el desglose por fase de la sesión» (la salida con `--artifact` ya no es siempre la misma que sin él)

## 1. Síntoma

Ticket de dev-tools §1: «en una sesión que empezó con el init, los tres cierres dieron `Esfuerzo real: 0,25 h — reloj de la sesión 2,37 h desde 2026-11-25T14:04Z…`, `0,46 h — … 2,67 h…` y `0,77 h — … 3,15 h…` para patches de 10-14 min entre su `Inicio:` y su merge. Desviaciones registradas: +150 %, +53 %, +157 %.» Ticket del patch 0245 §3: `Esfuerzo real: 2,20 h — reloj de la sesión 2,87 h desde 2026-10-28T15:09Z` para un patch abierto a las 17:40Z.

## 2. Solución fijada

Ticket de dev-tools §1, propuesta: «con `--artifact` y un `Inicio:` en el artefacto, contar desde ese `Inicio:` […], no desde el arranque de la sesión». Ticket de la 0245 §3: «`sdd session tokens --since <Inicio>`, que el cierre toma de `patch.md` §5». Lo que dan por existente, comprobado: `--artifact` existe (`cli/src/session/verbs.ts`) y `patch.md` §5 lleva `- Inicio:` desde la plantilla (`patch-template.md`, línea 81). El verbo no lo leía: `git grep -n Inicio -- cli/src` no daba nada, y el reloj de cada transcript empezaba en su primera entrada (`timeline` de `clock.ts`).

## 3. Fix

- **Fichero(s)**: `cli/src/session/verbs.ts`, `cli/src/session/timing.ts`, `cli/src/session/measure.ts`, `cli/src/session/usage.ts`, `cli/src/session/clock.ts`; test en `cli/test/session/timing.test.ts`
- **Cambio**: con `--artifact`, `readStart` lee `- Inicio:` de `patch.md` de la carpeta (la plantilla del walkthrough no lleva `Inicio:`: leerlo de ahí sería código sin caso), y el selector de la sesión lo lleva como `from`: las respuestas y las entradas del reloj anteriores no cuentan, y cada transcript empieza en su primera entrada desde él. La ventana (rama sin transcripts propios) sigue anclada a la creación de la rama.
- **Decisiones**:
  - Sin `Inicio:` en el artefacto (o con el marcador de la plantilla), cuenta como hoy, desde el arranque de la sesión; no se cae al primer commit de la rama, que la fila dejaba abierto: sería un segundo comportamiento con su test, y `patch.md` ya lleva siempre `Inicio:` — sin el dev-lead (perfil delegate; no cambia lo que ve nadie respecto de hoy)
  - El `Inicio:` recorta también los tokens y el coste, no solo el reloj: la 0245 pedía un `--since` para toda la medida — ticket

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | sesión con actividad de 14:04Z a 16:29Z, `patch.md` con `Inicio: 2026-11-02T16:19Z` → `Esfuerzo real` ≤ 0,2 h y `desde 2026-11-02T16:19Z` | RED antes del fix (`expected … to be less than or equal to 0.2`); verde después: `npx vitest run test/session/` → 126/127, el rojo es `window.slow` «con dos worktrees que aportan» por timeout de 5 s con la máquina cargada; solo, pasa (1/1) |

| 2 | guion sobre esta sesión: `sdd session tokens --path . --branch patch/0369-session-tokens-from-start --artifact <copia de esta carpeta>` | `Esfuerzo real: 0,20 h — reloj de la sesión 0,20 h desde 2026-11-25T17:50Z`; sin `--artifact`, `0,23 h … desde 2026-11-25T17:48Z` (el arranque de la sesión, con `sdd-propose` dentro) ✅ |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 798/798 · cli:typecheck: corrió, sin errores · cli:test: 2.592/2.607 en el pre-commit del fix (15 saltados)

Validación en campo: 2026-11-25 · timing.test.ts 38/38 · gate en verde · guion 1/1 sobre la sesión real

Revisión (un revisor sonnet, effort medium, sobre `patch.md` y el diff), sin bloqueantes:

- Fallback a `walkthrough.md` sin test y sin caso (su plantilla no lleva `Inicio:`) — arreglado: se quita.
- La cláusula «dice `desde 16:19Z`» solo vale si hay actividad a esa hora — arreglado: el delta dice que el `desde` es la primera entrada a partir del `Inicio:`.
- `timing.json` con `Inicio:` sin comprobar — arreglado: el test pide `withinMargin: true`.
- Un `Inicio:` posterior a toda la actividad cae a la medida por ventana — rechazado: el cierre mide después del `Inicio:`, y una rama sin transcripts propios se mide por ventana por diseño.
- Una entrada con timestamp ilegible cuenta en tokens — rechazado: ya pasaba con `until`, y los transcripts reales siempre llevan timestamp.
- `(\S+)` corta un `Inicio:` con espacio — rechazado: la plantilla fija el formato ISO sin espacio, y `patch.md` lleva una sola línea `- Inicio:`.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,07 h del gate de cierre (4 min, patch 0286)
- Inicio: 2026-11-25T17:50Z
- Esfuerzo real: 0,21 h — reloj de la sesión 0,21 h desde 2026-11-25T17:50Z, sin 0 min de espera al dev-lead (0 esperas)
- Desviación: −63 % frente a 0,57 h; sin esperas ni huecos medidos: el fix cupo en cinco ficheros de la CLI y un test, menos de lo estimado
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `estimation`

#### ADDED — Con un `Inicio:` en el artefacto, la sesión se mide desde él

- GIVEN una sesión con actividad desde las 14:04Z y un `patch.md` con `- Inicio: 2026-11-02T16:19Z`, cerrado a las 16:29Z
- WHEN se ejecuta `sdd session tokens --path <worktree> --branch <rama> --artifact <carpeta del patch>`
- THEN `Esfuerzo real` es de 0,2 h o menos, y su `desde` es la primera entrada del transcript a partir del `Inicio:` (16:19Z si hay actividad a esa hora)
- AND las respuestas anteriores al `Inicio:` no cuentan tampoco en los tokens ni en el coste, y `timing.json` sigue dentro del margen
- AND sin `Inicio:` en `patch.md`, o con el marcador de la plantilla, cuenta toda la sesión, como sin `--artifact`
- AND una rama medida por ventana sigue contando desde su creación

#### MODIFIED — El cierre guarda el desglose por fase de la sesión

- GIVEN el transcript de una feature con `sdd-propose` a las 13:48, el commit de apertura a las 14:54, `sdd-implement` a las 14:54, `sdd task start` de la task 1 a las 14:57, `sdd-verify` a las 15:35 y `sdd-retro` a las 15:59
- WHEN se ejecuta `sdd session tokens --path <worktree> --branch <rama> --artifact <carpeta>`
- THEN `<carpeta>/timing.json` lleva `version: 1` y las fases `apertura`, `implementacion`, `revision` y `cierre`, en ese orden, cada una con `agentSeconds`, `execSeconds`, `waitSeconds`, `idleSeconds` y `ceremony` (`true` salvo en `implementacion`)
- AND `implementacion` lleva `tasks` con la task 1, `source: "events"`
- AND `|agente + ejecución + espera + hueco − reloj|`, sumado en todas las fases, es de 60 s o menos, o del 1 % del reloj si es mayor, y `withinMargin` es `true`
- AND agente + ejecución de todas las fases da el `Esfuerzo real` de la cuarta línea, con la misma salida en las cuatro líneas que sin `--artifact` mientras el artefacto no lleve `Inicio:`
- AND fuera del margen, el fichero lleva `withinMargin: false`, la CLI avisa por stderr con las dos cifras y sale con 0
- AND sin `--artifact` no escribe ningún fichero
- AND regenerarlo sin cambios en los transcripts ni en la rama deja el fichero idéntico
- AND las claves del fichero van en inglés y los nombres de fase, sin tilde: es un contrato que leen otros verbos
