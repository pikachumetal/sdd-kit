BeforeAll {
  . (Join-Path $PSScriptRoot 'Resolve-Bash.ps1')
  $script:Bash = Resolve-Bash
  $script:Headless = Join-Path $PSScriptRoot 'headless'
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv
  # El ejecutable real: un shim de node (proto) necesita el home verdadero para arrancar (patch 0072).
  $script:Node = node -e 'console.log(process.execPath)'

  # Una campaña mínima: un subject.sh que usa lib.sh y un molde de un commit, en seco (DRY_RUN=1).
  function New-Campaign([string]$Root, [string]$KeepName = 'readme.md', [string]$Init = 'g init -q -b main; ') {
    $spec = Join-Path $Root 'spec'
    $runs = Join-Path $Root 'scratchpad/runs'
    $kit = Join-Path $Root 'kit'
    New-Item -ItemType Directory -Force (Join-Path $spec 'red'), $runs, (Join-Path $kit 'skills/sdd-plan') | Out-Null
    Set-Content -LiteralPath (Join-Path $kit 'skills/sdd-plan/SKILL.md') -Value '# sdd-plan'
    $lib = (Join-Path $script:Headless 'lib.sh') -replace '\\', '/'
    $subject = @"
#!/usr/bin/env bash
set -u
. "$lib"
subject_init "`$1" "`$2" "`$4" sdd-plan
put README.md <<< 'salas'
${Init}commit "feat: base"
subject_launch "Invoca la skill sdd-kit:sdd-plan."
{ echo "## home: `$HOME/.claude"; echo "-rw-r--r-- 1 alice 197609 12 f"; } | subject_save
subject_keep "`$R/README.md" $KeepName
"@
    Set-Content -LiteralPath (Join-Path $spec 'red/subject.sh') -Value $subject -NoNewline
    return [pscustomobject]@{ Spec = $spec; Runs = $runs; Kit = $kit; Out = Join-Path $spec 'red/out' }
  }

  function Invoke-Campaign($Campaign, [hashtable]$Env) {
    $vars = @{
      USERPROFILE = 'C:\Users\alice'; HOME = '/c/Users/alice'; NODE = $script:Node; DRY_RUN = '1'
      SPEC_DIR = $Campaign.Spec; RUNS_DIR = $Campaign.Runs; KIT_DIR = $Campaign.Kit
      SUBJECT_SH = Join-Path $Campaign.Spec 'red/subject.sh'; SCENARIOS = 'a b c'; SUBJECT_CAP = '10'; COST_CAP = '10'
    }
    foreach ($key in $Env.Keys) { $vars[$key] = $Env[$key] }
    $saved = @{}
    # Sin UTF-8, la salida de bash se decodifica con la página de códigos de la consola y pierde las tildes.
    $encoding = [Console]::OutputEncoding
    [Console]::OutputEncoding = [Text.Encoding]::UTF8
    foreach ($key in $vars.Keys) { $saved[$key] = [Environment]::GetEnvironmentVariable($key); [Environment]::SetEnvironmentVariable($key, $vars[$key]) }
    try {
      $output = (& $script:Bash (Join-Path $script:Headless 'run.sh') 2>&1) -join "`n"
      return [pscustomobject]@{ Output = $output; ExitCode = $LASTEXITCODE }
    } finally {
      [Console]::OutputEncoding = $encoding
      foreach ($key in $saved.Keys) { [Environment]::SetEnvironmentVariable($key, $saved[$key]) }
    }
  }

  function Get-Subjects($Campaign) { @(Get-ChildItem -Path (Join-Path $Campaign.Spec '*/out/*.tools.txt') -ErrorAction SilentlyContinue) }
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
}

# Slow porque cada caso arranca bash, git y node por sujeto.
Describe 'Lanzador de referencia de sujetos headless (tests/headless/run.sh)' -Tag 'Slow' {
  It 'lanza en seco y deja las salidas planas y sin el home ni el usuario' {
    $campaign = New-Campaign (Join-Path $TestDrive 'dry')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    foreach ($name in 'a-1.state.txt', 'a-1.tools.txt', 'a-1.texts.txt', 'a-1/readme.md') {
      Join-Path $campaign.Out $name | Should -Exist
    }
    $all = (Get-ChildItem -LiteralPath $campaign.Out -File -Recurse | Get-Content -Raw) -join "`n"
    $all | Should -Not -Match '\balice\b'
    $all | Should -Match '<home>/\.claude'
    $all | Should -Match '=== RESULTADO \(1 turnos, 0\.5 \$\)'
    # El scratchpad cuelga de %TEMP%, que Git Bash escribe /tmp/…; node recibe la forma C:/… (conversión de MSYS).
    Get-Content -Raw (Join-Path $campaign.Out 'a-1.tools.txt') | Should -Match '>>> Bash: ls <run>/repo'
  }

  It 'con SPEC_DIR relativo guarda las salidas y las cuenta (tickets 0077 §2 y 0064 §1)' {
    $root = Join-Path $TestDrive 'relative'
    $campaign = New-Campaign $root

    Push-Location $root
    try { $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SPEC_DIR = 'spec' } } finally { Pop-Location }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Join-Path $campaign.Out 'a-1.tools.txt' | Should -Exist
    $run.Output | Should -Match 'sujetos de la campaña: 1 '
  }

  It 'el sujeto ve la identidad fixture en git config, no la de la máquina (ticket del patch 0080 §2)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'identity')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Get-Content -Raw (Join-Path $campaign.Out 'a-1.texts.txt') | Should -Match 'git: Fixture <fixture@example\.com>'
  }

  It 'suma EXTRA_ALLOWED a las herramientas permitidas del sujeto (task 0077)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'allowed')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; EXTRA_ALLOWED = 'mcp__plugin_playwright_playwright' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Get-Content -Raw (Join-Path $campaign.Out 'a-1.texts.txt') | Should -Match 'permitidas extra: mcp__plugin_playwright_playwright'
  }

  It 'con SUPERPOWERS_DIR aísla al sujeto de la configuración del usuario y carga superpowers desde esa ruta (feature 0074)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'isolated')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SUPERPOWERS_DIR = 'C:/sp/6.4.1' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $claudeArgs = @(Get-Content (Join-Path $campaign.Runs 'red/a-1.args'))
    $sources = [array]::IndexOf($claudeArgs, '--setting-sources')
    $sources | Should -BeGreaterThan -1
    $claudeArgs[$sources + 1] | Should -BeExactly ''
    $claudeArgs | Should -Contain 'C:/sp/6.4.1'
    $claudeArgs[[array]::IndexOf($claudeArgs, 'C:/sp/6.4.1') - 1] | Should -Be '--plugin-dir'
  }

  It 'sin SUPERPOWERS_DIR no aísla al sujeto' {
    $campaign = New-Campaign (Join-Path $TestDrive 'not-isolated')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $argsFile = Join-Path $campaign.Runs 'red/a-1.args'
    $argsFile | Should -Exist
    Get-Content $argsFile | Should -Not -Contain '--setting-sources'
  }

  It 'aborta si SETTINGS no deshabilita el kit instalado' {
    $campaign = New-Campaign (Join-Path $TestDrive 'settings')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SETTINGS = '{"enabledPlugins":{}}' }

    $run.Output | Should -Match 'SETTINGS sin deshabilitar el kit instalado'
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'no pasa de SUBJECT_CAP sujetos' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cap')

    $run = Invoke-Campaign $campaign @{ SUBJECT_CAP = '2' }

    $run.Output | Should -Match 'techo de 2 sujetos'
    (Get-Subjects $campaign).Count | Should -Be 2
  }

  It 'no lanza si el coste de la campaña, sumando todas las fases, llega a COST_CAP' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cost')
    New-Item -ItemType Directory -Force (Join-Path $campaign.Spec 'green/out') | Out-Null
    # Dos eventos result: cuenta solo el último (task 0055).
    Set-Content -LiteralPath (Join-Path $campaign.Spec 'green/out/x-1.tools.txt') -Value "=== RESULTADO (3 turnos, 9 $)`n=== RESULTADO (4 turnos, 4.5 $)"

    $run = Invoke-Campaign $campaign @{ COST_CAP = '4' }

    $run.Output | Should -Match 'techo de 4 \$ alcanzado \(4\.50 \$\)'
    (Get-Subjects $campaign).Count | Should -Be 1
  }

  It 'dos fases con el mismo RUNS_DIR no comparten molde ni stream (ticket del patch 0082 §1)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'phases')
    Copy-Item -Recurse (Join-Path $campaign.Spec 'red') (Join-Path $campaign.Spec 'green')

    # En secuencia basta: con la ruta sin fase, la segunda borraba el molde de la primera (rm -rf en subject_init).
    foreach ($phase in 'red', 'green') {
      $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; PHASE = $phase; SUBJECT_SH = Join-Path $campaign.Spec "$phase/subject.sh" }
      $run.ExitCode | Should -Be 0 -Because $run.Output
    }

    foreach ($phase in 'red', 'green') {
      Join-Path $campaign.Runs "$phase/a-1/repo/README.md" | Should -Exist
      Join-Path $campaign.Runs "$phase/a-1.jsonl" | Should -Exist
    }
  }

  It 'para a petición si existe el fichero stop en RUNS_DIR' {
    $campaign = New-Campaign (Join-Path $TestDrive 'stop')
    New-Item -ItemType File (Join-Path $campaign.Runs 'stop') | Out-Null

    $run = Invoke-Campaign $campaign @{}

    $run.Output | Should -Match 'parada a petición'
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'aborta con RUNS_DIR fuera del scratchpad' {
    $campaign = New-Campaign (Join-Path $TestDrive 'outside')
    $outside = Join-Path $TestDrive 'runs'
    New-Item -ItemType Directory -Force $outside | Out-Null

    $run = Invoke-Campaign $campaign @{ RUNS_DIR = $outside }

    $run.ExitCode | Should -Not -Be 0
    $run.Output | Should -Match 'fuera del scratchpad'
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'aborta antes de escribir si el molde no es su propio repo git (ticket 0086 §1)' {
    # El %TEMP% de aquel sujeto colgaba de un repo: sin g init, git subía hasta él y le cambió el HEAD.
    $root = Join-Path $TestDrive 'nested'
    New-Item -ItemType Directory -Force $root | Out-Null
    git -C $root init -q -b main
    $campaign = New-Campaign $root -Init ''

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.Output | Should -Match 'no es su propio repo git'
    git -C $root rev-parse -q --verify HEAD | Should -BeNullOrEmpty
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'guarda solo copias planas: una ruta con carpetas crece hasta pasar de 140 caracteres (task 0062)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'flat') 'specs/0001/spec.md'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.Output | Should -Match 'copia plana'
    Join-Path $campaign.Out 'a-1/specs' | Should -Not -Exist
  }

  It 'exige SUBJECT_CAP y COST_CAP, que salen de la previsión de la spec' {
    $campaign = New-Campaign (Join-Path $TestDrive 'caps')

    $run = Invoke-Campaign $campaign @{ SUBJECT_CAP = $null }

    $run.ExitCode | Should -Not -Be 0
    (Get-Subjects $campaign).Count | Should -Be 0
  }
}
