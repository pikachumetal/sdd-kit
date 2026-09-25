BeforeAll {
  $script:Script = Join-Path $PSScriptRoot '../skills/sdd-templates/scripts/Measure-SessionTokens.ps1'
  $script:Fixtures = Join-Path $PSScriptRoot 'fixtures/session-tokens'
  $script:Sonnet = @{ input = 2; cacheWrite5m = 2.5; cacheWrite1h = 4; cacheRead = 0.2; output = 10 }
  $script:Opus = @{ input = 4; cacheWrite5m = 5; cacheWrite1h = 8; cacheRead = 0.2; output = 20 }

  function New-Worktree([string[]]$Sets, [hashtable]$Prices) {
    $worktree = Join-Path $TestDrive "wt-$([guid]::NewGuid().ToString('N').Substring(0, 8))"
    New-Item -ItemType Directory -Path $worktree | Out-Null
    $projects = Join-Path $TestDrive "projects-$([guid]::NewGuid().ToString('N').Substring(0, 8))"
    $folder = Join-Path $projects ($worktree -replace '[^A-Za-z0-9]', '-')
    New-Item -ItemType Directory -Path $folder | Out-Null
    foreach ($set in $Sets) { Copy-Item -Path (Join-Path $script:Fixtures "$set/*") -Destination $folder -Recurse }
    if ($null -ne $Prices) { Write-Pricing $worktree $Prices }
    return [pscustomobject]@{ Path = $worktree; Projects = $projects; Folder = $folder }
  }

  function Write-Pricing([string]$Worktree, [hashtable]$Prices) {
    $docs = Join-Path $Worktree '.docs/sdd'
    New-Item -ItemType Directory -Path $docs -Force | Out-Null
    $config = @{ version = '1.1.0'; pricing = @{ source = 'fixture'; updated = '2026-09-25'; usdPerMillionTokens = $Prices } }
    $config | ConvertTo-Json -Depth 5 | Set-Content (Join-Path $docs 'sdd-kit.json')
  }

  function Invoke-Measure([object]$Worktree, [string]$Branch) {
    $arguments = @{ Path = $Worktree.Path; ProjectsRoot = $Worktree.Projects }
    if ($Branch) { $arguments.Branch = $Branch }
    return (& $script:Script @arguments 6>$null | Out-String) -replace "`r`n", "`n"
  }

  function Get-Line([string]$Output, [string]$Label) {
    return ($Output -split "`n" | Where-Object { $_ -like "- ${Label}:*" } | Select-Object -First 1)
  }
}

Describe 'Measure-SessionTokens.ps1' {
  Context 'una sesión con un subagente y precios de los dos modelos' {
    BeforeAll {
      $script:Worktree = New-Worktree @('base') @{ 'claude-sonnet-5' = $script:Sonnet; 'claude-opus-5-5' = $script:Opus }
      $script:Output = Invoke-Measure $script:Worktree
    }

    It 'suma el hilo con el máximo de cada categoría por message.id' {
      Get-Line $script:Output 'Tokens del hilo' | Should -Be '- Tokens del hilo: 2.605.005 — claude-sonnet-5 2.605.005'
    }

    It 'desglosa la fila del hilo por categoría' {
      $script:Output | Should -Match '(?m)^\| Hilo \| claude-sonnet-5 \| 5 \| 0 \| 100\.000 \| 2\.500\.000 \| 5\.000 \| 2\.605\.005 \| 0,95 \|$'
    }

    It 'no cuenta las líneas <synthetic>' {
      $script:Output | Should -Not -Match '<synthetic>'
    }

    It 'da la línea de subagentes con descripción, modelo real, tokens y minutos' {
      Get-Line $script:Output 'Tokens de subagentes' | Should -Be '- Tokens de subagentes: 510.010 en 1 despacho — Revisión final de rama claude-opus-5-5 510.010 / 12 min'
    }

    It 'deja los tokens del subagente fuera del hilo' {
      $script:Output | Should -Match '(?m)^\| Subagentes \| claude-opus-5-5 \| 10 \| 0 \| 0 \| 500\.000 \| 10\.000 \| 510\.010 \| 0,30 \|$'
    }

    It 'calcula el coste de la sesión con la tabla de precios' {
      Get-Line $script:Output 'Coste de la sesión' | Should -Be '- Coste de la sesión: 1,25 $ (hilo 0,95 $ + subagentes 0,30 $)'
    }
  }

  Context 'sin precio' {
    It 'dice sin precio si falta la clave pricing' {
      $output = Invoke-Measure (New-Worktree @('base') $null)
      Get-Line $output 'Coste de la sesión' | Should -Be '- Coste de la sesión: sin precio (sin tabla pricing en sdd-kit.json)'
    }

    It 'dice sin precio y nombra el modelo que falta en la tabla' {
      $output = Invoke-Measure (New-Worktree @('base') @{ 'claude-sonnet-5' = $script:Sonnet })
      Get-Line $output 'Coste de la sesión' | Should -Be '- Coste de la sesión: sin precio (modelos sin precio: claude-opus-5-5)'
    }

    It 'cuenta el fast mode con su propio modelo, que necesita fila' {
      $output = Invoke-Measure (New-Worktree @('fast') @{ 'claude-sonnet-5' = $script:Sonnet })
      Get-Line $output 'Coste de la sesión' | Should -Be '- Coste de la sesión: sin precio (modelos sin precio: claude-sonnet-5:fast)'
    }
  }

  Context 'filtro de rama' {
    BeforeAll { $script:TwoBranches = New-Worktree @('base', 'other-branch') $null }

    It 'con -Branch solo cuenta las líneas de esa rama' {
      Get-Line (Invoke-Measure $script:TwoBranches 'feature/0068') 'Tokens del hilo' | Should -Be '- Tokens del hilo: 2.605.005 — claude-sonnet-5 2.605.005'
    }

    It 'sin -Branch cuenta todas las sesiones de la carpeta' {
      Get-Line (Invoke-Measure $script:TwoBranches) 'Tokens del hilo' | Should -Be '- Tokens del hilo: 3.505.005 — claude-sonnet-5 3.505.005'
    }
  }

  Context 'no medido' {
    It 'sin carpeta de transcripts las tres líneas dicen no medido y sale con 0' {
      $worktree = Join-Path $TestDrive 'sin-transcripts'
      $projects = Join-Path $TestDrive 'projects-vacio'
      $output = pwsh -NoProfile -File $script:Script -Path $worktree -ProjectsRoot $projects
      $LASTEXITCODE | Should -Be 0
      $reason = "no medido (sin transcripts de Claude Code para $worktree)"
      ($output -join "`n") | Should -Match ([regex]::Escape("- Tokens del hilo: $reason"))
      ($output -join "`n") | Should -Match ([regex]::Escape("- Tokens de subagentes: $reason"))
      ($output -join "`n") | Should -Match ([regex]::Escape("- Coste de la sesión: $reason"))
    }

    It 'con carpeta pero sin respuestas de la rama dice no medido con la rama' {
      $output = Invoke-Measure (New-Worktree @('base') $null) 'feature/otra'
      Get-Line $output 'Tokens del hilo' | Should -Be '- Tokens del hilo: no medido (sin respuestas de feature/otra en los transcripts)'
      Get-Line $output 'Coste de la sesión' | Should -Be '- Coste de la sesión: no medido (sin respuestas de feature/otra en los transcripts)'
    }
  }

  Context 'sin subagentes' {
    BeforeAll {
      $worktree = New-Worktree @() @{ 'claude-sonnet-5' = $script:Sonnet }
      Copy-Item (Join-Path $script:Fixtures 'base/s1.jsonl') $worktree.Folder
      $script:NoAgents = Invoke-Measure $worktree
    }

    It 'la línea de subagentes dice no aplica' {
      Get-Line $script:NoAgents 'Tokens de subagentes' | Should -Be '- Tokens de subagentes: no aplica'
    }

    It 'el coste lleva solo el hilo' {
      Get-Line $script:NoAgents 'Coste de la sesión' | Should -Be '- Coste de la sesión: 0,95 $ (hilo 0,95 $)'
    }
  }

  Context 'entradas que la spec no nombra' {
    It 'sin meta.json el despacho se nombra por su fichero' {
      $worktree = New-Worktree @('base') $null
      Remove-Item (Join-Path $worktree.Folder 's1/subagents/agent-x1.meta.json')
      Get-Line (Invoke-Measure $worktree) 'Tokens de subagentes' | Should -BeLike '*— agent-x1 claude-opus-5-5 510.010 / 12 min'
    }

    It 'una ruta con separador final resuelve la misma carpeta' {
      $worktree = New-Worktree @('base') $null
      $worktree.Path = $worktree.Path + [System.IO.Path]::DirectorySeparatorChar
      Get-Line (Invoke-Measure $worktree) 'Tokens del hilo' | Should -Be '- Tokens del hilo: 2.605.005 — claude-sonnet-5 2.605.005'
    }

    It 'escribe UTF-8 cuando la salida va redirigida a otro proceso' {
      $worktree = New-Worktree @('base') $null
      $stdout = Join-Path $TestDrive 'stdout.txt'
      $command = "[Console]::OutputEncoding = [System.Text.Encoding]::Latin1; & '$($script:Script)' -Path '$($worktree.Path)' -ProjectsRoot '$($worktree.Projects)'"
      Start-Process pwsh -ArgumentList @('-NoProfile', '-Command', $command) -RedirectStandardOutput $stdout -NoNewWindow -Wait
      [System.IO.File]::ReadAllText($stdout, [System.Text.UTF8Encoding]::new($false, $true)) | Should -Match '2\.605\.005 — claude-sonnet-5'
    }

    It 'sin desglose de cache_creation la escritura cuenta como de 5 minutos' {
      $output = Invoke-Measure (New-Worktree @('legacy') $null)
      $output | Should -Match '(?m)^\| Hilo \| claude-sonnet-5 \| 0 \| 1\.000 \| 0 \| 0 \| 0 \| 1\.000 \| sin precio \|$'
    }
  }
}
