---
id: 20261102-084641-patch-0290-machine-leak-account-email
task: 0290
title: Patch — findMachineLeak compara también con el email de la cuenta
type: patch
solution: dev-lead
status: done
created: 2026-11-02
branch: patch/0290-machine-leak-account-email
commit: <hash>
---

# Patch 0290 — findMachineLeak compara también con el email de la cuenta

Validación: dev-lead — validación en campo (`validation.mode: field`)

## Capacidades

- Ninguna, porque ninguna capacidad describe `cli/test/kit/privacy.ts`.

## 1. Síntoma

Dev-lead: «la 0268 hizo que `extract.mjs` no guarde una salida con el email de la cuenta, pero el guard de la evidencia staged no lo mira. `findMachineLeak` (cli/test/kit/privacy.ts:59) solo compara con `user.name` y `user.email` de git. Una salida de sujeto añadida a mano llegaría al commit con el email, y el repo es público.»

## 2. Solución fijada

Dev-lead: «`findMachineLeak` compara también con el email de la cuenta, con la misma lectura de `.claude.json` que dejó la 0268»; «Reutiliza la lectura de la 0268, también `CLAUDE_CONFIG_DIR`, sin copiarla si se puede compartir. Si falta el fichero o la clave, avisa y sigue con git, como allí»; «El mensaje del test no imprime el valor».

Comprobado lo que da por existente: `findMachineLeak` en `cli/test/kit/privacy.ts:59` compara solo con git, y la lectura de la cuenta vive dentro de `tests/headless/extract.mjs`, un script con efectos al cargarse que no se puede importar.

## 3. Fix

- **Fichero(s)**: `cli/test/kit/privacy.ts`, `cli/test/kit/subject-output-privacy.test.ts`, `tests/headless/lib.mjs`, `tests/headless/extract.mjs`, `.docs/sdd/tech-stack.md`
- **Cambio**: la lectura de la cuenta pasa de `extract.mjs` a `accountEmail(env)` de `tests/headless/lib.mjs`, y la usan los dos. `findMachineLeak(evidence, env = cleanGitEnv)` compara también con ese email; el `env` llega a git y a la lectura, para que el test los fije con ficheros falsos.
- **Decisiones**:
  - Misma lectura que la 0268, `CLAUDE_CONFIG_DIR` incluida, compartida y no copiada — dev-lead
  - Sin fichero o sin clave, aviso en stderr y sigue con git — dev-lead
  - El test no imprime el valor: `findMachineLeak` devuelve solo rutas — dev-lead
  - Tests con un email inventado, un `.claude.json` falso y una identidad de git falsa (`GIT_CONFIG_GLOBAL`) — dev-lead
  - `accountEmail` va a `lib.mjs` y no a un módulo nuevo: el prompt lo nombraba como sitio de la lectura, y `extract.mjs` no se puede importar porque corre al cargarse — sin el dev-lead; no cambia lo que ve el usuario del kit
  - El email se compara como `user.email`, sin distinguir mayúsculas y sin exigir palabra entera, igual que la identidad de git del mismo guard — sin el dev-lead; no cambia lo que ve el usuario del kit
  - El aviso sale por `process.stderr.write` y no por `console.error`: Vitest 5 calla la consola de un test que pasa, y en el pre-commit el aviso no se veía (humo 7) — sin el dev-lead; hace visible el aviso que el dev-lead pidió

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: los 2 tests nuevos sobre el código sin tocar | ❌ 2 rojos, `expected [] to deeply equal [ 'a/red/leak.txt' ]` |
| 2 | Evidencia con el email de un `.claude.json` falso, en mayúsculas: rojo, y el resultado solo nombra el fichero | ✅ `subject-output-privacy.test.ts` |
| 3 | Sin la clave: avisa, la evidencia limpia pasa y la identidad de git falsa da rojo | ✅ mismo fichero |
| 4 | `extract.mjs` con la lectura movida: sus tests de la 0268 | ✅ `subject-output-privacy.slow.test.ts`, 106/106 con `lib.test.ts` |
| 5 | Con la cuenta real de esta máquina, sin imprimir el valor | ✅ la evidencia con su email da rojo y la limpia no; sonda borrada |
| 6 | Ejecución real del guard: evidencia staged con el email de un `.claude.json` falso (`CLAUDE_CONFIG_DIR`) | ✅ rojo, nombra solo `red/leak.txt`; 0 apariciones del valor en la salida |
| 7 | Ejecución real sin la clave, evidencia staged limpia | ❌ primero: pasaba sin aviso visible, porque Vitest calla `console.error` en un test que pasa. RED con el espía en `process.stderr.write`; ✅ después: pasa y el aviso sale en la salida |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 303/303 · cli:typecheck: corrió 1/1 · cli:test: corrió 1861/1873, 12 saltados (93 s)

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,17 h del gate de cierre (10 min, patch 0286)
- Inicio: 2026-11-02T08:46Z
