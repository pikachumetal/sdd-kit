### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-brownfield: quiero empezar a trabajar este proyecto con SDD. El código es de ayer y quiero el onboarding completo.

### Turno 1 — agente

Inventario hecho. Repo pequeño: `statusline.js` (CLI, punto de entrada) + `lib/format.js` + `lib/git.js`, test único en `test/format.test.js` con Node `node:test` nativo. Sin `package.json`, sin dependencias externas (README lo confirma: "Sin dependencias: Node 22"). Sin CLAUDE.md de proyecto que cosechar (solo tu CLAUDE.md global, que no aplica aquí). Sin CI, sin scripts `env:*`/`worktree:*`. Deuda visible: `formatModel` y `gitBranch` sin test (solo `formatCost` lo tiene).

Antes de generar la documentación, primera pregunta:

**¿Cómo numeráis las tasks: ids del gestor de tickets (`tracker`) o secuencia propia (`sequence`)?** Si no sabéis, dejo `tracker`.

### Turno 2 — dev-lead

Secuencia propia. Voy numerando las tasks en orden conforme avanzo.

### Turno 2 — agente

`ids.mode: sequence`. Anotado.

Pregunta 2: **¿con qué perfil de control trabajáis: `pair`, `delegate` o `unattended`?**

Recomendado `delegate`: para en la spec, en los desvíos y en la validación, y ahorra el gate del plan.

### Turno 3 — dev-lead

Perfil **`delegate`**: adelante. Confío en que frenes en la spec y desvíos; validación al cierre de la task.

### Turno 3 — agente

`control.profile: delegate`. Anotado.

Repo solo tiene rama `master` (sin integración distinta de la estable), así que salto la pregunta de política de merge.

Pregunta 4: **¿os valen los frenos por defecto: hasta 3 agentes en paralelo, y aviso tras 8 minutos de silencio entre pasos o tras 20 en un comando largo?**

Recomendado sí: son los defaults del kit.

### Turno 4 — dev-lead

Sí, los frenos por defecto me valen bien. 3 agentes y avisos a los 8 y 20 minutos son razonables para el tamaño de esto.

### Turno 4 — agente

Frenos por defecto anotados (`maxParallelAgents: 3`, `silence.betweenStepsMinutes: 8`, `silence.longCommandMinutes: 20`).

Pregunta 5: **¿lleváis changelog?**

### Turno 5 — dev-lead

Sí, llevamos changelog. Las novedades van ahí para nosotros, pero no hay que exponerlas al cliente.

### Turno 5 — agente

`.docs/sdd/mission.md` creado. **¿Lo apruebas tal cual o hay algo que corregir?**

### Turno 6 — dev-lead

Sí, apruebo. Adelante con el onboarding.

### Turno 6 — agente

`.docs/sdd/tech-stack.md` creado. **¿Apruebas, o corriges algo (p. ej. la decisión abierta sobre `package.json`)?**

### Turno 7 — dev-lead

Sí, apruebo. En la decisión de `package.json`: sin dependencias externas, como es nuestro principio. Que solo tenga `"type": "module"` y metadatos básicos.

### Turno 7 — agente

Ojo: `"type": "module"` en `package.json` convierte todos los `.js` del proyecto en ESM. El código actual usa `require`/`module.exports` (CommonJS) en los 4 ficheros — con `"type": "module"` puesto, esos `require` rompen en tiempo de ejecución.

Tres salidas: (a) `package.json` sin `"type": "module"` (CommonJS implícito, cero cambio de código), (b) `"type": "module"` + convertir los 4 ficheros a `import`/`export`, (c) `"type": "module"` + renombrar a `.cjs`.

**¿Cuál prefieres?** Documentación sola no decide esto por ti.

### Turno 8 — dev-lead

Opción (a): sin `"type": "module"`. Es lo más simple para un proyecto personal pequeño sin dependencias, y CommonJS funciona perfectamente. Si crecemos o cambian las circunstancias, convertimos después.

### Turno 8 — agente

`.docs/sdd/architecture.md` creado. **¿Apruebas o corriges algo?**

### Turno 9 — dev-lead

Sí, apruebo. Adelante con la siguiente tarea.

### Turno 9 — agente

`.docs/sdd/constitution.md` creado, propuestas marcadas. **¿Apruebas las convenciones tal cual o corriges alguna?**

### Turno 10 — dev-lead

Sí, apruebo las convenciones tal cual están. Adelante.

### Turno 10 — agente

`.docs/sdd/roadmap.md` creado. **¿Apruebas o corriges algo?**

### Turno 11 — dev-lead

Sí, apruebo. Déjame verlo para estar seguro de que refleja bien el alcance.

### Turno 11 — agente

`.docs/sdd/roadmap.md`:

```markdown
# Roadmap — statusline

## Próximo

| # | Ítem | Estado |
| --- | --- | --- |

## Backlog

| # | Ítem | Origen |
| --- | --- | --- |
| 1 | Crear `package.json` mínimo (metadatos + `engines.node`, sin `"type": "module"`, sin dependencias) | dev-lead, `tech-stack.md` |

## Deuda técnica

| Ítem | Impacto | Destino |
| --- | --- | --- |
| `formatModel` y `gitBranch` sin test (solo `formatCost` tiene test hoy, `test/format.test.js:5`) | bajo — funciones pequeñas y estables, pero sin red de seguridad ante un cambio | próxima task que toque `lib/format.js` o `lib/git.js` |

## Patches

| Fecha | Id | Descripción |
| --- | --- | --- |

## Releases cerradas
```

**¿Confirmas que está bien, o falta algo?**

### Turno 12 — dev-lead

Sí, apruebo. Está bien estructurado. Solo una nota: la deuda técnica en `format.js` y `git.js` la cubro cuando toque esas funciones, así que no hace falta priorizarla ahora.

### Turno 12 — agente

Onboarding SDD completo. `.docs/sdd/` con `mission.md`, `tech-stack.md`, `architecture.md`, `constitution.md`, `roadmap.md`, `estimation.md`, `estimation-log.md`, `changelog.md`, `specs/` (vacía), `sdd-kit.json`. `CLAUDE.md` de proyecto reducido a punteros.

**Pendiente:**
- Crear `package.json` mínimo (decidido, en Backlog de `roadmap.md`).
- Sin `client-changelog.md`: dijiste que las novedades no se exponen al cliente.
- Sin `environments.md`: no hay scripts `env:*`/`worktree:*` en el repo.

**Siguiente paso natural**: `sdd-start-task` para la primera task (p. ej. crear el `package.json` del backlog) o `sdd-consult` si quieres explorar antes de decidir qué entra primero.

### Turno 13 — dev-lead

Adelante con `sdd-start-task` para crear el `package.json` mínimo. El backlog ya está claro, no necesito explorar más.

### Turno 13 — agente

Contexto cargado (mission, tech-stack, architecture, constitution, roadmap — recién anclados). Toca la pregunta de enrutado, sola:

**Carril**: task (no es bug determinista, no es pregunta de viabilidad).

**Modo lite** — cumple las condiciones comprobables:
- No hay flujo de comportamiento que modificar, solo config estática nueva.
- No cambia contratos públicos (nada consume `package.json` hoy).
- No toca schema de datos.
- Cabe en un solo fichero, raíz del repo.
- `estimation.md` existe y esto es claramente ≤ media jornada.

¿Confirmas modo lite?

**Perfil**: `delegate` (el vigente en `sdd-kit.json`). ¿Lo mantenemos para esta task o lo cambias?

### Turno 14 — dev-lead

Sí, confirmo modo lite.

### Turno 14 — agente

Clasificación: **bounded** — cambio acotado en un repo existente, aunque el fichero en sí sea nuevo (config, no flujo de comportamiento). Con la SDD del kit, igualmente lleva `spec.md` con su gate (el override del kit anula el "sin spec file" de bounded).

**Diseño propuesto** (ya casi decidido en el onboarding):

- `package.json` en la raíz, con: `name: "statusline"`, `version: "0.1.0"`, `description` (una línea, de `mission.md`), `private: true` (uso personal, no se publica), `main: "statusline.js"`, `scripts.test: "node --test"` (coincide con `tech-stack.md`), `engines.node: ">=22"`.
- Sin `"type": "module"` (CommonJS, decisión ya tomada).
- Sin `dependencies`/`devDependencies`.

**¿Te vale así, o cambias algún campo (license, version inicial, etc.)?**

### Turno 15 — dev-lead

Sí, apruebo. Solo una cosa: déjalo sin `license` (es uso personal) y sin `version` si prefieres que empiece en `0.0.0`; si no, está bien `0.1.0`. Lo demás, perfecto.

### Turno 15 — agente

`spec.md` creada en `.docs/sdd/specs/20260922-145525-task-0001-package-json/`.

## Decisiones que he tomado yo — valida estas

Ninguna: todo se decidió contigo durante el onboarding y el brainstorming (sin `"type": "module"`, campos del `package.json`, sin `license`, `version: "0.1.0"`).

**¿Apruebas la spec?**

### Turno 16 — dev-lead

Sí, apruebo la spec. Refleja correctamente lo que acordamos en el onboarding.

### Turno 16 — agente

**Me salí del plan en…**: nada — no hubo plan (modo lite), y no hizo falta ningún ruling.

**Qué hay**: `package.json` en la raíz, sin `license`, `version: 0.1.0`, sin dependencias, sin `"type": "module"`.

**Smoke ejecutado**:
- `node --test` → 1 pass, 0 fail.
- `statusline.js` con JSON de ejemplo por stdin → `Sonnet 5 | feature/0001 | $1.50`, línea correcta.

**¿Validas el trabajo?** ¿Qué has probado tú y funciona?
