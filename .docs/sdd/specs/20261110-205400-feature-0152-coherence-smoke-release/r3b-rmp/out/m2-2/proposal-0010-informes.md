---
id: 20261112-105408-proposal-0010-informes
proposal: 0010
title: Módulo de informes de ocupación
source: interview
created: 2026-11-12
---

# Propuesta — Módulo de informes de ocupación

## Por qué

Hoy no hay forma de saber cuánto se usa cada sala. Se pide un informe de ocupación por sala, poder llevarlo a Excel y que cada semana llegue por correo a los responsables de las salas. El usuario delegó los detalles («decide tú»): las decisiones de abajo son del agente y quedan abiertas a enmienda.

## Reglas de negocio

- Horario útil: de 08:00 a 20:00, 12 horas al día, lunes a viernes (60 h por semana y sala). Ejemplo: sala Norte con una reserva lun 10:00-12:00 en la semana del 2026-11-09 → 2 h de 60 h = 3,3 % de ocupación.
- Ocupación = horas reservadas dentro del horario útil / horas útiles del periodo, con un decimal. Ejemplo: sala Sur sin reservas en esa semana → 0,0 %; una reserva 19:00-21:00 cuenta 1 h (se recorta al horario útil).
- El periodo por defecto es la semana natural (lunes a domingo) y se puede indicar otro con `--desde` y `--hasta`. Ejemplo: `informe --desde 2026-11-09 --hasta 2026-11-13` → 5 días, 60 h útiles por sala.
- La reserva semanal (`--cada-semana`) cuenta en cada semana en que se repite, no solo en la primera. Ejemplo: Norte lun 10:00-12:00 semanal, periodo de 2 semanas → 4 h de 120 h = 3,3 %.
- La exportación a Excel es un CSV (separador `;`, UTF-8 con BOM, decimal con coma) que Excel abre con doble clic en configuración regional española, porque el proyecto no admite dependencias externas (operations.md). Ejemplo: fila `Norte;2,0;60,0;3,3` (sala; horas reservadas; horas útiles; % de ocupación). Un .xlsx real queda fuera hasta que el usuario lo pida.
- Cada sala tiene uno o varios responsables, con su correo, en `responsables.json` en la raíz. Ejemplo: `{"Norte": ["ana@ejemplo.com"]}` → Ana recibe el informe de Norte. Una sala sin responsables no genera aviso y se lista en la salida.
- El aviso semanal se envía los lunes con el informe de la semana anterior, solo de las salas de cada responsable. Ejemplo: lunes 2026-11-16 → Ana recibe Norte del 2026-11-09 al 2026-11-15. La programación la hace el cron del servidor llamando a `informe --enviar-semanal`; la app no lleva planificador propio.
- Reenviar el mismo aviso no duplica: no se envía otra vez a un responsable si ya se le envió esa semana. Ejemplo: segunda ejecución el lunes 2026-11-16 → «ya enviado» y ningún correo.

## Capacidades que toca

- `informe-ocupacion` — nueva: cálculo de ocupación por sala y periodo.
- `exportacion-informe` — nueva: salida CSV del informe.
- `aviso-semanal` — nueva: envío por correo a responsables; usa el envío de correo de la 0008.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel (CSV) | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0011, 0012, 0008 |

## Acta

No aplica: entrevista

## Enmiendas

