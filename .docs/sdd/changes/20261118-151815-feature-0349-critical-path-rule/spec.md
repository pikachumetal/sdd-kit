---
id: 20261118-151815-feature-0349-critical-path-rule
feature: 0349
title: El camino crítico — los tests de feature se escriben en el nivel más bajo y se borran al cerrar
mode: full
status: approved
created: 2026-11-18
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-18
---

# Spec — El camino crítico: los tests de feature se escriben en el nivel más bajo y se borran al cerrar

🦆 Hoy cada feature deja para siempre sus tests de integración y E2E, y un proyecto del equipo llegó a pasar más de 40 minutos de tests en cada cierre. Con esta feature, un proyecto que declara su camino crítico guarda en la base solo los unitarios y los tests de su lista, `critical-path.md`, que edita una persona. Los demás tests de integración y E2E que añade una feature o un patch sirven mientras se construye: el cierre los pasa una vez y los borra. Por ejemplo, una feature que añade «exportar a PDF» escribe un test de endpoint y un E2E; si la spec propuso el E2E como fila, el cierre te pregunta «¿pegas la fila?» y no lo borra hasta que contestas; el de endpoint se pasa y se borra. La revisión final marca un test escrito más arriba del nivel que ve el fallo, y una lista tocada por la sesión.

Validación: agente — es guía y plantillas del kit; lo que haría una persona lo miden las baterías, y el uso real lo da la validación en campo (`validation.mode: field`).

## Capacidades

- Modificadas: `feature-flow` — «Dónde se prueba» en el nivel más bajo y, con camino crítico, qué tests son de feature; la task no toca la lista; el test de títulos no se pide con camino crítico
- Modificadas: `verification` — el eje Código recibe «Camino crítico» y marca el nivel alto y la lista tocada, no el E2E fuera de la lista
- Modificadas: `archive` — el cierre pasa una vez los tests de feature, pregunta las filas propuestas, borra lo que añadió la rama y dice lo que la base trae fuera de la lista
- Modificadas: `commit-history` — el commit de cierre de una feature y el de un patch llevan el borrado de los tests de feature

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: contrato público (`critical-path.md` y los campos «Camino crítico» y «Tests de feature» los consume `sdd-project-template`), MODIFIED (en `feature-flow`, `verification` y `commit-history`), cuatro capacidades · tamaño: ~200 líneas en 11 ficheros
- Dominio (opus): si el borrado al cerrar puede llevarse un test que la persona quería conservar y si informar `ya-en-base:` deja crecer la base (señal: MODIFIED + cuatro capacidades)
- Técnica (sonnet): si los dos campos y los prefijos bastan para que `sdd-archive` y `sdd-verify` decidan sin leer el check, y si el borrado respeta `commit-history` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si la regla borra lo que la persona quería guardar

1. **Enfoque: A, la regla en el kit y el mecanismo en el proyecto, frente a B y C (ver Approach).**
2. **El contrato con `sdd-project-template`**, acordado hoy con su sesión de coordinación:
   - `.docs/sdd/steering/critical-path.md`, tabla `Nivel | Camino | Crit. | Test | Evidencia`, criterios A, B, C y Arnés. El kit no lee la columna «Crit.».
   - Campo «Camino crítico» en `operations.md` §Testing: `` `<comando>` · cubre <suites> ``. `<suites>` son nombres de «Suites» del mismo §Testing. El comando va completo y el kit lo corre tal cual: el check compara con la rama de integración del proyecto (`merge.into`), que resuelve él o lleva en el comando.
   - Campo «Tests de feature»: el comando que pasa una vez los tests que el check marca `fuera:`, los que añade la rama; nunca lo heredado. Su código de salida es el de esos tests.
   - El check escribe un aviso por línea: `<prefijo> <id del test>`, con el id como lo lista su runner (`Namespace.Clase.Método`; `fichero › describe › título`, relativo a la carpeta de tests de su config). `fuera:` es un test que la rama añade frente a la base y no está en la lista; un test que ya existía y la rama modifica es `ya-en-base:`. Avisos: `lista-tocada:`, `fila-nueva:`, `freno-modificado:`, `sin-base:`.
   - Código de salida: distinto de 0 solo con `fuera:` o con una línea de fallo propia del check (en el template, `fuera-de-suite:`, `fila-sin-test:`, `fila-ilegible:`, `test-ilegible:`, `lista-sin-proteger:`); `ya-en-base:` y los avisos salen con 0.
   - El kit no nombra la ruta del hook que protege la lista.
3. **Plantilla nueva `critical-path-template.md`** en `sdd-templates` (Art. VIII), con la tabla y los cuatro criterios. Es un documento de estado: lo escribe una persona, lo leen el check y `sdd-verify`, lo acota «un test por camino». Va a la tabla de documentos de `architecture.md`.
4. **El kit no asume la lista vacía**: un template trae sus filas, y la 0350 las siembra desde «Flujos core». Con «Camino crítico» declarado y `critical-path.md` ausente o sin filas, el cierre para sin borrar nada y lo dice.
5. **Solo actúa sobre las suites del alcance** que tienen nivel `integración` o `E2E` en «Suites». Una suite `unitario` en `cubre` no se borra nunca, y lo no nombrado queda fuera.
6. **«Dónde se prueba» pasa de «la costura existente más alta» a «el nivel más bajo que ve el fallo»** en todo proyecto: el test más arriba de lo necesario es el que luego hay que borrar o mantener. Con camino crítico, cada test de una suite del alcance que nombra la línea dice «de feature, se borra al cerrar» o «fila propuesta: <criterio>», y la fila propuesta va también al ✋.
7. **La sesión nunca escribe en `critical-path.md`.** La persona pega una fila propuesta en la rama, durante la validación y antes del commit de cierre. La revisión final va antes de la validación, así que todo cambio a la lista en su diff es de la sesión y es Important.
8. **Una fila propuesta se pregunta sola, en todo modo de validación y en `pair` y `delegate`**, por la misma vía que hoy tiene «una decisión que la revisión final deja al usuario» del paso 1 de `sdd-archive`, que ya para también con `validation.mode: field`: decidir qué test se queda para siempre es del dev-lead, no del agente. La pregunta: «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.» Sin respuesta, el cierre espera y no borra ese test. En `unattended`, el cierre lo borra y abre una fila de deuda del proyecto con la fila propuesta y el sha del commit de su task, de donde se recupera.
9. **El cierre solo borra los `fuera:`**, es decir, lo que la rama añade. Un test que la rama solo modifica es `ya-en-base:` y no se borra.
10. **El orden en el paso de validación**, antes de la suite del cierre: «Tests de feature» una vez (un rojo es un rojo de la rama: la pasada de fix, como hoy); el check, cuya salida dice qué borrar; las filas propuestas; el borrado; y la suite del cierre sobre el árbol ya borrado, aquí o tras el merge de sincronización como dice hoy `closing-suite.md`. Antes del borrado, el cierre decide por prefijo, no por el código: para sin borrar nada con una línea `sin-base:`, con una línea de prefijo que no sea `fuera:`, `ya-en-base:` ni un aviso, o con un código distinto de 0 sin ninguna línea de prefijo conocido (el check se cayó). Después del borrado, todo código distinto de 0 del check es rojo. Tras una pasada de fix, el orden se repite desde «Tests de feature»; un test que añade la pasada es de feature como los demás. En `manual`, «Tests de feature» y el check corren antes de presentar el guion, como cualquier tanda (`archive`, «Mientras la persona prueba…»), la pregunta de la fila va en el mensaje de validación, y el borrado y la suite, tras la respuesta. El `--verified-at` es el sha del commit de cierre, como hoy cuando el cierre junta la suite de la validación.
10 bis. **El kit localiza el fichero de un `fuera:`** entre los que la rama añade o toca (`git diff --name-only <merge-base>`), por el final de su ruta, sin suponer una raíz.
11. **El borrado va en el commit de cierre**, no en un commit propio: Art. IV fija apertura, una por task y cierre. Los tests siguen en el historial, en el commit de su task, y el 4.1 del walkthrough los lista con el resultado de su pasada. Un test borrado de un fichero que tiene otros solo quita ese test; el fichero se borra si se queda sin tests.
12. **`ya-en-base:` se informa en el mensaje final y no abre fila**: una fila tras el merge de sincronización sería un commit después de él, y `commit-history` lo prohíbe. El mensaje los cuenta, nombra hasta diez y recomienda un patch que los borre, con su lista; decide el dev-lead, y el patch o su fila los escribe la sesión de coordinación. `lista-tocada:`, `fila-nueva:` y `freno-modificado:` también van al mensaje final, como aviso.
13. **Vale para features y patches.** El test de regresión de un patch en una suite del alcance es de feature, salvo que `patch.md` §4 lo proponga como fila (criterio B si se ha roto dos veces); en ese caso se pregunta como en la decisión 8.
14. **«Lo afectado» se queda**: la gate de cierre sigue filtrando, y el check entra en ella como un paso más.
15. **«Flujos core», «Títulos heredados» y el test de títulos siguen vigentes sin camino crítico.** Con «Camino crítico», la lista manda: «Flujos core» no se lee y el test de títulos no se pide. La 0350, en la misma release, los retira.
16. **«Camino crítico» y «test de feature» entran en el glosario de `PRODUCT.md`.**
17. **Los topes**: el de `sdd-templates` sube por la plantilla nueva (ver «Topes de palabras»). `sdd-tdd` está en su tope: su regla sustituye texto de `writing-e2e.md`.
- Repaso de coherencia: `sdd capability merge` sobre una copia → 9 requisitos sustituidos, 3 añadidos y 4 reglas de `archive` sustituidas, sin rechazos.
- Política de modelos (solo en `delegate`): revisores de la spec dominio opus y técnica sonnet, más la segunda ronda en sonnet, con `sdd-kit:effort-medium` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de las baterías en sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3)

### Hallazgos de la review

- **Aceptado** — (técnica 1, Crítico) el borrado en el commit de cierre choca con una gate que corre tras él → decisión 10: todo el borrado va antes de la suite del cierre, en la validación; `commit-history` en el delta.
- **Aceptado** — (técnica 2, Crítico) el contrato no dice qué sigue al prefijo ni cómo distingue la base → decisión 2: `<prefijo> <id del test>`, el comando completo lleva la base, y `fuera:` es solo lo que añade la rama.
- **Aceptado** — (técnica 3, Crítico) la pasada previa al borrado sale siempre distinta de 0 → decisión 10: antes del borrado, el rojo es una línea con otro prefijo; después, cualquier código distinto de 0.
- **Aceptado** — (dominio 1, Crítico) no había momento válido para pegar una fila propuesta → decisiones 7 y 8: la persona la pega en la rama durante la validación; se pregunta sola en todo modo; sin respuesta no se borra.
- **Aceptado** — (técnica 4) los prefijos sin consumidor → decisión 12.
- **Aceptado** — (técnica 5) los THEN pasaban con una palabra → THEN con `git diff --name-only` sobre la lista y con el unitario que ya existe en el molde.
- **Aceptado** — (técnica 6) una fila de deuda tras el merge de sincronización rompe la historia → decisión 12.
- **Aceptado** — (técnica 7) `cubre` sin resolver → decisión 2: nombres de «Suites».
- **Aceptado** — (técnica 8) la suma de la previsión fallaba → recalculada: 37 sujetos, 21,7 $.
- **Aceptado** — (técnica 9) faltaba paso → escenario → tabla en «Previsión de coste».
- **Rechazado** — (técnica 10) el tope de `sdd-templates` sube más de lo previsto → la plantilla pide lo medido más lo previsto más un 2 % del total; `sdd-propose` y `sdd-implement-native` no se editan.
- **Aceptado** — (dominio 2) un test que la rama solo modifica podía borrarse → decisión 9 y escenario.
- **Aceptado en parte** — (dominio 3) `ya-en-base:` deja crecer la base → se agrupan en el mensaje (recuento y hasta diez) y decide el dev-lead; sin fila de deuda por la historia (decisión 12). Cada rama borra lo suyo, y lo heredado lo siembra la 0350.
- **Aceptado** — (dominio 4) los patches → decisión 13.
- **Aceptado** — (dominio 5) requisitos del test de títulos y de la prueba de estrés → `MODIFIED` en `feature-flow`.
- **Aceptado** — (dominio 6) el encargo literal del eje Código → `MODIFIED` de «La revisión final sale en ejes».
- **Aceptado** — (dominio 7) una pasada por árbol → decisión 10 y «Límites» de `archive`.
- **Aceptado** — (dominio 8) efecto de cada prefijo y lista ausente → decisiones 4 y 12.
- **Aceptado** — (dominio 9) reglas de la capacidad → bloque de `archive`; en `feature-flow`, `verification` y `commit-history` ninguna regla cambia.
- **Aceptado** — (dominio 10) una suite unitaria en `cubre` → decisión 5.

### Hallazgos de la segunda ronda (sonnet; sin tercera ronda)

- **Aceptado** — (1, Crítico) el código de salida de cada prefijo no estaba fijado, y los ejemplos usaban `--base main` → decisión 2: distinto de 0 solo con `fuera:` o un fallo propio del check; la base es `merge.into`; ejemplos sin `--base`.
- **Aceptado** — (2, Crítico) un check caído sin líneas pasaba, y no se decía qué pasa tras una pasada de fix → decisión 10: código distinto de 0 sin prefijo conocido para; tras un fix, el orden se repite desde «Tests de feature».
- **Aceptado** — (3) «Tests de feature» pasaba también lo heredado → decisión 2: solo los `fuera:`; THEN que lo comprueba.
- **Aceptado** — (4) `--verified-at` «el del borrado» no tiene sha, y `manual` no lanza nada mientras la persona prueba → decisión 10: el sha del commit de cierre; en `manual`, antes del guion.
- **Aceptado en parte** — (5) faltaban THEN de patch, fichero con otros tests, lista vacía y suite unitaria → AND en el escenario del cierre; el patch no lleva escenario de batería propio: mismo paso de la misma skill.
- **Aceptado** — (6) «El test de títulos lee los títulos que corre Playwright» → `MODIFIED`.
- **Aceptado** — (7) números del repaso desfasados → repetido.
- **Aceptado** — (8) no había camino para borrar los `ya-en-base:` → decisión 12: el mensaje recomienda un patch con la lista, y lo escribe la sesión de coordinación.
- **Aceptado** — (9) la parada de la fila en `delegate` y `field` → decisión 8: va por la vía que ya existe para una decisión que la revisión final deja al usuario.
- **Rechazado en parte** — (10) una fila pegada por la persona antes de la revisión final saldría Important → la persona pega en la validación (decisión 7), que va después; si pega antes, el hallazgo se resuelve con su ruling como cualquier otro. Aceptado lo del glosario → decisión 16.

### Decisiones tomadas con el dev-lead

- Partir en dos: esta, la regla y el cierre; la 0350, la migración — «sí, parte en A y B, y arranca aqui directo»
- Arrancar ya — «ponte ya con estop, es critico, habla con sdd-templates develop para coordinaros»
- Dos revisores de la spec en paralelo — «1»

## Intent

Los tests de integración y E2E crecen con cada feature y se quedan para siempre: útiles mientras se construye, después solo tiempo y falsos positivos. En un proyecto del equipo, un cierre pasaba 4.555 tests de integración (21,5 min), 166 E2E (33,9 min) y 277 de otra suite de integración (7,4 min); con la regla aplicada a mano, la gate bajó a 225 s, y una limpieza anterior sin freno no aguantó. El kit hoy empuja en sentido contrario: la plantilla de spec pide probar «en la costura existente más alta». Éxito: en un proyecto con camino crítico, una feature o un patch cerrados dejan en la base solo unitarios y filas de la lista, y la sesión nunca edita la lista. Fracaso aunque funcione: que el cierre borre un test que la persona quería conservar, o que la sesión pegue filas para no borrar.

## Scope

- Entra: `critical-path-template.md`; los campos «Camino crítico» y «Tests de feature» en `operations-template.md`; «Dónde se prueba» en `spec-template.md`; la propuesta de fila en `patch-template.md` §4; la regla de niveles y de tests de feature en `sdd-tdd` (núcleo y `writing-e2e.md`) y en el brief del implementador (`implementer-prompt.md`); el eje Código de `sdd-verify` (`code-reviewer-prompt.md` y la fila del encargo en `SKILL.md`); el cierre de `sdd-archive` (paso 1, `closing-suite.md`, `validation-modes.md` para la pregunta de la fila, el mensaje final) y su línea en `walkthrough-template.md`; la fila de `architecture.md`; los dos términos en el glosario de `PRODUCT.md`.
- No entra: el check, el pre-push y el hook (`sdd-project-template`, su 0105-0107); migrar «Flujos core» y «Títulos heredados» y la pregunta de `sdd-init` (0350); retirar «Lo afectado»; un check genérico en la CLI del kit.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «en la costura existente más alta, y cuantas menos costuras mejor» | `spec-template.md:93`; `feature-flow` «La spec dice dónde se prueba cada comportamiento» | delta, `MODIFIED`; decisión 6 |
| «a new E2E test that names none of the core flows» como Important siempre | `code-reviewer-prompt.md:113`; `verification` «El eje Código marca los E2E que no siguen la política del proyecto» | delta, `MODIFIED` |
| El encargo del eje Código con «Flujos core», «Retries» y «Timeouts» | `sdd-verify/SKILL.md:227`, `code-reviewer-prompt.md:32`; `verification` «La revisión final sale en ejes, en paralelo» | delta, `MODIFIED` |
| «Flujos core» como la lista que manda | `writing-e2e.md:13-19`, `closing-suite.md:3`, `e2e-suite.md:3`; `feature-flow` «Un test del proyecto compara…», «El test de títulos E2E nace…», «Una prueba de estrés…» | delta, `MODIFIED`; decisión 15 |
| El commit de cierre «con la documentación de cierre y los arreglos» | `commit-history` «El cierre de una feature queda en un commit» y «El patch queda en dos commits» | delta, `MODIFIED`; decisión 11 |

- Filas que implementa: nada: comprobado con `grep -n "camino crítico\|critical-path" ROADMAP.md .docs/sdd/steering/debt.md`

## Approach

- A: **la regla en el kit, el mecanismo en el proyecto.** El kit lee dos campos de `operations.md` y los prefijos del check; cada template o proyecto trae su check con los parsers de sus frameworks. Cuesta un contrato entre dos repos, ya acordado.
- B: un check genérico en la CLI del kit. Cuesta parsers de cada runner (xunit, Playwright, Vitest, pytest…) dentro del kit, que no sabe compilar ni listar cada uno.
- C: solo guía, sin check. Ya falló: la limpieza anterior no aguantó sin freno.
- Elegido: A — el freno existe y es del proyecto, que sabe listar sus tests; el kit decide cuándo se corre y qué hace con cada línea.

Cómo: en el paso 1 de `sdd-archive`, con «Camino crítico» declarado, el orden de la decisión 10; el borrado entra en el commit de cierre; tras `sdd merge --sync`, el check corre con la gate y sus avisos van al mensaje final. `sdd-tdd` y el brief del implementador dicen el nivel más bajo y que lo del alcance fuera de la lista es de usar y tirar. `sdd-verify` pasa «Camino crítico» al eje Código.

## Dónde se prueba

- «Dónde se prueba» en el nivel más bajo y con tests de feature: batería de `sdd-propose`, escenario nuevo de spec sobre el molde `reservas` con «Camino crítico» y un unitario del servicio de reservas que ya ve la regla, humo n = 1.
- El implementador escribe en el nivel más bajo y no toca la lista: batería de `sdd-implement`, escenario nuevo como `t1a` con «Camino crítico»; la fila mira `git diff --name-only` sobre `critical-path.md`.
- El eje Código: batería de `sdd-verify`, escenario nuevo como `f5` con «Camino crítico» y un test de componente que ya existe en el molde.
- El cierre: batería de `sdd-archive`, dos escenarios nuevos sobre el molde de `e1` con un check falso que imprime los prefijos: uno con un `fuera:`, un test modificado y una fila propuesta; otro con `ya-en-base:` traído por la base.
- Plantillas y topes: `cli/test/kit/` (copias de plantillas, `word-budget.test.ts`).

## Términos y ADR

- Términos resueltos: camino crítico — la lista de tests que se quedan en la base, `critical-path.md`, que edita una persona · test de feature — test de una suite del alcance fuera de la lista, que la rama añade y vive mientras dura la feature o el patch; se evita «test temporal»
- ADR candidatas: los tests de integración y E2E de una feature o un patch se borran al cerrar y solo la lista del camino crítico queda — alternativa descartada: conservarlos todos con un presupuesto de suite («Presupuesto E2E»)

## Delta de comportamiento

### Capacidad: `feature-flow`

#### MODIFIED — La spec dice dónde se prueba cada comportamiento (antes: "como los tests de reservas actuales")

- GIVEN una feature que añade cancelar una reserva por el endpoint y por la pantalla, en un proyecto cuyos tests de reservas van contra el endpoint
- WHEN el agente escribe la spec
- THEN la sección «Dónde se prueba» dice «cancelar reserva: por el endpoint, como los tests de reservas actuales; la pantalla, con una captura»
- AND si el proyecto ya tiene `ReservationServiceTests`, unitario, y la regla de cancelar la ve ese nivel, la línea nombra `ReservationServiceTests`, no el endpoint
- AND con «Camino crítico: `moon run root:critical-path` · cubre `backend:test`, `frontend:e2e`» en `operations.md`, cada test de esas suites que nombra la línea dice «de feature, se borra al cerrar» o «fila propuesta: <criterio>», y cada fila propuesta está también en el ✋

#### ADDED — Con camino crítico, la task escribe tests de feature y no toca la lista

- GIVEN `operations.md` con «Camino crítico» que cubre `backend:test`, de nivel `integración`, y `critical-path.md` con 41 filas
- WHEN una task añade un test de integración de `backend:test` para «exportar a PDF», y la spec no propone fila para él
- THEN el test se escribe y la task lo corre en su «Verificación»
- AND `git diff --name-only <merge-base>` de la rama no lista `critical-path.md`
- AND si la regla la ve un test unitario, la task escribe el unitario y no el de integración

#### MODIFIED — Un test del proyecto compara los títulos E2E con Flujos core

- GIVEN un proyecto con «Flujos core» declarados en `operations.md` §Testing y un `test(...)` cuyo título no está en la lista
- WHEN una task toca un E2E siguiendo la guía de `sdd-tdd`
- THEN deja un test en una suite que el cierre corre entera, que sale en rojo y nombra ese título
- AND con el título en la lista sale en verde
- AND sin E2E, no se pide ese test
- AND con «Camino crítico» en `operations.md`, no se pide ese test ni se lee «Flujos core»: la lista es `critical-path.md`

#### MODIFIED — El test de títulos E2E nace en verde y su lista de heredados solo encoge

- GIVEN una suite con 70 tests en 2 configs de Playwright, sin el test de títulos y con «Flujos core» sin declarar
- WHEN una task toca un E2E siguiendo la guía de `sdd-tdd`
- THEN `operations.md` lleva todos sus títulos en «Títulos heredados» y el test sale en verde
- AND con un `test('exporta a PDF')` nuevo, sale en rojo y nombra `exporta a PDF`
- AND con un bucle nuevo sobre `claro` y `oscuro` cuyo `test(...)` tiene de título una plantilla `pinta en ${t}`, sale en rojo y nombra `pinta en claro` y `pinta en oscuro`
- AND al borrar un test heredado, sale en rojo y nombra su título hasta que se quita su línea
- AND el título nuevo es propuesta para el ✋: la task no añade su línea a «Títulos heredados»
- AND con «Camino crítico» en `operations.md`, la task no escribe el test de títulos ni «Títulos heredados»

#### MODIFIED — El test de títulos lee los títulos que corre Playwright

- GIVEN una config con `grepInvert: /@slow/` que esconde 5 de 70 tests, y otra config con 34 tests en 2 `projects`
- WHEN corre el test de títulos
- THEN compara los 70 títulos de la primera y los 19 distintos de la segunda, salidos de `playwright test --list`
- AND sin arrancar servidor, `globalSetup` ni navegador
- AND si `--list` sale con un código distinto de 0, el test sale en rojo con el error de Playwright, no con una lista vacía
- AND con «Camino crítico» en `operations.md` no aplica: no hay test de títulos

#### MODIFIED — Una prueba de estrés no entra en la suite E2E del gate

- GIVEN un proyecto con «Flujos core» en `operations.md` §Testing, entre ellos «editar celdas de una hoja y que se guarden», y un gate de cierre que corre `playwright test` sobre `e2e/`
- WHEN una task pide una prueba de estrés de cinco sesiones editando la misma hoja a la vez
- THEN la prueba no queda en `e2e/` ni en ninguna suite que corra el gate de cierre, aunque ejerza un flujo core
- AND vive en una suite aparte con su propio comando, o se ejecuta como medida del smoke con su resultado en el walkthrough
- AND con «Camino crítico», lo mismo aunque ejerza un camino de `critical-path.md`

### Capacidad: `verification`

#### MODIFIED — La revisión final sale en ejes, en paralelo

- GIVEN un plan con `Ejecución: native`, todas sus tasks completas en el ledger, `Eje Arquitectura: no — solo texto de skills` y el commit `a1b2c3d` de su última task
- WHEN el hilo despacha la revisión final
- THEN con `sdd-parallel-agents` y en segundo plano salen dos revisores sobre `a1b2c3d`: el eje Spec con `sdd-kit:effort-high` + `opus` y el eje Código con `sdd-kit:effort-high` + `sonnet`, cada uno con su vigía de silencio
- AND el encargo de cada eje lleva la cabecera de `encargo-revision.md` («Code constraints»), su sección «How to review» y el encargo de su eje de `sdd-verify`
- AND el eje Spec recibe además las rutas de `spec.md` y `plan.md`, la sección `## Review Focus` del plan literal, la lista de ADR `accepted` de `sdd decision index --files <ficheros del diff>`, la salida de `sdd capability index` y el puntero a las líneas `Ruling:` y `minor (deferred)` del ledger; el eje Código, el paquete, «Flujos core», «Retries» y «Timeouts» de `operations.md` §Testing, literales, o `sin E2E declarados`, y la salida de `sdd review comments` en el worktree del revisor; el eje Arquitectura, el paquete y `architecture.md`
- AND con «Camino crítico» en `operations.md`, el eje Código recibe esa línea literal en lugar de «Flujos core», junto a «Retries» y «Timeouts»
- AND con `Eje Arquitectura: sí — <frontera>` sale además el eje Arquitectura, con `sdd-kit:effort-high` + `opus`
- AND con `control.maxParallelAgents: 2` y tres ejes, salen dos y el tercero cuando vuelve uno
- AND los ejes trabajan en el mismo worktree desanclado `review-<id>-a1b2c3d`
- AND un eje colgado se relanza solo, una vez, como dice «Vigía de silencio», y los demás siguen
- AND el hilo recibe los informes por eje y no fusiona ni reordena hallazgos de un eje con los de otro
- AND en `delegate`, si la spec aprobada lleva la línea `Política de modelos:` con esos ejes y las instrucciones del usuario piden confirmar antes de paralelizar, los despacha sin preguntar; un eje que la línea no nombra (el Arquitectura que sube el hilo) se confirma

#### MODIFIED — El eje Código marca los E2E que no siguen la política del proyecto

- GIVEN `operations.md` §Testing con tres flujos core (`0012-sum-row`, `0015-export-pdf` y `0018-invoice-status`), `Timeouts: por defecto` y `Retries: 0` en local
- AND un diff que añade `e2e/0024-remember-filter.spec.ts`, con un test que elige «cobrada» en «Estado», espera con `expect.poll(() => savedStatus(request))` y después sale de la pantalla, y otro que cuenta las cuatro opciones del desplegable, y sube `playwright.config.ts` a `timeout: 90_000` y `expect: { timeout: 20_000 }` sin motivo
- WHEN revisa el eje Código
- THEN marca Important que los dos tests no nombran ninguno de los flujos core
- AND marca Important los dos timeouts subidos sin motivo escrito en `operations.md`
- AND marca Important la espera a `savedStatus` entre elegir el estado y salir de la pantalla, sin motivo en un comentario
- AND con `sin E2E declarados` en el encargo no marca ninguno de los tres
- AND con «Camino crítico» en el encargo y `StatusSelect.test.ts`, de componente, ya en el repo, no marca que un E2E no nombre un flujo core: marca Important el test que cuenta las cuatro opciones, que ve `StatusSelect.test.ts`, y marca Important todo cambio del diff a `critical-path.md`

### Capacidad: `archive`

#### ADDED — Con camino crítico, el cierre pasa una vez los tests de feature, pregunta las filas propuestas y borra lo que añadió la rama

- GIVEN `operations.md` con «Camino crítico: `node scripts/critical-path.mjs` · cubre `e2e`, `unit`», `e2e` de nivel E2E y `unit` de nivel unitario en «Suites», y «Tests de feature: `node scripts/critical-path.mjs --extras --run`»
- AND una rama que añadió `e2e/export-pdf.spec.ts`, `e2e/share-pdf.spec.ts` y un test nuevo `exporta en A4` dentro de `e2e/print.spec.ts`, que ya tenía otros, y modificó `e2e/login.spec.ts`, que ya estaba en la base fuera de la lista; la spec propone fila para `share-pdf.spec.ts › comparte el PDF`
- WHEN el agente cierra la feature
- THEN en el paso de validación corre «Tests de feature» una vez y guarda su salida, y después el check
- AND pregunta sola «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `e2e/share-pdf.spec.ts › comparte el PDF`.», y sin respuesta no borra ese test
- AND «Tests de feature» pasa los tres tests añadidos y no `e2e/login.spec.ts`
- AND borra `e2e/export-pdf.spec.ts` y, de `e2e/print.spec.ts`, solo `exporta en A4`; no borra `e2e/login.spec.ts` ni ningún test de `unit`; el borrado va en el commit de cierre, y el 4.1 del walkthrough lista lo borrado con el resultado de esa pasada
- AND la suite del cierre corre sobre el árbol ya borrado, con el check en la gate, y un código distinto de 0 es rojo
- AND la sesión no escribe en `critical-path.md`
- AND con «Camino crítico» y `critical-path.md` ausente o sin filas, o con una línea `sin-base:` antes del borrado, para sin borrar nada y lo dice
- AND en un patch con el mismo proyecto, igual, con la fila propuesta de `patch.md` §4 y el borrado en su commit de cierre

#### ADDED — Tras el merge de sincronización, el cierre dice lo que la base trae fuera de la lista

- GIVEN el mismo proyecto, y una base que trae `e2e/comments.spec.ts` de otra rama, fuera de la lista
- WHEN la gate corre el check tras `sdd merge --sync`
- THEN el mensaje final nombra `e2e/comments.spec.ts` con su línea `ya-en-base:`, en un aviso que cuenta los `ya-en-base:` y nombra hasta diez
- AND no lo borra ni abre fila de deuda, y las líneas `lista-tocada:`, `fila-nueva:` y `freno-modificado:` van al mismo aviso

#### Reglas de la capacidad — archive

- **Dónde viven los datos**: la skill en `skills/sdd-archive/`; la receta del merge en `skills/sdd-archive/references/merge-recipe.md`; cuándo corre la suite del cierre y qué corre tras el merge de sincronización, en `skills/sdd-archive/references/closing-suite.md`; la comprobación de la revisión final, en `skills/sdd-archive/references/final-review-check.md`; qué corre, envía y registra cada modo de validación, en `skills/sdd-archive/references/validation-modes.md`; adónde va cada aprendizaje, en `skills/sdd-archive/references/learnings.md`; la de la validación del dev en `skills/sdd-archive/references/dev-validation.md`, con su panel en `validation-panel.js`, que guarda las marcas en el `localStorage` del navegador (`sdd-validation-<id>`) o, en el plan B, en `.temp/validation/<id>.json` del worktree; las ADR en `.docs/sdd/decisions/`; la deuda en `.docs/sdd/steering/debt.md`; la lista del camino crítico del proyecto en `.docs/sdd/steering/critical-path.md`, y su check y su alcance en «Camino crítico» y «Tests de feature» de `operations.md` §Testing
- **Límites**: tope de palabras de `sdd-archive`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez por árbol: en la validación o, con otra rama abierta o la base por delante, solo sobre el merge de sincronización; con «Camino crítico», «Tests de feature» corre una vez por cierre, antes del borrado, y el árbol de la suite del cierre es el ya borrado; corre enteras las suites unitarias y `pendiente` de «Suites», y el gate por lo afectado, o entero si la rama toca un fichero de «Sin filtro»; tras un rojo corren los tests que fallaron, los que no llegaron a correr y el gate con `--base <sha rojo>`, y con un arreglo solo de docs, solo los tests que fallaron; tras el merge de sincronización se repiten solo las tareas que tocan la rama y la base a la vez: con un gate filtrado, las que selecciona contra `<merge.into>` y también contra el sha de la última suite en verde; sin filtro, el gate entero si la base trae cambios fuera de `.docs/` que no sean `*.md`; si la base trae un fichero de «Sin filtro», el gate entero; el informe de rojo lleva las últimas 20 líneas; el aviso de `ya-en-base:` nombra hasta diez tests; una suite E2E que pasa de su «Presupuesto E2E», o sin presupuesto, una suite de más de 10 minutos, va a la deuda del proyecto; un sha citado es una cadena de 7 a 40 caracteres hexadecimales; los nombres `finishing-a-development-branch`, `sdd-end-feature` y `sdd-end-patch` solo aparecen en `skills/` en la línea de procedencia de `skills/sdd-archive/SKILL.md` y en las migraciones de versiones pasadas (v0.4.0, v2.0.0, v3.0.0)
- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la `<id>`».» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `Validado: <fecha> · panel: <n>/<n> OK · «listo»` · `no ensayado: <motivo>` · que la captura es la del momento de leer y la red no trae hora (panel en Chrome) · que la página del plan B no ve la app: sin consola, red ni captura del KO · `Panel: Chrome sobre <url de la app>` · `Panel: plan B en http://127.0.0.1:<puerto>/` · `Panel: no arrancó: <su error>` · `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>` · «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.» · «La base trae `<cuántos>` tests fuera de la lista (`ya-en-base:`): `<test>`[, …]. Recomiendo un patch que los borre; decide el dev-lead.» · «`Camino crítico` declarado sin `critical-path.md`: no borro nada.»
- **Regla ante conflicto**: un conflicto al integrar la base o al fusionar que `sdd merge` no resuelve lo resuelve una persona, salvo el que cae solo en Markdown y en el que los dos lados solo añaden o tocan filas distintas sin cambiar lo del otro, que lo resuelve el agente, repite el gate y lo nombra; un rojo que también falla sin la rama lo decide el dev-lead tras la búsqueda en la deuda; el merge a la rama estable, el tag y su push solo con la frase del dev-lead; la fila de la madre de una familia la cierra el dev-lead, no el cierre; el panel en Chrome va antes que el plan B, que solo sale sin Claude in Chrome, sin navegador conectado o con la inyección fallida; si lo que la persona dice en el chat contradice una marca del panel, manda lo que dice, y el agente lo registra con su frase; con «Camino crítico», `critical-path.md` manda sobre «Flujos core», solo la escribe una persona, y un test con fila propuesta sin respuesta no se borra, salvo en `unattended`, donde se borra y su propuesta va a la deuda

### Capacidad: `commit-history`

#### MODIFIED — El cierre de una feature queda en un commit

- GIVEN las tasks juntadas, la revisión final de rama hecha, el trabajo validado y la documentación de cierre de `sdd-archive` escrita
- WHEN el hilo va a hacer el merge del cierre
- THEN desde el commit de la última task la rama tiene un solo commit, con la documentación de cierre y los arreglos de la revisión final y de la validación
- AND con «Camino crítico» en `operations.md`, ese commit lleva también el borrado de los tests de feature
- AND una rama sin merges de sincronización tiene 2 + N commits desde el `merge-base`, con N tasks en el plan (3 en lite)
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama; el cierre no se vuelve a juntar
- AND antes de juntar, cada línea `Pasada de fix:`, `Re-revisión:` o `Revisión final:` de `tasks.md` cuyo sha cae en el tramo que se junta se reescribe sin sha: `Pasada de fix: 7ea5c37, 1 hallazgo RED→GREEN` pasa a `Pasada de fix: juntada en el cierre, 1 hallazgo RED→GREEN`, y `Re-revisión: 7ea5c37..21c1f70, sdd-kit:effort-high + opus, limpia` pasa a `Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, limpia`
- AND lo mismo con cualquier sha del tramo que cite `walkthrough.md`, `patch.md`, la deuda o una ADR de la rama: se reescribe sin sha o ese tramo no se junta
- AND tras el commit de cierre, `git merge-base --is-ancestor <sha> HEAD` sale bien para todo sha que citen `tasks.md`, `walkthrough.md`, `patch.md`, la deuda y las ADR de la rama

#### MODIFIED — El patch queda en dos commits

- GIVEN un patch con el fix verificado
- WHEN se cierra con `sdd-archive`
- THEN la rama tiene dos commits desde el `merge-base`: el fix (código, tests y `patch.md`) y el cierre (`patch.md` con el hash del fix y el tiempo, más changelog, roadmap, deuda y estimation-log si existen)
- AND con «Camino crítico» en `operations.md`, el commit de cierre lleva también el borrado de los tests de feature del fix
- AND el `commit:` de `patch.md` es el hash del commit del fix
- AND el commit del fix no toca la fila de deuda que el patch salda: la cierra el commit de cierre
- AND si el cierre necesita un merge de sincronización, va después del commit de cierre y es el último commit de la rama
- AND si el dev-lead fija otra forma de commits, manda la suya y el fix no se junta; un test en RED va en el commit de su arreglo o en uno posterior, y el RED queda registrado en `patch.md` §4

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-templates` (total) | 16.919 / 16.978 | 59 | 16.919 + ~200 (plantilla nueva, dos campos, «Dónde se prueba» y `patch-template.md` §4) + 2 % → 17.460 |
| `sdd-tdd` (total) | 4.036 / 4.036 | 0 | sin cambio: la regla sustituye texto de `writing-e2e.md` |
| `sdd-archive` (total) | 9.668 / 9.904 | 236 | sin cambio: ~200 palabras caben |
| `sdd-verify` (total) | 9.395 / 9.503 | 108 | sin cambio: ~60 palabras caben |
| `sdd-implement-subagent` (total) | 8.426 / 8.462 | 36 | sin cambio: ~30 palabras, sustituyendo |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 9 sujetos: `sdd-archive` 2 escenarios nuevos n = 2 (4 × 0,48, precio de `SCENARIOS="e1" N=2` → `suma: 2 sujetos · coste previsto: 0.95 $`) · `sdd-verify` 1 n = 2 (`SCENARIOS="f5" N=2` → `suma: 2 sujetos · coste previsto: 1.64 $`) · `sdd-implement` 1 n = 2 (`SCENARIOS="t1a" N=2` → `suma: 2 sujetos · coste previsto: 1.14 $`) · `sdd-propose` 1 n = 1 (~0,60) | 5,30 |
| GREEN | los mismos 9 | 5,30 |
| Una tanda de REFACTOR | los mismos 9 | 5,30 |
| Controles | 6 sujetos: `e1` y `g5` n = 2 (1,90) · `f5` n = 1 (0,82) · `t1a` n = 1 (0,57) | 3,29 |
| Medición tras la revisión final | 4 sujetos: un escenario nuevo por batería, n = 1 | 2,50 |
| Suma | 37 sujetos | 21,69 |

| Paso nuevo o cambiado | Escenario o motivo |
| --- | --- |
| `spec-template.md` «Dónde se prueba» | escenario nuevo de `sdd-propose` |
| `patch-template.md` §4, fila propuesta | no se mide: es un hueco de plantilla con la misma forma que el de la spec (Art. II, elemento omitido) |
| `operations-template.md`, «Camino crítico» y «Tests de feature» | no se mide: los leen los escenarios de `sdd-archive` y `sdd-verify` desde el molde |
| `critical-path-template.md` | no se mide: la escribe una persona; `cli/test/kit/` comprueba la copia |
| `walkthrough-template.md` 4.1 | fila del primer escenario nuevo de `sdd-archive` |
| `sdd-tdd` y `writing-e2e.md` | escenario nuevo de `sdd-implement` (el implementador carga `sdd-tdd`); en Native, la misma skill |
| `implementer-prompt.md` | escenario nuevo de `sdd-implement` |
| `sdd-verify` encargo y `code-reviewer-prompt.md` | escenario nuevo de `sdd-verify` |
| `sdd-archive` paso 1, `closing-suite.md`, `validation-modes.md`, mensaje final | dos escenarios nuevos de `sdd-archive` |
| `architecture.md`, fila del documento | no se mide: documento del repo, no lo sigue un agente |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-18 | aprobada: «vale, sigue» |
