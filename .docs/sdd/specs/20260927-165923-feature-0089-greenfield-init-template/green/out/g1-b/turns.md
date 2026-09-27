# g1-b

Coste: 1.79 $ · turnos: 2

## Turno 1

He mirado `.docs/sdd/`: ya existe el esqueleto del template con secciones `pending`. Lo ya fijado por la plataforma (artículos técnicos I-VIII, tech-stack, architecture, environments, DESIGN, convención de ramas git-flow que ya usáis) no se pregunta. De brief.md cubro: problema, roles, módulos, datos, idioma, límites, avisos, regla de conflicto, innegociable de negocio, changelog, sin gestor de tickets, sin proyecto de referencia, tareas de la release 1.

Quedan dos preguntas de la entrevista que brief.md no responde.

**Pregunta 4 — ¿Qué queda fuera de alcance del proyecto?**

Mi recomendación, por el dominio (reservas de salas de oficina): fuera quedan facturación o coste de salas, integración con calendarios externos (Outlook/Google), catering o recursos audiovisuales, y reservas recurrentes. ¿Confirmas esa lista o cambias algo?

## Turno 2

Init greenfield hecho, salvo `.claude/settings.json` (bloqueado por permisos).

**Documentos completados:**
- `mission.md` — problema, roles, módulos. «Fuera de alcance» y «Glosario»: sin respuesta («no sé»), quedan `pending` para otra sesión.
- `constitution.md` — Artículo IX (ninguna reserva se borra) + tabla de 5 reglas de producto.
- `roadmap.md` — Release 1 con las 3 tasks de `brief.md` §14; «Deuda y pendientes» y «Patches» limpiados de marcador (vacíos, no pendientes).
- `sdd-kit.json` — `ids.mode: sequence` (sin tracker), `control.profile: delegate`, frenos por defecto (3/8/20), `merge` a `develop` con `--no-ff` y push, `execution: auto`. Todo por tu «recomendada en cada una».
- `.docs/sdd/sources/brief.md` — copia literal del funcional.
- `.gitignore` — añadidas `.superpowers/` y `.docs/sdd/sdd-kit.local.json`.

**Pendiente por permisos**, hazlo tú a mano en `.claude/settings.json`:

```
"autoMemoryEnabled": false
```

y en `extraKnownMarketplaces` añade:

```
"superpowers-marketplace": {
  "source": { "source": "github", "repo": "obra/superpowers-marketplace" }
}
```

Si `claude plugin marketplace list` no lo lista después: `claude plugin marketplace add obra/superpowers-marketplace`.

Tech-stack, architecture, environments, DESIGN, convención de ramas (git-flow, ya en uso: `main`/`develop`): ya venían fijados por el template, sin tocar. Nada commiteado — dime si lo hago.
