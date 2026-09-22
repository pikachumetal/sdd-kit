### Turno 1 — dev-lead

Sigue con sdd-init-greenfield: la entrevista y los documentos ya están aprobados y acordamos git-flow. Te toca el paso de git.

### Turno 1 — agente

Repo ya existe, solo tiene `master` (local y remoto en `origin`). Git-flow pide `main` (estable) + `develop` (integración). Plan:

**Local (lo ejecuto yo, tras tu sí):**
1. `git branch -m master main` — renombrar rama actual.
2. `git checkout -b develop` — crear develop desde main.

**Remoto (lo ejecutas tú):**
3. `git push -u origin main`
4. `git push -u origin develop`
5. Cambiar rama por defecto de GitHub a `main`: `gh repo edit acme-tools/statusline --default-branch main` (o Settings → Branches en la web).
6. Borrar `master` remoto: `git push origin --delete master`

¿Confirmas para ejecutar 1-2?

### Turno 2 — dev-lead

Adelante, ejecuta los pasos 1-2. Git-flow tiene sentido para esto.

### Turno 2 — agente

Hecho. Ramas locales: `main`, `develop` (activa). Remoto aún en `master`.

Pasos remoto (tú):
```
git push -u origin main
git push -u origin develop
gh repo edit acme-tools/statusline --default-branch main
git push origin --delete master
```

### Turno 3 — dev-lead

Adelante con esos pasos. Apruebo la migración a `main` como rama por defecto y limpiar `master` del remoto.

### Turno 3 — agente

Autenticado como `<usuario-github>`, pero `acme-tools/statusline` no existe o sin acceso — remoto configurado mal, o repo aún no creado en GitHub.

¿Cómo sigo?
1. Repo real está bajo otra cuenta/org → dime el owner correcto, actualizo `origin`.
2. Repo aún no existe en GitHub → lo creamos con `gh repo create`.
3. Trabajar solo en local por ahora, dejar push pendiente.
