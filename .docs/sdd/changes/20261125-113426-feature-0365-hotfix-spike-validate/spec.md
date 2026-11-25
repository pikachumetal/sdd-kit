---
id: 20261125-113426-feature-0365-hotfix-spike-validate
feature: 0365
title: El hotfix y el spike también validan en sdd-validate
mode: full
status: approved
created: 2026-11-25
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-25
---

# Spec — El hotfix y el spike también validan en sdd-validate

🦆 Hoy, si validas un hotfix o un spike y algo falla, el cierre no tiene dónde mandarlo a arreglar. Con este cambio los dos pasan por la misma validación que el resto, antes del cierre, y lo que falla vuelve a una task. En un spike con «memoria < 50 MB» sin medir, esa fila vuelve a una task que la mide; «< 200 ms» medido en 340 ms no vuelve, porque es un resultado. El cierre solo comprueba que la validación está apuntada.

Validación: agente — el cambio solo toca skills y documentos: lo que se observa es la conducta de los sujetos de la batería, que mide el agente; el uso real llega por los tickets de campo (`validation.mode: field`).

## Capacidades

- Modificadas: `validation` — el hotfix y el spike pasan por `sdd-validate`, cada uno con sus pasos, y la vuelta del spike lleva «Evidencia» en vez de test
- Modificadas: `archive` — el paso 1 deja de validar el hotfix y el spike: solo comprueba la línea registrada; el aviso de la validación que falta nombra `sdd-validate`

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: dos revisores — señales: MODIFIED (el requisito «El cierre arranca con la validación registrada y no edita código» de `archive`) · tamaño: ~70 líneas en 9 ficheros
- Dominio (opus): si el spike de «Un spike valida su evidencia en `sdd-validate`» distingue bien fallo (O2 sin evidencia) de resultado (O1 no cumple), y si el hotfix como patch deja algo de lo suyo (pre-check 5, rama estable) sin dueño (señal: MODIFIED, reglas de flujo)
- Técnica (sonnet): si queda alguna rama de validación del hotfix o del spike fuera de `sdd-validate` en `skills/` o en la ADR 0043, y si los topes y los moldes `salas-hotfix` y `reservas-spike` alcanzan para `vf8` y `vf9` (señal: MODIFIED)
- Mínimo razonable: un revisor sonnet con los siete puntos — deja la lente de dominio en Sonnet: el hueco entre fallo y resultado del spike lo mira un modelo menos fino
```

1. El hotfix recorre `sdd-validate` como un patch: gate, guion recorrido por el agente y validación del dev-lead, sin revisión final — es un patch en rama `hotfix/*` (`patch-flow.md`, entrada), y el dev-lead dijo no saber qué toca: «no se que se hace de hotfix o spike». Lo suyo del cierre (pre-check 5 y fusión a la rama estable con etiqueta) no se mueve.
2. El spike corre el gate solo si `git diff --name-only <merge-base>...HEAD` da un fichero fuera de su carpeta de `changes/` — un spike no lleva código de producción, y sus scripts y salidas en bruto viven en su carpeta (`spike.md`, «Un spike cierra sin código de producción»). Cuenta solo lo commiteado: los borradores sin commitear de `capabilities/` no disparan el gate.
3. En un spike, el paso 2 de `sdd-validate` deja de ser el guion: el agente contrasta cada fila de objetivo de `research.md` con su evidencia — es lo que el dev-lead llamó «tu validación de la evidencia (la tabla de medidas)», y va antes de la revisión final, como el guion.
4. En un spike, falla solo una fila que no se sostiene: un `no medido` que el agente puede medir, una tabla de aguante de menos de 10 repeticiones o sin la peor carga (`spike.md`), o una recomendación que se apoya en una fila sin medir. `no cumple` y `no medido con una persona` son resultados y no vuelven — `research-template.md` los da por estados finales, y una fila que el agente no puede medir no tiene arreglo en una task.
5. El spike registra la validación como los demás, con la línea de su modo en el borrador del walkthrough, y el smoke con una fila por objetivo — lo dice ya «The smoke, in every mode» de `validation-modes.md` («spike: per objective»); no hace falta línea nueva.
6. Además de `skills/sdd-archive/SKILL.md`, quito la excepción de `skills/sdd-implement/references/patch-flow.md` paso 7 y de `skills/sdd-archive/references/closing-suite.md` línea 7 — repiten la misma rama de validación en el cierre; sin quitarlas, el criterio de hecho se cumple y la regla sigue viva. La búsqueda amplia (`git grep -niE "hotfix.{0,60}spike|spike.{0,60}hotfix|no pasan por .sdd-validate|don.t go through .sdd-validate|which validates it"` en `skills/`, `includes/`, `.docs/workflow/`, `PRODUCT.md` y `.docs/sdd/`) da solo los hits de la tabla.
7. `skills/sdd-implement/SKILL.md` no cambia: «After the last task» (`skills/sdd-implement/SKILL.md:77`) ya invoca `sdd-validate` para todo plan, spike incluido; lo que manda el hotfix al cierre es el paso 7 de `patch-flow.md` (decisión 6).
8. Enfoque: A, frente a B y C (ver Approach): la regla del spike va en «Order» de `sdd-validate`, junto a la del patch, y su fallo en «A failure goes back to `sdd-implement`»; en `validation-modes.md` solo se quita la excepción.
9. Topes: `sdd-validate` sube de 655 a 765 palabras en `SKILL.md` y de 1735 a 1847 en total, en `cli/test/kit/word-budget.test.ts` — medido sobre el texto redactado: +95 en `SKILL.md` y −18 en `validation-modes.md`. La regla 6 de `CLAUDE.md` (saldo igual o a la baja) no aplica: la 0365 sale de una decisión del dev-lead, no de un ticket.
10. Dos escenarios nuevos en la batería, `vf8` (hotfix) y `vf9` (spike), con dos moldes nuevos: `salas-hotfix` (`salas-patch` con el fix en `hotfix/0008-cancel-missing` salida de `main`, sin la validación hecha) y `reservas-spike` (el spike 0030 con sus tasks commiteadas, solo en su carpeta, y `research.md` con O1 `no cumple tal como se definió`, O2 `no medido` sin fichero de evidencia y O3 `no medido con una persona`). `vf8` entra por `sdd-implement` («retoma el hotfix 0008: el fix está commiteado») para que el paso 7 de `patch-flow.md` sea lo que se mide.
11. Una ADR nueva sustituye a la 0043 — la 0043 dice «Un hotfix y un spike no pasan por `sdd-validate`: validan en el paso 1 de `sdd-archive`» y una ADR no se edita; la nueva copia su decisión sin esa frase, la escribe el cierre y deja la 0043 con `status: superseded by <nueva>`, como hizo la 0043 con la 0040, con `sdd decision check` en verde.
12. El aviso de `archive` «Falta la validación de la `<id>`: el trabajo vuelve a `sdd-implement`.» pasa a «…vuelve a `sdd-validate`.» — contradice el THEN del mismo requisito y la skill (paso 1 de `sdd-archive`), y este cambio lo extiende al hotfix y al spike.
- No probado en batería: que `sdd-archive` devuelva a `sdd-validate` un hotfix o un spike sin línea (el paso 1 ya no distingue carril: lo cubre el `git grep` del criterio de hecho) y la rama del spike que toca un fichero fuera de su carpeta (el molde solo toca la suya).
- Delta probado en una copia de `capabilities/` con `sdd capability merge`, tras los hallazgos, exit 0: dos `sustituido` y dos `añadido` en `validation.md`, «regla «Límites» sustituida», `archive.md` «sustituido «El cierre arranca con la validación registrada y no edita código»» y «regla «Avisos» sustituida».
- Política de modelos (solo en `delegate`): revisores de la spec, dominio `opus` y técnica `sonnet`, `sdd-kit:effort-medium` (confirmado: «1») · ejes de la revisión final: Spec opus+high, Código sonnet+high · sujetos de la batería `sonnet`, por tandas · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Rechazado** — Crítico (técnica 1): el criterio `git grep` de una frase deja fuera otras formulaciones → la búsqueda amplia que propone, corrida en `skills/`, `includes/`, `.docs/workflow/`, `PRODUCT.md` y `.docs/sdd/`, da exactamente los seis hits de la tabla (decisión 6); el criterio sigue siendo el del dev-lead.
- **Aceptado** — `ADDED` que cambian «`sdd-validate` valida antes de pasar al cierre» y «Un fallo de la validación vuelve a una task…» sin declararlo (dominio 1 y 2) → los dos pasan a `MODIFIED` con el hotfix y el spike.
- **Aceptado** — `no medido con una persona` y lo inmedible no tienen salida del bucle; falta la evidencia que no se sostiene; la recomendación mal apoyada no se arregla midiendo (dominio 3 y 4) → decisión 4 y su `AND` en el delta.
- **Aceptado en parte** — `spike` en «Capacidades» (dominio 3) → no: `spike.md` no cambia; lo que cambia es cómo valida, que vive en `validation`.
- **Aceptado** — sin línea ni fichero de registro del spike (dominio 5, técnica 2) → decisión 5 y su `AND`.
- **Rechazado** — el gate del hotfix filtra contra `develop` y no contra la rama estable (dominio 6) → ya pasaba igual en el paso 1 de `sdd-archive`, que tampoco lo decía; no lo trae este cambio y va al ticket de cierre.
- **Aceptado** — Reglas de la capacidad sin declarar y aviso de `archive` que contradice su THEN (dominio 7) → «Reglas de la capacidad» de `validation` (Límites) y de `archive` (Avisos), decisión 12.
- **Aceptado** — «los cinco carriles» incluye config, que no pasa por `sdd-validate` (dominio 8) → Intent y ADR dicen «feature, lite, patch (hotfix incluido) y spike».
- **Aceptado** — orden de los pasos del spike y qué revisa el eje Spec (dominio 9) → decisión 3: el contraste de filas es el paso 2, antes del eje Spec, que lee `research.md` (ya lo recibe, `sdd-verify` «The axes»).
- **Aceptado** — el escenario de `archive` es de una feature y el fixture usa «sin evidencia» (dominio 10, técnica 3) → el molde usa `no medido`; lo no probado, declarado en ✋.
- **Aceptado** — `vf9` no ejerce lo que dice el delta (técnica 4) → O3 `no medido con una persona` en el molde; la rama «fuera de su carpeta», declarada no probada.
- **Aceptado** — filas de rúbrica sin definir ni puntuadas en `tools.txt` (técnica 5) → «Dónde se prueba» lleva las filas `VF8` y `VF9`.
- **Aceptado** — `vf8` puede pasar en RED sin cambio (técnica 6) → `vf8` entra por `sdd-implement`: en RED, `patch-flow.md` paso 7 lo manda a `sdd-archive` (decisión 10).
- **Aceptado en parte** — topes sin medir y saldo positivo (técnica 7) → medidos sobre el texto redactado y `word-budget.test.ts` al Scope; la regla de saldo no aplica (decisión 9).
- **Aceptado** — decisiones del cuerpo fuera de ✋ y la 4 sin cita (técnica 8) → decisiones 7 y 8.
- **Aceptado** — cómo queda la 0043 `superseded` (técnica 9) → decisión 11.
- **Aceptado** — «fuera de su carpeta» sin base ni comando (técnica 10) → decisión 2.

### Decisiones tomadas con el dev-lead

- El hotfix y el spike validan antes de `sdd-archive`, como feature, lite y patch — «vale pues hay que arreglarlo joder» (2026-11-25); «la validacione s parte de la implementracion» (2026-11-24)
- `sdd-archive` solo cierra: toca documentación, no código — «en sdd-archive, solo se tiene que cerrar tocar documentacion no codigo como hiicmos en la tarea anterior» (2026-11-25)
- El spike sigue la propuesta del prompt (el gate solo si toca código, sin sonda de guion, revisión final solo con el eje Spec, el agente valida la tabla de medidas), y un fallo es evidencia que falta o no se sostiene, nunca un umbral no cumplido — «si eso es 1 uno» (2026-11-25)
- Al validar un spike se mide solo lo que falta: una fila sin evidencia vuelve a una task que lo mide; sin medida de control repetida — «1» (2026-11-25), tras «y si tienes qu emedir algo midelo?»
- Dos revisores de la spec en paralelo, dominio en Opus y técnica en Sonnet — «1» (2026-11-25)

## Intent

Hoy la 0362 sacó la validación de `sdd-archive` a `sdd-validate` para feature, lite y patch, pero el hotfix y el spike siguen validando en el paso 1 de `sdd-archive`, sin bucle de vuelta: un fallo que aparece al validarlos no tiene task ni test, y el cierre queda con una rama que valida. Se quiere que feature, lite, patch (hotfix incluido) y spike validen en `sdd-validate` y que `sdd-archive` solo compruebe la línea registrada. Éxito: `git grep -n "Hotfix only:\` and a spike" skills/` no devuelve nada, y `vf8` y `vf9` pasan 2/2. Fracasa aunque funcione si el spike vuelve a `sdd-implement` por un umbral no cumplido o por una fila que el agente no puede medir, o si el hotfix arrastra una revisión final que un patch no tiene.

## Scope

- Entra: el recorrido del hotfix y del spike en `skills/sdd-validate/SKILL.md` y la excepción de `references/validation-modes.md`; quitar la rama de validación del paso 1 de `skills/sdd-archive/SKILL.md`, de `references/closing-suite.md` y del paso 7 de `skills/sdd-implement/references/patch-flow.md`; los topes de `sdd-validate` en `cli/test/kit/word-budget.test.ts`; las capacidades `validation` y `archive`; `vf8` y `vf9` en `tests/batteries/sdd-validate/` con sus moldes; la ADR que sustituye a la 0043 (decisión 11).
- No entra: el pre-check 5 de `sdd-archive` (la pregunta de los patches del hotfix), que es de la fusión a la rama estable; la receta del hotfix en `merge-recipe.md`; `skills/sdd-implement/SKILL.md` (decisión 7); la base del gate del hotfix (hallazgo de dominio 6, rechazado); config, que valida en su propio carril.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| El hotfix y el spike validan en el paso 1 de `sdd-archive` | `skills/sdd-archive/SKILL.md:27` («`Hotfix only:` and a spike… validate here») | Scope: se quita la frase |
| Ídem | `skills/sdd-validate/references/validation-modes.md:3` | Scope: queda «Step 4 of `sdd-validate`.» |
| El hotfix va directo a `sdd-archive`, que lo valida | `skills/sdd-implement/references/patch-flow.md:24` | decisión 6 |
| El hotfix y el spike corren el gate en el paso 1 de `sdd-archive` | `skills/sdd-archive/references/closing-suite.md:7` | decisión 6 |
| «A patch has no final review: 1, 2, 4, 5.» | `skills/sdd-validate/SKILL.md`, «Order» | decisión 8: la sustituye la línea del patch, el hotfix y el spike |
| Requisito: el hotfix y el spike validan en el paso 1 | `.docs/sdd/capabilities/archive.md:165` | delta, `MODIFIED` con `REMOVED` de la línea |
| Aviso «Falta la validación de la `<id>`: el trabajo vuelve a `sdd-implement`.» | `.docs/sdd/capabilities/archive.md:180` | delta, Reglas de `archive` (Avisos); decisión 12 |
| «Un hotfix y un spike no pasan por `sdd-validate`: validan en el paso 1 de `sdd-archive`» | `.docs/sdd/decisions/0043-validation-in-implementation.md:32` | decisión 11: ADR nueva que la sustituye |
| Decisión 17 de la 0362 | `.docs/sdd/changes/20261124-155700-feature-0362-validation-in-implement/spec.md:58` | se queda: artefacto cerrado, esta spec la sustituye |

- Filas que implementa: 0365 → `ROADMAP.md:11`; la cierra `sdd-archive`.

## Approach

- A: el hotfix y el spike recorren `sdd-validate`, con una línea en «Order» como la del patch y la vuelta del spike en «A failure goes back» — +95 palabras en `SKILL.md` de `sdd-validate` (sube su tope) y quita ~50 entre `validation-modes.md`, `sdd-archive`, `patch-flow.md` y `closing-suite.md`.
- B: una sección «Hotfix y spike» en `validation-modes.md` y una línea en «Order» que la nombre — `SKILL.md` crece menos, pero los pasos 1 a 3 del spike quedan en una referencia que se lee en el paso 4, después de haberlos corrido.
- C: dejar el spike en `sdd-archive` y mover solo el hotfix — contradice la decisión del dev-lead.
- Elegido: A — la regla vive en el paso donde se decide; B la pone después.

Cómo, en `skills/sdd-validate/SKILL.md`:

- «Order», en lugar de «A patch has no final review: 1, 2, 4, 5.»: «A patch, and a hotfix, has no final review: 1, 2, 4, 5. A spike: 1 only if a committed file outside its `changes/` folder changed since the `merge-base`; in 2, you check each objective's row of `research.md` against its evidence instead of a script; 3 with the Spec axis only.»
- «A failure goes back», al final: «In a spike, its task carries «Evidencia» instead of a test, and only a row that doesn't hold fails: a `no medido` you can measure, an endurance table under 10 runs or without the worst load, a recommendation resting on an unmeasured row; `no cumple` and `no medido con una persona` are results.»

## Dónde se prueba

- El hotfix valida en `sdd-validate` como un patch: `vf8` de la batería de `sdd-validate`, molde `salas-hotfix`, entrando por `sdd-implement`. Rúbrica `VF8`, puntuada en `tools.txt`: falla si invoca `sdd-archive` antes de escribir la línea de validación en `patch.md` §4, si no corre el gate, o si hay una llamada a `Agent` de revisión final o de eje.
- El spike valida su evidencia: `vf9`, molde `reservas-spike`, como `vf1`. Rúbrica `VF9`, puntuada en `tools.txt` y en el diff de la rama: falla si corre el gate, si hay una llamada a `Agent` con un eje que no es Spec, si invoca `sdd-archive` con O2 sin medir, si abre una task por O1 o por O3, o si la task de O2 lleva «Tests RED» en vez de «Evidencia».
- El cierre no valida el hotfix ni el spike: el criterio `git grep`; la vuelta de `sdd-archive` con un hotfix o un spike sin línea, no probada en batería (✋).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: feature, lite, patch (hotfix incluido) y spike validan en `sdd-validate`, y el cierre no valida ninguno — alternativa descartada: el hotfix y el spike validan en el paso 1 de `sdd-archive` (la última frase de la decisión de la ADR 0043). La nueva sustituye a la 0043 (decisión 11)

## Delta de comportamiento

### Capacidad: `validation`

#### MODIFIED — `sdd-validate` valida antes de pasar al cierre

- GIVEN la 0012 en `validation.mode: manual`, con sus tres tasks acabadas y commiteadas
- WHEN `sdd-implement` acaba la Task 3 e invoca `sdd-validate`
- THEN corre el gate de cierre una vez, después recorre el guion de pruebas entero tal como lo recorrerá el dev-lead, después despacha la revisión final sobre lo ya validado y por último presenta el mensaje de validación
- AND no invoca `sdd-archive` hasta que el dev-lead valida; con `validation.mode: field` o `Validación: agente` no para, y lo invoca cuando ha registrado su verificación
- AND con la validación diferida (`Diferir: lo pruebo en la primera exportación, a cargo del dev-lead`) o en `unattended`, registra `Validación diferida:` con su disparador y pasa a `sdd-archive`; si el dev-lead no responde, la feature queda en espera en `sdd-validate` con el smoke documentado
- AND un paso del guion que falla al recorrerlo, `cancelar Norte lun → «cancelada lun»` que, con la reserva del lunes creada, devuelve «no hay reserva lun», se arregla en una task con su test, antes de la revisión final
- AND el kit fija ese orden y que el agente recorra el guion; con qué herramienta lo recorre lo declara el proyecto, y la skill no nombra ninguna
- AND la validación se registra en el borrador del walkthrough (en un patch, §4 de `patch.md`) con una de `Validado:`, `Validación diferida:`, `Validación en campo:` o `Validación por el agente:`
- AND un patch o un hotfix recorren el mismo orden sin revisión final, y un spike lo recorre como dice «Un spike valida su evidencia en `sdd-validate`»

#### MODIFIED — Un fallo de la validación vuelve a una task y la vuelta corre solo lo que toca el arreglo

- GIVEN la 0012 con el gate en verde en `a1b2c3d`, la revisión final hecha y el dev-lead que responde «el paso 3 falla: `cancelar Norte lun` dice «cancelada lun» y me quita también la del martes»
- WHEN `sdd-validate` lo devuelve a `sdd-implement` y el agente lo arregla
- THEN el arreglo es una task con su test, que falla antes y pasa después
- AND corre el test nuevo y los que fallaron, el gate con `--base a1b2c3d`, los pasos del guion que toca el arreglo y, al ser posterior a la revisión final, la revisión de su diff
- AND no corre el gate entero, el guion entero ni la revisión final entera
- AND si el arreglo toca un fichero de «Sin filtro», corre el gate sin filtro
- AND lo mismo con un fallo del agente al recorrer el guion; un fallo de la revisión final sigue «La revisión se cierra una vez» (una sola pasada de fix) y después corre el gate con `--base` y los pasos del guion que toca
- AND la revisión de su diff la hace un revisor `sdd-kit:effort-high` + `sonnet`, una sola vez, y un hallazgo suyo que queda abierto va a ✋ como `sin revisar: <sha>`
- AND una vuelta anterior a la revisión final (un fallo del gate o del guion del agente) no lleva revisión propia: la cubre la revisión final, que sale después
- AND tras la vuelta la validación sigue desde el paso que falló, y no pasa a `sdd-archive` hasta que el dev-lead valida; un cambio que el dev-lead pide después de validar sigue «Lo cambiado tras la validación se separa de lo validado» y no repite la validación
- AND en un spike, la task de la vuelta lleva «Evidencia» en vez de test, corre el gate solo si toca un fichero fuera de su carpeta de `changes/`, y en lugar de los pasos del guion vuelve a contrastar las filas que toca

#### ADDED — Un hotfix valida en `sdd-validate` como un patch

- GIVEN el patch 0008 con el fix commiteado en `hotfix/0008-cancel-missing`, salida de `main`, y `validation.mode: field`
- WHEN el agente retoma el hotfix con `sdd-implement`
- THEN invoca `sdd-validate`, que corre el gate de cierre, recorre el guion y registra `Validación en campo:` en `patch.md` §4, y solo después invoca `sdd-archive`
- AND no despacha revisión final ni ningún eje
- AND un paso del guion que falla vuelve a `sdd-implement` como una task con su test, como en un patch
- AND la pregunta del pre-check 5 y la fusión a `main` con etiqueta siguen en `sdd-archive`

#### ADDED — Un spike valida su evidencia en `sdd-validate`

- GIVEN el spike 0030 con `research.md`: O1 «`libres` con 1.000 reservas < 200 ms» medido en 340 ms (`no cumple tal como se definió`), O2 «memoria < 50 MB» `no medido`, sin fichero de evidencia, y O3 «un recepcionista encuentra la sala libre en < 10 s» `no medido con una persona`; la rama solo toca su carpeta de `changes/` desde el `merge-base`
- WHEN `sdd-implement` acaba la última task e invoca `sdd-validate`
- THEN no corre el gate, no recorre guion: contrasta cada fila de objetivo con su evidencia
- AND devuelve O2 a `sdd-implement` como una task con «Evidencia» que lo mide; O1 y O3 no vuelven, porque son resultados
- AND también vuelve una tabla de aguante de menos de 10 repeticiones o sin la peor carga, y una recomendación que se apoya en una fila sin medir
- AND con las filas sostenidas, despacha la revisión final solo con el eje Spec, que lee `research.md`
- AND registra la línea de su modo en el borrador del walkthrough, con una fila por objetivo en el smoke, y solo entonces invoca `sdd-archive`
- AND si `git diff --name-only <merge-base>...HEAD` da un fichero fuera de su carpeta de `changes/`, corre el gate

#### Reglas de la capacidad — validation

- **Límites**: tope de palabras de `sdd-validate`, el de `cli/test/kit/word-budget.test.ts`; el gate de cierre corre una vez al acabar las tasks, y en un spike solo si la rama toca un fichero fuera de su carpeta de `changes/`; cada vuelta corre solo lo que toca el arreglo y no hay tope de vueltas; una vuelta posterior a la revisión final lleva una sola revisión de su diff

### Capacidad: `archive`

#### MODIFIED — El cierre arranca con la validación registrada y no edita código

- GIVEN la 0010 con las tasks acabadas y la revisión final limpia, y sin ninguna línea de validación en el borrador del walkthrough
- WHEN se invoca `sdd-archive`
- THEN no valida: no presenta el guion, no corre el gate de la validación y dice «falta la validación de la 0010»; devuelve el trabajo a `sdd-validate` sin escribir nada
- AND con `Validado: 2026-11-24 · «probé reservar y cancelar y funciona»` en el borrador, sigue por los pre-checks, los registros, el commit de cierre, el merge de sincronización y el merge
- AND con `Validación en campo:` o `Validación por el agente:` registrada, sigue igual, sin presentar guion
- AND ningún paso del cierre arregla código: un rojo del gate tras el merge de sincronización que no viene de la base devuelve el trabajo a `sdd-implement`, y su arreglo es una task con su test
- AND borrar los tests de feature de «Camino crítico» y juntar el commit de cierre siguen en el cierre
- REMOVED AND un hotfix o un spike, que no pasan por `sdd-validate`, validan en el paso 1 como hoy, sin devolverse
- AND un hotfix o un spike sin línea de validación vuelven a `sdd-validate` igual que una feature

#### Reglas de la capacidad — archive

- **Avisos**: «Hay cambios sin commitear: `<ficheros>`. ¿Los commiteo en la rama, los descarto o paro?» · «Abiertas a la vez: `<rama>` (`<ruta>`). La que fusione segunda integra la base y repite sus gates.» · «¿Alguno de estos patches pide algo al proyecto (un fichero, una clave, un paso a mano)?» · el bloque del rojo (comando, código de salida, ruta del log, últimas 20 líneas, línea `base:`, «`<merge.into>` sin tocar en `<hash>`») · «`base: en rojo: el mismo comando también falla sin la rama`» (contraste a mano) · «Para acabar la `<madre>` falta: `<id>` — `<título de la fila>`[, …]. Recomiendo `<id>`, la primera del roadmap sin dependencias abiertas; su prompt lo da `sdd-roadmap`: «dame el prompt de la `<id>`».» · «Ninguna se puede arrancar todavía: `<id>` espera a `<ids>`.» · «Para acabar la propuesta `<N>` falta: …» · «La `<madre>` ya no tiene piezas abiertas: su fila se puede cerrar.» · «`<documento>` no existía: creado desde la plantilla» · `ADR: <candidata> → decisions/NNNN-<slug>.md` · `no ensayado: <motivo>` · `Conflicto de la base resuelto por el agente: <fichero> — <qué juntó de cada lado>` · «¿Pegas en `critical-path.md` la fila `<fila>`? Si no, el cierre borra `<test>`.» · «La base trae `<cuántos>` tests fuera de la lista (`ya-en-base:`): `<test>`[, …]. Recomiendo un patch que los borre; decide el dev-lead.» · «`Camino crítico` declarado sin `critical-path.md`: no borro nada.» · «Falta la validación de la `<id>`: el trabajo vuelve a `sdd-validate`.»

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-validate` `SKILL.md` | 650 / 655 | 5 | 650 + 95 (`node` con `split(/\s+/)` sobre el texto de Approach, menos la línea que sustituye) + 20 = 765 |
| `sdd-validate` total | 1734 / 1735 | 1 | 1734 + 95 − 18 (`validation-modes.md:3`, `wc -w` 22 → 4) + 36 = 1847 |
| `sdd-archive` `SKILL.md` y total | 2672 / 2729 · 8086 / 8220 | 57 · 134 | sin cambio (baja ~30) |
| `sdd-implement` total | 6520 / 6620 | 100 | sin cambio (baja ~8) |

Medido con el conteo de `cli/test/kit/word-budget.test.ts` (`split(/\s+/)`) sobre `dist/skills/` de la base.

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `vf8 vf9`, `N=2` (sin moldes aún: estimado con `SCENARIOS="vf5 vf1" N=2` → `suma: 4 sujetos · coste previsto: 4.24 $`) | 4.24 |
| GREEN | ídem | 4.24 |
| Una tanda de REFACTOR | ídem | 4.24 |
| Controles | `SCENARIOS="vf5 vf1" N=1` → la mitad de `suma: 4 sujetos · coste previsto: 4.24 $` | 2.12 |
| Medición tras la revisión final | 0: la revisión no toca las skills si sale limpia; si las toca, repite GREEN | 0 |
| Suma | 14 sujetos | 14.84 |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-25 | aprobada (opción «Apruebo») |
