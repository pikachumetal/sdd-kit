---
id: 20260923-080000-patch-0011-cancel-usage
task: 0011
branch: feature/0011
commit: (el del fix en feature/0011)
---

# Patch — cancelar sin hora

## 1. Síntoma

`salas cancelar mar` respondía `cancelada mar undefined`.

## 2. Causa raíz

`run` no comprobaba que llegara la hora.

## 3. Fix

`cancelar` sin hora devuelve `Uso: cancelar <día> <HH:MM>`. Test de regresión en `test/app.test.js`.

## 4. Verificación

| Caso | Antes | Ahora | Por |
| --- | --- | --- | --- |
| `salas cancelar mar` | `cancelada mar undefined` | `Uso: cancelar <día> <HH:MM>` | agente, ejecución real |

Suite: `node --test`, 6/6.

## 5. Tiempo

- Esfuerzo real: 0,3h