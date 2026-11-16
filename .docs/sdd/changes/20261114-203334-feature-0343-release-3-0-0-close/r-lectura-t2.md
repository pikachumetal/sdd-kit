# Lectura t2 — sdd-roadmap (m1, m3), sdd-upgrade (v5), sdd-archive (g5)

Criterio: fila literal de la rúbrica. «Pasa» = no se da la condición de fallo.

## sdd-roadmap

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| m1 | M1 (título) | pasa: `### *✨ 0013 — Aviso semanal a los responsables*` [7] | falla: `### ✨ 0013 — …` sin cursiva [9] | falla: sin cursiva [8] | falla: sin cursiva [7] | 3 de 4 fallan |
| m1 | M1 (resto: Nombre/Base/Carril, `***Prompt***`, bloque, alcance, fuera, lecturas, 8:00, hecho, delegate, merge; no escribe) | pasa | pasa | pasa | pasa | pasa |
| m3 | M3 (CSV no en «Lista», 1.4.2 no por buena) | pasa: En espera [9] | pasa [9] | pasa [10] | pasa [9] | pasa |
| m3 | M3 («Causa» `sin determinar` del CSV) | falla: no la dice [9] | falla: no la dice [9] | pasa: «Causa `sin determinar`» [10] | falla: no la dice, solo «hipótesis sin confirmar» [9] | 3 de 4 fallan (literal) |
| m3 | M3 (planta `defecto del producto`) | pasa [9] | pasa [9] | pasa [10] | pasa [9] | pasa |
| m3 | M3 («Evidencia» de la planta con el comando) | pasa: campo explícito [9] | pasa: comando en la columna «Motivo», sin campo «Evidencia» [9] | pasa: campo explícito [10] | pasa: igual que s2 [9] | pasa (s2 y s4 en tabla, no como campo) |
| m3 | M3 (8 h: descartar `caducada`, fuera de `debt.md`, no «Descartadas») | pasa [9] | pasa [9] | pasa [10] | pasa [9] | pasa |
| m3 | M3 (no escribe antes de la decisión) | pasa (tools: solo lecturas) | pasa | pasa | pasa | pasa |
| m1, m3 | L Idioma | pasa | pasa | pasa | pasa | pasa |

## sdd-upgrade

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| v5 | V15 Enlaces | pasa | pasa | pasa | pasa | pasa |
| v5 | V16 Lo publicado (0032 y 0023 en Now con ✅; 0029 y 0016 fuera) | pasa | pasa | pasa | pasa | pasa (el 0023 sale ✅ en los 4) |
| v5 | V17 Release por prefijo | pasa | pasa | pasa | pasa | pasa |
| v5 | V18 Ids del Backlog | pasa: 0040, 0041/0042/0043 de `--reserve` (tools l. 184), pregunta Estreno [12] p.3 | pasa (tools l. 237) | pasa (pregunta [126 del texto]) | pasa (tools l. 367-368) | pasa |
| v5 | V19 Nombres en capabilities | falla: cambia `cierre.md:12` (tools l. 359, `sed -i '12s#sdd-end-patch#sdd-archive#'`) sin que ninguna tabla lo mostrara; solo avisa «Cambio el nombre viejo en `cierre.md`» [27] | falla (literal): lo enseña antes pero en viñetas bajo «Gate», no en tabla [texto l. 104-108] | pasa: tabla con `cierre.md:12` y `:19` [texto l. 156-157], espera el «sí» | pasa: tabla [texto l. 147-148] | 1 de 4 falla claro, 2 de 4 literal |
| v5 | V20 Mediciones fechadas | pasa: conserva la línea (state l. 219) | pasa | pasa | pasa | pasa |
| v5 | L Idioma | pasa | pasa | pasa | pasa | pasa |

## sdd-archive

| Escenario | Fila | Sujeto 1 | Sujeto 2 | Sujeto 3 | Sujeto 4 | Veredicto |
| --- | --- | --- | --- | --- | --- | --- |
| g5 | G5a Intersección vacía | pasa: nada corre tras el sync (tools: solo `git diff`) | pasa | pasa (lee `scripts/gate.mjs`, no lo ejecuta) | pasa | pasa |
| g5 | G5b Tareas saltadas | pasa [37] línea `Gate:` con las dos `saltada (…)` | pasa [24-25] | pasa [23]; su walkthrough lleva una línea Gate inventada («bookings:test corrió 1/2»), no el mensaje final | pasa [38] | pasa |
| g5 | G5c `--verified-at` | pasa: `43f0317` = cierre (tools l. 263) | pasa: `a9433e3` = cierre (tools l. 253) | falla: `bfcb21e`, el commit `tasks.md con la revisión final`; el cierre es `d1e974d` (tools l. 299) | pasa: `e65b893` = cierre (tools l. 282) | 1 de 4 falla |
| g5 | L Idioma | pasa | pasa | pasa | pasa | pasa |

## Resumen

**m1: 3 de 4 fallan** (m1-2, m1-3, m1-4, fila M1, solo el título).
- Causa: los tres imprimen `### ✨ 0013 — …` sin los asteriscos de cursiva. La skill (`sdd-roadmap/SKILL.md`, entrada 1) dice «give the launch prompt in the exact form of launch-prompt-template.md, title included», y la plantilla (línea 14) lleva `### *<emoji …> <id> — <nombre …>*`. Los cuatro leyeron la plantilla (m1-1, m1-3 y m1-4 con `cat` en la 1.ª llamada Bash; m1-2 con `Read`). El que acierta (m1-1) copia el ejemplo de la línea 49; los otros tres normalizan el título a mano. La frase de la skill no nombra la cursiva ni el ejemplo, y «title included» no basta. El resto de la fila M1 pasa en los 4.

**m3: 3 de 4 fallan, solo por la «Causa» del CSV** (m3-1, m3-2, m3-4). La cláusula del changelog ya no se mide, y el descarte `caducada` pasa 4 de 4.
- Causa: proponen «En espera (Falta: `reproducirlo`)» pero no dicen la «Causa» `sin determinar`. Solo m3-3 la escribe [10]. m3-4 y m3-1 dan una hipótesis (Excel sin BOM) en lugar de la causa. La skill (`SKILL.md` l. 99) dice «**«Causa»**, per row out of `Por triar`, … `sin determinar` (never in «Lista»). A row without one gets it when touched», y no exige darla en la propuesta en prosa. Es una omisión de la propuesta, no una contradicción: o el sujeto la omite, o la fila de la rúbrica es estricta con la prosa (una lectura por intención pasaría a los 4). Los tres sí dan `defecto del producto` para la planta. En la evidencia de la planta, m3-2 y m3-4 citan el comando con su salida en la columna «Motivo» y no como campo «Evidencia»; lo he dado por pasa.

**v5: 1 de 4 falla (v5-1, fila V19); 2 de 4 si se lee «tabla» al pie de la letra (v5-1 y v5-2).**
- V15 a V18 y V20: 4 de 4 pasan. El 0023 sale en Now con ✅ en los cuatro, aunque su fila de deuda dice «saldada».
- V19, sujeto 1: cambia `capabilities/cierre.md:12` (de `sdd-end-patch` a `sdd-archive`) sin enseñarlo antes en ninguna tabla. Su tabla de la puerta 5 solo trae `CLAUDE.md`, `pregunta.md` y la línea de `tech-stack.md`; luego edita con `sed -i '12s…'`. La skill (`migrations/v3.0.0.md` l. 136) dice «What it finds in `.docs/sdd/capabilities/`, … goes to a **gate** table instead … replacing it in every other line, a capability scenario included». El sujeto la trató como «sin gate» y la aplicó en el bloque «Lo que corre sin pedir permiso».
- V19, sujeto 2 (solo literal): sí lo muestra antes y espera, pero en viñetas bajo «**Gate**» (`cierre.md:12` «propongo cambiarlo», `:19` «se queda»), no en tabla. Los sujetos 3 y 4 lo ponen en tabla. La skill dice «a **gate** table» pero no dice cómo se da en prosa. Con la lectura por intención (enseñarlo antes y esperar), s2 pasa y queda 1 de 4.

**g5: 1 de 4 falla (g5-3, fila G5c).**
- g5-3 pasa `--verified-at bfcb21e` (el commit «tasks.md con la revisión final», la `Validación en campo` del borrador) cuando el commit de cierre es `d1e974d`. No aplanó el cierre: hizo un `git commit` normal sin `git reset --soft`, a diferencia de g5-1, g5-2 y g5-4, y no usó el sha del cierre. `closing-suite.md` l. 21 dice «‘The validation’s sha’ … is the closing commit’s when the close squashed the validation’s suite into it … never the last task’s». La regla está condicionada a que el cierre aplane, y g5-3 no aplanó, así que lo trató como la regla general y mantuvo el sha del borrador. G5a y G5b pasan en los 4: nada corre tras el sync y los cuatro dan la línea `Gate:` con las dos tareas `saltada (…)`. Aparte: el walkthrough de g5-3 lleva una línea Gate inventada («bookings:test corrió 1/2 … el cierre no volvió a correr la suite») que contradice su mensaje final. No afecta a las filas.
