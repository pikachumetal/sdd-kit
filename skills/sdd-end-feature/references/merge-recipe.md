# Receta del merge en el cierre

La usan el paso 10 de `sdd-end-feature` y el paso 6 de `sdd-end-patch` cuando la política de merge ya dijo que se fusiona: la aplica el agente (bloque `merge` completo, perfil `delegate` o `unattended`) o el usuario la pidió. Qué se fusiona y cómo lo fija la política: la rama destino es `merge.into`, y el merge va con `--no-ff` si `merge.noFf` es `true`.

## El merge es un script

El merge lo hace `Invoke-SddMerge.ps1`, siempre, y no se rehace a mano con `git merge`, `git worktree` ni `git push`:

```text
pwsh -NoProfile -File "<Base directory de la skill de cierre>/../sdd-templates/scripts/Invoke-SddMerge.ps1" -ProjectRoot "<worktree de la feature>" [-Push] [-VerifyCommand "<gate de merge>"]
```

El script hace, en este orden:

1. Espera su turno. Hay un cerrojo por repo, y si otra sesión lo tiene, el script dice quién es y espera.
2. Hace `fetch` e integra en la rama destino lo que el remoto tenga de nuevo.
3. Fusiona. Si la rama destino no está sacada, lo hace en un worktree temporal `merge-<id>` junto a los demás worktrees. Si está sacada en un worktree limpio, lo hace en ese worktree. Un conflicto en `estimation-log.md` lo regenera con `Build-EstimationLog.ps1`.
4. Ejecuta la verificación.
5. Empuja la rama destino por su nombre.
6. Retira el worktree temporal.

- **`-Push`**: según «Push», abajo. Sin él, el script fusiona en local y no publica nada.
- **`-VerifyCommand`**: el gate de merge que declara `tech-stack.md` §Testing, que se ejecuta sobre el resultado del merge y antes del push. Si el proyecto tiene una sola suite, es esa. Si separa un conjunto rápido de la suite completa, el gate es el rápido, y la suite completa se ejecuta antes de llamar al script, como parte de la validación final; el mensaje final da su resultado. Se omite si un hook `pre-merge-commit` del repo ya ejecuta el gate, pero la suite completa no se omite nunca.
- El worktree de la feature sigue en su rama. Lo decide `merge.removeWorktree`, no esta receta.

## Push

El push lo hace el script con `-Push`: publica solo la rama destino, por su nombre, en su remoto, y nunca la rama de la feature ni tags. Se decide en este orden, y manda la primera regla que aplique:

1. Perfil `pair`: se presenta junto con el merge y se espera, sea cual sea `merge.push`; `-Push` solo si el usuario lo confirma.
2. Una frase del usuario en esta sesión que confirma el push («súbelo», «publícalo», «push»): `-Push`.
3. `merge.push: true` (perfil `delegate` o `unattended`): `-Push`, sin preguntar.
4. `merge.push` ausente o `false`: sin `-Push`, y el mensaje final lo dice («push: no hecho: `merge.push` no lo autoriza»).

Si la rama destino no tiene remoto, no se pasa `-Push` (el script fallaría con `push:` antes de fusionar), y el mensaje final dice «push: no hecho: sin remoto». Si el push falla, se sigue «Si el script falla»: nunca `--force`, `pull`, `rebase` ni `git push` a mano. El mensaje final cita en un bloque el comando del script, cita su error y da el hash de la rama destino.

## Cuándo no se llama

Si la rama destino está sacada en un worktree con cambios sin commitear, el script falla con `destino sacado:` y la lista de ficheros. Esos cambios son de otra sesión: el cierre para y dice qué ficheros son, sin `stash`, `reset` ni commit de lo ajeno.

## Si el script falla

Si falla, la rama destino queda como estaba antes de fusionar la feature: no se empuja nada, el worktree temporal se retira y el cerrojo se suelta. El mensaje empieza por el paso que falló (`cerrojo:`, `base:`, `merge:`, `verificación:`, `push:`, `política:`). El informe final cita ese mensaje literal, el hash de la rama destino (`git rev-parse --short <destino>`) y qué queda pendiente. **No se rehace a mano** con `git merge`, `git pull` ni `git push`. Un fallo de `push:` o de `base:` (otra sesión publicó en ese rato) se resuelve ejecutando el script **una vez más**: parte del remoto nuevo. Un conflicto de `merge:`, una `verificación:` en rojo o un `cerrojo:` agotado no se reintentan: los resuelve una persona, salvo el de los registros (siguiente sección).

## Conflicto solo en los registros

1. Se aplica cuando el script falla con `merge: conflicto en` y todos los ficheros de la lista son de estos tres: `.docs/sdd/changelog.md`, `.docs/sdd/roadmap.md` y `.docs/sdd/estimation-log.md`. Si en la lista hay cualquier otro fichero, sigue «Si el script falla»: es de una persona.
2. En el worktree de la feature, con el commit de cierre ya hecho: `git merge --no-edit <merge.into>`. La base es la rama local: al fallar en `merge:`, el script ya dejó ahí lo publicado en el remoto.
3. En `changelog.md` y `roadmap.md`, cada línea se queda con el cambio del lado que la tocó. Dos líneas nuevas entran las dos, y dos filas distintas, aunque sean contiguas y caigan en el mismo trozo, se quedan cada una con su cambio. Los dos trozos no se pegan enteros: eso duplicaría filas.
4. Si los dos lados tocaron la misma línea, `git merge --abort` y sigue «Si el script falla»: es de una persona.
5. `estimation-log.md` no se edita: se regenera con `Build-EstimationLog.ps1`.
6. `git add` de los tres y `git commit --no-edit`, que pasa el hook. Nunca `--no-verify`.
7. Relanza el script **una vez**. Si vuelve a fallar con `merge:`, es de una persona, aunque sea otra vez solo en los registros.
8. Es el único `git merge` a mano del cierre, y nunca toca la rama destino.

## Merge denegado por el entorno

La política autoriza el merge y el entorno lo deniega (un clasificador del harness, un hook). No se reintenta con otra herramienta ni con otra forma del comando: lo desbloquea una persona. El informe final dice:

1. El **comando** denegado, literal, en un bloque de código.
2. El **texto de la denegación**, citado.
3. El **hash** de la rama destino, que sigue sin tocar (`git rev-parse --short <destino>`). Si al volver a mirarlo ha cambiado, otra sesión fusionó en ese rato: dilo.
4. Que el resto del cierre está hecho, y qué queda: solo el merge.
