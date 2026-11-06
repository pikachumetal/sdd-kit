---
id: 20261105-211440-feature-0013-export-csv
feature: 0013
title: Exportar las reservas a CSV
mode: full
profile: delegate
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar las reservas a CSV

🦆 Hoy las reservas solo se ven una a una desde la terminal. Con esto, `node src/app.js exportar` escribe un fichero `reservas.csv` con una fila por reserva (`Norte,lun,10:00-12:00,activa`), cabecera incluida, y responde `exportadas 1 reservas en reservas.csv`. Si das una ruta (`exportar mis-reservas.csv`) lo escribe ahí. Entran también las canceladas y anuladas, con su estado en castellano, para que la hoja de cálculo cuente toda la historia.

Validación: dev-lead — lo que sale es un fichero que una persona abre en su hoja de cálculo.

## Capacidades

- Nuevas: `booking-export` — exportación de las reservas a un fichero CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (formato del fichero que otras herramientas leerán) · tamaño: ~40 líneas en 2 ficheros
- Dominio (sonnet): si «una fila por reserva» incluye canceladas y anuladas y si la columna `estado` basta para distinguirlas (señal: capacidad nueva); no hay reglas de rol
- Técnica (sonnet): si el formato (coma, comillas, cabecera, salto de línea) y el texto de respuesta están completos para hacer el test sin más preguntas (señal: contrato público)
- Mínimo razonable: un revisor técnico — deja sin mirar si el alcance «todas las reservas» es lo que la fila quería

### Hallazgos de la review

- **Aceptado** — Crítico: «Fichero existente» sin contenido literal → escenario con contenido previo `viejo\n` y salida exacta.
- **Aceptado** — Crítico: «Valores con separador» sin salto de línea ni fila completa → dos escenarios con filas literales (coma y comillas; salto de línea).
- **Aceptado** — Crítico: «Ruta por defecto» con «termina en» → conjunto fijo, respuesta y contenido literales.
- **Aceptado** — sin plural y `n` cuenta todas las filas → decisión 6; escenario con n=1.
- **Aceptado** — sin escenario para canceladas → escenario con activa, cancelada y anulada.
- **Aceptado** — estado en inglés frente a la regla 4 de la constitución → valores en castellano (decisión 3).
- **Aceptado** — acentos y BOM → escenario con acento y riesgo anotado (decisión 5).
- **Aceptado** — errores de ruta, fórmulas, quién reserva → a «No entra» (decisión 10).
- **Aceptado** — orden, `\n` final, ruta relativa, prueba sin estado global → decisiones 2, 4, 5 y 9.
- **Aceptado** — rutas `/tmp` → marcador `<ruta>`.
- **Segunda ronda, aceptado** — origen del estado y orden → decisiones 3 y 4; bytes sin BOM → escenario «Acentos»; cómo se prueba la ruta por defecto → decisión 9; el escape vale para todas las columnas, se prueba con la sala → decisión 5; la ruta relativa la cubre el escenario «Ruta por defecto».
- **Segunda ronda, rechazado** — Crítico: el plural «exportadas 1 reservas» es incorrecto en castellano → se mantiene un único literal sin plural para que la respuesta sea estable y comprobable; queda señalado en la decisión 6 para que lo cambies al aprobar si prefieres `exportada 1 reserva`.
- **Rechazado** — renombrar `booking-export` a castellano → el slug de capacidad va en inglés kebab-case por la regla del kit; el contenido va en castellano.
- **Rechazado** — avisar de la sobrescritura → hay un único usuario (misión); decisión 7.

1. Enfoque elegido: una función `exportBookings(lista, ruta)` exportada de `src/app.js`, que construye el CSV y lo escribe con `writeFileSync`; el comando `exportar` la llama con las reservas en memoria. Descartado: sacar el CSV por la salida estándar para redirigirlo (`> r.csv`): la fila dice «un fichero», y el comando existente imprime una línea de texto, no datos.
2. Comando `exportar [ruta]`; sin ruta, escribe `reservas.csv` en el directorio actual; una ruta relativa se resuelve contra el directorio actual. Nadie lo dijo.
3. Columnas y orden: `sala,dia,franja,estado`, con cabecera. El estado sale del campo `status` de la reserva (`active`, `cancelled`, `voided`, los únicos tres) y se escribe en castellano: `activa`, `cancelada`, `anulada` (regla 4 de la constitución: el fichero lo lee una persona). Nadie lo dijo.
4. Entran todas las reservas, también canceladas y anuladas, en el orden de la lista recibida (en memoria, el de creación). Nadie lo dijo.
5. Separador coma, fin de línea `\n` también tras la última fila, UTF-8 sin BOM; un valor de cualquier columna con coma, comillas o salto de línea va entre comillas dobles y las comillas se duplican. Riesgo: Excel puede abrir mal los acentos sin BOM; ¿lo quieres con BOM? Nadie lo dijo.
6. Respuesta: `exportadas <n> reservas en <ruta>`, sin plural (también con n=1: «exportadas 1 reservas»; dime si prefieres `exportada 1 reserva`), con `<n>` = todas las filas y `<ruta>` tal como se pasó. Sin reservas, escribe solo la cabecera. Nadie lo dijo.
7. Si el fichero ya existe, se sobrescribe sin avisar. Nadie lo dijo.
8. Capacidad nueva `booking-export` (slug en inglés kebab-case): hoy `capabilities/` está vacío.
9. Para probar sin estado global, `exportBookings` recibe la lista; `run` devuelve la respuesta como texto, como los demás comandos; solo el escenario de la ruta por defecto pasa por `run`, con `process.chdir` a una carpeta temporal que el test restaura. Estimación: 2 tasks, sin partir.
10. Fuera de la spec: el nombre de quien reserva (el código no lo guarda), los errores de escritura (salen como la excepción de Node) y los valores que empiezan por `=`, `+`, `-` o `@`.
- Delta probado en copia: `sdd capability merge` añade 8 requisitos a `booking-export.md` sin rechazos.
- Política de modelos: revisores de la spec en sonnet · ejes de la revisión final según el plan · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents`

### Decisiones tomadas con el dev-lead

- Perfil `delegate` para esta feature — «Perfil delegate»
- Al fusionar, push con `sdd merge --push` — «Al fusionar, `sdd merge --push`»

## Intent

Hoy no hay forma de sacar las reservas de la herramienta para trabajarlas en una hoja de cálculo. Se quiere un fichero con una fila por reserva. Éxito: abrir el fichero en una hoja de cálculo y ver tantas filas como reservas hay, con sala, día, franja y estado. Fracaso aunque funcione: una reserva con coma en un valor que rompe las columnas, o dejar fuera las canceladas sin decirlo.

## Scope

- Entra: comando `exportar [ruta]`, función `exportBookings`, test de ambos.
- No entra: filtros (por sala, día o estado), otros formatos (`.ics` es B1), elegir columnas, el nombre de quien reserva, tratar errores de escritura, neutralizar fórmulas.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira | — | — |

- Filas que implementa: 0013 (antes 0012, renumerada por `sdd id claim`: la 0012 ya era «Informe de ocupación» en `origin/develop`) → `.docs/sdd/roadmap.md:9` | `git grep -n "0012\|0013"` solo la nombra ahí.

## Approach

`exportBookings(lista, ruta)` en `src/app.js` y rama `exportar` en `run`, que la llama con las reservas en memoria.

## Dónde se prueba

- Formato, valores con separador, estados, acentos, sin reservas y sobrescritura: llamando a `exportBookings(lista, ruta)` con una ruta temporal y leyendo el fichero, en un test nuevo junto a `cancel.test.js`.
- Ruta por defecto: por `run('exportar', [])` con el directorio actual en una carpeta temporal.
- La respuesta se compara con la ruta que se pasó.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas a un fichero CSV

- GIVEN una reserva activa `Norte lun 10:00-12:00`, una cancelada `Sur mar 09:00-10:00` y una anulada `Norte mié 14:00-15:00`
- WHEN se exporta a `<ruta>`
- THEN el fichero contiene `sala,dia,franja,estado\nNorte,lun,10:00-12:00,activa\nSur,mar,09:00-10:00,cancelada\nNorte,mié,14:00-15:00,anulada\n` y la respuesta es `exportadas 3 reservas en <ruta>`

#### ADDED — Una sola reserva

- GIVEN solo la reserva activa `Norte lun 10:00-12:00`
- WHEN se exporta a `<ruta>`
- THEN la respuesta es `exportadas 1 reservas en <ruta>`

#### ADDED — Ruta por defecto

- GIVEN solo la reserva activa `Norte lun 10:00-12:00` y un directorio actual vacío
- WHEN se ejecuta `exportar` sin ruta
- THEN `reservas.csv` del directorio actual contiene `sala,dia,franja,estado\nNorte,lun,10:00-12:00,activa\n` y la respuesta es `exportadas 1 reservas en reservas.csv`

#### ADDED — Sin reservas

- GIVEN ninguna reserva
- WHEN se exporta a `<ruta>`
- THEN el fichero contiene solo `sala,dia,franja,estado\n` y la respuesta es `exportadas 0 reservas en <ruta>`

#### ADDED — Valores con coma o comillas

- GIVEN una reserva activa de sala `Sala "A", planta 1`, día `lun`, franja `10:00-12:00`
- WHEN se exporta a `<ruta>`
- THEN su fila es `"Sala ""A"", planta 1",lun,10:00-12:00,activa\n`

#### ADDED — Valores con salto de línea

- GIVEN una reserva activa de sala `Norte\nplanta 1`, día `lun`, franja `10:00-12:00`
- WHEN se exporta a `<ruta>`
- THEN su fila es `"Norte\nplanta 1",lun,10:00-12:00,activa\n`

#### ADDED — Acentos

- GIVEN una reserva activa de sala `Reunión`, día `mié`, franja `10:00-12:00`
- WHEN se exporta a `<ruta>`
- THEN los bytes del fichero empiezan por `s` (no por `EF BB BF`), `é` ocupa los bytes `C3 A9` y su fila es `Reunión,mié,10:00-12:00,activa\n`

#### ADDED — Fichero existente

- GIVEN `<ruta>` existe con el contenido `viejo\n` y la reserva activa `Norte lun 10:00-12:00`
- WHEN se exporta a `<ruta>`
- THEN el fichero contiene exactamente `sala,dia,franja,estado\nNorte,lun,10:00-12:00,activa\n`

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
