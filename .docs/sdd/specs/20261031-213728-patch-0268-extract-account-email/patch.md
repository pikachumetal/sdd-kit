---
id: 20261031-213728-patch-0268-extract-account-email
task: 0268
title: Patch — extract.mjs tampoco guarda una salida con el email de la cuenta
type: patch
solution: dev-lead
status: done
created: 2026-10-31
branch: patch/0268-extract-account-email
commit: 329e9768
---

# Patch 0268 — extract.mjs tampoco guarda una salida con el email de la cuenta

Validación: dev-lead — validación en campo (`validation.mode: field`)

## Capacidades

- Ninguna, porque ninguna capacidad describe `tests/headless/extract.mjs`.

## 1. Síntoma

Dev-lead: «el contexto de arranque de un sujeto trae el email de la cuenta de Claude, y `tests/headless/extract.mjs` solo compara la salida con `user.name` y `user.email` de git. Una salida con el email de la cuenta se guardaría y acabaría versionada en un repo público.»

## 2. Solución fijada

Dev-lead: «Sale con 3 y no escribe el fichero, como con la identidad de git, y el mensaje no repite el valor»; «si falta el fichero o la clave, `extract.mjs` lo dice en stderr y sigue con la comprobación de git, sin dar la salida por limpia en silencio».

Comprobado lo que da por existente: `~/.claude.json` de esta máquina lleva `oauthAccount.emailAddress`, y `identity` de `extract.mjs` solo conoce git.

## 3. Fix

- **Fichero(s)**: `tests/headless/extract.mjs`, `tests/headless/lib.mjs`, `cli/test/kit/subject-output-privacy.slow.test.ts`, `cli/test/kit/headless/lib.test.ts`, `.docs/sdd/tech-stack.md`
- **Cambio**: `extract.mjs` compara también con `oauthAccount.emailAddress` y sale con 3 con un mensaje propio; sin el dato, avisa en stderr y sigue. `saveExtract` repite ese aviso, que con salida 0 se perdía.
- **Decisiones**:
  - Sale con 3, no escribe y no repite el valor — dev-lead
  - Sin fichero o sin clave, aviso en stderr y sigue con git — dev-lead
  - Test con email inventado y `.claude.json` falso — dev-lead
  - Con `CLAUDE_CONFIG_DIR` puesta se lee `.claude.json` de esa carpeta, no el de `~`: esta máquina tiene dos cuentas con emails distintos (`~/.claude` y `~/.claude-gco`), y mirar el de `~` daría por limpia en silencio la salida de un sujeto de la otra — sin el dev-lead; no cambia lo que ve el usuario del kit
  - Un JSON ilegible da el mismo aviso, sin el texto de `JSON.parse`, que cita trozos del fichero — sin el dev-lead; no cambia lo que ve el usuario del kit
  - `GIT_IDENTITY` no cambia: fija la config de git del sujeto, y el email de la cuenta no pasa por git — sin el dev-lead; no cambia lo que ve el usuario del kit

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED: los 6 tests nuevos sobre el código sin tocar | ❌ 6 rojos, los esperados |
| 2 | Salida con el email de un `.claude.json` falso: sale con 3, solo el mensaje, sin el valor | ✅ `subject-output-privacy.slow.test.ts` |
| 3 | Sin fichero, sin clave o con JSON ilegible: avisa, guarda la salida limpia; con la identidad de git sale con 3 | ✅ mismo test, tres variantes |
| 4 | `saveExtract` guarda y repite el aviso | ✅ `lib.test.ts` |
| 5 | `kit:test-headless` sin `.claude.json`, como en la CI (`CLAUDE_CONFIG_DIR` a una carpeta vacía) | ✅ verde, 1 min 36 s |
| 6 | Con la cuenta real de esta máquina, comparando sin imprimir el valor | ✅ salida 3, stdout vacío, valor ausente de stderr; una salida limpia, 0 y sin aviso |

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → kit:test-headless: corrió 281/281 · cli:typecheck: corrió 1/1 (caché) · cli:test: corrió 1704/1716, 12 saltados (93 s, sobre 329e9768)

Validación en campo: 2026-10-31 · gate verde, RED/GREEN de 6 tests y comprobación con la cuenta real. No probado: un sujeto real; `CLAUDE_CONFIG_DIR` solo con ficheros falsos.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,02 h del gate de cierre (80 s, patch 0267)
- Inicio: 2026-10-31T21:37Z
- Esfuerzo real: 0,10 h — reloj de la sesión 0,10 h desde 2026-10-31T21:36Z, sin 0 min de espera al dev-lead (0 esperas). Medido antes de los registros de cierre. Desvío de más del 30 % a la baja: la petición traía la solución y el test, sin sujetos ni causa que investigar.
- Coste de sujetos: no aplica
