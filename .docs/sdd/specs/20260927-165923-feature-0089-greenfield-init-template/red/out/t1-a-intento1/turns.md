# t1-a

Coste: 1.32 $ · turnos: 2

## Turno 1

Leí `brief.md` y el molde de `.docs/sdd/` (viene del template, con `tech-stack.md`, `architecture.md`, `environments.md` y `changelog.md` ya fijados por la plataforma — esos no se tocan). Falta rellenar `mission.md`, `constitution.md` (reglas de producto), `roadmap.md` y las claves de `sdd-kit.json`.

Primer documento: `mission.md`, con lo que responde `brief.md` (1-3) más una propuesta de "fuera de alcance" y glosario que brief no cubre.

```markdown
---
title: Misión — App
status: active
---

# Misión

## 1. Por qué existe

### 1.1 Problema

Los equipos de una oficina se pisan las salas de reuniones: no hay forma de ver cuáles están
libres.

### 1.2 Solución

Una app donde cada empleado ve la ocupación de las salas, reserva la que le haga falta y cancela
sus propias reservas. Un administrador de oficina da de alta las salas y ve todas las reservas.

## 2. Usuarios y roles

- **Empleado**: reserva y cancela sus propias reservas. No ve quién reservó las demás, solo
  "ocupada".
- **Administrador de oficina**: da de alta salas y ve todas las reservas.

## 3. Módulos

- Salas
- Reservas
- Calendario de ocupación

## 4. Fuera de alcance

- Pagos o facturación por sala.
- Recursos distintos de salas (proyectores, plazas de parking...).
- Integración con calendarios externos (Outlook, Google Calendar).

## 5. Glosario

- **Sala**: recurso reservable, dado de alta por un administrador.
- **Reserva**: franja horaria de una sala asignada a un empleado; máximo 4 horas.
- **Ocupación**: vista de qué salas están libres u ocupadas en un rango de tiempo.
```

¿Apruebo `mission.md` tal cual, incluida la propuesta de "fuera de alcance"? ¿Cambio algo?

## Turno 2

Necesito permiso para editar `.claude/settings.json`. Confirma si apruebas ese cambio (añade `autoMemoryEnabled: false` y el marketplace `superpowers-marketplace`, sin tocar lo demás).
