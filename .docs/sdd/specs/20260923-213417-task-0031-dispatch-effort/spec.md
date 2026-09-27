---
id: 20260923-213417-task-0031-dispatch-effort
task: 0031
parent: 0021
title: Effort real al despachar
mode: full
profile: delegate
status: approved
created: 2026-09-23
author: Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-23
---

# Spec — Effort real al despachar

> **Estado**: approved.
> **Siguiente paso**: `plan.md` con `superpowers:writing-plans`.

## Decisiones que he tomado yo — valida estas

**Review de la spec: ninguna.** Señales de la rúbrica: 1 (contrato con el harness: tipos de agente del plugin). No hay capacidad nueva, `REMOVED` ni datos, y el área ya está medida en ejecución real. La opción mínima deja sin revisar si «effort por tipo de agente» cubre un caso que no he visto. El GREEN lo mide en ejecución real.

1. **El RED previo a la spec ya se midió en ejecución real, con un proxy que registra cada petición a la API** (`red/`). Con `Agent` y solo `model: sonnet`, el subagente hereda el effort de la sesión (`high`). Un tipo de agente con `effort: low` o `effort: medium` en el frontmatter manda ese effort en cada petición, también si es un agente de plugin (`probeplug:implementer-medium` → `effort: medium`). El `model` del despacho pisa el `model` de la definición. Con Haiku no viaja ningún effort: Haiku 4.5 no lo admite. No lancé sujetos de conducta para el RED: el fallo es determinista, porque `Agent` no tiene parámetro de effort, y ya hay cuatro reportes de campo (0008 §6, 0006a §8, fila 0021, 0039 §1).
2. **Vía elegida: el plugin entrega tres tipos de agente según el effort, no según el rol**: `sdd-kit:effort-low`, `sdd-kit:effort-medium` y `sdd-kit:effort-high`, con `model: inherit` y sin `tools` (heredan todas). El hilo despacha con `subagent_type` para el effort y `model` para el modelo. **Por qué**: tres ficheros sirven a implementadores, revisores de task, revisor final y revisor de spec. Un tipo por rol serían N×effort ficheros, y el encargo ya dice el rol. Descarto las otras dos vías de la fila de deuda. Condicionar la exigencia deja el coste ficticio. Las skills forked con `context: fork` no están medidas con el encargo íntegro, y no hacen falta porque la vía de agentes funciona.
3. **Sin tipos `xhigh` ni `max`**: `opus xhigh` está prohibido por defecto (Art. IV). Quien lo justifique en su task escribe su propio agente de proyecto. Lo que no se usa no se entrega.
4. **Art. IV corregido en un hecho**: hoy dice que declarar el modelo sin el effort «lo deja caer al defecto de ese modelo». La medida dice que **hereda el de la sesión**, que con un hilo Opus en `high` o `xhigh` es lo caro. La política no cambia (modelo y effort explícitos, gama media como suelo), solo cómo se cumple. Por eso no lo trato como cambio mayor de convención.
5. **Harness sin effort expuesto** (kit instalado con `npx skills add`, que no instala agentes, u otro harness): el campo `Modelo` del plan escribe «effort: no disponible en este harness, hereda el de la sesión». No se declara un effort que no se va a ejecutar.
6. **Con Haiku, `general-purpose` sin tipo de effort**: el effort no aplica y el plan lo dice.
7. **Ficheros que toco**: `agents/` nuevo en la raíz del plugin (tres definiciones), `plan-template.md` (campo `Modelo` y su línea en «Decisiones»), `review-spec.md:49`, constitution Art. IV, `tech-stack.md` (Distribución: los agentes solo llegan por el canal plugin) y README (una línea). **No toco el paso 6 de `sdd-start-task`**, aunque la fila lo nombra: el hilo despacha leyendo el campo `Modelo` del plan, y si ese campo nombra el `subagent_type`, basta. Si el GREEN falla ahí, subo la regla al paso 6.
8. **El hallazgo §3 del ticket 0039 (una sola previsión para RED y GREEN en el Art. I) no entra**: no está en la fila de la 0031. Lo aplico en esta task porque lo pediste, pero la regla escrita va aparte.
9. **Evidencia RED/GREEN** en `tests/dispatch-effort-red.md` y `tests/dispatch-effort-green.md`. Test Pester nuevo `tests/AgentDefinitions.Tests.ps1`: cada `agents/*.md` tiene `model: inherit` y un `effort` de `low|medium|high`, y el campo `Modelo` de `plan-template.md` nombra `sdd-kit:effort-`.
10. **Previsión única de la campaña (Art. I proporcional), declarada antes del primer sujeto**: RED previo con 2 sondas técnicas y 2 sujetos de conducta; GREEN con 2 sujetos y 1 sonda de control; ~7 sujetos y ~1,5 h, **con un techo común de 6 $**. Gasto del RED: 4 sondas, una de ellas inválida (se lanzó desde el worktree, sin agentes, y no cuenta), ~2,0 $. Los 2 sujetos de conducta del RED no se lanzaron (decisión 1). Quedan ~4 $ para el GREEN.

### Decisiones tomadas con el dev-lead

- Carril task, modo full, perfil `delegate`, con la fila 0031 y el ticket 0039 §1 como enunciado — «Task full, delegate (Recomendado)»
- Previsión y techo comunes para el RED previo y el GREEN, un commit por hito, avisos de fase en lenguaje llano — «Art. I proporcional: una sola previsión y un techo comunes para el RED previo a la spec y para el GREEN, declarados antes del primer sujeto. Un commit por hito. Avisos de fase en lenguaje llano.»

## Intent

El kit exige declarar el modelo y el effort al despachar un subagente. La herramienta `Agent` de Claude Code no tiene parámetro de effort, así que el effort escrito en el plan no es el que se ejecuta: el subagente hereda el de la sesión. Hay cuatro reportes de campo. El plan registra una decisión de coste que no ocurre. Tras la task, el effort declarado es el que viaja en cada petición del subagente, y donde el harness no lo permite, el plan lo dice.

## Scope

- Entra: tres definiciones de agente en el plugin (`effort-low`, `effort-medium`, `effort-high`); el campo `Modelo` del plan y el despacho del revisor de spec las nombran; el Art. IV dice cómo se cumple el effort y qué pasa sin él; `tech-stack.md` y el README dicen que los agentes solo llegan por el canal plugin.
- No entra: tipos `xhigh` o `max`; skills forked con `context: fork`; la regla de previsión del Art. I (ticket 0039 §3); cambiar la política de modelos.

## Approach

Los tipos de agente llevan el effort en su frontmatter, que Claude Code respeta (medido con el proxy). El hilo sigue pasando `model` en el despacho, y el tipo pone el effort. El plan escribe la pareja literal (`subagent_type` + `model`) para que el despacho sea copiar, no interpretar.

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — El effort declarado viaja en el tipo de agente**
- GIVEN un plan cuya task declara en `Modelo` «Sonnet, effort medium» con el kit instalado como plugin de Claude Code
- WHEN el hilo despacha su implementador
- THEN la llamada a `Agent` lleva `subagent_type: sdd-kit:effort-medium` y `model: sonnet`
- AND cada petición a la API del subagente lleva `effort: medium`

**ADDED — Sin effort en el harness, el plan lo dice**
- GIVEN un harness que no expone el effort al despachar (kit instalado sin sus agentes, u otro harness)
- WHEN se escribe el campo `Modelo` de una task
- THEN dice «effort: no disponible en este harness, hereda el de la sesión» en vez de un nivel de effort

**ADDED — El revisor de spec se despacha con su effort**
- GIVEN una spec con review de uno o dos revisores
- WHEN el hilo despacha cada revisor
- THEN el despacho lleva `subagent_type: sdd-kit:effort-medium` y `model: sonnet`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-23 | aprobada: «si+» |
