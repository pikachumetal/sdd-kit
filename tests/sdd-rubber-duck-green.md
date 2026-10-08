# GREEN — `sdd-rubber-duck` (feature 0145)

- **Fecha**: 2026-10-08. **Kit**: la rama con `skills/sdd-rubber-duck/`, copiado de los ficheros que versiona git. **superpowers**: 6.4.2.
- **Batería**: `tests/batteries/sdd-rubber-duck/` entera (`PHASE=green`): s1, s2 y l1 dos veces, y el control c1.
- **Sujetos**: 7 en el GREEN y 2 de control en el REFACTOR, Sonnet. **Coste**: GREEN 0,87 $, REFACTOR 0,27 $. Campaña completa con el RED: **15 sujetos, 1,86 $** (previsión: 18 sujetos y ~5 $; techo de 10 $).
- **Salidas**: [`green/out/`](../.docs/sdd/specs/20261008-164456-feature-0145-sdd-rubber-duck/green/out/) y [`refactor/out/`](../.docs/sdd/specs/20261008-164456-feature-0145-sdd-rubber-duck/refactor/out/).

## Veredicto de puerta

| Escenario | Primera skill | Veredicto |
| --- | --- | --- |
| s1 ×2, s2 ×2 | `sdd-kit:sdd-rubber-duck` | verde |
| l1 ×2 | `sdd-kit:sdd-rubber-duck` | verde: **C1 pasa** sin tocar `using-sdd`, así que el requisito de `routing` se queda y la enmienda pre-aprobada no hace falta |
| c1 | `sdd-kit:sdd-consult` | verde: **C2 pasa**, consult conserva «¿cómo está montado…? No lo pillo.» |

## Veredicto de conducta

| Sujeto | R1 | R2 | R3 | R4 | R5 | R6 | R7 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| s1-1 | P | P | P | — | — | — | P |
| s1-2 | P | P | P | — | — | — | P |
| s2-1 | P | P | P | — | — | — | P |
| s2-2 | P | P | **F** | — | — | — | P |
| l1-1 | P | P | — | P | P | P | P |
| l1-2 | **F** | P | — | P | P | P | P |

Frente al RED (R1 6 de 6 en rojo, R3 4 de 4, R2 3 de 6, R5 y R6 2 de 2, R4 1 de 2, R7 1 de 6), el GREEN deja dos rojos:

- **R3, s2-2**: el 🦆 tiene seis frases, porque la sexta es la parada en sí: «Yo no he tocado nada y lo dejo parado hasta que lo decidas».
- **R1, l1-2**: el paso 6 lleva la ruta del fichero resultante: «con el mes como nombre (`exports/2026-03.ics`)». La regla solo decía «the only place for paths», y el sujeto entendió que el fichero que se lleva el usuario no contaba.

Citas de lo que pasa:

- **s1-1**: «🦆 Hoy la exportación de un mes trae las reservas de las dos salas, y quien solo usa la sala Norte tiene que borrar a mano las de Sur en su calendario. Con el cambio, el socio podrá indicar una sala al exportar: para marzo de 2026 con Norte, recibirá un fichero con las reservas del 2 y del 19 de marzo y ninguna del 5, que es de Sur». En el RED era «`src/cli.js` lee `--sala` del argv…». Lleva el nombre del fichero (`2026-03-norte`), que es lo que el socio ve en su carpeta: no es una ruta del código, y lo doy por bueno.
- **s2-1**: «La exportación pasa las horas a UTC (el reloj de referencia mundial, dos horas por detrás del coworking) y las escribe sin indicar que son UTC». El término técnico va explicado en la misma frase, por su efecto.
- **l1-1**: siete pasos sin una sola ruta, el ejemplo de marzo con sus cinco reservas de principio a fin, y «Si quieres que profundice en algún paso, pregúntame».

**Fuera de la rúbrica**: l1-2 afirma en el paso 4 que el calendario «la vuelve a mostrar a las 10:00», y es falso, porque sin la «Z» sale a las 08:00. Al final se contradice con un «podría aparecer a las 11:00». l1-1 y l1-3 lo cuentan bien. Es un error de lectura del código, no de forma, y la regla «lee el camino real en el código» ya lo cubre. No lo convierto en regla: sería guía sin RED que la respalde.

## REFACTOR

Dos contraejemplos en `SKILL.md`, uno por rojo:

- Modo corto: «What you did or need decided («no he tocado nada», «decide cómo se escribe la hora») goes after the paragraph, never as a sixth sentence».
- Modo largo: «the only place for paths, even the file the user gets («se guarda en la carpeta de facturas», not `out/2026-03.pdf`)», con el ejemplo en otro dominio que el molde.

Un sujeto de control por escenario afectado (Art. I):

| Sujeto | Veredicto | Cita |
| --- | --- | --- |
| s2-3 | R1, R2, R3 y R7 pasan | 🦆 de cinco frases, con la hora internacional explicada; después del párrafo, aparte: «No he tocado nada, y el cierre queda parado. Dev-lead, decide cómo se escribe la hora…» |
| l1-3 | R1, R2, R4, R5, R6 y R7 pasan | paso 7: «Se crea la carpeta de exportaciones si no existe y se escribe ahí el calendario, con el mes como nombre». Las rutas solo salen en «Dónde mirar» |

## Resultado

Todas las filas de la rúbrica pasan con la skill final. El `SKILL.md` mide unas 450 palabras, con un tope de 500 (`WordBudget.Tests.ps1` en verde).
