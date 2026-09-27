turns: 30 · coste: 0.7766198 $

La spec de la task 0004 está escrita y la tarea queda **en espera de tu aprobación**. No he escrito plan ni código, y la spec no está commiteada, porque no me pediste commit. Está en `.docs/sdd/specs/20260921-111104-task-0004-avisos-email/spec.md`, en `feature/0004`, modo full.

## Decisiones que he tomado yo — valida estas

**Review de spec propuesta:** dos revisores, sin activar.
- **Señales contadas:** capacidad nueva, contrato público, datos, dependencia externa y reglas de permiso.
- **Dominio:** miraría si «4 intentos» y «cuota diferida» respetan el roadmap, y qué no puede ver el profesor.
- **Técnica:** miraría el token compartido, la migración de `teacher_email` y `nodemailer`.
- **Mínimo razonable:** solo técnica. Deja sin mirar las decisiones 2-4, que son de dominio.
- No había nadie para activarla, así que la spec va sin review.

Ordenadas por lo que más cambia el resultado si no estás de acuerdo:

1. **Secretaría se identifica con un token compartido `SECRETARIA_TOKEN`.** El proyecto no tiene autenticación ni roles. Sin el token configurado, esos endpoints responden `401` siempre.
2. **«Tres reintentos» son 4 intentos en total**, con esperas de 1, 5 y 15 minutos. El número viene del roadmap; **las esperas las he inventado yo**.
3. **La cuota cuenta envíos exitosos por día UTC.** Al agotarse, los avisos se difieren al día siguiente, no se descartan. El coste es que un aviso de cancelación puede llegar tarde. Uso UTC porque ni la constitution ni la misión fijan zona horaria.
4. **«Por centro» es una sola cuota global.** La misión dice «un único centro» y no existe `center_id`.
5. **El destinatario sale de un `teacherEmail` opcional nuevo en `POST /bookings`.** Hoy solo hay `teacher_id`. Sin correo (reservas ya existentes incluidas), el envío queda `skipped` en el registro y no bloquea la confirmación.
6. **Capacidad nueva `avisos`.** No hay `MODIFIED` ni `REMOVED` sobre `aulario`.
7. **Dependencia nueva: `nodemailer` sobre SMTP.** La cola vive en SQLite con un worker en el proceso, sin broker externo. La misma tabla sirve de cola y de registro.
8. **Sin `SMTP_URL` la API arranca igual.** Así no se rompe «`docker compose up` → `/health` 200» en un clon limpio.
9. **Plantillas:** texto plano, dos (`booking_confirmed`, `booking_cancelled`), con marcadores `{{bookingId}}`, `{{roomId}}`, `{{start}}`, `{{end}}`. Se renderizan al encolar. Un marcador desconocido o un asunto con salto de línea se rechaza.
10. **Solo un cambio real de estado avisa.** Confirmar y cancelar deprisa envía los dos avisos, en orden. El envío es asíncrono.
11. **Entrega «al menos una vez».** Si la API cae en pleno envío, ese aviso puede repetirse.
12. **Registro:** filtro solo por reserva, máximo 100 entradas, sin el cuerpo del mensaje. El tope de 100 es mío.
13. **No toco la constitution.** «Límites» y «Avisos» siguen «pendiente». Los valores de esta task viven en la capacidad, y te propongo rellenarlos al cerrar.
14. **Una sola task.** Si el plan pasa de unas 6 tasks, propongo partir las plantillas en la 0006 con `parent: 0004`.
15. **Supuesto sobre el esquema.** En esta rama no hay runner de migraciones, `CREATE TABLE` ni tests; solo `app.js` y `bookings.js`. Tomo las capacidades de `aulario` como verdad, y el plan debe comprobar el esquema real de `bookings`.

## Necesito tu decisión sobre algo fuera de scope

`confirm` y `cancel` no tienen ninguna protección, no devuelven `404` para ids inexistentes y no validan la transición de estado. Cualquier profesor puede confirmar o cancelar. No lo he tocado: ¿se arregla en esta rama o va a un ticket aparte? Hasta que respondas, queda como está.

## Otras notas

- **Carpeta de la spec:** `New-Item` por PowerShell pidió aprobación y no había quién la diera, así que creé la carpeta escribiendo el fichero directamente.
- **Qué necesito para seguir:** tu aprobación explícita de la spec o tus cambios. Entonces pasaré a `superpowers:writing-plans`, que tendrá su propio gate.
