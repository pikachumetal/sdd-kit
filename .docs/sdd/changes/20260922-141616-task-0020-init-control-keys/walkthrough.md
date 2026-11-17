---
id: 20260922-141616-task-0020-init-control-keys
task: 0020
title: Walkthrough — Claves de control en las entrevistas de las init
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-22
---

# Walkthrough — Claves de control en las entrevistas de las init

## 1. Cambios realizados

- **Fuente única** (`6e3bebc`): sección «Preguntas de las claves de control» en `skills/sdd-start-task/references/control-profiles.md`, con tres preguntas y, en cada una, su recomendación, su motivo y lo que escribe:
  - perfil, recomendado `delegate`;
  - política de merge: rama de integración, `--no-ff`, y el worktree lo borra una persona;
  - frenos: 3 agentes, y aviso a los 8 y a los 20 minutos.

  Reglas del bloque: una pregunta por turno; se salta lo que ya está; «no sé» no escribe; sin rama de integración no se pregunta el merge; sin usuario, la pregunta queda pendiente.
- **Greenfield** (`6e3bebc`, `f91e1a5`): preguntas 18–20 en la entrevista, con enlace al bloque. El paso 3 escribe las claves respondidas, y el árbol de `estructura.md` recoge `control` y `merge`.
- **Brownfield** (`6e3bebc`): el paso 3 pasa a lista numerada (ids, perfil, merge, frenos, changelog, cliente) y cada turno acaba con una sola pregunta o un solo documento. Los pasos 5 y 7 y `generacion.md` se ajustan: marcador con `control` y `merge`, y preguntas pendientes en el cierre.
- **Migración v1.2.0** (`6e3bebc`, `f91e1a5`): hace las mismas preguntas del bloque, una por turno, en lugar del gate único, y añade los frenos al predicado, al marcador y a la verificación.
- **Test** (`6e3bebc`): un `It` nuevo en `tests/ControlProfiles.Tests.ps1`. Comprueba que el bloque existe con sus recomendaciones y que las tres skills lo enlazan sin copiar las claves.
- **Evidencia**: `tests/init-control-keys-red.md` (`a7e1d87`) y `tests/init-control-keys-green.md` (`ae79191`). Moldes, lanzador y salidas en `red/` y `green/`.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 2h
- Esfuerzo real: 0.75h (aproximado, por las horas de los commits: plan a las 16:37 y cierre hacia las 17:20)
- Desviación: -1.25h (-62%)
- Causa de la desviación (obligatoria si |desviación| > 30%): los seis sujetos del GREEN corrieron a la vez (~20 min de reloj en lugar de 1,25 h en serie), y la Task 1 fue en línea con todo el contexto cargado. El coste en dinero sí se desvió al alza (ver 3).
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Coste del GREEN**: 26,30 $, frente a ~17 $ estimados y 22 $ de techo. Un sujeto siguió a `sdd-start-task` después de cerrar la init (~6,5 $ fuera del escenario). Como los sujetos corren desacoplados, el techo no se pudo aplicar a tiempo.

### Decisiones tomadas sin el dev-lead

- El test estructural no se aparcó en `red/`: se ejecutó en rojo (15 pasan y 1 falla) y se commiteó ya en verde con la implementación, porque no hubo commit intermedio — aparcar solo sirve para no commitear un test en rojo — coste si está mal: el rojo no queda en git. El revisor final lo marcó como Important y queda registrado en `tasks.md`.
- La constitution del molde G3 se corrigió de `master` a git-flow para que no contradijera su repo (`main` y `develop`) — un molde que se contradice da una salida al sujeto — coste: ninguno sobre la medida.
- El lanzador de la 0012 no reconocía «FIN.» con punto: se corrigió en la copia de esta task — coste: ninguno.
- El disparador de la validación diferida lo concretó el agente a partir de «se prueba en uso» (ver 4.2).

## 4. Verificación

### 4.1 Builds

- `Invoke-Pester tests/`: 292 pasan, 0 fallan, 6 omitidos. Ejecutado por el pre-commit en cada commit de la rama, el último `f91e1a5`.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-22 · «ya sabes ... sdd-kit ... se prueba en uso asi que diferido» · disparador: uso — la primera init (greenfield o brownfield) o la primera migración a v1.2.0 en un proyecto real del equipo, con el dev-lead como dueño.

Verificado por el agente (GREEN, `tests/init-control-keys-green.md`):

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Brownfield: una pregunta o un documento por turno (G1, 2 sujetos) | ✅ 2/2 (RED 0/2) |
| 2 | Brownfield con solo `master`: no pregunta el merge; marcador con perfil y frenos, sin `merge` | ✅ 2/2 |
| 3 | Greenfield situado en la 18: tres preguntas en tres turnos, con recomendación y motivo; merge con `develop`, `--no-ff` y borrado a cargo de una persona (G2) | ✅ 2/2 |
| 4 | Migración con perfil ya puesto: no lo pregunta; merge y frenos en turnos distintos; marcador completo (G3) | ✅ 2/2 |
| 5 | «No sé» no escribe la clave | sin medir: el simulador mezcló el «no sé» con un permiso |

### 4.3 Residuales / deuda generada

- «No sé» no escribe la clave: regla escrita y sin medir → fila de deuda en el roadmap.
- La fila de deuda «La entrevista de `sdd-init-brownfield` tiene la misma forma en prosa…» queda saldada por esta task.

## 5. Aprendizajes

- La persona del simulador tiene que responder `FIN` cuando el agente da la init por terminada, aunque le ofrezca un siguiente paso. Y el lanzador debe cortar un sujeto cuando su coste acumulado pase del techo por sujeto. → `tech-stack.md`, «Entrevista simulada», junto con la trampa del «no sé» mezclado.
- Brownfield marca el proyecto con la versión mayor de `migrations/`, así que una clave que solo pregunta la migración nunca llega a un proyecto nuevo: toda pregunta que añada una migración tiene que estar también en la init. → `tech-stack.md`, «Aprendizajes por task» (Task 0020).
- Delta de comportamiento → fusionado en `capabilities/onboarding.md` y `capabilities/migration.md`.

## 6. Adendas
