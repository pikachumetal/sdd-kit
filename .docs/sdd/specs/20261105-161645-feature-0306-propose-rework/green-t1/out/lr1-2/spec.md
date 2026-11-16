---
id: 20261008-170000-feature-0019-manager-marks
feature: 0019
title: El responsable ve sus salas marcadas en libres
mode: lite
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — El responsable ve sus salas marcadas en libres

🦆 Hoy `libres 14:00-16:00` responde `Norte, Sur` y el responsable de Norte no distingue cuál es la suya. Con `libres 14:00-16:00 --como responsable` responderá `Norte*, Sur`: la sala que le toca lleva un `*` detrás. Sin `--como`, o con `--como cliente`, sigue respondiendo `Norte, Sur`. Por dentro, `libres` en `src/app.js` mira si el listado se pide como responsable y añade el `*` a las salas que el programa guarda como suyas.

Validación: dev-lead — es lo que lee una persona en la terminal.

## Capacidades

- Nuevas: `rooms` — el listado de salas libres y cómo lo ve cada rol; hoy no hay ninguna capacidad escrita, esta la abre con la marca del responsable.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor (lite) — señales: capacidad nueva, visibilidad por rol · tamaño: ~15 líneas en 2 ficheros
- Técnica y dominio juntos (sonnet): si `libres <franja> --como responsable` encaja con el `libres <franja>` que hay hoy y si el dato «Norte es de este responsable» está dicho o inventado (señal: capacidad nueva + rol)
- Mínimo razonable: sin revisor — deja sin cubrir lo que el rol cliente no debe ver, el hueco que no se nota hasta que alguien lo prueba

1. La marca es un `*` detrás del nombre de la sala: `Norte*`.
2. **El comando conserva la forma de hoy**: `libres <franja> [--como responsable|cliente]`, sin `<día>` y con `--como <valor>` tras la franja, en minúsculas y separado por espacio (otras formas, como `--como=responsable`, no se tratan: caen en la decisión 8). El código de hoy solo recibe la franja y la spec no cambia ese contrato.
3. **Capacidad nueva `rooms`** (nombre en inglés, kebab-case): `.docs/sdd/capabilities/` no existe, así que no hay nada que modificar.
4. **De quién es cada sala**: hoy el producto no guarda responsables (la 0011 los traerá). Como solo hay una sala con responsable en el ejemplo, la 0019 fija en el código que el responsable es de `Norte`. Es lo que más me gustaría que mirases: si prefieres esperar a la 0011, esta feature se aparca.
5. `--como cliente` y la ausencia de `--como` listan igual, sin marca ni dato de responsables.
6. El ejemplo usa la franja `14:00-16:00` porque `Norte` ya tiene una reserva activa en `10:00-12:00` y no saldría libre; el test parte de esas reservas tal cual están hoy en `src/app.js`.
7. **`--como` no es identidad**: cualquiera que pase `--como responsable` ve la marca; no hay sesión ni login (`operations.md`: «sin login»). Es una vista, no un permiso.
8. Un valor de `--como` que no sea `responsable` ni `cliente`, o `--como` sin valor, se ignora y lista sin marca. Lo decido yo: nadie lo dijo.
9. La 0019 no tiene fila en `roadmap.md`: o se da de alta antes de implementar, o va sin ella. Lo decides tú.
- Política de modelos: un revisor de spec en Sonnet (dos rondas, en serie) · sin revisión final por ejes (lite) · sin otros despachos en paralelo.
- Fusión de la capacidad (probada en una copia de `.docs/sdd` en la carpeta temporal): `rooms.md: añadido «El responsable ve sus salas marcadas»` y `rooms.md: añadido «Solo se marca lo que está libre»` (salida 0, sin rechazos; repetida tras los hallazgos); el `capabilities/` del repo no cambia.

### Hallazgos de la review

- **Aceptado** — el GIVEN «el responsable de Norte» no se puede preparar en un test → ahora dice «Norte fijada en el código como la sala del responsable»
- **Aceptado** — `--como` es autodeclarado → decisión 7: es una vista, no un permiso
- **Aceptado** — faltan escenarios de Norte ocupada y de `--como` inválido → un requisito nuevo y un AND, con la decisión 8
- **Aceptado** — qué no ve el cliente → decisión 5
- **Aceptado** — la fila de roadmap era una decisión abierta en el cuerpo → decisión 9; y la precondición de las reservas, en la decisión 6
- **Aceptado** — confianza alta con decisiones abiertas → media
- **Aceptado, sin cambio de texto** — el AND de «sin `--como`» fija el comportamiento actual en `rooms`: queda, porque es la regresión que importa y `rooms` nace aquí
- **Rechazado** — `libres` frente a `salas libres` (changelog) → `libres` es el comando que ejecuta `run`, y `src/app.js` y el test lo usan así; el changelog usa el nombre histórico de la 0006
- **Ronda 2 · Aceptado** — Intent contradecía la decisión 7 → reformulado; sintaxis de `--como` → decisión 2; política de modelos → sin cláusula de paralelizar; historia del borrador fuera de la decisión 2
- **Ronda 2 · Rechazado** — renombrar `rooms` a `salas` → el slug de una capacidad va en inglés kebab-case por regla del kit, aunque el contenido vaya en castellano
- **Ronda 2 · Rechazado** — más escenarios de salas ocupadas y variantes de `--como` → en lite bastan dos requisitos; lo no dicho cae en la decisión 8
- **Ronda 2 · Sin cambio** — ayuda y docs: `grep` de `libres` en README y PRODUCT no da nada, solo el changelog (histórico); sin ronda 3, ningún Crítico
- **Ronda 2 · Para el gate** — el dato «Norte es del responsable» (decisión 4) y la fila de roadmap (decisión 9) siguen abiertos a propósito: los decides tú
- **Rechazado** — subir a full por capacidad nueva con rol → el dev-lead confirmó lite con sus cinco condiciones, y el cambio cabe en un módulo sin contrato nuevo salvo un flag opcional

### Decisiones tomadas con el dev-lead

- Modo lite, con sus cinco condiciones citadas — «sí, lite»

## Intent

El responsable de sala no ve de un vistazo cuáles de las salas libres son suyas. Éxito: con `--como responsable`, su sala sale con `*` y ninguna otra; fracaso aunque funcione: que la marca salga sin pedir `--como responsable`, o que cambie el listado de siempre. La marca es una vista, no una barrera de confidencialidad.

## Scope

- Entra: `libres <franja> --como responsable` marca sus salas. Cambio en `src/app.js` y su test.
- No entra: `--como cliente` y el `libres` sin `--como`, que listan igual que hoy; guardar responsables como dato (la 0011); el día en el comando.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira; `libres <franja>` sin `--como` conserva su salida | `src/app.js:28`, `test/app.test.js:5`, `.docs/sdd/changelog.md:10` (nombra `salas libres 10:00-12:00`) | Scope: sin cambio |

- Filas que implementa: 0019 → no tiene fila en `roadmap.md` (comprobado con `grep -rn 0019 .docs/sdd/roadmap.md`): hay que dar de alta la fila o aceptar que va sin ella.

## Approach

`libres` acepta `--como responsable|cliente` tras la franja; con `responsable`, añade `*` a las salas libres que son del responsable.

## Dónde se prueba

- La marca: por `run('libres', …)`, en `test/app.test.js`, como el test de `libres` que ya hay.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — El responsable ve sus salas marcadas

- GIVEN Norte y Sur libres de 14:00 a 16:00, y Norte fijada en el código como la sala del responsable
- WHEN `libres 14:00-16:00 --como responsable`
- THEN responde `Norte*, Sur`
- AND con `--como cliente` responde `Norte, Sur`
- AND sin `--como` responde `Norte, Sur`
- AND con `--como admin` o con `--como` sin valor responde `Norte, Sur`

#### ADDED — Solo se marca lo que está libre

- GIVEN Norte con una reserva activa de 10:00 a 12:00 y Sur libre
- WHEN `libres 10:00-12:00 --como responsable`
- THEN responde `Sur`

### Estimación y esfuerzo

- Tipo: backend
- Esfuerzo spec: 0,2 h
- Estimación de implementación: 0,5 h
- Base de la estimación: un comando y su test
- Confianza: media — depende de que el dato del responsable (decisión 4) se acepte tal cual

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
