---
id: 20261012-220057-feature-0173-form-for-omissions-and-refactor-stop
feature: 0173
title: Art. II — la forma para un elemento omitido y cuándo parar el REFACTOR de una skill
mode: full
profile: delegate
status: approved
created: 2026-10-12
author: agente con el dev-lead
approvers:
  - role: dev-lead
    name: Àngel Delgado
    approved_at: 2026-10-13
---

# Spec — Art. II: la forma para un elemento omitido y cuándo parar el REFACTOR de una skill

🦆 Cuando un humo de skill falla porque el agente se deja un dato (la ruta del worktree, la ruta de la nota), quien arregla la skill hoy añade una frase recordándolo, y si vuelve a fallar, añade otra. Esta feature midió las dos reglas que lo evitarían (una fila del Art. II para pedir un hueco en la plantilla y una regla de parada tras una ronda 0/N) y no entra ninguna: con el Art. II de hoy leído, los sujetos ya escriben la plantilla, también en la segunda ronda, y los que fallan son los que no lo leen. Entra en su lugar una frase en `sdd-implement`: antes de una ronda sobre un humo de una skill que falla, se lee la regla de forma de la constitution y se nombra la clase del fallo.

## Capacidades

- Ninguna, porque docs: las dos reglas son del método de este repo (constitution y `tech-stack.md`), y ninguna capacidad describe cómo se prueban las skills del kit.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: ninguna (sin capacidad nueva, contrato, `MODIFIED`, datos, dependencia ni permiso; constitution, `tech-stack.md`, ADR 0003 y el molde `mold-kit` leídos en esta sesión) · tamaño: ~40 líneas en 6 ficheros, más fixtures
- Mínimo razonable: ninguna — deja sin mirar que el criterio «prosa frente a hueco» de la rúbrica de `o1` y `o2` sea decidible leyendo la salida; lo revisa la revisión final de rama.

1. **No entra (enmienda 2026-10-13)**. Fila nueva del Art. II, literal: «- Elemento omitido (cumple, pero falta una pieza de algo que ya produce) → hueco obligatorio en la plantilla que rellena, no un recordatorio en prosa junto a ella.» — es la tercera fila de la tabla «Match the Form to the Failure» de `writing-skills` de superpowers (presente igual de la 6.3.0 a la 7.0.0); el Art. II tiene las otras tres. Art. IX: trae algo de otro kit, con su aviso.
2. ADR nueva `0014-form-for-omissions-and-refactor-stop.md`, solo con la regla de parada si entra (enmienda 2026-10-13), que amplía la 0003 sin sustituirla: la 0003 sigue `accepted`, y el *Por qué* del Art. II enlaza las dos.
3. Regla de parada en `tech-stack.md`, «Baterías por skill», literal: «**Una ronda de REFACTOR que da 0/N no se repite con la misma forma** (feature 0173): la siguiente cambia de forma por el Art. II —un elemento omitido pide un hueco en la plantilla, no otro recordatorio— o para y propone al dev-lead enmendar el THEN como desvío. En la 0166, dos rondas en prosa sobre `w1` dieron 0/3 y se retiraron (~35 min).» Sin tope numérico de rondas: el tope de coste del Art. I ya para la campaña.
4. «Misma forma» se juzga con las filas del Art. II: prohibición, receta, predicado, hueco en la plantilla o recordatorio en prosa. Reescribir la frase con otras palabras o con más énfasis («always», «never omit», negrita) es la misma forma.
5. Una pieza sale: en `tech-stack.md`, la entrada «El techo de coste lo aplica el lanzador» (~110 palabras) se queda en una frase, porque la cabecera de `tests/headless/run.sh` ya documenta `COST_CAP` y `SUBJECT_CAP` (Principio 3). En la constitution no sale nada: sube su tope (decisión del dev-lead, abajo).
6. Escenarios nuevos en la batería de `sdd-implement`, paso `refactor-form`, sobre `mold-kit` con la skill `guardar-nota`, como el `k2` de la 0166:
   - `o1`: el humo `h1` de la 0020 falla porque el sujeto guarda la nota y responde sin la ruta; el paso 3 de la skill dice en prosa «Tell the user the path you wrote.». Petición: hacer la ronda de REFACTOR y cerrar la task.
   - `o2`: lo mismo, con una ronda en prosa ya hecha («Always tell the user the full path you wrote — never omit it.») y su humo otra vez 0/3. Petición: hacer la siguiente ronda.
7. El molde lleva las reglas del kit en su constitution y su `tech-stack.md`: en el RED, el Art. II vigente (tres filas) y sin regla de parada; en el GREEN, el texto nuevo, copiado literal de la constitution y de `tech-stack.md` del kit. Así el sujeto tiene la regla donde la tendría un agente de este repo.
8. Previsión (Art. I): RED `o1` y `o2`, 2 sujetos Sonnet cada uno; GREEN igual; una tanda de REFACTOR de reserva. Techo: 10 sujetos y 5 $ (`SUBJECT_CAP=10`, `COST_CAP=5`).
9. Lo que no entra de las fuentes: los micro-tests de redacción de `writing-skills` (control sin guía, 5+ repeticiones, varianza) y el `--max-iterations` de skill-creator. Son método de campaña que la 0151 puede traer en su anexo de prueba; aquí solo entra la regla de parada.

### Decisiones tomadas con el dev-lead

- Fila propia en la 3.0.0, independiente; la 0151 la hereda en su anexo de prueba — «Fila propia en la 3.0.0 (Recomendada)» (2026-10-12)
- La 0173 se hace ahora, en vez de esperar al 2.º ticket que proponía el triaje — «La 0173 ahora (Recomendada)» (2026-10-12)
- La causa medida (no leer la regla) entra en la 0173 — «Meterla en la 0173 ahora» (2026-10-13)
- Las dos partes, cada una con su RED; si `o1` sale limpio, la fila del Art. II no entra — «1» (2026-10-12)
- Spec aprobada — «ok, sigue» (2026-10-13)
- El tope de la constitution en `WordBudget.Tests.ps1` sube de 2.200 a 2.230 — «Subir el tope a 2.230 (Recomendada)» (2026-10-12)

## Intent

En la 0166, el humo `w1` falló porque `sdd-worktrees` no decía la ruta del worktree, y el hilo hizo dos rondas de REFACTOR en prosa («Report with … the full path», «Write that line … with the real path»). Las dos dieron 0/3, se retiraron y el THEN acabó enmendado: ~35 min y ~0,7 $ ([ticket de la 0166](../../field-reports/20261012-183835-feature-0166-worktrees-and-parallel-agents.md) §1). El Art. II no tenía una forma para «se deja un dato», y nada decía que repetir la forma de una ronda fallida es repetir el fallo. El éxito: con las reglas delante, el sujeto que arregla una omisión escribe un hueco en la plantilla, y tras una ronda 0/N cambia de forma o para. Fracasaría si el sujeto sigue añadiendo frases, aunque las reglas estén escritas.

## Scope

- Entra: la regla de clasificar el fallo antes de la ronda en `sdd-implement` y su tope; los escenarios `o1` (su RED y su GREEN) y `o2` (control), con sus fixtures (enmiendas 2026-10-13).
- No entra: la fila del Art. II, la subida del tope de la constitution, la regla de parada, la ADR 0014 y el recorte del techo de coste (enmiendas 2026-10-13); cambiar `sdd-worktrees` ni el THEN de `w1`; las skills que los proyectos usan para probar sus skills (es la 0151); los micro-tests de redacción.

## Approach

Cada regla entra solo si su RED falla (Art. I): `o1` para la fila del Art. II, `o2` para la regla de parada. Las dos se miden con el sujeto en el paso de REFACTOR de `sdd-implement`, sobre un molde de kit que lleva las reglas en sus documentos.

## Dónde se prueba

- Forma de la ronda de REFACTOR ante una omisión: batería de `sdd-implement`, escenario `o1`, sujetos headless como `k2`.
- Parada tras una ronda 0/N: batería de `sdd-implement`, escenario `o2`.
- Tope de la constitution: `tests/WordBudget.Tests.ps1`, como los demás topes.

## Términos y ADR

- Términos resueltos: **elemento omitido** — el agente cumple la tarea, pero falta una pieza de lo que produce (un dato de la respuesta, un campo de un fichero); **hueco en la plantilla** — una línea o un bloque literal de la salida con un marcador (`<ruta>`) que el agente rellena, frente a una frase que le pide incluirlo.
- ADR candidatas: la fila del Art. II y la regla de parada — alternativa descartada: seguir repitiendo rondas hasta el tope de coste del Art. I (ADR 0014).

## Delta de comportamiento

Sin delta: ninguna capacidad describe el método de prueba de las skills del kit. Los escenarios, en la batería:

**o1 — La ronda de REFACTOR ante una omisión es un hueco en la plantilla**
- GIVEN `mold-kit` con `guardar-nota`, cuyo paso 3 dice «Tell the user the path you wrote.», y el humo `h1` de la 0020 en rojo: el sujeto guardó `notas/reunion-martes.md` y respondió «Nota guardada.» sin la ruta
- WHEN el hilo hace la ronda de REFACTOR de la Task 1
- THEN el paso 3 de `guardar-nota` lleva la respuesta como plantilla con un hueco que el agente rellena (p. ej. «Reply: `Saved to <path>`»)
- AND no la arregla solo con una frase o con énfasis que pide incluir la ruta

**o2 — Una ronda 0/N no se repite con la misma forma**
- GIVEN lo mismo, con el paso 3 ya reescrito en prosa («Always tell the user the full path you wrote — never omit it.») y su humo `h1-r1` otra vez 0/3
- WHEN el hilo hace la siguiente ronda
- THEN cambia de forma (un hueco en la plantilla) o para antes de editar y propone al dev-lead enmendar el THEN
- AND no escribe otra frase o más énfasis sobre la ruta

## Enmiendas

- 2026-10-13 — Entra una regla en `sdd-implement`, paso 2 del bucle Native, literal: «A failing smoke of text an agent follows (a skill, a prompt): if the constitution has a rule on the form of guidance, read it before the round, name the failure's class by it and write the round in that form; rewording or adding emphasis is the same form.»; el tope de `sdd-implement` sube de 5.500 a 5.560 palabras (y su total, de 9.100 a 9.160) y la previsión a 14 sujetos — el RED de `o1` midió otra causa: los 2 sujetos que no abrieron la constitution escribieron prosa; el puntero de `CLAUDE.md` no bastó, y la skill invocada es lo único que leen siempre — aprobada: «Meterla en la 0173 ahora» y «Apruebo (Recomendada)» (dev-lead, 2026-10-13) · Task 3
- 2026-10-13 — La regla de parada no entra, ni la ADR 0014, ni el recorte de la entrada del techo de coste, que solo compensaba sus palabras; `o2` queda como control — RED `o2` 2/2 limpio: los dos leyeron el Art. II vigente, clasificaron el fallo como «de forma» y cambiaron la prosa de la ronda 1 por una plantilla — aprobada: Approach de la spec («cada regla entra solo si su RED falla (Art. I)») · Task 2
- 2026-10-13 — La fila del Art. II no entra, ni la subida del tope de la constitution, ni esa parte de la ADR 0014; `o1` queda como control — RED `o1` en 4 sujetos: los 2 que leyeron el Art. II vigente escribieron una plantilla con hueco («fallo de forma → receta»), los 2 que no lo leyeron escribieron prosa; el fallo es no leer la regla, no que le falte la fila — aprobada: «1» (dev-lead, 2026-10-12: si `o1` sale limpio, la fila no entra) · Task 1

## Aprobaciones

| Rol | Nombre | Fecha | Estado |
| --- | --- | --- | --- |
| dev-lead | Àngel Delgado | 2026-10-13 | aprobada: «ok, sigue» |
