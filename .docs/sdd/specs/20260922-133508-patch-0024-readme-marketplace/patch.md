---
id: 20260922-133508-patch-0024-readme-marketplace
task: 0024
title: Patch — el README ya no lleva al choque de marketplace local contra GitHub
type: patch
status: done
created: 2026-09-22
branch: feature/patch-readme
commit: <hash>
---

# Patch 0024 — el README ya no lleva al choque de marketplace local contra GitHub

## 1. Síntoma

Del dev-lead: «pasar del marketplace local al de GitHub falla, y el propio README lo provoca al recomendar apuntar el marketplace al clon local sin decir cómo volver». Detalle en la fila de deuda «Pasar de marketplace local a GitHub choca, y el README lo provoca» del roadmap:

```
Cannot add marketplace "sdd-kit": its network source differs from the one declared for it in settings
```

## 2. Causa raíz

Claude Code rechaza un marketplace con el mismo nombre y otra fuente de la ya declarada en `extraKnownMarketplaces`. El `~/.claude/settings.json` del dev-lead la declaraba con `source: directory` hacia su clon, que es justo lo que pedía el README (`README.md:56` antes del fix): «Para desarrollar el propio kit, apunta el marketplace a tu clon local en vez del repo». Ni esa frase ni la sección de instalación decían cómo volver a GitHub.

Segundo hueco en la misma sección: solo documentaba la instalación por usuario (`/plugin marketplace add`). Un proyecto que commitea solo `enabledPlugins` —como el `.claude/settings.json` de este repo— deja al compañero que lo clona con el plugin activado y sin fuente de la que sacarlo.

Base comprobada: la rama sale de `develop` en `cc87b3c`. El único cambio del README desde la fila de deuda (`ed7130f`, de 13 a 20 plantillas) no toca la instalación, así que el alcance de la fila sigue en pie. La receta alternativa ya estaba escrita en `CLAUDE.md` (regla 2) y en `tech-stack.md`: `--plugin-dir` con el plugin instalado deshabilitado.

## 3. Fix

- **Fichero(s)**: `README.md`
- **Cambio**: en «Instalación», bloque de `.claude/settings.json` por proyecto con `extraKnownMarketplaces.sdd-kit` (`source: github`, `repo: pikachumetal/sdd-kit`) y `enabledPlugins`, más la nota de migración con el error literal y la regla de fuentes idénticas, `ref` incluido. La frase del clon local sale de «Instalación»; en «Desarrollo» entra la receta `claude --settings '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' --plugin-dir .`.

## 4. Verificación

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Sin referencias vivas a apuntar el marketplace al clon local en el README | ✅ agente: `Select-String 'clon'` solo encuentra la nota de migración y la advertencia de «Desarrollo» |
| 2 | El JSON del bloque es válido | ✅ agente: `ConvertFrom-Json` lo parsea |
| 3 | Suite completa `Invoke-Pester -Path tests` | ✅ agente: 291 pasan, 0 fallan, 6 skipped |
| 4 | Instalar desde un proyecto limpio con esas dos claves | no verificado: pide un clon en otra máquina o usuario sin el kit |

## 5. Tiempo (ligero)

- Estimación: 0,25h
- Real: 0,3h
