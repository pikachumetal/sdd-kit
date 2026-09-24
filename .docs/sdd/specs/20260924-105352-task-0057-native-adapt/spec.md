---
id: 20260924-105352-task-0057-native-adapt
task: 0057
parent: 0055
title: Adaptar el kit a Native — bucle de task, revisión final, cambio a SDD tras compactar e historia de commits
mode: full
status: approved
created: 2026-09-24
author: Claude (Opus 5.5), dev-lead Àngel Delgado
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-09-24
---

# Spec — Adaptar el kit a Native

## Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED (task-flow, commit-history), tres capacidades (task-flow, control-profiles, commit-history) y, en el límite, contrato público (la forma de la línea `Ejecución` del plan): 3 de 8, por debajo del umbral de 4; sin datos, sin dependencia externa, área leída en esta sesión y en la tabla de la 0055
- Dominio: comprobaría que el cambio a SDD tras compactar no contradice «el método vale para el plan entero» de la 0055
- Técnica: comprobaría que el orden «comparar RED → commit → task-done» encaja con lo que escribe task-done en el ledger
- Mínimo razonable: ninguna — el repaso de coherencia lo hago yo y la revisión final de rama (Opus) ve el diff entero
```

1. **La task sigue entera** (dev-lead, primera pregunta: «ya venimos de partir la tarea»). El frente con más riesgo es el cambio a SDD tras compactar: si su GREEN no encuentra una forma que funcione, se cierra como deuda medida y no bloquea los demás.
2. **Punto de partida: la tabla de lectura de la 0055** ([`lectura-superpowers-641.md`](../20260924-082516-task-0055-native-default/red/lectura-superpowers-641.md)), filas E1–E7, E9, E10, E12–E15, T1, S2, S3, S5 y C1. Veredicto de cada una en esta task:
   - **Entran**: E1/E2 (cargar `executing-plans` y su ledger; base comprobada antes de **cada** task), E13/E14 (RED apartados y comparados; orden del cierre de task), E5 (techo y effort del revisor final), E9 (minors diferidos al walkthrough), E10/S2 (cambio a SDD tras compactar), E15 (`cygpath` también para `task-start`), C1 (paso 9 de `sdd-end-task`).
   - **Ya resueltas sin texto nuevo**: E3 (el comando de `task-done` es el de «Verificación»), E6 y R2 («Declined to judge»: rulings, y una línea que cambia la salida observable ya es freno de alcance en `control-profiles.md`), S5 (la sección «Verificación» ya sustituye la suite del implementador).
   - **Fuera**: E7 (un solo pase de fix sin re-revisión) → es de la 0032, que ya lleva la re-revisión acotada del commit posterior a la revisión final. S3 (controlador anidado) → YAGNI: el cambio a SDD reusa el ledger y no necesita un orquestador. E12 (releer «De código» tras compactar) y T1 (override de «the project's suite defines green») → el RED no los separa: en T1, el sujeto que corrió la suite entera lo atribuyó al `pre-commit` y no a TDD (1/2), y E12 no se mide sin una compactación real. Van a deuda con su disparador. E11 (modelo de la sesión) → 0058.
3. **Cambio a SDD tras compactar: la señal es la compactación ya ocurrida y la regla viaja en el plan.** El agente no ve un contador de contexto, pero sí el texto con el que Claude Code retoma una sesión compactada («This session is being continued from a previous conversation that ran out of context»). En el RED, 2 de 2 sujetos retomados así **no volvieron a cargar ninguna skill**: leyeron `plan.md` y el ledger y siguieron en Native. Una regla que solo vive en el `SKILL.md` no llega; por eso va en la línea `Ejecución` del plan, que se relee siempre. Umbral: **quedan dos o más tasks**; con una sola, cambiar de ejecutor cuesta más que terminarla. Las otras dos señales candidatas de la 0055 se descartan: «N tasks hechas» es un número sin fundamento y «tamaño del plan al empezar» ya es el criterio del handoff.
4. **Revisor final en Native: Opus con effort high** (`subagent_type: sdd-kit:effort-high` + `model: opus`), el techo que la 0055 pasó a esta task frente al «most capable available model» de `executing-plans`. Entra en el Art. IV. En el RED, 2 de 2 despacharon Sonnet sin effort, siguiendo la política de subagentes del plan.
5. **Comprobar el tipo `sdd-kit:effort-*` antes del primer despacho** (ticket 0053 §1): **entra**. La 0055 no lo reprodujo en un despacho de implementador SDD con el `Modelo` escrito; aquí sí: en Native el primer despacho es el revisor final, que ningún campo `Modelo` declara, y 2 de 2 sujetos, en una sesión sin esos agentes, despacharon sin effort y sin decirlo. La regla va donde se despacha el revisor final y vale para cualquier primer despacho.
6. **Base comprobada antes de cada task, no solo la primera.** Hoy el paso 6 lo ata a «antes de despachar un implementador», que en Native no ocurre: 2 de 2 sujetos la comprobaron una vez, al empezar, y ninguno antes de la Task 2.
7. **RED en Native**: el hilo escribe los tests de los THEN al empezar la task, antes del código (2/2 ya lo hacen por TDD), **aparta una copia** y la compara con `git diff --no-index` antes del commit de la task (0/2). En Native el mismo agente escribe el test y el código; la copia es lo único que prueba que no se tocó el test para que pasara.
8. **Ledger de `executing-plans`**: 0 de 2 sujetos de `n1` crearon el ledger ni usaron `task-start` y `task-done` (uno ni cargó la skill): llevaron el registro solo en `tasks.md`. El paso 6 en Native nombra la skill y sus dos scripts. Es lo que hace recuperable una sesión compactada (decisión 3).
9. **Orden del cierre de una task Native**: comparar los RED → commit de la task (uno solo, con el mensaje del hito) → `task-done`. `task-done` escribe en el ledger el `HEAD` del momento: si se juntara después, el ledger apuntaría a un commit que ya no está en la rama (fila E13).
10. **Paso 9 de `sdd-end-task`** (fila C1): hoy dice «code-review solo si la task se ejecutó en línea», y Native es en línea, así que pediría una segunda revisión de rama. Pasa a **comprobar** que la revisión final ocurrió —línea `Final` en el ledger o informe del revisor— y con qué modelo; solo sin revisión final se lanza `requesting-code-review`. Medido por texto, sin sujetos en el RED.
11. **«Deferred minors» al walkthrough** (fila E9): el paso 1 de `sdd-end-task` nombra solo los «Rulings I made» de `subagent-driven-development`; pasa a nombrar también los de `executing-plans` y sus «Deferred minors». Medido por texto.
12. **`cygpath` también para `task-start`** (fila E15): sonda en Git Bash, [`red/sonda-task-start.txt`](red/sonda-task-start.txt): la ruta del brief sale en forma POSIX, como la de `sdd-workspace`. Se amplía la fila de overrides y el requisito vigente de `task-flow`.
13. **Huecos de `commit-milestones.md`**, medidos en SDD (en Native se dan por construcción: el hilo escribe sus commits y el RED de cada task al empezarla, 2/2 en `n1`):
   - **mensaje del hito con un solo commit** (ticket 0044 §3): **entra**. RED `s1`, 2 de 2 dejaron el cuerpo sin tildes del implementador («un solo commit, nada que juntar»);
   - **la apertura se junta antes de escribir los RED, y un RED en el árbol se aparta para commitear** (ticket 0031 §1): **entra**. RED `s2`, 1 de 2 escribió el RED con la apertura aún en dos commits sin juntar;
   - **los RED de una sola task en el disco** (ticket 0053 §3): **no entra, aunque el enunciado lo metía**: es la única pieza en la que me aparto de tu enunciado, y es por el Art. I. 2 de 2 escribieron solo el de la Task 1 aunque las dos tasks comparten fichero. Sin fallo no hay guía (Art. I); vuelve a la deuda técnica con su disparador (el hilo adelanta los RED de varias tasks).
14. **No toco el paso 2 de `sdd-start-task` ni los ficheros de la 0059** (`Get-NextSddId.ps1`, `nombrado.md`, `sdd-start-patch`, `sdd-start-release`), que corre en paralelo.
15. **Campaña del Art. I**, dentro de la previsión y el techo comunes de la 0055 (~50 $, techo 65 $; la 0055 gastó 5,83 $), declarada antes del primer sujeto: **esta task, ~20 sujetos, ~30 $ y ~3 h**. RED previo: 10 sujetos (`n1`, `n2`, `n4`, `s1`, `s2`, ×2), 3,63 $. GREEN previsto: los mismos cinco escenarios ×2, más el control de `n4` sin compactación ×1, el cierre Native (paso 9 y minors) ×2 y la medida que pide la fila de la 0055 («en `delegate` no para por el método», molde sin el hueco de «libres», hasta la Task 1) ×2: 15 sujetos, ~12 $. Con el GREEN, la campaña 0055–0058 quedaría en ~21 $ y a la 0058 le quedarían ~44 $ hasta el techo.
16. **La 0057 se ejecuta a sí misma en Native si el handoff lo recomienda**, y el walkthrough cuenta cómo fue: es la validación en uso de la 0055.

### Decisiones tomadas con el dev-lead

- No partir la task — «ya venimos de partir la tarea, entiendo que ya no la partimos, me puedes rebatir» (no se le rebatió), 2026-09-24.
- Perfil `delegate`, con parada en la spec — «delegate, paro en la spec (Recomendada)», 2026-09-24.
- Entran los dos huecos de `commit-milestones.md` (0044 §3, 0031 §1), los RED de varias tasks en un fichero (0053 §3; el RED no lo reproduce y sale por el Art. I, decisión 13) y la comprobación del tipo `sdd-kit:effort-*` (0053 §1); Art. I proporcional con previsión y techo comunes; un commit por hito; avisos de fase en llano — enunciado de la task, 2026-09-24.

## Evidencia del RED previo

Detalle en [`tests/native-adapt-red.md`](../../../../tests/native-adapt-red.md). Kit: esta rama en `33d32d1` (= `develop`).

| Conducta nueva | Resultado con el kit actual |
| --- | --- |
| En Native, el hilo usa el ledger de `executing-plans` (`task-start` / `task-done`) | **Falla 2/2** (`n1`): registro solo en `tasks.md`; uno ni cargó `executing-plans` |
| La base se comprueba antes de cada task | **Falla 2/2** (`n1`): una vez, antes de la Task 1 |
| El RED de la task se aparta y se compara antes de cerrarla | **Falla 2/2** (`n1`): escrito antes del código, sin copia ni `git diff --no-index` |
| Tras una compactación con dos o más tasks pendientes, las que quedan van con SDD | **Falla 2/2** (`n4`): siguen en Native sin volver a cargar ninguna skill; leen `plan.md` y el ledger |
| El revisor final en Native va con Opus y `effort-high` | **Falla 2/2** (`n2`): Sonnet, sin tipo de effort |
| Sin el tipo `sdd-kit:effort-*`, se dice antes del despacho | **Falla 2/2** (`n2`): despachan sin effort y no lo dicen |
| El encargo del revisor final lleva la cabecera y «Cómo revisar» | **Pasa 2/2** (`n2`): sin guía |
| Mensaje del hito reescrito con un solo commit (SDD) | **Falla 2/2** (`s1`): «un solo commit, nada que juntar»; queda el cuerpo sin tildes |
| La apertura se junta antes de escribir los RED (SDD, `pre-commit` con suite) | **Falla 1/2** (`s2`): `s2-2` escribe el RED con la apertura en dos commits; `s2-1` la junta antes «porque el `pre-commit` corre `node --test` sobre los ficheros sin seguimiento» |
| En el disco, solo los RED de la task que se despacha (SDD) | **Pasa 2/2** (`s2`): sin guía |
| Paso 9 de `sdd-end-task`: con revisión final de Native, no se lanza otra | **Falla, por texto** (paso 9: «solo si la task se ejecutó en línea») |
| «Deferred minors» de Native en el walkthrough | **Falla, por texto** (paso 1 nombra solo SDD) |
| `task-start` imprime la ruta del brief en forma POSIX | **Sonda**: sí (`/tmp/claude/…`) |

## Intent

La 0055 dejó que el handoff de `writing-plans` elija Native, pero el paso 6 del kit sigue escrito para despachar implementadores. En Native, los sujetos no usan el ledger, comprueban la base una vez, no apartan sus RED y despachan el revisor final con el modelo de los subagentes y sin effort. Tras una compactación siguen en Native sin releer ninguna skill. Se quiere que una task Native conserve lo que el kit exige en SDD (base, RED de otra mano o comparados, revisión final con techo) con las piezas de `executing-plans`, y que el plan diga cuándo pasar a SDD.

## Scope

- Entra:
  - `sdd-start-task` paso 6: un párrafo «En Native» (skill y scripts, base antes de cada task, RED apartados, orden del cierre de task, revisor final con techo y comprobación del tipo); y la comprobación del tipo antes del primer despacho en SDD;
  - `sdd-start-task` paso 5: la línea `Ejecución` lleva la regla del cambio tras compactar;
  - `plan-template.md`: la misma regla en la cabecera `Ejecución`;
  - `overrides-superpowers.md`: filas de `executing-plans` (revisor final, cambio de método) y de las rutas en Windows (`task-start`);
  - `commit-milestones.md`: disparador del hito en Native, mensaje del hito con un solo commit, apertura juntada antes de los RED y RED en el árbol frente al `pre-commit`;
  - `encargo-revision.md`, «Revisor final»: modelo y effort del despacho;
  - `sdd-end-task` pasos 1 y 9;
  - Art. IV (techo del revisor final);
  - evidencia RED y GREEN.
- No entra:
  - el paso 2 de `sdd-start-task` y los ficheros de la 0059;
  - E7 (pase de fix sin re-revisión): 0032;
  - los RED de varias tasks a la vez en un fichero (ticket 0053 §3): el RED no reproduce el fallo, vuelve a deuda;
  - el controlador anidado (S3);
  - releer «De código» tras compactar (E12) y el override de «the project's suite defines green» (T1): sin fallo separado en el RED, a deuda;
  - el modelo de la sesión en Native y el A/B: 0058.

## Approach

El kit adopta `executing-plans` entero (Art. IX.1) y añade solo lo que el RED muestra que falta (Art. IX.3). Cada regla va al fichero que ya es su fuente y, si gobierna una decisión, al paso que la ejecuta: el bucle y el revisor final, al paso 6; la historia de commits, a `commit-milestones.md`; el cambio de método, a la cabecera del plan, porque es lo único que se relee tras compactar.

**Texto nuevo del Art. IV**, que se añade tras «`fable` y `opus xhigh` siguen prohibidos por defecto, con justificación escrita en la task.»:

> El revisor final de rama de una ejecución Native, que `executing-plans` pide en «the most capable available model», va con Opus y effort high (`sdd-kit:effort-high`): es el techo por defecto.

**Forma de la línea `Ejecución`** con `native`:

> `Ejecución: native, porque <motivo del plan>. Si retomas este plan tras una compactación y quedan dos o más tasks, sigue con subagent-driven-development sobre el mismo ledger.`

## Delta de comportamiento

### Capacidad: `task-flow`

**ADDED — Una task Native se registra en el ledger de `executing-plans`**
- GIVEN un plan con `Ejecución: native`
- WHEN el hilo ejecuta cada task
- THEN la abre con `task-start` y la cierra con `task-done` y el comando de su «Verificación», y el ledger del workspace tiene su línea `Task <N>: complete`

**ADDED — La base se comprueba antes de cada task Native**
- GIVEN un plan con `Ejecución: native` y dos o más tasks
- WHEN el hilo va a empezar cada task
- THEN antes compara la fila de la task y los ficheros de la task con la base, como antes de despachar un implementador

**ADDED — Los RED de una task Native se apartan y se comparan**
- GIVEN una task de un plan con `Ejecución: native`
- WHEN el hilo la empieza
- THEN escribe los tests de sus THEN antes del código y guarda una copia fuera del repo
- AND antes del commit de la task compara la copia con el test con `git diff --no-index`, y un cambio que no sea de formato es un ruling del ledger

**ADDED — El revisor final de Native va con el techo del kit**
- GIVEN un plan con `Ejecución: native` con todas sus tasks completas en el ledger
- WHEN el hilo despacha el revisor final de rama
- THEN el despacho lleva `subagent_type: sdd-kit:effort-high` y `model: opus`
- AND el encargo lleva la cabecera de `encargo-revision.md` y su sección «Cómo revisar»

**ADDED — Sin el tipo de effort, se dice antes del primer despacho**
- GIVEN una sesión cuyos tipos de agente no incluyen el `sdd-kit:effort-<nivel>` que toca
- WHEN el hilo va a hacer el primer despacho de la task (implementador en SDD, revisor final en Native)
- THEN antes de despachar dice que el tipo falta, despacha con el `model` y la frase de respaldo «effort: no disponible en este harness, hereda el de la sesión», y lo registra como ruling

**ADDED — El cierre no repite la revisión final de Native**
- GIVEN una task Native cuyo ledger registra la revisión final de rama
- WHEN se ejecuta el paso 9 de `sdd-end-task`
- THEN no lanza otra revisión: comprueba que hubo revisión final y con qué modelo
- AND solo sin revisión final registrada lanza `requesting-code-review`

**ADDED — Los minors diferidos llegan al walkthrough**
- GIVEN una task Native con líneas `Final: minor (deferred)` en el ledger
- WHEN se escribe el walkthrough
- THEN «Decisiones tomadas sin el dev-lead» lleva los «Rulings I made» y los «Deferred minors» del mensaje final de `executing-plans`

**MODIFIED — En Windows, el workspace de ejecución se usa en su ruta Windows** (antes: solo `sdd-workspace` y `task-brief`)
- GIVEN Windows y la ruta que imprimen `sdd-workspace`, `task-brief` o `task-start` de superpowers en forma POSIX (empieza por `/`, por ejemplo `/tmp/claude/…` o `/d/code/…`)
- WHEN el agente va a escribir o leer por primera vez en ese workspace (el ledger, un brief, un informe)
- THEN usa la ruta que da `cygpath -w`, y el `Write` no pide un permiso que un sujeto sin usuario no puede conceder

### Capacidad: `control-profiles`

**ADDED — Tras una compactación, lo que queda de un plan Native va con SDD**
- GIVEN un plan con `Ejecución: native`, una sesión retomada tras una compactación y dos o más tasks sin su línea `complete` en el ledger
- WHEN el hilo retoma la ejecución
- THEN sigue con `subagent-driven-development` sobre el mismo ledger y lo registra como ruling, sin parar en `delegate` ni en `unattended`
- AND con una sola task pendiente, o sin compactación, sigue en Native

### Capacidad: `commit-history`

**MODIFIED — Cada task del plan queda en un commit** (antes: el disparador era solo la revisión de la task, y con un solo commit el mensaje quedaba como estaba)
- GIVEN la task N con uno o más commits desde el BASE que el hilo apuntó al empezarla, y su revisión limpia (SDD) o su contrato de cierre cumplido (Native)
- WHEN el hilo va a empezar o despachar la task siguiente, o la revisión final de rama (en Native, antes de `task-done`)
- THEN desde ese BASE la rama tiene un solo commit, con los tests RED, la implementación, los arreglos de la revisión y la evidencia de la task
- AND el mensaje de ese commit lo escribe el hilo con la convención del proyecto, también cuando el rango ya tenía un solo commit
- AND el hash que `tasks.md` apunta para la task N es el de ese commit, escrito en el commit del hito siguiente

**ADDED — Un RED sin commitear no tumba los commits del hilo**
- GIVEN un repo con un `pre-commit` que ejecuta la suite y un plan SDD
- WHEN el hilo prepara el despacho de una task
- THEN la apertura (o el hito anterior) ya está en su commit antes de escribir los RED
- AND si el hilo tiene que commitear con un RED en el árbol, lo aparta antes y lo devuelve después, sin `--no-verify`

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-09-24 | aprobada: «ok» |
