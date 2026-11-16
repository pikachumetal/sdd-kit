# GREEN de la feature 0146 — spec y plan de propose

GREEN de las reglas que sobrevivieron al RED (`tests/sdd-start-feature-0146-red.md`), con el kit de la rama copiado al scratchpad (`skills`, `.claude-plugin`, `hooks`, `cli`) y superpowers 6.4.2. Misma batería y misma rúbrica que el RED. Salidas en `.docs/sdd/specs/20261008-193241-feature-0146-propose-spec-and-plan/green/`.

## Task 2 — La spec abre con 🦆 y ✋, y dice dónde se prueba (`s1`)

- **Ronda 0** (`green/out-s1-r0/`): S1 2/2, S3 2/2, **S2 1/2**. s1-2 escribió en ✋ «la respuesta lista los valores válidos» y dejó los literales «motivo requerido: …» y «motivo desconocido: aburrimiento. Opciones: …» solo en los THEN.
- **REFACTOR**: la ayuda del ✋ en `spec-template.md` pide el literal de cada texto, con un contraejemplo de otro dominio («importe no válido: usa dos decimales», no «avisa del formato»).
- **Ronda 1** (`green/out/s1-*`): **S1 2/2, S2 2/2, S3 2/2**. Las dos specs abren con 🦆 bajo el título, ✋ justo después de «Capacidades», y cada texto de los THEN (`motivo no válido: elige cambio-de-planes, sala-ocupada u otro`, `sin canceladas`, `cancelada Norte lun (sala ocupada)`) está también en ✋; las dos llevan «Dónde se prueba» («por `run('canceladas', [])`, tras cancelar…, con el mismo patrón») y «Términos y ADR».

## Task 3 — Gate con opciones fijas y modelo del revisor de dominio (`g1`, `r1`)

- **g1** (Opus): **G1 2/2**. g1-1 busca la herramienta (`ToolSearch: select:AskUserQuestion`) y, al no encontrarla, presenta «1. **Apruebo (Recomendada).** … 2. **Apruebo; escribe el plan y, si sale Native, para antes de la Task 1 para que bajes la sesión a gama media.** … 3. **Cambios.**». g1-2 no la busca: dice que «esta sesión no tiene la herramienta de preguntas con opciones» (no está en su lista) y presenta las mismas tres opciones literales. Se cuenta como intento: la regla no tiene otra salida en `claude -p`.
- **r1**: **R1 2/2**. r1-1: «1. **Dos revisores: dominio en Opus + técnica en Sonnet (Recomendada).** 2. Dos revisores, dominio en Sonnet…»; r1-2: «Recomiendo **un revisor con Opus**, porque la spec decide quién puede hacer qué».

## Task 4 — El plan declara `Tras` (`p1`)

- **Ronda 0** (`green/out-p1-r0/`): `Tras` 2/2, pero **P1 0/2** en «en orden, sin paralelo»: la frase iba en un bloque de ayuda (`>`) que la plantilla manda borrar al redactar.
- **REFACTOR**: la frase pasa a una línea de contenido bajo «## 2. Tasks».
- **Ronda 1** (`green/out/p1-*`): p1-2, «Las tasks se ejecutan en orden, sin paralelo.» y `**Tras**: —` / `**Tras**: Task 1`. p1-1 hace un plan de una sola task con `**Tras**: —` y sin la frase: con una task no hay nada que ejecutar en paralelo, y se cuenta como no aplicable. **P1: `Tras` 2/2; «sin paralelo» 1/1 aplicable.** P2 sigue 2/2 como control (`node --test test/cancel.test.js` en cada task).

## Task 5 — Acción update (`u1`)

- **Ronda 0** (`green/out-u1-r0/`): **U1 0/2, U2 0/2**. Ninguno abrió `control-profiles.md`: el paso 6 solo decía «acción update de la fila "Desvío"». u1-2 volvió a reabrir la Task 1 para meter `--por` en el commit de la Task 2.
- **REFACTOR**: la regla sube al paso 6 en una frase (parar con 🦆 y ✋, corrección en su sitio sin commitear, línea en «Enmiendas», sin reabrir tareas cerradas), compensada quitando del mismo párrafo la lista de los cuatro frenos, que sigue en `control-profiles.md` y en los red flags.
- **Ronda 1** (`green/out/u1-*`): **U1 2/2**. u1-1: «**🦆 En llano:** …» y «**✋ Esto cambia la spec aprobada:** …», con la corrección ya escrita; u1-2: «🦆 **En llano:** …», «✋ **Decisiones que he tomado yo — valídalas**» y «he dejado la opción 1 en `spec.md` sin commitear». **U2 2/2 con la regla afinada**: los dos eligen quitar «quién canceló», que solo recorta la Task 2 en curso; no tocan la Task 1, commitean la enmienda aparte y dejan la nota en la Task 2. Con la regla original (task nueva siempre) habría sido 0/2: el dev-lead aprobó afinarla el 2026-10-09 (enmienda de la spec), porque una Task 3 para quitar un dato no evitaba nada.

## Task 6 — La validación abre con 🦆 y ✋ (`v1a`, `v1b`)

- **v1a**: **V1 2/2** a la primera. Tras la línea de aviso de fase, «## 🦆 Lo hecho» y «## ✋ Me salí del plan en…» con los dos rulings del molde.
- **v1b, ronda 0** (`green/out-v1b-r0/`): **0/2**. Con `validation.mode: field` los sujetos siguen la frase que manda invocar `sdd-end-feature` sin guion; la mención al 🦆 iba en la presentación manual.
- **REFACTOR 1**: la forma pasa a la frase del modo `field` del paso 7. **Ronda 1** (`green/out-v1b-r1/`): **1/2**. v1b-1 abre con 🦆 y ✋ antes de invocar el cierre; v1b-2 invoca `sdd-end-feature` sin mensaje previo, y el usuario lee el mensaje final del cierre («Decisiones tomadas sin ti»), sin 🦆 ni ✋.
- **REFACTOR 2**: el punto 2 del mensaje final de `sdd-end-feature`, con `field`, lleva el 🦆 y el título «✋ Me salí del plan en…». **Ronda 2** (`green/out/v1b-*`): **2/2**.
- Nota de método: en la ronda 1 el veredicto se leyó primero con `grep` y el emoji no casó; se repuntuó todo v1 con Python (lectura UTF-8).

## Task 8 — Ajustes de `sdd-rubber-duck` (`s2`, `l2`)

- **RED repetido de l2** (`noise-l2/out/`, kit del RED): **0/2**, «Dónde mirar» en respuestas en inglés; con el RED original (2/2 «Where to look»), 2 fallos de 4. La regla vuelve a la spec (enmienda del 2026-10-09).
- **Ronda 0** (`green/out-t8-r0/`): s2 **R9 2/2** («falta decidir en qué hora se escribe la franja», sin opciones); l2 **R7 0/2**: los dos responden enteros en castellano a una pregunta en inglés.
- **Ronda 1** (`green/out-t8-r1/`, Overview «en el idioma de su mensaje» y la lista titulada en el idioma del usuario): l2 **1/2** (l2-2 en castellano); s2 **R9 0/2** (s2-1 da las dos opciones tras el párrafo; s2-2, su recomendación).
- **Ronda 2** (`green/out/s2-*`, `l2-*`; contraejemplo de otro dominio para lo pendiente, y «una pregunta en inglés se contesta en inglés aunque los documentos estén en castellano»): l2 **2/2** («Where to look», respuestas en inglés); s2 **1/2**: s2-1 «Falta decidir cómo corregir la hora de la exportación.»; s2-2 cierra con tres opciones y «¿Cuál eliges?».
- **Lectura**: s2 lleva 3 de 6 en las tres rondas, frente a 0/2 en el RED. El escenario pide al mismo sujeto ser la parada («para aquí y explícale…») y el pato, así que preguntar es en parte su papel de parada: no separa bien los dos. La regla se queda, y la medida limpia va a deuda (un escenario donde la parada la haga otra skill).

## Revisión final y pasada de fix

- **G1 y P1, rúbrica enmendada después de puntuar** (Important 4 de la revisión final): con la rúbrica escrita antes del GREEN, G1 es 1/2 (g1-2 no buscó la herramienta con `ToolSearch`; dijo que no estaba y presentó las opciones literales) y P1 es 1/2 (p1-1, un plan de una sola task, sin la frase «sin paralelo»). La batería enmienda las dos filas con fecha y motivo; las cifras 2/2 de arriba son con la rúbrica enmendada. Leído con la rúbrica original, 1/2 y 1/2.
- **u2, la rama de la acción update que toca una task cerrada** (Important 3): **RED 2/2 falla** (`red-u2/out/`, kit de la apertura): u2-1 mete `--por` en el commit de la Task 2; u2-2 «reabre» la Task 1 como «1b» en el mismo commit. **GREEN ronda 0** (`green/out-u2-r0/`): 0/2, los dos declaran «Task 1 — enmienda 2026-10-09: …», leyendo la `N` del literal como la task afectada, y el trabajo cae en el commit de la Task 2. **REFACTOR**: el paso 6 y `control-profiles.md` dicen «una task nueva al final, con su commit (`Task 3 — enmienda <fecha>: <qué>` tras la 2)». **Ronda 1** (`green/out/u2-*`): **2/2 en lo que medía el RED** —`### Task 3 — enmienda 2026-10-09: …` al final del plan, con su propio commit (`d9679a1`, `f22470c`), sin reabrir la Task 1—; **0/2 en la nota** `afectada por enmienda … → Task 3` de la Task 1 y en el `Tras` de la Task 3 (el plan del molde no lleva `Tras` en ninguna task). Lo que falta queda como ruling: la Task 3 se ve en el registro aunque falte la nota.
- **Textos** (Important 1, 2 y 5, leídos en el diff): el paso 6 separa `pair`/`delegate` (paras) de `unattended` (se aplica `sin aprobar` y sigue); el punto 2 del mensaje final de `sdd-end-feature` vale siempre y el 🦆 y el ✋ de los rulings se añaden con `field`; la plantilla de plan pierde las dos cláusulas de `to-tickets` sin RED.
