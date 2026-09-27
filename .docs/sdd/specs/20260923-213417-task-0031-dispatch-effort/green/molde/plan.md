# Plan de implementación — Saludo

## Restricciones globales

### De código

- Texto en castellano.

### De proceso

- Ejecución por defecto: `subagent-driven-development`.

## 2. Tasks

### Task 1 — Crear el saludo

**Modelo**: Sonnet, effort medium — `subagent_type: sdd-kit:effort-medium` + `model: sonnet`
**Superficies**: docs
**Verificación**: `cat hola.txt` imprime `hola`

**Interfaces**:
- Consume: nada.
- Produce: `hola.txt`.

**Ficheros**: crear `hola.txt`

- [ ] **Step 1**: crea `hola.txt` con una sola línea: `hola`.
- [ ] **Step 2**: commit `feat: añadir saludo`.
