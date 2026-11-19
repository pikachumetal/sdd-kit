---
id: 20261119-160004-feature-0040-cancel-cutoff
feature: 0040
title: Una reserva de hoy ya no se cancela
mode: lite
profile: delegate
status: draft
created: 2026-11-19
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Una reserva de hoy ya no se cancela

🦆 Si hoy es lunes y escribes `cancelar Norte lun`, la herramienta responde `ya no se puede cancelar Norte lun` y la reserva sigue activa. Las reservas de días posteriores se cancelan como hasta ahora: `cancelar Norte mar` (siendo lunes) responde `cancelada Norte mar`. Por dentro, `cancelBooking` compara el día pedido con el de hoy, que sale del reloj y se puede inyectar en los tests.

Validación: agente — es un comando de terminal sin pantalla y lo que cambia lo miden los tests; la elección de `agente` es mía y va a ✋.

## Capacidades

- Nuevas: `booking-cancellation` — cancelar una reserva: cuándo se puede y qué responde.

## ✋ Decisiones que he tomado yo — valida estas

Review: ninguna, por orden del dev-lead («Sin review»). Queda sin cubrir lo que una lente independiente habría mirado: el reparto de días y la zona horaria.

1. Capacidad nueva `booking-cancellation` — el proyecto no tiene `capabilities/`; el comportamiento de cancelar no estaba escrito en ningún sitio y el delta necesita dónde vivir.
2. «Hoy» sale del reloj del sistema (`new Date().getDay()`), en hora local del servidor, traducido a un nombre de día; `cancelBooking` y `run` aceptan un `today` opcional para los tests — la entrevista no dijo de dónde sale «hoy».
3. **Pendiente**: nombres de los días. El código solo usa `lun` y `mar`; propongo `lun mar mie jue vie sab dom`, sin tildes, para teclear sin atajos.
4. Orden de comprobaciones: primero «sin reserva», después «ya no se puede». Si no hay reserva de hoy, `cancelar Sur lun` sigue diciendo `sin reserva Sur lun`: no se rechaza lo que no existe.
5. Literal del rechazo: `ya no se puede cancelar Norte lun`, con la sala y el día pedidos y sin punto final (generaliza la frase del dev-lead).
6. **Pendiente**: reservas de un día anterior a hoy dentro de la semana (hoy miércoles, `cancelar Norte lun`). El dev-lead habló de «hoy» y de «días posteriores». Propuesta provisional: se rechazan igual que las de hoy (ya pasó), pero hay que confirmarlo. Con el modelo actual (solo nombre de día, sin fecha) es la única lectura que no cancela una reunión pasada.
7. `anular` no cambia: el responsable de sala sigue pudiendo anular una reserva de hoy — la entrevista habló solo de cancelar, y `PRODUCT.md` las distingue.
8. Validación `agente`, no `dev-lead` — comando sin pantalla, comprobable con tests.
9. Enfoque: A (comparar el día en `cancelBooking`), frente a B (fecha completa en cada reserva) y C (filtrar en `run`) — ver Approach.
10. Tensión con `PRODUCT.md`: define Cancelación como «antes de 24 h»; esta regla es «no hoy». No lo cambio sin que lo diga el dev-lead; propongo actualizar la definición al cerrar (Términos y ADR).
11. Camino crítico: no se añade fila. El test existente `cancelar una reserva activa` (fila A) se mantiene, con `today` inyectado.
12. Sin ADR ni `§Frontend`: no cambia lo que se ve en una pantalla.
13. Repaso de coherencia: el delta fusionado sobre una copia de `.docs/sdd` da `booking-cancellation.md: añadido` ×3 requisitos y ×3 reglas, sin rechazos. `git grep` de `cancel` y `24 h`: solo `PRODUCT.md:13` (decisión 10) y `src/app.js`; `CHANGELOG.md:20` «Cancelar una reserva propia» es histórico y no cambia.
- Política de modelos: revisores de la spec: ninguno (orden del dev-lead) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Una reserva de hoy ya no se cancela — «una reserva de hoy ya no se cancela»
- Respuesta del rechazo — «`cancelar Norte lun`, siendo lunes, responde «ya no se puede cancelar Norte lun»»
- Días posteriores sin cambio — «las de días posteriores se cancelan como hoy»
- Sin review — «Sin review»

## Intent

Hoy `cancelar Norte lun` cancela siempre que haya reserva activa, también el mismo día de la reunión. Se quiere que una reserva de hoy ya no se pueda cancelar y que el mensaje lo diga. Éxito: con hoy = lunes, `cancelar Norte lun` devuelve `ya no se puede cancelar Norte lun` y la reserva sigue `active`; `cancelar Norte mar` sigue devolviendo `cancelada Norte mar`. Anti-objetivos: rechazar una cancelación de día posterior, o que el rechazo cambie el estado de la reserva.

El porqué no lo dijo la entrevista; mi suposición es evitar las cancelaciones a última hora, y va a ✋ (10).

## Scope

- Entra: `cancelBooking` rechaza la reserva de hoy con el literal acordado; «hoy» sale del reloj e inyectable en tests; tests del rechazo y de la cancelación de un día posterior.
- No entra: `anular`; una hora de corte; fechas completas en las reservas; avisos por correo; el motivo de la cancelación (fila 0010).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `cancelBooking` cancela siempre | `src/app.js` | delta, `ADDED` de la capacidad nueva |
| Definición «Cancelación … antes de 24 h» | `PRODUCT.md` (Terminology) | Términos y ADR, decisión 10 |

- Filas que implementa: nada: comprobado con `grep -n -i cancel ROADMAP.md` (no hay fila 0040; la 0010 «Motivo al cancelar» toca la misma función y no se cruza con esta).

## Approach

- A. Comparar el día en `cancelBooking` — un parámetro `today` con valor por defecto del reloj; función pura, se prueba sola. Cuesta: un parámetro más.
- B. Guardar la fecha completa de cada reserva — exacto entre semanas, pero reescribe el modelo (`day` es hoy `lun`/`mar`) y excede lo decidido.
- C. Filtrar en `run` antes de llamar — deja `cancelBooking`, que se exporta, sin la regla: quien la use directamente la salta.
- Elegido: A — la regla va donde está la acción y no toca los datos. Lo elijo yo (`delegate`).

Partes del cómo: `todayName(date = new Date())` devuelve el nombre del día; `cancelBooking(room, day, today = todayName())` busca la reserva y, si no existe, devuelve `sin reserva`; si `booking.day === today`, devuelve `ya no se puede cancelar ${room} ${day}` sin tocar `status`; si no, cancela. `run('cancelar', params, today)` pasa `today` opcional.

## Dónde se prueba

- Rechazo de hoy, cancelación de día posterior y sin reserva: unitario sobre `cancelBooking` con `today` inyectado, en `test/booking.unit.test.js`, como los unitarios actuales.
- Por la CLI: `test/cancel.test.js`; `cancelar una reserva activa` (camino crítico) pasa `today` distinto de `lun`, y se añade el rechazo por `run`, de feature, se borra al cerrar si el unitario ya lo ve.

## Términos y ADR

- Términos resueltos: Cancelación — la que hace el cliente de una reserva de un día posterior a hoy (sustituye «antes de 24 h»; a confirmar, decisión 10).
- ADR candidatas: ninguna.

## Delta de comportamiento

### Capacidad: `booking-cancellation`

#### ADDED — Cancelar una reserva de un día posterior a hoy

- GIVEN hoy es lunes y hay reserva activa Norte mar
- WHEN `cancelar Norte mar`
- THEN `cancelada Norte mar`
- AND la reserva queda cancelada

#### ADDED — Una reserva de hoy no se cancela

- GIVEN hoy es lunes y hay reserva activa Norte lun
- WHEN `cancelar Norte lun`
- THEN `ya no se puede cancelar Norte lun`
- AND la reserva sigue activa

#### ADDED — Cancelar sin reserva

- GIVEN hoy es lunes y no hay reserva activa Sur lun
- WHEN `cancelar Sur lun`
- THEN `sin reserva Sur lun`

#### Reglas de la capacidad — booking-cancellation

- **Dónde viven los datos**: en memoria (`bookings` de `src/app.js`)
- **Avisos**: `cancelada <sala> <día>` · `sin reserva <sala> <día>` · `ya no se puede cancelar <sala> <día>`
- **Regla ante conflicto**: la reserva de hoy no se cancela; la anula el responsable de sala (`anular`).

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,5h
- Estimación de implementación: 1h
- Base de la estimación: una función y sus tests, un fichero
- Confianza: alta

## Enmiendas

Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
