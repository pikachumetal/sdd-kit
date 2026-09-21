# GREEN — skill `sdd-feedback` (task 0002)

**Sesión del 2026-09-21.** Mismos tres escenarios y mismas peticiones que el RED ([kit-feedback-red.md](kit-feedback-red.md)), dos sujetos por escenario. La única diferencia es la copia limpia del kit: esta lleva `sdd-feedback`, `kit-feedback-template.md` y la oferta en los dos cierres (commit `d5b30bd`). E3 usa el molde coherente (`molde-limpia-v2/`) y la rama del lanzador coincide con el id de su task.

Coste: seis sujetos, 0,57–1,09 $ cada uno, 5,58 $ en total; de 24 a 51 turnos.

## Veredicto por fallo del RED

| Fallo del RED | RED | GREEN | Evidencia |
| --- | --- | --- | --- |
| El cierre no ofrece el ticket | 0/2 lo ofrecen | **2/2 lo ofrecen** | Los dos informes finales de `sdd-end-task` cierran con la oferta, el motivo («mientras tengo la sesión en contexto») y un adelanto de lo que incluiría. Uno lo dice literal: «Si no, no queda nada pendiente». Ninguno la convierte en gate |
| Ubicación y nombre de fichero a ojo | 0/2 en sitio fijo | **4/4** | Los cuatro tickets de E2 y E3 están en `.docs/sdd/kit-feedback/<yyyyMMdd-HHmmss>-task-<id>-<slug>.md` |
| Filtra cliente, dominio y personas | 2/2 filtran | **0/2 filtran** | Cero apariciones del nombre del cliente, de la interlocutora o del vocabulario de negocio. El proyecto queda como «aplicación de negocio en .NET, brownfield» y la persona como «un interlocutor de negocio»: el descriptor genérico de la regla |
| Sin criterio de aceptación | 0 de 7 hallazgos | **6 de 6** | Cada hallazgo de E2 lleva su GIVEN/WHEN/THEN y el RED que hoy falla |
| La iniciativa propia se diluye | 0/2 con sección | **4/4 con sección** | La tabla THEN → test sale en su sección en E2; en E3, aunque la sesión fue limpia, los sujetos encuentran dos iniciativas (la bitácora con hora y un test por cláusula del THEN) y las proponen como candidatas a regla |

## Recortes que tenían que aguantar

| Conducta recortada en el RED | GREEN | Evidencia |
| --- | --- | --- |
| No inventar fricciones | **2/2 no inventan** | Los dos tickets de E3 escriben literalmente «Sin hallazgos» bajo `## Hallazgos`. La plantilla, con huecos fijos para hallazgos, no empujó a rellenar: la salida explícita que la acompaña bastó |
| Separar el hueco del kit del error propio | **4/4 con sección propia** | `## Errores míos, no huecos del kit` presente en todos. En E2 el error del ejecutor (commit sin compilar) cae ahí y no genera propuesta |

Contenido: no empeora. Los hallazgos de E2 siguen contrastados contra el texto del kit y, uno de ellos, contra el de superpowers 6.3.0, y los dos sujetos distinguen por su cuenta cuándo un hallazgo puede ser incumplimiento de una regla de superpowers y no un hueco del kit.

## Huecos de la propia skill

1. **`id:` corto en la cabecera** (`E3-green-1`: `id: 0004`). La copia del kit se hizo antes del commit `521c019`, que ya alinea la cabecera con el resto de plantillas de carril (id compuesto + `task:`). Es forma de la cabecera y no se remide.
2. **Idioma del slug**: tres slugs en castellano y uno en inglés. La skill dice «igual que las carpetas de spec», y `nombrado.md` no fija el idioma del slug: es la decisión abierta de la task 0016. La regla «Idioma de los nombres» de la spec, que pedía slug en inglés, se enmienda para remitir a la misma convención que las carpetas de spec en vez de adelantarse a la 0016.
3. **Disparo sin nombrar la skill**: en E2 y E3 la petición no menciona `sdd-feedback` ni la palabra «ticket» («escribe un documento con lo que ha fallado y lo que ha funcionado del kit») y los cuatro sujetos la cargaron. La `description` basta.

## Estado

Los cinco fallos del RED, corregidos 2/2. Los dos recortes aguantan con la plantilla puesta. Sin REFACTOR pendiente en la skill.
