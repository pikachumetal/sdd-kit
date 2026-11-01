---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261101-150254-feature-0272-using-sdd-templates-english
task: 0272
mode: full
date: 2026-11-01
---

# Ticket para el kit — feature 0272: `using-sdd` y `sdd-templates` en inglés, parada por una fila inestable

## Contexto

- Carril y modo: feature full
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit, texto de skills y CLI en Node
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 y Sonnet 5.5 en los ejes; Sonnet en los sujetos
- Coste en reloj: 0,73 h frente a 1 h estimada, medido antes del cierre
- Coste en tokens: 12,4 M, 7,71 $, medido antes del cierre; sujetos, 9,92 $

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un rojo de una fila con n=2 no dice si es regresión, y la batería no tiene forma de contrastarlo

- **Qué pasó**: la batería de `using-sdd` dio `r1` 1/2 con umbral 2/2. Un A/B con la misma frase dio 11/14 en inglés y 9/14 en castellano. Con ~70 % de acierto, 2/2 sale en rojo cerca de la mitad de las veces con cualquier texto. Hubo dos paradas al dev-lead.
- **Fuente**: `tests/english-using-templates-green.md`; `.docs/sdd/tech-stack.md`, «Baterías por skill», línea «Un rojo no se relanza para sacar verde: se lee por qué falló»; la fila de `r1` en `.docs/sdd/roadmap.md`, que pedía re-medir con n=4 desde 2026-10-01.
- **Dónde en el kit**: `tests/batteries/using-sdd/battery.md`, fila `r1`; `.docs/sdd/tech-stack.md`, «Baterías por skill».
- **Por qué el kit no lo evitó**: la regla dice que se lea, pero leer `r1-2` no distingue azar de regresión. Nada dice que el contraste correcto es un A/B contra el texto anterior, y el A/B salió por iniciativa propia.
- **Coste**: 4,60 $ en 28 sujetos y dos paradas, en el walkthrough de la 0272.
- **Propuesta**: bajar el umbral de `r1` a uno que un 70 % sostenga, o subir su n, y añadir a la regla que un rojo de enrutado tras una edición se contrasta con un A/B contra el texto anterior.
- **Verificada**: sí — 14 sujetos por idioma con `tests/headless/run.mjs`, `SCENARIOS=r1`, en Git Bash.
- **Criterio de aceptación**: GIVEN una edición que solo traduce `using-sdd` WHEN `r1` entra en rojo THEN el agente mide el texto anterior y el nuevo antes de pedir una decisión, y el umbral de la fila no da rojo con la tasa medida del texto sin cambios.

### 2. Los Minor de redacción chocan con una spec que aprueba el texto literal

- **Qué pasó**: con `review.minors: fix`, cinco Minor de redacción deberían entrar en la pasada de fix, pero ese texto era la tabla de reglas aprobada y un retoque invalidaba la medición. Se adjudicaron con un ruling.
- **Fuente**: `.docs/sdd/sdd-kit.json`, `"review":{"minors":"fix"}`; `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Por qué el kit no lo evitó**: dice que el Minor entra «without asking», y no contempla un texto ya medido o aprobado literal.
- **Coste**: un ruling, ~2 min; sin respaldo de más.
- **Propuesta**: un Minor que cambia texto que la spec fija literal se adjudica con un ruling, sin sustituir ninguna otra regla por más de una frase.
- **Verificada**: sí — contrastado con `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Criterio de aceptación**: GIVEN `review.minors: fix` y un Minor sobre una línea que la spec fija literal WHEN se cierra la revisión THEN va como `Final: Ruling:` y no como fix.

## Lo que hice por iniciativa propia

- Escribir el inglés antes de la spec y generar la tabla de reglas casando línea a línea skill y draft: el eje Spec comparó 74 filas con 0 diferencias. Funcionó para una traducción.
- Comparar por script lo que va entre «», los tramos de código y los enlaces antes y después. Funcionó.
- Un humo con `sdd decision check`, que comprueba la plantilla por máquina. Funcionó.

## Funcionó, no tocar

- La frase del Art. III: el mensaje final de los 34 sujetos salió en castellano con las dos skills en inglés.
- El precio de la 0206 para prever: 0,35 $ de techo frente a 0,15 $ medidos.
- Revisión final en un worktree desanclado, con el paquete de la receta: 272 líneas.

## Menores

- Lancé la batería con `KIT_DIR=.`: los 34 murieron con «la copia del kit lleva `.docs/` o `tests/`», a 0 $; la orden `git archive` solo está en el mensaje del error — `.docs/sdd/tech-stack.md`, «Baterías por skill».
- `sdd capability check` rechazó en el cierre «Ninguna:» sin «porque»; el repaso de coherencia prueba `capability merge`, que no lo mira, y costó un commit tras el sync — `skills/sdd-propose/SKILL.md`, paso 4.
- 4 de 34 sujetos con mensajes intermedios en inglés a una petición en castellano («Using sdd-…» y una frase de `r6-1`), sin caso en la línea base: se queda aquí hasta un segundo caso — `skills/using-sdd/SKILL.md`, Overview.
- Un sujeto suelto no conserva el fichero que escribe: la ADR del humo no quedó en la evidencia, solo el rc — `tests/headless/lib.mjs`.
- Un pre-commit falló una vez en 184 ms, antes de correr tests, con `Process pnpm failed: exit code 1`, y no se repitió; causa sin averiguar — no localizado.
- La regla 7 de `CLAUDE.md` pide publicar la rama antes del merge; publiqué ya con el cierre juntado, sin chocar con el segundo caso de la 0274 — no localizado.
