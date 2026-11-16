---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261102-173845-feature-0281-coherence-pass-scope
task: 0281
mode: lite
date: 2026-11-02
---

# Ticket para el kit — feature 0281: el repaso de coherencia parte también del Scope

## Contexto

- Carril y modo: feature lite, perfil `delegate`, Native
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-agent-writing`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus (eje Spec y re-revisión), Sonnet (eje Código y sujetos)
- Coste en reloj: 1 h frente a 1,5 h estimadas
- Coste en tokens: hilo 11.677.956; subagentes 1.890.635; 8,88 $ de sesión y 10,54 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una regla de búsqueda se reescribió dos veces antes de pasar a una orden con su comando

- **Qué pasó**: `co6` salió 1/2 con «its numbered steps» y 1/2 con «even bare («paso 7»)»; con un `grep` literal, 2/2 y luego 2/2. La regla Art. II existía y no la apliqué en la primera ronda.
- **Fuente**: `tests/coherence-pass-0281-green.md`; salida de `battery.mjs run`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Work the steps», frase del smoke que falla; `.docs/sdd/constitution.md`, Art. II.
- **Por qué el kit no lo evitó**: la frase pide leer la regla «before the round» y solo la del rojo; el GREEN a 1/2 no se sintió como rojo hasta repetirse.
- **Coste**: una tanda de REFACTOR, 1,62 $ en `refactor/` y ~10 min.
- **Propuesta**: ninguna en el texto; segundo caso por buscar antes de escribir fila.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un GREEN parcial por una búsqueda no hecha WHEN se escribe la primera ronda THEN la ronda cambia de forma, no de palabras.

### 2. Un frente de ticket no se reproduce en sujetos de un turno

- **Qué pasó**: el caso de la 0116 salió limpio en 6 de 6 en dos moldes, y `co5` 1/1 en el GREEN; el frente salió con la marca de la spec, sin saber si el fallo de campo sigue. Segundo caso del ticket de la 0116 §2.
- **Fuente**: `tests/coherence-pass-0281-red.md`.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Un baseline limpio no reproduce…»; no localizado en una skill.
- **Por qué el kit no lo evitó**: el fallo de campo vino de una sesión larga, y el kit no tiene molde de sesión larga; la regla lo dice, y la fila de deuda se salda igual.
- **Coste**: 1,97 $ de la primera tanda, incidental, más la segunda; ninguna parada.
- **Propuesta**: que `sdd-roadmap` no cuente como saldada entera una fila con un frente sacado por RED limpio; aquí queda solo en este ticket.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una fila con dos frentes y uno sale por RED limpio WHEN se marca el cierre THEN el prefijo lo dice.

## Lo que hice por iniciativa propia

- Relanzar el RED con moldes más duros (15 y 14 capacidades, requisitos en una capacidad no declarada): cambió `co6` de 3/3 a 1/3. Barato y decisivo.
- Recontar y sustituir lo que paga el saldo sobre una copia en memoria antes de presentar la spec.

## Funcionó, no tocar

- «Entra, si el RED lo exhibe» y el n = 3: el frente limpio salió sin parada.
- El eje Spec cazó que la regla decía «skill» donde el requisito decía «algo».
- `sdd merge --sync` y `sdd merge --push`, a la primera con la base por delante.

## Menores

- `sdd workspace <spec.md>` en lite da `.temp/sdd/spec`, sin el id: dos lites del mismo worktree lo compartirían — `skills/sdd-implement/SKILL.md`, Setup, paso 2.
- `sdd-archive` paso 0 para ante cualquier cambio sin commitear, también ante los dos Minor de la re-revisión que el cierre debe llevar: seguí sin preguntar — `skills/sdd-archive/SKILL.md`, paso 0.
- El eje Código dijo que el diff quitaba «against the decisions and scenarios that use it», y no era cierto; no cambió nada — `skills/sdd-verify/references/code-reviewer-prompt.md`.
