# RED — la migración a v2.0.0 y los nombres de las skills de feature (task 0064)

Baseline del paso nuevo de `migrations/v2.0.0.md` (decisión 14 de la [spec](../.docs/sdd/specs/20260925-163055-task-0064-task-to-feature-rename/spec.md)). El kit es una copia de la rama en `9963d5b` (`git archive`): las skills ya se llaman `sdd-start-feature` y `sdd-end-feature`, y `v2.0.0.md` todavía no tiene el paso. El molde, el `subject.sh` y la salida están en [`red/`](../.docs/sdd/specs/20260925-163055-task-0064-task-to-feature-rename/red/), con el lanzador de referencia de `tests/headless/`.

El enrutado tras el renombrado no lleva RED: el control son las filas de [`auto-routing-green.md`](auto-routing-green.md), medidas con los nombres viejos, y se repiten en el GREEN.

## Molde (`m1`)

`salas` en el kit 1.2.0 (`sdd-kit.json` con `version: 1.2.0`, ids en secuencia y perfil `delegate`):

- `CLAUDE.md`: «arranca el trabajo con `sdd-start-task` y ciérralo con `sdd-end-task`».
- `.docs/sdd/constitution.md` (Art. I): «Toda task se cierra con `sdd-end-task`».
- Una capacidad válida (`bookings.md`, con propósito y sin historial), así que los pasos 1 y 2 de `v2.0.0.md` se saltan.
- El histórico también nombra `sdd-end-task`: `specs/20260910-080000-task-0012-login/spec.md`, `changelog.md` y `roadmap.md`.

Petición: «Actualízame al kit. Haz lo que toque sin preguntarme: el dev-lead leerá el informe al final.» Un sujeto Sonnet, 40 turnos como máximo.

## Resultado

| Escenario | Sujetos | Menciones vivas que quedan | Histórico intacto | Marcador |
| --- | --- | --- | --- | --- |
| `m1` | 1 | ❌ 2: `CLAUDE.md` (las dos skills) y `constitution.md` (`sdd-end-task`) | ✅ | ✅ `2.0.0` |

El sujeto **vio el hueco y lo dejó fuera**: «**Rename task → feature.** `CLAUDE.md` y `constitution.md` (Art. I) mandan usar `sdd-start-task` y `sdd-end-task`, que ya no existen: el kit tiene `sdd-start-feature` y `sdd-end-feature`. Ninguna migración cubre ese rename. […] `CLAUDE.md` y la constitution conviene actualizarlos a mano, y esta última necesita su aprobación por ser un documento de anclaje» ([`m1-1.texts.txt`](../.docs/sdd/specs/20260925-163055-task-0064-task-to-feature-rename/red/out/m1-1.texts.txt)).

Tras migrar, el proyecto enruta a dos skills que no existen hasta que alguien lee el informe y edita a mano. Hay dos racionalizaciones que la guía tiene que cerrar:

- «Ninguna migración cubre ese rename».
- «La constitution necesita su aprobación por ser un documento de anclaje». El paso nuevo va sin gate porque solo cambia un nombre, igual que el hotfix → patch de la v0.4.0.

Coste: 1 sujeto, 0,34 $ (12 turnos). La primera pasada no guardó la salida (`SPEC_DIR` relativo, y el sujeto hace `cd` al molde); se regeneró desde el stream y el molde, sin relanzar, y `state.txt` lo dice en su primera línea.

## Enmienda del 2026-09-25: prefijo de cierre de fila (`r1`)

Molde `mt` de la 0018 (feature SALAS-142 lista para cerrar, que salda en parte una fila de «Deuda técnica»), con la carpeta pasada a `20260919-090000-feature-SALAS-142-slot-format` y el campo `feature:`. Kit en `a9e9211`, cuyo `roadmap-template.md` todavía manda escribir `<Task|Patch>`. Petición: «Invoca la skill sdd-kit:sdd-end-feature y cierra la feature SALAS-142…».

| Escenario | Sujetos | Prefijo escrito | Esperado |
| --- | --- | --- | --- |
| `r1` | 1 | ❌ `**[Task SALAS-142, 2026-09-25: parcial — …]**` | `**[Feature SALAS-142, …]**` |

Con todo lo demás hablando de features, el sujeto copia el `Task` de la plantilla. Coste: 0,36 $ (13 turnos).
