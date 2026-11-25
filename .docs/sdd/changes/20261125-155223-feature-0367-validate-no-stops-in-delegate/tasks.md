# Tasks — feature 0367

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El escenario `vf10`, en rojo sobre el texto de `develop` | done | ver `git log` |
| 2 — La regla en el paso donde se decide | done | ver `git log` |

Revisión final: Spec opus+high, con arreglos (1 Important, 3 Minor) · Código sonnet+high, con arreglos (5 Minor) · Arquitectura no (plan), sobre 8c42f24
Pasada de fix: juntada en el cierre, 6 hallazgos arreglados (1 Important, 5 Minor) y 3 con ruling; vf10 2/2 tras la pasada
Re-revisión: 8c42f24..juntada en el cierre, sdd-kit:effort-high + opus, aprobada (2 Minor nuevos, con ruling)

## Rulings

Task 2: Ruling: el SILENCIO del vigilante en el RED fue falso: la salida iba por Select-Object -Last 30, que la retiene; las tandas siguientes van sin pipe a un fichero — coste si me equivoco: ninguno, los sujetos acabaron
Final: Ruling: Código Minor 2 (se pierde «a patch invokes it directly») — «(features through sdd-implement-native's «Finish»)» acota la vía de Native a la feature, y patch-flow invoca sdd-archive directamente; nombrar los demás carriles no cabe en el saldo — si me equivoco, un patch busca una «Finish» que no tiene
Final: Ruling: Código Minor 5 (separar VF10 en a/b/c) — un escenario, tres cláusulas etiquetadas en la misma fila, como VF9; el diagnóstico va en la tabla de evidencia por cláusula — coste: ninguno
Final: Ruling: Spec Minor 4 (v1a no mide la absorción en field) — la decisión 5 de la spec fija v1a en manual; va al walkthrough como «no probado en field» — si me equivoco, una decisión de la revisión final en field se registra sin preguntar
Final: Ruling: recorte de «in their place,» en «Closing drafts» para el saldo — la carpeta de los borradores la fija sdd-archive y la plantilla; lo cubren vf10 y vf9, que escriben los borradores (decisión 13) — si me equivoco, un borrador fuera de la carpeta
Final: Ruling: Declined (Spec) unattended, 3.er fix, hotfix, Validación: agente, vf10-1 commitea el walkthrough antes de sdd-archive, rúbrica de vf9 — fuera del alcance por las decisiones 7, 10, 11, 12 de la spec — coste: los ya listados en la spec
Final: Ruling: Declined (Código) palabras, coste, dist binario, salidas de sujetos — verificados por el hilo: word-budget 92/92, kit:own 0, dist reconstruido con kit:build — coste: ninguno
Final: Ruling: re-revisión Minor (recorte de «in their place,» medido solo con vf10, no con controles y vf9) — sdd-archive paso 0.1 fija la carpeta del borrador, y los dos sujetos de fix/out lo escriben en la carpeta del cambio; va al walkthrough — si me equivoco, un borrador fuera de la carpeta, que sdd-archive para
Final: Ruling: re-revisión Minor (la fila VF10 cambió tras el RED y el GREEN, y el primer GREEN y los controles no se releyeron con ella) — la fila nueva es más estricta: el RED sigue rojo (ningún sujeto invocó sdd-archive ni el merge); el primer GREEN, releído con ella: commit con el test del paso, orden de escritura y merge sin --sync en vf10-1 y vf10-2; va al walkthrough — coste: ninguno
Final: Ruling: re-revisión fuera de alcance (el plan esperaba un «without asking» y hay 2; el paso 5 no nombra unattended) — el segundo es el del paso 5, el que pide la spec; unattended lo cubre sdd-archive paso 7 — coste: ninguno
