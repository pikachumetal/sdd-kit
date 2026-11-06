---
id: 20261106-101449-patch-0012-slot-format
task: 0012
title: Patch — franja no válida en libres
type: patch
solution: ticket
status: done
created: 2026-11-06
branch: feature/0012-slot-format
commit: pendiente
---

# Patch 0012 — franja no válida en libres

Validación: dev-lead — el patch cambia lo que ve el usuario (un mensaje nuevo) y no hay frase del dev-lead que delegue la validación.

## Capacidades

- Ninguna, porque ninguna capacidad describe `libres`.

## 1. Síntoma

Fila 0012 del roadmap: «`libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Medido en la base actual: `node src/app.js libres 25:00-26:00` imprime `Norte, Sur`, es decir, lista todas las salas como libres.

## 2. Solución fijada (petición cerrada)

Frase literal de la fila 0012 del roadmap (autor: ticket): «**Franja no válida en libres**: `libres 25:00-26:00` responde «franja no válida: usa HH:MM-HH:MM»». Lo que da por existente, comprobado: el comando `libres <franja>` existe (`run` en `src/app.js`) y hoy no valida la franja (deuda «Sin validación del formato de franja horaria»).

## 3. Fix

- **Fichero(s)**: `src/app.js`, `test/app.test.js`
- **Cambio**: `run('libres', …)` comprueba la franja antes de listar y, si no es válida, devuelve el texto de la fila.
- **Decisiones**:
  - Texto de la respuesta, literal — ticket
  - «Válida» = forma `HH:MM-HH:MM` con horas 00–23 y minutos 00–59: lectura literal de HH:MM, necesaria porque 25:00 ya cumple la forma de dos dígitos y solo el rango la rechaza — ticket para las horas (la fila fija 25:00 como inválida); los minutos 00–59 los fijó el agente como parte de esa misma lectura y se anunciaron al dev-lead al abrir: queda para que los vete en la validación
  - No se valida que el fin sea posterior al inicio: la fila no lo pide — ticket (alcance)
  - `libres` sin franja sigue listando todas las salas, como hasta ahora — ticket (sin cambio)

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `libres 25:00-26:00` → «franja no válida: usa HH:MM-HH:MM» (RED visto antes del fix: «actual: Norte, Sur») | ✅ test + ejecución manual |
| 2 | `libres 10:00-12:00` → `Sur` y `libres` → `Norte, Sur` (sin regresión) | ✅ test + ejecución manual |
| 3 | `libres 09:60-10:00` → franja no válida | ✅ ejecución manual |

Revisión del patch (sonnet, effort medium): sin Críticos ni Importantes. Menores: falta test de `libres` sin franja → arreglado (test añadido); `status` adelantado al cierre → es el estado final tras este commit; etiqueta «ticket» de los minutos → reescrita en §3.

Gate: `node --test && node scripts/lint.mjs` → 6/6 tests · lint sin hallazgos

## 5. Tiempo (ligero)

- Estimación: 0,5 h + gate de cierre (`node --test && node scripts/lint.mjs`, suite ~1 s; sin medida previa en el proyecto)
- Inicio: 2026-11-06T10:14Z
- Esfuerzo real: 0,04 h — reloj de la sesión 0,04 h desde 2026-11-06T10:13Z, sin 0 min de espera al dev-lead (0 esperas)
- Coste de sujetos: 74.092 tokens en 1 sujeto claude-sonnet-5-5 (revisor del patch); sin precio en sdd-kit.json
