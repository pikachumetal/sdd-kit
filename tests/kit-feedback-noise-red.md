# RED — tickets de `sdd-feedback` con menos ruido (feature 0050)

Baseline con la skill y la plantilla de la rama antes de editarlas (`18001d0b`, 2.2.0 más lo cerrado de la 2.3.0), 2026-10-01. Molde sintético de un proyecto de notas con nombre de cliente y de interlocutora, `tech-stack.md` con un lint de docs (`tools/lint-docs.sh`, MD013 a 200) y `session-log.md` con lo que pasó en la sesión: [red/subject.sh](../.docs/sdd/specs/20261001-125120-feature-0050-feedback-less-noise/red/subject.sh). Salidas en [red/out/](../.docs/sdd/specs/20261001-125120-feature-0050-feedback-less-noise/red/out/).

## Previsión de la campaña (Art. I)

Declarada en la spec (decisión 10) antes del primer sujeto: 4 sujetos en el RED, 4 en el GREEN y 2 de reserva; ~8 $, techo 12 $ y 2 h (`SUBJECT_CAP=10`, `COST_CAP=12`). Sonnet headless, `SUPERPOWERS_DIR` de la caché 6.4.2.

Gastado en el RED: 4 sujetos, 0,94 $, de 8 a 13 turnos cada uno.

## Escenarios

Petición, igual en los dos: «Acabo de cerrar la feature 0032. Lo que pasó en la sesión está en `session-log.md`. Genera el ticket del kit para esta feature.»

- `n1` (sesión con ruido): la sesión ya escribió el ticket de la 0031, que está en `.docs/sdd/kit-feedback/`, y cierra la 0032. La bitácora de la 0032 trae:
  - un campo inventado en la spec, que el repaso de coherencia no contrasta con el código (~20 min);
  - `task-done` lanzado con `bash <ruta>` desde PowerShell, con el comando y la línea de error (~15 min, dos veces);
  - `git commit -F -` en PowerShell (~2 min);
  - el login de la verificación visual (~45 min);
  - dos fricciones de ~3 y ~5 min, cada una una sola vez;
  - un coste de 3,5 h frente a 2 h, con la causa del dev-lead («la spec tenía huecos»). El walkthrough la contradice: 45 min de login y 30 min de fix, sin enmiendas.
- `l1` (cierre limpio): sin fricción, 1,5 h frente a 2 h estimadas.

## Resultados

| Medida (decisión de la spec) | n1-1 | n1-2 | l1-1 | l1-2 |
| --- | --- | --- | --- | --- |
| 1. Ticket mínimo en un cierre limpio | — | — | ❌ 210 palabras, seis secciones | ❌ 209 palabras, seis secciones |
| 2. Menores en su lista, una línea | ❌ dentro de «Errores míos» | ❌ `<fase>` como hallazgo completo, con criterio | — | — |
| 3. «Verificada» en cada propuesta | ❌ | ❌ | — | — |
| 3. El fallo citado con comando, shell y línea de error | ❌ sin la línea de error | ❌ sin la línea de error | — | — |
| 4. La causa del coste, respaldada por spec, walkthrough o commit | ❌ cifra de la bitácora, sin citar el walkthrough | ❌ copia la frase del dev-lead | — | — |
| 5. Sin «Errores míos»; lo que el kit pudo evitar, como hallazgo | ❌ cinco errores, cuatro con su regla del kit | ❌ cuatro errores, tres con su regla del kit | ❌ «Ninguno» | ❌ sección vacía |
| 6. Un ticket por feature: nace el de la 0032 y el de la 0031 no cambia | ✅ | ❌ amplía el de la 0031 con `task: 0031, 0032` | — | — |
| 7. Pasa el lint de docs del proyecto | ❌ 10 líneas MD013, no lo ejecuta | ❌ 7 líneas MD013, no lo ejecuta | ✅ por longitud, no lo ejecuta | ✅ por longitud, no lo ejecuta |
| Control: carpeta y nombre | ✅ | ✅ (el de la 0031) | ✅ | ✅ |
| Control: privacidad (cliente, producto, interlocutora) | ✅ | ✅ | ✅ | ✅ |
| Control: criterio de aceptación por hallazgo | ✅ | ✅ | — | — |
| Control: iniciativa propia en su sección | ✅ | ✅ | ✅ | ✅ |

Las siete medidas fallan en al menos un sujeto. La 6 falla 1 de 2, y la 7 falla 2 de 2 en los tickets largos: los cortos pasan por azar, porque nadie ejecuta el lint.

## Lo que dicen los sujetos

- n1-2, al ampliar el de la 0031: «Un solo ticket para la sesión: nació con la 0031 y se amplía con la 0032 (el nombre del fichero se queda).» Sigue la letra del paso 4 («Si esta sesión ya tiene ticket, se amplía»).
- n1-2, coste: «el dev-lead atribuyó los 1,5 h de desviación a "huecos de la spec"», sin contrastarlo con el walkthrough, que lo desmiente.
- n1-1, en «Errores míos»: «Cada uno tiene su regla escrita en el kit cargado; no llevan propuesta.» Mete ahí el `task-done` desde PowerShell y el login, dos errores que una regla del kit ya cubría y que se saltó. También mete dos menores, y además el `git commit -F -`, que no tiene relación con el kit.
- l1-1: «Errores míos, no huecos del kit — Ninguno.» La plantilla obliga a escribir la sección aunque no haya nada.

## Hueco que el RED destapa en la propia spec

Los dos sujetos de `n1` separan dos tipos de error que la decisión 5 no distingue por escrito:

- **El error con regla del kit que el agente se saltó**: el `task-done` y el login, que suman ~60 min de los ~90 de la desviación.
- **El error sin relación con el kit**: el `git commit -F -`.

La decisión 5 dice «si una regla, un paso o una plantilla del kit pudo evitar el error, es un hallazgo». Una regla escrita que no evitó el error es justo lo que el que mantiene el kit necesita saber, porque la regla no aguanta la presión (Art. II). Por eso la skill lo dice explícito: es un hallazgo, con la regla en «Dónde en el kit» y «la regla existe y no la apliqué» en «Por qué el kit no lo evitó». No cambia la letra de la spec. Es un ruling, y va al walkthrough.
