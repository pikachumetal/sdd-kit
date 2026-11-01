---
release: vX.Y.Z
created: <YYYY-MM-DD>
---

# Retro — vX.Y.Z

> Lo escribe `sdd-retro`, en `.docs/sdd/releases/vX.Y.Z/retro.md`; lo leen el corte siguiente y `sdd-roadmap`. Sin deuda triada, borra el repaso y «Propuestas». Sin estimación pedida, borra su sección. Borra los bloques de ayuda (`>`) al redactar.

<salida de `sdd roadmap causes`, sin tocar>

## Propuestas

> Una fila por causa, con un solo cambio concreto, si tiene dos o más filas abiertas con «Destino» `sin fila`, o una `sin fila` con dos o más casos. Una fila más por cada una abierta desde antes de la retro anterior, tenga o no destino, con `prioriza o descarta` en «Cambio». Ejemplo: `| carga o paralelismo | «El lote de avisos agota su tiempo» | Lanzar el lote con un solo worker en el hook | conectar comprobación |`. Sin ninguna, deja solo la línea `Sin propuestas`.

| Causa | Filas | Cambio | Arreglo |
| --- | --- | --- | --- |

## Estimación y action items

> Solo si el usuario la pide. Sin evidencia no es retro, es opinión: los números salen de `estimation-log.md`.

- **Agregado de la release**: estimado <X> h · real <Y> h (ratio <Z>).
- **Action items de la release anterior**: estado real de cada uno (aplicado, pendiente o descartado, con evidencia). Uno arrastrado dos veces se prioriza o se descarta por escrito.
- **Qué funcionó**: <…>
- **Qué corregir**: <…>
- **Action items nuevos**, cada uno con cómo se comprobará en la próxima retro:
  - [A<n>] <acción> — <cómo se verifica>
