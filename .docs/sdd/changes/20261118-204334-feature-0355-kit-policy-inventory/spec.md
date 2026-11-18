---
id: 20261118-204334-feature-0355-kit-policy-inventory
feature: 0355
title: Spike — inventario del texto del kit que es política de cada proyecto
mode: spike
profile: delegate
status: approved
created: 2026-11-18
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-18
---

# Spec — Spike: inventario del texto del kit que es política de cada proyecto

🦆 Hoy el kit le dice a cada proyecto cómo escribir sus E2E, cuánto puede tardar su suite, cuántos retries lleva, cómo es el guion de validación o con qué verifica la pantalla, aunque cada proyecto lo decide a su manera: `document-manager` ya tiene su propia skill de guion y le iba mejor. Este spike lee las 24 skills, sus referencias y plantillas, y apunta cada trozo que dicta una regla del proyecto en vez de leerla de lo que el proyecto declara. Para cada trozo dice si se queda en el kit, si sale a una skill del proyecto que el kit carga cuando existe, o si sale al template del proyecto, con su motivo y sus palabras: por ejemplo, `writing-e2e.md` (999 palabras) de `sdd-tdd`. Al final, `research.md` suma lo que saldría de cada skill y propone en qué versiones cortarlo; no se retira nada: eso lo decides tú después.

Validación: agente — la salida es un documento y sus recuentos, que el agente mide; con `validation.mode: field`, la verificación es la tabla y la comprobación de sus sumas.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec: ninguna, por carril — `sdd-propose` la pide en full y lite; un spike sin delta no la lleva (como la 0299; la 0341 la tuvo por petición del dev-lead).

1. **Enfoque: A, barrido con marcadores más índice de encabezados de cada fichero, y lectura entera de cada fichero con un acierto, frente a B y C (ver Approach).**
2. **Qué es una pieza**: el bloque más pequeño con un solo destino, normalmente una sección `##` o `###`, una regla numerada, un campo de plantilla o una fila de una tabla de racionalizaciones. Un bloque que mezcla enganche y política se parte en dos filas: la línea que lee lo que el proyecto declara se queda y la regla sale.
3. **Criterio de frontera**, de las decisiones de la fila: **se queda** lo común a todos los proyectos (flujo, TDD sin niveles como el de superpowers, artefactos, ids, roadmap, que el cierre corra la gate del proyecto, el ciclo de vida de los tests de la 0349) y todo lo que **lee** algo que el proyecto declara y actúa según su valor; **sale** lo que **dicta** un valor, una herramienta, un formato o un procedimiento que cada proyecto decide a su manera (un runner, un tope de minutos, unos retries, cómo se escribe un E2E, cómo es el guion).
4. **Dónde va lo que sale**, entre los dos destinos de la fila:
   - **Skill del proyecto** que el kit carga si existe: un procedimiento que el agente sigue en un paso del flujo (cómo escribir un E2E, el guion de validación, los pasos de verificar una pantalla). Modelo: `.claude/skills/validation-script/SKILL.md` de `document-manager`.
   - **Template** (`sdd-project-template`): un valor o un campo que el proyecto declara, o un check que corre su gate (el presupuesto E2E, los retries, el test de títulos). El kit se queda solo con el nombre del campo que lee.
   - Cada fila dice además el **enganche** que dejaría en el kit (p. ej. «si existe la skill `<nombre>` del proyecto, cárgala en este paso»), con sus palabras estimadas, para dar el neto. El enganche es solo esa línea, sin reglas de reserva: sin la skill o el campo, el kit no dicta nada (decisión del dev-lead). El coste, un proyecto sin template que se queda sin guía hasta escribir la suya, va en `research.md` por corte. `sdd-project-template` ya siembra una skill `e2e` en sus dos plantillas (`templates/angular-dotnet/.claude/skills/e2e`, `templates/react-dotnet/.claude/skills/e2e`): el inventario la contrasta con `writing-e2e.md`.
5. **Cómo encuentra el kit la skill del proyecto** no se decide aquí: `research.md` propone una forma (un campo en `operations.md` que la nombra, o un nombre fijo en `.claude/skills/`) con lo que cuesta cada una, y lo decide el dev-lead.
6. **Las palabras**, con el conteo de `cli/test/kit/word-budget.test.ts`: `text.split(/\s+/).filter(Boolean).length` sobre `dist/skills/`, sin `migrations/`, en un script `.mjs` dentro de la carpeta del spike; la suma por skill es la de su tope `total` (las plantillas cuentan en `sdd-templates`). Cada fila da sus palabras; `research.md` da por skill: palabras hoy, lo que saldría, lo que entraría en enganches y el neto.
7. **Marcadores del barrido** (insensibles a mayúsculas, sobre `dist/skills/` sin `migrations/`): `E2E`, `end-to-end`, `Playwright`, `Flujos core`, `Títulos heredados`, `Presupuesto`, `Retries`, `Timeouts`, `flaky`, `stress`, `estrés`, `repeat-each`, `validation`, `validación`, `guion`, `script`, `§Frontend`, `impeccable`, `screenshot`, `captura`, `Acceso a la aplicación`, `Entorno de la suite`, `Datos`, `critical-path`, `Camino crítico`, `coverage`, `cobertura`, `lint`. El script guarda los aciertos por fichero en la carpeta del spike.
8. **Ficheros que se leen enteros**: los seis de la fila (`sdd-tdd/references/writing-e2e.md`, `sdd-archive/references/e2e-suite.md`, los campos E2E de `operations-template.md`, la sección «E2E tests» de `sdd-verify/references/code-reviewer-prompt.md`, `sdd-archive/references/dev-validation.md`, `sdd-implement/references/frontend-verification.md`) y cada fichero con un acierto del barrido. De los demás, su índice de encabezados, para ver si alguna sección dicta algo sin nombrar un marcador.
9. **Propuesta de corte por versiones**: agrupa las filas que salen por dependencia (lo que necesita antes el campo del template o el enganche) y por SemVer del Art. V: un corte que obliga a un proyecto a cambiar algo para seguir trabajando es mayor. Lo que vive ya en `sdd-project-template` (contrato de la 0349, decisión 2) va antes.
10. **`validation-template.md` y `validation-modes.md`** entran en el inventario con el guion: son la forma del guion que hoy dicta el kit.
10 bis. **Alcance del barrido** (decisión del dev-lead): a fondo, pieza a pieza, solo el terreno de la fila (tests no unitarios, E2E, camino crítico, guion de validación, verificación de frontend). Del resto de terrenos donde el kit dicta algo que un proyecto podría decidir (formato del changelog, forma de las notas de release, método de estimación, topes de `CLAUDE.md`/`AGENTS.md`, forma de los commits, y los que salgan del índice de encabezados), una fila por terreno con sus ficheros y sus palabras, sin destino por pieza: dice si merece otro spike.
11. **Límite declarado en `research.md`**: el barrido encuentra lo que nombra un marcador o un encabezado; una regla de proyecto escondida en prosa sin marcador puede quedar fuera. Se dice con el número de ficheros leídos enteros frente al total.
- Repaso de coherencia: sin delta, no hay `sdd capability merge`; nada retirado (`git grep 0355` fuera de `changes/`: solo `ROADMAP.md`); los ficheros citados existen y la sección «E2E tests» de `code-reviewer-prompt.md` está en la línea 88, con «Project E2E» en la 19. El script de conteo va en la carpeta del spike, además de `research.md` que nombra la fila: es su evidencia.
- Política de modelos (solo en `delegate`): sin revisores de la spec · sin subagentes: el barrido, la lectura y la tabla los hace esta sesión · ejes de la revisión final: según el plan.

### Decisiones tomadas con el dev-lead

- Alcance: el terreno de la fila a fondo y una fila por terreno del resto — opción «3» (2026-11-18).
- Sin skill ni campo del proyecto, el kit no dicta nada: el enganche es una línea, sin reglas de reserva — opción «1» (2026-11-18).

## Forma spike

- **Pregunta**: ¿qué texto de las skills del kit dicta una regla que cada proyecto decide a su manera, adónde va cada trozo y cuántas palabras saca de cada skill?
- **Objetivos**:
  - O1 — en el terreno de la fila, una fila por pieza con fichero y sección, destino (se queda · skill del proyecto · template), motivo en una frase, palabras y enganche estimado; cero piezas sin destino.
  - O2 — tabla por skill: palabras hoy (las del tope `total`), las que salen, las que entran en enganches y el neto; las sumas cuadran con las filas (lo comprueba el script).
  - O1 bis — del resto de terrenos, una fila por terreno con ficheros y palabras.
  - O3 — propuesta de corte por versiones, con lo que cada corte pide a los proyectos y su nivel SemVer.
- **Decisión que desbloquea**: qué retira el dev-lead del kit, adónde lo mueve y en qué versión.

## Approach

- A: barrido con marcadores y el índice de encabezados de cada fichero, lectura entera de los seis de la fila y de cada fichero con acierto, y conteo con un script — cubre las 24 skills por lo que nombran y por su estructura; lo leído entero es una parte, y una regla escondida sin marcador puede escapar (límite declarado, decisión 11).
- B: leer las 24 skills enteras en esta sesión (100 ficheros, 102.745 palabras) — no deja fuera nada, pero el contexto se compacta a mitad y la tabla se escribe con el principio olvidado.
- C: solo los seis ficheros de la fila — barato, pero la fila pide skill por skill y dejaría fuera lo que se repite en otras skills (el eje Código de `sdd-verify`, el brief del implementador).
- Elegido: A — cubre el kit entero a un coste que cabe en una sesión, y su hueco se nombra.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada: el spike solo escribe en su carpeta de `.docs/sdd/changes/` | — | — |

- Filas que implementa: 0355 → `ROADMAP.md` (su estado lo marca el cierre) | comprobado con `git grep -n 0355 -- . ':!.docs/sdd/changes'`.
- Una pieza entra, otra sale (Art. I): no entra nada en las skills ni sale nada en esta rama; lo que sale lo decide el dev-lead tras el spike, como dice la fila.

## Términos y ADR

- Términos resueltos: **enganche** — texto del kit que lee lo que el proyecto declara y actúa según ello; **política** — texto del kit que dicta lo que cada proyecto decide; **pieza** — el bloque más pequeño con un solo destino.
- ADR candidatas: ninguna en el spike; la frontera enganche/política la escribe como ADR la feature que retire la primera pieza.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-18 | aprobada (opción «Apruebo») |
