---
id: 20260909-105650-task-0000-migracion-consumidores
task: 0000
title: Walkthrough — Migración de proyectos consumidores entre versiones del kit (T10)
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-09
---

# Walkthrough — Migración de proyectos consumidores entre versiones del kit (T10)

## 1. Cambios realizados

- **Ficheros de migración** `skills/sdd-init-brownfield/references/migrations/{README,v0.2.0,v0.4.0,v0.6.0}.md`: procedimiento (marcador → orden → gates → marcador) y pasos-predicado con verificación por versión. **Marcador del kit** `.docs/sdd/sdd-kit.json`. Commit `db3ec26`.
- **Receta del marcador en `init-*`** (`estructura.md`, `generacion.md`, paso 3 de greenfield), **Art. V** ampliado, glosario de `mission.md`, sección «Actualizar un proyecto» del README. Commit `dd22833`.
- **RED** con 4 sujetos headless (`tests/migracion-red.md`, `e6e621b`) y **GREEN** con 4 (`tests/migracion-green.md`).
- **Predicado «¿onboarding o migración?»** en `sdd-init-brownfield/SKILL.md` y matiz del commit por versión en el README de migraciones. Commit `9c086f9`.
- **Cierre**: `funcional/migracion.md` fusionado (cinco `ADDED`), log regenerado, changelog, roadmap, tech-stack.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5 h (rango 1–2,5)
- Esfuerzo real: **~0,5 h** (aproximado: plan aprobado 11:26 UTC, último commit de implementación 11:53 UTC, cierre ~12:00 UTC; nueve sujetos headless corriendo en paralelo mientras se hacían Task 1 y Task 4). Spec + plan: ~0,5 h (carpeta 10:56 UTC → commit 11:26 UTC).
- Desviación: −1 h (−67 %)
- Causa de la desviación: el plan reservaba media hora al riesgo del método headless (permisos, duración) y el smoke lo resolvió en un run; los sujetos corren en paralelo y en segundo plano, así que su duración (3–7 min cada uno) no sumó; y la guidance que hizo falta fue una sola frase, porque el artefacto ya cubría descubrimiento, orden, gates y ejecución mecánica. El sesgo sigue siendo el de `estimation.md`: la guidance condicionada al RED se estima como coste cierto.

## 3. Desviaciones del plan

- **Cuatro sujetos por fase en vez de dos**: el plan preveía E1 y E2. Se añadió E1b (repetición: n=1 no es veredicto) y E3 (gates aprobados de antemano) porque con el dev-lead ausente los sujetos dejan todos los gates pendientes y no se mide la ejecución mecánica. En GREEN, E2b para medir la frecuencia de la sobre-cautela de E2. Total 9 runs, ~6,5 $.
- **Decisión 3 de la spec corregida en el plan**: v0.2.0 sí tuvo cambio estructural (`templates/`); tres migraciones, no dos.
- **Task 4 y la receta del marcador se hicieron antes que el RED** (no dependían de él) y en un solo commit.
- **Plan mode a mitad de task**: el dev-lead activó el modo plan tras el smoke; el plan restante se escribió en el fichero de plan de la sesión y se aprobó sin cambios.
- **Sin pregunta a posteriori**: la sesión headless termina; las citas salen del resultado final del JSON.

## 4. Verificación

### 4.1 Builds

- `pwsh -NoProfile -Command "Invoke-Pester -Path tests"` → **Passed: 133, Failed: 0, Skipped: 5** en cada commit (hook). El test de enlaces acepta `references/migrations/README.md`.

### 4.2 Smoke / tests

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Escenario «El proyecto declara la versión del kit que tiene»: `sdd-kit.json` en la estructura de `init-*` y en el kit | ✅ receta añadida (sin RED, decisión 8); el kit lleva `.docs/sdd/sdd-kit.json` con `0.6.0`. No medido en `init-*` (un baseline no crea un fichero cuyo contrato no conoce) |
| 2 | Escenario «Cada release con cambio estructural lleva su migración» | ✅ verificado: tres ficheros para las tres releases con cambio; Art. V lo exige en adelante |
| 3 | Escenario «Un proyecto ya inicializado se migra, no se re-inicializa» | ✅ verificado: RED 1/3 aplicaba el onboarding encima (Art. XII propuesto, tech-stack reescrito, tabla de deuda); GREEN 0/4 con `mission`/`tech-stack`/`architecture` intactos y 5 líneas de diff |
| 4 | Escenario «El `funcional.md` heredado se conserva como legado» | ✅ verificado en E3: `funcional/legado.md` con la nota, `funcional.md` desaparecido, `funcional/` sin otros ficheros, enlaces actualizados en 4 docs (la spec histórica se dejó) |
| 5 | Escenario «La copia local del script de estimación se retira» | ✅ verificado en E3: `.tools/sdd/Build-EstimationLog.ps1` borrado, `Validate-Specs.ps1` intacto, log regenerado con cabecera del kit, diff presentado en el informe |
| 6 | Orden y descubrimiento sin enlace ni predicado | ✅ verificado 3/3 en RED: `migrations/README.md` encontrado solo; sin marcador → todas; v0.2.0 → v0.4.0 → v0.6.0 |
| 7 | Gates con dev-lead ausente | ✅ verificado 7/7 (RED+GREEN): ningún borrado ni renombrado sin aprobación; cada gate listado con su comando |
| 8 | Marcador escrito solo al terminar | ✅ verificado: E3 lo escribe tras los tres commits; los demás no lo escriben con gates pendientes |
| 9 | Coste del predicado | ✅ medido: 49–57 turnos / 0,82–0,94 $ en RED (E1, E1b) frente a 22–26 / ~0,47 $ en GREEN |

### 4.3 Residuales / deuda generada

- **Sobre-cautela 1/2 en E2 GREEN** (trató los pasos de texto como gate): conservador y reversible; sin guidance con n=2. Se anota para la próxima campaña que toque `sdd-init-brownfield`.
- **Contaminación del método headless**: `--plugin-dir <working tree>` expone `.docs/` del kit y un sujeto leyó la spec de la task que lo medía. Próximas campañas: copia del kit con solo `skills/` y `.claude-plugin/`. → tech-stack.
- **Commit con gates pendientes**: conducta variable (E1 commiteó lo sin gate; E1b, E2, E2b no). Matizado en el README; tolerado.
- **Alybo y MDT** siguen sin migrar: primera invocación real a petición del dev-lead. Los cuatro gates que la fixture destapó son los mismos que tendrá Alybo (más `Validate-Specs.ps1`, que no se toca).
- `sdd-consult` no se midió con «¿qué tengo que cambiar?» dirigido a ella: E2/E2b lo enrutaron solos al artefacto. Sin deuda.

## 5. Aprendizajes

- **El artefacto de migración se descubre y se ejecuta solo; la única guidance necesaria es la que impide hacer de más**: 3/3 baselines encontraron `migrations/` y 1/3 aplicó además el onboarding. Cuarta vez en la release que el RED reduce la guidance a una frase de contención. → `tech-stack.md` (§Tests, «un artefacto bien formado es guidance»).
- **Con el dev-lead ausente, un sujeto no ejecuta gates**: para medir la ejecución mecánica hay que aprobarlos de antemano en la petición (E3). → `tech-stack.md`.
- **El headless con el working tree contamina**: el sujeto puede leer la spec de su propia campaña. → `tech-stack.md`.
- **Una guidance de contención abarata al sujeto a la mitad** (turnos y dólares): el predicado no solo evita daño, ahorra exploración. → `tech-stack.md`.
- **Los sujetos en segundo plano no cuentan en el reloj**: el tiempo real de la task fue el de redactar, no el de medir. → `estimation.md` (nota de método).
