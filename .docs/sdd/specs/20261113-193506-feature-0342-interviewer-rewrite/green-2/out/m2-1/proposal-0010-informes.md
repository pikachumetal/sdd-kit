---
id: 20261114-120000-proposal-0010-informes
proposal: 0010
title: Módulo de informes
source: interview
created: 2026-11-14
---

# Propuesta — Módulo de informes

## Por qué

El cliente quiere saber cuánto se usa cada sala, poder llevarse ese dato a Excel y que los responsables de cada sala lo reciban sin pedirlo. Hoy `salas` solo reserva y consulta salas libres; no hay ninguna vista agregada. Los detalles los decidió el agente por delegación del usuario («decide tú los detalles»): están marcados como *decisión delegada* para que el cliente los pueda corregir con una enmienda.

## Reglas de negocio

- **Ocupación de una sala** = horas reservadas ÷ horas disponibles, en %, con un decimal. *Decisión delegada:* horas disponibles = lunes a viernes, 08:00–20:00 (12 h/día, 60 h/semana). Ejemplo: Norte con la reserva `lun 10:00-12:00` → 2 h de 60 h = 3,3 %; Sur sin reservas → 0,0 %.
- **Periodo del informe**: la semana (lunes a viernes). *Decisión delegada.* Las reservas hoy se guardan por día de la semana (`lun`), sin fecha, de modo que el informe usa la semana tipo; si la feature de ocupación descubre que hace falta fecha, lo para y lo consulta. Ejemplo: `salas informe ocupacion` → `Norte 3,3 %` y `Sur 0,0 %`, una línea por sala en el orden de `rooms`.
- **Exportación a Excel**: un fichero `.xlsx` con una hoja «Ocupación» y las columnas Sala, Horas reservadas, Horas disponibles, Ocupación (%), una fila por sala. *Decisión delegada.* Ejemplo: `salas informe ocupacion --excel ocupacion.xlsx` → fichero con las filas `Norte | 2 | 60 | 3,3` y `Sur | 0 | 60 | 0,0`. Si el fichero ya existe, se sobrescribe.
- **Aviso semanal**: cada lunes a las 08:00 cada responsable recibe por correo la ocupación de **su** sala de la semana anterior, no la de las demás. *Decisión delegada.* Ejemplo: responsable de Norte (`ana@ejemplo.com`) → un correo «Ocupación de Norte: 3,3 %»; no recibe nada de Sur.
- **Responsables**: se leen de un fichero de configuración `responsables.json`, `{ "Norte": "ana@ejemplo.com" }`. *Decisión delegada.* Una sala sin responsable no envía correo y deja una línea de aviso en la salida de error; no detiene el envío de las demás.
- **Quién dispara el aviso**: el comando `salas informe avisar`; la programación del lunes la hace el planificador del servidor (cron), no la herramienta. *Decisión delegada:* el proyecto es una CLI sin proceso residente. Ejemplo: `0 8 * * 1 salas informe avisar`.

## Capacidades que toca

El proyecto aún no tiene capacidades documentadas (`capabilities/` vacío); las features declararán las nuevas, nombradas con la regla 1 de `capability-template.md`.

- `informe-ocupacion` — cálculo y salida por pantalla (nueva)
- `informe-excel` — exportación a `.xlsx` (nueva)
- `aviso-semanal` — correo a responsables (nueva; usa el envío de `src/correo.js` de la 0008)

## Reparto

| Orden | Id | Feature | Tras |
| --- | --- | --- | --- |
| 1 | 0011 | Informe de ocupación por sala | — |
| 2 | 0012 | Exportar el informe a Excel | 0011 |
| 3 | 0013 | Aviso semanal a los responsables | 0011, 0012, 0008 |

## Acta

No aplica: entrevista.

## Enmiendas

Ninguna.
