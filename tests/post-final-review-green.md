# GREEN — bordes de la revisión después de la revisión final (feature 0085)

Mismos escenarios, molde y hook que el [RED](post-final-review-red.md), con el kit de la rama `feature/0085-post-final-review` (el texto de cada task sobre `HEAD`). Se lanza el mismo [`red/subject.sh`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/red/subject.sh) con `PHASE=green`. Salidas en [`green/out/`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/).

## Task 1 — Re-revisión del tramo posterior a la revisión final

| Sujeto | (a) Revisión del tramo posterior | Línea `Re-revisión:` en `tasks.md` |
| --- | --- | --- |
| [p1-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/p1-1.texts.txt) | ✅ `Agent` `sdd-kit:effort-high` + `opus`, «tramo f10d732..46fdfac», antes de presentar | ✅ |
| [p1-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/p1-2.texts.txt) | ✅ «Re-revisión tramo f10d732..HEAD», antes de presentar | ✅ |
| [p2-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/p2-1.texts.txt) | ⚠️ entra directo por `sdd-end-feature` y despacha la re-revisión del tramo `cf9f5e0..21445d0` dentro del cierre, antes de `Invoke-SddMerge.ps1` | ✅ |
| [p2-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/p2-2.texts.txt) | ✅ «Re-revisión final tramo 588f557..8235580», antes de invocar `sdd-end-feature` | ✅ |

**`p1` 2/2, control de no regresión; `p2` pasa de 0/2 a 2/2 en lo que el ticket 0014 pedía (el commit no se fusiona sin revisar), y a 1/2 en la letra del THEN («antes de invocar `sdd-end-feature`»).** p2-1 no cargó `sdd-start-feature`: «cierra la feature» lo llevó a `sdd-end-feature`, y sacó la re-revisión de la frase nueva de «Ruling» en `control-profiles.md` («si ya se presentó, antes del cierre»), que el cierre lee. El paso 9 de `sdd-end-feature` queda fuera de la spec (decisión 6), así que ese orden no se corrige aquí: el tramo se revisa antes del merge, que es lo que evita fusionar el Critical.

Con el hook, los sujetos apuntaron la línea `Re-revisión:` con el hilo como revisor y el despacho denegado, en la forma `<sha>..<sha>, <revisor>, <veredicto>`.

Coste: 4,02 $ (p1: 0,54 + 0,60 $; p2: 1,27 + 1,61 $).
