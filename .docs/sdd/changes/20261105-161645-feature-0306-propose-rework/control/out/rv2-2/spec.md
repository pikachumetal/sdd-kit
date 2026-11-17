---
id: 20261008-160000-feature-0018-concierge-phone
feature: 0018
title: El teléfono de conserjería en la guía
mode: full
profile: delegate
status: draft
created: 2026-10-08
author: agente con el dev-lead
approvers:
  - name: Laura
    approved_at: null
---

# Spec — El teléfono de conserjería en la guía

## Capacidades

- Modificadas: `guide` — la guía dice a quién llamar si una sala está cerrada.

## ✋ Decisiones que he tomado yo — valida estas

1. La línea va al final de `docs/guia.md`, tras la lista de comandos.

## Intent

Quien encuentra una sala cerrada no sabe a quién llamar. La guía tiene que decirlo.

## Scope

- Entra: una línea en `docs/guia.md`: «Si una sala está cerrada, llama a conserjería: 5500.»
- No entra: los comandos, que no cambian.

## Dónde se prueba

- La línea: leída en `docs/guia.md`.

## Delta de comportamiento

### Capacidad: `guide`

#### ADDED — La guía dice a quién llamar con una sala cerrada

- GIVEN la guía de la herramienta
- WHEN alguien la lee
- THEN encuentra «Si una sala está cerrada, llama a conserjería: 5500.»

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Laura | | pendiente |
