$ErrorActionPreference = 'Stop'

$repoRoot = Split-Path -Parent $PSScriptRoot
$runRoot = Join-Path ([System.IO.Path]::GetTempPath()) 'social-cup-local'
$timestamp = Get-Date -Format 'yyyyMMdd-HHmmss'
$logRoot = Join-Path $runRoot $timestamp
$jobs = New-Object System.Collections.Generic.List[object]
$reused = New-Object System.Collections.Generic.List[string]

New-Item -ItemType Directory -Path $logRoot -Force | Out-Null

function Get-PortOwner {
  param([int]$Port)

  $connection = Get-NetTCPConnection -LocalPort $Port -State Listen -ErrorAction SilentlyContinue
  if (-not $connection) {
    return $null
  }

  return Get-CimInstance Win32_Process -Filter "ProcessId = $($connection[0].OwningProcess)" -ErrorAction SilentlyContinue
}

function Start-App {
  param(
    [string]$Name,
    [string]$Command,
    [string[]]$Arguments,
    [int]$Port
  )

  $owner = Get-PortOwner -Port $Port
  if ($owner) {
    $commandLine = [string]$owner.CommandLine
    $repoPattern = [regex]::Escape($repoRoot)
    if ($commandLine -match $repoPattern -or $commandLine -match '@social-cup') {
      $reused.Add($Name)
      Write-Host "$Name already running on port $Port (PID $($owner.ProcessId)); reusing it"
      return
    }

    throw "Port $Port is occupied by an unknown process (PID $($owner.ProcessId)). Stop and ask for approval before terminating it."
  }

  $stdout = Join-Path $logRoot "$Name.out.log"
  $stderr = Join-Path $logRoot "$Name.err.log"
  $config = [pscustomobject]@{
    Root = $repoRoot
    Executable = $Command
    CommandArguments = @($Arguments)
    OutputPath = $stdout
    ErrorPath = $stderr
  }
  $job = Start-Job -Name "social-cup-$Name" -ScriptBlock {
    param($Config)

    Set-Location $Config.Root
    & $Config.Executable @($Config.CommandArguments) 1> $Config.OutputPath 2> $Config.ErrorPath
  } -ArgumentList $config

  $jobs.Add([pscustomobject]@{ Name = $Name; Job = $job })
  Write-Host "$Name started (job $($job.Id), port $Port)"
}

try {
  $status = git status --short
  if ($LASTEXITCODE -ne 0) {
    throw 'Unable to read Git status before local startup.'
  }
  Write-Host 'Git status before startup:'
  if ($status) { $status } else { Write-Host 'CLEAN' }

  if (-not (Test-Path (Join-Path $repoRoot 'node_modules'))) {
    throw 'Root node_modules is missing. Install dependencies explicitly before running this workflow.'
  }
  foreach ($manifest in @('apps/api/package.json', 'apps/mobile/package.json', 'apps/admin-web/package.json', 'apps/barista-web/package.json')) {
    if (-not (Test-Path (Join-Path $repoRoot $manifest))) {
      throw "Required workspace manifest is missing: $manifest"
    }
  }

  Write-Host "Starting Social Cup local applications..."
  Write-Host "Logs: $logRoot"

  Start-App -Name 'api' -Command 'npm.cmd' -Arguments @('run', 'dev', '--workspace=@social-cup/api') -Port 3000
  Start-App -Name 'mobile' -Command 'npm.cmd' -Arguments @('run', 'web', '--workspace=@social-cup/mobile') -Port 4000
  Start-App -Name 'admin-web' -Command 'npm.cmd' -Arguments @('run', 'dev', '--workspace=@social-cup/admin-web') -Port 4002
  Start-App -Name 'barista-web' -Command 'npm.cmd' -Arguments @('run', 'dev', '--workspace=@social-cup/barista-web') -Port 4001

  Write-Host ''
  Write-Host 'Social Cup local applications are running:'
  Write-Host '  Mobile web: http://localhost:4000'
  Write-Host '  Admin web:  http://localhost:4002'
  Write-Host '  Barista web: http://localhost:4001'
  Write-Host '  API:        http://localhost:3000'
  Write-Host ''
  Write-Host 'Press Ctrl+C to stop only processes started by this launcher.'

  Start-Sleep -Seconds 15
  foreach ($port in @(3000, 4000, 4001, 4002)) {
    if (-not (Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue)) {
      throw "No application is listening on port $port. Check logs in $logRoot."
    }
  }
  try {
    $health = Invoke-RestMethod -Uri 'http://localhost:3000/health' -TimeoutSec 10
    if ($health.status -ne 'ok') { throw 'Unexpected health response.' }
  } catch {
    throw "API health check failed: $($_.Exception.Message)"
  }

  if ($reused.Count -gt 0) {
    Write-Host "Reused applications: $($reused -join ', ')"
  }

  while ($true) {
    Start-Sleep -Seconds 2
  }
}
finally {
  foreach ($entry in $jobs) {
    Stop-Job -Job $entry.Job -ErrorAction SilentlyContinue
    Remove-Job -Job $entry.Job -Force -ErrorAction SilentlyContinue
  }
  Write-Host "Stopped local applications. Logs remain at $logRoot"
}
