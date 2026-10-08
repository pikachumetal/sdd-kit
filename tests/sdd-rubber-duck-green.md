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
| l1-2 | **F** | P | — | **F** | P | P | P |

Frente al RED (R1 6 de 6 en rojo, R3 4 de 4, R2 3 de 6, R5 y R6 2 de 2, R4 1 de 2, R7 1 de 6), el GREEN deja tres rojos:

- **R3, s2-2**: el 🦆 tiene seis frases, porque la sexta es la parada en sí: «Yo no he tocado nada y lo dejo parado hasta que lo decidas».
- **R1, l1-2**: el paso 6 lleva la ruta del fichero resultante: «con el mes como nombre (`exports/2026-03.ics`)». La regla solo decía «the only place for paths», y el sujeto entendió que el fichero que se lleva el usuario no contaba.
- **R4, l1-2**: el paso 4 afirma que el calendario «la vuelve a mostrar a las 10:00», y el código no lo respalda: sin la «Z» sale a las 08:00. Al final se contradice con un «podría aparecer a las 11:00». La primera versión de esta evidencia lo dejó fuera de la rúbrica; la revisión final lo marcó y se corrige aquí. l1-1 y l1-3 lo cuentan bien, y la regla «lee el camino real en el código» ya lo cubre: no lo convierto en otra regla, porque sería guía sin RED detrás.

Citas de lo que pasa:

- **s1-1**: «🦆 Hoy la exportación de un mes trae las reservas de las dos salas, y quien solo usa la sala Norte tiene que borrar a mano las de Sur en su calendario. Con el cambio, el socio podrá indicar una sala al exportar: para marzo de 2026 con Norte, recibirá un fichero con las reservas del 2 y del 19 de marzo y ninguna del 5, que es de Sur». En el RED era «`src/cli.js` lee `--sala` del argv…». Lleva el nombre del fichero (`2026-03-norte`), que es lo que el socio ve en su carpeta: no es una ruta del código, y lo doy por bueno.
- **s2-1**: «La exportación pasa las horas a UTC (el reloj de referencia mundial, dos horas por detrás del coworking) y las escribe sin indicar que son UTC». El término técnico va explicado en la misma frase, por su efecto.
- **l1-1**: siete pasos sin una sola ruta, el ejemplo de marzo con sus cinco reservas de principio a fin, y «Si quieres que profundice en algún paso, pregúntame».

## REFACTOR

Dos contraejemplos en `SKILL.md`, uno por rojo:

- Modo corto: «What you did or need decided («no he tocado nada», «decide cómo se escribe la hora») goes after the paragraph, never as a sixth sentence».
- Modo largo: «the only place for paths, even the file the user gets («se guarda en la carpeta de facturas», not `out/2026-03.pdf`)», con el ejemplo en otro dominio que el molde.

Un sujeto de control por escenario afectado (Art. I):

| Sujeto | Veredicto | Cita |
| --- | --- | --- |
| s2-3 | R1, R2, R3 y R7 pasan | 🦆 de cinco frases, con la hora internacional explicada; después del párrafo, aparte: «No he tocado nada, y el cierre queda parado. Dev-lead, decide cómo se escribe la hora…» |
| l1-3 | R1, R2, R4, R5, R6 y R7 pasan | paso 7: «Se crea la carpeta de exportaciones si no existe y se escribe ahí el calendario, con el mes como nombre». Las rutas solo salen en «Dónde mirar» |

## Pasada de fix de la revisión final

La revisión final (Opus, effort high, sobre `2feb97a1`) dejó un Important: varias reglas del `SKILL.md` no tenían un fallo del RED detrás y la tabla de procedencia no las listaba. El RED se había cortado por fila de la rúbrica, no por regla. Se recortan cuatro reglas: «frases cortas en voz activa», «ids» en la lista de lo prohibido, «si no cambia nada, dilo en una frase» y «de 3 a 9 pasos». La procedencia de `battery.md` lista ahora cada regla que queda y las recortadas. En la misma pasada se corrige esta evidencia: R4 de l1-2 pasa a F, y el «Resultado» deja de decir que todo se midió con la skill final.

Un sujeto de control por escenario afectado, con la skill recortada:

| Sujeto | Veredicto | Cita |
| --- | --- | --- |
| s1-4 | R1, R2, R3 y R7 pasan | «🦆 Hoy, quien solo usa la sala Norte exporta marzo y recibe también las reservas de Sur…»: cinco frases, con el ejemplo del 2 y el 19 de marzo |
| s2-4 | R1, R2, R3 y R7 pasan | 🦆 de cuatro frases con «una hora universal, que va dos horas por detrás»; lo que hay que decidir va aparte, después |
| l1-4 | R1, R2, R4, R5, R6 y R7 pasan | siete pasos sin rutas; el paso 5 dice bien que la reserva de 10:00 a 12:00 «queda como 08:00 a 10:00 UTC» |

Campaña completa: **18 sujetos, 2,23 $** (techo: 18 sujetos y 10 $).

## Resultado

Con la skill final se midieron los controles s1-4, s2-4 y l1-4, y pasan todas sus filas. s1-1, s1-2, s2-1, l1-1 y c1 se midieron antes del REFACTOR y de la pasada de fix, que solo añadieron contraejemplos o quitaron reglas sin respaldo. El `SKILL.md` cabe en su tope de 500 palabras (`WordBudget.Tests.ps1` en verde).
