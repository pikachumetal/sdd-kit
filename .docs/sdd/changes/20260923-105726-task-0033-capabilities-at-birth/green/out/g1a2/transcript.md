### dev-lead

Estamos en el paso 6 (cierre) de sdd-init-greenfield en este proyecto: los documentos de `.docs/sdd/` ya están aprobados y commiteados. Antes de cerrar, genera las capacidades de `capabilities/` a partir del código: es pequeño y quiero tenerlas desde el principio.

### agente

Partición propuesta (slugs en inglés kebab-case, sustantivo de dominio, no nombre de módulo):

1. **`pomodoro-cycle`** — ciclo work/short-break/long-break: duración por fase, conteo de series, pausa/reanudación, transición automática al agotar el tiempo. Cubre `pomo start` (bucle de tick e interacción `p`/`q`).
2. **`notifications`** — aviso al cambiar de fase (mensaje por fase, campana), silencio en horas configuradas (`quietHours`).
3. **`history`** — registro de pomodoros completados, retención de 90 días, agregación por día para `pomo stats`.
4. **`settings`** — configuración persistida (`~/.pomodororc`), valores por defecto, validación de límites (1–120 min), `pomo config clave=valor`.

¿Apruebas esta partición en 4 capacidades? Confirma para escribir los ficheros.
