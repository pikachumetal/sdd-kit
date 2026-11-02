---
id: 20261102-135210-feature-0271-clean-red-rules
feature: 0271
title: Una sola línea de conducta ante un RED limpio
mode: full
profile: delegate
status: approved
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — Una sola línea de conducta ante un RED limpio

🦆 Hoy, si la prueba previa de una regla sale sin fallo, cada documento manda algo distinto: uno pide dos sujetos, otro repetir, otro parar, y una tanda de un solo sujeto llegó a sacar un frente que sí fallaba (8,42 $ y dos paradas en la 0186). Con esta feature, la spec puede marcar un punto «si el RED lo exhibe». Si está marcado y sale limpio con tres sujetos, el agente lo quita, lo apunta y sigue; sin la marca, para y te pregunta. Un frente con caso de campo siempre se mide con tres sujetos antes de salir, y si la petición de la prueba ya empujaba al fallo, se mide también sin esa frase. El plan deja de fijar «para» por su cuenta y, si da por cubierto un THEN con un molde, tiene que haberlo abierto.

Validación: agente — `validation.mode: field`: son reglas del kit, y lo medible (sujetos, tests, conteo) lo mide el agente; el uso real llega por los tickets.

## Capacidades

- Modificadas: `control-profiles` — el desvío deja fuera lo marcado como condicionado, con RED limpio y n = 3.
- Modificadas: `feature-flow` — el Scope marca lo condicionado al RED, y el self-review abre lo que da por cubierto un THEN.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: `MODIFIED` (dos requisitos) · tamaño: ~40 líneas en 5 ficheros
- Mínimo razonable: ninguna; la revisión final en ejes sigue, y el repaso de coherencia lo hice yo.

`sdd capability merge` sobre una copia: sale con 0; sustituye dos requisitos y añade dos.

1. **`control-profiles.md` entra como quinta pieza, aunque la petición nombra cuatro.** Dice «Un desvío cambia la spec aprobada: … el Scope» sin excepción, así que contradiría a `sdd-implement`. Lleva una cláusula y la paga la misma skill.
2. **`n = 3` es un suelo, no una garantía.** Con el 1 de 6 de la 0059, tres sujetos cazan el fallo solo el 42 % de las veces (1 − (5/6)³). Por eso se conserva «mirar de dónde sacó cada sujeto la conducta»: si fue de una fuente incidental, otra tanda. Es lo único que añado al criterio de la petición.
3. **Lo marcado pide n = 3 siempre, tenga o no caso de campo.** La petición permite que un frente sin caso de campo salga con la muestra de hoy; eso vale antes de la spec, donde ese frente ni entra. Una vez marcado en un Scope aprobado, una sola regla: n = 3.
4. **La regla de `tech-stack.md` 84 cambia de forma.** Hoy: dos sujetos antes de presentar la spec, y la spec lleva solo lo que falla. Queda: el frente con caso de campo se mide con n = 3 antes de la spec o entra marcado. Por eso esta spec se presenta sin haber lanzado sujetos: el Art. I pide declarar el coste antes del primero.
5. **Qué se marca aquí.** Marcados, los dos frentes de `plan-writing.md`: se pueden quitar sin romper la regla. Sin marcar, la marca de `spec-template.md` y la cláusula de `sdd-implement`: sin ellas no hay regla, y un RED limpio ahí es un desvío y paro. Si un frente marcado sale, «las piezas dicen lo mismo» se cumple porque `plan-writing.md` no contradice nada.
6. **El saldo, contra el tope nominal: tres ficheros ya lo pasan antes de empezar**, dentro del margen del 25 % (tabla «Topes de palabras»). Lo interpreto como saldo ≤ 0 respecto a lo medido hoy, con el nominal a la vista. Bajarlos hasta el nominal serían 3.587 palabras de recorte, con su RED: no es esta feature. **Si lo leías como «hay que quedar bajo el nominal», dímelo en el gate.**
7. **Las frases de superpowers no pagan.** Las candidatas obvias de «Rulings, not stalls» («costs their whole day», «made in secret») son texto de la fuente, y el Art. IX pide un A/B para quitarlas. Paga texto propio del kit.
8. **El Art. I no se toca: no contradice el resultado.** «Si el baseline no exhibe el fallo, no se escribe» sigue igual; esta feature dice cuánta muestra hace falta y quién decide cuando el punto ya estaba aprobado. El humo (n = 1) es de una edición, no de sacar un frente.
9. **Escenarios nuevos**: `a3`, `a4`, `cr1` y `cr2`, con `a2` y `b2` como controles. La petición de todos es neutra («Sigue y cierra la task»), así que no llevan gemelo.
10. **Techo de sujetos: 30 $** (tabla «Previsión de coste»). Es mucho para una fila de tamaño S, y lo pagan siete sujetos en Opus en el GREEN de `sdd-implement`. Si se supera, paro.

- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (ni módulo ni dependencia nuevos) · otros despachos en paralelo: sujetos de `sdd-implement` en Opus (los tickets vienen de Opus) y de `sdd-propose` en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Cada arreglo sustituye texto, y el saldo de cada skill no sube, medido contra el tope nominal. — «Cada arreglo sustituye texto, y el saldo de cada skill no sube, medido contra el tope nominal. Lista lo que lo paga antes de presentar la spec.»
- Un frente sin caso de campo puede salir con la muestra de hoy. — «Un frente sin caso de campo puede seguir saliendo con la muestra de hoy, para no encarecer cada RED.»
- Los criterios salen de lo medido en los tickets. — «una propuesta marcada «sin verificar» es hipótesis, no criterio.»
- Un frente limpio sale solo si está marcado. — «Un frente con RED limpio se saca solo si la spec lo marcó condicionado; si no, es un desvío y paras. Esta misma spec lo aplica.»

## Intent

Seis features pagaron por cómo se trata un RED limpio: la 0186 sacó un frente que fallaba, con n = 1 y una petición que traía la orden (8,42 $ y dos paradas); la 0163 sacó piezas de un Scope aprobado, y fue un desvío; la 0276 tenía un plan que decía «para» donde el método pedía otra tanda; la 0129 escribió guía sin evidencia; y las 0277 y 0282 dieron por cubierto un THEN con un molde o una sonda que nadie abrió. Las reglas se contradicen o faltan. El éxito: las piezas dicen lo mismo, ninguna línea de `tech-stack.md` las contradice, un sujeto saca lo marcado con un ruling y para ante lo no marcado, y el saldo de las skills no sube.

## Scope

- Entra: `.docs/sdd/tech-stack.md`: «Una primera tanda limpia no basta para recortar» lleva la regla (n = 3 con caso de campo, gemelo si la petición propone el fallo), y se alinean las líneas que la contradicen: «Un baseline que no falla…», «Un baseline limpio no reproduce…», «Matices de campaña» y «Un RED limpio con n=2…», esta última fundida en la primera.
- Entra: `skills/sdd-templates/templates/spec-template.md`: el Scope puede marcar lo condicionado.
- Entra: `skills/sdd-implement/SKILL.md`, «Deviations and rulings»: quitar lo marcado, con RED limpio y n = 3, es un ruling; lo no marcado para.
- Entra: `skills/sdd-propose/references/control-profiles.md`, «Desvío»: la misma cláusula.
- Entra: las baterías `tests/batteries/sdd-implement/` y `tests/batteries/sdd-propose/` con sus escenarios, su evidencia en `tests/` y los deltas de `control-profiles` y `feature-flow`.
- Entra, si el RED lo exhibe: `skills/sdd-propose/references/plan-writing.md`: un paso de RED limpio remite a «Deviations and rulings» en vez de fijar una parada.
- Entra, si el RED lo exhibe: `skills/sdd-propose/references/plan-writing.md`, Self-review: abrir el molde o la sonda que da por cubierto un THEN.
- No entra: `battery.mjs` (0273, ya fusionada).
- No entra: el Art. I de la constitution, salvo que contradiga el resultado, y entonces paro y lo digo; hoy no lo contradice (decisión 8).
- No entra: una regla de orden que pasa a la CLI (0186 §2), con un solo caso.

### Lo que paga el saldo

| Skill o documento | Entra | Sale, y por qué puede salir |
| --- | --- | --- |
| `sdd-implement` | la cláusula de «Deviation»: «A Scope item marked «si el RED lo exhibe» with a clean RED at n = 3 goes out with a `Ruling:`; anything else is a deviation.» (~27) | la fila de excusas «It doesn't change the spec, so it's a ruling» (~44): texto del kit que repite «Scope brakes» y su red flag; control `b2` |
| `sdd-propose` | la cláusula de «Desvío» (~25) y, si salen del RED, las dos frases de `plan-writing.md` (~35) | la sección «Commits» de `plan-writing.md` (~37), que repiten `commit-milestones.md` y el Step 4 de `plan-template.md`; «A task whose test only reads…» (~14), literal en §4 de `plan-template.md`; y «Arbitra así la contradicción entre…» de `control-profiles.md` (~25), que explica la regla sin añadir ninguna |
| `sdd-templates` | la línea de Scope de `spec-template.md` (~15) | «Si esta spec crea una capacidad nueva en `capabilities/`, se declara aquí.» (~12), que repite el bloque de «Capacidades»; y «Cambiarla durante la implementación es un desvío.» (~7), que ya está en la lista de «Deviation» |
| `tech-stack.md` | la regla reescrita (~+40) | «Un RED limpio con n=2…» (~50, fundida) y lo que se quita de la línea 84 |

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «dos sujetos con el escenario del ticket» y «La spec lleva solo los frentes que fallan» | `tech-stack.md`, «Un baseline limpio no reproduce…» | Scope: pasa a n = 3 o marcado; decisión 4 |
| «Un RED limpio con n=2 puede ser suerte» | `tech-stack.md`, «Baterías por skill» | Scope: se funde en «Una primera tanda limpia…», con su evidencia |
| «se vuelve a pedir la aprobación» sin distinguir la marca | `tech-stack.md`, «Un baseline que no falla…» | Scope: distingue marcado y sin marcar |
| fila «It doesn't change the spec, so it's a ruling» | `skills/sdd-implement/SKILL.md`, tabla final | Scope: la regla sigue en «Scope brakes» y en la red flag |
| sección «Commits» | `skills/sdd-propose/references/plan-writing.md` | Scope: la regla sigue en `commit-milestones.md` y `plan-template.md` |
| «Cambiarla durante la implementación es un desvío» | `spec-template.md`, «Dónde se prueba» | Scope: la regla sigue en «Deviation» de `sdd-implement` |

- Filas que implementa: 0271 y la de deuda «Un RED limpio con n = 1 saca de la spec un frente que falla» → solo las nombra `.docs/sdd/roadmap.md`, y las marca el cierre; `skills/` y `capabilities/`: nada, comprobado con una búsqueda de `0271` y de los títulos de esas reglas.

## Approach

Cada arreglo sustituye texto. La línea de conducta, de principio a fin:

1. Un frente con caso de campo se mide con n = 3 antes de la spec, o entra en el Scope con «si el RED lo exhibe». Sin caso de campo, la muestra de hoy, antes de la spec.
2. Si la petición del molde propone el fallo, el escenario lleva un gemelo sin esa frase.
3. Con RED limpio y n = 3, lo marcado sale con un `Ruling:`; lo no marcado es un desvío y para.
4. Un plan no fija qué hacer ante un RED limpio: remite a esa regla.

## Dónde se prueba

- Lo marcado, limpio y con n = 3, sale con un ruling: `a3` de la batería de `sdd-implement`, sobre el molde `kit` de `a2`.
- Lo marcado, limpio y con n = 1, no sale con un ruling: `a4`, el mismo molde.
- Lo no marcado para: `a2`, que ya existe, como control.
- El freno de alcance sigue parando sin la fila de excusas: `b2`, como control.
- La marca de la plantilla: `cr1` de la batería de `sdd-propose`, una spec con un frente de campo sin medir.
- Plan y self-review: `cr2` de la misma batería, un plan con un paso de RED y un THEN cubierto por un molde.
- Que ninguna línea de `tech-stack.md` contradiga: lectura con fichero y línea, en la evidencia.
- El saldo: el conteo de `word-budget.test.ts`, contra lo medido en la apertura.

## Términos y ADR

- Términos resueltos: frente condicionado — punto del Scope marcado «si el RED lo exhibe»; gemelo — el mismo escenario sin la frase de la petición que propone el fallo.
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `control-profiles`

#### MODIFIED — Un cambio a la spec aprobada es un desvío

- GIVEN la spec aprobada de cancelar reservas, con la Task 1 cerrada y la Task 2 en curso, que descubre que la spec pide guardar el motivo de la cancelación y la tabla de reservas no tiene ese campo
- WHEN el trabajo exige cambiar un requisito, un THEN, el Scope, un «No entra» o «Dónde se prueba»
- THEN en `pair` y `delegate` el agente para con el 🦆 del cambio y su ✋, deja escrito sin commitear el THEN corregido en su sitio de la spec y la línea en `## Enmiendas`, y espera la aprobación
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

### Capacidad: `feature-flow`

#### ADDED — El Scope marca lo condicionado al RED

- GIVEN una spec que edita una skill, con el frente «la nota sin fecha» que viene de un ticket y aún no se ha medido
- WHEN el agente escribe el Scope antes de medirlo
- THEN el frente va en una línea `Entra, si el RED lo exhibe:`, separada de los `Entra:`

#### MODIFIED — El self-review del plan asigna cada cláusula de un THEN a lo que la observa

- GIVEN una spec con «THEN el agente ha preguntado el umbral · AND la sección lleva la respuesta», y una task cuyo test solo mide lo escrito
- WHEN el agente escribe §4 del plan
- THEN §4 lleva una línea por cláusula, cada una con su task y el test o la fila de medición que la observa: `THEN ha preguntado → Task 2, escenario n1 (turno 1)` y `AND la sección lleva la respuesta → Task 2, n1 (spec-new.md)`
- AND una cláusula que nada observa dice `sin observar: <motivo>`, y el plan lo avisa en sus decisiones antes de ejecutar
- AND si la spec trae la tabla «regla retirada → dónde vive ahora», §4 lleva una línea por fila con su task y el test que busca la regla en su destino
- AND una línea que da por cubierta una cláusula con un molde o una sonda que ya existen sale de haberlos abierto, y si lo que dice de ellos no está, la línea no lleva ✓

#### ADDED — Un paso de RED limpio del plan remite a la regla

- GIVEN un plan con un paso que mide el RED de un frente
- WHEN el agente escribe qué pasa si sale limpio
- THEN el paso remite a «Deviations and rulings» de `sdd-implement` y no fija «para» ni «sigue» por su cuenta

## Topes de palabras

Conteo de `word-budget.test.ts`, sobre `760feee7`. El test deja un 25 % de margen; aquí va el tope nominal.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-implement/SKILL.md` | 9.705 / 9.483 | −222 | sin cambio; saldo ≤ 0 |
| `sdd-implement` entera | 17.475 / 17.740 | 265 | sin cambio; saldo ≤ 0 |
| `sdd-propose` entera (`plan-writing.md` 904; `control-profiles.md` 4.787) | 13.894 / 14.200 | 306 | sin cambio; saldo ≤ 0 |
| `sdd-templates` entera (`spec-template.md` 2.044) | 16.797 / 15.720 | −1.077 | sin cambio; saldo ≤ 0 |
| `.docs/sdd/tech-stack.md` | 21.951 / 19.663 | −2.288 | sin cambio; saldo ≤ 0 |

## Previsión de coste

Precio por sujeto: 1,04 $ en `sdd-implement` con Opus (0186: 44,71 $ en 43 sujetos) y 0,69 $ en `sdd-propose` con Sonnet (0163: 24,80 $ en 36).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `a3` × 3 (`sdd-implement`); `cr1` × 3 y `cr2` × 3 (`sdd-propose`) | 7,26 |
| GREEN | `a3` × 3, `a4` × 2 y `a2` × 2 (`sdd-implement`); `cr1` × 2 y `cr2` × 2 (`sdd-propose`) | 10,04 |
| Una tanda de REFACTOR | `a3` × 2; `cr1` × 2 y `cr2` × 2 | 4,84 |
| Controles | `b2` × 2 y ~3 de la pasada de fix (~20 % de los sujetos) | 4,35 |
| Medición tras la revisión final | `a3` × 2 | 2,08 |
| Suma | 33 sujetos | 28,57 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
