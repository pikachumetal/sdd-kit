---
id: 20261125-155223-feature-0367-validate-no-stops-in-delegate
feature: 0367
title: sdd-validate en delegate no para antes de volver a sdd-implement ni antes de sdd-archive
mode: full
status: approved
created: 2026-11-25
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-25
---

# Spec — `sdd-validate` en `delegate` no para antes de volver a `sdd-implement` ni antes de `sdd-archive`

🦆 Hoy, en `delegate` y con la validación en campo, el agente valida, registra `Validación en campo: …` y se queda esperando: «No he invocado `sdd-archive`. Cierra con un merge a `develop`, que es una decisión tuya». Y si el guion falla, pregunta «¿Arranco la Task 3?» antes de arreglarlo. Con esta feature, el paso de `sdd-validate` donde se decide cada cosa dice que no se pregunta: el agente vuelve a `sdd-implement` con el arreglo y, con la validación registrada, invoca `sdd-archive`, que fusiona en `develop` con el bloque `merge` del proyecto. Un escenario nuevo, `vf10`, falla si el agente para en cualquiera de los dos sitios.

Validación: agente — el cambio solo toca una skill, su batería y documentos: lo que se observa es la conducta de los sujetos, que mide el agente; el uso real llega por los tickets de campo (`validation.mode: field`).

## Capacidades

- Modificadas: `validation` — la vuelta a `sdd-implement` no se pregunta en ningún modo, y con la validación registrada en `field` o por el agente el paso a `sdd-archive` y su merge a `merge.into` tampoco

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor con los siete puntos — señales: MODIFIED (dos requisitos de `validation`, tras la review) · tamaño: ~30 líneas en 5 ficheros
- Dominio y técnica (opus, toca reglas de flujo: qué para en `delegate`): si el delta choca con «AND tras la vuelta la validación sigue… y no pasa a `sdd-archive` hasta que el dev-lead valida» del requisito vivo de la vuelta, y si la rúbrica de `vf10` (decisión 2) pasa sin la conducta
- Mínimo razonable: sin revisor — deja sin mirar si la rúbrica de `vf10` distingue la parada de un fallo del molde, que es lo que hizo reabrir `vf9` cuatro veces en la 0365
```

1. El escenario nuevo es `vf10`, con el molde `reservas-final-bug-campo`: el de `vf3` (`reservas-final-bug`: la 0010 con las dos tasks commiteadas, la revisión final por hacer y el paso `libres` del plan que enseña el fallo) sin `manualValidation()`, es decir, con `validation.mode: field`, perfil `delegate` y el bloque `merge` completo (`into: develop`, sin push) del molde `reservas`. Un solo escenario mide las dos paradas: el guion falla, el agente vuelve a `sdd-implement`, registra y debe acabar fusionando en `develop` — por qué: es el único camino que pasa por los dos sitios, y el molde ya existe y lo usa `vf3` sin defectos conocidos.
2. Fila de rúbrica «VF10 Sin paradas en `delegate`», sobre `vf10`, que mide la acción y no la forma de la frase (una afirmación como «Cierra con un merge, que es una decisión tuya» también es una parada): falla si el sujeto acaba sin (a) el `git commit` (o `sdd task done`) de la task del arreglo en `tools.txt`, (b) `>>> Skill: sdd-kit:sdd-archive` en `tools.txt` después de escribir `Validación en campo:` en el borrador del walkthrough, o (c) el `sdd merge` del cierre en `tools.txt`; un `sdd merge` que se intenta y que el entorno rechaza, con su error literal en `tools.txt`, pasa (c). Sobre `vf2` y `vf3` (controles, `manual`) solo cuenta (a). El único final sin la acción que no cuenta como parada es el que cita un fichero o un comando que falta en el molde, con su ruta o su error literal: se arregla el molde y se repite la tanda — por qué: en la 0365, seis de ocho paradas de `vf9` vinieron de defectos del molde, y la excepción a ojo dejaría pasar la parada de la regla. La rúbrica depende del marcador `>>> Skill:` que escribe el sujeto de `sdd-archive` en `tools.txt`.
3. `vf10` corre con `n = 2` y umbral 2/2, modelo `sonnet`, como `vf2` y `vf3` — por qué: es el umbral de los escenarios de la 0362 y el que pide el criterio de hecho.
4. La frase «without asking» de «A failure goes back to `sdd-implement`» se quita y su sitio lo ocupa la regla nueva; la de «Order» paso 3 (la revisión final) se queda — por qué: la del paso 3 arregló las paradas de la revisión en la 0362 (`tests/validation-in-implement-green.md` §«REFACTOR») y ningún ticket dice que falle; la del fallo no funcionó (`vf9-2` de la Task 4 de la 0365).
5. Controles con `n = 1`: `vf2` y `vf3`, que pasan por el párrafo que se edita, en `manual`; y `v1a` (molde `reservas-decision`, `manual`, `delegate`), que mide que la decisión que la revisión final deja al dev-lead se sigue preguntando sola, antes de la validación; la edición no toca ese párrafo, y `v1a` vigila que la regla nueva no lo absorba — por qué: el Art. I pide el tramo de la batería que toca la edición, y el Intent dice que la feature fracasa si el agente deja de parar donde toca; `vf9` va aparte con `n = 2` porque es el criterio de hecho.
6. El molde nuevo se declara en `tests/batteries/sdd-archive/subject.mjs`, donde viven los de `sdd-validate`; el `**Toca:**` de la fila 0367 en `ROADMAP.md` gana ese fichero y pierde `control-profiles.md`, que queda fuera por la decisión del dev-lead — por qué: el `subject.mjs` de `sdd-validate` importa el de `sdd-archive`.
7. La rúbrica de `vf9` no se endurece para fallar sin `sdd-archive` — por qué: el criterio de hecho solo pide que siga en verde, y `vf10` ya mide ese paso con un molde sin las dudas de la spec del spike que pararon a `vf9`.
8. Una tanda repetida por un defecto del molde entra en la previsión (una, `n = 2`); una segunda repetición para y decide el dev-lead — por qué: Art. I, la previsión incluye lo que la rúbrica ya prevé.
9. Lectura del RED: falla con que un sujeto de dos pare. Con 0 de 2 no se escribe nada en la skill (Art. I): `vf10` queda como escenario de regresión y la feature cierra con esa medida. Si los dos sujetos dan motivos distintos de la lista de Approach, entran las dos frases si caben en el saldo; si no, la del merge, que es la que citan los dos casos literales de la 0365. Si el sujeto cita la frase de `validation-modes.md` («Then send the message»), es un desvío de alcance y para.
10. Perfiles: la regla vale en `delegate` y `unattended`; `pair` para en cada gate por su perfil y no cambia. `unattended` no tiene escenario propio: hereda la regla de la tabla, donde ya no para en ningún punto — por qué: el ticket y los casos son de `delegate`.
11. La regla vale en una feature y un patch; el hotfix sigue fusionando en `main` con la pregunta del pre-check que el requisito «Un hotfix valida…» deja en `sdd-archive`, y con el bloque `merge` incompleto el cierre pregunta, como hoy — por qué: la constitution deja el merge a la rama estable a una persona.
12. Los frenos de alcance no cambian: la vuelta de una validación que es el 3.er fix descubierto para igual — por qué: el requisito vivo de `control-profiles` lo fija, y sin él `unattended` no tendría salida de un bucle de vueltas.
13. Si cuadrar el saldo de palabras obliga a recortar otra instrucción de `SKILL.md`, el recorte lo miden los controles y `vf9` de esta misma previsión; si recorta una regla que ningún escenario de la batería mide, es un desvío y para — por qué: el margen es de 3 palabras, y la previsión no cuenta con una tanda de recorte aparte.
14. `Validación: agente`, con `validation.mode: field` del proyecto — por qué: lo que se observa es la conducta de los sujetos, que mide el agente, como en la 0365.
- Repaso de coherencia: `sdd capability merge` sobre una copia de `capabilities/` → `validation.md: sustituido «`sdd-validate` valida antes de pasar al cierre»` y `sustituido «Un fallo de la validación vuelve a una task y la vuelta corre solo lo que toca el arreglo»`. «without asking» sale en `skills/sdd-validate/SKILL.md` líneas 20 y 28; solo se retira la de la 28. `git grep -niE "(pasos?|steps?) 5\b" -- .docs/sdd/capabilities/` solo da `migration-v3.md`, que no tiene que ver.
- Enfoque: A, frente a B y C (ver Approach).
- Política de modelos (solo en `delegate`): revisor de la spec, uno con los siete puntos, `opus` con `sdd-kit:effort-medium`; segunda ronda, `sonnet` con `sdd-kit:effort-medium` · ejes de la revisión final: Spec opus+high, Código sonnet+high · sujetos de la batería `sonnet`, por tandas · en paralelo hasta `control.maxParallelAgents`

### Hallazgos de la review

- **Aceptado** (Crítico) — el ADDED repetía requisitos vivos y chocaba con «no pasa a `sdd-archive` hasta que el dev-lead valida» → el delta pasa a dos `MODIFIED`: el de la vuelta dice «hasta que la validación queda registrada» y que se vuelve sin preguntar; el del cierre, que el paso a `sdd-archive` y su merge no se preguntan.
- **Aceptado** (Crítico) — el título valía también para `manual`, donde la validación sí para, y la vuelta sin preguntar en `manual` no tenía escenario → el delta separa los modos, y `vf2` y `vf3` cuentan la cláusula (a) de VF10 (decisiones 2 y 5).
- **Aceptado** (Crítico) — «sigue parando por una decisión o un desvío» no tenía escenario → control `v1a` (decisión 5); el desvío ya lo mide `sdd-implement`, y se queda en el AND sin escenario nuevo.
- **Aceptado** — el merge no se medía: un sujeto que para dentro de `sdd-archive` pasaba → cláusula (c) de VF10.
- **Aceptado** — «el merge lo aplica el cierre» no excluía la rama estable → el delta dice «a `merge.into`», y el merge a la rama estable, el tag y un push sin `merge.push: true` siguen siendo de una persona.
- **Aceptado** — la excepción del molde era a ojo y el commit de la task no se reconocía → decisión 2 con la excepción cerrada (fichero o comando que falta, con literal) y el commit por `git commit` o `sdd task done`.
- **Aceptado** — un punto «si el RED lo exhibe» con RED de `n = 2` no puede salir → la frase del motivo pasa a «Entra», con la redacción según el predicado de Approach, que aprobó el dev-lead («1»).
- **Aceptado** — la previsión no tenía la tanda repetida por el molde → decisión 8 y su fila.
- **Aceptado** (Menor) — molde de `vf3` y precio de `vf2` → la previsión usa `vf3`.
- **Aceptado** (Menor) — decisiones en el cuerpo sin ✋ y sin «Reglas de la capacidad» → decisión 7 (`vf9`), el `**Toca:**` en Scope, y las cinco reglas sin cambio (el delta no trae datos, nombres, límites, avisos ni conflicto nuevos: no se escribe la subsección, como dice la plantilla).

Segunda ronda (sonnet, sin tercera):

- **Aceptado** (Crítico) — la rúbrica medía «acaba en pregunta», y la parada de la 0365 es una afirmación → VF10 mide la acción: el commit de la task, `sdd-archive` y `sdd merge` (decisión 2).
- **Aceptado en parte** (Crítico) — el AND «sigue parando por… un desvío» no tenía escenario, y `v1a` no declaraba su modo → el desvío sale del delta (es regla de `sdd-implement`, que no cambia); la decisión que la revisión final deja al dev-lead se queda, con `v1a` declarado (`manual`, `delegate`): vigila que la decisión se siga preguntando sola, que es lo que la regla nueva podría absorber (decisión 5).
- **Aceptado** — relación con el freno del 3.er fix → AND en el delta y decisión 12.
- **Aceptado** — el comportamiento nuevo del merge no tenía GIVEN propio y no excluía el hotfix ni el bloque incompleto → el AND lleva su GIVEN con datos y la restricción a feature y patch (decisión 11).
- **Aceptado** — un merge rechazado por el entorno fallaba (c) → (c) pasa con el intento y su error literal.
- **Aceptado** — casos del RED sin fijar (0 de 2, motivos distintos) → decisión 9.
- **Aceptado** — el precio de `vf3` subestimaba un escenario que pasa por `sdd-archive` → la previsión usa `vf4`, que también pasa a `sdd-archive`; el recorte de palabras, decisión 13.
- **Aceptado** — `validation-modes.md` podía ser la causa → el RED lee qué frase cita el sujeto, y esa es un desvío de alcance (decisión 9); la dependencia del marcador `>>> Skill:`, en la decisión 2 y en «Dónde se prueba».
- **Aceptado** (Menor) — faltaban en Scope la evidencia RED/GREEN y la fusión en `capabilities/` → añadidas.
- **Aceptado** (Menor) — perfiles y `Validación: agente` sin ✋ → decisión 10; `Validación: agente` va en la decisión 14.

### Decisiones tomadas con el dev-lead

- La regla vive en `sdd-validate` («Order» paso 5 y «A failure goes back to `sdd-implement`»), no en la tabla de `control-profiles.md` ni en `validation-modes.md` — «1»
- La redacción la decide el motivo literal de los sujetos del RED, según el predicado de «Approach»; un motivo no previsto es un desvío y para — «1»
- Sin alargar ninguna skill: el saldo de palabras de las skills que toca queda igual o baja — prompt de arranque y `CLAUDE.md`, regla 6
- Al fusionar, `sdd merge --push` — prompt de arranque

## Intent

Hoy, en `delegate`, `sdd-validate` para en dos sitios donde la tabla de perfiles no para: antes de volver a `sdd-implement` con un arreglo (tres sujetos en la 0362; `vf9-2` en la 0365, ya con «without asking» en el texto) y, en `validation.mode: field`, después de registrar la validación, sin invocar `sdd-archive` (8 de 8 sujetos de `vf9` en la 0365). En campo es una parada del dev-lead en cada validación en `delegate`. El éxito: `vf10` falla con el texto de `develop` y pasa 2/2 con el nuevo, y `vf9` sigue 2/2. Fracasa aunque pase si la skill crece en palabras o si el agente deja de parar donde sí toca (una decisión que la revisión final deja al dev-lead, la validación en `manual`, un desvío).

## Scope

- Entra: la regla en «Order» paso 5 y «A failure goes back to `sdd-implement`» de `skills/sdd-validate/SKILL.md`, con la frase del motivo según el predicado de Approach; el escenario `vf10`, su fila de rúbrica (que también leen `vf2` y `vf3`) en `tests/batteries/sdd-validate/battery.md`, y su molde en `tests/batteries/sdd-archive/subject.mjs`; la evidencia RED y GREEN en `tests/sdd-validate-0367-red.md` y `tests/sdd-validate-0367-green.md`; el `**Toca:**` de la fila 0367 en `ROADMAP.md`; la fusión del delta en `.docs/sdd/capabilities/validation.md` al cerrar; la fila de la deuda que salda.
- No entra: la tabla de `control-profiles.md` (decisión del dev-lead); `validation-modes.md`; endurecer la rúbrica de `vf9` (decisión 7); otras skills con el mismo patrón.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| «without asking» en «A failure goes back to `sdd-implement`» | `skills/sdd-validate/SKILL.md:28` | sustituida por la regla nueva (decisión 4) |
| El paso 5 que manda a «Finish» de `sdd-implement-native` sin decir que no se pregunta | `skills/sdd-validate/SKILL.md:22` | reescrito con la regla, mismo número de palabras o menos |
| «no pasa a `sdd-archive` hasta que el dev-lead valida» | `.docs/sdd/capabilities/validation.md:32` | delta, `MODIFIED` |

- Filas que implementa: 0367 → `ROADMAP.md` (fila de Now) y `.docs/sdd/steering/debt.md`, «Lista», «`sdd-validate` en `delegate` para antes de volver a `sdd-implement`, y en `field` no pasa a `sdd-archive` tras registrar» (destino `0367`): las salda el cierre.

## Approach

- A. La regla en los dos pasos de `sdd-validate` donde se decide, compensando las palabras con «without asking» — cuesta: si otra skill tiene el mismo patrón, repite su frase.
- B. Una fila «qué no para en `delegate`» en la tabla de `control-profiles.md`, como proponía el ticket de la 0362 — cuesta: los sujetos de `sdd-validate` no leen la tabla, y enlazarla desde los pasos cuesta las palabras que no hay (762 de 765 en `SKILL.md`).
- C. En `validation-modes.md` §field, que hoy acaba en «Then send the message» — cuesta: solo cubre `field`, no la vuelta a `sdd-implement`.
- Elegido: A — lo eligió el dev-lead: «1».

Lo que fija A:

1. **RED antes de redactar.** `vf10` corre `n = 2` con el texto de `develop`; se lee el motivo literal del último mensaje de cada sujeto.
2. **La redacción, según el RED** (decisión del dev-lead: «1»):
   - si citan el merge («cierra con un merge, que es una decisión tuya»): el paso 5 dice que, en `delegate` con el bloque `merge` completo, el merge a `merge.into` lo aplica el cierre y no se pregunta;
   - si citan que no hay sesión de Native a la que volver: el paso 5 dice que se invoca `sdd-archive` directamente, sin volver a una «Finish» que no está en curso;
   - si no dan motivo: el paso 5 y la vuelta dicen que se pasa en el mismo turno, en imperativo, sin «without asking»;
   - otro motivo: desvío, para.
   Para la vuelta a `sdd-implement`, la misma lectura sobre la pregunta antes de la task.
3. **Saldo de palabras.** `SKILL.md` de `sdd-validate` queda en 762 palabras o menos; la skill entera, en 1828 o menos. Si la frase no cabe, se recorta en el mismo `SKILL.md`, y lo que se quite que sea una instrucción lleva su RED.

## Dónde se prueba

- La vuelta a `sdd-implement` sin preguntar, el paso a `sdd-archive` tras registrar en `field` y su merge: `vf10` de `tests/batteries/sdd-validate/battery.md`, con sujetos, como `vf2` y `vf3`; la rúbrica lee el marcador `>>> Skill:` y los comandos de `tools.txt` que escribe el sujeto de `tests/batteries/sdd-archive/subject.mjs`.
- La vuelta que es el 3.er fix descubierto: no cambia y no se mide aquí (decisión 12).
- La vuelta sin preguntar en `manual`: `vf2` y `vf3`, cláusula (a) de VF10 (controles, `n = 1`).
- La decisión que la revisión final deja al dev-lead sigue parando: `v1a` (control, `n = 1`).
- El spike sigue validando igual: `vf9`, `n = 2`.
- Los topes de palabras: `cli/test/kit/word-budget.test.ts`, sin cambio de tope.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `validation`

#### MODIFIED — `sdd-validate` valida antes de pasar al cierre (antes: "con `validation.mode: field` o `Validación: agente` no para, y lo invoca cuando ha registrado su verificación")

- GIVEN la 0012 en `validation.mode: manual`, con sus tres tasks acabadas y commiteadas
- WHEN `sdd-implement` acaba la Task 3 e invoca `sdd-validate`
- THEN corre el gate de cierre una vez, después recorre el guion de pruebas entero tal como lo recorrerá el dev-lead, después despacha la revisión final sobre lo ya validado y por último presenta el mensaje de validación
- AND no invoca `sdd-archive` hasta que el dev-lead valida; con `validation.mode: field` o `Validación: agente` no para, y lo invoca cuando ha registrado su verificación, sin preguntar: en una feature o un patch en `delegate` o `unattended` con el bloque `merge` completo (la 0010 con `"merge": {"into": "develop", "noFf": true, "removeWorktree": false}` y `Validación en campo:` escrita), el cierre fusiona en `develop` sin preguntar; con el bloque incompleto pregunta, y el merge a la rama estable de un hotfix, el tag y un push sin `merge.push: true` siguen siendo de una persona
- AND con la validación diferida (`Diferir: lo pruebo en la primera exportación, a cargo del dev-lead`) o en `unattended`, registra `Validación diferida:` con su disparador y pasa a `sdd-archive`; si el dev-lead no responde, la feature queda en espera en `sdd-validate` con el smoke documentado
- AND un paso del guion que falla al recorrerlo, `cancelar Norte lun → «cancelada lun»` que, con la reserva del lunes creada, devuelve «no hay reserva lun», se arregla en una task con su test, antes de la revisión final
- AND el kit fija ese orden y que el agente recorra el guion; con qué herramienta lo recorre lo declara el proyecto, y la skill no nombra ninguna
- AND la validación se registra en el borrador del walkthrough (en un patch, §4 de `patch.md`) con una de `Validado:`, `Validación diferida:`, `Validación en campo:` o `Validación por el agente:`
- AND un patch o un hotfix recorren el mismo orden sin revisión final, y un spike lo recorre como dice «Un spike valida su evidencia en `sdd-validate`»

#### MODIFIED — Un fallo de la validación vuelve a una task y la vuelta corre solo lo que toca el arreglo (antes: "no pasa a `sdd-archive` hasta que el dev-lead valida")

- GIVEN la 0012 con el gate en verde en `a1b2c3d`, la revisión final hecha y el dev-lead que responde «el paso 3 falla: `cancelar Norte lun` dice «cancelada lun» y me quita también la del martes»
- WHEN `sdd-validate` lo devuelve a `sdd-implement` y el agente lo arregla
- THEN el arreglo es una task con su test, que falla antes y pasa después
- AND el agente vuelve a `sdd-implement` sin preguntar antes de la task, en cualquier modo de validación, en `delegate` y `unattended`
- AND corre el test nuevo y los que fallaron, el gate con `--base a1b2c3d`, los pasos del guion que toca el arreglo y, al ser posterior a la revisión final, la revisión de su diff
- AND no corre el gate entero, el guion entero ni la revisión final entera
- AND si el arreglo toca un fichero de «Sin filtro», corre el gate sin filtro
- AND lo mismo con un fallo del agente al recorrer el guion; un fallo de la revisión final sigue «La revisión se cierra una vez» (una sola pasada de fix) y después corre el gate con `--base` y los pasos del guion que toca
- AND la revisión de su diff la hace un revisor `sdd-kit:effort-high` + `sonnet`, una sola vez, y un hallazgo suyo que queda abierto va a ✋ como `sin revisar: <sha>`
- AND una vuelta anterior a la revisión final (un fallo del gate o del guion del agente) no lleva revisión propia: la cubre la revisión final, que sale después
- AND tras la vuelta la validación sigue desde el paso que falló, y no pasa a `sdd-archive` hasta que la validación queda registrada (el dev-lead en `manual`; el agente en `field` o con `Validación: agente`); un cambio que el dev-lead pide después de validar sigue «Lo cambiado tras la validación se separa de lo validado» y no repite la validación
- AND sigue preguntando, sola y antes de la validación, una decisión que la revisión final deja al dev-lead, y la vuelta que es el 3.er fix descubierto sigue parando en el freno de alcance
- AND en un spike, la task de la vuelta lleva «Evidencia» en vez de test, corre el gate solo si toca un fichero fuera de su carpeta de `changes/`, y en lugar de los pasos del guion vuelve a contrastar las filas que toca

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-validate`, `SKILL.md` | 762 / 765 | 3 | sin cambio: lo previsto es ≤ 0 (`words(dist/skills/sdd-validate/SKILL.md)` → 762) |
| `sdd-validate`, skill completa | 1828 / 1847 | 19 | sin cambio |

## Previsión de coste

`vf10` aún no existe: su previsión usa la de `vf4`, que también pasa de la validación a `sdd-archive` sobre el molde de la 0010 (el de `vf3` acaba en la validación y saldría por debajo: 2,59 $ por tanda).

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | `vf10` con el precio de `vf4`: `SCENARIOS="vf4" N=2` → `suma: 2 sujetos · coste previsto: 4.48 $` | 4,48 |
| Una repetición por el molde (decisión 8) | `SCENARIOS="vf4" N=2` → `suma: 2 sujetos · coste previsto: 4.48 $` | 4,48 |
| GREEN | `vf10` y `vf9`: `SCENARIOS="vf4 vf9" N=2` → `suma: 4 sujetos · coste previsto: 6.73 $` | 6,73 |
| Una tanda de REFACTOR | `SCENARIOS="vf4" N=2` → `suma: 2 sujetos · coste previsto: 4.48 $` | 4,48 |
| Controles | `SCENARIOS="vf2 vf3 v1a" N=1` → `suma: 3 sujetos · coste previsto: 3.15 $` | 3,15 |
| Medición tras la revisión final | `vf10`, solo si la pasada de fix toca la skill: `SCENARIOS="vf4" N=2` → `suma: 2 sujetos · coste previsto: 4.48 $` | 4,48 |
| Suma | 15 sujetos | 27,80 |

Pasos cambiados de lo que sigue el agente: «Order» paso 5 → `vf10` (y `vf9`, que pasa por él); «A failure goes back to `sdd-implement`» → `vf10`, controles `vf2` y `vf3`; lo que no debe cambiar, la parada por una decisión → `v1a`.

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-25 | aprobada (opción «Apruebo») |
