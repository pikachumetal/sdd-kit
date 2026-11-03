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
| 4 | 0304 | Las comprobaciones de las propias y del tamaño: una regla en un solo sitio, excepciones pegadas, tamaño por skill y por fase | 0300, 0303 |
| 5 | 0296 | `sdd-implement` partida: puerta propia y dos copias de superpowers 7.0.1 | 0302, 0304 |
| 6 | 0305 | `sdd-archive` rehecha | 0302, 0304 |
| 7 | 0306 | `sdd-propose` rehecha, con sus `references/` como copia o propia | 0302, 0304 |
| 8 | 0307 | `sdd-verify` y `sdd-tdd`: la frase que falla, sustituida | 0302, 0304 |
| 9 | 0308 | `sdd-roadmap` y `sdd-config`: la frase que falla, sustituida | 0304 |
| 10 | 0309 | `sdd-templates`: una forma por regla y la fuente única | 0304 |
| 11 | 0310 | `sdd-init`, `sdd-explore`, `sdd-end-release`, `sdd-feedback` y `add-to-changelog`: la frase que falla, sustituida | 0304 |
| 12 | 0311 | Cierre: las comprobaciones al pre-commit y a la CI, revisar contra el kit nuevo 0297, 0284, 0198 y 0152, y cortar la 3.0.0 | 0296, 0305, 0306, 0307, 0308, 0309, 0310 |

## Acta

No aplica: entrevista (sesión de coordinación `develop`, 2026-11-03).

## Enmiendas

Ninguna.
