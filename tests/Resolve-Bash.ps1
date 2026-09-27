# En Windows, `bash` del PATH suele ser el lanzador de WSL, que no ejecuta scripts sin distro: se prefiere Git Bash.
function Resolve-Bash {
  $gitBash = @("$env:ProgramFiles\Git\bin\bash.exe", "${env:ProgramFiles(x86)}\Git\bin\bash.exe") |
    Where-Object { Test-Path $_ } | Select-Object -First 1
  if ($gitBash) { return $gitBash }
  $onPath = Get-Command bash -ErrorAction SilentlyContinue
  if ($onPath -and $onPath.Source -notmatch 'System32') { return $onPath.Source }
}
