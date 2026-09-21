turns: 29 · coste: 0.7956232 $

Task 0005 cerrada. La rama `feature/0005` queda sin mergear, sin push y sin PR, con el árbol limpio y dos commits nuevos sobre `develop` (`c040dd7`, `c821252`).

Sin un cambio en la spec, el merge sigue bloqueado por el artículo 3 de la constitución: no hay ningún test. `npm test` da 0 tests y no existe `node_modules`, así que no arranqué la app. Decide si escribes los tests antes de mergear o das una excepción explícita.

**Qué hice**
- **Walkthrough:** lo escribí separando lo que probaste tú (12 h antes y caducidad a los 30 min) de lo que verifiqué leyendo el código. Puse «Validado por el usuario», no «por el dev-lead», porque no sé si lo eres.
- **`bookings.md`:** fusioné el delta de la spec. El requisito de caducidad se sustituye entero y la regla «Avisos» ya no dice que ningún aviso sale del sistema.
- **`legacy.md`:** retiré la sección «Recordatorios».
- **`tech-stack.md`:** documenté dónde están el scheduler, el SMTP y las constantes, sin copiar valores.
- **`tasks.md` y `roadmap.md`:** puse los hashes reales, marqué 0005 como ✅ y añadí una tabla de deuda técnica.
- **Omitidos:** el changelog y la estimación, porque el proyecto no tiene `changelog.md` ni `estimation.md`. Tampoco hay `.claude/skills/`, y no vi patrón que justifique crear una skill.

**Qué debes mirar**
1. **12 h contra 24 h:** la spec aprobada dice 24 h, pero el código y tu prueba usan 12 h por una nota del dev-lead en `tasks.md`. Dejé la spec tal como se aprobó y puse 12 h en `bookings.md`. El dev-lead debería confirmarlo.
2. **Falta el enlace para cancelar:** la spec lo pide en el recordatorio y `src/reminders.js:9` solo incluye aula y hora. Ninguno de tus dos casos lo cubría.
3. **`sendMail` sin `await` ni `catch`:** si el SMTP cae, en Node 20 el rechazo tumba el proceso, que comparte con la API. Además el recordatorio se marca como enviado igualmente.
4. **Recordatorios sin cota inferior:** `sendDueReminders` no mira `start > now`, así que una reserva confirmada ya empezada y sin recordar recibiría un «recordatorio».
5. **Esquema fuera del repo:** no está el esquema de `bookings` y `POST /bookings` no rellena `teacher_email`, así que no pude comprobarlo.

Los puntos 2 a 5 están como filas de deuda en el roadmap.

**Sin revisor independiente:** no lancé subagente revisor porque tu regla pide confirmar modelo antes de paralelizar. Revisé yo el código en línea. Si quieres revisión independiente, dime y te propongo sonnet.

**Ticket para el kit:** puedo generarlo con `sdd-feedback`. La lección es que un cambio de valor pedido en plena implementación solo quedó en `tasks.md` y la spec aprobada se quedó desfasada.
