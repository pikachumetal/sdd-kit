# Tasks — Verificación de cierre, qué cuenta (registro vivo)

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | Parar lo arrancado por su PID o su puerto | done | 7bf1079 | GREEN con la Task 2: 6/6 |
| 2 | La validación dice de dónde sale cada THEN | done | 761cd91 | GREEN web: evidencia por THEN, 400 y duración 4/4 |
| 3 | `task-done` solo con el commit hecho | done | 4b48edb | GREEN sin disparador 4/4 (d1, d2): deuda |
| 4 | Un THEN que depende de la base declara cómo se valida | done | 25ef292, 1406c2c | GREEN 0/2 con la línea solo en la plantilla; REFACTOR 2/2 con ella en el paso 4 |
| 5 | Aprendizajes en los docs vivos | done | 2f7a915 | |

Evidencia de la campaña: `9dcfbf9` (GREEN y REFACTOR de las Tasks 3 y 4). Integración de `develop` (patch 0078): `2fd8a9b`.

Revisión final: sdd-kit:effort-high + opus, «With fixes»: 0 Critical, 5 Important (arreglados en `de6fb50` y `cbf33b9`, el del puerto con GREEN 2/2), 5 Minor (2 corregidos en la evidencia, 3 diferidos a deuda).

Rulings de la ejecución (del ledger):

- Task 1: el GREEN conductual de la Task 1 se mide con la campaña web de la Task 2 (`v7f` mide las dos a la vez).
- Task 2: `patch-template.md` conserva la tabla 4.2 vieja: la spec solo cambia el walkthrough de feature y el carril patch no pasa por el paso 7.
- Task 3: `develop` trajo el patch 0078 con cambios en `SKILL.md` (paso 2 y una fila de racionalizaciones). El freno «fichero cambiado en la base» lo resolvió de antemano el dev-lead («Corre en paralelo con el patch 0078 (paso 2)…»); la fila 0036 no cambió. Integrado en `2fd8a9b`.
- Task 3: GREEN sin disparador 4 de 4; queda como deuda con su evidencia.
- Task 4: la línea solo en la plantilla dio 0/2 en el GREEN; la regla va también al paso 4 (`1406c2c`), y el REFACTOR da 2/2.
- Tasks 3 a 5: `task-done` de las tres se ejecutó al final de la campaña y no al cerrar cada una, así que sus líneas del ledger acaban todas en `2f7a915`. Los commits de cada task son los de esta tabla.
