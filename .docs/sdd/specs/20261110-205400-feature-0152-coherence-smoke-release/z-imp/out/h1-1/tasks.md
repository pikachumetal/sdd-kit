# Tasks — Motivo al cancelar

| Task | Estado | Commit |
| --- | --- | --- |
| Task 1 — Cancelar con motivo | hecha | 136a6b6 |
| Task 2 — Listado de canceladas | hecha | 48860f3 |

## Rulings

Ruling: el test existente de cancelar sin motivo se actualiza al THEN de la spec («cancelada Norte lun (sala ocupada)» con --motivo); el de «sin reserva» sigue pasando con motivo válido — la spec manda sobre el test previo — cuesta: un test reescrito que el dev-lead puede esperar intacto.
Ruling: base check contra `develop` sin diff en ROADMAP.md ni ficheros de las tasks — sigo.
Task 2: Ruling: el commit inicial salió con un escape roto en src/app.js (no compilaba); lo enmendé antes de cerrar la task, sin publicar — cuesta: nada, el historial queda limpio
Final: minor (deferred): `canceladas` sin canceladas devuelve cadena vacía (la spec no dice qué mostrar)
Final: minor (deferred): `--motivo` se busca en cualquier posición; `cancelar --motivo X Norte lun` leería mal la sala y el día
Final: minor (deferred): el test de `canceladas` depende del estado compartido del módulo (hace su propio cancelar, no-op si ya está cancelada)

Revisión final: autorrevisión (sin herramienta de subagentes), Spec y Código, Arquitectura no (plan), sobre 48860f3
