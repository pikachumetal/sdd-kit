# GREEN de la feature 0281 — los pasos de lo que se retira

Salidas en `green/`, `refactor/` y `refactor2/` de la carpeta de la spec. Fila `CO6`, leída a mano.

| Tanda | Texto | `co6` | Controles |
| --- | --- | --- | --- |
| `green` | «search each name, its numbered steps and each id» | 1/2 | `co5` 1/1, `sp1` 2/2, `t1` 2/2 |
| `refactor` | «…and its numbered steps, even bare («paso 7»)» | 1/2 | `sp1` 2/2 |
| `refactor2` | frase propia: «For a retired skill's numbered steps, also `grep -rnE "(paso\|step) <n>\b" capabilities/`: each bare hit goes in that table.» | 2/2 | `s1` 2/2 |

Los fallos de las dos primeras tandas son el del RED: `grep` solo del nombre. Reescribir la frase no lo movió; una orden con su comando, sí (Art. II). En `refactor2`, los dos sujetos separan el «paso 2» de `aviso-apertura`, que no se retira.

Saldo de `skills/sdd-propose/SKILL.md`: 5.303 → 5.301, medido con `split(/\s+/)`. Coste de la campaña: 9,82 $ de 27 sujetos, frente a 13,30 $ previstos para 19.
