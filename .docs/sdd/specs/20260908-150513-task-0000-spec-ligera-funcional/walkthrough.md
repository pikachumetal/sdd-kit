---
id: 20260908-150513-task-0000-spec-ligera-funcional
task: 0000
title: Walkthrough — Spec ligera y funcional/ vivo
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-08
---

# Walkthrough — Spec ligera y `funcional/` vivo

## 1. Cambios realizados

**Plantillas** (`29d9123`, por despacho a un subagente con revisión de dos fases y una ronda de arreglos): `spec-template.md` reescrita entera — 82 líneas, cuatro bloques: "Decisiones que he tomado yo — valida estas", Intent/Scope/Approach, delta por capacidad con `ADDED`/`MODIFIED (antes: …)`/`REMOVED` y escenarios GIVEN/WHEN/THEN como receta (no descripción, Art. II), estimación solo en lite, aprobaciones. `funcional-template.md` nueva — 32 líneas, título estable por requisito como clave de fusión, cinco reglas anti-proliferación, Historial opcional. `plan-template.md` recibe §1.5 Riesgos y §1.6 Rollout. Índice de `sdd-templates` con la descripción nueva y la fila de la capacidad.

**Convención** (`48c0f4a`): `funcional.md` → `funcional/` en los siete sitios que lo citaban y ninguna skill escribía. `sdd-start-task` paso 4 calca la spec ligera y presenta el gate empezando por las decisiones.

**Guidance de conducta: ninguna.** El RED (`c1aea79`) desautorizó los tres steps del plan: E1 tres veces — `sdd-end-task` vigente fusiona el delta en `funcional/pedidos.md` sin ningún paso que lo nombre (3 requisitos, texto viejo fuera, nuevo dentro, cero ficheros de más); E2 — `sdd-consult` lee la capacidad, detecta que está desfasada y no la toca; E3 — brownfield no vuelca; E4 — sin skill, la plantilla produce una spec ligera correcta de 68 líneas.

**A/B** (`d5b0e35`): 22 runs, seis skills, 6/6 sin degradación. La única diferencia entre brazos es el paso 4: el tratamiento escribe la spec con las decisiones primero.

**Dogfooding**: este cierre fusiona el delta de la propia spec en `.docs/sdd/funcional/flujo-de-task.md` — primera capacidad del kit, 7 requisitos (6 `ADDED` + 1 `MODIFIED`), Historial con la fusión. `ls .docs/sdd/funcional/` = exactamente un fichero.

**Docs vivos**: `architecture.md` (estructura del repo y predicado), `tech-stack.md` (aprendizaje "un artefacto bien formado es guidance"), `mission.md` (documentos de anclaje), roadmap (T5 ✅), changelog (3 entradas).

## 2. Tiempo: estimado vs real

- Tipo: docs
- Estimación de implementación (del plan): 1,5 h (rango 1–2,5)
- Esfuerzo real: **~0,5 h** (aproximado: plan aprobado 15:14 UTC, cierre 15:45 UTC; RED, plantillas y A/B solapados)
- Desviación: −1 h (−67 %)
- Causa de la desviación (obligatoria, >30 %): el plan estimó **el reloj y no la suma** —corrección de T3/T4— y aun así sobreestimó, por dos motivos: (1) el RED no reclamó ninguna guidance, así que la Task 3 fue solo el rename y la Task 4 no tuvo GREEN que correr (el plan presupuestaba ambas enteras); (2) los siete renames con contexto salieron en un solo script con anchors por regex, no en 20 min de edición a mano. La estimación condicionada al RED (aviso de `estimation.md`, 2026-09-02) aplica también aquí: el coste de las Tasks 3 y 4 debía ir como rango "0 si el baseline acierta / X si falla".

## 3. Desviaciones del plan

- **Task 3 Steps 2, 3 y 4 no se ejecutaron** (RED E1/E2/E3 pasan). Marcados en el plan con el escenario que lo decidió.
- **Task 4 sin GREEN de conducta**: nada falló en el RED. Solo A/B.
- **La Task 2 corrió en paralelo con la Task 1**, como en T4.
- **E4 no corrió dentro del workflow del RED** (necesitaba la plantilla de la Task 2): corrió después, por `Agent`, cuando la plantilla existió. El plan lo preveía.
- **Un bug mío en el script de la fixture** (ruta absoluta concatenada) dejó las copias del RED incompletas en el primer intento; se regeneraron antes de lanzar nada.
- **Las repeticiones de E1** (n=3) no estaban en el plan como tales; las exige la regla "n=1 no es veredicto" de las Restricciones globales, y son lo que permitió no escribir el paso de fusión con confianza.

## 4. Verificación

### 4.1 Builds

No aplica. Verificado: `grep -rn "funcional\.md" skills/ .docs/sdd/*.md` devuelve solo la fila histórica de T5 en el roadmap; `spec-template.md` sin referencias a secciones numeradas; gates ⛔ y racionalizaciones intactos en las seis skills; enlaces relativos resolviendo; `ls .docs/sdd/funcional/` = `flujo-de-task.md`.

### 4.2 Smoke / tests

Todo **verificado por el agente en disco**:

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | RED E1 ×3 — `sdd-end-task` vigente con spec ligera y delta | 3/3 fusionan: `pedidos.md` 2→3 requisitos, `MODIFIED` sustituido, 0 ficheros de más |
| 2 | RED E2 — `sdd-consult` vigente | lee `funcional/pedidos.md`, detecta desfase, 0 ficheros tocados |
| 3 | RED E3 — `sdd-init-brownfield` vigente | 7 docs, ni `funcional.md` ni `funcional/` |
| 4 | RED E4 — sin skill, plantilla nueva a mano | spec de 68 líneas: 5 decisiones primero, delta bajo `pedidos` con GIVEN/WHEN/THEN/AND, `funcional/` intacto |
| 5 | Revisión de plantillas (task review) | Fase 1 completa; 2 Important + 2 Minor arreglados en ronda 1 |
| 6 | A/B seis skills, 22 runs | 6/6 sin degradación |
| 7 | **Dogfooding: fusión del delta de esta spec** | `funcional/flujo-de-task.md` con 7 requisitos y sus escenarios, Historial, único fichero de la carpeta |
| 8 | Code-review del cierre (paso 9) | ver §4.4 |

**Reportado por el usuario**: nada.

### 4.3 Residuales / deuda generada

- **Las specs anteriores a T5 siguen en el formato de 11 secciones.** No se migran (decisión de la spec); conviven como registro histórico.
- **`funcional/` del kit tiene una sola capacidad.** Las demás (carril patch, carril release, consulta, init) aparecerán cuando una task las toque — es la regla de brownfield aplicada al propio kit.
- **Alybo no tiene `funcional/`.** Decisión de Alybo, no del kit.
- **La fusión la hizo primero un script mío y el code-review lo señaló** (Important): el plan exigía que la produjera el paso de la skill. Se borró el fichero y un agente con `sdd-end-task` vigente ejecutó el paso 4 sobre el repo real: produjo los 7 requisitos y **corrigió por su cuenta** el título del `MODIFIED` que mi spec y mi script arrastraban con `(antes: …)` dentro. Matiz: el agente podía ver la versión borrada en `HEAD` (`git status` la marcaba `D`) y su Historial salió idéntico al del script; el Historial se reescribió después a una línea por fusión, como pide la plantilla.

### 4.4 Code-review (paso 9)

Ejecutado con `superpowers:requesting-code-review` sobre `f88c3d6..68e3e7d` más el working tree (revisor Sonnet, effort medium). **Veredicto: necesita cambios**, todos aplicados en el commit de cierre:

- **Critical** — `plan-template.md` había recibido solo Riesgos y Rollout: UX, Dependencias y Excepciones a la constitution se perdieron pese a que la decisión 1 de la spec prometía recolocarlos. Añadidos como §1.5, §1.6 y §1.9 (Riesgos y Rollout pasan a §1.7 y §1.8).
- **Important** — la fusión de `funcional/flujo-de-task.md` la hizo un script, no el paso de la skill. Rehecha por un agente con `sdd-end-task` vigente (ver §4.3).
- **Important** — título del requisito `MODIFIED` con `(antes: …)` incrustado, error nacido en la propia spec de T5. Corregido en la spec y en la capacidad; el agente que fusionó lo detectó también por su cuenta.
- **Minor** — Historial de la capacidad en una sola línea: reescrito a una línea por fusión. Narrativa del RED/GREEN sobre `aprendizajes-skills.md` sobreafirmaba: corregida, y `funcional/<capacidad>` añadido a ese fichero como destino (Art. IV).

## 5. Aprendizajes

- **Un artefacto bien formado es guidance** — tercer caso en la release (TDD en T3, `environments.md` en T4, el delta en T5): cuando el input tiene la forma exacta del output, el paso en la skill sobra → `tech-stack.md` §Tests.
- **La spec ligera se aprueba leyendo un bloque**: el dev-lead aprobó la spec de esta task con las siete decisiones; el formato pasó su prueba en su primer ejemplar → `roadmap.md` T5.
- **Estimar condicionado al RED también en tasks de convención**: las tasks de guidance deben ir como rango con suelo 0 → aviso para `estimation.md` en el cierre de release.
- **Tras un recorte a `references/`, los anchors de edición cambian de fichero** (segunda vez: `generacion.md`); comprobar con `grep` antes de editar → nota de método.
- **Revisión de skills (paso 5)**: mirado. `.claude/skills/` no existe; las skills del kit son `skills/`. Esta task las tocó seis y no creó ninguna: el RED demostró que sobraban.
