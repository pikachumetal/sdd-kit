---
id: 20261125-175114-patch-0364-publish-from-integration-checkout
task: 0364
title: Patch — `sdd roadmap publish` publica desde el checkout de la integración
type: patch
solution: causa raíz
status: done
created: 2026-11-25
branch: patch/0364-publish-from-integration-checkout
commit: c98237a58
---

# Patch 0364 — `sdd roadmap publish` publica desde el checkout de la integración

Validación: agente, «Perfil delegate» — `validation.mode: field` en este repo: la herramienta se valida con sus tests y el uso real llega por los tickets.

## Capacidades

- Ninguna, porque ninguna capacidad describe `sdd roadmap publish`.

## 1. Síntoma

Fila «`sdd roadmap publish` falla desde el checkout donde está la rama de integración» de la «Lista» de `debt.md` ([ticket de document-manager](../../field-reports/20261124-173458-patch-0000-colisiones-de-ids.md) §4, [ticket de dev-tools](../../field-reports/20261125-172920-patch-0001-localhost-ports.md) §3). Reproducido con la CLI de `dist/` en un repo nuevo con `develop` sacada, `ROADMAP.md` commiteado y luego editado:

```text
$ sdd roadmap publish --project-root . --into develop --message x ROADMAP.md
destino con cambios: ROADMAP.md en <repo>
exit=1
$ git log -1 --format=%s
init
```

## 2. Causa raíz

`withIntegrationTarget` (`cli/src/merge/integration.ts:14`) busca el worktree que tiene sacada la rama de integración y, si lo hay, lo usa como destino. Cuando `--project-root` es ese mismo checkout, origen y destino son el mismo árbol. `commitFiles` (`cli/src/roadmap/publish.ts:69`) llama entonces a `assertTargetClean`, que ve con cambios el fichero que se quiere publicar, porque es la propia edición, y para en `publish.ts:44`. El diseño solo contemplaba un origen distinto del destino: copiar el fichero sobre sí mismo y pedir un destino limpio no tiene sentido en ese caso.

Además, en ese mismo árbol, si el commit fallara, `rollback` haría `git checkout HEAD -- <fichero>` y borraría la edición del usuario: es el mismo defecto (origen tratado como un destino desechable), con pérdida de datos.

## 3. Fix

- **Fichero(s)**: `cli/src/roadmap/publish.ts`, `cli/test/roadmap/publish.slow.test.ts`, `cli/test/roadmap/publish-failures.slow.test.ts`
- **Cambio**: si el destino es el árbol de `--project-root`, `commitFiles` no copia ni exige destino limpio: hace commit ahí mismo de los ficheros nombrados (`git commit -- <ficheros>`), bajo el mismo cerrojo; si el commit falla, solo los saca del índice y deja la edición.
- **Decisiones**:
  - Si el commit falla en ese árbol, `git reset -- <ficheros>` deja la edición en disco, pero sin stagear: se pierde un staging parcial previo de los ficheros nombrados (`git add -p`); restaurar el índice entero sería más código para un caso raro — sin el dev-lead (no cambia lo que el usuario ve ni puede hacer: la edición no se pierde)
  - En ese árbol se publica solo lo nombrado y los demás ficheros sucios se quedan como están; para si un fichero nombrado no tiene cambios — dev-lead (propuesta del prompt de lanzamiento, perfil delegate)

## 4. Verificación

Gate: `moon run kit:test-headless cli:typecheck cli:test --affected --base develop` → cli:test: corrió 91/91 ficheros (2591 tests, 15 saltados) · kit:test-headless: corrió 8/8 · cli:typecheck: corrió · 154 s. Los `*.slow.test.ts` del fix no van en el gate (`cli:test-slow`, a la release): corridos aparte, fila 3.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | reproducir el síntoma → ahora OK: el mismo repo de §1, con `other.txt` también sucio, tras `moon run kit:build` | ✅ `exit=0`; `git log -1 --name-only` → `x` / `ROADMAP.md`; `git status --short` → ` M other.txt` |
| 2 | RED antes del fix: `pnpm exec vitest run test/roadmap/publish.slow.test.ts test/roadmap/publish-failures.slow.test.ts --test-timeout 120000` (desde `cli/`) | ✅ falla como se espera: «expected 1 to be +0» (publica desde el checkout), «expected 'git commit falló en …' to contain 'sin cambios que publicar: …'» (fichero nombrado sin cambios) y «expected 'destino con cambios: …' to contain 'git commit falló'» (commit fallido en el mismo árbol) |
| 3 | GREEN tras el fix y los minors de la revisión, mismo comando, y `pnpm exec tsc --noEmit -p .` | ✅ `Test Files 2 passed (2)` · `Tests 24 passed (24)` · tsc sin errores |

Revisión (un revisor sonnet, `sdd-kit:effort-medium`): sin hallazgos important; causa raíz confirmada.

- minor, comparación de rutas con `===` sobre `realpathSync.native`: corregido, usa `samePath` de `cli/src/git/git.ts`, como el resto de la CLI.
- minor, `git reset` tras un fallo pierde un staging parcial previo de los ficheros nombrados: aceptado y anotado en §3 «Decisiones»; la edición en disco no se pierde.
- minor, sin test del proyecto en subcarpeta en el camino nuevo: corregido, test «publishes in place a project that lives in a subfolder of the develop checkout» (añadido tras el fix: no se vio en RED; ejerce la misma rama que el test 1).
- minor, sin test de un fichero staged ajeno: corregido, el primer test nuevo stagea `.docs/sdd/notas.md` y comprueba que sigue `A` tras publicar.

Validación en campo: 2026-11-25 · smoke de la fila 1 con la CLI de `dist/` (salida 0, `ROADMAP.md` en el commit de `develop`, `other.txt` intacto) · `publish*.slow.test.ts` 24/24 · gate 154 s en verde · no probado: el uso real desde el checkout de `develop` en un proyecto, que llega por los tickets.

## 5. Tiempo (ligero)

- Estimación: 0,5 h + 0,03 h del gate de cierre (93 s, patch 0286)
- Inicio: 2026-11-25T17:51Z
- Esfuerzo real: 0,17 h — reloj de la sesión 0,17 h desde 2026-11-25T17:49Z, sin 0 min de espera al dev-lead (0 esperas)
- Desviación: −68 % frente a 0,53 h; sin esperas ni huecos (0 min): la causa estaba en una sola función y el arreglo reutilizó `samePath` y los tests de `publish` existentes.
- Coste de sujetos: no aplica
