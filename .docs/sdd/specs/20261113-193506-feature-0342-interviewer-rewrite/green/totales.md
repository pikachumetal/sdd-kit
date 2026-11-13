# GREEN 1 — totales

Kit: `dist/` de `06c48b44` (núcleo y territorios de la Task 3), en `.temp/i/kit`. 59 sujetos y 2 relanzamientos (`fp-2`, `fp-5`), 13,90 $ de sujetos. Lectores Sonnet con `../readings/encargo.md` (entrevistador) y la rúbrica de `tests/batteries/sdd-grilling/battery.md` (forma); `m2`, `e1` y `n4` los puntuó el hilo (`readings/hilo.md`). El hilo releyó cada «falla».

## Filas de máquina

| Escenario | K | E4w |
| --- | --- | --- |
| g9 | 5/5 | 0/5 (ninguno busca en la web: corren la cobertura en local y tiran de memoria) |
| fp | 4/5 (`fp-2` no cargó en los dos intentos: rojo de K) | — |
| resto | todos | — |

## En rojo

| Fila | Escenario | Resultado | Cita |
| --- | --- | --- | --- |
| E4w, E4 | g9 | 0/5, 0/2 | «los recuerdo de 22.8 en adelante, pero no los he verificado» |
| E1 | fp | 0/4 | «No voy a crear un segundo comando igual.» |
| K | fp | 4/5 | `fp-2`: solo `Skill: sdd-kit:sdd-propose` |
| E6 | g8, p1 | 3/5, 1/2 | «¿Sigue siendo cierto eso hoy, o ha cambiado algo, por ejemplo si lo usa…?» |
| E5 | g1, g8, p2, p3, pe | 1/2, 4/5, 1/2, 1/2, 2/5 | «¿Qué columnas necesita ver en su hoja el próximo lunes, y qué cuadra con ellas?» |
| E0 | g1, g3, g9 | 1/2, 1/2, 4/5 | «Lo corregiré dentro de este cambio» |
| E3, E7, forma | pe | 4/5 | `pe-2`, `pe-3` |
| R7 | g4 | 1/2 | `g4-2`: el turno 1 no rebate que `--cada-semana` ya existe |
| R9 | g6 | 1/2 | `g6-2` vuelve a presentar las tres alternativas tras el rechazo |
| C1 | g7 | 0/2 | pregunta sin enseñar antes la tabla de claves |
| B1 | sk | 0/2 | maqueta en texto en vez de la variante sobre la app real |

## En verde

`rq`, `g2`, `g5`, `t1`, `fl`, `ag` (A1 de `ag-2`, sin verificar: no guardó la spec), `sk-c`, `k1`, `u1`, `m2` (3/3), `e1` (2/2), `n4` (1/1); E0 en `g8`, `pe`, `p1`, `p2`, `p3`, `fp`.

## Causas que el hilo encuentra en el texto de la Task 3

- R9 y B1: al reescribir el núcleo salieron «sin opciones ni recomendación» del rechazo y el contraejemplo del boceto («no he arrancado la app» no es motivo).
- C1: el paso 2 de `sdd-config` abre invocando el núcleo, y el sujeto pregunta antes de la tabla del paso 1.
- E5 y E6: «una frase que pide un caso» sale como pregunta doble («¿qué…, y qué…?») o con ejemplos tras la confirmación.
- E1: la regla de `spec-writing.md` no gana al rebate; el sujeto reconvierte la petición en un cambio de `libres`.
