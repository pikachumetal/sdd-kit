---
id: 20261011-143353-feature-0165-tdd-and-debugging
feature: 0165
title: Walkthrough — sdd-tdd y sdd-debugging, forks delgados
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-10-11
---

# Walkthrough — `sdd-tdd` y `sdd-debugging`

## 1. Cambios realizados

- **Escenarios y RED** (`de333606`): `t2` (tautología), `t3` (costura y acoplamiento), `t5a`/`t5b` (escritor de RED en Native) y `t1a`/`t1b` (A/B del encargo) en la batería de `sdd-implement`, con las features 0016 (horas) y 0017 (reactivar) del molde. Los cuatro escenarios del RED salieron limpios, y el hilo vio fallar su RED en 4 de 4: no entran ni los antipatrones de Matt, ni la costura, ni la regla del hilo, ni el escritor de RED.
- **`sdd-tdd`** (`a37f85e5`): fork delgado de `test-driven-development` 7.0.0 (604 palabras en `SKILL.md` frente a 1.475), con `writing-good-tests.md` entero y su `NOTICE`. Lo carga el hilo en el paso 5 de la preparación de `sdd-implement`. El encargo del implementador gana un primer paso: ejecutar el RED antes de tocar código y guardar su salida en rojo. A/B: el paso solo y el paso con la carga de la skill dieron 2/2 cada uno; gana el paso solo.
- **`sdd-debugging`** (`10476382`): fork delgado de `systematic-debugging` 7.0.0 (815 palabras frente a 1.454), con `root-cause-tracing.md`, `defense-in-depth.md`, `condition-based-waiting.md` y su `NOTICE`; `find-polluter.sh` queda en una línea. Regla nueva: en un patch, la fase 4 empieza con §2 de `patch.md` escrito. Recableado del nombre en `sdd-implement`, `sdd-start-patch`, `sdd-propose`, `sdd-start-feature` y las plantillas de patch y tasks. `sdd-explore` deja los fallos a `sdd-propose`. El kit invoca ahora 4 skills de superpowers.
- **Documentos** (`37a2704f`): `CLAUDE.md` (20 skills), árbol de `architecture.md`, la regla para poner al día un fork en `tech-stack.md` (fundida con el aprendizaje de la task 0026), filas del roadmap (B17, dos de deuda, re-medida del RED del hilo, nota de `cli/src/tasks/` en la 0152 y la 7.1.0 corregida) y las enmiendas de la spec.
- **Pasada de fix de la revisión final** (juntada en el commit de cierre): el encargo para ante un RED recibido que ya pasa y carga `sdd-tdd` para un test propio del implementador; `sdd-tdd` acepta el error de compilación del símbolo que crea la task; la `description` de `sdd-explore` dice «fixing a failure (sdd-propose)»; Pester de forma para cada hallazgo.
- **Integraciones de la base**: `6b651ea0` (la 0168, antes de la Task 1) y `e4eea0f3` (el triaje de su ticket, antes de la Task 5), las dos por decisión del dev-lead ante el freno de alcance.

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 3,5 h
- Esfuerzo real: 2,0 h — reloj del hilo por las marcas de los commits, de la apertura (`38fcd080`, 18:03) a la pasada de fix (20:03), más ~20 min de cierre. Spec y plan: ~1,5 h, con la discusión del abogado del diablo, la comprobación en la web de otros kits y un corte de luz.
- Desviación: −1,5 h (−43 %)
- Causa de la desviación: los cuatro escenarios del RED salieron limpios, así que no hubo GREEN de esas piezas, y la Task 3 se saltó; los sujetos fueron baratos (~0,10-0,45 $ cada uno). Lo caro fue `d1`: tres tandas para llegar a 2/2.
- Compactación: no
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 98.868.919 — claude-opus-5-5 98.868.919
- Tokens de subagentes: 3.360.911 en 1 despacho — Revisor final 0165 claude-opus-5-5 3.360.911 / 4 min
- Coste de la sesión: 31,31 $ (hilo 29,05 $ + subagentes 2,26 $)
- Coste de sujetos: 7,38 $ en 27 sujetos sonnet — RED `t2`-`t5` 1,85 $; GREEN `t1a`, `t1b` y `h1` 1,30 $; `d1` (RED y tres tandas GREEN) y `f1` ~3,90 $; pasada de fix `t1c` y `f1` ~0,35 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- La Task 3 (escritor de RED opcional) se saltó: `t5` no ganó.
- `d1` necesitó dos rondas de REFACTOR y una regla que la spec no tenía (el AND de §2 de `patch.md` antes del arreglo), aprobada por el dev-lead como enmienda.
- La base se movió dos veces; las dos se integraron por decisión del dev-lead, y la segunda trajo una fila nueva para esta feature (la regla de forks).

### Decisiones tomadas sin el dev-lead

- Task 1: base movida por la 0168, que tocaba ficheros de las Tasks 2-5 — el dev-lead eligió fusionar; recuentos de la frase del README corregidos en plan y spec (6 → 5 → 4).
- Task 2: el paso del encargo dice «Before touching code…» y no «Before touching `src/`…», el literal de la spec — `src/` es la ruta del molde, no la de un proyecto .NET o Angular (enmienda en la spec).
- Task 2: la fila de racionalización «The plan's code is right, skip watching the test fail» pasa de `sdd-implement` a `sdd-tdd` — así `sdd-implement` cabe en su tope de 9.000.
- Task 2: el paso del encargo se acorta y la «TDD Evidence» remite a él — mismo contenido, por el tope.
- Task 2: A/B de `t1` — gana A; el encargo no carga `sdd-tdd` (contradice la decisión inicial del dev-lead, como preveía la spec).
- Task 2: el RED de forma cambió solo el literal del paso del encargo.
- Task 4: `sdd-start-feature` también invocaba `superpowers:systematic-debugging` y la decisión 9 no lo listaba — se recableó igual.
- Task 4: la salida «investigating a failure → `sdd-propose`» del paso 5 de `sdd-explore` contradecía ese mismo paso — un fallo que hay que arreglar es un patch, por el roadmap; decisión 8 corregida.
- Task 4: `e1` del plan se llama `f1`, porque la batería de `sdd-explore` ya tenía un `e1`.
- Task 4: regla nueva con RED en `sdd-debugging` y dos rondas de REFACTOR; tope de 900 en `SKILL.md`, bajo el techo de 1.100.
- Task 5: el AND de `sdd-debugging` se commiteó antes de pedir la aprobación; aprobado después.
- Task 5: sale de `tech-stack.md` el aprendizaje de la feature 0032, que la CLI de la 0143 dejó sin objeto, para que quepa la regla de forks.
- Final: `architecture.md` pierde «en forma exec» en la línea de `hooks/` y el «(+ NOTICE)» del árbol, por su tope de 1.900.

## 4. Verificación

### 4.1 Builds

- Gate de cierre (`no declarado` en `tech-stack.md`; el de la 0147 y la 0160): `moon run kit:test cli:typecheck cli:test cli:test-slow cli:test-min` → CLI 741/741, lentos 157/157, Node mínimo 914/914, Pester 1.134/1.134 (14 omitidos), sobre la pasada de fix.
- `sdd roadmap check` → válido; `sdd capability check` → 18 capacidades válidas.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-11 · suite completa en verde (arriba) · smoke 2/2 THEN con ejecución real por sujetos headless (`t1a` 2/2, `t1c` 2/2, `d1` 2/2, `f1`, `h1`) · revisión final opus effort high sobre `37a2704f`, con 6 Important arreglados con su test en el commit de cierre.

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Quien implementa ejecuta el RED antes de editar `src/` y lo reporta en «TDD Evidence» | ejecución real (`t1a` 2/2; `t1b` 2/2; con un RED que ya pasa, `t1c` 2/2 `DONE_WITH_CONCERNS` sin implementar) | ✅ |
| Un fallo se investiga con `sdd-debugging`, causa antes del arreglo y test en rojo antes del fix | ejecución real (`d1` ronda 2, 2/2) | ✅ |
| En un patch, §2 de `patch.md` lleva la causa antes de editar el código | ejecución real (`d1` ronda 2, 2/2; RED 1/2) | ✅ |
| Ningún fichero de `skills/` invoca las dos skills de superpowers | suite (`TddSkills.Tests.ps1`, `Skills.Tests.ps1`) | ✅ |
| Routing: un patch visual no invoca `sdd-debugging`; uno de solución fijada lleva §2 sin causa raíz | suite (`TddSkills.Tests.ps1`, la variante del ajuste visual) y lectura | ✅ |

### 4.3 Residuales / deuda generada

- Filas de deuda «Esperar 2.º ticket»: antipatrones de Matt y costura en `sdd-tdd`; escritor de RED en Native.
- Backlog B17: TDD en legacy sin tests.
- La 0152 revisa si los scripts que porta `cli/src/tasks/` cambiaron en superpowers 7.0.0.
- La fila del patch 0101 («un patch reproduce la causa con un test RED sin invocar `systematic-debugging`») sigue esperando su ticket, con un dato nuevo: con la skill del kit, 7 de 7 sujetos de `d1` la invocan; con la de superpowers, 0 de 2.

## 5. Aprendizajes

- Un fallo de forma (el implementador no ejecuta el RED que le llega) se curó con un paso literal en el encargo, sin cargar la skill: 2/2 frente a 4/4 de fallo con la petición en el informe. Cargar 2.000 palabras daba lo mismo → `tech-stack.md`, «Baterías por skill».
- Una regla que se aplica en un punto concreto va en ese punto: «escribe la causa antes de la fase 4» en la fase 1 dio 1/2; a la entrada de la fase 4, 2/2. Confirma «Una regla que solo vive en una referencia no se lee» y «Un traspaso a otra skill es lo primero del paso» → ya en `tech-stack.md`, sin cambio.
- Un fork delgado se decide midiendo: con `writing-good-tests.md` cargado, los antipatrones de Matt y la costura no aportaban (0/4), y el escritor de RED tampoco → filas de deuda del roadmap.
- Un dato de un ticket se comprueba antes de actuar: la «7.1.0» de la fila de triaje no existía (la última es la 7.0.0) → corregido en el roadmap; sin regla nueva.
- Revisión de skills: se revisaron al hacerlas `sdd-tdd`, `sdd-debugging`, `sdd-implement`, `sdd-explore` y `sdd-start-patch`; nada más que llevar a otra skill.

## 6. Adendas
