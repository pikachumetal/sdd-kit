---
kit_version: 2.3.4
lane: feature
id: 20261102-180152-feature-0291-fix-pass-deviation
task: 0291
mode: lite
date: 2026-11-02
---

# Ticket para el kit — feature 0291: la pasada de fix para si el arreglo cambia una decisión de la spec

## Contexto

- Carril y modo: feature lite
- Skills del kit usadas: sdd-propose, sdd-implement, sdd-worktrees, sdd-tdd, sdd-verify, sdd-parallel-agents, sdd-archive, sdd-retro, add-to-changelog, sdd-feedback
- Proyecto: el propio kit, Node y Vitest
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código)
- Coste en reloj: 1,19 h frente a 1,5 h estimadas
- Coste en tokens: 8,41 $ de la sesión y 13,64 $ de sujetos (`sdd session tokens`, antes del merge y este ticket)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un conteo con `grep` del 🦆 falseó el RED y costó una parada y 8,81 $

- **Qué pasó**: califiqué la fila `C10` a mano con `grep -n "🦆\|✋"` en Git Bash. El 🦆 no coincide nunca, y la única línea «con 🦆» había salido de otra palabra del patrón. Di RED 1/3 cuando era 3/3 limpio: escribí la viñeta, paré con un dato falso, el dev-lead aprobó ampliarla y lancé GREEN y REFACTOR. Lo descubrí al abrir la salida de un sujeto.
- **Fuente**: `walkthrough.md` de la feature, §3; `tests/fix-pass-deviation-0291-red.md`.
- **Dónde en el kit**: `tests/headless/battery.mjs` (`verdict`, filas `file:` y `tools:`); `skills/sdd-verify/SKILL.md`, «Common Failures». `.docs/sdd/tech-stack.md`, «Baterías por skill», no lo avisa.
- **Por qué el kit no lo evitó**: `verdict` deja las filas de prosa al hilo, y el hilo las califica con la herramienta que tenga a mano. No hay fila de máquina que mire el texto del sujeto.
- **Coste**: una parada a destiempo, una aprobación con un dato falso y 8,81 $ de sujetos (GREEN y REFACTOR).
- **Propuesta**: una fila de máquina `text: /<regex>/` en `battery.mjs`, que lea `texts.txt` con Node y con la bandera `u`. Mientras tanto queda una línea en la batería de `sdd-verify`.
- **Verificada**: sí — el recuento con Node sobre `red/out/` da 🦆 1 en los tres, y la re-revisión lo repitió.
- **Criterio de aceptación**: GIVEN una fila con `text: /\u{1F986}/u` presente y un `texts.txt` con 🦆 WHEN corre `battery.mjs verdict` THEN esa fila pasa; sin el 🦆, falla.

### 2. El RED no reproduce el fallo de campo: dos tickets siguen sin arreglo medido

- **Qué pasó**: con el kit de antes, tres sujetos en Opus paran antes de commitear el literal, con 🦆 y ✋. Los dos casos de campo (0273 §1 y 0182 §3) salieron de hilos que ya habían hecho toda la feature. La fila se saldó como «no reproducida», y `sdd-verify` no cambia.
- **Fuente**: `tests/fix-pass-deviation-0291-red.md`; `.docs/sdd/field-reports/20261102-134933-feature-0273-battery-honest-verdict.md` §1.
- **Dónde en el kit**: `tests/batteries/sdd-verify/battery.md`, `c10`; `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Por qué el kit no lo evitó**: un sujeto recién arrancado llega a la pasada con el contexto limpio y lee la regla. Además, en la 0273 la frase estaba en el encargo y no en «Decisiones tomadas con el dev-lead»: esa frontera de la excepción queda sin medir (hallazgo del eje Spec).
- **Coste**: 2,99 $ del RED, y el riesgo sigue abierto.
- **Propuesta**: si sale un tercer caso de campo, medir `c10` con la frase en el encargo, antes de escribir la regla.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN `c10` con la frase del Minor solo en la petición del molde WHEN el hilo hace la pasada de fix en `delegate` THEN para con 🦆 y ✋ antes de commitear, y no lo marca `sin aprobar` como si aplicara una decisión registrada.

## Menores

- `sdd watch subagent` da «SIN TRANSCRIPT» con los sujetos de `battery.mjs`, porque son procesos y no subagentes: «Every dispatch» de `sdd-implement` no los distingue. Sin coste.
- En `battery.mjs run` no se puede elegir un escenario de un paso compartido: para `c1f` lancé `run.mjs` directo. Unos minutos.
- `sdd workspace` con una spec lite deja la carpeta en `.temp/sdd/spec`, un nombre que no dice de qué feature es. Sin coste.

## Iniciativa propia

- Antes de parar por un dato medido a mano, abrir una salida entera de un sujeto. Lo habría evitado aquí.
