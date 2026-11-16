---
id: 20261116-155032-feature-0010-exportar-reservas-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Hasta ahora, el responsable de una sala no tiene forma de sacar sus reservas de la herramienta para cuadrarlas en su hoja. Con `salas exportar Norte` obtiene un CSV como `Norte;lun;10:00-12:00`, con `;` como separador para que Excel en castellano lo abra ya en columnas. Por dentro, es una función más en `src/app.js` que recorre las reservas de esa sala y las escribe en texto.

Validación: dev-lead — el resultado lo abre una persona en Excel en castellano, y solo viéndolo se comprueba que las columnas y los acentos salen bien.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: **no se ha podido despachar** — señales: capacidad nueva, contrato público (el formato del fichero lo consume Excel) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): no se ha lanzado — esta sesión no dispone de herramienta para despachar subagentes.
- Técnica (sonnet): no se ha lanzado, por la misma razón.
- Mínimo razonable: ninguna review — deja sin cubrir lo que yo no vea por haberla escrito. Mi relectura propia está en «Hallazgos de la review».

1. **Nombre del comando: `exportar <sala>`** — sigue el castellano de `libres`, `reservar`, `cancelar` y el verbo de la fila 0009 del roadmap.
2. **Salida por pantalla, sin fichero propio**: el comando imprime el CSV y se redirige (`salas exportar Norte > norte.csv`) — es lo que ya hace `run()` con todos los comandos; escribir ficheros añade rutas y errores que nadie ha pedido.
3. **Columnas: `sala;día;franja`, en ese orden y con ese literal en la cabecera** — son los tres datos que tiene hoy una reserva; qué necesita ver el responsable para cuadrar quedó pendiente («no sé»), y se ajustará cuando lo sepa.
4. **Qué reservas entran: todas las de la sala**, en el orden en que están guardadas — las reservas guardan solo el día de la semana, sin fecha, así que «las de la semana» y «todas» coinciden hoy.
5. **El texto empieza con BOM UTF-8 (`﻿`)** — sin él, Excel en castellano lee el fichero como ANSI y `día` sale como `dÃ­a`.
6. **Líneas separadas por `\n`, sin salto final** — `console.log` ya añade el último.
7. **Sala sin reservas: solo la cabecera.**
8. **Sala que no existe: `sala desconocida: <nombre>`, sin CSV. Sin sala: `uso: exportar <sala>`.** Textos míos.
9. **Capacidad nueva: `booking-export`** — nombre en inglés kebab-case; la spec la declara y el cierre la crea. `capabilities/` está vacío, no hay una de reservas donde encajarla.
10. **Enfoque: función dentro de `src/app.js`, frente a un módulo `src/csv.js` y a un `--salida <fichero>`** (ver Approach).
11. **Sin entrecomillado de celdas**: hoy las salas y franjas no llevan `;`, `"` ni saltos de línea.
12. **Delta probado sobre una copia de `.docs/sdd`**: `sdd capability merge` → 4 requisitos y 5 reglas añadidos a `booking-export.md`, salida 0; `sdd capability check --artifact` → «Capacidades válidas: 1».

### Hallazgos de la review

Sin review de subagentes. Relectura propia (no sustituye a una review independiente):

- **Aceptado** — el THEN del primer escenario no decía si el texto lleva BOM → lo incluye literal.
- **Aceptado** — la spec no decía qué pasa con una sala vacía ni con una desconocida → escenarios 2 y 3.
- **Abierto** — con `salas exportar Norte > norte.csv` en Windows PowerShell 5.1 la redirección reescribe la codificación (UTF-16) y el BOM no basta; en cmd, PowerShell 7 y Git Bash no se espera ese problema. No se ha probado en la máquina del responsable; se mide en la validación.

- Política de modelos: ninguno (sin revisores de spec) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Decisiones tomadas con el dev-lead

- Separador `;` — «Excel en castellano (1️⃣). El responsable de cada sala abre la hoja en Excel en castellano, así que el separador tiene que ser `;`.»
- Qué compara el responsable y qué necesita ver en cada fila — pendiente: «no sé».

## Intent

Hoy las reservas viven dentro del programa y el responsable de cada sala no puede llevárselas a su hoja de cálculo, donde cuadra cada lunes las de la semana. Quiero que pueda sacar las de su sala en un fichero que Excel en castellano abra directamente en columnas, con los acentos bien. Éxito: `salas exportar Norte > norte.csv` se abre en Excel con tres columnas y las reservas de Norte, sin pasos de importación. Fracaso, aunque técnicamente funcione: que Excel lo abra todo en una celda o con `dÃ­a`.

## Scope

- Entra: el comando `exportar <sala>` en `src/app.js` y sus tests en `test/app.test.js`.
- No entra: escribir a fichero, elegir otro separador, filtrar por día o fecha, exportar todas las salas a la vez, entrecomillado de celdas, columnas que el responsable aún no ha pedido.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | `git grep -niE "exportar\|csv"` fuera de `.docs/sdd/specs`: solo `ROADMAP.md:19` (fila 0009, `.ics`, otra cosa) | Scope: queda fuera |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv"`; la fila 0009 es otra exportación (calendario) y no se toca.

## Approach

- **A. Función en `src/app.js`** que filtra las reservas de la sala y construye el texto, y una rama más en `run()` — cuesta unas 15 líneas, se prueba con `run('exportar', ['Norte'])` como los tests actuales y respeta el «un solo fichero de entrada» de `operations.md`.
- B. Módulo `src/csv.js` — cuesta un fichero nuevo para una sola función de unas 10 líneas y rompe sin necesidad el «un solo fichero de entrada».
- C. `exportar <sala> --salida <fichero>` — cuesta rutas, sobrescritura y errores de disco; el responsable ya puede redirigir la salida.
- Elegido: **A** — es lo más pequeño que cumple el objetivo y encaja con cómo está hecho el proyecto.

`run('exportar', [sala])` devuelve el texto completo; la cabecera y las filas se unen con `;`, las líneas con `\n`.

## Dónde se prueba

- Exportar una sala con reservas, sin reservas, desconocida y sin sala: `run('exportar', …)` en `test/app.test.js`, como los tests actuales.
- Que Excel en castellano lo abre en columnas y con acentos: lo valida el dev-lead a mano, abriendo el fichero (no hay forma de automatizarlo aquí).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte tiene la reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN el texto es `﻿sala;día;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`, sin salto de línea final
- AND solo salen las reservas de Norte, en el orden en que están guardadas

#### ADDED — Exportar una sala sin reservas

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN el texto es `﻿sala;día;franja`, sin más líneas

#### ADDED — Exportar una sala que no existe

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar Este`
- THEN el texto es `sala desconocida: Este`, sin cabecera ni BOM

#### ADDED — Exportar sin indicar sala

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin argumentos
- THEN el texto es `uso: exportar <sala>`

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`; el CSV no se guarda, se imprime.
- **Idioma de los nombres**: castellano — comando `exportar`, cabecera `sala;día;franja`, mensajes `sala desconocida: <nombre>` y `uso: exportar <sala>`.
- **Límites**: no aplica.
- **Avisos**: `sala desconocida: <nombre>` si la sala no existe; `uso: exportar <sala>` si falta.
- **Regla ante conflicto**: no aplica.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
