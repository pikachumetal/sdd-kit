---
id: 20261108-214900-feature-0008-lista-espera
feature: 0008
title: Lista de espera para salas ocupadas
mode: full
profile: delegate
status: draft
created: 2026-11-08
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Lista de espera para salas ocupadas

🦆 Hoy, si la sala que quieres está ocupada, solo sabes que no está libre y la petición se pierde. Con esta feature escribes `espera Norte 10:00-12:00` y la herramienta responde `Norte ocupada; en espera (1.º)`: queda apuntado que quieres esa sala en esa franja y en qué puesto estás. Cada vez que lo repites, tu apunte cuenta como uno más (`(2.º)`, `(3.º)`…). Si la sala está libre, te dice que reserves directamente. De momento solo apunta y cuenta; no te avisa ni te reserva sola cuando la sala se libera.

Validación: dev-lead — es comportamiento que usa una persona desde la terminal.

## Capacidades

- Nuevas: `waitlist` — apuntarse a una sala ocupada en una franja y saber el puesto.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva · tamaño: ~40 líneas en 2 ficheros
- Único (sonnet, ya ejecutado): los escenarios del delta frente a `freeRooms` y a las salas `Norte` y `Sur` de `src/app.js`, y que el «No entra» cubra lo que el Intent no promete
- Mínimo razonable: sin review — deja sin mirar si un escenario contradice el comportamiento de `libres`

0. **⚠️ DECISIÓN QUE NECESITO DE TI: ¿la lista persiste entre ejecuciones?** Como está escrita (✋ 3), la lista vive en memoria y cada orden de la terminal es un proceso nuevo: en uso real el puesto sería siempre `1.º` y la feature no serviría. Lo recomendado es que persista en un fichero (`espera.json` en la carpeta desde la que ejecutas); añade un fichero y un efecto fuera del proceso. Alternativa: dejarla en memoria y aceptar que solo sirve dentro de una misma sesión (p. ej. en tests). No lo he metido en el Scope sin que lo decidas.
1. **El porqué de la feature es una suposición mía.** Pediste la lista de espera sin contar el caso que la motiva; lo dejo **pendiente**: si el motivo real es otro (p. ej. que te avise al liberarse), el alcance cambia. — no lo inventé: lo marco para que lo corrijas al aprobar.
2. Enfoque (nadie lo elige en `delegate`): una lista en memoria por pareja sala+franja, con un comando nuevo `espera <sala> <franja>`. Descarto (a) colgarlo de `reservar`, porque `reservar` hoy solo existe como `--cada-semana` y mezclaría dos cambios; (b) un fichero en disco, porque las reservas actuales son una constante en `src/app.js` y no hay dónde persistir.
3. Es solo en memoria: se pierde al terminar el proceso. Coherente con que las reservas son una constante hoy; **limitación real**: entre dos ejecuciones de la terminal la lista no se conserva. Si necesitas que persista, es otra feature.
4. Textos literales: ocupada → `<sala> ocupada; en espera (<n>.º)`; libre → `<sala> está libre: reserva directamente`; sala inexistente → `sala desconocida: <sala>`.
5. **Sin identidad de persona**: la herramienta no sabe quién pide (la misión dice que la usas solo tú), así que cada `espera` es un apunte nuevo y repetir el comando suma otro puesto; no hay «ya estabas en espera». Si más adelante hay nombres, se revisa. El puesto es por orden de llegada y por pareja sala+franja (no por día, igual que `libres`, que tampoco distingue día).
6. Capacidad nueva: `waitlist` (inglés, kebab-case).
7. Delta probado en una copia de `.docs/sdd`: `sdd capability merge` añade los 4 requisitos y las 5 reglas de `waitlist.md` sin rechazos (el repo no cambia hasta el cierre). Nota: ahora son 4 requisitos tras quitar «ya estabas».
8. Política de modelos: un revisor de la spec en sonnet · revisión final con Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

### Hallazgos de la review

1. **Aceptado** (Crítico) — con la lista en memoria el puesto es siempre 1.º en uso real → elevado como ✋ 0 y limitación en ✋ 3; el Scope no cambia hasta que el dev-lead decida. No lo rechazo: lo decide el gate.
2. **Aceptado** (Crítico) — el valor depende del porqué (✋ 1) → se mantiene pendiente y visible.
3. **Aceptado** — franja ausente, minúsculas y orden de comprobación → pasan a «No entra» (sin definir).
4. **Aceptado** — «sala libre» no era verificable → el escenario comprueba que no se crea cola y añade `Norte` en otra franja.
5. **Aceptado** — el día se ignora, dicho en el GIVEN; regla ante conflicto pasa a «no aplica».
6. **Aceptado** — idioma de los nombres aclarado; `waitlist` queda como identificador técnico (✋ 6).
7. **Aceptado** — quitada la frase de paralelismo contradictoria.
8. **Aceptado** — ficheros tocados y reinicio entre tests en el Scope y el Approach; «consulta» quitada.
9. **Aceptado** — grep acotado con `-w` a `src test README.md`.
10. **Aceptado** — referencia al roadmap cambiada por la fila 1, que sí existe; el choque con la misión de un solo usuario queda en ✋ 1 y ✋ 5.

### Decisiones tomadas con el dev-lead

- Carril feature, modo full, perfil delegate — «sí, adelante: feature full con delegate»

## Intent

Hoy `libres <franja>` dice qué salas están libres, pero si la que quieres está ocupada no queda rastro de que la querías. Se quiere poder apuntarse a esa sala y franja y saber en qué puesto se está. Éxito: `espera Norte 10:00-12:00` responde `Norte ocupada; en espera (1.º)` y un segundo apuntado ve `(2.º)`. Fracaso aunque funcione: que apunte a alguien en una sala libre o que cuente mal el puesto. El porqué concreto está pendiente (✋ 1).

## Scope

- Entra: comando `espera <sala> <franja>` en `src/app.js` con sus tests en `test/app.test.js`; puesto por orden de llegada; respuesta distinta si la sala está libre o no existe.
- No entra: consultar la lista; avisos de franja o argumentos ausentes o mal formados y sala en minúsculas (`espera Norte` o `espera norte 10:00-12:00` no están definidos); avisar o reservar automáticamente al liberarse la sala (lo más cercano es la fila 1 del roadmap, avisos por correo); baja de la lista; persistencia entre ejecuciones; distinguir el día; cambiar `libres`, `reservar` o `cancelar`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | `git grep -nw "espera\|waitlist" -- src test README.md` no da resultados | Scope: solo se añade un comando |

- Filas que implementa: nada: comprobado con `git grep -n "0008" -- . ':!.docs/sdd/specs'`

## Approach

Una lista por pareja sala+franja y un comando `espera` que la amplía y devuelve el puesto (✋ 0, 2 y 3); no hay comando de consulta. Toca `src/app.js` y `test/app.test.js`, y el estado de la lista se reinicia entre tests. El cómo exacto va en el plan.

## Dónde se prueba

- Apuntarse a sala ocupada, puesto, varios apuntes, sala libre y sala inexistente: por `run('espera', [...])`, como los tests actuales de `test/app.test.js`.

## Términos y ADR

- Términos resueltos: lista de espera — apuntes por orden de llegada para una sala y franja ocupadas
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `waitlist`

#### ADDED — Apuntarse a una sala ocupada

- GIVEN `Norte` reservada en `10:00-12:00` (el día se ignora, como en `libres`) y nadie en espera
- WHEN `espera Norte 10:00-12:00`
- THEN responde `Norte ocupada; en espera (1.º)`

#### ADDED — El puesto sigue el orden de llegada

- GIVEN `Norte` ocupada en `10:00-12:00` con un apunte ya en espera
- WHEN `espera Norte 10:00-12:00`
- THEN responde `Norte ocupada; en espera (2.º)`

#### ADDED — Una sala libre no tiene lista de espera

- GIVEN `Sur` sin reserva en `10:00-12:00`, y `Norte` ocupada solo en `10:00-12:00`
- WHEN `espera Sur 10:00-12:00`, y después `espera Norte 14:00-16:00`
- THEN la primera responde `Sur está libre: reserva directamente` y la segunda `Norte está libre: reserva directamente`; ninguna crea cola, y un `espera Norte 10:00-12:00` posterior da `(1.º)`

#### ADDED — Sala desconocida

- GIVEN las salas son `Norte` y `Sur`
- WHEN `espera Este 10:00-12:00`
- THEN responde `sala desconocida: Este`

#### Reglas de la capacidad — waitlist

- **Dónde viven los datos**: en memoria del proceso; se pierde al terminar.
- **Idioma de los nombres**: los textos que ve el usuario, en castellano (constitución, art. 4); el identificador `waitlist` de la capacidad es un nombre técnico en inglés (✋ 6).
- **Límites**: sin tope de apuntes: el volumen de un uso personal no lo justifica.
- **Avisos**: los literales de ✋ 4.
- **Regla ante conflicto**: no aplica: no hay identidad ni reserva automática; el único orden es el de llegada (✋ 5).

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
