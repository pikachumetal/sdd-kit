turns: 34 · coste: 0.682184 $

Spec escrita. La task queda **EN ESPERA en el gate de aprobación**. No he escrito plan ni código, y no he hecho commit.

Está en `.docs/sdd/specs/20260921-111930-task-0006-caducadas-del-dia/spec.md`, en modo full y en la rama `feature/0006`. Modo lite exigía tu confirmación y no estabas.

## Decisiones que he tomado yo — valida estas

**Review de spec propuesta: un revisor (lente técnica).** Señales: contrato público (endpoint nuevo) y reglas de visibilidad. Sin tu respuesta no la he activado, así que la spec va sin review. El mínimo razonable, sin review, deja sin mirar el hueco de visibilidad de la decisión 8.

1. **Solo backend.** En el repo no hay front, ni contador de pendientes, ni ningún `GET`. ¿El front está en otro repo, o esta task debe construirlo? Si lo segundo, cambia el alcance.
2. **Un endpoint** `GET /bookings/expired-today` que devuelve `{ count, bookings }`. El nombre y la forma son contrato público.
3. **«Hoy» es el día natural en la zona horaria del servidor.** La constitution no fija la zona del centro. Confirma la real.
4. **Momento de caducidad = `created_at` + 30 min**, sin columna `expired_at`, así que no hay migración. Si el barrido de caducidad corre tarde, la reserva cuenta en el día en que se cumplieron los 30 min.
5. **Se cuenta lo que está en `expired`.** Ojo: `expirePendingBookings` (`src/expiry.js`) no se llama desde ningún sitio de `src/`. Si el barrido no corre en otro lugar, el contador será siempre 0. No lo toco aquí; confirma dónde corre.
6. **«Profesor y aula» son `teacherId` y `roomId`.** No hay tablas con nombres en el repo. Si existen, el nombre legible entra en esta task.
7. **Orden de la lista:** la que caducó más recientemente, primero.
8. **Visibilidad (la decisión que más te pido revisar).** La lista es para secretaría, pero el repo no tiene roles ni autenticación, así que no puedo aplicarlo. El endpoint queda abierto igual que `/confirm` y `/cancel`, y cualquier cliente vería profesor y aula de las caducadas. Propongo un control de acceso como task aparte. ¿Debe bloquear esta?
9. **Sin capacidad nueva.** Son tres requisitos `ADDED` en `bookings`, sin `MODIFIED` ni `REMOVED`, y se amplía su regla **Avisos**.
10. **Descubierto y sin tocar:** `POST /:id/confirm` no comprueba el estado, así que una reserva `expired` puede volver a `confirmed` con el aula ya liberada. Necesita depuración y tu decisión.
11. **Otras discrepancias entre capacidad y repo, sin tocar:** `POST /bookings` no comprueba solapes (la 0002 figura ✅) y no hay tests en el repo pese al Art. 3.

Para continuar, dime qué ajustas y si apruebas. Después de tu aprobación va el plan, con su propio gate. Si quieres la review de spec, dímelo antes de aprobar.
