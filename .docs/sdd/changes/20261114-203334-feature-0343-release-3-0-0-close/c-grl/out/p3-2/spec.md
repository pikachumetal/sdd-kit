---
id: 20261114-225944-feature-0002-exportar-csv
feature: 0002
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

🦆 Hasta ahora el responsable de salas no puede sacar las reservas de la herramienta: las copia a mano a su hoja. Con esto escribe `node src/app.js exportar Norte > norte.csv` y obtiene un fichero que su Excel en castellano abre en columnas: `sala;dia;franja`, y debajo `Norte;lun;10:00-12:00`. Por dentro es un comando nuevo `exportar` en `src/app.js` que filtra las reservas por sala y las imprime con `;`; los errores van a stderr para no ensuciar el fichero.

Validación: dev-lead — es la salida que abre una persona en su Excel; el agente no puede ver cómo la abre. El dev-lead redirige con la forma que documenta el README, en su shell real, y abre `norte.csv` en su Excel: tres columnas y la franja `10:00-12:00` como texto. Se aceptan el BOM y el CRLF que ponga la shell (la spec no los garantiza ausentes).

## Capacidades

- Nuevas: `booking-export` — la exportación de las reservas de una sala a CSV.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: capacidad nueva (`booking-export`), contrato público (el formato CSV lo consume el Excel del responsable) · tamaño: ~30 líneas en 3 ficheros
- Dominio (sonnet): si el CSV de «Una sala sin reservas» sirve al cuadre de los lunes del responsable, y si `Norte;lun;10:00-12:00` es la fila que él espera (señal: capacidad nueva)
- Técnica (sonnet): si la salida de error por stderr con código 1 no contamina el fichero redirigido, y si `run` puede lanzar sin romper los tres comandos actuales (señal: contrato público)
- Mínimo razonable: solo técnica — deja sin mirar si el contenido del CSV es el que el responsable necesita para cuadrar
```

1. Nombre del comando: `exportar <sala>` — la herramienta ya usa verbos en castellano (`libres`, `reservar`, `cancelar`).
2. Columnas: `sala;dia;franja`, en ese orden — son los tres campos que tiene una reserva hoy; nadie pidió otros.
3. Con fila de cabecera (`sala;dia;franja`) — el Excel la usa de títulos de columna; sin ella el responsable la escribiría a mano.
4. Fin de línea `\n`, sin BOM, sin comillas ni escapado, y salida solo ASCII a propósito (la cabecera es `dia`, sin tilde, como el campo del código) — hoy todos los valores son ASCII y sin `;`, así que un Excel en castellano los lee igual con o sin BOM; si algún día aparece un valor con tilde (`mié`) o con `;`, el BOM y el escapado serán otra feature. Una prueba fija esa suposición a través de `run`: cada línea de `exportar Norte` y `exportar Sur` tiene tres campos al partir por `;` y es ASCII (`src/app.js` no exporta sus datos y no los exporta para esto). La cabecera `dia` sin tilde es una excepción deliberada a la regla 4 de la constitución (interfaz en castellano): es el nombre del campo del código y el de una columna técnica, no un texto de la interfaz.
- `run('exportar', ['Norte'])` devuelve el texto **sin salto final** (`sala;dia;franja\nNorte;lun;10:00-12:00`); el `console.log` del arranque añade el único `\n` final, así que el fichero no acaba en una fila vacía.
- Los datos (salas y reservas) siguen en memoria dentro de `src/app.js`; la feature no los persiste ni los cambia. (Contexto, no una regla de la capacidad.)
- Los errores se modelan como excepción de `run`, de una clase propia `UsageError` (los textos son los de la decisión 7): el arranque captura solo esa clase, escribe `e.message` por stderr —sin `Error:` ni traza— y fija `process.exitCode = 1` (sin `process.exit`, para no truncar stderr). Cualquier otro error sigue saliendo como hoy, con su traza.
- Orden de comprobación: primero el número de argumentos y la cadena vacía (`exportar`, `exportar ''`, `exportar Norte Sur`, `exportar Oeste Sur`: todos `uso: exportar <sala>`), después la sala contra la lista de salas (`rooms`), no contra las reservas (`sala desconocida: …`).
- La redirección `>` es de la shell del responsable, no de la herramienta: PowerShell 5.1 escribe UTF-16 con BOM y CRLF, PowerShell 7 y `cmd` escriben bytes sin BOM, y la spec garantiza solo la salida estándar. Por eso el README lo dice con el comando que sirve (`cmd /c "node src/app.js exportar Norte > norte.csv"` o `| Out-File -Encoding utf8`) y la validación del dev-lead abre el fichero real de su shell en su Excel.
5. Las filas salen en el orden de la lista de reservas de la herramienta, sin ordenar — hoy hay una sola reserva, así que ningún escenario lo prueba; ordenar por día pide decidir cuál es el primer día de la semana.
6. Una sala sin reservas exporta solo la cabecera — un fichero válido y sin datos le dice «no hay nada» sin tratarlo como error.
7. Sala desconocida (`exportar Oeste`) o sin sala válida: mensaje por **stderr**, nada por stdout y código de salida 1 — el responsable redirige stdout a un fichero; un mensaje ahí acabaría dentro de su CSV. Textos literales: `sala desconocida: Oeste` y `uso: exportar <sala>`.
8. La sala se compara tal cual (`norte` no es `Norte`) — igual que hoy `libres` y `cancelar`.
9. Capacidad nueva `booking-export` (slug en inglés) — el proyecto aún no tiene capacidades; una más amplia (`bookings`) obligaría a describir los demás comandos, y no toca hoy.
10. Enfoque: A (comando nuevo en `run`), frente a B y C (ver Approach).
- Se ha quitado «las reservas de otras salas no aparecen» del primer escenario: hoy no hay reservas de otra sala, así que pasaba sin el filtro; lo cubre «Una sala sin reservas».
11. **Pendiente — confírmalo al aprobar:** PRODUCT.md dice «la uso yo… no hay más usuarios» y la fila 0002 cita a un «responsable de salas». Lo tomo como el mismo dueño del producto en ese papel y no toco PRODUCT.md; si es otra persona, dímelo y se actualiza PRODUCT.md en esta feature.
- Repaso de coherencia: delta probado sobre una copia de `.docs/sdd` con `sdd capability merge`: `booking-export.md` con 4 requisitos añadidos, sin rechazos (repetido tras la ronda 1); `capabilities/` del repo intacto. Nada se retira (`git grep -n 0002` solo da la fila del roadmap).
- Política de modelos: revisores de la spec en sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Hallazgos de la review

Primera ronda (dominio y técnica, sonnet):

- **Aceptado** (Crítico, dominio 1 y técnica 3) — la codificación y los saltos de línea del fichero dependen de la shell, no de la herramienta → decisión 4: salida ASCII a propósito, riesgo de la redirección declarado en «No entra», README con el comando que sirve, y la validación del dev-lead abre el fichero real en su Excel.
- **Aceptado** — franja `10:00-12:00` que Excel podría leer como hora (dominio 2) → entra en la validación del dev-lead: la franja debe verse como texto.
- **Aceptado** — el orden sin escenario (dominio 3) → queda declarado en la decisión 5 como sin ordenar y sin escenario; ordenar sigue en «No entra».
- **Aceptado** — dónde viven los datos (dominio 4), `norte` sin escenario (dominio 5 y 7, técnica 7), cabecera `dia` sin tilde (dominio 6) → decisión 4 y escenarios nuevos «Sala desconocida» y «Sin sala válida».
- **Aceptado** — PRODUCT.md frente al «responsable de salas» (dominio 8) → pendiente para tu aprobación, en la decisión 4.
- **Aceptado** — README condicional (dominio 9, técnica 9) → el README no documenta comandos: entra una línea, sin «si».
- **Aceptado** — el AND de «otras salas» pasaba sin filtro (técnica 1) → quitado; lo cubre «Una sala sin reservas».
- **Aceptado** — `\n` final (técnica 2), una prueba por proceso (técnica 4), arranque y `catch` (técnica 5), decisiones fuera de la lista (técnica 6), escenarios separados (técnica 8) → decisión 4, «Dónde se prueba», Scope y escenarios.
- **Aceptado** — valores sin `;` sin prueba (técnica 10) → prueba sobre los datos en «Dónde se prueba».

Segunda ronda (un revisor, sonnet; ningún Crítico):

- **Aceptado** — el merge de prueba decía 3 requisitos y son 4 (1); la prueba de datos exigía exportar `rooms` y `bookings` (2); «dónde viven los datos» no era una regla de la capacidad (3) → repetido el merge, prueba a través de `run`, y la viñeta pasa a contexto.
- **Aceptado** — lo de PRODUCT.md quedaba escondido en una viñeta (4) → decisión 11, marcada pendiente y que bloquea la aprobación; la cita «así me sirve» se atribuye a la fila 0002 del roadmap.
- **Aceptado** — un `catch` general quitaba la traza a los otros comandos (5) → clase `UsageError`; solo esa se captura.
- **Aceptado** — el 🦆 y el README usaban redirecciones distintas (6) → la validación usa la del README y acepta el BOM y el CRLF de la shell.
- **Aceptado** — `''` no se puede probar por proceso en PowerShell 5.1 (7), la cadena exacta de stdout (8), `dia` como excepción a la regla 4 (9), el orden de comprobación con `exportar Oeste Sur` (10) → «Dónde se prueba», escenario 1, decisión 4.

### Decisiones tomadas con el dev-lead

- Separador `;` y salida por la salida estándar, redirigida por el responsable — «así me sirve» (cita de la fila 0002 del roadmap, 2026-11-01)
- Es «las reservas de una sala»: un comando por sala, no un volcado de todas — fila 0002 del roadmap

## Intent

Hoy las reservas viven en memoria dentro de `src/app.js` y solo se consultan con `libres`. El responsable de salas las cuadra los lunes en su hoja de cálculo y las pasa a mano. Éxito: `exportar <sala>` produce un CSV que su Excel en castellano abre en tres columnas sin tocar nada. Fracasaría, aunque funcione, si el Excel lo abriera todo en una sola columna (separador equivocado) o si un mensaje de error acabara dentro del fichero redirigido.

## Scope

- Entra: el comando `exportar <sala>` con cabecera y filas; la sala desconocida y la falta de sala; el captura de errores de la línea de arranque de `src/app.js` (el arranque cambia: `run` ahora puede lanzar); los tests; una línea en `README.md` (hoy no documenta ningún comando) con `exportar` y la redirección de la decisión 4.
- No entra: exportar todas las salas a la vez, otros formatos (`.ics` es la 0009), ordenar o filtrar por día o franja, escribir el fichero desde la herramienta (lo redirige él), comillas, escapado o BOM, y la codificación o los saltos de línea que meta la shell al redirigir (riesgo declarado en la decisión 4, lo valida el dev-lead).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: 0002 → ningún otro fichero la nombra | nada: comprobado con `git grep -n 0002` (solo la fila del roadmap)

## Approach

- A. Comando nuevo `exportar` en `run` de `src/app.js` — una función `exportRoom` junto a `freeRooms` y un `if` más; el error lo lanza `run` y el arranque lo lleva a stderr. Coste: `run` pasa a poder lanzar, hoy nunca lo hace.
- B. Módulo `src/csv.js` aparte — se prueba solo, pero `operations.md` fija «un solo fichero de entrada» y son ~10 líneas.
- C. Una orden `reservas <sala> --csv` — dejaría hueco para otros formatos, pero nadie los pide y obliga a definir un listado que no existe.
- Elegido: A — la menor superficie y el patrón de los tres comandos actuales.

`run('exportar', ['Norte'])` devuelve el texto; para sala desconocida o sin sala lanza un `Error` con el mensaje de la decisión 7, y el arranque de `src/app.js` lo escribe en stderr y sale con 1.

## Dónde se prueba

- Exportar una sala y sala sin reservas: por `run`, como los tests actuales de `test/app.test.js` (`assert.equal` sobre la cadena literal, sin `\n` final). El filtro por sala lo cubre «Sur sin reservas», que falla sin filtro: hoy no hay reservas de otra sala con que probarlo de otro modo.
- Sala desconocida (`Oeste`, `norte`) y sin sala válida (sin argumento, `''`, `Norte Sur`, `Oeste Sur`): por `run`, con `assert.throws` sobre el mensaje. Solo por `run`: el `''` no llega como argumento vacío desde PowerShell 5.1, y stdout vacío y código 1 los cubren por proceso los casos `Oeste` y sin argumento.
- Salida estándar, de error y código: una prueba por proceso (`node src/app.js …`, ruta resuelta desde `import.meta.url`): `exportar Norte` (código 0), `exportar Sur` (0), `exportar Oeste` y `exportar` (stdout vacío, mensaje en stderr, código 1).
- Cada línea de `exportar Norte` y `exportar Sur` tiene tres campos al partir por `;` y es ASCII: por `run`, sin exportar los datos.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `booking-export`

#### ADDED — Exportar las reservas de una sala

- GIVEN la sala Norte con la reserva `lun 10:00-12:00`
- WHEN el responsable ejecuta `exportar Norte`
- THEN la salida estándar es `sala;dia;franja` y, en la línea siguiente, `Norte;lun;10:00-12:00`, exactamente `sala;dia;franja\nNorte;lun;10:00-12:00\n`, sin línea vacía al final
- AND el código de salida es 0

#### ADDED — Una sala sin reservas

- GIVEN la sala Sur sin reservas
- WHEN el responsable ejecuta `exportar Sur`
- THEN la salida estándar es solo `sala;dia;franja`, con su `\n` final
- AND el código de salida es 0

#### ADDED — Sala desconocida

- GIVEN las salas Norte y Sur
- WHEN el responsable ejecuta `exportar Oeste`
- THEN la salida estándar queda vacía, la de error dice `sala desconocida: Oeste` y el código de salida es 1
- AND `exportar norte` también falla con `sala desconocida: norte`: la sala se compara tal cual

#### ADDED — Sin sala válida

- GIVEN las salas Norte y Sur
- WHEN el responsable ejecuta `exportar` sin sala
- THEN la salida estándar queda vacía, la de error dice `uso: exportar <sala>` y el código de salida es 1
- AND `exportar Norte Sur` y `exportar ''` dan el mismo resultado

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
