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
| regla lejos de su paso | «El anuncio sale 4 de 6» (abierta desde 1.2.0) | prioriza o descarta | — |

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

- **Action items de la release anterior**: ninguno; la retro de v1.3.0 no los registró.
- **Qué funcionó**: la feature 0040 salió por debajo de lo estimado (1,5 h reales frente a 2 h, ratio 0,75) y ningún carril superó su estimación.
- **Qué corregir**: n < 5 en todas las tablas, así que las medianas son orientativas. El patch no tiene estimación y su ratio queda en «—». La tabla «Por fase y persona» no tiene datos porque ninguna tarea tiene `timing.json`. El smoke de la release queda pendiente.
- **Action items nuevos**, cada uno con cómo se comprobará en la próxima retro:
  - [A1] Registrar estimación en los patches, para que tengan ratio — la próxima retro muestra ratio en la fila del carril patch.
  - [A2] Registrar `timing.json` en cada tarea — la tabla «Por fase y persona» trae datos en la próxima retro.
  - [A3] Hacer un smoke en la integrada antes del próximo corte — el changelog de la próxima versión no lleva `smoke: pendiente`.
  - [A4] Decidir sobre «El anuncio sale 4 de 6»: priorizarla o descartarla — la fila ya no está abierta en «Lista» sin destino.
