---
id: 20261113-210915-feature-0010-exportar-reservas-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala para trabajar con ellas fuera de la herramienta. Con `exportar Norte` saldrá una tabla de texto: una cabecera `sala;dia;franja` y una línea por reserva, por ejemplo `Norte;lun;10:00-12:00`. El responsable de la sala abre ese fichero en su hoja de cálculo y cuadra las reservas los lunes. Tú rediriges la salida a un fichero con `>`. Si la sala no existe, sale un aviso por el canal de errores y el fichero queda vacío.

Validación: dev-lead — lo usa una persona con su hoja de cálculo: solo abriendo el fichero se ve si las columnas salen bien.

## Capacidades

- Nuevas: `booking-export` — sacar las reservas de una sala en un formato que abre una hoja de cálculo.
- Modificadas: ninguna.
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato del CSV lo consume la hoja de cálculo del responsable) · tamaño: ~25 líneas en 2 ficheros
- Dominio (sonnet): si el THEN de «Sala sin reservas» (solo la cabecera) sirve a quien cuadra los lunes (señal: capacidad nueva)
- Técnica (sonnet): si `;` sin BOM y la cabecera `sala;dia;franja` abren bien en Excel en español, Sheets y LibreOffice, y si los avisos por stderr con código 1 caben en `run()` sin romper `libres`, `reservar` y `cancelar` (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si la salida le sirve de verdad al responsable los lunes

**Estado de la review:** no se ha despachado ningún revisor: esta sesión no tiene herramienta para lanzar subagentes. El repaso de coherencia sí está hecho, por mí. Si quieres revisores, dilo en el gate y se lanzan desde una sesión que los permita.

1. **Todas las reservas de la sala, sin filtros** — los datos no tienen fecha, solo día de la semana y franja, y hay pocas reservas: el responsable filtra en su hoja. *(Dijiste «decide tú»; elegí esto.)*
2. **Nombre del comando: `exportar <sala>`** — nadie lo dijo; sigue el verbo en infinitivo de `libres`, `reservar` y `cancelar`.
3. **Separador `;`, cabecera `sala;dia;franja`, una línea por reserva en el orden en que están registradas** — Excel en español abre `;` en columnas; Sheets y LibreOffice lo detectan al importar. *(Dijiste «no sé» sobre la hoja de cálculo; decidí yo, sin comprobarlo en cada programa.)*
4. **Sin BOM y cabecera sin tilde (`dia`, no `día`)** — evita ensuciar el fichero y un problema de codificación en la cabecera. Coste: un nombre de sala con tilde podría verse mal en Excel; hoy las salas son `Norte` y `Sur`.
5. **Sala sin reservas: solo la cabecera** — la hoja queda con columnas y sin filas, y el responsable ve que no hay reservas, no que falló.
6. **Sala que no existe: `sala desconocida: Este`** por el canal de errores, código de salida 1 y salida estándar vacía — así `> norte.csv` no guarda el aviso dentro del fichero, donde parecería una reserva.
7. **Sin sala: `uso: exportar <sala>`**, mismo tratamiento que el punto 6.
8. **El nombre de la sala se compara tal cual** (`norte` no es `Norte`) — igual que ya hacen `libres` y las reservas.
9. **Enfoque: A, frente a B** (ver Approach).
10. **Validación: dev-lead** — ver arriba.
11. **Capacidad nueva `booking-export`** — nombre en inglés porque es un nombre de fichero; el proyecto no tiene `capabilities/`, esta sería la primera. La crea el cierre.
12. **Sin `§Frontend`** — es una herramienta de terminal, no cambia ninguna pantalla.
13. **Repaso de coherencia hecho** — `sdd capability merge` sobre una copia de `.docs/sdd` sin errores: `booking-export.md: añadido` ×4 requisitos y ×5 reglas; `capabilities/` del repo sin tocar. `git grep exportar` fuera de `.docs/` y `git grep 0010` en `ROADMAP.md`: sin resultados.

- Política de modelos: ningún revisor de spec despachado (ver arriba) · revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo

### Decisiones tomadas con el dev-lead

- Sale por la salida estándar y el dev-lead redirige a fichero — «1️⃣ Por la salida estándar: yo redirijo a fichero con `>`.»
- Carril feature, modo full — «Carril feature, modo full: añade un comando que exporte a CSV las reservas de una sala, porque el responsable de cada sala las cuadra los lunes en su hoja de cálculo.»

## Intent

Hoy la herramienta solo muestra salas libres y crea o cancela reservas: no hay forma de sacar las reservas de una sala. El responsable de cada sala las cuadra los lunes en una hoja de cálculo y ahora tendría que copiarlas a mano. Se quiere un comando que, dada una sala, saque sus reservas en CSV para abrirlas en la hoja. Éxito: `salas exportar Norte > norte.csv` produce un fichero que abre en columnas sin tocar nada. Fracaso, aunque funcione: que un aviso de error acabe dentro del fichero como si fuera una reserva.

## Scope

- Entra: el comando `exportar <sala>` con el formato de las decisiones 3 a 8; sus tests.
- Entra: avisos de error por el canal de errores con código de salida 1, solo para este comando.
- No entra: filtrar por día o franja; escribir el fichero directamente; BOM; fechas en las reservas; exportar todas las salas a la vez; guardar reservas en disco (siguen en memoria).
- No entra: cambiar la salida ni el código de salida de `libres`, `reservar` y `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada: el comando es nuevo y no cambia lo existente | `git grep -n "exportar"` fuera de `.docs/` → sin resultados | no aplica |

- Filas que implementa: nada: la 0010 se reservó para esta feature y no tiene fila en `ROADMAP.md`. La 0009 («Exportar reservas a calendario (.ics)») es otra idea y no se toca.

## Approach

- A: una función `exportCsv(sala)` en `src/app.js`, junto a `freeRooms`, y `run()` la llama para `exportar`. Los errores se señalan con una excepción que el arranque de `app.js` convierte en stderr + código 1. Cuesta: un caso nuevo en el arranque, que hoy solo hace `console.log`.
- B: un módulo `src/exportar.js` aparte. Cuesta un fichero por ~10 líneas, y `bookings` y `rooms` viven en `app.js` sin exportarse: habría que sacarlos o pasarlos.
- Elegido: A — el proyecto es de un solo fichero de entrada (`operations.md`), y B obliga a tocar cómo se comparten los datos sin que nada lo pida.

`run('exportar', ['Norte'])` devuelve el texto del CSV con saltos de línea `\n`, sin salto final: `console.log` lo añade. Los errores salen por el arranque, no por el valor devuelto.

## Dónde se prueba

- Formato del CSV y sala sin reservas: por `run()`, como los tests actuales de `app.test.js`.
- Sala desconocida y falta de sala, con stderr, código 1 y salida estándar vacía: ejecutando `node src/app.js exportar Este` como proceso, porque `run()` no lo ve.
- Apertura en columnas en la hoja de cálculo: la valida el dev-lead a mano, con `salas exportar Norte > norte.csv`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN una reserva `Norte`, `lun`, `10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida estándar es exactamente `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`
- AND el código de salida es 0

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` sin reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja`

#### ADDED — Sala desconocida

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Este`
- THEN por el canal de errores sale `sala desconocida: Este`, el código de salida es 1 y la salida estándar está vacía

#### ADDED — Falta la sala

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin sala
- THEN por el canal de errores sale `uso: exportar <sala>`, el código de salida es 1 y la salida estándar está vacía

#### Reglas de la capacidad — booking-export

- **Dónde viven los datos**: las reservas en memoria de `src/app.js`, como hoy
- **Idioma de los nombres**: castellano, sin tildes en la cabecera (`sala`, `dia`, `franja`)
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` y `uso: exportar <sala>`, por el canal de errores
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
