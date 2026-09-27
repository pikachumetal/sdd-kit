# RED — capacidades al nacer (task 0033)

Evidencia completa, moldes y salidas: `.docs/sdd/specs/20260923-105726-task-0033-capabilities-at-birth/red/`. Kit en `3c565a4`, sujetos Sonnet de un turno, 7 sujetos, 3,73 $.

| Frente | Escenario | Resultado |
| --- | --- | --- |
| Carpetas vacías | `estructura.md:15` y `:20` crean `capabilities/` y `specs/` vacías; `generacion.md:13` no crea `capabilities/` | las dos init se contradicen |
| Carpetas vacías | greenfield completo con funcional (`f2`–`f4`) | 3/3 dejan `capabilities/` y `specs/` vacías, invisibles para git |
| Volcado | greenfield, paso 6, el usuario pide las capacidades (`v1`, `v2`) | falla 2/2: `v1` vuelca sin partición ni nombres aprobados, con nombres de módulo y sin historial; `v2` se niega porque el kit lo prohíbe |
| Volcado (control) | brownfield, misma petición (`b1`) | se niega: conducta que se mantiene |
| Funcional | greenfield con `funcional-cliente.md` (`f2`–`f4`; `f1` bloqueado en `.claude/`) | falla 3/3: el original queda fuera de `.docs/sdd/` y sin enlace; los docs llevan un resumen que pierde reglas |

Racionalizaciones textuales:

- `v2`: «El kit prohíbe explícito esto. Regla en `capability-template.md` (#4) y en `sdd-init-brownfield/generacion.md`».
- `v1`: «Sin apartado "Historial" (nace la capacidad, no viene de fusión de task)».
- `b1`: «Repo es chico […] igual aplica la regla, no hace excepción por tamaño».

Las campañas archivadas de la 0012 no valen de baseline para las carpetas: sus `.gitkeep` venían ya en los moldes.
