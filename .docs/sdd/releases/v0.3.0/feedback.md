---
release: v0.3.0
title: Acta de release — v0.3.0
created: 2026-07-21
source: Trabajo interno del kit (sin demo/cliente); el feedback fue una idea del propio equipo
---

# Acta de release — v0.3.0 (2026-07-21)

Fuente: trabajo interno del kit. **Sin demo ni feedback de cliente** — esta release no tiene inventario de peticiones externas que triar. El origen fue una idea del equipo en sesión: dar carril propio a "preguntar/planificar sin arrancar el SDD clásico".

## 1. Inventario y triage

No aplica: sin sesión de feedback externo. El único ítem de la release es la skill `sdd-consult`, decidida y aprobada por el usuario en la propia sesión ([task](../../specs/20260721-114445-task-0000-consult-skill/)).

## 2. Cambios de requisito detectados

_Ninguno._

## 3. Retro

- **Agregado de la release**: 1 task con estimación — `consult-skill`, estimado 2,5h · real ~1,4h (ratio 0,56).
- **Comprobación de los action items de v0.2.0**:
  - **[A1] Estimar los ciclos de test orquestados en horas-pared con paralelización (factor observado 0,38)** — **aplicado**: el `plan.md` de `consult-skill` referenció ese factor. El real salió 0,56 (menos compresión: una segunda ronda de RED por el sesgo de telegrafiado que el plan no preveía). Dos datos (0,38 y 0,56) → la compresión de una task docs con ciclo orquestado vive en ~0,4–0,6; sigue siendo útil como rango, no como número fijo.
  - **[A2] Configurar el remoto del kit antes del próximo cierre de release** — **PENDIENTE**, segunda release consecutiva sin resolver. Escala a bloqueo real: sin remoto no hay `/plugin marketplace update` para el equipo, así que las mejoras de v0.2.0 y v0.3.0 no llegan a los consumidores aunque estén commiteadas. Requiere decisión del usuario (GitHub vs Azure DevOps + visibilidad).
- **Qué funcionó**: el RED honesto detectó y corrigió un sesgo de método (telegrafiado) en vivo — el ciclo del Art. I hizo su trabajo; la skill quedó ligera y dirigida al único fallo real.
- **Qué corregir**: el diseño de los prompts de baseline debía ser neutro desde el principio (aprendizaje ya volcado a `tech-stack.md`).
- **Action items nuevos**:
  - [A2-bis] **Configurar el remoto** (arrastrado de v0.2.0) — se verifica con `git remote -v` no vacío antes del próximo cierre. Si no se prioriza, decidir explícitamente posponerlo, no dejarlo flotar una tercera vez.
