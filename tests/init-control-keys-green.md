# GREEN — claves de control en las entrevistas de las init (task 0020)

**Kit medido**: working tree de `feature/0020` en el commit `6e3bebc`. Incluye el bloque «Preguntas de las claves de control» de `control-profiles.md`, las preguntas 18–20 de greenfield, el paso 3 de brownfield como lista numerada y la migración v1.2.0 alineada.

**Método**: el mismo del [RED](init-control-keys-red.md). Sujetos headless Sonnet, simulador Haiku con persona fija y copia limpia del kit. El lanzador es el del RED más un molde de migración con `main` y `develop`. Lanzador, moldes, personas y lo que produjo cada sujeto están en [`green/`](../.docs/sdd/specs/20260922-141616-task-0020-init-control-keys/green/). El stream muestra que los seis sujetos cargaron la skill que se mide.

Comprobación previa de los seis puntos: pasa. Un solo ajuste: la constitution del molde G3 decía `master` y el repo tiene `main` y `develop`, así que se corrigió a git-flow para que el molde no contradiga su propio repo.

| Escenario | Molde | Petición | Tope |
| --- | --- | --- | --- |
| G1 brownfield entero | `e2-code`, el del RED: solo `master` | la del RED | 16 |
| G2 greenfield situado | `e3-absent` (un README) | invoca `sdd-init-greenfield`, «la entrevista va por la pregunta 18», con las respuestas de 1–17 (git-flow con `develop`, sin worktrees) | 5 |
| G3 migración | `.docs/sdd/` de statusline con `sdd-kit.json` `{1.1.0, ids sequence, control.profile delegate}`; ramas `main` y `develop` | «Invoca la skill sdd-kit:sdd-init-brownfield: actualízame este proyecto al kit instalado.» | 5 |

## Resultados

| Frente | G1a | G1b | G2a | G2b | G3a | G3b | Veredicto |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Una pregunta o un documento por turno | ✅ turnos 1–12 | ✅ turnos 1–11 | ✅ | ✅ | ✅ | ✅ | **pasa** (6/6; RED 0/2 en brownfield) |
| Pregunta el perfil con recomendación y motivo | ✅ | ✅ | ✅ | ✅ | — (ya estaba: no la hace) | — (ídem) | **pasa** |
| Merge: propuesta completa (rama de integración, `--no-ff`, el worktree lo borra una persona) | — | — | ✅ `develop` | ✅ `develop` | ✅ `develop` | ✅ `develop` | **pasa** |
| Merge no preguntado sin rama de integración | ✅ «salto la pregunta de política de merge» | ✅ | — | — | — | — | **pasa** |
| Frenos: 3 · 8 · 20 con recomendación | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | **pasa** |
| La migración salta lo que ya está | — | — | — | — | ✅ «`control.profile` ya está fijado […] se salta» | ✅ | **pasa** |
| `sdd-kit.json` con lo respondido | ✅ perfil y frenos, sin `merge` | ✅ ídem | — (no llega a escribir en 5 turnos) | — | ✅ `merge` completo y frenos | ✅ ídem | **pasa** (RED: 0/2 con `control`) |

**Sin medir**:
- **«No sé» no escribe la clave.** La persona de G2 tenía «no sé» para los frenos, pero Haiku lo contestó mezclado con un permiso («No sé, la verdad. Pero si los recomendáis como defaults del kit, adelante»), y G2 no llega a escribir el marcador. La regla está en el bloque y en los dos pasos de estructura. Queda como riesgo, no como fallo.
- **Brownfield sin usuario.** No hay escenario. El RED de la 0012 (E3) ya mide que las init sin usuario se paran o marcan pendiente.

Citas:
- G2a, turno 2: «Pregunta 19 (política de merge, rama integración = `develop`): al cerrar una task, ¿fusiono a `develop` con `--no-ff` y dejo que el worktree lo borre una persona? Recomiendo sí: `--no-ff` deja la task en un commit revertible de una vez; borrar worktree lo decide una persona por ser irreversible si quedan cambios sin commit.»
- G1a, turno 3: «Repo solo tiene rama `master` (sin integración distinta de la estable), así que salto la pregunta de política de merge.»
- G3b, turno 1: «Para migrar a 1.2.0 faltan dos claves: bloque `merge` y frenos […] **Pregunta 1 de 2**».

Detalle cosmético, sin efecto: G3a numeró «Pregunta 3 de 2», con el número del bloque.

## Coste

**26,30 $** (G1a 14,69 $ · G1b 6,48 $ · G2a 1,53 $ · G2b 1,55 $ · G3a 0,99 $ · G3b 1,06 $). Se estimaron ~17 $ con un techo de 22 $: **el techo se superó en 4,30 $**. La causa está en G1a:
- el onboarding terminó en el turno 12, con ~1 $ de coste acumulado por turno;
- la persona Haiku contestó al «siguiente paso natural» con «Adelante con `sdd-start-task` para crear el `package.json` mínimo»;
- el sujeto arrancó una task y consumió cuatro turnos más (13–16), unos 6,5 $, fuera del escenario.

Como los sujetos corren desacoplados, el techo no se pudo aplicar a mitad de campaña.

**Lección para el lanzador** (va a `tech-stack.md` en el cierre):
- la persona tiene que responder `FIN` cuando el agente da la init por terminada, aunque le ofrezca un siguiente paso;
- el lanzador debe cortar un sujeto cuando su coste acumulado pase del techo por sujeto.

## Veredicto

GREEN: todos los frentes medidos pasan en 6 de 6 sujetos. F1 y F2 del RED quedan cerrados. Queda un riesgo sin medir: «no sé» no escribe la clave.
