---
id: 20261019-115419-feature-0201-merge-minors
feature: 0201
title: Walkthrough — Menores de sdd merge diferidos de la 0193
spec: ./spec.md
status: done
created: 2026-10-19
---

# Walkthrough — Menores de `sdd merge` diferidos de la 0193

## 1. Cambios realizados

- **Hotfix** (`cli/src/merge/hotfix.ts`):
  - Falla con `--tag: no se pudo consultar las etiquetas de '<remoto>'` si `ls-remote --tags` no sale, también con `--check`.
  - Nombra `sin remoto` en el mensaje de remotos distintos.
  - Trae la rama estable y las `release/*` con `--prune`.
- **`--sync`** (`sync.ts`): rechaza `--branch` y un HEAD desacoplado.
- **Merge que falla sin conflictos** (`attempt.ts`): con `MERGE_HEAD`, lo rechazó un hook; sin él, `<paso>: git merge falló sin conflictos.` con la cola de la salida de git.
- **Avisos solo con el merge hecho** (`registries.ts`): `registros:` y `mergiraf: resuelto` se guardan y solo salen si el merge se commitea; `mergiraf: no resuelve` sale siempre.
- **`dedupeRows`** (`keyed.ts`): compara cada fila con todas las de su id; la cabecera de una tabla no lleva id.
- **Limpieza**:
  - `MARKER` en un solo sitio.
  - Fuera el reexport de `isRegistry`.
  - Fuera el campo `lines` sobrante.
  - `seen.set` sin truco.
  - Early return en `completeMergeAttempt`.
- **Tests**:
  - `MERGE_HEAD` aislado.
  - `--check` sin fetch.
  - `mergiraf.test.ts` limpia su temporal.
- Commits: apertura `04e7ac61`, implementación `ad0e411c`, y el cierre.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (de la spec): 2,5 h
- Esfuerzo real: ~0,7 h — aproximado con las horas de los commits y de la sesión (de ~11:50Z a ~12:30Z). `sdd session tokens` dice «no medido», porque la sesión se abrió en el worktree de la 0193 y los transcripts cuelgan de esa ruta.
- Desviación: −1,8 h (−72 %)
- Causa de la desviación: los menores venían con su arreglo descrito en la revisión de la 0193, y no hubo pasada de fix ni re-revisión. Es la misma tendencia que la 0193 (−68 %).
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: no medido (sin transcripts de Claude Code para este worktree)
- Tokens de subagentes: no medido (sin transcripts de Claude Code para este worktree)
- Coste de la sesión: no medido (sin transcripts de Claude Code para este worktree)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- En el punto 9, el test de `MERGE_HEAD` y el de `--check` sin fetch se añaden junto a los que ya había en vez de sustituirlos. Los viejos siguen probando su caso (cambios con conflicto; dos releases conocidas en local).

### Decisiones tomadas sin el dev-lead

- La receta de `sdd-archive` no se edita (✋ 1 de la spec): el baseline no muestra el fallo, porque el GREEN de la 0193 leyó bien `base: integrada` y el error de cambios sin commitear no se alcanza tras el paso 0. Si es erróneo, hará falta un RED cuando un cierre lo sufra en campo.
- Hallazgo Important del eje Código («el test de Mergiraf abortado no cubre el caso») rechazado. `twoMethodsFixture` deja en conflicto `src/rooms.ts`, que Mergiraf resuelve, y además `README.md`, y el test salió en rojo antes del arreglo. Si es erróneo, el test no protegería esa regresión.

## 4. Verificación

### 4.1 Builds

- Suite completa: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → `cli:test` 1060/1060, `cli:test-slow` 216/216 (con `mergiraf` 0.20.0), `cli:test-min` 1276/1276, `kit:test` 1325 pass / 0 fail · 504 s · sobre `ad0e411c`.
- RED: 10 tests nuevos en rojo antes del arreglo y 116/116 en `test/merge` después. Los tests de `MERGE_HEAD` aislado y de `--check` sin fetch ya pasaban: eran menores que pedían tests más finos.
- Revisión final: Spec opus+high, lista para fusionar (4 Minor) · Código sonnet+high, «with fixes» con 1 Important rechazado (ver «Decisiones») y 5 Minor · sobre `ad0e411c`. Sin pasada de fix ni re-revisión.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · suite completa verde (cli 1060 + slow 216 + min 1276, kit 1325/0) · los THEN nuevos por suite · revisión final Spec y Código sobre ad0e411c, sin hallazgos que arreglar

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| `git merge` sin conflictos ni `MERGE_HEAD` → `base: git merge falló sin conflictos.` | suite | `sync.slow.test.ts` |
| Sin aviso `registros:` si el merge acaba abortado | suite | `registries.slow.test.ts` |
| Sin `mergiraf: resuelto` si el merge acaba abortado | suite | `mergiraf.slow.test.ts` |
| `--sync` en HEAD desacoplado; con `--branch` | suite | `sync.slow.test.ts`, `usage.test.ts` |
| `--sync` con un merge a medias sin cambios | suite | `sync.slow.test.ts` |
| Etiquetas del remoto sin consultar, con y sin `--check` | suite | `hotfix.slow.test.ts` |
| Release borrada en el remoto; `--check` sin fetch | suite | `hotfix.slow.test.ts` |
| Remotos distintos con uno `sin remoto` | suite | `hotfix.slow.test.ts` |

### 4.3 Residuales / deuda generada

Minors diferidos de la revisión final. No abro fila de deuda: son de forma y la conducta está cubierta.
- El test de `MERGE_HEAD` y el de `--check` se añadieron junto a los viejos.
- El error de git sin conflictos solo se prueba en `--sync`.
- El test del HEAD desacoplado no comprueba `HEAD` tras fallar.
- `resolveConflicts` filtra por el prefijo literal `mergiraf: no resuelve`.
- `void lines.push`.
- `failedWithoutConflicts` aborta y construye el error.
- La cabecera sin id solo se prueba con `dedupeRows`.
- Un trozo que parte la tabla entre la cabecera y el separador.

## 5. Aprendizajes

- Una sesión que arranca una feature desde el worktree de otra no deja medir el tiempo con `sdd session tokens`, porque los transcripts cuelgan de la ruta de la primera → aproximado aquí. Es candidato al ticket del kit.

## 6. Adendas

- 2026-10-19 — Medida real con el `sdd session tokens` de la feature 0202, por ventana: esfuerzo real 0,35 h (reloj de la sesión 0,48 h desde 2026-10-19T11:54Z, sin 8 min de espera al dev-lead), coste de la sesión 5,06 $ (hilo 3,79 $ + subagentes 1,27 $). La §2 da ~0,7 h aproximadas, y el estimation-log la sigue leyendo así porque el cuerpo no se reescribe — feature 0202
