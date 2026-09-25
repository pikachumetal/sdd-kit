BeforeAll {
  $script:Validator = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Test-Capabilities.ps1'
  $script:Bookings = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot 'fixtures/capabilities/bookings.md')
  $script:Roots = [System.Collections.Generic.List[string]]::new()

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
    $delta = ($DeltaNames | ForEach-Object { "### Capacidad: ``$_```n`n**ADDED — Algo**`n- GIVEN a`n- WHEN b`n- THEN c`n" }) -join "`n"
    return "---`nid: x`n---`n`n# Spec — prueba`n`n$Block`n## Decisiones que he tomado yo — valida estas`n`n1. nada`n`n## Delta de comportamiento`n`n$delta"
  }
}

AfterAll {
  foreach ($root in $script:Roots) { Remove-Item -Recurse -Force $root -ErrorAction SilentlyContinue }
}

Describe 'Test-Capabilities.ps1 sobre capabilities/' {
  It 'una capacidad bien formada pasa' {
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings })
    $result.Lines | Should -Be @('Capacidades válidas: 1')
    $result.Code | Should -Be 0
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
      Should -Contain 'bookings.md: sección «Notas» no admitida: solo «Requisitos» y «Reglas de la capacidad»'
  }

  It 'sin sección Requisitos falla' {
    $content = $script:Bookings -replace '## Requisitos', '## Comportamiento'
    (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Contain 'bookings.md: falta la sección «Requisitos»'
  }

  It 'una marca de delta en la capacidad falla con su línea' {
    $content = $script:Bookings -replace '### Consultar salas libres', "**MODIFIED — Consultar salas libres**"
    $lines = (Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines
    ($lines | Where-Object { $_.Contains('bookings.md: resto de delta «**MODIFIED —» en la línea 10') }) | Should -Not -BeNullOrEmpty
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

Describe 'Las capacidades del repo' {
  It 'pasan el validador' {
    $result = Invoke-Validator (Join-Path $PSScriptRoot '../.docs/sdd')
    $result.Lines | Should -Be @('Capacidades válidas: 13')
    $result.Code | Should -Be 0
  }
}

Describe 'Test-Capabilities.ps1 con -Artifact' {
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

  It 'un patch que devuelve el comportamiento pasa con «Ninguna, porque…» y sin delta' {
    $patch = "---`ntype: patch`n---`n`n# Patch 0013 — reserva máxima`n`n## Capacidades`n`nNinguna, porque el fix devuelve ``reservar`` a lo que ya dice ``bookings``.`n`n## 1. Síntoma`n`nalgo`n"
    $result = Invoke-Validator (New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/p/patch.md' = $patch }) 'specs/p/patch.md'
    $result.Lines | Should -Be @('Capacidades válidas: 1')
    $result.Code | Should -Be 0
  }
}
