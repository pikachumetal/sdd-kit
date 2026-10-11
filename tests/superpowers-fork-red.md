# Evidencia RED — fork de brainstorming y writing-plans (feature 0168, 2026-10-11)

RED previo a escribir las reglas nuevas de la entrevista (Art. I), con el kit del commit de apertura `e23b5375` (`git archive`) y superpowers 7.0.0 cargado desde la caché de `superpowers-marketplace` (`SUPERPOWERS_DIR`). Sonnet, `tests/headless/run.sh`. Escenarios en las baterías de `sdd-propose` (`pb`, `adr`, `h1`) y de `sdd-grilling` (`sk`); rúbricas en sus `battery.md`. Salidas en la carpeta de la spec, `red/out/`.

## Sujetos

| Sujeto | Turnos | Coste | Conducta | Veredicto |
| --- | --- | --- | --- | --- |
| `h1-1` | 19 | 0,63 $ | `>>> Skill: superpowers:brainstorming` en `tools.txt`; escribe `spec-new.md` y `plan-new.md` | falla (se esperaba) |
| `pb-5` | 17 | 0,52 $ | con el plan en 5 tasks, escribe `spec.md` directamente: ningún mensaje con una sección del diseño antes | falla |
| `pb-6` | 18 | 0,82 $ | igual que `pb-5`; ruido: para a mitad diciendo que «algo distinto de mí está modificando el mismo fichero» y sigue | falla (con ruido) |
| `adr-1` | 20 | 0,49 $ | lista `.docs/sdd/decisions/`, lee la ADR 0003, la cita en ✋ y en «Términos y ADR», y propone la 0004 que la sustituye (`superseded by 0004`) | limpio |
| `adr-2` | 22 | 0,57 $ | igual: lee la 0003, «Revierto el ADR 0003», candidata `0004 — … Sustituye al 0003` | limpio |
| `sk-5` | 12 | 0,25 $ | ante cómo se ve la columna Estado, tres maquetas en texto aparte; ninguna sobre la app real ni con el detector de `§Frontend` | falla |
| `sk-6` | 11 | 0,23 $ | igual: «Bocetos con tus datos» en texto | falla |

## Invalidados por el molde

Apartados en `red-molde/out/`; su coste cuenta en el techo (1,68 $).

| Sujetos | Causa | Corrección |
| --- | --- | --- |
| `pb-1` | la petición pedía `--desde`/`--hasta` y el molde solo guarda el día de la semana: el sujeto pregunta de dónde sale la fecha | `pb` arranca en el paso 4 con la entrevista cerrada |
| `pb-3`, `pb-4` | el sujeto cuenta «3 tasks o menos»: la premisa de 4 o más no se da | la petición fija «el plan sale en 5 tasks» |
| `sk-1`…`sk-4` | la petición daba por hecho un estado que el molde no guarda: los sujetos preguntan de dónde sale | `mold-web/public/reservas.json` con `estado` |

Además, `tests/headless/extract.mjs` no pudo parsear una línea larga del stream de `pb-5` y `pb-6` (`SyntaxError … in JSON at position 1745`), y sus `texts.txt` quedaron incompletos: el veredicto sale del `.jsonl` del scratchpad.

## Conclusión

| Regla | RED | Qué hace |
| --- | --- | --- |
| Ninguna skill invoca `brainstorming` | falla 1/1 | se escribe (Task 2) |
| Diseño por secciones en features de 4 o más tasks | falla 2/2 | se escribe (Task 3) |
| La spec cita las ADR de lo que toca | **limpio 2/2** | decisión 5 del plan: no se escribe sin más; se enseña al dev-lead |
| Boceto sobre la app real | falla 2/2 | se escribe (Task 4) |

La conducta de `adr` sale de leer `.docs/sdd/` en el paso 1: los dos sujetos listan la carpeta y ven `decisions/` con una sola ADR. Es una fuente incidental en un molde pequeño (`tech-stack.md`, «Matices de campaña»): con una carpeta de varias ADR, donde la que aplica no se distingue por el nombre, la muestra no dice nada.

Total RED: 7 sujetos válidos, 4,01 $; con los invalidados, 5,69 $.
