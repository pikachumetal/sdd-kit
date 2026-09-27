---
kit_version: 1.1.0
superpowers_version: 6.4.2
lane: patch
id: 20260927-145833-patch-0088-merge-empty-folder
task: 0088
mode:
date: 2026-09-27
---

# Ticket para el kit — patch 0088: sin hallazgos; el cierre funcionó y dejó dos errores míos

## Contexto

- Carril y modo: patch
- Skills del kit usadas: `sdd-start-patch`, `sdd-end-patch`, `sdd-feedback`, `sdd-templates` (plantillas `patch-template.md` y `kit-feedback-template.md`, scripts `Invoke-SddMerge.ps1`, `Build-EstimationLog.ps1` y `Test-Capabilities.ps1`)
- Proyecto: el repo del propio kit (skills en Markdown y scripts PowerShell con Pester), una persona, perfil `delegate`
- Modelo del hilo: claude-opus-5-5
- Modelos de los subagentes: no aplica
- Coste en reloj: fix 0,4 h según `patch.md` §5; el cierre y el ticket, no medidos
- Coste en tokens: no medido

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

Sin hallazgos

## Lo que hice por iniciativa propia

- **Reproducir el handle abierto en un repo desechable.** El ticket del patch 0084 §2 sospechaba de un handle sin reproducirlo. Lancé `Start-Process pwsh -WorkingDirectory <worktree>` y después `git worktree remove`. Resultado: git borra el contenido y el registro, no puede borrar la carpeta (`Permission denied`, salida 255), y el reintento con `--force` falla con `is not a working tree`. El experimento costó un minuto y convirtió la sospecha en causa medida. Candidato a nota en `tech-stack.md`: así se reproduce en Windows un fallo que depende de un handle abierto.
- **El merge del cierre como prueba de la validación diferida.** Creé la carpeta vacía `merge-<id>` antes de lanzar `Invoke-SddMerge.ps1`. El merge fusionó, publicó y retiró la carpeta. La fila sigue con 🧪 hasta que el dev-lead lo confirme (`control-profiles.md` § «Validación diferida», último párrafo).
- **No edité el paso 7 de `merge-recipe.md`.** Con el fix, el relanzamiento ya no choca con la carpeta y el texto vigente es correcto. Editarlo habría exigido una campaña RED→GREEN (Art. I) sin conducta nueva que medir. Lo dice `patch.md` §3.

## Funcionó, no tocar

- `sdd-start-patch` paso 1: exigir la causa con evidencia llevó al experimento del handle en vez de parchear la guarda a ciegas.
- El RED del test de la carpeta vacía reprodujo el mensaje literal del ticket (`destino sacado: ya existe '…\merge-0001'`). El test de control con contenido pasó antes y después del fix.
- `sdd-end-patch` paso 0: la opción «Diferir» con el uso y el dueño ya rellenos se eligió en un solo turno, sin repreguntar (patch 0080).
- `sdd-end-patch` paso 4 con una release abierta: el patch diferido llevó fila en la tabla de la release y la fila de patches empieza por `🧪 validación diferida a`. Es el disparador de la validación diferida del patch 0087 y se cumplió sin omisiones.
- `Invoke-SddMerge.ps1 -Push`, `Build-EstimationLog.ps1`, `Test-Capabilities.ps1` y el pre-commit con el conjunto rápido (unos 25 s): ningún rodeo.

## Errores míos, no huecos del kit

- **Me salté la oferta del ticket.** El dev-lead pidió «vamos a intentar no generar más tickets de problemas». Lo leí como «no ofrezcas `sdd-feedback`» y el cierre no hizo la oferta del paso 7. Lo que pedía era un patch quirúrgico que dejara el ticket sin hallazgos. El paso 7 es claro: el ticket se ofrece salvo que la sesión ya tenga el suyo. Costó un turno del dev-lead.
- **Escribí una estimación que nadie dio** (`Estimación: 0,5 h` en `patch.md` §5). La quité antes del commit del fix. La plantilla ya dice «si la hubo».
