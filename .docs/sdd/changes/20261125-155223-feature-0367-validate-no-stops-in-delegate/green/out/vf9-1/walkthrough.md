---
id: 20261120-090000-feature-0030-libres-load
feature: 0030
title: Walkthrough — ¿Aguanta `libres` 1.000 reservas?
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-11-25
---

# Walkthrough — ¿Aguanta `libres` 1.000 reservas?

## 1. Cambios realizados

- Spike sin cambios de producto: solo `medidas/` y `research.md` en la carpeta del spike.
- O1: `medidas/medir-libres.mjs` (copia literal de `freeRooms` con un contador) y `medidas/o1-libres.txt` — dc3278d.
- O2: modos `--memoria` y `--base` del script y `medidas/o2-memoria.txt` — ede5d44, 38fa8d9.
- O3: sin medir, a falta de una recepcionista — d8d54d3.
- `research.md` con las tres filas y la recomendación «seguir con las reservas en memoria» — 38fa8d9.

## 3. Desviaciones del plan

- La Task 2 dio O2 por `no medido` aunque se podía medir. `sdd-validate` lo detectó y se midió en una Task 3 añadida al final del plan.

### Decisiones tomadas sin el dev-lead

- Recomendación invertida tras la revisión final: de «no seguir en memoria» a «seguir en memoria», porque la primera descansaba solo en O1, que da 2.000 por construcción con cualquier almacenamiento — si está mal, la 0014 mantiene las reservas en memoria sin un motivo medido a favor — ver research.md §4.
- Diferidos (Minor): aguante en prosa y no en tabla; la carga «1.000 en una semana» no cabe con 2 salas × 5 días × 4 franjas (40 reservas activas como máximo) y `freeRooms` ignora `day`; cabecera de `o2-memoria.txt` sin decir que `rep N:` y `base N:` los añade el bucle; plan.md Task 3 sin citar las 3 mediciones `--base`.

## 4. Verificación

### 4.1 Builds

- Revisión final sobre bc54309; `ad76d1b` (research.md y tasks.md, menos de 20 líneas de documentación) revisado en el hilo.
- Gate: no corrió — ningún fichero commiteado fuera de `changes/` cambió desde el `merge-base`.

### 4.2 Smoke / tests

- Validación en campo: 2026-11-25 · filas de `research.md` comprobadas contra su evidencia (O1 reproducido a 2000 comparaciones por la re-revisión; O2 55,1–55,2 MB con 1.000 reservas y 55,0 MB sin ellas, regenerado con los comandos de la cabecera de `o2-memoria.txt`); revisión final Spec: No, 1 Critical y 2 Important arreglados; re-revisión Spec sobre bc54309..ea063df: con fixes, 0 Critical y 0 Important, 3 Minor arreglados en el hilo y 2 diferidos; O3 no medido con una persona.

| Objetivo | Evidencia | Resultado |
| --- | --- | --- |
| O1 — < 1.000 comparaciones | ejecución real | no cumple tal como se definió: 2000 en las 10 repeticiones |
| O2 — < 50 MB | ejecución real | no cumple tal como se definió: RSS 55,1–55,2 MB; la base de Node ya da 55,0 MB |
| O3 — < 10 s con una persona | no probado | no medido con una persona |

### 4.3 Residuales / deuda generada

- O1 mide el algoritmo, no el almacenamiento; si importa, queda como otra investigación (recorrido por franja, hipótesis no medida).
- O3 sigue sin medirse con una recepcionista.

## 5. Aprendizajes

- Sin aprendizajes para los documentos vivos.

Retro: sin señales

## 6. Adendas

_Ninguna._
