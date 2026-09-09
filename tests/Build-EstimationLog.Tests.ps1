# Tests del generador de estimation-log. Fixtures en tests/fixtures/estimation-log/.
BeforeAll {
  $script:Script = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Build-EstimationLog.ps1'
  $script:Fixtures = Join-Path $PSScriptRoot 'fixtures/estimation-log'

  function Invoke-Build([string]$Root) {
    $out = Join-Path $TestDrive ([guid]::NewGuid().ToString() + '.md')
    $warnings = @()
    & $script:Script -Root $Root -OutFile $out -WarningVariable warnings -WarningAction SilentlyContinue | Out-Null
    return [pscustomobject]@{ Text = Get-Content $out -Raw; Warnings = @($warnings | ForEach-Object { $_.Message }); Path = $out }
  }

  function Get-Row([string]$Text, [string]$Folder) {
    return ($Text -split "`n" | ForEach-Object { $_.TrimEnd("`r") } | Where-Object { $_ -like "*| $Folder |*" } | Select-Object -First 1)
  }
}

Describe 'Build-EstimationLog.ps1' {
  BeforeAll { $script:Result = Invoke-Build (Join-Path $script:Fixtures 'proyecto') }

  It 'lleva cabecera AUTO-GENERADO' {
    $script:Result.Text | Should -Match '^<!-- AUTO-GENERADO por Build-EstimationLog\.ps1 \(sdd-kit\)'
  }

  It 'lee un walkthrough plano' {
    Get-Row $script:Result.Text '20260901-100000-task-0001-plain' | Should -Be '| 2026-09-01 | 0001 | docs | 4 | 2 | 0.5 | 20260901-100000-task-0001-plain |'
  }

  It 'tolera negrita, virgulilla, coma decimal, rango y Tipo compuesto' {
    Get-Row $script:Result.Text '20260902-100000-task-0002-fancy' | Should -Be '| 2026-09-02 | 0002 | docs | 2 | 0.5 | 0.25 | 20260902-100000-task-0002-fancy |'
  }

  It 'incluye una task sin plan con estimado y ratio vacíos' {
    Get-Row $script:Result.Text '20260903-100000-task-0003-sinplan' | Should -Be '| 2026-09-03 | 0003 | infra/tooling | — | 3 | — | 20260903-100000-task-0003-sinplan |'
  }

  It 'lee patch.md con tipo patch' {
    Get-Row $script:Result.Text '20260904-100000-patch-0000-fix' | Should -Be '| 2026-09-04 | 0000 | patch | 0.5 | 0.3 | 0.6 | 20260904-100000-patch-0000-fix |'
  }

  It 'lee hotfix.md legacy con tipo hotfix' {
    Get-Row $script:Result.Text '20260905-100000-task-0004-legacy' | Should -Be '| 2026-09-05 | 0004 | hotfix | 1 | 2 | 2 | 20260905-100000-task-0004-legacy |'
  }

  It 'avisa y excluye un bloque presente con real ilegible' {
    Get-Row $script:Result.Text '20260906-100000-task-0005-roto' | Should -BeNullOrEmpty
    $script:Result.Warnings -join ' ' | Should -Match '20260906-100000-task-0005-roto'
  }

  It 'ignora en silencio un walkthrough sin bloque de tiempo' {
    Get-Row $script:Result.Text '20260907-100000-task-0006-sinbloque' | Should -BeNullOrEmpty
    $script:Result.Warnings -join ' ' | Should -Not -Match 'sinbloque'
  }

  It 'ignora en silencio un patch sin bloque de tiempo' {
    Get-Row $script:Result.Text '20260908-100000-patch-0000-sinbloque' | Should -BeNullOrEmpty
    $script:Result.Warnings -join ' ' | Should -Not -Match 'patch-0000-sinbloque'
  }

  It 'lee hotfix.md sin frontmatter usando la carpeta para el id de task' {
    Get-Row $script:Result.Text '20260909-100000-hotfix-0007-sinfrontmatter' | Should -Be '| 2026-09-09 | 0007 | hotfix | 1 | 1 | 1 | 20260909-100000-hotfix-0007-sinfrontmatter |'
  }

  It 'escribe LF sin BOM' {
    $bytes = [System.IO.File]::ReadAllBytes($script:Result.Path)
    $tieneBom = ($bytes.Length -ge 3) -and ($bytes[0] -eq 0xEF) -and ($bytes[1] -eq 0xBB) -and ($bytes[2] -eq 0xBF)
    $tieneBom | Should -BeFalse
    ($bytes -contains 13) | Should -BeFalse
  }

  It 'calcula el factor global como mediana de los ratios' {
    # Ratios: 0.5, 0.25, 0.6, 2, 1 → ordenados [0.25, 0.5, 0.6, 1, 2] → mediana 0.6, n = 5
    $script:Result.Text | Should -Match '\*\*Factor de calibración\*\* \(ratio mediano real/estimado, 5 tareas\): \*\*0\.6\*\*'
  }

  It 'calcula la mediana por Tipo' {
    $script:Result.Text | Should -Match '(?m)^\| docs \| 2 \| 0\.38 \|$'
    $script:Result.Text | Should -Match '(?m)^\| patch \| 1 \| 0\.6 \|$'
    $script:Result.Text | Should -Match '(?m)^\| hotfix \| 2 \| 1\.5 \|$'
  }

  It 'avisa de calibración orientativa con menos de 10 ratios' {
    $script:Result.Text | Should -Match 'Con menos de 10 tareas con ratio la calibración es orientativa'
  }
}

Describe 'Resolución de la carpeta de docs' {
  It 'usa docs/sdd cuando no existe .docs/sdd' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'legacy')
    Get-Row $r.Text '20260801-100000-task-0009-old' | Should -Be '| 2026-08-01 | 0009 | backend | 3 | 6 | 2 | 20260801-100000-task-0009-old |'
  }

  It 'falla con mensaje si no hay specs' {
    { & $script:Script -Root $TestDrive -OutFile (Join-Path $TestDrive 'x.md') } | Should -Throw '*No se encuentra*'
  }

  It 'escribe por defecto en <docs>/estimation-log.md' {
    $root = Join-Path $TestDrive 'def'
    Copy-Item (Join-Path $script:Fixtures 'proyecto') $root -Recurse
    & $script:Script -Root $root -WarningAction SilentlyContinue | Out-Null
    Test-Path (Join-Path $root '.docs/sdd/estimation-log.md') | Should -BeTrue
  }
}
