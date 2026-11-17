---
id: 20261008-190000-feature-0021-slot-check
feature: 0021
title: Franja no válida en libres
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Fixture
    approved_at: null
---

# Spec — Franja no válida en libres

🦆 Hoy, si en conserjería escriben `libres 10:00-10:00` (una franja de cero minutos) o `libres 12:00-10:00` (al revés), la herramienta contesta `Norte, Sur` como si hubiera dos salas libres. Con este cambio contesta «franja no válida: el final va después del inicio» y no lista ninguna sala. `libres 10:00-12:00` sigue contestando `Sur`, porque Norte está reservada. Por dentro, `run('libres', …)` comprueba la franja antes de llamar a `freeRooms`, que no cambia.

Validación: dev-lead — lo usa una persona (conserjería) y lo que ve es el texto de la respuesta.

## Capacidades

- Nuevas: `rooms` — qué responde la consulta de salas libres por franja.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`rooms`) · tamaño: ~15 líneas en 2 ficheros (`src/app.js`, `test/app.test.js`)
- Dominio y técnica (sonnet): si los escenarios de `Rechazar una franja no válida` cubren el caso de conserjería (`10:00-10:00`) y su inverso, y si la regla «solo se comprueba una franja con forma `HH:MM-HH:MM`» deja `libres` sin argumento igual que hoy (señal: capacidad nueva)
- Mínimo razonable: este mismo revisor; dejarlo sin review deja sin mirar si el delta contradice lo que `libres` hace hoy, que ninguna capacidad describe todavía

1. Capacidad nueva `rooms` (slug en inglés, contenido en castellano): no existe ningún fichero en `capabilities/`, así que el comportamiento de `libres` entra con `ADDED`, no con `MODIFIED`. Incluye el requisito «Ver las salas libres», que describe lo que `libres` ya hace hoy (sin cambiarlo) para que el rechazo tenga su contexto.
2. El caso que reportó conserjería, `libres 10:00-10:00` (hoy responde `Norte, Sur`; comprobado ejecutando `run`), tiene su propio escenario: es el caso que esta spec cierra. La franja invertida, `12:00-10:00`, es el segundo.
3. «Franja no válida» significa: el final no es posterior al inicio. Una franja de cero minutos también lo es.
4. El texto de la respuesta: «franja no válida: el final va después del inicio» (castellano, constitución 4). Es la misma frase para el caso igual y para el invertido.
5. Solo se comprueba una franja con forma `HH:MM-HH:MM`; cualquier otra (`libres` sin argumento, `libres abc`) se comporta como hoy. El formato es la fila de deuda «Sin validación del formato de franja horaria» y no entra.
6. La comparación es de texto (`HH:MM` con ceros a la izquierda ordena como la hora). Siguen como hoy, y van a esa misma fila de deuda: una hora sin cero (`9:00-08:00` no tiene la forma y pasa) y una hora imposible con forma válida (`25:00-26:00`, `10:99-11:00` se comparan como texto y pasan si el final es mayor).
7. Enfoque: comprobar en `run('libres', …)`, antes de `freeRooms`, frente a comprobar dentro de `freeRooms` (devolvería una lista o un texto según el caso, y mezcla consulta y mensaje) y frente a un módulo nuevo (una sola comparación no lo justifica). Ver Approach.
8. Fila de roadmap: ninguna. Con `ids.mode: sequence` el id 0021 lo da la rama `feature/0021-slot-check`; `git grep 0021` fuera de las specs no encuentra fila.
9. Reglas de la capacidad: solo «Avisos» (el texto de la decisión 4) e «Idioma» (castellano); datos, límites y conflicto, «no aplica».
### Hallazgos de la review

- **Aceptado** — el escenario `10:00-12:00` duplicado dentro de «Rechazar…» y el GIVEN «del lunes», que `libres` no recibe → quitado el duplicado; «Ver las salas libres» lo conserva sin «del lunes».
- **Aceptado** — `libres` sin franja no es un rechazo → movido a «Ver las salas libres», con `libres abc` (escenario nuevo, `Norte, Sur`).
- **Aceptado** — horas imposibles y `9:00-08:00` sin declarar → decisión 6 y «Límites» lo dicen, con la fila de deuda como destino.
- **Aceptado** — los «no aplica» sin justificar y «Avisos» sin el caso de otra forma → justificado y completado en «Reglas de la capacidad».
- **Aceptado** — dos niveles de review incompatibles → unificado el bloque de review.
- **Rechazado** — «Ver las salas libres» es captura retroactiva y no cubre «sin salas libres» → una capacidad nueva solo puede describir lo que hoy hace; el requisito se limita a lo que prueban sus tres escenarios, y «ninguna sala libre» no se puede montar con las dos salas y la reserva actuales.
- **Rechazado** — citar por contenido y no por número de línea → las líneas se comprobaron hoy con `git grep` y el plan se escribe sobre este mismo árbol; cada cita lleva también el contenido.
- **Rechazado** — `reservar` puede pasar una franja inválida → `reservar` no llama a `freeRooms` ni valida franjas en el código actual y ya está fuera por el Scope («No entra»).
- **Rechazado** — slug `rooms` contra «Evitar: room» → el slug es un nombre de fichero y la regla 1 de `capability-template.md` lo exige en inglés; está en la decisión 1 para que lo valides.
- **Rechazado** — quién es Fixture y cómo reproducir el merge → `approvers` lleva `git config user.name` y el comando es el de la pasada de coherencia (`sdd capability merge --path <copia> --artifact spec.md`).

Sin Críticos aceptados ni decisión central reescrita: no hay segunda ronda.

- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

Delta probado con `sdd capability merge` sobre una copia de `.docs/sdd` en una carpeta temporal: sale bien (`rooms.md: añadido «Ver las salas libres»`, `añadido «Rechazar una franja no válida»` y sus cinco reglas). La primera versión, con `MODIFIED` sobre una `rooms` inexistente, la rechazó y es la que corregí.

### Decisiones tomadas con el dev-lead

- Perfil `delegate` — del proyecto (`sdd-kit.json`), sin cambio.

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque el final no sea posterior al inicio: `libres 10:00-10:00` contesta `Norte, Sur`. Eso engaña a conserjería, que cree que hay salas libres en una franja que no existe. Éxito: ante una franja cuyo final no es posterior al inicio, la respuesta es el aviso de la decisión 4 y ninguna sala; ante una franja válida, la respuesta no cambia. Fracaso aunque «funcione»: que `libres 10:00-12:00` deje de contestar `Sur`, o que `libres` sin argumento falle donde hoy no lo hace.

## Scope

- Entra: `run('libres', …)` en `src/app.js`, y sus pruebas en `test/app.test.js`.
- No entra: `freeRooms` (no cambia); el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria» (`.docs/sdd/steering/debt.md:7`); `reservar`, `cancelar` y `anular`.

## Lo que se retira o cambia de forma

Nada se retira ni cambia de forma: la salida de una franja válida es la de hoy. Búsqueda: `git grep -n -iE "franja|libres" -- . ':!.docs/sdd/specs' ':!.docs/sdd/changes'`.

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La respuesta de `libres` ante una franja sin final posterior al inicio | `src/app.js:28` | delta, `ADDED` «Rechazar una franja no válida» |
| Fila de deuda sobre el formato de la franja | `.docs/sdd/steering/debt.md:7` | Scope («No entra»): se queda como está |
| Entrada del changelog «Listado de salas libres por franja» | `CHANGELOG.md:10` | sin cambio: es historia de la 0006 |
| Término «Reserva» | `PRODUCT.md:11` | sin cambio: la spec no toca el vocabulario |
| Test de franja válida | `test/app.test.js:5-6` | sin cambio: sigue pasando |

- Filas que implementa: nada: comprobado con `git grep -n "0021" -- . ':!.docs/sdd/specs'` (sin resultados)

## Approach

- Comprobar en `run('libres', …)`, antes de `freeRooms` — una comparación y un `return`; `freeRooms` sigue siendo una consulta pura y el mensaje de respuesta vive donde viven los demás (`run`).
- Comprobar dentro de `freeRooms` — obliga a que devuelva a veces una lista y a veces un texto, o a lanzar una excepción que `run` tendría que traducir.
- Un módulo nuevo `slot.js` — una comparación de dos cadenas no lo justifica.
- Elegido: la primera — la más pequeña que deja la consulta sin tocar.

Partes del cómo que fija: se separa `params[0]` en dos por el guion solo si tiene forma `HH:MM-HH:MM` (decisión 5) y se compara el texto del final con el del inicio; si el final no es mayor, se devuelve el aviso.

## Dónde se prueba

- Franja de cero minutos y franja invertida: por `run('libres', …)`, en `test/app.test.js`, como el test de franja válida que ya hay.
- Franja válida, `libres` sin argumento y `libres abc`: los mismos tests, por `run`; el de la franja válida ya existe.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

- GIVEN las salas Norte y Sur
- WHEN `libres` sin franja
- THEN responde `Norte, Sur`, como hoy, sin el aviso

- GIVEN las salas Norte y Sur
- WHEN `libres abc`
- THEN responde `Norte, Sur`, como hoy, sin el aviso (el formato es la fila de deuda)

#### ADDED — Rechazar una franja no válida

- GIVEN las salas Norte y Sur, sin reservas en la franja
- WHEN `libres 10:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

- GIVEN las salas Norte y Sur, sin reservas en la franja
- WHEN `libres 12:00-10:00`
- THEN responde «franja no válida: el final va después del inicio»
- AND no lista ninguna sala

#### Reglas de la capacidad — rooms

- **Dónde viven los datos**: no aplica: el delta no crea datos; salas y reservas siguen donde están
- **Idioma de los nombres**: castellano (constitución 4)
- **Límites**: solo se valida una franja con forma `HH:MM-HH:MM`, comparada como texto; el formato y las horas imposibles son la fila de deuda
- **Avisos**: «franja no válida: el final va después del inicio», cuando el final de la franja no es posterior al inicio; una franja con otra forma no avisa
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | | pendiente |
