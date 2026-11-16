# GREEN — el cierre guarda `timing.json` y la causa cita las esperas (feature 0192)

Batería de `sdd-archive`, molde `reservas-timing`, Sonnet.

| Escenario | n | Falla si | Resultado |
| --- | --- | --- | --- |
| `tf1` | 1 | `timing.json` no queda en la carpeta del artefacto | pasa, 1/1, 0,18 $: `version: 1`, `withinMargin: true`, 12000 s de espera (las dos del transcript sembrado) |
| `tc1` | 3 | «Causa de la desviación» no cita las esperas por hora y minutos ni dice «sin medir» | pasa, 3/3; en RED, 0/3 |
| `tf2` | 1, control con el texto final | `timing.json` no entra en la historia | pasa, 1/1, tras añadir `estimation.md` al molde |

Las causas de `tc1`:

- `tc1-1`: «…las esperas, 09:40Z 140 min y 12:40Z 60 min, ya están fuera del esfuerzo real».
- `tc1-2`: «esperas y huecos: 09:40Z 140 min; 12:40Z 60 min (ya descontadas del esfuerzo real); el resto, sin medir».
- `tc1-3`: «las esperas (09:40Z 140 min; 12:40Z 60 min) ya están descontadas del esfuerzo real, así que no la explican; el resto no se midió («sin medir»)».

**Dos tandas sin valor, y por qué.** Las dos primeras pasadas de `tf2` cerraron sin `timing.json`: el molde no tenía `.docs/sdd/estimation.md`, y el paso de tiempo real es condicional a él. No es un fallo de la skill. Cuestan 0,75 $ de los 2,82 $ de la campaña, en 9 sujetos, frente a los 8,25 $ de techo.

**Texto medido**: `tc1` corrió con la frase larga de la causa; para el saldo se acortó en 4 palabras, y `tf2` es el control con la frase final. Su causa cita las esperas por hora y minutos.

**Saldo de palabras**, antes → después: `sdd-archive` `SKILL.md` 4846 → 4844, entera 9915 → 9913; `sdd-templates` 16796 → 16786 con el `--artifact` de las plantillas; kit 102448 → 102436.
