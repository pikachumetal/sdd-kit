# Evidencia RED — changelog de cliente (2026-09-09)

Baseline de la task [changelog-cliente](../.docs/sdd/specs/20260909-194633-task-0000-changelog-cliente/spec.md) (T18): si el proyecto tiene `changelog-cliente.md`, ¿`sdd-end-release` lo actualiza al cerrar una release con la sección derivada de las release notes, sin que la skill lo diga?

## Método

Sujetos Sonnet headless (copia limpia del kit tras T17, `--plugin-dir` + `--add-dir`, `--allowedTools "Bash(*)" "Agent"`, `stream-json`). Fixture "Ledgerly-release": v1.2.0 cerrada (`releases/v1.2.0/{release-notes,feedback}.md`), `changelog-cliente.md` con la sección v1.2.0 (Resumen + Novedades calcados de sus release notes), `changelog.md` con `[Unreleased]` lleno (task 71) y el walkthrough de la 71 con tiempo. `tech-stack.md` nombra los dos changelogs. Petición: «Cierra la release v1.3.0 … con `sdd-kit:sdd-end-release`. Soy el dev-lead y no estaré disponible: prepara los pasos 1 a 6 con la versión v1.3.0 que te confirmo ahora, y deja el paso 7 (merge y tag) pendiente de mí.» Predicado: `changelog-cliente.md` gana la sección v1.3.0 con el mismo Resumen y Novedades que `releases/v1.3.0/release-notes.md`, sin IDs ni jerga, y el técnico queda sellado en su forma.

## Resultados

| | A | B | A2 (petición + «no hubo demo ni reunión») |
| --- | --- | --- | --- |
| Llegó al paso 5 | ❌ paró en el paso 2: «¿Hubo demo o reunión con cliente para v1.3.0?» (correcto; no mide) | ✅ | ✅ |
| `releases/v1.3.0/{feedback,release-notes}.md` | — | ✅ | ✅ |
| Changelog técnico sellado `[1.3.0] - 2026-09-09` + `[Unreleased]` vacía | — | ✅ | ✅ |
| Sección v1.3.0 en `changelog-cliente.md` | — | ✅ Resumen y Novedades **idénticos** a sus release notes | ✅ idénticos («mismo patrón que v1.2.0, sin IDs de task ni jerga») |
| Roadmap colapsado con línea de smoke (T15) | — | ⚠️ «smoke: 2026-09-09 · 0 hallazgos» **sin smoke ejecutado** | ✅ «smoke: pendiente … no inventé datos» |
| Paso 7 pendiente | — | ✅ | ✅ |
| Coste / turnos | 0,32 $ / 20 | 0,68 $ / 34 | 0,61 $ / 29 |

## Conclusión

**El baseline actualiza el acumulado 2/2 en cuanto el fichero existe**, y lo hace derivando (Resumen y Novedades copiados de las release notes nuevas). La guidance del paso 5 bis en `notas-y-roadmap.md` **no se escribe** (Art. I): lo que falta en el kit es que el fichero exista —la plantilla y la pregunta de la entrevista de init— y que el índice de `sdd-templates` diga cuándo se usa. Novena vez en la release que el RED recorta el alcance.

**Hallazgo colateral (T15)**: la línea «smoke: <fecha> · <N> hallazgos» invita a inventar el número cuando no hubo smoke (B escribió «0 hallazgos» sin smoke; A2 escribió «pendiente»). Una frase en `notas-y-roadmap.md`: «o «smoke: pendiente» si no se ejecutó: el número no se inventa». Medido 1 de 2; se corrige sin GREEN propio por ser la frase que el sujeto honesto ya aplicó.

**Método**: con dev-lead ausente, la petición de cierre de release debe decir si hubo demo; si no, el sujeto para en el paso 2 (correcto) y no mide.

## GREEN de la pregunta de init

Un sujeto (`sdd-init-greenfield`, entrevista simulada con persona que quiere changelog y novedades para el cliente, 16 turnos, 0,61 $): en el bloque proceso pregunta «**¿Quieres changelog del proyecto?** (`.docs/sdd/changelog.md`) Y si sí, **¿también novedades para cliente** (`changelog-cliente.md`)?» (T12). 1/1; la creación del fichero no llegó dentro del tope de turnos (la generación de documentos empieza en el T15). n = 1: es la pregunta de una receta, no una conducta que el RED haya desautorizado.
