---
kit_version: 2.3.4
superpowers_version: 7.0.0
lane: feature
id: 20261030-133845-feature-0263-validation-template
task: 0263
mode: full
date: 2026-10-30
---

# Ticket para el kit — feature 0263: plantilla de la validación y quién valida

## Contexto

- Carril y modo: feature full, perfil `delegate`, `validation.mode: field`
- Skills del kit usadas: sdd-propose, sdd-start-feature, sdd-implement, sdd-worktrees, sdd-tdd, sdd-verify, sdd-archive, sdd-feedback
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 (eje Código y sujetos)
- Coste en reloj: 1,07 h frente a 1 h estimada
- Coste en tokens: 15.737.634 del hilo, 2.483.668 de subagentes; 11,08 $, más 7,74 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Una plantilla nueva salió con dos salidas fáciles que solo vieron los sujetos

- **Qué pasó**: «Sin entorno que arrancar, omite este bloque» hizo que `g3` y `t1` escribieran «No hay entorno que arrancar: es una CLI». Y «Sin probar» hizo que `v1b` preguntara con `field`, lo que el alcance prohibía cambiar.
- **Fuente**: `tests/validation-template-red.md`, filas `green` y `green2`; `sdd session tokens`.
- **Dónde en el kit**: Art. II («una excepción lleva su contraejemplo») y `skills/sdd-templates/templates/validation-template.md`.
- **Por qué el kit no lo evitó**: la regla existía y no la apliqué al escribir la plantilla. Nada obliga a repasar cada hueco nuevo como posible salida.
- **Coste**: de ~4 $ previstos a 7,74 $ de un tope de 8 $, y no quedó margen para medir la pasada de fix (walkthrough §3).
- **Propuesta**: en la previsión de coste del Art. I, contar por cada hueco condicional de una plantilla nueva un escenario donde ese hueco sea la salida fácil.
- **Verificada**: sí — contrastado con `tests/validation-template-red.md`, dos rondas.
- **Criterio de aceptación**: GIVEN una plantilla nueva con un hueco condicional WHEN se escribe la previsión THEN nombra el escenario que lo presiona.

### 2. La pasada de fix metió una regla que anulaba la feature, y el revisor la había propuesto

- **Qué pasó**: el eje Spec pidió que «un THEN que se observa en una interfaz» devolviera `agente` a `dev-lead`. La apliqué con la definición de interfaz del paso 7, que incluye «fichero que produce el cambio», así que un `.nvmrc` anulaba `agente`. Lo cazó la re-revisión; volví al literal de la spec.
- **Fuente**: `skills/sdd-start-feature/SKILL.md` paso 7; `tasks.md` de la 0263, línea `Re-revisión:`.
- **Dónde en el kit**: `skills/sdd-verify/SKILL.md`, «Closing the review».
- **Por qué el kit no lo evitó**: la regla de que una ronda que añade un AND es un desvío está en `sdd-implement`, «Deviations and rulings»; no la miré porque el hallazgo venía de un revisor.
- **Coste**: una ronda más sin revisar, y los dos commits finales quedan `sin revisar`.
- **Propuesta**: mover a «Closing the review» la frase de que un arreglo que añade un AND a la spec para como desvío, aunque lo pida un revisor, y quitarla de otro sitio.
- **Verificada**: sí — contrastado con `skills/sdd-implement/SKILL.md`, «Deviations and rulings».
- **Criterio de aceptación**: GIVEN un hallazgo de revisión cuyo arreglo añade una condición a un requisito WHEN el hilo hace la pasada THEN para como desvío o lo adjudica, sin escribir la condición.

### 3. Dos atajos míos que la herramienta dejó pasar

- **Qué pasó**: un commit WIP con `--no-verify`, deshecho y rehecho con el hook. Y `sdd task done <plan> 1 <base> -- node -e "process.exit(0)"`, que anotó la task como completa con una verificación vacía; la real había corrido antes.
- **Fuente**: `tasks.md` de la 0263, `## Rulings`; constitution de `tech-stack.md`, «Nunca `--no-verify`».
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md`, Native, paso 4; verbo `sdd task done`.
- **Por qué el kit no lo evitó**: la primera regla existía y no la apliqué. La segunda la cumple cualquier comando.
- **Coste**: unos minutos; sin publicar.
- **Propuesta**: ninguna para el primero, un solo caso. Para el segundo, que `sdd task done` compare el comando con la «Verificación» de la task y avise si difiere.
- **Verificada**: sí — reproducido en esta sesión, PowerShell.
- **Criterio de aceptación**: GIVEN una task con «Verificación» `npx vitest run x` WHEN `sdd task done … -- node -e "process.exit(0)"` THEN avisa de que el comando no es el de la task.

## Lo que hice por iniciativa propia

- Un control con el kit anterior (`control-base`) para saber si la pregunta de `v1b` era un retroceso. Funcionó: lo era en parte, y dirigió el arreglo.
- Un `BATTERY_DIR` temporal con un solo escenario y n=1 para medir un arreglo con 0,26 $ de margen. Funcionó; `battery.mjs` no tiene filtro por escenario.

## Funcionó, no tocar

- El techo de `SUBJECT_CAP` y `COST_CAP` del lanzador.
- Los ejes por separado: el de Spec encontró ocho reglas que no llegaban al paso que cierra; el de Código, solo una.
- `sdd merge --sync` y `sdd merge --push`.

## Menores

- No di el anuncio de carril y perfil antes de los sujetos, ni invoqué `sdd-grilling`: el prompt ya traía las decisiones — `skills/sdd-propose/SKILL.md` paso 2.
- Lancé los revisores sin `sdd watch subagent` ni cargué `sdd-parallel-agents`; volvieron en menos de 5 min — `skills/sdd-verify/SKILL.md`, «Final review».
- La línea base en worktree desanclado no corrió: me apoyé en el pre-commit de la apertura — `skills/sdd-worktrees/SKILL.md` paso 3.
- El lanzador exige una copia del kit sin `.docs/`; el primer intento falló sin coste — `tests/headless/campaign.mjs`.
- `Diferir: … a cargo de <quien valida>` llevó a dos sujetos a escribir el nombre de git, y el lanzador no guardó sus `texts.txt` — `validation-template.md`.
- `t1-2` arranca el entorno sin `startEnvironment`, `g3-2` escribe tras la frase final y `g1-2` no lanza el panel: una vez cada uno, sin fila — `validation-template.md`.
