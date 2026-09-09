# Hallazgos de los dos retos para sdd-kit: tests, entrevista, releases y restricciones

> Documento de entrada para el agente que mantiene `sdd-kit`. Complementa `propuesta-reviews-sdd-kit.md`
> (reviews de spec, de código y adversarial) con el resto de lo que dejaron SifAcademy (julio 2026), SifRest
> (septiembre 2026) y el experimento encadenado del 9 de septiembre. Cada sección lleva los datos, la lectura,
> la propuesta concreta y el RED que pide el Art. I antes de tocar una skill. Fecha: 2026-09-09.
>
> Fuentes: `SifAcademy/.docs/sdd/` y `SifRest/.docs/sdd/` (estimation-log, walkthroughs, actas de release),
> `SifRest/.docs/initial/presentacion/experimento-auth/resultados.md`, y recuentos por git sobre `develop`.

## 0. Resumen en cinco líneas

1. **Quien escribe el test no debe ser quien implementa.** En SifRest el hilo principal escribió los tests RED
   desde la spec antes de despachar; los smokes de tres releases dieron 3, 0 y 0 hallazgos. En SifAcademy cada
   implementador escribía los suyos; el smoke final dio 9. Propuesta: hacerlo explícito en `sdd-start-task` y en
   la plantilla del plan.
2. **Un E2E por escenario GIVEN/WHEN/THEN, no un recorrido largo por task.** Mismas líneas de E2E en los dos
   retos (763 frente a 760), 9 tests frente a 25. Correlación, no causa; propuesta como recomendación en la
   plantilla del plan, sin RED todavía.
3. **Cinco decisiones que el agente toma al azar si nadie las escribe**: dónde viven los datos, idioma de los
   nombres, límites, avisos y la regla ante conflicto. Salen del experimento (13 fallos de 51 en el brazo A, todos
   de esas cinco familias). Propuesta: que la entrevista de `sdd-init-*` y la plantilla de `funcional/` las pidan
   por nombre.
4. **Release pequeña primero y smoke por tramo.** Una release con smoke único: 9 hallazgos de golpe y cuatro
   trabajos derivados en el corte. Tres releases cortas: 3, 0 y 0, sin subir el ratio. Propuesta: guidance en
   `sdd-start-release` y en la plantilla del roadmap.
5. **Los comentarios que citan documentos son una regla de restricciones globales y un punto de la review.** 110
   líneas en dos retos; en el experimento, escrita la regla, el implementador la rompió cuatro veces y la review
   las cazó todas.

Además, dos confirmaciones de defaults que el kit ya tiene (§6) y una idea menor (§7).

## 1. Tests: quién los escribe y de qué tamaño

### 1.1 Datos

Recuento sobre `develop` (HEAD), líneas contadas con `git show | wc -l` sobre los ficheros de cada carpeta.

| | SifAcademy | SifRest |
| --- | --- | --- |
| Código de producto (C# + TS + HTML) | 11 246 líneas | 11 475 líneas |
| xUnit | 204 tests en 3 479 líneas (17 líneas por test) | 365 tests en 4 209 líneas (11,5 por test) |
| Vitest | 106 tests en 2 316 líneas | 133 tests en 1 954 líneas |
| E2E Playwright | 9 tests en 763 líneas (85 por test) | 25 tests en 760 líneas (30 por test) |
| Líneas de test por línea de producto | 0,58 | 0,61 |
| Hallazgos funcionales en el smoke de release | 9 (una release) | 3, 0 y 0 (tres releases) |
| Quién escribía los tests | el implementador de cada task, junto con el código | el hilo principal, en RED, antes de despachar al implementador |

Dos cosas que no cambian entre retos: la proporción de test respecto al producto (0,58 frente a 0,61) y las
líneas totales de E2E. Lo que cambia es el número de tests, su tamaño y quién los escribe.

### 1.2 Lectura

**El tamaño es el síntoma; la causa es el origen del test.** Cuando el mismo agente escribe código y test en la
misma pasada, el test tiende a describir lo que el código hace, no lo que la spec pide: casos largos, tautologías
(en la 0007 de SifAcademy tres tests de mapeo de estado contenían la palabra del estado en la propia fixture) y
recorridos E2E que cubren varios requisitos a la vez, de modo que cuando fallan no se sabe por cuál. Cuando el
test lo escribe otro desde la spec y antes de que exista el código, cada test es un escenario y el implementador
tiene un contrato que no puede ajustar a su implementación.

Esto es lo que el walkthrough de la 0007 de SifAcademy dejó como aprendizaje ("separar quien escribe el test de
quien lo implementa hace el RED real") y lo que SifRest aplicó desde la task 0001: el estimation-log de SifRest
dice en la 0001 "tests escritos por el hilo principal antes (RED de compilación) y núcleo implementado por un
subagente" y repite el reparto en la 0002, 0003, 0004 y 0005. También es, en otras palabras, la crítica de Shaw
en martinfowler.com (marzo 2026): la spec es un plano; la red de seguridad es la suite que la codifica.

**Cautelas.** N = 2, y SifRest es un producto de contratos cerrados (ficheros, parsers, proxy) donde un test
unitario cubre mucho; SifAcademy es de reglas de negocio (roles, estados, progreso) donde los nueve hallazgos del
smoke eran huecos de especificación, no de cobertura. Por eso la regla que se propone es sobre el origen del test
y su correspondencia con la spec, no sobre su longitud.

### 1.3 Propuesta

1. **`sdd-start-task`, paso de implementación.** Añadir a la receta del despacho: antes de despachar un
   implementador, el hilo principal escribe los tests que codifican los escenarios GIVEN/WHEN/THEN de la spec
   (RED por compilación o por fallo) y el encargo del implementador dice: "los tests de `<ruta>` son el contrato;
   no los modifiques; si uno te parece incorrecto, para y explícalo". Esta última frase ya está probada en SifRest
   (PROMPTS.md, entradas de la 0002 y la 0006): la versión larga con "sin investigar fuera del repo" no bastó;
   la corta "NO crees copias ni proyectos aparte, NO intentes demostrar nada" sí.
2. **`plan-template`, sección de verificación.** Un campo por task: `Tests RED: <quién los escribe> · <ruta>`. Si
   la task se ejecuta en línea, el campo lo cubre el propio hilo con el TDD de superpowers.
3. **Recomendación, sin obligar**: un E2E por escenario de la spec, con siembra por API y una sola aserción de
   negocio; los recorridos largos, solo para el smoke de release.

Cumple el Art. IX: superpowers tiene `test-driven-development` (RED-GREEN-REFACTOR para un solo agente) y
`subagent-driven-development` (implementador + revisores), pero no dice quién escribe el RED cuando hay
subagentes. Es un hueco entre dos skills, no una duplicación.

### 1.4 RED propuesto (Art. I)

Fixture: una task con spec de tres escenarios y un plan sin el campo `Tests RED`. Baseline: `sdd-start-task`
actual con `subagent-driven-development`. Fallo esperado: el implementador escribe sus propios tests y al menos
uno describe la implementación y no el escenario (se detecta comparando aserciones con los THEN de la spec).
GREEN: con el paso 1, los tests existen antes del despacho y el implementador no los toca. Para la
recomendación 3 no hay RED limpio; se deja como recomendación hasta tener uno.

## 2. Las cinco decisiones que el agente toma al azar si nadie las escribe

### 2.1 Datos

Experimento del 9 de septiembre: cuatro tasks encadenadas del backlog real de SifRest, mismo prompt de una
frase, mismo modelo (Sonnet). Brazo A sin `.docs/` (ni funcional, ni constitution, ni specs); brazo B con spec y
plan escritos desde el funcional y las reglas. Checklist ciego de 51 puntos escrito antes de lanzar nada.
Resultado: A 38 de 51, B 51 de 51. Los 13 puntos que A falló o dejó a medias caen todos en cinco familias:

| Familia | Qué hizo A | Qué decía el funcional o la constitution |
| --- | --- | --- |
| Dónde viven los datos | tabla SQLite nueva `app_settings` para la raíz de búsqueda; historial con cuerpo sin tope | SQLite solo para recientes; lo demás en ficheros del workspace; preferencias de cliente en localStorage |
| Idioma de los nombres | `auth` en inglés junto a `cabeceras` y `cuerpo`; claves del fichero de historial mezcladas (`request`, `estado`) | API en castellano, claves de fichero en inglés |
| Límites | búsqueda a profundidad 6 que recorre `.git/`, sin tope de resultados ni guarda de enlaces; historial sin tope de cuerpo | profundidad 3, tope 50, exclusiones, sin reparse points; 50 entradas y 64 KB |
| Avisos | token en claro guardado sin avisar (dos veces, T1 y T4) | aviso "muévelo a una variable secreta del entorno" |
| Regla ante conflicto | la pestaña Auth "sustituye" a la cabecera manual en A y "la cabecera manda" en A2, misma petición | la regla se escribe una vez ("misma que Content-Type") y queda en el funcional |

Ningún test falla en A. Ninguna de estas decisiones es técnica: son reglas de producto que el código no contiene y
que, por tanto, ningún agente deduce. La quinta fila es la más útil: la misma petición, dos ejecuciones, dos reglas
opuestas.

### 2.2 Dónde encaja en el kit

- **`sdd-init-greenfield` y `sdd-init-brownfield`, entrevista.** El bloque de producto pregunta hoy por problema,
  usuarios, roles y módulos. Propuesta: un bloque fijo de cinco preguntas con estos nombres, cuyas respuestas van a
  la constitution (si son reglas transversales) o a la capacidad de `funcional/` (si son de una capacidad). El
  funcional de SifAcademy, escrito para personas antes de la entrevista, no las tenía; hubo que añadir "qué no debe
  ver cada rol" después del smoke. El de SifRest, construido en la entrevista con el agente, sí las tenía, y es
  la causa que mejor explica sus smokes de 3, 0 y 0.
- **`funcional-template`.** Debajo de los requisitos GIVEN/WHEN/THEN, una sección opcional "Reglas de la
  capacidad" con las cinco entradas por nombre y "no aplica" permitido. Vacía no molesta; presente obliga a
  decidir.
- **`review-spec.md`.** La señal "reglas de visibilidad o permiso" ya está propuesta en el otro documento; estas
  cinco son la lista que la lente de dominio debe recorrer.

### 2.3 RED propuesto

Fixture: un `funcional/` con una capacidad que no fija idioma ni límites, y una spec que añade un requisito con
datos nuevos. Baseline: la spec sale sin decir dónde viven los datos ni con qué tope. GREEN: con el bloque en la
plantilla y la señal en la review, la spec lo declara en "Decisiones a validar".

## 3. Release pequeña primero y smoke por tramo

### 3.1 Datos

| | SifAcademy | SifRest |
| --- | --- | --- |
| Releases hasta el mismo volumen de código | 1 (v1.0.0, 23-28 julio) | 3 (v1.0.0, v1.1.0, v1.2.0 en 7-8 septiembre) |
| Hallazgos del smoke de release | 9, todos al final | 3, 0 y 0 |
| Trabajo derivado del smoke | una task y tres patches en el corte de release, a ratio 1,4 | un patch y un hotfix |
| Ratio real/estimado por release | 0,55 | 0,15 · 0,21 · 0,34 (la última con un refactor grande) |

En SifRest la primera release fue pequeña a propósito y se amplió al ver el ritmo. Cada release trajo su smoke.
Probar después de cada tramo no subió el ratio y sacó los huecos cuando aún eran baratos.

### 3.2 Propuesta

- **`sdd-start-release`**: al abrir la primera release de un proyecto, proponer un alcance mínimo entregable y
  dejar el resto en releases siguientes, con el argumento escrito (un smoke por tramo). Hoy la skill fija cómo se
  compone una release desde el acta y el backlog; no dice nada del tamaño.
- **Plantilla del roadmap**: una línea por release con "smoke: <fecha> · <hallazgos>", para que el patrón sea
  visible sin abrir las actas.
- **No** convertir esto en un gate: es una recomendación con datos, y el tamaño de release es decisión del
  usuario.

### 3.3 RED propuesto

No aplica un RED de skill en sentido estricto: la guidance es una recomendación al abrir release y una fila de
plantilla. Basta con el A/B de no regresión de `sdd-start-release` tras el cambio.

## 4. Comentarios que citan documentos

### 4.1 Datos

- 110 comentarios de código citaban la constitution, la spec, la task o el funcional (80 en SifRest, 30 en
  SifAcademy), limpiados por el patch 0016a sobre 81 ficheros.
- En el experimento, con la regla escrita en las restricciones globales del plan y en la memoria del agente, el
  implementador de B la rompió cuatro veces (una en T1, tres en T3) y la review de spec las cazó todas.
- Motivo de la regla: un comentario que cita un documento no explica un porqué, envejece con el documento y
  contamina cualquier comparación entre proyectos con y sin esos documentos.

### 4.2 Propuesta

- **Art. X (calidad de código) del kit**: un comentario solo si explica un porqué que el código no puede decir;
  nunca una referencia a constitution, spec, task o funcional. La trazabilidad vive en el commit y en el
  walkthrough, no en el código.
- **`plan-template`, restricciones globales**: la regla como línea fija, para que viaje en el encargo de cada
  subagente.
- **Encargo del revisor de task**: la regla como punto explícito de la lista, porque la instrucción sola no la
  hace cumplir; la review sí.

### 4.3 RED propuesto

Fixture: una task pequeña con constitution y spec. Baseline: el implementador de `subagent-driven-development`
sin la línea en restricciones ni en la review. Fallo esperado: al menos un comentario con cita (en el experimento
apareció en 2 de 4 tasks con la regla escrita, así que sin ella aparecerá). GREEN: con la línea en restricciones
y en el encargo del revisor, cero citas tras la ronda de fix.

## 5. Estimación: dos poblaciones y un ratio por proyecto

Ya está recogido en el kit (Build-EstimationLog y el estimation-log por proyecto), así que solo se anota la
evidencia para que la guidance no lo pierda:

- Tasks y patches son poblaciones distintas: en SifAcademy, tasks a ratio 0,48 y patches a 1,44. En un patch el
  trabajo es encontrar la causa y demostrar el arreglo, no escribir.
- El ratio no viaja entre proyectos: 0,55 en SifAcademy y 0,15 en la primera release de SifRest, con el mismo
  estimador. La banda se calibra por proyecto desde la tercera muestra.

## 6. Confirmaciones de defaults que el kit ya tiene

- **Implementación por 1-2 subagentes con el contrato en la spec** (default desde v0.6.0). Con orquestación pesada
  (hilo principal dirigiendo hasta 15 agentes por task, dos rondas de review adversarial) las tasks de SifAcademy
  costaban entre 1 y 2 h; con el default, las de SifRest entre 0,3 y 0,45 h, con más tests y menos hallazgos en
  smoke. Más agentes no fue más rápido.
- **Review adversarial no como default**: tratado en `propuesta-reviews-sdd-kit.md` (rendimiento alto en tasks
  de auth y estados sin contrato cerrado; cero o ruido cuando el contrato va en la spec y los tests RED los escribe
  el hilo principal; y el refutador automático tumbó dos defectos reales en la 0007).
- **Restricciones globales en el encargo de cada subagente**: funcionó, y aun así hizo falta la review para las
  citas en comentarios (§4). La instrucción reduce; la review cierra.

## 7. Idea menor: el resumen para personas sale de los artefactos

Los ficheros `PROMPTS.md` y `DECISIONES.md` que pidió la plantilla del hackathon se rellenaron en los dos retos
desde las specs (sección de decisión con alternativas) y los walkthroughs (resultado real). Si un proyecto
consumidor necesita un resumen así para una sesión o un informe, `sdd-end-release` podría generarlo desde los
artefactos con un script, igual que hace con el estimation-log, en vez de mantenerlo a mano. Sin RED ni prisa:
es conveniencia, no calidad.

## 8. Resumen para el roadmap del kit

| Ítem | Acción | Dónde | RED | Tamaño |
| --- | --- | --- | --- | --- |
| Tests RED por el hilo principal | paso explícito en el despacho y campo en el plan | `sdd-start-task`, `plan-template` | sí, §1.4 | task lite |
| Un E2E por escenario | recomendación | `plan-template` (verificación) | no aún | patch |
| Cinco decisiones que se toman al azar | bloque de entrevista y sección opcional del funcional | `sdd-init-*`, `funcional-template`, `review-spec.md` | sí, §2.3 | task |
| Release pequeña y smoke por tramo | recomendación y fila del roadmap | `sdd-start-release`, plantilla del roadmap | A/B de no regresión | patch |
| Comentarios sin citas | regla en Art. X, restricciones globales y encargo del revisor | constitution del kit, `plan-template`, `sdd-start-task` | sí, §4.3 | patch |
| Estimación por poblaciones | solo anotar la evidencia | docs de estimación | — | — |
| Resumen para personas desde artefactos | idea, sin prioridad | `sdd-end-release` | — | — |
