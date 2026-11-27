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
| regla lejos de su paso | «El anuncio sale 4 de 6», «El prompt sale sin su forma» | Mover cada regla junto al paso donde se aplica | mover regla |
| regla lejos de su paso | «El anuncio sale 4 de 6» (abierta desde 1.2.0) | prioriza o descarta | mover regla |

## Estimación y action items

### Por persona

| Persona | n | Real (h) | Ratio | Real > est |
| --- | --- | --- | --- | --- |
| Fixture | 2 * | 1 | 0.75 | 0 |

* n < 5: mediana orientativa.

### Por carril

| Carril | n | Real (h) | Ratio | Real > est |
| --- | --- | --- | --- | --- |
| feature | 1 * | 1.5 | 0.75 | 0 |
| patch | 1 * | 0.5 | — | 0 |

* n < 5: mediana orientativa.

### Por versión marcada del kit

| Versión marcada del kit | n | Real (h) | Ratio | Real > est |
| --- | --- | --- | --- | --- |
| 3.0.5 | 2 * | 1 | 0.75 | 0 |

* n < 5: mediana orientativa.

### Por fase y persona

Sin datos: ninguna tarea tiene timing.json.

- **Action items de la release anterior**: la retro de v1.3.0 no tenía sección de estimación; no hay action items previos.
- **Qué funcionó**: la feature 0040 salió por debajo de lo estimado (1,5 h reales frente a 2 h, ratio 0,75) y el patch sin desvío (real ≤ estimado en ambos carriles).
- **Qué corregir**: n < 5 en todas las tablas, la mediana es orientativa; el patch no tiene estimado, así que su ratio es «—»; ninguna tarea tiene `timing.json`, no hay desglose por fase.
- **Action items nuevos**, cada uno con cómo se comprobará en la próxima retro:
  - [A1] Registrar estimado en los patches para que tengan ratio — la tabla «Por carril» de la 1.5.0 muestra ratio en patch.
  - [A2] Generar `timing.json` en las tareas nuevas — «Por fase y persona» de la 1.5.0 deja de decir «Sin datos».
  - [A3] Priorizar o descartar «El anuncio sale 4 de 6» (abierta desde 1.2.0) — la fila tiene destino o sale de «Lista» en la 1.5.0.
