---
title: Roadmap — App
status: draft
---

# Roadmap

> Forward-looking. Lo entregado va a `changelog.md`. Detalle de cada task en `specs/`.
> Leyenda: ✅ done · ⏳ pendiente · 🚫 fuera de scope.

## Release 1

| id | Feature | Origen | Ficheros que toca | Estado |
| --- | --- | --- | --- | --- |
| 0001 | Alta de salas | [brief.md](sources/brief.md) §14 | pendiente | ⏳ |
| 0002 | Reservar una sala | [brief.md](sources/brief.md) §14 | pendiente | ⏳ |
| 0003 | Ver la ocupación del día | [brief.md](sources/brief.md) §14 | pendiente | ⏳ |

## Deuda y pendientes

<!-- sdd-template: pending -->

## Deuda heredada de la plataforma

- Certificados de desarrollo de OpenIddict, válidos solo en local; se configuran en el primer
  despliegue.
- Access token de 8 horas sin refresh token: al caducar, toca volver a iniciar sesión.
- El correo de acceso está en castellano literal, no pasa por las traducciones de la BD.
- Recuperación de contraseña, signup, verificación de email y 2FA sin definir: los define cada
  proyecto.

## Patches

<!-- sdd-template: pending -->

| Id | Descripción | Estado |
| --- | --- | --- |
