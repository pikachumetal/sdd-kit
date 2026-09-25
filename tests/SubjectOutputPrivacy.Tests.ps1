BeforeAll {
  $script:KitRoot = if ($env:SDD_KIT_ROOT) { $env:SDD_KIT_ROOT } else { (Resolve-Path (Join-Path $PSScriptRoot '..')).Path }
  # Lanzador de referencia: subject.sh de la 0039 extrae las salidas con este tools.mjs.
  $script:Tools = Join-Path $script:KitRoot '.docs/sdd/specs/20260923-120510-task-0009-merge-close/red/tools.mjs'

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
  It 'tools.mjs los sustituye en el extracto del stream' {
    $stream = Join-Path $TestDrive 'stream.jsonl'
    $event = @{ message = @{ content = @(@{ type = 'tool_result'; content = $script:Leaky }) } } | ConvertTo-Json -Depth 5 -Compress
    Set-Content -LiteralPath $stream -Value $event -Encoding utf8NoBOM

    $out = Invoke-Tools @($stream, '/c/runs/x')

    $out | Should -Not -Match '\balice\b'
    $out | Should -Match '<home>/\.claude/plugins'
    $out | Should -Match '<home>\\AppData'
    $out | Should -Match '1 <user> 197609'
    $out | Should -Match 'alicemetal/sdd-kit' -Because 'solo se sustituye el usuario como palabra entera'
  }

  It 'tools.mjs --clean filtra la entrada estándar (state.txt)' {
    $out = Invoke-Tools @('--clean', '/c/runs/x') $script:Leaky

    $out | Should -Not -Match '\balice\b'
    $out | Should -Match '<home>/\.claude/plugins'
  }
}
