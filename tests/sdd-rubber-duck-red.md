# RED — `sdd-rubber-duck` (feature 0145)

- **Fecha**: 2026-10-08. **Kit**: la base de la rama (`1440f84f`, sin la skill), copiado con `git archive`. **superpowers**: 6.4.2.
- **Batería**: `tests/batteries/sdd-rubber-duck/` (`STEPS=rubber-duck`, `PHASE=red`), molde `exportes`.
- **Sujetos**: 6 (s1, s2 y l1, dos de cada), Sonnet. **Coste**: 0,71 $ (previsión: ~2 $ para el RED, techo de la campaña 10 $).
- **Salidas**: [`red/out/`](../.docs/sdd/specs/20261008-164456-feature-0145-sdd-rubber-duck/red/out/).
- **Veredicto de puerta**: rojo por construcción en los tres escenarios (la skill no existe). Primera skill invocada: `sdd-consult` en l1-1 y l1-2, `sdd-templates` en s1-1; el resto, ninguna.

Un primer lanzamiento no arrancó ningún sujeto: `subject_init` comprueba que la skill esperada esté en la copia del kit, y en el RED no está. Desde entonces `subject.sh` pasa a la guarda `using-sdd` en el RED (ruling de la Task 1).

## Veredicto de conducta

F = falla, P = pasa, — = la fila no aplica al escenario.

| Sujeto | R1 Sin jerga | R2 Glosario | R3 Qué y cómo | R4 Pasos reales | R5 Ejemplo que viaja | R6 Invita a preguntar | R7 Idioma |
| --- | --- | --- | --- | --- | --- | --- | --- |
| s1-1 | F | P | F | — | — | — | P |
| s1-2 | F | F | F | — | — | — | P |
| s2-1 | F | P | F | — | — | — | P |
| s2-2 | F | P | F | — | — | — | P |
| l1-1 | F | F | — | P | F | F | P |
| l1-2 | F | F | — | F | F | F | F |

**Todas las filas fallan en al menos un sujeto: ninguna regla se recorta.** R1 y R3 fallan 4 de 4 en el modo corto; R1, R2 y R5, 2 de 2 en el largo.

## Citas

- **R1, s1-1**: «Vamos a añadir a `exportar` un flag opcional `--sala` […] el fichero lleva la sala en el nombre (`exports/2026-03-norte.ics`)». El dev-lead del molde no lee el código (`mission.md`).
- **R1 y R2, s1-2**: «`src/cli.js` lee `--sala` del argv y lo pasa a `exportMonth(month, room)` […] que filtra por `booking.room` solo cuando `room` viene definido». Es el Approach de la spec, copiado al párrafo que tenía que explicarlo.
- **R1, s2-1**: «`toUtcStamp` convierte la hora de la reserva a UTC usando un offset fijo (`COWORKING_OFFSET = '+02:00'`). Después escribe esa hora UTC sin `Z` y sin `TZID`. Para un calendario eso es hora flotante». Es el mismo patrón que el merge bloqueado de la feature 0038 de document-manager.
- **R3, s2-1 y s2-2**: cuatro o cinco bloques con encabezados (resultado, causa, decisión, estado). El efecto para el socio («la reserva de 10:00–12:00 se importa de 08:00 a 10:00») aparece en medio de la causa técnica, no al principio.
- **R3, s1-2**: nueve frases, y el «cómo» técnico ocupa cinco.
- **R2, l1-1**: «Es un JSON plano con `room`, `day`, `slot`»; **l1-2**: «El `SUMMARY` es `Sala <room>`». El glosario dice Sala y Franja.
- **R1, l1-1 y l1-2**: cada paso lleva su ruta en el título o en el cuerpo (`src/export/index.js:6-8`, `loadBookings` → `bookingsBySlot` → `toIcs` → `writeExport`), además de `VEVENT`, `VCALENDAR` y `\r\n` sin explicar.
- **R4, l1-2**: «7. **Importas.** Abres el `.ics` en tu calendario. Esto ya no lo controla el código». Es un fallo débil: los dos sujetos leyeron el código antes de escribir, y l1-1 pasa. La regla se queda porque falla, pero es la de menos peso.
- **R5**: l1-1 nombra «2026-03» en tres de sus seis pasos y ninguna sala; l1-2 nombra la franja 10:00-12:00 solo en el paso 5. Ninguno sigue una exportación concreta de principio a fin.
- **R6**: los dos terminan ofreciendo trabajo, no resolver dudas: «dime si es un fallo para un patch o un cambio de comportamiento para otra feature» (l1-1), «Dime cuál de las dos quieres y lo arranco» (l1-2).
- **R7, l1-2**: «Using sdd-consult para responder con el contexto del proyecto cargado».

## Positivos que no piden guía

- Los seis sujetos leyeron el código o la spec antes de escribir, y ninguno inventó un paso que el código no hace.
- En s2, los dos dieron el efecto correcto (dos horas antes) y no tocaron código ni cerraron la feature.
- En s1, los dos dejaron la spec sin editar, como pedía la petición.
