---
id: 20260909-210515-task-0000-english-file-names
task: 0000
title: Walkthrough — Nombres de fichero en inglés
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-09
---

# Walkthrough — Nombres de fichero en inglés: `funcional/` pasa a `capabilities/`

## 1. Cambios realizados

Commit `fd250e0` (rama `master`), 33 ficheros.

- **Renames** (`git mv`, los seis detectados al 100 % de similitud): `.docs/sdd/funcional/` → `capabilities/`; `estimacion.md` → `estimation.md`; `migracion.md` → `migration.md`; `flujo-de-task.md` → `task-flow.md`; `funcional-template.md` → `capability-template.md`; `changelog-cliente-template.md` → `client-changelog-template.md`. Añadido sobre la marcha: `sdd-end-task/references/estimacion.md` → `estimation.md`.
- **Referencias**: 23 rutas vivas actualizadas (`skills/`, anclaje vivo de `.docs/sdd/`, `README.md`), con `<capacidad>` → `<capability>` en los placeholders de plantilla.
- **Migraciones**: `migrations/v1.0.0.md` corregido en sitio; `migrations/v1.1.0.md` nuevo, idempotente por predicado.
- **Test**: `tests/NamingConvention.Tests.ps1`, 10 casos, barrido por lista blanca de rutas vivas.
- **Verdad viva**: 5 `MODIFIED` fusionados en `capabilities/task-flow.md`, 2 `MODIFIED` y 1 `ADDED` en `capabilities/migration.md`, más «Reglas de la capacidad» en ambas.

## 2. Tiempo: estimado vs real

- Tipo: chore
- Estimación de implementación (del plan): 1,5 h
- Esfuerzo real: 1 h (aproximado)
- Desviación: −0,5 h (−33 %)
- Causa de la desviación: el inventario previo —cinco lectores en paralelo sobre zonas disjuntas— ya había producido la lista exacta de ficheros afectados, así que la sustitución de referencias no tuvo fase de búsqueda. El coste se pagó antes de la estimación, no durante la implementación.
- Review de spec: 2 revisores (dominio + técnica) · hallazgos 16, aceptados 16

## 3. Desviaciones del plan

1. **El RED no tiene commit propio.** El hook `pre-commit` del repo bloquea cualquier commit con la suite en rojo. No se usó `--no-verify`: la evidencia RED queda aquí documentada y el commit único llegó en verde.
2. **El test excluye el contenido de `capabilities/`.** Descubierto al ejecutar el RED: esos ficheros son requisitos vivos que solo cambian al fusionar un delta, así que el test habría quedado rojo entre la Task 3 y este cierre. Se vigilan sus nombres de fichero, no su contenido.
3. **El test excluye `references/migrations/`.** Las migraciones citan los nombres antiguos porque su trabajo es detectarlos en el proyecto que migran; prohibírselos las deja sin sujeto.
4. **El token se afinó de `funcional` a `funcional(/|\.md|-template)`.** A secas marcaba prosa castellana legítima («documento funcional heredado»), que ninguna regla de nombrado prohíbe.
5. **Entró un fichero que la spec dejaba en deuda**: `sdd-end-task/references/estimacion.md`. El test lo cazaba y renombrarlo costaba cero.
6. **`estimation-log.md` salió de la lista blanca, ya durante el cierre.** El propio test lo destapó: el fichero lo genera `Build-EstimationLog.ps1` a partir de los nombres de carpeta de las specs históricas, así que arrastra los nombres antiguos por construcción y ninguna edición lo arregla. Mismo caso descubierto a la vez: la entrada de aprendizaje de esta task en `tech-stack.md` citaba la ruta antigua para explicar el fallo y el test la marcó; se reformuló sin formar la ruta. Los dos confirman el criterio de la decisión 6 de la spec — lo que **describe** el pasado no puede vigilarse como si lo **fijara**.

## 4. Verificación

### 4.1 Builds

- `claude plugin validate . --strict` → `✔ Validation passed`.

### 4.2 Smoke / tests

**Verificado por el agente**, con evidencia:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED antes de tocar nada: `Invoke-Pester tests/NamingConvention.Tests.ps1` | ✅ 7 fallos, 3 pasan — los 7 nombran los ficheros infractores |
| 2 | Suite completa tras el rename: `Invoke-Pester tests` | ✅ 146 pasan, 0 fallan, 5 skipped |
| 3 | Escenario «Los documentos de anclaje nombran `capabilities/`» | ✅ 23 rutas vivas sin referencias antiguas; el test lo asegura |
| 4 | Escenario «El `funcional.md` heredado se conserva como legado» | ✅ fixture sin marcador → `capabilities/legacy.md`, `funcional.md` desaparecido |
| 5 | Escenario «Un proyecto que ya migró a v1.0.0 recibe el rename por `v1.1.0.md`» | ✅ fixture con `sdd-kit.json` en `1.0.0` → `capabilities/legacy.md` + `client-changelog.md`; la capacidad castellana (`facturacion.md`) queda para el gate del dev-lead, como manda el paso 3 |
| 6 | Idempotencia de `v1.1.0.md` | ✅ predicado `existe funcional/` en falso sobre proyecto ya migrado: el paso se salta |
| 7 | Escenario «Brownfield no vuelca `capabilities/`» | ✅ inspección de `sdd-init-brownfield`: ningún paso crea la carpeta |

**Reportado por el usuario**: nada. El dev-lead dio la orden de cierre («vale, cierra») sin declarar qué probó por su cuenta, después de que se le presentara el trabajo, el modo de probarlo y este smoke. Se registra tal cual: **esta task se cierra sobre verificación del agente, sin validación independiente del dev-lead**. La spec, además, se aprobó en conversación con el frontmatter aún en `draft`; se corrige en el cierre y se anota aquí.

### 4.3 Residuales / deuda generada

- ~40 nombres de fichero internos siguen en castellano y no los vigila ningún test: `skills/*/references/*.md` (`versionado.md`, `generacion.md`, `estructura.md`, `nombrado.md`, `priorizacion.md`, `acta-y-retro.md`, `encargo-revision.md`, `modo-lite.md`, `aprendizajes-skills.md`, `notas-y-roadmap.md`, `roadmap-fuente.md`, `email-entrega.md`), la evidencia de `tests/` (`*-red.md`, `*-green.md`) y los fixtures (`roto/`, `sinplan/`, `notas-sueltas/`). → tabla de deuda del roadmap.
- Los slugs de `.docs/sdd/specs/` históricas siguen en castellano. El Art. IV los declara convención de cambio mayor; esta task usó slug inglés como excepción puntual sin reabrirla.

### 4.4 Revisión de skills

`.claude/skills/` no existe en este repo (solo `.claude/settings.json`): el kit no tiene skills de nivel 3 propias, y esta task no revela ninguna que crear. Las skills de nivel 1 sí se tocaron, pero por rename de referencias, no por cambio de conducta. Decidido mirando, no por omisión.

## 5. Aprendizajes

- **Un placeholder propaga el idioma de su ejemplo.** `funcional/<capacidad>.md` con «capacidad = sustantivo del dominio» generó tres nombres castellanos de cuatro en el propio repo, sin que ninguna skill lo pidiera. El fallo no estaba en la regla (el Art. III existía) sino en que nada la hacía observable. → `tech-stack.md`, sección de aprendizajes por task.
- **Para un cambio mecánico, el RED válido es mecánico.** Una campaña de agentes sobre un rename mide una cadena, no una conducta: no puede fallar. Un test que recorre el repo sí falla, y además queda como defensa permanente. → `tech-stack.md`.
- **Una migración corregida en sitio no alcanza a quien ya la aplicó**, porque el procedimiento solo ejecuta versiones posteriores a la declarada. Toda corrección de una migración ya publicada necesita además su propia versión. → fusionado en `capabilities/migration.md` como `ADDED`.
- **Un hook que exige la suite en verde es incompatible con commitear el RED por separado.** No es un defecto del hook: obliga a que la evidencia RED viva en el walkthrough y el commit llegue en verde. → `tech-stack.md`.
