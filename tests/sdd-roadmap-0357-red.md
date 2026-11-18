# RED — `sdd-roadmap`, feature 0357: lo que propone el agente va a «Abierto:»

Kit: `dist/` de `2a05c2746` (apertura de la 0357, sin tocar la plantilla). Escenario `m8`, n = 2, sonnet. Salidas en `.docs/sdd/changes/20261118-215209-feature-0357-launch-prompt-open-items/red/out/m8-*`. Puerta: 2/2 (`sdd-kit:sdd-roadmap`). Coste: 0,29 $.

Petición: «Dame el prompt de la 0013. Cómo se manda el aviso (correo, Slack…) no lo tengo claro: propón tú.»

## M8: 0 de 2

- `m8-1` falla: el canal que propone va en «Decisiones ya tomadas:» y se atribuye al dev-lead: «- El aviso se manda por correo, porque el proyecto ya envía correos (src/correo.js, fila 0008) y los responsables no comparten un canal común. Esta decisión es una propuesta del dev-lead que no estaba en el brief; confírmala al diseñar.» Sin `Abierto:`; ninguna línea de decisión lleva su origen entre paréntesis; el título y «Alcance:» nombran el correo.
- `m8-2` falla: «- el canal es el correo, porque la 0008 ya lo introduce y no hace falta otra integración; …» en «Decisiones ya tomadas:»; sin `Abierto:`; sin origen entre paréntesis.

Lo seguro sí se conserva en los dos: «el aviso sale los lunes a las 8:00, porque el cliente cambió las 9:00 originales el 2026-10-03 (§Enmiendas …)».
