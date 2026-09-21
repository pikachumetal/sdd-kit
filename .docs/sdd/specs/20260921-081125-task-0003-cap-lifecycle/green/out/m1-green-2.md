turns: 33 · coste: 0.8197928 $

Spec escrita y la task queda **en espera en el gate de aprobación**. No hay plan ni código, y no he hecho commit. La rama `feature/0004` ya existía. La spec está en `.docs/sdd/specs/20260921-125406-task-0004-booking-emails/spec.md` (modo full, 12 requisitos en la capacidad nueva `booking-notifications`).

## Review propuesta (no activada)
Dos revisores, Sonnet con effort medium, uno por lente, según la rúbrica del kit. Las señales son capacidad nueva, contrato público, datos nuevos, dependencia externa (`nodemailer`) y reglas de visibilidad.
- **Dominio:** comprobaría que el profesor no ve ni edita nada de secretaría, y si diferir los avisos al agotar la cuota es lo que secretaría espera.
- **Técnica:** comprobaría que reintentos y cuota aguantan un reinicio, y que la migración cuenta con un runner que no está en este checkout.
- **Mínimo razonable:** solo técnica. Deja sin mirar el complemento de visibilidad y la regla de cuota.

No lanzo ninguno sin tu OK. Sin respuesta, la spec queda sin review y así consta en ella.

## Decisiones que he tomado yo
1. **Capacidad nueva `booking-notifications`**, en vez de meterlo en `aulario`.
2. **Una sola task.** Cola, registro y cuota dependen entre sí. Partirla exigiría el id 0006 con `parent: 0004`.
3. **Solo API, sin pantalla.** El repo es Express sin frontend.
4. **«Secretaría» es quien presenta el token `SECRETARIA_TOKEN`**, porque no hay usuarios ni roles. Sin token configurado, las rutas responden `401`. No es auth real.
5. **Destinatario:** campo nuevo `teacherEmail`, opcional, en `POST /bookings`. No existe ningún directorio de profesores. Sin correo, el aviso queda `failed` con `no_recipient` y sin reintentos.
6. **«Tres reintentos» son 4 intentos** (1 inicial + 3), con espera fija de 5 min.
7. **Cuota:** «por centro» es un contador global, porque la misión habla de un único centro. Cuenta solo correos `sent`, el día es UTC, y al agotarse los avisos se difieren en vez de descartarse. Es la decisión más discutible.
8. **Solo un cambio real de estado genera aviso.** Repetir `confirm` o usar un id inexistente no envía nada, así nadie agota la cuota. El correo nunca bloquea confirmar ni cancelar.
9. **La plantilla se rellena al encolar.** Hay dos tipos fijos, texto plano y 4 marcadores. Un marcador desconocido o campos vacíos dan `400` al guardar.
10. **Cola en SQLite con envío dentro de la propia API.** El registro es la misma tabla que la cola.
11. **`nodemailer` con `SMTP_URL` y `MAIL_FROM`.** Sin `SMTP_URL` los avisos esperan en cola, así la suite actual sigue pasando.
12. **La constitution tiene «Límites» y «Avisos» como pendiente.** La spec los rellena y propone actualizar la constitution al cerrar; no la he tocado.
13. **Registro:** más recientes primero, máximo 100, sin paginación, filtro solo por `bookingId`.
14. **Detectado y sin tocar:**
   - `confirm` y `cancel` de un id inexistente devuelven `200`.
   - Se puede confirmar una reserva cancelada.
   - El runner de migraciones descrito en `aulario` no está en este checkout, solo `src/app.js` y `src/bookings.js`.

Dime si alguno de los puntos de la decisión 14 debe entrar en 0004. Cuando apruebes la spec, o la corrijas, sigo con el plan.
