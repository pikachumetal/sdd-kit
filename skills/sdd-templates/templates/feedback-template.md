---
release: vX.Y.Z
title: Acta de release — vX.Y.Z
created: <YYYY-MM-DD>
source: <demo/reunión con fecha, o "sin sesión de feedback">
---

# Acta de release — vX.Y.Z (<YYYY-MM-DD>)

> Acta ÚNICA por release: inventario del feedback + triage + retro, en este orden. La fuente
> (transcripción, notas) se archiva en la misma carpeta y se enlaza aquí. La crea `sdd-end-release`;
> la lee `sdd-start-release` al abrir la siguiente. Borra los bloques de ayuda (`>`) al redactar.

Fuente: <sesión + fecha> ([archivada al lado](<fichero-fuente>)).

## 1. Inventario y triage

> COMPLETO: cada petición/comentario de la fuente, con referencia (minuto/sección). La columna
> Recomendación es tuya; la columna **Decisión es del usuario, item a item** — hasta entonces vale
> `pendiente confirmar`. Valores: `release-siguiente / backlog / trabajo-cliente / ya-cubierto /
> descartado`. La presión de calendario ("todo es importante") se registra como fila, no se obedece.
> Las peticiones de producto NUNCA van a la tabla de deuda técnica.

| # | Petición | Ref | Área | Recomendación | Decisión |
| --- | --- | --- | --- | --- | --- |

## 2. Cambios de requisito detectados

> Peticiones que contradicen un supuesto de `funcional/<capacidad>.md` o de `mission.md`. El documento lo
> actualiza su dueño; aquí solo se deja constancia. `_Ninguno_` si no hay.

## 3. Retro *(si existe `.docs/sdd/estimation-log.md`)*

> Sin evidencia no es retro, es opinión: los números salen del estimation-log.

- **Agregado de la release**: estimado <X>h · real <Y>h (ratio <Z>).
- **Comprobación de los action items de la release anterior**: estado real de cada uno
  (aplicado / pendiente / descartado, con evidencia). Un item arrastrado dos veces se escala:
  se prioriza o se descarta explícitamente, no se deja flotando.
- **Qué funcionó**: <…>
- **Qué corregir**: <…>
- **Action items nuevos** (verificables — con qué evidencia se comprobará cada uno en la próxima retro):
  - [A<n>] <acción> — <cómo se verifica>
