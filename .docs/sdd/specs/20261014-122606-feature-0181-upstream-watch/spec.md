---
id: 20261014-122606-feature-0181-upstream-watch
feature: 0181
title: Vigilancia de fuentes — revisión de las versiones nuevas y un check que la recuerde
mode: full
profile: delegate
status: approved
created: 2026-10-14
author: Claude (Opus 5.5)
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-14
---

# Spec — Vigilancia de fuentes

🦆 Hoy nadie avisa cuando una de las herramientas de las que el kit copia saca una versión nueva: OpenSpec se miró en la 1.11.0 y ya va por la 1.14.1 sin que nadie lo revisara. Con este cambio, al preparar una release, una comprobación compara la versión revisada de cada fuente con la última publicada; si hay una nueva, falla y dice qué comparar: «OpenSpec: vista v1.11.0, última v1.14.1». La lista de fuentes, con la versión revisada y la fecha, pasa a vivir junto a los avisos de licencia, que es donde la 3.0.0 quiere las versiones. Esta feature hace además la revisión pendiente de OpenSpec, mattpocock/skills, Spec Kit e impeccable, y lo que convenga traer queda apuntado en el roadmap para otra feature. La comprobación no corre al guardar cada cambio: solo al preparar una release.

## Capacidades

- Ninguna, porque son herramientas y docs del repo: el check es solo del repo del kit, y ningún proyecto lo usa porque los proyectos no forkean fuentes.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: dependencia externa (los clones de las fuentes, con git fetch por red) · tamaño: ~260 líneas en 10 ficheros
- Mínimo razonable: ninguna — deja sin cubrir que otro lea la forma de la tabla y los mensajes del check antes de implementarlos; el repaso de coherencia lo hago yo
```

1. **Alcance: impeccable entra en la tabla y en la revisión.** `THIRD_PARTY_NOTICES.md` lo declara fuente de `PRODUCT-template.md` (4.3.1, los encabezados de `PRODUCT.md` para compartir el fichero) y ya va por `skill-v4.5.2` (`git ls-remote`, 2026-10-14). El Art. V pide revisar las fuentes del aviso, y sin él el hueco sigue en prosa. Supone clonarlo en `D:/code/github/upstream/impeccable` y revisar solo `reference/init.md`. Si dices que no, su fila sale de la tabla y el check queda en cinco fuentes.
2. **La tabla vive en `THIRD_PARTY_NOTICES.md`, no en `tech-stack.md`.** La [propuesta 0131](../20261007-144256-proposal-0131-kit-rework/proposal.md) convierte `tech-stack.md` en `operations.md` «sin versiones» y pone «cada fuente con versión en `THIRD_PARTY_NOTICES.md`». Va en una sección nueva al principio, `## Fuentes vigiladas`, que incluye también OpenSpec y Spec Kit aunque el kit no copie su texto (solo conceptos). Los avisos de cada fork siguen debajo, cada uno con su versión.
3. **«Referencias de vigilancia» de `tech-stack.md` adelgaza**: salen de ella las fuentes con versión y la frase «se revisan al abrir cada release», y queda una línea que apunta a la tabla y al check. Las referencias sin versión (`claude plugin eval`, OpenSpec con ADR, el repo de ADR, MySpec y CodeMySpec) y la nota de `diagnosing-superpowers` se quedan hasta que la 3.0.0 reparta `tech-stack.md`. Sale también la nota de leer `RELEASE-NOTES.md` en la caché del plugin, porque ahora la revisión se hace sobre el clone.
4. **Check del repo, como dice la fila 0181, y no `sdd sources check`.** La propuesta 0131 (2026-10-07) lo pintaba como verbo de la CLI que escribe filas «por triar». La fila (2026-10-14) es posterior: el check es del repo y falla, y las filas las escribe quien revisa.
5. **MADR entra en `THIRD_PARTY_NOTICES.md`**: `adr-template.md` toma la forma mínima de MADR 4.0.0 ([ADR 0001](../../decisions/0001-bounded-documents-and-adr.md)) y el aviso no lo nombra, contra el Art. IX. Licencia: MIT OR CC0-1.0 (`README.md` del clone, tag `4.0.0`).
6. **El check vive en `tests/upstream/check.ts`**: TypeScript que Node ejecuta sin compilar, que reutiliza `cli/src/git/git.ts` y se lanza con `moon run kit:upstream`. No es un verbo de `sdd`, porque la CLI viaja a los proyectos y este check es solo del repo. Precedente: `tests/headless/battery.mjs`.
7. **Su test es Pester** (`tests/UpstreamWatch.Tests.ps1`, `-Tag 'Slow'`, con orígenes y clones de juguete en `TestDrive`), como `tests/Battery.Tests.ps1` prueba `battery.mjs`. No va en Vitest porque `cli/test/` lleva un directorio por dominio de `cli/src/`, y lo que hagan los Pester lo decide la 0152 con el resto. Descartado: Vitest en `cli/test/upstream/` importando desde `tests/`.
8. **Configuración local: la variable de entorno `SDD_UPSTREAM_DIR`**, que se fija una vez por máquina (`setx SDD_UPSTREAM_DIR D:/code/github/upstream`). La ven todos los worktrees; un fichero ignorado por git habría que copiarlo a cada worktree, y `sdd-kit.local.json` es del kit, cuyas skills avisarían de una clave que no conocen.
9. **El clone de cada fila se encuentra por su remoto `origin`**, comparado con el repo de la fila sin `.git` ni mayúsculas. No hace falta un mapa de carpetas (`mattpocock-skills` ↔ `mattpocock/skills`).
10. **Versión vista = el tag literal** (`v1.14.1`, `4.0.0`, `skill-v4.5.2`), para copiar el diff tal cual. La última versión se busca solo entre los tags con el mismo prefijo que la vista y sin sufijo de prerelease: OpenSpec tiene `v1.14.1` y `@fission-ai/openspec@1.14.1`, y MADR tiene `4.0.0-beta`.
11. **El check hace `git fetch --tags` en cada clone antes de comparar**: sin él, un clone que nadie actualiza nunca ve la versión nueva. Si el fetch falla (por ejemplo, sin red), la fila falla.
12. **Mensajes, en castellano.** El check recorre todas las filas, escribe una línea por cada fila con problema y sale con 1 si hay alguna:
    - todo al día: `Fuentes al día: <n>.`, y sale con 0
    - versión nueva: `<Fuente>: vista <vista>, última <última>. Revisa: git -C <clone> diff <vista>..<última>`
    - sin variable: `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`
    - sin clone: `<Fuente>: sin clone de <repo> en <carpeta>.`
    - la vista no es un tag: `<Fuente>: la versión vista <vista> no es un tag del clone.`
    - fetch fallido: `<Fuente>: no se pudo actualizar el clone: <primera línea del error de git>.`
    - sin tabla: `Sin la tabla de «Fuentes vigiladas» en <ruta>.`
13. **La tabla lleva las columnas `| Fuente | Repo | Versión vista | Fecha |`**: el repo como enlace a GitHub y la versión entre comillas invertidas. **Fecha** es el día en que se revisó esa versión. Solo van fuentes con repo y tags.
14. **«Al abrir una release»**: va una regla nueva en las «Reglas de la sesión» de `CLAUDE.md`: al preparar una release del kit, antes de nada, `moon run kit:upstream`. Además, la fila 0152 suma `moon run kit:upstream` a la batería de release. Este repo no tiene un paso mecánico para abrir una release, y `CLAUDE.md` lo lee toda sesión.
15. **Dónde queda la revisión**: en `upstream-review.md`, en la carpeta de esta feature. Lleva una tabla por fuente (cambio · pieza del kit · se asume / se modifica / se mantiene · destino) y el comando de diff que se usó. Es un artefacto de evento (Art. XI). Las versiones vistas van a la tabla de `THIRD_PARTY_NOTICES.md`.
16. **Qué mira la revisión en cada fuente**:
    - OpenSpec, sin fork, por conceptos: `schemas/spec-driven/schema.yaml` y `docs/` (188 líneas de diff entre `v1.11.0` y `v1.14.1`).
    - mattpocock/skills: los forks `grilling`, `teach`, `wait-what` y `to-spec`, de `v1.2.3` a `v1.3.1`. `domain-modeling` se tomó en `b0618bc`, que es posterior a `v1.3.1` (ningún tag lo contiene), así que no tiene versión nueva que revisar. `writing-for-agents`, skill de desarrollo del repo, ya es idéntica a la de `v1.3.1` (mismo blob en git).
    - Spec Kit, sin fork, por conceptos: el diff de `v0.8.7` a `v1.2.0` cambia 903 ficheros, así que se revisan `CHANGELOG.md`, `spec-driven.md` y `templates/`.
    - impeccable, si entra: `reference/init.md`, de `skill-v4.3.1` a `skill-v4.5.2`.
17. **Versión de cada fork**: `sdd-grilling` llevará el commit de `grilling` del que se adaptó. La copia es del 2026-10-02 y la fuente cambió después de `v1.2.3` (`86cba45` y `85f83d3`), así que el commit se fija comparando el texto. `domain-modeling` sigue en `b0618bc`, con «posterior a v1.3.1». Las skills de desarrollo llevan también la suya: `writing-for-agents` `v1.3.1` y `writing-skills` `v7.0.0`, comprobadas por blob contra el tag; `skill-creator` se queda sin versión, porque anthropics/skills no tiene clone.
18. **Valores iniciales de la tabla**: los de las versiones vistas hoy, con OpenSpec en `v1.11.0`, Spec Kit en `v0.8.7`, mattpocock/skills en `v1.2.3` (la de sus forks), impeccable en `skill-v4.3.1`, superpowers en `v7.0.0` y MADR en `4.0.0`. Así, el check recién escrito falla con cuatro fuentes.
19. **En esta feature no se aplica nada de lo que convenga traer**: no cambia ninguna skill, así que no hay campaña ni previsión de coste del Art. I (0 sujetos, 0 $).
20. **Una pieza entra, otra sale**: de `tech-stack.md` salen la lista en prosa de las fuentes con versión, la nota de la caché de superpowers y la frase «se revisan al abrir cada release», que pasa a ser el check.
21. **`tests/SuperpowersCompat.Tests.ps1`**: hoy lee la línea de superpowers de `tech-stack.md`, y pasa a leer su fila de la tabla de `THIRD_PARTY_NOTICES.md` (`v7.0.0`).

### Decisiones tomadas con el dev-lead

- Fila de la 3.0.0, antes de la 0152 — «Fila 3.0.0 antes de 0152» (2026-10-14)
- Los clones de las cinco fuentes están fuera del repo y su ruta va en configuración local — «Los clones de las cinco fuentes están en D:/code/github/upstream/ (madr, mattpocock-skills, OpenSpec, spec-kit, superpowers), fuera del repo; la ruta va en configuración local.»
- Qué se revisa y cómo — «La revisión va por diff de tags (git diff <vista>..<última>) en los ficheros que el kit forkea según THIRD_PARTY_NOTICES.md y en los de conceptos de OpenSpec (schemas/spec-driven/schema.yaml y docs/). En un fork, el texto nuevo de la fuente entra salvo por los tres motivos de la ADR 0013.»
- Adónde va lo que se trae — «Lo que convenga traer queda como fila de deuda o en la fila de la 3.0.0 que toca esa pieza.»
- Dónde corre el check — «El check es del repo, no del kit, y corre en la batería de release y al abrir una release, fuera del pre-commit.»
- La tabla y las versiones de los forks — «"Referencias de vigilancia" de tech-stack.md pasa a tabla (fuente, repo, versión vista, fecha), con mattpocock/skills y MADR, y cada fork de THIRD_PARTY_NOTICES.md lleva su versión.» Corregido en la misma sesión, porque `tech-stack.md` cambia en la 3.0.0 — «tabla de vigilancia en tech-stack.md -> pero tech-stack en la v3 ...»: la tabla va a `THIRD_PARTY_NOTICES.md` (✋ 2).
- Perfil y merge — «Perfil delegate. Al fusionar, `sdd merge --push`.»
- Aprobación de la spec, con impeccable y la tabla en `THIRD_PARTY_NOTICES.md` — «1, aunque de matt tambien savabamos for-agents no?» (2026-10-14): `writing-for-agents` entra con su versión (✋ 16 y 17)

## Intent

El Art. V pide que cada release revise las versiones nuevas de sus fuentes, y `tech-stack.md` pide hacerlo al abrir cada release. Las dos reglas están en prosa y la revisión no se ha hecho. OpenSpec se vio en `v1.11.0` y va por `v1.14.1`. Spec Kit se vio en `v0.8.7` y va por `v1.2.0`. mattpocock/skills, de donde salen cinco piezas del kit, ni siquiera está en la lista. Éxito: hoy las fuentes quedan revisadas y lo que convenga traer queda en el roadmap. Y cuando una fuente saque versión, `moon run kit:upstream` falla al abrir la release y da el diff que hay que leer. Es un fracaso aunque funcione si el check da verde con una versión nueva (por un clone sin actualizar o por un tag de otra familia), o si salta en cada commit.

## Scope

- Entra:
  - `THIRD_PARTY_NOTICES.md`: la tabla `## Fuentes vigiladas` con superpowers, OpenSpec, Spec Kit, mattpocock/skills, MADR e impeccable; la versión de `sdd-grilling`; el aviso de MADR.
  - «Referencias de vigilancia» de `tech-stack.md`, adelgazada a lo que no tiene versión, con una línea que apunta a la tabla y al check.
  - El check `tests/upstream/check.ts`, la tarea `kit:upstream` del `moon.yml` raíz y su Pester `tests/UpstreamWatch.Tests.ps1`.
  - `tests/SuperpowersCompat.Tests.ps1`, adaptado a la tabla.
  - La regla de `CLAUDE.md` y `moon run kit:upstream` en la fila 0152 del roadmap.
  - El clone de impeccable en `D:/code/github/upstream/impeccable`.
  - El inventario de procedencia de las 22 skills (con sus `references/`) y de las plantillas de `sdd-templates`: de cada una, de qué fuente toma texto, con su versión, y qué skills de otro plugin invoca. Lo que falte en `THIRD_PARTY_NOTICES.md` o en el `NOTICE` de la skill se añade; un `NOTICE` no es guía, así que no pide prueba del Art. I.
  - La revisión de OpenSpec, mattpocock/skills, Spec Kit e impeccable en `upstream-review.md`; lo que convenga traer, como filas de deuda o en la fila de la 3.0.0 de la pieza; las versiones vistas, al día en la tabla.
- No entra:
  - Aplicar lo que convenga traer (cambiar skills, plantillas o la CLI): va a filas.
  - Repartir `tech-stack.md` en `operations.md`: es de la 3.0.0, no de esta feature.
  - Los scripts de superpowers 6.4.2 portados en `cli/src/tasks/`: ya están en la 0152.
  - Un verbo de `sdd` o una regla del kit para los proyectos.
  - El check real en el pre-commit o en `kit:test`: allí solo corre su Pester, sobre clones de juguete.
  - La versión instalada del plugin superpowers: ya la vigilan el README y `SuperpowersCompat.Tests.ps1`.
  - Fuentes que el Art. IX permite pero de las que el kit no copia nada hoy (Wondel), y `skill-creator` (anthropics/skills, sin clone).

## Approach

El orden es tabla, check y revisión. Con la tabla en las versiones vistas de hoy, el check recién escrito falla con OpenSpec, Spec Kit, mattpocock/skills e impeccable: ese es el RED real. La revisión sube las versiones vistas y lo pone en verde. Cada fuente se revisa con `git diff <vista>..<última> -- <ficheros>`, y de cada cambio se decide si la pieza del kit lo asume, lo modifica o se mantiene (propuesta 0119). En un fork, el texto nuevo de la fuente entra salvo por los tres motivos de la ADR 0013.

## Escenarios del check

Herramienta del repo, sin capacidad. La fuente de juguete se llama `Juguete` y su repo es `github.com/acme/juguete`.

**S1 — Todo al día**
- GIVEN la tabla con `Juguete` en `v1.0.0` y un clone con los tags `v0.9.0` y `v1.0.0`
- WHEN se ejecuta el check
- THEN escribe `Fuentes al día: 1.` y sale con 0

**S2 — Versión nueva en el origen**
- GIVEN la tabla en `v1.0.0`, un clone con `v1.0.0` y su origen con un tag `v1.1.0` posterior al clone
- WHEN se ejecuta el check
- THEN escribe `Juguete: vista v1.0.0, última v1.1.0. Revisa: git -C <clone> diff v1.0.0..v1.1.0` y sale con 1

**S3 — Otras familias y prereleases no cuentan**
- GIVEN la tabla en `v1.0.0` y el clone con `v1.0.0`, `v1.1.0-beta` y `@acme/juguete@9.9.9`
- WHEN se ejecuta el check
- THEN escribe `Fuentes al día: 1.` y sale con 0

**S4 — Sin la variable**
- GIVEN `SDD_UPSTREAM_DIR` sin definir
- WHEN se ejecuta el check
- THEN escribe `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.` y sale con 1

**S5 — Sin clone**
- GIVEN la tabla con `Juguete` y una carpeta de clones sin ninguno de `acme/juguete`
- WHEN se ejecuta el check
- THEN escribe `Juguete: sin clone de acme/juguete en <carpeta>.` y sale con 1

**S6 — La versión vista no es un tag**
- GIVEN la tabla en `v2.0.0` y el clone sin ese tag
- WHEN se ejecuta el check
- THEN escribe `Juguete: la versión vista v2.0.0 no es un tag del clone.` y sale con 1

**S7 — No se puede actualizar el clone**
- GIVEN un clone cuyo origen ya no existe
- WHEN se ejecuta el check
- THEN escribe una línea que empieza por `Juguete: no se pudo actualizar el clone:` y sale con 1

**S8 — Las fuentes reales, al cerrar**
- GIVEN `SDD_UPSTREAM_DIR` en `D:/code/github/upstream` y la revisión hecha
- WHEN se ejecuta `moon run kit:upstream`
- THEN escribe `Fuentes al día: 6.` (`5.` si impeccable no entra) y sale con 0

## Dónde se prueba

- S1–S7: Pester `tests/UpstreamWatch.Tests.ps1`, con `-Tag 'Slow'`, sobre orígenes bare y clones de juguete en `TestDrive`, como `tests/Battery.Tests.ps1`.
- El RED real y S8: `moon run kit:upstream` contra `D:/code/github/upstream/`, antes de la revisión (falla con cuatro fuentes) y después (verde). La salida va al walkthrough.
- La tabla: `tests/SuperpowersCompat.Tests.ps1`, del conjunto rápido, lee la fila de superpowers en `THIRD_PARTY_NOTICES.md`.
- El inventario: un barrido de solapamiento de texto (frases de 8 palabras en común) de cada fichero de `skills/` contra los ficheros `.md` de los clones, más las menciones de fuentes en las plantillas en castellano, que el barrido no ve por estar traducidas. El script queda en `provenance-scan.mjs` en la carpeta de la feature y el resultado, en `upstream-review.md` § Procedencia.
- La revisión: `upstream-review.md` lleva una fila por cambio con su destino, y cada destino es una fila del roadmap, que `kit:roadmap` valida.

## Términos y ADR

- Términos resueltos: **versión vista** — el tag de una fuente hasta el que el kit la ha revisado; **fuente** — un repo del que el kit copia texto o toma conceptos.
- ADR candidatas: ninguna.

## Enmiendas

- 2026-10-14 — Entra el inventario de procedencia de todas las skills y plantillas (Scope y «Dónde se prueba») — lo pide el dev-lead tras aprobar — Task 1 — aprobada: «te pediria que dieras una psada a todas nuestras sjkills y te asegures si dependen de alguien sio no etc»

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-14 | aprobada: «1, aunque de matt tambien savabamos for-agents no?» |
