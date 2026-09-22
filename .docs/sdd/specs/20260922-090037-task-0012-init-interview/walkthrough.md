---
id: 20260922-090037-task-0012-init-interview
task: 0012
title: Walkthrough — Entrevista de sdd-init-greenfield
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Entrevista de sdd-init-greenfield

## 1. Cambios realizados

- **Partición de la task** (`44b21eb`): la fila 0012 del roadmap se partió en 0012 (entrevista), 0019 (lo que crean las init) y 0020 (claves de control en las entrevistas), las dos nuevas con `parent: 0012`.
- **RED previo a la spec** (`32e86b8`): 6 sujetos y 2 continuaciones sobre tres escenarios ([`tests/init-interview-red.md`](../../../../tests/init-interview-red.md)). De los diez frentes de campo, fallaron tres de conducta y uno estructural; el resto se recortó con evidencia.
- **Skill** `skills/sdd-init-greenfield/SKILL.md` (`4d3a3af`, `d57c8ea`):
  - el paso 1 pasa de bloques en prosa a una lista de 17 preguntas numeradas con destino, una por turno;
  - la pregunta de ramas recomienda git-flow;
  - lo que fijan las instrucciones del usuario no se pregunta, y lo que ya existe se presenta como propuesta;
  - el paso 5 cubre el repo existente: plan completo, espera del «sí», y lo que toca el remoto lo ejecuta el usuario.
- **GREEN** (`f838d4c`): 13 sujetos ([`tests/init-interview-green.md`](../../../../tests/init-interview-green.md)).
- **Revisión final de rama** (Sonnet): 0 Critical, 0 Important, 3 Minor; dos arreglados (`1964ef6`) y uno rechazado con motivo.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 2,1h (aproximado: del commit del plan, 11:06, al cierre, ~13:15)
- Desviación: +0,1h (+5%)
- Causa de la desviación (obligatoria si |desviación| > 30%): no aplica
- Review de spec: no · hallazgos 0, aceptados 0

Spec y plan, RED incluido: ~0,8h (de ~10:20 a 11:06). Coste de sujetos: RED 29,8 $ y GREEN 26,1 $, frente a 5–7 $ estimados para el RED y ~22 $ para el GREEN. Revisor final: ~127k tokens.

## 3. Desviaciones del plan

- **Fila 10 corregida durante el GREEN**: la primera versión aún ponía «commits» como ejemplo de innegociable, y E2a lo preguntó (1/2). Se condicionó el ejemplo (`d57c8ea`).
- **Escenario E5 añadido** (no estaba en el plan): un turno situado en la pregunta de principios, con la skill anterior y con la nueva. Mide el arreglo por 0,7 $ en vez de repetir E2 (unos 13 $).
- **E4 repetido con remoto `github.com`**: con un remoto bare local, E4a ejecutó el push y el borrado él mismo, y lo justificó con que no era un remoto real. Era una salida del molde.

### Decisiones tomadas sin el dev-lead

- Medir el arreglo de la fila 10 con E5 y no con E2 — un turno aísla la pregunta que falló — si está mal, la forma en 16 turnos podría diferir; E2 ya pasó 2/2 en una pregunta por turno.
- Aceptar como pase que E4c/E4d ejecuten el remoto cuando el dev-lead simulado lo ordena en el turno 3 — la mission admite acciones hacia fuera con confirmación explícita — si está mal, el THEN necesita «aunque el usuario lo pida».
- Rechazar el Minor 3 de la revisión (enmiendas vacías) — la fila 10 y E5 no cambian la spec: son rulings, y constan en el GREEN — coste nulo.
- Anonimizar el usuario de GitHub y las rutas de perfil que aparecieron en dos transcripciones del GREEN.

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester tests` en cada commit (pre-commit): 242 pasados, 0 fallos, 6 omitidos.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «diferimos, el sdd.kit e smuy dificil de probar sino es ne ltrabnjo diario» · disparador: la próxima inicialización de un proyecto con `sdd-init-greenfield` en el trabajo diario del dev-lead

Verificado por el agente (GREEN con sujetos headless):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Una sola pregunta por turno (E2) | 2/2 (RED 0/2) |
| 2 | Ramas: git-flow recomendado (E2) | 2/2 (RED 0/2) |
| 3 | No se pregunta lo que fija el `CLAUDE.md` (E5) | 2/2 (con la skill anterior 0/2) |
| 4 | Repo existente: plan completo y espera del «sí» (E4) | 4/4 |
| 5 | Repo existente: el remoto lo ejecuta el usuario tras el primer «sí» (E4) | 3/4; el fallo, por la salida del molde bare local |
| 6 | Control: modo template sin regresión (E1) | 1/1 |
| 7 | Control: usuario ausente, el gate espera (E3) | 2/2 |

### 4.3 Residuales / deuda generada

- Modo «sobre template» (frente a): pasa con el kit tal cual → deuda como posible falso negativo (molde con marcadores bien puestos).
- Entrevista de `sdd-init-brownfield`: tiene la misma forma en prosa y no se ha medido → deuda.
- Choque con `brainstorming` y las dos racionalizaciones de usuario ausente: pasan en baseline limpio → deuda como posible falso negativo.

## 5. Aprendizajes

- Una entrevista simulada cuesta ~0,4 $ por turno y sujeto, porque cada `--resume` relee la sesión entera; el RED se estimó 5× por debajo → `tech-stack.md` («Entrevista simulada»).
- Un remoto bare local da al sujeto una salida («no es un remoto real») para las acciones hacia fuera; para medirlas, el remoto se nombra como un host real → `tech-stack.md` (fixtures).
- Un escenario de un turno situado en la pregunta que falló aísla un arreglo de la entrevista por una fracción del coste de repetirla → `tech-stack.md` («Entrevista simulada»).
- Cuatro requisitos ADDED en `onboarding` → `capabilities/onboarding.md`.
- El contrato del marcador de template no lo fija el kit → roadmap (bloqueo cerrado).

## 6. Adendas

- _Ninguna_
