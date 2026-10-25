BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  # Extractor de referencia de los sujetos headless (patch 0076).
  $script:Tools = Join-Path $PSScriptRoot 'headless/extract.mjs'
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')

  # En UTF-8: desde el pre-commit, pwsh -NoProfile decodifica la salida de git con IBM437, y un nombre
  # con tilde no casaba con nada: el test pasaba con la fuga dentro (ticket de la feature 0099 §1).
  function Invoke-GitUtf8([string[]]$GitArgs) {
    $savedEncoding = [Console]::OutputEncoding
    try {
      [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
      git -C $script:KitRoot @GitArgs
    } finally { [Console]::OutputEncoding = $savedEncoding }
  }

  function Get-GitUserName {
    $savedGitEnv = Clear-GitEnv
    try { Invoke-GitUtf8 'config', 'user.name' } finally { Restore-GitEnv $savedGitEnv }
  }

  function Get-GitUserEmail {
    $savedGitEnv = Clear-GitEnv
    try { Invoke-GitUtf8 'config', 'user.email' } finally { Restore-GitEnv $savedGitEnv }
  }

  # Toda subcarpeta de una tarea: campaign/, ab/, micro/… también son salidas de sujetos (feature 0214).
  function Select-EvidencePath([string[]]$Paths) {
    @($Paths) -match '^\.docs/sdd/specs/[^/]+/[^/]+/|^tests/[^/]+-(red|green)\.md$'
  }

  # Sin limpiar el entorno de git: dentro del hook, GIT_INDEX_FILE dice qué índice se está commiteando.
  function Get-StagedEvidence {
    $staged = Invoke-GitUtf8 '-c', 'core.quotePath=false', 'diff', '--cached', '--name-only', '--diff-filter=ACMR'
    Select-EvidencePath $staged | ForEach-Object { Get-Item -LiteralPath (Join-Path $script:KitRoot $_) }
  }

  # Leído una vez: con un Select-String por fichero y patrón, el pre-commit pasó de su tope de 30 s.
  function Read-Evidence([IO.FileInfo[]]$Files) {
    @(foreach ($file in $Files) {
        [pscustomobject]@{ Path = [IO.Path]::GetRelativePath($script:KitRoot, $file.FullName); Text = [IO.File]::ReadAllText($file.FullName) }
      })
  }

  function Find-Leak([string]$Pattern) {
    $script:EvidenceText | Where-Object { $_.Text -match $Pattern } | ForEach-Object Path
  }

  # X:\Users\…, X:\\Users\\… (JSON), X:/Users/…, /x/Users/… y la carpeta de proyecto X--Users-….
  $script:UserPathPattern = '(?i)(?:\b[a-z]:|(?<![\w.])/[a-z])(?:\\{1,2}|/)Users(?:\\{1,2}|/)(?![\\/<…])|\b[a-z]--Users-(?!<)'
  # Del home, no de $USERNAME, que en Git Bash vale SYSTEM (ticket 0068 §5).
  $script:MachineUserPattern = "\b$([regex]::Escape((Split-Path -Leaf ($env:USERPROFILE ?? $env:HOME))))\b"

  function Find-MachineLeak {
    $identity = @(Get-GitUserName; Get-GitUserEmail) | Where-Object { $_ } | ForEach-Object { [regex]::Escape($_) }
    $patterns = @($script:UserPathPattern, $script:MachineUserPattern) + $identity
    $patterns | ForEach-Object { Find-Leak $_ } | Sort-Object -Unique
  }

  # Una identidad de git fija: la global en un fichero propio y, si se pide, la del molde por GIT_CONFIG_*.
  function Invoke-WithGitUser([string]$GlobalName, [scriptblock]$Script, [string]$MoldName, [string]$GlobalEmail) {
    $names = 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_COUNT', 'GIT_CONFIG_KEY_0', 'GIT_CONFIG_VALUE_0'
    $saved = @{}
    foreach ($name in $names) { $saved[$name] = [Environment]::GetEnvironmentVariable($name) }
    try {
      $config = Join-Path $TestDrive 'gitconfig'
      $email = if ($GlobalEmail) { "`n`temail = $GlobalEmail" } else { '' }
      Set-Content -LiteralPath $config -Value "[user]`n`tname = $GlobalName$email" -Encoding utf8NoBOM
      $env:GIT_CONFIG_GLOBAL = $config
      if ($MoldName) { $env:GIT_CONFIG_COUNT = '1'; $env:GIT_CONFIG_KEY_0 = 'user.name'; $env:GIT_CONFIG_VALUE_0 = $MoldName }
      & $Script
    } finally { Restore-GitEnv $saved }
  }

  function Invoke-Tools([string[]]$ToolArgs, [string]$InputText) {
    $saved = @{ USERPROFILE = $env:USERPROFILE; HOME = $env:HOME }
    try {
      $env:USERPROFILE = 'C:\Users\alice'
      $env:HOME = '/c/Users/alice'
      if ($PSBoundParameters.ContainsKey('InputText')) { ($InputText | & $script:Node $script:Tools @ToolArgs) -join "`n" }
      else { (& $script:Node $script:Tools @ToolArgs) -join "`n" }
    } finally {
      $env:USERPROFILE = $saved.USERPROFILE
      $env:HOME = $saved.HOME
    }
  }

  # Con el código de salida y el stderr: una salida con la identidad de la máquina no se guarda.
  function Invoke-ToolsExit([string[]]$ToolArgs, [string]$InputText) {
    $encoding = [Console]::OutputEncoding
    [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
    try {
      $output = ($InputText | & $script:Node $script:Tools @ToolArgs 2>&1) -join "`n"
      [pscustomobject]@{ Output = $output; ExitCode = $LASTEXITCODE }
    } finally { [Console]::OutputEncoding = $encoding }
  }

  # Las formas en que el home y el usuario salían en las salidas (ticket del patch 0069 §2).
  $script:Leaky = @(
    'git: /c/Users/alice/.claude/plugins'
    'tmp: C:\Users\alice\AppData\Local\Temp\x'
    'fwd: C:/Users/alice/AppData'
    'json: "C:\\Users\\alice\\.claude"'
    'proj: C--Users-alice-AppData-Local-Temp'
    '-rw-r--r-- 1 alice 197609 12 Sep 25 file.txt'
    'repo: alicemetal/sdd-kit'
  ) -join "`n"
}

# Slow porque lanza node: lo cubre en el conjunto rápido la revisión de la evidencia que lleva el commit.
Describe 'El lanzador de sujetos oculta el home y el usuario' -Tag 'Slow' {
  BeforeAll {
    # El ejecutable real: un shim de node (proto) necesita el home verdadero para arrancar.
    $script:Node = node -e 'console.log(process.execPath)'
  }

  It 'extract.mjs tools los sustituye en el extracto del stream' {
    $stream = Join-Path $TestDrive 'stream.jsonl'
    $event = @{ message = @{ content = @(@{ type = 'tool_result'; content = $script:Leaky }) } } | ConvertTo-Json -Depth 5 -Compress
    Set-Content -LiteralPath $stream -Value $event -Encoding utf8NoBOM

    $out = Invoke-Tools @('tools', $stream, '/c/runs/x')

    $out | Should -Not -Match '\balice\b'
    $out | Should -Match '<home>/\.claude/plugins'
    $out | Should -Match '<home>\\AppData'
    $out | Should -Match '1 <user> 197609'
    $out | Should -Match 'alicemetal/sdd-kit' -Because 'solo se sustituye el usuario como palabra entera'
  }

  It 'extract.mjs texts los sustituye en los mensajes del agente' {
    $stream = Join-Path $TestDrive 'texts.jsonl'
    $event = @{ type = 'assistant'; message = @{ content = @(@{ type = 'text'; text = $script:Leaky }) } } | ConvertTo-Json -Depth 5 -Compress
    Set-Content -LiteralPath $stream -Value $event -Encoding utf8NoBOM

    $out = Invoke-Tools @('texts', $stream, '/c/runs/x')

    $out | Should -Match '--- \[1\]'
    $out | Should -Not -Match '\balice\b'
    $out | Should -Match '<home>/\.claude/plugins'
  }

  It 'extract.mjs clean sustituye la ruta de la campaña en todas sus formas' {
    $saved = $env:TEMP
    try {
      $env:TEMP = 'C:\tmpdir'
      $forms = 'a C:/tmpdir/runs/x/repo b C:\tmpdir\runs\x c C:\\tmpdir\\runs\\x d /c/tmpdir/runs/x e /tmp/runs/x/repo'
      $out = Invoke-Tools @('clean', 'C:/tmpdir/runs/x') $forms
    } finally { $env:TEMP = $saved }

    $out | Should -Be 'a <run>/repo b <run> c <run> d <run> e <run>/repo'
  }

  It 'extract.mjs clean filtra la entrada estándar (state.txt)' {
    $out = Invoke-Tools @('clean', '/c/runs/x') $script:Leaky

    $out | Should -Not -Match '\balice\b'
    $out | Should -Match '<home>/\.claude/plugins'
  }

  It 'extract.mjs clean falla con el user.name de git de la máquina, no con el del molde (ticket de la feature 0099 §1)' {
    # El sujeto lo copia del contexto de la sesión aunque subject_launch fije Fixture con GIT_CONFIG_*.
    $leak = Invoke-WithGitUser 'Alice Liddell' -MoldName 'Fixture' { Invoke-ToolsExit @('clean', '/c/runs/x') 'spec aprobada por Alice Liddell' }
    $clean = Invoke-WithGitUser 'Alice Liddell' -MoldName 'Fixture' { Invoke-ToolsExit @('clean', '/c/runs/x') 'commits de Fixture' }

    $leak.ExitCode | Should -Be 3
    $leak.Output | Should -Match 'la salida lleva el nombre o el email de git de la máquina: no se guarda'
    $leak.Output | Should -Not -Match 'Alice Liddell'
    $clean.ExitCode | Should -Be 0
    $clean.Output | Should -Be 'commits de Fixture'
  }

  It 'extract.mjs falla con el user.email de git de la máquina' {
    $leak = Invoke-WithGitUser 'Alice Liddell' -GlobalEmail 'alice@example.org' { Invoke-ToolsExit @('clean', '/c/runs/x') 'Author: Fixture <alice@example.org>' }

    $leak.ExitCode | Should -Be 3
    $leak.Output | Should -Not -Match 'alice@example\.org'
  }

  It 'extract.mjs <Mode> salta una línea sin parsear y sigue (walkthrough de la feature 0168 §5)' -ForEach @(@{ Mode = 'tools'; Kept = '>>> Bash: ls' }, @{ Mode = 'texts'; Kept = '--- \[1\]' }) {
    $stream = Join-Path $TestDrive "broken-$Mode.jsonl"
    $broken = '{"type":"assistant","message":{"content":[{"type":"text","text":"a"'
    $valid = @(
      '{"type":"assistant","message":{"content":[{"type":"text","text":"antes"},{"type":"tool_use","name":"Bash","input":{"command":"ls"}}]}}'
      $broken
      '{"type":"result","num_turns":2,"total_cost_usd":0.3,"result":"después"}'
    )
    Set-Content -LiteralPath $stream -Value $valid -Encoding utf8NoBOM

    $run = Invoke-ToolsExit @($Mode, $stream, '/c/runs/x')

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $run.Output | Should -Match "!!! línea 2 del stream sin parsear \($($broken.Length) caracteres\): "
    $run.Output | Should -Match $Kept
  }

  It 'extract.mjs last salta una línea sin parsear' {
    $stream = Join-Path $TestDrive 'broken-last.jsonl'
    Set-Content -LiteralPath $stream -Encoding utf8NoBOM -Value @('{"type":"result","result":"¿seguimos?"}', '{"type":"assistant","message":')

    $run = Invoke-ToolsExit @('last', $stream)

    $run.ExitCode | Should -Be 0 -Because $run.Output
    $run.Output | Should -Be '¿seguimos?'
  }

  It 'extract.mjs falla con el user.name de la máquina aunque lleve tilde' {
    $leak = Invoke-WithGitUser 'Àlice Liddell' { Invoke-ToolsExit @('clean', '/c/runs/x') 'aprobada por Àlice Liddell' }

    $leak.ExitCode | Should -Be 3
  }

  It 'extract.mjs tools escribe bajo >>> Agent las cabeceras ## del prompt (ticket de la feature 0147 §3)' {
    $stream = Join-Path $TestDrive 'agent.jsonl'
    $prompt = "Contexto sin cabecera`n## Tarea`ntexto`n### Detalle`n## Entrega`nmás texto"
    $event = @{ message = @{ content = @(@{ type = 'tool_use'; name = 'Agent'; input = @{ subagent_type = 'general-purpose'; model = 'sonnet'; description = 'implementa'; prompt = $prompt } }) } } | ConvertTo-Json -Depth 6 -Compress
    Set-Content -LiteralPath $stream -Value $event -Encoding utf8NoBOM

    $out = Invoke-Tools @('tools', $stream, '/c/runs/x')

    $out | Should -Match '>>> Agent: subagent_type=general-purpose model=sonnet · implementa\n    ## Tarea\n    ## Entrega'
    $out | Should -Not -Match '### Detalle|más texto'
  }
}

# Slow porque lee toda la evidencia del repo, que crece con cada campaña: en el conjunto rápido,
# la revisión de la evidencia que lleva el commit.
Describe 'La evidencia de los sujetos no lleva el home de la máquina' -Tag 'Slow' {
  BeforeAll {
    $root = Join-Path $script:KitRoot '.docs/sdd/specs'
    # Toda subcarpeta de la tarea: las fugas que se escaparon estaban en campaign/ (feature 0214).
    $script:Evidence = @(Get-ChildItem -LiteralPath $root -Directory |
      ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Directory } |
      ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -File -Recurse }) +
      @(Get-ChildItem -Path (Join-Path $script:KitRoot 'tests/*') -File -Include '*-red.md', '*-green.md')
    $script:EvidenceText = Read-Evidence $script:Evidence
  }

  It 'revisa también las salidas de las baterías, de las pasadas de fix y de las campañas' {
    $script:Evidence | Where-Object FullName -match '[\\/](battery|fix)[^\\/]*[\\/]out[\\/]' | Should -Not -BeNullOrEmpty
    $script:Evidence | Where-Object FullName -match '[\\/]campaign[\\/]out[\\/]' | Should -Not -BeNullOrEmpty
  }

  It 'ningún fichero de specs/*/red|green|refactor/ tiene una ruta de usuario' {
    Find-Leak $script:UserPathPattern |
      Should -BeNullOrEmpty -Because 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean'
  }

  It 'ni el usuario de esta máquina suelto (ls -l)' {
    Find-Leak $script:MachineUserPattern |
      Should -BeNullOrEmpty -Because 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean'
  }

  It 'lee el user.name de git en UTF-8 aunque la consola no lo sea (ticket de la feature 0099 §1)' {
    $saved = [Console]::OutputEncoding
    try {
      [Console]::OutputEncoding = [Text.Encoding]::GetEncoding(437)
      Invoke-WithGitUser 'Àlice Liddell' { Get-GitUserName } | Should -Be 'Àlice Liddell'
    } finally { [Console]::OutputEncoding = $saved }
  }

  It 'ni el user.name de git de esta máquina (ticket del patch 0080 §2)' {
    $name = Get-GitUserName
    if (-not $name) { Set-ItResult -Skipped -Because 'esta máquina no tiene user.name en git'; return }
    Find-Leak ([regex]::Escape($name)) |
      Should -BeNullOrEmpty -Because 'el repo es público: no se guarda una salida con la identidad de la máquina'
  }

  It 'ni el user.email de git de esta máquina' {
    $email = Get-GitUserEmail
    if (-not $email) { Set-ItResult -Skipped -Because 'esta máquina no tiene user.email en git'; return }
    Find-Leak ([regex]::Escape($email)) |
      Should -BeNullOrEmpty -Because 'el repo es público: no se guarda una salida con la identidad de la máquina'
  }

  It 'el control del commit toma como evidencia todo lo que recorre esta revisión' {
    $paths = @($script:EvidenceText.Path -replace '\\', '/')
    @(Select-EvidencePath $paths).Count | Should -Be $paths.Count
  }
}

Describe 'La evidencia que lleva el commit no tiene el home de la máquina' {
  BeforeAll {
    $script:EvidenceText = Read-Evidence (Get-StagedEvidence)
  }

  It 'toma como evidencia las salidas de sujetos y los RED y GREEN de tests/, y nada más' {
    $spec = '.docs/sdd/specs/20260101-000000-feature-0001-x'
    $evidence = "$spec/red/out/a.txt", "$spec/green2/state.txt", "$spec/battery-s1/out/b.md", "$spec/campaign/out/x.md", 'tests/patch-lane-red.md'
    $others = "$spec/spec.md", 'tests/SubjectOutputPrivacy.Tests.ps1', 'tests/batteries/x/out-red.md', 'skills/sdd-propose/SKILL.md'

    Select-EvidencePath ($evidence + $others) | Should -Be $evidence
  }

  It 'ningún fichero de evidencia del commit tiene una ruta de usuario, el usuario ni el user.name de git' {
    Find-MachineLeak | Should -BeNullOrEmpty -Because 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean'
  }
}
