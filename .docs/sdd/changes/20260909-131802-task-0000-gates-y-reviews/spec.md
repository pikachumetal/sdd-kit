---
id: 20260909-131802-task-0000-gates-y-reviews
task: 0000
title: Gates y reviews proporcionales (T11)
mode: full
status: approved
created: 2026-09-09
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-09
---

# Spec — Gates y reviews proporcionales (T11)

> **Estado**: approved (2026-09-09).
> **Siguiente paso**: modo full → `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

1. **Sin capacidad nueva**: todo el delta va a `funcional/flujo-de-task.md` (es comportamiento del carril task).
2. **La review de spec la decide una clasificación de complejidad, no un predicado fijo** (tu respuesta en el brainstorming). Como `brainstorming` con spike/bounded/architectural: el agente cuenta **señales observables en la propia spec** —capacidad nueva, contrato público, `MODIFIED`/`REMOVED` en el delta, tres o más capacidades tocadas, datos o migración, dependencia externa, área que no ha explorado— y propone un nivel: **sin review** (0–1 señales), **un revisor** con la lente dominante, dominio o técnica (2–3), **dos revisores** en paralelo (4 o más, o contrato público más datos). Lo dice en la primera línea de «Decisiones a validar» con las señales contadas, y **tú activas**. En modo lite no hay review. Art. II se respeta: las señales son observables; el juicio está en el umbral, no en la intuición.
3. **El revisor es un subagente Sonnet/medium con prompt adversarial** que recibe la spec, `constitution.md`, `mission.md`, las capacidades tocadas de `funcional/` (y `architecture.md` si la lente es técnica). Busca contradicciones con la verdad viva, requisitos sin escenario, alcance oculto, decisiones no declaradas y `ADDED` que en realidad son `MODIFIED`. Cada hallazgo entra en «Decisiones a validar» bajo «Hallazgos de la review», como **aceptado** (la spec cambia) o **rechazado con motivo**, antes del gate. Prompt y rúbrica en `sdd-start-task/references/review-spec.md`.
4. **Plan-gate ligero**: `plan-template` recibe arriba el bloque «Decisiones que he tomado yo — valida estas» (modelo y effort por task, ejecución, decisiones técnicas que la spec no fija, riesgos altos, coste estimado) y `sdd-start-task` presenta el plan empezando por él, igual que la spec. El gate se conserva; lo que se lee cabe en diez líneas.
5. **El Art. X viaja literal al implementador y a los revisores**: `plan-template` exige copiar el artículo de calidad de código de la constitution en Restricciones globales, y `sdd-start-task` dice que ese bloque va en el encargo de **cada** subagente, revisor de task y revisor final incluidos. Es el hueco de superpowers que T3 tapó para el implementador.
6. **El walkthrough registra la review**: línea en §2 «Review de spec: no | 1 revisor (lente) | 2 revisores · hallazgos N, aceptados M», parseable por `Build-EstimationLog.ps1` en una task futura (hoy solo se registra).
7. **RED/GREEN con el método headless y copia limpia** (T10): E1 mide si un agente con `sdd-start-task` vigente tensa una spec con defectos sembrados (una contradicción con `funcional/`, un `ADDED` que es `MODIFIED`, un requisito sin escenario) antes del gate; E2 mide el plan-gate (baseline: sin bloque de decisiones, receta); E3 mide el traspaso del Art. X al revisor con `--output-format stream-json`, que sí expone los encargos de `Agent`. Lo que el baseline ya haga no se escribe.
8. **Evidencia de coste**: la nota de Alybo (6106/6121, −50/−80 % de implementación tras tensar) es el argumento; el kit empieza a medirlo con la línea del walkthrough y lo cruzará cuando haya diez tasks.
10. **Señal «reglas de visibilidad o permiso» en la rúbrica y pregunta del complemento en la lente dominio** (propuesta del dev-lead, [research.md](research.md) §4.1, con la evidencia de SifAcademy: nueve hallazgos del smoke por callar qué no debe ver cada rol). Condicionada al RED E5: fixture con roles descritos por lo que hacen y una task que añade un tercero. La review reforzada multi-lente (§4.3) va a T12, condicionada a su propio RED.
9. **Gate de validación del trabajo antes de cerrar** (tu petición en el gate de esta spec): entre la implementación terminada (revisión final limpia) y `sdd-end-task` hay un ⛔ nuevo: el agente presenta qué hay, cómo probarlo y el smoke que él ya ejecutó, y **espera tu validación**. Sin ella no se invoca `sdd-end-task`; con el dev-lead ausente, la task queda EN ESPERA con el smoke documentado. `sdd-end-task` lo comprueba en su pre-check y el walkthrough lo registra («Validado por el dev-lead: fecha · qué probó»), separado de lo verificado por el agente. El merge sigue siendo el último paso: primero validas el trabajo, luego decides la integración. Evidencia RED ya disponible: en esta sesión se cerraron T7, T8 y T10 sin ese paso.

## Intent

Hoy hay dos gates (spec y plan) que cuestan lo mismo de leer y aportan distinto: el de la spec decide el qué; el del plan es información para el ejecutor salvo tres cosas (modelos, ejecución, coste). Y la spec llega al gate sin que nadie la haya tensado: los defectos aparecen en implementación o en la revisión final (T7: tres Important que dos revisiones de task no vieron). Alybo midió que tensar antes de implementar baja la implementación 50–80 %. Se quiere que el agente proponga, por complejidad visible, cuánta review merece una spec; que el gate del plan se lea en diez líneas; y que la regla de calidad de código llegue a quien revisa, no solo a quien implementa.

## Scope

- Entra: rúbrica de complejidad y prompt del revisor (`references/review-spec.md`); pasos 4, 5, 6 y 7 de `sdd-start-task` (gate de validación antes del cierre) y el pre-check de `sdd-end-task`; bloque de decisiones en `plan-template`; Art. X en Restricciones globales; línea de review en `walkthrough-template`; RED/GREEN; delta en `flujo-de-task`; changelog.
- No entra: parsear la línea de review en el script de estimación; review del plan; review de código (ya la hace superpowers); cambiar el gate de la spec.

## Approach

Guidance de forma donde la forma decide (plantillas: bloque del plan, línea del walkthrough, Art. X en Restricciones) y guidance de disciplina solo donde el RED muestre que el agente no tensa por su cuenta (rúbrica y despacho del revisor). La rúbrica es un fichero auxiliar de `sdd-start-task` porque aplica a un subconjunto de tasks y se lee tras decidir el modo. Un solo revisor por defecto; dos solo cuando la complejidad lo pide; nunca en lite.

## Delta de comportamiento

### Capacidad: `flujo-de-task`

**ADDED — La spec propone su propio nivel de review por complejidad**
- GIVEN una spec en modo full recién redactada
- WHEN el agente la presenta en el gate
- THEN la primera línea de «Decisiones a validar» dice el nivel propuesto (sin review · un revisor con su lente · dos revisores) y las señales contadas que lo justifican
- AND el usuario activa o rechaza; en modo lite no se propone

**ADDED — La review adversarial tensa la spec antes del gate**
- GIVEN un nivel de review activado por el usuario
- WHEN el agente despacha el revisor con la spec, la constitution, la mission y las capacidades tocadas
- THEN cada hallazgo aparece en «Decisiones a validar» como aceptado (con el cambio en la spec) o rechazado con motivo, antes de pedir la aprobación

**ADDED — El plan presenta primero las decisiones tomadas sin el usuario**
- GIVEN un plan en modo full
- WHEN el agente lo presenta en el gate
- THEN el primer bloque es «Decisiones que he tomado yo — valida estas» con modelo y effort por task, ejecución, decisiones técnicas fuera de la spec, riesgos altos y coste estimado
- AND el resto del plan es para el ejecutor

**ADDED — El artículo de calidad de código viaja a implementadores y revisores**
- GIVEN un plan con Restricciones globales que copian el artículo de calidad de código de la constitution
- WHEN se despacha un implementador, un revisor de task o el revisor final
- THEN el encargo lleva ese bloque literal

**ADDED — El trabajo se valida con el usuario antes de cerrar**
- GIVEN una task con la implementación terminada y la revisión final limpia
- WHEN el agente va a cerrar
- THEN antes de invocar `sdd-end-task` presenta qué hay, cómo probarlo y el smoke que ejecutó, y espera la validación explícita del usuario
- AND si el usuario no responde, la task queda en espera con el smoke documentado; `sdd-end-task` no arranca sin esa validación y el walkthrough la registra separada de lo verificado por el agente

**ADDED — La review de dominio pregunta por el complemento de visibilidad**
- GIVEN una spec que introduce un rol, un estado o una condición de acceso
- WHEN la lente dominio la revisa
- THEN pide que la spec diga qué no ve y qué no puede hacer ese rol o estado, y la spec lo declara o lo rechaza con motivo

**ADDED — El walkthrough registra la review de spec**
- GIVEN una task cerrada
- WHEN se escribe el bloque de tiempo del walkthrough
- THEN lleva la línea «Review de spec: no | 1 revisor (lente) | 2 revisores · hallazgos N, aceptados M»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-09 | aprobada (chat, 9 decisiones; la 9 añadida a petición del dev-lead) |
