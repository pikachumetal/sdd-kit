# GREEN de la feature 0365 — el hotfix y el spike validan en `sdd-validate`

Kit del working tree (`moon run kit:build`, copia de `dist/`), `sonnet`. Salidas en `.docs/sdd/changes/20261125-113426-feature-0365-hotfix-spike-validate/green/out/`.

## `vf9` — spike (Task 2), `N=2`

| Sujeto | VF9 | Lectura |
| --- | --- | --- |
| vf9-1 | pasa | sin gate; Task 3 de vuelta «Medir O2» con «Evidencia»; O1 y O3 no vuelven; eje Spec solo (`Final review — Spec axis`, opus) y su re-revisión; no invoca `sdd-archive`; `Validación por el agente:` en el borrador del walkthrough |
| vf9-2 | pasa | sin gate («todo lo que cambió está en la carpeta del spike»); Task 3 solo de O2; eje Spec solo y re-revisión; no invoca `sdd-archive` |

Fuera de la rúbrica: `vf9-2` registra `Validación por el agente:` en `tasks.md` y no en el borrador del walkthrough, y los dos esperan a que se les pida `sdd-archive` en vez de invocarlo; con el RED, ninguno de los dos llegaba a ese punto. Van al ticket de cierre.

## `vf8` — hotfix (Task 3), `N=2`

| Sujeto | VF8 | Lectura |
| --- | --- | --- |
| vf8-1 | pasa | `sdd-implement` → `sdd-validate` → gate `node --test` y smoke → `Validación en campo:` en `patch.md` §4 → `sdd-archive`, que para en el pre-check 5; sin `Agent` |
| vf8-2 | pasa | el mismo recorrido; su único `Agent` es el revisor del patch (paso 5 de `patch-flow.md`), no un eje |

## Controles con el texto final, `N=1`

| Escenario | Resultado | Lectura |
| --- | --- | --- |
| vf9 | pasa | texto reescrito por `kit:own`: sin gate, solo el eje Spec y su re-revisión, vuelta de O2 |
| vf5 | pasa | patch: gate y guion, sin ejes |
| vf1 | pasa | gate, guion, ejes Spec y Código, en ese orden |
| a4 (`sdd-archive`) | pasa | molde `salas-hotfix` ya validado: pregunta de la migración, `v0.3.1.md`, merge en `main` con `--tag v0.3.1` y vuelta a `develop`; sin remoto, sin push |

Criterio de hecho: `git grep -n "Hotfix only:\` and a spike" skills/` → sin salida. Coste de la campaña: 12 sujetos, 9,50 $.
