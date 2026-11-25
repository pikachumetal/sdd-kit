---
kit_version: 3.0.4
lane: patch
id: 20261125-181546-patch-0369-session-tokens-from-start
task: 0369
mode:
date: 2026-11-25
---

# Ticket para el kit — patch 0369: `sdd session tokens` cuenta desde el `Inicio:` de `patch.md`

- Contexto: patch de petición cerrada, perfil delegate, Opus 5.5 en el hilo y un revisor Sonnet 5.5 (fuente: `.docs/sdd/sdd-kit.json:2` → `"version": "3.0.4"`)
- Coste: 0,21 h frente a 0,57 h estimadas (`patch.md` §5, medido ya con el `Inicio:` que añade este patch); 1,97 $ de sesión (`sdd session tokens`)
- Nada que reportar. Por iniciativa propia: el guion del cierre corrió el verbo sobre esta misma sesión, con `Inicio:` y sin él (0,20 h desde 17:50Z frente a 0,23 h desde 17:48Z), como smoke de campo

## Menores

- `sdd merge --push` paró una vez con `destino sacado: el checkout de 'develop' … tiene cambios sin commitear`: la sesión de coordinación tenía staged el ticket de otro patch. Se esperó a que quedara limpio (menos de 2 min) y se relanzó.
- `window.slow.test.ts` «con dos worktrees que aportan» dio timeout de 5 s al correr `test/session/` entero con la máquina cargada. Solo pasó (1/1), y el gate quedó en verde.
- Lo que la fila dejaba abierto (sin `Inicio:`, ¿contar desde el primer commit de la rama?) se decidió por delegación: como hasta ahora. El fallback era un segundo comportamiento con su test y sacaba el cambio del carril patch. Queda en `patch.md` §3.
