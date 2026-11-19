---
kit_version: 3.0.3
lane: feature
id: 20261119-113925-feature-0347-template-instance-init-first
task: 0347
mode: full
date: 2026-11-19
---

# Ticket para el kit — feature 0347: una instancia de template sin inicializar entra por sdd-init, y el cierre de sdd-init nombra lo que --finish escribió fuera de .docs/

## Contexto

- Carril y modo: feature full, perfil delegate, validación en campo
- Skills del kit usadas: using-sdd, sdd-propose, sdd-parallel-agents, sdd-implement, sdd-implement-native, sdd-worktrees, sdd-tdd, sdd-verify, sdd-archive, sdd-retro, sdd-feedback; `sdd-init` y `sdd-upgrade` como sujetos de batería
- Proyecto: el propio kit (plugin de Claude Code, CLI en Node), una persona
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: claude-sonnet-5-5 (revisores de spec, eje Código), claude-opus-5-5 (eje Spec, re-revisión); sujetos `sonnet`
- Coste en reloj: 0,86 h frente a 1,5 h estimadas (sin 85 min de espera al dev-lead)
- Coste en tokens: hilo 54.017.607; subagentes 3.598.809 en 6 despachos; sujetos 1,06 $ frente a 0,91 $ previstos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El paso 5 de `sdd-init` no se puede cumplir en un proyecto recién iniciado: `sdd estimation log` exige `changes/` o `specs/`

- **Qué pasó**: en el primer GREEN de `n8` (molde con todos los documentos aprobados, sin `changes/`), el sujeto ejecutó `sdd estimation log --root "$PWD"` dos veces, con y sin `--out`, y paró a preguntar: «`sdd estimation log` termina con error porque no existe `.docs/sdd/changes/` ni `specs/`… La skill prohíbe crear `changes/` vacía… También prohíbe escribir el log a mano». No llegó a `--finish`. En el RED, otro sujeto saltó el paso y lo anotó como «Parece un fallo del kit con proyectos nuevos».
- **Fuente**: `.docs/sdd/changes/20261119-101604-feature-0347-template-instance-init-first/green/out/n8-1-molde-sin-log.texts.txt` y `red/out/n8-1.texts.txt`; `skills/sdd-init/SKILL.md` paso 5 («`sdd estimation log --root "<root>"`, which leaves `.docs/sdd/steering/estimation-log.md` with its header and no rows») y paso 4 («`capabilities/`, `changes/` and `decisions/` are not created»).
- **Dónde en el kit**: `cli/src/estimation/` (el verbo `estimation log`) y `skills/sdd-init/SKILL.md` paso 5.
- **Por qué el kit no lo evitó**: la CLI trata la falta de `changes/` y `specs/` como error, y la init prohíbe crearlas vacías; ningún test de la CLI cubre un proyecto sin ninguna de las dos.
- **Coste**: una tanda GREEN repetida (2 sujetos, 0,26 $) y una parada del dev-lead por superar la previsión del Art. I; respaldo: walkthrough de la 0347, §3 y «Decisiones tomadas sin el dev-lead».
- **Propuesta**: `sdd estimation log` sin `changes/` ni `specs/` escribe el log con su cabecera y cero filas, y sale con 0.
- **Verificada**: sí — reproducido por dos sujetos `claude -p` (salidas citadas en «Fuente»); no reproducido a mano en un shell.
- **Criterio de aceptación**: GIVEN un proyecto con `.docs/sdd/steering/` y sin `changes/` ni `specs/` WHEN `sdd estimation log --root <raíz>` THEN sale con 0 y `.docs/sdd/steering/estimation-log.md` tiene la cabecera y ninguna fila.

### 2. La pasada de coherencia no comprueba que el molde de un escenario de batería nuevo llegue al paso que mide

- **Qué pasó**: la decisión 8 de la spec pedía el molde de `n8` con una marca de template en `PRODUCT.md`, para medir que el resumen de cierre la nombre. Con la marca, el predicado 1 de `sdd-init` vuelve a entrevistar y el sujeto nunca llega a `--finish`. Lo vi al montar el molde, lo quité como ruling, y la revisión final (eje Spec) lo marcó Important por dejar un AND sin sujeto. Hizo falta una parada del dev-lead y una enmienda que quitó la frase del paso 8.
- **Fuente**: spec de la 0347, decisión 8 y «Enmiendas» (2026-11-19, segunda); walkthrough de la 0347, §3.
- **Dónde en el kit**: `skills/sdd-propose/references/coherence-pass.md` (casos reales contra su THEN) y `skills/sdd-propose/references/review-spec.md` (lente técnica).
- **Por qué el kit no lo evitó**: la pasada de coherencia contrasta literales y casos reales del código, no la alcanzabilidad de un molde de batería frente a los predicados de entrada de la skill que lo lee; ninguno de los tres revisores de spec lo vio.
- **Coste**: un Important en la revisión final, una parada del dev-lead y una enmienda; respaldo: spec, «Enmiendas»; walkthrough, §3.
- **Propuesta**: en la pasada de coherencia, por cada escenario de batería nuevo, recorrer los predicados de entrada de la skill sujeto con el estado del molde y escribir en ✋ qué paso alcanza.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una spec que añade un escenario con un molde que dispara un predicado anterior al paso medido WHEN pasa la coherencia THEN ✋ dice que el molde no alcanza ese paso antes del gate.

### 3. Editar un artefacto con un script de Node y `String.replace` corrompió la spec

- **Qué pasó**: un reemplazo cuyo texto de sustitución llevaba «0.13 $`» insertó el texto previo (patrón especial `` $` `` de `String.replace`): la spec salió repetida seis veces, 1129 líneas. Lo detectó el revisor de la segunda ronda como Crítico; restaurada con `head -201` y rehecha la tabla.
- **Fuente**: spec de la 0347, «Hallazgos de la review», segunda ronda, Crítico 1.
- **Dónde en el kit**: no localizado; el hook del repo ya bloquea los heredocs que escriben ficheros, no los scripts que reemplazan texto.
- **Por qué el kit no lo evitó**: ninguna regla dice cómo editar un artefacto grande; el script se usó porque el `Edit` necesitaba muchos reemplazos.
- **Coste**: una ronda de revisión con un Crítico y ~5 min de restauración; respaldo: spec, «Hallazgos de la review».
- **Propuesta**: que el hook de comandos avise de `.replace(` con un segundo argumento de cadena en scripts que escriben `.docs/`, o que la guía de edición pida `split/join` o una función de reemplazo.
- **Verificada**: sí — reproducido en la sesión (Node 26, Git Bash).
- **Criterio de aceptación**: GIVEN un script que escribe `spec.md` con `t.replace(a, '… $` …')` WHEN se lanza THEN el hook avisa o lo bloquea.

## Lo que hice por iniciativa propia

- Smoke de la validación en campo con un script de Node contra la CLI construida (`dist/`), una fila por THEN, en vez de solo la suite: cazó que `using-sdd` inyectado también cita «actualízame al kit», así que el THEN se comprueba sobre el aviso, no sobre todo el contexto.
- A petición del dev-lead, contraste de la solución con la sesión del proyecto de templates antes del merge: confirmó la regla de detección contra sus marcas reales en 2.x y 3.0.x, y destapó que su skill puente envuelve `sdd-init`; el dev-lead decidió que ese enrutado lo resuelve el proyecto en su `CLAUDE.md`.

## Funcionó, no tocar

- La segunda ronda de review de spec, obligatoria tras un Crítico aceptado: además del fichero corrupto, sacó que una init terminada con un «no sé» deja la marca y bloquearía la migración, que acabó en la línea de `--finish`.
- El RED de batería antes de tocar la CLI (`t1`): el sujeto migró de 3.0.2 a 3.0.3 sin pasar por `sdd-init`, y el GREEN entró por el aviso.
- La parada del Art. I al superar la previsión de coste: dos decisiones del dev-lead resueltas con una palabra cada una.

## Menores

- La regla `text:` de una batería sobre una ruta falló por el backtick de cierre que el sujeto pone en Markdown (`` `.claude/settings.json`: actualizado ``); se arregló con `\x60?` — `tests/headless/battery.mjs` (rúbrica), no localizado como regla.
- `molds.test.ts` exige que ningún molde quede por debajo de la última migración; un molde que lo hace a propósito va en `MIGRATING`, y solo lo dice el propio test — `cli/test/kit/headless/molds.test.ts`.
- Un test de `session-start.test.ts` comprueba que el contexto no contiene «actualízame al kit»; pasa porque el `using-sdd` de la fixture no lo cita, y el real sí — `cli/test/fixtures/hook/plugin/`.
- La re-revisión dejó tres Minors sin arreglar tras la re-revisión única: BOM escrito literal (invisible) en `cli/bin/session-start.js` y en un dato del test; el test del BOM no ejercita su `replace`; `readJsonVersion` del hook no tolera un `sdd-kit.json` ilegible (previo) — `cli/bin/session-start.js`.
- El paso 1 de `sdd-upgrade` solo nombra `init en curso: sigue con sdd-init`; el error nuevo `template sin inicializar: sigue con sdd-init` no tiene sujeto que lo mida, porque el aviso de inicio llega antes — `skills/sdd-upgrade/SKILL.md` paso 1.
