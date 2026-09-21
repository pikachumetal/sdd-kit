turns: 50 · coste: 0.8545856 $

He cerrado la task 0005 a nivel de documentación, pero **los cambios están sin commitear**. La sesión no me dejó ejecutar `git add`/`git commit` y no lo esquivé por otra herramienta. No hay merge, como pediste, y la rama sigue en `feature/0005` con solo el commit `base`.

## Lo que he hecho

- **Spec corregida a 12 h.** Decía 24 h, pero el código usa `REMINDER_HOURS_BEFORE = 12` y tu prueba (22:00 para las 10:00) lo confirma. Fue un cambio del dev-lead el 2026-09-19 que solo quedó en `tasks.md`.
- **`capabilities/bookings.md`.** Fusioné el recordatorio a 12 h y el email de caducidad. Quité la frase «ningún aviso sale del sistema por otro canal», que ya no es cierta.
- **`legacy.md`.** Retiré la sección «Recordatorios» (con 24 h), que ahora solo vive en `bookings`.
- **`tech-stack.md`.** Añadí el proceso periódico, el SMTP y los tiempos.
- **`walkthrough.md`.** Separa lo verificado por mí de lo que tú reportaste, y registra tu prueba local.
- **`tasks.md` y `roadmap.md`.** La 0005 queda en ✅ y creé la tabla de deuda técnica.
- **Pasos que no aplican.** Estimación, changelog y `env:clean` no existen en el proyecto. Tampoco hay `.claude/skills/`, así que no hay skills que revisar.

## Antes de mergear

1. **No hay tests.** `node --test` da 0 tests, aunque el plan los preveía y el Art. 3 de la constitution los exige. Bloquea el merge.
2. **`startScheduler` no se llama desde ningún sitio.** `src/app.js` no lo importa, y en lo commiteado nada arranca el proceso. Tu prueba funcionó, así que lo arrancaste de otra forma. Dime cómo, porque bloquea el merge hasta aclararlo.
3. **La firma de la spec (2026-09-18) es anterior al cambio a 12 h.** No la he rehecho ni inventado; queda anotado en el walkthrough.
4. **Otra deuda menor, ya en el roadmap.** Un fallo del SMTP se pierde sin aviso (y con Node 20 puede tumbar el proceso). El recordatorio no tiene cota inferior. El puerto SMTP está fijo y `package.json` no declara `nodemailer`, `express` ni `better-sqlite3`.

## Pendiente de tu decisión

- **Commit.** Ejecuta `git add -A` y luego un `git commit` con el mensaje que prefieras, por ejemplo `docs(sdd): cerrar task 0005 con walkthrough y docs vivos`. Después rellena el hash de la fila 3 de `tasks.md`, que dejé como «pendiente». Si me das permiso para commitear, lo hago yo.
- **Revisión de código.** La hice yo en línea, no con un subagente, porque tu regla global exige confirmar antes de usarlos. Si quieres una revisión independiente antes del merge, dime el modelo (sugiero Sonnet, son ~60 líneas) y la lanzo.
- **Ticket para el kit.** Puedo generarlo con `sdd-feedback`. El aprendizaje es que un cambio pedido tras aprobar la spec se quedó solo en `tasks.md` y la spec siguió diciendo 24 h.
