---
id: 20261111-100000-proposal-0008-reports
proposal: 0008
title: Módulo de informes de ocupación
source: interview
created: 2026-11-11
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente quiere saber cuánto se usa cada sala, llevarse ese dato a Excel y que los responsables de las salas lo reciban cada semana sin pedirlo. Hoy la herramienta solo reserva, cancela y lista salas libres: no hay forma de medir la ocupación.

Las decisiones de detalle las tomó el desarrollador por delegación del usuario («decide tú los detalles»); cada una lleva su porqué en las reglas y en «Decisiones tomadas por delegación». Cualquiera se puede enmendar.

## Reglas de negocio

- **Ocupación de una sala** = horas reservadas ÷ horas disponibles, en porcentaje con un decimal. Horas disponibles: lunes a viernes, 08:00–20:00, es decir 60 h por sala y semana. Ejemplo: la sala Norte tiene una reserva `lun 10:00-12:00` → 2 h ÷ 60 h = 3,3 %; la sala Sur sin reservas → 0,0 %.
- **El informe es de la semana tipo**, porque una reserva guarda día de la semana y franja, no una fecha. Una reserva semanal (`--cada-semana`) cuenta una vez. Ejemplo: Norte con `lun 10:00-12:00` y `mié 10:00-12:00` → 4 h ÷ 60 h = 6,7 %.
- **Se muestra por sala y total.** El total es la suma de horas reservadas ÷ la suma de horas disponibles de todas las salas. Ejemplo: Norte 2 h, Sur 0 h → total 2 ÷ 120 = 1,7 %.
- **Excel = fichero `.xlsx` real**, no CSV, con una hoja «Ocupación» y las columnas `Sala`, `Horas reservadas`, `Horas disponibles`, `Ocupación (%)`, más una fila `Total`. Ejemplo: `salas informe --excel ocupacion.xlsx` con el caso anterior → filas `Norte | 2 | 60 | 3,3`, `Sur | 0 | 60 | 0,0`, `Total | 2 | 120 | 1,7`.
- **Responsable = un correo por sala**, configurado en `responsables.json` (`{"Norte": "ana@ejemplo.com"}`). Un responsable de varias salas recibe **un solo** correo con sus salas. Una sala sin responsable no envía nada y se avisa por salida de error. Ejemplo: Ana lleva Norte y Sur → un correo a ana@ejemplo.com con las dos líneas; Luis lleva solo Sur y Sur también está con Ana → cada uno recibe su correo con las salas que lleva.
- **El aviso semanal lo lanza el planificador del servidor**, no la aplicación: `salas aviso-semanal` envía y termina. Se programa los lunes a las 08:00 con el cron del servidor. Ejemplo: lunes 08:00 → el comando manda un correo por responsable con el informe de la semana tipo y el `.xlsx` adjunto; si falla el envío a uno, sigue con los demás y sale con código 1.

## Capacidades que toca

- `ocupacion` — nueva: cálculo y listado de la ocupación por sala.
- `exportacion-excel` — nueva: escritura del `.xlsx`.
- `aviso-semanal` — nueva: envío del informe a los responsables.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Informe de ocupación por sala (`salas informe`) | — |
| 2 | 0010 | Exportar el informe a Excel (`--excel <fichero>`) | 0009 |
| 3 | 0011 | Aviso semanal a los responsables (`salas aviso-semanal`) | 0009, 0010 y la fila 1 (avisos por correo) |

## Acta

No aplica: entrevista.

## Decisiones tomadas por delegación

- **`.xlsx` sin dependencias**: el stack es Node 22 sin dependencias externas (`tech-stack.md`). Se escribe a mano un `.xlsx` mínimo (zip sin compresión + XML) en lugar de añadir una librería. Si el cliente prefiere una librería, es una enmienda y un ADR, porque rompe el stack.
- **Horario 08:00–20:00, lunes a viernes**: no hay horario de apertura en el proyecto; es un supuesto razonable de coworking, a confirmar con el cliente. Cambiarlo es una enmienda.
- **Semana tipo, no fechas**: el modelo de reservas no guarda fechas; añadirlas es otro cambio y queda fuera.
- **Aviso fuera de la app**: la aplicación es una CLI sin proceso residente; programar la tarea es de `cron`, no del código.
- **El correo reutiliza el canal de la fila 1** («Avisos por correo antes de la reserva»), todavía sin hacer: la 0011 espera a que exista, para no construir dos canales. Si la fila 1 se descarta, la 0011 trae su propio envío y crece.
- **Fuera de alcance**: historial por fechas reales, gráficos, informes de otra cosa que no sea ocupación.

## Enmiendas

Ninguna.
