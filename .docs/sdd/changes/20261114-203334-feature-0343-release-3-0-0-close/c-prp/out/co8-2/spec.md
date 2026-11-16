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
  - name: Laura
    approved_at: null
---

# Spec — Franja no válida en libres

🦆 Hoy `libres 10:00-10:00` (el caso reportado) responde `Norte, Sur`, como si hubiera salas libres en una franja de cero minutos. Con este cambio responde solo «franja no válida: el final va después del inicio», igual que `libres 12:00-10:00`; `libres 10:00-12:00` sigue respondiendo `Sur`, y `libres 9:00-10:00` sigue respondiendo `Norte, Sur`. Por dentro, `libres` comprueba la franja antes de buscar salas.

Validación: dev-lead — es lo que ve quien teclea `libres`; la respuesta nueva se mira a mano.

## Capacidades

- Nuevas: `rooms` — las salas y su consulta de libres por franja.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: un revisor — señales: capacidad nueva (`rooms`) · tamaño: ~20 líneas de código y ~40 de capacidad en 3 ficheros
- Dominio (sonnet): si los escenarios de «Ver las salas libres por franja» cubren el caso reportado (`10:00-10:00`) y lo que no debe romperse (`9:00-10:00`, `tarde`), y si «Avisos» lleva el literal exacto del THEN (señal: capacidad nueva)
- Técnica (sonnet): si comparar en minutos mantiene `libres 10:00-12:00` → `Sur` y deja intacto lo que no tiene forma `HH:MM-HH:MM` (señal: tamaño; Scope en `run` y la función nueva)
- Mínimo razonable: el mismo revisor con los siete puntos — no deja nada sin cubrir salvo la segunda lente por separado

1. Capacidad nueva `rooms` (slug en inglés kebab-case, como pide la plantilla de capacidades; el contenido va en castellano): no hay ninguna en `capabilities/`, y el requisito de libres tiene que vivir en una. Su único requisito, «Ver las salas libres por franja», recoge también el comportamiento que ya existía (`10:00-12:00` → `Sur`) para que la capacidad no nazca coja.
2. El caso reportado, `libres 10:00-10:00` (hoy responde `Norte, Sur`, `src/app.js:5`), se rechaza: es el caso que esta spec cierra.
3. Franja no válida = el final no es posterior al inicio (igual o anterior). Cruzar la medianoche (`23:00-01:00`) cuenta como no válida: hoy `libres` no tiene noción de día.
4. El texto de la respuesta: «franja no válida: el final va después del inicio». Sale solo, sin salas, por stdout y con el mismo código de salida que hoy (`console.log`, 0).
5. Forma reconocida: `H:MM` o `HH:MM`, un guion, `H:MM` o `HH:MM` (regex `^\d{1,2}:\d{2}-\d{1,2}:\d{2}$`, que solo decide cuándo se compara, no valida el formato). Con esa forma se compara en minutos (`9:00-10:00` válida, `9:00-8:00` no válida); el rango de horas y minutos (`24:70`) no se mira. Una franja sin esa forma (`tarde`) no se toca: sigue como hoy, porque su formato es la fila de deuda «Sin validación del formato de franja horaria».
6. Enfoque: función pura que valida la franja y la llama `run('libres', …)` antes de `freeRooms`, frente a validar dentro de `freeRooms` y a comparar el texto (ver Approach).
7. Delta probado en una copia de `.docs/sdd`, repetido tras los cambios de la review: `sdd capability merge` → «rooms.md: añadido «Ver las salas libres por franja»» y las cinco reglas añadidas, exit 0, sin rechazos; `capabilities/` del repo sin cambios.
8. Carril full y no patch: la constitución manda los bugs deterministas por patch, pero este cambio añade seis escenarios nuevos (más de un test de comportamiento nuevo) y crea la capacidad `rooms`.
9. Cuándo una reserva excluye una sala no cambia: `libres` quita la sala cuya reserva activa tiene la franja idéntica al texto recibido (por eso `9:00-10:00` y `tarde` dan `Norte, Sur`, como hoy).
- Política de modelos: un revisor de la spec en sonnet · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo, hasta `control.maxParallelAgents` si los hubiera — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario

### Hallazgos de la review

- **Aceptado** — Crítico: nada cubre que una franja de forma no estándar siga como hoy → decisión 5 definida con regex y tres escenarios más (`9:00-10:00`, `9:00-8:00`, `tarde`) y sus tests.
- **Aceptado** — el GIVEN llevaba «del lunes» y `libres` no recibe día → el GIVEN dice «la reserva de Norte de 10:00 a 12:00» y `libres` solo mira la franja.
- **Aceptado** — los THEN solo fijaban el texto → «responde solo el aviso, sin salas»; canal y código de salida sin cambio (decisión 4).
- **Aceptado** — Scope nombraba `freeRooms` contra el Approach A → `freeRooms` sale del «Entra».
- **Aceptado** — forma `HH:MM` sin definir → decisión 5.
- **Aceptado** — medianoche sin decidir → decisión 3. `reservar` con franjas vacías → anotado en «No entra».
- **Aceptado** — política de modelos con dos instrucciones de paralelismo → una sola.
- Segunda ronda (un revisor sonnet, sin Críticos):
- **Aceptado** — carril full sin justificar → decisión 8. «Un test por escenario» listaba cuatro de seis → «Dónde se prueba» enumera los seis. Medianoche sin escenario → añadido `23:00-01:00`. Criterio de solape no declarado → decisión 9. «Límites» decía «no aplica» → lleva los dos límites. Avisos y regex con formas distintas → Avisos dice «`H:MM` o `HH:MM`» y la decisión 5 aclara que la regex solo decide cuándo se compara.
- **Rechazado** — «`src/app.js:5` y `:28` se contradicen»: son dos sitios distintos (`freeRooms` en la 5, el `run` de `libres` en la 28). Franja ausente o `10:00-` sin escenario: quedan en la deuda del formato, «No entra». El id 0021 sin fila en ROADMAP y quién valida (Laura): lo señalo al presentar, no es de la spec.
- **Rechazado** — slug en castellano (`salas`): la regla 1 de `capability-template.md` fija el slug en inglés kebab-case aunque el contenido vaya en castellano; PRODUCT evita «room» en el texto del producto, no en un nombre de fichero. Queda dicho en la decisión 1.
- **Rechazado** — sustituir a Laura: el aprobador viene de la cabecera que dejó el dev-lead. Sí he quitado «conserjería» del texto («el caso reportado»). PRODUCT.md dice que no hay más usuarios que el autor: si Laura es otra persona, conviene cuadrarlo, y lo señalo al presentar.

## Intent

Hoy `libres` acepta cualquier franja y responde con salas libres aunque la franja no tenga sentido: el caso reportado, `libres 10:00-10:00`, responde `Norte, Sur`. Debe rechazarla con un texto claro. Éxito: `10:00-10:00`, `12:00-10:00` y `9:00-8:00` dan el aviso; `10:00-12:00` sigue dando `Sur`; `9:00-10:00` y `tarde` siguen dando `Norte, Sur`. Fracaso aunque funcione: rechazar una franja que hoy lista salas y no es de final igual o anterior al inicio.

## Scope

- Entra: `run('libres', …)` y una función nueva de validación de la franja que `run` llama, en `src/app.js`; la capacidad nueva `rooms`; los tests en `test/app.test.js`.
- No entra: el formato `HH:MM`, que es la fila de deuda «Sin validación del formato de franja horaria»; `freeRooms`, `reservar`, `cancelar` y `anular` (así `reservar` seguirá aceptando una franja que `libres` rechaza: queda fuera de esta spec).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira; `libres` con una franja de final igual o anterior al inicio pasa de listar salas a avisar | `src/app.js:28`, `test/app.test.js:5` (el test vigente, con `10:00-12:00`, sigue igual) | Delta, `ADDED` de `rooms` (el requisito vigente no existe aún en `capabilities/`) |

- Filas que implementa: nada: comprobado con `git grep -n 0021` fuera de esta spec (sin hits); el ROADMAP no tiene fila 0021. La fila de deuda «Sin validación del formato…» no se salda.

## Approach

- A. Función pura `validateSlot(slot)` en `src/app.js` que `run('libres', …)` llama antes de `freeRooms` — se prueba por `run`, sin tocar `freeRooms`; cuesta una función más.
- B. Validar dentro de `freeRooms` — mezcla validar y filtrar; `freeRooms` devolvería un texto de error en vez de una lista.
- C. Comparar el texto (`end <= start`) — válido solo con ceros a la izquierda: `9:00-10:00` pasaría a rechazarse sin ser inválida.
- Elegido: A — separa validar de buscar y compara minutos, lo que evita el fallo de C.

`validateSlot` devuelve el aviso, o nada si la franja es válida o no tiene la forma de la decisión 5; `run` responde el aviso y no llama a `freeRooms`.

## Dónde se prueba

- La franja: por `run('libres', …)`, en `test/app.test.js`, como el test de libres actual; un test por escenario: `10:00-12:00` (ya existe), `10:00-10:00`, `12:00-10:00`, `9:00-10:00`, `9:00-8:00`, `tarde` y `23:00-01:00`.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `rooms`

#### ADDED — Ver las salas libres por franja

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres 10:00-12:00`
- THEN responde `Sur`

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres 10:00-10:00`
- THEN responde solo «franja no válida: el final va después del inicio», sin salas

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres 12:00-10:00`
- THEN responde solo «franja no válida: el final va después del inicio», sin salas

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres 9:00-10:00`
- THEN responde `Norte, Sur`

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres 9:00-8:00`
- THEN responde solo «franja no válida: el final va después del inicio», sin salas

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres 23:00-01:00`
- THEN responde solo «franja no válida: el final va después del inicio», sin salas

- GIVEN la reserva de Norte de 10:00 a 12:00
- WHEN `libres tarde`
- THEN responde `Norte, Sur`

#### Reglas de la capacidad — rooms

- **Dónde viven los datos**: no aplica
- **Idioma de los nombres**: no aplica
- **Límites**: una franja no cruza la medianoche; el rango de horas y minutos (`24:70`) no se valida
- **Avisos**: «franja no válida: el final va después del inicio» (franja de forma `H:MM` o `HH:MM` en cada extremo, con final igual o anterior al inicio)
- **Regla ante conflicto**: no aplica

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
