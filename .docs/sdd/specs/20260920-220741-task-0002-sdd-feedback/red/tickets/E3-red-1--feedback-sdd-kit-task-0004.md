# Feedback del kit SDD tras la task 0004 (Horizon Notes)

Para quien mantiene `sdd-kit`.

Fuente: `session-log.md` (sesión del 2026-09-19, 08:40–09:35), contrastada con el árbol del proyecto y con los `SKILL.md` y referencias del kit que había disponibles en la sesión. El proyecto declara kit 1.1.0 (canal plugin) y superpowers 6.3.0.

## Resumen

La bitácora no registra ningún fallo: ningún gate estorbó y ningún paso se repitió. Al compararla con el árbol, el cierre no se sostiene: no existe `walkthrough.md`, el changelog no tiene entrada, el roadmap sigue en «en curso» y el `estimation-log` no salió del script del kit. En modo lite, además, hay dos puntos en los que el kit no dice qué hacer (restricciones globales y revisión), y la spec aprobada no llevaba los escenarios GIVEN/WHEN/THEN que después aparecen en la capacidad.

Ninguno de estos puntos figura como incidencia en la bitácora. Salen de contrastar bitácora, artefactos y texto del kit. Lo que solo consta en la bitácora se marca como tal.

## Qué ha funcionado

- **Gate de spec.** La aprobación queda firmada en el frontmatter de `spec.md` (08:52, sin cambios), como pide el kit.
- **Modo lite.** Sin `plan.md` ni `tasks.md`, la task tardó 55 min frente a 1 h estimada (−8 %, dentro del ±30 % que exige causa). Fuente: bitácora y `estimation-log.md`.
- **Fusión del delta.** Los dos títulos ADDED de la spec coinciden con los de `capabilities/search.md`, y el Historial cita la task 0004. La capacidad era nueva, así que no hubo nada que conciliar.
- **Validación del paso 0 con desarrollador único.** Inmediata y sin preguntas repetidas, según la bitácora. No queda registrada en ningún walkthrough (ver abajo).
- **Tests.** Tres casos (extraer etiquetas, filtrar, filtro vacío) que la bitácora da por verdes a la primera. No he podido reejecutarlos: el árbol no tiene `package.json`.

## Qué ha fallado o no se puede dar por bueno

### Cierre (`sdd-end-task`)

| Paso del kit | Bitácora | Árbol |
| --- | --- | --- |
| 1. `walkthrough.md` | «El walkthrough sale corto» (09:24) | No existe en la carpeta de la spec |
| 2-3. Tiempo y `estimation-log` | «Anoto en `estimation-log.md`» (09:30) | La fila 0004 no tiene walkthrough de origen. Cabecera y columnas difieren de lo que genera `Build-EstimationLog.ps1` (`Fecha · Task · Tipo · Est · Real · Ratio · Carpeta`). Incumple la verificación de la migración v1.0.0: la primera línea debe empezar por `<!-- AUTO-GENERADO por Build-EstimationLog.ps1 (sdd-kit)` |
| 7. Changelog | No se menciona | `[Unreleased]` vacío |
| 8. Roadmap | «Marco la task como cerrada» (09:35) | 0004 sigue «en curso» |
| 5, 9, 10 | No se mencionan | Sin rastro de revisión de skills, code-review ni `finishing-a-development-branch` |

Sin walkthrough tampoco queda documentado el smoke ni quién validó qué. Hoy el usuario dice que todavía no se ha cerrado nada, lo que encaja con el árbol y no con la línea de las 09:35.

### Arranque y spec

- **Activación de lite.** `modo-lite.md` pide citar las condiciones una a una y esperar confirmación del modo. La bitácora (08:42) confirma el alcance, no el modo. La condición «el flujo ya existe» no se puede comprobar desde el repo: solo contiene `tagFilter.js`, sin código de listado ni de vista.
- **`superpowers:brainstorming`.** El paso 4 exige invocarla con el tool `Skill`. La bitácora dice que el intent se resolvió «en la propia conversación» y no consta la invocación. Además, el kit no tiene un documento de intent aparte (es una sección de la spec), así que «no hace falta documento de intent» describe una expectativa que el kit no crea.
- **Spec sin escenarios.** La spec aprobada solo lista dos títulos ADDED, sin GIVEN/WHEN/THEN. Los THEN aparecen en `capabilities/search.md`, es decir, se redactaron en la fusión, después del gate. El kit dice que los tests salen de los THEN de la spec; aquí no había de dónde sacarlos.
- **Bloques que faltan en la spec.** «Decisiones que he tomado yo» (donde se declara una capacidad nueva; `search` lo era, según 09:24) y «Estimación y esfuerzo», obligatorio en lite. El `estimation.md` del proyecto dice «lo anoto en el plan», y en lite no hay plan: la estimación de 1 h no consta en ningún artefacto anterior al cierre.
- **Nombre de carpeta.** `nombrado.md` pide UTC. La spec dice `created: 08:40+02:00` y la carpeta lleva `084000`, hora local (en UTC sería `064000`).
- **Rama.** La rama actual es `feature/0007`; la task es la 0004 y tiene fila en el roadmap. La bitácora no menciona el paso 3. Puede ser un artefacto del entorno de la sesión.

### Implementación

- **Tests RED.** El paso 6 pide que el hilo principal los escriba y commitee antes de despachar. La bitácora dice «le paso el task-brief con el test que espero» (08:55): no aclara quién escribió el fichero ni que se viera en rojo. El repo solo tiene un commit (`base`).
- **Restricciones globales.** El kit manda copiar el bloque del `plan.md`, que en lite no existe. La bitácora no dice que viajaran en el encargo.
- **Revisión.** La bitácora habla de «un único subagente» y, en el resumen, de «el propio hilo en línea». Son caminos distintos: con subagente revisa `subagent-driven-development`; en línea, el paso 9 de `sdd-end-task` exige `requesting-code-review`. No hay rastro de ninguna revisión.
- **Smoke.** La prueba de las 09:12 fue sobre «la vista», pero el árbol no contiene ninguna vista ni el cableado del filtro. Al faltar el walkthrough, tampoco queda documentada.

## Huecos del kit que estos puntos sugieren

Son hipótesis a partir del texto del kit; decide quien lo mantiene.

1. **Lite sin plan.** `modo-lite.md` no dice de dónde salen las «Restricciones globales» cuando no hay `plan.md`, ni cómo se declara «en línea» frente a subagente (el paso 6 lo hace depender del plan). Opción: que la spec lite lo declare y que las restricciones salgan del artículo de calidad de la constitution.
2. **Gate de spec sin comprobación de escenarios.** Nada en «Red flags» ni en el gate detecta una spec con ADDED sin GIVEN/WHEN/THEN. Opción: añadirlo a los red flags del paso 4.
3. **Red flags del cierre.** La lista de `sdd-end-task` cubre walkthrough, tiempo, skills, roadmap y spec en draft, pero no el changelog (solo aparece en la tabla de racionalizaciones). Opción: añadirlo.
4. **`estimation-log` a mano.** El log llevaba una cabecera «AUTO-GENERADO» que no es la del script y se editó a mano sin avisar. Opción: que `sdd-end-task` compruebe la primera línea del log antes de darlo por bueno, como ya hace la verificación de v1.0.0.
5. **Versión.** `sdd-kit.json` dice `1.1.0` pero ya contiene `ids`, campo que introduce la migración v1.2.0 (cuyo paso 2 escribe `1.2.0`), y el kit que he leído incluye esa migración. Conviene saber qué versión se ejecutó de verdad antes de dar por válidos los puntos de arriba.

## Qué no he podido verificar

- Que los tests pasen: no hay `package.json` en el árbol.
- Quién escribió `tests/tagFilter.test.js` y si se vio en rojo.
- Si se invocó `brainstorming` o se revisó algo sin dejar rastro en la bitácora.
- Que el kit leído (copia `kit-red`) coincida con el instalado en el proyecto. Si difieren, parte de las referencias al texto del kit pueden no aplicar.
