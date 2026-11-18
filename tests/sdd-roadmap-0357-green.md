# GREEN — `sdd-roadmap`, feature 0357: lo que propone el agente va a «Abierto:»

Kit: `dist/` construido con la plantilla nueva (`launch-prompt-template.md` con la regla, `Abierto:` y el origen de cada decisión). Sonnet. Salidas en `.docs/sdd/changes/20261118-215209-feature-0357-launch-prompt-open-items/green/out/`.

| Escenario | Puerta | Fila | Resultado |
| --- | --- | --- | --- |
| `m8` | 2/2 | M8 | 2 de 2 |
| `m1` (control) | 2/2 | M1 | 2 de 2 |
| `m4` (control) | 2/2 | M4 | 2 de 2 |

## M8

- `m8-1`: «Abierto:» con «- Por dónde se manda el aviso. Propuesta: por correo, reutilizando src/correo.js de la 0008 …», y dos puntos más que el sujeto vio (quién es el responsable de cada planta, cómo se dispara el lunes). «Decisiones ya tomadas:» lleva las 8:00 con su origen: «(.docs/sdd/changes/20261001-090000-proposal-0010-reports/proposal.md, §Enmiendas, 2026-10-03)».
- `m8-2`: «Abierto:» con «- Cómo se manda el aviso. Propuesta: por correo, …»; «Alcance:» dice «El envío del aviso por el canal que se elija en «Abierto»»; las 8:00 con su origen en la propuesta 0010.

Los dos nombran «avisos por correo» de la 0008 en «Fuera de alcance:» y `src/correo.js` en las lecturas: no es el canal de la 0013. La fila M8 se precisó para excluirlo (ruling de la Task 2).

## Controles

`m1` y `m4`: cada línea de «Decisiones ya tomadas:» acaba con su origen (la propuesta 0010 o la fila 0013); la forma de M1 y M4, igual. Pero `m1-1` abre el prompt con «recibirán por correo», un canal que ni la propuesta 0010 ni la fila 0013 deciden, y no lleva `Abierto:`: sin que el usuario diga que lo duda, la suposición sale como decidida (revisión final, eje Spec). M1 no lo mide; va al ticket.

Tras la pasada de arreglos de la revisión final (`fix/out/`): `m8` 1/1, con el canal en `Abierto:` y las 8:00 con su origen.

Coste de la tanda `green` de esta batería: 6 sujetos, 0,82 $.
