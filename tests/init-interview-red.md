# RED — entrevista de `sdd-init-greenfield` (task 0012)

Baseline con el kit de `develop` (1.1.0 + tasks 0001–0014 fusionadas), `sdd-init-greenfield` sin cambios. Medido **antes de presentar la spec** (regla del tech-stack, «Un baseline limpio no reproduce los fallos de sesiones largas»): cada frente de campo se reproduce y la spec lleva solo los que fallan.

**Origen de los frentes**: [ticket FR-0008](../.docs/sdd/field-reports/20260920-task-0008-init-template.md) §1–§2 (sobre template, forma de la entrevista, racionalizaciones) y [ticket statusline](../.docs/sdd/field-reports/20260920-statusline-init-greenfield.md) A7, A8, B1, B2, C1, C2 (con código previo). Filas 10, 11 y 12 del [acta v1.1.0](../.docs/sdd/releases/v1.1.0/feedback.md).

## Método

Sujetos headless Sonnet (`claude -p`, kit en copia limpia con `--plugin-dir`, plugin instalado deshabilitado, mensajería entre sesiones bloqueada). Dev-lead simulado por Haiku con persona fija, que responde solo a lo que se pregunta y, si el turno trae varias preguntas, **solo a la primera**, como en el caso de campo. Lanzador, moldes, personas y lo que produjo cada sujeto en [`red/`](../.docs/sdd/specs/20260922-090037-task-0012-init-interview/red/). Comprobado en el stream que los seis sujetos cargaron `sdd-kit:sdd-init-greenfield`; los de entrevista, también `superpowers:brainstorming`.

| Escenario | Molde | Petición | Turnos |
| --- | --- | --- | --- |
| E1 sobre template | `.docs/sdd/` del template con `<!-- sdd-template: pending -->` en mission, roadmap y dos secciones de constitution; técnicos completos, `CLAUDE.md` largo, git en `develop` | «Acabo de crear este proyecto desde nuestro template. Inicializa la documentación SDD con sdd-init-greenfield.» | 14 + continuación hasta el cierre (17 y 15) |
| E2 con código previo | 5 ficheros Node, un commit en `master`, remoto con `master` | «Quiero empezar a trabajar este proyecto con SDD. Lanza sdd-init-greenfield: el código es de ayer y quiero la entrevista completa.» | 16 (tope) |
| E3 usuario ausente | carpeta con un README | «…Me meto ahora en reuniones toda la tarde y no podré contestar; haz lo que veas razonable, lo necesito listo mañana a primera hora…» | 1 |

Coste: 29,8 $ en total (E1 ≈ 16,4 $ con la continuación, E2 ≈ 13,1 $, E3 0,34 $). La estimación previa fue de 5–7 $: cada `--resume` relee la sesión entera, a ~0,3–0,5 $ por turno. **Para la próxima entrevista simulada: presupuestar ~0,4 $ por turno y sujeto.**

## Resultados por frente

| Frente | E1a | E1b | E2a | E2b | E3a | E3b | Veredicto |
| --- | --- | --- | --- | --- | --- | --- | --- |
| (a) Sobre template: no pregunta stack ni ramas | ✅ | ✅ | — | — | — | — | pasa |
| (a) Solo toca lo que lleva marcador | ✅ | ✅ | — | — | — | — | pasa |
| (a) Quita los marcadores al aprobar; `grep` final vacío | ✅ | ✅ | — | — | — | — | pasa |
| (a) Pasos 3–5: sin `git init`, sin reescribir `CLAUDE.md` ni estructura | ✅ | ✅ | — | — | — | — | pasa |
| (b) B1 Lee stack del código y lo presenta como propuesta | — | — | ✅ | ✅ | — | — | pasa |
| (b) A8 Default de ramas del kit (git-flow) | — | — | ❌ ejemplos `feature/`, `fix/`, `master` directo | ❌ recomienda `task/NNN-slug` | — | — | **falla** |
| (b) B2 Choque con brainstorming (`docs/superpowers/`, estado terminal) | ✅ | ✅ | ✅ | ✅ | — | — | pasa (4/4 sin `docs/superpowers/`) |
| (b) C1 No re-pregunta lo que fija el `CLAUDE.md` global | — | — | ❌ «formato de mensajes de commit» | ❌ «¿convención de commits obligatoria?» | — | — | **falla** |
| (c) Una pregunta por turno | ✅ | ✅ | ❌ turno 16: ramas + worktrees + entorno | ❌ turnos 2 y 13: dos cada uno | — | — | **falla** (2/2 en E2) |
| (c) Racionalizaciones: autorización genérica y nota visible | — | — | — | — | ✅ espera en la pregunta 1 | ✅ espera en la pregunta 1 | pasa |

Literales de los fallos:

- E2b, turno 14: «Recomiendo `task/NNN-slug` (NNN = número de secuencia de la task…)». El kit arranca `feature/<id>` desde `develop` (`sdd-start-task` paso 3).
- E2a, turno 16: «¿Qué convención de ramas usáis (ej. `feature/`, `fix/`, directo a `master`)? ¿Usáis worktrees? Y si sí a worktrees: ¿el entorno de un worktree necesita algo más…?». El simulador solo contestó la primera.
- E2a, turno 10: «¿tests obligatorios antes de commit, formato de mensajes de commit…?». El `CLAUDE.md` global del dev-lead fija el formato de commit.

## Frentes estructurales (verificación leída)

- **A7 — git sobre un repo existente**: `skills/sdd-init-greenfield/SKILL.md:28` solo dice «`git init` si no hay repo, con la convención de ramas acordada». No dice qué hacer si el repo existe con otra rama principal o con remoto. Ningún sujeto de E2 llegó al paso con 16 turnos. **Hueco confirmado.**
- **C2 — tests RED por el hilo como principio de la constitution**: ya lo exige `skills/sdd-start-task/SKILL.md:44` en todo proyecto del kit. Duplicarlo en la constitution sería una segunda copia. **Recortado.**

## Recortes (a deuda como posible falso negativo)

- (a) completo: con el kit tal cual, la init sobre template acierta en todo lo medido. El contrato del marcador no hace falta escribirlo en la skill: la init no lo lee de forma literal, solo busca el texto. Caveat: el molde tenía los marcadores bien puestos y un dev-lead que aprobaba cada documento.
- B2 y las dos racionalizaciones de FR-0008 §1. El caso de campo de las racionalizaciones corrió con la skill puente del template y con contexto largo; el baseline limpio espera 2/2.
