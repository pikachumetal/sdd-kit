---
id: 20261110-222556-proposal-0008-informes
proposal: 0008
title: Módulo de informes de ocupación
source: interview
created: 2026-11-10
---

# Propuesta — Módulo de informes de ocupación

## Por qué

El cliente quiere saber cuánto se usa cada sala, poder llevarse ese dato a Excel y que los responsables de las salas reciban cada semana un aviso con él. Hoy `salas` solo reserva, cancela y lista salas libres; no hay ningún dato agregado, las reservas viven en memoria (se pierden al acabar el proceso) y no existe el concepto de responsable de sala. El encargo llegó con «decide tú los detalles»: las decisiones de abajo las tomó la sesión de planificación (perfil `delegate`) y están marcadas como tales para que el cliente las corrija con una enmienda.

## Reglas de negocio

- **Ocupación de una sala** = horas reservadas ÷ horas disponibles × 100, con un decimal y coma decimal. Horas disponibles = lunes a viernes, 08:00-20:00 = 60 h por sala y semana (decisión de planificación). Ejemplo: Norte con solo `lun 10:00-12:00` → 2 ÷ 60 = `3,3 %`; Sur sin reservas → `0,0 %`.
- **Reserva semanal** (`--cada-semana`) cuenta una vez por cada día en que se repite; una reserva suelta cuenta una vez. Ejemplo: Norte con `lun 10:00-12:00` y `mié 10:00-12:00` → 4 ÷ 60 = `6,7 %`.
- **Las reservas guardan día de la semana, no fecha** (así es el modelo hoy), así que el informe es el de la *semana tipo*: no hay informe «de la semana 12». Si el cliente quiere histórico por fechas, es una enmienda que añade fechas a las reservas.
- **Persistencia**: las reservas se guardan en un JSON (`salas-datos.json` en el directorio actual, o la ruta de la variable `SALAS_DATOS`). Ejemplo: `salas reservar Norte lun 10:00-12:00` en un proceso, y `salas libres 10:00-12:00` en otro después → Norte no sale como libre.
- **Informe por pantalla**: `salas informe` imprime una línea por sala, en orden de alta, `<sala> <porcentaje>`. Ejemplo (Norte 3,3 %, Sur 0,0 %): `Norte 3,3 %` / `Sur 0,0 %`.
- **Excel**: `salas informe --excel ocupacion.xlsx` escribe un `.xlsx` real, sin dependencias (el stack no admite paquetes externos: se genera con `node:zlib` y un empaquetador zip propio), con una hoja «Ocupación» y las columnas `Sala | Horas reservadas | Horas disponibles | Ocupación (%)`; la ocupación va como número (`3.3`), no como texto. Si el fichero ya existe no se sobrescribe: sale con error `el fichero ya existe` y código 1, salvo con `--forzar`. Ejemplo: segunda ejecución de `--excel ocupacion.xlsx` sin `--forzar` → error, el fichero original queda intacto.
- **Responsables**: se declaran en `salas-responsables.json`, `{ "Norte": "ana@cowork.es", "Sur": "luis@cowork.es" }` (una persona por sala; el mismo correo puede repetirse en varias salas). Cada responsable recibe **solo** las salas suyas. Ejemplo: aviso con esos datos → Ana recibe `Norte 3,3 %`, Luis recibe `Sur 0,0 %`.
- **Sala sin responsable**: no se envía nada para ella y el comando lo avisa en su salida. Ejemplo: `Sur` ausente del JSON → salida `aviso: la sala Sur no tiene responsable`, Ana recibe igualmente lo de Norte.
- **Aviso semanal** = `salas aviso-semanal`. **No se programa a sí mismo**: `salas` es una herramienta de línea de comandos sin proceso residente, así que el envío semanal lo dispara el planificador del servidor (cron o temporizador de systemd, p. ej. lunes 08:00) (decisión de planificación). El comando es idempotente por semana ISO: lo ejecutado dos veces en la misma semana no reenvía. Ejemplo: lunes 2026-11-16 08:00 envía; lunes 2026-11-16 09:00 sale con `aviso ya enviado esta semana (2026-W47)` y no envía nada.
- **El canal de correo es el de la fila 1** («Avisos por correo antes de la reserva»): el aviso semanal lo reutiliza, no construye uno propio. Por eso el aviso va después de la fila 1.

## Capacidades que toca

- `reservas` — dejan de vivir en memoria: se leen y se escriben en el JSON.
- `informe-ocupacion` — nueva: el cálculo y la salida por pantalla.
- `exportacion-excel` — nueva: el `.xlsx` del informe.
- `aviso-semanal` — nueva: responsables, envío y control de semana ya enviada.

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0009 | Persistir las reservas en un fichero JSON | — |
| 2 | 0010 | Informe de ocupación por sala (`salas informe`) | 0009 |
| 3 | 0011 | Exportar el informe a Excel (`--excel`) | 0010 |
| 4 | 0012 | Aviso semanal a los responsables de sala | 0010, 1 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna.
