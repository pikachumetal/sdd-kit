### Turno 1 — dev-lead

Sigue con sdd-init-greenfield: la entrevista y los documentos ya están aprobados y acordamos git-flow. Te toca el paso de git.

### Turno 1 — agente

Repo ya existe, solo rama `master`, remoto `origin` con `origin/master`. No sigue git-flow (falta `main` y `develop`). Plan completo antes de tocar nada:

**Local** (lo ejecuto yo tras tu "sí"):
1. Renombrar `master` → `main`.
2. Crear `develop` desde `main`.

**Remoto** (los ejecutas tú, comandos abajo):
3. Push de `main`:
   ```
   git push -u origin main
   ```
4. Cambiar rama por defecto del repo en GitHub a `main` (Settings → Branches → Default branch), o vía `gh`:
   ```
   gh repo edit acme-tools/statusline --default-branch main
   ```
5. Borrar `master` en remoto:
   ```
   git push origin --delete master
   ```
6. Push de `develop`:
   ```
   git push -u origin develop
   ```

Tras esto, features nacerán de `develop` como `feature/<id>`. ¿Confirmas plan para ejecutar pasos 1-2?

### Turno 2 — dev-lead

Sí, confirmo. Adelante con los pasos 1 y 2.

### Turno 2 — agente

Hecho. `master` → `main`, `develop` creada desde `main`.

Pendiente por tu parte (pasos 3-6, tocan remoto):
```
git push -u origin main
gh repo edit acme-tools/statusline --default-branch main
git push origin --delete master
git push -u origin develop
```

### Turno 3 — dev-lead

Adelante con los pasos remotos. Confirma cuando esté todo listo.

### Turno 3 — agente

Remoto apunta a `github.com/acme-tools/statusline`, no encontrado (repo no existe o sin acceso). No puedo seguir con push, cambio de rama por defecto ni borrado remoto.

¿Remoto correcto es otro, o repo aún no creado en GitHub?
