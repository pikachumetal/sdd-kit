---
id: 20260922-211605-task-0021-proportional-review
task: 0021
parent: 0005
title: Revisión por task abaratada
mode: full
status: draft
created: 2026-09-22
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: null
---

# Spec — Revisión por task abaratada

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: contrato público (plan-template.md y encargo-revision.md son formatos que calcan los proyectos), MODIFIED (un requisito de task-flow)
- Técnica: si el reparto «De código» / «De proceso» deja sin dueño alguna línea que hoy traen los planes (p. ej. «npm test y lint en verde antes de cada commit») (señal: contrato público)
- Mínimo razonable: ninguna — deja sin segunda lectura el reparto de líneas entre los dos bloques; lo cubre el repaso de coherencia de esta misma spec y el GREEN de R1
```

1. **El RED recorta el enunciado**. Entran los cuatro frentes que fallaron ([RED](../../../../tests/proportional-review-red.md)): falsos Important del revisor de task (2/2 «Needs fixes» sobre un diff correcto), el revisor final que corre suite y lint y rehace el diff (2/2), y la spec contradictoria presentada al gate (1/2). No entran, y van a deuda con su evidencia: el trailer con un modelo prohibido (disparador ausente 4/4), el revisor de task que relanza la suite (0/2, ya lo prohíbe superpowers) y los rulings como hallazgo (sin escenario).
2. **«Proporcional al riesgo», «agrupar las mecánicas» y «solo Critical e Important en el bucle» no llevan guidance nueva**: los tres ya están en `subagent-driven-development` (`SKILL.md:196-199`, `:223-229`, `:361-365`) y el Art. IX prohíbe copiarlos. Lo único del kit que los anulaba es «Todo hallazgo que las incumpla es Important» (`encargo-revision.md:10`), y eso sí cambia (decisiones 3 y 4). El modelo y el effort por revisión, si hacen falta, van con la 0031, que es la que hace real el effort.
3. **Las Restricciones globales del plan se parten en dos bloques**: «De código» (valores de la spec, naming, artículo de calidad de la constitution, comandos que el cambio tiene que dejar en verde) y «De proceso» (política de modelos, modo de ejecución, atribución de commits). Al implementador y a los revisores les llega solo «De código»; «De proceso» es para quien despacha. En lite, el bloque de todo encargo es el artículo de calidad, y la política de modelos deja de viajar a ninguno. Sustituye a la sección «Fuera del alcance del revisor» del ticket, que choca con `SKILL.md:335-344` de superpowers («never instruct a reviewer to ignore or not flag a specific issue»).
4. **Tolerancia de los umbrales numéricos: superar el umbral en una unidad es Minor; en más, Important** (21 líneas con un límite de 20, Minor; 22, Important). Exige cambiar la última línea del Art. X de la constitution del kit, que hoy dice «el revisor marca el incumplimiento como Important». **Decisión tuya**: es un cambio de constitution.
5. **El contrato de los tests RED se define**: modificar un test RED es cambiar una aserción, un nombre de test o un dato; el formato que exige el linter o el formateador del proyecto no cuenta. Va en `encargo-revision.md`, que leen implementador y revisores, y salda el punto «la cabecera del implementador admite cambios de formato» de la fila 0007.
6. **El encargo del revisor final dice cómo verificar**: lee el paquete de review en vez de rehacer el diff, y no ejecuta suite, build ni lint: la evidencia la traen los informes de cada task, y la suite completa la ejecuta el hilo principal antes de la validación, como hoy (cuándo exactamente lo fija la 0006). Es el hueco de la plantilla de superpowers (`code-reviewer.md:87`, «All tests passing?») que su plantilla de revisor de task ya cierra (Art. IX.3).
7. **El repaso de coherencia va en el paso 4 del `SKILL.md`, siempre**, no solo cuando la rúbrica dice «ninguna»: antes del gate, y antes de despachar la review si la hay, el agente aplica el «Spec Self-Review» de `superpowers:brainstorming` a `spec.md`, contrastando cada literal que aparece en más de un sitio con las decisiones y los escenarios que lo usan; lo que corrige lo dice en este bloque. En el `SKILL.md` y no en `review-spec.md` porque una regla en `references/` se leyó 0/2 en la 0013.
8. Sin capacidad nueva: el delta va a `task-flow`.
9. Repaso de coherencia aplicado a esta spec: la decisión 3 decía que en lite solo el revisor recibe el artículo de calidad y el MODIFIED lo dice de todo encargo; queda «todo encargo». La decisión 6 fijaba cuándo corre la suite el hilo, que es de la 0006; queda «como hoy».

## Intent

La revisión por task cuesta más de lo que caza: en campo, ~1,5 M de tokens de subagente para tres hallazgos que cambiaron código, con rondas de fix y re-revisiones pagadas por falsos Important. No se puede quitar: en el spike del 2026-09-21 un solo revisor final cazó 3 de 8 hallazgos que sí cazaron las revisiones por task. Se abarata quitando lo que el kit añade de más —reglas de proceso auditadas como código, umbrales sin tolerancia, un revisor final que corre la suite— y se recupera el repaso de la spec que el kit pierde al sustituir los artefactos de `brainstorming`.

## Scope

- Entra: partir las Restricciones globales en «De código» y «De proceso»; tolerancia de una unidad en los umbrales numéricos; definición del contrato de los tests RED; encargo del revisor final (paquete, sin suite); repaso de coherencia de la spec antes del gate.
- No entra: effort real al despachar (0031); commits del hilo posteriores a la revisión final, commits de solo docs, paquete sin evidencia, hallazgos repetidos, `review-spec` sin respuesta y cabecera en lite (0032); revisión en paralelo con la task siguiente (0022); el lado del implementador de los tests RED que no es formato (0007).

## Approach

Cambiar solo lo que el kit escribe y hoy estorba a superpowers: la plantilla del plan y la cabecera del encargo. Lo que superpowers ya hace bien se cita, no se copia. El repaso de coherencia reutiliza el «Spec Self-Review» de `brainstorming`, que el kit invoca pero cuyo paso se pierde porque la spec se escribe con la plantilla del kit después de la skill.

## Delta de comportamiento

### Capacidad: `task-flow`

**MODIFIED — El artículo de calidad de código viaja a implementadores y revisores** (antes: «el encargo lleva ese bloque literal como primera sección»; «en modo lite el bloque lo forman el artículo de calidad de código y la política de modelos»)
- GIVEN un plan cuyas Restricciones globales tienen un bloque «De código», con el artículo de calidad de la constitution, y un bloque «De proceso», o una task en modo lite, que no tiene plan
- WHEN se despacha un implementador, un revisor de task, un re-revisor o el revisor final
- THEN el encargo lleva el bloque «De código» literal como primera sección
- AND el bloque «De proceso» (política de modelos, modo de ejecución, atribución de commits) no aparece en el encargo de ningún revisor
- AND en modo lite el bloque es el artículo de calidad de código de la constitution, copiado literal; la política de modelos la aplica quien despacha

**ADDED — Un umbral superado en una unidad es Minor**
- GIVEN un diff correcto con una función de 21 líneas y un bloque «De código» que fija funciones de 20 líneas como máximo
- WHEN un revisor de task o el revisor final lo revisa
- THEN reporta la función como Minor y, si no hay otro hallazgo, aprueba
- AND una función de 22 líneas o más sigue siendo Important

**ADDED — El formato que exige el linter no rompe el contrato de los tests RED**
- GIVEN un implementador que solo añadió en un test RED la línea en blanco que exigía el linter, sin tocar aserciones, nombres ni datos, y lo declara en su informe
- WHEN el revisor de task revisa el diff
- THEN no lo reporta como Critical ni como Important

**ADDED — El revisor final revisa el paquete sin ejecutar la suite**
- GIVEN el despacho del revisor final con el paquete de review de la rama
- WHEN revisa
- THEN lee el paquete y no ejecuta la suite, el build ni el lint del proyecto
- AND si cree que hace falta una verificación pesada, la recomienda en su informe

**ADDED — La spec se repasa antes del gate**
- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina el paso 4, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND lo que cambió aparece en «Decisiones que he tomado yo»

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | | | pendiente |
