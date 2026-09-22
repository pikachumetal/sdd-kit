# RED — claves de control en las entrevistas de las init (task 0020)

Baseline con el kit de `develop` en el commit `527893e` (1.1.0 más las tasks de la 1.2.0 fusionadas). Las skills `sdd-init-greenfield` y `sdd-init-brownfield` no tienen cambios. Se midió **antes de presentar la spec**, por la regla del tech-stack «Un baseline limpio no reproduce los fallos de sesiones largas»: cada frente se reproduce primero, y la spec lleva solo los que fallan.

**Frentes**:
- F1: las init no preguntan las claves de control que definió la 0008. Viene de la fila 0020 del roadmap.
- F2: la entrevista de brownfield pregunta por lotes. Viene de la fila de deuda «La entrevista de `sdd-init-brownfield` tiene la misma forma en prosa que la de greenfield antes de la 0012».

## Método

- **Sujetos**: headless Sonnet, lanzados con `claude -p`. El kit va en una copia limpia con `--plugin-dir` y `--add-dir`, el plugin instalado está deshabilitado y la mensajería entre sesiones, bloqueada.
- **Dev-lead simulado**: Haiku con persona fija. Responde solo a lo que se le pregunta y, si el turno trae varias preguntas, **solo a la primera**.
- **Lanzador**: copia del de la 0012 con dos cambios. El remoto apunta a un host real sin push, por la regla «Un remoto local da una salida». Y el lanzador ya reconoce «FIN.» con punto: en esta tanda no lo hacía y gastó tres turnos vacíos en bf-b y uno en bf-a. El lanzador, el molde, la persona y lo que produjo cada sujeto están en [`red/`](../.docs/sdd/specs/20260922-141616-task-0020-init-control-keys/red/).
- **Carga de la skill**: el stream muestra que los dos sujetos cargaron `sdd-kit:sdd-init-brownfield` y `sdd-kit:sdd-templates`.

Comprobación previa (seis puntos del tech-stack):
1. El turno 1 carga la skill («Invoca la skill…»).
2. El molde tiene su commit base.
3. El turno 2 lo genera el simulador, no es fijo.
4. La petición tiene una sola lectura.
5. El kit es una copia del working tree.
6. El molde no ofrece ninguna salida: ni `.docs/` ni `CLAUDE.md`.

El `CLAUDE.md` global de la máquina se hereda. Aquí no altera la medida, porque ninguna de las dos conductas depende de él.

| Escenario | Molde | Petición | Tope |
| --- | --- | --- | --- |
| Brownfield con código | `e2-code` de la 0012: statusline en Node, 5 ficheros, un commit en `master`, `origin` en GitHub | «Invoca la skill sdd-kit:sdd-init-brownfield: quiero empezar a trabajar este proyecto con SDD. El código es de ayer y quiero el onboarding completo.» | 16 turnos |

**Coste**: 9,83 $ (bf-a 5,05 $, bf-b 4,78 $). Presupuesto aprobado: ~13 $. Las dos entrevistas acabaron antes del tope (9 y 7 turnos).

Para F1 en greenfield, el baseline sale gratis de los streams del GREEN de la 0012 (regla «Un stream previo puede ser el RED de otra task»). Esa campaña se hizo con el mismo texto de greenfield en lo que toca a las claves de control, que es ninguno.

## Resultados

| Frente | bf-a | bf-b | GREEN 0012 (greenfield, 5 sujetos) | Veredicto |
| --- | --- | --- | --- | --- |
| F1 Pregunta perfil, merge o frenos | ❌ ninguna | ❌ ninguna | ❌ 0/5 | **falla** |
| F1 `sdd-kit.json` con `control` o `merge` | ❌ `{version: 1.2.0, ids}` | ❌ `{version: 1.2.0, ids}` | ❌ 0/5 (`{version, channel, updated, ids}`) | **falla** |
| F2 Una pregunta por turno | ❌ turno 1: ids + changelog | ❌ turno 1: ids + changelog (con cliente) | — | **falla** (2/2) |
| F2 Un documento por gate | ✅ un documento por turno (turnos 3–8) | ❌ turno 1 presenta mission, tech-stack y architecture; turno 3 pide aprobar los cinco a la vez | — | **falla** (1/2) |

Citas:
- bf-a, turno 1: «1. **Ids de las tasks**: ¿`tracker` […] o `sequence` […]? 2. **Changelog**: ¿quieres `changelog.md` (y opcionalmente `client-changelog.md` […])?». El simulador contestó solo a la primera, y el agente tuvo que volver a preguntar el changelog en el turno 2.
- bf-b, turno 3: «¿Apruebas los 5 documentos (mission, tech-stack, architecture, constitution, roadmap) tal cual, o corriges algo antes de que escriba `.docs/sdd/` completo?».
- Agravante de F1, leído en disco: los dos `sdd-kit.json` declaran `"version": "1.2.0"`. `generacion.md` pide la versión mayor de `migrations/`, y la migración v1.2.0, que es la única que pregunta por las claves de control, ya no se aplica a ese proyecto.

Verificación estructural de F1: `grep -rn -i "control\|merge\|perfil\|profile\|paralel\|vigía\|silence"` sobre `skills/sdd-init-greenfield` y `skills/sdd-init-brownfield`, fuera de `migrations/`, no da ninguna coincidencia. Y la migración v1.2.0 pregunta por `control.profile` y por `merge`, pero no por `control.maxParallelAgents` ni por `control.silence.*`.

## Veredicto

Los dos frentes fallan y entran en la spec. Ninguno va a deuda como posible falso negativo.
