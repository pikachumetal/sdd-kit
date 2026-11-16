# Tasks — feature 0327

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — El revisor de la spec señala una fila que pasa sin la conducta | hecha: `rc1` limpio 3/3, `rc2` RED 1/2 → GREEN 2/2 | ce2c1f95, 3e596d1f, e10cfc41 |
| Task 2 — El 🦆 de una parada no nombra ids sin explicarlos | hecha, sin frase: RED limpio 3/3 | ce2c1f95 |

Revisión final: Spec opus+high, 1 Importante y 4 Menores · Código sonnet+high, 3 Menores
Pasada de fix: 8d44674e (fixture, `FOLDERS`, evidencia) y la enmienda de `rc2` (el Importante)
Re-revisión: no — la pasada de fix no toca skills; la frase de la Task 1 la mide el GREEN de `rc2`

## Rulings

- Task 2: RED limpio con n = 3 (decisión 6); la frase no se escribe; `s5` queda fijando la conducta.
- Task 1: `rc1` limpio 3/3 no reproducía la 0326 (eje Spec); enmienda con `rc2`, rojo 1/2, y entra la frase.
- Revisión final: la fixture de la 0031 declara la capacidad nueva `aviso-cierre` a propósito (hallazgo 5 de la review de la spec), aunque el revisor la señale.
- Revisión final: `s5` corre en `develop` sin rama de la 0013 — el material basta para medir los ids.
