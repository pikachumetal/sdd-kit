---
id: 20261102-173845-feature-0281-coherence-pass-scope
feature: 0281
title: El repaso de coherencia parte también del Scope
mode: lite
profile: delegate
status: approved
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — El repaso de coherencia parte también del Scope

🦆 Hoy, si una spec retira una skill cuyo «paso 3» citan dos requisitos sin nombrarla, esos dos se escapan, porque se busca el nombre. Con esto, quien escribe la spec busca también esos pasos, y los dos salen en «Lo que se retira» antes de enseñártela. Lo de declarar `cli` cuando el Scope añade una opción no cambia: medido, los sujetos ya lo hacen. La skill no crece: 5.303 palabras antes, 5.301 después.

Validación: agente — `validation.mode: field` en `sdd-kit.json`: RED/GREEN con sujetos y el uso real.

## Capacidades

- Modificadas: `feature-flow` — «La spec se repasa antes del gate» gana la búsqueda de los pasos numerados de lo que se retira.

## ✋ Decisiones que he tomado yo — valida estas

1. **Leo «el saldo no sube» como «la cuenta de `SKILL.md` no pasa de 5.303»; no bajo a 5.250.** El tope nominal da −53 de margen antes y −51 después: el exceso queda a la vista en «Topes de palabras», sin usar el 25 % de holgura como sitio. Bajar a 5.250 supondría recortar instrucciones ajenas a esta feature, cada una con su RED.
2. **Los dos frentes van con `Entra, si el RED lo exhibe:`.** Son de ticket y sin medir, y es lo que pide la plantilla. Un RED limpio con n = 3 saca ese frente sin desvío. Si salen limpios los dos, `SKILL.md` no cambia, «Está hecho» no se cumple por edición, y paro a contártelo antes de cerrar.
3. **Texto de la regla** (el literal, en Approach). Lo pagan: el porqué «a THEN left with the old value is the contradiction you were looking for» (−14; la tabla de racionalizaciones ya cuenta esa contradicción), «and nobody else searches them» (−5) y compactar «search all its occurrences… change them all» (−2). Solo quitan porqués, ninguna instrucción, y lo vigilan los controles.
4. **Requisito nuevo en líneas `AND` añadidas**: las del vivo no se tocan, y `capability merge` no pierde ninguna.
5. **Dos escenarios nuevos, `co5` y `co6`, con sus filas de rúbrica `CO5` y `CO6`**, en moldes derivados de `reservas` con 15 y 14 capacidades: el de `co5` lleva `capabilities/cli.md` y una spec con `--planta` en el Scope y sin `cli`; el de `co6`, una skill con pasos numerados y dos requisitos de una capacidad que el delta no declara, que citan «paso 2» sin nombrarla. Como `co1`, la petición solo dice «Termina el paso 4 y preséntamela para aprobar»: no trae la orden.
6. **Salidas correctas de cada fila**: en `CO5`, `cli` en el delta (`### Capacidad: \`cli\``); decirlo en ✋ sin añadirlo falla. En `CO6`, los dos requisitos con su destino en «Lo que se retira o cambia de forma».
7. **Controles tras el GREEN**: `s1`, `t1` y `sp1`, con el n de su batería: son los que miden las frases que adelgazo.
8. **`sdd capability merge` a prueba sobre una copia en el scratchpad de la sesión**, ignorado por git, porque tus instrucciones llevan ahí los temporales; la skill dice «fuera del repo». Resultado: `feature-flow.md: sustituido «La spec se repasa antes del gate»`.
- Política de modelos: sin revisores de spec (lite) · ejes de la revisión final según `sdd-verify`: Spec opus+high, Código sonnet+high · sujetos en Sonnet, por tandas, en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar; lo que no nombra se confirma aparte.

Carril lite, pedido en el encargo y comprobado:

- El flujo existe y se lee: `skills/sdd-propose/SKILL.md`, paso 4, y su batería.
- No cambia contratos públicos: ningún verbo ni opción de la CLI.
- No cambia ningún schema de datos.
- Cabe en un área: `sdd-propose` y su batería.
- La estimación es ≤ media jornada.

### Decisiones tomadas con el dev-lead

- Carril, perfil y merge — «Arranca la 0281 con sdd-propose, carril lite»; «Perfil delegate. Al fusionar, `sdd merge --push`.»
- Sustituye una frase y el saldo no sube — «Sustituye una frase del paso y el saldo de `sdd-propose` no sube, medido contra el tope nominal, 5.250, porque ya lo supera. Cuenta el texto antes de presentar la spec y lista lo que lo paga.»
- RED limpio — «Un RED limpio de un frente con caso de campo se mide con n = 3, sin que la petición del molde traiga la orden. El frente se saca solo si la spec lo marcó condicionado; si no, es un desvío y paras.»

## Intent

El repaso parte de cada `MODIFIED` y de lo que se retira, así que lo no declarado solo sale en la revisión final. La 0116 añadió una opción a `sdd upgrade` sin declarar `cli`: dos revisores lo vieron y hubo una parada del dev-lead. La 0206 retiró una skill, y cuatro requisitos que citaban «paso 7» a secas se escaparon: una enmienda sin aprobar. El éxito: esos dos casos salen antes del gate. Fracasaría, aunque funcione, si la skill crece.

## Scope

- Entra, si el RED lo exhibe: al retirar algo, el repaso busca también los pasos numerados que tenía. RED: 1/3 con requisitos en una capacidad no declarada.
- Entra: `co5`, `co6`, sus moldes y filas en `tests/batteries/sdd-propose/` y la fila de procedencia, con la evidencia del RED, midan lo que midan.
- No entra: el cruce del Scope con el índice de capacidades (RED limpio, 6/6, Enmiendas); un verbo nuevo de la CLI para el cruce; otras comprobaciones del paso 4; `capability merge`, arreglado en la 0270.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Los porqués de la decisión 3 | solo `skills/sdd-propose/SKILL.md:62`: comprobado con `grep -rnE "left with the old value\|nobody else searches" cli/test skills tests/batteries .docs/sdd/capabilities` | Scope; ningún requisito ni test los nombra |

- Filas que implementa: 0281 y la deuda «El repaso de coherencia no ve una capacidad que cambia sin `MODIFIED`» → `roadmap.md`:69 y :682, que marca el cierre; las listas «tras …» de las filas 0198 y 0152 (:135 y :136) solo citan el id y se quedan. `capabilities/`, `skills/`, `cli/test/` y `tests/`: nada, comprobado con `grep -rln 0281`.

## Approach

En `skills/sdd-propose/SKILL.md`, línea del «Coherence pass»:

- Retirada, tras la búsqueda de cada nombre e id: «For anything retired with numbered steps, also `grep -rniE "(pasos?|steps?) <n>\b" capabilities/`: each bare hit goes in that table.»

El cruce del Scope no se escribe: su RED salió limpio.

## Dónde se prueba

- Cruce con el índice: `co5`, control: RED n = 3 en dos moldes, Sonnet, sin la orden en la petición.
- Pasos de lo retirado: `co6`, RED n = 3, GREEN y REFACTOR n = 2, igual.
- Lo adelgazado: controles `s1`, `t1` y `sp1`.
- Saldo: `cli/test/kit/word-budget.test.ts` y el conteo final en el walkthrough.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `feature-flow`

#### MODIFIED — La spec se repasa antes del gate

- GIVEN una spec redactada en la que un mismo literal (una expresión, un fichero, un umbral) aparece en una decisión y en un escenario que se contradicen
- WHEN el agente termina el paso 4, con o sin review de spec
- THEN corrige la contradicción, o la señala, antes de pedir la aprobación
- AND para cada `MODIFIED` busca en el código dónde se implementa lo que cambia y lista en el Scope cada fichero que lo implementa, o dice por qué queda fuera: con «Búsqueda por cliente» en `src/search.js` y en `src/phone.js` y un Scope que solo nombra el primero, el Scope pasa a nombrar los dos
- AND lo que cambió aparece en «Decisiones que he tomado yo»
- AND si la spec retira algo o cambia la forma o el sitio de un documento (un literal de plantilla incluido: una etiqueta, un encabezado, una línea fija), busca su nombre en `capabilities/`, en los documentos del proyecto y, en un kit de skills, en `skills/`, y escribe cada resultado en «Lo que se retira o cambia de forma», con su destino: el delta, el Scope o una decisión con su motivo; con la etiqueta `- Real:` pasada a `- Esfuerzo real:` en `patch-template.md` y dos requisitos de `estimation` que la nombran, los dos van al delta como `MODIFIED`
- AND al retirar algo con pasos numerados busca también esos pasos: con una skill retirada cuyo «paso 3» citan dos requisitos sin nombrarla, los dos salen en esa sección con su destino
- AND la misma sección lleva cada id de fila que la spec implementa con los ficheros que la nombran («la define la 0009» en `docs/config.md` → Scope), o «nada: comprobado con `grep -rn 0009 capabilities/ skills/`», y no se borra con los bloques de ayuda
- AND antes del gate ejecuta `sdd capability merge --path <copia> --artifact <spec.md>` sobre una copia de `.docs/sdd` fuera del repo, corrige en la spec lo que rechace y escribe la línea del resultado en «Decisiones que he tomado yo»; la `capabilities/` del repo no cambia

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,3 h
- Estimación de implementación: 1,5 h
- Base de la estimación: una línea de skill y dos moldes derivados de `reservas`; la incertidumbre es cuántas tandas pide el GREEN, con un precedente de dos REFACTOR en `sp1` (0185).
- Confianza: media

## Topes de palabras

Conteo: `split(/\s+/)` de `word-budget.test.ts`, sobre el borrador aplicado a una copia. Balance en `SKILL.md`: +19 de la frase del `grep`, −5, −14 y −2 = **−2**: 5.303 → 5.301.

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-propose/SKILL.md` | 5.303 / 5.250 nominal (6.562 con holgura) | −53 nominal | sin cambio: queda en 5.301 |
| `skills/sdd-propose` completa | 13.891 / 14.200 nominal (17.750 con holgura) | 309 | sin cambio: baja 2 |

## Previsión de coste

Precio por sujeto: ~0,70 $, de la fila `CO4` de la batería y de `estimation.md` (0,6-0,9 $ por sujeto de un turno).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `co5` y `co6`, n = 3: 6 | 4,20 |
| GREEN | `co5` y `co6`, n = 2: 4 | 2,80 |
| Una tanda de REFACTOR | `co5` y `co6`, n = 2: 4 | 2,80 |
| Controles | `s1`, `t1`, `sp1`, n = 1: 3 | 2,10 |
| Medición tras la revisión final | `co5` y `co6`, n = 1: 2 | 1,40 |
| Suma | 19 | 13,30 |

## Enmiendas

- 2026-11-02 — sale el frente del cruce del Scope, con su `AND` del delta y su frase del Approach; el «Entra» pasa a «No entra» — RED `co5` limpio 3/3 en dos moldes, con la marca de la spec — sin aprobar (aplica literal «El frente se saca solo si la spec lo marcó condicionado»).
- 2026-11-02 — cambia lo que paga el saldo y la frase de la retirada pasa a una orden con su `grep`, con el mismo `AND` — GREEN y REFACTOR con «its numbered steps» se quedaron en 1/2; lo decide la constitution, Art. II — sin aprobar (aplica literal «el saldo… no sube… lista lo que lo paga»).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
