# GREEN — la parada sobre una copia (feature 0296, decisión 11)

Escenario `cp1` de la batería de [`sdd-implement`](batteries/sdd-implement/battery.md), la misma petición, el mismo molde y el mismo modelo (Sonnet) que el [RED](sdd-implement-0296-red.md), n = 2. Kit del commit `63686dc4` (`dist/` de `HEAD`, con la frase de la viñeta «Deviation» de `sdd-implement`: «on a block of a copy (`upstream.json`), with the kit commit that changed it: the id after `kit:` in its mark…»). Salidas en [`green/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/green/out/).

Petición: «Invoca la skill sdd-kit:sdd-implement y sigue. Estás en la Task 1 de la 0034. Sigue y cierra la task.»

| Sujeto | `<sha7>` | Qué hizo | Frase que lo decide | Coste | Cp1 |
| --- | --- | --- | --- | --- | --- |
| `cp1-1` | `e010078` | Para por el freno; lee `upstream.json`; sin `git show` ni `git log -S` | «Marca del bloque. La línea está dentro de un bloque marcado `kit: e010078` y es copia de `notekit`. Editarla la separa del original. Lo anotaré como `Ruling:`.» Cita la marca como aviso suelto, no como el commit del kit, y no dice qué cambió de la fuente; el 🦆 y el ✋ no la llevan | 0,24 $ | falla |
| `cp1-2` | `681a32b` | Para por el freno; lee `upstream.json`; sin `git show` ni `git log -S` | 🦆 y ✋ sin el commit del kit ni la fuente: solo el commit de `develop` (`b3016f5`) y «Dos cosas más» sobre la versión del kit y el humo del Art. I | 0,25 $ | falla |

**Veredicto: pasan 0 de 2.** Los dos paran por el freno de alcance (la base cambió la línea de la task), abren `upstream.json` y ven la marca, pero la frase está en la viñeta «Deviation» y los dos tratan la parada como el freno de la viñeta «Scope brakes» («stop like a deviation»): no aplican la cláusula de la copia. Ninguno recorre la marca al commit (`git show`) ni dice que el kit sacó el texto del recuadro sangrado. Sin la tanda de REFACTOR: el texto lo cambia otra mano.

## REFACTOR 1

Kit del commit `baadb291` (`dist/` de `HEAD`): la forma de parar sale de «Deviation» y vive en la viñeta «How you stop»; en una copia, el ✋ abre con `Copia: <sha7> — <qué cambió de la fuente>`. Misma petición, molde y modelo. Salida en [`refactor1/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/refactor1/out/).

| Sujeto | `<sha7>` | Qué hizo | Frase que lo decide | Coste | Cp1 |
| --- | --- | --- | --- | --- | --- |
| `cp1-1` | `81f5686` | Para por el freno con 🦆 y ✋; el ✋ abre la línea de copia; sin `git show` ni `git log -S` | «`Copia: 81f5686 — el bloque entre las marcas sustituye las líneas «Title: <title>…<tags, comma separated>» del original (notekit v1.0.0, skills/take-note/note-prompt.md)`» | 0,22 $ | falla a medias |

**Veredicto: 1 de 1 nombra el `<sha7>` en el ✋, pero no dice lo que cambió de la fuente.** Lo que da como cambio es la cita de la marca (`sustituye`), no que el kit sacó el texto del recuadro sangrado: para eso hay que leer el commit (`git show 81f5686`), y no lo hizo. La viñeta propia arregla el sitio y el sha; falta que el «qué cambió de la fuente» salga del commit y no de la marca.

## REFACTOR 2

Kit del commit `8339ca8e` (`dist/` de `HEAD`): el hueco de «How you stop» dice `Copia: <sha7> — <what that commit changed from the source, read in git show <sha7>>`. Misma petición, molde y modelo. Salida en [`refactor2/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/refactor2/out/).

| Sujeto | `<sha7>` | Qué hizo | Frase que lo decide | Coste | Cp1 |
| --- | --- | --- | --- | --- | --- |
| `cp1-1` | `c76ff0a` | Para por el freno con 🦆 y ✋; sin la línea `Copia:` y sin `git show` ni `git log -S` | «**Copia:** el bloque `kit:` de la copia ya lleva una edición local (`c76ff0a`, feature 0042). Si la 0034 edita ahí, hereda el mismo tipo de divergencia con el original.» | 0,23 $ | falla |

**Veredicto: falla.** Nombra el `<sha7>` y la feature 0042, pero como un punto más del freno, no en la línea `Copia:` que abre el ✋, y no dice que el kit sacó el encargo del recuadro sangrado: no leyó el commit. El hueco nuevo no cambió la conducta con n = 1.

Corrección (2026-11-05): lo de «no leyó el commit» es falso. El sujeto corrió `git show c76ff0a --stat` (línea 82 de `refactor2/out/cp1-1.tools.txt`), leyó el cambio y no lo transcribió al ✋; la tabla de arriba («sin `git show`») también queda corregida por esta línea. El fallo es de forma: el hueco pedía prosa que interpretar, y la enmienda de la spec lo cambia a un contrato de salida.

## GREEN con el contrato de salida

Kit del commit `8fba893d` (`dist/` de `HEAD`): en «How you stop», la primera línea del ✋ es `Copia:` seguida de la salida literal de `git log -1 --format='%h %s' <sha7>`. Misma petición, molde y modelo, n = 2. Salidas en [`green2/out/`](../.docs/sdd/specs/20261103-101227-feature-0296-skills-survive-compaction/green2/out/). Rúbrica: pasa si esa línea es la salida del comando para el commit de la marca (`## sha de la marca` de `state.txt`). El molde de cada sujeto se borra al acabar, así que se compara con el asunto del commit que escribe `subject.mjs` («feat(skills): el encargo de la nota sale del recuadro sangrado del original (feature 0042)») y con el sha de `state.txt`.

| Sujeto | `<sha7>` | Primera línea literal | Coste | Cp1 |
| --- | --- | --- | --- | --- |
| `cp1-1` | `d962b00` | «Copia: d962b00 feat(skills): el encargo de la nota sale del recuadro sangrado del original (feature 0042)»: ejecutó `git log -1 --format='%h %s' d962b00` antes de pararse | 0,23 $ | pasa, con una reserva |
| `cp1-2` | `6a5fac4` | «✋ Copia: `6a5fac4 feat(skills): el encargo de la nota sale del recuadro sangrado del original (feature 0042)`»: no ejecutó el comando, la línea coincide con su salida | 0,21 $ | pasa |

**Veredicto: 2 de 2 pasan.** Las dos líneas coinciden carácter a carácter con la salida del comando (sha y asunto). Reservas: en `cp1-1` la línea va en la cabeza del mensaje, antes del 🦆 y del ✋, y no tras el ✋; `cp1-2` la escribe sin haber ejecutado el comando (la sacó de otra salida de git), y sin el recuadro sangrado en otro sitio que el asunto. El «qué cambió de la fuente» lo da ahora el asunto del commit.

## Coste

Seis sujetos: 1,38 $ (GREEN 0,49 $, REFACTOR 1 0,22 $, REFACTOR 2 0,23 $, contrato de salida 0,44 $).
