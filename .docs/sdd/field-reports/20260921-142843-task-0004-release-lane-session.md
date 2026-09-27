---
kit_version: 1.1.0
superpowers_version: 6.3.0
lane: task
id: 20260921-142843-task-0004-release-lane-session
task: 0004
mode: full
date: 2026-09-21
---

# Ticket para el kit — task 0004: cierre con validación diferida, workspace de superpowers sin avisar y base que se mueve durante el cierre

## Contexto

- **Carril y modo**: task full.
- **Skills del kit usadas**: `sdd-start-task`, `sdd-end-task`, `add-to-changelog` y `sdd-feedback`. Las skills editadas por la task fueron `sdd-end-release` y `sdd-start-release`. De superpowers: `brainstorming`, `writing-plans`, `subagent-driven-development` y `finishing-a-development-branch`.
- **Proyecto**: el propio kit, un repo de skills en markdown con suite Pester y hook pre-commit de suite verde. Un dev-lead, con worktrees gestionados por una herramienta externa y el repo principal bare.
- **Modelo del hilo**: Opus 5.
- **Modelos de los subagentes**:
  - Revisor de spec, implementador, revisor de task y re-revisor: Sonnet. El effort no se puede declarar en el tool.
  - 24 sujetos headless: Sonnet.
- **Coste en reloj**: ~3,7 h de spec, plan e implementación, más ~0,7 h de cierre, aproximado por las marcas de los commits.
- **Coste en tokens**: ~532k en cuatro despachos de subagente, más 22,10 $ en sujetos headless. Hilo principal: no medido.

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El cierre no tiene salida para una validación que el usuario difiere a sabiendas

- **Qué pasó**: la task cambia un proceso, no una app. El dev-lead dijo que no podía probarlo fuera del uso diario y eligió validación diferida: «validacion diferida, es que estas cosas las podre probar en el dia a dia». Es la tercera task de la misma release que se cierra así (antes, las tasks 0001 y 0011).
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 0 y `skills/sdd-start-task/SKILL.md` paso 7. Solo contemplan validar o esperar.
- **Por qué el kit no lo evitó**: el kit define la validación como «el usuario dice qué probó y que funciona». No prevé que el usuario decida, con conocimiento, que la prueba llegará con el uso. El agente tuvo que presentar una alternativa de lectura, recibir la decisión y registrarla como anomalía por analogía con tasks anteriores.
- **Coste**: dos turnos de conversación y un walkthrough con la anomalía escrita a mano. Tres tasks de la misma release con tres redacciones distintas del mismo estado.
- **Propuesta**: es el alcance de la task 0008 («validación diferida» con condición de validez y símbolo en el roadmap). Este ticket aporta el caso de las tasks de proceso o arquitectura, donde diferir es la norma y no la excepción.
- **Criterio de aceptación**:
  - GIVEN una task terminada con revisión limpia y un usuario que responde «validación diferida» con un motivo
  - WHEN el agente cierra con `sdd-end-task`
  - THEN el walkthrough y el roadmap registran el estado con una forma fija (frase literal, fecha, disparador de la validación), sin que el agente la invente por analogía

### 2. `subagent-driven-development` crea `.superpowers/` en el repo y el kit no lo anuncia

- **Qué pasó**: al ver la carpeta en el mensaje de cierre, el dev-lead reaccionó con «uy como que generaste un .superpowers!?!?!?». Es el workspace del script `sdd-workspace` (ledger, brief, informes, diffs de revisión), ignorado en git por su propio `.gitignore`. Se llamaba `plan/` porque todo plan del kit se llama `plan.md`.
- **Dónde en el kit**: `skills/sdd-start-task/SKILL.md` paso 6 y `skills/sdd-start-task/references/overrides-superpowers.md`. La tabla de overrides nombra `docs/superpowers/` y el worktree, pero no este workspace.
- **Por qué el kit no lo evitó**: la regla de oro («nunca crear `docs/superpowers/`») se lee como «superpowers no deja nada en el repo», y el kit no dice que su modo por defecto sí deja algo ni cuándo se borra.
- **Coste**: un turno de alarma y de explicación. El borrado dependió de que el agente recordara la instrucción de `subagent-driven-development`.
- **Propuesta**: una fila en `overrides-superpowers.md` con la ruta del workspace (`.superpowers/sdd/<basename del plan>/`), qué contiene, que va ignorado en git y que el cierre lo borra tras volcar los rulings al walkthrough. El choque de nombres por `plan.md` sigue en la task 0009.
- **Criterio de aceptación**:
  - GIVEN una task ejecutada con `subagent-driven-development`
  - WHEN el agente presenta el cierre
  - THEN el usuario ya sabe, por el propio flujo, que existe `.superpowers/`, que no se versiona y que se borra al cerrar
  - AND tras `sdd-end-task` la carpeta no existe

### 3. La base puede avanzar entre los docs de cierre y el merge

- **Qué pasó**: el agente integró `develop` antes de escribir los docs de cierre (regla 4 del roadmap del kit). Mientras los escribía, otra task se fusionó en `develop`. Al ir a hacer el merge, `develop` ya no era ancestro de la rama: hubo que integrar otra vez, resolver dos conflictos (roadmap y estimation-log) y adaptar dos ficheros a las reglas nuevas que traía la otra task.
- **Dónde en el kit**: `skills/sdd-end-task/SKILL.md` paso 10. La comprobación de la base existe solo en el roadmap de este repo, no en la skill.
- **Por qué el kit no lo evitó**: la regla vive en un documento del proyecto, no en la skill, y la comprueba una vez, antes de los docs. El paso 10 delega en `finishing-a-development-branch`, que no mira si la base avanzó.
- **Coste**: ~15 min, dos conflictos y un segundo pase de la suite. Sin la comprobación manual habría salido un merge sobre una base vieja.
- **Propuesta**: es parte de la task 0009 («integrar la base antes de escribir los docs de cierre y repetir gates»). Este caso añade que la comprobación se repite justo antes del merge, no solo antes de los docs.
- **Criterio de aceptación**:
  - GIVEN una rama cuyos docs de cierre ya están escritos y una base que ha recibido otro merge después
  - WHEN el agente llega al paso 10
  - THEN detecta que la base no es ancestro de la rama, integra y repite la suite antes de fusionar

### 4. La skill instalada va por detrás de la del repo cuando el kit se usa sobre sí mismo

- **Qué pasó**: el `sdd-end-task` cargado por el harness era el de la versión publicada 1.1.0, sin el paso 11 (oferta de `sdd-feedback`). El agente lo detectó comparando a mano con `skills/sdd-end-task/SKILL.md` del worktree. `sdd-feedback` tampoco aparece en el listado de skills del harness.
- **Dónde en el kit**: no se localiza en una skill. Es del flujo de dogfooding que declara el `CLAUDE.md` del repo (Art. VII).
- **Por qué el kit no lo evitó**: Art. VII obliga a usar el propio flujo, pero nada dice qué versión de las skills se usa cuando el repo va por delante de la publicada.
- **Coste**: bajo en esta sesión, porque el agente comparó. Sin esa comparación, el cierre habría omitido el paso 11.
- **Propuesta**: una línea en el `CLAUDE.md` del repo o en `tech-stack.md`: al hacer dogfooding, leer la skill del working tree cuando difiera de la instalada (`git diff` contra la cache del plugin).
- **Criterio de aceptación**:
  - GIVEN un repo del kit con una skill editada respecto a la versión instalada
  - WHEN el agente ejecuta esa skill como parte del flujo
  - THEN sigue la versión del working tree y lo dice

## Lo que hice por iniciativa propia

- **Añadir un escenario al RED a mitad de campaña (E5)** cuando el guion inicial no reproducía el orden del caso de campo. Funcionó: el fallo apareció 2/2 y justificó la guía principal de la task.
- **Rehacer ese escenario en los dos brazos sobre un molde sin ruido (E5-bis)** cuando el molde con código stub tapó la conducta en el GREEN. Funcionó: la comparación limpia dio 2/2 frente a 2/2. Es candidato a regla del método de test y ya está en el `tech-stack.md` del kit.
- **Acotar la capacidad a lo verificado al fusionar el delta**: dos matices que ningún escenario midió no entraron. Coincide con la regla que la task 0003 estaba escribiendo en paralelo.
- **Merge `--no-ff` a una rama que no está en ningún worktree**, con un worktree temporal que después se borró. En repos bare con un worktree por rama, el paso 10 no dice cómo hacerlo.

## Funcionó, no tocar

- La review de spec con lente dominio cazó tres Críticos que dejaban al agente concederse el atajo del gate, entre ellos escribir él mismo el campo que lo activa.
- El recorte por el RED (Art. I): cinco de los diez puntos pedidos ya los cumplía el baseline y no se escribió guía para ellos. El dev-lead reaprobó el alcance en un turno.
- Tests deterministas del hilo aparcados fuera de `tests/` y movidos con `git mv` por el implementador: sin `--no-verify` y con el contrato intacto.
- Una sola ronda de arreglos en `subagent-driven-development`, con re-revisión acotada al diff del fix.

## Errores míos, no huecos del kit

- Un `Write` con una ruta equivocada creó un fichero suelto fuera del repo. Se detectó al instante y se borró.
- El commit de merge a `develop` salió sin cuerpo (el Art. VI lo exige). Se corrigió con un amend antes de publicar nada.
- Dos comandos de PowerShell con here-strings chocaron con un hook de la máquina, que los tomó por borrados. La salida conocida es escribir con la herramienta de edición.
