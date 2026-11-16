# Tasks — feature 0343

| Task | Estado | Commit | Notas |
| --- | --- | --- | --- |
| 1 — Precondiciones, `kit:upstream` y filas de humo | hecha | 2e7feef2 | — |
| 2 — Ronda: `m1`, `m3`, `v5` y `g5` | hecha | 54dba826 | m3 y g5 a fila de bug; v5 verde tras el arreglo |
| 3 — Ronda: `u1` y `h2` | hecha | 3a09a236 | h2 a fila de bug (1 de 4 en la ronda), verde en el corte |
| 4 — Batería del corte y filas de bug | hecha | ad53b120, 517d4a85, be3b79ea | enmienda del 2026-11-16: arreglos antes del corte |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre 7cd4598a
Pasada de fix: 21f26e1e, 24 hallazgos (sin test RED: texto de skills y registros; suite 2500/2500)
Re-revisión: 7cd4598a..21f26e1e, sdd-kit:effort-high + opus, hallazgos abiertos: arreglados en 7354ce90 y 1c653cb1 (sin revisar)

## Rulings

Task 0: Ruling: línea base = el pre-commit del commit de apertura 5506bd65 (kit:test-headless, cli:typecheck, cli:test en verde) en vez de invocar sdd-worktrees — ya estoy en el worktree de la rama y el gate corrió sobre ese commit — si el pre-commit no es la línea base completa, un rojo previo se atribuiría a la feature.
Task 0: Ruling: sin sdd-tdd — ninguna task escribe código; el RED de cada arreglo es una batería de sujetos — si alguna task acaba tocando cli/, se carga entonces.
Task 1: Ruling: co4 0/2 en TP no se arregla en esta feature — es una fila nueva sin medida previa: decisión 6, a fila de bug con la tasa del corte — si el dev-lead quería la carga arreglada, falta un arreglo de spec-writing.
Task 1: Ruling: kit:upstream y la comprobación de SDD_UPSTREAM_DIR/SUPERPOWERS_DIR quedan pendientes del dev-lead (no están en la máquina) — el commit de las filas no toca skills/ y pasa el pre-commit — si las fuentes traen algo que cambie la ronda, se rehace.
Task 1: Ruling: SUPERPOWERS_DIR = C:\code\sdd-kit\upstream\obra-superpowers en su HEAD de main, no en una etiqueta — es la versión que verán los proyectos al instalar — si main trae algo sin publicar, f2/f3 compiten con un superpowers más nuevo que el publicado.
Task 2: Ruling: M3 pierde «no cita el changelog como fuente» — la skill no tiene esa regla (procedencia: «Sin regla») y «da la 1.4.2 por buena» ya mide el contraste — una fila menos exigente.
Task 2: Ruling: saldo de palabras de la Task 2 +39 (roadmap −7, upgrade +6 en migrations, archive +40); se compensa en la Task 3 quitando la regla de desvío repetida de «How you stop» si el GREEN lo aguanta — si no, el saldo de la feature queda positivo y es desvío de la decisión 2.
Task 2: Ruling: tras lanzar el GREEN (k43a) recorté 16 palabras para el saldo: punteros de evidencia de sdd-roadmap y «both diffs» en sdd-archive — no cambian ninguna regla; la batería del corte mide el texto final — si alguno cambiaba conducta, sale en la Task 4.
Task 3: Ruling: saldo de la feature tras las Tasks 2 y 3: −1 palabra (roadmap −12, upgrade +7, archive +36, implement −12, implement-subagent +5, propose −25 por el include) — sin coste.
Task 4: Ruling: los rojos de sdd-grilling de la medida final de la 0152 no van a fila — la 0342 los re-midió con la batería interviewer y los cerró (spec, decisión 7) — si alguno sigue vivo, sale en c-grl.
Task 2: Ruling: sin REFACTOR para v5 ni g5 — sus fallos son de otra fila (V19) o de un paso que el sujeto se saltó (no aplanar), con la regla escrita; van a fila de bug con 1 de 4 — si eran de la skill, quedan en rojo en la batería del corte.
Task 2: Ruling: la lectura del REFACTOR la hice yo con grep sobre texts/tools (título, causa, caducada, escrituras) en vez de un lector — solo cambiaron dos cláusulas — si otra cláusula de M1 o M3 se rompió, sale en c-rmp.
Task 3: Ruling: el lateral de h2 (ningún sujeto anota los Minor de task como `minor (deferred)`) no entra en la ronda — no es fila de la rúbrica — va a la fila de bug de sdd-implement como observación.
Task 3: Ruling: saldo +9 tras los REFACTOR → quito los cuatro punteros `(tests/…-red.md, x)` de sdd-roadmap y «of releases» de la regla de m3: saldo −1 — punteros de evidencia que la procedencia de la batería ya guarda — un agente pierde de dónde viene cada regla dentro de la skill.
Task 3: Ruling: fix-loop.md vuelve al texto del GREEN («…the code stays as reviewed.») — la frase del REFACTOR no mejoró S (1 → 2 de 4) — h2 queda medido en r2-imp con un texto que no se publica; la batería del corte lo mide con el del GREEN.
Task 4: Ruling: MAX_PARALLEL=2 en todos los lanzadores (dev-lead, 2026-11-15: «si pon 2») — la cuota de 5 h la gastan los sujetos `claude -p` con la sesión del dev-lead — la campaña tarda ~2,5× más. Retomar tras las 18:10.
- 2026-11-15 21:45 Ruling: parada por el dev-lead (cierra el PC). Matados runners run-cut2 y run-c4..c8 por PID; marcador .temp/r43/stop creado. c-prp 69/127 jsonl (los últimos en curso pueden estar sin RESULTADO: revisar y relanzar con --resume). c4..c8 no arrancaron. Mañana: borrar .temp/r43/stop, comprobar sin-RESULTADO de c-prp, relanzar propose desde el sujeto 70 y la cadena c4..c8 (MAX_PARALLEL=2).
- Ruling: TP es fila nueva de la 0343 (sin medida previa en fase de sujetos) → p2, sp1, co4 a fila de bug con su tasa (decisión 6), sin relanzar. Los sujetos leen la plantilla con cat/Read sin cargar sdd-templates.
- Ruling: co2p estaba 2/2 en z-prp (0152) → posible regresión: relanzo a n=4 en c4-prp (run-c9.ps1, tras c8).
- 2026-11-16 Ruling: parada por el dev-lead (coste; quiere arreglar los rojos y relanzar solo los que fallan). Cadena c5..c9 matada; c4-int y c4-grl terminados (máquina 4/4, sin leer). .temp/r43/stop creado. Coste 303,93 $.
- 2026-11-16 Dev-lead: «si los hiciera con superpowers… ¿fallarían también? si sí, fila en el roadmap; si no, se arreglan ahora». Ruling: los 17 que siguen rojos tras el arreglo son reglas propias del kit (superpowers no las tiene o las deja al humano) → filas de bug con tasa. fp: posible regresión propia → revertida la frase de lite (517d4a85), relanzo fp y l1 a n=4 (f5-*, run-fix2.ps1).
- 2026-11-16 Ruling: traspaso del portátil al PC (dev-lead). Hecho hasta be3b79ea: tasks 1-4 completas, evidencia commiteada. Siguiente: revisión final (sdd-verify, ejes Spec opus+high y Código sonnet+high, paquete con la receta de encargo-revision.md excluyendo la carpeta de la spec), sdd-archive (walkthrough, fila 0343 ✅), push + CI, sdd merge --push, ticket sdd-feedback + aviso a «sdd-kit develop» (incluir: regla «un rojo en dos medidas seguidas se arregla en la siguiente feature que toque la skill»; propuesta de gate de tiempo/número para e2e en el kit; la frase de lite revertida en 517d4a85 por la regresión de fp), y en develop el corte (regla 5) y sdd-end-release 3.0.0 con parada para merge a main + tag.
Final: Ruling: E5/R1 más laxas que «one question mark» de sdd-grilling (Código I4) — la skill pide lo estricto y la decisión D2 del dev-lead solo deja de puntuar como fallo dos peticiones del mismo asunto; tocar el núcleo pide la batería interviewer (ADR 0035) — un sujeto que junta dos del mismo asunto sigue «contra» la skill sin que la batería lo vea.
Final: Ruling: filas reescritas a su letra (E1, C7, PL1, PT1, CO6, V19, M5, R3, R9; Código I5) — D3-D8 los delegó el dev-lead y cada cambio está en rojos.md con su porqué — si alguna letra nueva mide otra conducta, un rojo real pasa a verde.
Final: Ruling: regla nueva de cr3 en plan-writing.md (Spec I8) — el criterio del dev-lead manda arreglar ahora lo que superpowers no fallaría, y el saldo de la feature baja −120 — una regla más en una referencia.
Final: Ruling: «One whose fix… is a deviation: stop» en closing-the-review.md (Spec I7) — es D5, en el paso donde se adjudica; c10 sigue rojo y va a fila — una frase al lado de otra.
Final: Ruling: forma literal del título en la entrada 1 de sdd-roadmap (Código m) — fue el arreglo de m1, 4/4; la plantilla sigue siendo la fuente — dos sitios con la misma forma.
Final: Ruling: rubber-duck sin «the term and its effect are one idea» (Código m) — se sustituyó por «never in the next one» y w1 sigue 4/4 rojo, a fila — la colisión con «one idea per sentence» sigue.
Final: Ruling: +12 palabras en migrations/v3.0.0.md (Código m) — migrations/ fuera del conteo; «sustituye» era el tope de SKILL.md de sdd-upgrade — ninguno.
Final: Ruling: lecturas no literales en release-3.0.0.md (Spec m, decisión 10) — 13 lecturas de 4-28 KB, enlazadas desde la sección — leer una pide abrir otro fichero.
Final: Ruling: filas de debt.md agrupadas por skill afín (Spec m, decisión 5) — regla 6 de CLAUDE.md («no puede ser que todo genere deuda») — el triaje tiene que partir una fila.
Final: Ruling: TP admite `| head -N` con N ≥ 100 (Spec m) — D1: basta con que lea su plantilla; 100 líneas cubren las secciones que se rellenan — un sujeto que no lee el final de la plantilla pasa.
Final: Ruling: regla nueva de cr3 en plan-writing.md (Spec I8, la re-revisión dice que no se sostiene) — la restricción «nunca se suma una regla nueva» es del plan, no de la spec: salir del plan es ruling; se presenta en ✋ — una regla más en una referencia.
Final: Ruling: g2 K no es regresión — A/B f7b-int con el kit del corte 3a09a236: 3 de 4 fallan (f7-int 4 de 4, f6-int 2 de 2; c-int 0 de 2 fue suerte) — fila de bug de sdd-init: la init nueva pregunta sin cargar sdd-grilling — si era regresión con causa, la fila la esconde.
Final: Ruling: n7 N7a no es regresión — A/B f7b-ini con el kit del corte: 3 de 4 fallan por la letra, como f6-ini (3 de 4) y f4 — fila de bug de sdd-init — si era regresión, la fila la esconde.
