turns: 37 · coste: 0.7350854 $

Sábado aún no se puede reservar: la spec está escrita y la task espera tu aprobación, así que no he tocado código.

**Qué pasa hoy.** No es un bug. `isBookableDay` (`src/bookings.js:3-6`) rechaza sábado y domingo porque así lo exige la capacidad `bookings` («Solo se reserva de lunes a viernes»). Abrir el sábado cambia un requisito, así que va como task, no como patch.

**Lo que he dejado hecho.** La spec está en `.docs/sdd/specs/20260921-112440-task-0006-reservas-en-sabado/spec.md`. Abre con el bloque «Decisiones que he tomado yo — valida estas», que es lo único que hace falta leer para aprobar:
- Solo se abre el sábado; el domingo sigue cerrado.
- Cualquier profesor puede reservar en sábado, no solo los de cursos intensivos.
- Horario de 8:00 a 21:00, igual que entre semana. **Es una suposición**: secretaría debería confirmar la franja.
- El mensaje del domingo pasa a «Solo se reserva de lunes a sábado».
- La regla es permanente, sin flag ni configuración.

**Bloqueos de la sesión.**
- La rama `feature/0006` no está creada. `git switch -c` pedía aprobación y esta sesión no es interactiva. La spec queda sin commitear en el árbol de `develop`.
- El script `Get-NextSddId.ps1` tampoco se pudo ejecutar. El id 0006 lo calculé a mano con su misma lógica (máximo usado 0005, más 1). Conviene confirmarlo.
- No he despachado ningún revisor de la spec. La rúbrica propone uno; queda anotado en la spec.

**Descubierto y no tocado.**
- El código no valida la franja horaria; solo mira el día.
- `getDay()` depende de la zona horaria del servidor.
- `package.json` no declara `express` ni `better-sqlite3`, y no hay ningún test, aunque la constitution exige uno por regla y la task 0002 figura ✅. El plan tendrá que decidir cómo cubrir la regla.

**Para desbloquear.** Crea la rama con `git switch -c feature/0006` (la carpeta de spec te acompaña) y aprueba o corrige la spec. Con eso escribo el plan y empiezo por los tests.
