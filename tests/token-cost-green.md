# GREEN — coste en tokens y modelos en el walkthrough y el log (task 0010)

Mismo escenario que el [RED](token-cost-red.md) E1: el sujeto cierra la task 0009 del molde `m-close`, que trae los despachos y el gasto de campaña en `tasks.md` y `review.md`. Cambia solo el kit: `walkthrough-template.md` con las cuatro líneas de coste y `Build-EstimationLog.ps1` con las tres columnas.

- **Kit**: `skills/`, `.claude-plugin/` y `hooks/` de `feature/0010` con las tasks 1–3 aplicadas.
- **Lanzador**: `green/run.sh` → `green/subject.sh` (`claude -p --model sonnet`).
- **Coste**: 6,10 $ en seis sujetos (ronda 1: 1,12 $ y 0,77 $; ronda 2: 0,61 $ y 0,89 $; ronda 3: 0,54 $ y 1,16 $).

## Ronda 1 — plantilla tal como salió de la Task 1

| Sujeto | Cuatro líneas | Hilo «no medido» | Total de tokens primero | Esfuerzo real sin sumar despachos |
| --- | --- | --- | --- | --- |
| e1-green-1 | ✅ | ✅ | ✅ 473k | ❌ «suma de los tiempos de los despachos» |
| e1-green-2 | ✅ | ✅ | ❌ «214k en implementador + 128k + 131k» → el log leyó 214k | ✅ 1,5h |

Dos huecos de forma. El primero es el fallo no buscado del RED, que sobrevive. El segundo es nuevo: sin el total al principio, el parser lee la primera cifra de la lista.

**Ajuste de la plantilla** (mismo commit que la Task 1, antes de la ronda 2):
- la línea de tokens dice que abre con el total sumado y que el log lee esa primera cifra;
- la de esfuerzo real nombra la racionalización: «no tengo reloj del hilo, sumo los despachos» convierte el ratio en el de los subagentes.

## Ronda 2 — con el ajuste

| Sujeto | Cuatro líneas | Hilo «no medido» | Total de tokens primero | Esfuerzo real sin sumar despachos |
| --- | --- | --- | --- | --- |
| e1-green2-1 | — (no llegó a escribirlo) | — | — | ⏸️ para y **pregunta al dev-lead** el reloj del hilo antes de escribir |
| e1-green2-2 | ✅ | ✅ | ✅ 473k | ❌ suma los despachos, y lo argumenta: «no hay reloj propio del hilo distinto de la orquestación» |

## Ronda 3 — molde con commits fechados

La ronda 2 dejó la duda de si el fallo era del kit o del molde: sus commits se creaban todos en el mismo segundo, así que el sujeto no tenía ninguna marca de la que sacar el reloj del hilo. `subject.sh` pasa a repartir la sesión de la task 0009 en tres commits con hora real (10:05 el test, 10:41 el código, 11:08 los documentos), como una sesión de verdad. Mismo turno, mismo kit que la ronda 2.

| Sujeto | Cuatro líneas | Hilo «no medido» | Total de tokens primero | Esfuerzo real sin sumar despachos |
| --- | --- | --- | --- | --- |
| e1-green3-1 | ✅ | ✅ | ✅ 473k | ✅ 1,5h, citando el reloj del hilo |
| e1-green3-2 | ✅ | ✅ | ✅ 342k | ✅ «1,05h — aproximado por marcas de commits: 10:05 → 11:08 (63 min)» |

El fallo de las rondas 1 y 2 era del molde, no del kit: con marcas de tiempo delante, 2/2 separan el reloj del hilo del tiempo de los subagentes.

Dos detalles menores, no bloqueantes: e1-green3-2 dejó `Modelo del hilo: no medido` en vez de nombrar su modelo, y sumó solo los dos despachos de `tasks.md`, dejando fuera el revisor final que está en `review.md`.

## Veredicto

| Conducta | RED | GREEN |
| --- | --- | --- |
| Las cuatro líneas de coste están | 0/2 | 5/5 de los que escribieron walkthrough |
| El hilo se declara «no medido» | 0/2 | 5/5 |
| El dinero de los sujetos se anota aparte | 0/2 | 5/5 |
| El log muestra las tres columnas | 0/2 | 5/5 |
| El total de tokens abre la línea | — | 1/2 sin el ajuste · 3/3 con él |
| «Esfuerzo real» no suma los minutos de los subagentes | 0/2 | 1/4 con el molde sin fechas · **2/2 con fechas** |

Lo que la task pedía queda en verde. La conducta que fallaba en las dos primeras rondas se explica por el molde: un campo obligatorio sin dato disponible se rellena con lo que haya cerca (los minutos de los despachos) o para a preguntar. **Regla para futuras campañas**: si el escenario mide algo que se deduce del historial, el molde tiene que darle historial con horas repartidas.

La enmienda que se propuso tras la ronda 2 —admitir `no medido` en «Esfuerzo real»— **se retira**: no hace falta.
