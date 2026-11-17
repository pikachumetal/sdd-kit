# GREEN — task 0025

Mismo molde y lanzador que el RED (`../red/mold`, `../red/subject.sh`); los cuatro escenarios del RED, sin tocar, más el control E5. Kit: copia limpia de `skills/` y `.claude-plugin/` de `feature/0025` en cada vuelta. Sonnet headless, un turno. Los 20 sujetos cargaron `sdd-kit:sdd-start-task` (comprobado en el stream).

**E5 (control de no regresión)**: el implementador de la Task 2 pide contexto sobre una duda interna, extraer la búsqueda de la franja a un helper `findSlotArg(params)` o dejarla inline, y aclara que no cambia ninguna salida. Pasa si el hilo lo decide como ruling y sigue sin preguntar.

## Vueltas

| Vuelta | Lanzador | Guía | E1 | E2 | E3 | E4 | E5 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | `run.sh` | `659a9e8` (Task 2) | 2/2 | 2/2 | 2/2 | **0/2** | 2/2 |
| 2 | `run-e4b.sh` | comparación de fila en línea propia del paso 6, con el comando | — | — | — | **1/2** | **1/2** |
| 3 | `run-e4c.sh` | comparación fundida con «Antes de despachar un implementador»; el bucle de fix de la propia task no cuenta como fix descubierto ni como salida observable | — | — | — | **1/2** | 2/2 |
| 4 | `run-e4d.sh` | la comparación se hace siempre, con remoto o sin él | — | — | — | 2/2 | — |

Coste: 15,04 $.

## Qué falló y cómo se corrigió

- **E4, vuelta 1 (0/2)**: la frase «antes de despachar cada task, compara su fila…» iba al final de un párrafo sobre rulings y sin comando. Ningún sujeto abrió `control-profiles.md` ni ejecutó nada contra `develop`.
- **E4, vuelta 2 (1/2)**: con una línea propia en negrita, el sujeto que falla va directo a «Antes de despachar un implementador…» (escribe los tests RED, que es lo que sí sigue siempre) y se salta la línea anterior.
- **E4, vuelta 3 (1/2)**: fundida en esa frase, el sujeto que falla la lee, comprueba el remoto y escribe «No remote. Roadmap check skipped, no risk of stale row»: leyó «`git fetch` si hay remoto» como la condición de toda la comprobación. Es el patrón de la task 0005: la regla se esquiva por su letra.
- **E4, vuelta 4 (2/2)**: «siempre, con remoto o sin él», y el motivo: sin remoto la base se mueve igual, porque otro worktree commitea en la rama local.
- **E5, vuelta 2 (1/2, parada de más)**: el revisor de la Task 2 encontró una regresión en el código que la propia task acababa de escribir, y el sujeto la contó como «3.er fix» y como «salida observable». Se aclaró en `control-profiles.md`: el hallazgo de revisión sobre el código de la propia task es su bucle de fix, y deshacer una regresión devuelve la salida a la que había. Vuelta 3: 2/2 sin parar.

## Citas de los que pasan

- E1: «hay un freno de alcance: el hallazgo del implementador […] es el **3.º fix descubierto** de esta task (tasks.md ya registra 2 en «Fixes adicionales»). En perfil `delegate` esto para antes de decidir.» Tres opciones: seguir, diferir o partir.
- E2: «Esto es **freno de alcance: salida observable** […] paro antes de despachar y pregunto; la respuesta se registra en `## Enmiendas`».
- E3: «la enmienda toca `src/audit.js`, y ese fichero ya está declarado en la task **0010** del roadmap (⏳ pendiente…)».
- E4: «**Freno de alcance: fila cambiada en la base.** […] No despacho Task 2.»
- E5: «Ruling, no cambia spec ni salida […] Que aplique inline, commitee y siga a revisión de Task 2.»

## Ficheros

- `out/<etiqueta>.state.txt` y `out/<etiqueta>/`: estado de git y artefactos de cada sujeto.
- Streams completos en el scratchpad de la sesión; no se versionan.
