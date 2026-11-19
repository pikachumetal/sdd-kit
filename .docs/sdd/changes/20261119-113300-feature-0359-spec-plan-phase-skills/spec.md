---
id: 20261119-113300-feature-0359-spec-plan-phase-skills
feature: 0359
title: La spec y el plan se escriben en skills de fase, y la entrevista no tiene puerta para no preguntar
mode: full
profile: delegate
status: approved
created: 2026-11-19
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-19
---

# Spec — La spec y el plan se escriben en skills de fase, y la entrevista no tiene puerta para no preguntar

🦆 Hoy, al arrancar una feature, el agente lee la regla de la entrevista y decide en privado que no tiene nada que preguntarte. En la 0633 mandó al ✋ cuatro decisiones que eran tuyas. Con este cambio, la spec se escribe en una skill propia, `sdd-spec-writing`, que se carga entera. Antes de escribir nada te enseña los tres montones (lo que ya está contestado, lo menor que decide él y lo tuyo), cada punto que no te pregunta con una línea de por qué, y, si estás para contestar, para en un turno tuyo antes de escribir la spec. Si el prompt traía «Abierto: separador (propuesta: `;`)», la primera pregunta es esa y cita el `;` como propuesta del prompt. La review de la spec pasa a `sdd-spec-review` y el plan a `sdd-plan-writing`, así que, si en un transcript no ves esas tres invocaciones, sabes que falta algo.

Validación: agente — es guía del kit; lo que haría una persona lo miden las baterías, y el uso real lo da la validación en campo (`validation.mode: field`): el recuento de invocaciones sobre los transcripts de las sesiones de feature tras la release.

## Capacidades

- Modificadas: `feature-flow` — la spec y el plan se escriben en sus skills de fase; con el montón del dev-lead vacío, la entrevista para igual.
- Modificadas: `routing` — la spec la lleva `sdd-spec-writing`, no una referencia de `sdd-propose`; las skills de fase no son puerta de entrada.
- Modificadas: `interviewing` — la parada de `sdd-spec-writing` con el montón vacío es la única confirmación antes del gate de la spec.
- Modificadas: `spec-review` — la pregunta de cuántos revisores va en prosa numerada.
- Modificadas: `control-profiles` — el revisor de una enmienda usa la rúbrica de `sdd-spec-review`.
- Modificadas: `verification` — las señales del eje Arquitectura salen de `sdd-plan-writing`.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: dos revisores — señales: `MODIFIED` (diecisiete requisitos de seis capacidades), tres o más capacidades (seis), zona sin explorar (`architecture.md` y `operations.md` no leídos enteros en esta sesión) · tamaño: ~1.200 líneas en ~25 ficheros
- Dominio (opus): si el `MODIFIED` de «La entrevista pregunta solo lo que falta y es del dev-lead» (la parada con el montón vacío) contradice «El perfil de control decide dónde para el agente» de `control-profiles`, y si la tabla «regla retirada → dónde vive ahora» deja alguna regla de los pasos 4 y 5 sin destino (señal: `MODIFIED`)
- Técnica (sonnet): si los tres `SKILL.md` caben en 20.000 bytes y el fork conserva el 50 % de `brainstorming` con los cortes de la decisión 5, y si cada referencia que se mueve tiene su sitio nuevo en `Lo que se retira o cambia de forma` (señal: tres o más capacidades + zona sin explorar)
- Mínimo razonable: solo la técnica — deja sin mirar si alguna regla medida de `sdd-propose` se pierde al moverse, que es el fallo de `debt.md:80` («reescribir o mover una regla medida la pierde»)

1. Enfoque: forks con bloques del kit, al modo de `sdd-tdd` y `sdd-verify`, frente a reescribirlas como skills propias con el concepto y a seguir con referencias más visibles (ver Approach). Los forks y las skills separadas los decidiste tú; el reparto de los bloques es mío.
2. `sdd-spec-writing` es copia de `skills/brainstorming/SKILL.md` de superpowers v7.0.2, con entrada `copy` en `upstream.json`; `builder-check-prompt.md`, `visual-companion.md` y `scripts/` de su carpeta van a `notCopied` (`kit:copies` da rojo con un fichero de la carpeta sin mapear).
3. `sdd-plan-writing` es copia de `skills/writing-plans/SKILL.md` v7.0.2. Salen, sustituidos: «Plan Document Header» y «Task Structure» (los fija `plan-template.md`), «Save plans to» (`changes/<carpeta>/plan.md`), la línea `REQUIRED SUB-SKILL` de superpowers y «Execution Handoff», que pasa a la línea `Ejecución`, el eje Arquitectura y el traspaso a `sdd-implement`.
4. `sdd-spec-review` es propia: la rúbrica no viene de ninguna fuente (`skills/sdd-propose/` está en `own` y `review-spec.md` no tiene entrada en `upstream.json`). Lleva en `SKILL.md` §1, §2 y §4 de `review-spec.md` literales, y el brief del revisor (§3) en `references/reviewer-brief.md`, porque se pega a un subagente y no lo sigue la sesión. `sdd-spec-writing` la invoca tras el repaso de coherencia, en full y lite.
5. Cortes del fork de `brainstorming`, cada uno con su marca `sustituye` y una línea del kit en su sitio, sin `quita` (Art. IX: quitar sin sustituir pide un A/B): «Size the Work» se sustituye por «trocear ya lo preguntó `sdd-propose`; si crece, para y sube de tamaño»; el «Builder check» se sustituye por la invocación de `sdd-spec-review`; «Visual Companion» y el punto «Show, don't tell» se sustituyen por la regla de enseñar de `sdd-grilling`; «Spike to feel things out» por el carril spike; «Where it goes» por `changes/<carpeta>/spec.md` con `spec-template.md`; el `<HARD-GATE>` por el gate de aprobación del kit; «First: What Do You Actually Know?», que deja hacer una tarea clara sin conversación, por la clasificación de `sdd-propose`, que ya decidió que es feature. Conserva, sin medir, ~60 % del original; `kit:copies` lo mide y por debajo del 50 % da rojo.
6. El *cómo* de preguntar vive en `sdd-grilling` (lo decidiste tú). En el fork, lo que `sdd-grilling` ya dice —«Get them describing», «Ask one at a time», pensar varias ideas y descartar las flojas— se sustituye por «ask with `sdd-grilling`». **Cambio sobre lo que hablamos**: lo que `sdd-grilling` no tiene —preguntas concretas que se apoyan en la última respuesta o en un hallazgo, y una propuesta corregible con su motivo— se queda en el fork, como texto de la fuente, y no pasa a `sdd-grilling`: moverlo es guía nueva en una skill propia y pide un RED que esta feature no tiene (segunda ronda, hallazgo 8). Llevarlo a `sdd-grilling` va a otra fila con su RED. `sdd-grilling` no cambia.
7. La regla «Discovery» de `sdd-grilling` no cambia: lo que solo sabe el usuario se pregunta abierto y, si no lo sabe, queda pendiente. En esta sesión propuse antiobjetivos tras tu «no lo sé», como haría `brainstorming` («propose something concrete»), y te valieron. Llevarlo a la regla es otra decisión, con su RED: va a otra fila si la sesión de coordinación lo ve.
8. Un solo mensaje con los montones, y para (tu decisión): el primer mensaje tras clasificar lleva la nota de entendimiento y los tres montones, y acaba en la primera pregunta del montón del dev-lead —el porqué primero, si falta—; con ese montón vacío, acaba con el enfoque elegido en una línea y el diseño corto, pidiendo que lo confirmes. Es «Your First Message» de `brainstorming` («end with the short design itself … and ask them to approve it»), cambiado solo en que esa confirmación no aprueba la spec: el gate sigue después de `spec.md`. Las preguntas siguientes del montón, una por turno, son la entrevista de siempre, no paradas nuevas; los montones no se repiten.
9. Sin el dev-lead para contestar (spec aprobada por delegación, «empieza ya») o en `unattended`, no hay mensaje de montones ni parada: `sdd-spec-writing` se invoca igual, y lo del montón del dev-lead va al ✋ marcado «pendiente», cada punto con su porqué, o aparca la feature en `unattended`, como hoy. `iq4` mide la delegada (fila nueva de `tools:`, la invocación); `unattended` y «empieza ya» quedan sin escenario: la regla es la misma y su texto no los distingue.
10. La pregunta de cuántos revisores va en prosa numerada al final del mensaje, nunca con una herramienta de diálogo, también con instrucciones del usuario que piden diálogos para preguntas cerradas. Va en `sdd-spec-review` §2, en la línea que hoy no dice forma, y no como regla general de `sdd-propose` (lo que proponía el ticket): las demás preguntas de `sdd-propose` ya la dicen (gate, carril).
11. `sdd-propose` se queda con el contexto, el carril, la rama y el id, el anuncio y trocear, y traspasa por nombre: feature, lite y spike, a `sdd-spec-writing`; patch, a `sdd-implement`; config, a su carril. La nota de entendimiento pasa al fork (es su «Your First Message»); el anuncio se queda en `sdd-propose`, porque depende del carril.
12. `sdd-spec-writing` traspasa: full y spike, a `sdd-plan-writing`; lite, a `sdd-implement`. `sdd-plan-writing` traspasa a `sdd-implement`. Las paradas por perfil (la del plan en `pair`, la de antes de la Task 1) siguen donde están, en la skill que las tiene hoy.
13. `control-profiles.md`, `nombrado.md`, `modo-lite.md`, `patch-lane.md` y `config-lane.md` se quedan en `sdd-propose/references/`; las skills de fase los enlazan por ruta (`../sdd-propose/references/control-profiles.md`), como `sdd-propose` enlaza hoy `commit-milestones.md` de `sdd-implement`.
14. Las ADR que nombran en `rutas` ficheros que se mueven (0015, 0024, 0028, 0029, 0035) no se tocan: son inmutables (`architecture.md:92`). La ADR 0038 lleva en sus `rutas` las tres skills nuevas y nombra en su cuerpo esas cinco como las que rigen el texto movido. A cambio, `sdd decision index --files skills/sdd-spec-review/SKILL.md` da la 0038 y no la 0024.
15. ADR nueva: `0038-mandatory-phase-in-a-skill.md`, «Una fase obligatoria va en una skill que se carga entera; las referencias son solo de consulta», con el recuento de 14 de 15 sesiones que leen `spec-writing.md` y 5 que no invocan `sdd-grilling`. En la constitución entra como una línea del Art. II («Elemento omitido»), que es donde vive la forma de un paso que se salta, no como artículo nuevo. Sustituye la primera frase del punto 6 de `architecture.md` («la unidad de descomposición de una skill es el fichero auxiliar, no otra skill»), que dice lo contrario: el punto 6 pasa a decir que una fase obligatoria va en su skill y un auxiliar es de consulta, y conserva sus mediciones (0/2 sujetos leyeron el auxiliar de la 0013), que son evidencia de la regla nueva.
16. Antiobjetivos: los cuatro de la Intent, que te propuse tras tu «no lo sé».
17. Pruebas (Art. I): escenarios nuevos en la batería de `sdd-propose` —`ss1`, el criterio de aceptación del ticket §1 literal (prompt de arranque con «Abierto» de dos puntos con propuesta, un enfoque técnico que obliga a un efecto visible no pedido y una lista larga de «Antes de diseñar, lee»), n = 3; `rq1`, el del ticket §2 (dos revisores, sin delegar, con instrucciones del usuario que piden confirmar antes de paralelizar y diálogos para preguntas cerradas), n = 3, para que un RED limpio 3 de 3 pueda sacarlo del Scope—; `iq3` cambia su AND (decisión 23); `rv1` añade la fila de invocar `sdd-spec-review`; `iq2` cambia su fila `IQ5` (decisión 8); `p2` y `k2p` añaden la fila de invocar `sdd-plan-writing`; el tramo de la spec y el plan a n = 1 (Art. I: retirar o mover reglas de una skill es editarla); y la batería del entrevistador, `p1 p2 p3 fp pe` (ADR 0035, al tocar el núcleo). `ss1` y `rq1` entran con «si el RED lo exhibe»: hay caso de campo (5 de 15 sesiones; dos rechazos en la 0633).
18. La previsión de coste: el tramo y el entrevistador, medidos con `plan`; los escenarios nuevos, `sin medir`, al precio medio del tramo (0,88 $ por sujeto). Suma ~72 $.
19. Topes de palabras (ver «Topes de palabras»), que apruebas en el gate: los de las tres skills nuevas suben por tu decisión, y el de la constitución, ~50 palabras; el de `sdd-propose` baja; el de `sdd-grilling` no cambia. El saldo de las skills que toca sube ~1.900 palabras, contra la regla 6 del `CLAUDE.md` del repo («el saldo… queda igual o baja»): la excepción es tu decisión de sacar las fases a skills, y la cifra va aquí para que la veas.
20. Riesgo de tamaño, en bytes (lo que mide `kit:skill-size`): `sdd-spec-writing` ~18.500 (60 % de los 15.190 de `brainstorming` + `spec-writing.md` 7.251 + `coherence-pass.md` 2.488 + el gate ~2.000 − ~2.400 que sustituyen texto del original), `sdd-plan-writing` ~10.700 (63 % de los 10.335 de `writing-plans` + ~4.200 de `plan-writing.md`), `sdd-spec-review` ~6.900 (`review-spec.md` 9.645 menos el brief). Todos `sin medir`. Si uno pasa de 20.000, es un desvío y para: no se recorta texto medido sin RED.
21. «Lo impone la técnica» no saca un punto del montón del dev-lead si cambia lo que ve el usuario: va al texto de los montones de `sdd-spec-writing` como contraejemplo del montón «menor» (Art. II: una excepción lleva su contraejemplo), y `ss1` lo mide.
22. Los nombres de los montones son en inglés solo dentro de la skill (**answered**, **minor**, **the dev-lead's**), como hoy; al usuario se le enseñan en su idioma («contestado», «menor», «del dev-lead»), como pide la línea de idioma de cada skill (Art. III).
23. Todo punto de «Abierto» va al montón del dev-lead, como dice el prompt de arranque, también uno de método, con su contraejemplo en la skill («es de método y en `delegate` lo decido yo» no lo saca: el prompt lo dejó abierto para el dev-lead; manda sobre «decide lo de método» del perfil): `iq3` cambia su AND, y el nombre del fichero de test (`test/export.test.js`) pasa de no preguntarse a quedar en tu montón con su propuesta, preguntado en un turno posterior al del separador. Cuesta un turno en ese caso; la sesión de coordinación, que escribe «Abierto» (0357), puede evitarlo no poniendo ahí lo de método.
24. Las skills de fase no son puerta de entrada: su `description` dice «Invoked from <la anterior>; not the entry of a change (that is sdd-propose)», como `sdd-tdd`, y no llevan `user-invocable: false`, que tampoco lleva `sdd-tdd`. `using-sdd` no cambia: su tabla ya manda todo cambio a `sdd-propose`.
25. `sdd-spec-review` devuelve hallazgos y no aprueba ni edita la spec: los incorpora `sdd-spec-writing` (§4 de la rúbrica, como hoy).
26. `sdd-plan-writing` conserva, sin medir, ~63 % de `writing-plans` (Overview, Scope Check, File Structure, Task Right-Sizing, Step Granularity, What a Step Contains, Self-Review, y el texto de Global Constraints y Review Focus); por debajo del 50 %, `kit:copies` da rojo y es un desvío.
27. El aviso de fase («Ahora: … Queda: …») sale de `sdd-propose/SKILL.md` a `includes/phase-notice.md`, que incluyen `sdd-propose` y las tres skills de fase: `kit:own` no deja la regla en cuatro sitios, y sin ella las fases no la tienen.
28. Repaso de coherencia: el delta, probado en una copia de `.docs/sdd` con `sdd capability merge` → diecisiete requisitos sustituidos y dos añadidos en seis capacidades, sin rechazos; los retirados, buscados con `git grep` fuera de las carpetas de evidencia, añadieron a la tabla `sdd-config/SKILL.md:29`, `patch-lane.md:14` y las peticiones «sigue: paso 4/5» de la batería; la review añadió los requisitos que nombran el paso de spec o de plan de `sdd-propose`.

### Hallazgos de la review

- **Aceptado** — Crítico (técnica 1, dominio 6 y 5): requisitos vigentes que nombran el paso de spec o de plan de `sdd-propose` → `MODIFIED` de «El gate de cierre del plan», «`sdd-propose` entrega el cambio», «Pedir empezar ya», «La spec se repasa» y «El patch registra quién fijó la solución», con su fila en la tabla; el AND repetido del `ADDED` del plan sale.
- **Aceptado** — Crítico (dominio 1): «Cuándo para la entrevista» de `interviewing` decía que el gate de la spec es la única confirmación → `MODIFIED`, con la excepción del mensaje de los montones y `sdd-spec-writing` en lugar de `sdd-propose`.
- **Aceptado** — Crítico (dominio 2): «Una feature grande…» decía que en `delegate` no hay mensaje de enfoques → `MODIFIED`: con el montón vacío, el mensaje de los montones nombra el enfoque en una línea.
- **Aceptado** — Crítico (dominio 4): los nombres de los montones en inglés frente al idioma del usuario → decisión 22: en inglés solo dentro de la skill.
- **Aceptado** — `rq1` con n = 2 no puede salir con «si el RED lo exhibe» → n = 3 (decisión 17).
- **Aceptado** — el porqué de relleno pasaba la fila → AND nuevo en el `ADDED` de los montones y fila que compara con los puntos sembrados («Dónde se prueba»).
- **Aceptado** — la invocación de `sdd-spec-review` sin escenario → fila de `tools:` en `rv1`. **Rechazado** — un `MODIFIED` de `interviewing` por lo que recibe `sdd-grilling` (decisión 6): es texto de la fuente, cuya evidencia vale (Art. IX), no una conducta nueva; lo vigila la batería del entrevistador.
- **Aceptado** — dos paradas antes de `spec.md` (el porqué y luego los montones) → decisión 8: un solo mensaje de montones, que acaba en la primera pregunta o en el diseño corto; antiobjetivo 1 acotado al montón vacío.
- **Aceptado** — faltaban las filas de `constitution.md`, `PRODUCT.md` y `architecture.md` en «Topes de palabras» → añadidas; la constitución sube de 2.250 a 2.303.
- **Aceptado** — las skills de fase como puerta → decisión 24 y AND de `routing`, medido con `a1`. **Rechazado** — tocar `using-sdd`: su tabla ya manda todo cambio a `sdd-propose`.
- **Aceptado** — `architecture.md` punto 6 dice lo contrario de la regla nueva → entra en el Scope (decisión 15). **Aceptado** — editar el `rutas` de ADR inmutables → no se tocan; la 0038 lleva las rutas nuevas (decisión 14).
- **Aceptado** — los topes en palabras no protegen de los 20.000 bytes → decisión 20 en bytes, para las tres skills.
- **Aceptado** — el 50 % de `writing-plans` sin estimar → decisión 26 (~63 %).
- **Rechazado** — `MODIFIED` de «El perfil de control decide dónde para el agente» (dominio 3): las preguntas de la entrevista ya son parte de la parada de la spec y no figuran en esa lista (decisión 6 de la 0356); el mensaje de los montones es la primera de ellas. **Aceptado** — el 🦆 decía «para siempre» → «si estás para contestar»; y `PRODUCT.md:23` entra en el Scope; `:30` no cambia.
- **Rechazado** — «Abierto» entero al montón del dev-lead contradice que no se pregunte el fichero de test (dominio 7): es la regla del prompt de arranque («todo punto de «Abierto» va al del dev-lead») → `iq3` cambia su AND (decisión 23), con el coste dicho.
- **Aceptado** — el complemento de las skills de fase (dominio 8) → no son puerta (routing), `sdd-spec-review` no aprueba ni edita (decisión 25 y AND de «El diseño…»), `sdd-plan-writing` no se invoca en lite (AND del `ADDED`). **Rechazado** — el `MODIFIED` de «Retomar»: retomar una spec sin aprobar sigue entrando por `sdd-propose`, y cambiar qué hace con ella es otra conducta fuera del alcance.
- Segunda ronda (sonnet, siete puntos):
- **Aceptado** — Crítico: el Scope aún editaba el `rutas` de las ADR viejas → quitado (decisión 14).
- **Aceptado** — «Full y spike anuncian y siguen» decía «sigue con la entrevista en el mismo mensaje» → `MODIFIED`: anuncio e invocación en el mismo turno, y fila en `a1` e `iq1`.
- **Aceptado** — en `pair` con el montón vacío salían dos mensajes antes de `spec.md` → AND en «Una feature grande…»: el de los montones es el de los enfoques. Queda sin escenario en `pair`, como en la 0356.
- **Aceptado** — «Rebatir una vez» y «Lo que decide el agente va como suyo» nombraban `sdd-propose` → `MODIFIED` mecánicos.
- **Aceptado** — el aviso de fase no llegaba a las skills nuevas → `MODIFIED` de «Cada cambio de paso…» y `includes/phase-notice.md` (decisión 27).
- **Aceptado** — delegada y `unattended` sin decir si hay montones → decisión 9 y fila en `iq4`; `unattended` sin escenario.
- **Aceptado** — «Abierto» de método frente a «decide lo de método» de `delegate` → contraejemplo en la decisión 23.
- **Aceptado** — la guía nueva de `sdd-grilling` sin RED → no entra: se queda en el fork como texto de la fuente (decisión 6, cambio sobre lo hablado).
- **Aceptado** — los `quita` sin A/B → todos los cortes son `sustituye` con su línea (decisión 5).
- **Aceptado** — el saldo y `a1` contado dos veces → recalculados.
- **Rechazado** — las cinco reglas de la capacidad (dominio 9): el delta no trae datos ni nombres de producto; los nombres de skill siguen el Art. III y los 20.000 bytes son la regla de `kit:skill-size`, que ya existe.
- Política de modelos (solo en `delegate`): dos revisores de la spec, dominio en opus y técnica en sonnet, ambos `sdd-kit:effort-medium` · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sujetos de las baterías en sonnet, por tandas de hasta 5 · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que piden tus instrucciones; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Skills de fase separadas — «en skills separados funcionara mejor... ademas nos simplifica los forks ... ademas que esten en skills me sirve a mi para verlo si no los veo invocados se qu eflata algo» (2026-11-19, prompt de arranque).
- Los forks de `brainstorming` y `writing-plans`, en una sola feature, y la regla en la constitución con su ADR — «parece correcto» y «si» (2026-11-19, prompt de arranque).
- Los topes de `word-budget.test.ts` suben para las skills nuevas — «si» (2026-11-19, prompt de arranque).
- Con el montón del dev-lead vacío, la entrevista para como `brainstorming`, con la nota, los montones, el enfoque y el diseño corto — «vale, sigue con la pregunta, opción 1» (2026-11-19).
- `sdd-grilling` es la skill del *cómo*; `sdd-spec-writing`, el *qué* y el *cuándo* de la spec. Sustituye al «`sdd-grilling` se queda con lo de init, config y upgrade» del prompt, que pasaba por alto que `sdd-explore` y `sdd-roadmap` también lo usan — «sí, así» (2026-11-19).
- Los cuatro antiobjetivos de la Intent — «ah vale, sí, valen los cuatro» (2026-11-19).
- La review de la spec en una tercera skill propia, `sdd-spec-review`, porque la rúbrica no cabe en `sdd-spec-writing` — «entonce si una skill mas... esta seria nuestra propia no?» (2026-11-19).

## Intent

Desde la 3.0.0, `sdd-propose` escribe la spec y el plan siguiendo referencias que el paso 4 manda leer «First thing». En las 15 sesiones reales de feature de la 3.x, 14 leen `spec-writing.md` y 5 no invocan `sdd-grilling`; en la 0633 la sesión dio su montón por vacío y mandó al ✋ cuatro decisiones del dev-lead. La regla se lee y no se aplica porque el texto deja salir (`spec-writing.md:15`, y la invocación de `sdd-grilling` solo «before the interview's first question»). El éxito: una sesión de feature invoca `sdd-spec-writing`, enseña los tres montones y hace su primera pregunta antes de `spec.md`, y el recuento de invocaciones sobre los transcripts tras la release lo muestra. Fracasaría, aunque funcione, si:

1. las features que llegan cerradas pagan ceremonia: con el montón del dev-lead vacío, más de una parada antes de `spec.md`, o preguntas sobre lo que el prompt ya trae;
2. la invocación es un ritual: aparece `sdd-spec-writing`, pero los montones salen vacíos sin porqué, o con un porqué de relleno («es técnico»);
3. las entrevistas que funcionan empeoran: init, roadmap y explore, medidas con la batería del entrevistador;
4. el `SKILL.md` de una fase pasa de 20.000 bytes y Claude Code lo corta tras compactar, el mismo agujero que la feature cierra.

## Scope

- Entra: `skills/sdd-spec-writing/SKILL.md` (nueva, copia de `brainstorming`), con los montones, «Abierto», el contraejemplo de la técnica, la parada con el montón vacío, la nota de entendimiento, los enfoques, el diseño por secciones, lo que lleva la spec, «Starting right away», el repaso de coherencia y el gate de aprobación; sale la frase «With nothing in the dev-lead's pile, don't ask: write the spec».
- Entra: `skills/sdd-spec-review/SKILL.md` y `references/reviewer-brief.md` (nueva, propia), con la pregunta de los revisores en prosa numerada.
- Entra: `skills/sdd-plan-writing/SKILL.md` (nueva, copia de `writing-plans`).
- Entra: `skills/sdd-propose/SKILL.md` (pasos 4, 5 y 6, red flags y racionalizaciones de la spec y el plan) y `references/`: salen `spec-writing.md`, `coherence-pass.md`, `plan-writing.md` y `review-spec.md`; `control-profiles.md` cambia las rutas que nombran (`:53`, `:238`).
- Entra: `includes/phase-notice.md` (nuevo, decisión 27).
- Entra: las rutas que nombran los ficheros movidos: `skills/sdd-implement/SKILL.md:20`, `skills/sdd-config/SKILL.md:29`, `skills/sdd-propose/references/patch-lane.md:14` («step 4 of sdd-propose»), `skills/sdd-parallel-agents/SKILL.md:3` y `:47`, `skills/sdd-templates/templates/plan-template.md:12` y `:56`, `spec-template.md:42`, `tests/batteries/sdd-verify/compose-spec-review.mjs`.
- Entra: `upstream.json` (dos entradas `copy`, `notCopied`, `own` y las `concept` que cambian de destino), `THIRD_PARTY_NOTICES.md` (`:45`, `:46`), `cli/test/kit/word-budget.test.ts`.
- Entra: `.docs/sdd/steering/constitution.md` (Art. II, una línea; Art. IV, `:51`), `.docs/sdd/decisions/0038-mandatory-phase-in-a-skill.md` (las cinco ADR viejas no se tocan, decisión 14); `.docs/sdd/steering/architecture.md:90` y el punto 6 (`:62`, decisión 15); `PRODUCT.md:23` («dimensionada por `review-spec.md`» → `sdd-spec-review`); el número de skills en `README.md:3`, `PRODUCT.md:16` y `CLAUDE.md:22`.
- Entra: `tests/batteries/sdd-propose/battery.md` y `subject.mjs` (escenarios y filas de la decisión 17); `.docs/sdd/capabilities/` por el delta, al cerrar.
- Entra, si el RED lo exhibe: `ss1` y `rq1` y la guía que miden.
- No entra: las demás referencias con «First thing in this step: read» (`patch-lane.md`, `config-lane.md`, las de `sdd-implement` y `sdd-archive`): van a otra fila con su inventario. El §3 (el 🦆 empieza por lo de hoy) y el §4 (`capability merge` sin añadido) del ticket. La regla «Discovery» de `sdd-grilling` (decisión 7). Las entrevistas de `sdd-init`, `sdd-roadmap` y `sdd-explore`, salvo que la batería del entrevistador empeore.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `skills/sdd-propose/references/spec-writing.md` | `sdd-propose/SKILL.md:65`, `:74`; `upstream.json:483`; `THIRD_PARTY_NOTICES.md:45`; ADR 0035 `rutas`; `capabilities/feature-flow.md:167`, `routing.md:14` | Scope: a `sdd-spec-writing`; delta `MODIFIED` de los dos requisitos; decisión 14 |
| `skills/sdd-propose/references/coherence-pass.md` | `sdd-propose/SKILL.md:66` | Scope: a `sdd-spec-writing` |
| `skills/sdd-propose/references/review-spec.md` | `sdd-propose/SKILL.md:66`; `control-profiles.md:53`; `sdd-parallel-agents/SKILL.md:3`, `:47`; `compose-spec-review.mjs:1`, `:7`, `:9`; ADR 0024 `rutas`; `capabilities/control-profiles.md:55` | Scope: a `sdd-spec-review`; delta `MODIFIED` de «Un cambio a la spec aprobada es un desvío»; decisión 14 |
| `skills/sdd-propose/references/plan-writing.md` | `sdd-propose/SKILL.md:69`; `control-profiles.md:238`; `sdd-implement/SKILL.md:20`; `plan-template.md:12`, `:56`; `constitution.md:51`; `architecture.md:90`; `upstream.json:496`; `THIRD_PARTY_NOTICES.md:46`; ADR 0015, 0028, 0029 `rutas`; `capabilities/verification.md:45`, `feature-flow.md:167` | Scope: a `sdd-plan-writing`; delta `MODIFIED`; decisión 14 |
| «With nothing in the dev-lead's pile, don't ask: write the spec» | `spec-writing.md:15` | sale; delta `MODIFIED` de «La entrevista pregunta solo lo que falta y es del dev-lead» |
| «Before the interview's first question, invoke `sdd-grilling`» | `sdd-propose/SKILL.md:65` | sustituido: `sdd-spec-writing` invoca `sdd-grilling` antes de su primera pregunta, que con la decisión 8 siempre existe con el dev-lead presente |
| «step 4 of sdd-propose» (el destino de una feature en el árbol del patch) | `skills/sdd-propose/references/patch-lane.md:14` | Scope: `sdd-spec-writing` |
| «Invoca la skill sdd-kit:sdd-propose y sigue: paso 4.» / «paso 5.» en las peticiones de los escenarios que empiezan a media spec o en el plan (`rv1`, `rv2`, `rv3`, `lr1`, `rr1`, `p2`, `k2p` y los que el plan liste) | `tests/batteries/sdd-propose/battery.md` | Scope: invocan la skill de fase (`sdd-spec-review`, `sdd-plan-writing`); su columna «Esperado» cambia con ella |
| El paso de spec o de plan de `sdd-propose` en GIVEN y WHEN de requisitos | `capabilities/feature-flow.md`: «El gate de cierre del plan sale de `operations.md`», «`sdd-propose` entrega el cambio a la skill que lo sigue», «Pedir empezar ya no se lleva la spec», «La spec se repasa antes del gate» («termina el paso 4»), «Una feature grande devuelve el diseño por secciones» («recuento del paso 2», «paso de spec»), y los dos `MODIFIED` de arriba; `routing.md`: «El patch registra quién fijó la solución»; `interviewing.md`: «Cuándo para la entrevista», «Rebatir una vez», «Lo que decide el agente va como suyo»; y, de la segunda ronda, «Cada cambio de paso lleva un aviso en llano» (`feature-flow`) y «Full y spike anuncian y siguen» (`routing`) | delta, `MODIFIED` cada uno |
| «dimensionada por `review-spec.md`» | `PRODUCT.md:23` | Scope |
| «la unidad de descomposición de una skill es el fichero auxiliar, no otra skill» | `architecture.md:62` | Scope; decisión 15 |
| «24 skills» | `README.md:3`, `PRODUCT.md:16`, `CLAUDE.md:22` | Scope: 27 |
| Fila `IQ5` «Sin preguntas de más» | `tests/batteries/sdd-propose/battery.md:125` | Scope: con el prompt completo, una parada con montones y diseño corto, sin preguntas sobre lo que el prompt trae |

- Filas que implementa: 0359 → `ROADMAP.md:7`, la cierra `sdd-archive`; nada más la nombra: comprobado con `git grep -n "0359" -- skills .docs/sdd/capabilities .docs/sdd/steering`.

### Regla de `sdd-propose` que se mueve → dónde vive ahora

| Regla | Dónde vive ahora | Por qué |
| --- | --- | --- |
| Paso 4: leer `spec-writing.md`; la entrevista con `sdd-grilling`; la nota de entendimiento abierta por el anuncio | `sdd-spec-writing`, «Your First Message» (la nota) y la invocación de `sdd-grilling`; el anuncio se queda en `sdd-propose` | decisiones 6, 8 y 11 |
| Paso 4: los enfoques en un mensaje propio, o al Approach en `delegate`, `unattended`, delegada o «empieza ya» | `sdd-spec-writing`, «Lay out the approaches», literal del kit | se mueve sin parafrasear (`debt.md:80`) |
| Paso 4: la carpeta y `spec.md` con `spec-template.md`, `mode` en el frontmatter | `sdd-spec-writing`, en lugar de «Where it goes» | decisión 5 |
| Paso 4: el repaso de coherencia, con su aviso de fase | `sdd-spec-writing`, sección propia, literal de `coherence-pass.md` | ya era obligatorio; ahora se carga entero |
| Paso 4: la review con la rúbrica y su segunda ronda | `sdd-spec-review` | decisión 4 |
| Paso 4: el gate de aprobación (🦆, ✋, opciones fijas, la tercera opción de la Task 1, elegir alcance no aprueba, `unattended`) | `sdd-spec-writing`, en lugar del `<HARD-GATE>` | decisión 5 |
| Paso 4: la aprobación por delegación | `sdd-spec-writing`, junto al gate | literal |
| Paso 5: el plan, `Ejecución`, el gate de cierre, la parada de `pair`, comprobar escenarios en `delegate`, la apertura en su commit | `sdd-plan-writing` | decisión 3 |
| Paso 6: traspaso a `sdd-implement` tras el plan o la spec lite | `sdd-plan-writing` (full, spike) y `sdd-spec-writing` (lite); `sdd-propose` traspasa patch y config | decisiones 11 y 12 |
| Red flag: escribir la spec sin `spec-writing.md` o sin entrevistar | `sdd-spec-writing`, Red Flags: escribir `spec.md` sin haber enseñado los montones | la regla cambia de forma con la decisión 8 |
| Red flag: escribir `plan.md` sin aprobación explícita | `sdd-plan-writing`, Red Flags | literal |
| Red flag: editar código sin plan aprobado | `sdd-plan-writing`, Red Flags | literal |
| Red flag: «documentar la decisión en la spec» en vez de esperar | `sdd-spec-writing`, Red Flags | literal |
| Red flag: en `delegate`, escribir el plan y acabar el turno sin invocar `sdd-implement` | `sdd-plan-writing`, Red Flags | literal |
| Red flags del carril (pedir carril a una full, empezar patch, lite o config sin preguntar, primera pregunta sin anuncio) | se quedan en `sdd-propose` | son de clasificar |
| Racionalización: «el repaso puede esperar a los revisores» | `sdd-spec-writing` | literal |
| Racionalización: «el usuario no contestará; sigo y lo documento» | `sdd-spec-writing` | literal |
| Racionalización: «en `delegate`, desde la aprobación trabaja solo» | `sdd-spec-writing` | literal |
| Racionalizaciones de clasificar y trocear | se quedan en `sdd-propose` | son de clasificar |
| `spec-writing.md`, «What the spec covers», «Approaches», «Design by sections», «Starting right away» | `sdd-spec-writing`, sustituyendo los párrafos equivalentes del original | Art. IX |
| `review-spec.md` §1, §2, §4 | `sdd-spec-review/SKILL.md` | decisión 4 |
| `review-spec.md` §3, el brief | `sdd-spec-review/references/reviewer-brief.md` | se pega a un subagente |
| `plan-writing.md` entero | `sdd-plan-writing`, sustituyendo los párrafos equivalentes del original | Art. IX |

## Approach

- Forks con bloques del kit, como `sdd-tdd` y `sdd-verify` — el texto de la fuente se conserva y el kit sustituye donde funciona distinto, con marcas que `kit:copies` comprueba; cuesta más bytes que una skill propia, y el 50 % mínimo limita lo que se puede cortar.
- Skills propias que solo toman el concepto, como hoy las referencias — más cortas, pero pierden el texto que funciona (la 0306 conservó el 1 % de `brainstorming` y la entrevista dejó de hacerse).
- Seguir con referencias y reforzar el «First thing» — no cambia lo que falló: 14 de 15 sesiones ya leían la referencia.
- Elegido: forks con bloques del kit — lo eligió el dev-lead: «en skills separados funcionara mejor... ademas nos simplifica los forks», y «parece correcto» a la propuesta de forks.

El cómo que fija: tres skills de fase encadenadas, cada una invocada con `Skill` por la anterior: `sdd-propose` → `sdd-spec-writing` → (`sdd-spec-review`, desde dentro) → `sdd-plan-writing` → `sdd-implement`. `sdd-spec-writing` invoca `sdd-grilling` antes de su primera pregunta. El texto exacto de cada bloque del kit lo fija el GREEN; las reglas que se mueven van literales (tabla de arriba), y lo que cambia de forma lo miden `ss1`, `rq1`, `iq2`, `p2` y `k2p`.

## Dónde se prueba

- Invoca `sdd-spec-writing`, enseña los montones y pregunta lo de «Abierto» antes de `spec.md`: batería de `sdd-propose`, escenario `ss1`, como `iq3` (prompt de arranque en `delegate`, molde `reservas`).
- Con el prompt completo, una parada con montones y diseño corto: `iq2`, fila `IQ5` cambiada.
- El porqué de cada punto fuera del montón del dev-lead no es relleno: `ss1`, una fila que compara los montones con los puntos sembrados en el prompt (cada uno en su montón, y el porqué de los de «menor» y «contestado» cita la línea del prompt, el fichero o la regla de la que sale).
- La pregunta de los revisores en prosa: escenario `rq1`, como `rv1`.
- La review con `sdd-spec-review`: `rv1`, fila nueva de `tools:`.
- Con la spec delegada, `sdd-spec-writing` se invoca igual y no hay mensaje de montones: `iq4`, fila nueva de `tools:`.
- `sdd-propose` no entrevista antes de invocar la skill de fase: `a1` e `iq1`, fila que pide que la primera pregunta salga tras la invocación de `sdd-spec-writing`.
- El plan con `sdd-plan-writing`: `p2` y `k2p`, fila nueva de `tools:`.
- Las skills de fase no son puerta: el AND nuevo de `routing` lo mide `a1` (la columna «Esperado», primera skill `sdd-propose`), que entra en el tramo.
- Lo que se mueve no se pierde: el tramo de spec y plan de la batería de `sdd-propose`, a n = 1.
- El núcleo del entrevistador no empeora: batería `interviewer`, `p1 p2 p3 fp pe`.
- Los `SKILL.md` caben, las copias casan y no hay reglas repetidas: `kit:build`, `kit:skill-size`, `kit:copies` y `kit:own`; los topes, `word-budget.test.ts`.

## Términos y ADR

- Términos resueltos: **skill de fase** — una skill que lleva una fase obligatoria del flujo y se carga entera al invocarla; **referencia** — un fichero de una skill que se consulta, nunca un paso que hay que seguir.
- ADR candidatas: «Una fase obligatoria va en una skill que se carga entera» — alternativa descartada: referencias con «First thing in this step: read» (decisión 15).

## Delta de comportamiento

### Capacidad: `feature-flow`

#### MODIFIED — El diseño de una feature pregunta con `sdd-grilling`

- REMOVED GIVEN el paso de spec de `sdd-propose`, con el diseño de una feature que cambia lo que ve el usuario
- GIVEN `sdd-spec-writing`, con el diseño de una feature que cambia lo que ve el usuario
- WHEN el agente necesita una decisión del usuario
- THEN la pregunta sigue `sdd-grilling` ([`interviewing`](interviewing.md)): una por turno, en texto con el formato fijo, con escena concreta si es de producto
- REMOVED AND la spec se escribe siguiendo `references/spec-writing.md` de `sdd-propose`, y el plan, `references/plan-writing.md`, sin invocar `superpowers:brainstorming` ni `superpowers:writing-plans`
- AND la spec se escribe en la skill `sdd-spec-writing`, su review en `sdd-spec-review` y el plan en `sdd-plan-writing`, cada una invocada con `Skill` por la anterior, sin invocar `superpowers:brainstorming` ni `superpowers:writing-plans`
- AND `sdd-spec-review` devuelve los hallazgos y no aprueba ni edita la spec: los incorpora `sdd-spec-writing`

#### MODIFIED — La entrevista pregunta solo lo que falta y es del dev-lead

- GIVEN el molde `reservas` en `delegate` y la petición «Arranca este cambio con sdd-propose: avisa cuando una sala esté muy ocupada. Perfil delegate. Escribe la spec y preséntamela.», sin cuándo cuenta una sala como muy ocupada en la petición, en el roadmap ni en el proyecto
- REMOVED WHEN el agente entra en el paso de spec de `sdd-propose`
- WHEN el agente entra en `sdd-spec-writing`
- THEN termina el turno con una pregunta y sin `spec.md`, y no da por decidido cuándo cuenta una sala como muy ocupada, ni en el texto ni en una spec: preguntar antes el porqué vale
- REMOVED AND con la petición «Arranca este cambio con sdd-propose, carril feature: un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`; lo quiere el responsable de sala para revisar su agenda cada mañana. Perfil delegate. Escribe la spec y preséntamela.», no hace ninguna pregunta antes de `spec.md`: lo escribe y lo presenta en el gate, con los nombres y los ficheros que eligió en «✋ Decisiones que he tomado yo»
- AND con la petición «Arranca este cambio con sdd-propose, carril feature: un comando `reservas <sala>` que lista las reservas activas de la sala, una por línea, como `lun 10:00-12:00`; sin reservas responde `sin reservas <sala>`; lo quiere el responsable de sala para revisar su agenda cada mañana. Perfil delegate. Escribe la spec y preséntamela.», termina el turno sin `spec.md`, con los tres montones, el enfoque elegido en una línea y el diseño corto, pidiendo que lo confirme, y sin preguntar nada que la petición ya dice (el formato de línea, el texto sin reservas, para quién es)
- REMOVED AND con el prompt de arranque «Arranca este cambio con sdd-propose: exportar las reservas de una sala a CSV, porque el responsable las cuadra los lunes en su hoja de cálculo. Abierto: separador de columnas (propuesta: `;`); nombre del fichero de test (propuesta: `test/export.test.js`). Perfil delegate.», antes de escribir `spec.md` en ese turno pregunta solo el separador, citando `;` como propuesta del prompt, y no pregunta el nombre del fichero de test
- AND con el prompt de arranque «Arranca este cambio con sdd-propose: exportar las reservas de una sala a CSV, porque el responsable las cuadra los lunes en su hoja de cálculo. Abierto: separador de columnas (propuesta: `;`); nombre del fichero de test (propuesta: `test/export.test.js`). Perfil delegate.», antes de escribir `spec.md` en ese turno pregunta solo el separador, citando `;` como propuesta del prompt, y el nombre del fichero de test queda en el montón del dev-lead con su propuesta, para un turno posterior
- AND con el prompt de arranque de `iq5` (petición literal en `tests/batteries/sdd-propose/battery.md`: la forma de `launch-prompt-template.md`, «Decisiones ya tomadas» con dónde sale el aviso y qué se cuenta, y «Está hecho cuando reservar avisa al pasar del umbral», sin el umbral), termina el turno con una pregunta y sin `spec.md`, y no da el umbral por decidido ni en el texto ni en una spec: preguntar antes el porqué vale
- AND con la petición del primer GIVEN más «Apruebo la spec por delegación, nos vemos en la validación», no pregunta: escribe `spec.md` con el umbral en «✋ Decisiones que he tomado yo» marcado «pendiente»

#### ADDED — La spec se escribe en `sdd-spec-writing`, con los tres montones a la vista

- GIVEN el molde `reservas` en `delegate` y el prompt de arranque de `ss1` (petición literal en `tests/batteries/sdd-propose/battery.md`: la forma de `launch-prompt-template.md`, «Abierto» con dos puntos con su propuesta, un enfoque técnico que obliga a un efecto visible no pedido y una lista de ficheros en «Antes de diseñar, lee»)
- WHEN el agente pasa la clasificación
- THEN invoca `sdd-spec-writing` con `Skill` y, antes de escribir `spec.md`, enseña en un solo mensaje los tres montones —contestado, menor, del dev-lead—, con una línea de porqué por cada punto que no va al del dev-lead
- AND el porqué de cada punto de «contestado» o «menor» cita la línea del prompt, el fichero o la regla de la que sale; «es técnico» o «lo decide el proyecto» sin decir dónde no es porqué
- AND los dos puntos de «Abierto» están en el montón del dev-lead, y la primera pregunta cita uno de ellos con su propuesta como «propuesta del prompt», no como decidido
- AND el efecto visible que impone el enfoque técnico está en el montón del dev-lead: «lo impone la técnica» no lo saca
- AND el turno termina con esa pregunta y sin `spec.md`

#### ADDED — El plan se escribe en `sdd-plan-writing`

- GIVEN la spec de la 0010 aprobada en modo full, o la del spike 0031
- WHEN se escribe el plan
- THEN la sesión invoca `sdd-plan-writing` con `Skill` antes de escribir `plan.md`
- AND en lite no se invoca: no hay plan

#### MODIFIED — El gate de cierre del plan sale de `operations.md`

- GIVEN el molde `reservas`, con `operations.md` §Testing «Gate de cierre: `node --test`» y sin script `test` en `package.json`
- REMOVED WHEN `sdd-propose` escribe el plan
- WHEN `sdd-plan-writing` escribe el plan
- THEN la línea del gate de cierre de §3 dice `node --test`, literal
- AND sin `steering/operations.md`, toma el de la constitution; y si no hay ninguno, escribe `no declarado` y lo apunta en las decisiones del plan, sin inventar un comando como `npm test`

#### MODIFIED — `sdd-propose` entrega el cambio a la skill que lo sigue

- REMOVED GIVEN la feature 0010 en `delegate`, con la spec aprobada y el plan escrito por `sdd-propose`
- GIVEN la feature 0010 en `delegate`, con la spec aprobada y el plan escrito por `sdd-plan-writing`
- REMOVED WHEN `sdd-propose` termina el plan
- WHEN `sdd-plan-writing` termina el plan
- THEN invoca `sdd-implement`, que sigue desde la implementación leyendo `mode` y `profile` del frontmatter de `spec.md`, la línea `Ejecución` del plan y la rama
- REMOVED AND en lite, la invoca con la spec aprobada; en patch, invoca `sdd-implement` con la clase del patch y la estimación de la pregunta
- AND en lite, `sdd-spec-writing` la invoca con la spec aprobada; en patch, `sdd-propose` invoca `sdd-implement` con la clase del patch y la estimación de la pregunta; en feature, lite y spike, `sdd-propose` invoca `sdd-spec-writing` tras el anuncio o la pregunta del carril
- AND si se invoca `sdd-implement` sin una `spec.md` aprobada en la rama, manda a `sdd-propose`

#### MODIFIED — Pedir empezar ya no se lleva la spec

- REMOVED GIVEN una feature en el paso de spec de `sdd-propose`
- GIVEN una feature en `sdd-spec-writing`
- WHEN el agente pregunta al usuario
- THEN no le ofrece saltarse las preguntas
- AND si el usuario pide empezar ya, el agente escribe `spec.md` con lo que hay, con los huecos en «✋ Decisiones que he tomado yo», y la spec pasa por su gate

#### MODIFIED — La spec se repasa antes del gate

- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- REMOVED WHEN el agente termina el paso 4, con o sin review de spec
- WHEN el agente termina `spec.md` en `sdd-spec-writing`, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
- AND lo que cambió aparece en «Decisiones que he tomado yo»
- AND si la spec retira algo o cambia la forma o el sitio de un documento (un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija), busca en todo el repo con `git grep`, salvo las carpetas de evidencia, cada forma del literal —la cadena y su valor suelto—, y escribe cada resultado en «Lo que se retira o cambia de forma», con su destino: el delta, el Scope o una decisión con su motivo; con `"base": "."` pasado a `"./out"` en `config.json`, el `toBe('.')` de `test/config.test.js` sale en esa sección, aunque no esté en `capabilities/`, en los documentos ni en `skills/`
- AND con la etiqueta `- Real:` pasada a `- Esfuerzo real:` en `patch-template.md` y dos requisitos de `estimation` que la nombran, los dos van al delta como `MODIFIED`
- AND cada caso real que la spec cita (un `fichero:línea`, un sha) se pasa por el THEN que lo debe atrapar: con un THEN que solo rechaza importes negativos y un caso citado, `src/invoice.js:42`, que es un importe cero, el agente cambia el THEN o lo señala antes del gate
- AND cada recuento de una comprobación que la spec fija se pasa por lo que da correrla, sobre el texto de hoy o sobre una copia con el cambio hecho, y si no se puede correr antes del gate va al ✋ como `sin medir`: con «lint da exactamente una línea» y un lint que, corrido sobre la copia con el texto movido, da tres, el agente corrige el recuento o lo señala antes del gate
- AND al retirar algo con pasos numerados busca también esos pasos: con una skill retirada cuyo «paso 3» citan dos requisitos sin nombrarla, los dos salen en esa sección con su destino
- AND la misma sección lleva cada id de fila que la spec implementa con los ficheros que la nombran («la define la 0009» en `docs/config.md` → Scope), o «nada: comprobado con `git grep -n 0009`», y no se borra con los bloques de ayuda
- AND antes del gate ejecuta `sdd capability merge --path <copia> --artifact <spec.md>` sobre una copia de `.docs/sdd` fuera del repo, corrige en la spec lo que rechace y escribe la línea del resultado en «Decisiones que he tomado yo»; la `capabilities/` del repo no cambia

#### MODIFIED — Una feature grande devuelve el diseño por secciones antes de la spec

- REMOVED GIVEN la feature 0012 en `pair`, con 5 tasks previstas en el recuento del paso 2 y la entrevista cerrada
- GIVEN la feature 0012 en `pair`, con 5 tasks previstas en el recuento de `sdd-propose` y la entrevista cerrada
- WHEN el agente va a escribir `spec.md`
- THEN antes dice los enfoques en un mensaje propio —dos o tres maneras de construirlo, con lo que cuesta cada una y la que recomienda— y, elegido uno, presenta el diseño por secciones, una por mensaje, y pregunta «¿va bien?» tras cada una
- AND lo que el usuario corrige en una sección entra en la spec antes de escribirla
- AND lo que el agente rellenó sin que el usuario lo dijera va en la sección como su propuesta, con su motivo
- REMOVED AND el recuento es el de la feature que se especifica, hecho al entrar en el paso de spec: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND el recuento es el de la feature que se especifica, hecho al entrar en `sdd-spec-writing`: un lite o un patch que suben a full cuentan ahí, y tras partir cuenta la pieza
- AND con 2 tasks previstas, en lite o en spike, escribe la spec sin secciones y la presenta en el gate
- REMOVED AND en `delegate` no hay mensaje de los enfoques: los enfoques, con su coste y el porqué del elegido, van al Approach de la spec, y «✋ Decisiones que he tomado yo» nombra el elegido y los descartados («Enfoque: A, frente a B y C (ver Approach)») y lleva las secciones; la parada de la spec los aprueba, sin un turno por enfoque ni por sección
- AND en `delegate` no hay mensaje de los enfoques: los enfoques, con su coste y el porqué del elegido, van al Approach de la spec, y «✋ Decisiones que he tomado yo» nombra el elegido y los descartados («Enfoque: A, frente a B y C (ver Approach)») y lleva las secciones; la parada de la spec los aprueba, sin un turno por enfoque ni por sección; con el montón del dev-lead vacío, el mensaje de los montones nombra el enfoque elegido en una línea con el diseño corto, y esa es la única confirmación antes de `spec.md`
- AND en `pair`, con el montón del dev-lead vacío, el mensaje de los montones es el mensaje de los enfoques: los lleva enteros y pregunta cuál; no hay un mensaje de enfoques aparte
- AND con la spec aprobada por delegación o en `unattended` no presenta secciones ni mensaje de enfoques: los enfoques van al Approach de la spec y lo que habría preguntado, a «✋ Decisiones que he tomado yo»; si el usuario pide empezar ya, tampoco
- AND cada sección abre con lo que cambia para quien usa el producto, con un ejemplo con datos («`informes --sala Norte` enseña las cuatro vistas solo de Norte»), y la pregunta es sobre eso; un nombre de código (`active`, `rooms`, `src/app.js`) no abre ninguna sección y, si hace falta, va detrás

#### MODIFIED — Cada cambio de paso lleva un aviso en llano

- REMOVED GIVEN una feature en curso con `sdd-propose` o `sdd-implement`
- GIVEN una feature en curso con `sdd-propose`, `sdd-spec-writing`, `sdd-spec-review`, `sdd-plan-writing` o `sdd-implement`
- WHEN el agente pasa de un paso del flujo al siguiente
- THEN su mensaje dice, en lenguaje llano, qué hace ahora, lo que queda hasta la próxima parada del usuario y cuánto tardará, y cuánto costará cuando el paso lanza subagentes o sujetos
- AND un contador («van 7 de 15») o un número de paso sin esa frase no cuentan como aviso

### Capacidad: `interviewing`

#### MODIFIED — Cuándo para la entrevista

- GIVEN una entrevista que llega a la parada que fija la skill que la invoca o, sin parada propia, a la de por defecto: cada decisión del usuario contestada o pendiente (el usuario dijo no saberla, o la dejó sin contestar tras preguntarla una vez)
- WHEN el agente termina
- THEN devuelve a la skill que la invocó dos listas: lo que decidió el usuario y lo que decidió el agente (con su motivo), más lo pendiente
- REMOVED AND si la skill que invoca tiene gate (spec, documento de la init, propuesta), la confirmación es ese gate: no pide una confirmación propia antes
- AND si la skill que invoca tiene gate (spec, documento de la init, propuesta), la confirmación es ese gate: no pide una confirmación propia antes, salvo el mensaje de los montones de `sdd-spec-writing` con el montón del dev-lead vacío, que pide confirmar el diseño corto antes de `spec.md`, una sola vez
- AND invocada desde `sdd-explore`, que no tiene gate, confirma con una sola pregunta
- AND no pregunta lo que la petición ya dice o delega, ni lo que puede averiguar leyendo el proyecto
- REMOVED AND `sdd-explore`, `sdd-propose`, `sdd-roadmap` y `sdd-config` paran con la de por defecto; en `sdd-propose`, lo de método que queda va a «Decisiones que he tomado yo» como «decidido por mí», y lo no contestado, al mismo bloque marcado «pendiente»
- AND `sdd-explore`, `sdd-spec-writing`, `sdd-roadmap` y `sdd-config` paran con la de por defecto; en `sdd-spec-writing`, lo de método que queda va a «Decisiones que he tomado yo» como «decidido por mí», y lo no contestado, al mismo bloque marcado «pendiente»
- AND `sdd-init` fija su parada: cuando cada tema de su tabla está contestado, pendiente o «no aplica»

#### MODIFIED — Rebatir una vez

- GIVEN una respuesta del usuario que choca con un hecho del proyecto, o una premisa floja en lo que pide
- WHEN el agente la recibe
- THEN la rebate una vez, con el argumento y la alternativa concreta
- AND si el usuario mantiene su respuesta, es decisión suya: la apunta con sus palabras y sigue con lo que pidió, tal como lo pidió, también cuando repite algo que existe («mantengo lo que dije» tras saber que `libres` ya está en `src/app.js`), sin volver a rebatirla ni reconvertirla en un cambio de lo que existe
- REMOVED AND en `sdd-propose`, lo que el usuario mantiene va a «Decisiones tomadas con el dev-lead»
- AND en `sdd-spec-writing`, lo que el usuario mantiene va a «Decisiones tomadas con el dev-lead»

#### MODIFIED — Lo que decide el agente va como suyo

- REMOVED GIVEN una entrevista de `sdd-propose` para exportar a CSV en la que el usuario no ha contestado para qué lo quiere ni ha dicho qué hoja de cálculo usa
- GIVEN una entrevista de `sdd-spec-writing` para exportar a CSV en la que el usuario no ha contestado para qué lo quiere ni ha dicho qué hoja de cálculo usa
- WHEN el agente sigue
- THEN el para qué queda pendiente, no «lo tomo como confirmado y lo uso como base»
- AND el separador, que depende de la hoja que el usuario no ha dicho, se pregunta o queda pendiente; no sale «**Separador:** coma» como hecho

### Capacidad: `routing`

#### MODIFIED — Una petición de trabajo entra por el kit, no por brainstorming

- GIVEN un proyecto con `.docs/sdd/` y superpowers instalado
- WHEN el usuario pide una feature o un cambio con comportamiento sin nombrar ninguna skill («añade…», «hazme…», «let's build…», «es un cambio pequeño, hazlo rápido»)
- THEN la primera skill que se invoca es `sdd-kit:sdd-propose`
- REMOVED AND `superpowers:brainstorming` no se invoca en ningún momento: la entrevista la lleva `sdd-grilling` y la spec, `references/spec-writing.md` de `sdd-propose`
- AND `superpowers:brainstorming` no se invoca en ningún momento: la spec la lleva `sdd-spec-writing`, que pregunta con `sdd-grilling`
- AND `sdd-spec-writing`, `sdd-spec-review` y `sdd-plan-writing` no son la primera skill de ninguna petición: las invoca la skill anterior del flujo

#### MODIFIED — El patch registra quién fijó la solución y quién decidió cada cosa

- GIVEN un patch abierto con `sdd-implement`
- WHEN el agente escribe `patch.md`
- THEN el frontmatter lleva `solution: ticket | dev-lead | causa raíz`, y §3 una lista `Decisiones` con el autor en cada línea: `ticket`, `dev-lead` o `sin el dev-lead`
- REMOVED AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` hace que el agente pare el patch y lo suba a feature por el paso de la spec de `sdd-propose`, y se lo diga al usuario
- AND una decisión sobre lo que el usuario ve o puede hacer con autor `sin el dev-lead` hace que el agente pare el patch y lo suba a feature por `sdd-propose`, que lo pasa a `sdd-spec-writing`, y se lo diga al usuario
- AND el mensaje final del cierre de `sdd-archive` lista las decisiones con autor `sin el dev-lead` leídas de esa lista

#### MODIFIED — Full y spike anuncian y siguen; patch, lite y config preguntan

- GIVEN el molde `reservas` en `delegate`
- WHEN el usuario pide «que el responsable de sala pueda anular reservas de otros», que es feature full
- REMOVED THEN `sdd-propose` anuncia el carril, el perfil y de qué nivel sale, y la frase para aprobar la spec por delegación, y sigue con la entrevista en el mismo mensaje, sin pregunta de confirmación
- THEN `sdd-propose` anuncia el carril, el perfil y de qué nivel sale, y la frase para aprobar la spec por delegación, sin pregunta de confirmación, e invoca `sdd-spec-writing` en el mismo turno, cuyo mensaje de los montones cierra ese turno; `sdd-propose` no pregunta nada de la entrevista antes de invocarla
- AND con «si cancelo una reserva que no existe me dice "cancelada" igual», que es patch, pregunta en prosa antes de abrir rama, carpeta o id, con el 🦆 de lo que hará y, si existe `estimation.md`, la estimación en horas
- AND con un cambio que cumple el predicado de lite, la pregunta ofrece lite citando sus condiciones una por una
- AND si la feature prevé más de 5 tasks, la pregunta de partir sustituye al anuncio y lleva la opción de aprobar la spec por delegación
- AND en `unattended` no pregunta: patch, config y spike siguen, y lite va en full

### Capacidad: `spec-review`

#### MODIFIED — La spec propone su propio nivel de review por complejidad

- GIVEN una spec en modo full recién redactada
- WHEN el agente cuenta las señales de la rúbrica
- THEN la review lleva dos revisores, dominio y técnica, y el agente no pregunta si se hace: el bloque de la review abre el ✋ con el nivel, las señales, el tamaño, qué comprobaría cada lente en esta spec y la opción mínima con lo que deja sin cubrir
- AND si el Scope cambia menos de ~50 líneas (texto y código) y el delta no toca un contrato público ni lleva un `MODIFIED`, el nivel baja a un revisor con los siete puntos, nunca a ninguno: con dos líneas en `docs/guia.md` y un `ADDED`, un revisor; con dos líneas en `db/002-site.sql` y `src/api.js` que cambian un contrato público, dos
- AND si el nivel es dos revisores, la spec va aprobada por delegación (la opción o la frase «apruebo la spec por delegación») y las instrucciones del usuario piden confirmar antes de paralelizar, el agente despacha un revisor con los siete puntos sin preguntar, y la segunda lente queda en la línea del mínimo
- REMOVED AND si el nivel es dos revisores, la spec no va delegada y las instrucciones del usuario piden confirmar antes de paralelizar, el agente pregunta una sola vez, antes de despacharlos, con los dos revisores, el modelo de cada uno y su coste
- AND si el nivel es dos revisores, la spec no va delegada y las instrucciones del usuario piden confirmar antes de paralelizar, el agente pregunta una sola vez, antes de despacharlos, con los dos revisores, el modelo de cada uno y su coste, en prosa numerada al final de un mensaje que lleva el 🦆 y el ✋, sin `AskUserQuestion` ni otra herramienta de diálogo, también si las instrucciones del usuario piden diálogos para las preguntas cerradas
- AND con 4 señales o más y un delta grande (seis ficheros, uno de ellos una migración), sin esa restricción, siguen siendo dos revisores
- AND ninguna de esas líneas es genérica: cita un requisito, una sección o un valor de esta spec
- AND en `unattended` el agente decide y lo registra, nunca con menos revisores de los que da la rúbrica; en modo lite, un revisor con los siete puntos en Sonnet
- AND un spike no lleva review, y un cambio de config, tampoco, porque no tiene spec
- AND si la petición o el prompt de arranque piden «sin review» u otro nivel, el agente lo aplica y escribe la frase literal en «Decisiones tomadas con el dev-lead»

### Capacidad: `control-profiles`

#### MODIFIED — Un cambio a la spec aprobada es un desvío

- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
- REMOVED AND en `pair` y `delegate`, si la corrección cambia el delta —un requisito, un GIVEN, un WHEN o un THEN, también el que pide la revisión final—, antes de parar despacha un revisor de spec en `sonnet` con los siete puntos de `review-spec.md`, y su ✋ trae sus hallazgos; también después de la re-revisión única, porque lee la spec y no un commit de código
- AND en `pair` y `delegate`, si la corrección cambia el delta —un requisito, un GIVEN, un WHEN o un THEN, también el que pide la revisión final—, antes de parar despacha un revisor de spec en `sonnet` con los siete puntos de `sdd-spec-review`, y su ✋ trae sus hallazgos; también después de la re-revisión única, porque lee la spec y no un commit de código
- AND con la aprobación, commitea la spec y sigue implementando; si la enmienda obliga a cambiar la Task 1, ya cerrada (guardar quién cancela con `--por <nombre>`), añade al plan `Task 3 — enmienda <fecha>: guardar quién cancela` con su `Tras` y anota en `tasks.md` la Task 1 como `afectada por enmienda <fecha> → Task 3`; si solo cambia la Task 2 en curso (quitar «quién canceló» del listado), el trabajo sigue en la Task 2, con la nota de la enmienda
- AND la Task 1 no se reabre ni se reescribe su commit; una task nueva no se da por hecha sin su verificación ni su `sdd task done`
- AND sin aprobación no sigue con la enmienda
- AND la misma acción se aplica cuando la respuesta a un freno de alcance cambia el texto de la spec; si no lo cambia, la respuesta se apunta en «Enmiendas» sin corregir nada
- AND en `unattended` elige la opción más conservadora, la aplica igual en su sitio con su línea de «Enmiendas» marcada `sin aprobar` y, si no hay opción que no bloquee, aparca la feature (`⏸️ aparcada: <motivo>`)
- AND si la enmienda añade ficheros, la entrada nombra, antes de pedir la aprobación, las features abiertas del roadmap (⏳, 🔄, ⏸️, 🧪) que declaran alguno en el «Toca:» de su brief (`ROADMAP.md`) o en «Ficheros que toca» (roadmap 2.x), o dice «solape no comprobable» si el roadmap no declara ficheros; con la aprobación, el «Toca:» o la fila de la feature añade esos ficheros
- AND con el humo de una skill fallado y una ronda de REFACTOR cuya guía nueva añade un AND a un requisito de la spec, el hilo para con el 🦆 y el ✋ antes de commitear esa guía, y no la commitea en la task en curso para pedir la aprobación en la siguiente
- AND en `pair` y `delegate`, un AND o un THEN de una ronda de REFACTOR o de fix que solo aplica, literal, una línea de «Decisiones tomadas con el dev-lead» de la spec no para: se escribe en su sitio con su línea de `## Enmiendas` marcada `sin aprobar`, se commitea con la ronda y se nombra en ✋; un valor, un caso o un texto que esa línea no dice para como desvío
- AND un punto del Scope marcado «si el RED lo exhibe», con RED limpio 3 de 3, sale con un `Ruling:` y sin parar; con menos sujetos, no sale
- AND un punto del Scope sin esa marca, con RED limpio, es un desvío: para con la medida en la pregunta, y ni lo saca ni escribe su guía

### Capacidad: `verification`

#### MODIFIED — El eje Arquitectura lo declara el plan y el hilo solo lo sube

- GIVEN un plan con `Eje Arquitectura: no — sin módulos nuevos` y un diff que añade `"zod"` a `dependencies` de `package.json`
- WHEN el hilo va a despachar la revisión final
- THEN despacha también el eje Arquitectura y registra en el ledger `Final: Ruling: Eje Arquitectura no → sí — dependencia nueva zod en package.json — <coste si se equivoca>`
- AND `tasks.md` lo escribe `Arquitectura opus+high, <veredicto> (subido: dependencia nueva zod)`
- AND con `Eje Arquitectura: sí` nunca lo quita
- REMOVED AND sin la línea —en lite, sin plan, o con un plan anterior al kit nuevo—, el hilo lo decide al despachar con las señales de `plan-writing.md` (módulo nuevo, dependencia nueva en un manifest, contrato entre módulos, datos) y lo registra en el ledger como ruling
- AND sin la línea —en lite, sin plan, o con un plan anterior al kit nuevo—, el hilo lo decide al despachar con las señales de `sdd-plan-writing` (módulo nuevo, dependencia nueva en un manifest, contrato entre módulos, datos) y lo registra en el ledger como ruling

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-propose` (`SKILL.md` / total) | 3.130 / 3.157 · 13.937 / 14.162 | 27 · 225 | `SKILL.md` 2.900 y total 9.400, `sin medir`: salen las cuatro referencias (1.232 + 428 + 1.126 + 1.599 = 4.385) y ~300 de los pasos 4-6 → ~9.250 + 2 % |
| `sdd-spec-writing` (nueva) | — | — | 3.300 (`SKILL.md` = total), `sin medir`: ~1.670 del original (con las frases de la decisión 6) + ~1.550 del kit (`spec-writing.md` 1.232, `coherence-pass.md` 428, el gate ~300, menos ~400 que sustituyen texto del original) → ~3.150 + 2 % |
| `sdd-spec-review` (nueva) | — | — | `SKILL.md` 1.250, total 1.680, `sin medir`: `review-spec.md` 1.599 + la línea de la prosa (~30) → ~1.630 + 2 % |
| `sdd-plan-writing` (nueva) | — | — | 1.800 (`SKILL.md` = total), `sin medir`: ~1.000 del original + ~700 de `plan-writing.md` que no sustituyen texto del original → ~1.700 + 2 %, mínimo 20 |
| `sdd-grilling` (`SKILL.md` = total) | 886 / 886 | 0 | sin cambio: no se edita (decisión 6) |
| `.docs/sdd/steering/constitution.md` | 2.223 / 2.250 | 27 | 2.303, `sin medir`: la línea del Art. II (~35) + 2 %; el cambio de `:51` no cambia el recuento |
| `PRODUCT.md` | 1.797 / 1.799 | 2 | sin cambio: `:16` cambia un número y `:23` una ruta por otra |
| `.docs/sdd/steering/architecture.md` | 4.867 / 4.877 | 10 | sin cambio, `sin medir`: el punto 6 se reescribe sin crecer y `:90` cambia una ruta; si crece, es un desvío |

Saldo de las skills que toca: hoy 14.823 (`sdd-propose` + `sdd-grilling`); con los topes, 17.066 (9.400 + 3.300 + 1.680 + 1.800 + 886: +2.243); previsto, ~16.700 (+~1.900). Decisión 19.

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `SCENARIOS="ss1 rq1"` (n 3 + 3) → `sin medir`: 6 sujetos × 0,88 $ | 5,28 |
| GREEN | `SCENARIOS="ss1 rq1 iq2"` (n 3 + 3 + 2) → `sin medir`: 8 sujetos × 0,88 $; y el tramo `SCENARIOS="iq1 iq2 iq3 iq4 iq5 pb a5 g1 g1b s1 cp1 sp1 p2 ax pl2 pl3 k2p t1 co1 co2 co2p co3 co4 co5 co6 co7 co8 cr1 cr2 cr3 rc1 rc2 sr1 rv1 rv2 rv3 lr1 rr1 f1 h1 adr adr6" N=1` , más `a1` (~0,38 $) | 44,56 |
| Una tanda de REFACTOR | `SCENARIOS="ss1 rq1 iq2"` → `sin medir`: 8 sujetos × 0,88 $ | 7,04 |
| Controles | `SCENARIOS="p1 p2 p3 fp pe"` de `interviewer` → `suma: 16 sujetos · coste previsto: 4.87 $` | 4,87 |
| Medición tras la revisión final | `SCENARIOS="ss1 rq1 iq1 iq2 iq3"` → `sin medir`: ~12 sujetos × 0,88 $ | 10,56 |
| Suma | 93 sujetos | 72,31 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-19 | aprobada («1», opción «Apruebo») |
