---
id: 20261118-151815-feature-0349-critical-path-rule
feature: 0349
title: Walkthrough — El camino crítico
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-18
---

# Walkthrough — El camino crítico

## 1. Cambios realizados

- **Plantillas** (`5a1ea146d`): `critical-path-template.md` nueva; «Camino crítico» y «Tests de feature» en `operations-template.md`; «Dónde se prueba» pide el nivel más bajo que ve el fallo y, con camino crítico, marca cada test de feature o fila propuesta; huecos en `patch-template.md` §4 y en el 4.1 del walkthrough. Glosario de `PRODUCT.md` y fila de `architecture.md`.
- **`sdd-tdd`** (`316edd7fb`): `writing-e2e.md` condiciona a «Camino crítico» la lista y el test de títulos, a saldo cero de palabras.
- **`sdd-verify`** (`cca0f0075`): el eje Código recibe «Camino crítico» y marca el test que ve un nivel más bajo (con `git ls-files`) y todo cambio a `critical-path.md`.
- **`commit-milestones.md`** (`3122a08c0`): el cierre de feature y el de patch llevan el borrado.
- **`sdd-archive`** (`d3598144c` y el cierre): `closing-suite.md` con el orden del camino crítico (tests de feature una vez, check por prefijo, pregunta de la fila, borrado de los `fuera:` en el commit de cierre, suite sobre el árbol borrado) y el aviso de `ya-en-base:` en el mensaje final.
- **Baterías**: `cp1` (`sdd-propose`), `cpt2` (`sdd-implement`), `cpt3` (`sdd-verify`), `cpt4`, `cpt4n`, `cpt5` y `cpt6` (`sdd-archive`), con el check falso `fixtures/critical-path/check.mjs`.
- ADR: los tests de integración y E2E de una feature o un patch se borran al cerrar y solo la lista del camino crítico queda → decisions/0037-critical-path-feature-tests.md

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 6 h
- Esfuerzo real: ~3 h, aproximado con las marcas de los commits (la sesión corrió desde el checkout de `develop`, y `sdd session tokens` mezcla sus otras features)
- Desviación: −3 h (−50 %)
- Causa de la desviación: sin medir; las tasks de plantillas y de `commit-milestones.md` fueron cortas y el RED limpio de `cpt2` quitó la guía nueva de `sdd-tdd`
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: no medido (la sesión corrió desde el checkout de `develop`)
- Tokens de subagentes: no medido (ídem); despachos: 3 revisores de la spec, 2 ejes de la revisión final y 1 re-revisión
- Coste de la sesión: no medido (ídem)
- Coste de sujetos: ~10,3 $ en 31 sujetos sonnet — RED, GREEN, REFACTOR, controles y pasada de fix de `cp1`, `cpt2`-`cpt6`, `f5`, `e1` y `g5`
- Review de spec: 2 revisores y segunda ronda · hallazgos 30, aceptados 26

## 3. Desviaciones del plan

- Task 2: `cpt2` midió una sesión que carga `sdd-tdd` y amplía un E2E, no el encargo `t1a` del implementador, que no carga `sdd-tdd`. Su RED salió limpio y no entró guía nueva en `implementer-prompt.md` (Art. I).
- Task 5: la pregunta de la fila y los avisos van en `closing-suite.md` y en la frase de la decisión de `SKILL.md`, no en `validation-modes.md`.
- Pasada de fix: escenarios `cpt4n` y `cpt6` y controles `e1` y `g5`, que el plan nombraba y la Task 5 dejó fuera.

### Decisiones tomadas sin el dev-lead

- Task 1: `PRODUCT.md` y `architecture.md` pasaban su tope de palabras; se condensó texto vecino — si quitó un matiz, se recupera del historial.
- Task 2: RED de `cpt2` limpio, sin guía nueva en `sdd-tdd` ni en el brief — si un caso real escribe el test de títulos con camino crítico, `cpt2` no lo vio.
- Task 3: el hueco «Project E2E» de `code-reviewer-prompt.md` cambió de literal y con él las claves de `axis-f4/f5/f6/f6b.json` — otra batería con el literal viejo fallaría al componer.
- Task 4: la frase va en las dos filas de cierre, feature y patch.
- Task 5: la sección de `closing-suite.md` se compactó para caber en el tope de `sdd-archive`; un sujeto de control `cpt4` salió igual.
- Revisión final: la task escribe el unitario porque lo fija «Dónde se prueba» y los RED son del hilo, sin regla en el brief; las paradas por dos ficheros con el mismo final y por una suite de `cubre` ausente, sin escenario propio; «Límites» dice «una vez por cierre» y una pasada de fix reinicia el orden; en `manual` la pregunta de la fila va sola; el check del molde pasa ficheros enteros; el eje Código de `cpt3` recibe «Camino crítico» por fixture; `architecture.md` perdió la medida «197 s frente a 227 s»; el check del molde no implementa `fila-nueva:` ni `freno-modificado:`; `operations-template.md` admite `ninguno` hasta la pregunta de `sdd-init` de la 0350.

## 4. Verificación

### 4.1 Builds

- `moon run kit:build`, `pnpm exec vitest run test/kit/word-budget.test.ts` → 77/77 en cada task y en la pasada de fix.
- Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 779/779 · cli:typecheck: corrió · cli:test: corrió 2507/2519 (12 saltados por el runner) · 2 min 13 s · configuración: la del gate · sobre la pasada de fix más el arreglo posterior a la re-revisión, solo texto de `closing-suite.md`; se repite sobre el commit de cierre
- Tests de feature: no aplica (este repo no declara «Camino crítico»)

### 4.2 Smoke / tests

- Validación en campo: 2026-11-18 · baterías GREEN cp1 2/2 (REFACTOR), cpt2 2/2, cpt3 2/2 (REFACTOR), cpt4 2/2 hasta la parada, cpt4n 1/1, cpt5 2/2, cpt6 1/1; controles f5 2/2, e1 1/1, g5 1/1 · revisión final Spec y Código sobre d3598144c, With fixes, pasada de fix juntada en el cierre, re-revisión opus+high sobre d3598144c..pasada de fix, todo resuelto salvo un Important de la pasada, arreglado después y sin revisar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `feature-flow` «Dónde se prueba»: el unitario existente, y de feature o fila propuesta | `cp1` REFACTOR 2/2 | ✅ |
| `feature-flow`: la task no toca la lista | `cpt2` 2/2 (CPT2-W) | ✅ |
| `feature-flow`: el unitario y no el de integración | sin escenario: lo fija «Dónde se prueba» (`cp1`) | ⚠ ruling |
| `feature-flow`: sin test de títulos con camino crítico | `cpt2` 2/2 (CPT2-T) | ✅ |
| `verification`: el eje Código recibe «Camino crítico» | `cpt3` (fixture) | ✅ |
| `verification`: marca el nivel alto y la lista, no «no core flow» | `cpt3` REFACTOR 2/2; control `f5` 2/2 | ✅ |
| `archive`: tests de feature una vez, pregunta, sin escribir la lista | `cpt4` 2/2 | ✅ |
| `archive`: borra solo lo de la rama, en el commit de cierre, 4.1, suite sobre el árbol borrado | `cpt4n` 1/1 | ✅ |
| `archive`: lista ausente o `sin-base:`, para sin borrar | `cpt6` 1/1 | ✅ |
| `archive`: patch | sin escenario: mismo paso de la misma skill | ⚠ ruling |
| `archive`: aviso de `ya-en-base:`, sin borrar ni abrir fila | `cpt5` 2/2 | ✅ |
| `commit-history`: el borrado en el commit de cierre | `cpt4n` 1/1 | ✅ |

### 4.3 Residuales / deuda generada

- `sdd-archive/SKILL.md` en 19.362 bytes de 20.000 (`kit:skill-size`) y en el tope de palabras de la skill: la próxima regla del cierre tiene que sustituir texto.
- El contrato con `sdd-project-template` (su 0105-0107) no se ha probado contra su check real: la primera feature con «Camino crítico» en un template lo dirá.

## 5. Aprendizajes

- Un molde de cierre cuyos tests de feature entran después de la revisión final hace que el sujeto los trate como ajenos: el RED de `cpt4` hubo que repetirlo con los tests dentro de la Task 2. Ya vive en `operations.md`, «El texto que planta un molde tiene que ser cierto en el molde» (feature 0236): sin cambio de documento.
- Sin revisar: el arreglo posterior a la re-revisión que restituye «a red is a fix pass» en el paso 1 de `closing-suite.md`, en el commit de cierre.
- Retro: documento o skill desmentido → ticket del kit: `sdd session tokens --path <worktree>` no encuentra los transcripts cuando la sesión trabaja en un worktree pero corre desde otro checkout (aquí, el de `develop`), y el walkthrough se queda sin tiempo ni coste medidos
