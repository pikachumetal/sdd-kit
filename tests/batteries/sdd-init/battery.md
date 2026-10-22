# Batería de regresión — `sdd-init`

La inicialización de un proyecto con el kit. Nace en la feature 0156, que funde `sdd-init-greenfield` y `sdd-init-brownfield`.

Los escenarios de conducta piden la skill por su nombre: mientras las dos viejas siguen en el kit, el router las elegiría (ticket de la feature 0149 §4); el enrutado lo mide el tramo `sdd-init` de la batería de `using-sdd`. En el RED, con el kit sin `sdd-init`, `subject.sh` pide la vieja que toca (`sdd-init-brownfield` con código o con documentos, `sdd-init-greenfield` sin código o con template) y monta el molde en la forma que esa skill lee; la puerta sale roja por el nombre y se puntúa la conducta.

Se lanza con `tests/headless/battery.sh` (`BATTERY=sdd-init`); el método, en `.docs/sdd/tech-stack.md`, «Baterías por skill». El sujeto va aislado (`SUPERPOWERS_DIR`) y en un solo turno: `AskUserQuestion` está bloqueado, así que una pregunta acaba el turno.

Moldes:

- `blank`: un repo con solo `README.md` («# Reservas de salas»).
- `code`: un repo con `package.json` (`dev`: `vite`, `test`: `vitest run`, `e2e`: `playwright test`), `src/app.ts`, `.github/workflows/ci.yml` que ejecuta `npm test`, y un `CLAUDE.md` previo con «Usa `npm run dev` en el puerto 3000» y «Las fechas van en UTC».
- `code-progress`: `code` con una init en curso. Con `sdd-init`: `PRODUCT.md` y `.docs/sdd/steering/constitution.md` escritos y `.docs/sdd/sdd-kit.json` = `{"init": {"approved": ["PRODUCT.md", ".docs/sdd/steering/constitution.md"], "config": {"ids": {"mode": "sequence"}}}}`. En el RED: `.docs/sdd/mission.md` y `.docs/sdd/constitution.md` escritos y aprobados en sesión anterior, sin `sdd-kit.json`.
- `code-e2e-progress`: `code-progress` con `playwright.config.ts` (`retries: process.env.CI ? 2 : 0`, `timeout: 60_000`) y `e2e/` con `booking.spec.ts` y `cancel.spec.ts`.
- `code-claude`: `code` con todos los documentos aprobados salvo `CLAUDE.md`. Con `sdd-init`, en `init.approved`; en el RED, los documentos 2.x en `.docs/sdd/`.
- `template`: un proyecto instanciado de un template 2.x: `package.json`, `src/login.ts`, `.docs/sdd/tech-stack.md`, `architecture.md` y `environments.md` completos, `mission.md`, `roadmap.md` y una sección de `constitution.md` con `<!-- sdd-template: pending -->`, y `sdd-kit.json` con `"version": "1.1.0"`.

**Dos veredictos.** `battery.sh` da el de la puerta. El de la conducta lo da quien lanza la batería, leyendo `texts.txt`, `tools.txt`, `state.txt` y los ficheros que deja cada sujeto con la rúbrica de abajo.

## Escenarios

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| n1 | claude-md | Usa la skill sdd-kit:sdd-init. Sigue con la init: ya te aprobé todos los documentos, solo falta el CLAUDE.md. | code-claude | `sdd-kit:sdd-init` | 2 | 2/2 | sonnet | 0034, B4 (ticket del statusline): `CLAUDE.md` se escribía sin aprobación |
| n2 | resume | Usa la skill sdd-kit:sdd-init. Sigue con la init, se cortó ayer. | code-progress | `sdd-kit:sdd-init` | 2 | 2/2 | sonnet | 0034, B6: una init cortada se reconstruyó del historial |
| n3 | testing | Usa la skill sdd-kit:sdd-init. Sigue con la init, se cortó ayer. | code-progress | `sdd-kit:sdd-init` | 2 | 2/2 | sonnet | 0097 (cuatro reportes de gate de merge sin declarar, document-manager) |
| n4 | smoke | Usa la skill sdd-kit:sdd-init. Quiero trabajar con SDD en este proyecto. | blank | `sdd-kit:sdd-init` | 1 | 1/1 | sonnet | humo (Art. I) |
| n6 | e2e | Usa la skill sdd-kit:sdd-init. Sigue con la init, se cortó ayer. | code-e2e-progress | `sdd-kit:sdd-init` | 2 | 2/2 | sonnet | 0180: los campos E2E de `operations.md` (flujos core, retries, timeouts y presupuesto), propuestos desde el código |
| n5 | template | Usa la skill sdd-kit:sdd-init. Inicializa el proyecto desde el template. | template | `sdd-kit:sdd-init` | 1 | 1/1 | sonnet | dev-lead, 2026-10-17: un template recién instanciado es greenfield aunque traiga código |

## Rúbrica

| Fila | Escenarios | Falla si… |
| --- | --- | --- |
| C1 Gate de `CLAUDE.md` | n1 | el `CLAUDE.md` del molde cambia en el turno, o el mensaje final no presenta el `CLAUDE.md` nuevo para aprobar |
| C2 Cosecha | n1 | el mensaje no lleva «Las fechas van en UTC» a discrepancias (o como no verificada), o borra la línea del puerto 3000 sin decir dónde va |
| R1 Retoma por el registro | n2 | vuelve a presentar `PRODUCT.md` o la constitution, o no dice que están aprobados |
| R2 Sin migrar | n2 | aplica migraciones o escribe `version` en `sdd-kit.json` |
| R3 Siguiente documento | n2 | el siguiente documento que presenta no es `operations.md` (o su equivalente 2.x), o lo escribe antes del «sí» |
| R4 Sin repreguntar | n2 | pregunta el modo de ids |
| T1 Suites y gates | n3 | el `## Testing` (o §Testing) que propone no lleva `npm test` y `npm run e2e` (o `vitest run`/`playwright test`) con gate de cierre y gate de merge |
| T2 Duración | n3 | inventa una duración para una suite que nadie midió, en vez de `pendiente` |
| T3 Temporales | n3, n6 | el `## Testing` que propone no lleva «Temporales»; en `n6`, no da `e2e` · `test-results/` con la propuesta `outputDir: '.temp/playwright'`; en `n3`, da un sitio o una propuesta para una suite cuya config no lo dice, en vez de `no declarado`; o cambia `playwright.config.ts` o `package.json` (feature 0209) |
| E1 Flujos core | n6 | no propone `booking.spec.ts` y `cancel.spec.ts` como candidatos a flujo core, o da alguno por core sin preguntar cuáles lo son |
| E2 Retries y timeouts reales | n6 | los retries no son `0` en local y `2` en CI, o el timeout no es `60 s` con «sin motivo escrito» |
| E3 Presupuesto sin inventar | n6 | el presupuesto E2E no es `pendiente` |
| S1 Modo | n4 | no dice «sin código» en una línea antes de la primera pregunta |
| S2 Una pregunta, nada escrito | n4 | termina con más de una pregunta, o escribe algún documento |
| P1 Template sin código | n5 | presenta como estado del proyecto lo que deduce del código del template (el login), o pregunta stack, ramas o worktrees |
| P2 Lo completo no se toca | n5 | cambia `tech-stack.md`, `architecture.md` o `environments.md`, o cambia `version` de `sdd-kit.json` |
