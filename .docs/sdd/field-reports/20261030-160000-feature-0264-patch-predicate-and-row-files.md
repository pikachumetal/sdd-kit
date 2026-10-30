---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: feature
id: 20261030-140305-feature-0264-patch-predicate-and-row-files
task: 0264
mode: full
date: 2026-10-30
---

# Ticket para el kit — feature 0264: el predicado de patch en el roadmap y la evidencia de una fila

## Contexto

- Carril y modo: feature full, perfil `delegate`, validación en campo, Native
- Skills del kit usadas: `sdd-propose`, `sdd-start-feature`, `sdd-implement`, `sdd-worktrees`, `sdd-tdd`, `sdd-verify`, `sdd-archive`, `sdd-feedback`
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec), Sonnet 5.5 (eje Código y 12 sujetos)
- Coste en reloj: 0,44 h frente a 0,5 h estimadas
- Coste en tokens: 7,08 $ de sesión (hilo 5,71 $, subagentes 1,37 $) más 2,59 $ de sujetos

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Tres sujetos del RED se lanzaron sobre un molde roto: nada obliga a comprobar el molde antes de gastar

- **Qué pasó**: la primera tanda de `sdd-roadmap` murió con un `SyntaxError` en `subject.mjs` y dio `0/1 · rojo · faltan 1`. `pw1` corrió tres veces: con un comando inexistente en la petición y dos veces con el tope mal calculado («mide 42 y el tope es 20»). 0,51 $ de los 1,38 $ del RED no midieron nada, y el veredicto de la puerta dio `pw1 · 1/1 · verde` en las tres.
- **Fuente**: `spec.md` de la 0264, decisión 10; `propose/red/out/pw1-1.texts.txt` de su carpeta
- **Dónde en el kit**: `.docs/sdd/tech-stack.md`, «Baterías por skill»; `tests/headless/battery.mjs`
- **Por qué el kit no lo evitó**: el molde nuevo solo se ejercita lanzando un sujeto. Hay `node --check` a mano, pero nada construye el molde y enseña el estado que verá el sujeto
- **Coste**: 0,51 $ y dos vueltas del hilo
- **Propuesta**: que `battery.mjs` admita construir el molde sin lanzar (`DRY_RUN` ya existe en `campaign.mjs`) para correr su test antes de gastar; causa del fallo de escape, en el hallazgo 2
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un molde cuyo `test/words.test.js` está en rojo de partida WHEN se prepara el escenario sin lanzar THEN se ve el rojo sin coste

### 2. Un script escrito en un heredoc de Git Bash perdió barras invertidas, y corrompió molde y batería sin error

- **Qué pasó**: `/\s+/` quedó `/s+/` en `subject.mjs`, y el `\\|` de una regex se volvió alternancia: `battery.md:1` quedó ` 2 | 2/2 | 2 | 2/2 |# Batería…` y `n` no cambió, así que el GREEN salió con n = 1. Lo vio el eje Código. La corrección con `node -e` tampoco se aplicó, y un sujeto más (0,33 $) corrió con el mismo fallo.
- **Fuente**: `git log -p` de la rama; `green/` y `green2/` de la carpeta de la 0264; informe del eje Código
- **Dónde en el kit**: `.docs/sdd/tech-stack.md:44`, que avisa de `\r\n` desde un heredoc, no de las barras
- **Por qué el kit no lo evitó**: la regla existente no cubre este síntoma; tampoco comprobé el resultado antes de lanzar
- **Coste**: 0,33 $, una tanda partida en dos y un Important de la revisión
- **Propuesta**: en `tech-stack.md`, sustituir el aviso por «un script con barras invertidas se escribe con `Write`, nunca en un heredoc»
- **Verificada**: sí — los scripts escritos con `Write` en esta sesión no perdieron nada
- **Criterio de aceptación**: GIVEN un script con `/\s+/` WHEN se escribe según la regla THEN el fichero conserva la barra

### 3. `sdd roadmap publish` choca con el propio flujo cuando la integración está en el checkout del sujeto

- **Qué pasó**: 3 de 3 sujetos del RED recibieron «destino con cambios»: editan `roadmap.md` en la rama de integración y `publish` se niega. Dos commitearon a mano, saltándose el cerrojo, y uno dejó la fila sin publicar y preguntó. Se repitió en el GREEN.
- **Fuente**: `roadmap/red/out/*.texts.txt` y `roadmap/green/out/re1-1.texts.txt` de la carpeta de la 0264
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, checklist, paso 6; `sdd roadmap publish`
- **Por qué el kit no lo evitó**: el paso 6 no dice qué hacer con el cambio ya escrito en el destino
- **Coste**: ninguno en esta rama; un id sin publicar o un commit sin cerrojo en cada uso con ese checkout
- **Propuesta**: que `publish` acepte como suyos los cambios de los ficheros que recibe por argumento
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN `develop` sacada con solo `roadmap.md` modificado WHEN corre `sdd roadmap publish … .docs/sdd/roadmap.md` THEN commitea ese fichero con el cerrojo

### 4. La regla de contar tests no dice nada de una fila que aún no tiene tests que contar

- **Qué pasó**: 1 de 2 `re1` del GREEN escribió «Patch: bajar el tiempo del gate» con un prompt 🩹 y `hotfix/0008-…`, aunque antes hay que medir y no hay solución fijada. El otro dijo que no era un patch.
- **Fuente**: `roadmap/green2/out/re1-1/roadmap.md` de la carpeta de la 0264; informe del eje Spec
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, «Something concrete»; `launch-prompt-template.md`, que da `hotfix/` a un patch que sale de `develop`
- **Por qué el kit no lo evitó**: el predicado de la 0264 cuenta tests, y el de solución fijada vive en `sdd-propose`
- **Coste**: ninguno aún; una pregunta de carril al arrancar
- **Propuesta**: esperar otro caso
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN una fila cuya solución hay que investigar WHEN `sdd-roadmap` la escribe THEN no empieza por «Patch:»

## Lo que hice por iniciativa propia

- Conté el saldo de palabras con un script sobre una copia del `SKILL.md` antes de presentar la spec: salió −11 y no hubo enmienda por recortes.
- `rl1` midió también el prompt con un `TURN2`, porque el sujeto del RED no daba prompt de la fila que no iba primera.

## Funcionó, no tocar

- Sacar lo limpio antes de la spec ahorró tocar `sdd-start-patch` y mover la regla de la 0250.
- Los dos ejes vieron cosas distintas: Código, el título roto; Spec, que RE1 y RF1 no fijaban lo que el plan les atribuía.

## Menores

- El techo `SUBJECT_CAP` cuenta los sujetos de otras fases de la misma carpeta y cortó el segundo `m5` sin avisar — `tests/headless/campaign.mjs`.
- El plan de una task pasó a `sdd task done` un comando vacío, porque la verificación era leer sujetos: el ledger dice `node -e process.exit(0)` — `skills/sdd-implement/SKILL.md`, «Close, in this order».
- El gate imprimió «Tasks: 2 completed» y `cli:typecheck` no aparece en sus resultados de test; no comprobé si corrió aparte — `.docs/sdd/tech-stack.md`, «Gate de cierre».
