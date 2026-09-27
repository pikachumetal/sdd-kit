# t1-b

Coste: 1.78 $ · turnos: 2

## Turno 1

He mirado la interview de `sdd-config` (Q17): con perfil `delegate` recomendado, la política de merge/push (`sí` a fusionar `develop` con `--no-ff` y hacer push) recomendada también, y `execution: auto`. Con eso más brief.md tengo ya todas las respuestas.

Antes de anclar, te presento los 4 documentos a rellenar (los demás — tech-stack, architecture, environments, changelog, Artículos I-VIII — ya vienen fijados por la plantilla del template y no se tocan):

**mission.md**

```
## 1. Por qué existe

### 1.1 Problema
Los equipos de una oficina se pisan las salas de reuniones: no hay forma de ver cuáles están libres.

### 1.2 Solución
Aplicación de reservas de salas con un calendario de ocupación visible, para saber qué sala está libre y evitar choques.

## 2. Usuarios y roles
- **Empleado**: reserva y cancela sus propias reservas; ve las reservas de los demás solo como «ocupada» (no ve quién reservó).
- **Administrador de oficina**: da de alta salas y ve todas las reservas.

## 3. Módulos
Salas, Reservas, Calendario de ocupación.

## 4. Fuera de alcance
(propuesto, dime si falta o sobra algo) Facturación o coste de salas; integración con calendarios externos (Outlook/Google); gestión de equipamiento de la sala; notificaciones push o SMS (el aviso al cancelar/cambiar una reserva es solo en la aplicación).

## 5. Glosario
- **Sala**: espacio reservable de la oficina.
- **Reserva**: bloque horario que un empleado ocupa en una sala.
- **Ocupación**: vista de qué salas están libres u ocupadas en un momento dado.
- **Histórico**: reservas pasadas o canceladas; nunca se borran.
```

**constitution.md** — Artículos de producto + Reglas de producto

```
## Artículos de producto

### Artículo IX — Las reservas nunca se borran
Cancelar una reserva la deja en el histórico; nunca se elimina.

**Por qué**: trazabilidad de quién reservó y canceló qué, y cuándo.

**Cómo aplicar**: cancelar cambia el estado de la reserva (cancelada), nunca un DELETE.

## Reglas de producto

| Regla | Respuesta |
| --- | --- |
| Dónde viven los datos | En la base de datos del backend; nada en el navegador salvo la sesión. |
| Idioma de los nombres | API y claves en inglés; mensajes al usuario en castellano. |
| Límites | Una reserva dura como mucho 4 horas; un empleado no tiene más de 3 reservas futuras. |
| Avisos | Se avisa al empleado cuando el administrador cancela o cambia una reserva suya. |
| Regla ante conflicto | Manda la reserva confirmada primero. |
```

**roadmap.md** — Release 1

```
| Id | Task | Estado |
| --- | --- | --- |
| 0001 | Alta de salas | ⏳ |
| 0002 | Reservar una sala | ⏳ |
| 0003 | Ver la ocupación del día | ⏳ |
```

**sdd-kit.json**

```json
{
  "version": "1.1.0",
  "channel": "plugin",
  "updated": "2026-09-20",
  "ids": { "mode": "sequence" },
  "control": {
    "profile": "delegate",
    "maxParallelAgents": 3,
    "silence": { "betweenStepsMinutes": 8, "longCommandMinutes": 20 }
  },
  "merge": { "into": "develop", "noFf": true, "removeWorktree": false, "push": true },
  "execution": "auto"
}
```

Sin changelog de cliente (brief lo descarta), sin gestor de tickets, sin proyecto de referencia. Convención de ramas: git-flow, ya en marcha (`main`/`develop`).

¿Anclo así los 4 documentos? Revisa sobre todo «Fuera de alcance» de mission.md, es lo único que no venía en brief.md.

## Turno 2

.gitignore ya lleva `.superpowers/` y `.docs/sdd/sdd-kit.local.json`. Falta permiso para editar `.claude/settings.json` (`autoMemoryEnabled: false` + marketplace `superpowers-marketplace`). Autoriza el permiso y reintento.
