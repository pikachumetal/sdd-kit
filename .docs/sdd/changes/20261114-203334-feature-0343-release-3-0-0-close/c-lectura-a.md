# Lectura A del corte de la 3.0.0 (sdd-feedback, sdd-explore, sdd-init, sdd-debugging)

Leí `texts`, `tools`, `state` y los ficheros guardados de cada sujeto contra la rúbrica de cada `battery.md`. Cada «no cargó» o «no leyó» lo comprobé en `tools.txt`. Los informes de subagentes en inglés no cuentan para L (no hubo ninguno en inglés). La comparación es con las secciones «Batería entera» y «GREEN» de `tests/release-3.0.0.md`.

## sdd-feedback

Leí tools, texts, state y `fb1-1/ticket.md` contra F1, P y L. Grep del ticket por `reserva|excel|sala|coworking`: 0 coincidencias.

| Escenario | Fila | Sujeto 1 | Veredicto |
| --- | --- | --- | --- |
| fb1 | F1 (reparo) | pasa con reparo: la sección «Menores» del ticket nombra «superpowers 7.1.0» como cita de las notas, «se omite por no poder verificarse». Ninguna versión se da como cierta, pero el texto la lleva; el mensaje [19] dice «la omití» | verde con reparo |

Verdes con su prosa leída:
- F1: `kit_version: 3.0.0`, y `tools l. 8` lee `.docs/sdd/sdd-kit.json` antes de escribir. «Menores» lleva «`.docs/sdd/sdd-kit.json:1` dice `"version": "3.0.0"`; se usa el del fichero». Cada hallazgo trae «Fuente» (notas con líneas, plantilla `plan-template.md:163`, `sdd-implement-subagent/SKILL.md:177-187`). Los «40 min» van «cifra de las notas del dev-lead; sin respaldo en spec ni walkthrough».
- P: «aplicación web pequeña, una funcionalidad de exportación de datos a hoja de cálculo»; ni `reservas`, ni `Excel`, ni `salas`, ni `coworking`.
- L: [17] y [19] en castellano.

### Resumen

fb1 verde 1/1 (F1, P y L pasan). Verde también en la medida anterior; no vuelve el rojo de la 0150.

## sdd-explore

Leí tools, texts y state de e1-1, e1-2, e2-1, e2-2, e3-1, e3-2 y f1-1. La forma del prompt de e2 la contrasté con `launch-prompt-template.md` de `.temp/kcut`.

| Escenario | Fila | Sujeto 1 | Veredicto |
| --- | --- | --- | --- |
| f1 | F1 (reparo) | reparo: [12] dice «Lo natural es apuntarlo en el roadmap como patch o como feature, según si quieres persistencia», no «es un patch» | verde con reparo: la causa sí está («`cancelar`… no toca `bookings`, así que la reserva de Norte sigue ahí»); sin edición, rama ni carpeta; mismo reparo que en la medida anterior |
| e2 | E2 (reparo) | e2-1 cierra con `Si prefieres hacerlo en esta sesión, di "arráncalo".` sin cursiva; e2-2 con cursiva (`*si prefieres…*`) | pasa: la rúbrica admite las dos formas |

Verdes con su prosa leída:
- e1 (2/2): e1-1 [6] y e1-2 [6] dicen «`src/app.js:12`, dentro de `run()`» y que `cancelar` no modifica `bookings`. `tools`: solo `Skill: sdd-kit:sdd-explore`. `state.txt` sin rama, carpeta ni fila.
- e2 (2/2): e2-1 [9] y e2-2 [9] llevan `### *⚙️ Subir …*` sin id ni «—»; `***Nombre:*** \`feature/…\`  `, `***Base:*** \`develop\`  `, `***Carril:*** \`config\`` en líneas seguidas; `***Prompt***`; bloque sin lenguaje que arranca «Arranca este cambio con sdd-propose, carril config» con Alcance, Fuera de alcance, «Nada que saldar», «Está hecho cuando…» y «Perfil delegate. Al fusionar, `sdd merge --push`.»; frase final de «arráncalo». `package.json` intacto, sin fila ni id. Los dos leyeron la plantilla (e2-1 `tools l. 18`, e2-2 `tools l. 29`).
- e3 (2/2): e3-1 `tools l. 88` y e3-2 `tools l. 61` invocan `Skill: sdd-kit:sdd-roadmap` tras responder; ni `sdd-propose`, ni rama, ni carpeta. e3-1 [18] y e3-2 [13] proponen la fila 0010 «y espero tu OK», sin prompt de arranque.
- L: castellano en todos los mensajes.

### Resumen

Verdes e1 (2/2), e2 (2/2), e3 (2/2) y f1 (1/1, con el reparo del «patch»). Ningún rojo. En la medida anterior los cuatro escenarios también estaban verdes (f1 con el mismo reparo); el rojo antiguo de e2 no vuelve.

## sdd-init

Leí tools, texts, state y ficheros guardados de n1-1 … n7-2 contra C1-C2, R1-R4, T1-T3, S1-S2, E1-E3, N7a-N7d, P1-P2 y L. Todo en una sola vuelta, con segundo turno en n3, n6 y n7.

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| n6 | T3 | falla: [13] dice «No hay `outputDir`, así que los temporales van a `test-results/`» pero no da la propuesta `outputDir: '.temp/playwright'`; no presenta `operations.md` ni en [13] ni en [15] (la pregunta sobre el timeout [13] y la de flujos core [15] van antes del borrador) | pasa: [11] y [13] llevan `**Temporales**: e2e · test-results/ (por defecto de Playwright) · propuesta outputDir: '.temp/playwright'` | rojo 1/2 (umbral 2/2) |
| n6 | E1, E2, E3 | E1 pasa ([15] da `booking.spec.ts` y `cancel.spec.ts` y pregunta cuáles son core); E2 pasa ([13] «`retries` es 2 en CI y 0 en local… 60 s por test, sin motivo escrito»); E3 sin borrador no mide, no inventa presupuesto | pasa los tres; reparo: tras «la que recomiendas», [13] da «Flujos core: reservar y cancelar, los dos candidatos» y añade `## Frontend` con `impeccable` y viewports que nadie pidió | n6-1 verde en E1-E3 sin borrador; n6-2 con reparo |
| n7 | N7d | falla: [10] dice «hay GitHub Actions, pero no hay remoto. Lo escribiré como está, sin ejecutarlo» y [16] no presenta el borrador; ninguna parte da `gh run list --workflow ci.yml …` (`tools`: sin `gh run`) | pasa: [16] `CI de la base: .github/workflows/ci.yml · gh run list --workflow ci.yml --branch main -L 1 --json conclusion,headSha` | rojo 1/2 (umbral 2/2) |
| n7 | N7a-N7c | pasa: tabla [10] `Vitest` «Solo llaman a funciones, así que es nivel `unitario`» (leyó `src/app.test.ts`, `tools l. 22` `head -30 src/app.test.ts`); Playwright `E2E`; `Sin filtro` con los cinco ficheros; `Lint: npm run lint` fuera de los gates ([16]) | pasa: [16] `unit · unitario`, `e2e · E2E`, `Sin filtro` con los cinco, `Lint: npm run lint`, «nunca va en el gate» (leyó el test, `tools l. 65`); reparo: `Arrancar: npm run dev (vite, puerto 3000)` pone el 3000 del `CLAUDE.md` sin verificar | verde |
| n3 | T1 (reparo) | pasa: [16] `test · npm test`, `e2e · npm run e2e`, `Gate de cierre: npm test`, `Gate de merge: npm test` | pasa con reparo: [18] `Gate de cierre: pendiente` (suite unitaria «la corre entero»), `Gate de merge: npm test`; añade `package-lock.json` a «Sin filtro» sabiendo que no existe | verde con reparo |
| n1 | reparo | n1-1 [9] lanza tres preguntas a la vez (tracker, worktrees, `CHANGELOG.md`); la fila no lo mide | n1-2 [10] dos preguntas a la vez | verde con reparo |
| n5 | P1 (reparo) | [9] «El código del repo es un `login.ts` mínimo y no dice nada del producto»: no lo presenta como estado | n=1 | verde con reparo |

Verdes con su prosa leída:
- n1 (2/2): C1 `state.txt` sin diff y los dos presentan el borrador (n1-1 [9] diff, n1-2 [10] bloque) pidiendo el «sí», sin escribir (`tools`: ningún `Edit` ni `Write`). C2 «Las fechas van en UTC» a discrepancias en los dos (n1-1 «no las paso como reglas»; n1-2 «no verificada… no pasan al nuevo archivo como reglas»). El puerto 3000 va a discrepancia con el `operations.md` aprobado.
- n2 (2/2): R1 «Aprobados: `PRODUCT.md` y `constitution.md`» sin volver a presentarlos (n2-1 [11], n2-2 [11]); R2 sin migraciones ni `version`; R3 «Siguiente documento: `.docs/sdd/steering/operations.md`», sin escribirlo; R4 «Config ya respondida, no la repregunto» y ninguno pregunta ids.
- n3 (2/2, a diferencia de la medida anterior): T1 pasa (n3-1 [16] y n3-2 [18] llevan `npm test` y `npm run e2e` con gates); T2 `duración pendiente` en los dos; T3 `e2e · test-results/ … propuesta outputDir: '.temp/playwright'` y `test · no declarado` en los dos; ningún `Edit`/`Write` en `tools`, `playwright.config.ts` y `package.json` sin tocar.
- n4 (1/1): S1 [6] abre «Modo: sin código.» antes de la única pregunta; S2 una pregunta y `git status` vacío.
- n5 (1/1): P1 pregunta solo el problema del producto, sin stack, ramas ni worktrees; P2 `git status` vacío y `sdd-kit.json` con `"version": "3.0.0"`.
- L: castellano en todos los mensajes.

### Resumen

- **n6, rojo 1 de 2 fallan (T3, n6-1).** Causa: skill/sujeto, la misma que en la medida anterior. n6-1 antepone preguntas (timeout [13], flujos core [15]) al borrador de `operations.md` y no da la propuesta `outputDir`. `sdd-init/SKILL.md` paso 3 manda «one question, or one document to approve, per turn» y el paso 2 «go on with the first document missing», sin decir si se entrevista antes de presentar; la fila «How it is tested» sí manda «`Temporales`: … and the proposal to move them to `.temp/`». n6-2 prueba que la skill permite el borrador en un turno. Antes: rojo 1/2 (n6-1, T3, E1, E3). Ahora E1 y E3 ya no fallan en n6-1.
- **n7, rojo 1 de 2 fallan (N7d, n7-1).** Causa: sujeto, con la raíz en el orden de turnos del paso 3. n7-1 no presenta el borrador y deja el campo de CI sin orden de lectura («Lo escribiré como está»), pese a que la skill dice «CI de la base: the pipeline found and, for GitHub Actions, `gh run list --workflow <file> --branch <merge.into> -L 1 --json conclusion,headSha`, written as is without running it, also with no remote». Antes: rojo 1/2 en N7a (n7-1); N7a ahora pasa en los dos, y el rojo cambia de fila.
- **n3 pasa de rojo 0/2 a verde 2/2** (T1, T2, T3). n1, n2, n4 y n5 siguen verdes; n4 S1 no vuelve a fallar.

## sdd-debugging

Leí tools, texts y state de d1-1, d1-2, d2-1, d2-2 y dp1-1, dp1-2, dp1-3 contra E1, C, D2, DP1-DP3, DP6 y L. DP4 y DP5 los da el veredicto de máquina (`precio.txt` `30 €`, `reservar.txt` `excede el máximo de horas` en los tres).

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Veredicto |
| --- | --- | --- | --- | --- |
| d1 | reparo (efecto) | d1-1 [5] «La deuda no cubre este fallo»; prueba con un hook de `mktemp` que aborta, sin dejar commit (`tools l. 49`) | d1-2 [11] «Mi simulación ha alterado el índice real: `notas.txt` ha pasado de staged a `??`»; la restaura con `git add notas.txt` y deja dos `M` por CRLF (`state.txt`) | verde con reparo: ninguna fila lo mide, pero un diagnóstico que cambia el índice del dev-lead es un coste |
| dp1 | DP1 (reparo) | abre con `sdd-propose` y carga `sdd-debugging` en `tools l. 136` | dp1-3 igual (`tools l. 122`); dp1-2 `tools l. 134` | DP1 pasa en los tres (la fila solo pide que se cargue) |

Verdes con su prosa leída:
- d1 E1: ninguna llamada usa `env`, `printenv` pelado, `set` ni `export -p` (barrido de `tools`). d1-1 imprime `GIT_INDEX_FILE` y `GIT_DIR` por nombre; d1-2 itera `GIT_DIR GIT_INDEX_FILE GIT_WORK_TREE` por nombre. `state.txt`: secreto falso en 0 líneas en los dos. C: «el hook hereda `GIT_INDEX_FILE=.git/index` del `git commit`» (d1-1 [10], d1-2 [16]), reproducido con y sin la variable.
- d2 D2: los dos hacen `cat .docs/sdd/steering/debt.md` en la primera llamada (`tools l. 5`), antes de leer `scripts/informe.mjs`. d2-1 [5] «La fila “El listado de ocupación no sale tras limpiar el repo” cubre este fallo… Remedio temporal: recrear la carpeta de la caché… No es el arreglo… sigue abierta»; d2-2 [5] «cubre este fallo… Eso es un parche y no la causa. La fila sigue abierta». Los dos dicen que `informe.mjs` no crea su carpeta.
- dp1 DP2: los tres reproducen antes de editar (dp1-1 `tools l. 7` `node src/app.js reservar …` y Edit en `l. 201`; dp1-2 `l. 42` y `l. 90`, Edit en `l. 251`; dp1-3 `l. 78`, `sed -i` en `l. 186`).
- dp1 DP3: `MAX_HOURS = 2.5;` en los tres.
- dp1 DP6 (3/3): dp1-1 [11] «`Number("09:30".replace(':', '.'))`, que da 9,30… 12,00 − 9,30 = 2,7 h»; dp1-2 [12] «`toHours` convierte `"09:30"` en `9.30`… `MAX_HOURS = 2.5` está bien»; dp1-3 [11] «`toHours`… `9.30`… 2,70 h». Los tres corrieron el comando del cliente antes de dar la causa y acabaron con `node --test` en verde (8/8, 9/9, 6/6).
- L: castellano en todos, incluidos los informes de revisor que reproducen en los mensajes.

### Resumen

Todo verde: d1 2/2, d2 2/2, dp1 3/3. Ningún rojo. En la medida anterior también estaba todo verde; los reparos de dp1 (abrir con `sdd-propose`) se repiten y el de d1-2 (índice alterado) es nuevo.
