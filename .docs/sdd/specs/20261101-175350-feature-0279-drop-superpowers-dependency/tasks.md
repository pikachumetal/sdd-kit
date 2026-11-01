# Tasks — feature 0279

| Task | Estado | Commit |
| --- | --- | --- |
| 1. Manifests, init, README y lanzador sin superpowers | ✅ | cd2d3ab8 |
| 2. Textos de skills, baterías y documentos | ✅ | e494adf8 |
| 3. Migración, campaña y smoke | ✅ | daed8c8c |

Revisión final: Spec opus+high, with fixes · Código sonnet+high, with fixes · Arquitectura opus+high, with fixes, sobre daed8c8c
Pasada de fix: juntada en el cierre, 1 test nuevo y controles con sujetos
Re-revisión: juntada en el cierre, sdd-kit:effort-high + opus, 12 abordados, 5 Minor corregidos en el cierre y revisados en el hilo

## Rulings

Final: Ruling: saldo de sdd-upgrade sube por el paso 10 (eje Código, Important) — lo aprueban la decisión 14 y los topes de la spec, y skillWords excluye migrations; SKILL.md queda igual o baja — coste si está mal: recortar la migración.
Final: Ruling: guarda de dependencies retirada (eje Código, Minor) — decisión 3 aprobada de la spec; battery.mjs da rojo por Unknown skill — coste si está mal: gastar sujetos en un A/B con kit viejo.
Final: Ruling: molde salas3 además del v2x de la spec (eje Spec) — más barato para las ramas del paso; s4 cubre el v2x pedido — coste si está mal: ninguno, los dos existen.
Final: Ruling: líneas de JSON roto y sin fichero del Review Focus (eje Spec, Minor) — el paso 7 ya falla o crea el fichero, y el paso 10 no llega; quito las cláusulas muertas — coste si está mal: ninguno, el paso 7 no toca el fichero.
Final: Ruling: paso 7 de sdd-init sin sujeto que lo alcance (eje Spec, Minor) — solo quita texto y lo cubren settings, readme y paridad — coste si está mal: un sujeto en campo que siga una frase vieja, ya no existe.
Final: Ruling: Verificación de la Task 2 en el plan mal escrita (eje Spec, Minor) — los tres usos que quedan son opcionales y sirven a kits anteriores al fork — coste si está mal: ninguno.
Final: Ruling: r1 sigue ofreciendo aparte quitar superpowers tras la tabla de reglas — no escribe nada y más texto alargaría la skill; el defecto señalado no se reprodujo — coste si está mal: un proyecto que dijo no recibe un aviso más.
Final: Ruling: MCP de Playwright en tech-stack (eje Arquitectura, Minor) — marcado sin comprobar, sin gastar un sujeto — coste si está mal: una campaña con Playwright lo descubre al lanzar.
Final: Ruling: 20 skills en el smoke frente a 21 en skills/ (eje Spec, no verificado) — sdd-templates lleva user-invocable: false — coste si está mal: ninguno.
