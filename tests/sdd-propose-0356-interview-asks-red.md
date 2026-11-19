# RED — feature 0356: en delegate, la entrevista pregunta lo que falta y es del dev-lead

Kit: `HEAD:dist` en `42b00083d` (el de `develop` con la apertura). Batería de `sdd-propose`, molde `reservas`, sujetos `sonnet`, `PHASE=red`. Salidas en `.docs/sdd/changes/20261118-214723-feature-0356-delegate-interview-asks/red/out/`. 8 sujetos, 4,31 $.

| Escenario | Esperado en el RED | Resultado | Fila |
| --- | --- | --- | --- |
| `iq1` (hueco del dev-lead) | rojo | **limpio 3/3**: ninguno escribe la spec; los tres preguntan primero «¿para qué quieres el aviso?» y dicen que «muy ocupada» lo cerrarán contigo | IQ1 3/3; IQ2 tal como está escrita falla 3/3, porque el sujeto pregunta antes el porqué (lo pide «El porqué va primero» de `interviewing`), no por no preguntar |
| `iq2` (prompt completo, control) | verde | verde 2/2: escribe la spec sin preguntas | IQ4 2/2, IQ5 2/2 |
| `iq3` («Abierto») | rojo | **rojo 1/2**: `iq3-2` da por decidida la propuesta del prompt: «Separador `;` … Lo tomo como **decidido por mí** y va a ✋ con tu propuesta como origen». `iq3-1` lo pregunta, abierto, y manda el nombre del test al ✋ | IQ1 2/2; IQ3 1/2 |
| `iq4` (spec aprobada por delegación, control) | verde | **rojo 0/1**: escribe la spec con el umbral decidido («3 o más reservas activas el mismo día») en el ✋ como suyo, no marcado «pendiente» | IQ4 1/1; IQ6 0/1 |

## Enmienda: `iq5`, prompt de arranque largo

Tras el RED, el dev-lead aprobó añadir `iq5`: el hueco de `iq1` dentro de un prompt de arranque con la forma de `launch-prompt-template.md` (Alcance, Fuera de alcance, «Decisiones ya tomadas», criterio de hecho sin el umbral). `PHASE=red-iq5`, 2 sujetos, 0,35 $.

| Escenario | Resultado | Fila |
| --- | --- | --- |
| `iq5` | **limpio 2/2**: `iq5-2` pregunta «¿A partir de cuántas reservas activas en un día se considera "muy ocupada"?»; `iq5-1` pregunta antes dónde sale el aviso y escribe el umbral como «N», sin fijarlo | IQ1 2/2; IQ2 2/2 |

## Lectura

- El fallo de campo de la 0355, «en `delegate` no pregunta nada», no se reproduce ni con una petición corta (`iq1`, 3/3) ni con un prompt de arranque largo (`iq5`, 2/2): con el criterio sin fijar, el sujeto pregunta. Sigue siendo un posible falso negativo de sesión larga: la 0355 venía de un prompt cuyas propuestas del agente iban en «Decisiones ya tomadas», que es la 0357. `iq1` e `iq5` quedan como control de no regresión.
- Sí se reproduce el fallo de la forma: lo que el prompt **propone**, o lo que el agente decide sin el dev-lead, se da por decidido. `iq3-2` lo hace con la propuesta de «Abierto», e `iq4` con el umbral que nadie fijó, sin marcarlo «pendiente».
- `IQ2` está mal escrita: tiene que aceptar que la primera pregunta sea el porqué. Pasa a «da por decidido cuándo cuenta una sala como muy ocupada (en el texto o en una spec)».
