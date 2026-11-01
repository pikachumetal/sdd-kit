---
id: 20261101-175259-feature-0182-doc-citing-comments
feature: 0182
title: Walkthrough — Comentarios que citan documentos, detectados por la CLI
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-01
---

# Walkthrough — Comentarios que citan documentos, detectados por la CLI

## 1. Cambios realizados

- **CLI** (`a0ac81de` y el cierre): `sdd review comments --base <ref>`, en `cli/src/comments/`: `lexer.ts` separa los comentarios por familia de lenguaje, `citations.ts` tiene los patrones, `diff.ts` lee las líneas añadidas y `verbs.ts` cruza y escribe. Sale con 0 encuentre o no. Tests en `cli/test/comments/`.
- **`sdd-verify`** (`d64a49bd` y el cierre): la fila Code de la tabla de ejes y `code-reviewer-prompt.md` llevan la salida del verbo y la regla de juicio. El saldo baja 14 palabras (9.635 → 9.621), pagadas con frases de evidencia de `encargo-revision.md`.
- **Batería** de `sdd-verify`: escenarios `f6` y `f6b`, en el paso `comments`; evidencia en `tests/sdd-verify-0182-comments.md`.
- **Roadmap**: tres filas de deuda pasan de «Actuar → 0182» a «Actuar → 0152»; una fila nueva, la línea sin tope.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 2 h
- Esfuerzo real: 1,16 h — reloj de la sesión 1,25 h desde 2026-11-01T17:49Z, sin 6 min de espera al dev-lead (1 espera)
- Desviación: -0,84 h (-42 %)
- Causa de la desviación (obligatoria si |desviación| > 30%): el esfuerzo real cuenta el reloj de la sesión sin esperas, y los sujetos y los ejes corrieron en segundo plano; la estimación contaba trabajo secuencial.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 19.859.311 — claude-opus-5-5 19.859.311
- Tokens de subagentes: 4.679.396 en 4 despachos — Final review — Architecture axis claude-opus-5-5 1.456.609 / 6 min; Final review — Code axis claude-sonnet-5-5 1.019.031 / 2 min; Final review — Spec axis claude-opus-5-5 1.284.792 / 6 min; Single re-review, final review claude-opus-5-5 918.964 / 7 min
- Coste de la sesión: 15,15 $ (hilo 9,88 $ + subagentes 5,27 $)
- Coste de sujetos: 0,71 $ en 6 sujetos Sonnet — `f6` RED, GREEN, REFACTOR, REFACTOR 2 y pasada de fix; `f6b`
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Un sexto fichero en `cli/src/comments/`: `diff.ts`, que pidió la revisión final para probar el parser sin git.
- Dos sujetos más de los cuatro previstos, dentro del techo de 4 $.
- `f6` no salió con el RED limpio como decía la decisión 11: el GREEN sin la frase de juicio la pidió de vuelta.
- Enmiendas de la spec, con la marca `sin aprobar`, en su sección.

### Decisiones tomadas sin el dev-lead

- `git diff` sin `--no-renames`, con `-M` — un renombrado no cuenta sus comentarios viejos como añadidos — coste si está mal: ninguno, un comentario nuevo sale por su hunk.
- Test añadido tras el RED, la línea añadida que parece una cabecera de diff, con mutante visto en rojo — coste si está mal: un test de más.
- El RED limpio de `f6` no sacó la frase de juicio: el GREEN sin ella marcó el falso positivo (0/1) — coste si está mal: 14 palabras de más, saldo −14 en vez de −74.
- `f6` y `f6b` en el paso propio `comments`, para lanzarlos solos con `STEPS` — coste si está mal: ninguno.
- **Sin tope en la línea impresa, Important adjudicado** — el tope cambia la decisión 4, y no lo decido solo. Una línea minificada con `/^https?:\/\//` y la palabra `spec` imprime 312 KB aunque no tenga comentarios (medido en la re-revisión) — coste si está mal: esos KB entran en el encargo del eje Código. Fila de deuda abierta.
- No reutilizo `BRANCH_CHANGE_FOLDERS` de `ids/scan.ts` — acopla `comments` con `ids` — coste si está mal: una carpeta nueva se añade en dos sitios.
- `Art. Civil` sigue saliendo como `constitution` — deshice mi enmienda porque contradecía la decisión 5 aprobada, «sin distinguir mayúsculas» — coste si está mal: un falso candidato que el revisor descarta.
- Los nombres en inglés de `lexer.test.ts` se quedan — el plan y el Review Focus los nombran así — coste si está mal: ninguno funcional.
- Un binario no sale en `sin leer:`, y fuera de un repo el verbo dice `base: no se encuentra` — coste si está mal: ruido o un mensaje impreciso, nada más.
- `diff.submodule=log` o `diff.ignoreSubmodules=all` esconden un submódulo de `sin leer:` — un submódulo no tiene comentarios que juzgar — coste si está mal: una línea menos.
- La fixture `app-f6b.js` con `Math.trunc(iban)` se queda — no afecta a Q7, y cambiarla pide medir otra vez — coste si está mal: un Important ajeno en `f6b`.
- Seis sujetos frente a cuatro previstos, dentro del techo — Q7 lo exige la ADR 0003 — coste si está mal: 0,22 $.

`sin revisar: cierre — tras la re-revisión, devuelve los patrones de constitution a sin distinguir mayúsculas, pone el submódulo del test con extensión (mutante visto en rojo), cambia el hueco a file:line en la regla de juicio y conserva en tests/ la cifra de los 3 de 4 revisores.`

## 4. Verificación

### 4.1 Builds

- Gate: corre una vez tras integrar la base, en el commit de merge de `sdd merge --sync`; su línea va en el mensaje final, porque este walkthrough va en el commit de cierre.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-01 · suite de la rama en verde (`cli/test/comments`, 71/71, más `word-budget` y `docs-claims`) · smoke de los THEN de `cli` con ejecución real sobre una rama de prueba · `f6` y `f6b` 1/1, leídas a mano · revisión final Spec, Código y Arquitectura sobre `d64a49bd`, y re-revisión con 1 Important abierto, adjudicado; 1 sin revisar.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Lista «spec §3» y «Task 4» con su formato; no el porqué ni la cadena; cierre y exit 0 | ejecución real | `src/save.ts:3 · spec · …`, `src/save.ts:4 · task · …`; exit 0 |
| Sin citas: `ningún comentario cita documentos`, exit 0 | ejecución real | exit 0 |
| Sin `--base`: uso en stderr, exit 2 | ejecución real | `falta la opción --base` y `uso: sdd review package\|comments`; exit 2 |
| Base inexistente: mensaje y exit 1 | ejecución real | `base: no se encuentra nada`; exit 1 |
| No lista una línea existente, Markdown ni lo que trae un merge de `develop` | ejecución real | `src/old.ts`, `docs/a.md` y `src/otra.ts` no salen |
| Cada lenguaje con su tipo, con `--json`; dos tipos en una línea | ejecución real | `a.py`, `b.sql`, `c.html`, `d.cs`, y `f.ts` con `spec, requisito`; `e.py` no sale |
| `foo.spec.ts` no cuenta | ejecución real | la línea no sale |
| `sin leer: a.vue`, sin JSON, Markdown ni evidencia; `unread` en `--json` | ejecución real, y suite para `unread` | correcto |
| El eje Código recibe la salida | ejecución real (`f6`, `f6b`: encargo compuesto con la lista) | correcto |
| Marca Important la cita; el falso positivo solo en «Declined to judge» | ejecución real (`fix/out/f6-1`) | Q6 1/1 |
| Cita a `capabilities/` con motivo y bloque que prohíbe: Important | ejecución real (`fix/out/f6b-1`) | Q7 1/1 |
| Una cita que la lista no trae también es hallazgo | no probado | la frase está en el encargo; ningún sujeto lo ejercita |

### 4.3 Residuales / deuda generada

- La línea impresa sin tope: fila nueva de deuda.
- `battery.mjs verdict` da verde en `f6` aunque Q6 falle: solo mira que el sujeto informe; la fila se lee a mano, como ya dice «Baterías por skill» de `tech-stack.md`.

## 5. Aprendizajes

- Una lista de candidatos crea la presión que el RED sin ella no tenía: convierte en hallazgo lo que el revisor aceptaba. → `tech-stack.md`, «Baterías por skill».
- Revisión de skills: `.claude/skills/` solo tiene `skill-creator`; este trabajo no revela ninguna skill nueva ni desmiente esa. → no aplica, mirado.

## 6. Adendas
