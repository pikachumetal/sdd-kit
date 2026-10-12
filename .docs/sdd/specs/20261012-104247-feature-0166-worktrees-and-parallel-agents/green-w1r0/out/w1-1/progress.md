# SDD ledger — plan: .docs/sdd/specs/20261008-100000-feature-0010-cancel-reason/plan.md

Setup: worktree existente en feature/0010-cancel-reason (base 14013e1); env:setup hecho (.sdd-env.json active); baseline `node --test` 4/4 verde.
Setup: Ejecución Native; sdd-tdd cargada; decálogo de calidad leído.
Setup: Ruling: efecto del revisor final — esta sesión no tiene herramienta de subagentes ni el tipo sdd-kit:effort-high — la revisión final será self-review y se dirá al usuario — coste si me equivoco: sin contexto fresco, puntos ciegos del mismo autor.

## Pre-flight scan

| Par / task | Qué encontré | Ruling |
| --- | --- | --- |
| T1 ↔ T2 (`src/app.js`, `test/cancel.test.js`) | T1 produce el motivo guardado en la reserva cancelada (`status: 'cancelled'` + motivo); T2 lo consume en `canceladas`. Misma interfaz: el campo del motivo lo fija T1 | T1 fija `booking.reason`; T2 lo lee. Sin ruling pendiente |
| T1 vs test existente | `cancelar una reserva activa` espera `cancelada Norte lun` sin motivo; el delta pide «cancelada Norte lun (sala ocupada)». La spec no dice qué responde `cancelar` SIN `--motivo` | PENDIENTE del usuario: cambia la salida observable (freno de alcance). No lo decido yo |
| T1 (orden de errores) | Spec no fija qué gana si la reserva no existe Y el motivo es inválido | Propuesta: motivo inválido antes que «sin reserva» (valida entrada primero). Registrar al empezar T1 |
| T2 (`canceladas`) | Spec no dice nada de lista vacía ni de reservas `voided` (anular existe) | Solo `status === 'cancelled'` (Approach); vacía → cadena vacía. Ruling al empezar T2 |
| T2 vs roadmap 0012/0014 | 0014 guarda el motivo en el almacén; 0012 hace `informe`. La spec lo guarda solo en memoria con la reserva | Dentro de scope: solo en memoria, sin persistencia |
| Plan vs plan-lo-que-obliga | Las dos tasks tienen «Verificación» `node --test test/cancel.test.js` (el gate completo va al final). Sin tasks.md en la carpeta de la feature | `tasks.md` se crea en el primer hito (plan lo declara registro vivo) |
| Spec (documento) | «Decisiones que he tomado yo» numera 1 y 3: falta la 2 | Minor, no bloquea; avisar al dev-lead |
| Base | `develop` existe local, sin remoto | El chequeo de base (roadmap + ficheros) va antes de la Task 1 |
