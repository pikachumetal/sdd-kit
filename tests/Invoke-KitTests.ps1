# Lo lanzan kit:test, kit:test-fast y kit:test-headless de moon.yml. Va en un script porque moon sustituye $nombre
# en los args como variable de entorno (patch 0183).
param([string[]]$ExcludeTag = @(), [switch]$Headless)

# Los del lanzador de sujetos (~700 s) van aparte, en kit:test-headless, que el gate solo corre si cambian (0223).
$headlessTests = 'HeadlessLauncher.Tests.ps1', 'Battery.Tests.ps1' | ForEach-Object { Join-Path $PSScriptRoot $_ }

# Un test que captura la salida de git pierde lo que no es ASCII si la consola que hereda no es 65001.
[Console]::OutputEncoding = [Text.Encoding]::UTF8
# Los temporales mueren con el worktree, y el techo impide que una fixture sin git encuentre el repo del kit.
$temp = (New-Item -ItemType Directory -Force -Path (Join-Path (Split-Path $PSScriptRoot) '.temp')).FullName
$env:TEMP = $temp
$env:TMP = $temp
$env:GIT_CEILING_DIRECTORIES = $temp
$pester = if ($Headless) { @{ Path = $headlessTests } } else { @{ Path = $PSScriptRoot; ExcludePath = $headlessTests } }
$result = Invoke-Pester @pester -ExcludeTagFilter $ExcludeTag -PassThru -Output Minimal
# Un .Tests.ps1 que no parsea cuenta en FailedContainersCount, no en FailedCount.
exit ($result.FailedCount + $result.FailedContainersCount)
