---
id: 20261112-162619-feature-0012-persist-bookings
feature: 0012
title: Las reservas sobreviven a cerrar la terminal
mode: full
status: draft
created: 2026-11-12
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar la terminal

🦆 Hoy, si cancelas la reserva de la sala Norte y cierras la terminal, al volver a abrirla la reserva está otra vez activa: cada arranque empieza de cero. Con este cambio, `salas` guarda las reservas en un fichero de tu carpeta personal y las vuelve a leer al arrancar: cancelas `Norte lun`, cierras la terminal, la abres y `libres 10:00-12:00` sigue diciendo `Norte, Sur`. Por dentro, cada comando carga el fichero, aplica el cambio y lo guarda. Esto revoca la ADR 0003 («en memoria»), que se sustituye por otra.

Validación: dev-lead — es el uso real de una persona en su terminal: cerrar y abrir es lo que hay que ver.

## Capacidades

- Nuevas: `booking-persistence` — las reservas se guardan en disco y se recuperan al arrancar.
- Modificadas: ninguna (el repo no tiene `capabilities/`).
- Retiradas: ninguna.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor con los siete puntos — señales: capacidad nueva, datos persistentes nuevos · tamaño: ~40 líneas de código en `src/app.js` y los tests (3 ficheros), más 4 de documentos (ADR 0003 y 0004, `operations.md`, `architecture.md`), sin contrato público consumido por otro sistema ni `MODIFIED`
- Único (sonnet): si la ADR 0003 queda bien revocada (filas de «Lo que se retira») y si el THEN del fichero ilegible no puede destruir reservas (señal: datos persistentes)
- Mínimo razonable: sin review — deja sin mirar el caso del fichero corrupto y la revocación de la ADR

1. **Revoca la ADR 0003.** Es el cambio de fondo: la ADR decía «nadie lo ha pedido» y ahora sí. Se escribe la ADR 0004 (`bookings-in-file`), la 0003 pasa a `superseded by 0004` y `operations.md` deja de decir «las reservas viven en memoria». Las escribe el cierre.
2. **Dónde vive el fichero:** `~/.salas/reservas.json` (carpeta personal del usuario, creada si falta). La carpeta personal es `os.homedir()`. La variable de entorno `SALAS_DATOS` (vacía cuenta como no definida) sustituye esa **carpeta** (el fichero se llama siempre `reservas.json` dentro de ella; la usan los tests y quien quiera moverlo). Nadie dijo dónde; es lo que la ADR 0003 dejaba pendiente.
3. **Formato:** JSON, un array con las reservas tal cual están hoy en memoria: `{"room":"Norte","day":"lun","slot":"10:00-12:00","status":"active"}`. Sin campo de versión: una sola persona, un solo formato; si cambia, se migra a mano.
4. **Dos terminales a la vez:** gana la última en escribir. Cada comando lee el fichero al empezar y, si cambió algo, lo escribe entero al acabar; no hay bloqueo. Con un solo usuario y comandos de milisegundos, un bloqueo es coste sin riesgo real.
5. **Escritura segura:** se escribe en `reservas.json.<pid>.tmp` (pid del proceso, para que dos terminales no compartan temporal) y se renombra; si queda un `.tmp` huérfano, se ignora. Así, cerrar la terminal en mitad no deja el fichero a medias.
6. **Sin fichero (primer arranque):** se parte de las reservas iniciales de hoy (`Norte lun 10:00-12:00`) y el fichero se crea al primer cambio. Así un primer arranque se comporta como hoy.
7. **Fichero ilegible (JSON roto):** el comando falla con el texto `reservas ilegibles: <ruta>`, escribe el texto por la salida de error, sale con código 1 y **no toca el fichero**; lo hace `src/app.js` (el bloque de entrada atrapa el error de `run` y llama a `process.exit(1)`). Vale para cualquier comando (`libres`, `cancelar`, `anular`) y para un fichero que no sea un array JSON de reservas válidas (vacío, `{}`, `null`, `[1]`, `[{}]`); una reserva es válida si tiene `room`, `day`, `slot` y `status` como texto. La salida es la del punto de entrada de `src/app.js` (hoy `console.log(run(...))`): `run` pasa a lanzar un error que ese punto atrapa. No se parte de cero en silencio: sobrescribirlo perdería las reservas.
8. **Solo se guarda tras un cambio** (`cancelar` o `anular` con éxito). `libres` y los comandos que no encuentran reserva no escriben.
9. **`reservar` no cambia:** hoy solo devuelve `reserva semanal creada` sin añadir ninguna reserva. Persistir lo que no se crea no tiene sentido, y crearla es otra feature; se queda fuera aunque limita lo visible del cambio: lo único que sobrevive hoy son las cancelaciones y anulaciones de la reserva inicial.
10. **Carga dentro de `run`, no al importar el módulo**, y los tests existentes (`test/app.test.js`, `test/cancel.test.js`) pasan a fijar `SALAS_DATOS` a una carpeta temporal nueva por test, que borran al acabar: sin esto el gate `node --test` leería y escribiría el `~/.salas` real del desarrollador y los tests se contaminarían entre sí.
11. **Si no se puede guardar** (permisos, disco lleno, la ruta es un fichero): el comando falla con `no se pudo guardar: <ruta>`, código 1, y no responde éxito; nunca se dice `cancelada` sin haberlo guardado.
12. **Reinicio:** antes bastaba cerrar la terminal para recuperar la reserva inicial; ahora hay que borrar la carpeta `~/.salas` (o `SALAS_DATOS`). Es un cambio visible asumido; va a `operations.md`.
13. **Enfoque:** fichero JSON, frente a SQLite y a «guardar al salir» (ver Approach).
14. **Capacidad nueva:** `booking-persistence`. Delta probado en una copia con `sdd capability merge`: 9 requisitos y 5 reglas añadidos, sin rechazos.
- Política de modelos: un revisor de spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

- **Aceptado** — tests existentes tocarían el `~/.salas` real (Crítico) → decisión 10 y Scope.
- **Aceptado** — `SALAS_DATOS` ¿fichero o carpeta? → carpeta, en decisión 2, regla y GIVEN.
- **Aceptado** — fichero roto solo cubierto en `libres`; quién da el código 1 → decisión 7 y escenario ampliado.
- **Aceptado** — sin escenario para `anular` ni para crear la carpeta → dos escenarios; el conflicto se declara no verificado.
- **Aceptado** — Intent contradecía la decisión 4 → Intent acotado.
- **Aceptado** — reiniciar ya no es cerrar la terminal → decisión 12 y tabla.
- **Aceptado** — `operations.md` y `architecture.md` no estaban en la tabla → filas añadidas (`scripts/lint.mjs` solo lee `src/app.js` buscando tabuladores: no se ve afectado).
- **Aceptado** — la 0004 podía no escribirse → tarea del plan con comprobación `git grep`.
- **Segunda ronda (sin Críticos)**: aceptados — escenario de no-escritura más fuerte, `.tmp` con pid, validación de reservas, contrato de `run`, fallo al guardar (decisión 11 y escenario), `os.homedir()`, ruta concreta en el THEN, escenario con fichero válido de varias reservas, tamaño del review, carpeta por test.
- **Aceptado** — Avisos y Límites incompletos → completados.
- **Rechazado** — separar el bloque de review de las decisiones: es la forma que fija la plantilla; el elegido es «Único (sonnet)».

### Decisiones tomadas con el dev-lead

- Perfil `delegate`, del proyecto (`sdd-kit.json`) — «Perfil delegate. Escribe la spec y preséntamela.»

## Intent

Hoy cada arranque de `salas` empieza de cero: cerrar la terminal pierde las reservas (ADR 0003, «Consecuencias»). Se quiere que las reservas se guarden y estén al volver. Éxito: tras `cancelar Norte lun` en un proceso, `libres 10:00-12:00` en otro proceso nuevo dice `Norte, Sur`. Fracaso aunque «funcione»: perder o corromper reservas guardadas por un fichero roto sobrescrito o una escritura a medias. Perder una cancelación porque dos terminales escriben a la vez es un riesgo asumido (decisión 4), no un fracaso.

## Scope

- Entra: leer las reservas de `~/.salas/reservas.json` (o `SALAS_DATOS/reservas.json`) en cada comando y escribirlas tras `cancelar` y `anular`; el texto y el código de salida del fichero ilegible; el aislamiento de los tests existentes (decisión 10); la ADR 0004 y los ajustes de documentos de «Lo que se retira» (la 0004 y el `superseded by 0004` son tareas del plan, comprobables con `git grep "superseded by 0004"`).
- No entra: crear reservas con `reservar` (decisión 9); bloqueo entre terminales; migración de formatos; base de datos; exportar a `.ics` (0004); motivo al cancelar (0010); anular por responsable de sala (0011).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «las reservas viven en memoria» / «cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0003-bookings-in-memory.md:8-31`; `.docs/sdd/steering/operations.md:14` | decisión 1: ADR 0003 → `superseded by 0004`; `operations.md` reescrito |
| Confirmación «`src/` no importa `node:fs`» | `.docs/sdd/decisions/0003-bookings-in-memory.md:31` | decisión 1: deja de cumplirse; la sustituye la Confirmación de la 0004 |
| Cerrar la terminal restaura la reserva inicial | `.docs/sdd/steering/operations.md` (Comandos) | decisión 12: se añade cómo reiniciar (borrar la carpeta) |
| Comandos y tests sin variable de entorno ni carpeta temporal | `.docs/sdd/steering/operations.md` (Comandos, Testing); `.docs/sdd/steering/architecture.md` (Estructura) | decisiones 2 y 10: se documentan `SALAS_DATOS`, los datos en disco y los tests con carpeta temporal |
| Contrato de `run` y del punto de entrada: `run` devuelve texto y no falla | `src/app.js:30-36` | decisión 7: `run` lanza el error del fichero ilegible o no guardable; el punto de entrada lo atrapa, lo escribe por la salida de error y sale con código 1 |
| Reservas solo en memoria | `src/app.js:3` (constante `bookings`) | Scope: pasa a cargarse del fichero |

- Filas que implementa: 0012 no consta en `ROADMAP.md` (sin fila) → nada más la nombra; comprobado con `git grep -n 0012` fuera de esta carpeta.

## Approach

- **Fichero JSON**: sin dependencias (cumple «Node 22, sin dependencias externas», `architecture.md`); cuesta decidir ubicación, escritura y fichero roto (decisiones 2, 5 y 7).
- **SQLite**: resuelve concurrencia y formato, pero trae una dependencia y migraciones para una sola persona. Descartado.
- **Guardar solo al salir**: frágil, porque cerrar la terminal a la fuerza es justo el caso. Descartado.
- Elegido: **fichero JSON, leído al arrancar y escrito tras cada cambio**: la opción más barata que cumple el éxito; el resto del cómo está en las decisiones 2 a 8.

## Dónde se prueba

- Guardado y recuperación: por `run` de `src/app.js` con `SALAS_DATOS` apuntando a una carpeta temporal, como los tests de `test/app.test.js`.
- «Cerrar y abrir la terminal»: un test que lanza `node src/app.js` dos veces como procesos (`node:child_process`) con el mismo `SALAS_DATOS`.
- Fichero ilegible: igual, con un fichero que contiene `{`; se comprueba texto, código de salida 1 y que el contenido no cambia.

## Términos y ADR

- Términos resueltos: ninguno.
- ADR candidatas: **0004 `bookings-in-file`**: fichero JSON frente a memoria (la 0003, que revoca), SQLite y guardar al salir.

## Delta de comportamiento

### Capacidad: `booking-persistence`

#### ADDED — Las reservas se recuperan al volver a arrancar

- GIVEN `SALAS_DATOS` apunta a una carpeta sin `reservas.json`
- WHEN se ejecuta `cancelar Norte lun` y después, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primero responde `cancelada Norte lun` y el segundo `Norte, Sur`
- AND existe `reservas.json` en esa carpeta con la reserva de `Norte lun` en `cancelled`

#### ADDED — Anular también se recupera

- GIVEN `SALAS_DATOS` apunta a una carpeta sin `reservas.json`
- WHEN se ejecuta `anular Norte lun` y después, en un proceso nuevo, `libres 10:00-12:00`
- THEN el primero responde `anulada Norte lun` y el segundo `Norte, Sur`
- AND `reservas.json` tiene la reserva de `Norte lun` en `voided`

#### ADDED — La carpeta se crea si falta

- GIVEN `SALAS_DATOS` apunta a una carpeta que no existe
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND la carpeta y `reservas.json` existen

#### ADDED — Primer arranque sin fichero

- GIVEN `SALAS_DATOS` apunta a una carpeta sin fichero
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur`
- AND no se crea ningún fichero

#### ADDED — Un comando que no cambia nada no escribe

- GIVEN un `reservas.json` escrito a mano con sangría y `Norte lun` en `active`
- WHEN se ejecuta `cancelar Sur mar`
- THEN responde `sin reserva Sur mar`
- AND el fichero conserva su contenido exacto, sangría incluida

#### ADDED — Fichero ilegible

- GIVEN `reservas.json` contiene `{` (JSON roto)
- WHEN se ejecuta `libres 10:00-12:00` o `cancelar Norte lun`
- THEN la salida de error dice `reservas ilegibles: <SALAS_DATOS>/reservas.json` (la ruta tal cual se compone) y el proceso sale con código 1
- AND el fichero sigue conteniendo `{`
- GIVEN `reservas.json` está vacío o contiene `{}`, `null`, `[1]` o `[{}]`
- WHEN se ejecuta `libres 10:00-12:00` o `anular Norte lun`
- THEN igual: `reservas ilegibles: <SALAS_DATOS>/reservas.json`, código 1, fichero intacto

#### ADDED — Se lee lo guardado, no el valor por defecto

- GIVEN un `reservas.json` válido con `Norte lun` en `cancelled` y `Sur mar 10:00-12:00` en `active`
- WHEN se ejecuta `libres 10:00-12:00` y después `cancelar Norte lun`
- THEN responden `Norte` y `sin reserva Norte lun`

#### ADDED — No responde éxito si no puede guardar

- GIVEN `SALAS_DATOS` apunta a una ruta que es un fichero
- WHEN se ejecuta `cancelar Norte lun`
- THEN la salida de error dice `no se pudo guardar: <SALAS_DATOS>/reservas.json`, código 1, y no sale `cancelada Norte lun`

#### ADDED — Sin temporales al guardar

- GIVEN `SALAS_DATOS` apunta a una carpeta con un `reservas.json.999.tmp` huérfano
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `cancelada Norte lun`
- AND en la carpeta solo quedan `reservas.json` y el `.tmp` huérfano, sin ningún `.tmp` nuevo

#### Reglas de la capacidad — booking-persistence

- **Dónde viven los datos**: `~/.salas/reservas.json`, o `reservas.json` dentro de la carpeta `SALAS_DATOS` si está definida.
- **Idioma de los nombres**: no aplica (claves en inglés como en el código; mensajes en castellano, constitution 4).
- **Límites**: no aplica (no hay topes de tamaño ni de número de reservas: una persona, pocas reservas).
- **Avisos**: `reservas ilegibles: <ruta>` y `no se pudo guardar: <ruta>`, por la salida de error, con código de salida 1.
- **Regla ante conflicto**: gana la última terminal en escribir; no hay bloqueo. No se verifica con escenario: es un riesgo asumido.

## Enmiendas

(ninguna)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
