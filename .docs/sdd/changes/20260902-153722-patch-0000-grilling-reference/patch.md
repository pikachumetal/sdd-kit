---
id: 20260902-153722-patch-0000-grilling-reference
task: 0000
title: Patch — referencia rota a la skill grilling en sdd-consult
type: patch
status: done
created: 2026-09-02
branch: master
commit: 4aecf8c
---

# Patch 0000 — referencia rota a la skill `grilling`

## 1. Síntoma

`skills/sdd-consult/SKILL.md:19` enrutaba el modo "pensar / estructurar / tensar una dirección" a `superpowers:grilling`. Ese nombre no resuelve: la invocación falla y la rama de estructurar de la skill queda muerta.

Detectado durante una consulta del propio kit (carril `sdd-consult`) el 2026-09-02, al revisar el ítem 4 del roadmap.

## 2. Causa raíz

`grilling` **no es una skill de superpowers**. Es una skill personal instalada por usuario.

Evidencia recogida en la investigación (`superpowers:systematic-debugging`, fase 1):

- El plugin `superpowers` 6.3.0 distribuye 14 skills: `brainstorming`, `dispatching-parallel-agents`, `executing-plans`, `finishing-a-development-branch`, `receiving-code-review`, `requesting-code-review`, `subagent-driven-development`, `systematic-debugging`, `test-driven-development`, `using-git-worktrees`, `using-superpowers`, `verification-before-completion`, `writing-plans`, `writing-skills`. `grilling` no está entre ellas.
- La skill vive en `~/.claude/skills/grilling`, con `name: grilling` en su frontmatter, y por tanto se invoca **sin prefijo**.
- El string entró en `ea4f0ba`, el commit que creó la propia skill `sdd-consult`. Nunca llegó a funcionar.
- El kit ya se contradecía a sí mismo: `skills/sdd-init-greenfield:12` la nombra sin prefijo, que es la forma correcta.

**Por qué el ciclo del Art. I no lo cazó:** el GREEN de la skill sí ejercitó la rama. `tests/sdd-consult-green.md:25` (escenario S2) la da por ✅ porque el agente **eligió** `grilling` en lugar de `brainstorming` — la aserción era sobre la decisión de enrutado, y se apoyó en el autoinforme del subagente ("invocó `superpowers:grilling`"). Nadie comprobó que el nombre resolviera. Lección de método: cuando una skill del kit nombra otra skill, la evidencia de test debe verificar que el identificador existe, no solo que el agente lo escogió.

## 3. Fix

- **Fichero**: `skills/sdd-consult/SKILL.md` (línea 19).
- **Cambio**: `superpowers:grilling` → `grilling`. Corrección de un literal; no se añade ni se modifica guidance de conducta.

**Fuera de alcance, detectado y no tocado aquí** (fix mínimo, sin refactor oportunista): `grilling` es una skill personal, así que un proyecto consumidor del kit puede no tenerla instalada y la rama quedaría muerta también para él. El kit tampoco declara `dependencies` en `.claude-plugin/plugin.json`. Ambas cosas pertenecen al ítem 4 del roadmap y son cambio de guidance → task con ciclo RED/GREEN, no patch.

## 4. Verificación

Todo verificado por el agente sobre el working tree; nada reportado por el usuario.

| # | Caso | Resultado |
| --- | --- | --- |
| 1 | Antes del fix: contrastar cada `superpowers:<x>` del kit contra las skills de superpowers 6.3.0 | ✅ RED — 7 referencias distintas, 1 rota: `superpowers:grilling` |
| 2 | Después del fix: mismo contraste | ✅ GREEN — 6 referencias, todas resuelven |
| 3 | `grilling` existe como skill invocable sin prefijo | ✅ `~/.claude/skills/grilling/SKILL.md` con `name: grilling` |
| 4 | No quedan otras referencias prefijadas a `grilling` en el kit | ✅ las 4 menciones restantes (`sdd-consult:18,30,39`, `sdd-init-greenfield:12`) ya iban sin prefijo |

Comando de verificación (reutilizable):

```bash
SP="$HOME/.claude/plugins/cache/claude-plugins-official/superpowers/<version>/skills"
grep -rhoE 'superpowers:[a-z-]+' skills/ | sort -u | while read -r ref; do
  s="${ref#superpowers:}"
  [ -d "$SP/$s" ] && echo "OK    $ref" || echo "ROTA  $ref"
done
```

## 5. Tiempo (ligero)

- Estimación: no la hubo (entró por consulta, no por planificación).
- Real: ~0,3 h, investigación de causa raíz incluida.

## 6. Nota constitucional

El fix edita una skill, y el Art. I exige ciclo RED→GREEN para toda edición de skill, "pequeños ajustes" incluidos. Aquí el protocolo del Art. I —baseline sin la skill, con racionalizaciones textuales— es inconstruible: no hay conducta de agente que medir, hay una cadena de texto incorrecta. Se sustituye por **verificación determinista** del identificador contra las skills disponibles (casos 1 y 2 de §4), que falla antes del fix y pasa después. Interpretación aplicada: el Art. I gobierna la guidance que moldea conducta; una corrección de literal se verifica de forma determinista. Decisión tomada con el usuario el 2026-09-02.
