---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261101-191017-feature-0182-doc-citing-comments
task: 0182
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0182: `sdd review comments` y la salida en el eje Código

## Contexto

- Carril y modo: feature full, Native, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (ejes Spec y Arquitectura, re-revisión), Sonnet 5.5 (eje Código, sujetos)
- Coste en reloj: 1,16 h frente a 2 h estimadas, al abrir el cierre (walkthrough §2)
- Coste en tokens: 14,72 $ de sesión al medir el cierre, más 0,71 $ de 6 sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. `battery.mjs` da «verde» con una fila de la rúbrica en rojo

- **Qué pasó**: `f6 · 1/1 · umbral 1/1 · verde` salió en las cinco tandas, y la fila Q6 falló en dos (GREEN y REFACTOR): el sujeto marcó el falso positivo como Minor. Lo vi por leer el informe; casi escribí Q6 1/1 en la evidencia, que llegó a decir «GREEN 1/1» antes de leerlo.
- **Fuente**: `tests/sdd-verify-0182-comments.md`; `.docs/sdd/specs/20261101-175259-feature-0182-doc-citing-comments/green/out/f6-1.texts.txt`.
- **Dónde en el kit**: `tests/headless/battery.mjs`, `verdict`; `.docs/sdd/tech-stack.md`, «Baterías por skill».
- **Por qué el kit no lo evitó**: solo las filas con `tools:` se comprueban a máquina; el resto no sale en el veredicto, y la palabra «verde» se lee como del escenario entero.
- **Coste**: sin el error de lectura, un Important real habría llegado a la revisión final. Dos sujetos, 0,22 $.
- **Propuesta**: que el veredicto diga `verde (<n> filas en prosa sin leer: Q6)` cuando el escenario tiene filas que no comprueba.
- **Verificada**: sí — contrastado con las cinco salidas de `tests/sdd-verify-0182-comments.md`.
- **Criterio de aceptación**: GIVEN un escenario con una fila en prosa · WHEN `battery.mjs verdict` · THEN la línea nombra esa fila como sin leer y no dice solo «verde».

### 2. La línea base y el pre-commit a la vez dan rojos de timeout

- **Qué pasó**: lancé la línea base en segundo plano y el commit de apertura en el mismo mensaje. El pre-commit dio 16 tests en `Test timed out in 5000ms` y la base 12; solo el commit, 1743 passed. Otro commit más tarde falló dos veces con 8 `moon` de otras sesiones y CPU al 79 %, y pasó en un reintento.
- **Fuente**: salida de `git commit` en la sesión; `Get-CimInstance Win32_Processor` → `79`.
- **Dónde en el kit**: `skills/sdd-worktrees/SKILL.md`, Step 3, y `skills/sdd-implement/SKILL.md`, «Before each task».
- **Por qué el kit no lo evitó**: nada dice que la línea base espere al commit de apertura. Los timeouts por carga de otras sesiones no los cubre ninguna regla, y la tech-stack solo cuenta los de `git`.
- **Coste**: ~10 min y una línea base sin valor: 12 rojos que no contrasté.
- **Propuesta**: una frase en Step 3: la línea base no corre a la vez que un commit de la rama; y, en `tech-stack.md`, que un rojo de `Test timed out in 5000ms` en el pre-commit se reintenta si la máquina está cargada.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un sujeto con línea base pendiente y apertura sin commitear · WHEN prepara el arranque · THEN no los lanza a la vez.

### 3. «Enmienda sin aprobar» se usa en `delegate` para cambiar una decisión aprobada

- **Qué pasó**: en la pasada de fix cambié la decisión 5 (mayúsculas en `Art.`) y lo anoté en «Enmiendas» como `sin aprobar`, sin parar. Lo cazó la re-revisión, y lo deshice.
- **Fuente**: `skills/sdd-propose/references/control-profiles.md`, citado por la re-revisión; historial de la spec en el commit de cierre.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review»; `skills/sdd-implement/SKILL.md`, «Deviations and rulings».
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué. Un Minor con `review.minors: fix` empuja a arreglar sin ofrecer «esto cambia la spec». Es un solo caso.
- **Coste**: un commit tras la re-revisión, sin revisor.
- **Propuesta**: en la entrada de Minor de «Closing the review», sustituir texto: un arreglo que toca una decisión aprobada es un ruling, no un fix.
- **Verificada**: sí — contrastado con `skills/sdd-implement/SKILL.md`, «Deviations and rulings».
- **Criterio de aceptación**: GIVEN un Minor cuyo arreglo contradice un ✋ aprobado · WHEN la pasada de fix en `delegate` · THEN sale `Final: Ruling:` y no una enmienda.

## Lo que hice por iniciativa propia

- Comprobar con un mutante los tests añadidos tras el RED: cazó dos tests que pasaban sin probar lo que decían (el de la cabecera de diff, el del submódulo). Funcionó.
- Poner `f6` en un paso propio de la tabla para lanzarlo solo con `STEPS`, porque `battery.mjs` no filtra por escenario.

## Funcionó, no tocar

- Los tres ejes por separado: Código no vio la línea entera como grave; Spec y Arquitectura la midieron con sondas reales.
- La re-revisión refutó con 312 KB medidos un ruling mío cuya premisa era falsa.
- El control en el GREEN: el RED limpio habría recortado una frase que hacía falta.

## Menores

- El lanzador exige `git archive` del kit, y lo dice al lanzar sin gastar: una vuelta, sin coste — `tests/headless/campaign.mjs`.
- Heredoc con `\n` en un `node -e` rompió un test, regla que ya existe en `tech-stack.md`; el pre-commit lo paró — `.docs/sdd/tech-stack.md`.
- Escribí en el ledger «mutante visto en rojo» antes de verlo: el mutante salió verde; corregido — `skills/sdd-verify/SKILL.md`, «Regression tests».
- El gate del Art. I con `f6` tuvo dos sujetos más de la previsión, sin superar los dólares; la plantilla no dice si manda el recuento o el techo — `skills/sdd-templates/templates/spec-template.md`, «Previsión de coste».
