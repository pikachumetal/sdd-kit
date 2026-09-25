# Evidencia RED — `using-sdd`, la puerta de entrada al kit (2026-09-25)

Baseline de la feature [using-sdd](../.docs/sdd/specs/20260925-180228-feature-0074-using-sdd/spec.md) (0074). Pregunta: un dev **sin el kit en su `CLAUDE.md`** escribe una frase vaga, en castellano, en un proyecto con el kit y superpowers. ¿Cae en la puerta correcta?

## Método

Sujetos Sonnet con `claude -p` y un máximo de 8 turnos, sobre el molde `molde-code` de la 0014 (app de salas con `.docs/sdd/`). Los lanza `tests/headless/run.sh` con [`red/subject.sh`](../.docs/sdd/specs/20260925-180228-feature-0074-using-sdd/red/subject.sh). El kit es una copia limpia de `develop` en `02a2e24`, con el hook y `hooks/router.md` vigentes.

**Aislamiento nuevo** (`SUPERPOWERS_DIR` en `tests/headless/lib.sh`): el sujeto corre con `--setting-sources ""` y carga superpowers 6.4.1 con `--plugin-dir`. Así lleva los hooks de los dos plugins y nada de la configuración del dev-lead. Se comprobó con un sujeto sonda antes de la campaña. Con `--setting-sources project,local` el sujeto seguía viendo el `CLAUDE.md` de usuario. Ese fichero dice «Proyecto con `.docs/sdd/`: feature → `sdd-kit:sdd-start-task`», así que habría enrutado por el dev. Con la cadena vacía, el sujeto no lo ve y sí ve «You have superpowers» y el router del kit. Las campañas anteriores (0014 incluida) heredaban ese `CLAUDE.md`.

La columna «Primera skill» sale de las líneas `>>> Skill:` de `red/out/<sujeto>.tools.txt`.

## Resultados

| Frase | Petición | Puerta esperada | Primera skill (s1 · s2) | ¿Cae? |
| --- | --- | --- | --- | --- |
| i1 | «Quiero empezar a trabajar con SDD en este proyecto.» (sin `.docs/`) | `sdd-init-brownfield` | `sdd-init-brownfield` | sí |
| c1 | «Oye, ¿cómo está montado lo de cancelar reservas? No lo pillo.» | `sdd-consult` | `sdd-consult` | sí |
| r1 | «El cliente quiere un módulo de informes: ocupación por sala, exportar a Excel y un aviso semanal… Ponte con ello.» | `sdd-roadmap` | `sdd-start-feature` · `sdd-start-feature` | equivalente: los dos proponen partir en 3 features con fila propia (paso 2) |
| r2 | «Te paso las notas de la reunión de hoy con el cliente…» | `sdd-roadmap` | `sdd-roadmap` | sí |
| r3 | «Me han asignado en Azure el 412 (…) y el 415 (…).» | `sdd-roadmap` | `sdd-start-feature` · `sdd-start-feature` | **no, 2 de 2** |
| r4 | «Lo de exportar a calendario tiene que ir antes que los avisos por correo.» | `sdd-roadmap` | `sdd-roadmap` | sí |
| f1 | «Mete un filtro por sala en el comando libres.» | `sdd-start-feature` | `sdd-start-feature` | sí |
| f2 | «Let's build a waitlist for when a room is full.» | `sdd-start-feature` | `sdd-start-feature` | sí |
| f3 | «Es una tontería: que al reservar se pueda poner una nota. Hazlo rápido.» | `sdd-start-feature` | `sdd-start-feature` | sí |
| p1 | «Si cancelo una reserva que no existe me dice «cancelada» igual.» | `sdd-start-patch` | `sdd-start-patch` → `systematic-debugging` | sí |
| e1 | «Ya está todo lo de esta versión: hay que cerrar la entrega y mandarle el correo al cliente.» | `sdd-end-release` | `sdd-end-release` | sí |
| s1 | «No me gusta que me pares tanto, quiero trabajar con menos preguntas.» | `sdd-config` | ninguna · ninguna | **no, 2 de 2** |
| d1 | «Hay que mejorar las reservas, que se quejan los usuarios.» | una pregunta sobre qué es, con la recomendación primero | `sdd-start-feature` · `sdd-start-feature` | **no, 2 de 2** |
| t1 | «Corrige el typo «recervas» del README.» | ninguna (edición directa) | ninguna | sí |

Recuento: **10 de 14 frases caen en su puerta** con el router actual. Tres fallan 2 de 2. `r1` llega a lo mismo por otro camino.

## Los tres fallos, con sus frases

- **s1, preferencias → memoria del agente, no `sdd-config`.** Los dos sujetos contestan en 3 turnos sin invocar ninguna skill. Los dos guardan la preferencia en la memoria del agente: «Lo he guardado en memoria para próximas sesiones» (s1-1) y «Lo he guardado en memoria para que valga en próximas sesiones» (s1-2). Es justo lo que `sdd-config` evita: la preferencia se queda en un PC y no llega a `sdd-kit.local.json`. El router no nombra `sdd-config`.
- **r3, items del gestor → dos features encadenadas.** El router dice «items del gestor → `sdd-roadmap`», pero «me han asignado» se lee como una orden de hacer. r3-1: «Son dos features, no una. Las hago una detrás de otra»; r3-2 las ordena y abre dos carriles. Ninguno deja las filas en el roadmap antes de arrancar.
- **d1, petición vaga → feature supuesta.** Ninguno de los dos pregunta qué es ni cuánto abarca. Los dos dan por hecho el carril y preguntan por el modo y el perfil. d1-1: «Carril: feature… No es solo roadmap porque quieres que se haga»; d1-2: «Lo resolveré en la entrevista de diseño, no aquí». El tamaño se decide sin preguntarlo.

## Lo que pasa sin guidance nueva

Consult, patch, init, reunión, reordenar, cierre de entrega, typo, «Let's build» y «hazlo rápido» ya caen bien, 1 de 1. «Let's build» y «hazlo rápido» eran los fallos de la 0014 y el router los arregló. El GREEN los repite como control: la skill sustituye al router y no puede perderlos.

## Trampas de método

- n = 2 en los fallos y n = 1 en los aciertos. El GREEN lleva 2 por frase.
- El molde lleva `ids.mode: sequence` y carpetas `-task-`, que ahora son legado. Ningún sujeto se paró en eso.
- Codex no se mide: todo el equipo usa Claude Code (fila 0074).

Coste: 18 sujetos, 2,88 $ (previsión de la campaña: 50 sujetos y 18 $). Más dos sondas de aislamiento en Haiku (~0,06 $) fuera del lanzador.
