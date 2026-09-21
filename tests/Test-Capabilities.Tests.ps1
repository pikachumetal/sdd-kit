BeforeAll {
  $script:Script = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Test-Capabilities.ps1'

  function New-TempDirectory {
    # Directorio propio y resuelto: $TestDrive llega vacío dentro de funciones de BeforeAll.
    $path = Join-Path ([System.IO.Path]::GetTempPath()) ('sdd-capabilities-' + [guid]::NewGuid().ToString())
    New-Item -ItemType Directory -Path $path -Force | Out-Null
    return (Resolve-Path $path).Path
  }

  function New-Project([hashtable]$Capabilities) {
    $root = New-TempDirectory
    $folder = Join-Path $root '.docs/sdd/capabilities'
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    foreach ($name in $Capabilities.Keys) {
      Set-Content -Path (Join-Path $folder "$name.md") -Value $Capabilities[$name] -Encoding utf8
    }
    return $root
  }

  function Invoke-Validator([string]$Root, [string]$FileName, [string]$Content) {
    if (-not (Test-Path $script:Script)) { throw "No existe el script $script:Script" }
    $path = Join-Path $Root $FileName
    Set-Content -Path $path -Value $Content -Encoding utf8
    $stdout = & pwsh -NoProfile -File $script:Script -Path $path -ProjectRoot $Root 2>&1
    return [pscustomobject]@{ Output = ($stdout | Out-String); ExitCode = $LASTEXITCODE }
  }

  $script:Rooms = @'
# Capacidad — rooms

## Requisitos

### Un aula se reserva por franjas
- GIVEN un aula libre
- WHEN un profesor la pide de 10:00 a 12:00
- THEN la reserva queda pendiente
- AND secretaría la ve en pendientes
- AND el profesor la ve en su lista

### Un aula cerrada no se reserva
- GIVEN un aula en obras
- WHEN un profesor la pide
- THEN la petición se rechaza
'@

  $script:SpecHead = @'
# Spec — ejemplo

## Decisiones que he tomado yo — valida estas

1. Capacidad(es) del delta: rooms (existente) — sustantivo: aula — descartada: crear `schedule`

## Delta de comportamiento

'@
}

Describe 'Test-Capabilities.ps1' {
  Context 'línea de capacidad' {
    It 'marca una spec sin la línea de capacidad' {
      $root = New-Project @{ rooms = $script:Rooms }
      $result = Invoke-Validator $root 'spec.md' "# Spec`n`n## Decisiones que he tomado yo — valida estas`n`n1. Otra decisión`n"
      $result.ExitCode | Should -Be 1
      $result.Output | Should -Match 'Capacidad\(es\) del delta'
    }

    It 'acepta el opt-out «ninguna» con motivo' {
      $root = New-Project @{ rooms = $script:Rooms }
      $result = Invoke-Validator $root 'spec.md' "# Spec`n`n1. Capacidad(es) del delta: ninguna — solo cambia la documentación`n"
      $result.ExitCode | Should -Be 0
    }

    It 'marca un patch.md sin la sección Delta de capacidades' {
      $root = New-Project @{ rooms = $script:Rooms }
      $result = Invoke-Validator $root 'patch.md' "# Patch 0007`n`n## 1. Síntoma`n`nFalla.`n"
      $result.ExitCode | Should -Be 1
      $result.Output | Should -Match 'Delta de capacidades'
    }

    It 'acepta un patch.md con la sección y «ninguno»' {
      $root = New-Project @{ rooms = $script:Rooms }
      $result = Invoke-Validator $root 'patch.md' "# Patch 0007`n`n## Delta de capacidades`n`nninguno`n"
      $result.ExitCode | Should -Be 0
    }
  }

  Context 'slug de capacidad nueva' {
    It 'marca un slug nuevo que no está en kebab-case ASCII' {
      $root = New-Project @{ rooms = $script:Rooms }
      $spec = $script:SpecHead + "### Capacidad: ``Reservas_Sala```n`n**ADDED — Algo nuevo**`n- GIVEN x`n- WHEN y`n- THEN z`n"
      $result = Invoke-Validator $root 'spec.md' $spec
      $result.ExitCode | Should -Be 1
      $result.Output | Should -Match 'Reservas_Sala'
    }

    It 'no marca el slug de una capacidad que ya existe aunque no sea ASCII' {
      $root = New-Project @{ 'reservas-año' = $script:Rooms }
      $spec = $script:SpecHead + "### Capacidad: ``reservas-año```n`n**ADDED — Algo nuevo**`n- GIVEN x`n- WHEN y`n- THEN z`n"
      $result = Invoke-Validator $root 'spec.md' $spec
      $result.ExitCode | Should -Be 0
    }
  }

  Context 'ADDED con título existente' {
    It 'marca un ADDED cuyo título ya existe en la capacidad' {
      $root = New-Project @{ rooms = $script:Rooms }
      $spec = $script:SpecHead + "### Capacidad: ``rooms```n`n**ADDED — Un aula cerrada no se reserva**`n- GIVEN x`n- WHEN y`n- THEN z`n"
      $result = Invoke-Validator $root 'spec.md' $spec
      $result.ExitCode | Should -Be 1
      $result.Output | Should -Match 'Un aula cerrada no se reserva'
    }
  }

  Context 'MODIFIED con el bloque entero' {
    It 'marca un MODIFIED con menos cláusulas que el requisito vigente' {
      $root = New-Project @{ rooms = $script:Rooms }
      $spec = $script:SpecHead + "### Capacidad: ``rooms```n`n**MODIFIED — Un aula se reserva por franjas** (antes: `"THEN la reserva queda pendiente`")`n- WHEN un profesor la pide de 10:00 a 12:00`n- THEN la reserva queda pendiente y se avisa por email`n"
      $result = Invoke-Validator $root 'spec.md' $spec
      $result.ExitCode | Should -Be 1
      $result.Output | Should -Match 'Un aula se reserva por franjas'
    }

    It 'acepta el MODIFIED corto si declara con retira las cláusulas que quita' {
      $root = New-Project @{ rooms = $script:Rooms }
      $spec = $script:SpecHead + "### Capacidad: ``rooms```n`n**MODIFIED — Un aula se reserva por franjas** (retira: `"GIVEN un aula libre`") (retira: `"AND el profesor la ve en su lista`") (retira: `"AND secretaría la ve en pendientes`")`n- WHEN un profesor la pide de 10:00 a 12:00`n- THEN la reserva queda pendiente y se avisa por email`n"
      $result = Invoke-Validator $root 'spec.md' $spec
      $result.ExitCode | Should -Be 0
    }

    It 'acepta un MODIFIED con el bloque entero' {
      $root = New-Project @{ rooms = $script:Rooms }
      $spec = $script:SpecHead + "### Capacidad: ``rooms```n`n**MODIFIED — Un aula se reserva por franjas**`n- GIVEN un aula libre`n- WHEN un profesor la pide de 10:00 a 12:00`n- THEN la reserva queda pendiente`n- AND secretaría la ve en pendientes`n- AND el profesor la ve en su lista`n- AND el profesor recibe un email`n"
      $result = Invoke-Validator $root 'spec.md' $spec
      $result.ExitCode | Should -Be 0
    }
  }

  Context 'entrada y salida' {
    It 'sale con 2 si la ruta no existe' {
      $root = New-Project @{ rooms = $script:Rooms }
      & pwsh -NoProfile -File $script:Script -Path (Join-Path $root 'no-existe/spec.md') -ProjectRoot $root 2>&1 | Out-Null
      $LASTEXITCODE | Should -Be 2
    }

    It 'sale con 0 y lo dice cuando no hay problemas de forma' {
      $root = New-Project @{ rooms = $script:Rooms }
      $spec = $script:SpecHead + "### Capacidad: ``rooms```n`n**ADDED — Un aula se libera al cancelar**`n- GIVEN una reserva confirmada`n- WHEN el profesor la cancela`n- THEN el aula queda libre`n"
      $result = Invoke-Validator $root 'spec.md' $spec
      $result.ExitCode | Should -Be 0
      $result.Output | Should -Match 'Sin problemas de forma\.'
    }
  }
}
