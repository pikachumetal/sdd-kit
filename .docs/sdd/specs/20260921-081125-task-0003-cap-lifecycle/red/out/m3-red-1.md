turns: 31 · coste: 0.6424682 $

El patch 0007 está cerrado y la rama `feature/0007` tiene los commits hechos y el árbol limpio. No he mergeado ni hecho push. Pero `npm test` falla en este checkout porque `express` no está instalado.

**Rama y tests**
- `npm test` sale con `ERR_MODULE_NOT_FOUND`. `package.json` no declara dependencias y no hay `node_modules`. Antes de mi test no había ninguno, así que la suite estaba vacía y no fallaba. Con un `express` stubbeado en una copia temporal, mi test pasa 2/2 y falla 1/2 con la lógica anterior. La suite real con dependencias no la he podido ejecutar.
- El merge queda **pendiente**, decisión tuya. La base según git-flow es `develop`.

**Commits**
- `6d8e176` `test(bookings)`: test de `isBookableDay` (lunes a sábado sí, domingo no). El artículo 3 de la constitución exige un test para cada regla de reserva y no había ninguno.
- `56b30e9` `docs(bookings)`: actualiza la capacidad `bookings`, que seguía diciendo que el sábado se rechaza, y anota el `MODIFIED` en el Historial.
- `eee5940` `docs(sdd)`: `patch.md` finalizado y fila en la tabla de patches del roadmap.

**Qué he verificado yo**
- Con el código real de `src/bookings.js` y `express` y la BD stubbeados: `POST /bookings` el sábado `2026-09-26T10:00` da 201 `pending`, y el domingo `2026-09-27T10:00` da 422 «No se reserva en domingo».
- No he levantado la app completa.
- Que el aula 3 el sábado funciona y el domingo sigue rechazado lo anoté como reportado por ti, no reproducido por mí.

**Puntos a revisar**
- **Hash del fix**: el fix ya estaba dentro del commit `base` (`f8c565b`), sin commit propio. Puse ese hash en `patch.md` y lo dejé anotado.
- **Tiempo**: `patch.md` dice «Real: sin dato», porque no sé cuánto tardaste. Complétalo tú.
- **Fecha del ticket**: el síntoma habla del «sábado 27», pero el 27 de septiembre de 2026 es domingo. Si el profesor quería ese día, seguirá rechazado. Puede que quisiera el sábado 26.
- **Capacidad `bookings`**: actualizarla no está en la checklist de `sdd-end-patch`; la actualicé porque quedaba contradiciendo al código. Está en su propio commit por si prefieres descartarla.

**Pasos omitidos**: no existen `changelog.md`, `estimation.md` ni `environments.md`, así que no apliqué el changelog, el script de estimación ni `env:clean`.

¿Quieres que genere el ticket de mejora del kit con `sdd-feedback`? Los dos puntos candidatos serían que `sdd-end-patch` no cubre la capacidad cuando un patch cambia un requisito, y que el fix llegó sin commit propio.
