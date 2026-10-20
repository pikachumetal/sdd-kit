---
id: 20261020-110233-feature-0204-merge-push-and-slow-tests
feature: 0204
title: sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo
mode: full
profile: delegate
status: approved
created: 2026-10-20
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-10-20
---

# Spec — sdd merge dice qué publica de más, y la suite lenta deja de pasarse de tiempo

🦆 Hoy `sdd merge --push` publica también los commits que la rama destino tenía en local sin publicar, y no lo dice. Con este cambio los nombra. Por ejemplo, si `develop` llevaba `f5b76897 docs(roadmap): triaje` sin publicar, el cierre escribe `push: también publica 1 commit de 'develop' que no es de feature/0150:` y debajo `- f5b76897 docs(roadmap): triaje`, y el mensaje final del cierre lo cita. Además, la suite lenta del kit corre con 8 procesos a la vez en vez de 32: con la máquina cargada, el test más lento baja de 58-81 s a 29-30 s y se aleja del tope de 120 s. Y cuando git rechaza un push, el error añade lo que dijo git.

## Capacidades

- Modificadas: `control-profiles` — el push del cierre y del hotfix nombra los commits de la rama destino que no son del cambio, y su error añade la salida de git

## ✋ Decisiones que he tomado yo — valida estas

Review de spec propuesta: ninguna — señales: MODIFIED (el push del cierre), contrato público (la salida de `sdd merge` la lee la receta del cierre) · tamaño: ~60 líneas en 7 ficheros
- Mínimo razonable: ninguna — deja sin segunda lectura el literal de la línea nueva y su fila en la tabla de salidas de `merge-recipe.md`

1. **Causa de la 104, medida.** Medí la suite lenta entera (`cli:test-slow`, 28 ficheros y 257 tests) en esta máquina (32 núcleos):
   - Sin carga, con los workers por defecto: 227 s, y el test más lento 34 s. El primer test de cada fichero, el que tarda 9 s cuando el fichero corre solo, se va a ~30 s: los 28 ficheros arrancan a la vez y cada uno lanza decenas de procesos git.
   - Con otra suite lenta a la vez (la carga de otra sesión): los workers por defecto llegan a 58, 58 y 81 s en el test más lento; con `--maxWorkers 8`, a 29, 30 y 30 s. Sin carga, con 8: 197 s en total y 18,8 s como máximo.
   - Por eso: `--maxWorkers 8` en `cli:test-slow` y en `cli:test-min`, que es la única forma de que el timeout de 120 s deje de ser alcanzable con carga. Los workers no los fijo en el gate de cierre: va en las tareas de moon, así que la línea del gate no cambia.
2. **El 8 es medido, no óptimo.** Probé 8, 16 y el valor por defecto. Con 16, el test más lento llegó a 26 s sin carga, y el total no mejora (200 s frente a 197 s).
3. **Los fallos transitorios de git no los arregla este cambio.** En 13 pasadas salieron 3 fallos sueltos, uno de ellos con 8 workers. Los tres, y el de la 0202, tienen la misma forma: git no encuentra un repo que sí existe (`fatal: not a git repository`, `'origin' does not appear to be a git repository` y un `push: no se pudo publicar`).
   - Tu Defender tiene la protección en tiempo real activa, y sin permisos de administrador no puedo ver si excluye `%TEMP%`. Un escaneo que bloquea un momento `.git/HEAD` produce justo esos errores, pero no está probado.
   - Por eso la 104 queda **parcial**: «queda: los errores transitorios de git en las fixtures de `%TEMP%`, que apuntan a Defender (sin probar)».
   - Este cambio sí hace que el próximo rechazo de push diga lo que contestó git. Hoy el error se tragaba el stderr, y por eso el fallo de push de la 0202 no se pudo diagnosticar.
4. **Literal de la línea nueva**: `push: también publica <n> commit(s) de '<destino>' que no son de <rama>:` y debajo, uno por línea, `- <hash corto> <asunto>`. En singular, `1 commit de 'develop' que no es de feature/0150:`. Sale justo antes de `publicado en <remoto>`, y solo con `--push`, con remoto y con algún commit así.
5. **Qué cuenta como «no es del cambio»**: los commits de `<remoto>/<destino>..<destino>` justo después de integrar la remota y antes de fusionar el cambio. No cuentan los que trae un reintento del push: esos ya estaban publicados.
6. **No bloquea el push**: lo publica y lo nombra, como proponía la fila 130. No publicar dejaría sin subir los commits de triaje que haces en `develop`.
7. **El hotfix también los nombra**: los mismos commits locales de la rama estable y de la de vuelta, con una línea por rama que los tenga.
8. **El error de push añade la salida de git**: `push: no se pudo publicar 'develop' en 'origin'.` y, en las líneas siguientes, el stderr de `git push` tal cual. Lo mismo en el push atómico del hotfix.
9. **La receta del cierre**: una fila nueva en «Its outputs» de `merge-recipe.md`: `push: también publica …` → «quote it in the final message: the dev-lead sees what went out besides the change».
- `sdd capability merge` sobre una copia de `.docs/sdd`: «añadido «El push nombra los commits de la rama destino que no son del cambio»» y «sustituido «El push del cierre reintenta si la rama destino avanzó»», sin rechazos
- Política de modelos: sin revisores de spec · revisión final: Spec opus+high, Código sonnet+high, Arquitectura no · sin otros despachos

### Decisiones tomadas con el dev-lead

- Alcance: la 104 y la 130 en una feature; la 376, la 431 y la 261 siguen esperando su segundo ticket — «104 y 130 ahora (Recomendada)»

## Intent

Hoy, en el cierre, `sdd merge --push` publica sin decirlo los commits que la rama destino tenía en local sin publicar (ticket de la 0150 §7: tres commits de triaje salieron con la feature). Y el gate de cierre sale rojo con la máquina cargada sin que el cambio lo cause: la fila 104 de deuda y el fallo de push de la 0202. El éxito tiene tres partes:
- el cierre nombra lo que publica de más;
- con la carga de otra sesión, el test más lento de la suite lenta se queda en la mitad o menos de lo que tarda hoy;
- un push rechazado dice por qué.

Fracasaría si la suite lenta tardara bastante más sin carga, o si la línea nueva saliera también cuando no hay nada ajeno.

## Scope

- Entra:
  - `cli/moon.yml`: `--maxWorkers 8` en `test-slow` y `test-min`.
  - `cli/src/merge/steps.ts`, `run.ts` y `hotfix.ts`: la línea de los commits ajenos y el stderr de git en el error de push.
  - Sus tests en `push-retry.slow.test.ts` y `hotfix.slow.test.ts`, y uno nuevo para el merge normal.
  - `skills/sdd-archive/references/merge-recipe.md`: la fila de salida nueva.
  - `tech-stack.md` «Conjunto rápido y tests lentos»: los 8 workers y su porqué.
  - El roadmap: la 130 saldada y la 104 parcial.
- No entra:
  - Confirmar o excluir Defender: necesita permisos de administrador y es de la máquina, no del kit.
  - Reintentar las llamadas a git que fallan de forma transitoria: taparía la causa sin conocerla.
  - La 376, la 431 y la 261.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| `push: no se pudo publicar '<destino>' en '<remoto>'.` gana las líneas del stderr de git | `cli/src/merge/steps.ts:72`; `hotfix.ts:120`; `capabilities/control-profiles.md:318`; `merge-recipe.md:52` | delta `MODIFIED`; `merge-recipe.md:52` no cambia, porque su fila empieza igual |
| args de `test-slow` y `test-min` | `cli/moon.yml` | Scope; la línea del gate en `tech-stack.md:32` no cambia |

- Filas que implementa:
  - la de `--push` que publica commits ajenos (130), saldada;
  - la de los dos tests lentos que fallan con la suite entera (104), parcial.
  - Ninguna de las dos aparece en `capabilities/` ni en `skills/` (comprobado buscando «commits locales de la rama destino» y «Dos tests lentos ajenos»).

## Approach

- Los commits ajenos se calculan en el sitio que ya integra la remota antes de fusionar, con el mismo rango que usa `syncBaseBranch`, y se escriben al publicar.
- Los workers van como argumento de las tareas de moon, sin un fichero de configuración de Vitest nuevo.

## Dónde se prueba

- Los commits ajenos en el merge normal: `push-retry.slow.test.ts`, con un commit local en `develop` antes del merge, como los tests de push que ya hay. Sin commits ajenos, la línea no sale.
- Los commits ajenos en el hotfix: `hotfix.slow.test.ts`, como «fusiona en main, etiqueta y vuelve…».
- El stderr en el error: el test «un rechazo sin que la rama destino avance…», con un `pre-receive` que escribe un motivo.
- Los workers: la tabla de medidas de la decisión 1, repetida en la verificación con `cli:test-slow` y `cli:test-min` de la rama.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

## Delta de comportamiento

### Capacidad: `control-profiles`

**ADDED — El push nombra los commits de la rama destino que no son del cambio**
- GIVEN una `develop` local con `f5b76897 docs(roadmap): triaje` sin publicar en `origin`, y la rama `feature/0150-x` lista para fusionar
- WHEN el cierre ejecuta `sdd merge --push`
- THEN publica `develop` con ese commit y con el merge, y escribe `push: también publica 1 commit de 'develop' que no es de feature/0150-x:` y `- f5b76897 docs(roadmap): triaje`, antes de `publicado en origin`
- AND con dos commits así, `push: también publica 2 commits de 'develop' que no son de feature/0150-x:` y una línea `- <hash> <asunto>` por cada uno
- AND sin commits locales sin publicar, sin `--push` o sin remoto, la línea no sale
- AND los commits que trae de la remota un reintento del push no cuentan
- AND en un hotfix, cada rama publicada (la estable y la de vuelta) que tenga commits así da su línea, con su nombre

**MODIFIED — El push del cierre reintenta si la rama destino avanzó**
- GIVEN `sdd merge --push` y un remoto en el que otra sesión publica `develop` mientras corre `--verify`
- WHEN el push se rechaza y, tras un fetch, la `develop` remota ya no es antecesora de la local
- THEN escribe `push: 'develop' avanzó en 'origin'; integro y reintento (2/3)`, integra la `develop` remota como al empezar, repite `--verify` salvo que desde el último commit verificado solo cambien docs, y vuelve a empujar
- AND tras el tercer push rechazado falla con `push: 'develop' sigue moviéndose en 'origin' tras 3 intentos; relanza el merge en un rato` y la rama destino como estaba
- REMOVED AND un rechazo con la remota todavía antecesora (credenciales, hook del servidor) falla como hoy con `push: no se pudo publicar 'develop' en 'origin'.`, sin reintentar
- AND un rechazo con la remota todavía antecesora (credenciales, hook del servidor) falla con `push: no se pudo publicar 'develop' en 'origin'.` y, en las líneas siguientes, lo que escribió `git push` (`remote: rama protegida`), sin reintentar; el push atómico de un hotfix, igual

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 18900 / 19280 | 380 | sin cambio (la línea nueva son ~80 palabras) |

## Enmiendas

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-10-20 | aprobada (opción «Apruebo») |
