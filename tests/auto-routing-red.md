# Evidencia RED — auto-enrutado frente a superpowers (2026-09-21)

Baseline de la task [auto-routing](../.docs/sdd/specs/20260921-162213-task-0014-auto-routing/spec.md) (0014). Pregunta: con superpowers instalado y su hook `SessionStart` inyectando `using-superpowers` en cada sesión, cuando el usuario pide trabajo en lenguaje natural **sin nombrar ninguna skill**, ¿la primera skill que se invoca es la del kit? El punto de partida era el issue GH #1 («me da la sensación de que está usando skills de este en vez de las skills del kit») y la fila B5 del roadmap.

## Método

Sujetos Sonnet en sesión headless con el kit cargado como plugin desde una copia limpia **sin `hooks/` ni ninguna edición** (`--plugin-dir`, `--add-dir`), el plugin instalado deshabilitado, `stream-json` y lectura de los `tool_use` de `Skill` (`first-skills.py`). Un turno, tope de 6 turnos, sin permiso de ejecución más allá de lo mínimo. Cuatro moldes de un proyecto «salas» con `.docs/sdd/` y sin mención a skills en su `CLAUDE.md` (salvo `molde-cm`, que pide `brainstorming` a propósito):

- `molde`: código stub (`console.log('salas')`, sin flujo de reservas).
- `molde-code`: con el flujo de reservas real (`src/app.js`, `test/`).
- `molde-cm`: `molde` más un `CLAUDE.md` que dice «empieza cada feature con la skill brainstorming».
- `molde-trivial`: `molde-code` con un typo en el README, para los controles de sobre-disparo.

Los sujetos heredan el entorno del usuario (superpowers 6.3.0, más sus hooks de caveman y ponytail): es el entorno real de quien usa el kit. Moldes, lanzadores y streams versionados en la carpeta de la spec, `red/`.

## Resultados

Primera skill invocada, en orden. **Kit primero** = `sdd-kit:*` antes que cualquier skill de superpowers.

| Sujeto | Petición | Molde | Skills invocadas | Kit primero |
| --- | --- | --- | --- | --- |
| p1-add | «Añade a la app de salas la reserva recurrente mensual.» | molde | `sdd-start-task` | sí |
| p2-make | «Hazme que las reservas se puedan exportar a un fichero .ics.» | molde | `sdd-start-task` | sí |
| p3-vague | «Quiero estadísticas de uso. Empieza a montarlo.» | molde | `sdd-start-task` | sí |
| p4-ask | «¿Cómo funciona ahora mismo la cancelación de reservas?» | molde | `sdd-consult` | sí |
| p5-bug | «Hay un bug: cancelar el lunes cancela el martes. Arréglalo.» | molde | `sdd-start-patch`, `systematic-debugging` | sí |
| p6-build | «Vamos a construir los avisos por correo antes de cada reserva.» | molde | `sdd-start-task` | sí |
| h1-english | «Let's build an email reminder that fires before each booking.» | molde | `brainstorming`, `sdd-start-task` | **no** |
| h1-r2 | ídem | molde | `sdd-start-task` | sí |
| h1-r3 | ídem | molde | `sdd-start-task` | sí |
| h2-claudemd | «Añade a la app de salas la reserva recurrente mensual.» | molde-cm | `brainstorming`, `sdd-start-task` | **no** (lo pide el `CLAUDE.md`) |
| h3-context | «¿Cómo funciona…?» y, en el segundo turno, «Gracias. Ahora añade la reserva recurrente mensual.» | molde | 1.º `sdd-consult`; 2.º `sdd-start-task` | sí |
| h4-small | «Es un cambio pequeño: añade un campo 'notas' a cada reserva. Hazlo rápido.» | molde | `brainstorming` | **no** (nunca llegó al kit) |
| h4-r2 | ídem | molde-code | `brainstorming` | **no** (nunca llegó al kit) |
| h4-r3 | ídem | molde-code | `sdd-start-task` | sí |

Controles de sobre-disparo (kit actual, `molde-trivial`): «Corrige el typo «recervas» que hay en el README» ×2 y «Renombra la variable bookings a reservations en src/app.js» ×2 → **0 de 4 invocan ninguna skill** y el cambio se hace directo (`git status` lo confirma). Es la conducta que la spec quiere conservar.

### Recuento

- Seis peticiones cotidianas con el molde stub: **6 de 6** con el kit primero. La `description` sola, en sesión fresca, basta ante «añade…», «hazme…» y «vamos a construir…» (confirma [`disparo-skills-red.md`](disparo-skills-red.md), ahora con el hook de superpowers activo).
- Las dos frases que fallan, seis sujetos: **«Let's build X»** deja a `brainstorming` primero 1 de 3 veces; **«cambio pequeño, hazlo rápido»** lo hace 2 de 3, y en las dos el sujeto **nunca llegó a `sdd-start-task`**. Total: 3 de 6 con `brainstorming` primero.
- `brainstorming` clasificó el cambio pequeño como «bounded», presentó un diseño en el chat y pidió aprobación: sin spec, sin carril y sin walkthrough. Es el fallo que describe GH #1.

## Conclusión

El fallo existe y es acotado: no falla la petición corriente, falla la que suena a cambio pequeño o a «let's build». El hook de superpowers ordena `brainstorming` antes que cualquier skill, y la `description` del kit —una línea de catálogo— compite desde abajo. Además la `description` de `sdd-start-task` decía «no usar… para cambios describibles en una frase», lo que empujaba «un cambio pequeño» fuera del kit por texto.

## Trampas de método y lo que no se pudo medir

- **Molde con ruido en `h4-small`**: el stub no tenía flujo de reservas y el sujeto lo dijo; se repitió con `molde-code` (`h4-r2`, `h4-r3`). La conducta de saltarse el kit se dio también sin ruido.
- **`h2` es evidencia débil**: el `CLAUDE.md` del molde pide `brainstorming`, así que el sujeto obedeció una instrucción del proyecto; no cuenta como fallo del kit. Se conserva porque muestra que el kit recupera el control al cabo de unos pasos.
- **n = 3 por frase**: es la frecuencia observada, no una tasa; la regla de `tech-stack.md` («una diferencia con n=1 por brazo no es un veredicto») se cumple con 3 y 3, no más.
- **Sesión larga y superpowers a nivel de proyecto, no reproducidos**: el reporte de GH #1 los menciona y estos sujetos son sesiones de un turno con superpowers como plugin. El resultado queda como **posible falso negativo** sobre esos dos frentes; no se descarta nada sin el dev-lead.
- Los sujetos heredan los hooks personales del usuario (caveman, ponytail): igual en los dos brazos.

Coste: 14 sujetos (3,82 $) para el RED de enrutado y 4 (0,61 $) para el de controles.
