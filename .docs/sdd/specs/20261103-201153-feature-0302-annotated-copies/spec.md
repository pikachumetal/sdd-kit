---
id: 20261103-201153-feature-0302-annotated-copies
feature: 0302
proposal: 0301
title: Las copias anotadas contra su fuente — la marca, las comprobaciones, el registro fichero a fichero y la actualización
mode: full
profile: delegate
status: approved
created: 2026-11-03
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-03
---

# Spec — Las copias anotadas contra su fuente: la marca, las comprobaciones, el registro fichero a fichero y la actualización

🦆 Hoy nada dice de forma automática qué frase de una copia sale de su fuente y cuál pone el kit. Por eso el kit pudo pegar «The kit's own stops are a fifth class» al lado de «Four things stop you, and only these» sin que nada lo viera. Con esta feature, una copia pasa a ser el original de su fuente con los bloques del kit marcados. Una comprobación compara la copia con el original en su tag y da rojo con cada diferencia que no lleve marca. Por ejemplo, borrar «Never start implementation on a main/master branch…» sin `quita` da un rojo con su fichero y su línea: `falta texto del original sin marca quita: «Never start implementation…»`. Además, `upstream.json` dice fichero a fichero si cada pieza es copia o propia, y subir una copia de 7.0.0 a 7.0.1 es una orden que fusiona con `git merge-file` y deja solo los conflictos de verdad. Las seis copias se anotan en la 0312; aquí se construye y se prueba lo que las comprueba.

Validación: agente — el proyecto valida en campo (`validation.mode: field`). Todo lo que entrega se ve en la salida de una orden o de un test, y el uso real lo dan la 0312 y la 0296, que anotan las copias con esta maquinaria.

## Capacidades

- Modificadas: `kit-distribution` — añade cómo se marca una copia, cómo se comprueba contra su original, cómo se clasifica cada fichero y cómo se actualiza; `kit:upstream` vigila también los `from`; sus «Reglas de la capacidad» suman los avisos nuevos.

## ✋ Decisiones que he tomado yo — valida estas

```text
Review de spec hecha: dos revisores en paralelo, pedidos por el dev-lead («1», 2026-11-03), aunque la rúbrica daba ninguna — señales: contrato público (la gramática de la marca y la forma de upstream.json, que leen la 0312 y la 0296), área no explorada (upstream-watch.slow.test.ts y dist.slow.test.ts sin leer enteros) · tamaño: ~1.000 líneas en ~15 ficheros
- Dominio (Opus, effort medium): si las reglas de la ADR 0022 y de la propuesta 0301 quedan cubiertas por el diff, A+C, la absoluta y el 50 %
- Técnica (Sonnet, effort medium): si la gramática basta para sdd-verify (base y fragmentos de wondelai) y si cada THEN se puede verificar
```

### Hallazgos de la review

- **Aceptado** — Crítico (dominio 1, técnica 1): A+C se esquivaba con `…` y daba rojo en todo cambio de media línea, porque S se comparaba con lo que falta del original y no con lo que el bloque quita → decisión 3 nueva: S cita lo que el bloque quita de verdad (las palabras de las líneas quitadas que no vuelven en el bloque), y A+C es que S no cuadre porque el bloque vuelve a decir un trozo de S. Desaparecen el corte de cuatro palabras y la búsqueda en toda la salida (dominio 2).
- **Aceptado** — Crítico (técnica 2): `<!-- kit: fin -->` no lleva tarea, y la gramática decía que la tarea era obligatoria; el parser no estaba fijado → decisión 2: `fin` es la única marca sin tarea, y las vallas y las marcas se detectan con el código de `build/dist.ts`, compartido.
- **Aceptado** — Importante (técnica 3, dominio 10): el alineado no estaba definido con líneas repetidas o en blanco, y partir un párrafo pasaba gratis → decisión 4: LCS de líneas exactas, en blanco incluidas, con desempate fijo; una línea en blanco nueva es texto sin marca. Unir dos párrafos sí pasa, y queda como límite.
- **Aceptado** — Importante (técnica 4): S podía traer `-->` o comillas, y no estaba dicho que un cambio a mitad de párrafo necesita `fin` → decisión 2.
- **Aceptado** — Importante (técnica 5): `de:` sin definir, y la prueba en una copia real no tocaba el riesgo → decisiones 2 y 12: `de:` usa la clave de `sources` y una ruta sin espacios, y la prueba real pasa a `code-reviewer-prompt.md`, con base, `de:` de wondelai y vallas.
- **Aceptado** — Importante (técnica 6): los fixtures quedaban en CRLF → decisión 13: `.gitattributes` también para `cli/test/fixtures/copies/**`; `skills/` solo tiene ficheros de texto (comprobado con `git ls-files`).
- **Aceptado** — Importante (técnica 7, dominio 6): faltaban los casos raros de `kit:copies-update`, y un bloque se pierde sin aviso al resolver un conflicto con la versión de la fuente → decisión 11.
- **Aceptado** — Importante (técnica 8, dominio 7): el 50 % no lo comprobaba nada → `kit:copies` lo mide en cada copia anotada (requisito «Una copia que ya no lo es da rojo»); el fichero puesto en `own` que es casi literal no se puede medir, y queda como límite.
- **Aceptado** — Importante (dominio 8): `from` cambiaba el requisito vivo de `kit:upstream` sin un `MODIFIED`, y el aviso de tag inventaba otra forma → `MODIFIED` de «El corte compara cada entrada del registro con su fuente», y las órdenes nuevas usan el aviso de hoy, `<fuente>: falta <tag> en el clon <clon>`.
- **Aceptado** — Importante (dominio 9): errores de la gramática sin mensaje → un mensaje literal por caso (decisión 2), sumados a «Avisos».
- **Aceptado** — Menor (técnica 9, 10): esquema de `own` y `notCopied`, qué cuenta `<n>`, qué trozo se cita, y cómo reconoce el test B4 y B5 → decisiones 7, 11 y 14.
- **Aceptado como límite** — Importante (dominio 3): la absoluta solo mira los añadidos sin `sustituye`; un bloque que sustituye otra frase del párrafo y contradice la absoluta pasa. Lo dejo así porque es la regla de la propuesta 0301 («un bloque del kit sin `sustituye`»): ampliarla daría un rojo sin salida a cada sustitución legítima en una lista con un «never». Lo cubre la revisión final con la «Confirmación» de la ADR 0022 → decisión 6.
- **Aceptado como límite** — Importante (dominio 4): un «except» o «unless» pegado en un párrafo sin absoluta pasa → decisión 6: lo cubren la comprobación de excepciones pegadas de la 0304, que corre sobre `dist/` con las copias incluidas, y la revisión final.
- **Aceptado como límite** — Importante (dominio 5): `quita` no enlaza el A/B que la regla 1 de la ADR 0022 exige → decisión 2: la revisión final comprueba el A/B de cada `quita` nuevo; un campo de evidencia sería una ruta que nada valida.

### Decisiones

1. **Partida en dos, con la 0312.** Esta feature construye la maquinaria (cuatro tasks). La 0312 (`parent: 0302`) la aplica a las copias: anota las fuentes, sube con `git merge-file` cada copia al último tag de su fuente cuando arranca (hoy superpowers v7.0.2) y resuelve los §2 y §3 del ticket de la 0300, salvo `cli/src/tasks` (0313) y `sdd-grilling` contra sus fuentes (0314). Sus filas ya están en el roadmap, y 0307 y 0311 van tras la 0312.
2. **La marca.** Es una línea entera, como las que ya quita el build de la 0300, y la leen las mismas funciones de `build/dist.ts`, exportadas (vallas, frontmatter y marca de línea entera):
   - Abre un bloque: `<!-- kit: <tarea>[ · sustituye: «S» | · quita: «S»][ · de: <fuente> <ruta>][ · arregla: <fila>] -->`. `<tarea>` es un id de cuatro cifras (`0186`) o un commit (`4597d47e`).
   - Cierra un bloque: `<!-- kit: fin -->`, la única marca sin tarea. Si no, el bloque acaba en la primera línea en blanco fuera de una valla, o en la marca siguiente. Un cambio a mitad de párrafo necesita `fin`: sin él, el bloque se queda con el resto del párrafo. Un bloque de varios párrafos, también.
   - Un bloque cubre líneas enteras. Una marca también vale dentro de una valla: el build la quita igual, y ahí el bloque acaba en `fin` o en la marca siguiente, nunca en una línea en blanco, porque un prompt en una valla lleva líneas en blanco dentro. *(Enmienda 2026-11-03: antes, un cambio dentro de una valla envolvía la valla entera.)*
   - `quita: «S»` no tiene contenido: el bloque acaba en la propia marca. Quitar sin sustituir exige el A/B de la regla 1 de la ADR 0022, y eso lo comprueba la revisión final, no la marca.
   - `de: <fuente> <ruta>`: `<fuente>` es la clave de `sources` de `upstream.json` (`Wondel`), y `<ruta>`, la del original, sin espacios. El bloque entero es texto de ese original; si el kit mezcla texto suyo, son dos bloques.
   - `arregla: <fila>` dice qué fila arregla un rojo que cae en ese bloque. El rojo sigue: solo deja de ser un rojo sin dueño.
   - S no puede llevar `«`, `»` ni `-->`: se saltan con `…`.
   - Los errores, cada uno con su mensaje: una marca sin tarea o con un campo desconocido, `<fichero>:<línea>: marca del kit sin tarea o con un campo desconocido: <campo>`; `sustituye` sin contenido, `<fichero>:<línea>: la marca sustituye no tiene contenido: para quitar sin sustituir, usa quita`; `fin` sin bloque abierto, `<fichero>:<línea>: <!-- kit: fin --> sin bloque abierto`; S con caracteres prohibidos, `<fichero>:<línea>: la cita de la marca no puede llevar «, » ni -->: sáltalos con …`; un `de:` que no está en el `from` de su entrada, `<fichero>:<línea>: el bloque dice de <fuente> <ruta>, que no está en el from de su entrada`.
3. **S cita lo que el bloque quita del original, y nada más.** Lo quitado son las palabras de las líneas del original que caen en el sitio del bloque y que no vuelven, en su orden, dentro del bloque (diff por palabras entre esas líneas y el contenido del bloque, con los espacios normalizados). S tiene que cuadrar con lo quitado. Si son varios trozos, van en orden, separados por `…`, y un `…` dentro de un trozo salta lo de en medio de ese trozo. Por ejemplo:
   - un renombre en media línea cita solo lo renombrado: `sustituye: «superpowers:using-git-worktrees»`;
   - un párrafo entero sustituido se puede abreviar: `sustituye: «Four things stop you, and only these…For those, stop and ask.»`;
   - **A+C**: si el bloque vuelve a decir el párrafo de la fuente al lado de la frase del kit, lo quitado sale vacío y la S no cuadra. El aviso nombra el trozo que vuelve. Así se evita el caso K1 sin buscar S en toda la salida (dominio 2 de la review: una S que el original repite no deja un rojo para siempre).
   - si S no está en ningún sitio del original, la marca es vieja, y el aviso lo dice.
4. **El diff.** El frontmatter queda fuera en los dos lados: `name` y `description` son siempre del kit. Se quitan las marcas y el contenido de los bloques, y lo que queda se alinea con el original por LCS de líneas exactas, líneas en blanco incluidas, con los dos lados en LF. En un empate gana el alineado que casa antes en el original. Hay dos clases de rojo:
   - Una línea que queda y no casa es texto sin marca. Eso incluye una línea en blanco nueva: partir un párrafo es una diferencia.
   - Un tramo del original que no casa lo cubren las marcas que hay entre sus dos líneas vecinas casadas, con la regla de la decisión 3. Sin marca, el rojo va en la línea de la vecina anterior, o en la 1.

   Unir dos párrafos, quitando una línea en blanco, no quita palabras y pasa. Queda como límite. Que todo lo que queda tenga que ser una línea exacta del original es lo que obliga a respetar sus saltos de línea.
5. **Una copia que ya no lo es da rojo.** `kit:copies` mide, en cada copia sin `pending`, qué parte de su original base conserva literal la salida, por frases de 6 palabras. Por debajo del 50 % da `<kit>: conserva el <n> % de su original <ruta>; por debajo del 50 % es propia: pásala a own`. Es la regla de la decisión 8, comprobada.
6. **Añadido junto a una absoluta**: un bloque con contenido y sin `sustituye` da rojo si su párrafo tiene, fuera de los bloques, una línea del original con `only`, `never`, `always`, `must` o `every` como palabra entera, sin distinguir mayúsculas. El aviso cita la primera que encuentra. El párrafo es el tramo entre líneas en blanco de la fuente anotada; una lista o una tabla sin líneas en blanco cuenta como un párrafo. Son las cinco palabras que cruzó la [auditoría de las copias](../20261103-101227-feature-0296-skills-survive-compaction/fork-audit.md). Límites, que cubre la revisión final con la ADR 0022:
   - el añadido en otro párrafo;
   - un bloque que sustituye otra frase del párrafo y contradice la absoluta;
   - un «except» o un «unless» pegado en un párrafo sin absoluta. Este también lo mira la comprobación de excepciones pegadas de la 0304 sobre `dist/`.
7. **`upstream.json` fichero a fichero.** Cada entrada `copy` sin `pending` tiene un solo fichero en `kit` y una sola ruta en `paths`: su original base. Campos nuevos:
   - `from` en la entrada: `[{ "source": "Wondel", "version": "v1.8.0", "path": "plugins/wondelai-skills/skills/clean-code/SKILL.md" }]`, los originales de los bloques `de:`.
   - `pending: "<fila>"`: la copia aún no está anotada, y `kit:copies` no la compara. Puede seguir agrupada, con `kit` de carpeta y varias rutas, como hoy.
   - `own` en la raíz: una lista de rutas del repo, de fichero o de carpeta acabada en `/` (`"skills/sdd-roadmap/"`), que no son copia.
   - `notCopied` en cada fuente: una lista de rutas exactas de la fuente, de ficheros que el kit no copia (`"skills/systematic-debugging/CREATION-LOG.md"`).

   El fichero se escribe con `JSON.stringify(registro, null, 2)`, la forma que escribe `kit:copies-update`.
8. **Copia o propia, con un tope del 50 %.** Un fichero es copia si su salida conserva literal al menos la mitad de su original base. Se mide con frases de 6 palabras, como la auditoría, pero contando qué parte del original conserva el kit, no qué parte del kit sale del original. Su base es el original que más frases aporta, en número. Medido hoy:

   | Fichero del kit | Base | Conserva | Clase |
   | --- | --- | --- | --- |
   | `sdd-tdd/SKILL.md` · `references/writing-good-tests.md` | `test-driven-development` (sp) | 86 % · 98 % | copia |
   | `sdd-tdd/references/writing-e2e.md` | — | 0 % | propia |
   | `sdd-debugging/SKILL.md` y sus tres `references/*.md` | `systematic-debugging` (sp) | 92 % · 94-100 % | copia |
   | `sdd-debugging/references/condition-based-waiting-example.ts` | su `.ts` | igual salvo CRLF | copia, byte a byte en LF |
   | `sdd-worktrees/SKILL.md` | `using-git-worktrees` (sp) | 88 % | copia |
   | `sdd-parallel-agents/SKILL.md` | `dispatching-parallel-agents` (sp) | 93 % | copia |
   | `sdd-verify/SKILL.md` | `verification-before-completion` (sp), `from` `requesting-code-review/SKILL.md` | 90 % | copia |
   | `sdd-verify/references/{architecture,code,spec}-reviewer-prompt.md` | `requesting-code-review/code-reviewer.md` (sp); `from` wondelai en `architecture` (`clean-architecture`) y en `code` (las otras cuatro) | 57 % · 75 % · 62 % | copia |
   | `sdd-verify/references/encargo-revision.md` | — | 0 % | propia |
   | `sdd-agent-writing/SKILL.md` | `writing-for-agents` (mp v1.3.1) | 97 % | copia |
   | `sdd-agent-writing/references/skill-mechanics.md` | `writing-skills/SKILL.md` (sp), `from` `writing-for-agents/SKILL-MECHANICS.md` (mp) | 61 % | copia |
   | `sdd-agent-writing/references/skill-testing.md` | `testing-skills-with-subagents.md` (sp), `from` `writing-skills/SKILL.md` | 95 % | copia |
   | `sdd-rubber-duck/SKILL.md` | `teach` · `wait-what` (mp) | 0 % · 16 % | **propia**, con concepto |
   | `sdd-grilling/SKILL.md` | `grilling` (mp) | 0 % | propia, con concepto (tu alcance) |

   Lo que cambia frente a tu lista: **`sdd-rubber-duck` sale de las copias**. Es una reescritura que solo toma la idea de `teach` y `wait-what`, como `sdd-grilling`. En la 0312 quedan seis copias. También sale a la luz que el registro de hoy no nombra dos originales de `sdd-agent-writing` (`testing-skills-with-subagents.md` y `SKILL-MECHANICS.md`).

   Pasan a concepto (sin texto literal): mattpocock `code-review` en `sdd-verify` (0-1 %) y los ports `cli/src/tasks/` y `tests/skill-size/check.ts`, porque un port a Node no es texto literal. La frase «(both MIT, see `NOTICE`)» de `code-reviewer-prompt.md:210` la reescribe la 0312 con las versiones en el texto. Todas las copias de esta tabla llevan `pending: "0312"`. Siguen agrupadas con `pending` las de `sdd-implement` (`0296`), `sdd-archive` (`0305`), `spec-writing.md` y `plan-writing.md` (`0306`) y la de OpenSpec en `sdd-verify` (`0297`). Ninguna versión cambia aquí, así que `kit:upstream` da los mismos rojos de hoy, ahora con una línea por fichero. Un fichero puesto en `own` que es casi literal de una fuente no tiene original contra el que medir: es un límite, y lo ve la revisión.
9. **Cada fichero de `skills/` es copia o propia, y un test lo obliga.** Un test de `cli:test` da rojo si un fichero de `skills/` no está en ningún `kit` de una copia ni bajo una ruta de `own`, o si está en los dos. El `kit` de una copia es un fichero, o una carpeta si la copia tiene `pending`. Los `NOTICE` no cuentan, porque los genera el build.
10. **Un fichero de la fuente sin mapear da rojo.** Para cada copia sin `pending`, se listan todos los ficheros, también en subcarpetas, de la carpeta de su original base en la `version` del registro (`skills/systematic-debugging/`). Cada uno tiene que estar en alguna `paths` o `from` de esa fuente, o en su `notCopied`. Un fichero que la fuente añade o mueve entre dos tags da rojo al subir la versión, hasta mapearlo; uno que quita, porque falta su original. Las carpetas de los `from` no se vigilan: de ellas sale un fragmento, no la copia.
11. **Las órdenes.** Las dos leen los clones de `SDD_UPSTREAM_DIR` sin red, con `git -C <clon> show <tag>:<ruta>`. Con un tag que no está en el clon dicen `<fuente>: falta <tag> en el clon <clon>`, el mismo aviso que `kit:upstream`.
    - `moon run kit:copies` (`tests/copies/check.ts`) escribe una línea por rojo: `<fichero>:<línea>: …` para los de un fichero y `<fuente>@<versión>: …` para los del registro, con ` → <fila>` si caen en un bloque con `arregla`. Una copia con `pending` da una sola línea, `<kit>: sin anotar → <fila>`, y también cuenta como rojo. Sin rojos escribe `Copias al día: <n> ficheros.`, donde `<n>` son las copias sin `pending`, y sale con 0; con alguno, con 1. Va fuera del pre-commit y de la CI: entra en rojo, y la 0311 lo lleva allí.
    - `moon run kit:copies-update -- <fuente> <tag>` (`tests/copies/update.ts`) recorre cada copia sin `pending` de esa fuente con otra versión:
      - Antes de nada lista sus bloques.
      - Si su original base no existe en el tag nuevo, no la toca y lo dice: `<kit>: su original <ruta> no existe en <tag>: mapéalo antes de actualizar`.
      - Si existe, fusiona en una carpeta temporal con `git merge-file -L kit -L <vieja> -L <nueva> <fuente anotada> <original viejo> <original nuevo>`, en LF, y solo después escribe el resultado.
      - Un código de salida negativo para la orden sin escribir nada.
      - Al acabar cambia la `version` de las copias fusionadas y la de los `from` de esa fuente, y escribe `<kit>: <vieja> → <nueva>, <n> conflictos`, con una línea por conflicto y los bloques que tiene dentro: `<kit>:<línea>: conflicto con el bloque <tarea>; si te quedas con la versión de la fuente, el bloque se pierde`.
      - Si el original cambia su frontmatter, el conflicto se resuelve con el del kit.
      - Mientras queden marcadores, `kit:copies` da `<fichero>:<línea>: conflicto de git merge-file sin resolver`.
12. **Pruebo la marca en una copia real antes del cierre, sin commitearla**: `sdd-verify/references/code-reviewer-prompt.md`, que tiene base de superpowers, bloques `de:` de wondelai y vallas, anotada en el scratchpad y pasada por `kit:copies`. Si la gramática no aguanta el texto real, se arregla aquí y no en las seis copias de la 0312. El resultado va al walkthrough.
13. **LF obligado**: `.gitattributes` gana `skills/** text eol=lf` y `cli/test/fixtures/copies/** text eol=lf`. Sin ellas, `core.autocrlf=true` deja la copia de trabajo en CRLF en cada checkout de Windows, y `git merge-file` da un conflicto de fichero entero (review, «Experimento»). El índice ya está en LF (`git ls-files --eol`: `i/lf w/crlf`), así que ningún blob cambia; la copia de trabajo de este worktree se reescribe en LF en la task, y los demás worktrees la reciben en su próximo checkout. `skills/` solo tiene ficheros de texto. Una copia sin `pending` con CR da rojo, y una que no es `.md` tiene que ser su original byte a byte, en LF.
14. **El experimento de 7.0.0 → 7.0.1 es un fixture** en `cli/test/fixtures/copies/`, para que el test corra en la CI, que no tiene clones. Lleva:
    - `subagent-driven-development/SKILL.md` de las dos versiones (MIT, cubierto por `THIRD_PARTY_NOTICES.md`);
    - la fuente anotada con los seis bloques de `make-ours.mjs` de la review, en la gramática de la decisión 2.

    Tiene que dar 2 conflictos: B4, que tocan los dos, y B5, en la sección que la 7.0.1 mueve a `references/fix-loop.md`. B1, B2, B3 y B6 fusionan solos. El test reconoce cada conflicto por el texto del bloque que contiene.
15. **`sdd-grilling` y `sdd-rubber-duck` pierden su `NOTICE`**, porque un concepto no lo genera (0300, decisión 9), y su «(MIT, see `NOTICE`)» pasa a «(MIT)». Un test nuevo da rojo si un `.md` de una skill dice «see NOTICE», con o sin comillas invertidas, en una skill sin `NOTICE`. Es el RED de esta edición: falla antes de cambiar la frase. No lanzo sujetos. La frase es una atribución que ningún paso sigue, y lo que podía romperse, el puntero a un fichero que ya no existe, lo comprueba el test (ADR 0019).
16. **`word-budget.test.ts` cuenta `dist/skills/`, no `skills/`**: es lo que lee el agente, y las marcas que pondrá la 0312, con sus citas, no se cargan. Los topes no cambian, porque hoy los dos cuentan lo mismo. Es un test del repo, no un comportamiento de `kit-distribution`, y no va al delta.
17. **El `NOTICE` de una skill agrupa por fuente y versión**: una cabecera por pareja, con todas sus rutas. Pasar el registro a fichero a fichero no lo cambia; cambia donde cambia la clasificación:
    - el de `sdd-verify` pierde mattpocock;
    - el de `sdd-agent-writing` gana `testing-skills-with-subagents.md` y `SKILL-MECHANICS.md`;
    - los de `sdd-grilling` y `sdd-rubber-duck` desaparecen (decisión 15).

    La tabla de `THIRD_PARTY_NOTICES.md` pasa a una fila por entrada.
18. **Los mensajes de los THEN del delta los he redactado yo**, en castellano y con la forma `<fichero>:<línea>: <qué falla>` de la 0300, salvo el de tag que falta, que es el de hoy.

- Política de modelos: revisores de la spec, dominio opus + effort medium y técnica sonnet + effort medium (hechos) · ejes de la revisión final: Spec opus+high, Código sonnet+high, Arquitectura opus+high · sin otros despachos en paralelo · en paralelo hasta `control.maxParallelAgents` (3). Al aprobar la spec, esta línea es la confirmación de paralelizar los tres ejes.

Fusión del delta en una copia de `.docs/sdd` (`sdd capability merge`): `kit-distribution.md` con 12 requisitos añadidos, 1 sustituido y sus 5 reglas sustituidas, sin rechazos; `sdd capability check` pasa.

### Decisiones tomadas con el dev-lead

- Partir la 0302: la maquinaria aquí y aplicarla a las copias en la 0312 — «1» (2026-11-03, a la pregunta de partir por sus 7 tasks).
- Revisar la spec con dos revisores en paralelo, dominio en Opus y técnica en Sonnet — «1» (2026-11-03).
- La comprobación es el diff cubierto por marcas; la fuente de una copia va en LF y con los saltos del original; los originales salen de los clones sin red, con «falta el tag X en el clon»; las comprobaciones entran en rojo y esta feature no arregla ninguna frase; un arreglo sustituye y nunca añade — del prompt de arranque, «Decisiones ya tomadas».
- `sdd-grilling` como propia con su entrada de concepto — del prompt de arranque, «Alcance».

## Intent

Hoy una copia es el texto que quedó tras años de ediciones, en CRLF y con un párrafo por línea, y nada dice qué frase es de la fuente y cuál del kit. Esto tiene tres efectos:
- el A+C de `sdd-implement:18` entró sin que nada lo viera;
- actualizar a una versión nueva de superpowers es leer el diff a mano;
- la comprobación por líneas literales del prototipo dejó en verde un borrado.

El éxito se mide en un fixture: un borrado sin `quita` y una `sustituye` vieja dan rojo, y el experimento de 7.0.0 → 7.0.1 da solo sus 2 conflictos. En el repo, `kit:copies` solo da líneas `sin anotar → <fila>`, y `kit:upstream` los mismos rojos de hoy. Además, la maquinaria tiene que bastar para que la 0312 anote las copias sin cambiar la marca. Fracasaría si una diferencia sin marca pasara en verde, o si la 0312 tuviera que rehacer la gramática.

## Scope

- Entra:
  - la marca y su lectura, en `tests/copies/`, con las funciones de `build/dist.ts` exportadas;
  - las comprobaciones de las decisiones 2 a 6, 10 y 13, con sus fixtures en `cli/test/kit/` y `cli/test/fixtures/copies/`;
  - `kit:copies` y `kit:copies-update`, en `moon.yml`;
  - `upstream.json` fichero a fichero (decisiones 7 a 9), con `build/sources.ts`, `build/notices.ts` y `tests/upstream/check.ts`;
  - el test de clasificación;
  - `.gitattributes`;
  - las frases de atribución de `sdd-grilling` y `sdd-rubber-duck`, con su test;
  - `word-budget.test.ts` sobre `dist/`;
  - `THIRD_PARTY_NOTICES.md` y los `NOTICE`, regenerados, y `dist/`, reconstruido.
- No entra:
  - anotar las copias, subirlas al último tag de su fuente (hoy superpowers v7.0.2), las versiones en el texto y las entradas de mattpocock `code-review` y `rubber-duck`: 0312;
  - portar `cli/src/tasks` a los scripts de superpowers v7.0.2: 0313;
  - `sdd-grilling` contra `brainstorming` 7.0.2 y `grilling` de mattpocock v1.3.2: 0314;
  - `sdd-implement`: 0296;
  - copia o propia de `sdd-archive` y de las `references/` de `sdd-propose`: 0305 y 0306;
  - OpenSpec de `sdd-verify`: 0297;
  - arreglar un A+C: 0307;
  - las comprobaciones de las propias, de las excepciones pegadas y del tamaño: 0304;
  - el pre-commit y la CI: 0311.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| Entradas `copy` agrupadas (`kit` de carpeta, varias `paths`) | `upstream.json` (todas las `copy`); `cli/test/kit/notices.test.ts:15` (`toy`); `cli/test/kit/upstream-watch.slow.test.ts` (sus registros de prueba) | decisión 7: solo con `pending`; los tests se adaptan en la task del registro |
| Ports y `code-review` de mattpocock como `copy` | `upstream.json`; tabla de `THIRD_PARTY_NOTICES.md` (columna «Tipo») | decisión 8: `concept` |
| `skills/sdd-grilling/NOTICE`, `skills/sdd-rubber-duck/NOTICE` y su «see `NOTICE`» | esos `NOTICE` y `dist/`; `skills/sdd-grilling/SKILL.md:10`; `skills/sdd-rubber-duck/SKILL.md:10` | decisión 15 |
| `mattpocock/skills` fuera del `NOTICE` de `sdd-verify` | «(both MIT, see `NOTICE`)», `skills/sdd-verify/references/code-reviewer-prompt.md:210` | 0312: es una de las siete líneas con versión en el texto (§2 del ticket de la 0300) |
| Lo que cuenta el tope de palabras de una skill (`skills/` → `dist/skills/`) | `cli/test/kit/word-budget.test.ts:64-68` | decisión 16 |
| `kit:upstream` solo vigila `paths`; `<kit>` de carpeta en su mensaje | `tests/upstream/check.ts:83`; requisito «El corte compara cada entrada del registro con su fuente» | delta, `MODIFIED`: vigila también `from`, y `<kit>` es un fichero en una copia sin `pending` |
| Una marca de línea entera dentro de una valla se copia tal cual (enmienda 2026-11-03) | `build/dist.ts:37-42` (`isMarkToDrop`); `cli/test/kit/dist.test.ts:22` (`keeps a kit mark inside a fenced code block`) y `:42` (`keeps a kit mark inside a fence nested in a list`); requisito «La skill que carga el agente sale limpia del build» | delta, `MODIFIED`: también se quita; el test pasa a comprobarlo |
| `nextBlock`, `FENCE` y `WHOLE_LINE_MARK`, internos de `build/dist.ts` | `build/dist.ts:22-35` | decisión 2: exportados y compartidos con `tests/copies/` |
| «hasta que la 0302 lo pase a marcas en la fuente anotada» | `.docs/sdd/decisions/0022-three-rules-for-kit-text.md:40` | nada: la ADR es inmutable, y la 0312 (`parent: 0302`) es quien lo pasa |
| Prototipo de las comprobaciones (a) y (c) | `specs/20261103-170656-proposal-0301-kit-three-rules/review-scripts/checks.mjs` | se queda: es evidencia de la review; lo sustituye `tests/copies/` |

- Filas que implementa: 0302 → la propia fila, reescrita al partirla; las demás menciones (`0296`, `0305`, `0306`, `0307`, `0311` del roadmap y la ADR 0022) siguen siendo ciertas con la 0312 detrás: comprobado con `git grep -n 0302 -- ':!.docs/sdd/specs' ':!.docs/sdd/field-reports'`.
- Una pieza entra, otra sale: sale la forma agrupada del registro, y con ella la ambigüedad de qué fichero sale de qué fuente; salen dos `NOTICE` que atribuían texto que ya no se copia.

## Approach

Las comprobaciones son funciones puras sobre texto (la fuente anotada, el original y su versión), probadas con fixtures en `cli:test`. Las órdenes `kit:copies` y `kit:copies-update` solo añaden la lectura de los clones, como `kit:upstream`, y se prueban con un repo git temporal en un `*.slow.test.ts`. El registro cambia de forma una vez; los generadores de avisos y `kit:upstream` lo leen aplanando `from`. El orden de las tasks: la marca y las comprobaciones; el registro; `kit:copies` con los clones; la actualización con su experimento.

## Dónde se prueba

- La marca, el diff, A+C, la absoluta, el 50 %, LF y el conflicto sin resolver: funciones puras con fixtures de texto, en `cli/test/kit/copies.test.ts`, como `dist.test.ts` prueba `stripMarks`.
- Fichero sin mapear, tag que falta, `pending` y la salida de las órdenes: `kit:copies` y `kit:copies-update` contra un repo git temporal, en `cli/test/kit/copies.slow.test.ts`, como `upstream-watch.slow.test.ts`.
- El experimento: `cli/test/kit/copies.test.ts`, con los originales del fixture y `git merge-file`.
- La clasificación, «see `NOTICE`» y `from` en `kit:upstream`: `cli/test/kit/notices.test.ts` contra el `upstream.json` real, y `upstream-watch.slow.test.ts`.
- La marca en una copia real: a mano, decisión 12, en el walkthrough.

## Términos y ADR

- Términos resueltos: **fuente anotada** — el fichero de `skills/` de una copia: su original con los bloques del kit marcados · **original** — el fichero de la fuente en el tag del registro · **original base** — el de `paths`, contra el que se hace el diff; los de `from` solo aportan fragmentos · **lo quitado** — las palabras del original que un bloque quita, y no vuelve a decir.
- ADR candidatas: ninguna. La regla ya está en la ADR 0022, y esto la aplica.

## Delta de comportamiento

### Capacidad: `kit-distribution`

#### ADDED — Una copia es su original más bloques del kit marcados

- GIVEN una copia anotada, sin `pending`, cuyo original es `skills/subagent-driven-development/SKILL.md` de superpowers `v7.0.0` (el fixture del experimento)
- WHEN corre `moon run kit:copies`
- THEN cada línea fuera de un bloque del kit casa, exacta y en su orden, con una línea del original, y cada tramo del original que no casa está cubierto por la S de las marcas `sustituye` o `quita` que hay entre sus dos líneas vecinas
- AND borrar la línea del original «Never start implementation on a main/master branch without your human» sin marca da `<fichero>:<línea>: falta texto del original sin marca quita: «Never start implementation on a main/master…»`, en la línea de la vecina anterior
- AND una línea que no casa, también una línea en blanco nueva que parte un párrafo, da `<fichero>:<línea>: texto que no es del original ni está en un bloque del kit`
- AND el frontmatter queda fuera de la comparación
- AND un bloque `de: Wondel <ruta>` cuyo texto, con los espacios normalizados, no está en ese original da `<fichero>:<línea>: el bloque dice de Wondel <ruta>, y su texto no está en ese original`

#### ADDED — Lo que sustituye una marca es lo que el bloque quita

- GIVEN la línea del original «superpowers:using-git-worktrees to create one or verify the existing one.» y un bloque `<!-- kit: d59bf7b5 · sustituye: «superpowers:using-git-worktrees» -->` con «`sdd-worktrees` to create one or verify the existing one.»
- WHEN corre `moon run kit:copies`
- THEN no da rojo: lo quitado es solo «superpowers:using-git-worktrees»
- AND con `sustituye: «superpowers:using-git-worktrees to create»` da `<fichero>:<línea>: la marca sustituye «superpowers:using-git-worktrees to create», y el bloque quita «superpowers:using-git-worktrees»`
- AND una `quita: «S»` cuya S no cuadra con lo quitado da el mismo aviso con `quita`
- AND un `…` en S salta lo de en medio: `sustituye: «Four things stop you, and only these…For those, stop and ask.»` cuadra con el párrafo entero quitado

#### ADDED — Una frase sustituida no queda al lado de la del kit

- GIVEN un bloque `<!-- kit: 0296 · sustituye: «Four things stop you, and only these…For those, stop and ask.» -->` cuyo contenido vuelve a decir el párrafo de la fuente y añade «The kit's own stops are a fifth class»
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>:<línea>: la marca sustituye «Four things stop you, and only these…», y el bloque vuelve a decir «Four things stop you, and only these»`
- AND una S que el original repite en otro sitio que el kit no toca no da rojo
- AND si S no está en ningún sitio del original da `<fichero>:<línea>: la marca sustituye «S», que no está en el original <ruta>@<versión>: la marca es vieja`

#### ADDED — Un añadido junto a una absoluta del original da rojo

- GIVEN el párrafo del original «Four things stop you, and only these: … For those, stop and ask.» y, en ese mismo párrafo, un bloque `<!-- kit: 4597d47e -->` con «The kit's own stops are a fifth class, not an exception to the four» (el A+C de `sdd-implement:18`)
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>:<línea>: añadido del kit sin sustituye en un párrafo con una absoluta del original («only»)`
- AND las absolutas son `only`, `never`, `always`, `must` y `every`, como palabra entera y sin distinguir mayúsculas, y el aviso cita la primera
- AND el mismo bloque separado del párrafo por una línea en blanco no da rojo

#### ADDED — La marca del kit se escribe con su gramática

- GIVEN la fuente anotada de una copia sin `pending`
- WHEN corre `moon run kit:copies`
- THEN una marca sin tarea o con un campo desconocido da `<fichero>:<línea>: marca del kit sin tarea o con un campo desconocido: <campo>`
- AND `sustituye` sin contenido da `<fichero>:<línea>: la marca sustituye no tiene contenido: para quitar sin sustituir, usa quita`
- AND `<!-- kit: fin -->` sin bloque abierto da `<fichero>:<línea>: <!-- kit: fin --> sin bloque abierto`
- AND una S con `«`, `»` o `-->` da `<fichero>:<línea>: la cita de la marca no puede llevar «, » ni -->: sáltalos con …`
- AND un `de: <fuente> <ruta>` que no está en el `from` de su entrada da `<fichero>:<línea>: el bloque dice de <fuente> <ruta>, que no está en el from de su entrada`
- AND un bloque sin `fin` acaba en la primera línea en blanco fuera de una valla, también si la valla lleva líneas en blanco dentro
- AND una marca dentro de una valla abre un bloque, que acaba en `fin` o en la marca siguiente, y sus líneas en blanco son del bloque

#### ADDED — Lo que dice kit:copies de cada copia

- GIVEN `upstream.json` con una copia anotada y `skills/sdd-debugging/SKILL.md` con `pending: "0312"`
- WHEN corre `moon run kit:copies`
- THEN escribe una línea por rojo
- AND un rojo dentro de un bloque con `arregla: 0307` acaba en ` → 0307`
- AND la copia con `pending` da solo `skills/sdd-debugging/SKILL.md: sin anotar → 0312`
- AND con algún rojo sale con código 1; sin ninguno, escribe `Copias al día: <n> ficheros.`, con `<n>` las copias sin `pending`, y sale con 0

#### ADDED — Una copia que ya no lo es da rojo

- GIVEN una copia anotada cuya salida conserva el 40 % de las frases de 6 palabras de su original base
- WHEN corre `moon run kit:copies`
- THEN da `<kit>: conserva el 40 % de su original <ruta>; por debajo del 50 % es propia: pásala a own`
- AND con el 50 % o más no da rojo

#### ADDED — La fuente de una copia va en LF

- GIVEN una copia sin `pending` con un `\r\n`
- WHEN corre `moon run kit:copies`
- THEN da `<fichero>: tiene finales de línea CRLF; la fuente de una copia va en LF`
- AND una copia que no es `.md` que difiere de su original en LF da `<fichero>: no es su original <ruta>@<versión> byte a byte`
- AND `.gitattributes` lleva `skills/** text eol=lf` y `cli/test/fixtures/copies/** text eol=lf`

#### ADDED — Un fichero de la fuente sin mapear da rojo

- GIVEN una copia anotada cuyo original es `skills/subagent-driven-development/SKILL.md`, subida a `v7.0.1`, versión que añade `skills/subagent-driven-development/references/fix-loop.md`, sin mapear en `upstream.json`
- WHEN corre `moon run kit:copies`
- THEN da `superpowers@v7.0.1: skills/subagent-driven-development/references/fix-loop.md está en la carpeta de una copia y no en upstream.json: mapéalo en paths, from o notCopied`
- AND un original que ya no existe en su versión da `<kit>: su original <ruta> no existe en <versión>`
- AND con un tag que no está en el clon da `superpowers: falta v7.0.1 en el clon <clon>`, sin ir a la red

#### ADDED — Actualizar una copia es fusionarla con git merge-file

- GIVEN la fuente anotada de `subagent-driven-development/SKILL.md` de `v7.0.0` con los seis bloques del experimento de la review
- WHEN corre `moon run kit:copies-update -- superpowers v7.0.1`
- THEN fusiona con `git merge-file -L kit -L v7.0.0 -L v7.0.1 <fuente anotada> <original v7.0.0> <original v7.0.1>`, en LF, escribe `<kit>: v7.0.0 → v7.0.1, 2 conflictos` y cambia su `version` en `upstream.json`
- AND los dos conflictos son el del bloque que tocaron los dos (B4) y el de la sección que la 7.0.1 movió a `references/fix-loop.md` (B5), cada uno con su línea `<kit>:<línea>: conflicto con el bloque 4597d47e; si te quedas con la versión de la fuente, el bloque se pierde`; los otros cuatro fusionan solos
- AND `kit:copies` da `<fichero>:<línea>: conflicto de git merge-file sin resolver` mientras queden marcadores
- AND una copia cuyo original base no existe en el tag nuevo no se toca: `<kit>: su original <ruta> no existe en v7.0.1: mapéalo antes de actualizar`, y su `version` no cambia
- AND un `git merge-file` que falla para la orden sin escribir ninguna copia ni el registro
- AND una copia con `pending` no se toca

#### ADDED — Cada fichero de skills/ es copia o propia

- GIVEN `skills/sdd-tdd/references/writing-e2e.md`, que no está en ningún `kit` de una copia ni bajo `own`
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-tdd/references/writing-e2e.md no está clasificado en upstream.json: ponlo en una entrada copy o en own`
- AND un fichero en una copia y bajo `own` a la vez falla igual
- AND los `NOTICE` no cuentan, y un fichero bajo la carpeta `kit` de una copia con `pending` está clasificado
- AND una entrada `copy` sin `pending` con más de un fichero en `kit` o más de una ruta en `paths` falla con `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero`

#### ADDED — Una skill que remite a su NOTICE lo tiene

- GIVEN `skills/sdd-grilling/SKILL.md` con «(MIT, see `NOTICE`)» y `sdd-grilling` solo con una entrada `concept` en `upstream.json`
- WHEN corre `cli:test`
- THEN falla con `skills/sdd-grilling/SKILL.md dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera`
- AND la forma sin comillas invertidas, «see NOTICE», cuenta igual

#### MODIFIED — La skill que carga el agente sale limpia del build (antes: "un `<!-- kit:` dentro de un bloque de código se copia tal cual")

- GIVEN `skills/sdd-tdd/SKILL.md` con una línea `<!-- kit: 0186 · sustituye: «…» -->` encima de un bloque
- WHEN se ejecuta `moon run kit:build`
- THEN `dist/skills/sdd-tdd/SKILL.md` es esa fuente sin esa línea, y lo demás byte a byte
- AND una fuente sin marcas sale idéntica en `dist/`
- REMOVED AND un `<!-- kit:` dentro de un bloque de código se copia tal cual
- AND una línea entera `<!-- kit: … -->` dentro de un bloque de código también se quita; un `<!-- kit:` con texto delante o detrás dentro de un bloque de código se copia tal cual
- AND una línea con `<!-- kit:` y texto delante o detrás, sin cerrar, o en el frontmatter, para el build con `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código`, y `dist/` no cambia

#### MODIFIED — El corte compara cada entrada del registro con su fuente (antes: solo las `paths` de cada entrada)

- GIVEN un concepto de OpenSpec revisado en `v1.16.0`, con sus rutas, y un tag `v1.17.0` en el clon
- WHEN corre `moon run kit:upstream`
- THEN si `v1.17.0` no toca esas rutas, pasa y escribe `Fuentes al día: <n> entradas.`
- AND si las toca, falla con `OpenSpec · <kit>: v1.16.0 → v1.17.0, cambian sus rutas: git -C <clon> diff v1.16.0 v1.17.0 -- <rutas>`
- AND si una ruta no existe en `v1.17.0`, falla con `OpenSpec · <kit>: la ruta <ruta> no existe en v1.17.0`
- AND si `v1.16.0` no está en el clon, falla con `OpenSpec: falta v1.16.0 en el clon <clon>`
- AND una entrada cuya `version` es un commit (`85f83d3`) se compara igual, contra el último tag de su fuente
- AND sin `SDD_UPSTREAM_DIR`, falla con `Falta SDD_UPSTREAM_DIR: la carpeta con los clones de las fuentes vigiladas.`
- AND cada `from` de una entrada se compara igual, con su propia fuente y versión, y su línea nombra el `kit` de la entrada
- AND en una copia sin `pending`, `<kit>` es su único fichero

#### Reglas de la capacidad — kit-distribution

- **Dónde viven los datos**: la versión de cada fuente de terceros, solo en `upstream.json`, en la raíz del repo, que no viaja; también si cada fichero de `skills/` es copia o propia (`own`) y qué ficheros de la carpeta de una copia no se copian (`notCopied`). La versión del plugin, solo en `.claude-plugin/plugin.json` de la raíz; `dist/.claude-plugin/plugin.json` es su copia generada. Lo que viaja, en `dist/`, generado desde `skills/` y la lista blanca. Qué frase de una copia es del kit, solo en las marcas de su fuente anotada en `skills/`.
- **Idioma de los nombres**: rutas y claves en inglés (`upstream.json`, `kind`, `copy`, `concept`, `pending`, `from`, `own`, `notCopied`); los campos de la marca y los mensajes, en castellano (`sustituye`, `quita`, `de`, `arregla`, `fin`).
- **Límites**: una copia conserva al menos el 50 % de su original base, medido por frases de 6 palabras; si no, es propia. Las absolutas son `only`, `never`, `always`, `must` y `every`. La cita S de una marca no lleva `«`, `»` ni `-->`.
- **Avisos**: `dist/ no es lo que sale del build: ejecuta moon run kit:build` · `<fichero> no es lo que sale de upstream.json: ejecuta moon run kit:notices` · `<fichero>:<línea>: marca mal puesta: una marca va sola en su línea, <!-- kit: … -->, fuera del frontmatter y de un bloque de código` · `<fuente>: licencia <licencia> sin plantilla en build/notices.ts` · los de `kit:upstream` del requisito «El corte compara cada entrada del registro con su fuente» · los de `kit:copies` y `kit:copies-update` de los requisitos «Una copia es su original más bloques del kit marcados», «Lo que sustituye una marca es lo que el bloque quita», «Una frase sustituida no queda al lado de la del kit», «Un añadido junto a una absoluta del original da rojo», «La marca del kit se escribe con su gramática», «Lo que dice kit:copies de cada copia», «Una copia que ya no lo es da rojo», «La fuente de una copia va en LF», «Un fichero de la fuente sin mapear da rojo» y «Actualizar una copia es fusionarla con git merge-file» · `<fichero> no está clasificado en upstream.json: ponlo en una entrada copy o en own` · `upstream.json: la entrada <n> es una copia sin pending con más de un fichero; una copia anotada va fichero a fichero` · `<fichero> dice see NOTICE, y la skill no tiene NOTICE: una skill sin copias no lo genera`.
- **Regla ante conflicto**: manda la fuente (`skills/`, `upstream.json`), y `dist/` y los avisos se regeneran; nunca se edita `dist/` a mano. Entre una copia y su original manda el original en su tag: una diferencia sin marca es un rojo de la copia, nunca del original.

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `sdd-grilling` `SKILL.md` | 842 / 900 | 58 | sin cambio (la edición quita una palabra) |
| `sdd-rubber-duck` `SKILL.md` | 595 / 600 | 5 | sin cambio (la edición quita una palabra) |

## Previsión de coste

| Tanda | Sujetos (batería) | $ |
| --- | --- | --- |
| RED | 0 — la edición quita «see `NOTICE`» de una atribución; su RED es el test del requisito «Una skill que remite a su NOTICE lo tiene» | 0 |
| GREEN | 0 — el mismo test en verde | 0 |
| Una tanda de REFACTOR | 0 | 0 |
| Controles | 0 | 0 |
| Medición tras la revisión final | 0 | 0 |
| Suma | 0 | 0 |

## Enmiendas

- 2026-11-04 — el «No entra» y la decisión 1 apuntan a la 0313 (`cli/src/tasks`) y a la 0314 (`sdd-grilling`), y la 0312 sube cada copia al último tag de su fuente (hoy superpowers v7.0.2), no a la 7.0.1; lo que construye la 0302 no cambia — aplica literal la decisión del dev-lead de la propuesta 0301, «Enmiendas», 2026-11-04 («ok a las cinco, adelante», que trae la sesión `develop` en f76b56d8) — sin aprobar (aplica literal una decisión del dev-lead)
- 2026-11-03 — una marca vale también dentro de una valla de código: el build la quita y el bloque acaba en `fin` o en la marca siguiente (decisión 2, AND nuevo de «La marca del kit se escribe con su gramática» y `MODIFIED` de «La skill que carga el agente sale limpia del build») — la prueba real de la decisión 12 lo exhibió: en `code-reviewer-prompt.md` todo el prompt de superpowers va en una valla, y en `sdd-parallel-agents` el kit cambia un ejemplo dentro de un ```text; sin la enmienda, esos cambios solo se marcan envolviendo la valla entera en un bloque, y ni el diff ni `git merge-file` ven nada dentro (Task 5) — aprobada: «1» (opción «Apruebo la enmienda: Task 5 al final»)

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-03 | aprobada (opción «Apruebo») |
