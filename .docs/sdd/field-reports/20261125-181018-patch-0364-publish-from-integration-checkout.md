---
kit_version: 3.0.4
lane: patch
id: 20261125-181018-patch-0364-publish-from-integration-checkout
task: 0364
mode:
date: 2026-11-25
---

# Ticket para el kit — patch 0364: `sdd roadmap publish` publica desde el checkout de la integración

- Contexto: patch de fallo, perfil delegate, validación en campo; Opus 5.5 en el hilo y un revisor Sonnet 5.5 (`sdd-kit:effort-medium`).
- Coste: 0,17 h de reloj de sesión hasta el commit de cierre frente a 0,53 h estimadas (`patch.md` §5); 2,67 $ en total, 0,22 $ del revisor (`sdd session tokens`).
- Iniciativa propia: el fix también cubre que, con origen y destino en el mismo árbol, el `rollback` de un commit fallido hacía `git checkout HEAD -- <fichero>` y borraba la edición del usuario. La fila no lo nombraba; es la misma causa raíz y lleva su test en `publish-failures.slow.test.ts`.

## Menores

- Un test RED nuevo («keeps the edit when the commit fails…») pasaba antes del fix por el motivo equivocado: salía con 1 por «destino con cambios» antes de llegar al commit. Se vio al correr el RED y se corrigió añadiendo una aserción sobre el mensaje de error. — `skills/sdd-tdd/SKILL.md`, «Verify RED» (la regla existía y funcionó).
- El criterio de «hecho» del prompt de lanzamiento omite `--into`. En un repo nuevo sin `sdd-kit.json`, el comando literal sale con 2 («falta la rama de integración»), y la reproducción necesitó `--into develop`. — `skills/sdd-templates/templates/launch-prompt-template.md` (sin verificar si la plantilla pide que el criterio sea ejecutable tal cual).
- El revisor dejó cuatro minors (comparación de rutas sin `samePath`, staging parcial perdido tras un fallo, sin test de subcarpeta y sin test de staging ajeno). Se resolvieron en el mismo commit del fix y se respondieron en `patch.md` §4. — `skills/sdd-implement/references/patch-flow.md` paso 5 (funcionó).
