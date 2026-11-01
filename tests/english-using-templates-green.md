# GREEN — `using-sdd` y `sdd-templates` en inglés (feature 0272)

Salidas en `.docs/sdd/specs/20261101-140903-feature-0272-using-sdd-templates-english/`, en `green/`, `ab-en/`, `ab-es/` y `humo/`. Sujetos en Sonnet, con superpowers 7.0.0, sobre una copia del kit sacada con `git archive`. Línea base: la batería de la 0206, 24/24 con el texto en castellano. Coste: 63 sujetos, 9,92 $ de ~13 $.

## Batería entera de `using-sdd`

34 sujetos, 5,17 $. 23 de 24 filas en verde. `r1` dio 1/2 con umbral 2/2: `r1-2` entró por `sdd-propose`.

## A/B de `r1`

Fuera del plan, para separar traducción de inestabilidad. Misma frase, 14 sujetos por idioma; el castellano, sobre el commit de apertura.

| Primera skill | Inglés | Castellano |
| --- | --- | --- |
| `sdd-kit:sdd-roadmap` | 11 | 9 |
| `sdd-kit:sdd-propose` | 3 | 5 |

La traducción no empeora `r1`. Con ~70 % de acierto, su umbral 2/2 sale en rojo cerca de la mitad de las veces con cualquier texto. Enmienda de la spec aprobada por el dev-lead el 2026-11-01; lo que queda por arreglar va a una fila del roadmap.

## Filas en prosa

- `d1`, 2/2: una sola pregunta sobre qué es y cuánto abarca, con la recomendación primero.
- `s1`, 2/2: la preferencia va a la configuración del kit, no a la memoria.
- Idioma: los mensajes finales leídos (`d1`, `s1`, `r1-1`, `r1-2`, `r6` y el humo) están en castellano. De los demás sujetos se leyó solo la primera línea, en castellano salvo `f2`, cuya petición está en inglés, y `r6`, que abre con una línea en inglés. `i1`, `f3` y `pc1` mezclan «Using sdd-…» con el castellano.

## Humo de `sdd-templates`

Un sujeto, 0,15 $, sobre el molde `salas`, con «Escribe la ADR de que las reservas se guardan en un fichero JSON y no en una base de datos.» Invoca `sdd-kit:sdd-templates`, lee `adr-template.md` y escribe `.docs/sdd/decisions/0001-bookings-in-json-file.md`. `sdd decision check` da `Decisiones válidas`, con rc 0.

## Literales

Comparación con `develop`: todo lo que va entre «» sigue, salvo las cuatro racionalizaciones; `using-sdd` no cambia ningún tramo de código; en `sdd-templates` solo cambian los huecos de las órdenes; los enlaces son los mismos.
