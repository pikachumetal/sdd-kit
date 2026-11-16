---
kit_version: 2.3.4
superpowers_version: 7.0.1
lane: patch
id: 20261031-213728-patch-0268-extract-account-email
task: 0268
date: 2026-10-31
---

# Ticket para el kit — patch 0268: `extract.mjs` no guarda una salida con el email de la cuenta

## Contexto

- Carril y modo: patch, petición cerrada, perfil `delegate`, validación en campo
- Skills del kit usadas: `sdd-propose`, `sdd-start-patch`, `sdd-archive`, `add-to-changelog`, `sdd-feedback`
- Proyecto: el propio kit, una persona
- Modelo del hilo: Opus 5.5
- Modelos de los subagentes: no aplica
- Coste en reloj: 0,18 h frente a 0,52 h estimadas
- Coste en tokens: 2,14 $ con `sdd session tokens`

## Cómo leer este ticket

Los hallazgos son hipótesis a testear con RED/GREEN, no cambios aprobados, y van ordenados por coste observado.

## Hallazgos

### 1. La fila y el prompt fijaban `~/.claude.json`, y el sujeto puede ver otra cuenta

- **Qué pasó**: esta máquina tiene dos cuentas con emails distintos, en `~/.claude.json` y `~/.claude-gco/.claude.json`. Con `CLAUDE_CONFIG_DIR` puesta, leer solo el de `~` compararía con la cuenta equivocada, sin aviso: justo el silencio que la petición prohibía. Leí primero `CLAUDE_CONFIG_DIR` y lo registré como decisión `sin el dev-lead`.
- **Fuente**: sonda sobre los dos ficheros, que solo imprimió booleanos; `patch.md` de la 0268, §3; `tests/headless/lib.mjs:19`, que ya documenta la variable
- **Dónde en el kit**: `skills/sdd-roadmap/SKILL.md`, donde se fijan los ficheros de una fila; no sé localizar un paso concreto
- **Por qué el kit no lo evitó**: nada pide contrastar una ruta fijada en la fila con la configuración real de la máquina
- **Coste**: sin coste; sin el contraste, falso limpio con el email de una de las cuentas
- **Propuesta**: ninguna en las skills hasta un segundo caso; el dato ya está en `tech-stack.md`
- **Verificada**: sí — test con `CLAUDE_CONFIG_DIR` y ficheros falsos en `cli/test/kit/subject-output-privacy.slow.test.ts`; sin probar con un sujeto real de la segunda cuenta
- **Criterio de aceptación**: GIVEN `CLAUDE_CONFIG_DIR` apunta a una cuenta con otro email WHEN una salida lleva ese email THEN `extract.mjs` sale con 3

## Lo que hice por iniciativa propia

- `saveExtract` repite el aviso de `extract.mjs` con salida 0: sin eso el aviso se perdía y la salida parecía comprobada.
- Corrí `kit:test-headless` con `CLAUDE_CONFIG_DIR` en una carpeta vacía, para ver antes de la CI cómo se porta sin `.claude.json`. Verde.
- El aviso no incluye el error de `JSON.parse`, que cita trozos del fichero; esta máquina guarda un `.claude.json.corrupted.*`.

## Funcionó, no tocar

- La petición cerrada con decisiones ya tomadas: ninguna parada y sin sujetos.
- Comprobar con la cuenta real imprimiendo solo booleanos: el valor no entró en la sesión por esa vía.

## Menores

- Los dos comportamientos pedidos (rechazo y aviso) dan más de un test, y `sdd-propose` dice que eso no es un patch. Lo traté como una comprobación con su degradado, porque el carril venía en la petición — `skills/sdd-propose/SKILL.md` paso 2.
- `subject-output-privacy.test.ts` revisa la evidencia staged con `findMachineLeak`, y no busqué si cubre el email de la cuenta; quedaba fuera del alcance. Lo que pasa por `extract.mjs` sí queda parado — `cli/test/kit/privacy.ts`.
