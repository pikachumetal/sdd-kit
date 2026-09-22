# RED — coste en tokens y modelos en el walkthrough y el log (task 0010)

Frente de campo: petición 34 del [acta de la v1.1.0](../.docs/sdd/releases/v1.1.0/feedback.md) («El estimation-log registra coste en tokens y modelos», con salida honesta «no medido») y la fila 0010 del roadmap. Se mide antes de presentar la spec (regla de `tech-stack.md`, «Un baseline limpio no reproduce los fallos de sesiones largas»). Dos fuentes: el corpus de walkthroughs de la release 1.2.0, que son sesiones reales con contexto cargado, y una campaña de dos sujetos sobre un cierre limpio.

## C1 — corpus: sección 2 de los 11 walkthroughs de task de la 1.2.0

Plantilla vigente: la sección 2 pide tipo, estimación, esfuerzo real, desviación, causa y review de spec. No pide modelos, tokens ni dinero.

| Task | Tokens de subagentes en la sección 2 | Dinero de sujetos | Hilo «no medido» | Forma |
| --- | --- | --- | --- | --- |
| 0001 | ~835k | 7,50 $, en la misma línea | sí | línea «Coste de subagentes» |
| 0002 | 448k | 12,03 $, en la misma línea | sí | línea «Coste de subagentes» |
| 0011 | ~940k (sujetos incluidos) | no | sí | línea «Coste de subagentes» |
| 0004 | ~532k | 22,10 $, en la misma línea | sí | línea «Coste de subagentes» |
| 0014 | ≈ 355k | ≈ 10,3 $, línea aparte | no | lista anidada por despacho |
| 0012 | ~127k (solo revisor final) | 55,9 $ | no | párrafo en prosa bajo la lista |
| 0003 | no (el ticket dice ~610k) | no (el ticket dice 10,68 $) | no | — |
| 0008 | no (el ticket dice ~1,23 M) | no (el ticket dice 39,79 $) | no | — |
| 0013 | no (el ticket dice ~326k) | no (el ticket dice 11,59 $) | no | — |
| 0005 | no (el ticket dice ~296k) | no (el ticket dice 11,05 $) | no | — |
| 0020 | no en la sección 2 (125k en el ticket) | 26,30 $ del GREEN en la sección 3 | no | — |

**Veredicto**: 6/11 anotan algo, en cuatro formas distintas. En tres de ellas el dinero va mezclado con los tokens, y en la 0011 los sujetos cuentan dentro de los tokens de subagente. 4/11 nombran el hilo como no medido. Los modelos no aparecen en ninguno: 0/11. `estimation-log.md` no recoge nada de esto, porque el script solo lee estimación y esfuerzo real.

**Contraste**: el «Contexto» de los tickets de campo de la misma release sí tiene huecos fijos en `kit-feedback-template.md` («Modelo del hilo», «Modelos de los subagentes», «Coste en tokens: <tokens, o "no medido">»). Los 14 tickets de agente escritos con esa plantilla (desde la task 0002) lo rellenan con la misma forma: los modelos en 14/14 y el dinero de sujetos en 9 de los 10 con campaña. El décimo, el del proyecto de template, lo declara «no medido». El hilo como no medido aparece en 7 de las 9 tasks con subagentes: la 0012 y la 0020 dan el coste del revisor y de los sujetos y no dicen nada del hilo. Con hueco en la plantilla, el dato aparece; sin él, se dispersa o se pierde. Es un fallo de forma (Art. II): la receta va en la plantilla.

## E1 — cierre limpio con los costes a la vista (2 sujetos Sonnet)

- **Kit**: copia limpia de `skills/`, `.claude-plugin/` y `hooks/` de `feature/0010` a 2026-09-22, sin cambios de la task.
- **Molde** (`red/m-close`): el de la task 0013 (CLI de reservas de salas, task 0009 implementada), con `estimation.md` y `estimation-log.md`. El plan declara ejecución por subagente con modelo y effort, y una estimación de 1,5 h. `tasks.md` registra el implementador (Sonnet high, 214k tokens, 13 min) y el revisor de task (Sonnet medium, 128k, 7 min), más 4 sujetos headless que costaron 1,85 $. `review.md` registra el revisor final (Sonnet medium, 131k, 8 min).
- **Turno**: «Cierra la task 0009. Lo he probado yo: `node src/app.js libres 10-12` da el mensaje de error y `node src/app.js libres 10:00-12:00` da Sur. Funciona.»
- **Lanzador**: `red/run.sh` → `red/subject.sh` (`claude -p --model sonnet`). **Coste**: 2,07 $ (1,14 $ y 0,93 $).

| Sujeto | Modelos | Tokens de subagentes | Dinero de sujetos | Hilo | Esfuerzo real |
| --- | --- | --- | --- | --- | --- |
| e1-1 | no | no | no | no | «0,47h (28 min: 13 min implementador + 7 min revisor de task + 8 min revisor final de rama)» |
| e1-2 | no | no | no | no | «0,5h (implementador 13 min + revisor de task 7 min + revisor final 8 min, ver `tasks.md` y `review.md`)» |

**Veredicto**: el fallo se reproduce 2/2. Los dos leen `tasks.md` y `review.md`, porque citan sus minutos, pero no llevan al walkthrough ni los tokens ni los modelos ni el dinero. El log regenerado solo tiene horas.

**Fallo no buscado (2/2)**: sin un sitio para el coste de los subagentes, sus minutos se suman como «Esfuerzo real» del hilo. El ratio sale de 28 min de subagentes y no del reloj de la task. Esto es lo mismo que el tercer aviso de `estimation.md`, visto desde el walkthrough: lo que corre en paralelo o delegado no es reloj del hilo. La plantilla tiene que separar el reloj del hilo del coste de los subagentes.

## Qué pide el GREEN

1. La sección 2 del walkthrough recoge, en huecos fijos, el modelo y los tokens del hilo (con «no medido» como salida honesta), los tokens de los subagentes con su modelo y el dinero de los sujetos, cada cosa por separado.
2. El esfuerzo real sigue siendo el reloj del hilo: los minutos de los subagentes van en su línea, no en la suma.
3. El log muestra esas partidas en columnas propias y distingue «no medido» (declarado) de «—» (walkthrough anterior sin el campo).
