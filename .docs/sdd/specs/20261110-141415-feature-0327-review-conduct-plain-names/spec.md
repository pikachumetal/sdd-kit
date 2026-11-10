---
id: 20261110-141415-feature-0327-review-conduct-plain-names
feature: 0327
title: La revisión de la spec ve una prueba que pasa sin la conducta, y el 🦆 no nombra ids sin explicarlos
mode: full
profile: delegate
status: approved
created: 2026-11-10
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-10
---

# Spec — La revisión de la spec ve una prueba que pasa sin la conducta, y el 🦆 no nombra ids sin explicarlos

🦆 Dos arreglos de lo que salió en la 0326. Primero: cuando una spec cambia una skill y su prueba solo comprueba que el agente escribe una palabra, el revisor de la spec lo dice antes de gastar en sujetos; en la 0326 se gastaron 3,40 $ en cuatro tandas de una prueba que pasaba con escribir «borrador» sin contar nada. Segundo: el párrafo que explica una parada no nombra un escenario o una fila de la batería, como `co2p`, sin decir antes qué es. Cada arreglo entra solo si su prueba falla hoy con el kit de `develop`.

Validación: agente — son dos frases de skills; lo que se ve es el comportamiento de sujetos en una batería, que el agente mide; la validación en campo de este repo la hacen los tickets.

## Capacidades

- Modificadas: `feature-flow` — el revisor de la spec señala una prueba que pasa sin la conducta (requisito nuevo)
- Modificadas: `explaining` — el 🦆 de una parada no nombra un id de la batería sin decir qué es (requisito nuevo)

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: zona sin leer (la batería de `sdd-rubber-duck`) · tamaño: ~40 líneas en 6 ficheros
- Dominio (opus): si el punto (2) reescrito de `review-spec.md` cubre una fila de rúbrica que pasa por una palabra sin quitar lo que hoy pide, y si `s5` y `rc1` pueden fallar por la conducta y no por la forma (señal: zona sin leer)
- Hecha: un revisor opus, 10 hallazgos (6 Importantes, 4 Menores), todos aceptados
- Mínimo razonable: este mismo revisor en sonnet — deja sin la lente de Opus el juicio de si `rc1` se acierta a ojo, el fallo que costó la 0326

1. **Enfoque de (1): reescribir el punto (2) del encargo del revisor de `review-spec.md`**, frente a un chequeo de `battery.mjs` que avise de filas de una sola palabra (no sabe qué es conducta) o una parada tras dos GREEN rojos (llega tarde, con el dinero ya gastado). Decisión central.
2. **Texto de (1)**: «(2) delta requirements without a GIVEN/WHEN/THEN scenario, or whose scenario or battery row passes without the behavior —a word the agent writes, a value it gets right by eye—;» en lugar de «(2) delta requirements without a GIVEN/WHEN/THEN scenario or with a scenario that can't be verified;». Un escenario que no se puede verificar sigue dentro: pasa sin la conducta.
3. **Saldo de (1)**: en el mismo fichero, «Without the split, the common points are paid twice: 4 of 18 findings duplicated in the field (task 0009, ~100k tokens per reviewer) and 8 of 19 —42 %— in the RED of this rule (`tests/spec-review-lenses-red.md`).» pasa a «Without the split, 8 of 19 findings —42 %— came duplicated (`tests/spec-review-lenses-red.md`).», que conserva la medida del RED de esa regla y su fuente; saldo del fichero, −10. Sale la medida de campo de la task 0009: el recorte es para compensar, no una regla movida.
4. **Enfoque de (2): la lista de jerga de `sdd-rubber-duck`**, frente a la frase de idioma que incluyen todas las skills (15 skills: crecería 15 veces lo que se añada) o nada (la regla de explicar los términos ya está en `CLAUDE.md` y falló hoy).
5. **Texto de (2)**: «No file paths, function or variable names, commands, flags or kit jargon (RED, sha, worktree, subagent, THEN) in the explanation.» pasa a «No file paths, function or variable names, commands, flags, kit jargon (RED, sha, worktree, subagent, THEN) or unexplained ids in the explanation.»: +2 palabras; con el −10 de `sdd-propose`, las dos skills juntas bajan 8. Se queda «in the explanation», que deja como está la lista «Dónde mirar» del modo largo, y el ejemplo no es un id de ninguna batería.
6. **RED antes de escribir**: (1) con `rc1` de la batería de `sdd-propose` (la spec de la 0031 prueba su THEN con `text: /pendiente/`, que pasa con decir «pendiente» sin nombrar la fila); (2) con `s5` de la de `sdd-rubber-duck` (material de una parada por dinero con `co2p` y `CO2P-M`). Kit de `develop`, n = 2. Si un RED sale limpio, se mide un sujeto más (n = 3, fila «Controles» de la previsión) y, limpio también, su arreglo no se escribe (Scope «si el RED lo exhibe»).
7. **Sin parada tras dos GREEN rojos** en el bucle de tasks (propuesta del ticket 0326 §1): si el revisor ve la prueba floja antes de gastar, la parada llega tarde; y Art. I ya para cuando la prueba supera su previsión.
8. **Validación: agente**, con la validación en campo de este repo.
- Política de modelos: revisor de la spec, uno en opus · ejes de la revisión final: Spec opus+high, Código sonnet+high · sujetos de `rc1` y `s5` en sonnet, en una tanda por batería · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — 1: `R12` también fallaba por «qué se mide», y el material no lo decía → el material de `s5` dice qué mide la prueba y `R12` solo mira los ids.
- **Aceptado** — 2: el ejemplo de la skill era `co2p`, el id de `s5` → la frase dice «unexplained ids», sin ejemplo de batería (decisión 5).
- **Aceptado** — 3: quitar «in the explanation» tocaba el modo largo → se queda (decisión 5).
- **Aceptado** — 4: `RC1` pasaba también por el mensaje final del hilo → solo «Hallazgos de la review» o la lista del revisor en `tools.txt`.
- **Aceptado** — 5: la fixture de la 0031 traía defectos más llamativos que la fila floja → fixture limpia salvo la fila: capacidad nueva declarada, 🦆, «Lo que se retira», «Términos y ADR» y previsión con sus líneas `suma:`.
- **Aceptado** — 6: la medida n = 3 de un RED limpio no estaba en la previsión → fila «Controles».
- **Aceptado** — 7: `rc1` a la media sale barato → nota de precio con `t1` y `co6`, y parada si se pasa.
- **Aceptado** — 8: el recorte de la decisión 3 quita una medida de campo → dicho en la decisión 3.
- **Aceptado** — 9: `s5` sin el prefijo de modo corto mediría el enrutado → `subject.mjs` se lo pone («Dónde se prueba»).
- **Aceptado** — 10: el revisor de `rc1` va en Sonnet → dicho en «Dónde se prueba».

### Decisiones tomadas con el dev-lead

- Los dos hallazgos del ticket 0326 se arreglan ya, sin fila de deuda — «NO PUEDE HABER DEUIDA, por vez 1000 hazlo ya» (2026-11-10).

## Intent

En la 0326 se gastaron 3,40 $ en cuatro tandas de una prueba que pasaba si el agente escribía «borrador», sin que contara nada, y el dev-lead paró dos veces: por el tiempo y por un id de escenario (`co2p`) que nadie le había explicado. Éxito: el revisor de una spec como la de la 0031 señala que su fila de rúbrica pasa sin la conducta, y el 🦆 de una parada por dinero se entiende sin conocer la batería. Fracaso aunque funcione: una skill que crece, o un arreglo escrito sin un RED que falle.

## Scope

- Entra, si el RED lo exhibe: (1) el punto (2) del encargo del revisor en `skills/sdd-propose/references/review-spec.md`, con el saldo de la decisión 3.
- Entra, si el RED lo exhibe: (2) la frase de jerga de `skills/sdd-rubber-duck/SKILL.md` (decisión 5).
- Entra: los escenarios `rc1` (y su fixture `spec-0031.md`) y `s5`, con sus filas de rúbrica, y `dist/` con `moon run kit:build`.
- No entra: la parada tras dos GREEN rojos (decisión 7); los menores del ticket 0326.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «(2) delta requirements without a GIVEN/WHEN/THEN scenario or with a scenario that can't be verified» | `skills/sdd-propose/references/review-spec.md` §3 | Scope (1), decisión 2 |
| «4 of 18 findings duplicated in the field (task 0009, ~100k tokens per reviewer)» | `review-spec.md` §3 | Scope (1), decisión 3 |
| «kit jargon (RED, sha, worktree, subagent, THEN) in the explanation» | `skills/sdd-rubber-duck/SKILL.md` «Words» | Scope (2), decisión 5 |

- Filas que implementa: 0327 → `.docs/sdd/roadmap.md` (fila 0327, antes de la 0198) · comprobado con `git grep -n "0327"` fuera de las carpetas de evidencia.

## Approach

- (1) A — reescribir el punto (2) del revisor: una frase, la lee el revisor que ya se despacha. B — un aviso de `battery.mjs` ante filas de una palabra: mecánico, pero no distingue una palabra que es conducta de una que no. C — parar tras dos GREEN rojos: el dinero ya se gastó.
- (2) A — la lista de jerga de `sdd-rubber-duck`, que escribe el 🦆 de toda parada. B — la frase de idioma de las 15 skills: 15 veces las palabras. C — nada: falló hoy.
- Elegidos: (1) A y (2) A — el sitio donde se decide, sin alargar ninguna skill.

## Dónde se prueba

- (1): `rc1` de `tests/batteries/sdd-propose/battery.md`, fila `RC1`; RED con el kit de `develop` y GREEN con la rama, n = 2.
- (2): `s5` de `tests/batteries/sdd-rubber-duck/battery.md`, fila `R12`; igual. `subject.mjs` le antepone «Invoca la skill sdd-kit:sdd-rubber-duck en modo corto y » en las dos fases, como la invoca una parada, para no medir el enrutado.
- En `rc1` el revisor lo despacha el sujeto con la rúbrica de `review-spec.md`: en Sonnet, porque la 0031 no toca roles. RED y GREEN miden un revisor Sonnet.
- Los topes: `cli/test/kit/word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `feature-flow`

#### ADDED — El revisor de la spec señala una prueba que pasa sin la conducta

- GIVEN una spec que edita `skills/aviso-cierre/SKILL.md` para que el aviso nombre la fila 0011, y prueba su THEN con la fila de rúbrica `` `text: /pendiente/` ``
- WHEN la revisa el revisor de la spec
- THEN devuelve un hallazgo que dice que la fila pasa con un aviso que dice «pendiente» sin nombrar la 0011

### Capacidad: `explaining`

#### ADDED — El 🦆 de una parada no nombra un id de la batería sin decir qué es

- GIVEN una parada por dinero cuyo material dice «RED de `co2p` 0/2, `CO2P-M` falla en co2p-1 y co2p-2; el GREEN cuesta 1,31 $ más»
- WHEN una skill invoca `sdd-rubber-duck` en modo corto
- THEN el párrafo dice qué se mide y qué cuesta seguir sin nombrar `co2p` ni `CO2P-M`, o diciendo antes qué es cada uno

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-propose` (total, `dist/`) | 13.927 / 13.927 | 0 | 13.927 − 10 (`split(/\s+/)` de las frases de las decisiones 2 y 3 → +14 y −24) · sin cambio |
| `sdd-rubber-duck` (`SKILL.md` y total) | 593 / 600 | 7 | 593 + 2 (`split(/\s+/)` de las frases de la decisión 5 → +2) · sin cambio |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="rc1" N=2` → `suma: 2 sujetos · coste previsto: 1.30 $ · sin precio medido: rc1 (a 0.65 $, la media de los escenarios medidos)`; `SCENARIOS="s5" N=2` → `suma: 2 sujetos · coste previsto: 0.24 $ · sin precio medido: s5 (a 0.12 $, la media de los escenarios medidos)` | 1,54 |
| GREEN | las mismas líneas | 1,54 |
| Una tanda de REFACTOR | 0: las frases son la forma mínima | 0 |
| Controles | solo con un RED limpio: `SCENARIOS="rc1" N=1` → `suma: 1 sujetos · coste previsto: 0.65 $ · sin precio medido: rc1 (a 0.65 $, la media de los escenarios medidos)` y `SCENARIOS="s5" N=1` → `suma: 1 sujetos · coste previsto: 0.12 $ · sin precio medido: s5 (a 0.12 $, la media de los escenarios medidos)` | 0,77 |
| Medición tras la revisión final | 0: la revisión final no toca las frases medidas; si las toca, se mide con las mismas líneas | 0 |
| Suma | 10 sujetos | 3,85 |

`rc1` sale a la media (0,65 $), pero un sujeto del paso 4 que despacha un revisor cuesta más: `SCENARIOS="t1" N=1` → `suma: 1 sujetos · coste previsto: 1.10 $`, `co6` 0,93 $. A ese precio la Suma es 5,92 $: si lo gastado pasa de 3,85 $, se para y se pregunta.

## Enmiendas

- 2026-11-10, aprobada por el dev-lead («1»): los RED de `rc1` y `s5` salieron limpios 3/3, y el eje Spec de la revisión final vio que `rc1` no reproduce la 0326: allí la fila floja vivía en la batería, que el revisor no lee, y en `rc1` está escrita en la spec. Entra el escenario `rc2`: la spec solo nombra la fila `C1-A` y la fila (`text: /pendiente/`) vive en `tests/batteries/aviso-cierre/battery.md` del molde; fila `RC2`. Si su RED (n = 2) sale rojo, entra la frase de la decisión 2, con el saldo de la decisión 3, y GREEN n = 2; si sale limpio, un sujeto más y, limpio, no entra. `SCENARIOS="rc2" N=2` → `suma: 2 sujetos · coste previsto: 1.30 $`; medido en `rc1`: ~0,45 $ por sujeto. Gastado: 1,94 $; techo, el de la Suma (3,85 $). La frase de la decisión 5 no entra (`s5` limpio 3/3).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-10 | aprobada («1») |
