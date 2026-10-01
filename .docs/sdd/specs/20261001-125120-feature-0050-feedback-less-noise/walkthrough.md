---
id: 20261001-125120-feature-0050-feedback-less-noise
feature: 0050
title: Walkthrough — Tickets de sdd-feedback con menos ruido
spec: ./spec.md
status: done
created: 2026-10-01
---

# Walkthrough — Tickets de `sdd-feedback` con menos ruido

## 1. Cambios realizados

- **RED**: `red/subject.sh` con un molde sintético de un proyecto de notas: nombre de cliente y de interlocutora, `tools/lint-docs.sh` (MD013 a 200) declarado en `tech-stack.md`, y `session-log.md`. Escenarios `n1` (sesión con ruido, con el ticket de la 0031 ya escrito) y `l1` (cierre limpio). 4 sujetos con la skill de la rama antes de editarla: las siete medidas fallan en al menos uno. Evidencia en `tests/kit-feedback-noise-red.md`.
- **Guía** (`d0a5d3d4`):
  - `skills/sdd-feedback/SKILL.md`:
    - paso 3, el ticket mínimo si el cierre fue limpio;
    - paso 4, un ticket por feature o patch;
    - paso 6 nuevo, el lint de docs del proyecto antes del commit;
    - reglas nuevas: «Verificada» en cada propuesta, con comando, shell y línea de error si cita un fallo; la causa de coste respaldada o «sin respaldo»; los errores del agente (si una regla del kit lo pudo evitar es hallazgo, también si existía y no se aplicó); y «Menores».
  - `kit-feedback-template.md`: la forma del ticket mínimo, la línea «Verificada», la sección «Menores» y la ayuda del coste. Sale «Errores míos».
  - `sdd-end-feature` (paso 11) y `sdd-end-patch` (paso 7): la oferta se condiciona a la feature o al patch, no a la sesión.
  - `tests/KitFeedback.Tests.ps1`. El GREEN y el REFACTOR van en `tests/kit-feedback-noise-green.md`.
- **Pasada de fix de la revisión final** (juntada en el cierre):
  - la plantilla, alineada con la frase de errores de la skill;
  - el predicado de cierre limpio, con «sin estimación» y la lista de la decisión 1;
  - «sin inventar fricciones» en el ticket mínimo;
  - el ejemplo de «Qué pasó», por debajo de 200 caracteres;
  - Pester protege las siete reglas;
  - las dos enmiendas de la spec;
  - el control `n1` + `l1`.
- **Capacidad** `kit-feedback`:
  - MODIFIED: «vive en `.docs/sdd/kit-feedback/`», «se escribe para un agente», «Sin hallazgos», «separa el hueco del kit del error del ejecutor» y «el cierre ofrece el ticket»;
  - ADDED: «lista de menores» y «pasa el lint de docs»;
  - regla «Límites».

## 2. Tiempo y coste: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5h
- Esfuerzo real: 0,6h — reloj del hilo aproximado con las marcas de los commits: 14:56 (apertura) a ~15:30 (cierre), hora local del 2026-10-01; contexto y spec, ~0,2h aparte (14:43 a 14:56)
- Desviación: -0,9h (-60 %)
- Causa de la desviación: cada tanda de sujetos (RED, GREEN, REFACTOR, control) corrió en paralelo en 3-5 min. La guía fueron reglas cortas en una skill de 337 palabras y su plantilla. La estimación partía de la 0002, que además creó la skill
- Modelo del hilo: Opus 5.5, effort no registrado (toda la feature)
- Tokens del hilo: 18.823.432 — claude-opus-5-5 18.823.432
- Tokens de subagentes: 837.998 en 1 despacho — Revisor final 0050 claude-opus-5-5 837.998 / 2 min
- Coste de la sesión: 8,27 $ (hilo 7,42 $ + subagentes 0,85 $)
- Coste de sujetos: 3,09 $ en 12 sujetos sonnet — RED 0,94 $; GREEN 0,86 $; REFACTOR 0,73 $; control del fix 0,57 $
- Review de spec: no · hallazgos 0, aceptados 0

## 3. Desviaciones del plan

- Modo lite, sin plan. Dos enmiendas a la spec, aprobadas por el dev-lead:
  - el tope de `SKILL.md` pasa de ~500 a ~650 palabras (queda en 611);
  - la campaña pasa de 10 a 12 sujetos, para el control de la pasada de fix.

### Decisiones tomadas sin el dev-lead

- **Error con regla del kit que el agente se saltó: es un hallazgo.** El RED destapó que la decisión 5 no decía qué hacer con un error que una regla escrita del kit ya cubría y el agente no aplicó. La skill lo dice: es un hallazgo, porque la regla no aguantó la presión. Encaja en la letra del THEN («si una regla del kit lo pudo evitar»), así que no es enmienda. Coste si está mal: tickets con hallazgos sobre reglas que ya existen, que el triaje tendría que descartar.
- **REFACTOR tras el GREEN, con dos frases en las reglas:**
  - un fallo del shell que una regla del kit cubre también es hallazgo;
  - el coste de un menor cuenta aunque su causa vaya «sin respaldo».

  Cierran dos huecos de 1 de 2 que el GREEN midió. Coste si está mal: ninguno medido, porque el control pasó 3 de 3.
- **El revisor final, con Opus y effort high**, el techo del kit en `encargo-revision.md`, y no con el modelo más barato que pide el `CLAUDE.md` global del dev-lead: manda la constitution del proyecto. Coste: 0,85 $.
- **Un Minor de la revisión, diferido**: los menores mal clasificados en las salidas del GREEN. Va a la deuda como escenario de control para la batería de la 0120.

## 4. Verificación

### 4.1 Builds

- Suite rápida del pre-commit sobre la pasada de fix: 869 pasados, 0 fallos, 9 saltados · 24 s
- Suite completa: `Invoke-Pester -Path tests` sobre el commit de cierre → 1.174 pasados, 0 fallos, 10 saltados · 433 s
- `Test-Capabilities.ps1 -Path .docs/sdd -Artifact spec.md` → `Capacidades válidas: 14`; `Test-Roadmap.ps1 -Path .docs/sdd` → `Roadmap válido`
- `tests/KitFeedback.Tests.ps1`: 22/22 en la rama. Contra la copia anterior a la feature, 8 fallos; contra la anterior a la pasada de fix, falla la aserción nueva de la plantilla.

### 4.2 Smoke / tests

- Validación en campo: 2026-10-01 · suite completa 1.174/1.174 en 433 s · smoke 7/7 THEN con ejecución real (12 sujetos headless sonnet: RED 0/2 a 1/2 por medida → GREEN, REFACTOR 2/2 y control 2/2), 1 por suite · revisión final opus «Sí, con dos arreglos» sobre d0a5d3d4, 2 Important arreglados en la pasada de fix

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| Un ticket por feature: si la sesión ya escribió el de la A, nace el de la B y el de A no cambia | ejecución real (`n1` GREEN 2/2, REFACTOR 2/2, control 1/1; RED 1/2) | ✅ |
| Cada hallazgo lleva «Verificada», y un fallo de ejecución citado, el comando, el shell y la línea de error | ejecución real (`n1` GREEN y siguientes, todos los hallazgos; el `task-done` con su línea `No such file or directory`) | ✅ |
| La causa de coste se respalda con spec, walkthrough o commit, o va «sin respaldo» | ejecución real (`n1`: citan el walkthrough y marcan «sin respaldo» la frase del dev-lead) | ✅ |
| Cierre limpio → ticket mínimo de tres líneas, sin inventar fricciones | ejecución real (`l1` GREEN 2/2 con 54 y 82 palabras, control 52; RED 210) | ✅ |
| Lo que una regla del kit pudo evitar es hallazgo; lo que ninguna cubre, o el shell sin relación con el kit, no va | ejecución real (REFACTOR 2/2 y control 1/1; el `git commit -F -` fuera en 5/5) | ✅ |
| Menores: menos de ~10 min y una vez, en una línea al final | ejecución real (REFACTOR y control: los de ~3 y ~5 min como menores, el de ~20 min como hallazgo) | ✅ |
| El ticket pasa el lint de docs del proyecto antes del commit | ejecución real (los 8 sujetos con la skill nueva ejecutan `tools/lint-docs.sh`, 8/8 `lint ok`; RED 0/4 lo ejecutan y 2 tickets con 10 y 7 líneas MD013) | ✅ |
| La oferta del cierre se hace por feature o patch | suite (`KitFeedback.Tests.ps1`, «Oferta por feature o patch») | ✅ |

### 4.3 Residuales / deuda generada

- Fila de deuda nueva, «Residuos de la campaña de `sdd-feedback` de la feature 0050». Son dos clasificaciones de menos en 2 de 8 tickets: una atribución como menor y un «sin verificar» que sí estaba contrastado.
- La fila de deuda «La propuesta o la cifra de un ticket entra en el roadmap como decidida sin estar verificada» queda **parcial**. Falta el otro lado: que `sdd-roadmap` conserve la marca al copiar una propuesta.

## 5. Aprendizajes

- Una regla con una excepción («X no va, salvo Y») partida en dos frases la lee mal 1 de 2 sujetos: el GREEN la cazó dos veces, en la frontera shell/regla del kit y en coste/respaldo. Ya lo dice el Art. II («una excepción lleva su contraejemplo»), y aquí el contraejemplo lo puso el REFACTOR → sin destino nuevo, lo cubre la constitution.
- El RED destapó un hueco en la propia spec: el error con regla del kit que el agente se saltó. La decisión salió de leer lo que los sujetos separaban solos → regla en la skill y THEN de la capacidad `kit-feedback`, con el porqué en esta spec.

## 6. Adendas
