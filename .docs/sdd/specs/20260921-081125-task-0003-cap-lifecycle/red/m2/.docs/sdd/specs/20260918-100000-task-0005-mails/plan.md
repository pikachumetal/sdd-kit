---
id: 20260918-100000-task-0005-mails
task: 0005
title: Plan de implementación — Emails de recordatorio y de caducidad
spec: ./spec.md
status: approved
created: 2026-09-18
---

# Plan de implementación — Emails de recordatorio y de caducidad

## Tasks

### Task 1 — Proceso periódico y envío SMTP

`src/mailer.js` con `sendMail(to, subject, body)`; `src/scheduler.js` que cada minuto busca reservas próximas y caducadas.

### Task 2 — Recordatorio y caducidad

`src/reminders.js` y `src/expiry.js`, con sus tests.

### Task 3 — Documentación

Documentar en `tech-stack.md` el proceso periódico, el servidor SMTP y los tiempos: la caducidad a los 30 minutos y la antelación del recordatorio.
