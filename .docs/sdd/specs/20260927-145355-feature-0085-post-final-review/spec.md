---
id: 20260927-145355-feature-0085-post-final-review
feature: 0085
parent: 0032
title: Bordes de la revisión después de la revisión final de rama
mode: full
status: approved
created: 2026-09-27
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-27
---

# Spec — Bordes de la revisión después de la revisión final de rama

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Capacidades

- Modificadas: `control-profiles` — «Salir del plan es un ruling visible»: el commit del hilo posterior a la revisión final entra en una re-revisión del tramo, y el commit pequeño de solo docs se revisa en el hilo.
- Modificadas: `feature-flow` — dos requisitos nuevos: la re-revisión del tramo antes de la validación y reproducir antes de arreglar un hallazgo de ejecución.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED («Salir del plan es un ruling visible» de control-profiles)
- Técnica: si el THEN modificado de «Salir del plan…» sigue diciendo lo que ya garantizaba para los commits hechos antes de la revisión final (señal: MODIFIED)
- Mínimo razonable: ninguna — deja sin mirar por otro par de ojos la frontera entre «solo docs» y producto; la cubre el repaso de coherencia
```

1. **La re-revisión del tramo usa el encargo y el techo del revisor final** (`sdd-kit:effort-high` + `opus`, con la cabecera de `encargo-revision.md`), sobre `<revisión final>..HEAD`. Por qué: en los tres reportes el tramo traía algo real (un Critical en la 0014, un Important en la 0062, lógica no trivial en template 0007), y los tramos baratos los saca la decisión 3. Coste si me equivoco: una re-revisión Opus de más en tramos medianos.
2. **La línea `Revisión final:` de `tasks.md` añade el HEAD revisado**: `Revisión final: <tipo> + <modelo>, <veredicto>, sobre <sha corto>`. Por qué: hoy nada guarda qué commit revisó el revisor final, y sin él el tramo no se calcula tras una compactación. `sdd-end-feature` paso 9 busca la línea por su prefijo, así que no cambia. Sin `tasks.md` (una sola task), el sha va en la presentación de la validación.
3. **«Solo docs y de menos de ~20 líneas» se fija así**: todos los ficheros del commit están bajo `.docs/` o son `*.md` de la raíz del repo, y cambia menos de 20 líneas, añadidas más borradas según `git diff --numstat`. Un merge de sincronización cuenta solo lo que resolvió el hilo: `git show --remerge-diff <merge>` (git ≥ 2.36; aquí 2.55). Por qué: «~20» no se puede comprobar; y en el kit `skills/` son `.md` pero son producto, así que la extensión sola no sirve.
4. **La revisión en el hilo se anota en el bloque «Me salí del plan en…»** de la validación, con `revisado en el hilo: <sha> · <ficheros> · <n> líneas`, y no directamente en el walkthrough. Por qué: el walkthrough no existe hasta `sdd-end-feature`, y ese bloque ya pasa a «Decisiones tomadas sin el dev-lead» del walkthrough.
5. **En Native, reproducir antes de arreglar lo aplica el propio hilo**: si el test no sale RED al primer intento, no arregla; decide con esa evidencia y lo registra como ruling. `NEEDS_CONTEXT` es solo del implementador en SDD. No reproducirlo no descarta el hallazgo (en la 0014, un «Permission denied» de Linux no se reproduce en Windows y era real).
6. **Commits hechos durante el cierre quedan fuera** (ticket template 0007 §5: el fix entró durante `sdd-end-feature`): viven en el paso 9 de `sdd-end-feature`, fuera de las superficies que acotaste. Lo apunto en la fila 0085 como pendiente. Esta spec cubre hasta la invocación de `sdd-end-feature`.
7. **Campañas**: un `RUNS_DIR` por fase (RED, GREEN) hasta que se fusione el patch 0084, como pediste.

### Decisiones tomadas con el dev-lead

- Superficies: `control-profiles.md` y los pasos 6 y 7 de `skills/sdd-start-feature/SKILL.md`; fuera la sección «Revisor final» de `encargo-revision.md` y `plan-template.md` (0032), y el paso 4 y `review-spec.md` (0086) — «Superficies: control-profiles.md y los pasos 6 y 7 de skills/sdd-start-feature/SKILL.md» (2026-09-27)
- Carril feature, modo full, perfil `delegate` del proyecto, sin partir — «Sí, full + delegate (Recomendada)» (2026-09-27)

## Intent

Hoy la regla dice que todo commit del hilo entra en la revisión de la task en curso o, si no queda ninguna, en la revisión final de rama. Supone que la revisión final es lo último antes de la validación, y no lo es: un fix que sale de una pregunta del dev-lead en la validación se queda sin revisión (0014: un Critical que habría roto el hook en Linux y macOS). A la vez, la regla no distingue tamaño: un conflicto de una fila del roadmap costó ~95k tokens de revisor (0005). Y un hallazgo que afirma algo de ejecución se arregla sin reproducirlo: tres reanudaciones y ~280k tokens para una premisa falsa (0016). Se quiere que el tramo posterior a la revisión final se revise, que el trivial se revise en el hilo, y que un fix de ejecución empiece por un RED.

## Scope

- Entra:
  - Paso 6 de `skills/sdd-start-feature/SKILL.md`: la regla «todo commit del hilo…», la línea `Revisión final:` con el sha, la excepción de solo docs y reproducir antes de arreglar en la ronda de fix.
  - Paso 7 del mismo `SKILL.md`: la re-revisión del tramo antes de presentar la validación y antes de invocar `sdd-end-feature`.
  - `skills/sdd-start-feature/references/control-profiles.md`, «Ruling»: la misma regla, con las dos excepciones.
  - Evidencia RED/GREEN en `tests/` y la fila 0085 del roadmap en «Versión siguiente».
- No entra:
  - La sección «Revisor final» de `encargo-revision.md`, `MERGE_BASE` y el paquete del revisor final (0032).
  - `plan-template.md` (0032); el paso 4 de `SKILL.md` y `review-spec.md` (0086).
  - El paso 9 de `sdd-end-feature` y los commits hechos durante el cierre (decisión 6).
  - Convertir hallazgos repetidos en regla, lint o test (fila 0032).

## Approach

Tres frases en los puntos donde se decide: la regla de «Ruling» (una vez en `control-profiles.md`, y el paso 6 la resume y enlaza, como hoy), el umbral del paso 7 y el encargo de la ronda de fix del paso 6. Cada pieza se mide con su campaña RED sin el texto y GREEN con él, con sujetos headless del lanzador de referencia (`tests/headless/`).

## Delta de comportamiento

### Capacidad: `control-profiles`

**MODIFIED — Salir del plan es un ruling visible** (antes: «todo commit del hilo principal entra en el alcance de la revisión de la task en curso o, si no queda ninguna, de la revisión final de rama»)

- GIVEN una ejecución que se aparta del plan sin cambiar la spec (un fichero de «NO se tocan», un orden distinto, un fix del hilo principal) y sin caer en un freno de alcance
- WHEN el agente decide
- THEN no para: registra el ruling, y todo commit del hilo principal entra en el alcance de la revisión de la task en curso; si no queda ninguna, de la revisión final de rama; y si la revisión final ya volvió, de la re-revisión del tramo `<revisión final>..HEAD`
- AND un commit del hilo cuyos ficheros están todos bajo `.docs/` o son `*.md` de la raíz, y que cambia menos de 20 líneas (añadidas más borradas, `git diff --numstat`; en un merge, las de `git show --remerge-diff`), no despacha revisor: el hilo lee el diff y lo anota en «Me salí del plan en…» como `revisado en el hilo: <sha> · <ficheros> · <n> líneas`
- AND la presentación de la validación abre con el bloque «Me salí del plan en…», separado del resto de decisiones

### Capacidad: `feature-flow`

**ADDED — Un commit del hilo posterior a la revisión final se revisa antes de la validación**

- GIVEN `tasks.md` con `Revisión final: sdd-kit:effort-high + opus, limpia, sobre a1b2c3d` y, después, un commit del hilo `e4f5a6b` que cambia 3 líneas de `hooks/hooks.json`
- WHEN el hilo va a presentar la validación del paso 7
- THEN antes despacha un revisor con el encargo del revisor final (`sdd-kit:effort-high` + `opus`) sobre el tramo `a1b2c3d..HEAD`, y no presenta la validación hasta que vuelve sin Critical ni Important abiertos
- AND apunta en `tasks.md` `Re-revisión: a1b2c3d..e4f5a6b, sdd-kit:effort-high + opus, <veredicto>`
- AND si el commit llega con la validación ya presentada (un fix que sale de una pregunta del dev-lead), la re-revisión va antes de invocar `sdd-end-feature`, y el mensaje dice qué cambió y su veredicto
- AND si el tramo solo tiene commits de solo docs de menos de 20 líneas (`.docs/sdd/roadmap.md`, 2 líneas), no despacha revisor: lo anota como `revisado en el hilo`

**ADDED — Un hallazgo de ejecución se reproduce antes de arreglarse**

- GIVEN un revisor que marca como Important «`GetFullPath` lanza con una ruta inválida y el script no sale con 0»: un hallazgo Critical o Important que afirma algo de ejecución (una excepción, un código de salida, un valor en un entorno o una plataforma concretos)
- WHEN el hilo abre la ronda de fix
- THEN en SDD el encargo del implementador pide como primer paso un test que reproduzca la premisa y falle (RED), y el fix solo con ese RED; si no sale RED en un intento, el implementador vuelve con `NEEDS_CONTEXT`, el test y su salida, sin arreglar
- AND en Native el hilo hace lo mismo, y si no sale RED en un intento no arregla: decide con esa evidencia
- AND no reproducirlo no descarta el hallazgo: el hilo decide arreglar sin RED, rechazarlo o diferirlo, y lo registra como ruling con la salida del intento
- AND un hallazgo que se ve leyendo el diff (un nombre, la estructura, una duplicación) no lleva este paso

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-27 | aprobada: «Apruebo (Recomendada)» |
