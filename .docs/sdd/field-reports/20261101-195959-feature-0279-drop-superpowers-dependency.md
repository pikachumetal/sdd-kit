---
kit_version: 2.3.4
lane: feature
id: 20261101-195959-feature-0279-drop-superpowers-dependency
task: 0279
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0279: retirar la dependencia de superpowers

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: review de spec, ejes Spec y Arquitectura y re-revisión en Opus; Código en Sonnet; sujetos en Sonnet y smoke en Haiku
- Coste en reloj: 1,02 h frente a 1,5 h estimadas
- Coste en tokens: hilo 19.496.621; subagentes 5.893.720; sesión 16,70 $, más 4,29 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un conflicto de una línea en una migración para al dev-lead

- **Qué pasó**: `sdd merge --sync` chocó en `v3.0.0.md`: dos features añadían texto a la línea `**Escribe**`, una junto al paso nuevo de la otra. Sin contradicción, pero el fichero está en `skills/`, y paré a preguntar con el merge a medias. El dev-lead contestó «1».
- **Fuente**: `skills/sdd-archive/SKILL.md:50`; commit `68f29751`.
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md`, paso 6.
- **Por qué el kit no lo evitó**: la regla admite solo `.md` de `.docs/`, sin distinguir una adición en una lista de un cambio de instrucción, y las migraciones de una release en preparación se tocan de feature en feature.
- **Coste**: una parada del dev-lead.
- **Propuesta**: admitir también `skills/*/references/migrations/` cuando los dos lados solo añaden y ninguno cambia lo del otro, sustituyendo la lista actual para no alargar el paso.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un conflicto en la línea `**Escribe**` de una migración con dos adiciones WHEN el cierre llega al paso 6 THEN junta las dos, repite el gate y lo nombra con la línea `Conflicto de la base resuelto por el agente`.

### 2. `sdd capability merge` acepta una línea que `sdd capability check` rechaza

- **Qué pasó**: dejé «Prueba en una copia…» bajo el último requisito del delta. `capability merge` la copió a `migration.md` sin avisar, y `sdd capability check` falló después: `línea suelta en «Lo que escribe una migración lo reciben también las init»`. El pre-commit rechazó el commit de la pasada de arreglos.
- **Fuente**: salida de `node cli/bin/sdd.js capability check --path .docs/sdd`; `skills/sdd-propose/SKILL.md` paso 4, que pide escribir el resultado «en ✋».
- **Dónde en el kit**: `cli/src/` del verbo `capability merge`, no localizado por línea; `skills/sdd-propose/SKILL.md` paso 4.
- **Por qué el kit no lo evitó**: la prueba en una copia corre solo `merge`, que dio verde dos veces con esa línea dentro.
- **Coste**: un commit rechazado y una vuelta de diagnóstico, más la falsa pista del hallazgo 5.
- **Propuesta**: que `capability merge` rechace lo que `capability check` rechazaría en el requisito que escribe.
- **Verificada**: sí — reproducido en esta sesión con la spec de la feature, ya corregida
- **Criterio de aceptación**: GIVEN un delta con una línea suelta tras un requisito WHEN se ejecuta `sdd capability merge` THEN falla sin escribir y nombra la línea.

### 3. El techo de sujetos cuenta lo ya lanzado, y una salida existente aborta el reintento

- **Qué pasó**: con `SUBJECT_CAP=3`, tras un sujeto del RED, `s3` salió `sin evidencia · sin tools.txt` sin gastar. Al subir el techo, `ya existe s1-1 en …/green/out` abortó la tanda. Para tener `s3` relancé `s1` y `s2` en otra fase (`green-s3`). Es el 2.º caso: el ticket de la 0116 ya lo anotaba en «Menores», y `battery.mjs` sigue sin filtrar por escenario.
- **Fuente**: salida de `node tests/headless/battery.mjs run`; `.docs/sdd/field-reports/20261101-164724-feature-0116-session-start-and-resume.md`, «Menores».
- **Dónde en el kit**: `tests/headless/campaign.mjs:145`; `tests/headless/battery.mjs`.
- **Por qué el kit no lo evitó**: el techo es de la spec y no de la tanda, y solo se puede lanzar por paso.
- **Coste**: ~0,4 $ en sujetos repetidos.
- **Propuesta**: un filtro por escenario en `battery.mjs run`, que también abarata `f2` y `f3` antes de cortar release (hoy `STEPS=sdd-propose` lanza 10).
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una batería con `s1` a `s3` y `s1` ya medido WHEN se lanza solo `s3` THEN corre un sujeto y no aborta por las salidas de `s1`.

### 4. La regla del vigía de silencio no se aplicó en ningún despacho

- **Qué pasó**: lancé 5 subagentes y ninguno llevó `sdd watch subagent`. Ninguno se colgó, así que no costó nada. La regla existía y no la apliqué.
- **Fuente**: `skills/sdd-implement/SKILL.md:316`; `tasks.md` de la feature.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Every dispatch»; la plantilla del encargo de los ejes no la recuerda.
- **Por qué el kit no lo evitó**: la regla está al pie de la skill, lejos del paso que despacha, en `sdd-verify`.
- **Coste**: ninguno observado; un caso.
- **Propuesta**: mover la frase a la tabla de ejes de `sdd-verify`.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una revisión final en Native WHEN salen los ejes THEN cada uno lleva su vigía en el mismo turno.

### 5. Un literal «tal cual» se parafrasea en un paso de migración

- **Qué pasó**: el informe del «no» del paso 10 salió literal en 1 de 3 sujetos, aunque el paso dice «tal cual» y lo lleva en un bloque. Los otros dan la edición a mano, con las claves correctas y sin la condición del marketplace.
- **Fuente**: `tests/drop-superpowers-green.md`; `green/out/s2-1`, `green-s3/out/s2-1`, `green-fix/out/s2-1`.
- **Dónde en el kit**: `skills/sdd-upgrade/references/migrations/v3.0.0.md`, paso 10.
- **Por qué el kit no lo evitó**: el sujeto da la salida antes de la respuesta, y al «no» solo le queda confirmar.
- **Coste**: ninguno para el usuario; un caso.
- **Propuesta**: mirar en la migración de la release si se repite antes de tocar el texto.
- **Verificada**: sí — `green/out`
- **Criterio de aceptación**: GIVEN `s2` WHEN el sujeto recibe el «no» THEN el informe lleva la frase literal.

## Lo que hice por iniciativa propia

- Sondeo con un sujeto Haiku antes de escribir la spec: 0,005 $, y confirmó que el kit carga sin la dependencia.
- Molde ya en la estructura de destino: bajó el sujeto de migración de ~1,5 $ a ~0,2 $, y la campaña costó 4,29 $ frente a los 14,4 $ previstos.
- Elegí la review de spec sin preguntar, por la regla 3 de `CLAUDE.md`, aunque `review-spec.md` pide preguntarla: dio 2 Críticos reales.
- Corrí `r1` antes de arreglar lo que señalaron dos ejes: no se reproducía.

## Funcionó, no tocar

- La review de spec: `cli.md:85` y `migration-init-parity.test.ts` habrían salido rojos en la implementación.
- La revisión en ejes: Spec y Arquitectura coincidieron en lo del «último paso», y Spec cazó el molde que faltaba, que resultó el camino real del paso 10.
- El control sin plugin del smoke: prueba que el hook del proyecto corre.

## Menores

- `R` es alias de `Invoke-History` en PowerShell: una función mía con ese nombre dejó sin aplicar 12 reemplazos — herramienta del agente.
- `npx vitest run` a secas, desde `cli/`, corre los lentos con el timeout corto y dio rojos falsos; ya lo dice `tech-stack.md`, «Verificación de una task» — regla que existía.
- La fila R1 de la batería se cambió tras ver la conducta en 3 de 3 sujetos: decidido como ruling, a la vista en el walkthrough — `tests/batteries/sdd-upgrade/battery.md`.
- La sesión sirve `sdd-feedback` con el texto del arranque, que aún pide la versión de superpowers; se contrastó con la rama, por la regla 1 de `CLAUDE.md`.
