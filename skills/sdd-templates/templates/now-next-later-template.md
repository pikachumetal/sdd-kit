# Roadmap — <proyecto>

> Índice vivo del trabajo del proyecto: qué se hace ya, qué viene y qué se guarda para luego. Lo escribe `sdd-roadmap` (filas nuevas, orden, descartes) y los cierres (`sdd-archive`) y el corte de `sdd-end-release` (estado de sus filas, la sección de release); lo leen esas mismas skills y `sdd roadmap check`. Borra los bloques de ayuda (`>`) al redactar.
>
> **La prioridad es el orden de las filas**: la de arriba va antes, en cada tabla y de Now a Later. No hay columna de prioridad.
>
> **Forma cerrada.** Tres secciones, `## Now`, `## Next` y `## Later`, en ese orden y solo con tablas; la única línea de texto es `Perfil de control: <perfil>`, entre `## Now` y su tabla. La cabecera de las tres tablas es literal: `| Id | Externo | Tarea | Estado | Tras | Tamaño |`. Una celda vacía se escribe `—` (Externo y Tras; en Later, también Tamaño y el brief). Los ids de «Tras» van separados por comas (`0012, 0013`).
>
> **Estado**: `⏳` pendiente · `🔄` en curso · `✅` hecha y validada · `🧪 validación diferida a <disparador>` · `⏸️ aparcada: <motivo>`. Later solo admite `⏳` y `⏸️`.
>
> **Tamaño**: `S`, `M` o `L`, obligatorio en Now y Next.
>
> **Tarea**: `**<título>**<br>*<one-liner>*<details><summary>Brief</summary>…</details>`. El brief es obligatorio en Now y Next y lleva cinco etiquetas, en este orden: `**Carril:**`, `**Requisitos:**`, `**Decisiones ya tomadas:**`, `**Salda:**` y `**Toca:**`. Un `|` dentro de una celda se escribe `\|`.
>
> **Id**: el de la feature o del patch (`<id>`); en Later, `B<n>` (`B1`, `B2`…), con numeración propia.

## Now

> Lo que se hace ya. Cuando hay una release en marcha, el título lleva su versión: `## Now — <versión> · en preparación` o `## Now — <versión> · comprometida`, con la versión que dice el usuario, nunca una supuesta.

Perfil de control: <perfil>

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| <id> | — | **<título>**<br>*<one-liner>*<details><summary>Brief</summary>**Carril:** <feature\|patch><br>**Requisitos:** <ruta del requisito><br>**Decisiones ya tomadas:** <decisiones><br>**Salda:** <fila de «Lista» de debt.md \| nada><br>**Toca:** <ficheros o módulos></details> | ⏳ | — | M |

## Next

> Lo que viene después de Now, ya con brief.

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| <id> | — | **<título>**<br>*<one-liner>*<details><summary>Brief</summary>**Carril:** <feature\|patch><br>**Requisitos:** <ruta del requisito><br>**Decisiones ya tomadas:** <decisiones><br>**Salda:** <fila de «Lista» de debt.md \| nada><br>**Toca:** <ficheros o módulos></details> | ⏳ | — | M |

## Later

> Ideas y producto sin decidir: sin brief ni tamaño.

| Id | Externo | Tarea | Estado | Tras | Tamaño |
| --- | --- | --- | --- | --- | --- |
| B1 | — | **<título>**<br>*<one-liner>* | ⏳ | — | — |