---
id: 20261113-154419-feature-0010-exportar-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-13
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `exportar Norte > norte.csv` sacas a un fichero las reservas de la sala Norte, con una fila por reserva (`Norte;lun;10:00-12:00`), y el responsable lo abre en su Excel en castellano con una columna para la sala, otra para el día y otra para la franja. Por dentro es un comando nuevo en `src/app.js` que recorre las reservas de esa sala y las une con `;`.

Validación: dev-lead — lo abre una persona en su hoja de cálculo, y que las columnas salgan bien separadas solo se ve abriéndolo.

## Capacidades

- Nuevas: `bookings-export` — exportar a CSV las reservas de una sala

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: **no se ha despachado ningún revisor** — señales: contrato público (el CSV lo consume una hoja de cálculo), capacidad nueva · tamaño: ~25 líneas en 2 ficheros
- Dominio: habría mirado si faltan casos de la sala (sin reservas, inexistente, sin argumento) (señal: capacidad nueva)
- Técnica: habría mirado si el formato abre bien en Excel en castellano (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin cubrir lo que yo no veo en mi propio texto. Esta sesión no tiene herramienta para lanzar subagentes, así que hago yo la revisión y lo dejo dicho aquí.

1. Enfoque: un comando `exportar <sala>` que imprime el CSV por pantalla, frente a escribir un fichero con ruta propia o enviarlo por correo (ver Approach) — encaja con cómo funciona el resto de la herramienta.
2. Nombre del comando: `exportar` — castellano, como `libres`, `reservar` y `cancelar` (constitución, art. 4).
3. Nombre de la capacidad: `bookings-export` (el nombre del fichero va en inglés).
4. Columnas: `sala;dia;franja`, en ese orden, una fila por reserva — son los tres datos que tiene hoy cada reserva.
5. La cabecera lleva `dia` sin tilde — un Excel en castellano abre un CSV UTF-8 sin marca de orden de bytes (BOM) y estropea los acentos; sin tilde se evita sin tocar la codificación.
6. Orden de las filas: el de alta de la reserva — hoy no hay fecha con la que ordenar.
7. Fin de línea `\n`, y sin comillas — los valores (`Norte`, `lun`, `10:00-12:00`) no contienen `;` ni comillas.
8. El nombre de la sala se compara tal cual, con mayúsculas (`Norte`, no `norte`) — igual que `reservar`.
9. Sala sin reservas: sale solo la cabecera.
10. Sala inexistente: `sala desconocida: Oeste`, sin CSV.
11. Sin sala (`exportar` a secas): `falta la sala: exportar <sala>`.
12. Se exportan todas las reservas de la sala: hoy no tienen fecha, solo día de la semana, así que no hay nada por lo que filtrar.
13. Las reglas de la capacidad (datos, idioma, límites, avisos, conflicto) las fijo yo porque la constitución no tiene «Reglas de producto».
14. Quién es el «responsable de cada sala» no lo sé: `PRODUCT.md` dice que solo la usas tú. No cambia el diseño (el CSV lo recoges tú y se lo pasas), pero no he decidido nada por ellos.
- Delta probado en una copia: `sdd capability merge` añade los 4 requisitos y las 5 reglas a `bookings-export.md`, y `sdd capability check` da «Capacidades válidas: 1».
- Política de modelos (solo en `delegate`): sin revisores de la spec (sin herramienta de subagentes) · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Separador `;` — «La opción 1️⃣, el punto y coma (`;`), porque el Excel del responsable está en castellano.»
- Entrega por pantalla, redirigida a un fichero, y el contenido de las columnas: delegado — «No sé, decide tú.»

## Intent

Hoy no hay forma de sacar las reservas de una sala de la herramienta: el responsable de cada sala las cuadra los lunes en su hoja de cálculo y tiene que copiarlas a mano. Con `exportar <sala>` el CSV sale listo para abrirlo en un Excel en castellano. Éxito: `exportar Norte > norte.csv` produce un fichero que se abre con tres columnas (`sala`, `dia`, `franja`) y una fila por reserva, sin pegar todo en una sola columna. Fracasaría, aunque «funcionase», si el Excel del responsable mostrase todo en una columna o con la tilde rota.

## Scope

- Entra: el comando `exportar <sala>`, sus tests y una línea en el `README.md` que lo nombre.
- No entra: exportar todas las salas a la vez, filtrar por día o franja, escribir el fichero desde la herramienta, enviarlo por correo (la 0008 es de avisos, otra cosa) y el formato `.ics` (la 0009).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: la feature no tiene fila en `ROADMAP.md` y `git grep -n "exportar" -- . ":!.docs/sdd/changes"` no da resultados.

## Approach

- A. Imprimir el CSV por pantalla y redirigirlo con `>` — una función pura que devuelve el texto; el resto de comandos ya devuelve un texto que `console.log` imprime. Cuesta que en PowerShell `>` guarda el fichero en UTF-16 (`Out-File -Encoding utf8` lo evita); por eso la cabecera va sin tildes.
- B. Escribir el fichero desde la herramienta (`exportar Norte norte.csv`) — hay que decidir ruta, qué pasa si existe y errores de disco: más superficie para una necesidad que `>` cubre.
- C. Enviarlo por correo — lo pide la 0008 (avisos), que aún no existe.
- Elegido: A — es lo más pequeño y se parece a lo que ya hace la herramienta.

`run('exportar', [sala])` devuelve el texto: la cabecera `sala;dia;franja` y, por cada reserva de esa sala, `<sala>;<día>;<franja>`, unidas con `\n` y sin salto de línea final extra (el `console.log` ya pone uno).

## Dónde se prueba

- Todos los comportamientos: llamando a `run('exportar', […])` en `test/app.test.js`, como los tests actuales de `libres`, `reservar` y `cancelar`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con una reserva el lunes de 10:00-12:00
- WHEN se ejecuta `exportar Norte`
- THEN sale `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`

#### ADDED — Sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala inexistente

- GIVEN que no hay ninguna sala Oeste
- WHEN se ejecuta `exportar Oeste`
- THEN sale `sala desconocida: Oeste` y no sale ningún CSV

#### ADDED — Falta la sala

- GIVEN cualquier estado de las reservas
- WHEN se ejecuta `exportar` sin sala
- THEN sale `falta la sala: exportar <sala>` y no sale ningún CSV

#### Reglas de la capacidad — bookings-export

- **Dónde viven los datos**: en memoria, en `src/app.js` (`bookings`); no se escribe nada en disco.
- **Idioma de los nombres**: castellano (`exportar`, `sala`, `franja`); la cabecera `dia` va sin tilde.
- **Límites**: no aplica.
- **Avisos**: `sala desconocida: <sala>` · `falta la sala: exportar <sala>`.
- **Regla ante conflicto**: no aplica.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
