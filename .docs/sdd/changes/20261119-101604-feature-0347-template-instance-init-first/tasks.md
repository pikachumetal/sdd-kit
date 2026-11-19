# Tasks — feature 0347

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — El hook y `sdd upgrade` remiten a `sdd-init` con una marca de template | hecha | `7d4b3b9` |
| 2 — `--finish` señala cada marca de template que queda | hecha | `e52b323` |
| 3 — El resumen de cierre de `sdd-init` nombra lo de fuera de `.docs/` | hecha | `a0a2d19` |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura no (plan), sobre a0a2d19
Pasada de fix: juntada en el cierre, 3 hallazgos RED→GREEN
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, atendidos (1 Important de Spec a la parada del dev-lead)

## Rulings

Task 1: Ruling: sdd-upgrade sin editar — GREEN de t1 entra por sdd-init desde el aviso de inicio, sin llegar a ejecutar sdd upgrade; el error de sdd upgrade lo cubren los tests de upgrade.test.ts — si un agente llega a sdd upgrade y no sigue el error, la instancia queda sin migrar y sin init, no se rompe nada
Task 3: Ruling: molde template-finish sin marca de template (la decisión 8 de la spec la ponía en PRODUCT.md) — con una marca, el predicado 1 de sdd-init vuelve a entrevistar y el sujeto no llega a --finish; la línea de --finish la cubre finish-template.test.ts y el resumen la recoge por «pending questions» del paso 8 — si falla, una marca residual no sale en el resumen y el aviso de la sesión siguiente la recuerda
Task 3: Ruling: GREEN n8 primera tanda 1/2 — n8-1 paró en el paso 5 porque sdd estimation log falla sin changes/ (defecto del kit, fuera de alcance) y no llegó a --finish; n8-2 verde salvo la regex, que no admitía el backtick de `.claude/settings.json`: actualizado. Arreglo: molde con estimation-log.md y CHANGELOG.md aprobado; F1 y F2 admiten \x60 opcional; el RED sigue rojo con la regex nueva. Se relanza n8 N=2 en la fase green2 — si es incorrecto, la regex deja pasar un formato que antes no
Task 3: Ruling: enmienda del AND de .gitignore aprobada por el dev-lead («1»): «no lo pone entre lo que va en el commit de cierre»; F4 de la batería, igual
Final: Ruling: el paquete excluye dist/** — es la copia construida por kit:build de los mismos ficheros fuente — si es incorrecto, un desfase dist/fuente lo caza kit:test-headless
Final: Ruling: Código Minor 5 (--finish con --memory-off repite las líneas de marca) — cada pasada informa del estado actual; quitarlo exigiría estado entre ejecuciones — si es incorrecto, una línea repetida en la salida
Final: Ruling: Código Minor 6 ('' como centinela de templatePendingFile) — igual que readJsonVersion y latestMigration del mismo fichero — si es incorrecto, ninguno: los dos llamadores lo usan como booleano
Final: Ruling: Declined (Código) bloques indentados con 4 espacios cuentan — lo fija la decisión 2 («los bloques indentados cuentan») — si es incorrecto, un falso aviso de template con un ejemplo indentado
Final: Ruling: Declined (Spec) el predicado 1 de sdd-init no aplica la regla del backtick ni de la valla — fuera de Scope; sdd-init ya lee la marca a su manera — si es incorrecto, sdd-init entrevista de más en un proyecto que cita la marca
Final: Ruling: Declined (Spec) la detección exige un espacio exacto («<!-- sdd-template: pending») — lo fija la Restricción; el git grep de la decisión 9 es más laxo a propósito — si es incorrecto, una marca con dos espacios no cuenta
Final: Ruling: re-revisión Minor — BOM escrito literal (invisible) en cli/bin/session-start.js:91 y en el dato del test — funciona; arreglarlo tras la re-revisión única sería un commit sin revisar — si un editor lo quita, el replace no hace nada y una valla en la línea 1 tras BOM no se reconoce; al ticket
Final: Ruling: re-revisión Minor — el test del BOM no ejercita el replace (falta BOM + valla en la línea 1) — mismo motivo — si es incorrecto, el replace queda sin test; al ticket
Final: Ruling: re-revisión Minor — una valla dentro de una lista anidada con 4+ espacios ya no se reconoce — coherente con la decisión 2 (los bloques indentados cuentan) — si es incorrecto, un falso aviso de template en un documento con un ejemplo así
Final: Ruling: fuera de alcance — readJsonVersion del hook no tolera un sdd-kit.json ilegible (previo a la 0347) — al ticket — si es incorrecto, el hook arranca sin contexto en ese caso raro
Final: Ruling: enmienda «1» del dev-lead aplicada en el cierre — sin sujeto de control: la frase quitada nunca se midió y n8 no la ejercía — sin revisar tras la re-revisión única (cambia una línea de SKILL.md)
