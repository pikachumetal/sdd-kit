# RED de la feature 0146 — spec y plan de propose

Baseline de las reglas que la feature 0146 quiere añadir a `sdd-start-feature`, `sdd-grilling` y `sdd-rubber-duck`, sobre el kit del commit de apertura (`4ea38478`, `git archive … skills .claude-plugin hooks cli`), con superpowers 6.4.2 en `SUPERPOWERS_DIR`. Baterías: `tests/batteries/sdd-start-feature/` (nueva), `t1` en la de `sdd-grilling` y `l2` en la de `sdd-rubber-duck`. Sonnet, salvo `g1` en Opus. Salidas en `.docs/sdd/specs/20261008-193241-feature-0146-propose-spec-and-plan/red/out/`.

**Puerta**: los 18 sujetos entraron por la skill esperada (veredicto de `battery.sh`, 2/2 en cada escenario). **Coste**: 6,75 $ en la primera tanda, más las repeticiones de abajo.

## Veredicto de conducta, por regla

| Fila | Escenario | Resultado | Cita |
| --- | --- | --- | --- |
| S1 🦆 y ✋ arriba | s1 | **falla 2/2** | las dos `spec-new.md` abren con «## Capacidades» y «## Decisiones que he tomado yo — valida estas», sin 🦆 ni ✋ |
| S2 ✋ exhaustivo | s1 | **falla 2/2** | s1-1: «falta el motivo: …» y «sin canceladas» solo en los THEN y en «Avisos»; s1-2: «motivo requerido: …», «sin canceladas» y «en el orden en que se cancelaron» solo en los THEN |
| S3 Secciones | s1 | **falla 2/2** | ninguna lleva «## Dónde se prueba» ni «## Términos y ADR» |
| G1 Gate con opciones | g1 (Opus) | **falla 2/2 en la forma; pasa 2/2 en el contenido** | ninguno intenta `AskUserQuestion` (0 en `tools.txt`): la pregunta va en prosa («Opciones: …», «¿Apruebas la spec o quieres cambios?»). Los dos sí ofrecen la opción de parar antes de la Task 1 para bajar a gama media: el fallo de campo del ticket de la feature 0060 §3 (la opción ausente) **no se reproduce** en este molde |
| R1 Modelo del revisor | r1 | **falla 2/2** | r1-1: «un revisor con los siete puntos», sin modelo; r1-2: «dos revisores (~200k tokens), solo el de dominio o ninguna», sin modelo |
| P1 Dependencias | p1 | **falla 1/1 válido** | p1-1 (primera tanda): `### Task 1` y `### Task 2` sin `Tras` ni «sin paralelo». p1-2 paró a proponer una enmienda porque la spec del molde pedía «quién canceló» y la app no tiene usuarios: conducta correcta, molde defectuoso; ver «Repeticiones» |
| P2 Verificación por superficie | p1 | pasa 1/1 válido | p1-1: «**Verificación**: `node --test test/cancel.test.js`» en las dos tasks; el gate entero, solo en §3 |
| U1 Parada con corrección en su sitio | u1 | **falla 2/2** | sin 🦆 ni ✋ en ningún mensaje |
| U2 Task nueva | u1 | **falla 2/2** | ninguno añade `Task 3 — enmienda…`: el trabajo de la enmienda se hace dentro de la Task 2 (u1-1: «Enmienda E1 aprobada: sin "quién canceló"» en la nota de la Task 2) |
| V1 🦆 y ✋ en la validación | v1a, v1b | **falla 2/2 y 2/2** | v1a-1 abre con «Sigo con el paso 7…» y «## Me salí del plan en…»; v1a-2, igual; v1b-1 no lleva el bloque; v1b-2, «**Me salí del plan en…**» sin 🦆 |
| T1 Contraste de lenguaje | t1 | **pasa 2/2** | t1-1: «"Baja" no es un término del proyecto. `PRODUCT.md` lo marca como "evitar" y distingue cancelación … de anulación … El código tiene `cancelBooking` y `voidBooking`»; t1-2: «"Dar de baja" no es un término del proyecto. `PRODUCT.md:9-10` …» |
| R8 Lista en su idioma | l2 | **pasa 2/2** | l2-1 y l2-2: «**Where to look:**» |
| L Idioma | todos | pasa | — |

## De dónde sacaron la conducta los que pasaron

- `t1`: de `PRODUCT.md`, que es la fuente que la regla nombra (la sección «Terminology» con su _Evitar_), y del código. No es una fuente incidental: el glosario es la precondición de la regla. Sin fallo, el contraste de lenguaje de `sdd-grilling` no se escribe (Art. I).
- `l2`: de la regla del Overview de `sdd-rubber-duck` («todo lo que leen, en su idioma»), vigente desde la 0145. El ajuste de «Dónde mirar» no se escribe.
- `g1`, opción de bajar de modelo: del paso 4 vigente. El fallo de campo salió de una sesión larga; un sujeto recién arrancado con la spec delante no lo reproduce (`tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas»). Queda como posible falso negativo. La forma (`AskUserQuestion` en vez de prosa) sí falla.

## Hallazgos sobre el arnés

- En `claude -p`, `AskUserQuestion` no existe: un sujeto que la pide la busca con `ToolSearch`, no la encuentra y pregunta en prosa (prueba con Haiku en el scratchpad). G1 y R1 puntúan el intento o las opciones literales.
- Los rulings del molde de v1 contradecían el historial (v1a-1 los retiró por falsos). Se sustituyen para el GREEN por dos que el código respalda; V1 mide el arranque del mensaje, que no depende de ellos.

## Repeticiones
- **p1, con la spec sin «quién canceló»** (el molde de la primera tanda pedía un dato que la app no tiene, y p1-2 paró con razón): P1 **falla 2/2** (ninguna task lleva `Tras`; p1-1 junta todo en una task, p1-2 hace dos, sin dependencias declaradas ni «sin paralelo»). P2 **pasa 2/2**: «**Verificación**: `node --test test/cancel.test.js`» en cada task, sin el gate entero. La primera tanda queda en `red/out-p1-old/`.
- **s2 de `sdd-rubber-duck`, con la skill vigente** (fase `base-s2`, invocándola en modo corto; no estaba en la previsión, que solo le daba GREEN): **falla 2/2**. Tras el párrafo, el pato pide la decisión con opciones y recomendación: s2-1, «hay que decidir cómo se escribe la hora en el fichero. Una opción es… La otra es…»; s2-2, «Necesito que decidas cómo se escribe la hora… Hay dos opciones: … Es mi recomendación». La parada que lo invoca la volvería a preguntar. Salidas en `base-s2/out/`.

## Qué reglas sobreviven

- **Se escriben** (el RED falla): 🦆 y ✋ exhaustivo al abrir la spec, «Dónde se prueba» y «Términos y ADR» como secciones (S1–S3); la pregunta del gate con `AskUserQuestion` y opciones fijas (G1, la forma); el modelo del revisor de dominio en la pregunta de review (R1); `Tras` y «sin paralelo» en el plan (P1); la acción update con task nueva (U1, U2); 🦆 y ✋ al abrir la validación (V1); lo pendiente tras el 🦆 como afirmación (s2).
- **Salen** (el RED pasa, Art. I): el contraste de lenguaje de `sdd-grilling` y lo que devolvería (T1); la lista final de la explicación larga en el idioma del usuario (l2); la «Verificación» de cada task sacada de «Dónde se prueba» y de §Testing, y qué hacer sin §Testing (P2).
- **Posible falso negativo**: la opción de bajar de modelo en el gate de `delegate` (el fallo de campo de la feature 0060 del template) sale 2/2 en un sujeto recién arrancado. La regla de las opciones fijas la cubre igual, porque la lleva literal.
