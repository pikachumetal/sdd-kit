# Evidencia RED — Adaptar el kit a Native (task 0057, 2026-09-24)

RED previo a la spec (Art. I y `tech-stack.md`), sobre `feature/0057` en `33d32d1` (= `develop`) con superpowers **6.4.1** instalado.

**Previsión y techo**: los comunes a las tasks 0055, 0057 y 0058, unos 50 $ con **techo en 65 $** (dev-lead, 2026-09-24). La parte de esta task se declaró en el chat antes del primer sujeto: unos 20 sujetos, unos 30 $ y unas 3 h. El lanzador común, [`red/run.sh`](../.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/run.sh), es una copia del de la 0055: suma el coste de las carpetas de las tres tasks y para al llegar al techo o si existe el fichero `stop`.

## Método

- **Punto de partida**: la tabla de lectura de superpowers 6.4.1 de la 0055, [`lectura-superpowers-641.md`](../.docs/sdd/specs/20260924-082516-task-0055-native-default/red/lectura-superpowers-641.md), filas E1–E15, T1, S2, S3, S5 y C1. No se rehace.
- **Sujetos**: Sonnet headless (`claude -p`) sobre el molde `salas` de la 0044, con un `pre-commit` que corre `node --test` sobre el árbol, ficheros sin seguimiento incluidos. El molde de la 0057, [`red/mold.sh`](../.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/mold.sh), añade el hook, un plan con `Ejecución: native`, un plan de cuatro tasks y el estado de las Tasks 1 y 2 hechas con su ledger. Lanzadores: [`red/subject.sh`](../.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/subject.sh) (Native) y [`red/subject-sdd.sh`](../.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/subject-sdd.sh) (SDD). Salidas en `red/out/`.
- **Copia del kit**: `HEAD` con `agents/` para `n1`, `n4`, `s1` y `s2`, y sin `agents/` para `n2`. En `n2` la sesión no tiene los tipos `sdd-kit:effort-*`.
- **Sonda E15**, sin sujeto: `task-start` en Git Bash sobre el plan Native del molde, [`red/sonda-task-start.txt`](../.docs/sdd/specs/20260924-105352-task-0057-native-adapt/red/sonda-task-start.txt).
- **Por texto**: el paso 9 y el paso 1 de `sdd-end-task`, leídos contra lo que hace `executing-plans`.

## Escenarios

| Escenario | Estado del molde | Petición |
| --- | --- | --- |
| `n1` | Apertura commiteada y plan Native de dos tasks | Ejecutar las Tasks 1 y 2 y parar antes de la revisión final |
| `n2` | Tasks 1 y 2 hechas, cada una en su commit y con su línea `complete` en el ledger | Revisión final de rama; parar con el informe del revisor |
| `n4` | Plan Native de cuatro tasks, con la 1 y la 2 hechas en el ledger | La sesión retoma tras una compactación: el prompt empieza con el texto con que Claude Code retoma una sesión compactada, más un resumen. Parar al completar la Task 3 |
| `s1` | Plan SDD; la Task 1 en un solo commit del implementador, con el cuerpo sin tildes; ledger con «review clean» | Cerrar el hito de la Task 1 y parar antes de despachar la Task 2 |
| `s2` | Plan SDD con la apertura en dos commits sin juntar y los RED de las dos tasks en el mismo fichero | Preparar el despacho de la Task 1 y parar antes de lanzarlo |

## Resultados por conducta

| Conducta nueva | Evidencia | Resultado con el kit actual |
| --- | --- | --- |
| En Native, el hilo lleva el ledger de `executing-plans` (`task-start` / `task-done`) | `n1-1` carga `executing-plans`, pero ni crea el ledger ni ejecuta sus scripts. `n1-2` ni carga la skill. Los dos llevan el registro solo en `tasks.md` («No he creado el ledger de `.superpowers/`. El registro durable es `tasks.md`») | **Falla 2/2** |
| La base se comprueba antes de cada task | Los dos lanzan `git diff $(git merge-base HEAD develop) develop` una vez, antes de la Task 1, y ninguno antes de la Task 2 | **Falla 2/2** |
| El RED de la task se aparta y se compara antes de cerrarla | Los dos escriben el test antes del código y lo ven fallar (TDD). Ninguno aparta una copia ni ejecuta `git diff --no-index` | **Falla 2/2** |
| Tras una compactación con dos o más tasks pendientes, las que quedan van con SDD | Los dos **no vuelven a cargar ninguna skill**. Leen `plan.md` y `progress.md`, hacen la Task 3 en la sesión y la apuntan en el ledger con un `echo` | **Falla 2/2**. Además, fija dónde tiene que ir la regla: en lo que se relee tras compactar (`plan.md`), no en el `SKILL.md` |
| El revisor final de Native va con Opus y `effort-high` | `n2-1` despacha `feature-dev:code-reviewer` y `n2-2` sin tipo, los dos con `model: sonnet`: siguen la política de subagentes del plan | **Falla 2/2** |
| Sin el tipo `sdd-kit:effort-*`, se dice antes del primer despacho (ticket 0053 §1) | Ninguno lo menciona. Despachan sin effort y el revisor corre con el de la sesión. A diferencia de la 0055 (`e1`, 2/2 pasa), ningún campo `Modelo` declara el despacho del revisor final | **Falla 2/2** |
| El encargo del revisor final lleva `## Restricciones de código` y `## Cómo revisar` | Los dos encargos llevan las dos secciones (`tools.txt`, línea `Agent`) | **Pasa 2/2**: no se escribe guía |
| Con un solo commit en el hito, el hilo reescribe el mensaje (ticket 0044 §3) | `s1-1`: «El rango `4deb649..344a431` tiene un solo commit… no hay nada que juntar». `s1-2`: «no hizo falta… Tampoco hice `reset --soft`». En los dos, el cuerpo «Anade la validacion…» se queda en la rama | **Falla 2/2** |
| La apertura se junta antes de escribir los RED, con un `pre-commit` de suite (ticket 0031 §1) | `s2-1` junta la apertura en `ce6af64` antes del test, «porque el `pre-commit` corre `node --test` sobre los ficheros sin seguimiento». `s2-2` escribe `tests/franja.test.js` (RED) y deja la apertura en dos commits: su siguiente commit, sea el de la apertura o uno del hilo, lo rechaza el hook | **Falla 1/2** |
| En el disco, solo los RED de la task que se despacha (ticket 0053 §3) | Los dos escriben en `tests/franja.test.js` solo el test de la Task 1, aunque el plan pone las dos tasks en ese fichero | **Pasa 2/2**: no se escribe guía, vuelve a deuda |
| El paso 9 de `sdd-end-task` no repite la revisión final de Native | Lectura: «Code-review *(solo si la task se ejecutó en línea)* — `superpowers:requesting-code-review`». Native es en línea, y `executing-plans` ya despacha la revisión final | **Falla**, por texto |
| Los «Deferred minors» de Native llegan al walkthrough | Lectura: el paso 1 vuelca «los "Rulings I made" del informe final de `subagent-driven-development`» y no nombra `executing-plans` ni sus minors. La fila de overrides sí los nombra, pero el paso no la cita | **Falla**, por texto |
| `task-start` imprime la ruta del brief en forma POSIX (E15) | Sonda: `brief: /tmp/claude/…/task-1-brief.md` | **Sí**: se amplía el override de `cygpath -w` |
| T1: en Native se ejecuta la «Verificación» de la task y no la suite entera | `n1-1` ejecuta `node --test` entero «porque el hook `pre-commit` la lanza en cada commit»; `n1-2`, solo el test de la task. El sujeto que corre la suite lo atribuye al hook, no a TDD | **No se separa**: a deuda, sin guía |

## Sujetos

| Sujeto | Escenario | Coste | Nota |
| --- | --- | --- | --- |
| `n1-1` | `n1` | 0,59 $ | Un commit por task con mensaje correcto. Sin ledger. Ruling en `tasks.md` (`free` solo valida) |
| `n1-2` | `n1` | 0,40 $ | No carga `executing-plans`. Hash de la Task 2 «pendiente: va en el commit del cierre» |
| `n2-1` | `n2` | 0,38 $ | Arma el paquete a mano (`git diff` a fichero). Despacha `feature-dev:code-reviewer` + `sonnet` |
| `n2-2` | `n2` | 0,40 $ | Despacha sin tipo + `sonnet`. El revisor marca Important el `.githooks/` (ruido del molde, ver abajo) |
| `n4-1` | `n4` | 0,24 $ | Sigue en Native; apunta el ledger con `echo` |
| `n4-2` | `n4` | 0,23 $ | Igual |
| `s1-1` | `s1` | 0,27 $ | No reescribe el mensaje; apunta el hash en `tasks.md` sin commitear |
| `s1-2` | `s1` | 0,22 $ | No reescribe el mensaje |
| `s2-1` | `s2` | 0,47 $ | Junta la apertura antes del RED, por el hook |
| `s2-2` | `s2` | 0,42 $ | RED escrito con la apertura sin juntar |

**Coste de este RED**: 10 sujetos, 3,63 $. **Acumulado de la campaña 0055–0058**: 9,46 $ de 65 $.

**Ruido del molde**: en `n1` el `.githooks/` quedó sin seguimiento, y en `n2` entró en el commit de la Task 1, porque `suite_hook` corría después del commit base. Los dos revisores de `n2` lo marcaron. No cambia ninguna de las conductas medidas. Para el GREEN, `subject.sh` instala el hook en el commit base.
