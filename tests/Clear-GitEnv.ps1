# Git exporta estas variables a sus hooks y ganan a `git -C`: heredadas del pre-commit, una fixture
# escribiría en el índice o en el repositorio del commit en curso.
$script:GitEnvNames = @('GIT_DIR', 'GIT_WORK_TREE', 'GIT_INDEX_FILE', 'GIT_COMMON_DIR', 'GIT_OBJECT_DIRECTORY')

function Clear-GitEnv {
  $saved = @{}
  foreach ($name in $script:GitEnvNames) {
    $saved[$name] = [Environment]::GetEnvironmentVariable($name)
    Remove-Item -LiteralPath "Env:\$name" -ErrorAction SilentlyContinue
  }
  return $saved
}

function Restore-GitEnv([hashtable]$Saved) {
  if ($null -eq $Saved) { return }
  foreach ($name in $Saved.Keys) {
    if ($null -eq $Saved[$name]) { Remove-Item -LiteralPath "Env:\$name" -ErrorAction SilentlyContinue; continue }
    Set-Item -LiteralPath "Env:\$name" -Value $Saved[$name]
  }
}
