---
id: 20260927-124940-feature-0032-final-review-scope
feature: 0032
title: Walkthrough — Encargo del revisor final: paquete con la base actual y sin evidencia
spec: ./spec.md
status: done
created: 2026-09-27
---

# Walkthrough — Encargo del revisor final: paquete con la base actual y sin evidencia

## 1. Cambios realizados

- **Receta del paquete del revisor final** en `skills/sdd-start-feature/references/encargo-revision.md`, sección «Revisor final». El hilo prepara el paquete en Git Bash, en los dos métodos, sin `review-package`:
  - `cd` a la raíz del repo;
  - `MERGE_BASE=$(git merge-base HEAD <integración> $(git rev-parse -q --verify origin/<integración>))`;
  - exclusiones `':(exclude,glob)…/red/**'` y `…/green/**`;
  - la salida en el workspace de `sdd-workspace`, con `spec.md` como `PLAN_FILE` en lite, en el formato de `review-package`.

  «Cómo revisar» apunta a la ruta que imprime la receta.
- **Overrides**: las filas de `executing-plans` y de `subagent-driven-development` de `overrides-superpowers.md` dicen que la revisión final lee el paquete del kit.
- **Plantilla del plan**: la ayuda de «Decisiones que he tomado yo» de `plan-template.md` fija al revisor final en `sdd-kit:effort-high` + `opus` y no deja quitarlo en Native. Incluye el contraejemplo «no hay subagentes que auditar».
- **Evidencia**: `tests/final-review-package-red.md` y `tests/final-review-package-green.md`. El test estático nuevo es `tests/FinalReviewPackage.Tests.ps1` (8 comprobaciones). El lanzador está en `red/subject.sh`, con los escenarios `f1`, `f2`, `r1` y `p1` sobre el molde `salas`.
- **Docs vivos**: el delta fusionado en `capabilities/feature-flow.md`, la entrada del changelog, la fila 0032 del roadmap partida en la 0085 y la 0086, la deuda del techo del plan (0058) saldada, una fila nueva para el trailer y tres aprendizajes en `tech-stack.md`.
- **Commits**: apertura `cd3eb13`; implementación y evidencia en dos commits sin juntar (`7035cda` y `f431ba2`), porque el rango hasta el cierre contiene el merge de `develop` (`cce0278`) y la receta de hitos no junta rangos con merges; cierre en un solo commit, con los arreglos de la revisión final y la documentación, y un merge de sincronización posterior con `develop` para traer el conjunto rápido del patch 0087.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (de la spec): 2,5 h
- Esfuerzo real: ~1,2 h. Es el reloj del hilo desde la apertura (14:51) hasta el cierre (~16:05), sacado de las marcas de los commits. La spec y las preguntas, desde las 14:34, suman ~0,3 h más.
- Desviación: −1,3 h (−52 %)
- Causa de la desviación: los moldes de las features 0044 y 0057 se reutilizaron sin cambios, y las tandas de sujetos corrieron en paralelo, con 5 sujetos a la vez por fase. La estimación contaba construir el molde de git desde cero. Las dos cosas que sumaron tiempo, la tanda extra de RED y el arreglo del Important de la revisión, no compensaron.
- Modelo del hilo: Opus 5.5, effort no registrado (toda la sesión)
- Tokens del hilo: 27.265.223 — claude-opus-5-5 27.265.223
- Tokens de subagentes: 1.467.605 en 2 despachos — Revisión final de rama 0032 claude-opus-5-5 1.015.978 / 3 min; Re-revisión acotada de los arreglos 0032 claude-sonnet-5 451.627 / 2 min
- Coste de la sesión: 11,23 $ (hilo 9,96 $ + subagentes 1,28 $)
- Coste de sujetos: 9,79 $ en 14 sujetos Sonnet. RED: 5,86 $ en 8 sujetos (uno, el `p1-2`, perdió sus salidas). GREEN: 3,93 $ en 6 sujetos.
- Review de spec: no (modo lite)

Las tres líneas de tokens salen de `Measure-SessionTokens.ps1` con `-ProjectsRoot ~/.claude-gco/projects`. Con el valor por defecto dio «no medido»: es deuda apuntada en el roadmap. Se midió antes del commit de cierre, así que los últimos minutos del hilo no están.

## 3. Desviaciones del plan

- La frase del trailer `Co-Authored-By` salió del Scope por enmienda: su RED salió limpio 0 de 2 tras una tanda más. El dev-lead eligió «Una tanda más de RED», cuya opción decía «Si siguen limpias, se recortan igual».
- La receta ganó el caso con remoto (`origin/<integración>`), las comillas, el `cd` a la raíz y la frase en la fila de SDD. Venían de la revisión final, con el visto bueno del dev-lead («Arreglar ahora»), y llevaron un sujeto de control (`f2-1`). Para que cupiera, el techo de sujetos subió de 13 a 14.

### Decisiones tomadas sin el dev-lead

- La capacidad del delta pasó de `task-flow` a `feature-flow` al integrar `develop`, porque el patch 0083 la renombró. El comportamiento no cambia; solo el nombre del fichero de destino.
- La frase del techo va en la ayuda de «Decisiones que he tomado yo» de `plan-template.md`, no en el campo `Modelo` de cada task, como decía la spec. El campo `Modelo` es de cada task y no del revisor final; el `p1-4` del RED lo quitó justamente en una decisión, y el GREEN lo avala 2 de 2. Si está mal, el revisor final vuelve a faltar en planes que no lean esa ayuda.
- Integré `develop` antes de la revisión final, para que la revisión probara la receta con un merge real. Tras el merge, el paquete siguió en 7 ficheros y 37 KB.
- Minor diferido de la revisión final: el paréntesis de ~45 palabras en la línea de «Decisiones» de `plan-template.md` (punto 5). Moverlo exige otro sujeto de control de `p1` y pasaba del techo.
- La re-revisión se despachó con `sdd-kit:effort-medium` + `sonnet`, gama media como suelo, con un paquete hecho a mano sin `red/out/` ni `green/`: su rango no tiene merges, pero traía las salidas de `f2-1`.

## 4. Verificación

### 4.1 Builds

- Suite completa: `Invoke-Pester tests` (con `Slow`) → antes de la sincronización, 940 superados, 1 fallido y 10 omitidos, en 454 s. El fallo es `FastSuiteBudget`: el conjunto rápido tardaba 36,7-38,5 s con un umbral de 30 s, siempre en la rama y nunca en `develop`. La causa es que la rama no tenía el patch 0087, que bajó el conjunto a ~25,6 s. Tras el merge de sincronización: ver la adenda.
- `tests/FinalReviewPackage.Tests.ps1` → 8 de 8. Antes de la guía estaba en RED: 7 de 7 en la primera ronda y 4 de 8 en la segunda. La copia del RED se comparó sin cambios en las dos rondas.
- `Test-Capabilities.ps1 -Artifact spec.md` → «Capacidades válidas: 14».

### 4.2 Smoke / tests

- Validación diferida: 2026-09-27 · «cuando acabes, validacion diferida al uso, feedback, commit y merge» · disparador: la primera revisión final de rama que prepare el paquete con la receta (la de la 0085 o la 0086), a cargo del dev-lead.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| La sección de diff del paquete no contiene `skills/otra/SKILL.md` ni ningún fichero bajo `red/` o `green/` | ejecución real | Receta ejecutada sobre el molde `f1`: 3.188 bytes y 0 coincidencias (`review-package` daba 49.940). Sujetos del GREEN `f1-1`, `f1-2` y `f2-1` (con remoto): 0 coincidencias. En esta misma rama, tras integrar `develop`: 7 ficheros y 37 KB, sin las ~4.400 líneas de `red/` y `green/` |
| La sección de commits lista solo los de la feature y el merge | ejecución real | Los mismos paquetes: 5 commits de la 0012 y el merge; ninguno de la 0013 ni de la 0014 |
| El paquete se genera a la primera, con `spec.md` como `PLAN_FILE` | ejecución real | `f1-1` y `f1-2` lo generaron a la primera en `.superpowers/sdd/spec/`. `f2-1` no encontró `sdd-workspace` (ruido del molde, ver 4.3) |
| El revisor final aparece como `sdd-kit:effort-high` + `opus`, o no aparece | ejecución real | GREEN `p1-1` no lo nombra ni lo quita; `p1-2` lo fija con `effort-high` + `opus`. En el RED, 1 de 4 lo quitaba |

### 4.3 Residuales / deuda generada

- El trailer `Co-Authored-By` como modelo del implementador no se reproduce (RED 0 de 2) → fila en «Deuda técnica».
- `Measure-SessionTokens.ps1` supone `~/.claude/projects` → añadido a la fila de deuda del perfil de configuración (ticket 0082 §2).
- Minor 5 de la revisión final (paréntesis largo en `plan-template.md:18`) → diferido aquí, sin fila: es de redacción.
- Ruido del molde: un sujeto con `--plugin-dir` no encuentra los scripts de superpowers sin su `Base directory` → aprendizaje en `tech-stack.md`.

## 5. Aprendizajes

- Una tanda más de sujetos reutiliza la etiqueta si `SUBJECT` se repite y sobrescribe la salida anterior → `tech-stack.md`, «Sujetos headless».
- Un sujeto no localiza los scripts de superpowers sin invocar su skill → `tech-stack.md`, «Sujetos headless».
- Un test que corta una sección de un `.md` por `^## ` se para dentro de un bloque de código → `tech-stack.md`, «Sujetos headless».
- `Measure-SessionTokens.ps1` ignora el perfil activo → roadmap, deuda del perfil de configuración.
- Revisión de skills: se editaron `encargo-revision.md`, `overrides-superpowers.md` y `plan-template.md`, con su RED/GREEN en `tests/final-review-package-*.md`. No hay más skills que revisar: el enrutado no cambia y ninguna otra skill construye el paquete. El revisor final lo comprobó con un `grep` de `review-package` y `MERGE_BASE` en `skills/`.

## 6. Adendas
