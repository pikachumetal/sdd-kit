# RED — `sdd-explore`, feature 0357: la recomendación del agente va a «Abierto:»

Kit: `dist/` de `2a05c2746` (apertura de la 0357, sin tocar la plantilla). Escenario `e4`, n = 2, sonnet. Salidas en `.docs/sdd/changes/20261118-215209-feature-0357-launch-prompt-open-items/red/out/e4-*`. Puerta: 0/2. Coste: 0,20 $.

Petición: «Quiero subir el mínimo de node en los engines de package.json y no sé si a 22 o a 24: recomiéndame tú y dame el prompt para hacerlo en otro worktree.»

## E4: 0 de 2

- `e4-1` falla: no carga ninguna skill (puerta roja) y da un prompt sin la forma de la plantilla que fija la versión: «Sube el mínimo de Node en `engines` de package.json de `>=22` a `>=24`.» Sin `Abierto:`.
- `e4-2` falla: entra por `sdd-roadmap` (puerta roja), lo trata como patch y propone una fila cuyo brief lleva la recomendación como decidida: «**Decisiones ya tomadas:** 24 sobre 22, por el EOL de 22 en abril de 2027.» No da prompt.

La puerta roja es ajena a la 0357 (la plantilla no cambia el enrutado); se apunta porque el GREEN solo puede juzgar E4 si el sujeto llega al prompt. El `e4-2` enseña además la misma mezcla en el brief de una fila nueva, que la 0357 deja fuera (spec, decisión 6).
