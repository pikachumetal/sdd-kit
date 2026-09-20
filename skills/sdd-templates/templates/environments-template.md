# Entorno por worktree — <proyecto>

> Contrato del entorno que necesita cada worktree más allá de instalar dependencias: base de
> datos, puertos, servicios, datos de prueba. Crear, instalar y borrar el worktree en sí lo
> gestiona `superpowers` (`using-git-worktrees`, `finishing-a-development-branch`); este
> documento cubre solo lo que queda fuera de esas skills. Se calca SOLO si el proyecto trabaja
> con worktrees Y su entorno necesita algo más que dependencias — si la segunda pregunta es no,
> superpowers ya cubre el caso y este fichero no existe. Borra los bloques de ayuda (`>`) al
> redactar.

## 1. El marcador `.sdd-env.json`

Vive en la raíz del worktree y registra el estado del entorno activo. Campos mínimos:

| Campo | Valor | Significado |
| --- | --- | --- |
| `ticket` | string | identificador de la task o el ticket al que pertenece el worktree |
| `state` | `active` \| `cleaned` | si el entorno está levantado o ya se bajó |
| `created` | string, ISO 8601 | cuándo se generó el marcador |

> El proyecto añade los campos adicionales que necesite. El marcador no se borra al limpiar:
> `env:clean` lo deja en `cleaned` como registro.

**Campos adicionales**: <lista real, p. ej. `dbPort`, `containerName`, `volumePath`>.

## 2. Las tres entradas

| Entrada | Semántica |
| --- | --- |
| `env:setup` | genera la configuración del entorno activo (base de datos, puertos, servicios) y deja el marcador en `active`. Es idempotente: si lo encuentra en `cleaned`, lo devuelve a `active` sin fallar |
| `env:clean` | baja los recursos levantados y marca el marcador `cleaned`, conservándolo como registro |
| `env:preflight` | comprueba que el entorno declarado sigue disponible antes de arrancar servicios (por ejemplo, un puerto ocupado por un proceso huérfano); si falla, se reporta y no se arrancan servicios — tampoco se ejecuta `env:clean` de otro worktree por iniciativa propia |

> El proyecto decide el runner que expone estas tres entradas y qué hace cada una por dentro.

**Runner**: <comando real, p. ej. `pnpm env:setup`, `moon run env:setup`, `make env-setup`, `just env-setup`>.

## 3. Tipos de entorno

- **default**: persistente, puertos fijos, el que se usa fuera de un worktree.
- **efímero**: uno por worktree, aislado; nace con `env:setup` de ese worktree y muere con su
  `env:clean`.

> El proyecto decide puertos, almacenamiento y servicios de cada tipo.

**Puertos / almacenamiento / servicios**: <detalle real, p. ej. puertos sorteados en
30000–49151 con sonda de disponibilidad, volúmenes por worktree, base de datos compartida vs.
aislada>.

## 4. Dónde se engancha en el flujo

- `env:setup` se ejecuta después de que el worktree exista e instale dependencias — ese paso
  previo es de `superpowers`, no de este documento.
- `env:clean` se ejecuta **antes** de que se ofrezca borrar el worktree: así el borrado nunca
  deja un contenedor, un puerto o un volumen huérfano.

## 5. Referencia

> Una implementación de referencia de este mismo contrato en Node + Docker Compose vive en los
> scripts del propio proyecto (`env-*.mjs` con su marcador); es nivel 3 y no se copia aquí.
