---
id: 20260922-153843-task-0010-token-cost
task: 0010
title: Walkthrough — Estimación con tokens y modelos reales
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Estimación con tokens y modelos reales

## 1. Cambios realizados

- `skills/sdd-templates/templates/walkthrough-template.md` — la sección 2 pasa a llamarse «Tiempo y coste» y gana cuatro líneas: `Modelo del hilo`, `Tokens del hilo` (con `no medido` por defecto), `Tokens de subagentes` y `Coste de sujetos`. «Esfuerzo real» queda declarado como reloj del hilo (`6fd401c`, más el ajuste de `526b3b5` tras la primera ronda del GREEN).
- `skills/sdd-templates/scripts/Build-EstimationLog.ps1` — tres columnas nuevas en el log (`Hilo (tokens)`, `Subagentes (tokens)`, `Sujetos ($)`), con lectura de las etiquetas nuevas y de las antiguas del corpus, salidas `no medido` / `no aplica` y `—` para el campo ausente (`cfe160f`).
- `tests/Build-EstimationLog.Tests.ps1` y tres fixtures nuevas — TDD: 19 tests en rojo antes del cambio, 35 en verde después (`cfe160f`).
- `.docs/sdd/estimation.md` — sección «Coste en tokens y en dinero»: referencia por rol de subagente, coste por sujeto headless y el aviso de que la campaña es la partida más variable (`1039c02`).
- `skills/sdd-templates/scripts/Get-NextSddId.ps1` y su test — la salida de git se lee en UTF-8 (`c4fab15`).
- `tests/RoadmapClosing.Tests.ps1` y `tests/ScopeBrake.Tests.ps1` — resuelven la raíz del repo sin git, por el mismo defecto (`7e257b9`).
- Evidencia: `tests/token-cost-red.md` (`a9a1154`) y `tests/token-cost-green.md` (`526b3b5`).

## 2. Tiempo y coste: estimado vs real *(OBLIGATORIO si existe `.docs/sdd/estimation.md` — no borrar)*

- Tipo: docs
- Estimación de implementación (del plan): 1,2h
- Esfuerzo real: 0,6h — reloj del hilo (22:18 → 22:55 hora local, por las marcas de los commits; la campaña GREEN corrió en paralelo). Spec, RED y plan, aparte: 0,5h
- Desviación: −0,6h (−50%)
- Causa de la desviación: la de los avisos 2 y 3 de `estimation.md`, otra vez. Las cuatro tasks fueron ediciones de pocas líneas con el contexto ya cargado, y los cuatro sujetos corrieron en segundo plano sin sumar reloj.
- Modelo del hilo: Opus 5 (1M)
- Tokens del hilo: no medido
- Tokens de subagentes: 182k en 2 despachos — revisor final de rama Sonnet 163k / 8 min; re-revisión acotada del mismo agente 19k / 3 min
- Coste de sujetos: 6,47 $ en 6 sujetos Sonnet — RED 2,07 $ (2 sujetos); GREEN 4,40 $ (4 sujetos en dos rondas)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Las fixtures del log se llamaron `task-0013-coste`, `task-0014-solo` y `task-0015-legacy` en vez de los ids que proponía el plan: esos ya estaban ocupados por fixtures existentes.
- Un valor de tokens sin unidad (`120000`) se muestra como `120k`, no como número crudo: el log usa una sola unidad para poder comparar columnas.
- La plantilla recibió un segundo ajuste después de la primera ronda del GREEN, que es lo que el ciclo RED→GREEN pide cuando la forma no basta.

### Decisiones tomadas sin el dev-lead

- **Arreglo de `Get-NextSddId.ps1` antes del plan** — el pre-commit bloqueaba todos los commits de este worktree; el arreglo estaba aprobado en la decisión 8 de la spec. Coste si me equivoco: un commit que revertir.
- **Los dos tests que llegaron de `develop` con el mismo defecto** (`RoadmapClosing`, `ScopeBrake`) se alinearon con el patrón `$PSScriptRoot/..` de los otros seis, en el commit de merge. Sin eso, el merge no podía commitearse. Coste si me equivoco: los tests pasan a resolver la raíz del worktree en vez de la del repositorio, que en este proyecto son la misma carpeta.
- **Segunda ronda de GREEN** (2 sujetos, 1,50 $) tras ajustar la plantilla, en vez de dar por bueno el resultado parcial de la primera.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester -Path tests` → 316 pass, 0 fail, 6 skipped (tras integrar `develop` y aplicar los hallazgos de la revisión).
- `Invoke-Pester -Path tests/Build-EstimationLog.Tests.ps1` → 19 fallos antes de implementar, 37 pass después.

### 4.2 Smoke / tests

- Validado por el dev-lead: PENDIENTE

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Regenerar el log real: `Build-EstimationLog.ps1 -Root .` | 47 filas; las cinco tasks con etiqueta antigua recuperan sus tokens (0001 835k, 0002 448k, 0011 940k, 0004 532k, 0014 355k y 10,3 $) y el resto sale con `—` ✔ (agente) |
| 2 | GREEN con sujetos: cuatro líneas de coste en el walkthrough | 3/3 de los que escribieron walkthrough, frente a 0/2 en el RED ✔ (agente) |
| 3 | GREEN: el hilo se declara «no medido» | 3/3 ✔ (agente) |
| 4 | GREEN: el log del sujeto muestra las tres columnas | 3/3 ✔ (agente) |
| 5 | GREEN: «Esfuerzo real» sin sumar los minutos de los subagentes | 1/4 ✘ (agente) — ver 4.3 |
| 6 | `Get-NextSddId.ps1` en una ruta con tilde | devuelve el id y sale con código 0 ✔ (agente, test Pester) |
| 7 | Revisión final de rama y re-revisión | 2 Important, los dos arreglados; la re-revisión no encontró ninguno nuevo ✔ (subagente) |

### 4.3 Residuales / deuda generada

- **«Esfuerzo real» sigue absorbiendo los minutos de los subagentes** (3 de 4 sujetos; el cuarto paró a preguntar). El molde no da marcas del reloj del hilo y la plantilla exige un valor. Propuesta al dev-lead, que cambia la spec: admitir `no medido` también en «Esfuerzo real», con el log dejando `—` en Real y Ratio sin avisar. Detalle en `tests/token-cost-green.md`.
- **Estimar el dinero en el plan y sacar un ratio en dólares**: fuera de scope por `plan-template.md`, fichero caliente de las tasks 0006, 0007, 0021 y 0022.
- **El bloque de tiempo de `patch-template.md`** sigue sin campos de coste.

## 5. Aprendizajes

- El hueco fijo en una plantilla es lo que hace que el dato aparezca: los tickets de campo lo rellenan 14/14 y los walkthroughs, sin hueco, 6/11 y en cuatro formas. → `tests/token-cost-red.md` y la propia plantilla.
- Un campo obligatorio sin salida honesta se rellena con lo que haya a mano: el esfuerzo real acabó siendo la suma de los despachos. → `tests/token-cost-green.md`, pendiente de la enmienda.
- Leer la salida de git en PowerShell sin fijar UTF-8 rompe en cualquier ruta con tildes. Ya ha mordido a dos scripts y a dos tests del repo. → `tech-stack.md` (pendiente de escribir en el cierre).

## 6. Adendas
