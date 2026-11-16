---
id: 20261015-105728-feature-0187-closing-cli
feature: 0187
title: Walkthrough — CLI del cierre
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-15
---

# Walkthrough — CLI del cierre: `sdd merge` para el hotfix, el destino sacado, la base en rojo, la suite una vez y el push que reintenta

## 1. Cambios realizados

- **Destino sacado y `--check`** (`26c4dcd2`): `cli/src/merge/exits.ts` (nuevo) da las salidas, y `destination.ts` arma el mensaje con el motivo, el `git diff --stat HEAD`, los ficheros sin seguimiento y las salidas. `checkDestination` hace lo mismo en solo lectura, sin cerrojo, fetch ni prune. `temp-worktree.ts` expone `freeTempFolder`.
- **`--verified-at`** (`888a7121`): `verify.ts` gana `onlyDocsSince` y `resolveCommit`. Un valor que no es un commit sale con 2 antes del cerrojo.
- **Base en rojo** (`6ee0c340`): `VerificationFailed` separa el rojo de la suite de `bloqueado:` y del rechazo del hook. `explainFailure` vuelve a correr el comando sobre la base y añade la línea `base:`.
- **Push que reintenta** (`1af2af94`): `pushDestination` distingue «avanzó» de otro rechazo (`remoteMoved`), y `publish` de `run.ts` integra, re-verifica y reintenta hasta 3 veces.
- **Hotfix con git-flow** (`6be691bb` y la pasada de fix, juntada en el cierre): `cli/src/merge/hotfix.ts` (nuevo) con las negativas de git-flow y de la etiqueta, la vuelta a la release abierta o a `merge.into`, el push atómico y el deshacer de todo. `mergeFeature` lleva la línea `Orden del dev-lead`.
- Tests: `exits.test.ts`, y `destination`, `verified-at`, `base-red`, `push-retry` y `hotfix.slow.test.ts`, nuevos en `cli/test/merge/`. `publishFromSeed` pasa a `helpers.ts`.
- Docs: delta fusionado en `capabilities/control-profiles.md` (2 MODIFIED, 6 ADDED y «Límites»); fila 0191 nueva para el punto (f), con su enmienda en la propuesta 0131; changelog.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 4h
- Esfuerzo real: 1,5h — reloj del hilo aproximado con las marcas de los commits: las cinco tasks de 13:05 a 13:40, la revisión final y la pasada de fix (unos 25 min de trabajo del hilo) y el cierre (unos 30 min). La espera a la respuesta del dev-lead sobre los revisores no cuenta.
- Desviación: −2,5h (−62 %)
- Causa de la desviación: el plan traía las firmas, los literales y los tests de cada task, y la implementación fue casi transcripción con TDD. Los tests lentos con repos reales se escribieron sobre `mergeFixture`, que ya existía. La estimación supuso que la task del hotfix pesaría la mitad, y costó unos 10 minutos más que las otras.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 42.348.738 — claude-opus-5-5 42.348.738
- Tokens de subagentes: 3.950.638 en 3 despachos — Re-review final fix pass claude-opus-5-5 830.725 / 3 min; Final review — Code axis claude-sonnet-5-5 853.836 / 2 min; Final review — Spec axis claude-opus-5-5 2.266.077 / 5 min
- Coste de la sesión: 19,89 $ (hilo 16,84 $ + subagentes 3,05 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Los tests de las Tasks 2, 3 y 4 van en ficheros nuevos (`verified-at`, `base-red` y `push-retry.slow.test.ts`) y no en `verify.slow.test.ts` ni `lock-and-base.slow.test.ts`.
- `verifyMerge` y `explainFailure` viven en `verify.ts`, no en `run.ts`, para que los use `hotfix.ts`.
- La pasada de fix movió la decisión de la vuelta dentro del cerrojo, tras sincronizar la rama estable y hacer fetch de `release/*`, y partió `integrateHotfix`.

### Decisiones tomadas sin el dev-lead

- La línea base del gate tenía `FastSuiteBudget` en rojo (34,2 s) con la máquina cargada por el propio gate. Es la fila 0190, y seguí. Si me equivoco, un rojo real del conjunto rápido quedaría tapado hasta el gate final.
- `destinationExits(path, files)`, sin el `into` del plan. Si me equivoco, añadir un parámetro.
- `--check` no hace `worktree prune` e ignora los registros sin carpeta. Si me equivoco, un registro podado a mano daría «temporal» en vez de «sacado».
- Los tests de las Tasks 2, 3 y 4 van en ficheros nuevos. Si me equivoco, mover tests.
- El log de la base se llama `sdd-merge-verify-base-<stamp>-<pid>.log`. Si me equivoco, un nombre.
- «Último commit verificado» en el bucle del push es el `HEAD` antes de reintegrar. Si me equivoco, una re-verificación de más o de menos.
- `publishFromSeed` pasa a `helpers.ts`, y `verifyMerge` y `explainFailure`, a `verify.ts`. Si me equivoco, un movimiento de código.
- La vuelta a una `release/` que el remoto no tiene no se sincroniza, y el push atómico la publica. Si me equivoco, se publica una release que solo estaba en local.
- El mensaje de vuelta con conflicto dice «y la etiqueta» solo con `--tag`. Si me equivoco, un texto.
- El worktree temporal de la vuelta se llama `merge-<rama>-<vuelta>`. Si me equivoco, un nombre de carpeta.
- `--order` con `--into` igual a `merge.into` también se registra. Si me equivoco, una línea de más.
- `*.md` fuera de `.docs/` cuenta como docs para `--verified-at`, también `skills/**/SKILL.md`, como fija ✋4 de la spec. Si me equivoco, en este repo un merge cuya base solo avanzó en skills salta `--verify`.
- Las negativas de uso del hotfix van en `hotfix.slow.test.ts`, porque necesitan la política de un repo. Si me equivoco, mover dos tests.
- El comentario `ponytail:` de `pushAll` se queda, porque es el marcador de las reglas de estilo. Si me equivoco, una palabra.
- La re-revisión dejó a medias el Important de la release abierta: `prepareHotfix` todavía decide «varias ramas release/ abiertas» antes del cerrojo, con los refs locales. El fallo es conservador: aborta con «fusiona a mano», nunca publica en una rama equivocada, y se arregla con un `git fetch` y relanzando. Si me equivoco, un hotfix necesario aborta hasta que alguien haga fetch.

## 4. Verificación

### 4.1 Builds

- `pnpm exec tsc --noEmit` en `cli/` → sin errores, en cada task y en el gate.
- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 875/875 · `cli:test-slow` 186/186 · `cli:test-min` 1061/1061 · `kit:test` 1258 pasan, 1 falla: `FastSuiteBudget`, 97 s con la máquina cargada por el gate (fila 0190; suelto, el conjunto rápido pasa 1178/0 en el pre-commit de cada commit) · unos 6 min.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-15 · suite: CLI 2122 tests en verde y `kit:test` con el rojo conocido de la fila 0190 · smoke de 8 THEN con ejecución real de `node cli/bin/sdd.js merge` sobre un repo de prueba con remoto · revisión final Spec y Código sobre 6be691bb, con pasada de fix y re-revisión: 1 Important a medias adjudicado y 16 Minor diferidos.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Destino sacado: motivo, `diff --stat`, tres salidas, sale con 1 | ejecución real | `roadmap.md` modificado en `develop`: el mensaje con `.docs/sdd/roadmap.md \| 2 +-` y las salidas 1, 2 y 3; exit 1 |
| Con `.gitignore` sucio, dos salidas | suite | `exits.test.ts` y `destination.slow.test.ts` (fichero sin seguimiento) |
| `--check` con el destino limpio dice listo | ejecución real | `destino: listo: 'develop' sacado en '…\smoke\repo', sin cambios`; exit 0 |
| `--check` sucio o con worktree temporal, sin tocar nada | suite | `destination.slow.test.ts`: refs y cerrojo iguales |
| `--verified-at` omite si solo cambian docs | ejecución real | `verificación: omitida: desde 8cfeea3 solo cambian docs` y `Fusionado feature/0002 en develop`; exit 0 |
| `--verified-at` verifica si cambió código | ejecución real | tras el hotfix (`fix.txt` en `develop`), `--verify "exit 1"` corre y falla; exit 1 |
| `--verified-at nada` sale con 2 | ejecución real | `--verified-at: 'nada' no es un commit` y el uso; exit 2 |
| Verificación en rojo: línea `base:` | ejecución real | `base: en rojo: el mismo comando también falla sin la rama (salida en …verify-base-….log)` |
| `base: en verde` y sin `base:` tras un `bloqueado:` | suite | `base-red.slow.test.ts` |
| Push que reintenta (2/3) y se rinde tras 3 | suite | `push-retry.slow.test.ts`, con otra sesión que publica desde la verificación |
| Rechazo sin avance: `push: no se pudo publicar …`, sin reintentar | suite | `push-retry.slow.test.ts` |
| Hotfix: merge en `main`, orden, etiqueta, vuelta y push atómico | ejecución real | `Fusionado hotfix/0200-fix en main: 5a57af9`, `etiqueta v3.0.1 en 5a57af9`, `Fusionado hotfix/0200-fix en develop: 57cb294`, `publicado en origin`; cuerpo con `Orden del dev-lead: «fusiona el hotfix del login en main»`; `v3.0.1` es `tag` y el remoto tiene `main`, `develop` y la etiqueta |
| Vuelta a la release abierta, varias abiertas, `release/` a `develop` | suite | `hotfix.slow.test.ts` |
| `--into main` sin `--order` sale con 2 | ejecución real | `--into 'main' distinta de merge.into necesita --order "<frase del dev-lead>"`; exit 2 |
| `--tag` sin `--into` y etiqueta existente | suite | `hotfix.slow.test.ts` |
| A `main` solo llegan `hotfix/` y `release/` | ejecución real | `--into: a 'main' solo llegan ramas hotfix/ o release/ (git-flow); 'patch/0201-typo' no lo es`; exit 1 |
| Vuelta con conflicto, verificación en rojo o remoto movido: se deshace todo | suite | `hotfix.slow.test.ts` |

### 4.3 Residuales / deuda generada

- Los 16 Minor diferidos de la revisión, en `tasks.md` § Minors diferidos. Ninguno cambia lo que ve el dev-lead salvo dos: el aviso de «varias releases» con refs viejos y la etiqueta inválida que sale con 1 tras deshacer en vez de con 2. Los dos son para la receta de la 0149 o un patch.
- Las skills (`merge-recipe.md`, `sdd-end-feature`) siguen sin nombrar las opciones nuevas: lo hace la 0149.

## 5. Aprendizajes

- Una pasada de fix que mueve una decisión dentro del cerrojo tiene que retirar también la comprobación vieja de antes del cerrojo: la re-revisión lo cazó a medias → fila «Menores diferidos de la feature 0187» de la deuda técnica del roadmap, para la 0149; sin regla nueva del kit.
- Un heredoc de Node que reemplaza texto con `\n` fallaba en los ficheros con CRLF (`skills/**/references/*.md`) y con escapes: ya lo dice `tech-stack.md` §Testing para Python, y vale igual para Node → sin cambio de doc, porque la regla ya cubre «el código con escapes se escribe con las herramientas de edición».

## 6. Adendas
