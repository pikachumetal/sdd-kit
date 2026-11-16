---
kit_version: 2.3.4
lane: feature
id: 20261102-135210-feature-0271-clean-red-rules
task: 0271
mode: full
date: 2026-11-02
---

# Ticket para el kit — feature 0271: una sola línea de conducta ante un RED limpio

## Contexto

- Carril y modo: feature full, perfil `delegate`, Native, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: ejes Spec y re-revisión en Opus; eje Código y sujetos de `sdd-propose` en Sonnet; sujetos de `sdd-implement` en Opus
- Coste en reloj: 1,26 h frente a 2 h estimadas (walkthrough §2)
- Coste en tokens: 13,66 $ de sesión a la hora del walkthrough y 20,81 $ en 27 sujetos (walkthrough §2)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Marqué condicionado lo que se podía quitar, y el plan volvió a fijar «para» en un frente con dos mitades

- **Qué pasó**: la cláusula de `sdd-implement` iba sin marca, y el Step 2 del plan decía «si alguno sale limpio con n = 3, es un desvío y paro». `a3` salió limpio 3/3. Medí `a4`, no previsto en el RED, que dio 0/2, y seguí con un ruling: `a3` y `a4` son el mismo frente. El eje Spec lo señaló como desviación por confirmar.
- **Fuente**: `plan.md`, Task 1 Step 2, y `tests/clean-red-rules-0271-red.md`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings»; `skills/sdd-propose/references/plan-writing.md`.
- **Por qué el kit no lo evitó**: la regla habla de un frente con RED limpio, y no dice qué es un frente cuando un THEN tiene dos mitades.
- **Coste**: 2 sujetos, ya previstos en el GREEN, y un Important.
- **Propuesta**: nada mientras sea un caso.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una cláusula con dos mitades, una limpia y otra por medir, WHEN sale limpia la primera, THEN el hilo mide la segunda antes de decidir.

### 2. La tabla de lectura de `tech-stack.md` dio por alineada una línea que contradecía la regla

- **Qué pasó**: «con su muestra» dejaba salir lo marcado sin n = 3, y mi tabla la marcó «alineada». Lo cazó el eje Spec: era el criterio de hecho de la petición.
- **Fuente**: `tests/clean-red-rules-0271-green.md`; walkthrough §4.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Requirements».
- **Por qué el kit no lo evitó**: una tabla de veredictos sin la frase comparada pasa por evidencia.
- **Coste**: un Important y una ronda de la pasada de fix.
- **Propuesta**: que una verificación por lectura cite la frase comparada, junto al veredicto.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN una fila «no contradice» WHEN se escribe THEN lleva las dos frases.

### 3. Di por limpio un frente en un molde sin tentación, con la regla escrita

- **Qué pasó**: `cr2` salió limpio con un molde de un fichero y la ruta en la spec, y lo saqué con un ruling, llamándolo yo mismo «posible falso negativo». El eje Spec lo marcó contra `tech-stack.md`, «Un molde pequeño no tienta…». `cr3` repitió con un molde mayor, también limpio.
- **Fuente**: `red-plan/` y `red-suite/` de la carpeta de la spec.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Una primera tanda limpia…».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué: `tech-stack.md` se lee al arrancar, y la decisión llega horas después.
- **Coste**: un Important y 3 sujetos.
- **Propuesta**: nada mientras sea un caso.
- **Verificada**: sí — `cr3` frente a `cr2`.
- **Criterio de aceptación**: GIVEN un RED limpio que su autor llama posible falso negativo WHEN decide THEN lanza otra tanda antes del ruling.

### 4. La enmienda se escribió solo en el delta

- **Qué pasó**: al salir los frentes de `plan-writing.md`, quité el delta y dejé el 🦆, el Approach y la tabla del saldo prometiendo lo retirado. Lo cazó el eje Spec.
- **Fuente**: hallazgos del eje Spec, sesión; `spec.md`, «Enmiendas».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, «Deviations and rulings», que manda la corrección en su sitio solo para el desvío.
- **Por qué el kit no lo evitó**: lo marcado sale con un ruling, y ningún paso dice qué le pasa a la spec.
- **Coste**: un Important.
- **Propuesta**: nada mientras sea un caso.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un frente marcado que sale WHEN se registra el ruling THEN ninguna frase de la spec promete lo retirado.

### 5. Un heredoc rompió `subject.mjs`, con la regla escrita

- **Qué pasó**: los `\n` de un script en heredoc de Git Bash acabaron como saltos reales: `SyntaxError: Invalid or unexpected token` en `tests/batteries/sdd-propose/subject.mjs:123`. La campaña salió `sin evidencia`; mi `| tail` tapó su código de salida.
- **Fuente**: `node tests/headless/run.mjs` con `DRY_RUN=1` en Git Bash.
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Un script de Python en un heredoc…».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué; lo trata la feature 0287.
- **Coste**: una tanda en vacío, 0 $, unos minutos.
- **Propuesta**: la de la 0287.
- **Verificada**: sí — reproducido con `DRY_RUN=1`.
- **Criterio de aceptación**: el de la 0287.

## Lo que hice por iniciativa propia

- Separé `a3` de `a4` como dos filas de un mismo frente: fue lo que evitó sacar una regla que falla.

## Funcionó, no tocar

- La regla se aplicó a su propia spec: los dos frentes marcados de `plan-writing.md` salieron sin parada.
- El eje Spec encontró tres Important que ningún sujeto podía ver.

## Menores

- `battery.mjs` no admite un n distinto por fase: `cr1` y `cr2` se lanzaron con `run.mjs` o subiendo y bajando `n` en la tabla — `tests/headless/battery.mjs`.
- `moon run` sin `--base` de la línea base corrió en el árbol y no en un worktree separado, con un ruling — `skills/sdd-worktrees/SKILL.md` Step 3.
- La guarda de `h0` de `a3` y `a4` quedó a medias, con un ruling — `tests/batteries/sdd-implement/subject.mjs`.
