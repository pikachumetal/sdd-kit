---
id: 20261109-162253-feature-0013-export-csv
feature: 0013
title: Exportar las reservas a CSV
mode: full
profile: delegate
status: draft
created: 2026-11-09
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar las reservas a CSV

🦆 Hoy las reservas solo se ven una a una desde la terminal. Con esta feature, `exportar` escribe un fichero `reservas.csv` con una fila por reserva, p. ej. `Norte,lun,10:00-12:00,activa`, que se abre en una hoja de cálculo. Por dentro, una función pura arma el texto CSV y `run` lo guarda en disco.

Validación: dev-lead — es un fichero que una persona abre en su hoja de cálculo; hay que verlo.

## Capacidades

- Nuevas: `booking-export` — exportación de las reservas a un fichero CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de la spec: nivel mínimo (una sola capacidad, 3 tasks, sin migración ni interfaz gráfica); un solo revisor de la spec no aportaría más que el repaso de coherencia. Lo que queda sin cubrir: una lectura independiente de la spec.

1. Comando `exportar [ruta]`; sin ruta, escribe `reservas.csv` en el directorio actual — el roadmap dice «un fichero» pero no cómo se pide.
2. Si el fichero ya existe, se sobrescribe — es una exportación, no un histórico.
3. Columnas, en este orden: `sala,dia,franja,estado` — los cuatro datos de una reserva hoy.
4. Entran todas las reservas, también canceladas y anuladas — «una fila por reserva»; el `estado` las distingue.
5. Valores de `estado`: `activa`, `cancelada`, `anulada` — castellano de la interfaz (constitución 4) y términos de PRODUCT.md.
6. Primera fila de cabecera con los nombres de columna — una hoja de cálculo la agradece.
7. Formato: separador coma, saltos de línea `\n`, y comillas dobles alrededor de un valor que lleve coma, comilla o salto de línea (comilla interna duplicada) — CSV estándar (RFC 4180).
8. Respuesta de `exportar`: `exportadas 1 reservas en reservas.csv` (cuenta y ruta). Sin reservas: `exportadas 0 reservas en reservas.csv`, y el fichero lleva solo la cabecera — un literal sin plural, igual que `sin reserva Norte lun`.
9. Capacidad nueva `booking-export` — el proyecto no tiene ninguna; el nombre es un sustantivo del dominio.
10. Enfoque: función pura `toCsv(bookings)` + escritura en `run` (ver Approach).
11. Sin motivo de cancelación en el CSV — la 0010 todavía no existe; cuando se haga, añadirá su columna.
12. Si no se puede escribir el fichero (ruta inexistente), se deja pasar el error de Node: sin captura propia — herramienta personal, un solo usuario.
- Política de modelos: sin revisores de la spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

## Intent

Hoy `salas` guarda las reservas en memoria y solo permite reservar, liberar y cancelar de una en una. No hay forma de verlas todas juntas ni de llevarlas a una hoja de cálculo. Éxito: `exportar` produce un CSV con exactamente una fila por reserva existente (y la cabecera), que se abre sin retoques. Fracaso aunque «funcione»: perder las canceladas o anuladas, o que un valor con coma rompa las columnas.

## Scope

- Entra: comando `exportar [ruta]`, cabecera + una fila por reserva, escape de valores, mensaje de respuesta.
- No entra: importar CSV, filtrar por sala, día o estado, otros formatos (.ics es B1), el motivo de cancelación (0010), exportación programada.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0013 → nada la nombra fuera del roadmap (`git grep -n -i -E "export|csv|0013"` solo da la fila del roadmap y `B1`, que es otra cosa) | nada: comprobado con esa búsqueda

## Approach

- A. Función pura `toCsv(bookings)` que devuelve el texto, y `run('exportar')` que lo escribe con `node:fs` — una función nueva en `src/app.js`; el formato se prueba sin disco.
- B. Escribir a la salida estándar y que el usuario redirija (`salas exportar > x.csv`) — no hay fichero propio y el roadmap pide un fichero.
- C. Construir el CSV dentro de `run` de una vez — menos código, pero el escape solo se prueba tocando el disco.
- Elegido: A — el formato es la parte con reglas (escape, columnas, orden) y así se prueba aislada; el fichero queda en una línea.

La función recorre `bookings` en el orden en que están. El estado interno `active`, `cancelled`, `voided` se traduce a `activa`, `cancelada`, `anulada` al exportar.

## Dónde se prueba

- Formato del CSV (cabecera, filas, estados, escape): por `run('exportar', [ruta])` leyendo el fichero, como los tests de `cancel.test.js`, con un directorio temporal.
- Respuesta de `exportar`: por `run`, como `cancelar`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas

- GIVEN una reserva activa `Norte lun 10:00-12:00` y otra cancelada `Sur mar 09:00-10:00`
- WHEN se ejecuta `exportar` con la ruta `out.csv`
- THEN `out.csv` contiene `sala,dia,franja,estado`, `Norte,lun,10:00-12:00,activa` y `Sur,mar,09:00-10:00,cancelada`, una por línea
- AND la respuesta es `exportadas 2 reservas en out.csv`

#### ADDED — Fichero por defecto

- GIVEN cualquier conjunto de reservas
- WHEN se ejecuta `exportar` sin ruta
- THEN se escribe `reservas.csv` en el directorio actual, sobrescribiéndolo si existe

#### ADDED — Sin reservas

- GIVEN ninguna reserva
- WHEN se ejecuta `exportar` con la ruta `out.csv`
- THEN `out.csv` contiene solo `sala,dia,franja,estado`
- AND la respuesta es `exportadas 0 reservas en out.csv`

#### ADDED — Valores con separadores

- GIVEN una reserva de la sala `Norte, planta 2`
- WHEN se exporta
- THEN su fila es `"Norte, planta 2",lun,10:00-12:00,activa`, y una comilla interna sale duplicada (`"a ""b"""`)

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
