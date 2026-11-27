---
id: 20261127-140326-patch-0373-cli-lines-md013
task: 0373
title: Patch — `sdd session tokens` y `sdd ledger rulings` parten sus líneas a 120 columnas
type: patch
solution: ticket
status: done
created: 2026-11-27
branch: feature/0373-cli-lines-md013
commit: <hash>
---

# Patch 0373 — `sdd session tokens` y `sdd ledger rulings` parten sus líneas a 120 columnas

Validación: agente, «Perfil delegate» — la salida de dos verbos de la CLI y su lectura por `estimation log`: no hay nada
que una persona observe que los tests no midan; el uso real lo valida en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `estimation` — los subagentes se miden aparte del hilo: con muchos despachos, la línea se parte
- Modificadas: `implementation` — los rulings del ledger se cosechan antes de borrar el workspace: la salida de texto se
  parte

## 1. Síntoma

Ticket de la feature 0718 de document-manager §4: «el commit de cierre lo rechazó dos veces el pre-commit por MD013
(200 columnas): la línea de `session tokens` pegada sin cambios en el walkthrough (706 caracteres) y 15 líneas de
rulings de `tasks.md` (hasta 567)». Segundo caso tras el ticket de la feature 0034: 1.303 caracteres con 18 despachos.

Medido en la base: con 10 despachos, `sdd session tokens` imprime la línea `- Tokens de subagentes:` en una sola línea
de más de 1.000 caracteres.

## 2. Solución fijada

Fila 0373 del roadmap, del triaje del ticket: «GIVEN 10 despachos de subagentes WHEN `sdd session tokens` imprime su
línea THEN ninguna línea pasa de 120 columnas y `sdd estimation log` la sigue leyendo». El ticket propone «parten su
salida a 120 columnas con sangría de continuación». Lo que da por existente, comprobado: el paso 2 de `sdd-archive`
manda pegar sin cambios las dos salidas, y el lector (`cli/src/estimation/fields.ts`, `getFieldText`) toma el texto
que sigue a la etiqueta hasta el fin de línea y lee solo la cifra del principio.

## 3. Fix

- **Fichero(s)**: `cli/src/cli/wrap.ts` (nuevo), `cli/src/session/measure.ts`, `cli/src/tasks/verbs.ts`
- **Cambio**: `wrapLine` parte una línea por palabras a 120 columnas, con dos espacios de sangría en cada continuación
  (en Markdown, la continuación sigue en el mismo elemento de lista). La salida de texto de `session tokens` (menos las
  filas de la tabla) y la de `ledger rulings` pasan por él; `--json` no cambia.
- **Decisiones**:
  - Partir a 120 columnas con sangría de continuación, no un dato por línea — ticket (su propuesta); un ruling es texto
    libre y no tiene grupos, y así un solo helper sirve a los dos verbos — sin el dev-lead, no cambia lo que se lee
  - Las filas de la tabla no se parten: una fila de tabla Markdown no admite continuación, y con cifras reales mide
    ~105 columnas — sin el dev-lead
  - Una palabra de más de 120 caracteres (una URL) queda entera en su línea — sin el dev-lead

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | 10 despachos → ninguna línea de texto de `session tokens` pasa de 120 columnas | ✅ RED: una línea de más de 1.000 caracteres; GREEN tras el fix |
| 2 | un ruling largo → partido a 120 con continuación de dos espacios, mismo texto | ✅ RED por compilación (`wrap.ts` no existía); GREEN |
| 3 | `estimation log` lee igual un walkthrough con el formato viejo y otro con el partido | ✅ verde ya en la base: el lector lee la cifra inicial de la primera línea; queda como guarda de regresión |

`node node_modules/vitest/vitest.mjs run test/session test/tasks/rulings.test.ts test/estimation` (desde `cli/`) → 260
verdes y 9 `.slow` caídos por el tope de 5 s del runner rápido; con `--test-timeout 120000`, los tres `.slow` de
`session` 21/21. `tsc --noEmit` sin errores.

Desvío de la copia RED: en `tokens.test.ts`, la línea de subagentes se busca en las líneas crudas y no con `line()`,
porque `line()` (en `test/session/helpers.ts`) pasa a juntar las continuaciones para que los tests que comparan una
línea entera sigan comparando el texto lógico; la aserción no cambia.

Revisor (sonnet, effort medium), sin hallazgos importantes; los cuatro menores, arreglados:

1. `wrapLine` perdía la sangría inicial de la línea → la conserva (test en `rulings.test.ts`).
2. Con espacios dobles dejaba un espacio al final de la línea partida (MD009) → parte con `/ +/`.
3. Una continuación que empezase por `-`, `#` o `1.` se leería como otro elemento de lista, también por
   `getFieldText` → el corte se adelanta una palabra para que el marcador no abra la continuación (test).
4. Sin test del verbo `ledger rulings` → `native.slow.test.ts`: un ruling largo sale partido en texto y entero con
   `--json`; 4/4 con `-t rulings`.

Los consumidores: el revisor buscó en `cli/src`, `skills/` y `cli/test/kit` otro lector línea a línea de las dos salidas
y no lo hay; `minutesAfterHours` no lee la continuación de `Esfuerzo real`.

## 5. Tiempo (ligero)

- Estimación: 1 h + 0,08 h del gate de cierre (tope de 5 min, `operations.md`)
- Inicio: 2026-11-27T14:03Z
- Esfuerzo real: <pendiente>
- Coste de sujetos: no aplica

## 6. Delta de capacidad

### Capacidad: `estimation`

#### MODIFIED — Los subagentes se miden aparte del hilo

- GIVEN la sesión anterior con `subagents/agent-x1.jsonl` (una respuesta de `claude-opus-5-5`: entrada 10, lectura 500.000 y salida 10.000, entre las 10:00 y las 10:12) y su `agent-x1.meta.json` con `description` «Revisión final de rama»
- WHEN se ejecuta el script
- THEN la línea empieza por `Tokens de subagentes: 510.010 en 1 despacho — Revisión final de rama claude-opus-5-5 510.010 / 12 min` (con dos o más, «despachos» y los despachos separados por `; `)
- AND los tokens del subagente no se suman a los del hilo
- AND un despacho cuya última respuesta no acaba en texto ni en `SubagentHandback` (sigue trabajando) sale con `, en curso` detrás de los minutos: `… 510.010 / 12 min, en curso`
- AND con 10 despachos ninguna línea de texto que imprime pasa de 120 columnas, salvo las filas de la tabla: la que pasaría se parte por palabras y cada continuación empieza por dos espacios, con el total en la primera línea, que `sdd estimation log` sigue leyendo igual que en el formato de una línea

### Capacidad: `implementation`

#### MODIFIED — Los rulings del ledger se cosechan antes de borrar el workspace

- GIVEN el ledger de un plan con `Task 2: Ruling: el umbral queda en 30 s — el plan decía 20 y el test tarda 24`, `Final: minor (deferred) nombre de variable poco claro en parse()` y `Final: Ruling: no se renombra Foo — fuera de alcance`
- WHEN el cierre ejecuta `node sdd.js ledger rulings <plan.md>`
- THEN escribe esas tres líneas en el orden del ledger y sale con 0
- AND sin ledger escribe `Sin rulings` y sale con 0
- AND una fila de tabla del ledger (la del pre-flight) que contiene `Ruling:` no sale: solo cuentan las líneas que no empiezan por `|`
- AND un ruling de más de 120 columnas sale partido por palabras, cada continuación con dos espacios delante; con `--json`, entero
