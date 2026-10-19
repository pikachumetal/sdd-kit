---
id: 20261019-142606-feature-0199-v3-migration-texts
feature: 0199
title: Walkthrough — Migración v3.0.0, textos, reglas del proyecto y marcador
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-19
---

# Walkthrough — Migración v3.0.0: textos, reglas del proyecto y marcador

## 1. Cambios realizados

- **`skills/sdd-upgrade/references/migrations/v3.0.0.md`**: cuatro pasos nuevos:
  - 5, nombres de skills retiradas, en los documentos vivos y en `.claude/skills` y `.claude/commands`, sin tocar la historia;
  - 6, el método de estimación de la 0188;
  - 7, el marcador con `sdd upgrade --mark 3.0.0`;
  - 8, la revisión de reglas del proyecto contra el kit, con su pregunta «¿Aplico estas propuestas?» y su propio commit.

  El paso 4 ve también las rutas entre backticks, y entran los seis menores de la 0197. Todas las búsquedas son `git grep --untracked`, con `:(glob)`. Commits `d1d51441` y `323ccea3`, y la pasada de fix, juntada en el cierre.
- **`skills/sdd-upgrade/SKILL.md`**:
  - «Writing a new migration» gana tres reglas: el paso final de reglas, el paso que actualiza la copia de una plantilla cuya regla cambió, y ninguna ruta opcional a `Select-String`.
  - La skill atiende «revisa las reglas del proyecto contra el kit» con el proyecto ya al día.
- **`skills/sdd-upgrade/references/migrations/v2.0.0.md`**: la «Verificación» de nombres pasa a `git grep --untracked`, que ya no da falso verde sin `AGENTS.md`.
- **Tests**:
  - `MigrationInitParity` fija el `git grep` de la v2.0.0 y tres reglas de la v3.0.0: `--untracked`, la historia fuera del paso 5 y la frase para reanudar.
  - `ArchiveSkill` deja a `v3.0.0.md` nombrar las skills retiradas.
  - En `WordBudget`, `sdd-upgrade` pasa a 980 y el kit a 87600.
- **Batería** `tests/batteries/sdd-upgrade/`:
  - El molde v2x gana skills retiradas en `CLAUDE.md`, `.claude/commands/pregunta.md` y la historia; el método de estimación 2.x con una nota; la regla de ids; y una evidencia relativa.
  - La rúbrica gana V7-V12, y la persona contesta la tabla de reglas.
  - Commit `52724aa2`.
- **Evidencia**: [`tests/v3-migration-texts-red.md`](../../../../tests/v3-migration-texts-red.md) y [`tests/v3-migration-texts-green.md`](../../../../tests/v3-migration-texts-green.md).

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3h
- Esfuerzo real: ~2,3h, aproximado. `sdd session tokens` mide la sesión entera, que abrió también la 0157 y la 0197 (reloj de 39,87 h desde 2026-10-17T22:01Z). La 0199 va desde el prompt de arranque, tras el cierre de la 0197, hasta el cierre: ~13:50-16:10 por las marcas de los commits y del cierre, sin las esperas a las secciones y a la pregunta del coste.
- Desviación: -0,7h (-23 %)
- Causa de la desviación: no aplica (dentro de ±30 %).
- Compactación: no.
- Modelo del hilo: Opus 5.5, effort no registrado.
- Tokens del hilo: no medido por feature. La sesión entera da 35.784.594 — claude-opus-5-5 35.784.594.
- Tokens de subagentes: 2.873.742 en 3 despachos — Re-review final 0199 claude-opus-5-5 351.804 / 1 min; Final review — Spec axis claude-opus-5-5 1.838.555 / 4 min; Final review — Code axis claude-sonnet-5-5 683.383 / 2 min
- Coste de la sesión: 14,05 $ (hilo 11,61 $ + subagentes 2,44 $), sesión entera, con la 0157 y la 0197.
- Coste de sujetos: 3,54 $ en 9 sujetos Sonnet — RED 0,79 $; GREEN 1,00 $; REFACTOR 1 0,86 $; REFACTOR 2 0,89 $.
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La pasada de fix añade la reanudación de la revisión de reglas a `sdd-upgrade/SKILL.md` (la `description` y el paso 1).
- La pasada de fix toca `tests/MigrationInitParity.Tests.ps1` y `tests/ArchiveSkill.Tests.ps1`, que el plan no listaba.
- La campaña llegó a 9 sujetos de los 11 previstos, pero a 3,54 $ frente a ~2,5 $.

### Decisiones tomadas sin el dev-lead

- La línea base es el pre-commit de la apertura (`kit:test-fast` 1244), y el gate completo corre al cierre — coste si mal: un rojo de la base se vería al cierre.
- El contador de `run.sh` cuenta el seco que está en `SPEC_DIR`, y el RED salió con `SUBJECT_CAP=2`, así que solo corrió `v1-1`. El seco sale de `SPEC_DIR`, los techos pasan a los de la spec, y `v1-2` se lanza solo — coste si mal: ninguno.
- Los `git grep` de la spec y del plan no funcionaban tal cual:
  - `--untracked` detrás del patrón sale con 128;
  - `'.docs/sdd/*.md'` sin `:(glob)` entra en `specs/`.

  Van con `--untracked` delante y `:(glob)`; es una enmienda de la spec que no cambia la conducta del THEN — coste si mal: ninguno.
- El RED de `v2.0.0.md` se hizo en una carpeta temporal con `git init` y sin `AGENTS.md`. La línea vieja solo da el error de ruta, que pasa por verde; la nueva devuelve la cita de `CLAUDE.md` y deja fuera `roadmap.md` y `specs/` — coste si mal: ninguno.
- `MigrationInitParity` fijaba el literal viejo de `Select-String`, y `ArchiveSkill` prohibía nombrar `sdd-end-feature` fuera de las migraciones pasadas. Los dos se ajustan a la 0199 — coste si mal: ninguno.
- V5 de la 0197 («algún fichero cambia») contradecía la decisión 12 aprobada, la de los pasos sin gate que corren sin el dev-lead. Pasa a «se mueve, se borra o cambia de forma». La revisión de Código la marcó como aserción RED cambiada; la de Spec la acepta — coste si mal: un cambio de forma sin dev-lead pasaría por un paso sin gate.
- REFACTOR 1: el paso 8 acaba con «¿Aplico estas propuestas?» y abre la ruta del kit antes de ponerla. Sin la pregunta, 2 de 2 sujetos dejaban la tabla de reglas en el informe con el dev-lead delante — coste si mal: ninguno.
- REFACTOR 2: «`sdd-consult` (también `/sdd-consult`)» pasa a dos filas. Un sujeto quitó la barra del comando — coste si mal: ninguno.
- El REFACTOR 1 llevó la campaña a 2,65 $ sobre ~2,5 $ antes de parar. La ronda 2 la aprobaste tú: «Sí, v1 ×2 (~0,85 $)» — coste si mal: 1 $ de más.
- Revisión final:
  - **Código**: 3 Important (`--untracked` en `v2.0.0.md` y en el primer grep del paso 4, y V5).
  - **Spec**: 4 Important (el paso 5 tocaba `changelog.md`, `client-changelog.md` y `roadmap.md` de `.docs/sdd/`; nada probaba la historia intacta; la revisión de reglas pendiente no se podía reanudar; y `--untracked` en la v2.0.0).

  Se arreglaron en una pasada, con 6 tests RED→GREEN, salvo V5, que va por ruling — coste si mal: ninguno.
- El arreglo del molde («Cerrada con `sdd-end-feature`.» en la historia) no se midió con sujetos, porque ya se había pasado el dinero previsto. El paso 5 deja fuera `specs/` por pathspec, y lo fija el Pester — coste si mal: un sujeto que reescribiera un walkthrough a mano no se vería hasta el uso.
- La re-revisión deja 3 Minor, adjudicados — coste si mal: bajo:
  - la frase de historia del paso 5 con dos listas;
  - la tabla de `using-sdd`, que no enruta «revisa las reglas del proyecto contra el kit»;
  - «el último paso de esa versión» supone que la migración acaba en la revisión de reglas.

**Minors diferidos**:
- El paso 5 no busca en `README.md`, `PRODUCT.md` ni `ROADMAP.md`.
- El último punto de la «Verificación» (`3.0.0` tras el marcador) es circular con el paso 7.
- El paso 8 no dice que se salta si el 7 no hizo commit (sin el dev-lead lo hizo bien: `v2-1`).
- La línea 2.x del paso 6 va truncada con «…».
- La decisión 12 y V5 dicen que la estimación corre sin el dev-lead, pero su predicado (`steering/estimation.md`) depende del paso 1: sin el dev-lead no corre, y se aplica al reanudar.
- V8 falla solo si faltan las dos frases.
- `--untracked` no ve `.claude/` si el proyecto lo ignora entero.

## 4. Verificación

### 4.1 Builds

- Pre-commit de cada commit (`kit:test-fast` + `cli:test`): verde en todos.
- Pester de la feature: `MigrationInitParity`, `WordBudget` y `ArchiveSkill` → 195/195 tras la pasada de fix.
- Suite completa sobre la pasada de fix (juntada en el cierre), por partes y con `--force`: `moon run kit:test cli:typecheck cli:test --force`, `moon run cli:test-slow --force` y `moon run cli:test-min --force` → `kit:test` 1329/1329, typecheck verde, `cli:test` 1062/1062, `cli:test-slow` 207/207 y `cli:test-min` 1269/1269. Tardó 13,7 min, más de los 10 min de referencia: la deuda de la suite lenta ya tiene fila.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-19 · suite completa sobre la pasada de fix · campaña de 9 sujetos (RED `v1` 0/2; GREEN `v1` 2/2 en V1-V9 y `v2` 1/1; REFACTOR 1 y 2, `v1` 2/2 en V1-V11) · revisión final Spec y Código sobre `323ccea3`, pasada de fix con 6 RED→GREEN y re-revisión limpia

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Nombres: `CLAUDE.md` dice `sdd-archive` y `pregunta.md` `/sdd-explore`, sin gate | ejecución real (`refactor2` `v1-1` y `v1-2`) | ✅ |
| Nombres: las otras tres skills y las demás rutas | no probado (por lectura; el molde trae dos nombres) | — |
| Nombres: la historia de `specs/` intacta | suite (Pester: el pathspec deja fuera `specs/`); el molde con la frase, sin sujeto | ✅ |
| Nombres: el informe, o el paso saltado | ejecución real (`v2-1` y `v1`) | ✅ |
| Nombres: «Verificación» vacía, también sin `AGENTS.md` | ejecución real (carpeta temporal) | ✅ |
| Estimación: las dos líneas, con la nota intacta | ejecución real (V8) | ✅ |
| Estimación: otro texto va a gate; sin fichero se salta | no probado (por lectura) | — |
| Backticks: `CLAUDE.md` → `ROADMAP.md` | ejecución real (V9) | ✅ |
| Backticks: `README.md` | no probado (por lectura) | — |
| Marcador 3.0.0 con su commit | ejecución real (V6, V11) | ✅ |
| Tabla de reglas con la de ids y `nombrado.md`; solo lo aprobado; commit después | ejecución real (REFACTOR 1 y 2) | ✅ |
| Sin ruta no hay fila; sin filas se salta | por lectura | — |
| Sin el dev-lead, reglas pendientes y sin marcador | ejecución real (`v2-1`) | ✅ |
| Decisiones abiertas de un paso 3 pendiente en el informe | no probado (por lectura) | — |
| Diff del log con `--out` antes del gate | ejecución real (`tools.txt` de `refactor2`) | ✅ |
| MODIFIED v2.0.0: el `git grep` sin falso verde | ejecución real (carpeta temporal) y suite | ✅ |

### 4.3 Residuales / deuda generada

- Fila de deuda nueva: el contador de `run.sh` cuenta el seco de `SPEC_DIR`, y `subject_converse` solo sigue si el último mensaje lleva «?». Un gate que el sujeto da por pendiente sin preguntar nunca recibe la respuesta de la persona. `tech-stack.md` está en su tope.
- Los tres Minor de la re-revisión y los siete diferidos de arriba.
- Suite de 13,7 min: ya tiene fila (gate por partes, a la 0198).

## 5. Aprendizajes

- El `*` de un pathspec de `git grep` entra en las subcarpetas sin `:(glob)`, y `--untracked` va antes del patrón → `skills/sdd-upgrade/SKILL.md`, «Writing a new migration».
- Un gate de una migración que el agente puede dejar como pendiente lleva su pregunta literal; sin ella, el agente informa en vez de preguntar aunque el dev-lead esté → `v3.0.0.md`, paso 8.
- El contador de la batería y el corte de `subject_converse` → fila de deuda, porque `tech-stack.md` está en su tope.
- Revisión de skills: `.claude/skills/` (`skill-creator`, `writing-for-agents` y `writing-skills`) no nombra migraciones ni `sdd-upgrade`: no aplica.

## 6. Adendas
