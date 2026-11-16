# Tasks — 0018 Comando de ayuda

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — Comando `ayuda` | hecha | e384fcb |

## Rulings

Revisión final: autorrevisión del hilo (sin herramienta de subagentes), Spec y Código sin hallazgos Critical ni Important, Arquitectura no (plan), sobre e384fcb
- Task 1: `ayuda` se despacha en `run` sin entrar en `handlers`/`commands`: si entrara, `test/readme.test.js` fallaría y arreglarlo exigiría tocar `README.md` (vetado por la spec). Coste si falla: la feature 0020 deberá añadir `ayuda` a `commands` al documentarla.
- Final: `ayuda` no se lista a sí misma (la THEN nombra solo los cuatro comandos). Coste si falla: quien espere verla en la lista no la verá.
- Final: Eje Arquitectura decidido «no» (el plan no lleva la línea; sin señales en el diff).
- Diferido (Minor): `descriptions` duplica las claves de `handlers`; un comando nuevo sin frase mostraría `undefined`.
