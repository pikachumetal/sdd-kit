---
id: 20261101-182722-feature-0012-libres-1000-reservas
feature: 0012
title: Medir si `libres` aguanta 1.000 reservas
mode: full
status: in-review
created: 2026-11-01
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Medir si `libres` aguanta 1.000 reservas

🦆 No cambia nada de lo que ves al usar `salas`: este spike solo mide. Hoy `node src/app.js libres 10:00-12:00` responde al instante porque hay 1 reserva; con 1.000 reservas no sabemos cuánto tarda. Al acabar tendrás una tabla con los tiempos para 0, 10, 100, 1.000 y 10.000 reservas, y un veredicto «aguanta / no aguanta» contra el umbral que apruebes aquí. El código de `src/` no se toca. `libres` recorre todas las reservas una vez por sala; la medición dirá cuánto pesa eso.

Validación: agente — es una medición con números; un humano no vería nada que la tabla no diga.

Spike: corre como feature en modo full hasta que el kit tenga su forma propia. Perfil `delegate` (del proyecto).

## Capacidades

- Ninguna, porque es una investigación que no cambia comportamiento observable (`capability index`: «Sin capacidades»).

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: 0 (sin capacidad, sin contrato, sin `MODIFIED`, sin datos, sin dependencias; leí `src/app.js` entero) · tamaño: ~1 fichero de medición, 0 líneas de `src/`
- Mínimo razonable: ninguna review; no queda nada sin cubrir de comportamiento porque el delta es vacío.

1. **Umbral de «aguanta» (tu respuesta sigue pendiente, lo propongo yo):** `libres` con 1.000 reservas aguanta si la mediana de la llamada a la función es ≤ 10 ms y el comando completo (`node src/app.js libres <franja>`) tarda ≤ 200 ms, ambos como p95 de 30 ejecuciones. Es una suposición mía: dime tu número y lo cambio.
2. **Qué se mide:** las dos superficies, función (`run('libres', …)`, sin arranque de Node) y comando completo, porque el arranque de Node (~decenas de ms) puede tapar a la función.
3. **Tamaños:** 0, 10, 100, 1.000 y 10.000 reservas; el último, solo para ver cómo escala y no para el veredicto.
4. **Datos de prueba:** las reservas se reparten entre `Norte` y `Sur`, con 7 días y franjas distintas; la franja consultada coincide con el 10 % de ellas, para que `libres` tenga que comparar y no salga pronto.
5. **No toco `src/app.js`:** `bookings` no se exporta, así que el script de medición genera una copia temporal de `app.js` con N reservas y mide esa copia. Evita añadir una API de pruebas solo para el spike.
6. **Dónde queda la evidencia:** `medidas.md` y el script `medir.mjs` en la carpeta de esta spec; nada en `test/` ni en `scripts/`, para que el gate de cierre no dependa de tiempos.
7. **Validación `agente`:** la propongo porque solo hay números; tú la aprobarías con la spec.

### Decisiones tomadas con el dev-lead

- Quiere la tabla de medidas de `libres` con 1.000 reservas — «¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas.»
- Quiere que, aprobada la spec, se escriba el plan y se pare antes de la Task 1 — «Apruebo. Escribe el plan y para antes de la Task 1.» (dicho antes de ver la spec; no la aprueba, solo fija la parada)

## Intent

Hoy `libres` filtra `rooms` y, por cada sala, recorre `bookings` con `some`: coste ~ salas × reservas, con 2 salas y 1 reserva. Importa porque las reservas viven en memoria y crecen. Éxito: una tabla con mediana y p95 por tamaño y superficie, y un veredicto contra el umbral de la decisión 1. Fracasaría aunque «funcione» si la tabla mezcla el arranque de Node con el coste de `libres` sin separarlos, o si no dice cómo se generaron los datos.

## Scope

- Entra: script de medición, tabla `medidas.md` con método y veredicto.
- No entra: optimizar `libres`, cambiar `src/app.js`, índices o estructuras nuevas. Si el veredicto es «no aguanta», la optimización es otra fila del roadmap, no parte de este spike.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Nada se retira ni cambia de forma | — | — |

- Filas que implementa: nada: comprobado con `grep -n "0012\|libres" .docs/sdd/roadmap.md` (ninguna fila nombra el spike ni `libres`).

## Approach

Un script `medir.mjs` en la carpeta de la spec: para cada tamaño genera una copia temporal de `src/app.js` con N reservas, mide 30 ejecuciones de la función y 30 del comando completo, y escribe mediana y p95 en `medidas.md` junto al método, la versión de Node y la máquina. El plan decide los detalles.

## Dónde se prueba

- Veredicto «aguanta»: se comprueba releyendo `medidas.md` contra el umbral; no hay test automático, porque un test de tiempos sería frágil en el gate.
- `src/` intacto: `git diff develop -- src test scripts` vacío, y `node --test && node scripts/lint.mjs` en verde.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

Ninguno: el spike no cambia comportamiento observable.

## Enmiendas

_Ninguna._

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Fixture | 2026-11-01 | pendiente |
