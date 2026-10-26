---
id: 20261026-141903-patch-0220-flaky-red-and-gate-estimate
task: 0220
title: Patch — cierre de un patch: el rojo que no se repite y el gate en la estimación
type: patch
solution: dev-lead
status: done
created: 2026-10-26
branch: patch/0220-flaky-red-and-gate-estimate
commit: 39c8c32e
---

# Patch 0220 — cierre de un patch: el rojo que no se repite y el gate en la estimación

## Capacidades

- Modificadas: `archive` — «Un rojo ajeno se busca en la deuda antes de investigarlo» gana la salida guardada y la salida «No se repite»
- Modificadas: `estimation` — «La estimación de un patch se escribe antes del fix» suma el gate de cierre

## 1. Síntoma

Dos filas de deuda del roadmap, triadas por el dev-lead el 2026-10-26 («Patch nuevo con RED» y «Actuar en el mismo patch»):

- «Un rojo del gate de cierre se da por intermitente con solo relanzarlo en la rama» ([ticket del patch 0170](../../field-reports/20261025-152116-patch-0170-battery-tools.md) §1 y [ticket del patch 0212](../../field-reports/20261026-111623-patch-0212-plan-workspace-temp.md) §1): `cli:test-min` dio 1480/1 en `test/ids/claim.slow.test.ts` (`TypeError: Cannot read properties of undefined (reading 'trim')`); el agente corrió el fichero solo y el gate otra vez en la rama, en verde, y fusionó sin el contraste en la base; filtró la salida con `Select-String` y perdió el nombre del test.
- «La estimación de un patch no cuenta los costes fijos del cierre» ([ticket del patch 0212](../../field-reports/20261026-111623-patch-0212-plan-workspace-temp.md) §2): el 0212 se estimó en 0,5 h y costó 1,20 h (+140 %); la primera pasada del gate de cierre tardó 33 min.

## 2. Solución fijada

Fila 0220 del roadmap y prompt de arranque (dev-lead, 2026-10-26):

- (a) «en `skills/sdd-archive/references/merge-recipe.md`, la salida del gate se guarda entera en el scratchpad antes de filtrarla, y una tercera salida «No se repite» (la misma orden pasa en la rama y en un worktree separado de la base: se cita el test, el error literal y las dos pasadas en una fila de deuda de intermitentes, y se sigue; no se fusiona hasta que acaba el contraste en la base)».
- (b) «en `skills/sdd-propose/SKILL.md` paso 2, la estimación de un patch suma la duración del gate de cierre, de la última medida del proyecto o de su «Gate de cierre»; cada arreglo con su RED (Art. I)».

Lo que da por existente, comprobado: `merge-recipe.md:15-22` («A red suite») solo tiene las salidas «Passes without the branch» y «Fails without the branch too»; `sdd-archive/SKILL.md:46` (paso 6) remite a la receta para un rojo del paso 1 o del 6; `sdd-propose/SKILL.md:54` pide la estimación del patch en horas sin nombrar el gate.

## 3. Fix

- **Fichero(s)**: `skills/sdd-archive/references/merge-recipe.md`, `skills/sdd-propose/SKILL.md`; `tests/batteries/sdd-archive/` (`battery.md`, `subject.sh`: escenario `a3f`, molde `reservas-flaky`), `tests/batteries/sdd-propose/` (`battery.md`, `subject.sh`: escenario `e1`, molde `reservas-gate`)
- **Cambio**: «A red suite» guarda cada pasada entera en el scratchpad antes de filtrarla, no fusiona hasta acabar el contraste y, si sin la rama pasa, repite en la rama: rojo otra vez es de la rama; verde es «No se repite», con fila de intermitentes y se sigue. El paso 6 de `sdd-archive/SKILL.md` (y el 1, donde corre la suite en campo) lleva la salida guardada, el contraste sin limpiar estado y la salida «No se repite»: en el primer GREEN el sujeto no abrió la receta. El paso 2 de `sdd-propose` suma a la estimación del patch la duración del gate de cierre, nombrada, y dice dónde buscar la última medida. `tests/WordBudget.Tests.ps1` gana el margen de la decisión de abajo. Retira: la fila de la racionalización «The merged-result failure is probably flaky» deja de decir que un rojo lo para todo.
- **Decisiones**:
  - Salida guardada entera antes de filtrar, tercera salida «No se repite» y merge solo tras el contraste en la base — dev-lead
  - La estimación de un patch suma la duración del gate de cierre (última medida o «Gate de cierre») — dev-lead
  - Cada arreglo con su RED de sujetos (Art. I) — dev-lead
  - Carril patch con dos arreglos y dos escenarios de batería, no lite — dev-lead (prompt de arranque y fila 0220)
  - Los topes de palabras de `tests/WordBudget.Tests.ps1` ganan un margen del 25 % (`$script:Slack = 1.25`) hasta la v3, que retoma la limpieza: el kit estaba en 91.300 de 91.300 y este patch lo llevaba a 91.392 — dev-lead, 2026-10-26: «estoy un pelin harto de esto del tamaño... estamos construyendo... vamos a dejar d emirarlo... hasta que tengamos el v3 y hayamos limpiado todo. o pon un limite grande.... si al final siemrpe hacemos lo mismo subir...» (Art. constitución «Una pieza entra, otra sale»: los topes suben por decisión del dev-lead escrita en la spec)
  - El margen es un factor sobre la tabla y no tabla nueva: la tabla queda como referencia para la limpieza de la v3 — sin el dev-lead (no cambia lo que ve ni puede hacer el usuario del kit)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED `a3f` (`sdd-archive`, molde `reservas-flaky`, kit de `80bb7555`, sonnet ×2): `red/out/` | 0/2: los dos filtran la primera pasada con `tail`/`grep` (F1); `a3f-2` no ve el rojo y fusiona sin contraste ni fila (F2, F3); `a3f-1` contrasta en un clon, para a preguntar y no abre fila (F3, F4) |
| 2 | RED `e1` (`sdd-propose`, molde `reservas-gate`): `red/out/` | 0/2: «0,25 h» sin el gate y «no doy estimación»; ninguno nombra los 38 min del patch 0007 (E1) |
| 3 | GREEN 1 (texto solo en `merge-recipe.md` y «from its last measure»), descartado: `a3f-1` no abrió la receta, borró `ids-store` antes del contraste y paró; `e1-1` midió su propio gate (1,3 s) | `a3f` 0/1, `e1` 1/2; la regla pasa al `SKILL.md` de `sdd-archive` (pasos 1 y 6, «sin limpiar estado») y `sdd-propose` dice dónde buscar la medida. Un segundo sujeto de `a3f` se cortó al parar la tanda, que corría con la receta truncada por un error mío al reescribirla |
| 4 | GREEN 2: `green2/out/` | `a3f` 2/2 en F1, F2 y F4, F3 1/2 (`a3f-1` cita el error como «`TypeError … reading 'trim'`»); `e1` 2/2: «0,25 h + 0,63 h del gate de cierre (38 min, patch 0007)» |
| 5 | Control de `a3f` tras pedir la línea de error entera, sin «…» (`green3/out/`) | 1/1 en F1-F4: salida en un fichero, contraste en un worktree desanclado de `develop`, fila con `TypeError [Error]: Cannot read properties of undefined (reading 'trim')` y las dos pasadas, merge después |
| 6 | Commit del fix con el pre-commit activo (`git config core.hooksPath` → `.githooks`) | `kit:test-fast` 1289/0 (12 omitidos) |
| 7 | `sdd capability merge` del delta en una copia de `.docs/sdd` y, al cerrar, en el repo; `capability check --artifact`, `decision check`, `roadmap check` | `archive.md` y `estimation.md`: sustituidos; «Capacidades válidas: 20», «Decisiones válidas», «Roadmap válido» |
| 8 | Gate de cierre `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` sobre `39c8c32e`, salida entera en el scratchpad | verde en la 1ª pasada, 28 min 46 s: `kit:test` 1424/0 (14 omitidos), `cli:test` 1198/1198, `cli:test-slow` 299/299, `cli:test-min` 1497/1497 |

Validación en campo: 2026-10-26 · `a3f` RED 0/2 → GREEN 2/2 (F3 1/2) + control 1/1; `e1` RED 0/2 → GREEN 2/2 · gate de cierre en verde a la primera (28 min 46 s) · no probado: un rojo de verdad intermitente en un cierre real (el molde lo simula con una marca en el `.git` común), y la conducta con la regla en un perfil `pair`; la salida del GREEN 1, descartada, queda fuera de git

## 5. Tiempo (ligero)

- Estimación: 3 h — 1,5 h de texto y escenarios, 0,75 h de la campaña RED/GREEN y 0,6 h del gate de cierre (`moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`, 33 min en la última medida, patch 0212 §5)
- Inicio: 2026-10-26T14:19Z
- Esfuerzo real: 1,08 h — reloj de la sesión 1,23 h desde 2026-10-26T14:16Z, sin 9 min de espera al dev-lead (1 espera)
- Desvío: −64 %: la campaña de sujetos costó menos de lo previsto (cada sujeto de 3 a 8 min, en paralelo) y el gate tardó 29 min; la estimación contaba 0,75 h de campaña y 1,5 h de texto
- Coste de sujetos: 3,87 $ en 10 sujetos sonnet — RED 1,09 $; GREEN 1 (descartado), GREEN 2 y control, el resto, con un sujeto cortado contado a 0,83 $ por el lanzador

## 6. Delta de capacidad

### Capacidad: `archive`

**MODIFIED — Un rojo ajeno se busca en la deuda antes de investigarlo**
- GIVEN el cierre de la 0081 cuya suite falla sobre la rama con la base integrada con `TimeoutError: tests/e2e/export.spec.ts:12`
- WHEN el cierre recibe ese rojo
- THEN la salida de cada pasada de la suite ya está entera en un fichero del scratchpad de la sesión, guardada antes de filtrarla
- AND corre el mismo comando en un worktree temporal desanclado de `origin/develop`, y lo retira al acabar; no fusiona hasta que acaba ese contraste
- AND si también falla, escribe `base: en rojo: el mismo comando también falla sin la rama` y busca `export.spec.ts` y `TimeoutError` en la deuda del proyecto antes de abrir el test; si una fila lo nombra, la cita en el informe; si no, abre una fila en «Por triar» de `debt.md` (o en «Deuda técnica» del roadmap 2.x) con la evidencia
- AND para con un bloque que lleva el comando, el código de salida, la ruta del log, las últimas 20 líneas, la línea `base:` y «`develop` sin tocar en `<hash>`», con el hash de `git rev-parse develop`, y pregunta si fusiona igual
- AND si sin la rama pasa, lo repite en la rama: si vuelve a fallar, el rojo es de la rama: vuelve a ella, arregla y repite la suite
- AND si en la rama también pasa, «No se repite»: abre una fila de intermitentes en la deuda, donde abriría la del rojo que también falla sin la rama, con el test, su línea de error copiada entera de la salida guardada, sin «…», y las dos pasadas en verde, y sigue con el cierre en cualquier perfil
- AND con el rojo del `--verify` de `sdd merge`, la línea `base:` es la que da el script, y el cierre sigue igual

### Capacidad: `estimation`

**MODIFIED — La estimación de un patch se escribe antes del fix**
- GIVEN un proyecto con `.docs/sdd/estimation.md` y un patch clasificado por `sdd-propose`
- WHEN el agente abre el patch
- THEN la estimación en horas suma la duración del gate de cierre, de su última medida en el proyecto o de su «Gate de cierre», y la nombra: «0,5 h + 0,55 h del gate de cierre (33 min, patch 0212)»
- AND si pregunta el carril, la pregunta lleva la estimación
- AND, pregunte o no, `patch.md` §5 la escribe antes del fix, y la hora de inicio en UTC en la línea siguiente: `- Estimación: 0,5h` y `- Inicio: 2026-10-09T11:20Z`, con `- Esfuerzo real:` debajo al cerrar
- AND `sdd estimation log` lee `- Estimación: 0,5h` como hoy, y `- Inicio:` no cuenta como estimación ni como real
- AND un `patch.md` cerrado antes con `- Real:` se sigue leyendo igual
