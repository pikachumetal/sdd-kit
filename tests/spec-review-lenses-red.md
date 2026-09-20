# Evidencia RED — review de spec con lentes sin solape (2026-09-21)

Baseline de la [task 0011](../.docs/sdd/specs/20260920-220930-task-0011-spec-review-lenses/spec.md) de la release 1.2.0. Mide tres cosas con el `review-spec.md` **vigente** (commit `74009d4`): cuánto se solapan las dos lentes, qué forma tiene la propuesta de nivel que llega al gate, y si algún revisor mira los ejemplos de la spec.

## Método

Sujetos Sonnet como **subagentes** `general-purpose` (el revisor de spec no despacha a nadie, así que el método barato mide lo mismo; el tool `Agent` no expone `effort`, desviación del Art. IV ya anotada en T7). La guidance se entrega **pegada por prompt**: a los revisores, el encargo literal de `review-spec.md` §3 con los puntos de su lente; a los sujetos de propuesta, las secciones 1–3 del fichero. Ninguno tiene acceso al repo del kit — el fixture vive fuera, en el scratchpad de sesión, y el encargo prohíbe leer fuera de él.

Verificación: el informe de cada sujeto, mapeado hallazgo por hallazgo contra los defectos plantados.

## Fixture «Ledgerly» (8 defectos plantados, uno por punto del encargo)

Backoffice de pedidos ficticio con `constitution.md` (estado explícito, datos ficticios, idioma, reglas de producto con sus cinco nombres, calidad de código), `mission.md`, `architecture.md` (declara las exportaciones a logística como contrato público y PostgreSQL como único almacén) y dos capacidades escritas en la forma del kit: `orders.md` («Un pedido se cancela solo antes del envío», «El estado lo cambia quien tiene el pedido asignado») y `refunds.md` («El reembolso lo ejecuta administración»).

Sobre eso, la spec de la task 0042 «Cancelar pedidos ya enviados con reembolso», con un defecto por punto:

| # | Defecto plantado | Punto del encargo que debería cazarlo |
| --- | --- | --- |
| D1 | `ADDED` «El pedido enviado se cancela con aprobación de supervisor», que deroga un requisito vivo | (1) contradicción con `capabilities/` |
| D2 | THEN «la cancelación se percibe como inmediata para el operador» | (2) escenario no verificable |
| D3 | El Intent promete email con justificante al cliente; el Scope no lo lista | (3) alcance oculto |
| D4 | Columna nueva `cancel_reason` con catálogo cerrado de cinco motivos, decidida en el Approach | (4) decisión fuera de «Decisiones a validar» |
| D5 | Rol `supervisor de tienda` descrito solo por lo que puede hacer | (5) complemento de visibilidad |
| D6 | Tope de 30 días y aviso al cliente nuevos, sin «Reglas de la capacidad» | (5 bis) las cinco reglas por nombre |
| D7 | `exports/cancellations-YYYYMMDD.csv` que lee logística, mencionado de pasada | (6) contratos, datos, dependencias |
| D8 | «El flujo copia el de Alybo…» — nombre de un proyecto real del equipo como ejemplo | ninguno (el hueco que la task viene a cerrar) |

El fixture no telegrafía la conducta medida: nada en él habla de lentes, de duplicados ni de revisar ejemplos.

## E1 — ¿se solapan las dos lentes? (2 sujetos: una lente cada uno, encargo vigente)

19 hallazgos en total: 9 la lente dominio, 10 la técnica. Mapeados contra los defectos:

| Defecto | Lente dominio | Lente técnica | ¿Duplicado? |
| --- | --- | --- | --- |
| D1 `MODIFIED` no declarado | Crítico 1 | Crítico 1 | **sí** |
| D8 nombre real | Crítico 2 | Crítico 4 | **sí** |
| D7 export a logística | Crítico 3 | Importante 7 | **sí** |
| Límite 30 días vs. «más de un año» del Scope | Crítico 4 | Crítico 3 | **sí** |
| D4 `cancel_reason` y catálogo | Crítico 5 | Importante 6 | **sí** |
| `refunds`: «el sistema» emite contra «lo ejecuta administración» | Importante 6 | Crítico 2 | **sí** |
| D2 THEN no verificable | Importante 7 | Importante 8 | **sí** |
| D3/D6 avisos (cliente y administración) | Importante 8 | Importante 9 | **sí** |
| D5 complemento del rol supervisor | Importante 9 | Importante 5 (por otro ángulo: el supervisor no es el asignado) | parcial |
| Motivo de rechazo sin catálogo | — | Menor 10 | no |

**8 duplicados plenos y 1 parcial de 19 hallazgos: 45 %.** El campo midió 4 de 18 (22 %) en la task 0009; con un fixture que planta un defecto por punto, el solape sale al doble. Hallazgos exclusivos: uno por lente (el complemento del rol, en dominio; el catálogo del motivo de rechazo, en técnica). Coste: 71,5k y 72,0k tokens, 6 y 7 tool uses, 108 y 121 s.

**Lectura**: los puntos 1–4 son comunes a las dos lentes y los dos revisores los recorren enteros, así que el segundo revisor paga ~100k tokens por dos hallazgos que el primero no vio. El reparto queda respaldado.

## E2 — ¿la propuesta de nivel ayuda a decidir? (2 sujetos)

A los dos se les dio la spec, los anclajes y las secciones 1–3 del `review-spec.md` vigente, y se les pidió lo que escribirían en la spec sobre el nivel de review. Devolución literal:

- Sujeto A: `Review de spec propuesta: dos revisores — señales: contrato público, MODIFIED, dato nuevo, reglas de visibilidad o permiso.`
- Sujeto B: `Review de spec propuesta: dos revisores — señales: contrato público, MODIFIED, dato nuevo, área no explorada, reglas de visibilidad o permiso.`

**2/2 devolvieron exactamente la forma que la receta pide y nada más**: nivel y señales. Ni una palabra de para qué serviría cada lente en esta spec, ni de qué opción más barata sería defendible, ni de lo que esa opción dejaría sin mirar. Es el fallo de campo reproducido: la rúbrica entrega un número y el dev-lead pregunta «¿es necesario?» sin nada con lo que responder (ticket de la task 0006a §13). Fallo **de forma**, no de disciplina: los dos hicieron exactamente lo que la receta dice.

Coste: 75,5k y 72,8k tokens.

## E3 — ¿mira alguien los ejemplos de la spec? (2 + 2 sujetos, dos condiciones)

El ticket de la task 0009 §16 reportó una spec que usaba el nombre de un proyecto real como ejemplo sin que ningún revisor lo marcara. El primer intento de reproducirlo **falló como baseline**, y el fallo enseñó dónde está el hueco de verdad.

| Condición | Constitution del fixture | ¿Marcan el nombre real? |
| --- | --- | --- |
| E3a (2 sujetos, lentes dominio y técnica) | con Art. II «Datos ficticios en los artefactos», explícito | **2/2 sí**, los dos como Crítico |
| E3b (2 sujetos, lente dominio) | el mismo fixture **sin** ese artículo | **0/2** |

En E3b el sujeto A sí nombró la frase, pero como decisión no declarada («la referencia a copiar el flujo de Alybo… son decisiones tomadas en Approach que no figuran en la lista de decisiones a validar»): la trató como un hueco de trazabilidad, no como un nombre que no debería estar. El sujeto B no la mencionó en ninguno de sus nueve hallazgos.

**Lectura**: con una regla escrita, el revisor la aplica sin necesidad de un punto nuevo en el encargo; el hueco aparece cuando **la regla no existe**, que es la situación real del kit — su constitution no dice en ninguna parte que la evidencia de campo se cite sin nombre propio, y por eso en campo nadie marcó nada. El punto que se añade no puede remitir a la constitution del proyecto, o hereda el mismo agujero: se escribe con criterio propio («aunque la constitution no lo prohíba»). La regla general para los proyectos consumidores sigue siendo trabajo de la task 0002.

Coste E3b: 71,1k y 72,7k tokens.

## Positivos que NO requieren guidance

- Los dos revisores **leyeron los cuatro documentos** que el encargo nombra y ninguno se salió del fixture: la instrucción de «no leas código ni otras specs» se cumplió 4/4 sin refuerzo.
- El formato de salida (`<Crítico|Importante|Menor> · <dónde> · <qué falla> · <qué cambiar>`, lista numerada, sin preámbulo) llegó **6/6**, incluidos los sujetos de E3b. La receta de §3 no necesita retoques.
- Los dos sujetos de propuesta contaron bien las señales y propusieron el mismo nivel (dos revisores); el defecto no está en la rúbrica de §1, que esta task no toca.
- Ninguno de los seis reclamó la tabla de señales ni pidió contexto extra: la lista de lectura del encargo es suficiente.

## Conclusión — qué guidance queda respaldada

| Cambio previsto | Veredicto del RED |
| --- | --- |
| Repartir los puntos 1–4 entre lentes y prohibir invadir el punto de la otra | **Respaldado**: 8 duplicados plenos y 1 parcial de 19 hallazgos (45 %), el doble que en campo |
| La propuesta de nivel dice para qué sirve cada lente en esta spec y la opción mínima con su descubierto | **Respaldado**: 2/2 devolvieron solo nivel y señales; fallo de forma puro |
| La lente dominio mira los ejemplos de la spec | **Respaldado con corrección de alcance**: 2/2 lo cazan si la constitution lo prohíbe (E3a), 0/2 si no (E3b). El punto se escribe con criterio propio, no remitiendo a la constitution |
