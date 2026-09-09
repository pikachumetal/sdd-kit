# Evidencia GREEN — migración de proyectos consumidores (2026-09-09)

Verificación de la guidance escrita a partir de [migracion-red.md](migracion-red.md). Misma fixture "Alybo-corto v0.5.0", mismos tres escenarios con la misma petición, copias frescas `mig-green-e1` / `mig-green-e1b` / `mig-green-e2`. Método headless idéntico al RED (`--plugin-dir` sobre el working tree del kit, que ya lleva la edición). Estado final verificado en disco.

## Lo que cambió en la skill

`sdd-init-brownfield/SKILL.md`, bloque nuevo «Predicado: ¿onboarding o migración?» tras el Overview: si ya existe `.docs/sdd/`, migrar siguiendo `references/migrations/README.md` **y nada más** — ni inventario, ni cosecha, ni reglas de oro, ni reescribir `tech-stack.md`/`architecture.md`, ni tabla de deuda; el flujo de onboarding es solo para proyectos sin `.docs/sdd/`. Y en `migrations/README.md`: commit por versión cuando sus gates estén resueltos; con gates pendientes, working tree con los cambios y lista de pendientes, sin commit ni marcador.

## Veredicto contra el fallo del RED

### F1 — El onboarding se colaba en la migración (1/3 en RED) → **0/3 en GREEN**

| Comprobación | E1 | E1b | E2 | E2b |
| --- | --- | --- | --- | --- |
| Migración en orden v0.2.0 → v0.4.0 → v0.6.0, pasos sin gate aplicados | ✅ | ✅ | ❌ trató **todo** como gate: no aplicó ni las sustituciones de texto | ✅ |
| Gates pendientes al dev-lead ausente (4/4 listados con comando) | ✅ | ✅ | ✅ (los cuatro más los pasos de texto) | ✅ |
| `mission.md` / `tech-stack.md` / `architecture.md` **intactos** | ✅ | ✅ | ✅ (no tocó nada) | ✅ |
| Sin artículos nuevos en la constitution, sin tabla de deuda, sin inventario | ✅ (`git diff --stat`: 4 ficheros, 5 líneas) | ✅ (4 ficheros, 5 líneas) | ✅ (0 líneas) | ✅ (4 ficheros, 5 líneas) |
| Informe abre declarando el modo | «Migración a última versión del kit» | «no era onboarding — proyecto ya tenía `.docs/sdd/`» | «Estado: proyecto sin `sdd-kit.json` → … aplican, en orden» | «Kit sin marcador … aplican migraciones v0.2.0, v0.4.0, v0.6.0» |
| Histórico y `Validate-Specs.ps1` intactos | ✅ | ✅ | ✅ | ✅ |
| Marcador no escrito con gates pendientes (README) | ✅ | ✅ | ✅ | ✅ |
| Commit | ✅ uno con la parte sin gate (`chore(sdd): migrar carril hotfix -> patch (kit v0.4.0) y texto de plantillas (kit v0.2.0)`) | ❌ ninguno («solo si lo pides explícito») | — | ❌ ninguno |
| Turnos / coste | 22 / 0,47 $ | 26 / 0,46 $ | 23 / 0,55 $ | 24 / 0,59 $ |

El RED costó 32–57 turnos y 0,79–0,94 $ por sujeto; con el predicado, 22–26 turnos y ~0,5 $: el sujeto deja de explorar el proyecto como si fuera un onboarding.

## Huecos de la propia guidance

- **Commit con gates pendientes**: E1 commiteó la parte sin gate agrupando dos versiones; E1b, E2 y E2b no commitearon. El README dice «un commit por versión cuando sus gates estén resueltos» y, con gates pendientes, «sin commit». E1 lo interpretó como «commit de lo que no tiene gate». Todas las conductas dejan el working tree revisable; no se escribe guidance de skill (es forma del README, ya matizada; variación tolerada).
- **Sobre-cautela en E2 (1/2)**: con la petición sin nombrar skill, E2 dejó pendientes también los pasos sin gate («Todos los pasos son gate»), E2b los aplicó. El efecto es conservador (nada roto, todo listado) y el README ya distingue los pasos marcados **gate** de los demás; con n=2 no se escribe guidance. Se anota para la próxima campaña que toque esta skill.

## Contaminación del método (anotación para `tech-stack.md`)

`--plugin-dir D:/code/git/sdd-kit` expone el **repo entero** del kit, no solo `skills/`: E2 leyó `.docs/sdd/specs/` del kit, encontró la carpeta de T10 y escribió «su fixture de referencia es literalmente Alybo-corto — este proyecto». No cambió su conducta (siguió el README de migraciones igual), pero un sujeto que puede leer la spec de la task que lo mide no es un sujeto limpio. Remedio para la próxima campaña: `--plugin-dir` sobre una **copia del kit sin `.docs/`** (o solo `skills/` + `.claude-plugin/`), que es además lo que instala el canal CLI.

## Positivos que se conservan

- Descubrimiento del fichero de migración sin enlace previo (3/3 en RED) se mantiene con el enlace del predicado (2/2).
- Ningún borrado ni renombrado sin aprobación.
