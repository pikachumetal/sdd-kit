---
id: 20261102-145840-feature-0287-heredoc-guard
feature: 0287
title: Un hook del repo para el código escrito con heredoc, y node --check en battery.mjs run
mode: lite
profile: delegate
status: approved
created: 2026-11-02
author: Àngel Delgado
approvers:
  - name: Àngel Delgado
    approved_at: 2026-11-02
---

# Spec — Un hook del repo para el código escrito con heredoc, y node --check en battery.mjs run

🦆 Cuando un agente de este repo intente escribir código desde Git Bash con un heredoc, por ejemplo `cat > x.mjs <<'EOF'`, el comando no se ejecuta y el agente recibe el aviso de usar `Write`. Un mensaje de commit con `git commit -F -` o un `notas.md` siguen pasando, y en la duda el comando pasa. Y si un `subject.mjs` no compila, `battery.mjs run` para antes del primer sujeto y enseña la línea del error, sin gastar nada. Solo cambia el trabajo en este repo: los proyectos no reciben nada.

Validación: agente — `validation.mode: field` en `sdd-kit.json`: tests, un humo en sesión headless y el uso real.

## Capacidades

- Ninguna, porque herramientas: el hook es solo de este repo y ninguna capacidad nombra `battery.mjs`.

## ✋ Decisiones que he tomado yo — valida estas

1. **El hook también para un intérprete en heredoc que escribe código** (`node <<'EOF'`, `python`, `python3` o `py`, con `writeFileSync('cli/src/verbs.ts', …)` en el cuerpo). El encargo dice «el Bash que escribe un `.mjs`… con heredoc», y es el caso más caro de los tickets: el `/^d+.d+.d+$/` en `verbs.ts` de la 0277 §1, con 16 tests en rojo. Solo con `cat > x.mjs` el hook no lo habría visto.
2. **Solo cuenta una ruta literal**, en la llamada que escribe o en una variable asignada a ese literal. Una ruta calculada (`join(dir, name)`) pasa, por «ante la duda, deja pasar». Leer un `a.ts` y escribir un `b.md` pasa.
3. **El hook analiza el comando con un lexer de shell mínimo**, no con una regex sobre el texto. Sin él, un mensaje de commit que cuenta `cat > x.mjs <<'EOF'`, como los de esta feature, pararía la sesión. El cuerpo de un heredoc y el texto entre comillas no se leen como órdenes. Con comillas sin cerrar, el comando pasa.
4. **El delimitador con comillas también se para.** Medido hoy con la herramienta Bash en esta máquina: `cat > a <<'EOF'` dejó `\\` en `\`, igual que sin comillas. Comillas o no, el resultado es el mismo y la regla es una.
5. **`node -e` y `python -c` no se paran**: no son heredocs y el encargo los deja fuera, pero los casos de la 0182 y la 0220 fueron así. Es el hueco que queda; si vuelve a costar, es otro ticket.
6. **Literal del hook**: `Este Bash escribe <fichero> con un heredoc: en Git Bash pierde barras invertidas y rompe escapes. Escríbelo con la herramienta Write (para un cambio, Edit).` Se devuelve como `permissionDecision: deny`, la forma de `tests/headless/deny-kill.mjs`.
7. **El nombre es `.claude/hooks/heredoc-guard.mjs`**, con matcher `Bash` en `.claude/settings.json`. Una entrada ilegible o un error interno dejan pasar.
8. **Literal de la batería**: `subject.mjs no compila:`, seguido de la salida de `node --check` hasta la línea `SyntaxError`, que trae `<ruta>:<línea>`. Es un `BatteryError` con código 1, antes del cerrojo y de cualquier lanzamiento.
9. **Medida contra falsos positivos, no pedida**: paso el hook por los comandos Bash de los transcripts locales de este repo, y miro a mano cada parada. La evidencia en el walkthrough lleva recuentos y ningún comando copiado.
10. **Lo que adelgaza** (Art. I, una pieza entra, otra sale): la regla de `tech-stack.md`:44 se acorta apuntando al hook. La regla sigue para lo que el hook no ve, como `node -e`.
- Política de modelos: sin revisores de spec (lite) · ejes de la revisión final según `sdd-verify`: Spec opus+high, Código sonnet+high · sin otros despachos en paralelo.

Carril lite, pedido en el encargo y comprobado:

- El flujo existe y se lee: `.claude/settings.json`, `.claude/hooks/` y `battery.mjs`.
- No cambia contratos públicos: nada se distribuye y `runBattery` solo gana una dependencia interna.
- No cambia ningún schema de datos.
- Cabe en un área: las herramientas del repo.
- La estimación es ≤ media jornada.

### Decisiones tomadas con el dev-lead

- Carril y perfil — «Arranca la 0287 con sdd-propose, carril lite»; «Perfil delegate».
- Hook en Node, multiplataforma; ante la duda deja pasar; sin texto nuevo en skills — literales del encargo, «Decisiones ya tomadas».
- La extensión `.ts` entra, aunque la fila del roadmap solo nombra `.mjs`, `.js` y `.py` — encargo, «Alcance».

## Intent

Un script escrito con heredoc de Git Bash pierde barras invertidas o convierte `\n` en saltos reales. La regla de `tech-stack.md` existe y no se aplica: ha salido en 0206, 0182, 0163, 0276, 0277 y 0288, con unos 15 min cada vez, 16 tests en rojo y sujetos que no corrieron. El éxito: esos comandos no llegan a ejecutarse y un `subject.mjs` roto no gasta ningún sujeto. Fracasaría, aunque funcione, si el hook para comandos legítimos: pararía a todas las sesiones.

## Scope

- Entra: `.claude/hooks/heredoc-guard.mjs` y su entrada en `.claude/settings.json`; `node --check` del `subject.mjs` en `battery.mjs run`; sus tests; acortar la regla de `tech-stack.md`:44; citar el hook en `architecture.md`.
- No entra: distribuirlo a los proyectos; heredocs de otros usos (mensaje de commit, Markdown); `node -e`, `python -c` y los here-strings de PowerShell; reescribir la regla más allá de acortarla; texto nuevo en skills.

## Lo que se retira o cambia de forma

| Qué | Dónde aparece | Destino |
| --- | --- | --- |
| La regla «Un script de Python en un heredoc…» se acorta y apunta al hook | `.docs/sdd/tech-stack.md:44`; la citan por su título tickets ya cerrados, que no se editan | Scope; `skills/` no la nombra: comprobado con `grep -rn heredoc skills` |

- Filas que implementa: 0287 y la deuda «Un heredoc de Git Bash rompe un script, con la regla ya escrita» → `roadmap.md`:72 y :679, que marca el cierre; las listas «tras …» de las filas 0198 y 0152 (:135 y :136) solo citan el id y se quedan.

## Approach

**Se para** (Bash, y el fichero acaba en `.mjs`, `.js`, `.ts` o `.py`):

- `cat > x.mjs <<'EOF'`, `cat >> x.py <<EOF`, `cat <<EOF > x.ts`
- `tee x.js <<EOF`, `cat <<EOF | tee x.mjs`
- `node <<'EOF'` o `python`, `python3`, `py`, también con `cat <<EOF | node`, cuando el cuerpo escribe en una ruta literal con esas extensiones

**Pasa**:

- `git commit -F - <<'EOF'`, aunque su cuerpo cuente `cat > x.mjs <<'EOF'`
- `git commit -m "… cat > x.mjs <<EOF …"`
- `cat > notas.md <<'EOF'`
- `node <<'EOF'` que lee `a.ts` y escribe `b.md`, o que no escribe
- `node x.mjs`, `node -e "…"`, y un comando con comillas sin cerrar
- una entrada ilegible en stdin

**Batería**: `runBattery` llama a una dependencia nueva, `deps.syntaxError(subjectSh)`, antes de lanzar nada. Con error, lanza el `BatteryError` de la decisión 8 y no hay ningún `launch`.

## Dónde se prueba

- Qué para y qué deja pasar el hook: la función pura exportada, en `cli/test/kit/heredoc-guard.test.ts` (conjunto rápido), con cada caso del Approach.
- El hook de punta a punta y su registro en `settings.json`: `cli/test/kit/heredoc-guard.slow.test.ts`, como `deny-kill.slow.test.ts`: stdin JSON, salida con `"deny"` y `Write`.
- La batería sin lanzar sujetos: `runBattery` con dependencias falsas, en `cli/test/kit/headless/battery.test.ts`.
- `node --check` real con un fichero roto y su línea: `cli/test/kit/headless/run.test.ts`, que solo corre en `kit:test-headless`.
- Humo: una sesión headless Haiku (~0,03 $) en el worktree, con un Bash `cat > x.mjs <<'EOF'` denegado, y el barrido de la decisión 9.

## Términos y ADR

- Términos resueltos: ninguno
- ADR candidatas: ninguna

### Estimación y esfuerzo

- Tipo: infra/tooling
- Esfuerzo spec: 0,25 h
- Estimación de implementación: 1,5 h
- Base de la estimación: un hook con su lexer, una dependencia en `runBattery` y dos ficheros de test; la incertidumbre es lo que salga del barrido de transcripts.
- Confianza: media

## Topes de palabras

| Fichero | Medido / tope | Margen | Tope propuesto |
| --- | --- | --- | --- |
| `.docs/sdd/tech-stack.md` | 21.951 / 24.579 | 2.628 | sin cambio: la edición lo acorta |
| `.docs/sdd/architecture.md` | 2.028 / 2.375 | 347 | sin cambio: unas 10 palabras más |

## Enmiendas

- Ninguna.

## Aprobaciones

| Nombre | Fecha | Estado |
| --- | --- | --- |
| Àngel Delgado | 2026-11-02 | aprobada (opción «Apruebo») |
