---
kit_version: 1.1.0 (working tree de feature/0012, sobre develop con 0001–0004, 0008, 0011 y 0014)
superpowers_version: 6.3.0
lane: task
id: 20260922-113121-task-0012-init-interview-session
task: 0012
mode: full
date: 2026-09-22
---

# Ticket para el kit — task 0012: medir antes de escribir recortó la task a la mitad, pero la campaña costó 10× lo previsto

## Contexto

- Carril y modo: task full, perfil `delegate`
- Skills del kit usadas: `sdd-start-task` (primera pregunta con partición, pasos 2–7), `sdd-end-task`, `add-to-changelog` (su contrato, aplicado a mano), `sdd-feedback`; de superpowers, `brainstorming` y `writing-plans`
- Proyecto: el propio kit (repo de skills en Markdown y scripts PowerShell, un dev-lead)
- Modelo del hilo: Opus 5
- Modelos de los subagentes: un revisor final Sonnet; sujetos headless Sonnet con simulador Haiku
- Coste en reloj: ~3 h (spec y plan con RED ~0,8 h, implementación con GREEN y cierre ~2,1 h)
- Coste en tokens: revisor final ~127k; sujetos headless 55,9 $ (RED 29,8 $, GREEN 26,1 $)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La regla «reproducir cada frente antes de la spec» no tiene presupuesto ni escala de coste

- **Qué pasó**: la regla pide dos sujetos por frente de conducta. En una skill de entrevista eso significa entrevistas simuladas enteras. Se presupuestaron 5–7 $ con el dato del tech-stack (0,4–0,7 $ por sujeto de 12–16 turnos) y costaron 29,8 $; el GREEN, otros 26,1 $. El resultado sí compensó en contenido: de nueve frentes, cinco pasaban sin tocar nada y no se escribió guía para ellos.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Fixtures y baselines» (regla «Un baseline limpio no reproduce…») y «Sujetos headless» («Entrevista simulada», cuyo coste por sujeto estaba desfasado; ya corregido en esta task).
- **Por qué el kit no lo evitó**: la regla fija cuántos sujetos, pero no cuánto cuestan ni cuándo basta un escenario más barato. El dato de coste venía de una campaña antigua y nadie lo revalidó.
- **Coste**: ~50 $ por encima de lo estimado, y el dev-lead aprobó la campaña con la cifra baja.
- **Propuesta**: que la regla pida estimar la campaña con el coste por turno vigente (~0,4 $ por turno y sujeto con `--resume`) y que prefiera, cuando el frente es una sola pregunta o un solo paso, un escenario de un turno situado en ese punto («la entrevista va por la pregunta X; lo anterior ya está respondido: …»). En esta task, un escenario así midió el arreglo de la pregunta de principios por 0,7 $ en vez de ~13 $.
- **Criterio de aceptación**: GIVEN una task que edita una skill de entrevista y trae tres frentes de una sola pregunta, WHEN el agente planifica el RED previo, THEN presenta una estimación a ~0,4 $/turno y usa escenarios situados para esos frentes, con un coste total por debajo de un tercio de la entrevista completa.

### 2. El driver de entrevista simulada no estaba versionado

- **Qué pasó**: el tech-stack cita `entrevista-driver.py` (T17), pero no existía en el repo; se evaporó con el scratchpad. Hubo que reescribir lanzador, personas y moldes antes de medir nada.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Sujetos headless» → «Entrevista simulada».
- **Por qué el kit no lo evitó**: la regla «el molde y el lanzador se versionan en la carpeta de la spec» es posterior a T17, y la cita del tech-stack no apunta a una ruta.
- **Coste**: ~20 min de hilo reescribiendo `driver.py`, `cont.py` y dos personas.
- **Propuesta**: el tech-stack ya apunta a `red/driver.py` de la carpeta de la 0012. Valorar moverlo a una ruta estable del repo (p. ej. `tests/tools/`) si otra task lo reutiliza.
- **Criterio de aceptación**: GIVEN la próxima task que mida una init o una entrevista, WHEN prepara su RED, THEN reutiliza el lanzador sin reescribirlo.

### 3. `sdd-feedback` dice `kit-feedback/`, pero en el repo del kit los tickets viven en `field-reports/`

- **Qué pasó**: el paso 4 de `sdd-feedback` guarda en `.docs/sdd/kit-feedback/`. En este repo, los tickets de las tasks 0008 y 0014 se guardaron en `field-reports/`, y el `CLAUDE.md` describe esa carpeta como el sitio de los tickets. Seguí el precedente del repo.
- **Dónde en el kit**: `skills/sdd-feedback/SKILL.md` paso 4; `CLAUDE.md` del repo (índice de `field-reports/`).
- **Por qué el kit no lo evitó**: la skill está escrita para un proyecto consumidor; el repo del kit es a la vez consumidor y destino del ticket, y ninguna regla lo distingue.
- **Coste**: bajo, una decisión sin respaldo.
- **Propuesta**: una línea en el `CLAUDE.md` del repo: «en este repo, el ticket de una task del kit va directo a `field-reports/`».
- **Criterio de aceptación**: GIVEN el cierre de una task del propio kit, WHEN se genera el ticket, THEN nace en `field-reports/` sin que el agente tenga que decidirlo.

### 4. El merge a `develop` en el repo bare se improvisa con un worktree temporal

- **Qué pasó**: `develop` no está en ningún worktree. Para el `--no-ff` del paso 10 creé un worktree temporal, fusioné, pasé la suite y lo borré. Confirma la fila de la task 0009, sin nada nuevo.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 10.
- **Por qué el kit no lo evitó**: pendiente en la 0009.
- **Coste**: bajo; un intento fallido (ver «Errores míos»).
- **Propuesta**: la de la 0009.
- **Criterio de aceptación**: el de la 0009.

## Lo que hice por iniciativa propia

- **Continuar sesiones cortadas por el tope de turnos** (`cont.py`, con `--resume` y la persona) en vez de relanzar: E1 llegó a los pasos 3–5, que eran justo los que el ticket de campo preveía rotos, por 3,4 $ más. Funcionó.
- **Un escenario de un turno situado en la pregunta que falló** (E5), en los dos brazos, para medir un arreglo hecho durante el GREEN. Funcionó: 0/2 → 2/2 por 0,7 $.
- **Remoto con URL de host real** al ver que un remoto bare local daba al sujeto una excusa para empujar él mismo. Ya está en el tech-stack.

## Funcionó, no tocar

- **La primera pregunta con propuesta de partición**: la fila tenía seis frentes y la visión 1.2.0. El dev-lead eligió partir en tres y la task quedó en un tamaño manejable.
- **Medir antes de escribir la spec**: recortó cinco de nueve frentes. La skill cambió en cuatro puntos, no en diez, y la marca del template no necesitó un formato fijado por el kit. Es la palanca de «menos ceremonia» más clara de la sesión.
- **El perfil `delegate`**: el plan sin gate y la ejecución sin paradas cerraron la task en una sesión, con dos preguntas al dev-lead además de la spec y la validación.
- **La validación diferida**: el dev-lead dijo que el kit solo se valida con el uso diario, y la forma 🧪 lo recogió sin forzar un «validado» inventado.
- **Una sola revisión final Sonnet** para una task ejecutada en línea: 127k tokens, cero Critical e Important, dos Minor útiles.

## Errores míos, no huecos del kit

- Pedí aprobación para la campaña con jerga («RED previo», «sujetos headless», «simulador Haiku») a un dev-lead que no la conoce, y me contestó que no entendía nada. El `CLAUDE.md` del repo ya dice que se expliquen los términos antes de pedir una decisión que dependa de ellos.
- Mi primera versión de la lista de la entrevista ponía «commits» como ejemplo en la pregunta de principios, contradiciendo la línea de forma de la misma skill. Lo cazó el GREEN.
- El primer intento de merge pasaba el mensaje por `-F -` con un heredoc y filtraba la salida con `grep`: falló sin que se viera. Lo repetí con el mensaje en un fichero.
