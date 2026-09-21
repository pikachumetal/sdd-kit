turns: 34 · coste: 0.7925082 $

Spec de la task 0006 escrita y parada en el gate. No he escrito plan ni código, y la spec queda sin commitear en `feature/0006` (la rama ya existía).

Ruta: `.docs/sdd/specs/20260921-112108-task-0006-caducadas-del-dia/spec.md`. Va en modo full, estado `in-review`.

## Decisiones que he tomado yo — valida estas

**Review propuesta:** un revisor de lente técnica. Las señales que cuento son contrato público y reglas de visibilidad. No he despachado ninguno porque no estabas para activarlo. El mínimo razonable, sin review, deja sin mirar las decisiones 8 y 9.

1. **Solo servidor, sin pantalla.** El repo es una API Express sin capa de UI. El contador de pendientes «en la cabecera» que describe la capacidad tampoco existe en el código. La fila del roadmap promete pintar los contadores, así que un ✅ cubriría solo el servidor. La UI sería una task aparte y no la he abierto.
2. **Una consulta:** `GET /bookings/expired-today` devuelve `{ count, bookings: [{ id, teacherId, roomId }] }`.
3. **«Caducó hoy»** se mide por `created_at + 30 min`, no por cuándo corrió el barrido. Así no hay columna nueva ni migración.
4. **Zona `Europe/Madrid`.** Es asunción mía, porque la constitution no fija zona. Es la decisión más frágil.
5. **La consulta ejecuta antes `expirePendingBookings`.** Nada en el repo lo invoca hoy, y sin eso el contador daría 0 siempre. Contrapartida: un GET que escribe (idempotente).
6. **Profesor y aula son `teacherId` y `roomId`.** No hay tablas de nombres en el repo.
7. **Orden de la lista:** la caducada más recientemente primero.
8. **Sin control de acceso.** El código no tiene roles, ni `confirm` ni `cancel` se protegen. «Solo secretaría» queda como intención, y cualquiera con acceso a la API vería profesor y aula de las caducadas. Recomiendo ticket aparte de roles.
9. **Supuesto sobre `created_at`:** existe y guarda ISO-8601 en UTC. El DDL no está en el repo y no lo he podido verificar. Si falla, aparece una migración y la spec vuelve al gate.
10. **Modo full.** No hay flujo de contador ni lista que leer, y el endpoint es un contrato nuevo.
11. **Sin capacidad nueva.** Cuatro escenarios `ADDED` en `bookings`. Cambian dos entradas de las reglas, «Límites» y «Avisos».

## Descubierto fuera de scope (sin absorber)

- `POST /bookings/:id/confirm` confirma cualquier estado, también una `expired`. Una caducada confirmada después saldría de la lista y podría reservar un aula que ya se liberó.
- El repo no tiene tests, aunque 0002 y 0004 figuran ✅ y el Art. 3 exige uno por regla.

La task queda en espera de tu aprobación. No paso al plan hasta que la des o ajustes las decisiones.
