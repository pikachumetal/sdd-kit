---
kit_version: 3.0.3
lane: patch
id: 20261119-121144-patch-0360-estimation-log-empty-project
task: 0360
mode:
date: 2026-11-19
---

# Ticket para el kit — patch 0360: sdd estimation log sin changes/ ni specs/ escribe el log con su cabecera y cero filas

- Contexto: patch (fallo determinista), perfil delegate, validación en campo; claude-opus-5-5 en el hilo, un revisor claude-sonnet-5-5
- Coste: 0,18 h frente a 0,32 h estimadas (0,25 h + 0,07 h del gate); hilo 5.934.281 tokens, subagentes 183.389 en 1 despacho, sesión 2,79 $ (`sdd session tokens`, §5 de `patch.md`)
- Nada que reportar

## Menores

- El `grep` previo al fix buscó el literal del mensaje de error y no encontró `cli/test/estimation/layout.test.ts`, que lo comprueba con otra expresión (`/changes\/ ni specs\//`): el test que codificaba el `AND` retirado salió rojo en la verificación y se reescribió (~5 min). Buscar por la cláusula del `MODIFIED`, no por el literal, lo habría encontrado antes — `skills/sdd-implement/references/patch-flow.md` paso 4 («grep every caller» de ponytail cubre el código, no los tests que fijan el requisito).
- Una primera verificación con `test/merge` entero tardó 311 s y pasó a segundo plano por el timeout de 300 s de la herramienta; `operations.md` §Testing ya pide pasar solo los ficheros de la task — no localizado en el kit.
- El revisor marcó que el mensaje «No se encuentra changes/ ni specs/ bajo .docs/sdd ni docs/sdd» ahora solo sale sin ninguna de las dos carpetas y nombra un criterio que ya no aplica; no se cambió porque el texto visible no lo fijaba el ticket (`patch.md` §4) — `cli/src/estimation/log.ts`, `notFound`.
