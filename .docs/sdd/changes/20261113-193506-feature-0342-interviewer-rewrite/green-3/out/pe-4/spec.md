---
id: 20261114-161522-feature-0010-exportar-csv
feature: 0010
title: Exportar a CSV las reservas de una sala
mode: full
status: draft
created: 2026-11-14
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Exportar a CSV las reservas de una sala

🦆 Con `salas exportar Norte` sacas por pantalla las reservas de esa sala en CSV, y con `>` las guardas en un fichero que Excel en castellano abre con una columna por dato. Por ejemplo, la reserva de Norte del lunes sale como `Norte;lun;10:00-12:00`, debajo de la cabecera `sala;día;franja`. El comando no escribe ningún fichero: lo haces tú al redirigir. Por dentro es una función que filtra las reservas de la sala y las une con `;`, más un carácter inicial invisible para que Excel respete las tildes.

Validación: dev-lead — el CSV lo va a abrir una persona en Excel en castellano, y eso el agente no lo puede observar.

## Capacidades

- Nuevas: `bookings` — las reservas de las salas y lo que se puede hacer con ellas; hoy, exportar las de una sala a CSV.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (el formato del CSV lo consume Excel) · tamaño: ~35 líneas de código y tests en 2 ficheros
- Dominio (sonnet): si `sala;día;franja` y el orden de las filas son lo que necesita quien cuadra los lunes, y si una sala sin reservas o inexistente deja un fichero que no engaña (señal: contrato público)
- Técnica (sonnet): si BOM + `;` + CRLF abren bien en Excel castellano y si el entrecomillado de la decisión 9 cubre `;`, `"` y salto de línea (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si las columnas sirven para el uso real del lunes

1. **Nombre del comando: `exportar <sala>`** — nadie lo dijo; sigue el estilo de `reservar`, `cancelar` y `libres` (un verbo y la sala como argumento).
2. **Separador `;` y UTF-8 con BOM al principio** — Excel en castellano espera `;` (con `,` todo cae en una columna) y el BOM evita que las tildes de los días salgan rotas al abrir con doble clic. Como no se sabe cómo lo abre el responsable, el formato vale para doble clic y para importar. Coste: el BOM es un carácter invisible que una consola vieja puede mostrar.
3. **Filas separadas por CRLF** — lo que espera Excel en Windows. Lo que devuelve el comando no termina en salto de línea; el único `\n` final lo añade `console.log` al imprimir.
4. **Cabecera `sala;día;franja`** — son las tres únicas columnas que existen en los datos; en castellano (constitución, art. 4) y con tilde, que el BOM permite.
5. **Orden de las filas: el de la lista de reservas, sin reordenar** — nadie pidió otro; ordenar por día obligaría a decidir el orden de los días.
6. **Sala sin reservas: solo la cabecera** — es un fichero válido y dice «no hay nada» sin meter un mensaje dentro del CSV.
7. **Sala inexistente: `sala desconocida: Oeste`; sin sala: `uso: exportar <sala>`** — por la salida estándar y sin romper el proceso, como el resto de comandos. Coste: con la redirección ese texto acaba en el fichero (una sola celda, bien visible) en vez de hacer fallar el comando; que falle con código de salida distinto de 0 es otra decisión, y la dejo fuera.
8. **El nombre de la sala se compara exacto, con su mayúscula (`Norte`)** — como ya hace `libres`; `norte` da «sala desconocida».
9. **Un campo con `;`, `"` o salto de línea va entre comillas dobles, y las comillas internas se duplican** — regla estándar de CSV; hoy los datos no lo necesitan, pero la franja no se valida (deuda «Sin validación del formato de franja horaria») y un valor raro rompería las columnas.
10. **Capacidad nueva `bookings`** — el fichero se llama `bookings.md` (inglés) y el contenido va en castellano; es un sustantivo del dominio y no esta feature, para que `libres`, `reservar` y `cancelar` puedan entrar después.
11. **Validación: dev-lead** — se valida abriendo el CSV en Excel.
12. **Enfoque: A frente a B y C (ver Approach).**
13. **Tests por `run`, y el entrecomillado por una función pura** — porque las reservas son una lista fija del módulo y no hay otra forma de darle una franja con `;` sin cambiar cómo se cargan los datos.
- Repaso de coherencia: el delta fusionado en una copia de `.docs/sdd` fuera del repo da `bookings.md: añadido` ×3 requisitos y 5 reglas, código 0; `capabilities/` del repo no cambia.
- Política de modelos (solo en `delegate`): revisores de la spec: ninguno despachado (ver «Hallazgos de la review») · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents`.

### Hallazgos de la review

La review no se ha despachado: esta sesión no tiene herramienta para lanzar subagentes. En su lugar he pasado yo los siete puntos del revisor sobre la spec, y eso no la sustituye. Si quieres dos revisores, se lanzan en una sesión que los permita, antes de aprobar.

- **Aceptado** — (punto 3, alcance oculto) las reservas son una lista fija del módulo y `reservar` no añade nada: el export refleja esa lista, no reservas «reales» → dicho en Intent.
- **Aceptado** — (punto 4, decisiones en el cuerpo) el `\n` final lo pone `console.log`, y el CRLF y el BOM estaban solo en un THEN → pasan a las decisiones 2 y 3.
- Puntos 1, 2, 5, 5 bis, 6 y 7 sin hallazgos: no hay capacidades previas, cada THEN lleva datos de entrada y de salida, no hay roles, las cinco reglas están declaradas y los ejemplos usan las salas del propio proyecto.

### Decisiones tomadas con el dev-lead

- Es para Excel, y el del responsable de la sala está en castellano — «Usa Excel; el del responsable está en castellano.»
- El comando escribe por la salida estándar y no crea el fichero: la persona lo redirige — «Por la salida estándar; yo lo redirijo a un fichero.»
- Cómo abre el fichero el responsable: pendiente — «Cómo abre el fichero, no sé.» (cubierto por la decisión 2)

## Intent

Hoy las reservas solo se ven con los comandos de la terminal, y el responsable de cada sala las cuadra los lunes en su hoja de cálculo, así que alguien las copia a mano. Con `salas exportar Norte`, la persona obtiene por la salida estándar las reservas de esa sala como CSV, lo redirige a un fichero y lo abre en Excel con una fila por reserva. El éxito es que el fichero se abra a la primera, con las columnas separadas y los días bien escritos, sin tocarlo. Fracasaría, aunque «funcione», si Excel dejara todo en una sola columna o rompiera las tildes. Las reservas que exporta son las que el programa guarda hoy: una lista fija en memoria, que `reservar` no amplía.

## Scope

- Entra: el comando `exportar <sala>` con salida estándar en CSV (BOM, `;`, CRLF, cabecera `sala;día;franja`), el entrecomillado de campos, los dos mensajes de error y los tests.
- No entra: escribir el fichero (la persona redirige), el calendario `.ics` (es la fila 0009), filtrar por día o por fecha, exportar todas las salas a la vez, elegir el separador por opción, validar el formato de la franja (deuda ya anotada) y la entrada del CHANGELOG (la escribe el corte de la release).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada se retira ni cambia de forma | `git grep -n -i "csv\|exportar"` fuera de `.docs/sdd/specs/` y `.docs/sdd/changes/` solo da `ROADMAP.md:19` (fila 0009, exportar a `.ics`) | no se toca: es otra cosa, un calendario |

- Filas que implementa: esta feature no tenía fila y se añade la 0010 a `ROADMAP.md`; la 0009 (`.ics`) sigue aparte y ningún otro fichero la nombra.

## Approach

- **A. Una función `exportCsv(sala)` y otra pura `toCsv(filas)` en `src/app.js`, junto a `freeRooms`, y el comando `exportar` en `run`** — no añade ficheros ni dependencias, como pide `operations.md` (un solo fichero de entrada, sin dependencias); `toCsv` se prueba sola.
- B. Un módulo nuevo `src/csv.js` — un fichero más para unas veinte líneas y un único uso.
- C. Escribir el fichero desde el comando — lo descartó el dev-lead: «Por la salida estándar; yo lo redirijo a un fichero.»
- Elegido: A — es lo más pequeño que cumple lo pedido y deja el código donde ya están los demás comandos.

El comando devuelve el texto desde `run`, como los demás, y el punto de entrada lo imprime con `console.log`. La salida es `U+FEFF` seguido de las filas unidas por `\r\n`, cabecera primero.

## Dónde se prueba

- Exportar una sala con reservas, una sala sin reservas, una sala desconocida y sin sala: por `run('exportar', [...])`, como los tests actuales de `libres` y `cancelar`.
- Entrecomillado de campos: por `toCsv`, exportada, porque las reservas son una lista fija del módulo.
- Abrir el CSV en Excel castellano: lo hace el dev-lead en la validación, con una captura de cómo queda.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Exportar las reservas de una sala a CSV

- GIVEN la sala Norte tiene la reserva `lun 10:00-12:00`
- WHEN se ejecuta `exportar Norte`
- THEN la salida empieza por el BOM `U+FEFF` y sigue con `sala;día;franja` y `Norte;lun;10:00-12:00`, separadas por CRLF, con una fila por reserva de Norte y en el orden de la lista de reservas
- AND una reserva de Sur no aparece

- GIVEN la sala Sur no tiene reservas
- WHEN se ejecuta `exportar Sur`
- THEN la salida es solo `U+FEFF` y `sala;día;franja`

#### ADDED — Exportar avisa de lo que no puede exportar

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar Oeste`
- THEN la salida es `sala desconocida: Oeste`

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar` sin sala
- THEN la salida es `uso: exportar <sala>`

- GIVEN las salas son Norte y Sur
- WHEN se ejecuta `exportar norte`
- THEN la salida es `sala desconocida: norte`

#### ADDED — El CSV entrecomilla los campos que lo romperían

- GIVEN una reserva de Norte con día `lun` y franja `10:00;12:00`
- WHEN se genera el CSV
- THEN su fila es `Norte;lun;"10:00;12:00"`

- GIVEN una reserva de Norte con día `lun` y franja `a "b"`
- WHEN se genera el CSV
- THEN su fila es `Norte;lun;"a ""b"""`

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: la lista de reservas en memoria de `src/app.js`
- **Idioma de los nombres**: cabecera y mensajes en castellano
- **Límites**: no aplica
- **Avisos**: `sala desconocida: <sala>` si la sala no existe; `uso: exportar <sala>` si falta la sala
- **Regla ante conflicto**: no aplica

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
