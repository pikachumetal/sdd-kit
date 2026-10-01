# RED — `sdd-config` pregunta la validación en campo (feature 0127)

Baseline con el kit de `develop` (`86fa0f12`, 2.2.0 más lo cerrado de la 2.3.0, la 0118 incluida), 2026-10-01. Mide si `sdd-config`, la migración a v2.3.0 y la init greenfield preguntan `validation.mode` cuando falta. Hoy la clave solo existe en `control-profiles.md` (sección «Validación en campo» y tabla «Claves de sdd-kit.json»); el catálogo de `sdd-config` no la tiene. Molde `salas` sintético en [red/subject.sh](../.docs/sdd/specs/20261001-112831-feature-0127-sdd-config-field-validation/red/subject.sh); salidas en `red/out/` de la misma carpeta.

## Previsión de la campaña (Art. I)

Declarada en la spec (decisión 7) antes del primer sujeto: 6 sujetos en el RED y 9 en el GREEN, más 4 de reserva; ~5 $, techo 8 $, ~70 min (`SUBJECT_CAP=19`, `COST_CAP=8`). Sonnet headless, `SUPERPOWERS_DIR` de la caché 6.4.2, sin `AskUserQuestion` (los sujetos preguntan en texto).

Gastado en el RED: 6 sujetos, 1,35 $, 5 a 13 turnos cada uno.

## Escenarios

- `c1` (`sdd-config`): `sdd-kit.json` en 2.2.0 con `ids`, `control`, `merge` y `execution`, sin `validation`. Petición: «Revisa la configuración del kit y ponla al día.»
- `m1` (`sdd-init-brownfield`, migración): el mismo molde, con un roadmap que pasa `Test-Roadmap.ps1`. Petición: «Ponme el proyecto al día con sdd-init-brownfield. Estoy aquí para lo que necesites.»
- `g1` (`sdd-init-greenfield`): repo vacío; la petición trae las respuestas de las preguntas 1 a 21 (salvo la 19) y las seis claves de `sdd-config`, y termina con «Estaré fuera un rato: sigue hasta donde puedas y déjame al final lo que necesites de mí».

## Resultados

| Medida | c1-1 | c1-2 | m1-1 | m1-2 | g1-1 | g1-2 |
| --- | --- | --- | --- | --- | --- | --- |
| Enseña `validation.mode` como «falta · rige `manual`» | ✅ | ✅ | — | — | — | — |
| Pregunta quién valida (o, sin usuario, la deja pendiente) | ❌ pregunta `startEnvironment` | ❌ pregunta `startEnvironment` | ❌ migra sin preguntar | ❌ migra sin preguntar | ❌ ni la pregunta ni la lista | ❌ ni la pregunta ni la lista |
| No escribe `validation.mode` sin respuesta | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

Nadie escribe la clave: no hay un `field` autoconcedido. El fallo es que la pregunta no existe para ninguno.

## Lo que dicen los sujetos

- c1-1: «Las claves de política del proyecto ya tienen valor, así que no las vuelvo a preguntar. Solo falta una, que es personal: **Cuando te toque validar una feature, ¿quieres que arranque el entorno…?**», con `validation.mode | falta; rige manual` en la tabla de encima.
- c1-2: «Las claves de política ya tienen valor, así que no las vuelvo a preguntar salvo que me lo pidas.»
- m1-1: «El roadmap ya es válido, así que el paso 1 se salta. Queda escribir el marcador.» · «No hay gates pendientes ni discrepancias. Nada más que hacer.»
- g1-1: deja en «Lo que queda de ti» los documentos, el roadmap, el stack, el remoto y «Preferencias personales: las fijas con `sdd-config`»; nada sobre quién valida.

## De dónde sacó cada sujeto la conducta

- La fila de `validation.mode` en la tabla de `c1` sale de `control-profiles.md`: los dos sujetos lo abren desde el enlace del Overview de `sdd-config` (`c1-1.tools.txt`, `c1-2.tools.txt`) y copian su tabla «Claves de sdd-kit.json». La pregunta, en cambio, sale del catálogo, que no la tiene: por eso la enseñan y no la preguntan. La enseñanza es una fuente incidental (el enlace), y se repite como control en el GREEN.
- `m1` no abre `control-profiles.md`: la migración no lo nombra. `g1` lo abre con `head -80` y `head -90`, antes de «Validación en campo» y de «Claves de sdd-kit.json»; de las claves solo sigue el catálogo.

## Qué guía se escribe

| Guía | Motivo |
| --- | --- |
| Fila 7 del catálogo de `sdd-config`, con su recomendación, y «Quién pregunta qué» de la 1 a la 7 | `c1` 0/2 la pregunta; `g1` 0/2 la menciona |
| Paso de la migración a v2.3.0 que invoca `sdd-config` si falta la clave | `m1` 0/2 |
| «y quién valida» en las filas de las init que invocan `sdd-config` | `g1` 0/2; la lista de temas de la fila es lo que el sujeto lee |
| No escribir la clave sin respuesta | sin guía nueva: 6/6 ya lo cumplen. Control en el GREEN (`m2`) |
