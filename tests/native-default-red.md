# Evidencia RED — Native por defecto, el método lo elige el handoff (task 0055, 2026-09-24)

RED previo a la spec (Art. I y `tech-stack.md`), sobre `develop` en `5019471` con superpowers **6.4.1** instalado.

**Previsión y techo** comunes a las tasks 0055, 0057 y 0058 (RED previo, GREEN y A/B), declarados en el chat antes del primer sujeto: unos 50 sujetos, unos 50 $ y unas 8 h; **techo 65 $** (dev-lead, 2026-09-24). El lanzador común [`red/run.sh`](../.docs/sdd/specs/20260924-082516-task-0055-native-default/red/run.sh) suma el coste de las carpetas de las tres tasks y para ante el techo o el fichero `stop`.

## Método

- **Lectura determinista** de superpowers 6.4.1 frente al kit, sin sujetos: [`red/lectura-superpowers-641.md`](../.docs/sdd/specs/20260924-082516-task-0055-native-default/red/lectura-superpowers-641.md).
- **Evidencia previa reutilizada** (`tech-stack.md`: un stream previo puede ser el RED de otra task): los sujetos de la task 0026 (`tests/superpowers-641-red.md` y `tests/superpowers-641-green.md`), que corrieron con 6.4.1.
- **Sujetos**: Sonnet headless (`claude -p`) sobre el molde `salas` de la 0044, con la apertura de la task 0012 commiteada y un `plan.md` cuyo `Modelo` despacha con `sdd-kit:effort-medium`. `KIT_DIR` es la copia de `HEAD` **sin `agents/`**: la sesión no tiene los tipos `sdd-kit:effort-*`. Lanzador: [`red/subject.sh`](../.docs/sdd/specs/20260924-082516-task-0055-native-default/red/subject.sh). Salidas: `red/out/`.

## Resultados por conducta

| Conducta nueva | Evidencia | Resultado con el kit de `develop` |
| --- | --- | --- |
| En `delegate` con `execution: auto`, el plan lleva `Ejecución: <método>, porque <motivo>` y no para | 0026 GREEN `g-h-1` y `g-h-2`: ningún método ni motivo en el plan, porque el override vigente lo suprime. Sin el override (0006 `g-e1-1`, 6.4.1 en `delegate`), el sujeto **para a preguntar el método** | **Falla 2/2** (no escribe el método). La guía tiene que decir, además, que en `delegate` no se para: sin override, 1/2 paró |
| En `pair`, la parada del plan aprueba y elige método en una sola pregunta | Lectura: la fila de overrides y el requisito vigente de `control-profiles` dicen «en `pair` para a aprobar el plan, **sin preguntar el método**» | **Falla**, por texto: el kit prohíbe la conducta |
| Con `execution: native \| subagent`, el método no se pregunta | Lectura: la clave no existe en `control-profiles.md` ni en ninguna skill (`grep -rn '"execution"' skills/` → 0) | **Falla**, por texto |
| Las init y la migración preguntan `execution` | Lectura: la tabla «Preguntas de las claves de control» tiene 4 preguntas y ninguna es la del método | **Falla**, por texto |
| El aviso del hook `SessionStart` nombra los agentes | Lectura de `.claude/hooks/Test-KitSessionSource.ps1`: los dos mensajes hablan de «las skills del kit» | **Falla**, por texto; el test Pester lo fija en el GREEN |
| Antes del primer despacho se dice que falta el tipo `sdd-kit:effort-<nivel>` y se registra el respaldo (ticket 0053 §1) | Sujetos `e1-1` y `e1-2` | **Pasa 2/2**: los dos lo ven antes de despachar, despachan `general-purpose` con el `model` del plan y lo sacan como ruling en su mensaje final. Sin fallo no hay guía (Art. I). Posible falso negativo: el ticket salió en una sesión larga, con la 0031 fusionada a mitad de task; un sujeto recién arrancado no reproduce eso (`tech-stack.md`, task 0003) |

## Sujetos

| Sujeto | Escenario | Coste | Nota |
| --- | --- | --- | --- |
| `e1-1` | `e1` | 0,74 $ | Antes de despachar escribe en el ledger «Ruling: el plan pide `subagent_type: sdd-kit:effort-medium`, que no existe en esta sesión — usar `general-purpose` con `model: sonnet`». Despacha `general-purpose` + `sonnet`, y su mensaje final lo pone en «Ruling: me salí del plan en…» |
| `e1-2` | `e1` | 0,65 $ | Igual: ruling en el ledger antes del despacho («ese tipo no existe en este entorno»), despacha `general-purpose` + `sonnet` y lo dice en el mensaje final con su coste si se equivoca («el implementador corrió con el effort por defecto en vez de medio») |

**Coste de este RED**: 2 sujetos, 1,39 $. **Acumulado de la campaña 0055–0058**: 1,39 $ de 65 $.

**Corrección del lanzador**: el stream de `e1-2` trae dos eventos `result` con el mismo coste, y la primera suma los contó dos veces (2,04 $). Ahora `run.sh` cuenta solo el último de cada sujeto.
