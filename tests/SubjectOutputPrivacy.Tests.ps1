BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  # Extractor de referencia de los sujetos headless (patch 0076).
  $script:Tools = Join-Path $PSScriptRoot 'headless/extract.mjs'
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')

  # En UTF-8: desde el pre-commit, pwsh -NoProfile decodifica la salida de git con IBM437, y un nombre
  # con tilde no casaba con nada: el test pasaba con la fuga dentro (ticket de la feature 0099 §1).
  function Get-GitUserName {
    $savedGitEnv = Clear-GitEnv
    $savedEncoding = [Console]::OutputEncoding
    try {
      [Console]::OutputEncoding = [Text.UTF8Encoding]::new($false)
      git -C $script:KitRoot config user.name
    } finally {
      [Console]::OutputEncoding = $savedEncoding
      Restore-GitEnv $savedGitEnv
    }
  }

  # Una identidad de git fija: la global en un fichero propio y, si se pide, la del molde por GIT_CONFIG_*.
  function Invoke-WithGitUser([string]$GlobalName, [scriptblock]$Script, [string]$MoldName) {
    $names = 'GIT_CONFIG_GLOBAL', 'GIT_CONFIG_COUNT', 'GIT_CONFIG_KEY_0', 'GIT_CONFIG_VALUE_0'
    $saved = @{}
    foreach ($name in $names) { $saved[$name] = [Environment]::GetEnvironmentVariable($name) }
    try {
      $config = Join-Path $TestDrive 'gitconfig'
      Set-Content -LiteralPath $config -Value "[user]`n`tname = $GlobalName" -Encoding utf8NoBOM
      $env:GIT_CONFIG_GLOBAL = $config
      if ($MoldName) { $env:GIT_CONFIG_COUNT = '1'; $env:GIT_CONFIG_KEY_0 = 'user.name'; $env:GIT_CONFIG_VALUE_0 = $MoldName }
      & $Script
    } finally { Restore-GitEnv $saved }
  }

  # El ejecutable real: un shim de node (proto) necesita el home verdadero para arrancar.
  $script:Node = node -e 'console.log(process.execPath)'

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

Describe 'El lanzador de sujetos oculta el home y el usuario' {
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

  It 'extract.mjs clean sustituye el user.name de git de la máquina, no el del molde (ticket de la feature 0099 §1)' {
    # El sujeto lo copia del contexto de la sesión aunque subject_launch fije Fixture con GIT_CONFIG_*.
    $out = Invoke-WithGitUser 'Alice Liddell' -MoldName 'Fixture' {
      Invoke-Tools @('clean', '/c/runs/x') 'spec aprobada por Alice Liddell; commits de Fixture'
    }

    $out | Should -Be 'spec aprobada por <git-user>; commits de Fixture'
  }
}

Describe 'La evidencia de los sujetos no lleva el home de la máquina' {
  BeforeAll {
    $root = Join-Path $script:KitRoot '.docs/sdd/specs'
    # green1, red2…: las rondas extra de una campaña también son salidas de sujetos (patch 0080).
    $script:Evidence = @(Get-ChildItem -LiteralPath $root -Directory |
      ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Directory | Where-Object Name -match '^(red|green|refactor)' } |
      ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -File -Recurse }) +
      @(Get-ChildItem -Path (Join-Path $script:KitRoot 'tests/*') -File -Include '*-red.md', '*-green.md')
    function Find-Leak([string]$Pattern) {
      $script:Evidence |
        Where-Object { Select-String -LiteralPath $_.FullName -Pattern $Pattern -Quiet } |
        ForEach-Object { [IO.Path]::GetRelativePath($script:KitRoot, $_.FullName) }
    }
  }

  It 'ningún fichero de specs/*/red|green|refactor/ tiene una ruta de usuario' {
    # X:\Users\…, X:\\Users\\… (JSON), X:/Users/…, /x/Users/… y la carpeta de proyecto X--Users-….
    Find-Leak '(?i)(?:\b[a-z]:|(?<![\w.])/[a-z])(?:\\{1,2}|/)Users(?:\\{1,2}|/)(?![\\/<…])|\b[a-z]--Users-(?!<)' |
      Should -BeNullOrEmpty -Because 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean'
  }

  It 'ni el usuario de esta máquina suelto (ls -l)' {
    # Del home, no de $USERNAME, que en Git Bash vale SYSTEM (ticket 0068 §5).
    $user = Split-Path -Leaf ($env:USERPROFILE ?? $env:HOME)
    Find-Leak "\b$([regex]::Escape($user))\b" |
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
      Should -BeNullOrEmpty -Because 'el sujeto hereda la identidad de git si subject_launch no la fija: sustitúyelo por <git-user>'
  }
}
