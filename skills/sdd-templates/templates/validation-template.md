# Mensaje de validación — plantilla

> Lo presentan `sdd-start-feature` (paso 7) y `sdd-archive` (paso 1). No se guarda: va en el chat, en el idioma del usuario. Las secciones van en este orden y las que no tengan contenido se omiten, salvo el 🦆 y el ✋.
>
> **Quién valida** lo dice la línea `Validación:` de la spec o de `patch.md`; sin la línea, `dev-lead`. Con `Validación: agente` o con `validation.mode: field` el mensaje acaba en «Sin probar»: no hay guion. Con `agente`, además, no esperas respuesta y registras `Validación por el agente: <fecha> · <evidencia>`.
>
> **El guion va el último** porque es lo que queda a la vista en el terminal. **La validación se pide en texto, nunca con `AskUserQuestion`**, aunque la norma sea preguntar con esa herramienta: tapa el guion, y la persona lo necesita delante para probar. «Es la herramienta de las preguntas» no vale aquí.
>
> **Bloques**: sin lenguaje, que el terminal los pinta de azul. Uno por terminal: un servidor se queda bloqueando y, pegados seguidos, el siguiente comando no corre. Cada comando en su línea y sin puntuación al final, para copiarlo sin tocarlo.
>
> Cómo se compone y se ensaya el guion, el entorno y el panel: `dev-validation.md` de `sdd-archive`. Borra los bloques de ayuda (`>`) al redactar.

🦆 <qué cambia para quien usa el producto, con un ejemplo con datos>

**✋ Me salí del plan en…**

- <ruling, o «nada»>

**Smoke que he corrido**

| THEN | Evidencia | Resultado |
| --- | --- | --- |
| <THEN> | <`suite` · `ejecución real` · `no probado`> | <literal observado> |

**Suites**

- `<comando>`: <N>/<N> sobre <sha>, <duración> | saltada: <por qué>

**Sin probar**

- <lo que no pudiste probar y por qué, o «nada»>

> Solo si alguna task tiene «Verificación visual»: su criterio, la salida del detector por viewport y la ruta de cada captura. Solo con guion: la línea `Panel:` de `dev-validation.md`.

**Guion**

Rama `<rama>` · worktree `<ruta>`

Terminal 1, el entorno:

```
cd <ruta>
<comando de arranque>
```

> Con `validation.startEnvironment: true`: «El entorno ya está arrancado en <puerto>», sin bloque. Sin comando declarado, dilo. Sin entorno que arrancar, omite este bloque.

Terminal 2:

```
cd <ruta>
```

1. <acción con sus datos> → <resultado esperado, con el literal que sale>
2. <…> → <…>

> Los pasos literales del reporte van primero. Un comando de un paso va en su propio bloque.

Para parar el entorno:

```
<comando de parada>
```

Si no puedes ahora: `Diferir: lo pruebo en <uso más próximo, concreto>, a cargo de <quien valida>`

Dime "validado" o qué paso falla.
