---
id: 20261010-174401-feature-0147-implement-fork
feature: 0147
proposal: 0131
title: implement — sdd-implement funde executing-plans y subagent-driven-development, con el decálogo de calidad
mode: full
profile: delegate
status: approved
created: 2026-10-10
author: Claude (Opus 5.5) con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-10
---

# Spec — implement: `sdd-implement` y el decálogo de calidad

🦆 Cuando apruebes una spec y el plan esté escrito, el kit lo implementará con una skill suya, `sdd-implement`, en vez de con dos de superpowers que hoy corrige a base de excepciones: un plan de tres tasks encadenadas se hará en la propia sesión, y uno de ocho tasks independientes, con un agente nuevo por task y una revisión de cada una, igual que ahora. Quien escribe el código recibirá, junto a las reglas de calidad del proyecto (que mandan), diez reglas breves sacadas de cinco libros de buen diseño. Al empezar, el kit te dirá dónde guarda su cuaderno de trabajo y que lo borra al terminar. Si la máquina se cae o se agota la cuota a mitad, retomará desde ese cuaderno sin rehacer lo hecho. El resumen final dirá si la sesión tuvo que comprimir su memoria por el camino y cómo siguió.

## Capacidades

- Modificadas: `feature-flow` — la implementación pasa a `sdd-implement`; el encargo del implementador lleva el decálogo; el workspace se anuncia; recuperación tras caída o corte por cuota; el walkthrough dice si hubo compactación; un E2E rojo por tiempo se ajusta sin tocar sus aserciones.
- Modificadas: `control-profiles` — el motivo del método nombra los cuatro factores; el rescate tras compactar se registra con una línea fija y va con `sdd-implement`.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (tres requisitos y un REMOVED), área no explorada (control-profiles.md entero y los Pester que nombran skills) · tamaño: ~1.500 líneas en ~25 ficheros, casi todo texto movido o traducido
- Mínimo razonable: ninguna — sin revisor nadie más relee si la tabla «Regla de la fuente → dónde vive ahora» deja una regla de las fuentes sin destino; lo cubren la pasada de coherencia y los dos humos (h1, h2)
```

1. **Una skill, `sdd-implement`, para los dos métodos.** Native y SDD comparten el workspace, el ledger, el repaso previo de interfaces, los rulings, la revisión final y el cierre; con dos skills, cada regla del kit se escribía dos veces (las dos filas de `overrides-superpowers.md`). En inglés (Art. III). Nombre por la acción de la propuesta (explore, propose, implement, verify, archive).
2. **Base del fork: superpowers 7.0.0.** El texto de `executing-plans` y `subagent-driven-development` (con sus tres prompts) es idéntico al de la 6.4.2, que es la validada; entre las dos solo cambian dos scripts bash, que la CLI ya porta. Aviso en `skills/sdd-implement/NOTICE` y en `THIRD_PARTY_NOTICES.md` (MIT, Jesse Vincent).
3. **Estructura**: `SKILL.md` (cuándo cada método, preparación, bucle Native, bucle SDD, lo común: desvío y acción update, compactación, recuperación, revisión final y fin) y `references/implementer-prompt.md`, `task-reviewer-prompt.md` y `re-review-prompt.md`, forks de los de superpowers con la cabecera del kit ya dentro: la «Restricciones de código» del revisor de task y del re-revisor deja de ser una cabecera que se pega delante y pasa a formar parte del prompt.
4. **Entrada y salida**: el paso 6 de `sdd-start-feature` se queda en una línea que invoca `sdd-implement`, y `sdd-implement` termina devolviendo al paso 7. La `description` de `sdd-start-feature` no cambia, y «sigue con la Task 3» sigue entrando por ella; la de `sdd-implement` dice que la invoca el paso 6 y que no es una entrada. Todo lo que hoy dice el paso 6 (task Native con `sdd task start/done`, base antes de cada task, RED del hilo y su copia, vigía de silencio, revisor final en segundo plano y aislado, Restricciones en cada encargo, verificación visual, PID y puerto, `tasks.md`, parada por task en `pair`, desvío y ruling, reproducir antes de arreglar) se mueve a `sdd-implement` sin cambiar de regla, con sus red flags y racionalizaciones.
5. **Lo que sigue en superpowers hasta su feature**: `sdd-implement` invoca `superpowers:test-driven-development` y `superpowers:systematic-debugging` (los forkea la 0165) y `superpowers:using-git-worktrees` (la 0166); el revisor final sigue con `code-reviewer.md` de `requesting-code-review` y la cabecera de `encargo-revision.md` (la 0148); `finishing-a-development-branch` es del cierre (la 0149). `superpowers:verification-before-completion` deja de invocarse: el «contrato de cierre» de la task, que es lo que esa sub-skill gobierna en `executing-plans`, va escrito en `sdd-implement`. La lista del README pasa de 8 a 8: salen `executing-plans` y `subagent-driven-development`, entran `test-driven-development` y `using-git-worktrees`, que hoy el kit no nombra porque las invocan las dos que salen.
6. **El método por juicio, sin umbral**: con `execution: auto`, el motivo de la línea `Ejecución` del plan nombra los cuatro factores de la propuesta —dependencia entre las interfaces de las tasks, cuántas tasks, coste de un error que llegue a la rama, y si el plan cabe en un contexto—. Native, si las tasks se encadenan y el plan cabe; SDD, si se quiere revisión por task o el plan no cabe. Lo elige el handoff de `writing-plans`, que ya pesa tres de los cuatro; `plan-template.md` y `sdd-implement` nombran el cuarto. Ejemplo de la plantilla: `Ejecución: native, porque 3 tasks encadenadas por la interfaz de Ledger, un error lo caza el test de su task y el plan cabe en un contexto`.
7. **Cada task cabe en un contexto nuevo**: ya lo exige «Cada task del plan viaja sola» (Interfaces Consume/Produce y valores copiados); se le añade que ninguna task pide leer otra ni el plan entero, porque tras compactar un implementador nuevo la hace solo con su texto.
8. **Rescate tras compactar, igual que hoy** (Native con dos o más tasks pendientes → SDD sobre el mismo ledger), y se registra siempre, también cuando sigue en Native, con la línea `Task <N>: Ruling: compactación — sigo con <Native | SDD> — quedan <k> tasks`. De esa línea sale la del walkthrough: `Compactación: no` o `Compactación: sí, en la Task <N> → <Native | SDD> desde la Task <M>`, en «Lo que se hizo», junto al modelo del hilo.
9. **El decálogo** (diez reglas, ~25 líneas, en inglés), sección `## Quality decalogue` del encargo del implementador, tras «Restricciones de código», con la frase «Si una regla de aquí choca con las Restricciones de código, mandan las Restricciones». En Native el hilo lo lee una vez en la preparación. Fuentes: *Clean Code* (Martin), *Refactoring* (Fowler), *A Philosophy of Software Design* (Ousterhout), *The Pragmatic Programmer* (Hunt y Thomas) y *Clean Architecture* (Martin); son los cinco que la propuesta nombra en el eje Código y el de Arquitectura de verify. Las diez: nombres que dicen la intención, un nombre por concepto · una función hace una cosa a un solo nivel de abstracción · módulos profundos: interfaz pequeña que esconde mucho, sin envoltorios que solo pasan llamadas · la complejidad baja hacia dentro del módulo; los casos de error que se pueden evitar con el diseño, se evitan · DRY de conocimiento, no de texto: mejor duplicar que la abstracción equivocada · un cambio toca un sitio: sin cirugía de escopeta ni envidia de datos · sin generalidad especulativa: solo lo que pide la task · refactor en pasos pequeños con los tests en verde, dentro del bucle TDD · las dependencias apuntan hacia el dominio: la regla de negocio no importa infraestructura · lo que no toca la task se apunta, no se arregla. **El revisor de task no lo recibe** como restricción: una regla de juicio leída por un revisor se vuelve Important (lo midió la 0021 con «todo incumplimiento es Important»); qué hace verify con los cinco libros lo decide la 0148.
10. **El workspace se anuncia** al crearlo o al retomarlo, con una línea al dev-lead: `Workspace del plan: <ruta> — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia` (retomado: añade `· retomo en la Task <N>`). La ruta sigue en `.superpowers/sdd/<plan>/`: cambiarla rompe la reanudación de los ledgers que ya existen en los proyectos y es cosa de la migración (0157).
11. **Recuperación tras caída de la máquina o corte por cuota**, sección propia: se relee el ledger, `git log` y los informes de task del workspace; una task cuyo informe ya llegó completo se trata como devuelta (sigue a su revisión) y la notificación de fallo de ese agente se ignora; un despacho sin informe se relanza una vez con el mismo brief y el mismo modelo, diciendo en el encargo los ficheros que `git status` muestra cambiados; lo hecho no se rehace; queda la línea `Task <N>: Ruling: recuperación tras <caída | corte por cuota> — <qué se retomó>`.
12. **Commits por ruta**: el hilo y el implementador hacen `git add <rutas>`; el encargo prohíbe `git add -A`, `git add .` y `git commit -a`. Caso de origen: `testResults.xml` commiteado por un `git add -A` (task 0061).
13. **Acción update**: ya la escribió la 0146 en el paso 6 y en `control-profiles` («Un cambio a la spec aprobada es un desvío»: corrección en su sitio, línea en «Enmiendas», tasks afectadas marcadas en `tasks.md`, parada de aprobación). Se mueve a `sdd-implement` sin cambiar: no lleva delta.
14. **La 0007, pieza a pieza** (se salda la fila: cada pieza queda escrita, cubierta o en su propia fila de deuda):
    - Cubiertas hoy, se citan al cerrar: RED sin commitear con un pre-commit que exige la suite; el formato del linter no rompe un RED (0021); en una task en línea el rojo se aparta y se compara (Native); tabla THEN → test (el requisito «uno por THEN»); no commitear los RED de la task siguiente con un fix abierto (los RED van en el commit de su task, que se junta antes del despacho siguiente).
    - Con RED en esta feature, y se escriben solo si el baseline falla: (r2) un THEN universal («cada», «todos») pide un test por elemento; (r3) en una task de refactor el contrato es la suite existente con su recuento como invariante más un test estructural escrito antes; (r5) el implementador puede ajustar esperas, sincronización y foco de un E2E rojo por tiempo, sin cambiar aserciones ni datos, y lo lista en su informe (segundo caso: tickets de las features 0034 §3 y 0035 §2 de document-manager).
    - A fila de deuda propia «Esperar 3.er caso»: el hilo ejecuta los RED antes de despachar y lee por qué fallan (re-medido el 2026-09-30, no se reproduce), y la fidelidad del molde al estado del repo del ticket 0029, que es del método de pruebas de este repo y va a `tech-stack.md` si no está.
15. **La 0054, lo que quedaba**: anuncio del workspace (decisión 10), recuperación (11) y commits por ruta (12). La cosecha de los `Ruling:` ya la hace el paso 6 con `sdd ledger rulings` (0143): se mueve tal cual. La fila sale del roadmap con la 0147.
16. **Tabla «Regla de la fuente → dónde vive ahora»** (Art. I, fusionar es editar): va en el anexo de esta spec, una fila por paso, red flag y racionalización de las dos skills de superpowers.
17. **Lo que entra y lo que sale** (Art. I): entran `sdd-implement` (skill y tres prompts), el decálogo, el anuncio del workspace, la recuperación, la línea de compactación y lo que confirme el RED de la 0007. Salen: el paso 6 de `sdd-start-feature` (≈3.000 palabras, a `sdd-implement`), las filas `subagent-driven-development`, `executing-plans` e `implementer-prompt.md` de `overrides-superpowers.md`, la sección «Encargo del implementador» de `encargo-revision.md` (al prompt forkeado) y la invocación de `verification-before-completion`. Objetivo: `sdd-implement` entero por debajo de lo que sustituye (8.980 + 3.685 palabras de superpowers más el paso 6).
18. **Topes de palabras** (decisión tuya, Art. I): `sdd-implement` estrena el suyo, medido al terminar y redondeado a la centena de arriba, con techo de 6.000 en `SKILL.md` y 9.000 en total; si lo pasa, paro y te lo enseño. `sdd-start-feature` baja el suyo a la centena de arriba de lo que quede.
19. **Referencias que cambian**: `sdd-start-feature` (paso 6, red flags, racionalizaciones, nota de detalle), `control-profiles.md`, `encargo-revision.md`, `overrides-superpowers.md`, `commit-milestones.md` y `frontend-verification.md` donde nombren las skills que salen; `plan-template.md` (línea `Ejecución`: el cuarto factor y el rescate con `sdd-implement`; y la regla de que una task no remite a otra) y `walkthrough-template.md` (línea `Compactación`); la constitution (Art. IV nombra `sdd-implement` en «Método de ejecución»; Art. IX: «hasta que la 0147 retire superpowers» pasa a «mientras el kit no las haya copiado todas»); README (catálogo y lista de superpowers), `CLAUDE.md` (17 → 18 skills), `architecture.md` (árbol), `mission.md` si cuenta skills; Pester `Skills` y `WordBudget`. No se toca el paso 5 de `sdd-propose`: remite el método al handoff y a la plantilla, que es donde cambia. No se tocan `.docs/workflow/` (0152), las evidencias `tests/*.md` anteriores ni la migración (0157): el cambio va en la entrada del changelog para que la lea.
20. **Previsión de coste** (Art. I), todo con Sonnet salvo donde se dice; molde `salas` (TypeScript, `node:test`) de la 0044, el mismo de la re-medida de la 0007:

    | Paso nuevo o cambiado | Escenario | RED | GREEN | ~$ |
    | --- | --- | --- | --- | --- |
    | Decálogo en el encargo | `r1`: implementador con una task que invita a una función larga y a un envoltorio | 2 | 2 | 3 |
    | THEN universal | `r2`: el hilo escribe los RED de «cada reserva cancelada sale en el informe» | 2 | 2 | 2,5 |
    | Contrato de refactor | `r3`: el hilo prepara «extrae `PriceCalculator` sin cambiar comportamiento» | 2 | 2 | 3 |
    | Recuperación tras corte | `r4`: ledger con Task 1 hecha, informe de la Task 2 completo y aviso de fallo por cuota | 2 | 2 | 2,5 |
    | Esperas de un E2E | `r5`: RED de E2E que espera 500 ms a un guardado que tarda 2 s | 2 | 2 | 4 |
    | Workspace, commits por ruta, compactación, bucle Native | `h1`: plan de 2 tasks en Native (humo; RED con la 2.3.x + superpowers) | 1 | 1 | 6 |
    | Bucle SDD | `h2`: plan de 2 tasks en SDD (humo; RED con la 2.3.x + superpowers) | 1 | 1 | 10 |

    | Acción update, movida de `sdd-start-feature` | `u1` y `u2` de la batería de `sdd-start-feature`, que pasan a la de `sdd-implement` con la petición apuntando a ella | — | 1 + 1 | 3 |

    Total ~34 $ y ~3 h de reloj. Los que pasen en RED (sin fallo) no se escriben y no lanzan GREEN. `h1` y `h2` quedan como batería de humo de `sdd-implement` en `tests/batteries/sdd-implement/`. La batería de `sdd-start-feature` se queda con `v1a` y `v1b` (paso 7, sin cambios: no se lanzan). Las formas (línea de compactación, anuncio del workspace, ningún `superpowers:executing-plans` ni `subagent-driven-development` en `skills/`) llevan además un Pester.
21. **Capacidades**: no nace ninguna; el delta va a `feature-flow` y `control-profiles`.
22. **Sin paralelo de tasks**: `sdd-implement` mantiene «nunca dos implementadores a la vez» de SDD; nada del kit despacha tasks en paralelo en la 3.0.0.

### Decisiones tomadas con el dev-lead

- Partir la 0147 en tres: esta (`sdd-implement`), 0165 (`sdd-tdd` y `sdd-debugging`) y 0166 (`sdd-worktrees` y `sdd-parallel-agents`), en cadena 0147 → 0165 → 0166 — «Partir en tres (Recomendada)», 2026-10-10.
- Parar en la spec (perfil `delegate`, sin aprobación delegada) — «Para en la spec (Recomendada)», 2026-10-10.
- Del prompt de arranque, 2026-10-10: Native y SDD con `execution: auto`, método por juicio con factores nombrados y sin umbral; cada task en un contexto nuevo; se mantiene el rescate tras compactar y el walkthrough apunta si compactó · TDD con base de superpowers más costuras y antipatrones de Matt (pasa a la 0165 al partir) · decálogo de ~20-30 líneas de los cinco libros en el encargo del implementador, junto al artículo de calidad del proyecto, que manda · plan con tasks verticales y dependencias, sin paralelo · acción update con la parada de aprobación del desvío · `finishing-a-development-branch` es de la 0149 · salda la 0007 y la parte de la 0054 que la 0143 no saldó · perfil `delegate` · al fusionar, `sdd merge --push`.

## Intent

El kit implementa con dos skills de superpowers y las corrige con una tabla de overrides, un paso 6 de ~3.000 palabras en `sdd-start-feature` y una cabecera que se pega delante de cada prompt. Cada versión de superpowers obliga a revisar ese encaje, y las reglas del kit se escriben dos veces, una por método. La 3.0.0 quiere que la implementación sea del kit: una skill con los dos métodos, las reglas del kit dentro y el encargo del implementador con un listón de calidad explícito. De paso salda dos filas viejas (0007 y lo que quedaba de la 0054).

## Scope

- Entra: `skills/sdd-implement/` (skill, tres prompts, `NOTICE`); el paso 6 de `sdd-start-feature` y sus red flags y racionalizaciones pasan a ella; decálogo; anuncio del workspace; recuperación; commits por ruta; línea de compactación en ledger y walkthrough; piezas de la 0007 que confirme su RED; las referencias de la decisión 19; batería de humo `tests/batteries/sdd-implement/`; filas 0007 y 0054 del roadmap.
- No entra: fork de TDD y debugging (0165), de worktrees y parallel-agents (0166); revisor final, fix wave final y sus prompts (0148); cierre y `finishing-a-development-branch` (0149); `writing-plans` y `brainstorming` (siguen en superpowers); la CLI (ni la ruta del workspace); paralelo de tasks; migración (0157).

## Approach

Fork por fusión: se parte del texto de las dos skills de superpowers 7.0.0 y se le incorpora lo que hoy dicen el paso 6 y las filas de overrides, sin duplicar lo común. Lo que el kit contradecía de superpowers («Four things stop you, and only these», «run the full suite once before committing») se escribe ya en su forma del kit, no como excepción. Las reglas nuevas de la 0007 entran solo con RED. El orden: primero la skill con lo movido (no cambia conducta: humo), luego las reglas nuevas con su RED/GREEN, luego el recableado de referencias y Pester.

## Dónde se prueba

- Lo movido (bucle Native y SDD, reglas del paso 6): humo `h1` y `h2` con sujeto headless sobre el molde `salas`, como la batería de `sdd-start-feature`.
- Cada regla nueva (decálogo, THEN universal, refactor, recuperación, esperas de E2E): su escenario `r1`-`r5` con sujetos headless, RED con el kit de `develop` y GREEN con la rama.
- Las formas (línea de compactación, anuncio del workspace, la lista de superpowers del README, ninguna skill nombra las dos que salen): Pester en `tests/`, como `Skills.Tests.ps1`.

## Términos y ADR

- Términos resueltos: **workspace del plan** — la carpeta sin versionar donde `sdd-implement` guarda ledger, briefs, informes y paquetes de revisión; **rescate tras compactar** — seguir con SDD lo que queda de un plan Native cuando la sesión compactó con dos o más tasks pendientes.
- ADR candidatas: una skill para los dos métodos de implementación — alternativa descartada: dos skills, como superpowers.

## Delta de comportamiento

### Capacidad: `feature-flow`

**ADDED — La implementación la lleva `sdd-implement`**
- GIVEN la feature 0042 en modo full, con la spec aprobada y el plan con `Ejecución: native, porque 2 tasks encadenadas por la interfaz de Ledger, …`
- WHEN `sdd-start-feature` llega al paso 6
- THEN invoca `sdd-implement`, que ejecuta las dos tasks en Native y, con la revisión final de vuelta y su pasada de fix hecha, sigue en el paso 7 de `sdd-start-feature`
- AND ningún fichero de `skills/` invoca `superpowers:executing-plans` ni `superpowers:subagent-driven-development`
- AND en modo lite, sin plan, el método es el de `execution` si está fijado y Native con `auto`, con `spec.md` en el lugar del plan

**REMOVED — Una task Native se registra en el ledger de `executing-plans`**
- motivo: renombrado a «Una task Native se registra en el ledger de `sdd-implement`», mismo contenido

**ADDED — Una task Native se registra en el ledger de `sdd-implement`**
- GIVEN un plan con `Ejecución: native`
- WHEN el hilo ejecuta cada task
- THEN la abre con `sdd task start` y la cierra con `sdd task done` y el comando de su «Verificación», y el ledger del workspace tiene su línea `Task <N>: complete`

**ADDED — El encargo del implementador lleva el decálogo de calidad**
- GIVEN un plan con el bloque «De código» en sus Restricciones globales
- WHEN se despacha el implementador de una task, o el hilo prepara la ejecución en Native
- THEN el encargo lleva, tras «Restricciones de código», la sección `## Quality decalogue` con las diez reglas y la frase de que, si una choca con las Restricciones de código, mandan las Restricciones
- AND en Native el hilo la lee una vez, al preparar la ejecución
- AND el encargo del revisor de task y el del re-revisor no la llevan

**ADDED — El workspace del plan se anuncia**
- GIVEN un plan sin workspace en `.superpowers/sdd/`
- WHEN `sdd-implement` lo crea
- THEN dice al dev-lead `Workspace del plan: .superpowers/sdd/plan/ — ledger, briefs, informes y paquetes de revisión; no se versiona y se borra cuando la revisión final queda limpia`
- AND con un ledger del mismo plan con `Task 1: complete …`, la línea acaba en `· retomo en la Task 2`

**ADDED — Tras una caída o un corte por cuota, la ejecución sigue desde el ledger**
- GIVEN un plan SDD con `Task 1: complete (commits a1b2c3d..d4e5f6a, review clean)` en el ledger, `task-2-report.md` con `Status: DONE` y su commit `b7c8d9e`, y la notificación de fallo del implementador de la Task 2 por cuota agotada
- WHEN el hilo retoma
- THEN no relanza la Task 1 ni la Task 2: despacha la revisión de la Task 2 sobre `d4e5f6a..b7c8d9e` y deja `Task 2: Ruling: recuperación tras corte por cuota — informe completo, sigue a revisión`
- AND si la Task 2 no tuviera informe, la relanza una vez con el mismo brief y el mismo modelo, y el encargo nombra los ficheros que `git status` da cambiados

**ADDED — El walkthrough dice si la ejecución compactó**
- GIVEN una feature en Native de 4 tasks cuya sesión compactó en la Task 2 con dos tasks pendientes
- WHEN el hilo retoma
- THEN escribe en el ledger `Task 2: Ruling: compactación — sigo con SDD — quedan 2 tasks`
- AND el walkthrough lleva en «Lo que se hizo» `Compactación: sí, en la Task 2 → SDD desde la Task 3`, y en una feature que no compactó, `Compactación: no`

**MODIFIED — Cada task del plan viaja sola**
- GIVEN un plan cuyas tasks usan firmas, formatos o valores que fija otra task o una sección del plan
- WHEN se extrae una task para su encargo
- THEN el texto de la task lleva `Interfaces: Consume / Produce` con los nombres y firmas exactos, y los valores que necesita copiados, sin remitir a otras secciones
- AND ninguna task pide leer otra task ni el plan entero: un implementador con el contexto vacío la hace con su texto, los ficheros que nombra y las Restricciones globales

**ADDED — Un E2E rojo por tiempo se ajusta sin tocar sus aserciones**
- GIVEN un RED de E2E que espera 500 ms a un guardado que tarda 2 s, con el código de la task ya correcto
- WHEN el implementador lo ve fallar por tiempo
- THEN cambia la espera por la señal de guardado, sin cambiar aserciones ni datos, y lo lista en su informe bajo `Ajustes de espera`

### Capacidad: `control-profiles`

**MODIFIED — El método de ejecución lo elige el handoff del plan**
- GIVEN una feature en modo full con la spec aprobada, `execution` ausente o `auto` en `sdd-kit.json` y sin `native` ni `subagent` en `sdd-kit.local.json`, o `execution: auto` en `sdd-kit.local.json`
- WHEN el agente guarda el plan
- THEN en `delegate` y `unattended` no para: toma el método que recomienda el handoff y lo escribe en la cabecera del plan como `Ejecución: <native | subagent>, porque <motivo>`, y el motivo pesa por su nombre la dependencia entre las interfaces de las tasks, cuántas son, el coste de un error que llegue a la rama y si el plan cabe en un contexto, sin umbral numérico (`Ejecución: native, porque 3 tasks encadenadas por la interfaz de Ledger, un error lo caza el test de su task y el plan cabe en un contexto`)
- AND en `pair` la parada del plan es una sola pregunta que aprueba el plan y elige el método, con la recomendación del handoff como primera opción; no hay una parada aparte para el método
- AND ninguna task del plan lleva un campo `Ejecución` propio: el método es del plan entero, salvo el cambio a SDD tras una compactación

**MODIFIED — Tras una compactación, lo que queda de un plan Native va con SDD**
- GIVEN un plan con `Ejecución: native` (recomendado por el handoff o fijado en `sdd-kit.json`), una sesión retomada tras una compactación y dos o más tasks sin su línea `complete` en el ledger
- WHEN el hilo retoma la ejecución
- THEN sigue con el método SDD de `sdd-implement` sobre el mismo ledger y lo registra como `Task <N>: Ruling: compactación — sigo con SDD — quedan <k> tasks`, sin parar en `delegate` ni en `unattended`
- AND con una sola task pendiente sigue en Native y lo registra como `Task <N>: Ruling: compactación — sigo con Native — queda 1 task`; sin compactación, sigue en Native sin línea

## Enmiendas

- 2026-10-11 — Salen del delta «Los commits de la implementación van por ruta», «Un THEN universal pide un test por elemento» y «Una task de refactor fija la suite como invariante», y la decisión 12 queda sin regla — su RED salió limpio (h1/h2 y 15 sujetos sin `git add -A`; `r2` 0/2; `r3` 0/2, [evidencia](../../../../tests/sdd-implement-red.md)) y la propia spec (decisiones 14 y 20) dice que entonces no se escriben; van a filas de deuda — aprobada por la spec: «se escriben solo si el baseline falla»
- 2026-10-10 — El decálogo se mide con `r1b`, una task más grande sobre un `run` enredado, tras salir limpio `r1` — RED de `r1` sin fallo claro — aprobada: «Un RED más duro (Recomendada)»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-10 | aprobada: «Apruebo (Recomendada)» |

## Anexo — Regla de la fuente → dónde vive ahora

> Fusionar es editar (Art. I): una fila por paso, red flag y racionalización de `executing-plans` (EP) y `subagent-driven-development` (SDD) de superpowers 7.0.0. «§» es la sección de `sdd-implement`.

| Regla de la fuente | Dónde vive ahora | Por qué se descarta |
| --- | --- | --- |
| EP · Overview: brief = spec, ledger = memoria, TDD = gate por task, revisor final = segundos ojos | § Overview (Native) | — |
| EP/SDD · Narración de una línea entre llamadas | § Overview | — |
| EP/SDD · Ejecución continua, sin «¿sigo?» | § Overview, con las paradas del perfil (`control-profiles.md`) | — |
| EP/SDD · Rulings, not stalls, y su línea `Ruling:` | § Desvíos y rulings, con el desvío y los frenos de alcance del kit | — |
| EP/SDD · «Four things stop you, and only these» | § Desvíos y rulings: las cuatro, más los frenos de alcance, el desvío y, en `pair`, la parada por task | La exclusividad («only these»): el kit añade paradas |
| EP · When to Use; SDD · When to Use (grafo) | § Método: los cuatro factores | El grafo «tasks mostly independent?»: lo sustituyen los factores |
| EP · Native va bien en gama media; el más capaz, en la revisión final | § Método y § Revisión final | — |
| SDD · vs. Executing Plans | § Método | — |
| EP/SDD · Process (grafo) | § Native y § SDD, en pasos numerados | El grafo: duplica los pasos |
| EP/SDD · Setup: worktree aislado, nunca en main sin permiso | § Preparación, con `superpowers:using-git-worktrees` hasta la 0166 y `env:setup` si hay `environments.md` | — |
| EP/SDD · Setup: workspace por plan, ledger, reanudar por `Task N: complete`, confiar en el ledger y `git log` | § Preparación, con el anuncio del workspace | — |
| SDD · Setup: una task cuya última línea es una ronda de fix está a medias | § Preparación | — |
| EP/SDD · Leer plan y spec una vez; sin spec, nota en el ledger | § Preparación | — |
| EP · REQUIRED SUB-SKILL test-driven-development | § Preparación (superpowers hasta la 0165) | — |
| EP · Pre-flight por interfaces; SDD · pre-flight en tabla por pares y por task | § Preparación: el de SDD para los dos métodos | La versión corta de EP: deja sin mirar la coherencia de cada task |
| SDD · Model Selection | § SDD, con la política de modelos del Art. IV y los tipos `sdd-kit:effort-*` | — |
| SDD · Batch small same-shape work | § SDD | — |
| SDD · Waiting on dispatched subagents | § SDD, con el vigía de silencio del kit | Las esperas en tramos de 5-10 min: las sustituye el vigía |
| EP · Task loop 1: `task-start`, leer el brief siempre | § Native (`sdd task start`) | — |
| EP · Lo impreso se queda en contexto: salida larga a fichero | § Native | — |
| EP · Task loop 2: pasos en orden RED-GREEN, `Expected:`, tres salidas | § Native | — |
| EP · Task loop 3: contrato de cierre | § Native, sin la sub-skill | REQUIRED SUB-SKILL verification-before-completion: el contrato ya es la regla |
| EP · Task loop 4: `task-done` | § Native (`sdd task done`, con el commit comprobado antes) | — |
| SDD · 1. Despachar: BASE, `task-brief`, contenido del encargo, informe en fichero, sin historia, sin subagentes, recordar el id, nunca dos a la vez | § SDD (`sdd task brief`) | — |
| SDD · 2. Informe: DONE, DONE_WITH_CONCERNS, NEEDS_CONTEXT, BLOCKED | § SDD | — |
| SDD · 3. Revisión de task: paquete, entradas, restricciones literales, no prejuzgar, ⚠️ | § SDD (`sdd review package`) | — |
| SDD · 4. Bucle de fix: minors al ledger, plan-mandated, rondas 1-3 y 4-5, informe, re-revisión acotada, línea por ronda, el hilo no arregla | § SDD | — |
| SDD · Breaker en la ronda 5 | § SDD | — |
| SDD · 5. Completar la task | § SDD, con el juntado de `commit-milestones.md` | — |
| EP · Final Review: paquete, revisor, sin subagente → autorrevisión, re-grado, una pasada de fix con TDD, sin re-revisión | § Revisión final, con el paquete y el encargo de `encargo-revision.md` (hasta la 0148) | El paquete de `review-package`: lo sustituye el del revisor final del kit |
| SDD · Final Review: un fix, una re-revisión acotada, residuales adjudicados | § Revisión final | — |
| EP/SDD · Finish: recoger `Ruling:` y `minor (deferred)`, borrar el workspace | § Fin: `sdd ledger rulings` a `tasks.md` antes de borrar | — |
| EP/SDD · «Use superpowers:finishing-a-development-branch» | § Fin: vuelve al paso 7 de `sdd-start-feature` | La rama la cierra el cierre del kit (0149) |
| EP · Example Workflow; SDD · Example Workflow | — | No nombran un fallo que eviten; los pasos ya llevan su forma |
| EP · Racionalizaciones (12 filas) | § Native, tabla de racionalizaciones, las 12 | — |
| SDD · Racionalizaciones (9 filas) | § SDD, tabla de racionalizaciones, las 9 | — |
| SDD · implementer-prompt.md: «run the full suite once before committing» | `references/implementer-prompt.md`: la «Verificación» de la task | La suite completa: la ejecuta el hilo una vez, en la validación |
| SDD · implementer-prompt.md, task-reviewer-prompt.md, re-review-prompt.md (resto) | `references/`, con «Restricciones de código» dentro | — |
