---
id: 20261112-120750-feature-0012-persistent-bookings
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

🦆 Hoy, si cancelas la reserva de Norte el lunes y cierras la terminal, al abrirla otra vez la reserva ha vuelto: el programa olvida todo al salir. Con este cambio, `salas` guarda el estado en un fichero de tu carpeta personal después de cada cambio, y al arrancar lo lee: tras cancelar Norte lun y reabrir, `libres 10:00-12:00` responde `Norte, Sur` y volver a cancelar dice `sin reserva Norte lun`. Esto da la vuelta a la decisión de que el estado vive solo en memoria (ADR 0004), así que va con una ADR nueva. Ojo: `reservar` hoy no guarda nada, así que lo que sobrevive son las cancelaciones y anulaciones de la reserva inicial (primera decisión de ✋).

Validación: dev-lead — lo que usa una persona (cerrar y reabrir la terminal), un humano debe verlo.

## Capacidades

- Nuevas: `bookings` — dónde viven las reservas y que sobreviven entre arranques.
- Modificadas: ninguna
- Retiradas: ninguna

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (sonnet, siete puntos) — señales: capacidad nueva, datos persistentes nuevos · tamaño: ~40 líneas en 2 ficheros (`src/app.js`, `operations.md`), sin contrato público ni `MODIFIED`
- Dominio y técnica (sonnet): si el THEN de fichero ilegible y el de «lectura no crea fichero» se cumplen sin que el código decida nada más, y si el cambio de «Motor de producción» en `operations.md` contradice el requisito de datos (señal: datos nuevos)
- Mínimo razonable: sin review — deja sin mirar el caso del fichero ilegible y la escritura atómica, el tipo de hueco que solo aparece al corromperse el fichero

1. **`reservar` hoy no guarda ninguna reserva** (`src/app.js` devuelve el texto `reserva semanal creada` y no toca `bookings`), y la única reserva es una inicial fija (Norte lun 10:00-12:00). Por eso entra solo guardar lo que ya cambia el estado (`cancelar`, `anular`) y no que `reservar` cree reservas de verdad — **valida esto primero**: si lo que querías es poder crear y conservar reservas, hace falta otra fila de roadmap (recomendada) y esta feature queda como base de almacenamiento.
2. **Enfoque: fichero JSON en la carpeta personal**, frente a un fichero junto a donde se ejecute (cambia según la carpeta desde la que abras la terminal: no sobreviven «a volver a abrirla» en otro sitio) y frente a SQLite (`node:sqlite` pide Node ≥ 22.5 y `package.json` admite 20; una base para dos estados es desproporcionada) — ver Approach.
3. **Ruta**: `~/.salas/reservas.json`, con `SALAS_DATOS` para cambiarla (los tests la usan para no tocar la carpeta real).
4. **Cuándo se guarda**: tras cada comando que cambia el estado con éxito (`cancelar`, `anular`); `libres` y los comandos que no cambian nada no crean ni reescriben el fichero.
5. **Sin fichero**: arranca con la reserva inicial de hoy (Norte lun 10:00-12:00), y el fichero nace en el primer cambio.
6. **Dos terminales a la vez**: sin bloqueo; escritura atómica (fichero temporal + renombrado) y gana la última escritura. Lo aceptado: dos cambios simultáneos pueden pisarse. Es lo que la ADR 0004 temía; con un solo usuario no compensa un candado.
7. **Fichero ilegible** (JSON roto o de forma inesperada): se avisa en stderr con el literal `fichero de reservas ilegible: <ruta>`, el proceso sale con código 1 y el fichero no se toca (nunca se pisa lo que no se entiende).
8. **Formato del fichero**: `{"version": 1, "bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "active"}]}`; las claves y los valores de `status` (`active`, `cancelled`, `voided`; cancelar y anular se distinguen) son los del código actual, y `version` queda para una migración futura (hoy solo se acepta `1`). El fichero guarda todas las reservas, también las canceladas, y una vez creado es la única fuente de verdad.
9. **Capacidad nueva `bookings`** (slug en inglés, kebab-case), porque las reservas y su ciclo de vida no tienen capacidad todavía; su único requisito de partida es la persistencia.
10. **ADR candidata 0007** (`persistent-bookings-file`) que sustituye a la 0004: es difícil de deshacer, sorprende sin contexto y hubo alternativa real. La escribe el cierre y la 0004 pasa a `superseded by 0007`. La Confirmación de la 0004 (`src/` no importa `node:fs`) deja de cumplirse a propósito; no hay chequeo automático que la vigile (el lint solo mira tabuladores).
11. **Reparto**: ~3 tasks (almacén + lectura/escritura, cableado del CLI y error, `operations.md`), misma superficie y sin migración: no se propone partir.
12. **Perfil `delegate`, del proyecto (`sdd-kit.json`)**; no hay `sdd-kit.local.json`.
13. **Repaso de coherencia**: delta probado en una copia de `.docs/sdd` con `sdd capability merge` → `bookings.md`: 9 requisitos añadidos y 5 reglas añadidas, sin rechazos (repetido tras integrar la review); `git grep` de `memoria` y `node:fs` en `src/`, `test/`, `README.md` y `PRODUCT.md`: sin otros sitios que cambiar (el `node:fs` de `scripts/lint.mjs` está fuera de `src/`).
14. **Contradicción en los documentos**: `architecture.md` dice «Node 22» y `package.json` admite `>=20`. Descarto SQLite apoyándome en `package.json`; dime cuál manda (si es 22, el descarte de C deja de sostenerse por esa razón, aunque sigue siendo desproporcionado).
- Política de modelos: revisor de la spec 1 en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno previsto (las tasks van una tras otra) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** — JSON de otra forma o versión sin escenario → escenario «Un fichero con otra forma o versión es ilegible»
- **Aceptado** — `cancelar` sobre fichero roto sin cubrir → escenario «Un comando que cambia datos tampoco pisa un fichero ilegible»
- **Aceptado** — «no crea fichero» no cubría carpeta ni temporales → THEN ampliado
- **Aceptado** — escritura atómica sin escenario → escenario «Guardar deja un fichero completo» (sin temporal, JSON válido, `version` 1)
- **Rechazado en parte** — `mtime` del comando sin efecto → un test de `mtime` es frágil; el requisito pasa a «deja el fichero igual» (contenido idéntico, sin temporales) y la decisión 4 sigue diciendo que no se reescribe
- **Aceptado** — fichero con lista vacía y la reserva inicial → escenario «única fuente de verdad» y decisión 8
- **Aceptado** — vocabulario de `status` → decisión 8 y Límites
- **Rechazado** — renombrar claves a `reserva`/`sala` → son nombres de código ya existentes, no de interfaz; anotado en «Idioma de los nombres»
- **Aceptado** — Node 22 frente a `>=20` → decisión 14
- **Aceptado** — `operations.md` fuera del reparto → decisión 11 y «Dónde se prueba»

## Intent

Hoy el estado de las reservas vive en la memoria del proceso (ADR 0004): al cerrar la terminal se pierde y cada arranque empieza igual. Quien usa `salas` espera que una cancelación hecha ayer siga hecha hoy. Éxito: tras `salas cancelar Norte lun`, en un proceso nuevo `salas libres 10:00-12:00` responde `Norte, Sur`. Fracaso aunque «funcione»: perder o pisar reservas por un fichero que no se entiende, o dejar basura en la carpeta de quien solo consulta.

## Scope

- Entra: leer el estado de `~/.salas/reservas.json` (o `SALAS_DATOS`) al arrancar el CLI y guardarlo, de forma atómica, tras cada `cancelar` o `anular` con éxito; el aviso de fichero ilegible; los tests (almacén con ruta temporal y dos procesos seguidos); la línea «Motor de producción» de `.docs/sdd/steering/operations.md`.
- No entra: que `reservar` cree reservas de verdad (decisión 1); bloqueo entre terminales; migración de formatos; cambiar la lista fija de salas (ADR 0005); colores o formato de salida (ADR 0006); exportar a calendario (fila 0004).
- La ADR 0007 y el estado de la 0004 los escribe el cierre (`sdd-archive`), no esta feature.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «Cerrar la terminal pierde las reservas» | `.docs/sdd/decisions/0004-single-process-state.md:25` | decisión 10: ADR 0007 la sustituye; la 0004 es inmutable y solo cambia su `status` |
| «`src/` no importa `node:fs` ni ningún paquete de base de datos» (Confirmación) | `.docs/sdd/decisions/0004-single-process-state.md:29` | decisión 10: deja de cumplirse a propósito; sin chequeo automático que la vigile |
| «Motor de producción: sin base de datos; las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | Scope: se reescribe a «fichero JSON en `~/.salas/reservas.json`» |
| Estado solo en memoria (`bookings` inicializado en el módulo) | `src/app.js:3` | Scope: pasa a cargarse del fichero al arrancar el CLI |

- Filas que implementa: nada: comprobado con `git grep -n "0012" -- ROADMAP.md .docs/sdd/steering` (sin resultados); la fila 0004 del roadmap (exportar a `.ics`) no se toca.

## Approach

- **A. Fichero JSON en la carpeta personal** — un módulo pequeño de leer/guardar; sobrevive desde cualquier carpeta; cuesta decidir ruta, formato y qué hacer con un fichero roto (decisiones 3, 7 y 8).
- **B. Fichero junto a la carpeta desde la que se ejecuta** — más simple, pero abrir la terminal en otro sitio vuelve a empezar de cero: no cumple «sobrevivir a volver a abrir».
- **C. SQLite (`node:sqlite`)** — transacciones y concurrencia resueltas, pero exige Node ≥ 22.5 (el proyecto admite 20) y es desproporcionado para dos estados.
- Elegido: **A** — es lo más pequeño que cumple la petición y no añade dependencias (`node:fs` y `node:os` son del propio Node, la arquitectura sigue sin dependencias externas).

La persistencia vive solo en la entrada del CLI (`if (command)` de `src/app.js`): carga antes de `run` y guarda después si el comando cambió algo. `run` y sus tests actuales no cambian ni tocan el disco. El cómo exacto (módulo aparte o no, nombre de las funciones) es del plan.

## Dónde se prueba

- Cancelar y reabrir (`libres`, `cancelar` en un segundo proceso): lanzando `node src/app.js` dos veces con `SALAS_DATOS` apuntando a una carpeta temporal, como los tests actuales de `run` pero a nivel de proceso (la costura más alta que ve la terminal).
- Sin fichero, lectura que no crea fichero y fichero ilegible: por el mismo proceso y la misma ruta temporal.
- Escritura completa, formato y versión: por el mismo proceso, leyendo el fichero resultante; la línea de `operations.md` no tiene prueba, la revisa el dev-lead al validar.
- La experiencia real (cerrar y reabrir la terminal): la valida el dev-lead a mano.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: estado de las reservas en `~/.salas/reservas.json`, sustituye a la 0004 — alternativas descartadas: fichero junto al cwd, SQLite

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Las reservas sobreviven entre arranques

- GIVEN no hay fichero de reservas y la reserva inicial Norte lun 10:00-12:00 está activa
- WHEN se ejecuta `cancelar Norte lun` y, en un proceso nuevo, `libres 10:00-12:00`
- THEN el segundo proceso responde `Norte, Sur`
- AND en otro proceso nuevo `cancelar Norte lun` responde `sin reserva Norte lun`

#### ADDED — Anular también se conserva

- GIVEN no hay fichero de reservas y la reserva inicial Norte lun 10:00-12:00 está activa
- WHEN se ejecuta `anular Norte lun` y, en un proceso nuevo, `libres 10:00-12:00`
- THEN el segundo proceso responde `Norte, Sur`

#### ADDED — Consultar no crea fichero

- GIVEN no hay fichero de reservas
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Sur` y no se crea ni el fichero ni la carpeta `~/.salas/` (o la de `SALAS_DATOS`) ni ningún fichero temporal

#### ADDED — Un comando sin efecto deja el fichero igual

- GIVEN el fichero guarda Norte lun cancelada
- WHEN se ejecuta `cancelar Norte lun`
- THEN responde `sin reserva Norte lun`, el contenido del fichero queda idéntico y no queda ningún fichero temporal

#### ADDED — Fichero ilegible no se pisa

- GIVEN el fichero de reservas contiene `{roto`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN escribe en stderr `fichero de reservas ilegible: <ruta del fichero>`, sale con código 1 y el fichero sigue conteniendo `{roto`

#### ADDED — Un comando que cambia datos tampoco pisa un fichero ilegible

- GIVEN el fichero de reservas contiene `{roto`
- WHEN se ejecuta `cancelar Norte lun`
- THEN escribe en stderr `fichero de reservas ilegible: <ruta del fichero>`, sale con código 1 y el fichero sigue conteniendo `{roto`

#### ADDED — Un fichero con otra forma o versión es ilegible

- GIVEN el fichero contiene JSON válido pero `{"version": 2, "bookings": []}`, o `{"version": 1}` sin `bookings`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN escribe en stderr `fichero de reservas ilegible: <ruta del fichero>`, sale con código 1 y el fichero queda intacto

#### ADDED — El fichero, una vez creado, es la única fuente de verdad

- GIVEN el fichero contiene `{"version": 1, "bookings": []}`
- WHEN se ejecuta `libres 10:00-12:00`
- THEN responde `Norte, Sur` (la reserva inicial no reaparece)

#### ADDED — Guardar deja un fichero completo

- GIVEN no hay fichero de reservas
- WHEN se ejecuta `cancelar Norte lun`
- THEN el fichero contiene JSON válido con `version` 1 y Norte lun con `status` `cancelled`, y no queda ningún fichero temporal junto a él

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: fichero JSON `~/.salas/reservas.json`, o la ruta de `SALAS_DATOS` si está definida
- **Idioma de los nombres**: mensajes en castellano; claves del fichero en inglés (`room`, `day`, `slot`, `status`: nombres de código, como en `src/app.js`, no de interfaz)
- **Límites**: sin límite de reservas; solo se acepta `version` 1; `status` ∈ `active`, `cancelled`, `voided`
- **Avisos**: `fichero de reservas ilegible: <ruta>` en stderr con código de salida 1
- **Regla ante conflicto**: dos procesos a la vez no se bloquean; gana la última escritura

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
