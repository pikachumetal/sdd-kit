param(
  [Parameter(Mandatory)][string]$Script,
  [Parameter(Mandatory)][string]$ArgsJson
)
[Console]::OutputEncoding = [System.Text.UTF8Encoding]::new()
$named = @{}
($ArgsJson | ConvertFrom-Json).PSObject.Properties | ForEach-Object { $named[$_.Name] = $_.Value }
& $Script @named
exit $LASTEXITCODE
