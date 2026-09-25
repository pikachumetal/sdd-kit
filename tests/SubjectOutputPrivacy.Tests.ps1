BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  # Extractor de referencia de los sujetos headless (patch 0076).
  $script:Tools = Join-Path $PSScriptRoot 'headless/extract.mjs'

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
}

Describe 'La evidencia de los sujetos no lleva el home de la máquina' {
  BeforeAll {
    $root = Join-Path $script:KitRoot '.docs/sdd/specs'
    $script:Evidence = Get-ChildItem -LiteralPath $root -Directory |
      ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -Directory | Where-Object Name -in 'red', 'green', 'refactor' } |
      ForEach-Object { Get-ChildItem -LiteralPath $_.FullName -File -Recurse }
    function Find-Leak([string]$Pattern) {
      $script:Evidence |
        Where-Object { Select-String -LiteralPath $_.FullName -Pattern $Pattern -Quiet } |
        ForEach-Object { [IO.Path]::GetRelativePath($script:KitRoot, $_.FullName) }
    }
  }

  It 'ningún fichero de specs/*/red|green|refactor/ tiene una ruta de usuario' {
    # X:\Users\…, X:\\Users\\… (JSON), X:/Users/…, /x/Users/… y la carpeta de proyecto X--Users-….
    Find-Leak '(?i)(?:\b[a-z]:|(?<![\w.])/[a-z])(?:\\{1,2}|/)Users(?:\\{1,2}|/)(?![\\/<])|\b[a-z]--Users-(?!<)' |
      Should -BeNullOrEmpty -Because 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean'
  }

  It 'ni el usuario de esta máquina suelto (ls -l)' {
    # Del home, no de $USERNAME, que en Git Bash vale SYSTEM (ticket 0068 §5).
    $user = Split-Path -Leaf ($env:USERPROFILE ?? $env:HOME)
    Find-Leak "\b$([regex]::Escape($user))\b" |
      Should -BeNullOrEmpty -Because 'el repo es público: pasa las salidas por tests/headless/extract.mjs clean'
  }
}
