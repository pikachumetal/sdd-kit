BeforeAll {
  $script:Hook = Join-Path $PSScriptRoot '../.docs/sdd/specs/20260925-180248-feature-0036-closing-verification/green/deny-kill.mjs'

  function Test-Denied([string]$Command) {
    $payload = @{ tool_input = @{ command = $Command } } | ConvertTo-Json -Compress
    $output = $payload | node $script:Hook
    return [bool]($output -match '"deny"')
  }
}

# Slow porque ejecuta el script sobre ficheros temporales: sale del pre-commit (patch 0087) y lo corre la suite completa.
Describe 'deny-kill.mjs' -Tag 'Slow' {
  It 'deniega <Command>' -ForEach @(
    @{ Command = 'taskkill //F //IM node.exe' }
    @{ Command = 'pkill -f "node server.mjs"' }
    @{ Command = 'killall node' }
    @{ Command = 'Stop-Process -Name node -Force' }
    @{ Command = 'kill -Name node' }
    @{ Command = 'Get-Process node | Stop-Process' }
    @{ Command = 'Get-Process node | ForEach-Object { Stop-Process -Id $_.Id }' }
    @{ Command = "Get-CimInstance Win32_Process -Filter `"Name='node.exe'`" | Invoke-CimMethod -MethodName Terminate" }
    @{ Command = "Get-CimInstance Win32_Process | Where-Object { `$_.CommandLine -match 'server.mjs' } | ForEach-Object { Stop-Process -Id `$_.ProcessId }" }
    @{ Command = 'pgrep node | xargs kill' }
    @{ Command = 'wmic process where name="node.exe" call terminate' }
  ) {
    Test-Denied $Command | Should -BeTrue
  }

  It 'deja pasar <Command>' -ForEach @(
    @{ Command = 'kill $(cat /tmp/salas.pid)' }
    @{ Command = 'Stop-Process -Id 4242 -Force' }
    @{ Command = 'Get-Process -Id 4242 | Stop-Process' }
    @{ Command = 'Get-NetTCPConnection -LocalPort 4656 -State Listen | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }' }
    @{ Command = 'taskkill /F /PID 1234' }
    @{ Command = 'Get-Process node' }
  ) {
    Test-Denied $Command | Should -BeFalse
  }
}
