BeforeAll {
  . (Join-Path $PSScriptRoot 'Resolve-Bash.ps1')
  $script:Bash = Resolve-Bash
  $script:Headless = Join-Path $PSScriptRoot 'headless'
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv
  # El ejecutable real: un shim de node (proto) necesita el home verdadero para arrancar (patch 0072).
  $script:Node = node -e 'console.log(process.execPath)'

  # Una campaña mínima: un subject.sh que usa lib.sh y un molde de un commit, en seco (DRY_RUN=1).
  function New-Campaign([string]$Root, [string]$KeepName = 'readme.md', [string]$Init = 'g init -q -b main; ', [string]$Launch = 'subject_launch "Invoca la skill sdd-kit:sdd-plan."') {
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
$Launch
{ echo "## home: `$HOME/.claude"; echo "-rw-r--r-- 1 alice 197609 12 f"; } | subject_save
subject_keep "`$R/README.md" $KeepName
"@
    Set-Content -LiteralPath (Join-Path $spec 'red/subject.sh') -Value $subject -NoNewline
    return [pscustomobject]@{ Spec = $spec; Runs = $runs; Kit = $kit; Out = Join-Path $runs 'dry/red/out'; Dry = Join-Path $runs 'dry' }
  }

  # Un claude falso que no gasta: imprime el result mínimo de un stream, tras ejecutar $Before.
  function New-FakeClaude([string]$Name, [string]$Before = '') {
    $bin = Join-Path $TestDrive "bin-$Name"
    New-Item -ItemType Directory -Force $bin | Out-Null
    $stream = "echo '{`"type`":`"result`",`"num_turns`":1,`"total_cost_usd`":0.5,`"result`":`"hecho`"}'"
    Set-Content -LiteralPath (Join-Path $bin 'claude') -Value "#!/usr/bin/env bash`n$Before`n$stream" -NoNewline
    return $bin
  }

  # Cada sujeto apunta cuántos hay a la vez en conc.log, junto a RUNS_DIR, y dura 4 s.
  $script:Concurrent = 'C="$RUNS_DIR/../conc"; mkdir -p "$C"; touch "$C/$2"; ls "$C" | wc -l >> "$C.log"; ls "$RUNS_DIR/dry/live" >> "$C.live"; sleep 4; rm "$C/$2"; subject_launch "x"'

  function Get-MaxConcurrent($Campaign) {
    (Get-Content (Join-Path $Campaign.Runs '../conc.log') | ForEach-Object { [int]$_.Trim() } | Measure-Object -Maximum).Maximum
  }

  function Set-Tools([string]$Dir, [string]$Label, [string]$Text) {
    New-Item -ItemType Directory -Force $Dir | Out-Null
    Set-Content -LiteralPath (Join-Path $Dir "$Label.tools.txt") -Value $Text
  }

  function Invoke-Campaign($Campaign, [hashtable]$Env, [string]$Command) {
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
      $output = if ($Command) { (& $script:Bash -c $Command 2>&1) -join "`n" } else { (& $script:Bash (Join-Path $script:Headless 'run.sh') 2>&1) -join "`n" }
      return [pscustomobject]@{ Output = $output; ExitCode = $LASTEXITCODE }
    } finally {
      [Console]::OutputEncoding = $encoding
      foreach ($key in $saved.Keys) { [Environment]::SetEnvironmentVariable($key, $saved[$key]) }
    }
  }

  function Get-Subjects($Campaign) {
    @(Get-ChildItem -Path (Join-Path $Campaign.Spec '*/out/*.tools.txt'), (Join-Path $Campaign.Dry '*/out/*.tools.txt') -ErrorAction SilentlyContinue)
  }
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
    $bin = New-FakeClaude 'relative'

    Push-Location $root
    try { $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SPEC_DIR = 'spec'; DRY_RUN = $null; PATH = "$bin;$env:PATH" } } finally { Pop-Location }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Join-Path $campaign.Spec 'red/out/a-1.tools.txt' | Should -Exist
    $run.Output | Should -Match 'sujetos de la campaña: 1 '
  }

  It 'en seco deja las salidas en RUNS_DIR/dry y nada en SPEC_DIR (ticket de la feature 0115 §9)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'dry-out')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $run.Output | Should -Not -Match 'No such file or directory'
    Join-Path $campaign.Spec 'red/out' | Should -Not -Exist
    Join-Path $campaign.Runs 'dry/red/out/a-1.tools.txt' | Should -Exist
    $run.Output | Should -Match 'en seco: salidas en .*dry/red/out'
  }

  It 'en seco no cuenta las salidas de SPEC_DIR' {
    $campaign = New-Campaign (Join-Path $TestDrive 'dry-count')
    Set-Tools (Join-Path $campaign.Spec 'green/out') 'x-1' '=== RESULTADO (1 turnos, 9 $)'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; COST_CAP = '4' }

    $run.Output | Should -Match 'coste acumulado: 0\.50 \$'
  }

  It 'al acabar da el coste por carpeta de salida (ticket de la feature 0168 §4)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'folders')
    Set-Tools (Join-Path $campaign.Dry 'green-premature/out') 'x-1' '=== RESULTADO (2 turnos, 0.9 $)'
    Set-Tools (Join-Path $campaign.Dry 'green/out') 'y-1' '>>> Bash: ls'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.Output | Should -Match 'red: 1 sujetos · 0\.50 \$' -Because $run.Output
    $run.Output | Should -Match 'green-premature: 1 sujetos · 0\.90 \$'
    $run.Output | Should -Match 'green: 1 sujetos · 0\.00 \$ · 1 sin RESULTADO'
    $run.Output | Should -Match 'coste acumulado: 1\.40 \$'
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

  It 'sin SUPERPOWERS_DIR aborta antes del primer claude -p si el kit declara dependencies (ticket de la feature 0095 §2)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'dependencies')
    New-Item -ItemType Directory -Force (Join-Path $campaign.Kit '.claude-plugin') | Out-Null
    Set-Content -LiteralPath (Join-Path $campaign.Kit '.claude-plugin/plugin.json') -Value '{"name":"sdd-kit","dependencies":[{"name":"superpowers"}]}'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.Output | Should -Match 'define SUPERPOWERS_DIR'
    Join-Path $campaign.Runs 'red/a-1.args' | Should -Not -Exist
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'deja al sujeto leer su carpeta de ejecución, junto al molde (ticket de la feature 0099 §4)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'add-dir')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $claudeArgs = @(Get-Content (Join-Path $campaign.Runs 'red/a-1.args'))
    $dirs = for ($i = 0; $i -lt $claudeArgs.Count - 1; $i++) { if ($claudeArgs[$i] -eq '--add-dir') { $claudeArgs[$i + 1] } }
    # Ruta Windows, como la del kit: con la de Git Bash, claude no resolvía el --plugin-dir (task 0009).
    @($dirs) -match '^[A-Za-z]:/.*/red/a-1$' | Should -HaveCount 1
  }

  It 'con SUBJECT_TIMEOUT corta al sujeto encallado y sigue con el siguiente escenario (ticket de la feature 0098 §4)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'timeout')
    $bin = Join-Path $TestDrive 'bin'
    New-Item -ItemType Directory -Force $bin | Out-Null
    # Un claude falso que se encalla: el tope tiene que alcanzar al ejecutable, no a un builtin (timeout 720 command claude falló).
    Set-Content -LiteralPath (Join-Path $bin 'claude') -Value "#!/usr/bin/env bash`nexec sleep 60" -NoNewline

    $clock = [Diagnostics.Stopwatch]::StartNew()
    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a b'; DRY_RUN = $null; SUBJECT_TIMEOUT = '3'; PATH = "$bin;$env:PATH" }
    $clock.Stop()

    $clock.Elapsed.TotalSeconds | Should -BeLessThan 40 -Because $run.Output
    $run.Output | Should -Match 'tope de 3 s'
    (Get-Subjects $campaign).Count | Should -Be 2
  }

  It 'el sujeto no puede lanzar su propio claude: su coste no lo vería run.sh (walkthrough de la feature 0173)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'nested-claude')
    $log = Join-Path $TestDrive 'nested.log'
    # La guarda evita que, sin el bloqueo, el claude falso se llame a sí mismo sin fin.
    $nested = '[ -n "${FAKE_NESTED:-}" ] && { echo "claude sin bloquear"; exit 0; }; export FAKE_NESTED=1; claude --version > "$NESTED_LOG" 2>&1; echo "rc=$?" >> "$NESTED_LOG"'
    $bin = New-FakeClaude 'nested' $nested

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; DRY_RUN = $null; PATH = "$bin;$env:PATH"; NESTED_LOG = $log }

    Get-Content -Raw $log | Should -Match 'claude anidado bloqueado en un sujeto: run\.sh no ve su coste' -Because $run.Output
    Get-Content -Raw $log | Should -Match 'rc=1'
  }

  It 'aborta si SETTINGS no deshabilita el kit instalado' {
    $campaign = New-Campaign (Join-Path $TestDrive 'settings')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SETTINGS = '{"enabledPlugins":{}}' }

    $run.Output | Should -Match 'SETTINGS sin deshabilitar el kit instalado'
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'el SETTINGS por defecto carga deny-kill.mjs (walkthrough de la feature 0168 §5)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'deny-default')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Get-Content -Raw (Join-Path $campaign.Runs 'red/a-1.args') | Should -Match 'tests/headless/deny-kill\.mjs'
  }

  It 'aborta si SETTINGS no carga deny-kill.mjs' {
    $campaign = New-Campaign (Join-Path $TestDrive 'deny-missing')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SETTINGS = '{"enabledPlugins":{"sdd-kit@sdd-kit":false}}' }

    $run.Output | Should -Match 'SETTINGS sin el hook deny-kill\.mjs: añade \$DENY_KILL_HOOK a sus PreToolUse'
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'acepta un SETTINGS propio que lleva el hook' {
    $campaign = New-Campaign (Join-Path $TestDrive 'deny-own')
    $hook = (Join-Path $script:Headless 'deny-kill.mjs') -replace '\\', '/'
    $settings = '{"enabledPlugins":{"sdd-kit@sdd-kit":false},"hooks":{"PreToolUse":[{"matcher":"Edit","hooks":[{"type":"command","command":"node other.mjs"}]},{"matcher":"Bash|PowerShell","hooks":[{"type":"command","command":"node \"' + $hook + '\""}]}]}}'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SETTINGS = $settings }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    (Get-Subjects $campaign).Count | Should -Be 1
  }

  It 'para al acabar lo que escucha en los puertos del sujeto (ticket de la feature 0036 §3)' {
    $probe = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 0)
    $probe.Start(); $port = $probe.LocalEndpoint.Port; $probe.Stop()
    $script = Join-Path $TestDrive 'server.mjs'
    Set-Content -LiteralPath $script -Value "import { createServer } from 'node:http'; createServer().listen(Number(process.argv[2]));"
    $server = "PORT=$port; `"`$NODE`" '$($script -replace '\\', '/')' `"`$PORT`" > /dev/null 2>&1 & for i in `$(seq 50); do (: < /dev/tcp/127.0.0.1/`$PORT) 2>/dev/null && break; sleep 0.1; done; "
    $campaign = New-Campaign (Join-Path $TestDrive 'ports') -Launch ($server + 'subject_launch "x"')

    try {
      $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

      $run.ExitCode | Should -Be 0 -Because $run.Output
      Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Should -BeNullOrEmpty
      Get-Content -Raw (Join-Path $campaign.Runs 'red/a-1.err') | Should -Match "puertos del sujeto: $port · escuchando al acabar: $port" -Because $run.Output
    } finally {
      Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force -ErrorAction SilentlyContinue }
    }
  }

  It 'no para lo que ya escuchaba en un puerto del stream antes del sujeto (revisión final de la feature 0214)' {
    $listener = [Net.Sockets.TcpListener]::new([Net.IPAddress]::Loopback, 0)
    $listener.Start()
    $port = $listener.LocalEndpoint.Port
    $campaign = New-Campaign (Join-Path $TestDrive 'foreign-port') -Launch "PORT=$port; subject_launch `"x`""

    try {
      $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

      $run.ExitCode | Should -Be 0 -Because $run.Output
      Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue | Should -Not -BeNullOrEmpty
      Get-Content -Raw (Join-Path $campaign.Runs 'red/a-1.err') | Should -Match "puertos del sujeto: $port · escuchando al acabar: ninguno" -Because $run.Output
    } finally { $listener.Stop() }
  }

  It 'subject_save no deja el estado si la salida lleva la identidad de git de la máquina (ticket de la feature 0160)' {
    $config = Join-Path $TestDrive 'machine.gitconfig'
    Set-Content -LiteralPath $config -Value "[user]`n`tname = Alice Liddell" -Encoding utf8NoBOM
    $campaign = New-Campaign (Join-Path $TestDrive 'identity-leak') -Launch 'subject_launch "x"; echo "aprobada por Alice Liddell" | subject_save; exit 0'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; GIT_CONFIG_GLOBAL = $config }

    $run.Output | Should -Match 'el stream sigue en'
    $run.Output | Should -Not -Match 'Alice Liddell'
    Join-Path $campaign.Out 'a-1.state.txt' | Should -Not -Exist
    Join-Path $campaign.Out 'a-1.tools.txt' | Should -Exist -Because 'sin tools.txt, run.sh no cuenta el coste del sujeto'
    Get-ChildItem -LiteralPath $campaign.Out -Filter '*.tmp' -ErrorAction SilentlyContinue | Should -BeNullOrEmpty
  }

  It 'un sujeto con la identidad de git de la máquina en su salida sale con error' {
    $config = Join-Path $TestDrive 'exit.gitconfig'
    Set-Content -LiteralPath $config -Value "[user]`n`tname = Alice Liddell" -Encoding utf8NoBOM
    $campaign = New-Campaign (Join-Path $TestDrive 'identity-exit') -Launch 'subject_launch "x"; echo "aprobada por Alice Liddell" | subject_save; exit 0'
    $subject = Join-Path $campaign.Spec 'red/subject.sh'
    $wrapper = Join-Path $campaign.Spec 'red/wrapper.sh'
    Set-Content -LiteralPath $wrapper -Value "bash '$($subject -replace '\\', '/')' `"`$@`"; echo `"salida del sujeto: `$?`" >&2" -NoNewline

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; GIT_CONFIG_GLOBAL = $config; SUBJECT_SH = $wrapper }

    $run.Output | Should -Match 'salida del sujeto: 1'
  }

  It 'aborta si la copia del kit lleva <Folder>/ (walkthrough de la feature 0150 §4.3)' -ForEach @(@{ Folder = '.docs' }, @{ Folder = 'tests' }) {
    $campaign = New-Campaign (Join-Path $TestDrive "kit-$Folder")
    New-Item -ItemType Directory -Force (Join-Path $campaign.Kit $Folder) | Out-Null

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.Output | Should -Match 'la copia del kit lleva \.docs/ o tests/: sácala con git archive <commit> skills \.claude-plugin'
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'subject_show vuelca un fichero de otra rama (ticket del patch 0075 §3)' {
    $launch = 'g checkout -q -b feature/0013; put .docs/sdd/roadmap.md <<< "fila 0013"; commit "docs: fila"; g checkout -q main; subject_launch "x"; subject_show feature/0013:.docs/sdd/roadmap.md roadmap.md'
    $campaign = New-Campaign (Join-Path $TestDrive 'show') -Launch $launch

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Get-Content -Raw (Join-Path $campaign.Out 'a-1/roadmap.md') -ErrorAction SilentlyContinue | Should -Match 'fila 0013' -Because $run.Output
  }

  It 'seed_transcript siembra en la carpeta del molde y la borra al acabar (ticket de la feature 0188 §2)' {
    $config = Join-Path $TestDrive 'seed-config'
    $launch = 'seed_transcript feature/0042 < <(printf "%s\n" "2026-10-14T09:00:00Z user el total no redondea" "2026-10-14T09:02:00Z assistant mirando"); cp "$SEED_DIR"/seed-1.jsonl "$OUT/seed.jsonl"; subject_launch "x"'
    $campaign = New-Campaign (Join-Path $TestDrive 'seed') -Launch $launch

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; CLAUDE_CONFIG_DIR = $config; KEEP_MOLD = '1' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $seed = @(Get-Content (Join-Path $campaign.Out 'seed.jsonl') -ErrorAction SilentlyContinue | ForEach-Object { $_ | ConvertFrom-Json })
    $seed | Should -HaveCount 2 -Because $run.Output
    $seed[0].gitBranch | Should -Be 'feature/0042'
    $seed[0].message.content | Should -Be 'el total no redondea'
    $seed[1].message.model | Should -Be 'claude-sonnet-5'
    $seed[1].message.usage.output_tokens | Should -Be 1
    @(Get-ChildItem -LiteralPath (Join-Path $config 'projects') -Directory -ErrorAction SilentlyContinue) | Should -HaveCount 0
  }

  It 'seed_transcript en una tubería también borra la carpeta al acabar' {
    $config = Join-Path $TestDrive 'seed-pipe-config'
    $launch = 'printf "%s\n" "2026-10-14T09:00:00Z user hola" | seed_transcript feature/0042; subject_launch "x"'
    $campaign = New-Campaign (Join-Path $TestDrive 'seed-pipe') -Launch $launch

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; CLAUDE_CONFIG_DIR = $config }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Join-Path $config 'projects' | Should -Exist -Because 'seed_transcript la crea'
    @(Get-ChildItem -LiteralPath (Join-Path $config 'projects') -Directory) | Should -HaveCount 0
  }

  It 'seed_transcript sin molde muere sin tocar los transcripts' {
    $config = Join-Path $TestDrive 'seed-nomold'
    New-Item -ItemType Directory -Force (Join-Path $config 'projects/otra-sesion') | Out-Null
    $lib = (Join-Path $script:Headless 'lib.sh') -replace '\\', '/'
    $saved = $env:CLAUDE_CONFIG_DIR
    try {
      $env:CLAUDE_CONFIG_DIR = $config
      $out = (& $script:Bash -c ". '$lib'; seed_transcript feature/0042 <<< '2026-10-14T09:00:00Z user hola'; subject_cleanup" 2>&1) -join "`n"
    } finally { $env:CLAUDE_CONFIG_DIR = $saved }

    $out | Should -Match 'seed_transcript antes de subject_init'
    Join-Path $config 'projects/otra-sesion' | Should -Exist
  }

  It 'subject_show con una copia con carpetas da el aviso de copia plana' {
    $campaign = New-Campaign (Join-Path $TestDrive 'show-flat') -Launch 'subject_launch "x"; subject_show main:README.md docs/readme.md'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.Output | Should -Match 'docs/readme\.md: solo copia plana'
  }

  It 'g pasa core.longpaths (ticket de la feature 0089 §2)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'longpaths') -Launch 'subject_launch "x"; g config --get core.longpaths > "$OUT/longpaths.txt"'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Get-Content (Join-Path $campaign.Out 'longpaths.txt') -ErrorAction SilentlyContinue | Should -Be 'true'
  }

  It 'subject_ports junta PORT y los puertos del stream' {
    $stream = Join-Path $TestDrive 'ports.jsonl'
    Set-Content -LiteralPath $stream -Value '{"text":"abre http://localhost:4567 y PORT=5173 npm start; otra vez localhost:4567"}'
    $lib = (Join-Path $script:Headless 'lib.sh') -replace '\\', '/'
    $jsonl = $stream -replace '\\', '/'

    $ports = & $script:Bash -c ". '$lib'; JSONL='$jsonl'; PORT=4300; subject_ports"

    $ports | Should -Be '4300,4567,5173'
  }

  It 'no pasa de SUBJECT_CAP sujetos' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cap')

    $run = Invoke-Campaign $campaign @{ SUBJECT_CAP = '2' }

    $run.Output | Should -Match 'techo de 2 sujetos'
    (Get-Subjects $campaign).Count | Should -Be 2
  }

  It 'no lanza si el coste de la campaña, sumando todas las fases, llega a COST_CAP' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cost')
    # Dos eventos result: cuenta solo el último (task 0055).
    Set-Tools (Join-Path $campaign.Dry 'green/out') 'x-1' "=== RESULTADO (3 turnos, 9 $)`n=== RESULTADO (4 turnos, 4.5 $)"

    $run = Invoke-Campaign $campaign @{ COST_CAP = '4' }

    $run.Output | Should -Match 'techo de 4 \$ alcanzado \(4\.50 \$ gastados, 0 en curso a 0\.4 \$\)'
    (Get-Subjects $campaign).Count | Should -Be 1
  }

  It 'no relanza una etiqueta que ya tiene tools.txt en su fase (ticket de la feature 0032 §2)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'existing')
    Set-Tools $campaign.Out 'a-1' 'marca'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a b' }

    $run.Output | Should -Match 'ya existe a-1: sube SUBJECT'
    Get-Content -Raw (Join-Path $campaign.Out 'a-1.tools.txt') | Should -Match '^marca'
    Join-Path $campaign.Out 'b-1.tools.txt' | Should -Exist
  }

  It 'no lanza si lo gastado más lo lanzado a SUBJECT_COST pasa de COST_CAP (ticket de la feature 0086 §3)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'launched') -Launch 'sleep 3; subject_launch "x"'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a b c'; COST_CAP = '1'; SUBJECT_COST = '0.4' }

    $run.Output | Should -Match 'techo de 1 \$ alcanzado \(0\.00 \$ gastados, 2 en curso a 0\.4 \$\)'
    (Get-Subjects $campaign).Count | Should -Be 2
  }

  It 'cuenta un sujeto cortado como sujeto y como SUBJECT_COST (ticket del patch 0094 §3)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cut')
    New-Item -ItemType Directory -Force (Join-Path $campaign.Runs 'dry/live') | Out-Null
    Set-Content -LiteralPath (Join-Path $campaign.Runs 'dry/live/red.z-1') -Value '999999'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a b'; SUBJECT_CAP = '2' }

    $run.Output | Should -Match 'techo de 2 sujetos'
    (Get-Subjects $campaign).Count | Should -Be 1
    $run.Output | Should -Match 'cortados sin salida: 1 \(contados a 5 \$ cada uno\)'
  }

  It 'un sujeto cortado de una tanda real no cuenta en un ensayo en seco' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cut-real')
    New-Item -ItemType Directory -Force (Join-Path $campaign.Runs 'live') | Out-Null
    Set-Content -LiteralPath (Join-Path $campaign.Runs 'live/red.z-1') -Value '999999'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a b'; SUBJECT_CAP = '2' }

    (Get-Subjects $campaign).Count | Should -Be 2 -Because $run.Output
    $run.Output | Should -Not -Match 'cortados sin salida'
  }

  It 'no relanza una etiqueta que está en curso' {
    $campaign = New-Campaign (Join-Path $TestDrive 'running-label') -Launch 'sleep 4; subject_launch "x"'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a a' }

    $run.Output | Should -Match 'ya existe a-1: sube SUBJECT'
    ([regex]::Matches($run.Output, '\[a-1\] listo')).Count | Should -Be 1
  }

  It 'lanza si lo gastado más lo lanzado iguala COST_CAP: el techo es estrictamente mayor' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cost-edge') -Launch 'sleep 3; subject_launch "x"'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a b'; COST_CAP = '1'; SUBJECT_COST = '0.5' }

    (Get-Subjects $campaign).Count | Should -Be 2 -Because $run.Output
    $run.Output | Should -Not -Match 'techo de'
  }

  It 'rompe un cerrojo sin dueño escrito y lanza' {
    $campaign = New-Campaign (Join-Path $TestDrive 'orphan-lock')
    New-Item -ItemType Directory -Force (Join-Path $campaign.Runs 'live/.lock') | Out-Null
    $runSh = (Join-Path $script:Headless 'run.sh') -replace '\\', '/'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' } -Command "timeout 60 bash '$runSh'"

    (Get-Subjects $campaign).Count | Should -Be 1 -Because $run.Output
  }

  It 'aborta con MAX_PARALLEL o SUBJECT_CAP que no son enteros positivos' -ForEach @(
    @{ Name = 'MAX_PARALLEL'; Value = '0' }, @{ Name = 'SUBJECT_CAP'; Value = '0' }
  ) {
    $campaign = New-Campaign (Join-Path $TestDrive "invalid-$Name")
    $runSh = (Join-Path $script:Headless 'run.sh') -replace '\\', '/'

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; $Name = $Value } -Command "timeout 30 bash '$runSh'"

    $run.ExitCode | Should -Not -Be 0
    $run.Output | Should -Match "$Name tiene que ser un entero positivo: 0"
    (Get-Subjects $campaign).Count | Should -Be 0
  }

  It 'MAX_PARALLEL limita los sujetos a la vez (ticket de la feature 0091 §1)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'parallel') -Launch $script:Concurrent

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a b c d'; MAX_PARALLEL = '1' }

    Get-MaxConcurrent $campaign | Should -Be 1 -Because $run.Output
    (Get-Subjects $campaign).Count | Should -Be 4
    $run.Output | Should -Match 'esperando hueco: 1 sujetos en curso \(MAX_PARALLEL=1\)'
  }

  It 'MAX_PARALLEL cuenta los sujetos de otro run.sh sobre el mismo RUNS_DIR' {
    $campaign = New-Campaign (Join-Path $TestDrive 'two-launchers') -Launch $script:Concurrent
    Copy-Item -Recurse (Join-Path $campaign.Spec 'red') (Join-Path $campaign.Spec 'green')
    $runSh = (Join-Path $script:Headless 'run.sh') -replace '\\', '/'
    $green = (Join-Path $campaign.Spec 'green/subject.sh') -replace '\\', '/'
    $command = "SCENARIOS='a b' bash '$runSh' & PHASE=green SUBJECT_SH='$green' SCENARIOS='c d' bash '$runSh'; wait"

    $run = Invoke-Campaign $campaign @{ MAX_PARALLEL = '1' } -Command $command

    Get-MaxConcurrent $campaign | Should -Be 1 -Because $run.Output
    (Get-Subjects $campaign).Count | Should -Be 4
  }

  It 'marca al sujeto en RUNS_DIR/dry/live mientras corre en seco y borra la marca al acabar' {
    $campaign = New-Campaign (Join-Path $TestDrive 'marker-live') -Launch $script:Concurrent

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    Get-Content (Join-Path $campaign.Runs '../conc.live') | Should -Contain 'red.a-1' -Because $run.Output
    @(Get-ChildItem (Join-Path $campaign.Runs 'dry/live') -ErrorAction SilentlyContinue).Count | Should -Be 0
  }

  It 'dos fases con el mismo RUNS_DIR no comparten molde ni stream (ticket del patch 0082 §1)' {
    $campaign = New-Campaign (Join-Path $TestDrive 'phases')
    Copy-Item -Recurse (Join-Path $campaign.Spec 'red') (Join-Path $campaign.Spec 'green')

    # En secuencia basta: con la ruta sin fase, la segunda borraba el molde de la primera (rm -rf en subject_init).
    foreach ($phase in 'red', 'green') {
      $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; PHASE = $phase; SUBJECT_SH = Join-Path $campaign.Spec "$phase/subject.sh"; KEEP_MOLD = '1' }
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

  It 'aborta con RUNS_DIR fuera del scratchpad y de .temp/' {
    $campaign = New-Campaign (Join-Path $TestDrive 'outside')
    # El TestDrive puede colgar de .temp/ del repo: la ruta de fuera no se crea, la guarda aborta antes.
    $outside = Join-Path ([IO.Path]::GetPathRoot($TestDrive)) "sdd-fuera-$([guid]::NewGuid().ToString('N'))/runs"

    $run = Invoke-Campaign $campaign @{ RUNS_DIR = $outside }

    $run.ExitCode | Should -Not -Be 0
    $run.Output | Should -Match 'fuera del scratchpad o de \.temp/'
    (Get-Subjects $campaign).Count | Should -Be 0
    Split-Path $outside | Should -Not -Exist
  }

  It 'acepta RUNS_DIR bajo .temp/ del repo' {
    $campaign = New-Campaign (Join-Path $TestDrive 'repo-temp')
    $runs = Join-Path (Split-Path $PSScriptRoot) ".temp/launcher-$([guid]::NewGuid().ToString('N'))"
    try {
      $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; RUNS_DIR = $runs }

      $run.ExitCode | Should -Be 0 -Because $run.Output
      Join-Path $runs 'dry/red/out/a-1.tools.txt' | Should -Exist
    }
    finally { Remove-Item -LiteralPath $runs -Recurse -Force -ErrorAction SilentlyContinue }
  }

  It 'en seco no corta por la ruta del scratchpad, aunque cuelgue del repo con un nombre largo' {
    $campaign = New-Campaign (Join-Path $TestDrive 'dry-long-runs')
    $runs = Join-Path (Split-Path $PSScriptRoot) ".temp/launcher-$('x' * 100)-$([guid]::NewGuid().ToString('N').Substring(0, 8))"
    try {
      $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; RUNS_DIR = $runs }

      Join-Path $runs 'dry/red/out/a-1.tools.txt' | Should -Exist -Because $run.Output
    }
    finally { Remove-Item -LiteralPath $runs -Recurse -Force -ErrorAction SilentlyContinue }
  }

  It 'en seco corta la ruta que tendría la salida en SPEC_DIR' {
    $campaign = New-Campaign (Join-Path $TestDrive 'dry-long-spec')
    $spec = Join-Path (Split-Path $PSScriptRoot) ".temp/launcher-$('x' * 100)-$([guid]::NewGuid().ToString('N').Substring(0, 8))"
    New-Item -ItemType Directory -Force $spec | Out-Null
    try {
      $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; SPEC_DIR = $spec }

      $run.Output | Should -Match 'ruta de \d+ caracteres'
      Join-Path $campaign.Out 'a-1.tools.txt' | Should -Not -Exist
    }
    finally { Remove-Item -LiteralPath $spec -Recurse -Force -ErrorAction SilentlyContinue }
  }

  It 'borra el molde del sujeto y conserva su stream y sus argumentos' {
    $campaign = New-Campaign (Join-Path $TestDrive 'cleanup')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Join-Path $campaign.Runs 'red/a-1' | Should -Not -Exist
    Join-Path $campaign.Runs 'red/a-1.jsonl' | Should -Exist
    Join-Path $campaign.Runs 'red/a-1.args' | Should -Exist
    Join-Path $campaign.Out 'a-1/readme.md' | Should -Exist
  }

  It 'con KEEP_MOLD=1 conserva el molde' {
    $campaign = New-Campaign (Join-Path $TestDrive 'keep')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; KEEP_MOLD = '1' }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    Join-Path $campaign.Runs 'red/a-1/repo/README.md' | Should -Exist
  }

  It 'borra la carpeta de Claude Code del sujeto y no la de otros' {
    $campaign = New-Campaign (Join-Path $TestDrive 'claude-tmp')
    $base = Join-Path $TestDrive 'cc-tmp'
    $mold = [IO.Path]::GetFullPath((Join-Path $campaign.Runs 'red/a-1/repo'))
    $own = Join-Path $base "claude/$($mold -replace '[^A-Za-z0-9]', '-')"
    $other = Join-Path $base 'claude/D--code-otro-proyecto'
    New-Item -ItemType Directory -Force (Join-Path $own 'tasks'), $other | Out-Null

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; CLAUDE_CODE_TMPDIR = $base }

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $own | Should -Not -Exist
    $other | Should -Exist
  }

  It 'subject_cleanup no borra con la etiqueta vacía ni fuera de RUNS_DIR' {
    $root = (Join-Path $TestDrive 'guard') -replace '\\', '/'
    New-Item -ItemType Directory -Force "$root/runs/red/x", "$root/elsewhere" | Out-Null
    $lib = (Join-Path $script:Headless 'lib.sh') -replace '\\', '/'
    $script = ". '$lib'; RUNS='$root/runs/red'; " +
      "LABEL=''; RUN='$root/runs/red/x'; R=`"`$RUN/repo`"; subject_cleanup; " +
      "LABEL=x; RUN='$root/elsewhere'; R=`"`$RUN/repo`"; subject_cleanup"

    $output = (& $script:Bash -c $script 2>&1) -join "`n"

    "$root/runs/red/x" | Should -Exist
    "$root/elsewhere" | Should -Exist
    ([regex]::Matches($output, 'no se borra')).Count | Should -Be 2 -Because $output
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

Describe 'Marcador del molde con la versión del kit (lib.sh)' -Tag 'Slow' {
  BeforeAll {
    $launch = "put_kit_marker '`"channel`": `"plugin`"'; subject_launch `"x`""
    $script:Marker = New-Campaign (Join-Path $TestDrive 'marker') 'marker.json' -Launch $launch
    $script:Marker.Kit | ForEach-Object {
      $migrations = Join-Path $_ 'skills/sdd-upgrade/references/migrations'
      New-Item -ItemType Directory -Force $migrations, (Join-Path $_ '.claude-plugin') | Out-Null
      Set-Content (Join-Path $migrations 'v2.9.0.md') '# v2.9.0'
      Set-Content (Join-Path $migrations 'v2.10.0.md') '# v2.10.0'
      Set-Content (Join-Path $_ '.claude-plugin/plugin.json') '{"name":"sdd-kit","version":"2.9.1"}'
    }
    $subject = Join-Path $script:Marker.Spec 'red/subject.sh'
    (Get-Content -Raw $subject).Replace('subject_keep "$R/README.md" marker.json', 'subject_keep "$R/.docs/sdd/sdd-kit.json" marker.json') |
      Set-Content -LiteralPath $subject -NoNewline
    $script:MarkerRun = Invoke-Campaign $script:Marker @{ SCENARIOS = 'a' }
    $script:MarkerJson = Get-Content -Raw (Join-Path $script:Marker.Out 'a-1/marker.json') -ErrorAction SilentlyContinue
  }

  It 'kit_version compara por SemVer' {
    $script:MarkerJson | Should -Match '"version": "2\.10\.0"' -Because $script:MarkerRun.Output
  }

  It 'put_kit_marker escribe la versión del kit' {
    $script:MarkerJson | Should -Match '^\{"version": "2\.10\.0", "channel": "plugin"\}' -Because $script:MarkerRun.Output
  }
}

Describe 'Segundo turno real (lib.sh)' -Tag 'Slow' {
  It 'TURN2 reanuda la sesión del primer turno' {
    $campaign = New-Campaign (Join-Path $TestDrive 'turn2')

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; TURN2 = 'Sigue.'; SUPERPOWERS_DIR = 'C:/sp/6.4.2' }

    $first = @(Get-Content (Join-Path $campaign.Runs 'red/a-1.args'))
    $second = @(Get-Content (Join-Path $campaign.Runs 'red/a-1.resume.args'))
    $second[[array]::IndexOf($second, '--resume') + 1] | Should -Be 'dry-a-1' -Because $run.Output
    $second | Should -Contain 'C:/sp/6.4.2'
    $second[[array]::IndexOf($second, '--setting-sources') + 1] | Should -BeExactly ''
    $second[-1] | Should -Be 'Sigue.'
    $first[-1] | Should -Be 'Invoca la skill sdd-kit:sdd-plan.'
    $tools = Get-Content -Raw (Join-Path $campaign.Out 'a-1.tools.txt')
    ([regex]::Matches($tools, '=== RESULTADO')).Count | Should -Be 2
    $run.Output | Should -Match 'coste acumulado: 1\.00 \$'
  }

  It 'subject_converse reanuda hasta que el sujeto deja de preguntar' {
    $launch = 'echo "Contesta sí." > "$RUNS/hoja.md"; DRY_RESULT="¿Seguimos?" subject_launch "x"; subject_converse "$RUNS/hoja.md" 5'
    $campaign = New-Campaign (Join-Path $TestDrive 'converse') -Launch $launch

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $second = @(Get-Content (Join-Path $campaign.Runs 'red/a-1.resume.args'))
    $second[-1] | Should -Be 'Respuesta de la persona.' -Because $run.Output
    @(Get-ChildItem (Join-Path $campaign.Runs 'red') -Filter 'a-1.persona-*.txt').Count | Should -Be 1
  }

  It 'subject_converse para en el tope de turnos' {
    $launch = 'echo "Contesta sí." > "$RUNS/hoja.md"; export DRY_RESULT="¿Seguimos?"; subject_launch "x"; subject_converse "$RUNS/hoja.md" 3'
    $campaign = New-Campaign (Join-Path $TestDrive 'cap') -Launch $launch

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    @(Get-ChildItem (Join-Path $campaign.Runs 'red') -Filter 'a-1.persona-*.txt').Count | Should -Be 3 -Because $run.Output
  }

  It 'subject_converse suma el coste de la persona al último RESULTADO' {
    $launch = 'echo "Contesta sí." > "$RUNS/hoja.md"; DRY_RESULT="¿Seguimos?" subject_launch "x"; subject_converse "$RUNS/hoja.md" 5'
    $campaign = New-Campaign (Join-Path $TestDrive 'cost') -Launch $launch

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a'; DRY_PERSONA_COST = '0.25' }

    $run.Output | Should -Match 'coste acumulado: 1\.25 \$'
  }

  It 'extract.mjs last devuelve el texto del último resultado' {
    $stream = Join-Path $TestDrive 'last.jsonl'
    Set-Content -LiteralPath $stream -Value @(
      '{"type":"result","num_turns":1,"total_cost_usd":0.5,"result":"¿Primera?"}',
      '{"type":"result","num_turns":2,"total_cost_usd":1,"result":"Ultima respuesta."}'
    )

    $last = & $script:Node (Join-Path $script:Headless 'extract.mjs') last $stream

    $last | Should -Be 'Ultima respuesta.'
  }

  It 'subject_resume sin session_id muere con su mensaje' {
    $launch = 'subject_launch "x"; : > "$JSONL"; subject_resume "y"'
    $campaign = New-Campaign (Join-Path $TestDrive 'nosession') -Launch $launch

    $run = Invoke-Campaign $campaign @{ SCENARIOS = 'a' }

    $run.Output | Should -Match 'sin session_id: no se puede reanudar'
    Join-Path $campaign.Runs 'red/a-1.resume.args' | Should -Not -Exist
  }
}
