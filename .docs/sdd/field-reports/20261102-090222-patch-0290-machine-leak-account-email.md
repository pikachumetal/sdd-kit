---
kit_version: 2.3.4
lane: patch
id: 20261102-090222-patch-0290-machine-leak-account-email
task: 0290
mode:
date: 2026-11-02
---

# Ticket para el kit — patch 0290: `findMachineLeak` compara también con el email de la cuenta

## Contexto

- Carril y modo: patch, petición cerrada, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-tdd`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,26 h frente a 0,5 h + 0,17 h de gate estimadas
- Coste en tokens: 3,77 $ con `sdd session tokens`

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. Un fichero sin commitear de antes de la sesión bloqueó `sdd merge --sync`, y la parada llegó tarde

- **Qué pasó**: `git status` mostraba `.claude/.profile.json` modificado desde el arranque de la sesión. En el paso 0 de `sdd-archive` lo di por ajeno al patch y seguí sin preguntar. En el paso 6, `sdd merge --sync` paró: `base: 'patch/0290-machine-leak-account-email' tiene cambios sin commitear; commitéalos antes de integrar la base`. Pregunté entonces: el dev-lead respondió que es un cambio suyo para usar otra cuenta de Claude, que no va a `develop`. Lo aparté con `git stash push -m <etiqueta> -- <fichero>`, fusioné y lo restauré con `git stash apply <sha>`.
- **Fuente**: salida de `git status --porcelain` y de `node cli/bin/sdd.js merge --sync` en esta sesión; `skills/sdd-archive/SKILL.md` paso 0.1
- **Dónde en el kit**: `skills/sdd-archive/SKILL.md` paso 0.1; `sdd merge --sync` (`cli/src/merge/`)
- **Por qué el kit no lo evitó**: la regla existía (paso 0.1: parar y preguntar) y no la apliqué, porque el fichero no era del cambio. Además, las tres respuestas que ofrece («commiteo, descarto o paro») no cubren el caso de un fichero local de la persona que ha de sobrevivir al merge.
- **Coste**: una parada del dev-lead, 1 min de espera según `sdd session tokens`
- **Propuesta**: ninguna hasta un segundo caso. Si lo hay, el paso 0.1 ofrece una cuarta opción, «lo aparto durante el merge y lo restauro», con el stash etiquetado que ya describe el entorno.
- **Verificada**: sin verificar
- **Criterio de aceptación**: GIVEN un fichero versionado modificado por la persona antes de la sesión WHEN corre `sdd-archive` THEN pregunta en el paso 0, con la opción de apartarlo y restaurarlo, antes de escribir ningún registro

### 2. El aviso de la lectura de la cuenta no se veía dentro de Vitest

- **Qué pasó**: el test del aviso espiaba `console.error` y pasaba. En el humo de la validación, la ejecución real del guard staged sin la clave pasó sin aviso visible: Vitest 5 no enseña la consola de un test que pasa. Con `--silent=false` sí salía. Moví el aviso a `process.stderr.write`, que el reporter por omisión sí enseña, con su RED (el espía en `process.stderr.write` falló antes del cambio).
- **Fuente**: `npx vitest run test/kit/subject-output-privacy.test.ts -t "ningún fichero de evidencia"` con `CLAUDE_CONFIG_DIR` en un `.claude.json` sin la clave, en Git Bash: sin la línea del aviso; la misma orden con `--silent=false`: `no se pudo leer oauthAccount.emailAddress de .claude.json: el email de la cuenta queda sin comprobar`; `patch.md` del patch 0290, §4, humo 7
- **Dónde en el kit**: `skills/sdd-implement/references/patch-flow.md` paso 5, que pide solo el test del arreglo; lo cazó el humo con ejecución real de `skills/sdd-archive/SKILL.md` paso 1
- **Por qué el kit no lo evitó**: el test afirmaba sobre un espía, no sobre lo que ve la persona. La regla de `sdd-archive` («un THEN visto en una interfaz solo cuenta con ejecución real») sí lo cazó, al cierre
- **Coste**: ~5 min, un segundo gate de 93 s y un squash del fix (commit `8df40f04`)
- **Propuesta**: ninguna en las skills; el dato vive en el comentario de `accountEmail` (`tests/headless/lib.mjs`)
- **Verificada**: sí — reproducido con la orden de «Fuente» en Git Bash
- **Criterio de aceptación**: GIVEN `accountEmail` sin la clave WHEN corre el guard staged en un test que pasa THEN la salida por omisión de Vitest lleva el aviso

## Lo que hice por iniciativa propia

- Comprobé el guard con la cuenta real de la máquina dentro de un test temporal que no imprimía el valor, y lo borré. Funcionó.
- El humo de la validación puso en el índice un fichero de evidencia con el email de un `.claude.json` falso, corrió el test staged y lo quitó del índice. Fue lo que cazó el hallazgo 2.
- Actualicé la línea de `tech-stack.md` sobre el email de la cuenta para que nombre el guard y la lectura compartida.

## Funcionó, no tocar

- La petición cerrada con las decisiones ya tomadas: ninguna parada de diseño.
- La regla de ejecución real del humo en `sdd-archive` paso 1.

## Menores

- Corrí `vitest` antes de comprobar `node_modules`; falló con `Cannot find package 'vitest'` y `pnpm install` lo resolvió en 1 s. La regla existía — `skills/sdd-propose/SKILL.md` paso 2.
- El prompt de lanzamiento y las filas 0290 y de deuda enlazan `field-reports/20261101-214727-patch-0268-…`, y el fichero es `20261031-214727-…`; `sdd roadmap check` no mira los enlaces. El prompt también situaba la lectura de la cuenta en `tests/headless/lib.mjs`, y estaba en `extract.mjs` — `skills/sdd-roadmap/SKILL.md`, no localizo el paso.
- Sin lint de documentación en `tech-stack.md`: el ticket no pasó ninguno.
