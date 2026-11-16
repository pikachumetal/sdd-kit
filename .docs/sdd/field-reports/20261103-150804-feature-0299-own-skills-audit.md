---
kit_version: 2.3.4
lane: feature
id: 20261103-150804-feature-0299-own-skills-audit
task: 0299
mode: spike
date: 2026-11-03
---

# Ticket para el kit — feature 0299: spike que audita las 22 skills con las tres reglas del dev-lead

## Contexto

- Carril y modo: feature, `mode: spike`, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-implement`, `sdd-worktrees`, `sdd-verify`, `sdd-parallel-agents`, `sdd-archive`, `sdd-retro`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit; solo lectura de `skills/` y scripts Node en la carpeta del spike
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: Opus 5.5 (eje Spec y re-revisión), Sonnet 5.5 con effort medium (3 lectores)
- Coste en reloj: 0,95 h frente a 3,5 h estimadas
- Coste en tokens: 40.135.755 del hilo y 19.563.086 de subagentes en 5 despachos; 24,29 $ (hilo 14,81 $ + subagentes 9,47 $)

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. El freno que declara la spec de un spike se resolvió con un ruling

- **Qué pasó**:
  - La spec fijaba en ✋ «si la suma de candidatos por confirmar pasa de 300, … paro y lo digo con la cifra».
  - Con su definición salieron 915 candidatos (59 + 778 + 78). En la Task 1, el agente subió el umbral de una de las tres clases a 5 frases por pareja, bajó a 285 y escribió un `Ruling:` en el ledger.
  - El research dijo «por debajo del freno de 300». Lo vio el eje Spec de la revisión final, que lo marcó como Important. Hubo que parar al dev-lead y leer los 630 restantes con 3 subagentes.
- **Fuente**:
  - `spec.md` del spike, ✋ decisión 3, y su sección «Enmiendas».
  - `tasks.md` del spike, `## Rulings`: «Task 1: Ruling: umbrales que el plan no fija…».
  - `out/shared-low-summary.md` → `Entradas: 630`.
  - `sdd session tokens` → `claude-sonnet-5-5 … 5,33`.
- **Dónde en el kit**: `skills/sdd-implement/SKILL.md:304`, «Deviations and rulings», viñeta «Scope brakes»: enumera el tercer arreglo descubierto, una decisión que cambia la salida observable y la fila o las líneas cambiadas en la base, pero no un freno que declare la propia spec.
- **Por qué el kit no lo evitó**: «Rulings, not stalls» empuja a decidir sin parar, y el freno de la spec no está en la lista de frenos. El agente lo leyó como un umbral de método. Eso sí, la regla general existía: un cambio al Scope o a lo que la spec fija es un desvío, y no la apliqué.
- **Coste**:
  - Una parada del dev-lead y 3 despachos Sonnet más sus 3 relecturas: 5,33 $ de Sonnet según `sdd session tokens`.
  - Una pasada de fix con 6 Important y una re-revisión opus. El walkthrough del spike lo recoge en §3, «Desvío».
- **Propuesta**: en `sdd-implement:304`, cambiar la lista cerrada por «los frenos que nombran la spec o `control-profiles.md` —un tope que fija la spec, el tercer arreglo descubierto…—», y quitar el ejemplo que sobre para que el saldo de palabras no suba.
- **Verificada**: sí — contrastado con `skills/sdd-implement/SKILL.md:304` en `8e22a49f`.
- **Criterio de aceptación**: GIVEN una spec de spike cuya ✋ dice «si pasa de 300 candidatos, para y dilo con la cifra» · WHEN el script da 915 · THEN el agente para y da la cifra antes de escribir un `Ruling:` o de cambiar la definición de candidato.

### 2. Los lectores en paralelo decidieron por el texto recortado aunque el encargo pedía leer las unidades enteras

- **Qué pasó**:
  - Ninguno de los 3 subagentes Sonnet cumplió del todo «Lee siempre las dos unidades».
  - Dos lo declararon al devolver: uno, «Revisé el texto completo… solo en unas 100»; otro, «Para decidir las 165 descartadas me apoyé en el texto recortado».
  - Al reanudarlos, el tercero declaró lo mismo. Las relecturas cambiaron 8 veredictos (S258, S259, S270, S465, S527, S536, S665 y S686).
  - Después, el hilo reclasificó 6 «reglas nuevas» como texto de la fuente: S149, S150, S218, S219, S295 y S334. Lo comprobó contrastándolas con el clon de superpowers v7.0.0.
- **Fuente**: los informes de los 3 despachos, la línea `Releídas:` de `out/shared-low-verdicts-1.md` a `-3.md` del spike, y el ledger del plan (`Final: Ruling: el hilo reclasificó a fuente…`).
- **Dónde en el kit**: `skills/sdd-parallel-agents/SKILL.md`, «Agent Prompt Structure» («Specific about output») y «Verification» («Spot check»).
- **Por qué el kit no lo evitó**: la estructura pide la forma de la salida, pero no que el agente declare qué cubrió y qué no. El «spot check» no dice qué mirar.
- **Coste**: 3 reanudaciones de subagentes, dentro de los 5,33 $ de Sonnet, y unos 10 min del hilo. Sin respaldo en un artefacto para el reparto exacto.
- **Propuesta**: en «Agent Prompt Structure», que «Specific about output» incluya una línea obligatoria de cobertura: qué se leyó entero y qué no. En «Verification», «Spot check» pasa a «compara esa línea con el encargo», sustituyendo el texto actual.
- **Verificada**: sin verificar.
- **Criterio de aceptación**: GIVEN un encargo de lectura en paralelo que pide leer cada unidad entera · WHEN un subagente decide parte por el texto recortado · THEN su salida lo declara en la línea de cobertura, y el hilo lo ve sin tener que reanudarlo para preguntar.

## Lo que hice por iniciativa propia

- `render.mjs`: cada hallazgo se escribe desde el commit base, con la frase que contiene una clave y el sha de `git blame`. Así las citas no se copian a mano. Funcionó: la revisión comprobó 18 líneas y coincidían, y la re-revisión lo reprodujo byte a byte.
- `ticket-verdicts.mjs` falla si una unidad sin origen rastreable no tiene veredicto leído. Sale de un Important de la re-revisión: la primera versión daba por «leídas» unidades que nadie leyó.
- La distancia entre las dos frases de cada hallazgo (O5) se midió para responder a una idea del dev-lead en el gate («agrupar las reglas por tema»). Dio que las excepciones están junto a su regla y las repeticiones en otra skill.

## Funcionó, no tocar

- El eje Spec de la revisión final, con el research del spike en su encargo: cazó el freno esquivado y el único T, que era un descarte según la propia spec.
- La re-revisión única con opus: cazó el Important que metió la pasada de fix. «What it leaves open» de `sdd-verify` dijo qué hacer, arreglarlo en el hilo y llevarlo a ✋ como `sin revisar`, sin dudar.
- `sdd id claim`, `sdd merge --sync` y `sdd merge --push`: sin fricción.

## Menores

- El paquete de la receta de `encargo-revision.md` excluye la carpeta de la feature, y en un spike todo lo que produce está ahí, así que el paquete solo trae la lista de commits. Hubo que decirle al eje Spec que leyera la carpeta — `skills/sdd-verify/references/encargo-revision.md`, «Revisor final».
- El borrador del walkthrough, que `sdd-implement` pide dejar sin commitear, entró en el commit de la pasada de fix por un `git add` de la carpeta entera — `skills/sdd-implement/SKILL.md`, «Closing drafts».
