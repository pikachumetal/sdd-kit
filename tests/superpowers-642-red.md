# Evidencia RED — compatibilidad con superpowers 6.4.2 (patch 0082, 2026-09-27)

RED previo al fix (Art. I y Art. V), sobre `develop` en `c885270` con superpowers **6.4.2** instalado desde `superpowers-marketplace`. Es el repaso de la 6.4.2 con la misma forma que el de la 0026 ([`superpowers-641-red.md`](superpowers-641-red.md)): lo que se decide leyendo el texto de superpowers se mide con `diff`, y lo que depende de la conducta, con sujetos.

## Qué cambia de la 6.4.1 a la 6.4.2

`diff -rq 6.4.1 6.4.2` en `~/.claude/plugins/cache/superpowers-marketplace/superpowers/` da esto (sin contar los manifests, `RELEASE-NOTES.md` y `CLAUDE.md`, que se borra):

- `skills/writing-plans/SKILL.md`: «What a Step Contains» sustituye a «No Placeholders». En un paso de test van el nombre del test y sus asserts con los valores de la spec. En un paso de código van la firma exacta, el fichero y los valores de la spec, y el cuerpo solo para un algoritmo que la firma y los tests no determinan. El self-review añade «Proportion»: un plan varias veces más largo que su spec es una transcripción. El lector del plan pasa a ser un ingeniero capaz, y los pasos se miden como «one action with a checkable result», no como «2-5 minutes».
- `skills/writing-plans/plan-document-reviewer-prompt.md`: se borra. El kit no lo cita (`grep` en `skills/`: 0 apariciones).
- Las demás skills que invoca el kit no cambian: `brainstorming`, `subagent-driven-development`, `executing-plans`, `systematic-debugging`, `writing-skills`, `requesting-code-review` y `finishing-a-development-branch`.

## Frentes

| Frente | Evidencia | Resultado |
| --- | --- | --- |
| Override del Execution Handoff (`overrides-superpowers.md:11`) | El diff no toca «Execution Handoff» | **Sin cambio**: la fila sigue valiendo |
| «Frequent commits» (`overrides-superpowers.md:15`) | La frase sigue en el Overview de la 6.4.2 | **Sin cambio** |
| «Review Focus» | El paso 4 del self-review es igual en las dos versiones | **Sin cambio**: sigue en la deuda del roadmap («`plan-template.md` no tiene "Review Focus"») |
| `plan-template.md:150` frente a «What a Step Contains» | El Step 1 pedía «código real cuando ayude», y la 6.4.2 pide la firma y deja el cuerpo al implementador | **El texto contradice a superpowers** |
| Conducta del plan con la plantilla vieja | 2 sujetos, más abajo | **No se reproduce la transcripción**: `writing-plans` 6.4.2 manda más que la plantilla |
| Dependencia del kit | `claude-plugins-official` fija superpowers a `sha 5bf4e78…` (6.4.1); obra apunta a la cabeza (6.4.2). La dependencia del kit instaló `superpowers@claude-plugins-official` 6.4.1 con `"auto": true` junto a la de obra | **Falla**: dos superpowers instalados, y el kit deshabilitado al quitar el oficial |

## Sujetos

Molde de la task 0006: la spec de la 0012 aprobada, perfil `delegate` y la petición «Escribe el plan.md y para ahí». Lanzador: [`subject.sh`](../.docs/sdd/specs/20260927-105403-patch-0082-superpowers-obra-642/red/subject.sh), con `tests/headless/run.sh`. El kit es una copia del working tree con `plan-template.md` de `HEAD`. La spec tiene 62 líneas.

| Sujeto | Coste | Plan | Líneas en bloques de código | Resultado |
| --- | --- | --- | --- | --- |
| `h-1` | 1,41 $ | 243 líneas | 13, en §1 del diseño: el `AddColumn` de la migración y el cuerpo entero de `MapGet`, que ya fijan la firma y los tests | Pasos con firma, fichero y valores; 1 cuerpo que sobra |
| `h-2` | 1,04 $ | 301 líneas | 94, todo tests con sus asserts | Pasos con firma, fichero y valores; ningún cuerpo |

Pedido por el dev-lead para saber si un modelo mejor sigue más a `writing-plans`: el mismo escenario con `MODEL=opus` (salida en `red-opus/out/`).

| Sujeto | Coste | Plan | Líneas en bloques de código | Resultado |
| --- | --- | --- | --- | --- |
| `red-opus/h-1` | 1,09 $ | 240 líneas | 0 | Ningún cuerpo; asserts como código (`Assert.Equal`, 8) |
| `red-opus/h-2` | 1,37 $ | 241 líneas | 3: el `AddColumn` de la migración, con los valores de la spec | Ningún cuerpo; tests sin asserts como código |

Los cuatro sujetos cargan `superpowers:writing-plans` 6.4.2. Se miden dos criterios de «What a Step Contains»: (a) ningún cuerpo que la firma y los tests ya determinan, y (b) los asserts de cada test como código.

| Modelo | (a) sin cuerpo | (b) asserts como código |
| --- | --- | --- |
| Sonnet | 1/2 | 1/2 |
| Opus | 2/2 | 1/2 |

**No se reproduce la transcripción**: ningún plan copia el código entero. Pero `writing-plans` 6.4.2 solo se sigue a medias, con los dos modelos, y la plantilla vieja no ayuda porque pide «código real cuando ayude».
