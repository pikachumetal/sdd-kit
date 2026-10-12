---
id: 20261012-104247-feature-0166-worktrees-and-parallel-agents
feature: 0166
parent: 0147
proposal: 0131
title: sdd-worktrees y sdd-parallel-agents — forks de using-git-worktrees y dispatching-parallel-agents
mode: full
profile: delegate
status: approved
created: 2026-10-12
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-12
---

# Spec — `sdd-worktrees` y `sdd-parallel-agents`

🦆 Hoy, para preparar el sitio aislado donde se implementa y para lanzar varios agentes a la vez, el kit depende de dos skills de superpowers. Con esta feature pasan a ser del kit, copiadas enteras y cambiadas solo donde el kit trabaja distinto. Lo que vas a notar: al empezar a implementar, el agente detecta el worktree que ya abrió Orca, levanta el entorno si el proyecto lo declara y pasa los tests del proyecto antes de tocar nada. Cuando la spec pide dos revisores, salen a la vez con su modelo y sin pasar del tope de agentes del proyecto. Además, el agente deja de tratar como un detalle suyo dos cambios que son de la spec: tocar algo que la spec deja fuera y añadir una regla en una ronda de arreglo; en los dos casos para y te pregunta antes del commit.

## Capacidades

- Modificadas: `control-profiles` — el desvío nombra su contraejemplo: la guía de una ronda de REFACTOR o de fix que añade o cambia un THEN (el de «No entra» salió del delta: enmienda del 2026-10-12).
- Modificadas: `feature-flow` — el worktree de la implementación lo prepara `sdd-worktrees`, y dos revisores de spec se despachan con `sdd-parallel-agents`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (el desvío de control-profiles), dependencia externa (texto de superpowers 7.0.0), área no explorada (molde nuevo de k2) · tamaño: ~350 líneas en ~20 ficheros, dos tercios texto de superpowers copiado
- Mínimo razonable: ninguna — sin revisor nadie más relee si la tabla del anexo deja una regla de la fuente sin destino ni motivo; lo cubren la pasada de coherencia y los humos w1 y a1
```

1. **Dos skills, en inglés (Art. III)**: `skills/sdd-worktrees/` y `skills/sdd-parallel-agents/`, cada una con su `NOTICE`. Su `description` dice que las invoca otra skill del kit y que no son una entrada. Son skills y no auxiliares de `sdd-implement` porque las va a usar más de una skill: `sdd-parallel-agents` la usa ya `review-spec.md` y la usará la 0148; `sdd-worktrees`, `sdd-implement` y, cuando lo copie el kit, el cierre.
2. **Fork fiel** (Art. IX, [ADR 0013](../../decisions/0013-fork-keeps-source-text.md)): texto entero de los dos `SKILL.md` de superpowers 7.0.0. La fuente no trae auxiliares; los dos ficheros de GitHub, tag `v7.0.0`, son idénticos a los de la caché, comprobado el 2026-10-12. No se quita nada, así que no hace falta A/B de no-regresión. El anexo dice, sección por sección, si se conserva o qué motivo la cambia.
3. **`sdd-worktrees`: lo que cambia** (sección 1 del diseño, «si», 2026-10-12):
   - **Step 2, el kit lo amplía**: si existe `.docs/sdd/environments.md`, `env:setup` tras instalar las dependencias. Cada encargo de implementador dice dónde está el marcador `.sdd-env.json`. Sale del paso 1 de `sdd-implement`, que queda en «invoca `sdd-worktrees`».
   - **Step 3, el kit trabaja distinto en el comando**: la baseline ejecuta el gate de cierre del proyecto, en este orden: `operations.md` §Testing `Gate de cierre`, `tech-stack.md` §Testing, la constitution. Sin ninguno, lo dice y pregunta qué ejecutar; nunca inventa un comando.
   - **«Never implement on `main` without the user's explicit consent»** pasa de `sdd-implement` al Step 0.
   - El resto se conserva: el Step 0 con la guarda de submódulos, la pregunta de consentimiento, la herramienta nativa primero, el fallback de git con `check-ignore`, el informe, la Quick Reference y las racionalizaciones.
   - Fuera: borrar el worktree (`env:clean`, `finishing-a-development-branch`), que es del cierre, y `operations.md` §Entornos, que lo trae la 0156.
4. **`sdd-parallel-agents`: lo que cambia** (sección 2, «ok», 2026-10-12):
   - **El kit lo amplía, con el tope**: a la vez, como mucho `control.maxParallelAgents` de `sdd-kit.json` (3 si falta). Con más dominios que el tope, se despacha por tandas.
   - **El kit lo amplía, con el modelo**: cada despacho lleva `model` y `subagent_type: sdd-kit:effort-<nivel>` (Art. IV), en lugar del `general-purpose` a secas de la fuente.
   - **El kit trabaja distinto**: dos tasks del plan independientes no se reparten aquí. Las ejecuta `sdd-implement`, una detrás de otra; en la 3.0.0 no hay tasks en paralelo.
   - El resto se conserva: Overview, el grafo de When to Use, The Pattern, Agent Prompt Structure, Common Mistakes, When NOT to Use, el ejemplo real y Verification.
5. **Llamador de `sdd-parallel-agents`**: el paso de `review-spec.md` que despacha dos revisores dice «despáchalos con `sdd-parallel-agents`». Así no nace huérfana, y la 0148 engancha la revisión en tres ejes en el mismo sitio. Hoy el kit no invoca `superpowers:dispatching-parallel-agents` en ningún fichero de `skills/` (grep del 2026-10-12): para ella no hay invocación que quitar.
6. **Los dos desvíos de `sdd-implement`** (sección 3, «ok», 2026-10-12), en «Deviations and rulings»:
   - en el punto del ruling: «Touching what the spec leaves in «No entra» is a deviation, not a ruling, even if it's one sentence»;
   - en el punto del desvío: «A REFACTOR or fix round that writes guidance or behavior the spec doesn't have is a deviation when it adds or changes a THEN or an AND: stop before committing it».
   - Lo generalizo más allá del REFACTOR de las campañas de skills (Art. I): en un proyecto de código el caso es el mismo, y la forma del texto también.
   - Cada texto entra solo si su RED falla (Art. I). Si sale limpio, va a deuda «Esperar 2.º caso»: los dos tickets son de la misma mano.
7. **Margen de palabras** (ticket de la 0165 §3):
   - `sdd-implement`: `SKILL.md` en 5.418 de 5.500. Los contraejemplos suman ~60 palabras y el paso 1 adelgaza ~30, así que cabe sin subir su tope.
   - `review-spec.md` suma ~8 palabras, dentro del total de `sdd-start-feature`.
   - `mission.md` y `architecture.md` solo cambian «superpowers» por la skill del kit.
8. **Topes nuevos** (Art. I, los decide el dev-lead): se miden al terminar y se redondean a la centena de arriba. Previsión: `sdd-worktrees` ~1.200 y `sdd-parallel-agents` ~1.000, `SKILL.md` y total iguales, porque no hay auxiliares. El tope `Kit` sube lo que midan las dos. Si una pasa de 1.400, paro y te lo enseño.
9. **Repaso de coherencia** (ticket de la 0165 §2): cada resultado del grep, con el paso que lo rodea leído, está en el Scope.
   - El grep literal de `superpowers:using-git-worktrees` solo da `skills/sdd-implement/SKILL.md:31`.
   - El de `superpowers:dispatching-parallel-agents` no da nada.
   - Del nombre sin prefijo y de la prosa «el worktree lo crea superpowers»:
     - `overrides-superpowers.md:7`;
     - `environments-template.md:5` y `:52`;
     - `sdd-init-greenfield` (pregunta 18);
     - `README.md:179`;
     - `mission.md:58`;
     - `architecture.md:52`.
10. **Lo que entra y lo que sale** (Art. I):
    - Entran dos skills de ~2.200 palabras entre las dos, más ~60 en `sdd-implement`.
    - Sale la dependencia de `using-git-worktrees`.
    - Sale la fila `using-git-worktrees` de `overrides-superpowers.md`: el override desaparece porque el texto ya es del kit.
    - El paso 1 de `sdd-implement` adelgaza.
11. **La fila 0152** suma una frase: `mission.md`, «Cómo se trabaja con el kit», promete «subagentes: un máximo de tres en paralelo, cada uno en su worktree… en tasks que el plan clasifica como independientes». Eso contradice «sin paralelo de tasks en la 3.0.0». Lo arregla la coherencia de documentos de la 0152, no esta feature.
12. **Capacidades**: no nace ninguna. El delta va a `control-profiles` y `feature-flow`.
13. **Previsión de coste** (Art. I). Sujetos Sonnet headless. RED con el kit de `develop` y superpowers 7.0.0.

    | Paso nuevo o cambiado | Escenario | RED | GREEN | ~$ |
    | --- | --- | --- | --- | --- |
    | Contraejemplo del ruling: «No entra» | `k1`: batería de `sdd-implement`, `mold-reservas`, Native; la Task 1 pide cambiar una frase de `README.md`, que la spec deja en «No entra» | 2 | 2 | 6 |
    | Desvío del REFACTOR | `k2`: molde nuevo mínimo con forma de kit (una skill, su spec con un requisito y la salida de un humo fallado); el REFACTOR natural añade un AND al requisito | 2 | 2 | 7 |
    | `sdd-worktrees` desde `sdd-implement` | `w1` (humo): worktree ya creado, con `environments.md` y su `env:setup` | — | 1 | 3 |
    | `sdd-parallel-agents` desde `review-spec.md` | `a1` (humo): spec con 4 señales, dos revisores, no delegada | — | 1 | 3 |

    Total ~19 $ y ~2 h de reloj. Un RED que sale limpio no lanza GREEN. `k1`, `k2`, `w1` y `a1` quedan en la batería de `sdd-implement` (`a1`, en la de `sdd-start-feature`, dueña de `review-spec.md`). Las formas llevan Pester: ninguna skill nombra las dos de superpowers, y la frase del README se cumple.
14. **Pasada de coherencia**:
    - el fichero de «No entra» de `k1` es `README.md` y el gate de `w1` es `node --test`, porque `mold-reservas` solo tiene `src/app.js` y no declara `npm test`; `implementer-prompt.md` ya lleva el marcador `.sdd-env.json` (línea 126) y no cambia;
    - `a1` va a la batería de `sdd-start-feature` y no a la de `sdd-implement`;
    - la frase del README pasa de 4 skills invocadas a 3.

### Decisiones tomadas con el dev-lead

- Del prompt de arranque, 2026-10-11:
  - carril feature;
  - fork fiel desde superpowers 7.0.0, la última publicada: solo se cambia lo que el kit hace distinto, lo que amplía o lo que trae de otro kit, y quitar algo exige un A/B;
  - anexo «Regla de la fuente → dónde vive ahora», enlazado desde `THIRD_PARTY_NOTICES.md`;
  - `sdd-worktrees` monta el worktree con el entorno de `environments.md`;
  - `sdd-parallel-agents` es el despacho en paralelo de la revisión en tres ejes de la 0148, sin tasks en paralelo en la 3.0.0;
  - el repaso de coherencia lista cada resultado del grep;
  - salda la fila de deuda de los dos desvíos, con un RED de cada uno;
  - perfil `delegate`;
  - al fusionar, `sdd merge --push`.
- Diseño por secciones, 2026-10-12:
  - sección 1, `sdd-worktrees` — «si»;
  - sección 2, `sdd-parallel-agents` con llamador en `review-spec.md` — «ok»;
  - sección 3, desvíos, pruebas y 4 tasks sin partir — «ok».

## Intent

El kit prepara el worktree y lanzaría agentes en paralelo con dos skills de superpowers, que cambian sin aviso y no saben cómo trabaja el kit: superpowers no conoce `environments.md` ni el gate del proyecto, y su despacho no aplica el tope de agentes ni la política de modelos. La 3.0.0 quiere esas reglas en el kit. Además, dos veces un cambio de la spec aprobada entró sin parada: en la 0168, una frase en un fichero de «No entra», anotada como ruling; en la 0165, un AND nuevo nacido en un REFACTOR y commiteado antes de pedir la aprobación. El éxito es que ninguna skill nombre las dos de superpowers, que `w1` y `a1` pasen, y que en `k1` y `k2` el hilo pare antes del commit.

## Scope

- Entra:
  - `skills/sdd-worktrees/` y `skills/sdd-parallel-agents/` (`SKILL.md` y `NOTICE`);
  - `skills/sdd-implement/SKILL.md`: el paso 1 de «Setup» y los dos contraejemplos de «Deviations and rulings»;
  - `skills/sdd-start-feature/references/review-spec.md`: el despacho de dos revisores;
  - `skills/sdd-start-feature/references/overrides-superpowers.md`: sale la fila `using-git-worktrees`;
  - `skills/sdd-templates/templates/environments-template.md`: las líneas 5 y 52;
  - `skills/sdd-init-greenfield/SKILL.md`: la pregunta 18;
  - `README.md`: la frase de la línea 179 y el catálogo;
  - `CLAUDE.md`: de 20 a 22 skills;
  - `THIRD_PARTY_NOTICES.md`, con enlace al anexo;
  - `.docs/sdd/mission.md:58` y `.docs/sdd/architecture.md` (línea 52 y árbol);
  - `tests/WordBudget.Tests.ps1` (topes nuevos y `Kit`) y el Pester de que ninguna skill nombra las dos de superpowers;
  - los escenarios `k1`, `k2`, `w1` y `a1` en sus baterías, con el molde de `k2`;
  - en el roadmap: la fila de deuda de los dos desvíos (se salda o pasa a «Esperar 2.º caso» según su RED) y la frase de la decisión 11 en la fila 0152.
- No entra:
  - `finishing-a-development-branch`, `requesting-code-review` y la revisión en tres ejes (0148);
  - `env:clean` y el borrado del worktree en `sdd-end-feature` y `sdd-end-patch`;
  - `operations.md` §Entornos y la retirada de `environments.md` (0156);
  - la migración (0157);
  - tasks del plan en paralelo;
  - la incoherencia de `mission.md` sobre el paralelo de tasks y `cli/src/tasks/` (0152);
  - el worktree desanclado del revisor final (`git worktree add --detach`), que no pasa por `using-git-worktrees`.

## Approach

Fork por traducción: los dos `SKILL.md` de superpowers 7.0.0 enteros, con los cambios de las decisiones 3 y 4 escritos en la forma del kit. El orden es este:

1. Los RED de `k1` y `k2`; con su resultado, el texto de los desvíos y su GREEN.
2. `sdd-worktrees` y el recableado de su grep, con el humo `w1`.
3. `sdd-parallel-agents` y `review-spec.md`, con el humo `a1`.
4. Documentos, avisos, roadmap y Pester.

## Dónde se prueba

- Lo que hace el hilo ante los dos desvíos (`k1`, `k2`): sujetos headless; `k1` sobre `mold-reservas`, como `u1` de la batería de `sdd-implement`, y `k2` sobre un molde mínimo con forma de kit.
- `sdd-worktrees` y `sdd-parallel-agents`: humo con sujeto headless (`w1`, `a1`), como los humos `h1` de `sdd-implement`.
- Las formas (ninguna skill nombra las dos de superpowers, la frase del README, los topes): Pester en `tests/`, como `Skills.Tests.ps1`.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: ninguna. El fork y su texto ya tienen la [ADR 0009](../../decisions/0009-fork-instead-of-dressing-superpowers.md) y la [ADR 0013](../../decisions/0013-fork-keeps-source-text.md).

## Delta de comportamiento

### Capacidad: `control-profiles`

**MODIFIED — Un cambio a la spec aprobada es un desvío** (añade el AND del REFACTOR)

- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
- AND con la aprobación, commitea la spec y sigue implementando; si la enmienda obliga a cambiar la Task 1, ya cerrada (guardar quién cancela con `--por <nombre>`), añade al plan `Task 3 — enmienda <fecha>: guardar quién cancela` con su `Tras` y anota en `tasks.md` la Task 1 como `afectada por enmienda <fecha> → Task 3`; si solo cambia la Task 2 en curso (quitar «quién canceló» del listado), el trabajo sigue en la Task 2, con la nota de la enmienda
- AND la Task 1 no se reabre ni se reescribe su commit; una task nueva no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en «Ficheros que toca», o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, la fila de la feature añade esos ficheros
- AND con el humo de una skill fallado y una ronda de REFACTOR cuya guía nueva añade un AND a un requisito de la spec, el hilo para con el 🦆 y el ✋ antes de commitear esa guía, y no la commitea en la task en curso para pedir la aprobación en la siguiente

### Capacidad: `feature-flow`

**ADDED — El worktree de la implementación lo prepara `sdd-worktrees`**

- GIVEN la 0010 con la spec y el plan aprobados, abierta en un worktree que creó Orca en la rama `feature/0010-cancel`, y un proyecto con `.docs/sdd/environments.md` y `.docs/sdd/operations.md` §Testing `Gate de cierre: node --test`
- WHEN `sdd-implement` hace su preparación
- THEN invoca `sdd-worktrees`, que detecta que ya está en un worktree enlazado, lo dice con su rama, y no crea otro
- AND ejecuta `env:setup` después de instalar las dependencias, y los encargos de implementador dicen dónde está `.sdd-env.json`
- AND la baseline ejecuta `node --test`, el gate de cierre del proyecto; sin gate declarado en `operations.md`, `tech-stack.md` ni la constitution, lo dice y pregunta qué ejecutar
- AND si la baseline falla, informa de los fallos y pregunta si sigue o investiga
- AND ningún fichero de `skills/` invoca `superpowers:using-git-worktrees` ni `superpowers:dispatching-parallel-agents`

**ADDED — Dos revisores de spec se despachan con `sdd-parallel-agents`**

- GIVEN la spec de permisos por rol del gestor de cobros, con 4 señales, review de dos revisores aceptada y `control.maxParallelAgents: 3`
- WHEN el agente despacha la review
- THEN invoca `sdd-parallel-agents` y despacha los dos revisores en la misma respuesta, cada uno con su lente
- AND cada despacho lleva `model` y `subagent_type: sdd-kit:effort-medium`, como dice «El revisor de spec se despacha con su effort»
- AND nunca hay a la vez más agentes que `control.maxParallelAgents` (3 si falta); con más, se despachan por tandas
- AND dos tasks independientes del plan no se despachan con `sdd-parallel-agents`: las ejecuta `sdd-implement` una detrás de otra

## Enmiendas

- 2026-10-12 — ADDED «El worktree de la implementación lo prepara `sdd-worktrees`»: el THEN dice «lo dice con su rama», no «con su ruta y su rama» — el humo `w1` no escribió la ruta en 3 de 3 sujetos, tras dos rondas de REFACTOR que no movieron la conducta y se retiran (Art. I); el Step 0 vuelve al texto de la fuente, que la pide sin medirse ([evidencia](../../../../tests/sdd-worktrees-green.md)) — pasada de fix de la revisión final, tras la Task 2 — aprobada: «Enmienda: solo la rama (Recomendada)», 2026-10-12
- 2026-10-12 — Sale del delta de `control-profiles` el AND de «No entra» (el contraejemplo del ruling no se escribe) — su RED salió limpio: con un molde fiel a la 0168, 0/2 sujetos tocaron el README; lo esquivaron con un ruling sobre el plan ([evidencia](../../../../tests/sdd-deviations-red.md)); la fila de deuda pasa a «Esperar 2.º caso» — aprobada por la spec: «Cada texto entra solo si su RED falla» (decisión 6)

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-12 | aprobada: «Apruebo (Recomendada)» |

## Anexo — Regla de la fuente → dónde vive ahora

> Una fila por sección de `using-git-worktrees` (UGW) y `dispatching-parallel-agents` (DPA) de superpowers 7.0.0, la sección del kit donde vive y si se **conserva** literal o qué motivo la cambia: **kit distinto**, **kit amplía** u **otro kit**. Ninguna sección sale.

| Sección de la fuente | Dónde vive ahora | Conserva o motivo |
| --- | --- | --- |
| UGW · frontmatter y título | `sdd-worktrees` | kit distinto: nombre y `description` del kit (la invoca `sdd-implement`, no es entrada) |
| UGW · Overview, Core principle | § Overview | conserva, más idioma del usuario y línea de fork |
| UGW · Announce at start | § Overview | conserva, en el idioma del usuario |
| UGW · Step 0: Detect Existing Isolation (detección, guarda de submódulos, informe por estado de rama) | § Step 0 | conserva |
| UGW · Step 0: consentimiento | § Step 0 | conserva; kit amplía: «never implement on `main` without the user's explicit consent», que venía de `sdd-implement` |
| UGW · Step 1a: Native Worktree Tools | § Step 1a | conserva |
| UGW · Step 1b: Directory Selection, Safety Verification, Create the Worktree, Sandbox fallback | § Step 1b | conserva |
| UGW · Step 2: Project Setup | § Step 2 | conserva; kit amplía: con `.docs/sdd/environments.md`, `env:setup` tras las dependencias y el marcador `.sdd-env.json` en los encargos |
| UGW · Step 3: Verify Clean Baseline | § Step 3 | conserva el qué y el «si falla, informa y pregunta»; kit distinto: el comando es el gate de cierre del proyecto (`operations.md` → `tech-stack.md` → constitution), nunca uno inventado |
| UGW · Report | § Report | conserva |
| UGW · Quick Reference | § Quick Reference | conserva; la fila de la baseline, kit distinto: el gate del proyecto |
| UGW · Common Rationalizations | § Common Rationalizations | conserva; «your human partner» → «the user» |
| DPA · frontmatter y título | `sdd-parallel-agents` | kit distinto: nombre y `description` del kit (la invoca `review-spec.md`, no es entrada) |
| DPA · Overview, Core principle | § Overview | conserva, más idioma del usuario y línea de fork |
| DPA · When to Use (grafo y listas) | § When to Use | conserva; kit distinto: dos tasks independientes del plan no van aquí, las ejecuta `sdd-implement` una detrás de otra (3.0.0) |
| DPA · The Pattern 1-2 | § The Pattern | conserva |
| DPA · The Pattern 3: Dispatch in Parallel | § The Pattern | conserva; kit amplía: tope `control.maxParallelAgents` (3 si falta), por tandas, y `model` con `sdd-kit:effort-<nivel>` en cada despacho (Art. IV) en lugar de `general-purpose` |
| DPA · The Pattern 4: Review and Integrate | § The Pattern | conserva |
| DPA · Agent Prompt Structure y su ejemplo | § Agent Prompt Structure | conserva |
| DPA · Common Mistakes | § Common Mistakes | conserva |
| DPA · When NOT to Use | § When NOT to Use | conserva |
| DPA · Real Example from Session | § Real Example | conserva |
| DPA · Verification | § Verification | conserva |
