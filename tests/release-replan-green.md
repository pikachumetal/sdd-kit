# GREEN — replanificar la release en curso (task 0029)

Los seis escenarios del [RED](release-replan-red.md), con la sección «Replanificar la release en curso» de `sdd-start-release/SKILL.md`. Mismos moldes, lanzadores y turnos; lanzador de la tanda en [`green/`](../.docs/sdd/specs/20260922-154013-task-0029-release-replan/green/). Coste: 6,57 $ (RED + GREEN: 11,83 $, dentro del techo de 12 $ aprobado).

## Primera redacción: seis sujetos

| Frente | r1 | r2 | s1 | s2 | u1 | u2 | RED → GREEN |
| --- | --- | --- | --- | --- | --- | --- | --- |
| E1 · fila cerrada (u con base vieja; r y s como control) | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | base vieja 2/2 fallan → 0/2 |
| E2 · task en marcha intacta | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 3/6 → 0/6 |
| E3 · ids sin choque | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | 3/4 → 1/6 |
| E4 · reserva publicada | ✅ | ✅ | ✅ | ✅ | — | ✅ | 6/6 → 0/5 |

- **E1**: u1 y u2 leen `git show develop:.docs/sdd/roadmap.md` antes de proponer («task 0005 ya está ✅ cerrada (mi roadmap local decía 🔄, desactualizado)», u1) y abren una task nueva. Ninguno edita la spec de la 0005.
- **E2**: los seis dejan la fila y la spec de la 0006 como estaban, y el trabajo de su tema va a una task nueva tras ella.
- **E3**: s2 lista las ramas (`git branch --all`, `git worktree list`) pero no abre el roadmap de `feature/0006`, y da el `0008`. Los demás leen ese roadmap y empiezan en el `0009`.
- **E4**: cinco commits en `develop` que solo tocan `roadmap.md`, antes de arrancar nada. u2 commitea en el worktree de `develop`. u1 propone lo mismo («commitear solo ese fichero en `develop`») y pide permiso: el modo headless no le deja escribir fuera de su directorio. Es un artefacto del fixture, no una conducta, y no se cuenta.

## Segunda redacción: el paso 1 exige abrir el roadmap de cada rama

El fallo de s2 era leer la lista de ramas y dar el paso por hecho. El paso 1 pasa a decir «**por cada rama `feature/*`** que liste `git branch --all`, su roadmap», con el motivo («listar las ramas no basta»), y la tabla de racionalizaciones gana la de s2.

| Frente | s3 |
| --- | --- |
| E1 (control) | ✅ |
| E2 | ✅ |
| E3 | ✅ — «el script da 0008, pero ya reservado sin fusionar»: empieza en el `0009` |
| E4 | ✅ — commit solo de `roadmap.md` en `develop` |

Con n=1 tras el refuerzo, el veredicto de E3 se apoya también en los cinco sujetos que ya lo cumplían con la primera redacción.

## Sin GREEN: `develop` sin worktree

En los tres moldes, la rama de integración estaba sacada en algún worktree, así que la otra salida del paso 4 —un worktree temporal cuando no está en ninguno— no la ejercitó ningún sujeto. La destapó la revisión final. Queda como riesgo aceptado, porque el presupuesto de la campaña estaba agotado (11,83 de 12 $), y como fila de deuda del roadmap. La redacción de esa rama se concretó tras la revisión («en la misma carpeta que los demás worktrees y con un nombre corto»), sin nuevo GREEN.

## No regresión

- La apertura de release no se ejecutó en ningún escenario: la sección nueva solo se aplica con una release abierta en el roadmap, y el checklist de apertura no cambia.
- La decisión sigue siendo del usuario: s1, s2, s3, u1 y u2 proponen en el turno 1 y escriben tras el «sí». r1 y r2 escriben en el turno 1, como en el RED, con una petición que ya decidía qué entraba.
- Suite Pester: 292/0.
