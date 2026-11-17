turns: 31 · coste: 0.779398 $

La spec está escrita y la task queda **en espera de tu aprobación**. No he escrito plan ni código, y no he tocado el roadmap (sigue ⏳). Tampoco he hecho commit: el fichero está sin commitear en `feature/0004`.

Spec: `.docs/sdd/specs/20260921-110836-task-0004-avisos-email/spec.md`

## Decisiones que he tomado yo — valida estas

**Review propuesta, sin activar.** Propongo dos revisores: uno de dominio y otro técnico. No lo he lanzado porque proponer no es activar y tu `CLAUDE.md` pide confirmar antes de paralelizar. Si lo activas, uso Sonnet con effort medium, uno por lente. El mínimo razonable es solo la lente técnica, que deja sin mirar el orden de avisos y lo que el profesor no debe ver.

1. **Secretaría se identifica con un token compartido** (`SECRETARIA_TOKEN`, cabecera `Authorization: Bearer`). El código no tiene autenticación ni roles. Sin token configurado, esos endpoints devuelven `401`. `/confirm` y `/cancel` siguen abiertos a cualquiera; lo dejo como deuda para ticket aparte.
2. **El email del profesor entra por `teacherEmail`, opcional, en `POST /bookings`.** No hay tabla de profesores. Sin email, el aviso queda registrado como `omitted`.
3. **«Tres reintentos» son 4 intentos** (1 más 3 reintentos), con esperas de 1, 5 y 15 minutos. Después el aviso queda `failed`.
4. **La cuota de 500 es un único contador global**, porque la misión dice «un único centro». El día natural es `Europe/Madrid` y solo cuentan los envíos con éxito. Al agotarse, los avisos esperan al día siguiente.
5. **Los avisos de una misma reserva salen en orden.** Sin esto, una confirmación reintentada llegaría después de la cancelación y el profesor leería un estado falso.
6. **Sin `SMTP_URL` la API arranca igual** y los avisos esperan en cola, así `docker compose up` no se rompe. No toco `docker compose`.
7. **Plantillas en texto plano** con cuatro marcadores (`{{bookingId}}`, `{{roomId}}`, `{{start}}`, `{{end}}`). Un marcador desconocido se rechaza al guardar. El texto se fija al encolar.
8. **Solo hay aviso si el estado cambia de verdad.** No hay aviso para ids inexistentes ni por caducidad. El README menciona la liberación automática de reservas, pero no existe en el código ni en el roadmap.
9. **El registro es la propia cola.** Filtra solo por reserva, con `limit` de 100 por defecto y 500 como máximo. La retención es indefinida y guarda emails de profesores, así que la purga y el RGPD quedan como seguimiento.
10. **Capacidad nueva `avisos`.** No existe una capacidad `reservas`, así que todo va como `ADDED`, sin `MODIFIED`.
11. **`Límites` y `Avisos` de la constitution están en «pendiente»** y esta task los define. Propongo rellenarlos al cerrar; no toco la constitution hasta que valides.
12. **No parto la task.** Si prefieres partirla, sería plantillas más registro en una task nueva con `parent: 0004` y fila propia en el roadmap.

## Hallazgo a validar

**No he encontrado el ejecutor de migraciones ni el esquema de `bookings` en el árbol.** `git ls-files` solo lista `src/app.js` y `src/bookings.js`; tampoco hay `migrations/` ni `data/`. La capacidad `aulario` da por hecha la task 0003. La spec asume que las migraciones existen. Si de verdad faltan, el plan tendrá que resolverlo antes de añadir tablas, y eso cambia el tamaño de la task.

Necesito tu aprobación explícita de la spec antes de escribir `plan.md`. Si quieres cambiar alguna decisión, dime el número.
