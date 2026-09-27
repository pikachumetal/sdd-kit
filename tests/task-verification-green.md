# GREEN — verificación por task (task 0006)

Kit del working tree con las Tasks 2 y 3 de esta task ya commiteadas (`00ce715`, `ec584a8`), copiado a `KIT_DIR` limpio (`skills/` + `.claude-plugin/`). Mismo molde que el RED: `red/m` + `red/f1` (E1), `red/f6`/`red/f6b` + `red/subject6.sh` (E2, E3) — reutilizados sin copiar. Lanzadores: `red/subject.sh` (E1) y `red/subject6.sh` (E2, E3), sin cambios. Salidas en [`.docs/sdd/specs/20260923-102746-task-0006-task-verification/green/out/`](../.docs/sdd/specs/20260923-102746-task-0006-task-verification/green/out/).

## Sujetos

| Sujeto | Escenario | Coste | Resultado |
| --- | --- | --- | --- |
| g-e1-1 | E1 — escribe `plan.md` y para | 1,06 $ | plan.md con Superficies/Verificación/Verificación lenta/Verificación visual, gate una vez en §3 |
| g-e1-2 | E1 | 0,63 $ | ídem |
| g-e2-1 | E2 — despacha Task 1 y sigue el plan | 3,51 $ | encargo correcto; nunca lanza `backend:test` (ni primer ni segundo plano) |
| g-e2-2 | E2 | 4,89 $ | encargo correcto; lanza `moon run backend:test` desde el hilo principal con `run_in_background: true` mientras revisa |
| g-e3-1 | E3 — Task 1 hecha, cierra la Task 2 | 2,52 $ | Task 2 cerrada como «no probado» en verificación visual, tras comprobar que no hay `node_modules`/`package.json` |
| g-e3-2 | E3 | 1,42 $ | ídem, con la misma comprobación de entorno |

**Coste de esta campaña**: 14,04 $. Sumado al RED (e2-2 1,82 $ + e3-1 1,65 $ + e3-2 3,42 $ + e2-1 sin capturar por el corte), la campaña completa (RED + GREEN) pasa del techo de 18 $ aprobado — el desglose se dio al dev-lead antes de lanzar el GREEN.

## Veredicto

| Medida | Sujetos | Resultado | RED → GREEN |
| --- | --- | --- | --- |
| Cada task declara Superficies y Verificación; `backend:test` solo en la task con BD; gate completo solo en §3; la task de UI declara Verificación visual; `backend:test` como Verificación lenta | g-e1-1, g-e1-2 | 2/2 | n/a (E1 no estaba en el RED de esta task — mide la plantilla de la Task 2, control nuevo) |
| El encargo del implementador dice que no ejecute `backend:test` ni la suite completa | g-e2-1, g-e2-2 | 2/2 | falla 1/1 → **pasa 2/2** |
| El hilo principal lanza `moon run backend:test` en segundo plano mientras revisa | g-e2-1, g-e2-2 | 1/2 (g-e2-2 sí, con `run_in_background: true` desde el hilo; g-e2-1 no lo lanza en ningún momento) | falla 1/1 → **pasa 1/2** |
| Tras la revisión, la Task de UI se mira en un navegador o queda «no probado» en vez de «hecho» solo por la suite | g-e3-1, g-e3-2 | 2/2, con comprobación previa de `node_modules`/`package.json` antes de concluir | falla 2/2 → **pasa 2/2** |
| Control: el encargo de la Task de frontend no lleva `:test` ni `backend:test` (ya pasaba sin cambios, recortado en la Task 3) | g-e3-1, g-e3-2 | 2/2 (`Verificación (solo esto, NO ejecutes… ni moon run :test)`, `moon run frontend:test` / `frontend:check`) | pasaba 2/2 → **sigue pasando 2/2** |

Tres de los cuatro frentes que entraron en la Task 3 cierran en 2/2. El cuarto («el hilo lanza la verificación lenta en segundo plano») mejora de 0/1 en el RED a 1/2 en el GREEN: la guía nueva SÍ dispara la conducta correcta cuando el hilo la sigue (g-e2-2: `run_in_background: true`, invocado por el hilo principal, no por el implementador), pero no la garantiza — g-e2-1 completó las dos tasks de la task 0012 sin lanzar `backend:test` en ningún momento, ni en primer plano ni en segundo, pese a que su propio implementador señaló explícitamente en el informe «No ejecuté `moon run backend:test` (verificación lenta, corresponde al hilo principal)». El hilo de g-e2-1 no recogió el testigo.

**Ruling**: no se relanza este frente con dos sujetos nuevos. La causa no es un vacío de texto — el mismo párrafo de `SKILL.md` que hizo pasar a g-e2-2 estaba presente en g-e2-1 — sino variabilidad de adherencia a una instrucción de varios pasos dentro de un turno largo, que un tercer intento de redacción no puede cerrar por diseño (el propio plan lo anticipa como riesgo residual del RED, no de la guía). Insistir con más prosa arriesga sobre-especificar el paso 6 sin mover la tasa de acierto; el coste de dos sujetos más (techo de la campaña ya superado) no compra una garantía que la naturaleza del fallo no ofrece. Se registra como **deuda de conducta conocida** en el roadmap del kit (no en `SKILL.md`): candidato a revisarse si una fila de deuda futura junta más de un caso.

## Método

Mismo lanzador y molde que el RED del paso 6 (`tests/task-verification-red.md`), sin copiar `red/m`/`red/f1`/`red/f6`/`red/f6b`: solo cambia `KIT_DIR`, que apunta a la copia limpia del working tree con las Tasks 2 y 3 aplicadas. Verificación de cada medida por lectura de `git log`/`tasks.md`/`plan.md` producidos, `shim.log` (qué comandos se ejecutaron y cuándo) y el `jsonl` del sujeto (`tool_use` de `Bash` con `parent_tool_use_id: null` para distinguir al hilo principal de un subagente, y su parámetro `run_in_background`). El control de E3 (el frente que la Task 1 recortó) se releyó explícitamente para confirmar que seguía pasando sin la guía nueva, no se asumió.
