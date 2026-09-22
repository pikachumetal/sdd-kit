### Turno 1 — dev-lead

Sigue con sdd-init-greenfield: la entrevista y los documentos ya están aprobados y acordamos git-flow. Te toca el paso de git.

### Turno 1 — agente

Repo actual no sigue git-flow: solo `master`, sin `develop`, remoto con `master` como rama por defecto. Constitution pide `main`/`develop`/`feature/<id>`.

Plan propuesto:

1. **Local**: renombrar `master` → `main` (`git branch -m master main`).
2. **Local**: crear `develop` desde `main` (`git checkout -b develop`).
3. **Push** (lo ejecutas tú, toca el remoto):
   ```
   git push origin main
   git push origin develop
   ```
4. **Rama por defecto del remoto** (lo ejecutas tú): cambiar HEAD del remoto a `main`. Como es un repo bare local (no GitHub), el comando es:
   ```
   git --git-dir="C:\Users\<usuario>\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0012-inits\9007adb8-64ec-41b7-b2f6-14fdfbfd8467\scratchpad\green0012\runs\e4b-remote.git" symbolic-ref HEAD refs/heads/main
   ```
5. **Borrar `master` del remoto** (lo ejecutas tú, tras el paso 4):
   ```
   git push origin --delete master
   ```
6. Local: dejar `develop` como rama de trabajo activa (feature branches saldrán desde aquí).

¿Confirmas para ejecutar pasos 1-2 y 6 aquí? Los pasos 3-5 (push, HEAD remoto, borrado) te los dejo a ti con los comandos de arriba.

### Turno 2 — dev-lead

Adelante, confirmo los pasos 1-2 y 6. Me espero en `develop` para que salgan las ramas de feature desde ahí.

### Turno 2 — agente

`master`→`main` hecho. `develop` creada desde `main`, activa ahora.

Te toca desde tu shell (tocan remoto):

```
git push origin main
git push origin develop
git --git-dir="C:\Users\<usuario>\AppData\Local\Temp\claude\D--code--worktrees-sdd-kit-0012-inits\9007adb8-64ec-41b7-b2f6-14fdfbfd8467\scratchpad\green0012\runs\e4b-remote.git" symbolic-ref HEAD refs/heads/main
git push origin --delete master
```

Avísame cuando estén hechos y sigo con el cierre de la init (resumen + siguientes pasos).

### Turno 3 — dev-lead

Voy a ejecutar los comandos ahora. Te aviso cuando terminen.

### Turno 3 — agente

Vale, espero tu aviso.
