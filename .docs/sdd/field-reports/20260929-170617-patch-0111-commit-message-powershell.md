---
kit_version: 2.0.0
superpowers_version: 6.4.2
lane: patch
id: 20260929-170617-patch-0111-commit-message-powershell
task: 0111
mode:
date: 2026-09-29
---

# Ticket para el kit — patch 0111: parado sin RED; la fila del roadmap describía mal el fallo

## Contexto

- Carril y modo: patch, parado en el paso 1 (sin reproducción del RED); id consumido, sin carpeta ni `patch.md`
- Skills del kit usadas: `sdd-start-patch` (working tree, sesión arrancada con `Start-KitSession.ps1`), `sdd-feedback`
- Proyecto: el repo del propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: dos sujetos headless del RED, Sonnet y Opus (0,57 $)
- Coste en reloj: unos 40 minutos
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. En una edición de skill, el RED es la reproducción, y el patch lo lanza tarde

- **Qué pasó**: la fila pedía una línea en `commit-milestones.md`. Reproduje el mecanismo de git en un repo temporal y salió, así que reservé el id 0111 con `Get-NextSddId.ps1 -Reserve`, renombré la rama a `feature/0111-…` y creé la carpeta del patch para guardar el lanzador del RED. El RED salió 0 de 2. Con eso el patch no tenía fallo que arreglar: borré la carpeta sin commitear y devolví a la rama su nombre original. El id quedó consumido.
- **Dónde en el kit**: `skills/sdd-start-patch/SKILL.md` paso 1 («Si la investigación no reproduce el fallo… ni rama, ni carpeta, ni id reservado»). En este repo, también `constitution.md` Art. I y `tech-stack.md` «Cómo se testean las skills».
- **Por qué el kit no lo evitó**: el paso 1 habla de reproducir el fallo del código. Cuando lo que se arregla es la conducta de un agente, el fallo solo se reproduce con el RED, y la costumbre del repo es guardar el lanzador del RED en `red/` de la carpeta de la spec. Por eso la carpeta y el id llegan antes que la medida.
- **Coste**: un id de la secuencia consumido para nada, un renombrado de rama deshecho y una carpeta borrada.
- **Propuesta**: en este repo, cuando un patch edita una skill, el lanzador del RED vive en el scratchpad hasta que el RED reproduce el fallo; solo entonces se reserva el id y se copia el lanzador a `red/`. Una línea en `tech-stack.md` «Cómo se testean las skills», o en el paso 1 de `sdd-start-patch` si vale también para los proyectos que prueban prompts.
- **Criterio de aceptación**: GIVEN una fila de deuda que pide editar una referencia de skill y un RED que sale 0 de 2, WHEN un sujeto sigue `sdd-start-patch` en el repo del kit, THEN no reserva id, no renombra la rama y no crea carpeta en `.docs/sdd/specs/`.

### 2. El triaje copió un comando de los tickets a una convención sin ejecutarlo

- **Qué pasó**: los tickets de los patches 0101, 0104 y 0105 decían «un here-string por tubería a `git commit -F -` falla». El triaje escribió en `tech-stack.md` «nunca por tubería», y la fila pedía llevarlo a los proyectos. Ejecutado, `@'…'@ | git commit -F -` commitea bien, tildes incluidas. Lo que falla es el here-string escrito detrás de `-F -`, que PowerShell pasa como argumento (`error: pathspec '…' did not match any file(s) known to git`). Otros tickets anteriores ya lo decían bien (patch 0035: «Con el here-string por tubería funcionó»).
- **Dónde en el kit**: no se localiza una skill. El triaje de tickets en este repo es una práctica de consulta (`CLAUDE.md`, `field-reports/`) sin procedimiento escrito.
- **Por qué el kit no lo evitó**: nada pide ejecutar un comando antes de convertirlo en convención. El agente que escribe el ticket describe su error de memoria, y la descripción se hereda.
- **Coste**: un día con una convención falsa en `tech-stack.md` y un patch arrancado sobre esa premisa; habría llevado a los proyectos una regla que prohíbe algo que funciona.
- **Propuesta**: cuando un triaje convierte un «Errores míos» en convención con un comando, ejecuta el comando que falla y el que se recomienda en un repo temporal, y cita la salida. Si se escribe, en `tech-stack.md` «Entorno de trabajo» o donde viva la práctica del triaje.
- **Criterio de aceptación**: GIVEN un ticket cuyo «Errores míos» describe un comando que falla, WHEN se triaja y se escribe una convención, THEN la convención cita la salida de error medida y el comando recomendado probado con éxito.

## Lo que hice por iniciativa propia

- Reproduje el mecanismo en un repo temporal con las dos variantes (here-string como argumento y por tubería) antes de reservar nada. Así vi que la premisa de la fila era falsa. Funcionó.
- En el RED dejé al sujeto solo con la herramienta PowerShell (`EXTRA_DISALLOWED="Bash"`), porque los fallos de campo son de sesiones cuya shell es PowerShell. Con Bash, un heredoc no reproduce nada.
- Lancé el segundo sujeto con Opus porque los tickets salen de sesiones Opus y Sonnet había acertado. Tampoco falló.

## Funcionó, no tocar

- La regla del paso 1 de «no reproduce: se para y la fila queda re-medida, reescribiendo las celdas que el resultado contradice» guio el cierre sin dudas.
- `tests/headless/lib.sh` y `run.sh`: `DRY_RUN=1` comprobó el molde y los argumentos sin coste, y los techos obligatorios acotaron la campaña.

## Errores míos, no huecos del kit

- Escribí en la fila «unas 26 sesiones» antes de contar; el recuento real fue de 23 tickets y lo corregí antes del commit.
