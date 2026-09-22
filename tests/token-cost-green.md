# GREEN — coste en tokens y modelos en el walkthrough y el log (task 0010)

Mismo escenario que el [RED](token-cost-red.md) E1: el sujeto cierra la task 0009 del molde `m-close`, que trae los despachos y el gasto de campaña en `tasks.md` y `review.md`. Cambia solo el kit: `walkthrough-template.md` con las cuatro líneas de coste y `Build-EstimationLog.ps1` con las tres columnas.

- **Kit**: `skills/`, `.claude-plugin/` y `hooks/` de `feature/0010` con las tasks 1–3 aplicadas.
- **Lanzador**: `green/run.sh` → `green/subject.sh` (`claude -p --model sonnet`).
- **Coste**: 4,40 $ en cuatro sujetos (ronda 1: 1,12 $ y 0,77 $; ronda 2: 0,61 $ y 0,89 $).

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

## Veredicto

| Conducta | RED | GREEN |
| --- | --- | --- |
| Las cuatro líneas de coste están | 0/2 | 3/3 de los que escribieron walkthrough |
| El hilo se declara «no medido» | 0/2 | 3/3 |
| El dinero de los sujetos se anota aparte | 0/2 | 3/3 |
| El log muestra las tres columnas | 0/2 | 3/3 |
| El total de tokens abre la línea | — | 1/2 sin el ajuste · 1/1 con él |
| «Esfuerzo real» no suma los minutos de los subagentes | 0/2 | 1/4 |

Lo que la task pedía —registrar por separado hilo, subagentes y sujetos, con «no medido» honesto, y agregarlo en el log— queda en verde.

**Lo que no se arregla con la plantilla**: separar el esfuerzo real del tiempo de los subagentes falla 3 de 4 veces, y el cuarto sujeto paró a preguntarlo. El molde explica por qué: sus commits se crean todos a la vez, así que el sujeto **no tiene ninguna marca de la que sacar el reloj del hilo**, y ante un hueco obligatorio («nunca en blanco») rellena con lo único que tiene, los minutos de los despachos, o pregunta. No es desobediencia: es que la plantilla no le da salida honesta para ese caso, como sí se la da al hilo en tokens.

**Propuesta pendiente de aprobación** (cambia la spec, así que va al gate de validación): admitir `no medido` también en «Esfuerzo real», con el log dejando `—` en Real y Ratio sin avisar, igual que hace hoy con un estimado ausente. El aviso actual se reserva para un valor presente e ilegible.
