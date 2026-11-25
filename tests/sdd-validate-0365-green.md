# GREEN de la feature 0365 — el hotfix y el spike validan en `sdd-validate`

Kit del working tree (`moon run kit:build`, copia de `dist/`), `sonnet`. Salidas en `.docs/sdd/changes/20261125-113426-feature-0365-hotfix-spike-validate/green/out/`.

## `vf9` — spike (Task 2), `N=2`

| Sujeto | VF9 | Lectura |
| --- | --- | --- |
| vf9-1 | pasa | sin gate; Task 3 de vuelta «Medir O2» con «Evidencia»; O1 y O3 no vuelven; eje Spec solo (`Final review — Spec axis`, opus) y su re-revisión; no invoca `sdd-archive`; `Validación por el agente:` en el borrador del walkthrough |
| vf9-2 | pasa | sin gate («todo lo que cambió está en la carpeta del spike»); Task 3 solo de O2; eje Spec solo y re-revisión; no invoca `sdd-archive` |

Fuera de la rúbrica: `vf9-2` registra `Validación por el agente:` en `tasks.md` y no en el borrador del walkthrough, y los dos esperan a que se les pida `sdd-archive` en vez de invocarlo; con el RED, ninguno de los dos llegaba a ese punto. Van al ticket de cierre.
