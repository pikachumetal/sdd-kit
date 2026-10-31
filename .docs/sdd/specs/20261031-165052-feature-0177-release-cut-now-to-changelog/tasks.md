# Tasks — feature 0177

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — `sdd-end-release` corta desde Now | ✅ | fce3725a |
| 2 — Los cierres dejan el changelog al corte | ✅ | 0d4c241f |
| 3 — Fuera el changelog de cliente y el email | ✅ | e82a6f03 |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre e82a6f03
Pasada de fix: juntada en el cierre, 5 Important y 13 Minor, sin RED salvo a3 (no reproducido)
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, hallazgos resueltos; 2 Important nuevos arreglados en el hilo

## Rulings

Task 2: Ruling: el tramo de sdd-archive son 6 sujetos (a9, rc1, rc2 con n=2), no 3, y rc1 y rc2 pasan a molde 3.0.0 porque el corte para en 2.x — son los que miden esta edicion — coste si mal: 1,5 $ mas dentro del techo
Task 3: Ruling: el grep de la Task 3 deja dos lineas en sdd-end-release: son la prohibicion del email, no un uso — coste si mal: ninguno
Final: Ruling: a3-1 (RED) no reproduce la reescritura de un disparador ajeno; aclaro el texto igual por ser una contradicción de lectura — coste si mal: ninguno
Final: Ruling: 0007 de Nothing to publish se comprueba con a4; "cinco pasos" de release-flow.md:169 sigue hasta la 0152, porque cambiarlo es un THEN y una enmienda solo por un número — coste si mal: un número desfasado en una capacidad
Final: Ruling: la fecha "not earlier" se queda frente al "posterior" de la spec: con migración y corte el mismo día, si no, no se rescataría nada — coste si mal: una pregunta repetida en dos cortes del mismo día
Final: Ruling: roadmap-template (2.x) y el delta de onboarding con "(0157)" no se tocan, son anteriores a esta rama — coste si mal: ninguno
Final: Ruling: release-notes.md conserva el nombre aunque defina el smoke; ✅ sin artefacto queda sin sujeto (e-1 lo mostró), y lo dicen el walkthrough — coste si mal: un sujeto futuro lo mide
Final: Ruling: a4 no se relanza: el techo de 32 sujetos de la spec ya está gastado y pasarlo es decisión del dev-lead; «Nothing to publish» queda por lectura y el único sujeto en esa condición publicó desde carpetas sin fila, con molde contaminado — coste si mal: un corte publica un cambio cerrado sin fila, o sella una versión casi vacía, con la versión aún por confirmar
Final: Ruling: «prepare steps 1-6» con el validador en el paso 7 no se retoca: tocar la skill tras la re-revisión iría sin revisar, a4-1 lo ejecutó y lo refuerza un red flag — coste si mal: con el usuario ausente, un corte preparado sin pasar el validador
