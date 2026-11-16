---
id: 20261011-143353-feature-0165-tdd-and-debugging
feature: 0165
parent: 0147
proposal: 0131
title: sdd-tdd y sdd-debugging — forks delgados de test-driven-development y systematic-debugging
mode: full
profile: delegate
status: approved
created: 2026-10-11
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-11
---

# Spec — `sdd-tdd` y `sdd-debugging`

🦆 Hoy, cuando el kit escribe código o persigue un fallo, se apoya en dos skills de superpowers: la de escribir el test antes que el código y la de buscar la causa antes de arreglar. Con esta feature pasan a ser del kit, `sdd-tdd` y `sdd-debugging`. Se copia solo lo que cambia lo que hace el agente: lo que ya hace bien sin que se lo digan se queda fuera. Lo que vas a notar: quien implementa una task primero ejecuta los tests que le llegan y los ve fallar, y solo después escribe código; en la 0147, 4 de 4 no lo hacían. Además se mide si al hilo le pasa lo mismo con sus propios tests. En Native también se prueba que los tests en rojo los escriba un agente aparte, que solo ve la spec: es lo que recomienda Anthropic, y hoy en Native lo hace todo la misma sesión. Si no mejora los tests, no entra.

## Capacidades

- Modificadas: `feature-flow` — quien implementa ve fallar los RED antes de implementar; un fallo se investiga con `sdd-debugging`, y en un patch la causa queda escrita antes del arreglo.
- Modificadas: `routing` — los requisitos que nombran `superpowers:systematic-debugging` pasan a `sdd-debugging`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (dos requisitos de routing, solo el nombre de la skill), área no explorada (batería de sdd-explore y el detalle de Skills.Tests.ps1) · tamaño: ~600 líneas en ~20 ficheros, la mitad texto traducido de superpowers
- Mínimo razonable: ninguna — sin revisor nadie más relee si la tabla del anexo deja una regla de las fuentes sin destino ni motivo; lo cubren la pasada de coherencia y los humos
```

1. **Dos skills, en inglés (Art. III)**: `skills/sdd-tdd/` y `skills/sdd-debugging/`, cada una con su `NOTICE`. Su `description` dice que las invoca otra skill del kit (`sdd-implement`, el encargo del implementador, `sdd-start-patch`) y que no son una entrada: un fallo entra por `sdd-propose`, como hoy. Me quedo con skills y no con auxiliares de `sdd-implement`, aunque `architecture.md` prefiere auxiliares: las usan dos skills (`sdd-implement` y `sdd-start-patch`) y un subagente. La fila 0165 y la propuesta las nombran así. Y en la 0013 un auxiliar enlazado se abrió 0 de 2 veces.
2. **Delgadas (Principio 1 y `writing-for-agents`: lo que el modelo ya hace por defecto es un no-op y sale)**. Entra lo que cumple una de estas tres condiciones; el anexo dice qué sale y por qué:
   - nombra un fallo medido en el kit;
   - cambia una regla de superpowers que choca con el kit;
   - es el núcleo de la disciplina (ley de hierro, ciclo, fases), que la batería vigila.
   - **`sdd-tdd`** (~700 palabras en `SKILL.md`):
     - la ley de hierro y «borrar es borrar»;
     - el ciclo con el refactor dentro;
     - quién escribe el RED en el kit y qué hace quien lo recibe;
     - Verify RED (pasa → hallazgo sobre el test; da error → arreglar hasta que falle bien);
     - verde = la «Verificación» de la task;
     - las excepciones por carril;
     - el puntero a `references/writing-good-tests.md`, que se copia entero y se lee al escribir o cambiar un test;
     - cinco red flags;
     - el puntero a `sdd-debugging` ante un fallo.
     - Fuera, como no-op: el ejemplo de bug, las 11 racionalizaciones, «When Stuck» y la checklist final.
   - **`sdd-debugging`** (~900 palabras en `SKILL.md`):
     - la ley de hierro;
     - las cuatro fases, sin el ejemplo bash de varias capas;
     - los tres arreglos fallidos;
     - las red flags;
     - «No root cause»;
     - los tres auxiliares copiados: `root-cause-tracing.md`, `defense-in-depth.md` y `condition-based-waiting.md`.
     - Fuera, como no-op: la tabla de racionalizaciones, la «Quick reference» y las señales del humano. La de racionalizaciones vuelve si `d1` falla.
   - Fuera de las dos: `CREATION-LOG.md` y los `test-*.md` de superpowers (su evidencia; el agente no los lee); `condition-based-waiting-example.ts` (su `.md` ya trae el fragmento); y `find-polluter.sh`. El código del kit es Node ([ADR 0011](../../decisions/0011-node-cli.md)), así que su técnica queda en una línea de `root-cause-tracing.md`: ejecutar los ficheros de test de uno en uno hasta que aparece el que deja el estado sucio.
3. **Adaptaciones al kit**, escritas en la forma del kit y no como excepción:
   - **Quién escribe el RED**: el hilo, desde los THEN, antes de implementar (o el escritor de RED, si `t5` lo gana). Quien lo recibe lo ejecuta antes de tocar código y lo ve fallar por el motivo esperado. Guarda esa salida para la «TDD Evidence». Un test que añada él sigue el ciclo entero.
   - **Verde = la «Verificación» de la task**: la suite entera es el gate de cierre, y la ejecuta el hilo una vez. Sale «"Other tests" means the project's suite».
   - **Excepciones a la ley de hierro**: el carril config corre su gate sin TDD, y una task de spike lleva «Evidencia» en vez de RED. Fuera de esos casos, el hilo para como en un desvío y el implementador devuelve `NEEDS_CONTEXT`.
   - **Fase 4 de `sdd-debugging`**: el test que reproduce el fallo sigue `sdd-tdd`. Sale `verification-before-completion`, que el kit ya no invoca desde la 0147: se ejecuta la verificación y se lee su salida antes de decir que está arreglado.
   - **Tres arreglos fallidos**: el hilo para, porque es un desvío del enfoque aprobado ([control-profiles.md](../../../../skills/sdd-start-feature/references/control-profiles.md)). El implementador devuelve `BLOCKED` con los tres intentos.
4. **El encargo y el RED recibido: A/B en `t1`** (Art. I: una duda concreta). Tú decidiste que el encargo carga `sdd-tdd`. El 4 de 4 de la 0147 puede ser un fallo de forma, no de saber la regla: el test llega ya escrito y el implementador se salta el momento de verlo fallar. El encargo ya pide «TDD Evidence: RED…», y aun así los cuatro dijeron «no lo ejecuté». Por eso `t1` compara dos versiones del encargo:
   - **A**: un paso literal en «Your Job»: «Before touching `src/`, run `<comando de los RED>`; paste the failing output and why that failure was expected».
   - **B**: A más «Load `sdd-tdd` with `Skill`».
   Gana la más barata que cumple 2 de 2. Si gana A, el encargo no carga la skill: solo la cargaría cuando el implementador añade un test suyo. Te lo digo al cerrar.
5. **El hilo ve fallar su propio RED** (`t4`): `sdd-implement` le pide escribir los RED «en rojo por compilación o por fallo», pero no ejecutarlos ni leer por qué fallan. La 0147 dejó esa pieza de la 0007 en «Esperar 3.er caso» (re-medida el 2026-09-30, sin reproducirse). Se re-mide en Native, que es lo que usas. Entra solo si `t4` falla, y entonces la fila de deuda se salda.
6. **Escritor de RED en Native** (`t5`, tu elección). En Native el hilo escribe el RED y el código: solo los separa el tiempo, más la copia del RED y el `git diff --no-index`. Anthropic recomienda que una sesión escriba los tests y otra el código ([best practices](https://code.claude.com/docs/en/best-practices)), y BMAD lo hace con su agente TEA. La prueba es un subagente `sdd-kit:effort-medium` con Sonnet que escribe los RED de la task con solo los THEN, «Dónde se prueba», las «Interfaces» de la task y los ficheros de test que sirven de patrón, sin el código del plan. Se compara con el RED del hilo de `t2` y `t3`, con la rúbrica de tautología, acoplamiento y aserciones fuera de la spec. **Entra solo si el RED del hilo falla en algo y el del subagente no**. Si los dos salen limpios, no entra: un subagente por task se paga en tiempo y dinero y no evitaría nada medido (Principio 1). Si entra, vive en el paso 2 de «Before each task» de `sdd-implement` y en un `references/red-writer-prompt.md`, solo para Native. En SDD ya hay otra mano: el implementador. **Es opcional** (tú, 2026-10-11): una clave `tdd.redWriter: thread | subagent`, con `thread` por defecto, en `sdd-kit.json` y también admitida en `sdd-kit.local.json`, porque es método, como `execution`. Con la clave, cambian `sdd-config` (catálogo), las listas de claves locales admitidas de `sdd-propose`, `sdd-start-feature` y `control-profiles.md`, y la capacidad `configuration`.
7. **Costuras pactadas = «Dónde se prueba» de la spec**, y **antipatrones de Matt**. Su confirmación con el usuario ya la hace el gate de la spec, y cambiar «Dónde se prueba» ya es un desvío (`spec-template.md`). `writing-good-tests.md` de superpowers ya cubre el fondo de los dos antipatrones («mirror assertion», «the mock earns no assertions»). Lo propio de Matt es una frase por antipatrón con su indicio («recalcula el esperado como el código», «verifica por un canal lateral; se rompe al refactorizar sin cambiar el comportamiento») más la regla de la costura. Es guía nueva, así que el Art. I solo deja escribirla si su RED falla: `t2` para el tautológico, `t3` para el acoplado y la costura. Si sale limpio, va a deuda «Esperar caso». Para no chocar con la «costura» de Feathers (un punto de sustitución), la skill dice «test seam: the surface «Dónde se prueba» names».
8. **`sdd-explore`**: su `description` y su paso 2 mandan «investigar un fallo» a `superpowers:systematic-debugging`. La `description` pasa a `sdd-propose`, no a `sdd-debugging`, que no es una entrada: un fallo es un cambio, y `using-sdd` ya lo manda a `sdd-propose`. En el paso 2 la salida especial desaparece: un fallo que hay que arreglar es un patch y va por `sdd-roadmap`, como manda el paso 5 de la propia skill (corregido en la Task 4: «→ `sdd-propose`» contradecía ese paso). Como cambia la `description`, va el humo `e1`.
9. **Referencias que cambian**:
   - Skills:
     - `sdd-implement`: los pasos 5 de la preparación y 2 del bucle Native, más lo que decidan `t4` y `t5`.
     - `implementer-prompt.md`: lo que gane `t1`.
     - `sdd-start-patch`: el paso 1 y sus variantes del ajuste visual y de la petición cerrada.
     - `sdd-propose`: el predicado de ajuste solo de presentación nombra `systematic-debugging`.
     - `sdd-explore`: la `description` y el paso 2.
     - Solo si entra el escritor de RED: `sdd-config` (catálogo) y las listas de claves locales admitidas de `sdd-propose`, `sdd-start-feature` y `control-profiles.md`.
     - Los cambios en `sdd-propose` y `sdd-start-patch` son solo el nombre: los cubre `d1`, que entra por `sdd-propose`.
   - Plantillas y capacidad: `patch-template.md` (§2), `tasks-template.md` (línea de fix) y `capabilities/routing.md`, por el delta.
   - Documentos: README (la frase «El kit invoca 6 skills de superpowers» —8 al aprobar la spec; la 0168 quitó dos— pasa a 4, y el catálogo suma las dos skills), `CLAUDE.md` (de 18 a 20 skills), el árbol de `architecture.md` y `THIRD_PARTY_NOTICES.md` (superpowers 7.0.0 para las dos; mattpocock/skills 1.2.3 para `sdd-tdd` si entra lo de `t2` o `t3`).
   - Pester: `WordBudget.Tests.ps1` (topes nuevos). `Skills.Tests.ps1` compara la frase del README con el `grep` y no cambia.
   - No se tocan: `mission.md` (cuenta «13 skills de proceso», ya desfasado: es de la 0152), `.docs/workflow/` (0152), las evidencias `tests/*.md` anteriores ni la migración (0157).
10. **Lo que entra y lo que sale** (Art. I). Entran dos skills de ~1.600 palabras de `SKILL.md` entre las dos (~4.500 con sus auxiliares), frente a las ~2.900 de `SKILL.md` y ~6.800 en total de las de superpowers que sustituyen. Sale la dependencia de dos skills de superpowers. El paso 2 de «Before each task» de `sdd-implement` crece solo si entran `t4` o `t5`.
11. **Topes de palabras** (decisión tuya, Art. I): se miden al terminar y se redondean a la centena de arriba. Techo de 900 en `SKILL.md` y 2.500 en total para `sdd-tdd`, y de 1.100 y 3.000 para `sdd-debugging`. El tope `Kit` sube lo que midan las dos, y el de `sdd-implement` sube solo si entra `t5`. Si una pasa su techo, paro y te lo enseño.
12. **La fila 141 de deuda** («¿la "Verificación" de la task o la suite entera?») se salda al cerrar. Su causa es el texto de superpowers que la decisión 3 cambia. Dijiste «nada que saldar», pero el fork la deja sin objeto, así que la propongo yo.
13. **Filas nuevas al cerrar**:
    - En el backlog, «TDD en legacy sin tests»: tests de caracterización y sprout/wrap de Feathers (`working-with-legacy-code`). La ley de hierro no sirve en un código que no tiene harness, y `mission.md` vende el kit para legacy.
    - Tu nota de `cli/src/tasks/` (portado de la 6.4.2 según `THIRD_PARTY_NOTICES.md:6`), como una frase en la fila 0152.
    - Las de deuda de lo que salga limpio.
14. **Capacidades**: no nace ninguna; el delta va a `feature-flow` y `routing`.
15. **Previsión de coste** (Art. I). Sujetos Sonnet headless sobre `mold-reservas` de la batería de `sdd-implement`. El RED se lanza con el kit de `develop` y superpowers 7.0.0.

    | Paso nuevo o cambiado | Escenario | RED | GREEN | ~$ |
    | --- | --- | --- | --- | --- |
    | Ver fallar el RED recibido | `t1`: `r1b` de la batería, A/B del encargo | — (0147: 4/4) | 2 A + 2 B | 6 |
    | Antipatrón tautológico | `t2`: el hilo en Native escribe el RED de «las horas de Norte suman 2 h por la reserva lun 10:00-12:00» | 2 | 2 | 5 |
    | Costura y antipatrón acoplado | `t3`: el hilo escribe el RED de «cancelar la reserva de Norte del lun deja Norte en `libres 10:00-12:00`», con «Dónde se prueba: cancelar: por `run`, como `test/cancel.test.js`» | 2 | 2 | 5 |
    | El hilo ve fallar su RED | `t4`: se lee en las salidas de `t2` y `t3` (¿ejecuta el RED y lee por qué falla antes del código?); sin sujetos propios | (en `t2`, `t3`) | 2 | 3 |
    | Escritor de RED en Native | `t5`: subagente con solo THEN, «Dónde se prueba» e interfaces, sobre las fixtures de `t2` y `t3` | 2 + 2 | — | 6 |
    | `sdd-debugging` desde un patch, entrando por `sdd-propose` | `d1`: «arregla: `libres 10:00-12:00` devuelve Norte aunque está reservada», un fallo determinista en `freeRooms` (humo) | — | 1 | 2 |
    | Salida de `sdd-explore` ante un fallo | `e1`: «¿por qué `libres` me da Norte si está reservada?» (humo de enrutado) | — | 1 | 1 |
    | Bucle Native con `sdd-tdd` | `h1` de la batería de `sdd-implement` (humo) | — | 1 | 6 |
    | Clave `tdd.redWriter` (solo si entra `t5`) | `c1`: «quiero que en mis features los RED los escriba un subagente» con `sdd-config` (humo) | — | 1 | 1 |

    Total ~35 $ y ~3,5 h de reloj. Un RED que sale limpio no lanza GREEN. `t1`-`t5` y `d1` quedan como batería en `tests/batteries/sdd-tdd/` y `tests/batteries/sdd-debugging/`. Las formas llevan Pester: ninguna skill nombra las dos de superpowers, y el encargo lleva el paso de A.
16. **Pasada de coherencia**: añadí `sdd-propose` a la decisión 9, porque su predicado también nombra `systematic-debugging`. Los humos se llaman `d1` y `e1`, porque `h1` ya es un escenario de la batería de `sdd-implement`. `t4` no lanza sujetos propios: se lee en las salidas del RED de `t2` y `t3`.

### Decisiones tomadas con el dev-lead

- Del prompt de arranque, 2026-10-11:
  - carril feature;
  - base de los forks, superpowers 7.0.0, como `sdd-implement` (0147), citada con su versión en `THIRD_PARTY_NOTICES.md`;
  - `sdd-tdd` con la ley de hierro y el refactor dentro del bucle de superpowers, más las costuras pactadas y los antipatrones de Matt (test tautológico y test acoplado a la implementación);
  - `sdd-tdd` lo carga el encargo del implementador de `sdd-implement`, por el RED de la 0147 (4 de 4 implementadores no vieron fallar el RED);
  - el kit deja de invocar las dos skills de superpowers;
  - nada que saldar;
  - perfil `delegate`;
  - al fusionar, `sdd merge --push`.
- Fuera de esta feature, del mismo prompt: la incoherencia de `cli/src/tasks/` (scripts de la 6.4.2) la revisa la 0166 o la 0152.
- Tras repasar cómo lo hacen otros kits (spec-kit y Kiro con tests opcionales; OpenSpec sin TDD; cc-sdd con TDD del propio implementador; BMAD y Anthropic con otra mano para los tests): forks delgados, `t1` como A/B, medir que el hilo vea fallar su RED, y medir en esta feature un escritor de RED en Native — «Delgada + escritor de RED», 2026-10-11.
- Si entra, el escritor de RED es opcional, con una clave de config junto a `execution`, apagada por defecto y admitida en `sdd-kit.local.json` — «Clave de config (Recomendada)», 2026-10-11.

## Intent

El kit implementa con TDD y depura con la causa raíz, pero las dos reglas viven en skills de superpowers que cambian sin aviso y no saben cómo trabaja el kit. Superpowers dice que el verde es la suite entera; en el kit, es la «Verificación» de la task. Supone que quien implementa escribe sus tests; en el kit los escribe el hilo. Y su ley de hierro no llega al traspaso: en la 0147, 4 de 4 implementadores no ejecutaron el RED que les llegó antes de implementar. La 3.0.0 quiere esas reglas en el kit, delgadas y cargadas donde hacen falta. De paso se mide la parte de la separación de manos que Native pierde.

## Scope

- Entra:
  - `skills/sdd-tdd/` y `skills/sdd-debugging/` (skill, referencias y `NOTICE`);
  - las referencias de la decisión 9;
  - lo que confirmen `t1`-`t5` (el paso del encargo, el RED del hilo, los antipatrones, la costura y el escritor de RED);
  - las baterías `tests/batteries/sdd-tdd/` y `tests/batteries/sdd-debugging/`;
  - las filas de la decisión 13 y la 141 del roadmap.
- No entra:
  - `using-git-worktrees` y `dispatching-parallel-agents` (0166);
  - el revisor final y `requesting-code-review` (0148);
  - `brainstorming` y `writing-plans` (0168);
  - la CLI, ni `cli/src/tasks/`;
  - la migración (0157);
  - TDD en legacy (fila nueva);
  - el escritor de RED en SDD;
  - la fila de deuda «un patch reproduce con un RED sin `systematic-debugging`», que sigue esperando su 2.º ticket.

## Approach

Fork por traducción y recorte: se parte del texto de superpowers 7.0.0, se escribe en la forma del kit lo que hoy contradice al kit (decisión 3) y se deja fuera lo que no cambia la conducta (decisión 2). El orden es este:

1. Los RED: `t2` y `t3`, leídos también para `t4`, y `t5` sobre las mismas fixtures.
2. `sdd-tdd` y el encargo, con el A/B `t1`.
3. Las piezas que los RED confirmen, con su GREEN.
4. `sdd-debugging` y el recableado, con los humos.
5. Documentos, avisos y Pester.

## Dónde se prueba

- Lo que hace quien implementa o escribe los RED (`t1`-`t5`): sujetos headless sobre `mold-reservas`, como la batería de `sdd-implement`.
- `sdd-debugging` y la salida de `sdd-explore`: humo con sujeto headless, como las baterías de `sdd-start-patch` y `sdd-explore` (`d1`, `e1`).
- Las formas (ninguna skill nombra las dos de superpowers, la frase del README, el paso del encargo): Pester en `tests/`, como `Skills.Tests.ps1`.

## Términos y ADR

- Términos resueltos:
  - **costura de test**: la superficie donde se prueba un comportamiento, fijada en «Dónde se prueba» de la spec y aprobada con ella; no es la costura de Feathers (un punto de sustitución);
  - **escritor de RED**: el subagente que, en Native, escribiría los RED de una task con solo la spec.
- ADR candidatas: el escritor de RED en Native, si entra. Es difícil de deshacer, sorprende sin contexto (¿por qué un subagente en el método «sin subagentes»?) y tuvo una alternativa real: el hilo, con la copia y el diff.

## Delta de comportamiento

### Capacidad: `feature-flow`

**ADDED — Quien implementa ve fallar los RED antes de implementar**
- GIVEN un plan con `Ejecución: subagent` y la Task 1 con el RED `test/informe.test.js` escrito por el hilo y sin commitear
- WHEN el implementador recibe su encargo
- THEN ejecuta `test/informe.test.js` antes de editar ningún fichero de `src/`
- AND su informe lleva en «TDD Evidence» el comando, la salida en rojo de antes de implementar y por qué se esperaba ese fallo

**ADDED — Un fallo se investiga con `sdd-debugging`**
- GIVEN un patch de un fallo determinista («`libres 10:00-12:00` devuelve Norte aunque Norte tiene una reserva activa en esa franja»), o un paso del plan cuyo `Expected:` no coincide porque el código falla
- WHEN el agente lo investiga
- THEN invoca `sdd-debugging` y escribe la causa raíz con su evidencia en el código antes de proponer el arreglo
- AND antes del arreglo hay un test en rojo que reproduce el fallo, escrito con `sdd-tdd`
- AND en un patch, §2 de `patch.md` lleva la causa raíz con su evidencia antes de editar el código: la fase 4 de `sdd-debugging` empieza con ella escrita
- AND ningún fichero de `skills/` invoca `superpowers:test-driven-development` ni `superpowers:systematic-debugging`

### Capacidad: `routing`

**MODIFIED — Un patch visual se verifica con una captura y se registra como `Changed`**
- GIVEN un patch abierto para un ajuste solo de presentación o una retirada
- WHEN el agente lo recorre con `sdd-start-patch` y lo cierra con `sdd-end-patch`
- THEN §2 de `patch.md` lleva la intención en una frase, en lugar de la causa raíz, y no se invoca `sdd-debugging`
- AND §4 lleva la ruta de una captura en navegador real de cada pantalla tocada antes y después del cambio, guardadas fuera de git, y la salida del detector en los dos viewports con cada hallazgo resuelto o justificado, con los mismos contraejemplos que una task full
- AND sin detector declarado, el aviso «composición no medida», y con el detector declarado sin ejecutar, «no probado» con el error concreto
- AND con «sube el badge de estado a 14px», la verificación visual (capturas y detector) dura menos de 5 minutos, sin build dedicado ni suite de specs nueva
- AND la validación del paso 0 de `sdd-end-patch` enseña las capturas y la salida del detector al usuario, y propone `§Frontend` si `tech-stack.md` no la tiene
- AND la entrada del changelog va en `Changed`, no en `Fixed`; en una retirada, en `Removed`
- AND en una retirada, §4 lleva además la búsqueda de cada símbolo retirado, sin otros usos
- AND un bug determinista sigue con la causa raíz de `sdd-debugging` y cierra en `Fixed`

**MODIFIED — Un cambio con la solución fijada entra por el carril patch**
- GIVEN el proyecto `ventas`, con `pages/pedido-detalle.html`, `pages/albaran-detalle.html`, `app.js` e `index.html`
- WHEN el usuario escribe, por el hook o con `/sdd-propose`, «Ticket VEN-31, cambio pedido por producto: Cancelar tiene que llevar al listado de pedidos. Solución fijada en el ticket: en app.js, un listener de click en [data-accion="cancelar"] que haga location.assign('../index.html'), en las dos fichas.»
- THEN la skill que abre el trabajo es `sdd-kit:sdd-propose`, que lo clasifica como patch, no como feature
- AND `patch.md` lleva `solution: ticket` y en §2 la frase del ticket literal, sin causa raíz ni `sdd-debugging`
- AND el changelog lleva la entrada en `Changed` o `Added`, nunca en `Fixed`, y el commit no es de tipo `fix`
- AND si `index.html` no existe, para sin abrir rama, carpeta ni id, y lo dice

## Enmiendas

- 2026-10-11 — Decisión 2 (forks delgados) y decisión 11 (topes): `sdd-tdd` y `sdd-debugging` vuelven al texto entero de superpowers 7.0.0, cambiado solo donde el kit trabaja distinto, y `sdd-implement` recupera lo que se le recortó por su tope (una fila de racionalización y la «TDD Evidence» del encargo); los topes pasan a lo que mide el texto (`sdd-tdd` 1.700/3.000, `sdd-debugging` 1.600/3.400, `sdd-implement` 9.100). La regla, en el Art. IX y la [ADR 0013](../../decisions/0013-fork-keeps-source-text.md). El A/B de presión (`p1`-`p3`, versión delgada frente a la entera) salió limpio en las dos versiones: no habría distinguido; la decisión no depende de él — aprobada: «Superpowers funciona… se quita si se ve claramente que funciona bien sin ello, no puede ser que lo quites porque creas que no… No adelgacemos porque sí»
- 2026-10-11 — Decisión 4: el paso del encargo dice «Before touching code, run `<comando de los RED>`; keep its failing output and why it was expected. If it already passes, stop: report DONE_WITH_CONCERNS with the green output; don't implement», no «Before touching `src/`…; paste…» — `src/` es la ruta del molde y no la de un proyecto .NET o Angular, y la revisión final (Important 1) pidió el caso del RED que ya pasa; el paso 3 carga `sdd-tdd` para un test propio del implementador, como decía la decisión 4 si ganaba A — ruling del hilo y fix de la revisión final, sin cambiar un requisito
- 2026-10-11 — Decisión 15 y Scope: los escenarios van a las baterías que ya existen (`t1a`-`t5b` en la de `sdd-implement`, `d1` en la de `sdd-propose`, `f1` en la de `sdd-explore`), no a `tests/batteries/sdd-tdd/` y `sdd-debugging/` — las dos skills no son una entrada y su conducta se ve en quien las invoca — ruling del plan (decisión 3)

- 2026-10-11 — ADDED «Un fallo se investiga con `sdd-debugging`» gana el AND «en un patch, §2 de `patch.md` lleva la causa raíz antes de editar el código», escrito en la fase 1 y a la entrada de la fase 4 de `sdd-debugging` — el humo `d1` falló: causa escrita después del arreglo 0/3 con el fork y 1/2 con superpowers; GREEN 2/2 tras dos rondas de REFACTOR ([evidencia](../../../../tests/sdd-tdd-green.md)). Commiteado en la Task 4 antes de pedir la aprobación — aprobada: «Apruebo (Recomendada)»
- 2026-10-11 — Scope: entra la regla «Poner al día un fork con su fuente» en `tech-stack.md` (dependencia de superpowers), de la fila de triaje del ticket de la 0168 que llegó a la base; la comparación 7.0.0 contra 7.1.0 que pedía no se hace, porque la 7.1.0 no existe (última versión, v7.0.0), y la fila se corrige — aprobada: «Solo la regla (Recomendada)»
- 2026-10-11 — Salen del delta «El hilo ve fallar su propio RED», «Un test no recalcula su valor esperado», «Los tests van en la costura de "Dónde se prueba"», «En Native, el RED lo escribe un subagente» y la capacidad `configuration` — sus RED salieron limpios (`t2`, `t3` y `t4` 0/4; `t5` no gana, [evidencia](../../../../tests/sdd-tdd-red.md)); van a filas de deuda «Esperar 2.º ticket» — aprobada por la spec: «entra solo si su RED falla»
- 2026-10-11 — El encargo del implementador no carga `sdd-tdd`: el A/B de `t1` da 2/2 a las dos versiones y gana la más barata, el paso literal (decisión 4) — aprobada por la spec: «Gana la más barata que cumple 2 de 2»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-11 | aprobada: «Apruebo (Recomendada)» |

## Anexo — Regla de la fuente → dónde vive ahora

> Desde la enmienda del 2026-10-11 ([ADR 0013](../../decisions/0013-fork-keeps-source-text.md)): una fila por sección de `test-driven-development` (TDD) y `systematic-debugging` (SD) de superpowers 7.0.0, la sección del kit donde vive y si se **conserva** literal o qué motivo la cambia: **kit distinto**, **kit amplía** u **otro kit**. Lo que nunca entró de `tdd` de mattpocock/skills 1.2.3 está en las filas de deuda del roadmap. La versión delgada anterior está en la historia de esta spec (`284eebad`).

| Sección de la fuente | Dónde vive ahora | Conserva o motivo |
| --- | --- | --- |
| TDD · frontmatter y título | `sdd-tdd` | kit distinto: nombre y `description` del kit (la invoca otra skill, no es entrada) |
| TDD · Overview | `sdd-tdd` § Overview | conserva, más idioma del usuario y línea de fork |
| TDD · When to Use | § When to Use | conserva; las excepciones, kit distinto: carril config y tasks de spike, y el resto se pregunta (el implementador, `NEEDS_CONTEXT`) |
| TDD · The Iron Law | § The Iron Law | conserva |
| TDD · Red-Green-Refactor (grafo) | § Red-Green-Refactor | conserva; la etiqueta del verde, kit distinto: «Verificación green» |
| TDD · RED | § RED | conserva, más kit distinto: quién escribe el RED (el hilo, desde los THEN) y el contrato del RED recibido |
| TDD · Verify RED | § Verify RED | conserva, más kit distinto: también el RED recibido; si ya pasa, `DONE_WITH_CONCERNS`; el error de compilación del símbolo nuevo cuenta como fallo |
| TDD · GREEN | § GREEN | conserva |
| TDD · Verify GREEN | § Verify GREEN | conserva; «"Other tests" means the project's suite», kit distinto: la «Verificación» de la task, y la suite es el gate de cierre del hilo |
| TDD · REFACTOR y Repeat | § REFACTOR, § Repeat | conserva |
| TDD · Good Tests | § Good Tests, con `references/writing-good-tests.md` | conserva; `writing-good-tests.md` literal salvo «the kit's skill tests» y «the user» |
| TDD · Common Rationalizations (11) | § Common Rationalizations | conserva |
| TDD · Red Flags (13) | § Red Flags | conserva; «Test passes immediately», kit distinto: el RED recibido se reporta |
| TDD · Example: Bug Fix | § Example: Bug Fix | conserva |
| TDD · Verification Checklist | § Verification Checklist | conserva; «All tests pass», kit distinto: la «Verificación» de la task |
| TDD · When Stuck | § When Stuck | conserva; «Ask your human partner», kit distinto: «the user», y el implementador `NEEDS_CONTEXT` |
| TDD · Debugging Integration | § Debugging Integration | conserva, más kit distinto: la causa con `sdd-debugging` antes del test |
| TDD · Final Rule | § Final Rule | conserva; el implementador, `NEEDS_CONTEXT` |
| SD · frontmatter, Overview, Iron Law, When to Use | `sdd-debugging` § Overview… § When to Use | kit distinto: nombre y `description`; el resto conserva, más idioma y línea de fork |
| SD · Fase 1 | § Phase 1 | conserva; el puntero a `root-cause-tracing.md`, kit distinto: `references/`; kit amplía: en un patch, §2 de `patch.md` antes de la fase 4 |
| SD · Fases 2 y 3 | § Phase 2, § Phase 3 | conserva |
| SD · Fase 4 | § Phase 4 | conserva; kit distinto: §2 de `patch.md` escrito al entrar, `sdd-tdd` para el test, la verificación leída en vez de `verification-before-completion`, y los tres arreglos fallidos paran como un desvío (hilo) o devuelven `BLOCKED` (implementador) |
| SD · Red Flags, señales del usuario, racionalizaciones, Quick Reference, «No root cause» | mismas secciones | conserva; «your human partner» → «the user» |
| SD · Supporting Techniques y sus tres `.md` | § Supporting Techniques, `references/` | conserva; `defense-in-depth.md` idéntico |
| SD · `condition-based-waiting-example.ts` | `references/` | conserva, idéntico |
| SD · `find-polluter.sh` | una línea en `references/root-cause-tracing.md` | kit distinto: el código del kit es Node ([ADR 0011](../../decisions/0011-node-cli.md)); queda la técnica escrita |
| SD · `CREATION-LOG.md`, `test-academic.md`, `test-pressure-1..3.md` | — | no son texto que lea el agente: la evidencia de superpowers; las pruebas del kit son sus baterías (`tests/batteries/`) |
