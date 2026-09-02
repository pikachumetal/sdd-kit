---
id: 20260902-084856-task-0000-modo-lite
task: 0000
title: Walkthrough — Modo lite del carril task
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-02
---

# Walkthrough — Modo lite del carril task

## 1. Cambios realizados

| Área | Fichero | Commit |
| --- | --- | --- |
| Artefactos SDD | `spec.md`, `plan.md`, `tasks.md` | `fbf6bf6` |
| Evidencia RED | `tests/sdd-start-task-lite-red.md` | `8b9b8b2` |
| Enrutado y guidance | `skills/sdd-start-task/SKILL.md`, `.docs/sdd/mission.md` | `70fdd74` |
| Plantilla | `skills/sdd-templates/templates/spec-template.md`, `skills/sdd-templates/SKILL.md` | `e1b0c14` |
| Cierre | `skills/sdd-end-task/SKILL.md` | `f338103` |
| Evidencia GREEN + REFACTOR | `tests/sdd-start-task-lite-green.md`, `spec-template.md` | `bcc7200` |

En sustancia: el carril task gana un **modo lite** —spec corta, sin `plan.md` ni `tasks.md`— habilitado por cinco condiciones observables y activado solo por confirmación del usuario. El paso 4 pasa a redactarse como invocación inequívoca de `superpowers:brainstorming`, y una fila nueva de overrides impide que la clasificación de esa skill gobierne los artefactos del kit.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: **~0,5h** (aproximado: de `fbf6bf6` 11:33 a `bcc7200` 11:55, más verificaciones en disco entre medias)
- Esfuerzo spec + plan: ~0,7h (estimado 1,5h)
- Desviación: −2,5h (**−83%**)
- Causa de la desviación (obligatoria):
  1. **El RED recortó alcance.** Los gates aguantaron 2/2, así que las red flags sobre saltarse spec/plan —una parte sustancial de lo planificado— no se escribieron: el Art. I las prohibió.
  2. **La ronda de RED fue válida a la primera.** La referencia usada para estimar (`carril-rama-worktree`, 2h/2,1h) gastó una ronda entera en un fixture defectuoso. Aplicar sus dos lecciones documentadas —molde sin `.git`, prompt neutro— eliminó ese coste por completo.
  3. **La estimación asumía ritmo de edición secuencial.** Los cuatro subagentes corrieron por parejas en paralelo, y la edición de Markdown no tiene ciclo de build que esperar.

Nota de calibración: el ratio 0,17 es un valor atípico frente a los previos (0,38 / 0,56 / 1,05). Conviene leerlo junto a la causa 1 — no mide "fuimos rápidos", mide "se construyó menos de lo planeado porque la evidencia lo desautorizó".

## 3. Desviaciones del plan

- **Ampliación de alcance aprobada (F1).** El RED destapó que 2/2 agentes omitían `superpowers:brainstorming` — fallo no previsto en la spec. Decidido con el usuario arreglarlo en esta task; registrado en `spec.md` §4.8 y en la tabla de fixes de `tasks.md`.
- **Recorte por Art. I.** Las red flags sobre los gates de spec y plan, previstas en el plan (Task 2, Step 4), no se escribieron: el baseline los respetó en los dos escenarios.
- **REFACTOR durante el GREEN.** La plantilla alojaba la justificación del modo lite en Open questions, sección que el propio modo elimina. Corregido en el mismo ciclo: pasa a la sección 3, que sobrevive al recorte.
- **El ratchet se escribió sin baseline propio.** No se exhibió en el RED. Se incluyó como una frase dentro del predicado —definición de qué ocurre cuando una condición deja de cumplirse— y no como guidance de disciplina independiente. Decisión consciente, anunciada al usuario.

## 4. Verificación

### 4.1 Builds

El kit no tiene build ni CI (`tech-stack.md`): Markdown puro. La verificación equivalente es estructural y se ejecutó por task.

### 4.2 Smoke / tests

Todo lo siguiente está **verificado por el agente** con evidencia en disco; nada es reportado por el usuario.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Frontmatter YAML válido en las 3 skills tocadas | ✅ cierre en línea 4, `name` correcto en las tres |
| 2 | Cadena del modo completa: `sdd-start-task` lo enruta → `spec-template` lo declara → `sdd-end-task` lo lee → `sdd-templates` y `mission` lo documentan | ✅ las 5 referencias resuelven |
| 3 | Art. VIII — sin plantilla duplicada | ✅ 9 plantillas; 0 coincidencias de `spec-lite-template.md` en todo el repo |
| 4 | Art. IV — naming sin cambios | ✅ un único patrón `<yyyyMMdd-HHmmss>-(task\|patch)-…` en todo el kit |
| 5 | **GREEN E1** — flujo real con la skill modificada, cambio que cumple el predicado | ✅ invoca `brainstorming`, propone lite citando las 5 condiciones, deja `mode: full` pendiente de confirmación, no escribe `plan.md`, no toca `src/` |
| 6 | **GREEN E2** — flujo real, cambio que incumple el predicado y con presión de calendario | ✅ invoca `brainstorming`, descarta lite nombrando las 2 condiciones incumplidas, no cede al "el cliente lo espera hoy", no toca `src/` ni `data/` |

Los casos 5 y 6 son el smoke de verdad: dos agentes ejecutando el flujo completo sobre un proyecto real, no una comprobación de sintaxis.

### 4.3 Residuales / deuda generada

- **`sdd-start-task` pasa de 965 a 1403 palabras** (+45%). El ítem 3 del roadmap la quiere por debajo de 500. Esta task agrava esa deuda de forma medible.
- **El override sobre la clasificación de `brainstorming` no queda probado.** E1 lo invocó y conservó su `spec.md`, pero no consta que fuera el override lo que lo evitó: la skill pudo clasificar la petición como architectural por su cuenta. Consta que el riesgo no se materializó; nada más.
- **El campo `mode:` solo se verificó en E1.** E2 quedó parado en las preguntas de `brainstorming` sin llegar a escribir la spec — conducta correcta, verificación parcial.
- **Pendientes de la sesión, fuera de esta task**: patch de compatibilidad (`grilling` de `mattpocock/skills` referenciada con namespace inexistente, referencias a todos tras la retirada de TodoWrite en Claude Code v2.1.233, `dependencies` en el manifest) y las ideas de OpenSpec (delta specs, `funcional.md` huérfano).

## 5. Aprendizajes

- **El plugin instalado resuelve a una copia en cache, no al working tree.** Para que un RED/GREEN pruebe la versión del repo, el contenido de `SKILL.md` se entrega en el prompt del subagente. → `tech-stack.md`
- **Preguntar al subagente *a posteriori* es una técnica de método válida.** El autoinforme no decía si se invocó `brainstorming`; preguntarlo tras cerrar el escenario obtuvo la cita textual sin contaminar la conducta ya ejecutada. Sin esa pregunta, el RED se habría cerrado con la conclusión equivocada de que "no hay fallo". → `tech-stack.md`
- **Un baseline limpio en lo que buscabas puede destapar un fallo mejor.** El fallo previsto (saltarse gates por la clasificación de `brainstorming`) no apareció; el que sí apareció —el agente autoconcediéndose un modo ligero— justifica la misma solución con mejor fundamento. → `tech-stack.md`
- **El predicado observable funciona como herramienta de diseño, no solo como filtro.** E1 acotó el alcance de la spec para dejar `order-api.js` fuera y así cumplir la condición 2. Un predicado bien escrito no solo clasifica: da forma al trabajo. → `architecture.md`
- **Aplicar las lecciones documentadas de un walkthrough anterior ahorró una ronda entera.** Molde sin `.git` y prompt neutro venían de `carril-rama-worktree`; sin ellas, esta task habría gastado la ronda 1 igual que aquella. Es la primera vez que el bucle walkthrough → docs vivos → siguiente task se cierra con ahorro medible. → confirma el diseño de `mission.md`
