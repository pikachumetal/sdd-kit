### Turno 1 — dev-lead

Sigue con sdd-init-greenfield: la entrevista y los documentos ya están aprobados y acordamos git-flow. Te toca el paso de git.

### Turno 1 — agente

Repo ya existe, sin repo remoto real (origin es un bare local), rama única `master`, sin `develop`. No sigue git-flow. Plan para dejarlo conforme a lo acordado:

**Local**
```
git branch -m master main
git checkout -b develop
```

**Remoto** (origin)
```
git push -u origin main
git push -u origin develop
```
Luego borrar `origin/master` (obsoleta tras el rename):
```
git push origin --delete master
```

Si origin fuese un host real (GitHub/GitLab), tocaría cambiar ahí la rama por defecto a `main` antes de borrar `master` — aquí es un bare local, así que basta con el orden anterior.

¿Confirmas y ejecuto?

### Turno 2 — dev-lead

Adelante. El plan es correcto para pasar a `main` como rama por defecto y crear `develop`.

### Turno 2 — agente

Git-flow listo: `main` rama por defecto en origin, `develop` creada y en tracking, `master` borrada local y remota. Estás en `develop`.

Siguiente paso de la skill: resumen de cierre — estructura `.docs/sdd/` creada, `CLAUDE.md` con punteros, y próximos pasos (partición fina/estimación cuando madure `capabilities/`, skills de nivel 2 según stack). ¿Sigo con eso o ya está hecho en un paso previo?

### Turno 3 — dev-lead

Sí, adelante con el resumen de cierre. Todavía no está hecho: necesito ver la estructura `.docs/sdd/` y los punteros en `CLAUDE.md` para validar que todo está en su lugar.

### Turno 3 — agente

Todo en su sitio:

**`.docs/sdd/`**: mission, constitution (con Art. II de git-flow), roadmap, tech-stack, changelog, estimation-log (vacío, correcto), sdd-kit.json (`ids.mode: sequence`), `capabilities/` y `specs/` con `.gitkeep`.

**`CLAUDE.md`**: corto, apunta a `.docs/sdd/`, referencia git-flow y confirma sin gestor de tickets. Sin duplicar contenido de los docs de anclaje.

No hay `client-changelog.md` — coherente si en la entrevista no se pidió changelog de cliente.

**Cierre de sdd-init-greenfield:**
- Documentación de anclaje creada y aprobada (mission, constitution, roadmap, tech-stack).
- Git-flow aplicado: `main` por defecto, `develop` de integración, `master` retirada.
- `CLAUDE.md` con punteros, sin duplicación.

**Siguientes pasos:**
- Partición fina y estimación cuando `capabilities/` tenga contenido real.
- Skills de nivel 2 recomendadas según stack (revisa `tech-stack.md` y valora instalarlas cuando arranque la primera task).
- Primera task: `sdd-kit:sdd-start-task`.

### FIN (simulador)
