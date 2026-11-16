---
id: 20261025-152402-feature-0213-campaign-control
title: Tasks — Control de campaña en tests/headless/run.sh
spec: ./spec.md
plan: ./plan.md
created: 2026-10-25
---

# Tasks — Control de campaña en `tests/headless/run.sh` (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0213-campaign-control`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Ensayo en seco fuera de la spec y coste por carpeta | done | b8214cfd | `run.sh` y `battery.sh` cargan `lib.sh` (`campaign_root`, `REPO_ROOT` con la ruta Windows arreglada) |
| 2 | Recuento de sujetos: etiqueta existente, techo con lo lanzado, cortados y MAX_PARALLEL | done | e0cfd557 | recuento con builtins; cerrojo `RUNS_DIR/live/.lock` entre lanzadores; `battery.sh` sin `CHUNK` |
| 3 | `claude` anidado bloqueado en el sujeto | done | bac29fc7 | sujeto real (haiku, 0,0096 $): Bash y PowerShell bloqueados |
| 4 | Tabla de coste por tipo de sujeto y `tech-stack.md` al día | done | 2bdb2f87 | 1328 sujetos; `tech-stack.md` 19367 palabras, tope 19663 |

## Verificación por task

- [x] Task 1 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -CI`
- [x] Task 2 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1, tests/Battery.Tests.ps1 -CI`
- [x] Task 3 — `Invoke-Pester -Path tests/HeadlessLauncher.Tests.ps1 -CI` y el sujeto real
- [x] Task 4 — `Invoke-Pester -Path tests/WordBudget.Tests.ps1 -CI`

## Fixes adicionales

1. Línea base: «acepta RUNS_DIR bajo .temp/ del repo» rojo también en `develop`, en un worktree desanclado: `run.sh` calcula `REPO_ROOT` con `dirname` sobre `BASH_SOURCE`, que con la ruta Windows de Pester (`D:\…\run.sh`) da `.`, y la raíz sale del cwd. Se arregla en la Task 1 (fichero que ya toca).
2. Línea base: `FastSuiteBudget` 31,6 s frente a 30 con la máquina cargada; fila de deuda del patch 0190 (parcial), ajeno.

## Revisión

Revisión final: Spec opus+high, con arreglos (1 Critical, 3 Important, 6 Minor) · Código sonnet+high, con arreglos opcionales (10 Minor) · Arquitectura no (plan), sobre 2bdb2f87
Pasada de fix: juntada en el cierre, 6 hallazgos RED→GREEN
Re-revisión: 2bdb2f87..pasada de fix (juntada en el cierre), sdd-kit:effort-high + opus, quedan 1 Important y 4 Minor, adjudicados
sin revisar: arreglo del orden de redirecciones de `read` en `run.sh` (juntado en el cierre) — quita el «No such file or directory» que salía en stderr
sin revisar: comparación de rutas en forma Windows en `lib.sh` y `run.sh` (tras la base integrada) — con `TEMP` en `.temp/`, `/tmp` de Git Bash apunta ahí y la guarda de `RUNS_DIR` y `out_path` no casaban con `REPO_ROOT`

## Rulings

- Task 1: Ruling: run.sh y battery.sh cargan lib.sh y la raíz de salidas vive en campaign_root de lib.sh, no duplicada en los dos scripts — el plan solo decía «la misma raíz» — si es un error: un source de más en battery.sh
- Task 1: Ruling: REPO_ROOT de run.sh con la ruta Windows arreglada (dirname sobre BASH_SOURCE con «\» daba «.»), fix descubierto 1 de la línea base, rojo también en develop — fichero que la task ya toca — si es un error: un rojo que ya existía
- Task 1: Ruling: copia RED tomada antes de editar los tests; los tests no cambiaron entre el RED y el verde — comparación por la propia ejecución RED (12 rojos esperados) — si es un error: ninguno
- Task 2: Ruling: recuperación tras caída — código y RED de la Task 2 en el árbol, sin commit; se relanza su verificación
- Task 2: Ruling: los tests de MAX_PARALLEL pasan de MAX_PARALLEL=2/«exactamente 2» a MAX_PARALLEL=1/«exactamente 1» y el sueño de 2 a 4 s — con la máquina cargada dos sujetos no siempre se solapan y «2» dependía de la carga; con MAX_PARALLEL=5 el mismo test sale rojo (comprobado) — si es un error: el límite con n>1 no lo fija un test
- Task 2: Ruling: el recuento de run.sh pasa a builtins y variables (count_live, count_finished; costs_in con un awk por carpeta) — con subshells el bucle tardaba ~16 s por escenario bajo carga y los sujetos nunca se solapaban; sondeo del scratchpad: a y b durmiendo a la vez tras el cambio — si es un error: awk con ENDFILE exige gawk (el de Git Bash)
- Task 2: Ruling: cerrojo con mkdir en RUNS_DIR/live/.lock entre mirar el cupo y crear la marca, roto si su dueño ya no vive — dos run.sh a la vez lanzaban los dos (test de dos lanzadores: 2 a la vez con MAX_PARALLEL=1) — si es un error: un run.sh muerto con el cerrojo cuesta 1 s de espera al siguiente
- Task 3: Ruling: la sonda se leyó del .jsonl con extract.mjs: subject_save la rechazó por ruta de 158 caracteres (scratchpad dentro del repo, límite de out_path) — la campaña no se versiona — si es un error: ninguno
- Task 3: Ruling: el claude falso del test lleva una guarda FAKE_NESTED — sin el bloqueo se llamaría a sí mismo sin fin — si es un error: ninguno
- Task 3: Ruling: la carpeta del test nuevo pasa de «nested» a «nested-claude» — chocaba con la del test del molde sin g init, que contaba su salida — si es un error: ninguno
- Task 3: Ruling: .gitattributes gana «tests/headless/no-claude/claude text eol=lf» — sin extensión .sh, el checkout con autocrlf lo dejaría en CRLF — si es un error: ninguno
- Task 4: Ruling: la tabla agrupa por la primera skill del sujeto en siete tipos (arranque, cierre, implementación, migración, roadmap y release, init, otros); enrutado y primera pregunta van juntos porque la skill no los separa — si es un error: una previsión de enrutado sale alta (0,35 $ frente a ~0,2 $)
- Final: Ruling: Código m1 (ENDFILE es de gawk) — el arnés solo corre en Git Bash, cuyo awk es gawk 5 (tech-stack); un FNR==1 portable pierde los tools.txt vacíos o vuelve a un awk por fichero, el coste que se quitó — si es un error: con otro awk, spent da 0 y el techo de coste no salta
- Final: Ruling: Código m7 (un sujeto que acaba entre count_live y count_finished cuenta dos veces) — se queda conservador: contar de más para la campaña con «techo alcanzado: decide el dev-lead»; contar de menos pasaría del techo — si es un error: una parada de más en el borde del techo
- Final: Ruling: Código m8 (globales RUNNING, CUT, FINISHED entre funciones) — script de ~150 líneas; los count_* se llaman justo antes de cada lectura y el comentario de cabecera lo dice — si es un error: un total_spent con un CUT viejo
- Final: Ruling: Spec M6 (el Simplicity gate del plan dice «sin demonio ni lock») — el plan es el registro de lo planeado; el cerrojo es un ruling de la Task 2 y va al walkthrough — si es un error: un plan que no describe el código final
- Final: Ruling: Spec M4 — la tabla vuelve a los tipos de la decisión 10 (arranque, cierre, migración, init, otros; implementación y roadmap pasan a «otros», 271 sujetos, 0,19 $ recalculado) y nombra la regla: la skill medida es la primera que carga el sujeto, la que mira la puerta de battery.sh — si es un error: una campaña de cierre cuyo sujeto carga antes using-sdd cae en «arranque»
- Final: Ruling: I1 sin cambiar el nombre de la marca (decisión 4: RUNS_DIR/live/<fase>.<etiqueta>): las marcas en seco van a RUNS_DIR/dry/live, con el resto del seco (decisión 7); en curso cuenta las dos carpetas, cortadas solo la propia — si es un error: ninguno visible
- Final: Ruling: Important de la re-revisión (marcas en seco en RUNS_DIR/dry/live, no RUNS_DIR/live) — la decisión 7 pone todo el seco bajo RUNS_DIR/dry; las marcas reales siguen en RUNS_DIR/live/<fase>.<etiqueta> de la decisión 4, y count_marks es el mismo código para los dos modos — si es un error: el CUT de un sujeto real no lo fija un test en modo real (lo fija «un sujeto cortado de una tanda real no cuenta en un ensayo en seco» desde el otro lado)
- Final: Ruling: M4 abierto — la tabla clasifica por la primera skill del kit que carga el sujeto, una aproximación de «la skill medida de cada campaña» que los datos no dan; enrutado y primera pregunta no se separan (el plan pedía decirlo, no inventar la frontera); quitada la frase falsa sobre la puerta de battery.sh, commit de docs revisado en el hilo — si es un error: una previsión de enrutado alta
- Final: Ruling: Minor nuevos 1-3 (tries cuenta intentos con dueño vivo y puede robar un cerrojo recién tomado; label_taken fuera del cerrojo; versioned_out sin SPEC_DIR en disco mide el scratchpad) — sin segunda pasada de fix; fila de deuda Actuar → 0214 — si es un error: MAX_PARALLEL pasado en uno en una carrera rara, o un corte en falso en seco sin SPEC_DIR
