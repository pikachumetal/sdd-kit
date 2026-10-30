# Tasks — 0224

| Task | Estado | Commit |
| --- | --- | --- |
| 1. La regla del entorno en la clasificación | ✅ | 2302ccfa |
| 2. El hueco «Previsión de coste» | ✅ | 26580021 |
| 3. El reparto del roadmap | ✅ | 721d05be |

Revisión final: Spec opus+high, con arreglos · Código sonnet+high, con arreglos · Arquitectura no (plan), sobre 721d05be
Pasada de fix: juntada en el cierre, 9 hallazgos sin RED: son redacción y documentos
Re-revisión: 721d05be..juntada en el cierre, sdd-kit:effort-high + opus, resueltos salvo 2 por ruling y 5 Minor nuevos adjudicados

## Rulings

- Task 1: la frase del plan falló el GREEN (`ws3-2` corrió `node --test` y `node src` antes de instalar, dos rondas) — pasa a un predicado observable, «check first, in a command of its own, whether dependencies are installed», 2/2 limpios en `green3` — coste si es errónea: un comando más al clasificar.
- Task 1: para no subir el saldo de `sdd-propose` salen «—the branch a launch prompt opened—» y una cita de evidencia del carril config — ya están en la batería (`k5`) — coste si es errónea: una aclaración menos.
- Task 2: el saldo de `sdd-templates` pedía más que lo que nombraba la decisión 10; salen también las ayudas de «Scope», «Approach» y «Estimación y esfuerzo» y una frase de «Topes» — las cubren `spec-writing.md` y los encabezados — coste si es errónea: una spec con el Scope en prosa.
- Task 2: `co2` sale rojo en `battery.mjs` porque el lanzador no guardó su `tools.txt` («no se guarda»); la conducta, leída del stream, pasa CO2 — coste si es errónea: ninguno.
- Final: «borra la sección» de «Topes» no se restaura — `co2` y `co3` omiten bien las secciones condicionales con el encabezado solo — coste si es errónea: una sección vacía en una spec.
- Final: `spec-new.md` de `co2`, `co3`, `co4-2` y el de `final/co4-1` no se versionan — el lanzador no los guardó, y las cinco filas constan en `.temp` y en este registro — coste si es errónea: menos evidencia para reabrir la calificación.
- Final: las filas 0250 y 0255 siguen en Próximo, en vez de salir como decía el plan — es la convención de las filas aparcadas (0249, 0259) — coste si es errónea: ninguno.
- Final: medición final con `s1` 2/2, y `ws1`, `ws2` y `co4` con n = 1, porque el techo de 4 sujetos cortó el resto; los rojos de `battery.mjs` son sujetos no lanzados o sin `tools.txt` — coste si es errónea: una muestra corta del carril config.
- Final: la fila a cero con motivo deja pasar una previsión sin controles ni medición (`co4-1`) — el THEN se cumple y es un solo caso; va al ticket — coste si es errónea: otra parada por dinero.
- Final: restos en `plan.md` (remite a «Rulings» sin decir dónde, `s1` en `control`) y `spec.md:71` — no cambian conducta y este registro los aclara — coste si es errónea: ninguno.
