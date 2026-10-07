param(
  [Parameter(Mandatory)][string]$Script,
  [Parameter(Mandatory)][string]$ArgsJson
)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$named = @{}
($ArgsJson | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $named[$_.Name] = $_.Value }
$global:ScriptSucceeded = $true
try {
  & { & $Script @named; $global:ScriptSucceeded = $? } 2>&1 | ForEach-Object {
    if ($_ -is [System.Management.Automation.ErrorRecord]) { [Console]::Error.WriteLine($_.Exception.Message) } else { $_ }
  }
}
catch {
  [Console]::Error.WriteLine($_.Exception.Message)
  exit 1
}
if ($global:ScriptSucceeded) { exit 0 }
exit $LASTEXITCODE
