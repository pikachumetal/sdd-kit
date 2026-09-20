---
id: 20260920-192907-patch-0017-nombres-de-proyecto-en-skills
task: 0017
title: Patch — nombres de proyectos reales dentro de lo que el kit distribuye
type: patch
status: done
created: 2026-09-20
branch: develop
commit: <hash>
---

# Patch 0017 — nombres de proyectos reales dentro de lo que el kit distribuye

## 1. Síntoma

Al preparar la publicación del repo como público (2026-09-20), el barrido previo encontró **180 menciones** de nombres de proyectos y clientes del equipo en 41 ficheros. La mayoría está en documentación interna (`.docs/`, `tests/`), que el dev-lead decide publicar tal cual. Pero **dos estaban dentro de `skills/`**, es decir, dentro de lo que se instala en cualquier proyecto consumidor por plugin o por `npx skills add`:

```
skills/sdd-start-task/references/encargo-revision.md:37: La frase corta es la que funcionó en SifRest; …
skills/sdd-templates/templates/environments-template.md:59: > Alybo resuelve este mismo contrato en Node + Docker Compose (`.tools/scripts/env-*.mjs`, marcador `.aly-env.json`); …
```

## 2. Causa raíz

Las dos frases son **evidencia de campo escrita en su punto de uso**, que es lo que el kit hace bien: `encargo-revision.md` justifica por qué la cabecera del encargo usa la frase corta, y `environments-template.md` señala una implementación de referencia del contrato de entorno. El fallo no es citar la evidencia sino **nombrar el proyecto** al hacerlo.

Por qué nadie lo frenó: el kit tiene la regla en `tests/` y en las actas, no en el producto. `NamingConvention.Tests.ps1` recorre `skills/` por **lista blanca de rutas vivas** buscando nombres de fichero en castellano (Art. III), y no mira el **contenido**. El ticket de campo de la task 0009 (§16) ya había reportado el mismo patrón un nivel más arriba —una spec que usaba el nombre de un proyecto real como ejemplo y ningún revisor lo marcó— y el ticket del `statusline` pide para `sdd-feedback` que un ticket describa el comportamiento del kit y no el dominio del cliente. Es la misma regla, aún no escrita en ningún sitio que la haga observable.

Nota de alcance: el fix corrige el estado actual de los dos ficheros. **No reescribe el historial**, así que los nombres siguen en los commits anteriores; publicar con historial lo asume de forma explícita (ver la deuda abierta en el roadmap).

## 3. Fix

- **Fichero(s)**: `skills/sdd-start-task/references/encargo-revision.md`, `skills/sdd-templates/templates/environments-template.md`.
- **Cambio**: las dos frases conservan su evidencia y pierden el nombre propio. «funcionó en SifRest» → «funcionó en un proyecto real del equipo». La referencia de implementación pasa a describir el patrón —Node + Docker Compose, `env-*.mjs` con su marcador— sin nombrar el proyecto ni su marcador concreto.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | `grep -rn 'Alybo\|SifAcademy\|SifRest\|MDT\|LegalRep\|Medysif\|Quartz' skills/` → sin coincidencias | ✅ |
| 2 | Lo mismo sobre `README.md` y `.claude-plugin/` | ✅ ya estaban limpios |
| 3 | Pester completo tras el cambio | ✅ 149/149, 0 fallos |
| 4 | Las dos frases conservan su función (justificar la frase corta del encargo; señalar la referencia de nivel 3) | ✅ revisado en el diff |

## 5. Tiempo (ligero)

- Estimación: 0,25h
- Real: 0,2h
