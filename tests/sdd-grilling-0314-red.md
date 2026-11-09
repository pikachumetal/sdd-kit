# RED — feature 0314: `sdd-grilling` frente a brainstorming 7.0.2

Kit de `HEAD` en `4284ad1e` (`git archive HEAD:dist`), batería de `sdd-grilling`, escenarios `p1`-`p3`, n = 2, Sonnet, 2026-11-08. Coste: 6 sujetos, 1,21 $. Puerta `sdd-kit:sdd-propose` en los 6. Salidas en `.docs/sdd/specs/20261108-184606-feature-0314-grilling-brainstorming-7/red/out/`.

Se puntúa el último mensaje del turno (rúbrica de `tests/batteries/sdd-grilling/battery.md`). Las operativas del llamante (carril, perfil, aprobar) no cuentan en W1-W3.

| Sujeto | `sdd-grilling` cargada | W1 | W2 | W3 | W4 | W5 | R2 | R12 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| p1-1 | sí | **falla**: «❓ **¿Adónde va el CSV?**», primera de diseño sin el porqué | — | pasa | — | pasa | pasa | pasa |
| p1-2 | sí | **falla**: «❓ **¿Adónde va el CSV?** Es lo que más condiciona el resto» | — | pasa | — | pasa | pasa | pasa |
| p2-1 | sí | — | pasa: «¿Dónde sale el CSV?» cambia lo que se construye | pasa | — | pasa | pasa | pasa |
| p2-2 | sí | — | pasa: sala y destino del CSV | pasa | — | **falla**: «Lo que daría el trabajo por fallido, aunque técnicamente funcione, es que la hoja lo abra mal», un antiobjetivo que el dev no dijo, dentro de «Lo que entendí» | pasa | pasa |
| p3-1 | no (solo `sdd-propose`) | — | pasa | pasa | pasa en el «;»; «desde hoy», sin medir (abajo) | pasa | **falla**: decisión de diseño en lista numerada con «(Recomendada)» y sin ➡️ | pasa |
| p3-2 | sí | — | pasa | pasa | pasa en el «;»; «desde hoy», sin medir (abajo) | pasa | pasa | pasa |

**W3 en las salidas guardadas** (decisión 13 de la spec): los 25 `*.texts.txt` de `0128/green/out`, `0172/green/out` y `0168/green-molde/out`, de los que 22 cargan `sdd-grilling`. Ninguna pregunta un paso de proceso. La única oferta de seguir buscando, «¿Quieres que siga por el test y el resto de `src/` para ver dónde se aplica la comparación?» (`k1-1`), es de `sdd-consult` y no carga `sdd-grilling`: no cuenta.

**W4 y «desde hoy»**: el molde guarda las reservas con día de la semana y franja (`{ room: 'Norte', day: 'lun', slot: '10:00-12:00' }`), sin fecha. «Solo las reservas desde hoy» choca con ese hecho, y los dos sujetos lo rebaten una vez con alternativas, que es la conducta que pide el AND de «Lo ya decidido no se reabre» («si choca con un hecho del proyecto, lo rebate una vez»). La decisión 11 de la spec daba por hecho que no había ningún hecho que chocara con «desde hoy»; lo hay. Sobre el «;», que no choca con nada, ninguno de los dos lo reabre.

## Re-medición de la (4) (enmienda 2026-11-08)

La fila 2 del molde `salas-csv` cambia «y solo las reservas desde hoy» por «y por la salida estándar, que él redirige a su fichero»: «¿adónde va el CSV?» fue la primera pregunta de diseño de los 4 sujetos de `p1` y `p2`. Mismo kit, 2 sujetos, 0,38 $. Salidas en `red2/out/`.

| Sujeto | `sdd-grilling` cargada | W2 | W3 | W4 | W5 | R2 |
| --- | --- | --- | --- | --- | --- | --- |
| p3-1 | sí | pasa: «Qué sale en el CSV de una sala» (columnas y cabecera) | pasa | pasa: ejemplos con `;` y la salida por consola | pasa | pasa |
| p3-2 | no (solo `sdd-propose`) | pasa: «¿cómo se pide la sala?», el comando que teclea el responsable | pasa | pasa: «escriba por la salida estándar … con **punto y coma**», sin alternativa | pasa | **falla**: lista numerada con «(Recomendada)» y sin ➡️ |

## Veredicto por sustitución

| Sustitución | Fila | Fallan | Entra |
| --- | --- | --- | --- |
| (2) el porqué primero | W1 | 2 de 2 | **sí** |
| (1) solo lo que cambia lo que se construye | W2 | 0 de 6 | no: RED limpio |
| (3) los pasos de proceso | W3 | 0 de 8, y 0 de 22 salidas guardadas | no: RED limpio |
| (4) lo ya decidido | W4 | 0 de 2 con la fila corregida | no: RED limpio |

Total del RED: 8 sujetos, 1,60 $. Las dos veces que un sujeto de `p3` no cargó `sdd-grilling`, su primera pregunta salió en lista numerada sin ➡️ (R2): la forma de la pregunta depende de que la skill se cargue.

W5 (control) falla en 1 de 6 (`p2-2`) con el kit de hoy: es la línea base del GREEN. R2 falla en `p3-1`, que no cargó `sdd-grilling`.
