---
status: accepted
date: 2026-09-30
rutas:
  - skills/sdd-start-feature/**
  - skills/sdd-config/**
  - agents/**
---

# Método de ejecución, política de modelos y nivel de verificación

## Contexto y problema

El coste de una feature lo deciden el método de ejecución y los modelos de los subagentes. Lo que se fue midiendo:

- Omitir el modelo al despachar hereda el de la sesión, normalmente el más caro; declarar el modelo sin el effort hereda el effort de la sesión. Superpowers lo avisa solo en `codex-tools.md`; el kit entrega los tipos `sdd-kit:effort-low`, `-medium` y `-high`.
- El método pasó de «subagentes con la ejecución en línea como excepción por task» a que lo elija el handoff de `writing-plans` con `execution: auto`; Native es el más barato.
- El revisor final de Native, que `executing-plans` pide en «the most capable available model», se fijó en Opus con effort high como techo.
- La sesión de Native es el implementador y `executing-plans` «runs well on a mid-tier session model»; 0 de 2 sujetos en Opus lo mencionaban (`tests/session-model-red.md`). Bajar solo el effort de Opus no abarata cada token.
- Se descartó una clave `role` en `sdd-kit.local.json` que rebajara la verificación por persona.
- Criterio: turnos, no precio por token; un modelo barato que da 2-3× vueltas sale más caro.

## Opciones consideradas

- Política de modelos propia del kit.
- La de `subagent-driven-development`, con modelo y effort siempre explícitos.

## Decisión

El método lo elige el handoff con `execution: auto` (o lo fija el proyecto con `native` o `subagent`). Modelo y effort se declaran siempre al despachar; gama media es el suelo para revisores e implementadores que trabajan desde prosa; el tier más barato, solo para transcribir código del plan o arreglos mecánicos de un fichero; `fable` y `opus xhigh`, prohibidos por defecto. El revisor final de Native va con Opus y effort high. A la sesión de Native se le recomienda gama media en la última parada antes de ejecutar. El nivel de verificación lo fija la spec y no se configura por persona ni por rol.

### Consecuencias

- El walkthrough registra modelo y effort de cada fase para medir el ahorro.
- La 0147 sustituye las skills de superpowers que nombra esta política por las propias del kit.

### Confirmación

`tests/AgentDefinitions.Tests.ps1`, `tests/NativeDefault.Tests.ps1`, `tests/NativeAdapt.Tests.ps1` y `tests/SessionModel.Tests.ps1`.
