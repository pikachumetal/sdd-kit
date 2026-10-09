---
id: 20261009-082930-feature-0162-validation-panel-spike
feature: 0162
title: Spike — panel de validación inyectado con Claude in Chrome
mode: full
profile: delegate
status: approved
created: 2026-10-09
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-09
---

# Spec — Spike: panel de validación inyectado con Claude in Chrome

## Capacidades

- Ninguna, porque es un spike: la salida es `research.md` con evidencia, sin código del kit ni skills tocadas.

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: dependencia externa (Claude in Chrome, que el kit no usa hoy) · tamaño: ~0 líneas de kit; spec y research en 1 carpeta
- Técnica: si los objetivos 2 y 3 se pueden medir con las herramientas de Claude in Chrome tal como están (señal: dependencia externa)
- Mínimo razonable: ninguna — deja sin mirar que un objetivo resulte no medible; si pasa, el research lo registra como «no medido» y eso ya es respuesta
```

1. **Carril spike de la 3.0.0, no `sdd-consult`** — la skill vigente (2.3.3) manda los spikes a `sdd-consult` sin artefactos; aplico el carril spike de la [propuesta 0131](../20261007-144256-proposal-0131-kit-rework/proposal.md) (spec corta, tasks con «Evidencia» en vez de RED, `research.md`) porque la petición pide fila y `research.md`. No toco skills: la 0146 es la que escribe ese carril.
2. **El panel es código desechable que vive en esta carpeta** (`probe/`), etiquetado como tal; no entra en `skills/` ni en `cli/`. Se conserva solo como evidencia de lo medido.
3. **La URL de la app es un parámetro** que da el dev-lead al arrancar las medidas (`localhost:4200` es solo un ejemplo; puede ser otro puerto). En 3.0.0 saldría de `operations.md`, entornos; el spike no lee ese fichero, que aún no existe.
4. **Esperar al «listo» = terminar el turno**: el dev escribe «listo» en la sesión y Claude lee el panel. No se hace sondeo periódico del navegador, que gastaría tokens en cada consulta. El objetivo 4 mide ese coste.
5. **Lo que no se puede medir aquí queda «no medido»**, nunca «cumple»: la recomendación del research cita solo lo medido (regla del eje Spec de la 0131 para spikes).
6. **Las dos alternativas se comparan sobre el papel**, con lo que dicen sus docs y el código que haya disponible, sin construirlas: el spike responde a si Claude in Chrome basta, y las alternativas son el plan B.
7. **Sin nombres de empresa ni de personas en los artefactos**: «un compañero» y «la política de Chrome gestionada de la empresa» en lugar del nombre de la organización.
8. **El chequeo de Mac es una lista para un compañero**, no una medida: este spike solo corre en Windows.

### Decisiones tomadas con el dev-lead

- Carril spike, parada en la spec — «Spike, paro en la spec (Recomendada)» (2026-10-09).
- Aprobación de la spec — «ok!» (2026-10-09).
- El puerto de la app no es fijo — «localhost:4200 es un ejemplo puede ser otro puerto» (2026-10-09).

## Intent

Hoy, en la validación manual, el dev prueba la aplicación y copia y pega en la sesión qué probó, qué falló y los errores que vio. Es lento y se pierde lo que pasaba en ese momento (consola, red). La idea que se prueba: Claude abre la app con Claude in Chrome, inyecta por JavaScript un panel flotante con la lista de pruebas (OK, KO y comentario en cada una), el dev prueba a mano y dice «listo», y Claude lee los resultados de la página y adjunta a cada KO la captura, la consola y las peticiones de red fallidas. Claude no ejecuta las acciones (eso es Playwright). **Pregunta**: ¿puede Claude in Chrome sustituir el «copia y pega» de la validación manual con ese panel?

## Scope

- Entra: un panel desechable inyectable; medir los cinco objetivos con una app Angular real que levanta el dev-lead; `research.md` con la evidencia, la comparación con las dos alternativas, la recomendación y el plan B; la lista de comprobaciones para Claude Desktop en Mac.
- No entra: cambios en `skills/`, `cli/` ni en las plantillas; construir la extensión propia ni la página servida por la CLI; automatizar acciones en la app (Playwright); medir en Mac.

## Approach

Una task por bloque de evidencia: panel inyectable y lectura (objetivo 1), aguante con 10 recargas y una redirección (2), KO con captura, consola y red (3), espera sin tokens (4), entorno Orca en Windows y lista para Mac (5), y la comparación de alternativas. Cada objetivo acaba con un valor medido o «no medido» y su motivo.

## Objetivos medibles

Cada objetivo se mide con la app que levante el dev-lead, en la URL que él dé.

**O1 — Inyectar y leer sin copiar**
- GIVEN la app abierta en Chrome con Claude in Chrome conectado y una lista de 3 pruebas
- WHEN Claude inyecta el panel, el dev marca 2 OK y 1 KO con comentario y escribe «listo»
- THEN Claude devuelve las 3 pruebas con su estado y el comentario del KO leídos de la página, y el dev no ha pegado nada en la sesión

**O2 — Aguante a recargas y redirección**
- GIVEN el panel con estado (al menos 1 prueba marcada)
- WHEN el dev hace 10 recargas completas (F5) y una redirección (un login o un cambio de ruta que recarga la página)
- THEN el research da una tabla con, por recarga, si el panel sigue visible, si el estado se conserva en `localStorage` y si Claude tuvo que reinyectarlo; el objetivo se cumple si en 10 de 10 el estado se recupera, con o sin reinyección

**O3 — KO con contexto**
- GIVEN una prueba marcada KO tras una acción que produce un error de consola o una petición fallida (4xx/5xx)
- WHEN el dev dice «listo»
- THEN el KO lleva una captura de la página, los mensajes de error de consola y las peticiones fallidas del momento, cada uno con su hora, y el research dice si la captura queda guardada en disco o solo en la conversación

**O4 — Espera sin tokens**
- GIVEN el panel inyectado y el turno de Claude terminado
- WHEN el dev prueba durante al menos 5 minutos y escribe «listo»
- THEN el uso de tokens de la sesión entre el fin del turno y el «listo» es 0, medido con `/cost` o el contador de la sesión antes y después

**O5 — Orca en Windows, y Mac anotado**
- GIVEN la sesión lanzada desde Orca en Windows 11
- WHEN se ejecutan O1 a O4
- THEN el research dice si funcionó desde Orca (qué navegador, qué extensión y qué versión) y da una lista numerada de lo que un compañero debe comprobar en Claude Desktop en Mac

**Decisión que desbloquea**: si la validación manual de la 3.0.0 se apoya en Claude in Chrome y, si no, cuál de las dos alternativas es el plan B (una extensión de Chrome propia que lee una lista de puertos, con el riesgo de la política de Chrome gestionada de la empresa y de tener código fuera del plugin; o una página local servida por la CLI `sdd` que escribe los resultados en un fichero).

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-09 | aprobada: «ok!» |
