turns: 33 · coste: 0.7813106 $

## Decisiones que he tomado yo — valida estas

Spec en `.docs/sdd/specs/20260921-125343-task-0004-email-notices/spec.md`, modo full, estado `in-review`. No he escrito plan ni código, ni he hecho commit. La task queda **en espera de tu aprobación**.

**Review propuesta, no activada:** dos revisores (dominio y técnica). Cuento 6 señales: capacidad nueva, contrato público, datos, dependencia externa, área no explorada y visibilidad. No la he lanzado porque activarla es cosa tuya. El mínimo razonable es un revisor técnico, y dejaría sin mirar el hueco de visibilidad y la lectura de «tres reintentos» y «por centro».

1. **Capacidad nueva `email-notifications`.** Todo el delta es `ADDED`, sin `MODIFIED`.
2. **`POST /bookings` gana `teacherEmail` opcional.** El requisito vive en la capacidad nueva, porque hoy ninguna capacidad describe `/bookings`. Una reserva sin email genera una entrada `skipped` en el registro.
3. **«Tres reintentos» son 4 intentos:** el inicial más 3 reintentos, a 1, 5 y 30 minutos.
4. **Cuota de 500 envíos por día UTC, con un contador único.** La misión dice que hay un solo centro. Lo que excede la cuota queda en cola hasta el día siguiente, no se descarta.
5. **El texto del aviso se congela al encolar.**
6. **Plantillas en texto plano** con los marcadores `{{bookingId}}`, `{{roomId}}`, `{{start}}` y `{{end}}`. Un marcador desconocido da `400`. Asunto ≤ 200 y cuerpo ≤ 5000 caracteres.
7. **El registro es la propia tabla de avisos.** Máximo 100 entradas, filtro solo por `bookingId`, sin paginación ni purga. Todo es solo API, sin UI.
8. **Un aviso nace solo de un cambio de estado real.** Confirmar dos veces no duplica el email, y los avisos salen en orden.
9. **⚠ Los endpoints nuevos no exigen autenticación ni roles.** El proyecto no tiene ninguno, y `confirm` y `cancel` tampoco. Cualquiera con acceso a la API lee los emails de los profesores y edita las plantillas. Es lo que más conviene validar. La alternativa es un token compartido de secretaría solo para los endpoints nuevos.
10. **Dependencia nueva: `nodemailer` con SMTP por variable de entorno.** Sin SMTP configurado, cada intento falla con «SMTP no configurado».
11. **Secretaría no recibe avisos de fallo ni de cuota.** Los ve en el registro.
12. **⚠ Supuesto a verificar:** `git ls-files` solo lista `src/app.js` y `src/bookings.js`. El runner de migraciones de la task 0003, el esquema de `bookings` y la caducidad de reservas que menciona el README no están en este árbol. El plan debe localizarlos antes de fijar dónde va el esquema nuevo, y si no existen la task se detiene.
13. **Descubierto y fuera de scope:** `confirm` y `cancel` de un id inexistente responden `200` hoy. No lo toco. Decide si va a ticket aparte.

Cuando la apruebes o me pidas cambios, sigue `superpowers:writing-plans`.
