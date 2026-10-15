---
id: 20261015-160528-feature-0191-capability-check-artifact
feature: 0191
title: Walkthrough — capability check por artefacto
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-15
---

# Walkthrough — `capability check` por artefacto: fallos ajenos aparte y punteros raíz → plantilla

## 1. Cambios realizados

- **Punteros** (`9a465aba`): `cli/src/capabilities/check.ts` resuelve cada fichero de `capabilities/` con `resolveFile`. Un puntero (`# Capacidad — <slug> (puntero)` y una cita con un enlace que acaba en `capabilities/<slug>.md`) se valida en su destino, con sus fallos prefijados `<slug>.md → <enlace>:`, y el delta del artefacto se contrasta con el destino. Un puntero sin enlace, con destino inexistente o con escenarios falla con su mensaje.
- **Ajenos aparte** (`8da47ed1`): con `--artifact`, `validateCapabilities` reparte los fallos en propios (artefacto y capacidades con `### Capacidad:` en su delta) y `foreign`; el código y la cabecera salen solo de los propios. `verbs.ts` escribe el bloque `Ajenos al artefacto, no cambian el código de salida: <n>` y, en `--json`, la clave `foreign`.
- **Pasada de fix** (juntada en el cierre): un puntero marcado `> **No es una capacidad.**` se omite, no se sigue.
- Tests: 15 nuevos en `cli/test/capability/check.test.ts`.
- Docs: delta fusionado en `capabilities/capabilities.md` (MODIFIED «El validador de capacidades», ADDED «Un puntero se valida en su destino» y la regla «Avisos»); changelog.

## 2. Tiempo y coste: estimado vs real

- Tipo: infra/tooling
- Estimación de implementación (del plan): 1.5h
- Esfuerzo real: 0.5h — reloj del hilo aproximado con las marcas de los commits: las dos tasks de 16:33 a 16:38, la revisión final, la pasada de fix, el gate (9 min, en paralelo con el smoke) y el cierre.
- Desviación: −1h (−67 %)
- Causa de la desviación: dos funciones de un fichero ya leído en la spec, con los literales y los tests escritos en el plan; la revisión y el gate corrieron en segundo plano mientras avanzaban el smoke y los borradores.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado
- Tokens del hilo: 13.770.945 — claude-opus-5-5 13.770.945
- Tokens de subagentes: 1.942.495 en 3 despachos — Revisión final eje Código 0191 claude-sonnet-5-5 386.043 / 1 min; Revisión final eje Spec 0191 claude-opus-5-5 1.275.179 / 3 min; Re-revisión final 0191 claude-opus-5-5 281.273 / 0 min
- Coste de la sesión: 7,63 $ (hilo 5,79 $ + subagentes 1,84 $)
- Coste de sujetos: no aplica
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La pasada de fix añadió la omisión de un puntero marcado «No es una capacidad.», que el plan no preveía y el requisito vivo ya exigía (hallazgo I1 del eje Spec).
- Los ejes de la revisión final salieron uno tras otro, no en paralelo.

### Decisiones tomadas sin el dev-lead

- Baseline: el pre-commit verde del commit de apertura (`cli:test` 875, `cli:typecheck`, `kit:test-fast` 1178), sin el gate completo. Si me equivoco, un rojo lento ajeno se habría visto en el gate de cierre, que salió verde.
- Base comprobada en local, sin fetch: el merge con `--push` integra el remoto. Si me equivoco, un conflicto tardío en el roadmap.
- 3 de los 7 tests RED de la Task 2 ya pasaban antes (fallo solo del artefacto, nombre en otra caja, JSON sin `--artifact`): quedan como guardas de regresión. Si me equivoco, ninguno: los otros 4 fijan el reparto.
- El JSON de «no existe el artefacto» sigue sin `foreign`: es un error de uso previo a validar. Si me equivoco, un consumidor de `--json` lee `foreign` como `undefined` en ese caso.
- Los ejes Spec y Código salieron uno tras otro, porque tus instrucciones globales piden confirmar antes de paralelizar y el perfil `delegate` no para por método. Si me equivoco, unos 5 min más de reloj.
- Un puntero con un enlace `%20` o `http(s)://` no se sigue: falla con «el puntero no enlaza…» o «el destino no existe». Si me equivoco, ese puntero se reescribe con una ruta relativa.
- «Ajeno» es la capacidad sin `### Capacidad:` en el delta; `index` y `merge` no siguen punteros; `foreign` solo sale con `--artifact`: son las decisiones 1, 4 y 10 de la spec aprobada, que el eje Código dejó fuera de su juicio.

## 4. Verificación

### 4.1 Builds

- `moon run cli:typecheck` → sin errores, en cada task y en el gate.
- Gate de cierre: `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → exit 0 · `cli:test` 893/893 · `kit:test` 1259 pasan, 0 fallan · `cli:test-min` 1079/1079 · `cli:test-slow` 186/186 · 8 min 41 s.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-15 · gate 3417 tests en verde · smoke de 9 THEN con ejecución real de `node cli/bin/sdd.js capability check` sobre una carpeta de prueba con raíz y destino, y sobre la raíz de un clon de `sdd-project-template` · revisión final Spec y Código sobre 8da47ed1, pasada de fix y re-revisión limpia · 11 Minor diferidos.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Raíz del template con 18 punteros pasa | ejecución real | antes 36 líneas de fallo y exit 1; ahora `Capacidades válidas: 20`, exit 0 |
| `--artifact` con el delta fusionado y un ajeno: cabecera, bloque, exit 0 | ejecución real | `Capacidades válidas: 1` · `Ajenos al artefacto, no cambian el código de salida: 1` · `  rooms.md: falta la sección «Requisitos»`; exit 0 |
| `--artifact` con fallo propio: sus líneas, el bloque y exit 1 | ejecución real | `spec.md: «Cancelar una reserva» del delta no está en ../../../app/.docs/sdd/capabilities/bookings.md`, el bloque de ajenos; exit 1 |
| `--artifact --json` con `foreign` | ejecución real | `{"validCount":1,"errors":["spec.md: «Cancelar una reserva» del delta no está en …"],"foreign":["rooms.md: falta la sección «Requisitos»"]}` |
| Sin `--artifact` todo cuenta | ejecución real | `rooms.md: falta la sección «Requisitos»`; exit 1 |
| Fallo del destino con prefijo `→` | ejecución real | `bookings.md → ../../../app/.docs/sdd/capabilities/bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)` |
| Destino inexistente | ejecución real | `bookings.md: el destino del puntero no existe: ../../../app/.docs/sdd/capabilities/bookings.md` |
| Puntero con escenarios | ejecución real | `bookings.md: un puntero no lleva escenarios: van en su destino` |
| Delta contra el destino del puntero | ejecución real | `spec.md: «Cancelar una reserva» del delta no está en ../../../app/.docs/sdd/capabilities/bookings.md` |
| Puntero sin enlace a su capacidad | suite | `a pointer without a link to its capability fails` |
| «Ninguna, porque…»: todo ajeno | suite | `with «Ninguna, porque» every capability failure is foreign` |
| JSON sin `--artifact` no lleva `foreign` | suite | `--json without --artifact has no foreign key` |
| `merge` e `index` no siguen punteros | suite | sin cambios en `merge.ts` ni `index.ts`; sus tests, en verde sin tocarlos |

### 4.3 Residuales / deuda generada

- 11 Minor diferidos de la revisión, en `tasks.md` § Rulings (tests de enlace absoluto, de `#ancla` y de `no coincide` con puntero; `resolvePointer` con 4 parámetros; lecturas duplicadas del artefacto y del slug). Ninguno cambia lo que ve el dev-lead salvo uno: un puntero roto en el delta añade una línea `del delta no está en capabilities/<slug>.md` que apunta al fichero equivocado, con el exit ya en 1.

## 5. Aprendizajes

- Las skills que ejecutan `capability check --artifact` (`sdd-end-feature` paso 4, `sdd-end-patch` paso 1) ya decían «un fallo en una capacidad que el delta no toca no bloquea»: ahora la CLI lo hace, y la frase sigue siendo cierta → sin cambio de skill; la 0149 decide si la receta de `sdd-archive` lo simplifica.
- `vitest run` suelto en `cli/` corre también los `*.slow.test.ts` con el timeout rápido, y 6 fallan por tiempo: la suite rápida es `moon run cli:test` → sin cambio de doc: `tech-stack.md` está en su tope de palabras (`WordBudget`), y la tarea de moon ya es la que nombran el gate y el pre-commit.

## 6. Adendas
