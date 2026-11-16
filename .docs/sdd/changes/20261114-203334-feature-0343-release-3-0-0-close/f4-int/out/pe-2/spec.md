---
id: 20261116-154116-feature-0010-exportar-reservas-csv
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

🦆 Hoy no hay forma de sacar las reservas de una sala a una hoja de cálculo. Con esto, `exportar Norte` imprime una tabla en CSV con una fila por reserva (`Norte;lun;10:00-12:00`), separada por `;` para que una hoja en castellano la abra ya en columnas. Se guarda con `exportar Norte > norte.csv`. El comando es una función nueva que lee las reservas que ya existen y las escribe como texto; no cambia ni toca ningún otro comando.

Validación: dev-lead — es lo que abre una persona en su hoja de cálculo; solo ella ve si las columnas salen bien.

## Capacidades

- Nuevas: `booking-export` — exportar a CSV las reservas de una sala.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores (dominio y técnica) — señales: capacidad nueva (`booking-export`), contrato público (formato de fichero que consume una hoja de cálculo) · tamaño: ~30 líneas en 2 ficheros
- Dominio (sonnet): si las filas y el separador de «Exportar las reservas de una sala a CSV» dejan la hoja utilizable, y qué pasa con una sala vacía o inexistente (señal: contrato público)
- Técnica (sonnet): si `toCsv` y el entrecomillado de «Campos con separador o comillas» caben en `src/app.js` sin romper `run` (señal: capacidad nueva)
- Mínimo razonable: solo técnica — deja sin mirar si el CSV es cómodo de abrir para quien cuadra las reservas
- **No se han despachado revisores**: esta sesión no tiene herramienta para lanzar subagentes. La revisión de abajo la he hecho yo con los siete puntos del rubric; no es una revisión independiente.

Fusión del delta en una copia temporal de `.docs/sdd`: `booking-export.md: añadido` ×5 y `Capacidades válidas: 1`; el `capabilities/` del repo no cambia.

1. Nombre del comando: `exportar <sala>` — sigue el estilo de los existentes (`libres`, `reservar`, `cancelar`), en castellano (Art. IV).
2. Sale por la salida estándar, no a un fichero: se guarda con `> norte.csv` del terminal. Es lo que ya hace el resto de comandos y evita decidir una ruta y qué pasa si el fichero existe.
3. Columnas y cabecera: `sala;dia;franja`, con cabecera, una fila por reserva, en el orden en que están registradas. `dia` va sin tilde por la misma razón que no hay BOM (decisión 4): una hoja podría mostrar mal la `í`. Son los únicos datos que tiene una reserva hoy (no hay fecha concreta, solo `day` y `slot`). La columna `sala` va aunque sea la misma en todas las filas, para poder juntar los CSV de varias salas en una hoja.
4. Fin de línea `\n`, sin `\n` final (`console.log` ya lo añade), y sin BOM UTF-8: los nombres de sala de hoy (`Norte`, `Sur`) son ASCII. Si algún día hay una sala con tilde, una hoja en castellano podría mostrarla mal sin BOM y habrá que revisarlo.
5. Entrecomillado: un campo con `;`, `"` o salto de línea sale entre comillas dobles, con las comillas internas duplicadas. La franja es texto libre (ver deuda «Sin validación del formato de franja horaria»), así que un `;` dentro rompería las columnas.
6. El nombre de sala se compara exacto y con mayúsculas, igual que `libres` (`b.room === room`): `norte` no es `Norte`.
7. Sala sin reservas: sale solo la cabecera. Sala que no existe: `sala desconocida: Oeste`. Sin sala: `falta la sala: uso exportar <sala>`. Los textos son literales míos. Salen por la salida estándar y con código de salida 0, como el resto de respuestas de `run`.
8. Qué reservas: todas las de la sala, sin filtro por día ni semana. Lo que el responsable compara cada lunes y lo que busca quedó **pendiente**: no lo sabe el dev-lead, y un filtro por día sería inventarlo.
9. Capacidad nueva `booking-export` (hoy no hay capacidades). No declaro «Reglas de la capacidad»: la constitution no tiene «Reglas de producto» de las que tomar valores y no invento ninguna.
10. Enfoque: A frente a B y C (ver Approach).
- Política de modelos: revisores de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** — Scope: «si cabe» en la línea de `README.md` dejaba el alcance abierto → ahora entra siempre una línea en `README.md`.
- **Aceptado** — la cabecera `dia` sin tilde y el `\n` final sin añadir no estaban en ✋ → añadidos a las decisiones 3 y 4.
- **Aceptado** — capacidad sin «Reglas de la capacidad» → queda dicho en la decisión 9, no se inventan valores.
- Sin Críticos: no hay segunda ronda.

### Decisiones tomadas con el dev-lead

- Separador de columnas `;` — «Opción 1: punto y coma (`;`). El Excel del responsable está en castellano.»
- Para qué es: el responsable de cada sala cuadra sus reservas cada lunes en su hoja de cálculo — «Cuadra las reservas de la sala en su hoja de cálculo cada lunes.»

## Intent

Hoy las reservas viven solo dentro de `src/app.js` y se consultan con `libres`, que no lista reservas. El responsable de cada sala las cuadra los lunes en su hoja de cálculo y ahora tendría que teclearlas. Éxito: ejecutar `exportar <sala>`, guardar la salida y abrirla con doble clic en una hoja en castellano, con una fila por reserva y tres columnas. Fracaso, aunque «funcione»: que la hoja la abra en una sola columna, o que una franja con `;` desplace los datos de su fila.
Qué compara el responsable con qué y qué busca queda pendiente (decisión 8).

## Scope

- Entra: el comando `exportar <sala>` y la función que genera el CSV; sus tests; una línea en `README.md` que lo mencione.
- No entra: exportar a calendario (`.ics`, fila 0009); filtros por día; escribir a un fichero; BOM o codificaciones; exportar todas las salas de una vez; cambiar la estructura de una reserva (añadir fecha).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `git grep -niE "exportar|csv|export"` (solo aparece la fila 0009 del roadmap, que es otra cosa: calendario `.ics`, y la palabra `export` de `run`).

## Approach

- A. Función pura `toCsv(rows)` en `src/app.js` (que ya es el único fichero de entrada) y una rama `exportar` en `run`, que filtra las reservas de la sala y llama a `toCsv`. Cuesta lo mínimo y se prueba sola, con filas de ejemplo, también para el entrecomillado.
- B. Módulo nuevo `src/csv.js`. Separa bien, pero `operations.md` dice «un solo fichero de entrada» y para ~10 líneas crea estructura.
- C. Generar el CSV a mano dentro de la rama de `run`. Más corto, pero el entrecomillado solo se podría probar a través de reservas que el código no permite inyectar.
- Elegido: A — la función pura es testeable con una franja con `;` sin tocar los datos reales, y no abre fichero nuevo.

`toCsv` se exporta para poder probarla. La rama `exportar` de `run` devuelve el texto (cabecera y filas unidas por `\n`, sin `\n` final: `console.log` ya lo añade).

## Dónde se prueba

- Todos los comportamientos de salida: `run('exportar', [...])` en `test/app.test.js`, como los tests actuales.
- Entrecomillado de `;` y `"`: `toCsv` directamente, con filas de ejemplo, porque las reservas son una constante interna sin forma de inyectar una franja con `;`.
- Que una hoja en castellano lo abre en columnas: lo valida el dev-lead a mano, abriendo el CSV.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN las reservas `Norte · lun · 10:00-12:00` y ninguna de `Sur`
- WHEN se ejecuta `exportar Norte`
- THEN sale `sala;dia;franja` y debajo `Norte;lun;10:00-12:00`, separadas por `\n`
- AND el separador es `;`

#### ADDED — Sala sin reservas

- GIVEN la sala `Sur` existe y no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN sale solo `sala;dia;franja`

#### ADDED — Sala desconocida

- GIVEN las salas `Norte` y `Sur`
- WHEN se ejecuta `exportar Oeste`
- THEN sale `sala desconocida: Oeste`

#### ADDED — Falta la sala

- GIVEN cualquier estado
- WHEN se ejecuta `exportar` sin sala
- THEN sale `falta la sala: uso exportar <sala>`

#### ADDED — Campos con separador o comillas

- GIVEN una reserva `Norte · mar · 9:00;10:00`
- WHEN se genera el CSV
- THEN la fila es `Norte;mar;"9:00;10:00"`
- AND un campo `a"b` sale como `"a""b"`

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
