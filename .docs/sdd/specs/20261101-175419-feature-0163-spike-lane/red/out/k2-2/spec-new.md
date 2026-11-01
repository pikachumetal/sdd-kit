---
id: 20261101-183016-feature-0012-libres-1000
feature: 0012
title: Spike — ¿aguanta `libres` con 1.000 reservas?
mode: full
status: draft
created: 2026-11-01
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Spike: ¿aguanta `libres` con 1.000 reservas?

🦆 Hoy nadie sabe cuánto tarda `libres 10:00-12:00` cuando hay muchas reservas: el código recorre todas las reservas por cada sala y no está medido. Esto no cambia nada de lo que ves en la herramienta: añade un script que siembra 10, 100, 1.000 y 10.000 reservas, mide cuánto tarda `libres` en cada caso y deja una tabla con un «pasa» o «falla» frente a un umbral (mío, por validar: 50 ms en el peor caso con 1.000). Ejemplo de fila: «1.000 reservas · franja ocupada · mediana 0,02 ms · p95 0,05 ms · pasa». Por dentro, el script mide una copia temporal de `src/app.js` con las reservas sembradas, así que `src/app.js` no se toca.

Validación: agente — es una medición con un número y un umbral, y ninguna persona observaría nada que el script no haya medido ya.

## Capacidades

- Ninguna, porque herramientas: el spike mide y no cambia comportamiento observable.

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 (sin capacidad nueva, sin contrato público, sin `MODIFIED`/`REMOVED`, sin datos persistentes, sin dependencias; leí `src/app.js` entero y los tests) · tamaño: ~60 líneas en 2 ficheros nuevos
- Mínimo razonable: ninguna revisión — deja sin mirar que el umbral esté bien puesto, y eso lo valida el dev-lead aquí.

1. **Umbral de «aguanta»: p95 ≤ 50 ms por llamada con 1.000 reservas, en las dos franjas.** No me lo dijiste: la pregunta del umbral sigue sin respuesta. Elegí 50 ms porque por debajo de ~100 ms una orden de terminal se siente instantánea. Es lo que más te pido que valides.
2. **Qué se mide: `run('libres', [franja])` en proceso**, no la CLI de punta a punta. Hoy la CLI arranca cada vez con 1 reserva en memoria, así que 1.000 reservas no pueden existir entre dos ejecuciones.
3. **Tamaños: 10, 100, 1.000 y 10.000 reservas**, con las 2 salas reales. El 10.000 solo da margen para ver la tendencia; el umbral se aplica a 1.000.
4. **Dos franjas por tamaño**: «ocupada» (hay reservas activas en esa franja) y «libre» (ninguna). Con las dos se ve el mejor y el peor caso del recorrido.
5. **Estadística**: 1.000 llamadas por celda tras 200 de calentamiento; se publican mediana y p95 en ms. Se anota la versión de Node y el equipo.
6. **Cómo se siembran las reservas**: el script escribe una copia de `src/app.js` en la carpeta temporal del sistema con `bookings` sustituido por las N reservas, y la importa. `src/app.js` no cambia, sin exportar `bookings` ni tocar el producto.
7. **Dónde queda la tabla**: `medidas.md` en esta carpeta, y el script en `scripts/bench-libres.mjs`.
8. **Validación: agente** (ver arriba).
9. **Si falla el umbral**: el spike solo informa. Optimizar `freeRooms` sería otra feature, con su fila.
- Política de modelos: sin revisores de spec · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · sin otros despachos en paralelo.

## Intent

Hoy `libres` hace, por cada sala, un `some` sobre todas las reservas (`freeRooms` en `src/app.js`); está pensado para pocas reservas y no hay ninguna medida. Importa saber si el diseño actual llega a 1.000 reservas o si hay que rehacerlo antes de que crezcan. Éxito: una tabla de medidas reproducible (10 / 100 / 1.000 / 10.000 reservas × franja ocupada y libre) con mediana, p95 y un veredicto frente a 50 ms de p95 con 1.000. Fracaso aunque «funcione»: que la tabla no se pueda repetir, o que para medir haya que cambiar el comportamiento del producto.

## Scope

- Entra: `scripts/bench-libres.mjs` (siembra, mide y escribe la tabla), `test/bench-libres.test.js` (la forma de la tabla con tamaños pequeños) y `medidas.md` con la tabla medida.
- No entra: cambiar `freeRooms` o cualquier fichero de `src/`; medir la CLI de punta a punta; más salas que las 2 reales; persistencia; optimizar si falla.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `grep -n "libres\|1.000" .docs/sdd/roadmap.md` (sin resultados; no hay `capabilities/`).

## Approach

El script construye N reservas (`room` alternando `Norte` y `Sur`, `day` rotando, `slot` repartidas, `status: 'active'`), genera la copia temporal de `src/app.js` con ellas, importa `run` y cronometra `run('libres', [franja])` con `performance.now()`. Imprime la tabla en Markdown y la escribe en `medidas.md`. Exit code 0 siempre: el veredicto va en la tabla. El detalle va en el plan.

## Dónde se prueba

- Forma de la tabla (columnas, una fila por tamaño y franja, veredicto «pasa»/«falla»): `node --test`, en `test/bench-libres.test.js`, con tamaños 10 y 100 para que dure poco, como los tests de `libres` actuales.
- La medida con 1.000 reservas: ejecutando `node scripts/bench-libres.mjs`; la evidencia es `medidas.md`.
- `src/app.js` intacto: el gate (`node --test && node scripts/lint.mjs`) sigue verde y `git diff develop -- src` queda vacío.

## Términos y ADR

- Términos resueltos: aguanta — p95 ≤ 50 ms por llamada con 1.000 reservas (propuesto, ✋ 1)
- ADR candidatas: ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
