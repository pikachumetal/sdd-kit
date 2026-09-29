BeforeAll {
  . (Join-Path $PSScriptRoot 'Clear-GitEnv.ps1')
  $script:SavedGitEnv = Clear-GitEnv
  $script:Watcher = Join-Path $PSScriptRoot '..' 'skills' 'sdd-templates' 'scripts' 'Watch-SubagentSilence.ps1'
  $script:Description = 'Revisor final 0095'

  function New-Worktree([hashtable]$Config) {
    $repo = Join-Path $TestDrive ("repo-" + [guid]::NewGuid().ToString('N').Substring(0, 8))
    New-Item -ItemType Directory -Path (Join-Path $repo '.docs/sdd') -Force | Out-Null
    if ($null -ne $Config) {
      $Config | ConvertTo-Json -Depth 8 | Set-Content -LiteralPath (Join-Path $repo '.docs/sdd/sdd-kit.json')
    }
    return $repo
  }

  function Get-SubagentFolder([string]$Repo) {
    $name = $Repo -replace '[^A-Za-z0-9]', '-'
    $folder = Join-Path $TestDrive 'projects' $name 's1' 'subagents'
    New-Item -ItemType Directory -Path $folder -Force | Out-Null
    return $folder
  }

  function New-Transcript([string]$Repo, [object[]]$Events, [double]$AgeMinutes) {
    $folder = Get-SubagentFolder $Repo
    $file = Join-Path $folder 'agent-t1.jsonl'
    $Events | ForEach-Object { $_ | ConvertTo-Json -Depth 16 -Compress } | Set-Content -LiteralPath $file
    @{ description = $script:Description } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $folder 'agent-t1.meta.json')
    (Get-Item -LiteralPath $file).LastWriteTimeUtc = [datetime]::UtcNow.AddMinutes(-$AgeMinutes)
  }

  function New-ToolUse([string]$Name, [hashtable]$ToolInput, [string]$Id = 'toolu_last', [string]$At = '2026-09-28T13:26:12.428Z') {
    return @{ type = 'assistant'; timestamp = $At
      message = @{ id = "msg_$Id"; stop_reason = 'tool_use'; usage = @{ output_tokens = 0 }
        content = @(@{ type = 'tool_use'; id = $Id; name = $Name; input = $ToolInput }) } }
  }

  function New-ToolResult([string]$Id) {
    return @{ type = 'user'; timestamp = '2026-09-28T13:26:00.000Z'
      message = @{ content = @(@{ type = 'tool_result'; tool_use_id = $Id; content = 'ok' }) } }
  }

  function New-Hook([string]$HookEvent, [string]$ToolUseId) {
    return @{ type = 'attachment'; timestamp = '2026-09-28T13:26:00.000Z'
      attachment = @{ type = 'hook_success'; hookEvent = $HookEvent; toolUseID = $ToolUseId } }
  }

  function Invoke-Watcher([string]$Repo, [string[]]$Extra = @()) {
    $arguments = @('-NoProfile', '-File', $script:Watcher, '-Worktree', $Repo,
      '-ProjectsRoot', (Join-Path $TestDrive 'projects'), '-Once') + $Extra
    if ($Extra -notcontains '-Path' -and $Extra -notcontains '-Description') {
      $arguments += @('-Description', $script:Description)
    }
    return , @(& pwsh @arguments)
  }

  $script:DefaultConfig = @{ control = @{ silence = @{ betweenStepsMinutes = 8; longCommandMinutes = 20 } } }
  $script:ReadCall = New-ToolUse 'Read' @{ file_path = 'C:\repo\.superpowers\sdd\plan\review-final-0f264440.diff'; offset = 500; limit = 420 }
  $script:PesterCall = New-ToolUse 'PowerShell' @{ command = 'Invoke-Pester tests/' }
}

AfterAll {
  Restore-GitEnv $script:SavedGitEnv
}

Describe 'Watch-SubagentSilence' -Tag 'Slow' {
  It 'avisa con un Read sin tool_result a los 8 min 30 s' {
    $repo = New-Worktree $script:DefaultConfig
    New-Transcript $repo @($script:ReadCall) 8.5
    $output = Invoke-Watcher $repo
    $output[0] | Should -BeLike 'SILENCIO:*'
    $output[0] | Should -BeLike '*umbral 8 min*'
  }

  It 'no avisa con un PowerShell sin tool_result a los 15 min' {
    $repo = New-Worktree $script:DefaultConfig
    New-Transcript $repo @($script:PesterCall) 15
    (Invoke-Watcher $repo)[0] | Should -BeLike 'EN MARCHA:*'
  }

  It 'avisa con un PowerShell sin tool_result a los 20 min 30 s' {
    $repo = New-Worktree $script:DefaultConfig
    New-Transcript $repo @($script:PesterCall) 20.5
    $output = Invoke-Watcher $repo
    $output[0] | Should -BeLike 'SILENCIO:*'
    $output[0] | Should -BeLike '*umbral 20 min*'
  }

  It 'aplica betweenStepsMinutes 5 de sdd-kit.json' {
    $repo = New-Worktree @{ control = @{ silence = @{ betweenStepsMinutes = 5; longCommandMinutes = 20 } } }
    New-Transcript $repo @($script:ReadCall) 5.5
    $output = Invoke-Watcher $repo
    $output[0] | Should -BeLike 'SILENCIO:*'
    $output[0] | Should -BeLike '*umbral 5 min*'
  }

  It 'aplica 8 y 20 sin el bloque control.silence' {
    $repo = New-Worktree @{ version = '2.0.0' }
    New-Transcript $repo @($script:ReadCall) 8.5
    (Invoke-Watcher $repo)[0] | Should -BeLike '*umbral 8 min*'
  }

  It 'da el diagnóstico del último evento' {
    $repo = New-Worktree $script:DefaultConfig
    $start = @{ type = 'user'; timestamp = '2026-09-28T13:25:35.518Z'; message = @{ content = 'encargo' } }
    $earlier = New-ToolUse 'Read' @{ file_path = 'C:\repo\plan.md' } 'toolu_first' '2026-09-28T13:25:50.000Z'
    $earlier.message.usage.output_tokens = 1200
    $events = @($start, $earlier, (New-Hook 'PreToolUse' 'toolu_first'), (New-ToolResult 'toolu_first'), $script:ReadCall)
    New-Transcript $repo $events 9
    $text = (Invoke-Watcher $repo) -join "`n"
    foreach ($expected in '13:26:12Z', 'Read', 'review-final-0f264440.diff', 'offset 500', 'limit 420',
      'sin PreToolUse', 'sin petición de permiso', '1200 tokens de salida') {
      $text | Should -BeLike "*$expected*"
    }
  }

  It 'señala un PermissionRequest pendiente' {
    $repo = New-Worktree $script:DefaultConfig
    New-Transcript $repo @($script:ReadCall, (New-Hook 'PermissionRequest' 'toolu_last')) 9
    ((Invoke-Watcher $repo) -join "`n") | Should -BeLike '*petición de permiso pendiente*'
  }

  It 'termina sin aviso cuando el subagente acabó' {
    $repo = New-Worktree $script:DefaultConfig
    $final = @{ type = 'assistant'; timestamp = '2026-09-28T13:30:00.000Z'
      message = @{ id = 'msg_end'; stop_reason = 'end_turn'; usage = @{ output_tokens = 300 }; content = @(@{ type = 'text'; text = 'listo' }) } }
    New-Transcript $repo @($script:ReadCall, (New-ToolResult 'toolu_last'), $final, (New-Hook 'SubagentStop' '')) 13
    (Invoke-Watcher $repo)[0] | Should -BeLike 'TERMINADO:*'
  }

  It 'vigila la salida de un comando con longCommandMinutes' {
    $repo = New-Worktree $script:DefaultConfig
    $log = Join-Path $TestDrive 'pester.log'
    'Running tests' | Set-Content -LiteralPath $log
    (Get-Item -LiteralPath $log).LastWriteTimeUtc = [datetime]::UtcNow.AddMinutes(-21)
    $output = Invoke-Watcher $repo @('-Path', $log)
    $output[0] | Should -BeLike 'SILENCIO:*'
    $output[0] | Should -BeLike '*umbral 20 min*'
  }

  It 'con -Once toma el despacho más reciente de los que repiten description' {
    $repo = New-Worktree $script:DefaultConfig
    New-Transcript $repo @($script:ReadCall) 30
    $folder = Get-SubagentFolder $repo
    (Get-Item -LiteralPath (Join-Path $folder 'agent-t1.meta.json')).LastWriteTimeUtc = [datetime]::UtcNow.AddMinutes(-30)
    ($script:ReadCall | ConvertTo-Json -Depth 16 -Compress) | Set-Content -LiteralPath (Join-Path $folder 'agent-t2.jsonl')
    @{ description = $script:Description } | ConvertTo-Json | Set-Content -LiteralPath (Join-Path $folder 'agent-t2.meta.json')
    (Invoke-Watcher $repo)[0] | Should -BeLike 'EN MARCHA:*'
  }

  It 'con -Once encuentra un despacho de hace 5 min que sigue en marcha' {
    $repo = New-Worktree $script:DefaultConfig
    New-Transcript $repo @($script:ReadCall) 1
    (Get-Item -LiteralPath (Join-Path (Get-SubagentFolder $repo) 'agent-t1.meta.json')).LastWriteTimeUtc = [datetime]::UtcNow.AddMinutes(-5)
    (Invoke-Watcher $repo)[0] | Should -BeLike 'EN MARCHA:*'
  }

  It 'aplica longCommandMinutes si hay un PowerShell pendiente en paralelo con un Read ya respondido' {
    $repo = New-Worktree $script:DefaultConfig
    $shell = New-ToolUse 'PowerShell' @{ command = 'Invoke-Pester tests/' } 'toolu_shell'
    $read = New-ToolUse 'Read' @{ file_path = 'C:\repo\plan.md' } 'toolu_read'
    New-Transcript $repo @($shell, $read, (New-ToolResult 'toolu_read')) 9
    (Invoke-Watcher $repo)[0] | Should -BeLike 'EN MARCHA:*umbral 20 min*'
  }

  It 'aplica el default con un umbral <Value> en sdd-kit.json' -ForEach @(
    @{ Value = 'null'; Silence = @{ betweenStepsMinutes = $null; longCommandMinutes = 20 } }
    @{ Value = 'cero'; Silence = @{ betweenStepsMinutes = 0; longCommandMinutes = 20 } }
    @{ Value = 'negativo'; Silence = @{ betweenStepsMinutes = -3; longCommandMinutes = 20 } }
    @{ Value = 'de texto'; Silence = @{ betweenStepsMinutes = 'abc'; longCommandMinutes = 20 } }
  ) {
    $repo = New-Worktree @{ control = @{ silence = $Silence } }
    New-Transcript $repo @($script:ReadCall) 5
    (Invoke-Watcher $repo)[0] | Should -BeLike 'EN MARCHA:*umbral 8 min*'
  }

  It 'aplica los defaults con un sdd-kit.json que no es JSON' {
    $repo = New-Worktree $null
    '{ control: ' | Set-Content -LiteralPath (Join-Path $repo '.docs/sdd/sdd-kit.json')
    New-Transcript $repo @($script:ReadCall) 8.5
    (Invoke-Watcher $repo)[0] | Should -BeLike 'SILENCIO:*umbral 8 min*'
  }

  It 'avisa aunque el último evento no tenga timestamp' {
    $repo = New-Worktree $script:DefaultConfig
    $call = New-ToolUse 'Read' @{ file_path = 'C:\repo\plan.md' }
    $call.Remove('timestamp')
    New-Transcript $repo @($call) 9
    $text = (Invoke-Watcher $repo) -join "`n"
    $text | Should -BeLike 'SILENCIO:*'
    $text | Should -BeLike '*hora desconocida*'
  }

  It 'ignora un meta.json corrupto de otro despacho' {
    $repo = New-Worktree $script:DefaultConfig
    New-Transcript $repo @($script:ReadCall) 8.5
    '{ "descr' | Set-Content -LiteralPath (Join-Path (Get-SubagentFolder $repo) 'agent-t2.meta.json')
    (Invoke-Watcher $repo)[0] | Should -BeLike 'SILENCIO:*'
  }

  It 'toma el worktree de la raíz del repo aunque se lance desde un subdirectorio' {
    $repo = New-Worktree $script:DefaultConfig
    git -C $repo init -q
    New-Transcript $repo @($script:ReadCall) 8.5
    $sub = Join-Path $repo 'src'
    New-Item -ItemType Directory -Path $sub | Out-Null
    Push-Location $sub
    try {
      $output = @(& pwsh -NoProfile -File $script:Watcher -ProjectsRoot (Join-Path $TestDrive 'projects') -Once -Description $script:Description)
    } finally { Pop-Location }
    $output[0] | Should -BeLike 'SILENCIO:*'
  }

  It 'dice SIN TRANSCRIPT si no encuentra el despacho' {
    $repo = New-Worktree $script:DefaultConfig
    (Invoke-Watcher $repo @('-Description', 'no existe'))[0] | Should -BeLike 'SIN TRANSCRIPT:*'
  }
}
