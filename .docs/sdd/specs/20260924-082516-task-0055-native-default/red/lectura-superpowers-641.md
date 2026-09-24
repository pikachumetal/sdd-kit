# Lectura determinista — superpowers 6.4.1 frente al kit (task 0055, 2026-09-24)

Medición leyendo, sin sujetos. Fuente: `~/.claude/plugins/cache/claude-plugins-official/superpowers/6.4.1/` (skills enteras + `RELEASE-NOTES.md` + `using-superpowers/references/claude-code-tools.md`). Kit: `develop` en `5019471`.

Veredicto: **A** = se adopta tal cual (el kit lo cita, no lo copia) · **S** = el kit sobrescribe · **A+** = se adopta y el kit añade una pieza por hueco demostrado (Art. IX.3) · **?** = decisión para la spec.

## writing-plans

| # | Qué dice superpowers | Qué dice hoy el kit | Veredicto | Por qué |
| --- | --- | --- | --- | --- |
| W1 | Execution Handoff: ofrece Subagent-driven y Native, «recommend <uno>, because <one sentence from the plan: interdependencia, cuántas tasks, coste de un error>». Si el método ya se dio, «use the preserved method» y solo pide revisar el plan | `overrides-superpowers.md`: «No se pregunta el método ni se ofrece Native»; el método lo fija el kit (SDD) | **A** la recomendación · **S** el momento | Decidido por el dev-lead: el método lo elige el handoff. Lo que el kit sobrescribe es *dónde para*: `pair` dentro del gate del plan; `delegate`/`unattended` sin parada, recomendación escrita en el plan (`Ejecución: <método>, porque…`). `execution: native|subagent` en `sdd-kit.json` cuenta como «método ya dado» |
| W2 | «You review the saved plan before anything runs» (#2258): la revisión del plan es obligatoria aunque el método ya esté dado | Tabla de gates: plan sin gate en `delegate` y `unattended` | **S** (se mantiene) | La tabla de gates es del kit (Art. IX.2). Lo que protege W2 (aprobar un alcance ≠ aprobar un plan que no existe) el kit lo cubre con el gate de la spec y la comprobación escenario → task. Debe quedar explícito en overrides: es un choque directo |
| W3 | Sección **Review Focus**: hasta 5 clases de entrada que la spec implica y ningún test ejerce; cada una con su test en la task dueña; viaja literal al revisor final | `plan-template.md` no la tiene (la 0026 aplazó el frente (b)) | **A** (plantilla nueva) · **?** quién escribe esos tests | Es donde superpowers midió el crash que todos los implementadores enviaron. En el kit los RED salen de los THEN; los de Review Focus no tienen THEN: decidir si los escribe el hilo igual que los RED |
| W4 | Cabecera del plan: «REQUIRED SUB-SKILL: subagent-driven-development (recommended) or executing-plans» | `plan-template.md`: «Ejecución: subagent-driven-development (default del kit); en línea solo si lo declara con motivo» | **S** | La cabecera nombra el método elegido en W1; el campo `Ejecución` por task desaparece o pasa a ser del plan entero |
| W5 | Global Constraints: una línea por requisito, copiado literal | Dos bloques, «De código» (viaja) y «De proceso» (no viaja) | **S** (se mantiene) | Medido en `proportional-review-red.md` R1 |
| W6 | Task Right-Sizing: la task es la unidad más pequeña que merece la puerta de un revisor | Sin equivalente | **A** | No choca |
| W7 | Guardar en `docs/superpowers/plans/` | `.docs/sdd/specs/` | **S** (se mantiene) | Art. IV |

## executing-plans (Native)

| # | Qué dice superpowers | Qué dice hoy el kit | Veredicto | Por qué |
| --- | --- | --- | --- | --- |
| E1 | Setup: worktree, `sdd-workspace` + ledger **compartido con SDD**, leer plan y spec, pre-flight de Interfaces, cargar TDD antes de la Task 1 | 0 apariciones de `executing-plans` en `skills/` | **A+** | Se adopta entero. El kit añade lo que ya añade a SDD: `env:setup` si hay `environments.md`, `cygpath -w` (los `task-start`/`task-done` son bash e imprimen rutas POSIX, sin medir en Windows) |
| E2 | Bucle: `task-start` (brief + BASE), pasos TDD, comparar cada `Expected:`, rulings al ledger | Paso 6: comprobación de la base (fila y ficheros) **antes de despachar**; tests RED del hilo antes del despacho | **A+** | La comprobación de la base pasa a «antes de empezar cada task», con cualquier método. Los RED: en Native el mismo agente escribe test y código; el kit añade la copia apartada y `git diff --no-index` al cerrar la task (hueco demostrado en `tests-red-hilo-red.md`: código y test de la misma mano) |
| E3 | Contrato de cierre + `task-done … -- <test command the brief names>` | Campo «Verificación» por task | **A** | El comando de `task-done` es el de «Verificación». Coinciden |
| E4 | Commit «as the plan's commit steps say»; varios commits por task valen | `commit-milestones.md`: se junta **al quedar limpia la revisión** del hito | **S** | En Native no hay revisión por task: el disparador del juntado pasa a ser `task-done` en verde. Los dos huecos: con un solo commit el hilo reescribe el mensaje (0044 §3); RED de varias tasks en un fichero (0053 §3) y RED sin commitear frente al pre-commit (0031 §1) **desaparecen en Native** si cada task escribe su RED al empezar y lo commitea con su código: en SDD siguen |
| E5 | Revisión final: `review-package`, **modelo más capaz**, `code-reviewer.md` con Review Focus literal y el puntero a los `Ruling:` | `encargo-revision.md`: cabecera «Restricciones de código» + «Cómo revisar»; Art. IV prohíbe `fable` y `opus xhigh` por defecto | **A+** · **?** qué es «el más capaz» | La cabecera del kit sigue (hueco medido en E3 de `gates-reviews`). «Most capable» choca con el Art. IV: la spec fija el techo (p. ej. Opus effort high) |
| E6 | «Declined to judge»: cada línea es un ruling del ejecutor; re-grado por efecto en una persona razonable | Paso 7: una decisión del usuario que deja la revisión final se pregunta sola | **A** · **S** en un caso | Una línea que cambia la salida observable es un freno de alcance del kit (para en `pair`/`delegate`), no un ruling. 0026 midió 2/2 que se presentan bien |
| E7 | **Un único pase de fix** hecho por el propio ejecutor, cada fix RED→GREEN + suite entera; **sin re-revisión** | `control-profiles`: todo commit del hilo entra en una revisión; roadmap 0032: re-revisión acotada del commit posterior a la revisión final | **?** | Choque directo. Superpowers: el test que falló primero ya prueba el fix. La 0014 tuvo un Critical en un commit posterior a la revisión final (que no tenía test). Lo decide la spec; la 0032 se re-evalúa tras la 0055 |
| E8 | Cuatro paradas y solo cuatro; sin «¿sigo?» entre tasks | Tabla de gates: `pair` para tras cada task; frenos de alcance como quinta parada; desvío | **S** (se mantiene) | Ya está en overrides para SDD; se extiende a Native con las mismas palabras |
| E9 | Finish: «Rulings I made» + «Deferred minors», borrar workspace, `finishing-a-development-branch` | Walkthrough «Decisiones tomadas sin el dev-lead» (rulings de SDD) | **A** | Se añaden los minors diferidos como fuente del walkthrough |
| E10 | «Prefer SDD when … the plan is long enough that its later tasks would run on a compacted context»; ledger compartido para cambiar de ejecutor a mitad | Nada | **A+** · **?** la señal | El agente no ve un contador. Señales observables candidatas: (1) una compactación ya ocurrida (el contexto empieza por el resumen de continuación); (2) N tasks hechas en la sesión; (3) tamaño del plan al empezar. Se mide cuál sirve |
| E11 | «Runs well on a mid-tier session model» | Art. IV: la política de modelos es la de SDD (subagentes); nada del modelo de la sesión | **?** | En Native el implementador es la sesión: el kit no puede fijar su modelo, solo aconsejarlo. Coste en dinero: lo mide el A/B |

### Scripts `task-start` y `task-done`

| # | Qué hace el script | Qué dice hoy el kit | Veredicto | Por qué |
| --- | --- | --- | --- | --- |
| E12 | `task-start PLAN N`: llama a `task-brief` de SDD por `bash` e imprime `brief:` y `base:` (= `HEAD` en ese momento) | Paso 6: el bloque «De código» viaja porque `task-brief` extrae solo el texto de la task | **A+** | En Native nadie despacha, pero el hueco sigue: el setup lee las Global Constraints una vez y, tras una compactación, la sesión solo relee el brief. Las restricciones no están en él |
| E13 | `task-done PLAN N BASE -- <cmd>`: ejecuta el comando sobre el **árbol de trabajo**, guarda el log en `<workspace>/task-N-tests.log`, imprime 5 líneas y, solo en verde, añade `Task N: complete (commits <base7>..<head7>, tests: <cmd> → <última línea>)` | `commit-milestones.md`: el ledger apunta `BASE..<hash juntado>` | **S** en el orden | `head7` es el `HEAD` del momento: si se junta después de `task-done`, el ledger apunta a un commit que ya no está en la rama. Con Native, primero se junta y después `task-done`. El script no comprueba cambios sin commitear: prueba el árbol y registra `HEAD` |
| E14 | Solo registra en verde; no compara nada más | RED apartados: copia fuera del repo y `git diff --no-index` | **A+** | El `git diff --no-index` de los RED va antes de `task-done`: es lo único del cierre de la task que el script no hace |
| E15 | Los dos son bash, y la prosa de `executing-plans` dice «Run this skill's `scripts/task-start`» sin `bash` delante (la de SDD sí lo pone desde #2301) | Override `cygpath -w` para `sdd-workspace` y `task-brief` | **A+** · sin medir | En Windows: se invocan con `bash <ruta>` y la ruta del brief sale en forma POSIX, así que aplica el mismo `cygpath`. `task-done` escribe el ledger desde bash y no pasa por `Write`. Falta una sonda en Git Bash sobre un plan del kit |

## subagent-driven-development

| # | Qué dice superpowers | Qué dice hoy el kit | Veredicto | Por qué |
| --- | --- | --- | --- | --- |
| S1 | Solo de SDD: implementador por task, revisor de task, bucle de fix de 5 rondas, `task-brief`, lotes de misma forma, modelo por rol | `overrides-superpowers.md` y paso 6 lo tratan como el default | **A** (como excepción) | Pasa a ser el método de las tasks grandes. Siguen solo para SDD: «De código» en cada encargo, «Verificación» en lugar de la suite, tests RED del hilo antes del despacho, comprobar el tipo `sdd-kit:effort-<nivel>` (ticket 0053 §1) |
| S2 | Cambio de método a mitad de plan: mismo workspace, mismo ledger, «the new one resumes from the same ledger» | Nada | **A** | El mecanismo existe; el kit solo añade cuándo (E10) |
| S3 | Controlador anidado (`claude-code-tools.md`): opt-in, un orquestador en gama media con el plan entero, ~½ coste y reloj; releva «Rulings I made» literal | Nada | **?** | Encaja con E10: el cambio a SDD tras una compactación saca la coordinación de la sesión compactada. Es opt-in en superpowers; decidir si el kit lo usa en el cambio a mitad o lo deja fuera (YAGNI) |
| S4 | Model Selection: modelo explícito, gama media de suelo, «most capable» para la revisión final | Art. IV cita esta política y añade effort explícito y la prohibición de `fable`/`opus xhigh` | **S** (se mantiene) | Coincide salvo el techo (ver E5) |
| S5 | `implementer-prompt.md`: «run the full suite once before committing» | Sección `## Verificación` de `encargo-revision.md` | **S** (se mantiene) | Medido en `task-verification-red.md` |

## brainstorming

| # | Qué dice superpowers | Qué dice hoy el kit | Veredicto | Por qué |
| --- | --- | --- | --- | --- |
| B1 | HARD-GATE architectural: aprobar la spec escrita, «then reviews the written implementation plan and selects its execution method» | overrides: sin gate del plan en `delegate`/`unattended`; no se pregunta el método | **S** (reformulado) | Mismo choque que W1+W2: en `pair` el gate del plan incluye el método; en los otros dos, el agente elige y lo escribe |
| B2 | «Establish Shared Understanding»: descubrir intención, devolver lo entendido separando lo dicho de lo supuesto, invitar a corregir antes del diseño. «When the request already supplies the purpose and constraints, reflect that understanding instead of asking» | Primera pregunta (carril, modo, perfil, partición) sola; gate de la spec con «Decisiones que he tomado yo» | **A** · **?** con la spec delegada | Sin fallo aislado en 0026 (e). Con la spec aprobada por delegación, devolver lo entendido no puede convertirse en una parada: va a la spec como «Lo que entiendo» |
| B3 | Clasificación spike / bounded / architectural | Override: se anuncia; `bounded` no quita la spec | **S** (se mantiene) | Sin cambio |

## requesting-code-review / code-reviewer.md

| # | Qué dice superpowers | Qué dice hoy el kit | Veredicto | Por qué |
| --- | --- | --- | --- | --- |
| R1 | «The spec is a vision document»: lo que la spec calla se juzga por lo que esperaría una persona razonable, y se gradúa por su efecto | `encargo-revision.md` no lo toca | **A** | No choca: la cabecera del kit va antes de la plantilla y la plantilla lo trae |
| R2 | «Declined to judge»: lista antes del veredicto; el ejecutor decide cada línea | Nada propio | **A** | Ver E6 |
| R3 | Da comandos `git diff` y pregunta «All tests passing?» | «Cómo revisar»: lee el paquete, no ejecutes suite | **S** (se mantiene) | Medido en `proportional-review-red.md` R2 |

## test-driven-development

| # | Qué dice superpowers | Qué dice hoy el kit | Veredicto | Por qué |
| --- | --- | --- | --- | --- |
| T1 | «The project's suite defines green»: correr el comando de tests del proyecto aunque la task nombre un solo fichero (11/12 sondas solo corrieron su fichero) | Verificación por superficies de la task; gate completo una vez, en la validación final | **S** · **hueco nuevo en Native** | En SDD el override llega por el encargo del implementador. En Native no hay encargo: la sesión carga TDD en el setup y lo leerá tal cual. El override tiene que decirse en el paso de ejecución Native (el plan ya lo dice con «Verificación», pero TDD lo contradice). El riesgo que cubre superpowers lo paga el gate final |

## sdd-end-task

| # | Qué dice hoy | Veredicto | Por qué |
| --- | --- | --- | --- |
| C1 | Paso 9: code-review solo si la task fue en línea | **S** | Native ya lanza la revisión final de rama: el paso 9 duplicaría. Pasa a comprobar que la revisión final ocurrió (y con qué modelo) |

## Decisiones abiertas para la spec (las «?»)

1. W3: quién escribe los tests de Review Focus.
2. E5/S4: techo de modelo del revisor final («most capable» frente al Art. IV).
3. E7: re-revisión tras el pase de fix, o el test que falló primero basta.
4. E10/S3: señal observable del cambio a SDD y si lo corre un controlador anidado.
5. E11: consejo de modelo y effort para la sesión en Native.
6. B2: «Lo que entiendo» con la spec delegada.
7. E13/E14: orden del cierre de una task Native: comparar los RED, juntar los commits y después `task-done`.
