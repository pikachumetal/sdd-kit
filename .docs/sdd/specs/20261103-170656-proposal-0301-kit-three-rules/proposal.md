---
id: 20261103-170656-proposal-0301-kit-three-rules
proposal: 0301
title: El kit con las tres reglas del dev-lead, fuente intermedia y build
source: interview
created: 2026-11-03
---

# Propuesta — El kit con las tres reglas del dev-lead, fuente intermedia y build

## Por qué

La 3.0.0 falló en lo que más importaba (dev-lead, 2026-11-03: «el v3 es inaceptable y nace muerto… no hemos cumplido lo más importante era fork, sustituir no añadir y saber qué copiamos de cada kit para poder actualizar»). Las auditorías lo midieron: [fork-audit.md](../20261103-101227-feature-0296-skills-survive-compaction/fork-audit.md) en las 11 copias y el [research de la 0299](../20261103-130212-feature-0299-own-skills-audit/research.md) en las 22 skills; cinco skills pasan del corte de 20.000 caracteres que Claude Code aplica tras compactar ([compaction-measure.md](../20261103-101227-feature-0296-skills-survive-compaction/compaction-measure.md)); y la caché del plugin recibe el repo entero. No hay calendario: «sin recortes y sin prisa». La solución se revisó de forma adversarial con un agente Opus el 2026-11-03 ([review.md](review.md)), y las reglas de abajo ya llevan sus correcciones.

Las tres reglas del dev-lead para todo el kit:

1. Partir de la fuente sin tocar lo que funciona.
2. Lo que el kit hace distinto sustituye la frase de la fuente; nunca se añade al lado contradiciéndola.
3. Un problema se arregla mejorando la frase que falla, no añadiendo otra.

Los nueve problemas: (1) el kit pone su frase al lado de la de la fuente (A+C); (2) se arregla añadiendo texto, con la misma regla en varios sitios; (3) no se sabe de forma determinista qué frase sale de qué fuente y versión; (4) copias que ya no son copias; (5) skills de más de 20.000 caracteres; (6) las tripas del kit viajan con el plugin; (7) nada impide que vuelva a pasar; (8) actualizar desde la fuente tiene que ser sencillo; (9) vigilar las fuentes de las que el kit toma ideas sin copiar texto (OpenSpec, Spec Kit, MADR, wondelai).

## Reglas de negocio

- **Fuente intermedia y build** (problemas 6 y 7): cada skill tiene en el repo una fuente que el agente nunca carga, y que puede llevar marcas; un build genera la skill limpia en `dist/`, lo único que viaja. Ejemplo: la fuente de `sdd-tdd` lleva `<!-- kit: 0186 · sustituye: «…» -->` encima de un bloque → `dist/skills/sdd-tdd/SKILL.md` sale sin esa línea, y un test falla si `dist/` no es byte a byte lo que sale del build.
- **Lo que viaja** (problema 6): `dist/` lleva solo una lista blanca —skills construidas con todo lo que no es `.md` (`validation-panel.js`, `migrations/`), `agents`, `hooks`, `cli/bin`, `cli/src`, `plugin.json`, licencias— y el marketplace apunta a él. Ejemplo: hoy la caché recibe 20.085 ficheros y 107 MB; con `dist/`, ni `.docs`, ni `tests`, ni `cli/test`, ni una marca. Dónde vive `dist/` (commiteado en `develop` o una rama `dist` publicada en el corte, con `{"source":"github","repo":…,"ref":"dist"}`) se decide con una prueba de instalación: la auto-referencia a la rama no está probada.
- **Una copia es el original más bloques marcados, y cada diferencia está cubierta** (problemas 1, 3 y regla 1): un diff entre el original en su tag y la salida sin los bloques del kit; cada hunk lo cubre una marca —`sustituye: «S»`, `quita: «S»` o un añadido del kit con su tarea—. Ejemplo: borrar de `subagent-driven-development` «Never start implementation on a main/master branch…» sin `quita` → rojo (en la revisión, la comprobación por líneas literales lo dejaba en verde).
- **A+C imposible** (problema 1): con `sustituye: «S»`, S no queda en la salida y existe en el original; si no existe, la marca es vieja → rojo. Ejemplo: `sdd-implement:18` con «Four things stop you, and only these» y la frase del kit al lado → rojo.
- **Añadido junto a una absoluta** (problema 1): un bloque del kit sin `sustituye`, en un párrafo con una frase absoluta del original («only», «never», «always», «must»…), da rojo. Ejemplo: 24 de los 60 párrafos de `subagent-driven-development` 7.0.1 tienen una absoluta. Límite: se esquiva con una línea en blanco o en otra sección (la herencia de `sdd-implement:121`); lo cubre la revisión con la ADR de las tres reglas.
- **Forma de línea** (problema 8): la fuente de una copia va en LF y con los saltos de línea del original, y un test lo obliga. Ejemplo medido en la revisión, `subagent-driven-development` 7.0.0 → 7.0.1 con 6 bloques del kit: 2 conflictos (los dos legítimos) con los saltos del original; 5 con un párrafo por línea, como el kit hoy; uno de fichero entero con CRLF.
- **Actualizar** (problema 8): se cambia el tag en el registro y se fusiona con `git merge-file <fuente anotada> <original viejo> <original nuevo>`; un fichero añadido, quitado o movido en la fuente entre los dos tags da rojo hasta mapearlo. Ejemplo: la 7.0.1 de superpowers, un patch, sacó 7 `references/` nuevos de `subagent-driven-development`; el bloque del kit que estaba en la sección movida dio un conflicto de 70 líneas y hay que llevarlo a `references/fix-loop.md`.
- **Copias casi puras** (problemas 4 y 5): una copia solo lleva sustituciones donde la fuente contradice al kit; lo propio del kit va a la skill de puerta o a `references/`. Ejemplo: `subagent-driven-development` 7.0.1 ya ocupa 19.250 caracteres; como copia fiel deja 750 para todo el kit.
- **Copia o propia, una vez** (problema 4): cada skill, plantilla y port de código se clasifica como copia (original más bloques) o propia; una copia con varias fuentes marca de cuál sale cada bloque; si los bloques del kit cambian más de un tope del original (lo fija la feature de la base), es propia. Ejemplo: `sdd-implement` se parte como decidió la 0296 —puerta propia, `sdd-implement-native` de `executing-plans` 7.0.1 y `sdd-implement-subagent` de `subagent-driven-development` 7.0.1—; `sdd-grilling`, propia «inspirada en `grilling`»; las `references/` de `sdd-propose` (10 % literal) y `sdd-archive` (13 %), copia o propia en su feature.
- **Registro único de fuentes** (problemas 3 y 9): un solo fichero del repo, que no viaja, con cada copia (repo, tag, rutas) y cada concepto (rutas de la fuente de las que sale la idea, fichero del kit que la usa y versión revisada por entrada); de él se generan o se comprueban `THIRD_PARTY_NOTICES.md` y los `NOTICE`, así la versión vive en un sitio y no en tres. En el corte, el diff de solo las rutas de cada concepto entre la versión revisada y el último tag; una ruta que ya no existe → rojo. Ejemplo: OpenSpec pasa de v1.16.0 a una versión que mueve la ruta de su formato de delta → rojo, no «sin cambios»; una fuente cuyas rutas no cambian deja pasar el corte.
- **Una regla en un solo sitio** (problema 2): en las propias, cada regla vive en el paso donde se decide; si dos skills la necesitan de verdad, una marca de inclusión que el build sustituye por el texto de un fichero único. Un test da rojo con una frase repetida entre dos skills de `dist/` que no venga de una inclusión, contando solo las parejas donde un lado es texto del kit (las copias comparten texto de su fuente); otro, con una frase absoluta y «except», «unless» o «instead of» en la misma unidad. Ejemplo: la 0299 contó 33 reglas repetidas, 5 ya divergentes. Límite: en las propias el test encuentra candidatos; el resto lo ve la revisión.
- **Tamaño** (problema 5): ningún `SKILL.md` de `dist/` llega a 20.000 caracteres; y por fase, la skill que dirige más las que invoca, cada una contada como mín(longitud, 20.000), no pasa de 100.000 caracteres. Ejemplo: hoy `sdd-implement` tiene 61.562; tras compactar, Claude Code 2.1.317 suma cada skill ya cortada a 5.000 tokens contra un tope de 25.000, y lo que se pierde es la skill que dirige la fase invocada antes que las demás.
- **Las tres reglas, escritas** (problema 2): una ADR nueva con las tres reglas sustituye a la ADR 0013 («conserva el texto», que aplicada como «devolver el texto» pegó la contradicción de `sdd-implement:18` en `e7ddf254`) y a la consecuencia de la ADR 0019 «Editar una frase de una skill no toca ningún test». Ejemplo: un arreglo de un ticket que añade «except when…» a una regla de una copia, en vez de sustituirla, incumple la regla 2 y la revisión lo rechaza.
- **Que no vuelva a pasar** (problema 7): las comprobaciones entran en rojo y pasan a verde skill a skill; cuando están en verde, van al pre-commit y a la CI. Sin red en local: con un tag que falta en el clon de `SDD_UPSTREAM_DIR`, dice «falta el tag X en el clon», no un rojo sin explicar; la CI clona las fuentes en sus tags. Ejemplo: hoy `kit:skill-size` está en rojo con cinco skills y solo corre en el corte (patch 0298); al acabar el reparto, corre en cada commit.

## Capacidades que toca

- `agent-writing` — cómo se escribe una skill del kit: fuente intermedia, marcas, build.
- `cli` — si el build, las comprobaciones o el registro son verbos de la CLI.
- `migration` — el paso de `"source": "."` a `dist/` para quien tiene instalada la 2.3.4.
- `kit-distribution` (nueva) — qué viaja en el plugin, cómo se construye `dist/` y cómo se comprueban las copias contra su fuente.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0303 | ADR de las tres reglas, que sustituye a la 0013 y a la consecuencia de la 0019 | — |
| 2 | 0300 | Base: fuente intermedia, build, `dist/` con lista blanca, registro único de fuentes y conceptos; ninguna frase cambia | — |
| 3 | 0302 | Las copias anotadas contra su fuente: diff cubierto, A+C, añadidos junto a absolutas, forma de línea, mapeo de ficheros y actualización con `git merge-file` | 0300, 0303 |
| 3b | 0312 | Aplicar la maquinaria de la 0302 a las copias: anotarlas, subirlas al último tag de su fuente y resolver los §2 y §3 del ticket de la 0300 | 0302 |
| 3c | 0315 | `kit:copies` sin bloques que se comen el original, comparación de `dist/` byte a byte, y rojo para los lectores de `skills/` y los `own` con texto de terceros | 0312 |
| 4 | 0304 | Las comprobaciones de las propias y del tamaño: una regla en un solo sitio, excepciones pegadas, tamaño por skill y por fase | 0300, 0303 |
| 5 | 0296 | `sdd-implement` partida: puerta propia y dos copias de superpowers 7.0.1 | 0302, 0304, 0315 |
| 6 | 0305 | `sdd-archive` rehecha | 0302, 0304, 0315 |
| 7 | 0306 | `sdd-propose` rehecha, con sus `references/` como copia o propia | 0302, 0304, 0315 |
| 8 | 0307 | `sdd-verify` y `sdd-tdd`: la frase que falla, sustituida | 0302, 0312, 0304, 0315 |
| 9 | 0308 | `sdd-roadmap` y `sdd-config`: la frase que falla, sustituida | 0304 |
| 10 | 0309 | `sdd-templates`: una forma por regla y la fuente única | 0304 |
| 11 | 0310 | `sdd-init`, `sdd-explore`, `sdd-end-release`, `sdd-feedback` y `add-to-changelog`: la frase que falla, sustituida | 0304 |
| 12 | 0313 | `cli/src/tasks` al día con los scripts de superpowers 7.0.2 | 0302 |
| 13 | 0314 | `sdd-grilling` con `brainstorming` de superpowers 7.0.2 | 0302, 0304 |
| 13b | 0316 | Las migraciones de `sdd-upgrade` en inglés | 0304 |
| 13c | 0317 | El 🦆 del modo corto de `sdd-rubber-duck` nombra solo efectos comprobados | — |
| 14 | 0311 | Cierre: las frases repetidas entre skills de filas distintas a `includes/`, las comprobaciones al pre-commit y a la CI, revisar contra el kit nuevo 0297, 0284, 0198 y 0152, y cortar la 3.0.0 | 0296, 0312, 0305, 0306, 0307, 0308, 0309, 0310, 0313, 0314, 0315, 0316, 0317, 0318, 0319 |

## Acta

No aplica: entrevista (sesión de coordinación `develop`, 2026-11-03).

## Enmiendas

- **2026-11-04 — Cada copia parte del último tag de su fuente cuando arranca su feature** (dev-lead: «ok a las cinco, adelante», a la propuesta de la sesión `develop` tras salir superpowers v7.0.2). Regla «Copia o propia»: antes, `sdd-implement-native` de `executing-plans` 7.0.1 y `sdd-implement-subagent` de `subagent-driven-development` 7.0.1; ahora, del último tag cuando arranca la 0296 (hoy v7.0.2, que en esas dos skills solo añade «by its absolute path, from the working tree you're executing in» a cada llamada a un script). Ejemplo: superpowers saca v7.0.3 antes de arrancar la 0296 → la 0296 parte de v7.0.3, sin otra enmienda. Lo mismo vale para la fila 5 del reparto.
- **2026-11-04 — Dos features nuevas en el reparto, por superpowers v7.0.2** (dev-lead, la misma frase). 0313: el port `cli/src/tasks` sigue en v6.4.2, y la 7.0.2 trae `sdd-repo` (el repo del directorio actual, `-C DIR`), los ids `A1`, `6b` y `2.1` en `task-brief` y las rutas de Windows. 0314: `brainstorming` 7.0.2 cambia cómo se pregunta, y la parte de las preguntas del kit vive en `sdd-grilling`, que la 0299 dejó entre las que se quedan. La 0306 compara `spec-writing.md` con `brainstorming` 7.0.2, y la 0309 lleva las alternativas al `## Approach` de la spec. La 0311 va tras las dos nuevas.
- **2026-11-04 — La 0302 se parte en dos** (dev-lead, 2026-11-03, al arrancarla: «1»; lo registra la sesión `develop` al triar el [ticket de la 0302](../../field-reports/20261104-102149-feature-0302-annotated-copies.md)). Fila 3 del reparto: antes, la 0302 hacía la maquinaria y anotaba las copias; ahora, la 0302 hace la maquinaria (la marca, `kit:copies`, `upstream.json` fichero a fichero y `kit:copies-update`) y la 0312, tras ella, aplica todo a las copias. Ejemplo: `sdd-tdd` anotada contra superpowers v7.0.2 → 0312, no 0302. La 0307 y la 0311 van también tras la 0312.
- **2026-11-04 — Las references que siguen en castellano se traducen en la fila que reescribe su skill** (dev-lead, 2026-11-04, a la sesión de la 0312: «sí, adelante así y avisa a develop»). Ninguna fila del reparto las nombraba: las features de traducción reescribieron cada `SKILL.md`, y la 0206 movió estas references sin traducirlas. Ahora: `control-profiles.md`, `review-spec.md`, `modo-lite.md` y `nombrado.md` → 0306; `frontend-verification.md` y `commit-milestones.md` de `sdd-implement` → 0296; `encargo-revision.md` y los títulos en castellano de los tres `*-reviewer-prompt.md` de `sdd-verify` → 0307. Antes de cambiar un título se busca en `cli/` y `tests/`. Ejemplo: «## Restricciones de código» de un `*-reviewer-prompt.md` se traduce en la 0307 si ningún literal del CLI ni de un test lo lee. Las plantillas de `sdd-templates` siguen en castellano, porque las lee el equipo.
- **2026-11-04 — Tres features nuevas en el reparto, del ticket de la 0312 y del inventario de `develop`** (dev-lead: «ok», a la propuesta de triaje de la sesión `develop`). 0315, tras la 0312 y antes de 0296, 0305, 0306 y 0307: `kit:copies` daba por bueno un bloque que se come líneas del original (`sdd-worktrees/SKILL.md:115-121`), la comparación de `dist/` no veía la sangría, un test ejecutaba texto anotado de `skills/` y un `own` no genera `NOTICE`. 0316, tras la 0304: las 13 migraciones de `sdd-upgrade` al inglés, que la 0299 dejó como «se queda» sin mirar el idioma; ejemplo: `migrations/v3.0.0.md`, 84 de 123 líneas en castellano → 0 fuera de las citas y del texto que escribe en el proyecto. 0317: el modo corto de `sdd-rubber-duck`. La 0311 va también tras las tres. La comprobación del castellano en `skills/` es de la 0304, en curso (dev-lead, a la 0304: «1»).
- **2026-11-05 — El tamaño y las frases repetidas, fila a fila** (dev-lead: «si», a la revisión del roadmap de la sesión `develop`). Reglas «Tamaño» y «Una regla en un solo sitio»: antes, cada feature del reparto cerraba con las comprobaciones de 0302 y 0304 en verde, y la fila 0296 del roadmap bajaba las cinco skills de más de 20.000; ahora, la 0296 baja `sdd-implement` con la estructura de la fila 5 del reparto, cada reescritura baja su propia skill y cierra en verde en sus ficheros, y las frases que `kit:own` da repetidas entre skills de filas distintas las pasa a `includes/` la 0311, cuando ya están todas reescritas. Ejemplo: «you're about to edit code and the plan isn't approved», en `dist/skills/sdd-implement/SKILL.md:329` y `dist/skills/sdd-propose/SKILL.md:113` → ni la 0296 ni la 0306 la mueven; la 0311 la deja en una inclusión. La 0311 va también tras la 0318 y la 0319, que hace avisar a `sdd roadmap check` de dos filas abiertas que tocan los mismos ficheros sin un «tras».
