# Propuesta para sdd-kit: qué review se queda en el kit y cuál se delega a superpowers

> Documento de entrada para el agente que mantiene `sdd-kit`. Reúne la evidencia de los dos retos
> (SifAcademy, julio 2026; SifRest, septiembre 2026) y del experimento encadenado del 9 de septiembre,
> y propone una decisión sobre las tres reviews que hoy conviven: review de spec, review de código y
> review adversarial multi-lente. Fecha: 2026-09-09. Fuentes: walkthroughs de `SifAcademy/.docs/sdd/specs/`,
> `SifRest/.docs/sdd/estimation-log.md` y `SifRest/.docs/initial/presentacion/experimento-auth/resultados.md`.

## 1. Decisión propuesta, en tres líneas

1. **La review de spec se queda en el kit** tal como está en `skills/sdd-start-task/references/review-spec.md`
   (rúbrica de señales, revisor Sonnet por lente, hallazgos incorporados antes del gate). Es la única review
   que ataca la causa de los fallos que hemos tenido: huecos del funcional.
2. **La review de código no la escribe el kit.** Se delega en las dos pasadas por task de
   `superpowers:subagent-driven-development` (cumplimiento de spec y luego calidad), que ya es el default de
   implementación del kit desde v0.6.0. Art. IX.1: si superpowers lo resuelve, se invoca y no se reescribe.
3. **La review adversarial multi-lente no entra como default.** Queda como **refuerzo opt-in por task**,
   declarado en el plan con motivo, para tasks con riesgo de seguridad, roles, concurrencia o dinero. Y sin
   refutador automático como juez: el veredicto lo da el hilo principal o el usuario.

El resto del documento es la evidencia y el detalle de cada punto.

## 2. Qué es cada review, para no mezclarlas

| Review | Cuándo | Quién | Sobre qué | Qué busca |
| --- | --- | --- | --- | --- |
| **De spec** | tras redactar `spec.md`, antes del gate | 1-2 Sonnet por lente (dominio / técnica) | la spec contra `funcional/`, constitution y mission | contradicciones con la verdad viva, requisitos sin escenario verificable, alcance oculto, decisiones no declaradas |
| **De código (superpowers)** | tras cada task del plan | el revisor de task y el re-revisor de `subagent-driven-development` | el diff de la task contra la spec y el plan | primero cumplimiento de spec, después calidad de código |
| **Adversarial multi-lente** | tras implementar | 2-6 revisores en paralelo (correctness, compliance, seguridad, concurrencia…) + refutador + fixer | el diff completo | fallos que el implementador no ve: transiciones ilegales, carreras, exposición de datos |

## 3. Evidencia

### 3.1 SifAcademy (julio 2026): review adversarial en cada task

Contexto: kit v0.4.0, orquestación montada a mano por el hilo principal (Opus), implementadores Opus o Sonnet, **sin
tests RED escritos por el hilo principal antes de implementar** (cada implementador escribía los suyos).

| Task | Montaje de la review | Hallazgos | Confirmados | Qué cazó | Coste de la task |
| --- | --- | --- | --- | --- | --- |
| 0001 Dominio y datos | 2 revisores adversariales + verificadores + fixer (11 agentes en total) | 4 | 4 | **1 alto**: `Publish` no exigía estado `Draft`, un curso oculto podía re-publicarse. 1 medio: carrera SELECT+UPDATE sin transacción. 1 medio de DDL, 1 bajo de test faltante | ~42 min de workflow, ~880k tokens |
| 0002 Auth real | 3 revisores (correctness / compliance / seguridad) + fixer (13 agentes) | 2 | 2 | ambos corregidos; la lente de seguridad forzó verificar que el hash no se exponía, 0 falsos positivos | ~57 min, ~1,15M tokens |
| 0004 Backoffice estudiantes y admins | 1 Sonnet sobre el diff completo | 0 (≥ 80 de confianza) | 0 | nada | ~0,8 h la task |
| 0005 Portal catálogo | 3 lentes backend + 3 frontend (15 agentes en la task) | 6 en frontend | 6 | 3 HIGH (guard de concurrencia en `cargar()`, spinner real, botón deshabilitado durante la suscripción) y 3 MEDIUM (error de carga, debounce, a11y) que el fix automático no tocó por el umbral y se cerraron a mano | ~34 min de runtime, ~1 h la task |
| 0007 Chatbot RAG | 4 lentes × refutación independiente (23 agentes) | 19 | **0 según el refutador automático; 2 reales tras revisión manual** | aviso de "filtro ignorado" descartado en la rama de cero resultados (lo señalaron 3 lentes a la vez); parámetros sin comprobar tipo en el único tool con `Strict => false` | ~1,3 h la task, de las que un tramo fue revisar a mano los 19 hallazgos |

Lecturas que salen de la tabla:

- **Cuando el implementador trabaja sin contrato cerrado, la review adversarial caza bugs reales y graves** (0001,
  0002, 0005). El de `Publish` habría llegado a producción.
- **Cuando el diff es pequeño o el contrato ya está fijado, devuelve cero** (0004) o **ruido caro** (0007: 23
  agentes para 2 defectos que además el refutador automático tumbó).
- **El refutador automático con sesgo "ante la duda, refuta" es un defecto del montaje, no una virtud.** En la
  0007 la señal útil fue la coincidencia de tres lentes en el mismo punto. El veredicto automático sirve para
  ordenar, no para decidir. Esto ya está anotado en el aprendizaje de la 0007 y en la constitution de SifAcademy.
- **Pasar solo `critical/high` al fixer deja MEDIUM reales sin cerrar** (0005). Si se monta review reforzada, el
  triage tiene que incluir los MEDIUM.

### 3.2 SifRest (septiembre 2026): contrato en la spec, tests RED del hilo principal, review de superpowers

Contexto: kit alineado a superpowers 6.3.0, `subagent-driven-development` por defecto, el hilo principal escribe
los tests RED antes de despachar, 1-2 Sonnet implementan con las restricciones globales en el encargo.

- Dieciséis tasks y cuatro patches en tres releases. Ratio real/estimado 0,15 (v1.0.0), 0,21 (v1.1.0), 0,34 (v1.2.0,
  con un refactor grande). Sin review adversarial en ninguna.
- Hallazgos funcionales de los tres smokes de release: 1 (selector "Sin entorno", deuda ya anotada de la 0005), 0
  y 0. Más un hotfix del smoke del dev (menú lateral contextual, `0008b`).
- Las incidencias de las tasks no fueron de lógica: selectores de E2E, un `using` en un test del hilo principal,
  paralelismo de Playwright. Ninguna la habría cazado una review adversarial del diff.

### 3.3 Experimento encadenado (9 de septiembre): una sola review contra la spec

Brazo B: mismo Sonnet que el brazo A, con spec y plan escritos desde el funcional; **una review de spec por otro
Sonnet** tras cada task (cumplimiento de los criterios de la spec y calidad).

| Task | Veredicto de la review | Qué encontró |
| --- | --- | --- |
| T1 Auth | Needs fixes | 1 comentario con cita a la constitution (regla prohibida en el plan) |
| T2 Historial | aprobada | nada funcional |
| T3 Buscar proyectos | Needs fixes | 3 comentarios con citas; spec cumplida en los seis criterios |
| T4 Importar auth | aprobada | 3 minors de cobertura |

Checklist ciego: 35/35 en B, 26/35 en A. Los 9 puntos de diferencia no los encontró la review: los evitó la spec
(dónde viven los datos, idioma de los nombres, límites de la búsqueda, aviso de secreto en claro). **La review de
código cazó lo que la instrucción sola no evita (cuatro violaciones de una regla que estaba en el plan), y la spec
evitó lo que ninguna review de código ve.**

### 3.4 Coste comparado, por task

| Montaje | Tiempo por task | Tokens por task | Rendimiento observado |
| --- | --- | --- | --- |
| SifAcademy: implementadores + review adversarial 2-6 lentes | 0,8 a 2 h | 0,8 a 1,15 M | 2-6 hallazgos reales en tasks de auth, estado y portal; 0-2 en el resto, con ruido |
| SifRest: contrato en spec + tests RED + review de superpowers | 0,3 a 0,45 h | 0,2 a 0,35 M por implementador, +0,1 a 0,15 M de review | 0 hallazgos funcionales en tres smokes; la review caza desvíos de reglas |
| Experimento B: spec + una review Sonnet | 1,5× el brazo A | 1,8× el brazo A | 35/35 frente a 26/35 |

Cautelas: no es un experimento controlado entre montajes de review (cambió el modelo implementador, el kit y la
experiencia acumulada entre julio y septiembre); N pequeño; el 0007 muestra que "0 confirmados" del refutador
no significa "0 defectos".

## 4. Propuesta detallada

### 4.1 Review de spec: se queda, con una señal más en la rúbrica

Lo que hoy hace `review-spec.md` es correcto y barato: un Sonnet por lente, sin leer código, antes del gate. Se
propone **añadir una señal a la tabla del §1**, porque es el hueco concreto que costó nueve hallazgos en el smoke de
SifAcademy:

| Señal | Se cumple si… |
| --- | --- |
| Reglas de visibilidad o permiso | el delta introduce un rol, un estado o una condición que decide **qué no debe ver o hacer** alguien (el funcional suele decir qué hace cada rol y callar lo que no debe) |

Con esa señal activa, la lente **dominio** debe preguntar explícitamente por el complemento: para cada rol o estado,
qué queda prohibido. En SifAcademy hubo que añadir la §5.4 "visibilidad por rol" al funcional después del smoke;
con la señal, habría salido en la review de la spec de la 0002 o la 0005.

Nada más cambia en la review de spec.

### 4.2 Review de código: la de superpowers, sin guidance del kit

`subagent-driven-development` ya hace por task: implementador → revisor de cumplimiento de spec → revisor de
calidad → fix → re-review, y una revisión final. El kit ya aporta lo que superpowers no ejecuta (las restricciones
globales viajan en el encargo de cada subagente, incluidos revisores). No hay hueco demostrado para escribir una
review de código propia: en SifRest y en el brazo B bastó.

Se mantiene la regla actual de `sdd-end-task` paso 9: `requesting-code-review` solo si la task se ejecutó en línea.

### 4.3 Review adversarial: opt-in por task, declarada en el plan

No entra como default por tres motivos medidos: su rendimiento cae a cero cuando el contrato va en la spec y los
tests RED los escribe el hilo principal; su coste no baja (23 agentes en la 0007); y con refutador automático
tumba hallazgos verdaderos.

Se propone un campo opcional en el plan, por task, junto a `Ejecución` y `Modelo`:

```markdown
- **Review reforzada**: sí — motivo: <auth | roles y permisos | concurrencia | dinero o datos personales | otro con justificación>
  Lentes: <correctness, seguridad, concurrencia…>  ·  Modelo: Sonnet, effort medium  ·  Tope: 3 lentes
```

Reglas de la review reforzada, cuando se activa:

1. **Se despacha después de la review de superpowers, no en su lugar**, sobre el diff completo de la task.
2. **Máximo tres lentes en paralelo**, una por riesgo declarado. Nunca "todas las lentes por si acaso".
3. **Sin refutador automático como juez.** Cada lente devuelve una lista numerada
   `<Crítico|Importante|Menor> · <fichero:línea> · <qué falla> · <cómo reproducirlo>`. El hilo principal hace el
   triage con dos criterios: un hallazgo señalado por dos lentes se trata como confirmado salvo prueba en contra;
   cualquier Crítico o Importante se reproduce con un test RED antes de descartarlo.
4. **Los MEDIUM (Importante) entran en el fix**, no solo los críticos (lección de la 0005).
5. **Se registra en el walkthrough**: lentes, hallazgos, confirmados, corregidos, tokens. Es lo que permitirá
   revisar esta decisión con datos en la siguiente release del kit.

Criterios para que el redactor del plan proponga activarla (el usuario decide en el gate del plan):

- la task toca autenticación, sesiones, hashes o tokens;
- introduce o cambia roles, permisos o visibilidad por estado;
- tiene mutaciones concurrentes sobre el mismo dato (SELECT + UPDATE, contadores, transiciones de estado);
- mueve dinero, datos personales o secretos;
- el implementador trabaja **sin** tests RED previos del hilo principal (entonces la review es la única red).

En SifAcademy, con estos criterios, la habrían llevado la 0001 (transiciones de estado), la 0002 (auth) y la 0005
(concurrencia en la suscripción). No la 0004 ni la 0007, que fueron las dos con rendimiento cero.

### 4.4 Cumplimiento del Art. I (ley de hierro): qué RED hace falta antes de tocar las skills

La propuesta añade guidance en dos sitios (una señal en `review-spec.md`, un campo opcional en `plan-template` y su
manejo en `sdd-start-task` paso 6). Art. I exige un RED que demuestre el fallo del baseline. Propuesta de RED:

1. **Señal de visibilidad.** Fixture: un `funcional/` con dos roles descritos por lo que hacen y una spec que añade
   un tercer rol. Baseline: la review de spec actual. Fallo esperado: no pregunta qué no debe ver el rol nuevo.
   GREEN: con la señal, la lente dominio lo pregunta.
2. **Review reforzada.** Fixture: una task con un bug plantado del tipo 0001 (transición de estado sin guarda) y
   tests que no la cubren. Baseline: `subagent-driven-development` solo. Si su review de dos pasadas caza el bug,
   **la review reforzada no se añade** y este documento se archiva con ese resultado. Si no lo caza, GREEN con la
   review reforzada de una lente (correctness) y comprobación de que el hallazgo llega al triage sin refutador.

Si el RED 2 sale verde en el baseline, la decisión del §1.3 se reduce a "no añadir nada": es el resultado
preferible según Art. IX.

## 5. Resumen para el roadmap del kit

| Ítem | Acción | Tamaño |
| --- | --- | --- |
| Review de spec | mantener; añadir la señal "reglas de visibilidad o permiso" y la pregunta del complemento en la lente dominio | patch |
| Review de código | sin cambios; sigue delegada en `subagent-driven-development` | ninguna |
| Review adversarial | no default; campo opcional `Review reforzada` en el plan con criterios, tope de tres lentes, triage sin refutador automático, registro en el walkthrough | task lite, condicionada al RED 2 |
| Evidencia | enlazar este documento desde `.docs/sdd/` del kit como fuente de la decisión | — |
