---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261026-152603-patch-0219-e2e-smoke-stress-out-of-suite
task: 0219
mode:
date: 2026-10-26
---

# Ticket para el kit — patch 0219: el prompt de arranque de la fila nueva salió dos veces mal, y el gate se repitió cuatro veces por rojos intermitentes

## Contexto

- Carril y modo: patch (petición cerrada del dev-lead, con RED primero)
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch` (leída, no invocada), `sdd-archive`, `add-to-changelog`, `sdd-roadmap`, `sdd-feedback`; las skills del working tree
- Proyecto: el propio kit (skills en Markdown, CLI en TypeScript, tests Pester y Vitest), Windows 11
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica; 5 sujetos headless Sonnet con `tests/headless/run.sh`
- Coste en reloj: 1,71 h de esfuerzo frente a 1,5 h estimadas post hoc; reloj de la sesión 4,17 h, con 147 min de espera al dev-lead
- Coste en tokens: 9,63 $ del hilo a la hora del cierre, más 2,22 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El prompt de arranque de la fila nueva se dio sin la plantilla, y después sin nombrar el patch del que sale su evidencia

- **Qué pasó**: al cerrar el patch, el dev-lead pidió apuntar una fila nueva (0223, el gate del kit) con las medidas que había sacado este patch. El primer prompt de arranque se escribió sin abrir `launch-prompt-template.md`: copiaba los tres requisitos de la fila, sin la línea `Base:` ni la de `Carril:`. El dev-lead: «con ese prompt no le das demasiada info al 223 no?». El segundo, ya con la plantilla, citaba «Requisitos en la fila 0223 del roadmap» y no nombraba el patch 0219, que es el que midió el gate y del que salen las conclusiones. El dev-lead: «has fallado claramente con el prompt, y bueno sigues fallando… el prompt no habla nada de la 219 que estudió esto». Además, las medidas por fichero del gate (`HeadlessLauncher.Tests.ps1` 600 s y otras) solo estaban en los logs del scratchpad, y se borraron al limpiar los temporales antes de dar el prompt: solo quedan las cifras copiadas en la fila.
- **Fuente**: la conversación de la sesión; `skills/sdd-templates/templates/launch-prompt-template.md:9` («Los requisitos, por ruta y sección: … sin copiarlos») y su bloque de prompt, líneas 32-39, que no tiene hueco para la evidencia; `skills/sdd-roadmap/SKILL.md` paso 7 («traced from launch-prompt-template.md»); la fila 0223 de `.docs/sdd/roadmap.md` («Medido en el gate del patch 0219», sin enlace)
- **Dónde en el kit**: `skills/sdd-templates/templates/launch-prompt-template.md`, bloque del prompt; `skills/sdd-roadmap/SKILL.md` «Something concrete» (una fila nueva que nace de las medidas de otro cambio no enlaza su artefacto)
- **Por qué el kit no lo evitó**: el primer fallo, la regla existía (el paso 7 de `sdd-roadmap` manda calcar la plantilla) y no la apliqué: di el prompt de memoria dentro del mensaje final de `sdd-archive`. El segundo, la plantilla no tiene hueco para la evidencia: «Requisitos en <ruta>» lleva a la fila, y la fila no enlazaba el `patch.md` que la midió. Es un elemento omitido (Art. II): pide un hueco, no un recordatorio.
- **Coste**: dos vueltas del dev-lead y su enfado; las medidas por fichero, perdidas (sin respaldo en un artefacto)
- **Propuesta**: (a) en `launch-prompt-template.md`, una línea obligatoria `Evidencia: <artefacto que lo midió o lo decidió, ruta y sección> | ninguna` después de «Requisitos»; (b) en `sdd-roadmap`, «Something concrete»: una fila que nace de las medidas o conclusiones de otro cambio lleva el enlace a su artefacto (`patch.md` §N, `walkthrough.md`), y las cifras que cita se guardan antes en ese artefacto, no solo en el scratchpad.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un cierre de patch cuyo gate midió 40 min, y el dev-lead que pide «apunta la fila para bajar el gate» WHEN el agente escribe la fila y da su prompt THEN la fila enlaza el `patch.md` con la sección de las medidas, el prompt lleva `Evidencia:` con esa ruta, y las cifras por fichero están en el `patch.md` commiteado

### 2. Un gate de ~40 min con rojos intermitentes, repetido cuatro veces, para un cambio de una frase en un `.md`

- **Qué pasó**: el cambio fue una frase de `writing-e2e.md` y dos topes de `WordBudget.Tests.ps1`. El gate de cierre (`moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min`) corrió cuatro veces (1111 s, 1171 s, 966 s y 407 s) y nunca salió entero en verde: cada pasada, un rojo distinto en un test de git o de procesos, que pasa 3 de 3 al repetirlo solo. `kit:test` gasta ~600 de sus ~750 s en `HeadlessLauncher.Tests.ps1`, y `cli:test-min` repite toda la CLI que ya corren `cli:test` y `cli:test-slow`. El dev-lead: «tardamos más en pasar los test que en hacer el trabajo». Contrasté los rojos solo en la rama, no en un worktree de la base; se fusionó por decisión del dev-lead («fusiona y apunta la fila»).
- **Fuente**: `patch.md` del patch 0219, §4 caso 5 (las cuatro pasadas, con duración y error); la fila 0223 de `.docs/sdd/roadmap.md`; `cli/moon.yml` (`test-min` corre `vitest run` sin excluir `slow.test`)
- **Dónde en el kit**: `.docs/sdd/tech-stack.md` «Gate de cierre» y `moon.yml`/`cli/moon.yml` (el gate del repo, no una skill); `skills/sdd-archive/references/merge-recipe.md` (el contraste de un rojo, ya en la fila 0220)
- **Por qué el kit no lo evitó**: el gate corre todas las suites sin mirar qué toca el cambio, y el contraste «sin la rama» de `sdd-archive` paso 6 no dice qué hacer con un rojo que no se repite (pendiente en la 0220)
- **Coste**: ~60 min de reloj de gate, y una parada del dev-lead para decidir el merge sobre rojo
- **Propuesta**: la fila 0223 (lanzador de sujetos solo con `tests/headless/`, solo `cli:test-min` en el gate, sin suites de la CLI si no cambia `cli/`) y la 0220 (salida «No se repite» en el contraste)
- **Verificada**: sí — cifras de los cuatro logs del gate, recogidas en `patch.md` §4
- **Criterio de aceptación**: GIVEN un cambio que solo toca `skills/**/*.md` WHEN corre el gate de cierre THEN no corre `HeadlessLauncher.Tests.ps1`, ni `Battery.Tests.ps1`, ni las suites de la CLI, y tarda menos de 5 min

### 3. `run.sh` manda poner el RED de un patch en el scratchpad, y `lib.sh` rechaza esa ruta por larga

- **Qué pasó**: con `SPEC_DIR` en el scratchpad de la sesión, como dice la cabecera de `run.sh`, el ensayo en seco abortó: `[s1-1] ruta de 156 caracteres (máximo 139): .temp/claude/<…>/scratchpad/camp/red/out/s1-1.state.txt`. Lo resolví con `SPEC_DIR` en `.temp/p0219/`.
- **Fuente**: `tests/headless/run.sh:16` («El RED de un patch se lanza con SPEC_DIR en el scratchpad hasta que reproduce»); `tests/headless/lib.sh:33` (`MAX_PATH=140`) y `:333`; comando `DRY_RUN=1 … bash tests/headless/run.sh` en Git Bash
- **Dónde en el kit**: `tests/headless/run.sh` (cabecera) y `tests/headless/lib.sh` (`subject_keep`)
- **Por qué el kit no lo evitó**: el scratchpad de Claude Code ya mide ~110 caracteres relativo al repo; con eso la regla de la cabecera choca con el tope de `PathLength.Tests.ps1`
- **Coste**: ~5 min
- **Propuesta**: la cabecera de `run.sh` dice `.temp/<id>/` del repo para el RED de un patch, o `subject_keep` mide la ruta solo cuando `SPEC_DIR` está bajo `.docs/`
- **Verificada**: sí — reproducido con el ensayo en seco en Git Bash
- **Criterio de aceptación**: GIVEN `SPEC_DIR` en el scratchpad de la sesión WHEN se lanza `DRY_RUN=1 bash tests/headless/run.sh` THEN el ensayo no aborta por la longitud de ruta

### 4. La estimación del patch no se dio al abrirlo

- **Qué pasó**: el carril venía en la petición, así que no hubo pregunta de carril, y no di la estimación en horas. Se escribió en `patch.md` como «1,5 h (post hoc)», y no calibra.
- **Fuente**: `skills/sdd-propose/SKILL.md` paso 2 («without a question … you still hand it over»); `patch.md` del patch 0219, §5
- **Dónde en el kit**: `skills/sdd-propose/SKILL.md` paso 2, ceremonia del patch
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: está en la rama de la pregunta del carril, y con el carril dado salté esa rama entera
- **Coste**: una fila del log de estimación que no calibra
- **Propuesta**: que el paso 3 de `sdd-start-patch`, al crear `patch.md`, falle si §5 no tiene `- Estimación:` antes del commit del fix (un hueco obligatorio, Art. II)
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un patch con el carril en la petición y `estimation.md` WHEN se abre THEN el primer mensaje tras clasificar lleva la estimación en horas, y `patch.md` §5 la tiene antes del fix

## Lo que hice por iniciativa propia

- Lancé un segundo sujeto del escenario que salió limpio (n = 2) antes de dar por bueno el baseline sin fallo; confirmó 0 de 2, y la línea del smoke no se escribió.
- Arreglé el molde heredado de la 0180 para que la app arrancase de verdad (Playwright con los navegadores instalados, JSX en Vite y la ruta de acceso de desarrollo), y lo comprobé con un script antes de lanzar sujetos.
- Tras la base integrada, corrí solo las comprobaciones del pre-commit (37 s) en lugar del gate completo que pide el paso 6 de `sdd-archive`, porque la base no tocaba lo de la rama y el dev-lead ya había decidido el merge; queda dicho en el cierre.

## Funcionó, no tocar

- El RED antes del texto: separó un escenario que falla (1/1) de otro que no (0/2), y evitó escribir una línea sin baseline.
- `run.sh` con techo de sujetos y coste, y el ensayo en seco, que cazó la longitud de ruta antes de gastar.
- `WordBudget.Tests.ps1` paró una frase sin decisión del dev-lead.

## Menores

- `s1-1` llegó al tope de `SUBJECT_TIMEOUT=1500` y dejó un `vite` vivo en 5174 que hubo que parar por PID — `tests/headless/lib.sh` (`subject_cleanup`)
- La copia del kit para el GREEN, con `tar` en vez de `git archive`, falló por el orden de `--exclude` — `tests/headless/run.sh` (cabecera: `git archive <commit> skills .claude-plugin`)
