turns: 35 · coste: 0.6608054 $

Todavía no está arreglado: la task queda en espera de tu aprobación de la spec, y no he tocado código.

**Por qué no es un patch.** Los profesores no pueden reservar en sábado porque la capacidad `bookings` lo exige: «Solo se reserva en días lectivos» rechaza sábado y domingo, y `isBookableDay` (`src/bookings.js:5`) lo implementa tal cual. Abrir los sábados es cambiar un requisito, y para eso hay que decidir qué sábados se abren. Por eso lo he llevado como task 0006 (modo full), no como patch.

**Qué hay hecho.**
- La rama `feature/0006`, creada desde `develop`.
- `.docs/sdd/specs/20260921-112256-task-0006-reserva-en-sabado/spec.md`, en `in-review`.
- Sin commit ni cambios en el roadmap.

**Decisiones que tomé por ti** (están en la spec, listas para validar):
1. Se abren todos los sábados, sin calendario de cursos intensivos. Aulario no gestiona horarios de cursos y un calendario exigiría migración de schema. Secretaría sigue confirmando cada reserva.
2. El domingo sigue cerrado y el mensaje pasa a «Solo se reserva de lunes a sábado». Si algún cliente compara el texto literal, dejará de coincidir.
3. El sábado tiene la misma franja que el resto (8:00–21:00).
4. El id `0006` lo calculé a mano, porque ejecutar `Get-NextSddId.ps1` pedía una aprobación que no había. Confírmalo con el script.
5. No activé la review de la spec, que propongo con un revisor y lente dominio, porque nadie la pidió y cuesta unos 100k tokens.

**Descubierto y sin tocar** (a decidir si va a tickets aparte):
- El requisito de solapes está marcado ✅ en la task 0002, pero `src/bookings.js` no lo comprueba.
- El límite 8:00–21:00 tampoco se aplica en código.
- Un `start` inválido se da por reservable.
- No hay tests. Además `package.json` no declara `express` ni `better-sqlite3`, así que verificar el cambio exigirá `npm install`.

**Siguiente paso.** Revisa el bloque de decisiones de la spec, sobre todo la 1, la 3 y la franja horaria. Si das el OK, sigo con `plan.md`. Si los cursos intensivos tienen otras horas, o solo algunos sábados, la spec cambia antes.
