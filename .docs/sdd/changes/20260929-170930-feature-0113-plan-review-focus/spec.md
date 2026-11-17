---
id: 20260929-170930-feature-0113-plan-review-focus
feature: 0113
title: El plan lleva su Review Focus y el revisor final lo recibe
mode: full
status: done
created: 2026-09-29
author: Claude (sesión del dev-lead)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-29
---

# Spec — El plan lleva su Review Focus y el revisor final lo recibe

## Capacidades

- Modificadas: `feature-flow` — «Los tests de la spec preceden al implementador» (también un test por línea del Review Focus) y requisito nuevo «El plan lleva su Review Focus y viaja al revisor final»

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED, contrato público (el plan lo leen `task-brief` y `executing-plans`) · tamaño: ~40 líneas en 4 ficheros
- Técnica: comprobaría que todas las entradas de «uno por THEN» (paso 6 en SDD y en Native, la racionalización, la plantilla, el encargo) cambian a la vez, y que el nombre `## Review Focus` es el que busca `executing-plans` (señales: MODIFIED, contrato)
- Mínimo razonable: ninguna — el repaso de coherencia ya cruzó esas entradas con grep (`SKILL.md:48, 52, 101`, `encargo-revision.md:99`, `plan-template.md:132`); queda sin cubrir una entrada con otra redacción que el grep no encuentre
```

1. **Arranca como feature, no como patch.** `sdd-start-patch` paró en la causa raíz: el fix exige decidir quién escribe los tests del Review Focus y si sus líneas pasan por «Decisiones que he tomado yo». Son las dos preguntas que la fila 0054 dejó abiertas. Id 0113 reservado con `Get-NextSddId.ps1 -Reserve`; la fila de deuda no tenía id.
2. **La sección se llama `## Review Focus`, en inglés y literal.** Es el nombre que buscan `writing-plans` (self-review §4) y `executing-plans` («the plan's Review Focus section verbatim»). Con otro nombre, `executing-plans` no la encontraría.
3. **Va en la cabecera, justo después de «Restricciones globales» y antes de «Phase -1».** Es el sitio que le da `writing-plans` 6.4.2 (tras Global Constraints) y el que propone el ticket de la 0109.
4. **La ayuda de la sección cita a superpowers, no la reescribe (Art. IX).** Resume la regla (las entradas o fallos que la spec implica y ningún test ejercita, las más probables primero, una por línea con la entrada y el comportamiento esperado), apunta a `writing-plans` para el detalle y añade solo lo del kit: cada línea nombra su task y su test, y una sección vacía dice «ninguna: comprobado».
5. **El self-review §4 del plan comprueba el Review Focus.** Cada línea tiene su fila `<línea> → Task <n>, test <nombre>. ✓`, como los requisitos de la spec.
6. **El encargo del revisor final lleva el Review Focus solo si el RED demuestra que falta.** `executing-plans` 6.4.2 ya pide pasarlo «verbatim if it has one», y en el RED de la 0096 (c1-1) un encargo lo llevaba. Si el RED muestra que el encargo del kit lo pierde con el plan ya con la sección, entra una sección `## Review Focus` en «Revisor final» de `encargo-revision.md`, con la copia literal. Si no, no se escribe guía (Art. I) y queda un test estático de no regresión.
7. **Sin paso de migración.** Los proyectos calcan `plan-template.md` del kit cada vez (Art. VIII); los planes ya escritos no se tocan. La release que la lleve escribe su `migrations/vX.Y.Z.md` con «sin cambios en el proyecto».
8. **Va antes que la 0108 y no dentro de ella.** La 0108 cambia el modelo del revisor final, y esta cambia qué lleva su encargo. Comparten `encargo-revision.md`, pero en frases distintas de «Revisor final»; la que cierre después integra la otra. La fila de deuda decía «antes o dentro de ella».
9. **Campaña (Art. I), previsión de la campaña entera: 14 sujetos headless, ~16 $, ~2,5 h de reloj.** Los sujetos van con Sonnet effort medium, el modelo habitual de las sesiones de plan y de ejecución en Native; si Sonnet no reproduce el fallo, no se prueba Opus sin preguntarte. Hay tres escenarios con dos sujetos cada uno, en RED y en GREEN (12 sujetos), y queda un margen de 2 para un REFACTOR:
   - **p (plan)**: el molde del patch 0082 (spec de la 0012 aprobada, `delegate`), con «escribe el `plan.md` y para ahí». Mide si el plan tiene `## Review Focus`, si cada línea tiene su test en la task dueña, en «Tests RED», y si hay una línea en «Decisiones que he tomado yo». Control (GREEN): los tests de los THEN siguen en «Tests RED» y el plan no copia cuerpos (patch 0082).
   - **e (RED de la task)**: el mismo molde con un plan que ya lleva Review Focus y «escribe los tests RED de la Task 1 y para antes de despachar». Mide si el hilo escribe también los tests de las líneas del Review Focus de esa task. Control: uno por THEN, sin commitear.
   - **r (revisor final)**: el molde de la 0096 (c1, el revisor se deniega y su encargo queda capturado), con el plan de la 0015 con Review Focus. Mide si el encargo lleva la sección literal. Control: la cabecera `## Restricciones de código` y «Cómo revisar».

   Si la campaña pasa de 14 sujetos o de 16 $, paro y decides tú.
10. **Tests estáticos** (Pester, en el fichero de la plantilla que ya la lee): la plantilla tiene `## Review Focus` entre «Restricciones globales» y «Phase -1»; el paso 6 y la plantilla dicen «y uno por línea del Review Focus»; si entra la decisión 6, `encargo-revision.md` nombra la sección en «Revisor final».

### Decisiones tomadas con el dev-lead

- Carril feature full, perfil `delegate` del proyecto (sin `sdd-kit.local.json`), con la fila de deuda como enunciado — «Sí, full + delegate (Recomendada)»
- Los tests de cada línea del Review Focus los escribe el hilo, como un RED más, antes del despacho y sin commitear — «El hilo, como un RED más (Recomendada)»
- «Decisiones que he tomado yo» del plan lleva una línea que resume el Review Focus y remite a la sección, sin copiar sus líneas — «Una línea que la resume (Recomendada)»
- 2026-09-29, tras el RED con Sonnet limpio (0 de 6, 2,98 $): RED con Opus 5.5 en p y r, dos sujetos de cada, dentro del mismo techo — «RED con Opus: p y r, 2 y 2 (Recomendada)»
- 2026-09-29, tras la pasada de fix de la revisión final: un sujeto r de control con Opus, el 15.º, por encima del techo de 14 sujetos y dentro del de 16 \$ — «Sí, un sujeto más (Recomendada)»

## Intent

`writing-plans` 6.4.2 pide en todo plan una sección «Review Focus»: las entradas y los fallos que la spec implica y que ningún test ejercita. Cada línea lleva su test en la task dueña, y `executing-plans` la pasa literal al revisor final. `plan-template.md` sobreescribe la forma del plan y no tiene esa sección, así que se pierde. Hay cuatro tickets de campo, de tres proyectos, que lo reportan. En la feature 0027 del template, el revisor final encontró 2 Important que ese bloque habría convertido en tests. Se quiere que el plan la lleve, que sus tests existan antes del despacho y que el revisor final la reciba.

## Scope

- Entra: sección `## Review Focus` en `skills/sdd-templates/templates/plan-template.md`, con su ayuda; la línea que la resume en la ayuda de «Decisiones que he tomado yo» y la fila del self-review §4.
- Entra: «Tests RED» de la plantilla (hoy «Un test por escenario (THEN)»), que pasa a uno por THEN y uno por línea del Review Focus de la task.
- Entra: `skills/sdd-start-feature/SKILL.md`, paso 6 (en SDD, «uno por THEN»; en Native, «los tests de sus THEN»), y la racionalización «El implementador ya hace TDD…», que dice que los tests salen de los THEN.
- Entra: `skills/sdd-start-feature/references/encargo-revision.md`: la frase «Los tests los escribe el hilo principal desde los THEN de la spec» de «Encargo del implementador», y, si el RED lo demuestra (decisión 6), la sección `## Review Focus` del encargo del revisor final.
- Entra: `capabilities/feature-flow.md`, por el delta; los tests Pester de la decisión 10; evidencia `tests/plan-review-focus-red.md` y `-green.md`.
- Entra: al cerrar, el roadmap. La fila de deuda queda resuelta y la fila 0054 pierde su frase sobre «Review Focus».
- No entra: el modo lite, que no tiene plan. El Review Focus es una sección del plan, y en lite el revisor final recibe la spec.
- No entra: el modelo o el effort del revisor final (es la 0108).
- No entra: el resto de la fila 0054 (workspace, `Ruling:`, recuperación, commits por ruta).
- No entra: comparar todas las secciones de `writing-plans` con la plantilla en `SuperpowersCompat.Tests.ps1`, que proponía el ticket de la 0109. Es una vigilancia general, no este fallo; va como deuda si hace falta.

## Approach

El kit adopta la sección de superpowers con su nombre y su sitio, y aporta solo lo que su flujo necesita. Los tests de sus líneas entran en el contrato RED que escribe el hilo, porque la regla «código y test de otra mano» es del kit y superpowers no la tiene. El resumen del Review Focus va en el bloque de decisiones que lee el dev-lead, porque una línea del Review Focus fija un comportamiento que la spec calla. La guía del encargo del revisor final solo se escribe si el RED demuestra que hace falta. El RED se lanza tras aprobar la spec, dentro de la previsión de la decisión 9, y la guía de cada punto se escribe solo si su escenario falla.

## Delta de comportamiento

### Capacidad: `feature-flow`

**ADDED — El plan lleva su Review Focus y viaja al revisor final**
- GIVEN la spec de la 0012 aprobada (filtro de reservas por `status`, que no dice qué pasa con `status=Foo`) y un plan escrito con `plan-template.md`
- WHEN el agente termina el plan
- THEN el plan tiene una sección `## Review Focus` entre «Restricciones globales» y «Phase -1», con una línea por entrada o fallo que ningún test de las tasks ejercita, con su comportamiento esperado y su task (p. ej. «`status=Foo` → 400 con los estados válidos · Task 1, `Rejects_unknown_status`»), o «ninguna: comprobado»
- AND «Decisiones que he tomado yo» lleva una línea que la resume («Review Focus: 3 entradas que la spec no fija, con su comportamiento esperado; ver la sección»)
- AND el self-review §4 lleva una fila por línea del Review Focus con su task y su test
- AND al despachar el revisor final, su encargo lleva la sección `## Review Focus` del plan, copiada literal

**MODIFIED — Los tests de la spec preceden al implementador** (antes: «uno por THEN»)
- GIVEN una task cuya implementación se despacha a un subagente
- WHEN el hilo principal prepara el despacho
- THEN los tests que codifican los escenarios de la task existen antes del primer encargo, escritos por el hilo, uno por THEN y uno por cada línea del Review Focus del plan que nombra esa task, en RED, sin commitear
- AND el encargo del implementador nombra su ruta como contrato: no los modifica; si uno le parece incorrecto, para y lo explica; los commitea con su implementación con `git add` de rutas explícitas y nunca con `--no-verify`
- AND el hilo guarda una copia fuera del repo antes del despacho y, al volver el implementador, la compara con el test commiteado; un cambio que no sea de formato va al revisor de la task

## Enmiendas

- 2026-09-29 — Salen del Scope el paso 6 y la racionalización de `sdd-start-feature/SKILL.md`, la frase del implementador de `encargo-revision.md` y la ayuda de «Tests RED» de la plantilla; la decisión 10 queda en los tests de lo que entra — el RED no mostró ese fallo (e 2/2 con Sonnet; control e del GREEN con Opus 1/1; tests en la task dueña 4/4), y el Approach pedía guía solo donde el escenario falla (Art. I). El MODIFIED «Los tests de la spec preceden al implementador» se mantiene: describe la conducta medida — aprobada: «Apruebo la enmienda (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-29 | aprobada: «Apruebo (Recomendada)», campaña incluida |
