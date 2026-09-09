BeforeAll {
  $script:Script = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Build-EstimationLog.ps1'
  $script:Fixtures = Join-Path $PSScriptRoot 'fixtures/estimation-log'

  function Invoke-Build([string]$Root) {
    $out = Join-Path $TestDrive ([guid]::NewGuid().ToString() + '.md')
    $warnings = @()
    & $script:Script -Root $Root -OutFile $out -WarningVariable warnings -WarningAction SilentlyContinue 6>$null | Out-Null
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

  It 'lee un patch cuya sección se titula solo Tiempo' {
    Get-Row $script:Result.Text '20260910-100000-patch-0000-sinligero' | Should -Be '| 2026-09-10 | 0000 | patch | 1 | 0.5 | 0.5 | 20260910-100000-patch-0000-sinligero |'
  }

  It 'escribe LF sin BOM' {
    $bytes = [System.IO.File]::ReadAllBytes($script:Result.Path)
    $hasBom = ($bytes.Length -ge 3) -and ($bytes[0] -eq 0xEF) -and ($bytes[1] -eq 0xBB) -and ($bytes[2] -eq 0xBF)
    $hasBom | Should -BeFalse
    ($bytes -contains 13) | Should -BeFalse
  }

  It 'una carpeta fuera de convención sale con fecha y task vacíos en vez de abortar' {
    Get-Row $script:Result.Text 'notas-sueltas' | Should -Be '| — | — | docs | 2 | 1 | 0.5 | notas-sueltas |'
  }

  It 'no deja que un "Real" de otra sección secuestre el valor correcto' {
    Get-Row $script:Result.Text '20260911-100000-patch-0000-real-en-diagnostico' | Should -Be '| 2026-09-11 | 0000 | patch | 1 | 1 | 1 | 20260911-100000-patch-0000-real-en-diagnostico |'
    $script:Result.Warnings -join ' ' | Should -Not -Match 'real-en-diagnostico'
  }

  It 'sigue probando patch.md si walkthrough.md no tiene bloque de tiempo' {
    Get-Row $script:Result.Text '20260914-100000-task-0012-walkthrough-vacio-con-patch' | Should -BeNullOrEmpty
    $script:Result.Warnings -join ' ' | Should -Match '20260914-100000-task-0012-walkthrough-vacio-con-patch'
  }

  It 'admite la etiqueta de estimación sin "(del plan)"' {
    Get-Row $script:Result.Text '20260912-100000-task-0010-sin-etiqueta-plan' | Should -Be '| 2026-09-12 | 0010 | docs | 3 | 3 | 1 | 20260912-100000-task-0010-sin-etiqueta-plan |'
  }

  It 'usa Tipo — cuando falta la línea Tipo' {
    Get-Row $script:Result.Text '20260913-100000-task-0011-sin-tipo' | Should -Be '| 2026-09-13 | 0011 | — | 2 | 1 | 0.5 | 20260913-100000-task-0011-sin-tipo |'
  }

  It 'calcula el factor global como mediana de los ratios' {
    # Ratios: 0.5, 0.25, 0.6, 2, 1, 0.5, 1, 0.5, 1, 0.5 → ordenados
    # [0.25, 0.5, 0.5, 0.5, 0.5, 0.6, 1, 1, 1, 2] → mediana (0.5+0.6)/2 = 0.55, n = 10
    $script:Result.Text | Should -Match '\*\*Factor de calibración\*\* \(ratio mediano real/estimado, 10 artefactos\): \*\*0\.55\*\*'
  }

  It 'calcula la mediana por Tipo' {
    $script:Result.Text | Should -Match '(?m)^\| docs \| 4 \| 0\.5 \|$'
    $script:Result.Text | Should -Match '(?m)^\| patch \| 3 \| 0\.6 \|$'
    $script:Result.Text | Should -Match '(?m)^\| hotfix \| 2 \| 1\.5 \|$'
    $script:Result.Text | Should -Match '(?m)^\| — \| 1 \| 0\.5 \|$'
  }

  It 'no avisa de calibración orientativa con 10 o más ratios' {
    # Con las fixtures de esta ronda el conjunto llega exactamente a n=10: la condición del
    # script es "< 10", así que el aviso ya no debe aparecer.
    $script:Result.Text | Should -Not -Match 'Con menos de 10 tareas con ratio la calibración es orientativa'
  }
}

Describe 'Resolución de la carpeta de docs' {
  It 'usa docs/sdd cuando no existe .docs/sdd' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'legacy')
    Get-Row $r.Text '20260801-100000-task-0009-old' | Should -Be '| 2026-08-01 | 0009 | backend | 3 | 6 | 2 | 20260801-100000-task-0009-old |'
  }

  It 'avisa de calibración orientativa con menos de 10 ratios' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'legacy')
    $r.Text | Should -Match 'Con menos de 10 tareas con ratio la calibración es orientativa'
  }

  It 'lee la estimación de un walkthrough lite (etiqueta con «de la spec»)' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'lite')
    Get-Row $r.Text '20260915-100000-task-0013-lite' | Should -Be '| 2026-09-15 | 0013 | docs | 1 | 0.5 | 0.5 | 20260915-100000-task-0013-lite |'
  }

  It 'falla con mensaje si no hay specs' {
    { & $script:Script -Root $TestDrive -OutFile (Join-Path $TestDrive 'x.md') } | Should -Throw '*No se encuentra*'
  }

  It 'escribe por defecto en <docs>/estimation-log.md' {
    $root = Join-Path $TestDrive 'def'
    Copy-Item (Join-Path $script:Fixtures 'proyecto') $root -Recurse
    & $script:Script -Root $root -WarningAction SilentlyContinue 6>$null | Out-Null
    Test-Path (Join-Path $root '.docs/sdd/estimation-log.md') | Should -BeTrue
  }

  It 'avisa antes de sobreescribir un estimation-log.md mantenido a mano' {
    $root = Join-Path $TestDrive 'manual'
    Copy-Item (Join-Path $script:Fixtures 'proyecto') $root -Recurse
    $logPath = Join-Path $root '.docs/sdd/estimation-log.md'
    [System.IO.File]::WriteAllText($logPath, "# Log manual`n", [System.Text.UTF8Encoding]::new($false))
    $warnings = @()
    & $script:Script -Root $root -WarningVariable warnings -WarningAction SilentlyContinue 6>$null | Out-Null
    ($warnings | ForEach-Object { $_.Message }) -join ' ' | Should -Match 'mantenido a mano'
    (Get-Content $logPath -TotalCount 1) | Should -Match '^<!-- AUTO-GENERADO'
  }

  It 'no avisa la segunda vez que regenera el mismo fichero' {
    $root = Join-Path $TestDrive 'manual2'
    Copy-Item (Join-Path $script:Fixtures 'proyecto') $root -Recurse
    $logPath = Join-Path $root '.docs/sdd/estimation-log.md'
    [System.IO.File]::WriteAllText($logPath, "# Log manual`n", [System.Text.UTF8Encoding]::new($false))
    & $script:Script -Root $root -WarningAction SilentlyContinue 6>$null | Out-Null
    $warnings = @()
    & $script:Script -Root $root -WarningVariable warnings -WarningAction SilentlyContinue 6>$null | Out-Null
    ($warnings | ForEach-Object { $_.Message }) -join ' ' | Should -Not -Match 'mantenido a mano'
  }
}
