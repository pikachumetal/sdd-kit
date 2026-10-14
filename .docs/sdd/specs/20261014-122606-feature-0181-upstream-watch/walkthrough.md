---
id: 20261014-122606-feature-0181-upstream-watch
feature: 0181
title: Walkthrough — Vigilancia de fuentes
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-14
---

# Walkthrough — Vigilancia de fuentes

## 1. Cambios realizados

- **Tabla de fuentes y avisos** (`fa72e65c`): `THIRD_PARTY_NOTICES.md` abre con `## Fuentes vigiladas` (`| Fuente | Repo | Versión vista | Fecha |`) de superpowers, OpenSpec, Spec Kit, mattpocock/skills, MADR e impeccable (clonado en `D:/code/github/upstream/impeccable`). Cada aviso lleva su versión: `sdd-grilling` en `85f83d3`, `domain-modeling` en `b0618bc` (posterior a v1.3.1), `writing-skills` 7.0.0 y `writing-for-agents` v1.3.1, comprobadas por blob. Entra el aviso de MADR (`adr-template.md`, MIT OR CC0-1.0) y el de superpowers en `skills/sdd-grilling/NOTICE`. `tests/SuperpowersCompat.Tests.ps1` lee la versión validada en la tabla.
- **Inventario de procedencia** (`fa72e65c`, enmienda del dev-lead): `provenance-scan.mjs` compara frases de 8 palabras de cada `.md` de `skills/` con los clones. Encontró todo el texto copiado ya avisado salvo una frase de `brainstorming` en `sdd-grilling`. La tabla por skill y plantilla, con lo que invoca de fuera, está en `upstream-review.md` § Procedencia: en tiempo de ejecución el kit solo depende de cuatro skills de superpowers.
- **Check `kit:upstream`** (`873880a9`): `tests/upstream/check.ts` (con `tests/upstream/package.json` para que Node lo trate como módulo) y la tarea `upstream` del `moon.yml` raíz. Su Pester es `tests/UpstreamWatch.Tests.ps1`, `Slow`, con 10 casos. `CLAUDE.md` lo pide al preparar una release (regla 5), la fila 0152 lo suma a la batería de release, y «Referencias de vigilancia» de `tech-stack.md` queda en lo que no tiene versión.
- **Revisión de las fuentes** (`a9965de9` y la pasada de fix `ae45b299`): `upstream-review.md`, una tabla por fuente con cada cambio, la pieza del kit, la decisión y el destino. De OpenSpec 1.14.1 van a la fila 0129 el tope de 500 caracteres por requisito y la retirada de una capacidad que un `REMOVED` deja vacía. De Spec Kit v1.2.0, la «Question writing quality» de `clarify` va a una fila de deuda nueva de `sdd-grilling`. mattpocock/skills v1.3.1 e impeccable skill-v4.5.2 no cambian nada que el kit tome. Las versiones vistas suben a la última.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4,5 h
- Esfuerzo real: 1,15 h — reloj del hilo por las marcas de los commits: apertura a las 14:43 y cierre a las 15:52 (hora local), con la espera de la línea base y del revisor final dentro; la spec y el plan, antes, ~0,5 h
- Desviación: −3,35 h (−74 %)
- Causa de la desviación: la estimación contaba la revisión de las fuentes como lectura entera (Spec Kit sin medir) y no aplicó el factor del log (infra/tooling 0,45), aunque el plan lo citaba. La revisión fue por diffs acotados a los ficheros de conceptos y por el barrido mecánico, y el check y su Pester siguieron el patrón de `battery.mjs`. El ratio (0,26) queda por debajo de la banda p25–p75 de infra/tooling (0,37–0,55)
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (spec, plan y ejecución)
- Tokens del hilo: 56.673.318 — claude-opus-5-5 56.673.318 (incluye la spec y el plan, hechos en esta rama)
- Tokens de subagentes: 7.494.110 en 1 despacho — Revisión final rama 0181 claude-opus-5-5 7.494.110 / 9 min
- Coste de la sesión: 22,46 $ (hilo 19,30 $ + subagentes 3,16 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La versión de `sdd-grilling` sale de la fecha de la copia y no de comparar el texto, como decía el ✋ 17 de la spec. El barrido no da ninguna frase en común con ninguna versión de `grilling`, porque la skill es una reescritura.
- `tests/upstream/package.json` (`"type": "module"`), que el plan no listaba: sin él, Node avisa por stderr y ensucia la salida del check.
- La revisión de Spec Kit leyó al principio solo `CHANGELOG.md`, `spec-driven.md` y las plantillas de la raíz. `templates/commands/` entró en la pasada de fix de la revisión final.
- Hubo que condensar `tech-stack.md` dentro de su sección para no pasar del tope de palabras (18.711 → 18.698, tope 18.700).
- La rama tiene un commit de más sobre los tres de las tasks, la pasada de fix, que se juntará en el cierre.

### Decisiones tomadas sin el dev-lead

- Versión de `sdd-grilling` por fecha (`85f83d3`), no por texto: el barrido da 0 frases en común con `grilling` en cualquier versión — si está mal, el aviso nombra un commit vecino.
- superpowers 7.0.0 en el `NOTICE` y en la línea de `sdd-grilling` (14 frases de `brainstorming`) — si está mal, un aviso de más.
- La cabecera «Adapted from `grilling`» de `sdd-grilling/SKILL.md` no se toca (editar una skill pide su RED): va a la fila de deuda nueva de `sdd-grilling` — si está mal, la cabecera sigue incompleta hasta que se trie.
- `New-Source -Url` con `insteadOf` sobre la URL entera, porque `insteadOf` casa por prefijo — si está mal, un test rojo visible.
- `tests/upstream/package.json` con `"type": "module"` en vez de renombrar a `.mts`, para no cambiar el nombre que fija la spec — si está mal, un fichero de 3 líneas de más.
- `tech-stack.md` condensado sin subir el tope — si está mal, el párrafo pierde dos matices.
- El Minor 9 de la revisión final (OpenSpec, casillas y «Workflow follow-up» sin fila) subió a Important: con la vista ya en v1.14.1, el check no volvería a avisar — si está mal, una fila de más.
- El Art. IX sin impeccable va a la fila 0152, y al editar esa línea queda también su punto final — si está mal, una línea más en la 0152.

## 4. Verificación

### 4.1 Builds

- Línea base, antes de la Task 1: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → Pester 1188 · Vitest 846 + 156 + 1002, todo en verde · 4 min 46 s.
- Gate de cierre (`no declarado` en `operations.md` ni en `tech-stack.md` §Testing; las tareas de moon de «Contenido y build»): `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → Pester 1198 (17 omitidos) · Vitest 846 + 156 + 1002, todo en verde · 211 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-14 · gate de cierre verde (Pester 1198, con los 10 de `UpstreamWatch` · Vitest 846 + 156 + 1002, 211 s) · smoke 8/8 THEN, 6 de ellos con ejecución real contra los clones · revisión final opus sobre `a9965de9` (With fixes: 2 Important, corregidos en la pasada `ae45b299`)

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| S1 — todo al día: `Fuentes al día: 1.`, sale con 0 | suite (`UpstreamWatch`, `S1 todo al día`) | ✓ |
| S2 — versión nueva en el origen: `Juguete: vista v1.0.0, última v1.1.0. Revisa: git -C <clone> diff v1.0.0..v1.1.0`, sale con 1 | suite; y ejecución real en el RED de la Task 2: `OpenSpec: vista v1.11.0, última v1.14.1. Revisa: git -C D:\code\github\upstream\OpenSpec diff v1.11.0..v1.14.1` y tres líneas más (Spec Kit, mattpocock/skills, impeccable), salida 1 | ✓ |
| S3 — otras familias y prereleases no cuentan | suite; y ejecución real en S8: OpenSpec con `@fission-ai/openspec@1.14.1`, impeccable con `cli-v`, `engine-v` y `ext-v`, MADR con `4.0.0-beta`, y las seis al día | ✓ |
| S4 — sin la variable: `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`, sale con 1 | suite; y ejecución real (`moon run kit:upstream` desde una shell sin la variable, en la Task 3) | ✓ |
| S5 — sin clone: `<Fuente>: sin clone de <repo> en <carpeta>.`, sale con 1 | suite; y ejecución real con una carpeta vacía: `superpowers: sin clone de obra/superpowers en …\scratchpad\vacio.` (el repo sale en minúsculas, normalizado) | ✓ |
| S6 — la versión vista no es un tag | suite; y ejecución real con OpenSpec en `v9.9.9`: `OpenSpec: la versión vista v9.9.9 no es un tag del clone.`, salida 1 | ✓ |
| S7 — no se puede actualizar el clone: línea que empieza por `Juguete: no se pudo actualizar el clone:`, sale con 1 | suite (`S7 origen inexistente`, con el origen borrado) | ✓ |
| S8 — las fuentes reales, al cerrar: `Fuentes al día: 6.`, sale con 0 | ejecución real: `moon run kit:upstream` con `SDD_UPSTREAM_DIR=D:/code/github/upstream` tras la revisión | ✓ |

### 4.3 Residuales / deuda generada

- A la fila 0129: el tope de 500 caracteres por requisito y la capacidad que un `REMOVED` deja sin requisitos (OpenSpec 1.14.1).
- A la fila 0152: el Art. IX, que enumera las fuentes sin impeccable.
- Fila de deuda nueva: `sdd-grilling`, la pregunta como frase interrogativa con su porqué (Spec Kit) y la cabecera de sus fuentes.
- Fila de deuda nueva: los menores diferidos de la revisión final de esta feature.

## 5. Aprendizajes

- Un `.ts` fuera de un paquete con `"type": "module"` hace que Node avise por stderr (`MODULE_TYPELESS_PACKAGE_JSON`) al ejecutarlo: un script del repo cuya salida se compara lleva su `package.json` al lado → comentario de cabecera de `tests/upstream/check.ts` (`tech-stack.md` y `architecture.md` están en su tope de palabras).
- `git remote get-url` aplica `url.<base>.insteadOf`; para identificar un clone por su origen se lee `git config --get remote.origin.url` → comentario en `tests/upstream/check.ts`.
- Una revisión de fuentes que se da por hecha sube la versión vista, y desde ese momento el check ya no vuelve a avisar de lo que quedó sin leer. La revisión final cazó dos huecos así (`templates/commands/` de Spec Kit y una sección del `schema.yaml` de OpenSpec) → «Referencias de vigilancia» de `tech-stack.md`: «Solo con todo el ámbito leído sube la fila: después, el check calla lo no leído».
- `git` respondió «Out of memory, malloc failed» y PowerShell no arrancaba procesos porque un `testhost` de otra sesión ocupaba 34 GB; terminó solo → al ticket de la feature (entorno de la máquina, no del repo).

## 6. Adendas
