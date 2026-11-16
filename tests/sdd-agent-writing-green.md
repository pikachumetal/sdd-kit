# `sdd-agent-writing` — RED y GREEN (feature 0151)

Batería: `tests/batteries/sdd-agent-writing/`. Sujetos Sonnet; salidas en `.docs/sdd/specs/20261101-151300-feature-0151-agent-writing/`, carpetas `red`, `red2`, `red3` y de `green` a `green5`, más `green-using` y `green-using2`. Kit del RED: `git archive` de `78b0b6fa`. Molde pequeño y un solo turno: un RED limpio puede no reproducir lo que pasó en campo.

| Escenario · fila | RED | GREEN |
| --- | --- | --- |
| `p1` puerta | 0/2: `sdd-propose` y `superpowers:writing-skills` (`red3`) | 2/2 `sdd-agent-writing` |
| `p1` R1 prueba | 0/2 dejan un escenario; `p1-2`: «La skill está sin validar» | 2/2 `scenario.md` escrito |
| `t1` R5 traspaso | falla 2/2: «pasa el trabajo a la skill `avisos`» | 2/2: «lo primero en este paso: invoca `avisos` con `Skill`; no hagas nada más desde aquí» |
| `t1` R4 regla en su paso | limpio 2/2 | sin guía; limpio |
| `b1` R6 partidas | falla 2/2: 9 sujetos, 4,50 $ | 2/2: 13 sujetos, 6,5 $ y 16, 8 $ |
| `f1` R3 forma | limpio 2/2 | control 1/1 |
| `b2` R7 y R8 | limpio 2/2 | control 1/1 |
| `h1` R9 choque | limpio 2/2: avisan del paso que para | control 1/1 |
| `m1` R10 mensaje | limpio 2/2 | control 1/1 |
| `c1` R11 disparador | limpio 2/2 | control 1/1 |

Los frentes limpios no llevan guía nueva (decisiones 6 y 7 de la spec): sus filas siguen en la deuda como posible falso negativo.

Un sujeto de este molde no puede escribir en `.claude/skills/` si la herramienta le pide permiso: varios dejan el cambio en su mensaje, y se califica sobre ese texto.

`p1` R2: la `description` de `green4/out/p1-2/skill.md` dice solo cuándo usarla; de `p1-1` no quedó copia, y `green5` no la guarda.

**`e1`, editar una skill existente.** `green3` y `green4` no valen: el arnés anteponía «Invoca la skill sdd-kit:sdd-agent-writing», y un ruling se apoyó en ese artefacto; lo cazó el eje Spec de la revisión final. Sin nombrarla, con la `description` final (`green5`): 2/2 entran por `sdd-propose`. Texto de la `description`, sin copia fijada por carpeta: `green5` y `green-using2`, la final; las anteriores no se pueden comprobar.

`p2`, sin `.claude/skills/` en el molde y sin ruta en la petición (`green5`): 1/1 apunta a `.claude/skills/migraciones-sql/` (el `Write` se denegó por permiso: no queda fichero).

Tramo `sdd-propose` de `using-sdd` con la fila nueva y el texto final (`green-using2`): las 10 filas en verde, `bt1` incluida. `green-using`, la primera tanda, se cortó por el techo de sujetos.

Coste: 63 sujetos, 10,88 $, frente a una previsión de 45 y 18,66 $: se pasa en sujetos y no en dinero. Lo que sumó 18 de más fue repetir `e1`, `p1` y el tramo tras la revisión final.

Efecto de más que se acepta: `m1` y `f1` escriben o proponen un `scenario.md` también al editar una skill que ya existe.
