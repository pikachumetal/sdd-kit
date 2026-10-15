# Lo lanzan kit:test y kit:test-fast de moon.yml. Va en un script porque moon sustituye $nombre
# en los args como variable de entorno (patch 0183).
param([string[]]$ExcludeTag = @())

# Un test que captura la salida de git pierde lo que no es ASCII si la consola que hereda no es 65001.
[Console]::OutputEncoding = [Text.Encoding]::UTF8
$result = Invoke-Pester -Path $PSScriptRoot -ExcludeTagFilter $ExcludeTag -PassThru -Output Minimal
# Un .Tests.ps1 que no parsea cuenta en FailedContainersCount, no en FailedCount.
exit ($result.FailedCount + $result.FailedContainersCount)
