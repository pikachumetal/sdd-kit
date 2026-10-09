BeforeAll {
  . (Join-Path $PSScriptRoot 'Resolve-Bash.ps1')
  $script:Bash = Resolve-Bash
  $script:Headless = Join-Path $PSScriptRoot 'headless'
  $script:BatteryJs = Join-Path $script:Headless 'battery.mjs'
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv
  $script:Node = node -e 'console.log(process.execPath)'

  $script:Table = @'
# Batería de juguete

| Id | Paso | Petición | Molde | Esperado | n | Umbral | Modelo | Procedencia |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| r1 | roadmap | Apunta lo del filtro. | salas | `sdd-kit:sdd-roadmap` | 2 | 2/2 | sonnet | toy |
| r2 | roadmap | Reordena el roadmap. | salas | `sdd-kit:sdd-roadmap` | 1 | 1/1 | opus | toy |
| f1 | feature | Añade un filtro. | salas | `sdd-kit:sdd-start-feature` | 1 | 1/1 | sonnet | toy |
| t1 | directa | Corrige la errata «Guadar», ¿vale? | salas | ninguna | 1 | 1/1 | sonnet | toy |
| d1 | duda | Hay que mejorar las reservas. | salas | ninguna | 2 | 1/2 | sonnet | toy |
'@

  function New-Battery([string]$Root) {
    $battery = Join-Path $Root 'battery'
    $kit = Join-Path $Root 'kit'
    New-Item -ItemType Directory -Force $battery, (Join-Path $kit 'skills/using-sdd'), (Join-Path $Root 'spec'), (Join-Path $Root 'scratchpad/runs') | Out-Null
    Set-Content -LiteralPath (Join-Path $kit 'skills/using-sdd/SKILL.md') -Value '# using-sdd'
    Set-Content -LiteralPath (Join-Path $battery 'battery.md') -Value $script:Table -Encoding utf8
    $lib = (Join-Path $script:Headless 'lib.sh') -replace '\\', '/'
    $js = $script:BatteryJs -replace '\\', '/'
    $subject = @"
#!/usr/bin/env bash
set -u
. "$lib"
subject_init "`$1" "`$2" "`$4" using-sdd
ASK="`$("`$NODE" "$js" field "`$(dirname "`$0")/battery.md" "`$3" Petición)"
g init -q -b main; put README.md <<< 'salas'; commit "feat: base"
subject_launch "`$ASK"
echo '## estado' | subject_save
"@
    Set-Content -LiteralPath (Join-Path $battery 'subject.sh') -Value $subject -NoNewline
    return [pscustomobject]@{ Root = $Root; Battery = $battery; Kit = $kit; Spec = Join-Path $Root 'spec'; Runs = Join-Path $Root 'scratchpad/runs' }
  }

  function Invoke-Battery($Battery, [hashtable]$Env) {
    $vars = @{
      NODE = $script:Node; DRY_RUN = '1'; BATTERY_DIR = $Battery.Battery; SPEC_DIR = $Battery.Spec; PHASE = 'battery'
      RUNS_DIR = $Battery.Runs; KIT_DIR = $Battery.Kit; SUBJECT_CAP = '20'; COST_CAP = '20'
    }
    foreach ($key in $Env.Keys) { $vars[$key] = $Env[$key] }
    $saved = @{}
    $encoding = [Console]::OutputEncoding
    [Console]::OutputEncoding = [Text.Encoding]::UTF8
    foreach ($key in $vars.Keys) { $saved[$key] = [Environment]::GetEnvironmentVariable($key); [Environment]::SetEnvironmentVariable($key, $vars[$key]) }
    try {
      $output = (& $script:Bash (Join-Path $script:Headless 'battery.sh') 2>&1) -join "`n"
      return [pscustomobject]@{ Output = $output; ExitCode = $LASTEXITCODE }
    } finally {
      [Console]::OutputEncoding = $encoding
      foreach ($key in $saved.Keys) { [Environment]::SetEnvironmentVariable($key, $saved[$key]) }
    }
  }

  function Invoke-Verdict([string]$TablePath, [string]$OutDir) {
    $encoding = [Console]::OutputEncoding
    [Console]::OutputEncoding = [Text.Encoding]::UTF8
    try {
      $output = (& $script:Node $script:BatteryJs verdict $TablePath $OutDir 2>&1) -join "`n"
      return [pscustomobject]@{ Output = $output; ExitCode = $LASTEXITCODE }
    } finally { [Console]::OutputEncoding = $encoding }
  }

  function Set-FinishedTools([string]$Path, [string]$Text) {
    Set-Content -LiteralPath $Path -Value "$Text`n=== RESULTADO (1 turnos, 0.1 $)"
  }

  function Get-ArgsFiles($Battery) { @(Get-ChildItem -Path (Join-Path $Battery.Runs 'battery/*.args') -ErrorAction SilentlyContinue | ForEach-Object Name | Sort-Object) }
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'Veredicto de una batería (tests/headless/battery.mjs)' -Tag 'Slow' {
  BeforeAll {
    $script:Toy = New-Battery (Join-Path $TestDrive 'verdict')
    $script:TablePath = Join-Path $script:Toy.Battery 'battery.md'
  }

  It 'verdict da verde y rojo por escenario' {
    $out = Join-Path $TestDrive 'verdict-out'
    New-Item -ItemType Directory -Force $out | Out-Null
    foreach ($label in 'r1-1', 'r1-2', 'r2-1') { Set-FinishedTools (Join-Path $out "$label.tools.txt") ">>> Skill: sdd-kit:sdd-roadmap" }
    Set-FinishedTools (Join-Path $out 'f1-1.tools.txt') ">>> Skill: sdd-kit:sdd-start-patch"
    Set-FinishedTools (Join-Path $out 't1-1.tools.txt') ">>> Edit: README.md"

    $run = Invoke-Verdict $script:TablePath $out

    $run.Output | Should -Match 'r1 · 2/2 · umbral 2/2 · verde'
    $run.Output | Should -Match 'f1 · 0/1 · umbral 1/1 · rojo'
    $run.Output | Should -Match 't1 · 1/1 · umbral 1/1 · verde'
    $run.ExitCode | Should -Be 1
  }

  It 'verdict no cuenta como puerta la invocación de using-sdd, que es el enrutador' {
    $out = Join-Path $TestDrive 'router-out'
    New-Item -ItemType Directory -Force $out | Out-Null
    Set-FinishedTools (Join-Path $out 'f1-1.tools.txt') ">>> Skill: sdd-kit:using-sdd`n>>> Skill: sdd-kit:sdd-start-feature"
    Set-FinishedTools (Join-Path $out 't1-1.tools.txt') ">>> Skill: sdd-kit:using-sdd`n>>> Edit: README.md"

    $run = Invoke-Verdict $script:TablePath $out

    $run.Output | Should -Match 'f1 · 1/1 · umbral 1/1 · verde'
    $run.Output | Should -Match 't1 · 1/1 · umbral 1/1 · verde'
  }

  It 'verdict cuenta como rojo un escenario con sujetos de menos' {
    $out = Join-Path $TestDrive 'missing-out'
    New-Item -ItemType Directory -Force $out | Out-Null
    Set-FinishedTools (Join-Path $out 'r1-1.tools.txt') ">>> Skill: sdd-kit:sdd-roadmap"
    Set-FinishedTools (Join-Path $out 'd1-1.tools.txt') ">>> Read: README.md"

    $run = Invoke-Verdict $script:TablePath $out

    $run.Output | Should -Match 'r1 · 1/2 · umbral 2/2 · rojo · faltan 1'
    $run.Output | Should -Match 'd1 · 1/2 · umbral 1/2 · rojo · faltan 1'
  }

  It 'verdict cuenta como faltan los sujetos que no terminaron, sin RESULTADO' {
    $out = Join-Path $TestDrive 'cut-out'
    New-Item -ItemType Directory -Force $out | Out-Null
    Set-Content (Join-Path $out 't1-1.tools.txt') ''
    Set-Content (Join-Path $out 'd1-1.tools.txt') ">>> Read: README.md`n=== RESULTADO (3 turnos, 0.07 $)"
    Set-Content (Join-Path $out 'd1-2.tools.txt') '>>> Read: README.md'

    $run = Invoke-Verdict $script:TablePath $out

    $run.Output | Should -Match 't1 · 0/1 · umbral 1/1 · rojo · faltan 1'
    $run.Output | Should -Match 'd1 · 1/2 · umbral 1/2 · rojo · faltan 1'
  }
}

Describe 'Lanzador de baterías (tests/headless/battery.sh)' -Tag 'Slow' {
  It 'battery.sh lanza solo el tramo pedido' {
    $toy = New-Battery (Join-Path $TestDrive 'step')

    $run = Invoke-Battery $toy @{ STEPS = 'roadmap' }

    Get-ArgsFiles $toy | Should -Be @('r1-1.args', 'r1-2.args', 'r2-1.args') -Because $run.Output
    $r1 = @(Get-Content (Join-Path $toy.Runs 'battery/r1-2.args'))
    $r1[[array]::IndexOf($r1, '--model') + 1] | Should -Be 'sonnet'
    $r2 = @(Get-Content (Join-Path $toy.Runs 'battery/r2-1.args'))
    $r2[[array]::IndexOf($r2, '--model') + 1] | Should -Be 'opus'
    $run.Output | Should -Match 'r1 · 0/2 · umbral 2/2 · rojo'
  }

  It 'battery.sh rechaza un paso desconocido' {
    $toy = New-Battery (Join-Path $TestDrive 'unknown')

    $run = Invoke-Battery $toy @{ STEPS = 'nope' }

    $run.ExitCode | Should -Not -Be 0
    $run.Output | Should -Match 'paso desconocido: nope'
    Get-ArgsFiles $toy | Should -BeNullOrEmpty
  }

  It 'la batería de using-sdd monta su molde con el marcador del kit' {
    $root = Join-Path $TestDrive 'using-sdd'
    $kit = Join-Path $root 'kit'
    $migrations = Join-Path $kit 'skills/sdd-init-brownfield/references/migrations'
    New-Item -ItemType Directory -Force $migrations, (Join-Path $kit 'skills/using-sdd'), (Join-Path $kit '.claude-plugin'), (Join-Path $root 'spec'), (Join-Path $root 'scratchpad/runs') | Out-Null
    Set-Content (Join-Path $kit 'skills/using-sdd/SKILL.md') '# using-sdd'
    Set-Content (Join-Path $kit '.claude-plugin/plugin.json') '{"name":"sdd-kit","version":"2.2.0"}'
    Set-Content (Join-Path $migrations 'v2.3.0.md') '# v2.3.0'
    $real = [pscustomobject]@{ Battery = (Join-Path $PSScriptRoot 'batteries/using-sdd'); Kit = $kit; Spec = Join-Path $root 'spec'; Runs = Join-Path $root 'scratchpad/runs' }

    $run = Invoke-Battery $real @{ STEPS = 'sdd-config sdd-propose' }

    Get-ArgsFiles $real | Should -Be @('bt1-1.args', 'bt1-2.args', 'c1w-1.args', 'c2-1.args', 'c2-2.args', 'f1-1.args', 'f2-1.args', 'f3-1.args', 'p1-1.args', 'pc1-1.args', 'pc1-2.args', 's1-1.args', 's1-2.args', 't1-1.args', 'v1-1.args', 'v1-2.args') -Because $run.Output
    foreach ($label in 's1-1', 'v1-1') {
      Get-Content -Raw (Join-Path $real.Runs "battery/$label/repo/.docs/sdd/sdd-kit.json") | Should -Match '^\{"version": "2\.3\.0", "channel": "plugin"'
    }
    Join-Path $real.Runs 'battery/s1-1/repo/src/app.js' | Should -Exist
    Join-Path $real.Runs 'battery/v1-1/repo/pages/pedido-detalle.html' | Should -Exist
    @(Get-Content (Join-Path $real.Runs 'battery/v1-1.args') -Encoding utf8)[-1] | Should -Match '^Pon Guardar y Cancelar'
  }

  It 'la petición llega intacta con comillas latinas y tildes' {
    $toy = New-Battery (Join-Path $TestDrive 'accents')

    $run = Invoke-Battery $toy @{ STEPS = 'directa' }

    $claudeArgs = @(Get-Content (Join-Path $toy.Runs 'battery/t1-1.args') -Encoding utf8)
    $claudeArgs[-1] | Should -BeExactly 'Corrige la errata «Guadar», ¿vale?' -Because $run.Output
  }
}
