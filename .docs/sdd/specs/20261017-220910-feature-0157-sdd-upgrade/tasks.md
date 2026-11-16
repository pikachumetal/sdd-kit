---
id: 20261017-220910-feature-0157-sdd-upgrade
title: Tasks — sdd-upgrade, el hook ofrece la migración y lo determinista va a la CLI
spec: ./spec.md
plan: ./plan.md
created: 2026-10-18
---

# Tasks — sdd-upgrade (registro vivo)

- **Spec**: `./spec.md`
- **Plan**: `./plan.md`
- **Rama**: `feature/0157-sdd-upgrade`

## Estado de las tasks

| # | Task | Status | Commit | Notas |
| --- | --- | --- | --- | --- |
| 1 | `sdd upgrade` y los menores de `sdd init` | done | 2209991 | |
| 2 | El hook ofrece la migración | done | 15ffeff | |
| 3 | La skill `sdd-upgrade` | done | 2aeab4d | campaña RED 5 sujetos, GREEN 11 |

## Verificación por task

- [x] Task 1 — `moon run cli:typecheck cli:test`: verde (1008 tests en el pre-commit)
- [x] Task 2 — `moon run cli:typecheck cli:test`: verde (1008)
- [x] Task 3 — `moon run kit:test`: verde (1301); baterías `sdd-upgrade` (o1, o2, m1, m2), `using-sdd` (i1, i2, u1) y `sdd-init` (n2): 11/11

## Revisión

Revisión final: Spec opus+high, with fixes · Código sonnet+high, with fixes · Arquitectura opus+high, with fixes, sobre 2aeab4d
Re-revisión: 2aeab4d..juntada en el cierre, sdd-kit:effort-high + opus, limpia (5 de 5 ADDRESSED o con ruling que se sostiene; 1 Minor nuevo, adjudicado)
Pasada de fix: juntada en el cierre, 4 hallazgos (2 con sujeto: h2 RED 0/2, que no reproduce, y h1 1/1; 2 de lectura, sin RED)

## Fixes adicionales

| Descubierto | Causa raíz | Decisión | Commit |
| --- | --- | --- | --- |

## Rulings

Task 1: Ruling: el test del `settings.json` con raíz no objeto es de caracterización (pasa sin código nuevo) — la spec lo pide solo como test unitario de un menor — coste si mal: ninguno
Task 1: Ruling: recuperación tras caída (corte de luz) — la línea base se cortó en kit:test sin rojos; se relanza; la Task 1 no había empezado (HEAD en la apertura 0602e1c2) — coste si mal: ninguno
Task 1: Ruling: línea base — el relanzamiento dio 5 rojos de cli:test, todos «Test timed out in 5000ms» con vitest corriendo a la vez en la misma máquina; el pre-commit de la apertura (0602e1c2) dio kit:test-fast y cli:test 977/977; no repito los 25 min: el gate de cierre completo corre al final — coste si mal: un rojo real de la base se vería en el cierre y no aquí
Task 2: Ruling: los RED y el código del hook se escribieron mientras esperaba la línea base, antes del commit de la Task 1, y quedaron fuera de él (commit con rutas explícitas) — el RED se vio fallar (5/13) antes del código, con su copia fuera del repo — coste si mal: ninguno
Task 3: Ruling: el test «lists the real kit migrations» se escribió con la carpeta ya movida y pasó a la primera — fija el traslado, no una conducta nueva — coste si mal: ninguno
Task 3: Ruling: GREEN limpio a la primera (11/11): la reserva de REFACTOR (4 sujetos) no se usa; campaña 16 sujetos, 2,60 $ — coste si mal: ninguno
Task 3: Ruling: architecture.md pasaba su tope por 2 palabras con la línea de sdd-upgrade: se recorta «del kit» de esa línea en vez de subir el tope — coste si mal: ninguno
Final: Ruling: (Arquitectura I2, y Spec «declinado») la orden del hook solo mira `control.profile: unattended` en `sdd-kit.json`, no en `sdd-kit.local.json` ni en la release — no se arregla aquí: el literal lo fija la spec aprobada y cambiarlo es un desvío; el caso (unattended solo en local o en la release) es raro y su efecto es una pregunta de más al arrancar; va a deuda con destino 0152 — coste si mal: una sesión desatendida con unattended local se para en la oferta
Final: Ruling: (Spec M2) el `git grep` de la decisión 13 saca `tests/batteries/sdd-upgrade/subject.sh`, cuyo retroceso a la carpeta vieja es para correr la batería con el kit de la base (RED); se deja y la comprobación lo excluye — coste si mal: ninguno
Final: Ruling: (Spec M3) `m2` usa el proyecto en 2.3.4 y `v2.3.5.md`, no 9.9.8 y `v9.9.9.md` como el GIVEN de la spec: con 9.9.8 el hook daría también el aviso de kit viejo (plugin 2.3.4) y mezclaría dos avisos; mide lo mismo — coste si mal: ninguno
Final: minor (deferred): (Código M1) `sin sdd-kit.json: se aplican todas` también sale con un marcador sin `version`; la skill no lo aclara
Final: minor (deferred): (Código M2, Arquitectura M6) lectura y escritura del marcador duplicadas entre `init` y `upgrade` (parseJson/readMarker, orden de claves, constante MARKER)
Final: minor (deferred): (Código M3) `--mark` escribe `updated` antes del resto de claves; `sdd init` lo deja al final
Final: minor (deferred): (Código M4) retrocesos del RED en `tests/batteries/sdd-upgrade/subject.sh`
Final: minor (deferred): (Código M5) BOM escrito como `\uFEFF` en los tests: comprobado, ya va escapado; sin cambio
Final: minor (deferred): (Código M6) faltan tests de `--mark` sin marcador previo y con raíz no objeto
Final: minor (deferred): (Código M7) `kitVersions` parte y une la versión dos veces
Final: minor (deferred): (Arquitectura M4, Spec M1) el paso «Marcador» de cada `vX.Y.Z.md` pide escribir `version` a mano y el paso 6 de la skill corre la Verificación antes de `--mark`
Final: minor (deferred): (Arquitectura M5) `sdd upgrade` con una raíz sin `.docs/sdd/` lista todas y `--mark` falla con ENOENT
Final: minor (deferred): (Arquitectura M7) la skill nueva no justifica por escrito la excepción a la Anatomía §6 de architecture.md
Final: minor (deferred): (Arquitectura M8) el hook lee `version` con una regex y la CLI con JSON.parse
Final: minor (deferred): (Spec M4) el test de `--root` inexistente solo comprueba el código 2
Final: minor (deferred): (Spec M5) el hook ofrece migrar durante una init sobre template (`version` e `init` a la vez)
Final: Ruling: (Spec I1, Arquitectura I1) bucle sdd-upgrade ↔ sdd-init con un sdd-kit.json sin version — RED h2 0/2: los dos sujetos hacen la pregunta del predicado 4 una vez y no tocan nada; por el Art. I los predicados de sdd-init no se reescriben y h2 queda de control — coste si mal: un agente con menos contexto podría dar vueltas entre las dos skills
Final: Ruling: (re-revisión, Minor) `latestMigration` usa `.at(-1)`, que pide Node 16.6: con Node 14.8-16.5 el hook se tragaría el TypeError y no inyectaría `using-sdd` — se deja: Node < 16.6 está sin soporte desde 2023 y el kit pide 22.18; arreglarlo tras la re-revisión dejaría un commit de código sin revisar — coste si mal: en un Node de 2021 la sesión arranca sin el router del kit
Final: minor (deferred): (re-revisión) `migrationVersions` devuelve [] sin carpeta de migraciones, y `sdd upgrade` diría «al día» en vez de fallar (el plugin siempre la trae)
Final: minor (deferred): (re-revisión) la tabla «Procedencia de las reglas» de la batería de sdd-upgrade no tiene fila para h1 y h2
Final: Ruling: gate de cierre con 3 timeouts de 120 s en publish.slow, lock-and-base.slow y hotfix.slow (cli:test-min) que la rama no toca y que pasan solos (24/24 y 14/14); cli:test-slow 188/188 — no frena el cierre: fila de deuda de la 0156 — coste si mal: un rojo real en merge o publish se colaría
