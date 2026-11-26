---
id: 20261125-181246-feature-0366-dry-run-runs-mold
feature: 0366
title: El ensayo en seco de una batería ejecuta lo que el molde deja
mode: lite
status: approved
created: 2026-11-25
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-25
---

# Spec — El ensayo en seco de una batería ejecuta lo que el molde deja

🦆 Antes de gastar en sujetos, el ensayo en seco (`DRY_RUN=1 node tests/headless/battery.mjs run <batería>`) ya monta cada molde, pero no ejecuta lo que el molde deja para el sujeto. Con esta feature, un molde puede declarar los comandos que deja y lo que deben dar, y el ensayo los ejecuta. Esta feature lo hace en los dos moldes de los casos. Por ejemplo, `node src/app.js cancelar Norte lun --motivo "sala ocupada"` tiene que salir con 0. Si uno falla, el ensayo sale en rojo con `v1b · 0/1 · … · rojo · molde roto en v1b-1: …` y no escribe el stream de ese sujeto. Una fila de rúbrica `mold:` hace lo mismo con un molde que ya trae la señal que se mide, como el caso de la 0362.

Validación: agente — es una herramienta de tests del repo: lo que se observa es el código de salida y la línea del veredicto, que el test mide tal cual; ninguna persona vería algo más.

## Capacidades

- Ninguna, porque herramientas: `tests/headless/` no viaja en el plugin, y ninguna capacidad describe el ensayo en seco (`Grep` de `DRY_RUN|ensayo en seco|battery\.mjs` en `.docs/sdd/capabilities/`: solo una mención de un molde en `planning.md:120`).

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec propuesta: un revisor (lite) — señales: ninguna de la rúbrica (sin capacidad, contrato público, MODIFIED, datos ni dependencia; todo el código citado leído en la sesión) · tamaño: ~120 líneas en 6 ficheros (lib.mjs, battery.mjs, dos subject.mjs, battery.md de sdd-validate, operations.md) y el test
- Siete puntos (sonnet): si los THEN de «Dónde se prueba» fallan sin el comportamiento (el test integrado sin `<label>.jsonl` y con código ≠ 0), si las decisiones 4, 5 y 8 (`code`, solo en seco, rojo y no «sin evidencia») cuadran con el Intent y su antiobjetivo, y si el Scope cubre todo lo que promete el Intent (señal: tamaño, lite)
- Mínimo razonable: sin review — deja sin mirar si el rojo de la decisión 8 rompe el contrato de código 3 que leen otras herramientas
```
1. Política de review: un revisor con los siete puntos, en sonnet, por ser lite.
2. Enfoque: A, el molde declara sus comandos en `subject.mjs`, frente a B (una columna en `battery.md`) y C (buscar scripts en el molde) (ver Approach).
3. El helper se llama `s.leave(command, { code, output })`, en `tests/headless/lib.mjs`, junto a `s.put` y `s.commit` — es donde los moldes ya escriben lo que dejan.
4. `code` vale 0 si no se declara; `output`, opcional, es un texto que la salida (stdout y stderr juntos) tiene que contener. `code` sirve para un comando que debe salir con error. Las dos filas de error del smoke de la 0010 no lo necesitan: la app sale con 0 al rechazar un motivo (medido el 2026-11-25 en el molde de `g5`), así que esas filas se distinguen por `output`. La medida va al walkthrough como evidencia.
5. Los comandos declarados y las filas `mold:` solo se evalúan con `DRY_RUN=1`. El molde del ensayo se descarta al acabar, salvo con `KEEP_MOLD=1` (`lib.mjs:25`). Con esa variable, el molde que se conserva ya lleva lo que hayan escrito los comandos. La tanda real monta el suyo desde cero, sin lo que escriba un comando. Además, el sujeto real no gasta tiempo en ejecutarlos.
6. Se evalúan con el molde ya montado y antes de escribir `<label>.args` y el stream falso. Van primero las filas `mold:`, porque un comando podría crear o borrar la señal, y después los comandos, en el orden en que se declararon. Cada comando corre con `cwd` en el repo del molde (`s.R`), con `spawnSync(…, { shell: true })` de Node (`cmd` en Windows, `sh` en el resto) y un tope de 60 s. Los comandos se escriben con comillas dobles, que valen en las dos shells, como ya hacen las filas del smoke. `output` se compara con la salida decodificada en UTF-8. Los comandos corren una vez por sujeto, porque cada sujeto monta su propio molde. La evaluación se corta en el primer fallo.
7. Un fallo deja `<label>.mold.txt` en `OUT` con uno de estos literales, y después el sujeto acaba con código 1:
   - `molde roto: «<comando>» salió con <código> (esperado <código>)`
   - `molde roto: «<comando>» no contiene «<texto>»`
   - `molde roto: «<comando>» no terminó en 60 s`
   - `molde roto: <fichero> casa /<regex>/ (fila <id>)`
   Al empezar, el sujeto borra un `<label>.mold.txt` que haya quedado de un ensayo anterior.
8. `battery.mjs` lee `<label>.mold.txt`: el escenario sale `rojo`, con la nota `molde roto en <label>: <primera línea>`, y el código de salida es 1. Rojo y no «sin evidencia» (código 3), porque lo que falta no lo arregla relanzar. Los consumidores del código 3 (`campaign.test.ts`, `run.test.ts`, `subject-output-privacy.slow.test.ts`, `battery.test.ts:567`) miden campañas sin `.mold.txt`, y su camino no cambia.
9. La fila de rúbrica tiene la forma `` `mold: <fichero> /<regex>/` `` en «Falla si…», con el fichero relativo a la raíz del molde. Falla si el fichero existe y casa con la regex (flag `m`, `\|` escapada como en `file:`). Un fichero que no existe no falla: en `vf2`, `vf3` y `vf10` el walkthrough de la 0010 no existe hasta que el sujeto lo escribe, porque `RECORD` es falso fuera de la batería de `sdd-archive` (`tests/batteries/sdd-archive/subject.mjs:71`). Una ruta mal escrita la caza el RED que lleva toda fila `mold:` nueva: con su señal puesta a propósito en el molde, tiene que dar `molde roto: … casa …` (enmienda 2026-11-25).
10. `readRubric` cuenta `mold:` como comprobación de máquina: si está mal escrita, es el error `comprobación mal escrita` de siempre. `judge` no la aplica a las salidas del sujeto, porque es del molde.
    - `lib.mjs` lee las filas `mold:` de su escenario con un `import('./battery.mjs')` dinámico dentro de la evaluación en seco, no con un import estático. Ya existe la cadena `battery.mjs → campaign.mjs → lib.mjs`, y un import estático cerraría el ciclo. El import dinámico no tiene efectos, porque los `subject.mjs` ya importan `battery.mjs` (`subjectCell`).
    - El `battery.md` se busca con la misma regla que `scenarioCell`.
    - La batería sigue con los demás escenarios tras un `molde roto`, y la nota nombra a cada sujeto roto.
11. Moldes que se declaran en esta feature:
    - las cuatro filas del smoke de `validated0010` (`tests/batteries/sdd-archive/subject.mjs:460`), con su salida; las dos filas del error salen con 0, medido (la app no cambia el código al rechazar un motivo);
    - las dos formas de `medidas/medir-libres.mjs` del spike (`node medidas/medir-libres.mjs` y `--memoria`).
    La ejecución que el molde del spike ya hace al construirse (`subject.mjs:327`) se queda: su salida es contenido del molde (`o1-libres.txt`).
12. Dos filas nuevas en la rúbrica de `tests/batteries/sdd-validate/battery.md`, `VF11 Molde sin la validación` (`vf2`, `vf3` y `vf10`) y `VF12 Patch sin la validación` (`vf8`). Cubren los escenarios cuya rúbrica, en las filas VF8 y VF10, falla si el sujeto no escribe `Validación en campo:`:
    - `vf2`, `vf3` y `vf10`: `` `mold: <walkthrough.md de la feature del molde> /^Validación en campo:/` ``;
    - `vf8`: `` `mold: <patch.md del molde> /^Validación en campo:/` ``.
    La ruta exacta de cada fichero se lee en su `subject.mjs`, y la prueba el RED de cada fila (decisión 9 y «Dónde se prueba»). Es el caso de la 0362.
13. La guía va en `.docs/sdd/steering/operations.md`, pregunta (8) de «Comprobación previa de cada escenario», y no en `skill-testing.md`. `skill-testing.md` no nombra el ensayo en seco ni lo que se comprueba antes de una tanda (`Select-String` de `DRY|dry|before launching|mold`: nada), así que esta feature no edita ninguna skill. La pregunta (8) se reescribe con las mismas palabras o menos: `operations.md` está en su tope, 20.785 de 20.785.
14. Repaso de coherencia: `sdd capability merge` sobre una copia de `.docs/sdd` → «Sin delta que fusionar», exit 0. `git grep` de `0366` fuera de las carpetas de evidencia da solo `ROADMAP.md:12` y `debt.md:83`, las dos filas que salda. El literal de la pregunta (8) solo está en `operations.md:154`.
15. Previsión de coste: 0 sujetos y 0 $. Solo se tocan moldes, rúbrica y herramienta, y se miden con ensayos en seco. No se edita ninguna skill (decisión 13).
16. El test integrado va en `cli/test/kit/headless/mold-commands.test.ts`, que lanza procesos reales. Se añade a la lista de `cli/vitest.config.ts` que lo saca de `cli:test` y lo deja en `test-headless`, junto a `run`, `subject` y `molds`. Los unitarios de `mold:` van en `battery.test.ts`, que es rápido.
- Política de modelos (solo en `delegate`): revisor de la spec, uno en sonnet (hecho) · revisión final en ejes: Spec opus+high, Código sonnet+high, Arquitectura según `sdd-validate` · sin sujetos ni otros despachos en paralelo.

### Hallazgos de la review

- **Aceptado, y sustituido por la enmienda 2026-11-25** — `mold:` con el fichero ausente pasaba, y una ruta mal escrita no se vería nunca → la regla «un fichero ausente falla» la retira la enmienda (decisión 9); queda el RED de cada fila de `sdd-validate` sobre un molde con la señal puesta a propósito.
- **Aceptado en parte** — los comandos pueden cambiar el molde, y el orden entre `mold:` y comandos no estaba fijado → decisión 6: primero `mold:` y después los comandos, en orden. Decisión 5: el molde del ensayo se descarta y la tanda real monta el suyo. No se ejecuta sobre una copia: el antiobjetivo habla del molde de la tanda real, que nunca es el del ensayo.
- **Rechazado** — pasar de 3 a 1 rompería a los consumidores del código 3 → los que hay (`campaign.test.ts`, `run.test.ts`, `subject-output-privacy.slow.test.ts`, `battery.test.ts:567`) miden caminos sin `.mold.txt`, que no cambian. Se deja en la decisión 8.
- **Aceptado** — un `.mold.txt` viejo da un rojo falso, la promesa de «ningún sujeto» era demasiado amplia, y el código ≠ 0 solo no prueba nada → decisión 7: el sujeto borra el suyo al empezar. Intent: la promesa se acota al escenario roto. «Dónde se prueba»: la línea exacta del veredicto.
- **Aceptado** — sin timeout ni shell declarada → decisión 6: `shell: true` de Node, 60 s y comillas dobles; el literal del timeout va a la decisión 7.
- **Aceptado** — el carril del test integrado → decisión 16.
- **Aceptado** — la lista de escenarios de la fila `mold:` estaba abierta → decisión 12, cerrada.
- **Rechazado** — `code` 0 por defecto deja pasar un comando que debe fallar → es al revés: un comando que sale con error y se declaró sin `code` da `molde roto`, que se ve, no que pasa. Sí se acepta llevar el código medido al walkthrough (decisión 4).
- **Aceptado** — sin previsión de coste → decisión 15.
- **Aceptado** — el Intent prometía que todos los moldes declaran → 🦆 e Intent dicen «puede declarar», con los dos casos.

Segunda ronda (un revisor sonnet; sin críticos, sin tercera ronda):
- **Aceptado** — tres escenarios verdes pasarían con un `s.leave` que no ejecuta → marcador escrito por el comando y comprobado con `KEEP_MOLD=1` («Dónde se prueba»).
- **Aceptado** — no estaba fijado cómo lee `lib.mjs` las filas `mold:` → decisión 10: `import()` dinámico, porque un import estático cerraría el ciclo `battery → campaign → lib`.
- **Rechazado** — un `.mold.txt` del ensayo daría un rojo falso en la tanda real → no comparten `OUT`: el ensayo escribe en `RUNS_DIR/dry/<fase>/out` y la tanda real en `SPEC_DIR/<fase>/out` (`campaignConfig` de `campaign.mjs`).
- **Aceptado** — `KEEP_MOLD=1` conserva el molde con lo que escribieron los comandos → decisión 5 lo dice y cita `lib.mjs:25`.
- **Rechazado** — `mold:` cambia el formato de `battery.md` que leen otras herramientas → `readRubric` solo lo llama `battery.mjs` (`git grep readRubric` en `tests`, `cli` y `build`). Una fila nueva de máquina no toca los umbrales, que viven en la tabla de escenarios.
- **Aceptado** — las filas `mold:` de `sdd-validate` eran ambiguas → decisión 12: son filas nuevas, VF11 y VF12. La ruta mal escrita la caza la decisión 9.
- **Aceptado** — varios fallos y varios escenarios → decisión 6: se corta en el primer fallo. Decisión 10: la batería sigue y nombra a cada sujeto roto.
- **Aceptado** — codificación y frecuencia → decisión 6: UTF-8 y una vez por sujeto.
- **Rechazado** — documentar los códigos de salida → no hay documentación de los códigos de `battery.mjs` en `operations.md` (`git grep 'código 3'`: solo tests). El borrador de la pregunta (8) se escribe al implementar, medido contra el tope (tabla «Topes de palabras»).
- **Aceptado** — nada obliga a pasar el ensayo, y el arreglo de moldes no tenía tope → «No entra»: obligarlo queda fuera, y el enganche es la pregunta (8). «Entra, si…»: tope de 1 h y, por encima, deuda.

Revisión de la enmienda 2026-11-25 (un revisor sonnet):
- **Aceptado** — un solo RED para dos rutas distintas → «Dónde se prueba»: un RED por ruta (walkthrough de la 0010 en `vf10`, `patch.md` de la 0008 en `vf8`).
- **Aceptado** — el primer hallazgo de la review seguía diciendo la regla vieja → marcado como sustituido.
- **Aceptado en parte** — VF11 parece inerte porque el walkthrough no existe en el molde → no lo es: se arma justo en la regresión de la 0362, cuando el molde vuelve a heredar el borrador con la línea (`RECORD` verdadero), que es cuando el fichero existe y casa. VF12 sí mira un fichero que existe (`patch.md` de `vf8`). Se acepta el riesgo de una ruta que cambie después del RED: lo caza el RED de quien cambie el molde, no un test permanente.
- **Rechazado** — una fila `mold:` movería el `n/N` del escenario → `judge` no la aplica a las salidas (unitario «mold: no se aplica a lo que guarda el sujeto» en `battery.test.ts`, verde 2/2).
- **Rechazado** — los escenarios `ausente` y `nocasa` pasan sin evaluar `mold:` → la misma fila M1 cubre `casa` en la misma tanda, que solo da rojo si la fila se evalúa.
- **Aceptado** — medir el código real de las filas de error → medido: la app sale con 0 también al rechazar un motivo («motivo no válido: …», código 0), así que esas filas declaran solo `output`, y `code` queda en 0.

### Decisiones tomadas con el dev-lead

- `Molde sin:` entra en esta feature, como comprobación `mold:` de la rúbrica (opción 1️⃣) — «1»

## Intent

Hoy, `DRY_RUN=1` monta cada molde y cambia `claude -p` por un stream falso, pero no ejecuta los comandos ni los scripts que el molde deja para el sujeto. Dos veces los sujetos midieron otra cosa por eso:
- en la 0305, el smoke de `validated0010` validaba con un motivo que la app rechaza, y 5 sujetos (~3,5 $) descartaron la validación;
- en la 0365, `medir-libres.mjs` era un esqueleto, con tres rehechuras del molde, ~1,5 $ descartados, la Task 4 (1,70 $) y una parada del dev-lead.
En la 0362, un molde que ya traía la señal medida tiró 27,7 $ de GREEN.

El éxito: un molde que declara un comando roto, o que trae ya dentro la señal de una fila `mold:`, hace salir el ensayo en seco con código distinto de 0 y con el escenario nombrado. El stream de ese sujeto no se escribe. Esta feature lo declara en los moldes de los dos casos, `validated0010` y el del spike, y en los escenarios del caso de la 0362. Los demás moldes lo declaran cuando un caso lo pida.

Antiobjetivo: que el ensayo cambie el molde que ve la tanda real, o que un comando que debe fallar (un motivo fuera de la lista) se lea como molde roto.

## Scope

- Entra:
  - `s.leave` y su evaluación en el ensayo en seco (`tests/headless/lib.mjs`);
  - la comprobación `mold:` (`tests/headless/battery.mjs`, y su evaluación en `lib.mjs`);
  - la nota y el rojo del veredicto;
  - las declaraciones de los dos moldes de los casos y las filas `mold:` de `sdd-validate`;
  - la pregunta (8) de `operations.md`;
  - los tests: `cli/test/kit/headless/mold-commands.test.ts` (nuevo, con su línea en `cli/vitest.config.ts`) y `cli/test/kit/headless/battery.test.ts`.
- Entra, si el ensayo lo exhibe: arreglar un molde de `sdd-archive` o `sdd-validate` cuyo comando declarado salga roto al pasar el ensayo de la batería entera, con un tope de 1 h. Lo que pase de ese tope va a una fila de deuda.
- No entra:
  - declarar los comandos de los moldes de las otras 15 baterías: cada uno se declara cuando un caso lo pida;
  - ejecutar los comandos en la tanda real;
  - obligar a pasar el ensayo en seco antes de la tanda real: el enganche sigue siendo la pregunta (8) de la comprobación previa;
  - editar `skills/sdd-agent-writing/references/skill-testing.md` (decisión 13).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La pregunta (8) de la comprobación previa: «con `DRY_RUN=1`, ¿la suite del molde sale en verde…?» pasa a decir que el ensayo ejecuta lo que el molde declara con `s.leave` y las filas `mold:` | `.docs/sdd/steering/operations.md:154` | decisión 13, mismas palabras o menos |
| Veredicto de un escenario sin `tools.txt` por molde roto: antes `sin evidencia` (código 3), ahora `rojo` con la nota `molde roto en …` (código 1) | `tests/headless/battery.mjs` (`judge`, `exitCode`) | decisión 8 |

- Filas que implementa: la fila «Un molde de batería deja comandos o scripts que no se ejecutan al montarlo, y los sujetos miden otra cosa» de la «Lista» de `.docs/sdd/steering/debt.md` y la fila 0366 de `ROADMAP.md`. El cierre las marca, como dice `sdd-archive`.

## Approach

- A — el molde declara en su `subject.mjs`, con `s.leave`, cada comando que deja, con su código y su salida esperados. El sujeto los ejecuta en seco. Cuesta un helper y una llamada por comando. El que escribe el comando en el molde es el que sabe qué tiene que dar.
- B — una columna o celda nueva en `battery.md` con los comandos de cada escenario. Duplica en la tabla lo que el molde ya escribe, y los dos se separan en el primer cambio del molde. Además, `battery.mjs` no tiene la ruta del molde, que vive en la carpeta del sujeto.
- C — buscar en el molde montado los scripts y las filas `comando → «salida»` y ejecutarlos. No sabe qué argumentos ni qué código espera cada uno (dos filas de la 0010 esperan el error), y cada forma nueva de dejar un comando necesita otro parser.
- Elegido: A, porque el molde es la única fuente que sabe qué dejó y qué debe dar, y es el mismo patrón que la 0365 aplicó a mano en `subject.mjs:327`.

Lo que fija A:
- `s.leave` solo registra el comando. La evaluación va en `launch` de `lib.mjs`, antes de `<label>.args`, con `DRY_RUN=1`.
- Las filas `mold:` del escenario se leen de la rúbrica de `battery.md` con un export de `battery.mjs` que reutiliza `readRubric` y `compileCheck`.

## Dónde se prueba

Todo lo de la batería de juguete va en `cli/test/kit/headless/mold-commands.test.ts`. Es una batería en un directorio temporal, con un `subject.mjs` real que usa `initSubject`, lanzada con `node tests/headless/battery.mjs run` y el `node` del proceso, como `molds.test.ts` lanza sujetos reales en seco. Lleva un escenario por caso:
- Comando que sale con error: `s.leave('node -e "process.exit(2)"')` → código de salida 1, una línea de veredicto que empieza por `<id> · 0/1 · umbral 1/1 · rojo` y contiene `molde roto en <id>-1: molde roto: «node -e "process.exit(2)"» salió con 2 (esperado 0)`, y ningún `<id>-1.jsonl` en `RUNS_DIR`. Este es el criterio de hecho.
Los escenarios verdes corren con `KEEP_MOLD=1` y con un comando que escribe un fichero marcador en el molde. El test comprueba que el marcador existe, para que «sin `molde roto`» no lo dé un `s.leave` que no ejecuta nada.
- Comando con `code: 2` declarado que sale con 2, y con un `output` que su salida contiene → el escenario no lleva `molde roto`, y el marcador existe.
- `output` que la salida no contiene → `molde roto: «…» no contiene «…»`.
- Fila `mold:` que casa con un fichero del molde → `molde roto: <fichero> casa /<regex>/ (fila <id>)`. Fila `mold:` sobre un fichero que no existe → sin `molde roto`. Fila `mold:` que no casa → sin `molde roto`.
- Un `<label>.mold.txt` que dejó un ensayo anterior no da rojo si el molde ya está bien.

En `cli/test/kit/headless/battery.test.ts`, unitarios como los de `file:`: `mold:` mal escrita da `comprobación mal escrita`, y `verdict` no la aplica a las salidas del sujeto.

Las declaraciones de `sdd-archive` y `sdd-validate` se prueban con `DRY_RUN=1 node tests/headless/battery.mjs run` de las dos baterías enteras, sin ningún `molde roto`, y su salida va al walkthrough. Además hay tres RED a propósito, sobre una copia temporal: un motivo roto en `validated0010` da `molde roto en …`; el walkthrough de la 0010 con `Validación en campo:` ya escrita da `molde roto: … casa …` en `vf10` (VF11: `vf2` y `vf3` comparten la misma ruta); y `patch.md` de la 0008 con esa línea lo da en `vf8` (VF12).

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: no toca ninguna capacidad (ver Capacidades).

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,5 h
- Estimación de implementación: 3 h
- Base de la estimación: dos puntos de enganche ya existentes (`launch` de `lib.mjs` y `readRubric` y `judge` de `battery.mjs`), una batería de juguete para el test integrado y dos ensayos en seco de batería entera. La incertidumbre es un molde que salga roto al declararlo.
- Confianza: media

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/steering/operations.md` | 20785 / 20785 | 0 | sin cambio: la pregunta (8) se reescribe con las mismas palabras o menos (`(Get-Content operations.md -Raw) -split '\s+'` → 20785) |

## Enmiendas

- 2026-11-25 — una fila `mold:` sobre un fichero que no existe deja de fallar (decisiones 7, 9 y 12, y «Dónde se prueba»); la ruta mal escrita la caza el RED de cada fila nueva — en `vf2`, `vf3` y `vf10` el walkthrough no existe en el molde (`RECORD` falso fuera de `sdd-archive`, `subject.mjs:71`), y con la regla aprobada sus filas darían `molde roto` siempre — aprobada: «1» (opción «Apruebo la enmienda»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-25 | aprobada (opción «Apruebo») |