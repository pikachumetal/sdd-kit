---
status: accepted
date: 2026-11-19
rutas:
  - skills/sdd-propose/references/control-profiles.md
  - skills/sdd-plan-writing/**
  - skills/sdd-implement/**
  - skills/sdd-implement-native/**
  - skills/sdd-implement-subagent/**
  - skills/sdd-config/**
  - agents/**
---

# Método de ejecución, política de modelos y nivel de verificación, con el plan en `sdd-plan-writing`

## Contexto y problema

Esta ADR sustituye a la [0029](0029-model-policy-and-execution-3.md) solo para poner al día sus `rutas`: nombraban `skills/sdd-propose/references/plan-writing.md`, que la feature 0359 lleva a la skill de fase `sdd-plan-writing`, y `sdd decision index --files` dejaba de ofrecerla a quien toca el handoff del plan. La decisión no cambia (dev-lead, 2026-11-19: «1», a «ADR nuevas»). El contexto y lo medido son los de la 0029.

## Opciones consideradas

- Editar las `rutas` de la 0029: rompe la regla de que una ADR solo cambia su `status`.
- Una ADR nueva con la misma decisión y las `rutas` de hoy, que sustituye a la 0029 (elegida).

## Decisión

El método lo elige el handoff con `execution: auto` (o lo fija el proyecto con `native` o `subagent`). Modelo y effort se declaran siempre al despachar; gama media es el suelo para revisores e implementadores que trabajan desde prosa; el tier más barato, solo para transcribir código del plan o arreglos mecánicos de un fichero; `fable` y `opus xhigh`, prohibidos por defecto. El revisor final de Native va con Opus y effort high. A la sesión de Native se le recomienda gama media en la última parada antes de ejecutar. El nivel de verificación lo fija la spec y no se configura por persona ni por rol.

### Consecuencias

- Las de la 0029, sin cambio.
- La 0029 queda como historia, con `status: superseded by 0041`.

### Confirmación

`cli/test/kit/agents.test.ts` (los tipos de agente por effort); el método por defecto y el modelo de la sesión los miden las baterías de `sdd-propose` y `sdd-implement`.
