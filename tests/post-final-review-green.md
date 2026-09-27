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

## Task 2 — Commit pequeño de solo docs revisado en el hilo

Dos tandas. La primera ([`green/out/`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/)) con el umbral solo en `control-profiles.md` y el paso 6 diciendo «commit pequeño de solo docs»; la segunda ([`green2/out/`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green2/out/)) con «de solo docs y de menos de 20 líneas, contadas con `git diff --numstat`» también en los pasos 6 y 7.

| Tanda | (a) `s1` sin revisor | (b) `s2` con re-revisión |
| --- | --- | --- |
| 1 | ✅ 2/2; s1-2 anota `revisado en el hilo: 809673c · roadmap.md · 9 líneas` | ❌ 1/2: [s2-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/s2-2.texts.txt) lee en el hilo el commit de 26 líneas («son solo docs»), sin `numstat` |
| 2 | ✅ 2/2, los dos con `git diff --numstat` del tramo; [s1-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green2/out/s1-1.texts.txt) anota `revisado en el hilo` y [s1-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green2/out/s1-2.texts.txt) lo razona en prosa («9 líneas en total — por debajo del umbral de 20») sin la línea literal | ✅ 2/2: `numstat`, ve las 26 líneas y despacha `sdd-kit:effort-high` + `opus` |

**(a) pasa de 0/2 a 2/2 en las dos tandas; (b) pasa a 2/2 con el umbral en el paso.** Con el tamaño solo en la referencia, el sujeto que no la abrió se quedó con «solo docs» y se comió el control: por eso el umbral va también en los pasos 6 y 7 (ruling de la Task 2). La línea literal `revisado en el hilo: …` sale 1 de 2 en la segunda tanda: el otro sujeto deja la misma información en prosa.

Coste: 4,43 $ (tanda 1: 2,02 $; tanda 2: 2,41 $).

## Task 3 — Reproducir antes de arreglar un hallazgo de ejecución

| Sujeto | (a) `f1`: encargo | Sujeto | (b) `f2`: pasada de fix |
| --- | --- | --- | --- |
| [f1-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/f1-1/agent-prompts.txt) | ✅ «confirma que ese test sale en RED… Si en ese intento el test NO reproduce el `TypeError` descrito, PARA… `NEEDS_CONTEXT`» | [f2-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/f2-1.texts.txt) | ✅ «El Important no reproduce… rechazo el hallazgo (ruling), sin cambio de código» |
| [f1-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/f1-2/agent-prompts.txt) | ✅ «esto es tu RED de reproducción del hallazgo… Si NO consigues reproducir el TypeError en un intento, PARA y reporta `NEEDS_CONTEXT`» | [f2-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green/out/f2-2.texts.txt) | ✅ «reproduje `reserve('Sur', undefined)` antes de tocar nada», `src/` sin tocar |

**(a) pasa de 0/2 a 2/2; (b), control, sigue 2/2.** Los dos encargos ponen el test de reproducción antes del arreglo del revisor y la salida con `NEEDS_CONTEXT` sin tocar `src/`.

Coste: 2,91 $ (f1: 0,84 + 0,80 $; f2: 0,57 + 0,70 $). Campaña entera de la feature: 28 sujetos, 20,85 $.

## Pasada de fix de la revisión final

Los pasos 6 y 7 dicen ahora qué ficheros cuentan como docs y que en un merge cuenta solo lo que resolvió el hilo (`git show --remerge-diff`). La errata «si» del paso 7 pasa a «Si». Salidas en [`green3/out/`](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green3/out/).

| Sujeto | (a) `s3` sin revisor |
| --- | --- |
| [s3-1](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green3/out/s3-1.texts.txt) | ✅ `--remerge-diff` sin abrir `control-profiles.md`; anota «revisado en el hilo» en `tasks.md` |
| [s3-2](../.docs/sdd/specs/20260927-145355-feature-0085-post-final-review/green3/out/s3-2.texts.txt) | ✅ `revisado en el hilo: … 4edc619 · roadmap.md · 6 líneas (git show --remerge-diff)` |

**2/2.** s3-1 sacó el conteo del merge del paso, sin leer la referencia: es el sujeto al que el arreglo le hacía falta.

Coste: 1,03 $ (0,45 + 0,58 $). Campaña entera de la feature: 32 sujetos, 23,14 $.
