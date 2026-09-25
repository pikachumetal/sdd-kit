# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), versionado SemVer.

## [Unreleased]

## [0.4.0] - 2026-09-25

### Added

- Listar mis reservas (`salas mias`). [task 0010](specs/20260921-120000-task-0010-my-bookings/)
- Las franjas mal escritas en `libres` y `reservar` se rechazan con un mensaje de error. [task 0009](specs/20260921-090000-task-0009-slot-format/)
- Reserva recurrente semanal (`salas reservar --cada-semana`). [task 0005](specs/20260915-090000-task-0005-weekly/)
- Listado de salas libres por franja (`salas libres 10:00-12:00`). [task 0006](specs/20260917-090000-task-0006-free/)

### Fixed

- La cancelación ya no borra reservas de otro día con la misma hora. [patch 0007](specs/20260918-090000-patch-0007-cancel/)

## [0.3.0] - 2026-09-01

### Added

- Cancelar una reserva propia.
