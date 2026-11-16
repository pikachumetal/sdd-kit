---
id: 20261105-211051-feature-0012-libres-1000-reservas
feature: 0012
title: ¿Aguanta `libres` con 1.000 reservas?
mode: spike
status: draft
created: 2026-11-05
author: Fixture
approvers:
  - name: TBD
    approved_at: null
---

# Spec — ¿Aguanta `libres` con 1.000 reservas?

🦆 Hoy nadie sabe cuánto tarda `libres` cuando hay muchas reservas: el comando mira las reservas una a una para cada sala. Voy a medirlo con 10, 100, 1.000 y 10.000 reservas activas y a darte una tabla. Ejemplo: con 1.000 reservas, `libres 10:00-12:00` debería contestar en menos de 50 ms, y repetirlo no debe comerse memoria. No toco el código del comando: si la medida descubre un problema, sale una fila nueva en el roadmap. Falta decidir el umbral de «aguanta»: he puesto 50 ms y está en ✋.

Validación: agente — es una medida de rendimiento: una persona no vería nada que el agente no haya medido ya.

## Capacidades

- Ninguna, porque investigación.

## ✋ Decisiones que he tomado yo — valida estas

Revisión de la spec: sin revisores (un spike no pasa por `review-spec.md`; es una medida de un solo comando y sin código de producción). Lo que no cubre: nadie contrasta el umbral ni el método antes de medir; los dos están en esta lista para que los valides tú.

1. **Umbral de «aguanta»: p95 por llamada ≤ 50 ms** — nadie dijo uno; 50 ms es la mitad de lo que una persona nota como respuesta instantánea (~100 ms) en una herramienta de línea de comandos.
2. **Peor caso de la carga: ninguna reserva coincide con la franja consultada** — así `libres` recorre las 1.000 reservas completas para cada una de las 2 salas (2.000 comparaciones), que es lo máximo que puede hacer hoy.
3. **Tamaños medidos: 10, 100, 1.000 y 10.000** — 1.000 lo pediste tú; 10, 100 y 10.000 los añado para ver cómo crece el tiempo y cuánto margen queda (10×).
4. **Se mide la función `run('libres', …)` dentro de un proceso, no el comando entero** — las reservas viven en memoria y cada ejecución de `node src/app.js libres …` arranca con una sola, así que con el comando entero nunca habría 1.000. El arranque de Node no se mide.
5. **Cómo se cargan las reservas sin tocar `src/app.js`**: un script de medida (en la carpeta de este spike, no en `src/`) lee `src/app.js`, sustituye la lista inicial de reservas por 1.000 generadas, la guarda en una carpeta temporal fuera del repo y la importa. Descartadas: exportar `bookings` desde `src/app.js` (sería código de producción, que un spike no deja) y copiar a mano `freeRooms` en el script (mediría una copia, no el código real).
6. **Una repetición = 1.000 llamadas seguidas; se hacen 10 repeticiones seguidas por tamaño**, con 100 llamadas de calentamiento descartadas. Tiempo por llamada con `performance.now()`; se anotan mediana y p95. «Recurso acumulado» = `heapUsed` tras cada repetición.
7. **O2, memoria: el `heapUsed` tras las 10 repeticiones no crece más de 5 MB sobre el de la primera** — cifra mía.
8. **Máquina de la medida: Node v26.10.0** — es el que hay instalado; `tech-stack.md` dice Node 22 y aquí no está. La tabla lo dice y no se extrapola a 22.
9. **Carpeta: `.docs/sdd/specs/`** — `sdd-kit.json` pide el kit 3.0.0 (carpeta `changes/`), pero el proyecto sigue en la estructura 2.x y no tiene `changes/`. Sigo la de sus specs vigentes, en la regla de oro de `sdd-propose`.
10. **Capacidades: ninguna** — es una investigación; el spike no deja código de producción ni comportamiento nuevo.
- Política de modelos: revisores de la spec, ninguno · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura según el plan · otros despachos en paralelo: ninguno (un solo script de medida) · en paralelo hasta `control.maxParallelAgents` — al aprobar la spec, esta línea es la confirmación de paralelizar que pidan las instrucciones del usuario; lo que no nombra se confirma aparte
- Coherencia: comprobada. Sin `MODIFIED` ni nada que se retire; sin delta que fusionar.

### Decisiones tomadas con el dev-lead

- La carga es 1.000 reservas — «¿Aguanta el comando libres con 1.000 reservas? Quiero la tabla de medidas.»

## Forma spike

- **Pregunta**: ¿Responde `libres` dentro del umbral cuando hay 1.000 reservas activas, y cuánto margen queda?
- **Objetivos**:
  - O1 — con 1.000 reservas activas, el p95 por llamada de `libres` es ≤ 50 ms.
  - O2 — tras 10 repeticiones seguidas con 1.000 reservas, el `heapUsed` no crece más de 5 MB sobre el de la primera repetición.
  - O3 — con 10.000 reservas activas, el p95 por llamada de `libres` es ≤ 50 ms (margen de 10×).
- **Decisión que desbloquea**: si hace falta abrir una fila para arreglar `libres` (índice por franja, por ejemplo) o se puede seguir sin tocarlo.
- **Peor carga**: 1.000 reservas activas ninguna en la franja consultada, 2 salas — confirmada: «¿Aguanta el comando libres con 1.000 reservas?» (el número es del dev-lead; que ninguna coincida es mío, decisión 2).

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| | | pendiente |
