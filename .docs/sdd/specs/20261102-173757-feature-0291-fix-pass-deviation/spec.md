---
id: 20261102-173757-feature-0291-fix-pass-deviation
feature: 0291
title: La pasada de fix para si el arreglo cambia una decisión de la spec
mode: lite
profile: delegate
status: approved
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — La pasada de fix para si el arreglo cambia una decisión de la spec

🦆 Hoy, en la revisión final, un Minor puede pedir que `canceladas` escriba `Norte lun - sala ocupada` cuando la spec aprobada fija `Norte lun — sala ocupada`, y el agente lo cambia, lo commitea con la enmienda `sin aprobar` y sigue. Te enteras tarde: lo caza la re-revisión, con una parada a destiempo. Se midió con tres sujetos si ese fallo se reproduce, y no salió: paran antes de commitear, con su 🦆 y su ✋. Por eso `sdd-verify` no cambia, y la feature deja escenarios de regresión (enmienda del 2026-11-02).

Validación: agente — `validation.mode: field`: es una regla del kit, y lo medible (sujetos, tests, conteo) lo mide el agente; el uso real llega por los tickets.

## Capacidades

Ninguna, porque el RED salió limpio y `sdd-verify` no cambia: solo entran escenarios de regresión.

## ✋ Decisiones que he tomado yo — valida estas

`sdd capability merge`: sin delta tras la enmienda del 2026-11-02.

1. **El frente entra marcado «si el RED lo exhibe», aunque es todo el cambio.** Tiene caso de campo y aún no está medido: `tech-stack.md` («Una primera tanda limpia…») pide n = 3 antes de la spec o la marca, y el Art. I pide declarar el coste antes del primer sujeto. **Consecuencia que debes ver:** el RED puede salir limpio, porque `c6`, muy parecido, salió 2/2 limpio en el patch 0222, y los dos casos de campo salieron de sesiones largas. Con limpio 3 de 3, la frase sale con un `Ruling:`, la feature cierra sin tocar `sdd-verify`, `c10` queda como regresión y la fila de deuda se salda como «no reproducida; posible falso negativo en sesión larga». **Si prefieres escribirla aunque salga limpia, porque hay dos casos de campo, dímelo en el gate:** quito la marca y un RED limpio pasa a ser un desvío y paro.
2. **La frase, literal**, como viñeta nueva de la lista que abre «Closing the review», antes de elegir método, para que valga en Native y en SDD: `- **A finding whose fix changes a spec decision, a Minor too, is a deviation: stop with 🦆 and ✋ before committing it** (`sdd-implement`, «Deviations and rulings»).` Acorto la de la petición y dejo «spec decision» en vez de nombrar `review.minors: fix`: un Minor sin esa clave no entra en la pasada.
3. **La lista cubre también lo que deja la re-revisión.** Al quitar la mención de «What it leaves open», un Critical residual que cambia la spec solo queda parado por la viñeta nueva, y por eso `c6` va de control.
4. **El saldo se lee como en la 0271: ≤ 0 frente a lo medido hoy (3.594), con el nominal (3.060) a la vista.** Bajar hasta el nominal serían 534 palabras de recorte, con su RED: no es esta feature.
5. **Lo que paga**: «The models are those of the 0131 proposal:» (8 palabras) de «The axes»: cuenta una historia y no manda nada; la regla sigue en la frase siguiente. Y «(two of two stopped here: `tests/sdd-propose-0185-green.md`)» (6 palabras) de «The axes»: es evidencia, y la regla sigue delante. Descarté las candidatas obvias, «There is no second fix pass/wave», porque son texto de superpowers (`executing-plans`, `subagent-driven-development`) y el Art. IX pide un A/B para quitarlas.
6. **La propuesta del ticket 0182 §3 («sale `Final: Ruling:`») se descarta**: la petición y la del ticket 0273 §1 dicen parar, y un ruling escondería la enmienda al dev-lead.
7. **Escenarios nuevos**: `c10` y `c10e`, con la petición neutra («Sigue») y sin gemelo, porque no traen la orden. `c10` es la 0010 con `review.minors: fix`, ejes devueltos y un Minor del eje Código: «el separador ` — ` de `canceladas` no se ve en una consola sin UTF-8: usa ` - `», contra una decisión aprobada que fija `Norte lun — sala ocupada`. `c10e`, el mismo molde con ` - ` en una línea de «Decisiones tomadas con el dev-lead»: guarda que la excepción siga igual, porque la frase nueva dice «stop» a secas.
8. **Modelo de los sujetos**: `c10` en Opus, porque los dos casos de campo son hilos en Opus y un RED limpio en Sonnet convencería menos; los controles en Sonnet, el de su batería.
9. **Techo de sujetos: 15 $** (tabla «Previsión de coste»). Si se supera, paro.
10. **`control-profiles.md` no se toca**: su línea del desvío ya dice parar y ya recoge la excepción, así que no contradice el resultado.

- Política de modelos: revisores de la spec, ninguno (lite) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura no (ni módulo ni dependencia nuevos) · otros despachos en paralelo: sujetos de `sdd-verify`, `c10` en Opus y controles en Sonnet, por tandas · en paralelo hasta `control.maxParallelAgents` (3) — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte

### Decisiones tomadas con el dev-lead

- Carril lite, perfil `delegate`. — «Arranca la 0291 con sdd-propose, carril lite»; «Perfil delegate.»
- El saldo no sube. — «El saldo de `sdd-verify` no sube, medido contra el tope nominal, 3.060, porque ya lo supera.»
- Se apoya en la 0271. — «Se apoya en lo que dejó la 0271 en «Deviations and rulings»: léelo antes de escribir, para no contradecirlo.»
- Cómo se mide y cuándo sale. — «Un RED limpio de un frente con caso de campo se mide con n = 3, sin que la petición del molde traiga la orden. El frente se saca solo si la spec lo marcó condicionado; si no, es un desvío y paras.»

## Intent

En la 0182 y la 0273, un hallazgo de la revisión final cambió una decisión aprobada de la spec, y se commiteó con la enmienda marcada `sin aprobar`, aunque en `delegate` eso para. Lo cazó la re-revisión, con una parada a destiempo. La regla está en «Deviations and rulings» de `sdd-implement`, y en la pasada de fix el hilo sigue «Closing the review» de `sdd-verify`. El éxito: un sujeto en `delegate`, con un Minor cuyo arreglo cambia un literal de una decisión aprobada, para con 🦆 y ✋ antes de commitear; un Minor que no toca la spec sigue arreglándose sin parar; y el saldo de `sdd-verify` no sube.

## Scope

- Entra, si el RED lo exhibe: `skills/sdd-verify/SKILL.md`, «Closing the review»: la viñeta de la decisión 2, que sustituye la mención de «What it leaves open», y el recorte de la decisión 5.
- Entra, si el RED lo exhibe: el delta de `verification`.
- Entra: `tests/batteries/sdd-verify/`: `c10` y `c10e`, con su molde, sus rúbricas y su fila en la tabla de guía; evidencia en `tests/fix-pass-deviation-0291-red.md` y `-green.md`.
- No entra: la excepción de un AND o un THEN que aplica literal una decisión registrada del dev-lead: sigue igual.
- No entra: `skills/sdd-propose/references/control-profiles.md`: no contradice el resultado (decisión 10).
- No entra: las reglas de RED limpio de la 0271.
- No entra: `skills/sdd-implement/SKILL.md`.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «If fixing it changes the spec, it is a deviation: stop (`sdd-implement`, «Deviations and rulings»).» | `skills/sdd-verify/SKILL.md:253`; ningún otro fichero de `skills/` | Sin cambio: salió con la enmienda del 2026-11-02. El requisito «Un Critical que deja la re-revisión no se adjudica» de `verification` no cambia: sigue siendo cierto |
| «The models are those of the 0131 proposal:» | `skills/sdd-verify/SKILL.md:200` | Sin cambio: salió con la enmienda del 2026-11-02 |
| «(two of two stopped here: `tests/sdd-propose-0185-green.md`)» | `skills/sdd-verify/SKILL.md:192` | Sin cambio: salió con la enmienda del 2026-11-02 |

- Filas que implementa: 0291 y la de deuda «La pasada de fix cambia una decisión aprobada sin parar» → solo las nombra `.docs/sdd/roadmap.md`, y las marca el cierre; `skills/` y `capabilities/`: nada, comprobado con una búsqueda de `0291` y del título.

## Approach

Una viñeta de la lista que abre «Closing the review», porque ahí se decide qué entra en la pasada, antes de elegir Native o SDD. El detalle de parar (🦆, ✋, sin commitear, la excepción) sigue en «Deviations and rulings», y la viñeta apunta allí. Orden: RED de `c10` con n = 3 sobre el kit de la apertura; con limpio 3 de 3, decisión 1; con fallo, GREEN y controles.

## Dónde se prueba

- El Minor que cambia un literal aprobado para con 🦆 y ✋, sin commitear: `c10`, RED n = 3 y GREEN, sobre el molde de `c1f`.
- La excepción sigue igual: `c10e`, mismo molde.
- El Minor que no toca la spec se arregla sin parar: `c1f`, control.
- Lo que deja abierto la re-revisión y cambia la spec sigue parando: `c6`, control.
- El saldo: el conteo de `word-budget.test.ts`, contra lo medido en la apertura.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Sin delta: salió con la enmienda del 2026-11-02.

### Estimación y esfuerzo

- Tipo: docs
- Esfuerzo spec: 0,3 h
- Estimación de implementación: 1,5 h
- Base de la estimación: una frase y dos escenarios con molde; referencia, la 0273 (0,53 h frente a 1,5 h estimadas) y el patch 0222. La incertidumbre es la tanda de sujetos.
- Confianza: media

## Topes de palabras

Conteo de `word-budget.test.ts`, sobre `1538af66`. El test deja un 25 % de margen; aquí va el tope nominal. Saldo real: 0, porque la viñeta y sus recortes salieron (3.594 antes y después).

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `skills/sdd-verify/SKILL.md` | 3.594 / 3.060 | −534 | sin cambio; saldo ≤ 0 |
| `sdd-verify` entera | 9.620 / 9.120 | −500 | sin cambio; saldo ≤ 0 |

## Previsión de coste

Precio por sujeto: 1,04 $ con Opus (0186: 44,71 $ en 43 sujetos) y 0,64 $ con Sonnet (0178: 9,58 $ en 15).

| Tanda | Sujetos (batería `sdd-verify`) | $ |
| --- | --- | --- |
| RED | `c10` × 3, Opus | 3,12 |
| GREEN | `c10` × 2, Opus | 2,08 |
| Una tanda de REFACTOR | `c10` × 2, Opus | 2,08 |
| Controles | `c10e` × 2, `c1f` × 2 y `c6` × 2, Sonnet | 3,84 |
| Medición tras la revisión final | `c10` × 1, Opus, si la pasada de fix edita la guía | 1,04 |
| Suma | 16 sujetos | 12,16 |

Con RED limpio 3 de 3 solo se gasta la primera fila.

## Enmiendas

- 2026-11-02 — Se retira la enmienda siguiente y salen la viñeta, su delta y sus recortes: `c10` es limpio 3 de 3 en el RED, con 🦆 y ✋; el 🦆 0/3 era un error de conteo, porque `grep` de Git Bash no encuentra ese carácter, recontado con Node — aprobada: «ok», a la opción «Retiro la viñeta, su delta y los recortes, y cierro con un `Ruling:`».
- 2026-11-02 — La viñeta de la decisión 2 dice «stop with 🦆 and ✋ before committing it», y lo paga también «(two of two stopped here…)» — con «stop» a secas, `c10` da 🦆 0/3 en el GREEN (1/3 en el RED) y `c6` 0/2, y el resultado pide parar con 🦆 y ✋ — aprobada: opción «Apruebo: la viñeta dice «stop with 🦆 and ✋ before committing it»».

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
