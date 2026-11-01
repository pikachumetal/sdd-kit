# Tasks — feature 0116

| Task | Estado | Commit |
| --- | --- | --- |
| 1 — La marca y el aviso | ✅ | 0f3f8509 |
| 2 — Instalar el hook en cada proyecto | ✅ | 8f6a9969 |
| 3 — La puerta de retomar | ✅ | 3a111ffa |

Revisión final: Spec opus+high, With fixes · Código sonnet+high, With fixes · Arquitectura opus+high, With fixes, sobre 3a111ffa
Pasada de fix: juntada en el cierre, 9 hallazgos: 2 RED→GREEN y 7 sin test que los reproduzca, medidos con la suite, el smoke o `rf3`
Re-revisión: 3a111ffa..juntada en el cierre, sdd-kit:effort-high + opus, 3 abiertos, arreglados después; sin revisar el commit que los arregla

## Rulings

Task 1: Ruling: el test existente «exits 0 and writes nothing…» pasa a dar la entrada con readInput — readFileSync(0) bloquea el worker de Vitest; el hook real siempre recibe stdin de Claude Code — coste si es malo: lanzar el verbo a mano desde una terminal espera EOF
Task 1: Ruling: tests del hook del proyecto en proceso (project-hook.test.ts) y uno con spawn en project-hook.slow.test.ts, con el script exportando sessionNotice y markerPath — tech-stack manda a *.slow lo que lanza procesos — coste si es malo: ninguno
Task 1: Ruling: sin plugin no corre session-end, así que el .warned de esa sesión queda en el tmpdir del SO (fichero vacío por sesión sin kit) — el SO limpia su tmp y limpiarlo pediría otro hook de proyecto — coste si es malo: ficheros de 0 bytes
Task 2: Ruling: installProjectHook(root) sin pluginRoot: el módulo resuelve su fuente con import.meta.url, como migrationsDir en upgrade — un parámetro menos — coste si es malo: ninguno
Task 2: Ruling: --finish integra el hook en las escrituras antes del marcador y cuatro líneas de salida en verbs.test.ts — el marcador va el último a propósito; la línea de cada fichero se conserva — coste si es malo: ninguno
Task 3: Ruling: rp1 pasa al paso retomar-patch — para relanzar solo ese escenario en red2 — coste si es malo: ninguno
Task 3: Ruling: sale de sdd-implement la fila «No Playwright MCP…», que repite el párrafo de Visual check, y de patch-flow la de «.docs/sdd/patches/», que repite el paso 2; de sdd-propose, «Pressure doesn't change the process.» — saldo igual o menor pedido por el dev-lead; sin sujeto propio — coste si es malo: reponer la fila
Final: Ruling: al reanudar se sale antes de reparar el tmp de Git Bash — el matcher anterior tampoco corría ahí — coste si es malo: la reparación espera a la siguiente sesión nueva
Final: Ruling: 'no se cuelga sin stdin' solo se prueba con entrada ilegible — Claude Code siempre da stdin con EOF — coste si es malo: lanzar el verbo a mano en una terminal espera EOF
Final: Ruling: un plugin anterior a esta feature en un proyecto migrado dice que no hay skills sin ser cierto — transitorio, autoUpdate lo acota y el remedio vale — coste si es malo: un aviso impreciso
Final: Ruling: upgrade importa de init — init es dueña de settings; moverlo no cambia conducta — coste si es malo: un acoplamiento leve
Final: Ruling: el hook arranca node en cada mensaje, ~66 ms en Windows — es el coste de detectar en UserPromptSubmit — coste si es malo: 66 ms por mensaje
Final: Ruling: --project-hook no exige .docs/sdd en la raíz y pisa una copia editada — la copia es del kit y la migración corre en un proyecto — coste si es malo: un fichero de más
Final: Ruling: sesión viva tras una purga del tmp o reanudada en dos terminales puede dar un aviso de más — muy raro y solo ocurre una vez — coste si es malo: un aviso falso
Final: Ruling: sdd-init editada sin sujeto — solo nombra un fichero más y su saldo sigue en 2662 — coste si es malo: ninguno de conducta
Final: Ruling: los 6 fixes sin RED (existsSync, ruta literal, duplicación, try de session-end, documentos, mediciones) no tienen test que falle antes: el comportamiento no cambia o se mide con sujetos — coste si es malo: la re-revisión los mira
