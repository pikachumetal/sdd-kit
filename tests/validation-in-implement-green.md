# GREEN — la validación en `sdd-validate` (feature 0362), lectura parcial

Campaña de la Task 8 con la copia del kit de la rama (`dist/` de `82e3f6212`, con `sdd-validate`). Sonnet, 32 sujetos (`vf1`…`vf7` n = 2 y los once escenarios movidos con su n), 24,17 $. La primera tanda (35 sujetos, 27,7 $) se descartó: los moldes de la batería de `sdd-validate` llevaban ya la línea `Validación en campo:` en el borrador del walkthrough y la columna «Esperado» de los diez movidos seguía en `sdd-archive`; se corrigieron antes de repetirla. `av1` y `av2` de la primera tanda valen para `av1`; `av2` se repite con el molde corregido (el commit del test roto movía `HEAD` más allá de la revisión final y el sujeto se paraba antes de ver el rojo).

**La puerta** (`battery.mjs run`) sale verde en los 18 escenarios: el primer skill que invoca cada sujeto es `sdd-validate` (o `sdd-archive` en `av1` y `av2`). **La conducta** la dan `tools.txt` y `texts.txt` de cada sujeto (en `green/out/`) contra la rúbrica; está leída solo en parte:

| Escenario | Lo leído | Estado |
| --- | --- | --- |
| vf1 | gate (`node --test` y e2e), recorrido del script, ejes de la revisión final y mensaje de validación, en ese orden, sin `sdd-archive`; 2 de 2 | pasa |
| vf2 | tras «el paso 3 falla» devuelve a `sdd-implement` como task con su test en los dos sujetos; `vf2-1` se para a preguntar «¿Lanzo la revisión final ahora?» | pasa en vuelta y gate; el paro por el coste de los ejes es una duda |
| vf3 | `vf3-1` recorre el paso, escribe el RED, arregla y vuelve a validar antes de la revisión; `vf3-2` se para a preguntar «¿Arranco la task de arreglo?» | 1 de 2: el paro en `delegate` es un fallo |
| vf4 | invoca `sdd-archive` con la validación diferida (`vf4-1`, fusiona) | pasa, 2 de 2 por su señal |
| vf5 | un patch presenta la validación sin ejes y espera (2 de 2) | pasa |
| vf6 | gate filtrado, no sin filtro: ver «Por leer» | por leer |
| vf7 | pasada de fix y vuelta a `sdd-validate`; `vf7-1` espera tu validación | por leer |
| movidos (`g1`…`t3`, `g7`) | puerta verde 11 de 11; su rúbrica sin leer | por leer |
| av1 | devuelve a `sdd-validate` sin escribir nada, «No terminado» (2 de 2, primera tanda) | pasa |
| av2 | primera tanda con el molde viejo: `av2-2` devuelve a `sdd-implement`, `av2-1` se paraba antes de ver el rojo | se repite con el molde corregido |

## Por leer y por hacer

- Rúbricas sin leer: `VF6`, `VF7`, las once filas de los movidos y `AV2` con el molde nuevo.
- Dos paros que la regla de `delegate` no admite (`vf3-2`, `vf2-1`): candidatos a una ronda de REFACTOR con el contraejemplo medido.
- Controles (`h1 h2 g1 a1`, `a3 a3r a3a a5`) y humo de las cinco skills editadas, sin lanzar.
- Coste acumulado de la feature: 17,91 $ de RED y ~52 $ de GREEN (con la tanda descartada), ~70 $ en total frente a ~89 $ de previsión.
