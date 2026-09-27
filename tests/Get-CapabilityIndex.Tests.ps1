BeforeAll {
  $script:Index = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Get-CapabilityIndex.ps1'
  $script:Bookings = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot 'fixtures/capabilities/bookings.md')
  $script:Template = Get-Content -Raw -Encoding utf8 (Join-Path $PSScriptRoot '../skills/sdd-templates/templates/capability-template.md')
  $script:Roots = [System.Collections.Generic.List[string]]::new()

  function New-SddFolder([hashtable]$Files) {
    $root = Join-Path ([System.IO.Path]::GetTempPath()) "caps-index-$([guid]::NewGuid().ToString('N'))"
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

  function Invoke-Index([string]$Sdd) {
    $output = & $script:Index -Path $Sdd
    return [pscustomobject]@{ Lines = @($output); Code = $LASTEXITCODE }
  }

  function Set-Purpose([string]$Content, [string]$Body) {
    return $Content -replace '(?s)## Propósito\r?\n.*?(?=\r?\n## )', "## Propósito`n`n$Body`n"
  }

  $script:Rooms = ($script:Bookings -replace '# Capacidad — bookings', '# Capacidad — rooms') -replace '(?s)## Propósito.*?(?=## Requisitos)', ''
}

AfterAll {
  foreach ($root in $script:Roots) { Remove-Item -Recurse -Force $root -ErrorAction SilentlyContinue }
}

Describe 'Get-CapabilityIndex.ps1' {
  It 'lista cada capacidad con su propósito, en orden de nombre, y marca la que no lo tiene' {
    $bookings = Set-Purpose $script:Bookings 'Reservar, consultar y cancelar salas por franja horaria.'
    $result = Invoke-Index (New-SddFolder @{ 'capabilities/rooms.md' = $script:Rooms; 'capabilities/bookings.md' = $bookings })
    $result.Lines | Should -Be @(
      '- `bookings` — Reservar, consultar y cancelar salas por franja horaria.'
      '- `rooms` — (sin propósito)'
    )
    $result.Code | Should -Be 0
  }

  It 'junta en una línea un propósito escrito en varias y omite la ayuda' {
    $bookings = Set-Purpose $script:Bookings "> Una o dos frases.`n`nReservar y consultar`nsalas por franja."
    (Invoke-Index (New-SddFolder @{ 'capabilities/bookings.md' = $bookings })).Lines |
      Should -Be @('- `bookings` — Reservar y consultar salas por franja.')
  }

  It 'escribe entero un propósito de más de 300 caracteres' {
    $bookings = Set-Purpose $script:Bookings ('a' * 412)
    (Invoke-Index (New-SddFolder @{ 'capabilities/bookings.md' = $bookings })).Lines |
      Should -Be @("- ``bookings`` — $('a' * 412)")
  }

  It 'con la carpeta vacía no hay capacidades' {
    $sdd = New-SddFolder @{}
    New-Item -ItemType Directory -Path (Join-Path $sdd 'capabilities') | Out-Null
    $result = Invoke-Index $sdd
    $result.Lines | Should -Be @('Sin capacidades')
    $result.Code | Should -Be 0
  }

  It 'sin carpeta no hay capacidades' {
    $result = Invoke-Index (New-SddFolder @{})
    $result.Lines | Should -Be @('Sin capacidades')
    $result.Code | Should -Be 0
  }

  It 'la plantilla calcada tal cual sale sin propósito' {
    (Invoke-Index (New-SddFolder @{ 'capabilities/bookings.md' = $script:Template })).Lines |
      Should -Be @('- `bookings` — (sin propósito)')
  }

  It 'la plantilla con el propósito relleno y el resto a medias sale con su propósito' {
    $content = Set-Purpose $script:Template "> Una o dos frases.`n`nReservar y consultar salas por franja."
    (Invoke-Index (New-SddFolder @{ 'capabilities/bookings.md' = $content })).Lines |
      Should -Be @('- `bookings` — Reservar y consultar salas por franja.')
  }

  It 'sobre las capacidades del repo lista una línea por fichero y todas con propósito' {
    $docs = Join-Path $PSScriptRoot '../.docs/sdd'
    $count = @(Get-ChildItem -LiteralPath (Join-Path $docs 'capabilities') -Filter '*.md').Count
    $lines = (Invoke-Index $docs).Lines
    $lines.Count | Should -Be $count
    $lines | Where-Object { $_.Contains('(sin propósito)') } | Should -BeNullOrEmpty
  }
}
