# Casino-Club F2P Docker Management Tool (Unicode Fixed)
# UTF-8 인코딩 강제 설정 
param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$Service = "",
    
    [switch]$Tools,
    [switch]$Force
)

# PowerShell 인코딩 강제 설정
$PSDefaultParameterValues['*:Encoding'] = 'utf8'
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::InputEncoding = [System.Text.Encoding]::UTF8

$ErrorActionPreference = "Stop"

# 안전한 컬러 출력 함수 (이모지 제거)
function Write-Status {
    param([string]$Message, [string]$Type = "Info")
    
    switch ($Type) {
        "Success" { Write-Host "[SUCCESS] $Message" -ForegroundColor Green }
        "Error"   { Write-Host "[ERROR] $Message" -ForegroundColor Red }
        "Warning" { Write-Host "[WARNING] $Message" -ForegroundColor Yellow }
        "Info"    { Write-Host "[INFO] $Message" -ForegroundColor Cyan }
        default   { Write-Host "$Message" -ForegroundColor White }
    }
}

function Show-Help {
    Write-Status "Casino-Club F2P Docker Management Tool" "Info"
    Write-Host "=================================================="
    Write-Host "Usage: .\docker-manage-unicode-fix.ps1 <command> [options]"
    Write-Host ""
    Write-Status "Main Commands:" "Info"
    Write-Host "  setup           - Initial environment setup"
    Write-Host "  start           - Start services"
    Write-Host "  stop            - Stop services"
    Write-Host "  restart         - Restart services"
    Write-Host "  status          - Check service status"
    Write-Host "  logs            - View logs"
    Write-Host "  shell           - Access container"
    Write-Host "  migrate         - Database migration"
    Write-Host "  mcp             - Start MCP server for Figma"
    Write-Host "  reset           - Complete reset"
    Write-Host "  clean           - Cleanup"
    Write-Host ""
    Write-Status "Options:" "Info"
    Write-Host "  --tools      - Include dev tools (pgAdmin, Redis Commander)"
    Write-Host "  --force      - Force execution"
    Write-Host ""
    Write-Status "Examples:" "Info"
    Write-Host "  .\docker-manage-unicode-fix.ps1 start --tools"
    Write-Host "  .\docker-manage-unicode-fix.ps1 logs backend"
    Write-Host "  .\docker-manage-unicode-fix.ps1 reset --force"
}

function Test-DockerRunning {
    try {
        docker info 2>&1 | Out-Null
        return $true
    } catch {
        Write-Status "Docker is not running. Please start Docker Desktop." "Error"
        exit 1
    }
}

function Start-Services {
    Write-Status "Starting Casino-Club F2P services..." "Info"
    
    Test-DockerRunning
    
    $composeArgs = @("up", "-d", "--build")
    
    if ($Tools) {
        $composeArgs += "--profile"
        $composeArgs += "tools"
        Write-Status "Including development tools..." "Info"
    }
    
    try {
        & docker-compose @composeArgs
        Write-Status "Services started successfully!" "Success"
        Show-ServiceStatus
    } catch {
        Write-Status "Failed to start services: $($_.Exception.Message)" "Error"
        exit 1
    }
}

function Stop-Services {
    Write-Status "Stopping services..." "Info"
    
    try {
        docker-compose down
        Write-Status "Services stopped successfully!" "Success"
    } catch {
        Write-Status "Failed to stop services: $($_.Exception.Message)" "Error"
    }
}

function Show-ServiceStatus {
    Write-Status "Service Status:" "Info"
    docker-compose ps
    
    Write-Host ""
    Write-Status "Service URLs:" "Info"
    Write-Host "  Frontend:    http://localhost:18000"
    Write-Host "  Backend API: http://localhost:8001"
    Write-Host "  API Docs:    http://localhost:8001/docs"
    Write-Host "  MCP Server:  ws://localhost:10800"
    
    if ($Tools) {
        Write-Host "  pgAdmin:     http://localhost:5050"
        Write-Host "  Redis UI:    http://localhost:8081"
        Write-Host "  Kafka UI:    http://localhost:8082"
    }
}

function Show-Logs {
    if ($Service) {
        Write-Status "Showing logs for: $Service" "Info"
        docker-compose logs -f $Service
    } else {
        Write-Status "Showing all logs:" "Info"
        docker-compose logs -f
    }
}

function Access-Shell {
    if (-not $Service) {
        Write-Status "Please specify service: backend, frontend, postgres, redis" "Warning"
        return
    }
    
    Write-Status "Accessing $Service container..." "Info"
    
    switch ($Service.ToLower()) {
        "backend" { 
            docker exec -it cc_backend bash
        }
        "frontend" { 
            docker exec -it cc_frontend sh
        }
        "postgres" { 
            docker exec -it cc_postgres psql -U cc_user -d cc_webapp
        }
        "redis" { 
            docker exec -it cc_redis redis-cli
        }
        default {
            Write-Status "Unknown service: $Service" "Error"
        }
    }
}

function Run-Migration {
    Write-Status "Running database migration..." "Info"
    
    try {
        docker exec -it cc_backend alembic upgrade head
        Write-Status "Migration completed!" "Success"
    } catch {
        Write-Status "Migration failed: $($_.Exception.Message)" "Error"
    }
}

function Start-MCPServer {
    Write-Status "Starting MCP Server for Figma integration..." "Info"
    
    # MCP 서버를 백그라운드에서 실행
    $mcpPort = 10800
    Write-Status "MCP Server will run on port $mcpPort" "Info"
    
    # VS Code MCP Server 확장이 이미 설치되어 있는지 확인
    Write-Status "Please ensure VS Code MCP Server extension is running" "Warning"
    Write-Status "Figma MCP Configuration:" "Info"
    Write-Host "  - WebSocket URL: ws://localhost:$mcpPort"
    Write-Host "  - Session ID: Generate a new one in Figma"
    Write-Host "  - Use this configuration in Figma MCP plugin"
}

function Reset-Environment {
    if (!$Force) {
        $confirm = Read-Host "WARNING: All data will be deleted. Continue? (y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-Status "Cancelled." "Warning"
            return
        }
    }
    
    Write-Status "Performing complete reset..." "Warning"
    
    # Stop and remove containers
    docker-compose down --volumes --remove-orphans
    
    # Clean up images
    docker system prune -f
    
    # Clean logs
    if (Test-Path "logs") {
        Remove-Item -Path "logs\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    Write-Status "Complete reset finished!" "Success"
    Write-Status "Run: .\docker-manage-unicode-fix.ps1 setup" "Info"
}

# Main execution logic
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Stop-Services; Start-Services }
    "status" { Show-ServiceStatus }
    "logs" { Show-Logs }
    "shell" { Access-Shell }
    "migrate" { Run-Migration }
    "mcp" { Start-MCPServer }
    "reset" { Reset-Environment }
    "clean" { Reset-Environment }
    default {
        Write-Status "Unknown command: $Command" "Error"
        Show-Help
        exit 1
    }
}
