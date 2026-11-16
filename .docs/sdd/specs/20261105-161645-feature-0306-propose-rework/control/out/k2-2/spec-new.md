---
id: 20261106-095949-feature-0012-libres-1000-reservas
feature: 0012
title: Spike — ¿aguanta `libres` con 1.000 reservas?
mode: spike
status: draft
created: 2026-11-06
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — Spike: ¿aguanta `libres` con 1.000 reservas?

🦆 Hoy `salas libres 10:00-12:00` contesta al instante porque solo hay una reserva. Este spike mide cuánto tarda y cuánta memoria gasta cuando hay 1.000 reservas, y deja una tabla con las cifras (100, 1.000 y 10.000 reservas, diez repeticiones cada una). No cambia el comando: si la tabla sale mal, el arreglo se apunta como fila nueva del roadmap. Los umbrales de «aguanta» los he puesto yo (abajo, en ✋): corrígelos si tu listón es otro.

Validación: agente — es una medición de rendimiento: nadie ve nada que la tabla no recoja ya.

## Capacidades

- Ninguna, porque investigación

## ✋ Decisiones que he tomado yo — valida estas

1. **Umbrales de «aguanta»** (nadie dio cifra): O1 mediana de `run('libres', ['10:00-12:00'])` ≤ 5 ms y máximo ≤ 50 ms; O2 invocación completa `node src/app.js libres 10:00-12:00` (arranque de Node incluido) mediana ≤ 200 ms — la sensación de una orden de terminal que responde «al momento».
2. **Peor carga**: 1.000 reservas **activas**, 500 por sala (`Norte`, `Sur`), ninguna en la franja consultada, para que cada sala recorra todas sus reservas sin cortocircuitar. «1.000» es tu cifra; el reparto lo he puesto yo. Contrastes que añado: 100 y 10.000, para ver la pendiente.
3. **Hoy esa carga no existe en el producto**: `bookings` es una constante de `src/app.js:3` con 1 reserva y `reservar` no añade ninguna. Lo medido es, por tanto, una carga sintética sobre el algoritmo de `libres`, no un uso real.
4. **Sin tocar `src/`**: `bookings` y `freeRooms` no se exportan. El arnés (`.docs/sdd/specs/<carpeta>/bench/`) genera una copia temporal de `src/app.js` con la línea 3 sustituida por las N reservas y mide esa copia. Si prefieres exportar el array para medir sin copia, eso es código de producción y va a su fila.
5. **Aguante**: 10 repeticiones seguidas por carga, midiendo también `heapUsed` acumulado tras cada una; si crece de forma sostenida se dice aunque el tiempo cumpla.
6. **Evidencia**: salida en bruto en `evidence/` junto a `research.md`; la máquina y `node --version` (hoy v26.10.0) van en la cabecera de la tabla.
7. **Sin revisión de la spec**: un spike no tiene delta ni Scope que revisar (regla de `review-spec.md`). Sin política de modelos que fijar: no hay despachos en paralelo.
8. **Sin fila de roadmap propia**: el id 0012 salió de `sdd id next`; la fila con lo que resulte (si hay arreglo) se abre al cerrar.

### Decisiones tomadas con el dev-lead

- Medir `libres` con 1.000 reservas y dejar la tabla de medidas — «¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas.»

## Forma spike

- **Pregunta**: ¿`libres` responde dentro del listón con 1.000 reservas?
- **Objetivos**:
  - O1 — tiempo de `run('libres', ['10:00-12:00'])` en proceso con 1.000 reservas activas: mediana ≤ 5 ms y máximo ≤ 50 ms en 10 repeticiones.
  - O2 — tiempo de `node src/app.js libres 10:00-12:00` completo con 1.000 reservas: mediana ≤ 200 ms en 10 repeticiones.
  - O3 — `heapUsed` tras las 10 repeticiones seguidas de O1: sin crecimiento sostenido (la última ≤ la primera + 5 MB).
- **Decisión que desbloquea**: si `libres` necesita un índice o un arreglo antes de que las reservas se guarden de verdad (hoy no se guardan), o puede seguir como está.
- **Peor carga**: 1.000 reservas activas, 500 por sala, ninguna en la franja consultada — confirmada: «con 1.000 reservas»; el reparto va a ✋ (decisión 2).

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| nada: el spike no retira ni cambia nada | `git grep -nE "libres\|0012"` fuera de `specs/`: `src/app.js:28`, `test/app.test.js:5`, `.docs/sdd/changelog.md:10` | no se tocan |

- Filas que implementa: nada: comprobado con `git grep -n 0012` (sin coincidencias fuera de esta spec)

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
