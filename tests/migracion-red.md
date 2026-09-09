# Evidencia RED — migración de proyectos consumidores (2026-09-09)

Baseline de la task [migracion-consumidores](../.docs/sdd/specs/20260909-105650-task-0000-migracion-consumidores/spec.md) (T10). **Primera campaña con el método headless de T9**: cada sujeto es una sesión `claude -p` (Sonnet) con el kit instalado deshabilitado y el working tree del kit cargado por `--plugin-dir`, así que ve la versión sin publicar de las skills **y** los ficheros de migración recién escritos, sin pegar nada por prompt. Estado final verificado en disco con `verify-migracion.py` (checklist (a)–(j) del plan) y el resultado final del sujeto leído del JSON de salida.

## Método (flags finales)

```
claude -p --model sonnet --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' \
  --plugin-dir D:/code/git/sdd-kit --permission-mode acceptEdits --allowedTools "Bash(*)" \
  --max-turns 80 --output-format json "<petición>" < /dev/null > <copia>-out.json
```

Smoke previo: el sujeto crea un fichero y ejecuta `git status` (0,22 $). Sin `< /dev/null`, un aviso «no stdin data received» precede al JSON. Cada escenario real cuesta 0,8–0,95 $ y 32–57 turnos. El JSON solo trae el resultado final, no las invocaciones de herramientas: qué skill invocó cada sujeto se infiere de su informe.

## Fixture "Alybo-corto v0.5.0"

Proyecto Node con `.docs/sdd/` en el estado real de Alybo antes de v0.6.0: `funcional.md` (tres secciones), `templates/spec-template.md` (copia vieja), `CLAUDE.md` y `constitution.md` citando `sdd-start-hotfix`/`sdd-end-hotfix`, roadmap con tabla «Hotfixes», `estimation.md` citando `.tools/sdd/Build-EstimationLog.ps1`, log manual con la cabecera antigua, una task con walkthrough y un `*-hotfix-*` con `hotfix.md`; `.tools/sdd/Build-EstimationLog.ps1` (copia real de Alybo) y `Validate-Specs.ps1` (del proyecto, no debe tocarse); `package.json` con `env:setup`/`env:clean`. Sin `sdd-kit.json`. Molde sin `.git`; copia por sujeto con `git init` + commit.

| Sujeto | Petición | Skill vigente |
| --- | --- | --- |
| E1, E1b | «…acabo de actualizar el kit a la última versión. Ponme el proyecto al día con la skill `sdd-kit:sdd-init-brownfield`. El dev-lead soy yo y no estaré disponible…» | `sdd-init-brownfield` `dd22833` (sin predicado de migración) |
| E2 | «Acabo de actualizar el kit sdd-kit a la última versión. ¿Qué tengo que cambiar en este proyecto para ponerlo al día? Hazlo si puedes…» (sin nombrar skill) | ídem |
| E3 | como E1, pero «apruebo de antemano todos los pasos con gate: ejecútalos y commitea» | ídem |

## Resultados en disco

| Comprobación | E1 | E1b | E2 |
| --- | --- | --- | --- |
| Encontró `references/migrations/` y siguió su README | ✅ | ✅ | ✅ («según `references/migrations/README.md` de la propia skill») |
| Orden v0.2.0 → v0.4.0 → v0.6.0, sin marcador = todas | ✅ | ✅ | ✅ |
| Pasos sin gate aplicados (hotfix→patch en docs, «Hotfixes»→«Patches», menciones a `templates/`) | ✅ | ✅ | ✅ |
| Histórico intacto (`*-hotfix-*`, `hotfix.md`) | ✅ | ✅ | ✅ |
| Gates dejados pendientes al dev-lead ausente (borrar `templates/`, `funcional/legado.md`, script local, `environments.md`) | ✅ 4/4 | ✅ | ✅ 4/4 |
| `Validate-Specs.ps1` intacto | ✅ | ✅ | ✅ |
| Marcador no escrito con gates pendientes (README: «al terminar») | ✅ coherente | ✅ | ✅ |
| **No regenera documentos de anclaje** | ✅ `mission`/`tech-stack` intactos | ❌ **F1** | ✅ |
| Commit por versión | ❌ dejó el working tree para revisión (los cuatro gates bloquean tres versiones) | ❌ ídem | ❌ ídem |

## Fallos observados

### F1 — El flujo de onboarding se cuela en la migración (E1b, 1/3)

E1b migró bien y, además, **ejecutó el onboarding de brownfield encima**: añadió a la constitution un «Art. XII — Reglas de oro brownfield» como propuesta, reescribió `tech-stack.md` («Node (versión sin fijar: no hay `engines`…)», discrepancia `MODULE_TYPELESS_PACKAGE_JSON`) y `architecture.md` «a estado verificado», creó `environments.md` como borrador y añadió al roadmap una tabla «Deuda técnica» con tres hallazgos y otra «Migración de kit pendiente». Su informe lo dice sin verlo como error: «No es un init nuevo: es una migración» y, dos líneas después, «Constitution: añadido Art. XII … como PROPUESTA». La skill vigente no distingue onboarding de migración: su checklist (inventario, cosecha, reglas de oro, deuda al roadmap) se aplica a cualquier proyecto que la invoque, y el sujeto lo hizo a la vez que seguía el README de migraciones.

Frecuencia 1/3 con la misma petición (E1 y E1b idénticas): no es sistemático, pero el coste es alto (artículos y diagnósticos que nadie pidió en la constitution y el tech-stack de un proyecto vivo) y es exactamente lo que el requisito «Un proyecto ya inicializado se migra, no se re-inicializa» prohíbe.

### Observaciones que no son fallo

- **Ningún sujeto commiteó** aunque el README pide un commit por versión: con cuatro gates pendientes que cruzan las tres versiones, dejaron el working tree para revisión. Conservador y explicado; el README se matiza («commit por versión cuando sus gates estén resueltos»), no es guidance de skill.
- **E2 leyó `.docs/sdd/sdd-kit.json` del propio kit** (working tree) para saber la versión objetivo, además de `migrations/`. Por el canal CLI no existe; el README ya dice que `migrations/` es la verdad. Sin cambio.
- **(g) en E1b**: el `grep` de «hotfix» del verificador casa el id histórico `20260715-100000-hotfix-0000-fix` en el roadmap y una nota explicativa: falso positivo del verificador, no del sujeto.

## Positivos que NO requieren guidance

- **El artefacto se encuentra solo y se sigue en orden** (3/3): sin enlace desde `SKILL.md` ni predicado, los tres sujetos localizaron `references/migrations/README.md`, dedujeron «sin marcador → todas» y aplicaron v0.2.0 → v0.4.0 → v0.6.0. La guidance de *descubrimiento* no hace falta; el enlace en el predicado nuevo es forma, no disciplina.
- **Los gates se respetan con el dev-lead ausente** (3/3): ningún borrado ni renombrado sin aprobación; cada uno listado como pendiente con el comando exacto.
- **El histórico y los scripts del proyecto no se tocan** (3/3).

## Conclusión — qué guidance queda respaldada

| Guidance candidata | Veredicto |
| --- | --- |
| Predicado «¿onboarding o migración?» en `sdd-init-brownfield/SKILL.md`: si existe `.docs/sdd/`, migrar y **nada más** (ni inventario, ni cosecha, ni reglas de oro, ni reescribir anclaje, ni deuda) | **Se escribe** (F1) |
| Guidance de descubrimiento del fichero de migración | **NO se escribe** (positivo 1: 3/3 lo encuentran) |
| Guidance sobre gates con dev-lead ausente | **NO se escribe** (positivo 2: el README basta) |
| Escritura del marcador en `init-*` | Receta (Art. II), no medida: un baseline no crea un fichero cuyo contrato no conoce. Ya en `dd22833` |

## E3 — ejecución mecánica con los gates aprobados de antemano (baseline, 14/14)

Misma skill vigente, petición «apruebo de antemano todos los pasos con gate: ejecútalos y commitea». Resultado en disco: `sdd-kit.json` = `0.6.0` / `plugin` / fecha; `funcional/legado.md` con la nota de excepción y `funcional.md` desaparecido; enlaces actualizados en `CLAUDE.md`, `architecture.md`, `mission.md`, `README.md` (el `funcional.md` citado en una spec histórica se dejó, correcto); `.tools/sdd/Build-EstimationLog.ps1` borrado y `Validate-Specs.ps1` intacto; `templates/` borrada; hotfix→patch; `environments.md` creado con lo que los scripts hacen de verdad («no se inventó nada que no exista»); log regenerado con la cabecera del kit y el **diff presentado** en el informe (cabecera, fecha con guiones, la fila del hotfix que el script viejo descartaba, factor por Tipo); `mission.md`/`tech-stack.md` intactos; **tres commits** `chore(sdd): migrar al kit v0.2.0 / v0.4.0 / v0.6.0`, working tree limpio. 65 turnos, 1,23 $.

Los requisitos «El `funcional.md` heredado se conserva como legado» y «La copia local del script de estimación se retira» quedan verificados por el artefacto solo: ningún paso de skill los sostiene.
