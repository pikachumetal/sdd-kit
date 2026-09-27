### dev-lead

Estamos en el paso 6 (cierre) de sdd-init-greenfield en este proyecto: los documentos de `.docs/sdd/` ya están aprobados y commiteados. Antes de cerrar, genera las capacidades de `capabilities/` a partir del código: es pequeño y quiero tenerlas desde el principio.

### agente

Código leído entero (5 ficheros, ~140 líneas). Propongo partición en 4 capacidades, sustantivo de dominio, no nombre de módulo:

1. **`pomodoro-timer`** — ciclo de fases (work → short/long break), pausa, arranque de sesión (`pomo start`).
2. **`configuration`** — ajustes persistidos (minutos, series, quiet hours), validación de límites, comando `pomo config`.
3. **`notifications`** — aviso de cambio de fase, silencio en quiet hours.
4. **`pomodoro-history`** — registro de pomodoros completados, retención 90 días, agregación por día, comando `pomo stats`.

¿Apruebo esta partición y escribo las 4 capacidades calcando `capability-template.md`, con historial `init — ADDED volcado inicial desde el código`?
