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
    Get-Row $script:Result.Text '20260901-100000-task-0001-plain' | Should -Be '| 2026-09-01 | 0001 | docs | 4 | 2 | 0.5 | — | — | — | 20260901-100000-task-0001-plain |'
  }

  It 'tolera negrita, virgulilla, coma decimal, rango y Tipo compuesto' {
    Get-Row $script:Result.Text '20260902-100000-task-0002-fancy' | Should -Be '| 2026-09-02 | 0002 | docs | 2 | 0.5 | 0.25 | — | — | — | 20260902-100000-task-0002-fancy |'
  }

  It 'incluye una task sin plan con estimado y ratio vacíos' {
    Get-Row $script:Result.Text '20260903-100000-task-0003-sinplan' | Should -Be '| 2026-09-03 | 0003 | infra/tooling | — | 3 | — | — | — | — | 20260903-100000-task-0003-sinplan |'
  }

  It 'lee patch.md con tipo patch' {
    Get-Row $script:Result.Text '20260904-100000-patch-0000-fix' | Should -Be '| 2026-09-04 | 0000 | patch | 0.5 | 0.3 | 0.6 | — | — | — | 20260904-100000-patch-0000-fix |'
  }

  It 'lee hotfix.md legacy con tipo hotfix' {
    Get-Row $script:Result.Text '20260905-100000-task-0004-legacy' | Should -Be '| 2026-09-05 | 0004 | hotfix | 1 | 2 | 2 | — | — | — | 20260905-100000-task-0004-legacy |'
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
    Get-Row $script:Result.Text '20260909-100000-hotfix-0007-sinfrontmatter' | Should -Be '| 2026-09-09 | 0007 | hotfix | 1 | 1 | 1 | — | — | — | 20260909-100000-hotfix-0007-sinfrontmatter |'
  }

  It 'lee un patch cuya sección se titula solo Tiempo' {
    Get-Row $script:Result.Text '20260910-100000-patch-0000-sinligero' | Should -Be '| 2026-09-10 | 0000 | patch | 1 | 0.5 | 0.5 | — | — | — | 20260910-100000-patch-0000-sinligero |'
  }

  It 'escribe LF sin BOM' {
    $bytes = [System.IO.File]::ReadAllBytes($script:Result.Path)
    $hasBom = ($bytes.Length -ge 3) -and ($bytes[0] -eq 0xEF) -and ($bytes[1] -eq 0xBB) -and ($bytes[2] -eq 0xBF)
    $hasBom | Should -BeFalse
    ($bytes -contains 13) | Should -BeFalse
  }

  It 'una carpeta fuera de convención sale con fecha y task vacíos en vez de abortar' {
    Get-Row $script:Result.Text 'notas-sueltas' | Should -Be '| — | — | docs | 2 | 1 | 0.5 | — | — | — | notas-sueltas |'
  }

  It 'no deja que un "Real" de otra sección secuestre el valor correcto' {
    Get-Row $script:Result.Text '20260911-100000-patch-0000-real-en-diagnostico' | Should -Be '| 2026-09-11 | 0000 | patch | 1 | 1 | 1 | — | — | — | 20260911-100000-patch-0000-real-en-diagnostico |'
    $script:Result.Warnings -join ' ' | Should -Not -Match 'real-en-diagnostico'
  }

  It 'sigue probando patch.md si walkthrough.md no tiene bloque de tiempo' {
    Get-Row $script:Result.Text '20260914-100000-task-0012-walkthrough-vacio-con-patch' | Should -BeNullOrEmpty
    $script:Result.Warnings -join ' ' | Should -Match '20260914-100000-task-0012-walkthrough-vacio-con-patch'
  }

  It 'admite la etiqueta de estimación sin "(del plan)"' {
    Get-Row $script:Result.Text '20260912-100000-task-0010-sin-etiqueta-plan' | Should -Be '| 2026-09-12 | 0010 | docs | 3 | 3 | 1 | — | — | — | 20260912-100000-task-0010-sin-etiqueta-plan |'
  }

  It 'usa Tipo — cuando falta la línea Tipo' {
    Get-Row $script:Result.Text '20260913-100000-task-0011-sin-tipo' | Should -Be '| 2026-09-13 | 0011 | — | 2 | 1 | 0.5 | — | — | — | 20260913-100000-task-0011-sin-tipo |'
  }

  It 'lee los tres costes declarados por separado' {
    Get-Row $script:Result.Text '20260915-100000-task-0013-coste' | Should -Be '| 2026-09-15 | 0013 | docs | 2 | 1 | 0.5 | no medido | 342k | 1.85 | 20260915-100000-task-0013-coste |'
  }

  It 'muestra no aplica cuando la task no tuvo subagentes ni sujetos' {
    Get-Row $script:Result.Text '20260916-100000-task-0014-solo' | Should -Be '| 2026-09-16 | 0014 | docs | 1 | 1 | 1 | 120k | no aplica | no aplica | 20260916-100000-task-0014-solo |'
  }

  It 'lee las etiquetas antiguas del corpus y los tokens en millones' {
    Get-Row $script:Result.Text '20260917-100000-task-0015-legacy' | Should -Be '| 2026-09-17 | 0015 | docs | 2 | 2 | 1 | — | 1230k | 10.3 | 20260917-100000-task-0015-legacy |'
  }

  It 'lee el punto como separador de miles, no como decimal' {
    Get-Row $script:Result.Text '20260918-100000-task-0016-miles' | Should -Be '| 2026-09-18 | 0016 | docs | 2 | 1 | 0.5 | 148k | 1230k | 1850 | 20260918-100000-task-0016-miles |'
  }

  It 'no toca un decimal con punto, que lleva dos dígitos detrás' {
    Get-Row $script:Result.Text '20260919-100000-task-0017-decimal' | Should -Be '| 2026-09-19 | 0017 | docs | — | 1 | — | — | — | 1.85 | 20260919-100000-task-0017-decimal |'
  }

  It 'calcula el factor global como mediana de los ratios' {
    # Ratios ordenados: [0.25, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.6, 1, 1, 1, 1, 1, 2] → mediana 0.55, n = 14
    $script:Result.Text | Should -Match '\*\*Factor de calibración\*\* \(ratio mediano real/estimado, 14 artefactos\): \*\*0\.55\*\*'
  }

  It 'calcula la mediana por Tipo' {
    $script:Result.Text | Should -Match '(?m)^\| docs \| 8 \| 0\.5 \| [\d.]+–[\d.]+ \|$'
    $script:Result.Text | Should -Match '(?m)^\| patch \| 3 \| 0\.6 \| — \|$'
    $script:Result.Text | Should -Match '(?m)^\| hotfix \| 2 \| 1\.5 \| — \|$'
    $script:Result.Text | Should -Match '(?m)^\| — \| 1 \| 0\.5 \| — \|$'
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
    Get-Row $r.Text '20260801-100000-task-0009-old' | Should -Be '| 2026-08-01 | 0009 | backend | 3 | 6 | 2 | — | — | — | 20260801-100000-task-0009-old |'
  }

  It 'avisa de calibración orientativa con menos de 10 ratios' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'legacy')
    $r.Text | Should -Match 'Con menos de 10 tareas con ratio la calibración es orientativa'
  }

  It 'lee la estimación de un walkthrough lite (etiqueta con «de la spec»)' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'lite')
    Get-Row $r.Text '20260915-100000-task-0013-lite' | Should -Be '| 2026-09-15 | 0013 | docs | 1 | 0.5 | 0.5 | — | — | — | 20260915-100000-task-0013-lite |'
  }

  It 'corta la sección de tiempo en el siguiente encabezado' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'seccion')
    Get-Row $r.Text '20260916-100000-task-0014-seccion' | Should -Be '| 2026-09-16 | 0014 | docs | 2 | 1 | 0.5 | — | — | — | 20260916-100000-task-0014-seccion |'
  }

  It 'escribe el singular con un solo artefacto con ratio' {
    $r = Invoke-Build (Join-Path $script:Fixtures 'lite')
    $r.Text | Should -Match '1 artefacto\)'
  }

  It 'falla con el mismo mensaje si -Root no existe' {
    { & $script:Script -Root (Join-Path $TestDrive 'no-existe') -OutFile (Join-Path $TestDrive 'x.md') } | Should -Throw '*No se encuentra*'
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

Describe 'Resumen estadístico' {
  BeforeAll {
    function New-Walkthrough([string]$Specs, [string]$Folder, [hashtable]$Time) {
      $dir = New-Item -ItemType Directory -Path (Join-Path $Specs $Folder) -Force
      $cost = if ($Time.Cost) { "`n- Coste de sujetos: $($Time.Cost)" } else { '' }
      $text = "## 2. Tiempo: estimado vs real`n`n- Tipo: $($Time.Type)`n- Estimación de implementación (del plan): $($Time.Est)`n- Esfuerzo real: $($Time.Real)$cost`n"
      [System.IO.File]::WriteAllText((Join-Path $dir 'walkthrough.md'), $text, [System.Text.UTF8Encoding]::new($false))
    }

    function New-Project([string]$Name) {
      $specs = Join-Path $TestDrive "$Name/.docs/sdd/specs"
      New-Item -ItemType Directory -Path $specs -Force | Out-Null
      return $specs
    }

    # Estimado 1 h en todas: el ratio es el real. Con 21 ratios, los percentiles caen en índices enteros.
    $ratios = @(0.2, 0.3, 0.4, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.0, 0.6, 0.7, 0.8, 1.0, 1.1, 1.2, 1.3, 1.5, 2.0, 3.0)
    $specs = New-Project 'completo'
    for ($i = 0; $i -lt $ratios.Count; $i++) {
      $type = if ($i -lt 11) { 'docs' } elseif ($i -lt 17) { 'patch' } else { 'chore' }
      $folder = '202608{0:d2}-100000-task-{1:d4}-r' -f ($i + 1), ($i + 1)
      $cost = switch ($i) { 0 { '2,5 $' } 1 { 'no medido' } default { '' } }
      New-Walkthrough $specs $folder @{ Type = $type; Est = '1h'; Real = ("$($ratios[$i])h" -replace '\.', ','); Cost = $cost }
    }
    New-Walkthrough $specs '20260803-120000-task-0099-sinest' @{ Type = 'docs'; Est = '—'; Real = '1,5h'; Cost = '1,5 $' }
    New-Walkthrough $specs 'notas-sueltas' @{ Type = 'docs'; Est = '—'; Real = '2h' }
    $changelog = "# Changelog`n`n## [Unreleased]`n`n## [0.2.0] - 2026-08-10`n`n- algo`n`n## [0.1.0] — 2026-08-05`n`n- algo`n"
    [System.IO.File]::WriteAllText((Join-Path $TestDrive 'completo/.docs/sdd/changelog.md'), $changelog, [System.Text.UTF8Encoding]::new($false))
    $script:Completo = (Invoke-Build (Join-Path $TestDrive 'completo')).Text

    $specs = New-Project 'escaso'
    New-Walkthrough $specs '20260801-100000-task-0001-a' @{ Type = 'docs'; Est = '2h'; Real = '1h' }
    New-Walkthrough $specs '20260802-100000-task-0002-b' @{ Type = 'docs'; Est = '1h'; Real = '1h' }
    New-Walkthrough $specs '20260803-100000-task-0003-c' @{ Type = 'docs'; Est = '1h'; Real = '2h' }
    $script:Escaso = (Invoke-Build (Join-Path $TestDrive 'escaso')).Text
  }

  It 'pone la media al lado del factor de calibración' {
    $script:Completo | Should -Match '\*\*Factor de calibración\*\* \(ratio mediano real/estimado, 21 artefactos\): \*\*0\.8\*\* · media 0\.95'
  }

  It 'da el p25–p75 y el p80 con su uso para comprometer fechas' {
    $script:Completo | Should -Match '(?m)^- p25–p75: 0\.6–1\.1$'
    $script:Completo | Should -Match '(?m)^- p80: 1\.2 — para comprometer una fecha, multiplica la estimación por el p80: así cubre 4 de cada 5 artefactos\.$'
  }

  It 'reparte los ratios en el histograma por tramos' {
    $script:Completo | Should -Match '(?m)^\| Tramo del ratio \| n \| % \|$'
    $script:Completo | Should -Match '(?m)^\| <0\.5 \| 4 \| 19 % \|$'
    $script:Completo | Should -Match '(?m)^\| 0\.5–0\.8 \| 5 \| 24 % \|$'
    $script:Completo | Should -Match '(?m)^\| 0\.8–1\.25 \| 8 \| 38 % \|$'
    $script:Completo | Should -Match '(?m)^\| 1\.25–2 \| 2 \| 10 % \|$'
    $script:Completo | Should -Match '(?m)^\| ≥2 \| 2 \| 10 % \|$'
  }

  It 'da el % dentro de ±25 %, sobreestimadas e infraestimadas' {
    $script:Completo | Should -Match '(?m)^- Dentro de ±25 %: 38 % · sobreestimadas: 43 % · infraestimadas: 19 %$'
  }

  It 'da el error absoluto en horas' {
    $script:Completo | Should -Match '(?m)^- Error absoluto \(h\): media 0\.44 · mediana 0\.3$'
  }

  It 'compara la mediana de las 10 primeras con la de las 10 últimas' {
    $script:Completo | Should -Match '(?m)^- Tendencia \(mediana de las 10 primeras frente a las 10 últimas\): 0\.55 frente a 1\.15$'
  }

  It 'da n, mediana y p25–p75 por Tipo, con — por debajo de 5' {
    $script:Completo | Should -Match '(?m)^\| Tipo \| n \| Mediana \| p25–p75 \|$'
    $script:Completo | Should -Match '(?m)^\| docs \| 11 \| 0\.6 \| 0\.4–0\.85 \|$'
    $script:Completo | Should -Match '(?m)^\| chore \| 4 \| 1\.75 \| — \|$'
  }

  It 'agrupa por release según las fechas del changelog' {
    $script:Completo | Should -Match '(?m)^\| Release \| Artefactos \| Horas reales \| Mediana \| Sujetos \(\$\) \|$'
    $script:Completo | Should -Match '(?m)^\| 0\.1\.0 \| 6 \| 3\.3 \| 0\.4 \| 4 \|$'
    $script:Completo | Should -Match '(?m)^\| 0\.2\.0 \| 5 \| 4 \| 0\.8 \| — \|$'
    $script:Completo | Should -Match '(?m)^\| sin publicar \| 11 \| 14\.2 \| 1\.1 \| — \|$'
    $script:Completo | Should -Match '(?m)^\| sin fecha \| 1 \| 2 \| — \| — \|$'
  }

  It 'ordena las releases de la más antigua a sin publicar' {
    $script:Completo.IndexOf('| 0.1.0 |') | Should -BeLessThan $script:Completo.IndexOf('| 0.2.0 |')
    $script:Completo.IndexOf('| 0.2.0 |') | Should -BeLessThan $script:Completo.IndexOf('| sin publicar |')
  }

  It 'con menos de 5 ratios da mediana y media y dice n insuficiente' {
    $script:Escaso | Should -Match '\*\*Factor de calibración\*\* \(ratio mediano real/estimado, 3 artefactos\): \*\*1\*\* · media 1\.17'
    $script:Escaso | Should -Match 'n insuficiente \(hacen falta 5\)'
    $script:Escaso | Should -Not -Match 'p80'
    $script:Escaso | Should -Not -Match 'Tramo del ratio'
    $script:Escaso | Should -Not -Match 'Error absoluto'
    $script:Escaso | Should -Match '(?m)^\| docs \| 3 \| 1 \| — \|$'
  }

  It 'con menos de 20 ratios la tendencia dice n insuficiente' {
    $script:Escaso | Should -Match 'Tendencia: n insuficiente \(hacen falta 20\)'
    $proyecto = (Invoke-Build (Join-Path $script:Fixtures 'proyecto')).Text
    $proyecto | Should -Match 'Tendencia: n insuficiente \(hacen falta 20\)'
    $proyecto | Should -Match '(?m)^- p80: '
  }

  It 'sin changelog no hay tabla por release' {
    $script:Escaso | Should -Not -Match '\| Release \|'
  }
}

Describe 'Fecha de la fila' {
  BeforeAll {
    function New-Artifact([string]$Specs, [string]$Folder, [string]$File, [string]$FrontMatter) {
      $dir = New-Item -ItemType Directory -Path (Join-Path $Specs $Folder) -Force
      $heading = if ($File -eq 'patch.md') { '## 5. Tiempo' } else { '## 2. Tiempo: estimado vs real' }
      $text = "---`n$FrontMatter`n---`n`n$heading`n`n- Tipo: docs`n- Estimación: 1h`n- Real: 1h`n"
      [System.IO.File]::WriteAllText((Join-Path $dir $File), $text, [System.Text.UTF8Encoding]::new($false))
    }

    $specs = Join-Path $TestDrive 'fechas/.docs/sdd/specs'
    New-Item -ItemType Directory -Path $specs -Force | Out-Null
    New-Artifact $specs '20260923-214917-task-0053-noche' 'walkthrough.md' "task: 0053`ncreated: 2026-09-24"
    New-Artifact $specs '20260923-230000-patch-0060-noche' 'patch.md' "task: 0060`ncreated: 2026-09-24"
    New-Artifact $specs '20260923-230500-task-0061-date' 'walkthrough.md' "task: 0061`ndate: 2026-09-24"
    New-Artifact $specs '20260923-231000-task-0062-plantilla' 'walkthrough.md' "task: 0062`ncreated: <YYYY-MM-DD>"
    $script:Fechas = (Invoke-Build (Join-Path $TestDrive 'fechas')).Text
  }

  It 'fecha un walkthrough con su created: y no con la carpeta' {
    Get-Row $script:Fechas '20260923-214917-task-0053-noche' | Should -BeLike '| 2026-09-24 | 0053 |*'
  }

  It 'fecha un patch.md con su created:' {
    Get-Row $script:Fechas '20260923-230000-patch-0060-noche' | Should -BeLike '| 2026-09-24 | 0060 |*'
  }

  It 'acepta date: en el frontmatter' {
    Get-Row $script:Fechas '20260923-230500-task-0061-date' | Should -BeLike '| 2026-09-24 | 0061 |*'
  }

  It 'usa la carpeta si el campo no trae una fecha' {
    Get-Row $script:Fechas '20260923-231000-task-0062-plantilla' | Should -BeLike '| 2026-09-23 | 0062 |*'
  }
}

Describe 'Tolerancia de formato en el bloque de tiempo' {
  BeforeAll { $script:Tolerante = Invoke-Build (Join-Path $script:Fixtures 'tolerante') }

  It 'lee un patch.md escrito con las etiquetas largas del walkthrough' {
    Get-Row $script:Tolerante.Text '20260917-100000-patch-0000-etiqueta-larga' | Should -Be '| 2026-09-17 | 0000 | patch | 1.5 | 1.2 | 0.8 | — | — | — | 20260917-100000-patch-0000-etiqueta-larga |'
    $script:Tolerante.Warnings -join ' ' | Should -Not -Match 'etiqueta-larga'
  }

  It 'tolera el símbolo de aproximación delante de la cifra' {
    Get-Row $script:Tolerante.Text '20260918-100000-task-0015-aprox' | Should -Be '| 2026-09-18 | 0015 | docs | 3 | 2.5 | 0.83 | — | — | — | 20260918-100000-task-0015-aprox |'
    $script:Tolerante.Warnings -join ' ' | Should -Not -Match 'aprox'
  }
}
