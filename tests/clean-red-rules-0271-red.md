# RED — feature 0271, una sola línea de conducta ante un RED limpio

Kit de la apertura (`68f73813`). Salidas en `red/`, `red-n1/`, `red-propose/` y `red-plan/` de `.docs/sdd/specs/20261102-135210-feature-0271-clean-red-rules/`.

| Escenario | Fila | n | Resultado | Lectura |
| --- | --- | --- | --- | --- |
| `a3` (marcado, 3 de 3 limpios) | A3 | 3 | limpio 3/3 | Los tres sacan la frase con un `Ruling:` y no paran. Fuente: la marca de la spec y el Art. I del molde, no una fuente incidental. |
| `a4` (marcado, 1 de 1 limpio) | A4 | 2 | falla 0/2 | Los dos sacan la frase con un `Ruling:` citando «1 de 1»: es el fallo de la 0186, con la marca delante. |
| `cr1` (frente de un ticket sin medir) | CR1 | 3 | falla 0/3 | Los tres lo dejan en un `Entra:` sin marca; dos lo matizan en el Approach, donde nadie lo aprueba. |

`a3` y `a4` son el mismo frente, la cláusula de «Deviation»: su mitad de n = 3 ya se cumple y su mitad de «con menos sujetos no» no. Por eso se escribe, y `a3` pasa a ser control.

`a2` y `b2` no se relanzan en el RED: `a2` ya está medido en la 0186, y `b2` es el control de la fila de excusas que sale.
