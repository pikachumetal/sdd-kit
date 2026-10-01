BeforeAll {
  $script:Merger = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Merge-CapabilityDelta.ps1'
  $script:Validator = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Test-Capabilities.ps1'
  $script:SpecTemplate = Join-Path $PSScriptRoot '../skills/sdd-templates/templates/spec-template.md'
  $script:Roots = [System.Collections.Generic.List[string]]::new()

  $script:Bookings = @'
# Capacidad — bookings

## Propósito

Reservar y consultar salas por franja horaria desde el CLI.

## Requisitos

### Reservar una franja

- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada y el CLI responde `Reservada Norte 10-12`

### Consultar salas libres

- GIVEN las salas Norte, Sur y Oeste, con Norte reservada de 10 a 12
- WHEN `salas libres 10-12`
- THEN lista `Sur` y `Oeste`, una por línea

## Reglas de la capacidad

- **Dónde viven los datos**: `data/bookings.json`.
- **Idioma de los nombres**: comandos y mensajes en castellano.
- **Límites**: una reserva dura como máximo 4 h.
- **Avisos**: aviso si la reserva pisa un festivo
- **Regla ante conflicto**: no aplica.
'@ -replace '\r\n', "`n"

  $script:Added = @'
**ADDED — Cancelar una reserva**
- GIVEN la reserva Norte 10-12
- WHEN `salas cancelar Norte 10-12`
- THEN la franja queda libre y el CLI responde `Cancelada Norte 10-12`
- Se valida en: worktree con la base al día
'@ -replace '\r\n', "`n"

  $script:Modified = @'
**MODIFIED — Reservar una franja** (antes: «la reserva queda
guardada»)

> Copia el bloque entero del requisito vigente con los cambios.

- GIVEN la sala Norte libre de 10 a 12
- WHEN `salas reservar Norte 10-12`
- THEN la reserva queda guardada a nombre del usuario y el CLI responde `Reservada Norte 10-12`
'@ -replace '\r\n', "`n"

  $script:Removed = "**REMOVED — Consultar salas libres**`n- motivo: lo cubre ``salas agenda``"
  $script:Rules = "**Reglas de la capacidad**`n- **Avisos**: aviso si la reserva pisa un festivo o dura más de 4 h"

  function New-SddFolder([hashtable]$Files) {
    $root = Join-Path ([System.IO.Path]::GetTempPath()) "merge-$([guid]::NewGuid().ToString('N'))"
    $script:Roots.Add($root)
    $sdd = Join-Path $root '.docs/sdd'
    New-Item -ItemType Directory -Force -Path $sdd | Out-Null
    foreach ($relative in $Files.Keys) {
      $target = Join-Path $sdd $relative
      New-Item -ItemType Directory -Force -Path (Split-Path $target) | Out-Null
      [System.IO.File]::WriteAllText($target, $Files[$relative], [System.Text.UTF8Encoding]::new($false))
    }
    return $sdd
  }

  function Get-Spec([string]$Block, [string[]]$Sections) {
    "---`nid: x`n---`n`n# Spec — prueba`n`n## Capacidades`n`n$Block`n`n## Decisiones que he tomado yo — valida estas`n`n1. nada`n`n## Delta de comportamiento`n`n$($Sections -join "`n`n")`n"
  }

  function Get-BookingsSpec([string[]]$Entries) {
    Get-Spec '- Modificadas: `bookings` — cambia la reserva' @("### Capacidad: ``bookings```n`n$($Entries -join "`n`n")")
  }

  function Invoke-Script([string]$Script, [string]$Sdd, [string]$Artifact) {
    $output = & $Script -Path $Sdd -Artifact (Join-Path $Sdd $Artifact)
    return [pscustomobject]@{ Lines = @($output); Code = $LASTEXITCODE }
  }

  function Invoke-Merge([string]$Sdd, [string]$Artifact = 'specs/x/spec.md') { Invoke-Script $script:Merger $Sdd $Artifact }

  function Read-Capability([string]$Sdd, [string]$Name = 'bookings') {
    [System.IO.File]::ReadAllText((Join-Path $Sdd "capabilities/$Name.md"))
  }

  function New-BookingsFolder([string[]]$Entries, [string]$Capability = $script:Bookings) {
    New-SddFolder @{ 'capabilities/bookings.md' = $Capability; 'specs/x/spec.md' = (Get-BookingsSpec $Entries) }
  }
}

AfterAll {
  foreach ($root in $script:Roots) { Remove-Item -Recurse -Force $root -ErrorAction SilentlyContinue }
}

Describe 'Merge-CapabilityDelta.ps1' -Tag 'Slow' {
  It 'fusiona ADDED, MODIFIED con encabezado partido, REMOVED y una regla' {
    $sdd = New-BookingsFolder @($script:Added, $script:Modified, $script:Removed, $script:Rules)
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Be @('bookings.md: añadido «Cancelar una reserva»', 'bookings.md: sustituido «Reservar una franja»', 'bookings.md: quitado «Consultar salas libres»', 'bookings.md: regla «Avisos» sustituida')
    $result.Code | Should -Be 0
    $content = Read-Capability $sdd
    $content | Should -Match '(?s)### Reservar una franja.*a nombre del usuario.*### Cancelar una reserva'
    $content | Should -Not -Match 'Consultar salas libres'
    $content | Should -Not -Match '- motivo:'
    $content | Should -Match '(?m)^- \*\*Avisos\*\*: aviso si la reserva pisa un festivo o dura más de 4 h$'
    $content | Should -Match '(?m)^- \*\*Límites\*\*: una reserva dura como máximo 4 h\.$'
    (Invoke-Script $script:Validator $sdd 'specs/x/spec.md').Lines | Should -Be @('Capacidades válidas: 1')
  }

  It 'deja fuera Se valida en, la ayuda y el antes partido' {
    $sdd = New-BookingsFolder @($script:Added, $script:Modified)
    (Invoke-Merge $sdd).Code | Should -Be 0
    $content = Read-Capability $sdd
    $content | Should -Not -Match 'Se valida en'
    $content | Should -Not -Match 'guardada»\)'
    $content | Should -Not -Match '(?m)^>'
  }

  It 'normaliza las líneas en blanco del fichero que toca' {
    $capability = $script:Bookings -replace "### Reservar una franja`n`n", "### Reservar una franja`n" -replace "## Requisitos`n", "## Requisitos`n`n"
    $sdd = New-BookingsFolder @($script:Added) $capability
    (Invoke-Merge $sdd).Code | Should -Be 0
    $lines = (Read-Capability $sdd) -split "`n"
    ($lines -join "`n") | Should -Not -Match "`n`n`n"
    for ($i = 0; $i -lt $lines.Count - 1; $i++) {
      if ($lines[$i] -match '^#{1,3} ') { $lines[$i + 1] | Should -Be '' -Because "tras «$($lines[$i])» va una línea en blanco" }
    }
  }

  It 'conserva el texto que no es requisito' {
    $capability = $script:Bookings -replace "## Requisitos`n", "## Requisitos`n`nLos comandos del CLI de reservas.`n"
    $sdd = New-BookingsFolder @($script:Added) $capability
    (Invoke-Merge $sdd).Code | Should -Be 0
    Read-Capability $sdd | Should -Match '(?s)## Requisitos\n\nLos comandos del CLI de reservas\.\n\n### Reservar una franja.*### Cancelar una reserva'
  }

  It 'un MODIFIED que no está falla y no escribe nada' {
    $missing = "**MODIFIED — Anular una reserva**`n- GIVEN una reserva`n- WHEN se anula`n- THEN desaparece"
    $sdd = New-BookingsFolder @($script:Added, $script:Removed, $missing)
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Contain 'spec.md: «Anular una reserva» del MODIFIED no está en capabilities/bookings.md'
    $result.Code | Should -Be 1
    Read-Capability $sdd | Should -BeExactly $script:Bookings
  }

  It 'un fallo en una capacidad no escribe ninguna' {
    $rooms = "# Capacidad — rooms`n`n## Propósito`n`nSalas.`n`n## Requisitos`n`n### Listar salas`n`n- GIVEN dos salas`n- WHEN ``salas lista```n- THEN las lista`n"
    $roomsDelta = "### Capacidad: ``rooms```n`n**MODIFIED — Borrar una sala**`n- GIVEN una sala`n- WHEN se borra`n- THEN no está"
    $spec = Get-Spec '- Modificadas: `bookings`, `rooms` — cambian' @("### Capacidad: ``bookings```n`n$script:Added", $roomsDelta)
    $sdd = New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'capabilities/rooms.md' = $rooms; 'specs/x/spec.md' = $spec }
    (Invoke-Merge $sdd).Code | Should -Be 1
    Read-Capability $sdd | Should -BeExactly $script:Bookings
  }

  It 'una cita de una decisión por número falla y no escribe' {
    $cited = $script:Added -replace 'queda libre', 'queda libre, por la decisión 10,'
    $sdd = New-BookingsFolder @($cited)
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Contain 'spec.md: «Cancelar una reserva» cita la spec («decisión 10»): reescríbelo en el delta sin la referencia y vuelve a ejecutar'
    $result.Code | Should -Be 1
    Read-Capability $sdd | Should -BeExactly $script:Bookings
  }

  It 'entre comillas invertidas no cuenta como cita' {
    $quoted = $script:Added -replace 'queda libre', 'queda libre (el texto `por la decisión 10` no se copia)'
    (Invoke-Merge (New-BookingsFolder @($quoted))).Code | Should -Be 0
  }

  It 'volver a ejecutarlo no cambia nada' {
    $sdd = New-BookingsFolder @($script:Added, $script:Modified, $script:Removed, $script:Rules)
    (Invoke-Merge $sdd).Code | Should -Be 0
    $first = Read-Capability $sdd
    $second = Invoke-Merge $sdd
    $second.Code | Should -Be 0
    $second.Lines | Should -Contain 'bookings.md: «Cancelar una reserva» ya estaba'
    $second.Lines | Should -Contain 'bookings.md: «Consultar salas libres» ya no estaba'
    Read-Capability $sdd | Should -BeExactly $first
  }

  It 'un ADDED con el título ya presente y otro texto falla' {
    $sdd = New-BookingsFolder @($script:Added)
    (Invoke-Merge $sdd).Code | Should -Be 0
    $spec = Get-BookingsSpec @($script:Added -replace 'queda libre', 'queda libre al momento')
    [System.IO.File]::WriteAllText((Join-Path $sdd 'specs/x/spec.md'), $spec)
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Contain 'spec.md: «Cancelar una reserva» del ADDED ya está en capabilities/bookings.md con otro texto: usa MODIFIED'
    $result.Code | Should -Be 1
  }

  It 'una capacidad declarada en Nuevas se crea con su propósito' {
    $delta = "### Capacidad: ``rooms```n`n**ADDED — Consultar el aforo**`n- GIVEN la sala Norte con aforo 8`n- WHEN ``salas aforo Norte```n- THEN responde ``Norte: 8 personas``"
    $sdd = New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/x/spec.md' = (Get-Spec '- Nuevas: `rooms` — Salas, su aforo y su mantenimiento' @($delta)) }
    $result = Invoke-Merge $sdd
    $result.Code | Should -Be 0
    $lines = (Read-Capability $sdd 'rooms') -split "`n"
    $lines[0..8] | Should -Be @('# Capacidad — rooms', '', '## Propósito', '', 'Salas, su aforo y su mantenimiento', '', '## Requisitos', '', '### Consultar el aforo')
  }

  It 'la primera capacidad de un proyecto sin carpeta capabilities se crea' {
    $delta = "### Capacidad: ``rooms```n`n**ADDED — Consultar el aforo**`n- GIVEN la sala Norte con aforo 8`n- WHEN ``salas aforo Norte```n- THEN responde ``Norte: 8 personas``"
    $sdd = New-SddFolder @{ 'specs/x/spec.md' = (Get-Spec '- Nuevas: `rooms` — Salas, su aforo y su mantenimiento' @($delta)) }
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Be @('rooms.md: añadido «Consultar el aforo»')
    $result.Code | Should -Be 0
    Read-Capability $sdd 'rooms' | Should -Match '^# Capacidad — rooms'
  }

  It 'un paréntesis sin cerrar en el encabezado no se traga el resto del delta' {
    $unbalanced = $script:Modified -replace '\(antes: «la reserva queda\nguardada»\)', '(antes: «abre con ( el valor»)'
    $sdd = New-BookingsFolder @($unbalanced, $script:Added)
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Be @('bookings.md: sustituido «Reservar una franja»', 'bookings.md: añadido «Cancelar una reserva»')
    Read-Capability $sdd | Should -Match 'a nombre del usuario'
  }

  It 'un encabezado sin título legible falla sin escribir' {
    $hyphen = $script:Added -replace 'ADDED — ', 'ADDED - '
    $sdd = New-BookingsFolder @($hyphen)
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Contain 'spec.md: no leo el título de «**ADDED - Cancelar una reserva**»: escríbelo como «**ADDED — <título>**», con raya'
    $result.Code | Should -Be 1
    Read-Capability $sdd | Should -BeExactly $script:Bookings
  }

  It 'un menor que y un mayor que con espacios no son un hueco de la plantilla' {
    $comparison = $script:Added -replace 'la franja queda libre', 'la franja queda libre si dura < 4 h y el aforo es > 2'
    (Invoke-Merge (New-BookingsFolder @($comparison))).Code | Should -Be 0
  }

  It 'sin Nuevas falla' {
    $delta = "### Capacidad: ``rooms```n`n**ADDED — Consultar el aforo**`n- GIVEN una sala`n- WHEN se consulta`n- THEN responde"
    $sdd = New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/x/spec.md' = (Get-Spec '- Modificadas: `rooms` — aforo' @($delta)) }
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Contain 'spec.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»'
    $result.Code | Should -Be 1
    Test-Path (Join-Path $sdd 'capabilities/rooms.md') | Should -BeFalse
  }

  It 'desde un patch.md falla' {
    $delta = "### Capacidad: ``rooms```n`n**ADDED — Consultar el aforo**`n- GIVEN una sala`n- WHEN se consulta`n- THEN responde"
    $sdd = New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/x/patch.md' = (Get-Spec '- Nuevas: `rooms` — aforo' @($delta)) }
    $result = Invoke-Merge $sdd 'specs/x/patch.md'
    $result.Lines | Should -Contain 'patch.md: «rooms» no tiene fichero en capabilities/ y el bloque no la declara en «Nuevas»'
    $result.Code | Should -Be 1
  }

  It 'una regla nueva se añade en el orden canónico y crea la sección si falta' {
    $withoutLimits = $script:Bookings -replace "- \*\*Límites\*\*:[^\n]*\n", ''
    $sdd = New-BookingsFolder @("**Reglas de la capacidad**`n- **Límites**: una reserva dura como máximo 3 h.") $withoutLimits
    (Invoke-Merge $sdd).Lines | Should -Be @('bookings.md: regla «Límites» añadida')
    Read-Capability $sdd | Should -Match '(?s)\*\*Idioma de los nombres\*\*.*\*\*Límites\*\*: una reserva dura como máximo 3 h\..*\*\*Avisos\*\*'

    $withoutSection = $script:Bookings -replace '(?s)\n## Reglas de la capacidad.*$', "`n"
    $sdd = New-BookingsFolder @($script:Rules) $withoutSection
    (Invoke-Merge $sdd).Code | Should -Be 0
    Read-Capability $sdd | Should -Match '(?s)## Reglas de la capacidad\n\n- \*\*Avisos\*\*: aviso si la reserva pisa un festivo o dura más de 4 h\n$'
  }

  It 'una regla con continuación se sustituye entera' {
    $capability = $script:Bookings -replace '(- \*\*Avisos\*\*: aviso si la reserva pisa un festivo)', "`$1`n  y si la sala está en mantenimiento"
    $sdd = New-BookingsFolder @($script:Rules) $capability
    (Invoke-Merge $sdd).Code | Should -Be 0
    Read-Capability $sdd | Should -Not -Match 'mantenimiento'
  }

  It 'un título con espacios de más casa; con otras mayúsculas falla' {
    $spaced = $script:Modified -replace 'Reservar una franja', 'Reservar  una franja '
    (Invoke-Merge (New-BookingsFolder @($spaced))).Lines | Should -Be @('bookings.md: sustituido «Reservar una franja»')

    $cased = $script:Modified -replace 'Reservar una franja', 'reservar una franja'
    (Invoke-Merge (New-BookingsFolder @($cased))).Lines | Should -Contain 'spec.md: «reservar una franja» del MODIFIED no está en capabilities/bookings.md'
  }

  It 'conserva CRLF si el fichero lo usa' {
    $sdd = New-BookingsFolder @($script:Added) ($script:Bookings -replace "`n", "`r`n")
    (Invoke-Merge $sdd).Code | Should -Be 0
    $content = Read-Capability $sdd
    $content | Should -Match "Cancelar una reserva`r`n"
    $content | Should -Not -Match "[^`r]`n"
  }

  It 'sin delta escribe Sin delta que fusionar y sale con 0' {
    $sdd = New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/x/spec.md' = (Get-Spec '- Ninguna, porque refactor' @()) }
    $result = Invoke-Merge $sdd
    $result.Lines | Should -Be @('Sin delta que fusionar')
    $result.Code | Should -Be 0
  }

  It 'la spec-template calcada sin tocar falla con el hueco y no escribe' {
    $sdd = New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/x/spec.md' = (Get-Content -Raw -Encoding utf8 $script:SpecTemplate) }
    $result = Invoke-Merge $sdd
    ($result.Lines -join "`n") | Should -Match 'es un hueco de la plantilla'
    $result.Code | Should -Be 1
    Read-Capability $sdd | Should -BeExactly $script:Bookings
  }

  It 'la spec-template rellenada a medias falla con el hueco' {
    $template = (Get-Content -Raw -Encoding utf8 $script:SpecTemplate) -replace '`<nombre>`', '`bookings`' -replace '\*\*ADDED — <título estable>\*\*', '**ADDED — Cancelar una reserva**'
    $sdd = New-SddFolder @{ 'capabilities/bookings.md' = $script:Bookings; 'specs/x/spec.md' = $template }
    $result = Invoke-Merge $sdd
    ($result.Lines -join "`n") | Should -Match 'es un hueco de la plantilla'
    $result.Code | Should -Be 1
    Read-Capability $sdd | Should -BeExactly $script:Bookings
  }
}
