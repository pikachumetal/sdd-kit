---
id: 20261113-224725-feature-0010-exportar-reservas-csv
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

🦆 Hasta ahora no hay forma de sacar las reservas de una sala fuera de la herramienta. Con esto, `salas exportar Norte` imprime una tabla separada por `;` (la cabecera `sala;dia;franja` y una línea por reserva, p. ej. `Norte;lun;10:00-12:00`) que se guarda con `> norte.csv` y se abre en Excel en castellano con una columna por dato. Por dentro es un comando nuevo en `src/app.js` que filtra las reservas por sala y las une con `;`.

Validación: dev-lead — el resultado lo abre una persona en su hoja de cálculo; solo viéndolo en columnas se sabe que el separador es el bueno.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato del CSV lo consume la hoja de cálculo del responsable) · tamaño: ~20 líneas en 2 ficheros
- Dominio (sonnet, sin reglas de negocio ni roles): si el CSV da al responsable lo que necesita para cuadrar (sala, día, franja) y qué le falta (las reservas semanales de `--cada-semana`, decisión 8) (señal: capacidad nueva)
- Técnica (sonnet): si `;` sin comillas aguanta cualquier valor posible de `day` y `slot`, y qué le pasa a la salida al redirigirla desde PowerShell (decisión 2) (señal: contrato público)
- Mínimo razonable: un revisor con los siete puntos — deja sin mirar con ojos distintos la lente técnica del formato frente al dominio del cuadre

### Hallazgos de la review

> Esta sesión no tiene herramienta para lanzar subagentes: los siete puntos los pasó la propia sesión sobre la spec, no dos revisores independientes. Si prefieres revisores reales, dilo en el gate.

- **Aceptado** — Importante · Delta, «Exportar las reservas de una sala a CSV»: el AND «no sale ninguna reserva de otra sala» no se puede probar con ese escenario, porque solo hay una reserva guardada (la de Norte) → el filtro por sala se prueba en «Sala sin reservas» (Sur no contiene la reserva de Norte) y el AND se quita del primer escenario.
- **Aceptado** — Importante · decisión 2: en Windows PowerShell 5, `>` guarda en UTF-16 y la hoja puede no separar bien → queda dicho en la decisión 2 y la validación del dev-lead abre el fichero tal como lo guarda su consola.
- **Aceptado** — Menor · «Reglas de la capacidad»: el delta introduce avisos y nombres nuevos → se añade el bloque con las cinco reglas.

1. Nombre del comando: `exportar <sala>` — sigue el infinitivo de `reservar`, `cancelar`, `libres`, en castellano (constitución, art. 4).
2. La salida va por salida estándar, sin fichero — así vale igual si lo lanza el dev-lead o el responsable: `salas exportar Norte > norte.csv`. Todo el texto es ASCII, para no depender de la codificación; aun así, `>` de Windows PowerShell 5 guarda UTF-16, y con `cmd`, PowerShell 7 o `bash` guarda texto plano: la validación abre el fichero tal como lo guarde la consola del responsable.
3. Cabecera fija `sala;dia;franja`, en minúsculas y sin tilde — sin BOM, una `í` se puede leer mal; los nombres son los campos de la reserva (`room`, `day`, `slot`) en castellano.
4. Una línea por reserva, en el orden en que están guardadas, con los valores tal cual (`Norte;lun;10:00-12:00`); fin de línea `\n`, sin comillas ni escapes — los datos son fijos en el código y hoy no contienen `;` ni comillas. Si más adelante entran reservas con texto libre, hará falta escapar.
5. Sala existente sin reservas: salida con solo la cabecera — un CSV vacío que la hoja abre sin error.
6. Sala que no existe: `sala desconocida: <nombre>` — mensaje corto, como las respuestas de `run`.
7. Falta el nombre de la sala: `uso: exportar <sala>`.
8. Reservas semanales (`reservar --cada-semana`): no salen, porque hoy no se guardan (el comando solo responde «reserva semanal creada»). Si el responsable cuenta con ellas para cuadrar, el CSV se quedará corto.
9. Enfoque: función `exportCsv(room)` en `src/app.js`, junto a `freeRooms`, frente a un módulo `src/csv.js` aparte — el proyecto es un solo fichero de entrada (`operations.md`) y son ~10 líneas.
10. Capacidad nueva `booking-export` — nombre en inglés kebab-case; no existe ninguna capacidad donde encajar el comportamiento.
- Delta probado en una copia con `sdd capability merge`: sale 0, crea `booking-export.md` con 4 requisitos y las 5 reglas; `capabilities/` del repo no cambia.
- Pendiente de ti: quién ejecuta el comando los lunes, tú o el responsable (dijiste «no lo sé»); cuando lo sepas, decidirá si hace falta una opción de fichero de salida en otra feature.
- Política de modelos: revisores de la spec: ninguno disponible, la hace la sesión · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno

### Decisiones tomadas con el dev-lead

- Separador `;` — «Punto y coma (`;`), porque el Excel del responsable está en castellano.»
- Quién cuadra las reservas: el responsable de cada sala, los lunes, en su hoja de cálculo — «el responsable de cada sala es quien cuadra las reservas los lunes en su hoja de cálculo».

## Intent

Hoy las reservas viven solo dentro de la herramienta y el responsable de cada sala no puede cuadrarlas los lunes en su hoja de cálculo sin copiarlas a mano. Se quiere un comando que las saque ya listas para abrir. Éxito: `salas exportar Norte > norte.csv` abre en Excel en castellano con tres columnas (sala, dia, franja) y una fila por reserva de Norte, sin tocar nada. Fracaso aunque funcione: que la hoja abra todo en la columna A, o que salgan reservas de otra sala.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js` y sus tests en `test/app.test.js`.
- No entra: reservas semanales (no se guardan hoy); escapar comillas o `;` en los valores; fichero de salida o nombre de fichero; filtros por día; exportar todas las salas a la vez; el `.ics` del 0009; BOM o codificación especial.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|export" -- . ':!.docs/sdd/changes'` (solo la fila 0009 del `.ics`, otra cosa, y el `export function run` de `src/app.js`).

## Approach

- Función `exportCsv(room)` en `src/app.js` — ~10 líneas, se prueba por `run`, como el resto de comandos.
- Módulo `src/csv.js` aparte — más fichero del que el proyecto necesita; se descarta.
- Elegido: la función en `src/app.js` — es el único fichero de entrada (`operations.md`) y no hay nada que compartir.

Fija el cómo: `run('exportar', [sala])` devuelve el CSV como una sola cadena (cabecera + líneas unidas con `\n`, sin salto final); `console.log` pone el último salto de línea.

## Dónde se prueba

- Exportar una sala con reservas, sin reservas, desconocida y sin argumento: por `run('exportar', [...])`, como los tests actuales de `test/app.test.js`.
- Que Excel abre las columnas: lo valida el dev-lead a mano abriendo el fichero.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte con una reserva `lun` `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida es `sala;dia;franja` y, en otra línea, `Norte;lun;10:00-12:00`

#### ADDED — Sala sin reservas

- GIVEN la sala Sur, que no tiene reservas, y la sala Norte con una reserva `lun` `10:00-12:00`
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `sala;dia;franja`, sin la reserva de Norte

#### ADDED — Sala desconocida

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar Este`
- THEN la salida es `sala desconocida: Este`

#### ADDED — Falta la sala

- GIVEN las salas Norte y Sur
- WHEN se ejecuta `exportar` sin nombre de sala
- THEN la salida es `uso: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: no aplica — solo lee las reservas que ya guarda `src/app.js`.
- **Idioma de los nombres**: castellano, sin tildes en la cabecera (`sala;dia;franja`).
- **Límites**: no aplica.
- **Avisos**: `sala desconocida: <nombre>` y `uso: exportar <sala>`.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
