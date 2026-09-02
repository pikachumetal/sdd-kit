---
id: 20260902-160308-task-0000-dependencias-declaradas
task: 0000
title: Walkthrough — Declaración de dependencias del kit
spec: ./spec.md
plan: ./plan.md
status: done
created: 2026-09-02
---

# Walkthrough — Declaración de dependencias del kit

## 1. Cambios realizados

| Área | Ficheros | Commit |
| --- | --- | --- |
| Artefactos SDD | `spec.md`, `plan.md` | `366e955` |
| Manifests | `.claude-plugin/plugin.json`, `.claude-plugin/marketplace.json` | `b2bd8d2` |
| Declaración humana | `README.md`, `.docs/sdd/tech-stack.md` | `4d0057b` |
| Evidencia RED + corrección del README | `tests/sdd-consult-degradacion-red.md`, `tasks.md`, `README.md` | `bbc5b9d` |
| Registro vivo | `tasks.md` | `bfdc5c5` |

En sustancia: el kit declara `superpowers` en su manifest como dependencia cross-marketplace (autorizada en `marketplace.json`, sin restricción de versión), y el README pasa a ser la **fuente única** de la declaración humana, con `tech-stack` apuntando a él. La degradación de `grilling` no se escribió: el baseline no la necesitaba.

## 2. Tiempo: estimado vs real

- Tipo: docs
- Esfuerzo spec + plan: estimado 0,8 h · real ~0,3 h
- Estimación de implementación (del plan): 3 h
- Esfuerzo real: **~0,3 h** (de `366e955` 18:19 a `bfdc5c5` 18:31, con los dos subagentes del RED corriendo en paralelo dentro de esa ventana)
- Desviación: −2,7 h (**−90%**)
- Causa de la desviación (obligatoria):
  1. **La Task 3 desapareció por Art. I.** Era 2 de las 3 h estimadas. El RED salió limpio en los dos escenarios, así que la guidance no se escribió y no hubo GREEN. No medimos "fuimos rápidos": medimos "se construyó menos porque la evidencia lo desautorizó".
  2. **Las Tasks 1 y 2 eran declarativas.** Cuatro ficheros, ediciones puntuales, verificación por lectura. La estimación de 1 h para ambas asumía más fricción de la que hubo.
  3. **Los dos RED corrieron en paralelo**, no en serie.

Nota de calibración: el ratio 0,10 es **el más extremo del log** y por la misma causa que el 0,17 de `modo-lite`. Tres tasks seguidas con ratio < 0,4 por recorte del RED ya no son ruido: la estimación del kit sistemáticamente presupuesta guidance que el baseline luego desautoriza. Conviene estimar la implementación de guidance **condicionada al RED**, no como coste seguro.

## 3. Desviaciones del plan

- **Task 3 recortada (Art. I).** Prevista con RED→implementación→GREEN; se quedó en el RED. Documentado en `tests/sdd-consult-degradacion-red.md` y en `tasks.md` con status `skipped`. El propio plan lo contemplaba como salida legítima.
- **Corrección de un dato del plan.** El plan mandaba cambiar el README a "11 skills de proceso"; `mission.md` fija **10 de proceso + `sdd-templates`**. El README ya decía 10 y se dejó como estaba: aplicar el plan al pie de la letra habría metido un error.
- **Corrección del README dentro del ciclo.** La sección de Dependencias afirmaba que la skill, al degradar, "lo dice". Como la guidance no se escribió, esa frase pasaba a ser falsa. Se sustituyó por lo que el RED sí demuestra, con enlace a la evidencia. Un documento que promete conducta no implementada es exactamente la deriva que el kit combate.
- **Trabajo absorbido, decidido con el usuario**: `README.md:5` decía "v0.3.0 publicada", dos releases por detrás y con una palabra ("publicada") que ninguna versión merece sin remoto.

## 4. Verificación

### 4.1 Builds

El kit no tiene build ni CI (`tech-stack.md`). Equivalente ejecutado:

- `node -e "JSON.parse(...plugin.json); JSON.parse(...marketplace.json)"` → `JSON OK`.

### 4.2 Smoke / tests

Todo **verificado por el agente** con evidencia en disco. Nada reportado por el usuario.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Ambos manifests parsean como JSON | ✅ `JSON OK` |
| 2 | Nombres exactos de plugin y marketplace | ✅ `claude-plugins-official` aparece 1 vez en cada manifest; contrastado contra `installed_plugins.json`, que registra `superpowers@claude-plugins-official` |
| 3 | Una sola enumeración de skills invocadas en todo el repo | ✅ `grep -rn "writing-plans" README.md tech-stack.md` devuelve solo `README.md:55` |
| 4 | `tech-stack` referencia en vez de repetir | ✅ su viñeta enlaza al README y no lista skills |
| 5 | `README.md:5` con el estado real | ✅ "v0.4.0 cerrada, sin distribuir (sin remoto configurado)" |
| 6 | RED de la degradación, 2 escenarios | ✅ 2/2 sin fallo; evidencia y racionalizaciones en `tests/sdd-consult-degradacion-red.md` |
| 7 | El error de invocación se produjo de verdad en el RED | ✅ S2 registra `Unknown skill: grilling-unavailable` en su log de acciones |

**Lo que NO está verificado y conviene decirlo**: que la resolución automática de la dependencia funcione de extremo a extremo. Exigiría instalar el kit en un entorno sin `superpowers` y observar el error real, y sin remoto no hay instalación real que probar. La declaración se apoya en el schema documentado, no en un install observado.

### 4.3 Residuales / deuda generada

- **El staging de ausencia por renombrado no aísla la dependencia**: solo hace ininvocable un nombre. S2 lo demostró cayendo a la `grilling` real. El método de test del kit no sabe montar un entorno sin una skill. → deuda técnica del roadmap.
- **Aviso de degradación ausente (0/2)**: registrado en el RED, deliberadamente no convertido en guidance.
- Pendientes del ítem 4 del roadmap que esta task no toca: "crea un todo por paso" en 8 skills.

## 5. Aprendizajes

- **Las dependencias de un kit pueden llegar por canales distintos**, y eso cambia dónde se declara cada una: `superpowers` es plugin (manifest), `grilling` es skill suelta de `npx skills add` (README). Asumir un solo canal fue el error de partida del ítem del roadmap. → `README.md` §Dependencias + `.docs/sdd/tech-stack.md`
- **Declarar una dependencia en el manifest convierte un fallo parcial en uno total**: Claude Code deshabilita el plugin entero si no resuelve. Es una decisión de producto, no un detalle de configuración. → `README.md` §Dependencias
- **Constreñir la versión de una dependencia ajena añade un modo de fallo sin comprar nada**, porque la resolución va contra tags git de un repo que no controlas. → `spec.md` §3, y `README.md` documenta la instalación manual como salida
- **Dos documentos que declaran lo mismo divergen** — y aquí ya lo habían hecho: 6 skills en `tech-stack` contra 4 en el README. El Art. VIII vale para cualquier declaración repetida, no solo para las plantillas. → `.docs/sdd/tech-stack.md`
- **El staging por renombrado no prueba una degradación**: hace ininvocable un nombre, no ausente una capacidad. → `.docs/sdd/tech-stack.md` §Tests
- **Tercer RED consecutivo que recorta alcance.** La guidance planificada desde la intuición sobra más veces de las que falta; estimar su implementación como coste seguro infla sistemáticamente la estimación. → `.docs/sdd/estimation.md`
