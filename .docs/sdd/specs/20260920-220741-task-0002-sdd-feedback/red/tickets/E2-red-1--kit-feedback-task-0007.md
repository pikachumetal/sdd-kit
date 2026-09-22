# Feedback del kit SDD — task 0007 (descuentos por volumen)

**Para**: quien mantiene `sdd-kit`.
**Proyecto**: Nortia Distribución. **Versiones**: `sdd-kit` 1.1.0 (canal plugin), `superpowers` 6.3.0.
**Fuente**: `session-log.md` (sesión del 2026-09-15), contrastada con el texto de las skills del kit y con el árbol de trabajo de `feature/0007`. Donde el contraste corrige o matiza la bitácora, se dice.

## Resumen

Los gates de intent y de spec, y la fusión del delta en `capabilities/`, funcionaron sin fricción. Hubo tres roces: una firma de interfaz inventada por un implementador (T2), un aprendizaje sin destino en el cierre y una pregunta de validación que a la jefatura de ventas le sobró. Contrastados con el kit, el primero apunta a un hueco (no hay sitio para firmas entre tasks) más un paso 6 que no consta; el segundo, a otro hueco (no hay plan B si falta el doc destino); del tercero no está claro que sea un fallo del kit. La build rota fue un error propio, no del kit.

## Qué ha funcionado

1. **Gate de spec y cambio de criterio de redondeo.** El gate forzó que el paso de truncamiento a redondeo bancario quedara como requisito MODIFIED explícito y aprobado, en vez de un detalle de implementación. Comprobado: `spec.md` lo lleva en el delta y en «Decisiones que he tomado yo».
2. **Gate de intent.** Sin fricción, aprobado a la primera.
3. **Fusión del delta en `capabilities/pricing.md`.** El delta ya venía en el formato del fichero de capacidad: ADDED se añade, MODIFIED sustituye, entrada en Historial. Comprobado en `pricing.md`.
4. **Tabla THEN → test (iniciativa propia, no del kit).** Antes de despachar, una tabla informal de cada THEN de la spec contra el test RED que lo cubre. Al revisar los tres PR la comprobación fue mecánica. Ninguna skill la pide: el Self-review de `plan-template.md` cruza requisito → task, no THEN → test.

## Qué ha fallado o ha rozado

### 1. T2: firma de `ITariffResolver` inventada

**Bitácora**: el brief de T2 salió sin el bloque de interfaces; el implementador añadió un parámetro `fechaConsulta` que no estaba en el plan. Se detectó al comparar los tres PR y costó una ronda de fix (T2: 180k tokens, fix incluido).

**Contraste con el kit**:

- La cabecera del encargo del implementador (`encargo-revision.md`) lleva «Restricciones globales» y «Tests RED» delante del task-brief. No hay hueco para firmas compartidas, y `plan-template.md` tampoco tiene sección para interfaces entre tasks (§1.4 es API HTTP; §1.6, dependencias del plan). Que dependa de que el hilo principal pegue el bloque a mano es la fragilidad que se materializó.
- El paso 6 de `sdd-start-task` ya traía la defensa: tests RED por THEN, escritos y commiteados por el hilo principal antes de despachar. Un test de T2 que compilara contra `ITariffResolver` habría fijado la firma. El plan nombra `TariffServiceTests.ResuelveTarifaVigente_…`, pero ese fichero no existe en el árbol (solo `tests/VolumeDiscountCalculatorTests.cs`) y la bitácora no dice que los tests se escribieran antes del despacho.
- T2 producía la interfaz que T1 y T3 consumían y aun así se despacharon las tres en paralelo. El kit no dice cómo tratar tasks con dependencias entre sí.
- `plan.md` no contiene el bloque de interfaces que la bitácora dice que estaba «fijado en el plan».

**Atribución**: mixta. Ejecución (el paso 6 no consta) y hueco del kit (sin sitio para firmas ni para secuenciar).

### 2. Aprendizaje sin destino (paso 4 de `sdd-end-task`)

**Bitácora**: unos 20 minutos dudando; acabó como sección «Patrones de dominio» al final de `tech-stack.md`, por ser «el menos malo».

**Contraste con el kit**:

- `aprendizajes-skills.md` sí mapea «cambio estructural → `architecture.md`» y «convención nueva → `constitution.md`». El patrón «resolver siempre por interfaz» ya figura en las «Restricciones globales» del plan, así que la constitution era candidata; la bitácora no la considera.
- El vacío real: el proyecto no tiene `architecture.md`, el kit lo trata como opcional (`sdd-start-task`, paso 1: «si existen») y ni el paso 4 ni su referencia dicen qué hacer cuando el destino no existe.
- Efecto: el aprendizaje acabó en el doc que el kit reserva para versiones y herramientas.

### 3. Validación pedida dos veces — atribución sin confirmar

**Bitácora**: en el paso 0 de `sdd-end-task` se repitió la pregunta que ya se había hecho en «el paso 7 de `sdd-start-task`, al cerrar el plan». La jefatura de ventas respondió «ya te lo he dicho» y aprobó.

**Contraste con el kit** (texto 1.1.0): el gate del plan es el paso 5. El paso 7 es la validación del trabajo terminado («qué ha probado el usuario y que funciona») y el paso 0 de `sdd-end-task` solo la exige si no se dio antes. Son preguntas distintas, y la bitácora no registra que el paso 7 se ejecutara entre el smoke (12:15) y el cierre (12:30). Dos lecturas:

- **a)** No hay duplicación en el kit: la pregunta del paso 0 se formuló como reconfirmación de lo aprobado, en vez de presentar el smoke y preguntar qué ha probado el usuario.
- **b)** Sí la hay: la misma puerta descrita en dos skills sin remitirse una a otra.

No puedo decidir entre a) y b) sin saber qué se preguntó exactamente. La sugerencia 4 sirve para las dos.

## No atribuible al kit

Fusión y commit sin `dotnet build`: rama rota unos 15 minutos por un conflicto de nombres en el `using` de `Nortia.Pricing` entre T2 y T3. Fallo propio, como dice la bitácora; el `plan-template.md` ya pide build verde por task y en la validación final. Lo enlazo solo porque comparte causa con el punto 1: tres tasks en paralelo con superficie común.

## Datos de coste

- Tiempo: estimado 3h 30m, real 4h 20m.
- Tokens de subagente: T1 212k, T2 180k (con el fix), T3 143k; total 535k. El plan estimaba 150–200k por subagente: solo T1 se pasó. El hilo principal no se midió, así que el total real no se puede reconstruir.

## Discrepancias entre la bitácora y el repo (sin resolver)

- **`walkthrough.md`**: la bitácora dice que se escribió (12:40); no está en la carpeta de la task.
- **`tech-stack.md`**: no contiene la sección «Patrones de dominio» del punto 2.
- **`estimation-log.md`**: la cabecera dice «AUTO-GENERADO… No editar a mano», pero el formato (Task / Estimado / Real / Desviación) no es el que emite `Build-EstimationLog.ps1` (Fecha / Task / Tipo / Est / Real / Ratio / Carpeta, más factor de calibración), y el kit prohíbe añadir filas a mano. Además 0007 figura como +23 %, cuando 3h 30m → 4h 20m es +23,8 %. Es un indicio de fila escrita a mano (o de formato heredado que ninguna migración actualizó), no una prueba. La bitácora lo cuenta como «sin fricción».
- **Marcas de tiempo**: `spec.md` registra intent 10:52 y spec 11:40 (+02:00), y la carpeta se creó a las 10:15; la bitácora da 09:14, 09:40 y 09:16. No las he reconciliado y no descarto un desfase horario.
- **`plan.md`**: mucho más corto que `plan-template.md`: sin «Decisiones que he tomado yo — valida estas», modelo sin effort, sin Self-review y sin estado ni aprobación (`spec.md` sí los lleva).
- **Pasos del kit que la bitácora no cubre**: aprobación del plan (paso 5), tests RED escritos por el hilo principal antes del despacho, «Restricciones globales» en cada encargo, revisión final de rama, y los pasos 5, 7, 8 y 10 del cierre (skills, changelog, roadmap, rama). Sin dato, no puedo decir que funcionaran ni que fallaran.

## Sugerencias

1. **Contratos entre tasks.** Sección en `plan-template.md` con las firmas literales que una task expone a otra, un campo `Depende de` por task, y que la cabecera del implementador en `encargo-revision.md` la incluya junto a «Restricciones globales» y «Tests RED».
2. **THEN → test.** Añadir esa columna al Self-review de `plan-template.md` (la tabla del punto 4 de «Qué ha funcionado»).
3. **Destino inexistente.** En el paso 4 de `sdd-end-task` / `aprendizajes-skills.md`: si el doc destino no existe, proponer al usuario crearlo (mínimo) o dejar el aprendizaje pendiente en el walkthrough; nunca forzarlo en otro doc.
4. **Validación.** En el paso 0 de `sdd-end-task`: si el paso 7 de `sdd-start-task` ya obtuvo validación, citarla y no repetirla; si no, la pregunta es «¿qué has probado?» con el smoke delante, no «¿sigue en pie lo aprobado?».

## Límites

No he podido leer las skills de `superpowers` (permiso denegado), así que nada de lo anterior afirma qué prescribe `superpowers` sobre paralelizar implementadores. Las comprobaciones del repo son del árbol de trabajo actual (un solo commit, `base`).
