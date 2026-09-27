---
id: 20260924-225643-task-0067-patch-capabilities
task: 0067
title: Walkthrough — El carril patch fusiona su delta de capacidad
spec: ./spec.md
status: done
created: 2026-09-25
---

# Walkthrough — El carril patch fusiona su delta de capacidad

## 1. Cambios realizados

- **Pieza 1, carril patch con capacidad** (`ece667e`, arreglos de la revisión final en `c2b2e3d`):
  - `skills/sdd-end-patch/SKILL.md`, paso 1: párrafo **Capacidades** *(si existe `.docs/sdd/capabilities/`)*. Compara la capacidad de la pieza tocada con lo que hace el fix. Si el patch solo devuelve el comportamiento a lo que la capacidad ya decía, no hay delta y no se escribe nada (se borra la sección vacía de la plantilla). Si no, el delta va a `patch.md` y se fusiona como en `sdd-end-task`, con su línea de historial. Un patch no crea capacidades.
  - `sdd-end-patch`, paso 2: las capacidades van en el commit de cierre, y el fix se nombra como «código, tests y `patch.md`».
  - `patch-template.md` gana la sección opcional «6. Delta de capacidad».
  - `capability-template.md`: las reglas 2 y 3 y el «Historial» nombran `sdd-end-patch`; la línea de historial lleva la carpeta.
  - Anclas en `tests/CapabilityRules.Tests.ps1`. Evidencia en `tests/sdd-end-patch-red.md` y `tests/sdd-end-patch-green.md`, con molde y lanzador en `red/`.
- **Pieza 2, puesta al día** (`122acb6`, precisiones en `c2b2e3d`): de los 14 patches desde el 2026-09-20, 8 cambiaron comportamiento del kit instalado sin reflejarlo:

  | Capacidad | Patches |
  | --- | --- |
  | `release-flow` | 0028 |
  | `task-ids` | 0035, 0038 |
  | `control-profiles` | 0037, 0051, 0065 |
  | `estimation` | 0056, 0066 |

  Cada uno deja su línea de historial. Sin delta: 0017 (texto), 0024 (README), y 0023, 0027, 0030 y 0043, que son tooling del repo.
- **Cierre**: fusión del delta de la spec en `capabilities/capabilities.md`, changelog, roadmap, `tech-stack.md` y este walkthrough.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 2,5h
- Esfuerzo real: 1,4h — reloj del hilo aproximado con las marcas de los commits: 00:35–01:30 del 2026-09-25 (spec, campaña, pieza 2 y revisión) y 09:05–09:35 (validación y cierre). No cuenta la noche en espera.
- Desviación: −1,1h (−44 %)
- Causa de la desviación: la pieza 2 se hizo mientras corrían los sujetos, y las tandas salieron más cortas y baratas que la previsión (0,30 $ por sujeto frente a 0,75 $). La tanda de REFACTOR entró dentro del techo.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 323757 en 2 despachos — revisor final opus (effort-high) 155200 / 4,4 min; re-revisión opus (effort-high) 168557 / 0,5 min
- Coste de sujetos: 3,65 $ en 12 sujetos sonnet — RED 1,22 $; GREEN 1,05 $; REFACTOR 1,38 $
- Review de spec: no (modo lite) · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Modo lite, sin plan. Desviaciones respecto a la spec, abajo.

### Decisiones tomadas sin el dev-lead

- **Merge de sincronización de `develop` en la feature a mano** (`4e037b9`) — la fila 0067 estaba en `develop` y no en la rama, y el enunciado pedía cerrarla. La receta solo permite ese merge ante un conflicto en los registros; aquí entró limpio y no toca `develop` — coste si está mal: un commit de merge de más en la historia de la rama.
- **Criba con 8 patches, no «unos seis»** — añadí 0028 y 0037: `release-flow` no nombraba el merge de vuelta, y `control-profiles` decía lo contrario del patch 0037 — coste si está mal: dos requisitos de más en capacidades que la 0063 y la 0061 también tocan.
- **Tanda de REFACTOR sin preguntar** — la revisión final encontró una regresión en el paso 2 (3/4) y un camino sin medir (la §6 vacía calcada). Dos frases y 4 sujetos, dentro del techo declarado — coste si está mal: 1,38 $.
- **La línea de historial de los patches lleva «fusionado por la task 0067»** — para que se vea que la fusión es posterior al patch — coste si está mal: ruido en el historial.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"`: 619 pasados, 0 fallos, 6 saltados, sobre `c2b2e3d`. Tras la sincronización con `develop`, el pre-commit (conjunto rápido): 593 pasados, 0 fallos.

### 4.2 Smoke / tests

- Validación diferida: 2026-09-25 · «Difiero al primer patch real» · disparador: el primer patch que el dev-lead cierre con el kit de `develop` en un proyecto con `capabilities/`, a cargo del dev-lead.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | ADDED «El cierre de un patch fusiona su delta» (p1: `salas libres 10-12` con Oeste en mantenimiento) | ✅ verificado por el agente: GREEN 2/2 y REFACTOR 2/2 fusionan `MODIFIED Consultar salas libres` con historial en el commit de cierre (RED 1/2, por una lectura incidental) |
| 2 | ADDED «Un patch que devuelve el comportamiento a la capacidad no lleva delta» (p2: `salas reservar Norte 10-13`) | ✅ verificado por el agente: 6/6 dejan `bookings.md` sin tocar; con la §6 vacía calcada, 2/2 la borran |
| 3 | Juntura fix + `patch.md` en el paso 2 | ✅ verificado por el agente: regresión 3/4 en el GREEN, 4/4 tras el REFACTOR |
| 4 | Cada fusión de la pieza 2 describe el código de la rama | ✅ verificado por el revisor final, fichero y línea; los textos de `control-profiles.md` y `merge-recipe.md` siguen iguales tras integrar la 0061 |
| 5 | Anclas de `CapabilityRules.Tests.ps1` | ✅ 4 en rojo antes del cambio, en verde después |

- Revisión final: `sdd-kit:effort-high` + opus, «With fixes» (3 Important, 5 Minor); re-revisión de `c2b2e3d`: «Ready to merge: Yes».

### 4.3 Residuales / deuda generada

- Las dos capacidades de la pieza 2 que otras tasks tocan (`control-profiles` con la 0061, `release-flow` con la 0063) se integraron sin conflicto con la 0061. La 0063 no está en `develop`: al cerrarla, su fusión en `release-flow.md` convive con el requisito «El tag vuelve a la rama de integración».

## 5. Aprendizajes

- Un GREEN mide también la conducta vecina que la guía no pretende cambiar; el molde reproduce el artefacto como nace en campo → `tech-stack.md` (Aprendizajes por task, 0067).
- Revisión de skills: `sdd-end-patch`, `patch-template.md` y `capability-template.md` cambiados en esta task con su RED/GREEN. `sdd-start-patch` no cambia: calca la plantilla, y la §6 vacía la resuelve el cierre (REFACTOR 2/2). No aplica a otras.

## 6. Adendas
