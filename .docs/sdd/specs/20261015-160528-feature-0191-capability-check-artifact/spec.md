---
id: 20261015-160528-feature-0191-capability-check-artifact
feature: 0191
parent: 0187
proposal: 0131
title: capability check por artefacto, con los fallos ajenos aparte y los punteros seguidos hasta su destino
mode: full
profile: delegate
status: approved
created: 2026-10-15
author: Claude
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-15
---

# Spec — `capability check` por artefacto: fallos ajenos aparte y punteros raíz → plantilla

🦆 Al cerrar una feature, el agente comprueba que su spec y las capacidades que tocó están bien. Hoy, en un repo con 18 capacidades «puntero» (fichero que solo dice «mi verdad está en otra carpeta»), esa comprobación da 36 fallos y sale en rojo aunque lo de la feature esté perfecto, y hay que filtrar a mano. Tras este cambio, el rojo o el verde lo deciden solo la spec y las capacidades de su delta; el resto sale debajo, en una lista aparte que no cambia el resultado. Y un puntero se comprueba en el fichero al que apunta, que es donde están sus requisitos.

## Capacidades

- Modificadas: `capabilities` — cambia «El validador de capacidades» y la regla «Avisos», y añade «Un puntero se valida en su destino»

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: ninguna — señales: MODIFIED («El validador de capacidades»), contrato público (la salida y el JSON de `sdd capability check` los leen los cierres) · tamaño: ~150 líneas en 4 ficheros
- Mínimo razonable: ninguna — deja sin mirar por un segundo par de ojos los literales de los mensajes nuevos; los fija esta spec y los prueban los tests
```

1. **Qué capacidades son «del artefacto»**: las que nombran las subsecciones `### Capacidad:` de su delta. Un artefacto con «Ninguna, porque…» no toca ninguna: todos los fallos de `capabilities/` son ajenos. Los fallos del propio artefacto (bloque «Capacidades», delta sin fusionar) son siempre suyos — la fila dice «las capacidades que toca su delta».
2. **Bloque de ajenos**, tras la cabecera o tras los fallos propios: `Ajenos al artefacto, no cambian el código de salida: <n>`, con `<n>` el número de fallos ajenos, y una línea por fallo, sangrada con dos espacios, `  <fichero>: <qué falla>`. Sin ajenos, el bloque no sale.
3. **Cabecera** con `--artifact` y sin fallos propios: `Capacidades válidas: <n>`, con `<n>` las capacidades sin ningún fallo (los punteros cuentan si su destino pasa; las omitidas por «No es una capacidad.» no cuentan), y su `· omitidas por…` si las hay. Sin ajenos, `<n>` es el mismo número que hoy.
4. **JSON** con `--artifact`: `{ validCount, errors, foreign }`, con `errors` los fallos propios (vacío si sale con 0) y `foreign` los ajenos. Sin `--artifact` no lleva `foreign` y no cambia.
5. **Sin `--artifact` nada cambia**: todos los fallos cuentan y salen con 1, salvo los de punteros, que ahora se validan en su destino.
6. **Puntero**: título `# Capacidad — <slug> (puntero)` (mayúsculas indiferentes) y una línea de cita `>` con un enlace Markdown `[…](<ruta>)` cuya ruta acaba en `capabilities/<slug>.md`; la ruta se resuelve desde la carpeta del puntero. Solo el primer enlace así cuenta.
7. **Fallos de un puntero**, con el literal: sin enlace válido, `<slug>.md: el puntero no enlaza en una cita a <…>/capabilities/<slug>.md`; destino inexistente, `<slug>.md: el destino del puntero no existe: <ruta>`; con líneas de escenario, `<slug>.md: un puntero no lleva escenarios: van en su destino`. Los fallos del destino salen como `<slug>.md → <ruta>: <qué falla>`, con `<ruta>` tal como la escribe el enlace.
8. **Del puntero solo se mira lo anterior**: ni su `## Propósito` ni sus secciones se validan (`capability index` ya marca `(sin propósito)`), y el destino se valida como una capacidad normal con el slug del puntero; un destino que a su vez es puntero falla por su título, sin cadenas.
9. **Delta contra un puntero**: `«<requisito>» del delta no está en <ruta>` y `… no coincide con <ruta>`, con la ruta del enlace en vez de `capabilities/<slug>.md`.
10. **Fuera**: `capability merge` e `capability index` no siguen punteros. En el template el delta se fusiona con `--path` del `.docs/sdd/` de la plantilla; si alguien lo fusiona en la raíz, el puntero gana escenarios y el check lo para con el fallo de la decisión 7.
11. **Sin texto de skill**: `sdd-end-feature` paso 4 y `sdd-end-patch` paso 1 ya dicen que un fallo en una capacidad que el delta no toca no bloquea y se lista como pendiente; la salida nueva lo hace visible sin cambiar la frase. La tabla de `sdd-templates` describe qué comprueba `--artifact`, que no cambia.

### Decisiones tomadas con el dev-lead

- Va antes de la 0149, porque el cierre de `sdd-archive` ejecuta `capability check --artifact` — dev-lead, 2026-10-15
- Solo CLI, en `cli/src/capabilities/`, con tests Vitest; los que crean repos o lanzan procesos, en `*.slow.test.ts` — «Solo CLI, en `cli/src/capabilities/`, con tests Vitest»
- Con `--artifact`, el código de salida y la cabecera los deciden los fallos del artefacto y de las capacidades que toca su delta; los demás salen aparte como ajenos y no cambian el código — «los demás salen aparte como ajenos y no cambian el código de salida»
- Un puntero se valida en su destino, y el delta que lo toca se contrasta con el destino — «se valida en su destino, y el delta que lo toca se contrasta con el destino»
- Spec aprobada en el gate, 2026-10-15 — «Apruebo (Recomendada)»
- Perfil `delegate` y, al fusionar, `sdd merge --push` — «Perfil delegate. Al fusionar, `sdd merge --push`.»

## Intent

Hoy `sdd capability check --artifact` mezcla los fallos del artefacto con los de todas las capacidades: en el patch 0058 del template, 36 fallos ajenos taparon el resultado del delta propio, y en la raíz del template cada uno de sus 18 punteros da dos fallos (título y «Requisitos») en cada cierre. El cierre de `sdd-archive` (0149) va a ejecutar este comando y decidir por su código de salida. Éxito: en la raíz del template, `capability check` sin fallos reales sale con 0, y con `--artifact` el código de salida solo cambia por el artefacto o por las capacidades de su delta. Fracaso aunque funcione: que un fallo ajeno desaparezca de la salida, o que un fallo de una capacidad del delta salga como ajeno.

## Scope

- Entra: `cli/src/capabilities/check.ts` (separar propios y ajenos, punteros, delta contra el destino), `cli/src/capabilities/verbs.ts` (salida de texto y JSON), tests en `cli/test/capability/check.test.ts`, el delta de `capabilities`.
- No entra: `capability merge` e `capability index` con punteros (decisión 10); texto de skills (decisión 11); los punteros sin `(puntero)` en el título.

## Approach

`validateCapabilities` sigue devolviendo una lista por fichero; con `--artifact` la parte en propios (artefacto + ficheros de las capacidades del delta) y ajenos, y el código sale solo de los propios. Un fichero puntero se sustituye, para validar y para contrastar el delta, por el fichero de su destino.

## Dónde se prueba

- Separar propios y ajenos, cabecera, bloque y JSON: `cli/test/capability/check.test.ts`, con `sddFolder` y `check`, como los tests de `--artifact` actuales.
- Punteros: el mismo fichero, con un destino en otra carpeta del mismo temporal, como un template de dos niveles.
- Smoke: `sdd capability check --path` sobre la raíz de un clon de `sdd-project-template`, que hoy da 36 líneas.

## Términos y ADR

- Términos resueltos: **puntero** — capacidad cuyo título acaba en `(puntero)` y que enlaza en una cita la capacidad viva en otro `.docs/sdd/`; **ajeno** — fallo de una capacidad que el delta del artefacto no toca.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `capabilities`

**MODIFIED — El validador de capacidades** (antes: «con `--artifact` … falla si …» sin separar los fallos ajenos)

- GIVEN `.docs/sdd/capabilities/bookings.md` cuyo requisito `### Consultar salas libres` tiene GIVEN y WHEN pero no `- THEN`
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN sale con código 1 y escribe `bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)`
- AND también falla, nombrando fichero y, si aplica, requisito, ante: un título que no es `# Capacidad — <nombre del fichero sin .md>`; una sección `##` distinta de `## Propósito`, `## Requisitos` y `## Reglas de la capacidad` (una `## Historial` incluida); una marca de delta (`**ADDED —`, `**MODIFIED —`, `**REMOVED —`) en la capacidad; un bloque `**Reglas de la capacidad**` en negrita, que es la forma del delta; una sección de reglas a la que falte alguna de sus cinco entradas por nombre
- AND ante una línea suelta bajo un requisito —ni `- …`, ni `>`, ni sangrada, ni en blanco—, como la segunda línea de un «(antes: …)» partido, escribe `bookings.md: línea suelta en «Reservar una franja» (línea 14): «guardada»)»`
- AND ante una línea `- Se valida en:` en la capacidad escribe `bookings.md: resto de delta «Se valida en:» en la línea 15`
- AND ante `## Historial` el mensaje es `bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0`
- AND sin `## Propósito` escribe `bookings.md: falta la sección «Propósito»`; con la sección vacía, o solo con la ayuda `>` y el hueco `<…>` de la plantilla, `bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad`; con un propósito de 412 caracteres, medidos sobre el propósito en una sola línea como lo escribe el índice, `bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)`; y con `## Propósito` detrás de otra sección, `bookings.md: «Propósito» debe ser la primera sección`
- AND con `--artifact <spec.md|patch.md>`, que se ejecuta después de fusionar el delta, falla si falta el bloque `## Capacidades`, si sus nombres no coinciden con las subsecciones `### Capacidad:` del delta, si no nombra ninguna capacidad ni dice «Ninguna, porque…» (`<a>: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»`), si dice «Ninguna» y hay delta, si una capacidad del bloque no tiene fichero en `capabilities/`, o si un `patch.md` declara `- Nuevas:`
- AND con `--artifact`, un `**ADDED — Cancelar una reserva**` del delta de `bookings` sin fusionar falla con `spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md`, y un `**MODIFIED — Reservar una franja**` cuyas líneas `- GIVEN`, `- WHEN`, `- THEN` y `- AND` no son, en orden, las de ese requisito en la capacidad, con `spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md`; el título cuenta entero aunque el encabezado, con su `(antes: «…»)`, ocupe varias líneas
- AND con `--artifact` de una spec cuyo delta solo toca `bookings`, ya fusionado, y `rooms.md` sin `## Requisitos`, escribe `Capacidades válidas: 1`, después `Ajenos al artefacto, no cambian el código de salida: 1` y `  rooms.md: falta la sección «Requisitos»`, y sale con 0
- AND con `--artifact` y un fallo en `bookings.md` o en el propio artefacto, escribe sus líneas, después el bloque de ajenos, y sale con 1; un artefacto con «Ninguna, porque…» no toca ninguna capacidad, y todos los fallos de `capabilities/` salen como ajenos
- AND con `--artifact --json` escribe `{ "validCount": <n>, "errors": [<fallos propios>], "foreign": [<ajenos>] }`; sin `--artifact`, el JSON no lleva `foreign` y todos los fallos cuentan
- AND sin fallos escribe `Capacidades válidas: <n>` y sale con 0; sin carpeta `capabilities/`, o con la carpeta vacía, y sin `--artifact`, escribe `Sin capacidades que validar` y sale con 0

**ADDED — Un puntero se valida en su destino**

- GIVEN `capabilities/bookings.md` con el título `# Capacidad — bookings (puntero)`, una cita `> **Esta capacidad no vive aquí.** Su verdad está en [app/bookings.md](../../../app/.docs/sdd/capabilities/bookings.md)` y `## Propósito`, sin `## Requisitos`, y `app/.docs/sdd/capabilities/bookings.md` una capacidad válida
- WHEN se ejecuta `sdd capability check --path .docs/sdd`
- THEN no da ningún fallo de `bookings.md`, la cuenta en `Capacidades válidas: <n>` y sale con 0
- AND si el destino tiene un requisito sin `- THEN`, escribe `bookings.md → ../../../app/.docs/sdd/capabilities/bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)` y sale con 1
- AND si el destino no existe, escribe `bookings.md: el destino del puntero no existe: ../../../app/.docs/sdd/capabilities/bookings.md`; sin una cita con un enlace que acabe en `capabilities/bookings.md`, `bookings.md: el puntero no enlaza en una cita a <…>/capabilities/bookings.md`; y con una línea `- GIVEN` en el puntero, `bookings.md: un puntero no lleva escenarios: van en su destino`
- AND con `--artifact` de una spec cuyo delta trae `**ADDED — Cancelar una reserva**` en `bookings`, el requisito se busca en el destino: si no está, `spec.md: «Cancelar una reserva» del delta no está en ../../../app/.docs/sdd/capabilities/bookings.md`
- AND `sdd capability merge` y `sdd capability index` no siguen el puntero

**Reglas de la capacidad**
- **Avisos**: `sdd capability check` escribe una línea por fallo, `<fichero>: <qué falla>`, en castellano, y sale con 1; sin fallos, `Capacidades válidas: <n>`, seguida de `· omitidas por «No es una capacidad.»: <ficheros>` si omitió alguno. Con `--artifact`, el código de salida y la cabecera solo los deciden los fallos del artefacto y de las capacidades de su delta, y los demás salen después bajo `Ajenos al artefacto, no cambian el código de salida: <n>`, sangrados con dos espacios. Un fallo del destino de un puntero sale como `<puntero> → <ruta del enlace>: <qué falla>`. `sdd capability merge` escribe una línea por cambio, `<fichero>: añadido|sustituido|quitado «<requisito>»` o `<fichero>: regla «<nombre>» sustituida|añadida`, y sale con 0; con fallos, una línea por fallo, sale con 1 y no escribe ningún fichero. `sdd capability index` marca con `(sin propósito)` la capacidad que no lo tiene, y sale con 0.

## Enmiendas

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-15 | aprobada: «Apruebo (Recomendada)» |
