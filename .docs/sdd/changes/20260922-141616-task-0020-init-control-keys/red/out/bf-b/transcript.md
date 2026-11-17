### Turno 1 — dev-lead

Invoca la skill sdd-kit:sdd-init-brownfield: quiero empezar a trabajar este proyecto con SDD. El código es de ayer y quiero el onboarding completo.

### Turno 1 — agente

He explorado el repo completo (6 ficheros, 1 commit, sin `package.json`, sin dependencias). No hay `CLAUDE.md` previo que cosechar. Presento los 3 primeros documentos para tu revisión antes de generar constitution y roadmap.

---

## `mission.md` (propuesta)

**Por qué existe**: statusline personalizada para Claude Code — sustituye la línea de estado por defecto mostrando modelo activo, rama git y coste de sesión en una sola línea.

**Usuarios**: desarrollador que usa Claude Code, consume la línea en terminal/IDE.

**Es**: script Node ejecutable, invocado por Claude Code con JSON de sesión por stdin, imprime línea formateada por stdout.
**No es**: plugin de Claude Code, servicio persistente, herramienta de configuración de statuslines de terceros.

**Dominio**: `input.model` (modelo activo, se usa `display_name`), `input.workspace.current_dir` (dir de trabajo, resuelve rama git), `input.cost.total_cost_usd` (coste acumulado USD).

## `tech-stack.md` (propuesta)

| Pieza | Tecnología | Versión |
|---|---|---|
| Runtime | Node.js | Sin `package.json` ni `.nvmrc` — no verificable en código. README dice "Node 22", sin manifest que lo confirme |
| Módulos | CommonJS | — |
| Test runner | `node:test` nativo | incluido en Node |

Comandos: build no aplica · tests `node --test` · arrancar `node statusline.js` (vía stdin JSON).
Testing: hay test automático (`formatCost`); `formatModel`, `gitBranch` y `main()` sin test todavía.
**Decisión abierta**: falta `package.json` (sin `engines.node`, sin script `npm test`) — decide dev-lead.

## `architecture.md` (propuesta)

```
statusline.js        # entry point ejecutable, orquesta la línea
lib/format.js        # funciones puras: formatModel, formatCost
lib/git.js           # gitBranch vía `git branch --show-current`
test/format.test.js  # test de formatCost
```

Flujo: Claude Code invoca `statusline.js` con JSON por stdin → `main()` llama `formatModel`/`gitBranch`/`formatCost` → filtra vacíos → une con ` | ` → stdout.
Dónde va lo nuevo: dato nuevo en la línea → función pura en `lib/`, añadida al array `parts`. Fuente externa nueva → módulo propio en `lib/`, como `git.js`.
Decisiones estructurales: _Pendiente_ (repo nace con este único commit).

---

Antes de redactar `constitution.md` necesito dos respuestas tuyas:

1. **Ids de tasks**: ¿`tracker` (gestor de tickets externo) o `sequence` (numeración propia del proyecto)? Si no sabes, dejo `tracker`.
2. **Changelog**: ¿activo `changelog.md`? Si sí, ¿también `client-changelog.md` para novedades de cliente?

Deuda detectada para `roadmap.md`: sin `package.json` · `formatModel`/`gitBranch`/`main()` sin test · `gitBranch` traga errores en silencio (catch vacío). La meto en la tabla de deuda técnica salvo que digas otra cosa.

### Turno 2 — dev-lead

Numeración propia del proyecto (`sequence`). Los task IDs van con secuencia numérica en statusline, sin gestor externo.

### Turno 2 — agente

Anotado: `ids.mode: sequence`. Falta la respuesta de changelog: ¿activo `changelog.md`? Si sí, ¿también `client-changelog.md`? Si prefieres, lo dejo como decisión pendiente y seguimos.

### Turno 3 — dev-lead

Sí, activa `changelog.md`. No incluyas `client-changelog.md`, las novedades son internas.

### Turno 3 — agente

Presento los dos documentos que faltan por gate antes de escribir la estructura completa.

## `constitution.md` (propuesta)

**Principios**
1. Retrocompatibilidad por defecto: no romper el contrato stdin/stdout que usa Claude Code.
2. Respetar el patrón existente aunque no sea ideal (p. ej. seguir sin `package.json` hasta decisión explícita).
3. Cero refactor oportunista: cada task se ciñe a su alcance.
4. Migraciones masivas solo con justificación escrita.
5. *(observado, a confirmar)* Funciones puras en `lib/`, sin dependencias externas.
6. *(observado, a confirmar)* Toda función de formateo nueva lleva test en `node:test`.

**Convenciones**
- Idioma: comentarios de código en castellano, identificadores en inglés, commits con tipo en inglés + descripción en castellano (visto en el único commit: `feat: statusline con modelo, rama y coste`).
- Ramas: solo `master` — sin convención observable todavía (pendiente).
- Commits: Conventional Commits.

**Reglas de producto**
- Dónde viven los datos: no aplica — sin persistencia, todo llega por stdin en cada invocación.
- Idioma de los nombres: identificadores y ficheros en inglés.
- Límites: pendiente (sin topes definidos, p. ej. truncado de rama larga).
- Avisos: pendiente (`gitBranch` traga errores en silencio, catch vacío).
- Regla ante conflicto: no aplica (una sola fuente por dato).

## `roadmap.md` (propuesta)

**Próximo / Backlog**: vacíos.

**Deuda técnica**
| Ítem | Impacto | Destino |
|---|---|---|
| Sin `package.json` (sin `engines.node`, sin script `npm test`) | medio | pendiente de decidir |
| `formatModel`, `gitBranch` y `main()` sin test | medio | pendiente de decidir |
| `gitBranch` traga errores en silencio (catch vacío) | bajo | pendiente de decidir |

**Patches / Releases cerradas**: vacíos.

---

¿Apruebas los 5 documentos (mission, tech-stack, architecture, constitution, roadmap) tal cual, o corriges algo antes de que escriba `.docs/sdd/` completo?

### Turno 4 — dev-lead

Sí, apruebo los cinco documentos tal cual.

### Turno 4 — agente

Onboarding completo. Estructura creada:

```
.docs/sdd/
  mission.md · tech-stack.md · architecture.md · constitution.md · roadmap.md
  estimation.md · estimation-log.md · changelog.md · sdd-kit.json
  specs/ (vacía)
CLAUDE.md   (reescrito: punteros + 5 reglas críticas)
```

Sin `capabilities/`: nace con la primera task que toque una capacidad. Sin `environments.md`: no hay scripts de entorno por worktree en este repo. Sin `client-changelog.md`: descartado por ti.

**Pendiente de confirmar** (marcado explícitamente en los docs, no aprobado en silencio):
- `constitution.md` principios 5 y 6 (funciones puras en `lib/`, test obligatorio por función) — observados, no confirmados.
- `tech-stack.md`: decisión sobre crear `package.json`.
- Reglas de producto "Límites" y "Avisos" en `constitution.md` — pendientes.

Nada que cambiar todavía (no había commits previos ni `CLAUDE.md` que cosechar). Nada está en `git add`; los ficheros quedan sin trackear hasta que decidas commitear.

**Siguiente paso**: primera task real con `sdd-start-task` — ahí nace `capabilities/` y se resuelven las pendientes marcadas arriba en contexto real.

### Turno 5 — dev-lead

FIN.

### Turno 5 — agente

Recibido "FIN." — sin acción pendiente. Onboarding brownfield queda cerrado como en resumen anterior.

### Turno 6 — dev-lead

FIN.

### Turno 6 — agente

Sin acción pendiente. Onboarding cerrado.

### Turno 7 — dev-lead

FIN.

### Turno 7 — agente

Confirmado. Nada más que hacer.

### FIN (simulador)
