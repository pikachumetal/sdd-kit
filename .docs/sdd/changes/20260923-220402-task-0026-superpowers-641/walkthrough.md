---
id: 20260923-220402-task-0026-superpowers-641
task: 0026
title: Walkthrough — Compatibilidad con superpowers 6.4.1 y ruta del workspace en Windows
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-24
---

# Walkthrough — Compatibilidad con superpowers 6.4.1 y ruta del workspace en Windows

## 1. Cambios realizados

- **Overrides** (`99bc819`): dos filas nuevas en `skills/sdd-start-task/references/overrides-superpowers.md`.
  - El Execution Handoff de `writing-plans` y el HARD-GATE architectural de `brainstorming` no preguntan el método ni ofrecen «Native». El método lo fija el kit, y la revisión del plan sigue la tabla de gates.
  - En Windows, la ruta POSIX que imprimen `sdd-workspace` y `task-brief` se convierte con `cygpath -w` antes del primer `Write` o `Read`.
- **Puntero en el punto de uso** (`7dddf64`, enmienda aprobada): sección «Rutas del workspace en Windows» en `skills/sdd-start-task/references/encargo-revision.md`.
- **Evidencia** (`7dddf64`): `tests/superpowers-641-red.md` y `tests/superpowers-641-green.md`, más el molde, el lanzador y las salidas en `red/` y `green/` de esta carpeta.
- **Anclas** (`e6a84f4`): `tests/SuperpowersCompat.Tests.ps1`, con 5 `It`.
- **Validación de la 6.4.1** (`e6a84f4`): README («Versión validada: 6.4.1, revisada el 2026-09-24») y «Referencias de vigilancia» del roadmap. La fila 0026 queda recortada, y el resto de la fila original pasa a la **0054** (versión siguiente), junto con lo que no entró.
- **Integración**: merge de `develop` en la rama (`250fc63`) antes de la Task 3; la 0031 había cambiado `README.md` y `roadmap.md`.
- **Arreglos de la revisión final** (`8acde3c`): el coste de la campaña (5,44 $) y la 0026 en la tabla de ficheros calientes de `encargo-revision.md`.
- **Capacidades** (cierre): `ADDED` «El plan no pregunta el método de ejecución» en `control-profiles` y «En Windows, el workspace de ejecución se usa en su ruta Windows» en `task-flow`.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,25h (punto medio del rango 1–1,5h)
- Esfuerzo real: 0,8h. Reloj del hilo, aproximado con las marcas de los commits: de la apertura (`61e3234`, 00:25 hora local) a los arreglos de la revisión final (`8acde3c`, 00:56), más ~0,3h de cierre. Spec y plan, con el RED previo, ~0,5h aparte.
- Desviación: −0,45h (−36 %)
- Causa de la desviación: el mismo sesgo que avisa `estimation.md`, estimar la campaña como tiempo de hilo. Los sujetos eran de un turno y corrieron en paralelo, 3–6 min por tanda. Tres frentes se decidieron con evidencia ya medida (0006) o con sondas, sin sujetos. Lo que sumó fue lo no previsto: una tanda de REFACTOR, el freno por la base movida y el merge de `develop`.
- Modelo del hilo: Opus 5.5
- Tokens del hilo: no medido
- Tokens de subagentes: 301k en 2 despachos — revisor Task 1 Sonnet 116k / 4 min; revisor final Sonnet 185k / 6 min
- Coste de sujetos: 5,44 $ en 11 sujetos Sonnet — RED previo a la spec 1,74 $ (5); GREEN 3,70 $ (6, con 2 de REFACTOR)
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Enmienda** (aprobada por el dev-lead: «Puntero en encargo-revision (Recomendado)»): `encargo-revision.md` entra en los ficheros que se tocan. Con la fila de overrides sola, 1 de 2 sujetos no abrió la tabla. La entrada no nombró a tiempo las tasks abiertas que declaran ese fichero; se añadió después.
- **Freno de alcance** (fichero de la task cambiado en la base): la 0031 se fusionó en `develop` y cambió `README.md` y `roadmap.md`. El dev-lead eligió «Traer develop antes», y hubo merge de `develop` en la rama antes de la Task 3, sin conflictos.

### Decisiones tomadas sin el dev-lead

- Cuarto `It` en las anclas («Referencias de vigilancia»), cuando el plan pedía tres — cubre la decisión 6 de la spec — coste si está mal: un test de más.
- Las copias de tests RED que los sujetos guardaron en su workspace no se versionan: pasaban de 140 caracteres de ruta y rompían `PathLength.Tests.ps1` — coste si está mal: ninguno, son copias del molde.
- El título de `.docs/sdd/changelog.md` llegó partido de `develop` (la entrada del patch 0051 metida en «# Changelog»): la entrada se movió a `### Fixed` y el título se rehízo en el commit de cierre — coste si está mal: ninguno, el texto de la entrada no cambia.
- «Declined to judge» de la revisión final, cinco líneas, todas se mantienen fuera — la fusión en `capabilities/` y el changelog son pasos del cierre; los frentes (b)–(f) los deja fuera la spec y van a la 0054; el molde y las salidas de sujetos no se revisan línea a línea — coste si está mal: bajo, el revisor contrastó costes y denegaciones contra los `result.json`.

## 4. Verificación

### 4.1 Builds

- Sin build (kit en Markdown).

### 4.2 Smoke / tests

- Validación diferida: 2026-09-24 · «como simepre, deribado al uso, feedback, commit y merge» · disparador: la próxima task de este repo que pase por los pasos 5 y 6 con superpowers 6.4.1 en Windows, a cargo del dev-lead (concretado por el agente).

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Suite completa, `Slow` incluidos (`Invoke-Pester -Path tests`) | ✅ verificado por el agente: 512 pasan, 0 fallan, 6 omitidos, 167 s |
| 2 | Handoff: el plan no pregunta el método ni ofrece «Nativo» (`h`, perfil `delegate`) | ✅ verificado por el agente: RED 1/2 falla → GREEN 2/2 |
| 3 | Ruta del workspace: primer `Write` con ruta Windows y sin denegación (`w`) | ✅ verificado por el agente: 1/2 con la fila sola → 2/2 tras el REFACTOR |
| 4 | Herencia de «Restricciones globales» con 6.4.1 (sonda de `task-brief`) | ✅ verificado por el agente: el hueco sigue, el override se mantiene |
| 5 | Vías de `brainstorming` 6.4.1 | ⚠️ re-test parcial: 2/2 van hacia la spec, ninguno la escribe (paran en una pregunta de alcance legítima) |
| 6 | Revisión final de rama (Sonnet) | ✅ «Ready to merge: Yes», 0 Critical, 0 Important, 2 Minor arreglados |

### 4.3 Residuales / deuda generada

- Fila **0054** (versión siguiente): anuncio del workspace, cosecha de `Ruling:`, «Recuperación», commits por ruta, «Review Focus» tras la 0031, el enlace de overrides al pie del paso 6 y los posibles falsos negativos (c), (e) y (f), más el re-test parcial de las vías.

## 5. Aprendizajes

- Un fichero de `references/` que el paso nombra solo al pie no se lee de forma fiable: 1 de 2 sujetos se saltó la tabla de overrides, y los dos leyeron los auxiliares nombrados donde se usan. Es la segunda medición de la regla de la task 0013. → `architecture.md` (anatomía, ficheros auxiliares)
- Un sujeto headless en Windows puede usar la herramienta `PowerShell` en vez de `Bash`: el lanzador tiene que permitir `PowerShell(*)`, o el sujeto se queda sin git (`r-v-1` inválido). → `tech-stack.md` (fixtures y baselines)
- Al versionar lo que produjo un sujeto, las copias de tests que guarda en su workspace rompen `PathLength.Tests.ps1`: solo se versionan el ledger y `plan-path`. → `tech-stack.md` (fixtures y baselines)
- Un frente de compatibilidad se puede decidir sin sujetos: el `diff` entre versiones de superpowers, sus scripts ejecutados y los `result.json` de campañas previas dieron el RED de cinco de los nueve frentes. → `tech-stack.md` (fixtures y baselines)

## 6. Adendas
