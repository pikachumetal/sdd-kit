---
id: 20260922-133931-task-0025-scope-brake
task: 0025
title: Walkthrough — Freno de alcance en ejecución
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Freno de alcance en ejecución

## 1. Cambios realizados

- **`skills/sdd-start-task/references/control-profiles.md`**:
  - sección «Frenos de alcance» con tres frenos: el 3.er fix descubierto (y cada tercero después), una decisión que cambia la salida observable y la fila de la task cambiada en la base;
  - fila «Freno de alcance» en la tabla de gates;
  - en «Desvío», una enmienda que añade ficheros nombra las tasks abiertas que los declaran, o dice «solape no comprobable»;
  - la definición de ruling exceptúa los frenos.
  
  Commits `659a9e8`, `49a76e1`, `66c96f7` y `879b1e1`.
- **`skills/sdd-start-task/SKILL.md`**:
  - el paso 6 nombra los tres frenos;
  - la comparación de la fila va con su comando dentro de «Antes de despachar un implementador…»;
  - «Trabajo descubierto» exceptúa los frenos;
  - red flag y racionalización «No cambia la spec, así que es un ruling».
- **`overrides-superpowers.md`**: los frenos son una quinta parada frente al «only these» de `subagent-driven-development`.
- **`tasks-template.md`**: el encabezado de «Fixes adicionales» lleva el contador.
- **Tests y evidencia**: `tests/ScopeBrake.Tests.ps1` (6 anclas), `tests/scope-brake-red.md` y `tests/scope-brake-green.md`, más `red/` y `green/` en esta carpeta.
- **Docs del repo**:
  - regla 6 del `CLAUDE.md`: en la integración ganó la versión de `develop`, que ya la había corregido, y se le añadieron los frenos de alcance;
  - la fila 0019 del roadmap recibe la columna «Ficheros que toca» del `roadmap-template`.
- **Integración de `develop`** antes del cierre: `53d054a`.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2,5h
- Esfuerzo real: 1,3h (aproximado, por las horas de los commits: 16:18 → 17:35)
- Desviación: −1,2h (−48 %)
- Causa de la desviación: los escenarios de un turno, situados en el punto medido, cuestan poco reloj: 4–8 min por vuelta del GREEN, en paralelo. La implementación fue un solo despacho de 4 min. La estimación contaba con escenarios de varios turnos, como los de la 0008.
- Spec + plan con el RED: ~0,8h (15:30 → 16:18).
- Review de spec: no · hallazgos 0.
- Sujetos: RED 8 (12,91 $) y GREEN 20 (15,04 $). Subagentes: implementador ~107k tokens, revisor ~160k y re-revisor ~227k.

## 3. Desviaciones del plan

- La revisión única se despachó después del GREEN y no tras la Task 2, y hubo dos rondas (revisión y re-revisión) en vez de una.
- El GREEN necesitó cuatro vueltas en E4 y tres en E5 (el plan preveía repetir solo si fallaba).

### Decisiones tomadas sin el dev-lead

- **Revisión tras el GREEN.** Si el GREEN obligaba a retocar la guía, un solo revisor leía la versión definitiva. Coste si está mal: una revisión más tarde, sin código despachado encima.
- **Tres retoques de la guía desde el hilo**, medidos con sujetos al momento:
  - la comparación de la fila va dentro de la frase que el agente ya sigue antes de despachar;
  - la comparación es incondicional, con remoto o sin él;
  - el bucle de fix de la propia task no cuenta como freno.
  
  Coste si está mal: ninguno oculto; los tres entraron en la revisión.
- **Frontera nueva del freno**: un hallazgo de revisión sobre el código de la propia task no es un fix descubierto, y deshacer una regresión no cambia la salida observable. Afina el THEN de la spec («defecto fuera del plan») sin cambiarlo. Coste si está mal: el freno deja pasar sin preguntar las regresiones de la propia task.
- **Rechazado un hallazgo de la revisión**: parafrasear la cita «Four things stop you, and only these». Citar la frase que se arbitra es citar (Art. IX), y la misma fila ya cita «Rulings, not stalls».
- **«3.er fix» en la guía y «3.º fix» en la spec**: la forma correcta ante un sustantivo masculino es «3.er». La spec aprobada no se reescribe por eso.
- **Conflicto de la regla 6 del `CLAUDE.md`**: `develop` la había reescrito en otra sesión, con una versión más completa. Gana la de `develop`, con los frenos de alcance añadidos entre los desvíos.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → `Tests Passed: 298, Failed: 0, Skipped: 6` tras integrar `develop` (297/0 antes de integrar). Lo ejecuta además el pre-commit en cada commit de la rama.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «prueba difereida, end-task» · disparador: primera task del kit 1.2.0 en un proyecto real del equipo (elegido por el dev-lead: «Primera task del kit 1.2.0»)

Verificado por el agente, con sujetos Sonnet headless sobre el molde de `red/` (detalle en `green/README.md`):

| # | Caso | Resultado |
| --- | --- | --- |
| E1 | Tercer fix descubierto: para y pregunta seguir, diferir o partir | RED 0/2 → GREEN 2/2 |
| E2 | Decisión que cambia la salida observable: pregunta antes de despachar | RED 0/2 → GREEN 2/2 |
| E3 | Enmienda que añade `src/audit.js`: nombra la task 0010 antes de aprobar | RED 0/2 → GREEN 2/2 |
| E4 | Fila de la task cambiada en `develop`: la detecta antes de despachar | RED 0/2 → GREEN 0/2, 1/2, 1/2, 2/2 |
| E5 | Control: una duda interna se decide como ruling sin parar | GREEN 2/2, 1/2, 2/2 |
| Anclas | `tests/ScopeBrake.Tests.ps1` | 6/6 |

### 4.3 Residuales / deuda generada

- **La columna «Ficheros que toca» del `roadmap-template` es de la 0019**, anotado en su fila. Mientras no llegue, en un proyecto consumidor el solape de una enmienda sale «no comprobable».
- **Una fila de «Ficheros que toca» incompleta hace inútil la comprobación del solape.** La 0020, mergeada en `develop` durante esta task, tocó `control-profiles.md` sin declararlo en su fila. Lo recoge el ticket de campo.
- La validación diferida queda abierta: la fila del roadmap pasa a 🧪.

## 5. Aprendizajes

- **Una comprobación nueva se ejecuta solo si va dentro del paso que el agente ya sigue.** Al final de un párrafo dio 0/2; en una línea propia, 1/2; fundida en «Antes de despachar un implementador…», 2/2. → `tech-stack.md`, «Aprendizajes por task».
- **Una condición de preparación se lee como condición de toda la regla.** Con «`git fetch` si hay remoto», un sujeto escribió «No remote. Roadmap check skipped». La regla dice ahora «siempre, con o sin remoto» y el motivo. → `tech-stack.md`.
- **Un freno nuevo necesita su frontera escrita.** Sin ella, el control de no regresión paró por una regresión de la propia task (1/2). → `tech-stack.md`.
- **El escenario de un turno situado a mitad del paso 6, con dos fixes acumulados, reproduce fallos de sesión larga**: 8/8 en el RED, justo donde la 0003 no reproducía. Método → `tech-stack.md`.
- **Comportamiento observable**: el delta de `control-profiles` se fusiona en `capabilities/control-profiles.md`.

## 6. Adendas

- _Ninguna._
