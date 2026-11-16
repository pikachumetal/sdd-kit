---
id: 20261116-111950-feature-0012-persist-bookings
feature: 0012
title: Las reservas sobreviven a cerrar la terminal
mode: full
profile: delegate
status: in-review
created: 2026-11-16
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Las reservas sobreviven a cerrar la terminal

🦆 Hoy, si cancelas la reserva de Norte del lunes y cierras la terminal, al abrirla otra vez la reserva vuelve a estar activa: `salas libres 10:00-12:00` dice `Sur`. Con este cambio, `salas` guarda el estado en un fichero JSON de tu carpeta personal (`~/.salas/reservas.json`) cada vez que una orden cambia algo, y lo lee en cada orden; así, tras cancelar, el mismo `salas libres 10:00-12:00` dice `Norte, Sur` aunque hayas cerrado la terminal entre medias. Si el fichero está estropeado, `salas` se niega a seguir y no lo toca, en vez de arrancar vacío y pisarlo. Ojo: `reservar` hoy no crea reservas de verdad (solo contesta «reserva semanal creada»), así que lo que se nota es con `cancelar`, `anular` y `libres`.

Validación: dev-lead — lo usa una persona en su terminal: cerrar y reabrir es justo lo que hay que mirar.

## Capacidades

- Nuevas: `bookings` — dónde se guardan las reservas y qué pasa con el fichero (ausente, ilegible, de formato desconocido, no escribible).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: capacidad nueva (`bookings`), contrato público (formato del fichero que leerán las versiones futuras), datos (datos persistentes nuevos) · tamaño: ~120 líneas en 6 ficheros
- Dominio (sonnet): si los seis escenarios del delta cubren el ciclo cancelar → cerrar → reabrir sin dejar reservas fantasma, y si «solo se guarda cuando algo cambia» es coherente con la reserva de ejemplo (señal: capacidad nueva)
- Técnica (sonnet): si escritura atómica + `SALAS_ARCHIVO` bastan para probar con dos procesos reales y si el cambio de ADR 0004 está completo (señal: contrato público + datos)
- Mínimo razonable: solo técnica — deja sin mirar si el comportamiento observable tiene huecos (p. ej. qué ve quien tenga un fichero a medias)

1. Enfoque: fichero JSON, frente a SQLite y a un registro de eventos (ver Approach).
2. Ruta: `os.homedir()/.salas/reservas.json` (carpeta personal, no la actual; `<ruta>` en los mensajes es la ruta resuelta), sustituible con `SALAS_ARCHIVO` — la terminal reabierta puede estar en otra carpeta; la variable permite probar sin tocar el fichero de quien lo usa. La carpeta se crea si falta.
3. Formato: `{"version": 1, "bookings": [{"room","day","slot","status"}]}`. Claves en inglés como el código: decisión mía, ningún ADR la respalda (el 0002 solo cubre mensajes). Válido es: objeto con `version` igual a 1 y `bookings` array de entradas con `room`, `day` y `slot` texto y `status` en `active | cancelled | voided` (los valores que ya usa el código); no valido `room`/`day`/`slot` contra listas (la franja sin validar ya está en la deuda). Los valores de `status` salen de `src/app.js:3,16,23` (`active`, `cancelled`, `voided`). Una entrada con claves de más o de menos, o cualquier otra cosa, es «formato no reconocido»; las entradas duplicadas se aceptan tal cual (manda la primera activa, como hoy). Solo una reserva `active` cuenta como reserva. **Para que lo valides**: `PRODUCT.md` pide evitar «booking» y «room» como términos del producto; aquí son claves internas del fichero y el nombre de la capacidad (el kit exige un identificador en inglés), no texto que vea quien usa `salas`. Si prefieres claves en castellano (`sala`, `dia`, `franja`, `estado`), cambia esta decisión y el formato v1.
4. Primera ejecución sin fichero: se parte de la reserva de ejemplo de hoy (Norte lun 10:00-12:00), porque los tests y `libres` dependen de ella; se guarda sola en el primer cambio. Un fichero válido con `"bookings": []` es una lista vacía: no se reinyecta el ejemplo.
5. El fichero se lee en cada orden que usa el estado (`libres`, `cancelar`, `anular`) y no se cachea al importar el módulo: así los tests por `run` pueden fijar `SALAS_ARCHIVO` en cada test. `reservar` (que no usa el estado) y las órdenes desconocidas no leen el fichero, así que no cambian con uno estropeado.
6. Solo se escribe cuando una orden cambia algo (`cancelar` o `anular` con éxito): `libres` o un `cancelar` sin reserva no crean ni tocan el fichero.
7. Fichero ilegible (incluido el de 0 bytes) → error y salida 1, con el mensaje por stderr, sin tocarlo. Textos míos: `no se puede leer <ruta>: el contenido no es JSON válido` `no se puede leer <ruta>: formato no reconocido` y, si el sistema no deja leerlo (p. ej. la ruta es una carpeta), `no se puede leer <ruta>: <código>` con el código de Node (`EISDIR`, `EACCES`…). Alternativa descartada: arrancar vacío (perdería las reservas al siguiente guardado).
8. No se puede guardar → `no se puede guardar <ruta>: <código>`, con el código de error de Node (`EEXIST`, `ENOTDIR`, `EACCES`…, según plataforma: cualquiera vale; no es texto en inglés de nuestro código, ADR 0002), salida 1, y no se imprime `cancelada …`/`anulada …`: se guarda antes de imprimir.
9. Escritura atómica: fichero temporal en la misma carpeta, con el pid en el nombre, y renombrado; no queda ningún temporal tras guardar, y si el renombrado falla se borra el temporal. Si falla (p. ej. `EPERM` en Windows con el destino abierto), es el error de guardado de la decisión 8, sin reintentos. No tiene escenario propio: lo único observable es que no quedan temporales (cubierto en «Dónde está el fichero»); el fallo del renombrado no se puede forzar de forma portable y la revisión final del código lo mira.
10. Dos terminales a la vez: gana la última que escribe, sin bloqueos y sin prueba de concurrencia real (solo dos procesos seguidos). Es el riesgo que el ADR 0004 temía; con órdenes de un segundo y una sola persona, no merece un mecanismo.
11. El código del almacén vive en `src/app.js` (sin fichero nuevo): la arquitectura dice «un solo fichero de entrada». `scripts/lint.mjs` solo comprueba tabuladores en ese fichero; no cambia.
12. La ADR 0007 («Las reservas se guardan en un fichero JSON», `rutas: src/**`) sustituye a la 0004, y su paso a `superseded by 0007` y la 0007 son la primera task del plan, antes del código, para que la verdad viva no contradiga la rama. Confirmación de la 0007: `git grep -l node:fs -- src` devuelve solo `src/app.js`, no hay `node:sqlite` en `src/` y `package.json` no declara dependencias.
13. `operations.md` documenta `SALAS_ARCHIVO` y la ruta de los datos (y cambia «viven en memoria»), y `architecture.md` recoge el formato v1 como contrato.
14. Capacidad nueva declarada: `bookings`. No hay `MODIFIED`: no existe ninguna capacidad viva de `cancelar`/`anular`/`libres`, y los caminos de error nuevos son de guardado, así que van en `bookings`.
15. `reservar` sigue siendo un resguardo: crear reservas de verdad queda fuera y, cuando se haga, reutilizará este guardado. **Pendiente de ti**: si pensabas en reservas creadas con `reservar`, hace falta otra fila de roadmap antes.
16. Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` con esta versión de la spec: 9 requisitos y 5 reglas añadidos a `bookings.md`, sin rechazos; el repo no se toca.
- Política de modelos: revisores de la spec Sonnet (dominio y técnica) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** (Crítico, técnica) — la carga al importar choca con los tests por `run` → decisión 5: se lee en cada orden; «Dónde se prueba» ajustado.
- **Aceptado** (Crítico, técnica) — la ADR 0007 no puede esperar al cierre → decisión 12: primera task del plan, con `rutas` y Confirmación comprobable.
- **Aceptado** (Importante, dominio y técnica) — formato válido sin definir → decisión 3 y escenarios «formato no reconocido» y «válido sin reservas».
- **Aceptado** (Importante, dominio) — `libres` con fichero ilegible, 0 bytes → escenario de lectura ampliado.
- **Aceptado** (Importante, técnica) — GIVENs sin `SALAS_ARCHIVO` y ruta por defecto no probable → GIVENs con la variable y escenario con `HOME`/`USERPROFILE` temporales.
- **Aceptado** (Importante, técnica) — `<motivo>` no portable → decisión 8: código de error de Node con patrón comprobable.
- **Aceptado** (Importante, técnica) — atomicidad sin especificar → decisión 9 y comprobación de que no quedan temporales.
- **Aceptado** (Importante, técnica) — decisiones sin numerar y `operations.md`/`architecture.md` → decisiones 5, 7, 2, 13.
- **Aceptado** (Menor, dominio) — `<ruta>`, claves en inglés sin respaldo, 🦆 mezclado, «a diario» → decisiones 2 y 3, 🦆 y Intent reescritos.
- **Rechazado** (Importante, dominio) — `MODIFIED` no declarado en cancelar/anular/libres → no hay capacidad viva que modificar; decisión 14 lo deja escrito.
- **Rechazado** (Menor, técnica) — «Mínimo razonable: solo técnica» contradice el bloque → no: es el nivel más bajo defendible, no lo dispatchado. La parte de «dos terminales» sí se corrigió (decisión 10).
- **Rechazado** (Menor, dominio) — `PRODUCT.md` no existe → existe en la raíz del repo (el revisor lo buscó en `steering/`); aun así quito «a diario».
- **Rechazado** (Menor, técnica) — `engines` `>=20` frente a «Node 22» → incoherencia previa que no resuelve esta spec; el Approach la cita.

**Segunda ronda** (un revisor, Sonnet, tras aceptar dos Críticos):

- **Aceptado** (Importante) — error de lectura del sistema sin definir → decisión 7 y escenario con una carpeta.
- **Aceptado** (Importante) — patrón de guardado laxo → `[A-Z0-9]+` y «cualquier código» explícito (decisión 8).
- **Aceptado** (Importante) — «solo `active` cuenta» sin declarar → decisión 3 y `anular` tras `cancelar` en el escenario 1.
- **Aceptado** (Importante) — `reservar` y órdenes desconocidas con fichero ilegible → decisión 5: solo leen las órdenes que usan el estado, y un AND lo prueba.
- **Aceptado** (Menor) — Confirmación de la 0007 tautológica, origen de `status`, duplicados y claves extra, línea de `operations.md`, decisión 16 desfasada → decisiones 12, 3, 13 y 16.
- **Aceptado con matiz** (Importante) — «booking» y «room» frente a `PRODUCT.md` → se mantienen por ser internos y porque el kit exige el identificador en inglés; va a la decisión 3 para que lo valides.
- **Aceptado con matiz** (Importante) — la atomicidad sin escenario → el fallo del renombrado no se fuerza de forma portable; lo dice la decisión 9 y lo mira la revisión final.

### Decisiones tomadas con el dev-lead

- Alcance y perfil — «que las reservas sobrevivan a cerrar y volver a abrir la terminal. Perfil delegate. Escribe la spec y preséntamela.»

## Intent

Hoy el estado vive en memoria (ADR 0004) y cerrar la terminal lo borra todo: lo cancelado o anulado resucita. Importa porque quien la usa repite cada cancelación en cada sesión. Éxito: tras `salas cancelar Norte lun`, en un proceso nuevo `salas libres 10:00-12:00` da `Norte, Sur`. Anti-objetivos: perder o pisar reservas por un fichero estropeado; anunciar un cambio que no quedó guardado; que probar toque el fichero real de quien lo usa.

## Scope

- Entra: leer el fichero en cada orden que usa el estado y escribirlo tras cada cambio, en `src/app.js`; la ruta y `SALAS_ARCHIVO`; los errores de lectura, de formato y de escritura; tests con dos procesos reales; aislar los tests actuales con `SALAS_ARCHIVO` por test; ADR 0007 y estado de la 0004 (primera task); `operations.md` (línea 14, «Motor de producción»; más `SALAS_ARCHIVO` y la ruta de datos); `architecture.md` (formato v1); fila 0012 en `ROADMAP.md`.
- No entra: que `reservar` cree reservas; bloqueo entre procesos; copias de seguridad; migraciones de formato (solo existe la versión 1); validar `room`/`day`/`slot` contra listas ni la franja (deuda ya anotada); exportar (fila 0004); cambiar la lista de salas (ADR 0005).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «En memoria: cada arranque empieza vacío» y su Confirmación (`src/` no importa `node:fs`) | `.docs/sdd/decisions/0004-single-process-state.md:21,29` | decisión 12: ADR 0007 la sustituye; la 0004 pasa a `superseded by 0007` |
| «las reservas viven en memoria» | `.docs/sdd/steering/operations.md:14` | decisión 13: se reescribe |
| Estado solo en memoria, con la reserva de ejemplo fija, cargado al importar | `src/app.js:3` | Scope y decisiones 4 y 5: estado inicial sin fichero, leído en cada orden que usa el estado |
| Tests que importan `run` y comparten estado | `test/app.test.js:2`, `test/cancel.test.js:2` | decisión 5: cada test fija su `SALAS_ARCHIVO` temporal |
| `architecture.md` sin sección de datos | `.docs/sdd/steering/architecture.md` | decisión 13: se añade el formato v1 |

- Filas que implementa: ninguna previa (pedido directo); la 0012 se añade a Now · comprobado con `git grep -n 0012` (sin resultados).

## Approach

- Fichero JSON con la API síncrona de `node:fs` — sin dependencias (arquitectura), legible a mano, y el ADR 0004 ya lo nombraba como alternativa. Coste: sin consultas ni bloqueo.
- SQLite (`node:sqlite`) — consultas y transacciones, pero es experimental en Node 22 (avisos por stderr) y no existe en Node 20, que `package.json` admite con `engines >=20` (`architecture.md` dice Node 22: incoherencia previa que esta spec no resuelve). Coste alto para dos salas.
- Registro de eventos (fichero de solo añadir líneas) — robusto ante cortes sin renombrado, pero hay que reproducirlo al arrancar y no se puede editar a mano: complejidad sin demanda.
- Elegido: fichero JSON — es lo más simple que cumple el objetivo y encaja con «sin dependencias».

Cómo: en cada orden que usa el estado se resuelve la ruta (`SALAS_ARCHIVO` o `os.homedir()/.salas/reservas.json`); si no existe, el estado inicial de hoy; si existe, se valida (decisión 3) y ese es el estado. Cada cambio con éxito guarda antes de devolver su mensaje. `run` lanza un error con el mensaje literal si no puede leer o guardar; la entrada de línea de órdenes lo imprime por stderr y sale con 1.

## Dónde se prueba

- Persistencia entre ejecuciones: dos procesos reales `node src/app.js …` seguidos con el mismo `SALAS_ARCHIVO` temporal, como un usuario que cierra y reabre; patrón nuevo, en `test/persistence.test.js`, portable a Windows y Linux.
- Errores de lectura, formato y escritura: un proceso real con cada fichero estropeado y con una ruta imposible (padre que es un fichero), comprobando stdout, stderr con el patrón de la decisión 8, salida y que el fichero no cambia. Sin temporales sobrantes tras guardar.
- Ruta por defecto: un proceso real con `HOME` y `USERPROFILE` apuntados a un temporal.
- Comportamiento previo (`libres`, `cancelar`, `anular`): los tests actuales por `run`, ahora con su `SALAS_ARCHIVO` propio fijado en cada test.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: las reservas se guardan en un fichero JSON — alternativas descartadas: memoria del proceso (0004), SQLite. Es la 0007 de la decisión 12.

## Delta de comportamiento

### Capacidad: `bookings`

#### ADDED — Lo cancelado sigue cancelado al reabrir

- GIVEN `SALAS_ARCHIVO` apunta a `<tmp>/r.json`, que no existe, y la reserva de ejemplo Norte lun 10:00-12:00 está activa
- WHEN se ejecuta `salas cancelar Norte lun` y, en un proceso nuevo, `salas libres 10:00-12:00`
- THEN el primero imprime `cancelada Norte lun` y el segundo `Norte, Sur`
- AND con `salas anular Norte lun` en lugar de cancelar, el primero imprime `anulada Norte lun` y el segundo `Norte, Sur`
- AND repetir `salas cancelar Norte lun`, o `salas anular Norte lun`, en otro proceso imprime `sin reserva Norte lun`

#### ADDED — Sin fichero se parte de la reserva de ejemplo

- GIVEN `SALAS_ARCHIVO` apunta a un fichero que no existe
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN imprime `Sur`
- AND el fichero sigue sin existir

#### ADDED — Solo se guarda cuando algo cambia

- GIVEN `SALAS_ARCHIVO` apunta a un fichero que no existe
- WHEN se ejecuta `salas cancelar Sur mar` (no hay reserva)
- THEN imprime `sin reserva Sur mar`
- AND el fichero sigue sin existir

#### ADDED — Dónde está el fichero

- GIVEN `SALAS_ARCHIVO` vale `<tmp>/datos/r.json` y la carpeta `datos` no existe
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN existe `<tmp>/datos/r.json` con `"version": 1` y no queda ningún otro fichero en `datos`

#### ADDED — La ruta por defecto es la carpeta personal

- GIVEN `SALAS_ARCHIVO` sin definir y `HOME` y `USERPROFILE` apuntando a `<tmp>/casa`
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN existe `<tmp>/casa/.salas/reservas.json`

#### ADDED — Un fichero ilegible no se pisa

- GIVEN `SALAS_ARCHIVO` apunta a un fichero con el texto `{no es json` (o a uno de 0 bytes)
- WHEN se ejecuta `salas cancelar Norte lun` (o `salas libres 10:00-12:00`)
- THEN stderr dice `no se puede leer <ruta>: el contenido no es JSON válido`, el código de salida es 1, stdout queda vacío y el fichero conserva su contenido
- AND con `salas reservar Norte --cada-semana` imprime `reserva semanal creada` y sale con 0 (no lee el fichero)
- AND con `SALAS_ARCHIVO` apuntando a una carpeta, stderr casa con `^no se puede leer .+: [A-Z0-9]+$` y sale con 1

#### ADDED — Un formato desconocido tampoco se pisa

- GIVEN `SALAS_ARCHIVO` apunta a un fichero con `{"version": 2, "bookings": []}` (o con `{"version": 1, "bookings": [{"room": "Norte", "day": "lun", "slot": "10:00-12:00", "status": "hecha"}]}`)
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN stderr dice `no se puede leer <ruta>: formato no reconocido`, el código de salida es 1 y el fichero conserva su contenido

#### ADDED — Un fichero válido sin reservas no recupera el ejemplo

- GIVEN `SALAS_ARCHIVO` apunta a un fichero con `{"version": 1, "bookings": []}`
- WHEN se ejecuta `salas libres 10:00-12:00`
- THEN imprime `Norte, Sur`

#### ADDED — No se anuncia lo que no se guardó

- GIVEN `SALAS_ARCHIVO` apunta a una ruta cuyo padre es un fichero normal
- WHEN se ejecuta `salas cancelar Norte lun`
- THEN stderr casa con `^no se puede guardar .+: [A-Z0-9]+$`, el código de salida es 1, stdout no contiene `cancelada` y el padre sigue siendo un fichero normal

#### Reglas de la capacidad — bookings

- **Dónde viven los datos**: fichero JSON `os.homedir()/.salas/reservas.json`, sustituible con `SALAS_ARCHIVO`
- **Idioma de los nombres**: claves del fichero en inglés (como el código; decisión de esta spec); mensajes en castellano
- **Límites**: `version` solo vale 1; `status` solo vale `active`, `cancelled` o `voided`; una entrada lleva solo sus cuatro claves; cualquier otro caso es «formato no reconocido»
- **Avisos**: `no se puede leer <ruta>: el contenido no es JSON válido`, `no se puede leer <ruta>: formato no reconocido`, `no se puede leer <ruta>: <código>` y `no se puede guardar <ruta>: <código>`, siempre por stderr y con salida 1
- **Regla ante conflicto**: gana el último proceso que escribe; sin bloqueo

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
