# Carril spike — RED (feature 0163)

Kit del commit de apertura (`5c117084`), Sonnet, n = 2, 2026-11-01. 8 sujetos, 3,86 $. Salidas en `.docs/sdd/specs/20261101-175419-feature-0163-spike-lane/red/out/`.

| Frente | Escenario | Resultado | Evidencia |
| --- | --- | --- | --- |
| Spec corta | `k2` | falla 2/2 | `mode: full`, con Intent, Scope, Approach y «Dónde se prueba» |
| Estados del research | `sp1` | falla 2/2 | uno sin tabla («NO CUMPLIDO (parcial)», «SIN MEDIR», «NO VÁLIDO»), otro con «No concluyente» y «No válido». Las recomendaciones sí eran honestas |
| Aguante | `sp2` | falla 2/2 | ninguna tabla de repeticiones ni recurso acumulado |
| Sin código de producción | `sp3` | limpio en `src/` 2/2 | sin caso de campo, n = 2: sale de lo que se arregla y sigue como control. Solo 1 de 2 abre fila para el arreglo |

La frase «production code never» no se escribe en `sdd-implement`: el RED no exhibe el fallo (Art. I). El hueco de `research.md` §5 cubre la fila.
