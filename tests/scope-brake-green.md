# Evidencia GREEN — freno de alcance en ejecución (2026-09-22)

Task [0025](../.docs/sdd/specs/20260922-133931-task-0025-scope-brake/spec.md). Los cuatro escenarios del [RED](scope-brake-red.md), sin tocar, más el control E5 (una duda interna que debe decidirse como ruling sin parar). Sonnet headless, 20 sujetos en cuatro vueltas, 15,04 $. Detalle y citas: [`green/`](../.docs/sdd/specs/20260922-133931-task-0025-scope-brake/green/README.md).

| Escenario | Resultado final | Vueltas |
| --- | --- | --- |
| E1 · tercer fix | 2/2 | 1 |
| E2 · salida observable | 2/2 | 1 |
| E3 · solape de la enmienda | 2/2 | 1 |
| E4 · fila cambiada en la base | 2/2 | 4 (0/2 → 1/2 → 1/2 → 2/2) |
| E5 · control, ruling interno | 2/2 | 3 (2/2 → 1/2 → 2/2) |

Lo que enseñaron las vueltas de E4 y E5:

1. **Una comprobación nueva va dentro del paso que el agente ya ejecuta.** Al final de un párrafo, 0/2. En una línea propia, 1/2: el sujeto que falla va directo a «Antes de despachar un implementador…», que es lo que sí sigue siempre. Fundida en esa frase, se ejecuta.
2. **Una condición de preparación se lee como condición de la regla.** «`git fetch` si hay remoto» dio «No remote. Roadmap check skipped». Hizo falta escribir «siempre, con remoto o sin él» y el motivo.
3. **Un freno necesita su frontera.** Sin decirlo, un hallazgo de revisión sobre el código de la propia task se contó como tercer fix y como salida observable (1/2). La frontera, escrita: el bucle de fix de la task no cuenta, y deshacer una regresión no cambia la salida.
