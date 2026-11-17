# Changelog

Formato [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), versionado SemVer.

## [Unreleased]

### Added

- Reserva recurrente semanal (`salas reservar --cada-semana`). [task 0005](specs/20260915-090000-task-0005-weekly/)
- Listado de salas libres por franja (`salas libres 10:00-12:00`). [task 0006](specs/20260917-090000-task-0006-free/)

### Fixed

- La cancelación ya no borra reservas de otro día con la misma hora. [patch 0007](specs/20260918-090000-patch-0007-cancel/)

## [0.3.1] - 2026-10-16

### Fixed

- Cancelar una reserva que no existe avisa «no hay reserva <día> <franja>» en vez de responder «cancelada». [patch 0008](specs/20261010-090000-patch-0008-cancel-missing/patch.md)

## [0.3.0] - 2026-09-01

### Added

- Cancelar una reserva propia.
