# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), versionado SemVer.

## [Unreleased]

### Added

- **0010** — Cancelar pide un motivo de la lista y `canceladas` lista las canceladas con su motivo. → [ref](specs/20261008-100000-feature-0010-cancel-reason/)
- Reserva recurrente semanal (`salas reservar --cada-semana`). [task 0005](specs/20260915-090000-task-0005-weekly/)
- Listado de salas libres por franja (`salas libres 10:00-12:00`). [task 0006](specs/20260917-090000-task-0006-free/)

### Fixed

- La cancelación ya no borra reservas de otro día con la misma hora. [patch 0007](specs/20260918-090000-patch-0007-cancel/)

## [0.3.0] - 2026-09-01

### Added

- **0010** — Cancelar pide un motivo de la lista y `canceladas` lista las canceladas con su motivo. → [ref](specs/20261008-100000-feature-0010-cancel-reason/)
- Cancelar una reserva propia.
