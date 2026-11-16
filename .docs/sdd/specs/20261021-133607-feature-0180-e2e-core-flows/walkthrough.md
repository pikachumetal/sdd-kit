---
id: 20261021-133607-feature-0180-e2e-core-flows
feature: 0180
title: Walkthrough — E2E: flujos core, presupuesto y cómo se escribe un E2E
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-21
---

# Walkthrough — E2E: flujos core, presupuesto y cómo se escribe un E2E

## 1. Cambios realizados

- **Partida** al arrancar, con 11 piezas en siete superficies: esta lleva (a), (b), (c), (g), (j) y (k); la 0207 lleva (d), (e), (h) e (i), y la 0208 lleva (f), el antiguo B14, `startEnvironment` y la redacción de la 0060 (commit de apertura `7c42c2e5`).
- **Task 1 — `operations.md` declara los flujos core y la política de la suite E2E** (`99780955`):
  - `operations-template.md` §Testing gana, solo con E2E, «Flujos core», «Presupuesto E2E», «Retries», «Timeouts», «Entorno de la suite» y «Datos», y «Acceso a la aplicación» nombra el usuario del agente.
  - La fila «How it is tested» de `sdd-init` los propone desde el código.
  - La fila «Testing» de `migrations/v3.0.0.md` los añade a un proyecto con E2E.
- **Task 2 — `skills/sdd-tdd/references/writing-e2e.md`** (`a7f30faf`), en inglés, con siete reglas y su tabla de racionalizaciones; `sdd-tdd` la nombra junto a `writing-good-tests.md`. Los datos de Playwright (30 s y 5 s por defecto, sin retries, `test.fixme`, `--repeat-each`, `waitForTimeout` desaconsejado) se comprobaron en sus docs.
- **Task 3 — recortada** (`c0adadd4`): el RED de los scripts de verificación desechables salió limpio, y el dev-lead aprobó la enmienda.
- **Pasada de fix de la revisión final** (juntada en el commit de cierre):
  - la capacidad `migration` gana su requisito;
  - `n6` y `n3` en la batería de `sdd-init`, y `v3` en la de `sdd-upgrade`, con los moldes `code-e2e-progress` y `v2x-e2e`;
  - los arreglos que esas baterías destaparon (la suite `e2e` sin tests en la init, los literales en la migración);
  - los Minor de los dos ejes.
- Evidencia: [tests/e2e-writing-red.md](../../../../tests/e2e-writing-red.md) y [tests/e2e-writing-green.md](../../../../tests/e2e-writing-green.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 2,80 h — reloj de la sesión 3,62 h desde 2026-10-21T13:30Z, sin 49 min de espera al dev-lead (6 esperas)
- Desviación: −1,2 h (−30 %)
- Causa de la desviación: dentro del umbral. La Task 3 se recortó por su RED, y los sujetos salieron más baratos que lo previsto (0,2-0,5 $ y pocos minutos cada uno). Lo que alargó fueron las dos vueltas de las baterías que pidió la revisión final.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 80.308.959 — claude-opus-5-5 80.308.959
- Tokens de subagentes: 6.597.463 en 3 despachos — Final review — Spec axis claude-opus-5-5 3.049.226 / 6 min; Final review — Code axis claude-sonnet-5-5 1.879.643 / 3 min; Re-review final 0180 claude-opus-5-5 1.668.594 / 3 min
- Coste de la sesión: 28,11 $ (hilo 24,37 $ + subagentes 3,73 $)
- Coste de sujetos: 7,73 $ en 27 sujetos Sonnet (más la persona Haiku de `i1`) — RED previo 1,17 $; `i1` 1,15 $; RED de `r3` 0,30 $ y de `r3b` 0,35 $; GREEN de la Task 2 1,91 $; RED de `r4` 0,86 $; baterías 1,99 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- **Task 3 recortada** por enmienda: el RED de `r4` salió limpio 2 de 2 («Recorta (Recomendada)»).
- **El triaje de un test inestable se mantuvo** aunque su RED salió limpio 4 de 4 (`r3`, y `r3b` con el log sin la causa a la vista): excepción al Art. I por decisión del dev-lead («No, mantenlo»).
- **`r3b`**, una variante de `r3` que no estaba en el plan, se lanzó porque el log de `r3` daba la causa hecha.
- **Enmienda de la revisión final**: la capacidad `migration` y las baterías de `sdd-init` y `sdd-upgrade` («Enmienda y baterías (Recomendada)»); el techo de sujetos pasó de 22 a 25 y después a 28 («Sí, techo 28 (Recomendada)»).

### Decisiones tomadas sin el dev-lead

- El humo `i1` y todo el GREEN corrieron sobre una copia del working tree, no sobre un `git archive` del commit — el commit de cada task va después de su verificación — coste si está mal: un kit que difiere en lo no commiteado.
- El flujo core de la persona de `i1` es «marcar una factura como cobrada»: el molde no tiene un E2E de emitir — ninguno.
- Los ejemplos de las reglas 2 y 3 de `writing-e2e.md` van en el dominio de reservas, no en el del molde; el de `typeInCell` se queda por decisión del dev-lead, y el GREEN del tecleo tras Enter queda contaminado por él — un GREEN de la regla 4 que mide copia.
- El solape de «Entorno de la suite» con `## Entornos`, y de los dos «Acceso», se queda: son lectores y momentos distintos — el mismo comando escrito en dos sitios.
- La política de retries y timeouts vive en tres textos (regla 6, plantilla y fila de la init), y cada uno lo lee un agente distinto — deriva al cambiar la política.
- La espera interna legítima no tiene escenario que la observe — la referencia corrige de más una espera válida y nadie lo ve hasta el campo.
- **Re-revisión, Important**: la fila «Testing» de la migración enumera 4 de los 6 campos E2E y V13 no lo mide. Espera a la 0207, en su fila del roadmap — un proyecto que migre antes de la 0207 sale sin «Entorno de la suite» ni «Datos» (la 3.0.0 no está publicada).
- La tabla de racionalizaciones de `writing-e2e.md` usa la forma sin argumentos de `test.fixme()`: a la 0207 — un agente copia la forma que ejecuta el test.
- El literal «60 s por test, sin motivo escrito» de la migración se queda, porque el valor sale de la config — un proyecto con 120 s podría escribir 60 s.
- «neither» para tres opciones en `writing-e2e.md` se queda — nada observable.
- `v3` (pasada 2) escribió el comando E2E como Runner de `## Entornos`: ruido del molde, sin rúbrica — lo verá la batería de release.
- E3 de `n6` pasa en vacío; el presupuesto lo cubre `i1` — la batería no ve esa regresión.

## 4. Verificación

### 4.1 Builds

- Baseline al arrancar: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → kit 1338, cli 1120, min 1415 y slow 295, sin fallos (sobre `7c42c2e5`).
- Suite completa sobre la pasada de fix con los borradores del cierre: 974 s. Pasan kit 1347/1347, cli 1122/1122 y min 1417/1417; slow 294/295 con 1 fallo: `cli/test/ids/claim.slow.test.ts` › «renumbers when another clone published the id» (la remota del fixture no tenía la fila renumerada). La re-revisión corría a la vez. El mismo fichero, solo, pasa 29/29 en la rama y 29/29 en `develop` (`f7b66abb`). La rama no toca `cli/`. Es la deuda «Dos tests lentos ajenos…», parcial desde la 0204: fallos sueltos de git con la máquina cargada. La suite del cierre se repite antes del merge (ver el mensaje final).
- Pester de cada task: `AnchorTemplates.Tests.ps1` + `WordBudget.Tests.ps1` 149/149; `FrontendVerification.Tests.ps1` + `WordBudget` 88/88.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-21 · revisión final Spec y Código sobre `c0adadd4`, pasada de fix (en el cierre) y re-revisión con 1 Important y 5 Minor adjudicados · 27 sujetos (RED y GREEN de `r1`, `r3` y `r3b`, control `r2`, humo `i1`, baterías `n3`, `n6` y `v3`) · suite con 1 rojo transitorio ajeno, contrastado (4.1).

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| onboarding · `operations-template.md` mantiene sus cuatro secciones, §Testing y §Frontend | suite (`AnchorTemplates.Tests.ps1`) | pasa |
| onboarding · §Testing pide, con E2E, flujos core, presupuesto, retries, timeouts, entorno y datos, y el usuario del agente | suite (doce campos en negrita y `no aplica`; mutante en rojo) | pasa |
| onboarding · la init propone los candidatos y pregunta cuáles son core | ejecución real (`i1`; `n6` ×2) | pasa |
| onboarding · `Retries: 0 en local; 2 en CI`, `Timeouts: 60 s por test, sin motivo escrito`, `Presupuesto E2E: pendiente` | ejecución real (`i1`; `n6` ×2) | pasa |
| onboarding · sin E2E no pregunta nada de esto | ejecución real (`n3` ×2, pasada 2: la suite `e2e` sin campos E2E) | pasa |
| feature-flow · entre Ctrl+C y el clic derecho, ninguna espera interna | ejecución real (GREEN `r1` ×2) | pasa |
| feature-flow · tras Enter espera al editor antes de teclear | ejecución real (GREEN `r1` ×2; contaminado por el ejemplo, ver §3) | pasa |
| feature-flow · sin `waitForTimeout` ni retries o timeouts subidos | ejecución real (GREEN `r1` ×2) | pasa |
| feature-flow · una espera interna lleva su motivo, y «sin esperarlo…» no cuenta | no probado (ningún sujeto tuvo una espera legítima; ruling) | no probado |
| feature-flow · un E2E inestable: repite solo ese test, nombra la causa y la arregla | ejecución real (GREEN `r3` ×2 y `r3b` ×2) | pasa |
| feature-flow · si no la arregla, `test.fixme()` con su issue | ejecución real (`r3b-1` lo propone; ninguno lo necesitó) | pasa en parte |
| feature-flow · no sube retries ni timeouts | ejecución real (GREEN `r3` y `r3b`, 4 de 4) | pasa |
| migration · `operations.md` lleva los campos E2E con los literales | ejecución real (`v3`, pasada 2) | **falla en parte**: 4 de 6 campos («Entorno de la suite» y «Datos» faltan); ruling a la 0207 |
| migration · los flujos core, los que nombra el dev-lead; sin E2E, §Testing tal cual | ejecución real (`v3`: `e2e/booking.spec.ts`); la parte sin E2E, no probado | pasa / no probado |

### 4.3 Residuales / deuda generada

- A la fila 0207: la fila «Testing» de la migración con los seis campos E2E y V13 ampliada, y la forma de `test.fixme()` de la tabla de racionalizaciones.
- Segundo caso para la deuda de los fallos sueltos de git con la máquina cargada: el push de `sdd id claim` no llegó a la remota del fixture en la suite completa (4.1).

## 5. Aprendizajes

- Una fila de rúbrica que mira solo una parte del THEN da verde con el THEN roto: V13 miraba 4 de los 6 campos y no vio que la pasada 2 de `v3` perdía dos → `tech-stack.md`, «Baterías por skill».
- Los sujetos que arrancan la aplicación del molde (`r4`) levantan servidores en la máquina del dev-lead: se comprueban los puertos antes y después de la tanda → `tech-stack.md`, «Sujetos headless».
- Un RED limpio puede ser un log que da la causa hecha (`r3`, `Received: "234.5"`): la variante con la causa escondida (`r3b`) es la que decide el recorte. Ya lo cubre «Un baseline limpio…» de `tech-stack.md`: esta feature es un caso más, sin texto nuevo.

## 6. Adendas
