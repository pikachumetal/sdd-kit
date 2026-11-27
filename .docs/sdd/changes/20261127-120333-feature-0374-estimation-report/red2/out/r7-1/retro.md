---
release: v1.4.0
created: 2026-11-27
---

# Retro — v1.4.0

## Repaso por causa

| Causa | En espera | Lista |
| --- | --- | --- |
| regla lejos de su paso | 1 | 2 |
| defecto del producto | 0 | 1 |

## Abiertas en «Lista»

| Ítem | Causa | Casos | Destino | Abierta desde |
| --- | --- | --- | --- | --- |
| El anuncio sale 4 de 6 | regla lejos de su paso | 2 | sin fila | 1.2.0 |
| El prompt sale sin su forma | regla lejos de su paso | 1 | sin fila | 1.4.0 |
| `--planta 2` lista otra planta | defecto del producto | 1 | 0030 | 1.4.0 |

Cerradas desde la 1.3.0: 1

## Propuestas

| Causa | Filas | Cambio | Arreglo |
| --- | --- | --- | --- |
| regla lejos de su paso | «El anuncio sale 4 de 6», «El prompt sale sin su forma» | Mover la regla junto al paso que la aplica, en un solo cambio para las dos filas | mover regla |
| regla lejos de su paso | «El anuncio sale 4 de 6» | prioriza o descarta (abierta desde 1.2.0, anterior a la retro de 1.3.0) | mover regla |

## Estimación y action items

- **Agregado de la release**: estimado 2 h · real 1,5 h (ratio 0,75), una sola feature (0040), según `estimation-log.md`. Una muestra no da tendencia.
- **Action items de la release anterior**: ninguno; la retro de v1.3.0 no tenía sección de estimación ni action items.
- **Qué funcionó**: la feature 0040 entró bajo lo estimado y con walkthrough.
- **Qué corregir**: el walkthrough de 0040 deja la sección 5 sin aprendizajes y con la línea `Retro:` sin rellenar; la causa «regla lejos de su paso» sigue abierta desde la 1.2.0 sin destino.
- **Action items nuevos**, cada uno con cómo se comprobará en la próxima retro:
  - [A1] Decidir (priorizar o descartar) «El anuncio sale 4 de 6» — la fila tiene `Destino` distinto de `sin fila` o ha salido de `debt.md`.
  - [A2] Rellenar la línea `Retro:` del walkthrough de cada cambio que se cierre — ningún walkthrough de la 1.5.0 conserva la plantilla `<señal>`.
