---
id: 20261101-190941-feature-0012-libres-1000-reservas
feature: 0012
title: ¿Aguanta `libres` con 1.000 reservas?
mode: spike
profile: delegate
status: draft
created: 2026-11-01
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — ¿Aguanta `libres` con 1.000 reservas?

🦆 Para quien usa `salas` no cambia nada: este spike no toca el producto. Lo que cambia es que sabrás, con una tabla, si `libres 10:00-12:00` sigue contestando al instante cuando hay 1.000 reservas en memoria, o si hay que optimizarlo. Ejemplo: con 1.000 reservas, `node src/app.js libres 10:00-12:00` tarda X ms de media, y la tabla separa los ms del arranque de Node de los ms de `libres`. Para medirlo se genera una copia del programa con 1.000 reservas inventadas, sin modificar `src/app.js`.

Validación: agente — es una medición con cifras en bruto; ninguna persona observaría nada que el agente no haya medido ya.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

Revisión de la spec: no aplica, la revisión por lentes es del modo full. Hago el repaso de coherencia yo. No hay delta de capacidades, así que `capability merge` no tiene qué probar.

1. **La peor carga** son 1.000 reservas activas, 500 por sala (Norte y Sur) y repartidas en días distintos, **ninguna en la franja consultada** (`10:00-12:00`): así `some` recorre las 1.000 en cada sala y es el caso más lento de `libres`. Tú dijiste «1.000 reservas»; el reparto es mío (`sin confirmar`).
2. **Qué cuenta como cumplido (O1)**: las 10 repeticiones seguidas del comando completo, cada una por debajo de 200 ms; con una sola por encima, `no cumple tal como se definió`. Tú diste el umbral de 200 ms; el criterio de las 10 repeticiones es mío.
3. **Cómo se inyectan las 1.000 reservas**: un script del spike lee `src/app.js`, sustituye solo la línea de `bookings` por las 1.000 generadas y lo escribe como copia en una carpeta temporal fuera del repo; las mediciones ejecutan esa copia con `node`. `src/app.js` no se modifica y el script vive en la carpeta del spike, no en `src/`.
4. **Medidas de apoyo, sin umbral**: la misma medida con 1, 100, 1.000 y 10.000 reservas, y el tiempo de `libres` en proceso (función sola, con `performance.now()`) junto al del comando completo, para separar arranque y función y ver cómo crece. Los tamaños 1, 100 y 10.000 son míos.
5. **Qué se guarda**: la salida en bruto de cada medición en `evidencia/` dentro de esta carpeta, y las cifras resumidas en `research.md`, con la tabla de «Aguante» (10 repeticiones). Si el crecimiento de memoria no es medible con `process.memoryUsage()`, se dice en la tabla.
6. **Validación `agente`** (arriba): propuesta mía; al no ser una aprobación por delegación, la apruebas con la spec.

### Decisiones tomadas con el dev-lead

- Criterio de "aguanta": el comando completo (`node src/app.js libres 10:00-12:00`, arranque de Node incluido) en menos de 200 ms con 1.000 reservas, midiendo también la función sola — «Apruebo» (a la opción 1️⃣ recomendada).
- Parar antes de la Task 1 — «Escribe el plan y para antes de la Task 1».

## Forma spike

- **Pregunta**: ¿responde `libres` en menos de 200 ms, arranque de Node incluido, con 1.000 reservas en memoria?
- **Objetivos**: O1 — `node src/app.js libres 10:00-12:00` con 1.000 reservas tarda menos de 200 ms en cada una de 10 repeticiones seguidas.
- **Decisión que desbloquea**: si hace falta una fila de optimización de `libres` en el roadmap o si se deja como está.
- **Peor carga**: 1.000 reservas activas, 500 por sala, ninguna en la franja consultada — `sin confirmar`, y va a ✋ (decisión 1).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada | — | — |

- Filas que implementa: nada: comprobado con `grep -rn 0012 .docs README.md PRODUCT.md` (sin resultados); este spike no tiene fila de roadmap.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
