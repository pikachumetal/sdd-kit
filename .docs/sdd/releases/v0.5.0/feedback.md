---
release: v0.5.0
title: Acta de release — v0.5.0
created: 2026-09-02
source: sin sesión de feedback — trabajo interno del kit
---

# Acta de release — v0.5.0 (2026-09-02)

Fuente: trabajo interno del kit. **Sin demo ni feedback de cliente**, así que no hay inventario externo que triar. El origen de los tres ítems fue una consulta del dev-lead sobre qué mejorar a continuación (carril `sdd-consult`), que destapó la referencia rota y la ausencia de declaración de dependencias.

## 1. Inventario y triage

No aplica: sin sesión de feedback externo. Los tres ítems de la release se decidieron y aprobaron con el usuario en la propia sesión:

| # | Unidad | Origen | Decisión |
| --- | --- | --- | --- |
| 1 | [Task modo lite del carril task](../../specs/20260902-084856-task-0000-modo-lite/) | Estreno del kit en un proyecto del equipo | Cerrada antes de esta sesión |
| 2 | [Patch de la referencia rota a `grilling`](../../specs/20260902-153722-patch-0000-grilling-reference/) | Consulta del 2026-09-02 | Arreglar ya, decidido por el usuario |
| 3 | [Task de declaración de dependencias](../../specs/20260902-160308-task-0000-dependencias-declaradas/) | Ítem 4 del roadmap, ampliado por la investigación | Entera y en una sola task, decidido por el usuario |

## 2. Cambios de requisito detectados

Uno, y afecta al propio roadmap. El ítem 4 daba por hecho que la dependencia se declaraba con `dependencies: superpowers ^6.3.0` en `plugin.json`. La investigación desmintió tres supuestos de esa frase:

- `dependencies` es un **array** de strings u objetos `{name, version, marketplace}`, no un mapa estilo npm.
- La dependencia es **cross-marketplace** y está bloqueada por defecto: exige `allowCrossMarketplaceDependenciesOn` en el `marketplace.json` propio.
- `grilling` **no cabe ahí en ningún caso**: no es un plugin, sino una skill instalada con `npx skills add`. El kit depende de dos canales de distribución distintos, no de uno.

Consecuencia: la declaración quedó en dos planos (manifest para el plugin, README para la humana) en vez de un campo. Registrado en la [spec](../../specs/20260902-160308-task-0000-dependencias-declaradas/spec.md) §3.

## 3. Retro

- **Agregado de la release**: estimado **6 h** · real **~1,1 h** · ratio **0,18**. Desglose: `modo-lite` 3 h/0,5 h (0,17), `dependencias-declaradas` 3 h/0,3 h (0,10), `grilling-reference` sin estimación previa (patch, ~0,3 h).

- **Comprobación de los action items de v0.4.0**:
  - **[A2-ter] Configurar el remoto** — arrastrado desde v0.1.0, escalado en v0.4.0 con la instrucción de *"no dejarlo flotar una 5ª vez"*. **Cerrado como decisión, no como acción.** Evidencia: `git remote -v` sigue vacío. El usuario decidió el 2026-09-02 que el kit se queda **local-only y de uso individual**, instalado con `/plugin marketplace add` desde la ruta local, hasta que la empresa decida distribuirlo al equipo. Deja de ser action item: ya no se arrastra. Consecuencia asumida: v0.2.0 a v0.5.0 quedan cerradas y no distribuidas, y `claude plugin tag --push` no aplica.
  - **[A5] Checklist de montaje de fixture RED** — se verificaba con que el siguiente RED no gastara una ronda por método. **Cumplido en resultado**: dos REDs desde entonces (`modo-lite` y la degradación de `grilling`), ninguno descartó ronda. **Parcial en forma**: el aprendizaje vive en `tech-stack.md` §Tests como párrafo largo, no como checklist. Se cierra igual — el resultado es lo que se pedía verificar.

- **Qué funcionó**:
  - **El carril consult hizo de filtro.** Los dos ítems nuevos entraron por una consulta, no directamente a un carril de trabajo, y cada uno salió al carril que le tocaba: el nombre roto a patch, la declaración de dependencias a task. Segunda release consecutiva en que la consulta previene el sobre-disparo.
  - **La investigación antes que el código.** Verificar el schema real de `dependencies` costó dos fetches y evitó escribir un campo con la forma equivocada, sin restricción de versión que habría podido deshabilitar el plugin, y una dependencia que no cabía.
  - **El Art. I recortó alcance por tercera vez seguida.** El RED de la degradación salió limpio 2/2 y la guidance no se escribió: 2 de las 3 horas estimadas desaparecieron con evidencia detrás.
  - **El GREEN de una release pasada resultó ser el hueco de esta.** El fallo de `grilling` había pasado su ciclo Art. I en v0.3.0 porque la aserción miró la *decisión de enrutado* y se fio del autoinforme del subagente, sin comprobar que el identificador existiera. Lección incorporada.

- **Qué corregir**:
  - **La estimación presupuesta guidance que el RED luego desautoriza.** Ratio agregado 0,18, y es el tercer ciclo con la misma causa. Ya volcado a `estimation.md` como sesgo conocido; falta que un plan lo aplique.
  - **El método de test no sabe montar un entorno sin una skill.** El staging por renombrado la hace ininvocable, no ausente — 1 de 2 baselines cayó a la skill real y demostró la fuga. Limita lo que se puede probar de cualquier degradación futura. En la tabla de deuda del roadmap.
  - **Queda una verificación sin hacer y está declarada como tal**: que la resolución automática de `superpowers` funcione en un entorno limpio. Sin segundo entorno no hay install real que observar.

- **Action items nuevos** (verificables):
  - **[A6] Estimar la guidance condicionada al RED** — se verifica con que el próximo `plan.md` del kit exprese la parte de guidance como rango condicional ("0 h si el baseline no falla / Xh si falla"), no como coste cierto.
  - **[A7] Probar la resolución de la dependencia en un entorno limpio** — se verifica con la salida real de la instalación (éxito o el error `dependency-unsatisfied`) registrada en el próximo cierre. Si sigue sin haber un segundo entorno donde probarlo, se descarta explícitamente en vez de arrastrarse.
