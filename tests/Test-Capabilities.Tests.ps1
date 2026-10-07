BeforeAll {
  $script:Validator = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Test-Capabilities.ps1'
  $script:Bookings = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot '../cli/test/fixtures/capabilities/bookings.md')
  $script:Roots = [System.Collections.Generic.List[string]]::new()
  $script:ReserveScenario = "- GIVEN la sala Norte libre de 10 a 12`n- WHEN ``salas reservar Norte 10-12```n- THEN la reserva queda guardada y el CLI responde ``Reservada Norte 10-12``"

  function New-SddFolder([hashtable]$Files) {
    $root = Join-Path ([System.IO.Path]::GetTempPath()) "caps-$([guid]::NewGuid().ToString('N'))"
    $script:Roots.Add($root)
    $sdd = Join-Path $root '.docs/sdd'
    New-Item -ItemType Directory -Force -Path $sdd | Out-Null
    foreach ($relative in $Files.Keys) {
      $target = Join-Path $sdd $relative
      New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
      Set-Content -Path $target -Value $Files[$relative] -Encoding utf8 -NoNewline
    }
    return $sdd
  }

  function Invoke-Validator([string]$Sdd, [string]$Artifact) {
    $arguments = @{ Path = $Sdd }
    if ($Artifact) { $arguments.Artifact = Join-Path $Sdd $Artifact }
    $output = & $script:Validator @arguments
    return [pscustomobject]@{ Lines = @($output); Code = $LASTEXITCODE }
  }

  function Get-Spec([string]$Block, [string[]]$DeltaNames) {
    $delta = ($DeltaNames | ForEach-Object { "### Capacidad: ``$_```n`n**MODIFIED — Reservar una franja**`n$script:ReserveScenario`n" }) -join "`n"
    return "---`nid: x`n---`n`n# Spec — prueba`n`n$Block`n## Decisiones que he tomado yo — valida estas`n`n1. nada`n`n## Delta de comportamiento`n`n$delta"
  }
}

AfterAll {
  foreach ($root in $script:Roots) { Remove-Item -Recurse -Force $root -ErrorAction SilentlyContinue }
}

# Slow porque ejecuta el script sobre ficheros temporales: sale del pre-commit (patch 0087) y lo corre la suite completa.
Describe 'Test-Capabilities.ps1 sobre capabilities/' -Tag 'Slow' {
  It 'una capacidad bien formada pasa' {
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings })
    $result.Lines | Should -Be @('Capacidades válidas: 1')
    $result.Code | Should -Be 0
  }

  It 'omite y nombra un documento marcado «No es una capacidad.» tras el título' {
    $legacy = "# Documento funcional heredado`n`n> **No es una capacidad.** Documento funcional anterior al troceo.`n`n## Pantallas`n`nTexto.`n"
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'capabilities/funcional.md' = $legacy })
    $result.Lines | Should -Be @('Capacidades válidas: 1 · omitidas por «No es una capacidad.»: funcional.md')
    $result.Code | Should -Be 0
  }

  It 'un documento marcado «No es una capacidad.» con escenarios falla' {
    $marked = "# Capacidad — auth`n`n> **No es una capacidad.**`n`n## Requisitos`n`n### Entrar`n$script:ReserveScenario`n"
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/auth.md' = $marked })
    $result.Lines | Should -Be @('auth.md: marcado «No es una capacidad.» y con escenarios: quita la marca o los escenarios')
    $result.Code | Should -Be 1
  }

  It 'un requisito sin THEN falla con fichero y requisito' {
    $content = $script:Bookings -replace '(?m)^- THEN lista `Sur` y `Oeste`, una por línea\r?\n', ''
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })
    $result.Lines | Should -Contain 'bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)'
    $result.Code | Should -Be 1
  }

  It 'lista todas las líneas de escenario que faltan' {
    $content = $script:Bookings -replace '(?m)^- (GIVEN|WHEN) la sala Norte libre de 10 a 12\r?\n', '' -replace '(?m)^- WHEN `salas reservar Norte 10-12`\r?\n', ''
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })
    $result.Lines | Should -Contain 'bookings.md: «Reservar una franja» no tiene escenario completo (falta - GIVEN, - WHEN)'
  }

  It 'un título de sección con espacios al final no esconde un requisito sin THEN' {
    $content = ($script:Bookings -replace '## Requisitos', '## Requisitos  ') -replace '(?m)^- THEN lista `Sur` y `Oeste`, una por línea\r?\n', ''
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Contain 'bookings.md: «Consultar salas libres» no tiene escenario completo (falta - THEN)'
  }

  It 'una línea suelta bajo un requisito falla con requisito, línea y texto' {
    $content = $script:Bookings -replace '(?m)^(- THEN la reserva queda guardada[^\r\n]*)', "`$1`nguardada»)"
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })
    $result.Lines | Should -Contain 'bookings.md: línea suelta en «Reservar una franja» (línea 13): «guardada»)»'
    $result.Code | Should -Be 1
  }

  It 'una cita, una línea sangrada y una línea en blanco bajo un requisito no son sueltas' {
    $content = $script:Bookings -replace '(?m)^(- THEN la reserva queda guardada[^\r\n]*)', "`$1`n  sigue el THEN`n`n> nota"
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines | Should -Be @('Capacidades válidas: 1')
  }

  It 'un párrafo entre Requisitos y el primer requisito no es una línea suelta' {
    $content = $script:Bookings -replace '(?m)^(## Requisitos[^\r\n]*)', "`$1`n`nLos comandos del CLI de reservas."
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines | Should -Be @('Capacidades válidas: 1')
  }

  It 'una línea Se valida en en la capacidad es resto de delta' {
    $content = $script:Bookings -replace '(?m)^(- THEN la reserva queda guardada[^\r\n]*)', "`$1`n- Se valida en: worktree con la base al día"
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })
    $result.Lines | Should -Contain 'bookings.md: resto de delta «Se valida en:» en la línea 13'
    $result.Code | Should -Be 1
  }

  It 'la cabecera de reglas calcada de la plantilla, con su nota, se admite y se comprueba' {
    $content = ($script:Bookings -replace '## Reglas de la capacidad', '## Reglas de la capacidad *(opcional; presente obliga a decidir)*') -replace '(?m)^- \*\*Límites\*\*:.*\r?\n', ''
    $lines = (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines
    $lines | Should -Be @('bookings.md: a «Reglas de la capacidad» le falta «Límites»')
  }

  It 'un Historial con la nota de la plantilla 1.x recibe el aviso de la migración' {
    $content = $script:Bookings + "`n## Historial *(opcional)*`n`n- 2026-09-10 — task-0004 — ADDED Reservar una franja`n"
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Be @('bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0')
  }

  It 'un título que no nombra el fichero falla' {
    $content = $script:Bookings -replace '# Capacidad — bookings', '# Capacidad — reservas'
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Contain 'bookings.md: el título debe ser «# Capacidad — bookings»'
  }

  It 'una sección Historial falla con el aviso de la migración' {
    $content = $script:Bookings + "`n## Historial`n`n- 2026-09-10 — task-0004 — ADDED Reservar una franja`n"
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })
    $result.Lines | Should -Contain 'bookings.md: sección «Historial», resto del kit 1.x: lo quita la migración a 2.0.0'
    $result.Code | Should -Be 1
  }

  It 'otra sección de nivel 2 falla' {
    $content = $script:Bookings + "`n## Notas`n`nalgo`n"
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Contain 'bookings.md: sección «Notas» no admitida: solo «Propósito», «Requisitos» y «Reglas de la capacidad»'
  }

  It 'sin sección Requisitos falla' {
    $content = $script:Bookings -replace '## Requisitos', '## Comportamiento'
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Contain 'bookings.md: falta la sección «Requisitos»'
  }

  It 'una marca de delta en la capacidad falla con su línea' {
    $content = $script:Bookings -replace '### Consultar salas libres', "**MODIFIED — Consultar salas libres**"
    $lines = (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines
    ($lines | Where-Object { $_.Contains('bookings.md: resto de delta «**MODIFIED —» en la línea 14') }) | Should -Not -BeNullOrEmpty
  }

  It 'el bloque de reglas en negrita del delta falla aunque haya sección' {
    $content = $script:Bookings -replace '(?m)^- AND sin salas libres', "`n**Reglas de la capacidad**`n- **Avisos**: ninguno`n- AND sin salas libres"
    $lines = (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines
    ($lines | Where-Object { $_.Contains('resto de delta «**Reglas de la capacidad**» en la línea') -and $_.Contains('sus entradas van en «## Reglas de la capacidad»') }) |
      Should -Not -BeNullOrEmpty
  }

  It 'a la sección de reglas le falta una entrada' {
    $content = $script:Bookings -replace '(?m)^- \*\*Límites\*\*:.*\r?\n', ''
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Contain 'bookings.md: a «Reglas de la capacidad» le falta «Límites»'
  }

  It 'una entrada de reglas de más se admite' {
    $content = $script:Bookings + "- **Contrato de lectura**: la primera columna.`n"
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Code | Should -Be 0
  }

  It 'una capacidad sin sección de reglas pasa' {
    $content = $script:Bookings -replace '(?s)## Reglas de la capacidad.*$', ''
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Code | Should -Be 0
  }

  It 'con la carpeta vacía no hay nada que validar' {
    $sdd = New-SddFolder @{}
    New-Item -ItemType Directory -Path (Join-Path $sdd 'capabilities') | Out-Null
    $result = Invoke-Validator $sdd
    $result.Lines | Should -Be @('Sin capacidades que validar')
    $result.Code | Should -Be 0
  }

  It 'sin carpeta no hay nada que validar' {
    $result = Invoke-Validator (New-SddFolder @{})
    $result.Lines | Should -Be @('Sin capacidades que validar')
    $result.Code | Should -Be 0
  }
}

Describe 'Test-Capabilities.ps1 exige el propósito' -Tag 'Slow' {
  BeforeAll {
    $script:Template = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot '../skills/sdd-templates/templates/capability-template.md')
    function Set-Purpose([string]$Content, [string]$Body) {
      return $Content -replace '(?s)## Propósito\r?\n.*?(?=\r?\n## )', "## Propósito`n`n$Body`n"
    }
  }

  It 'sin sección Propósito falla' {
    $content = $script:Bookings -replace '(?s)## Propósito.*?(?=## Requisitos)', ''
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })
    $result.Lines | Should -Be @('bookings.md: falta la sección «Propósito»')
    $result.Code | Should -Be 1
  }

  It 'un propósito vacío falla' {
    $content = Set-Purpose $script:Bookings ''
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Be @('bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad')
  }

  It 'un propósito con solo la ayuda y el hueco de la plantilla falla como vacío' {
    $content = Set-Purpose $script:Bookings "> Una o dos frases.`n`n<una o dos frases: qué cubre la capacidad>"
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Be @('bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad')
  }

  It 'un propósito de más de 300 caracteres falla con su longitud medida en una línea' {
    $content = Set-Purpose $script:Bookings (('a' * 200) + "`n" + ('b' * 211))
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Be @('bookings.md: «Propósito» tiene 412 caracteres; el máximo es 300 (una o dos frases)')
  }

  It 'un propósito de 300 caracteres pasa' {
    $content = Set-Purpose $script:Bookings ('a' * 300)
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Code | Should -Be 0
  }

  It 'un propósito detrás de otra sección falla' {
    $purpose = "## Propósito`n`nReservar y consultar salas.`n`n"
    $content = ($script:Bookings -replace '(?s)## Propósito.*?(?=## Requisitos)', '') -replace '## Reglas de la capacidad', "$purpose## Reglas de la capacidad"
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Be @('bookings.md: «Propósito» debe ser la primera sección')
  }

  It 'la plantilla calcada tal cual falla solo por el título y el propósito sin rellenar' {
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Template })).Lines | Should -Be @(
      'bookings.md: el título debe ser «# Capacidad — bookings»'
      'bookings.md: «Propósito» está vacío: escribe en una o dos frases qué cubre la capacidad'
    )
  }

  It 'la plantilla con título y propósito rellenos y el resto a medias pasa' {
    $content = Set-Purpose ($script:Template -replace '# Capacidad — <nombre>', '# Capacidad — bookings') "> Una o dos frases.`n`nReservar y consultar salas por franja."
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })
    $result.Lines | Should -Be @('Capacidades válidas: 1')
  }
}

Describe 'Las capacidades del repo' {
  It 'pasan el validador' {
    $docs = Join-Path $PSScriptRoot '../.docs/sdd'
    $count = @(Get-ChildItem -LiteralPath (Join-Path $docs 'capabilities') -Filter '*.md').Count
    $result = Invoke-Validator $docs
    $result.Lines | Should -Be @("Capacidades válidas: $count")
    $result.Code | Should -Be 0
  }
}

Describe 'La migración a 2.0.0' -Tag 'Slow' {
  BeforeAll {
    $script:Migration = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot '../skills/sdd-init-brownfield/references/migrations/v2.0.0.md')
  }

  It 'tiene un paso que quita la sección Historial sin gate y se salta sin capabilities/' {
    $step = ($script:Migration -split "`r?`n") | Where-Object { $_ -match 'Historial de las capacidades' }
    $step | Should -Match '## Historial'
    $step | Should -Match 'Sin gate'
    $step | Should -Match 'se salta'
  }

  It 'tiene un paso que escribe el propósito sin gate y se salta sin capabilities/' {
    $step = ($script:Migration -split "`r?`n") | Where-Object { $_ -match 'Propósito de las capacidades' }
    $step | Should -Match '## Propósito'
    $step | Should -Match 'Sin gate'
    $step | Should -Match 'se salta'
  }

  It 'verifica con Test-Capabilities.ps1 y deja lo demás como pendiente' {
    $verification = [regex]::Match($script:Migration, '(?s)## Verificación.*').Value
    $verification | Should -Match 'Test-Capabilities\.ps1'
    $verification | Should -Match 'pendiente'
  }

  It 'aplicado a una capacidad con historial, el validador pasa' {
    $withHistory = $script:Bookings + "`n## Historial`n`n- 2026-09-10 — task-0004 — ADDED Reservar una franja`n"
    $migrated = $withHistory -replace '(?s)\r?\n## Historial.*?(?=\r?\n## |\z)', ''
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $migrated })).Code | Should -Be 0
  }
}

Describe 'Test-Capabilities.ps1 con -Artifact' -Tag 'Slow' {
  It 'un bloque que coincide con el delta pasa' {
    $spec = Get-Spec "## Capacidades`n`n- Modificadas: ``bookings`` — añade «Algo»`n" @('bookings')
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md'
    $result.Lines | Should -Be @('Capacidades válidas: 1')
    $result.Code | Should -Be 0
  }

  It 'varias capacidades en una línea cuentan todas' {
    $spec = Get-Spec "## Capacidades`n`n- Modificadas: ``bookings``, ``rooms`` — cambian «Algo»`n" @('bookings', 'rooms')
    $files = @{ 'capabilities/bookings.md' = $script:Bookings; 'capabilities/rooms.md' = ($script:Bookings -replace 'bookings', 'rooms'); 'specs/t/spec.md' = $spec }
    (Invoke-Validator (New-SddFolder $files) 'specs/t/spec.md').Code | Should -Be 0
  }

  It 'sin bloque Capacidades falla' {
    $spec = Get-Spec '' @('bookings')
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md').Lines |
      Should -Contain 'spec.md: falta el bloque «## Capacidades»'
  }

  It 'un bloque y un delta que no coinciden fallan por los dos lados' {
    $spec = Get-Spec "## Capacidades`n`n- Modificadas: ``bookings`` — cambia «Algo»`n" @('rooms')
    $files = @{ 'capabilities/bookings.md' = $script:Bookings; 'capabilities/rooms.md' = ($script:Bookings -replace 'bookings', 'rooms'); 'specs/t/spec.md' = $spec }
    $result = Invoke-Validator (New-SddFolder $files) 'specs/t/spec.md'
    $result.Lines | Should -Contain 'spec.md: «bookings» está en el bloque «Capacidades» y no tiene subsección en el delta'
    $result.Lines | Should -Contain 'spec.md: el delta tiene «rooms» y el bloque «Capacidades» no la nombra'
    $result.Code | Should -Be 1
  }

  It '«Ninguna» con delta falla' {
    $spec = Get-Spec "## Capacidades`n`nNinguna, porque es un refactor.`n" @('bookings')
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md').Lines |
      Should -Contain 'spec.md: el bloque dice «Ninguna» y hay delta'
  }

  It 'un bloque vacío falla' {
    $spec = Get-Spec "## Capacidades`n`n> Se escribe tras listar capabilities/.`n`n- Nuevas: ninguna`n" @()
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md').Lines |
      Should -Contain 'spec.md: el bloque «Capacidades» está vacío: declara las capacidades o «Ninguna, porque <motivo>»'
  }

  It '«Ninguna» sin motivo falla' {
    $spec = Get-Spec "## Capacidades`n`n- Ninguna`n" @()
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md').Lines |
      Should -Contain 'spec.md: «Ninguna» sin motivo: escribe «Ninguna, porque <motivo>»'
  }

  It 'una capacidad del bloque sin fichero falla' {
    $spec = Get-Spec "## Capacidades`n`n- Nuevas: ``rooms`` — salas y mantenimiento`n" @('rooms')
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md').Lines |
      Should -Contain 'spec.md: «rooms» no tiene fichero en capabilities/'
  }

  It 'un patch que declara «Nuevas» falla' {
    $patch = (Get-Spec "## Capacidades`n`n- Nuevas: ``bookings`` — reservas`n" @('bookings')) -replace 'id: x', "id: x`ntype: patch"
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/p/patch.md' = $patch }) 'specs/p/patch.md').Lines |
      Should -Contain 'patch.md: un patch no crea capacidades: quita «Nuevas»'
  }

  It 'un MODIFIED sin fusionar, con el encabezado en varias líneas, falla nombrando el título' {
    $block = "## Capacidades`n`n- Modificadas: ``bookings`` — cambia «Reservar una franja»`n"
    $delta = "### Capacidad: ``bookings```n`n**MODIFIED — Reservar una franja** (antes: «la reserva queda`nguardada»)`n- GIVEN la sala Norte libre de 10 a 12`n- WHEN ``salas reservar Norte 10-12```n- THEN el CLI pide confirmación`n"
    $spec = (Get-Spec $block @()) + $delta
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md'
    $result.Lines | Should -Contain 'spec.md: «Reservar una franja» del delta no coincide con capabilities/bookings.md'
    $result.Code | Should -Be 1
  }

  It 'un MODIFIED fusionado, con el encabezado en varias líneas, pasa' {
    $block = "## Capacidades`n`n- Modificadas: ``bookings`` — cambia «Reservar una franja»`n"
    $delta = "### Capacidad: ``bookings```n`n**MODIFIED — Reservar una franja** (antes: «la reserva queda`nguardada»)`n`n> Copia el bloque entero.`n`n- GIVEN la sala Norte libre de 10 a 12`n- WHEN ``salas reservar Norte 10-12```n- THEN el CLI pide confirmación`n"
    $merged = $script:Bookings -replace '- THEN la reserva queda guardada[^\r\n]*','- THEN el CLI pide confirmación'
    $spec = (Get-Spec $block @()) + $delta
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $merged; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md'
    $result.Lines | Should -Be @('Capacidades válidas: 1')
    $result.Code | Should -Be 0
  }

  It 'un ADDED sin fusionar falla nombrando el título, y un título partido en dos líneas cuenta entero' {
    $block = "## Capacidades`n`n- Modificadas: ``bookings`` — añade «Cancelar una reserva» y «Anular todas las reservas de una sala»`n"
    $delta = "### Capacidad: ``bookings```n`n**ADDED — Cancelar una reserva**`n- GIVEN a`n- WHEN b`n- THEN c`n`n**ADDED — Anular todas las reservas`nde una sala**`n- GIVEN a`n- WHEN b`n- THEN c`n"
    $spec = (Get-Spec $block @()) + $delta
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/t/spec.md' = $spec }) 'specs/t/spec.md'
    $result.Lines | Should -Contain 'spec.md: «Cancelar una reserva» del delta no está en capabilities/bookings.md'
    $result.Lines | Should -Contain 'spec.md: «Anular todas las reservas de una sala» del delta no está en capabilities/bookings.md'
    $result.Code | Should -Be 1
  }

  It 'un patch que devuelve el comportamiento pasa con «Ninguna, porque…» y sin delta' {
    $patch = "---`ntype: patch`n---`n`n# Patch 0013 — reserva máxima`n`n## Capacidades`n`nNinguna, porque el fix devuelve ``reservar`` a lo que ya dice ``bookings``.`n`n## 1. Síntoma`n`nalgo`n"
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/p/patch.md' = $patch }) 'specs/p/patch.md'
    $result.Lines | Should -Be @('Capacidades válidas: 1')
    $result.Code | Should -Be 0
  }
}
