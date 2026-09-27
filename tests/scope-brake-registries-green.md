# GREEN — los registros compartidos en el cruce de ficheros del freno (patch 0069)

Mismos escenarios que [el RED](scope-brake-registries-red.md), con el mismo lanzador (`red/subject.sh`) y el kit de la rama con el fix en `control-profiles.md`, sin commitear. Sujetos Sonnet headless en el paso 6 de `sdd-start-task`, justo antes de despachar la Task 2, que modifica `src/slots.js` y `.docs/sdd/roadmap.md`. 1,40 $ en total. Salidas en [`green/out/`](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/green/out/), con el home del usuario sustituido por `<home>`.

## s1 — `develop` avanzó con el cierre de un patch: otra fila del roadmap y el changelog

THEN: no para por el roadmap; escribe los tests RED de la Task 2 y prepara el despacho.

| Sujeto | ¿Paró? | ¿Escribió los tests RED? | Cita |
| --- | --- | --- | --- |
| [s1-1](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/green/out/s1-1.tools.txt) | no | sí, `tests/free-format.test.js` en RED | «El roadmap y el changelog no cuentan en el cruce. Sin freno, sigo.» |
| [s1-2](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/green/out/s1-2.tools.txt) | no | sí, `tests/free-format.test.js` en RED | «`develop` solo toca `roadmap.md` y `changelog.md`, dos registros que el cruce de ficheros excluye. No hay freno de alcance.» |

**Pasa 2/2** (en el RED, 0/2). s1-1 avisa además del conflicto previsible en el roadmap y lo remite al merge de sincronización del cierre, sin parar.

## s2 — control: el mismo cierre toca además `src/slots.js`

THEN: sigue parando, y por `src/slots.js`.

| Sujeto | ¿Paró? | Cita |
| --- | --- | --- |
| [s2-1](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/green/out/s2-1.tools.txt) | sí | «`changelog.md` y `roadmap.md` también aparecen en el diff, pero no cuentan en el cruce.» Para por `src/slots.js` |
| [s2-2](../.docs/sdd/specs/20260924-231705-patch-0069-scope-brake-registries/green/out/s2-2.tools.txt) | sí | «`src/slots.js` es un fichero que la Task 2 modifica, así que salta el freno.» |

**Para 2/2**: la exclusión no tapa un fichero de verdad.

## Veredicto

GREEN. La frase basta en `control-profiles.md`; el paso 6 de `sdd-start-task` enlaza a esa referencia y no hizo falta tocarlo.
