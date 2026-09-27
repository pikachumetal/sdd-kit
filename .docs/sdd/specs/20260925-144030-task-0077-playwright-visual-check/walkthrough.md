---
id: 20260925-144030-task-0077-playwright-visual-check
task: 0077
title: Walkthrough — Verificación visual con Playwright, hecha por el agente
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-25
---

# Walkthrough — Verificación visual con Playwright, hecha por el agente

## 1. Cambios realizados

- **`skills/sdd-start-task/SKILL.md`** (`02b4933`, arreglos de la revisión final en el commit de cierre):
  - Paso 2: con la sesión en el modelo más capaz y más de una task prevista, la primera pregunta ofrece «apruebo la spec por delegación, nos vemos en la validación, y paras antes de la Task 1 para que baje la sesión a gama media», con las tasks previstas y su motivo. Si el usuario la elige, el agente para antes de la Task 1 sea cual sea el método. Con una sola task prevista no se ofrece.
  - Paso 6: sin el MCP, un script del paquete `playwright`, con el contraejemplo de «no probado». Las capturas se guardan fuera de git hasta la validación. La parada de `pair` enseña las medidas y las capturas antes del guion.
  - Paso 7: las medidas y las capturas van antes del guion, o «no probado» con su motivo.
  - Tabla de racionalizaciones: fila nueva para «No tengo el MCP de Playwright».
- **Tests**: `tests/VisualCheck.Tests.ps1`, 5 tests de literales.
- **Lanzador de referencia** (`tests/headless/lib.sh` y `tests/HeadlessLauncher.Tests.ps1`): variables `SETTINGS` y `EXTRA_ALLOWED`, y una guarda que aborta si `SETTINGS` no deshabilita el kit instalado.
- **Evidencia**: `tests/visual-check-red.md` y `tests/visual-check-green.md`, con las salidas en `red/`, `green/` y `refactor/` de esta carpeta.
- **Capacidades**: `task-flow` (un requisito modificado y uno nuevo) y `control-profiles` (la primera pregunta).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1h
- Esfuerzo real: 1h — reloj del hilo, aproximado con las marcas de los commits: del commit de apertura (16:59) al cierre (~17:55), con el GREEN y los arreglos dentro. La spec y el plan, con el RED, llevaron ~0,8 h antes, que no cuentan aquí.
- Desviación: 0h (0 %)
- Modelo del hilo: Fable 5.1, effort no registrado (contexto y primera pregunta) → Opus 5.5, effort no registrado (el resto de la task)
- Tokens del hilo: 30.597.074 — claude-opus-5-5 29.145.807; claude-fable-5-1 1.451.267
- Tokens de subagentes: 2.923.266 en 1 despacho — Revisión final de la rama 0077 claude-opus-5-5 2.923.266 / 5 min
- Coste de la sesión: sin precio (modelos sin precio: claude-fable-5-1)
- Coste de sujetos: 11,70 $ en 25 sujetos Sonnet y Opus — RED 5,33 $ (12, dos inválidos); GREEN 5,40 $ (11); controles tras la revisión final 0,98 $ (2)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La spec se reencuadró con el RED antes de aprobarse por delegación: sale la receta en un fichero auxiliar y la pasada final de `delegate`, porque el baseline ya lo cumplía.
- El GREEN llevó dos sujetos de control más de los 11 del plan, por los arreglos de la revisión final: 25 sujetos en total, justo la previsión.

### Decisiones tomadas sin el dev-lead

- Recortar la receta, la guía de medir con el MCP, el momento y la pasada final de `delegate` — 4 de 4 sujetos del RED ya lo hacían con el MCP en la sesión — si el recorte se equivoca, un agente sin MCP y sin guía no mide, y el control del GREEN lo vería.
- Sacar del GREEN el escenario «sin forma de levantar la aplicación» — los sujetos encontraron el SDK real de .NET por su ruta completa y no hubo forma limpia de reproducir la ausencia — la honestidad de «no probado» queda sostenida solo por el RED (4/4).
- No tocar `plan-template.md` ni el paso 4 — el campo ya pide lo necesario y la oferta del paso 4 está medida — si hace falta, se toca en otra task.
- La variante para antes de la Task 1 sea cual sea el método, y no solo con Native — así se cumple la frase literal que el usuario elige; con SDD la sesión orquesta y también se ahorra — si se equivoca, el dev-lead pierde una parada en una task SDD.
- Escenario `q2` en lugar de repetir `q1` — `q1` salió lite y no probaba la excepción de una sola task — un sujeto de control, no dos, para no pasar de la previsión.
- El cambio del lanzador entró en el commit de apertura — lo necesitaba el RED, previo al plan — queda en el historial con el tipo `docs`.
- Diferidos de la revisión final (minors): la variante también se ofrece en `pair`, donde el gate del plan ya ofrece bajar de modelo y quitarla cambiaría la spec; «fuera de git» admite capturas sin trackear dentro del repo; el test de `EXTRA_ALLOWED` comprueba el eco en seco; la captura de `x4-1` quedó fuera de su directorio de run; la skill no dice literal «nunca verificado», aunque lo cubre el control del RED.

## 4. Verificación

### 4.1 Builds

- Sin build: Markdown y PowerShell.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «prueba diferida al uso, feedback, commit y merge» · disparador: la primera task del equipo con «Verificación visual» o delegada con la sesión en Opus, a cargo del dev-lead

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Suite completa con los tests lentos, tras los arreglos | 818 pasan, 0 fallan |
| 2 | RED: captura conservada / script sin MCP / variante de gama media | 1/4 · 0/2 · 0/2 |
| 3 | GREEN: las mismas conductas | 4/4 · 2/2 · 2/2 |
| 4 | Controles del GREEN (MCP, medidas, momento, no presentar en rojo, `delegate` no para) | sin regresión |
| 5 | Tras los arreglos: `q5-3` ofrece la variante con el motivo nuevo; `q2-3`, con una task en full, no la ofrece | 1/1 · 1/1 |
| 6 | `Test-Capabilities.ps1` tras fusionar el delta | 14 capacidades válidas |

### 4.3 Residuales / deuda generada

- El número de tasks en la oferta de gama media de los pasos 4 y 5: fila de deuda en el roadmap.
- `run.sh` no rechaza un `SPEC_DIR` relativo: fila de deuda en el roadmap.
- Sujetos que matan todos los procesos de node: al ticket de la task.

## 5. Aprendizajes

- Con la herramienta a mano, el agente ya hace la verificación visual. Lo que falla es la salida fácil cuando falta el MCP, y el entregable que se borra al limpiar → `tests/visual-check-red.md` y la racionalización del paso 6.
- Sujetos con el MCP de Playwright: `EXTRA_ALLOWED`, `SETTINGS` y un puerto por sujeto → `tech-stack.md`, «Cómo se testean las skills».
- Un sujeto puede matar todos los procesos de node de la máquina → `tech-stack.md`.
- «Sin forma de levantar la app» no se reproduce con un sustituto en el `PATH` → `tech-stack.md`.
- `SPEC_DIR` va en ruta absoluta → `tech-stack.md` y fila de deuda.

## 6. Adendas
