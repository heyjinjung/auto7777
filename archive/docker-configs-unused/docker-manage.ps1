# -*- coding: utf-8 -*-
# Casino-Club F2P Docker 관리 스크립트 v2.1 (UTF-8)

param(
    [Parameter(Position=0)]
    [string]$Command = "help",
    
    [Parameter(Position=1)]
    [string]$Service = "",
    
    [switch]$Tools,
    [switch]$Force
)

$ErrorActionPreference = "Stop"
$OutputEncoding = [System.Text.Encoding]::UTF8
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 컬러 출력 함수
function Write-ColoredOutput {
    param([string]$Message, [string]$Color = "White")
    Write-Host $Message -ForegroundColor $Color
}

function Show-Help {
    Write-ColoredOutput "🎰 Casino-Club F2P Docker Management Tool" "Cyan"
    Write-ColoredOutput "==================================================" "Gray"
    Write-ColoredOutput "Usage: .\docker-manage.ps1 <command> [options]" "Yellow"
    Write-ColoredOutput ""
    Write-ColoredOutput "📋 Main Commands:" "Green"
    Write-ColoredOutput "  setup           - Initial environment setup" "White"
    Write-ColoredOutput "  start           - Start services" "White"
    Write-ColoredOutput "  stop            - Stop services" "White"
    Write-ColoredOutput "  restart         - Restart services" "White"
    Write-ColoredOutput "  status          - Check service status" "White"
    Write-ColoredOutput "  logs            - View logs" "White"
    Write-ColoredOutput "  shell           - Access container" "White"
    Write-ColoredOutput "  migrate         - Database migration" "White"
    Write-ColoredOutput "  new-migration   - Create new migration" "White"
    Write-ColoredOutput "  backup          - Database backup" "White"
    Write-ColoredOutput "  reset           - Complete reset" "White"
    Write-ColoredOutput "  clean           - Cleanup" "White"
    Write-ColoredOutput ""
    Write-ColoredOutput "🔧 Options:" "Green"
    Write-ColoredOutput "  --tools      - Include dev tools (pgAdmin, Redis Commander)" "White"
    Write-ColoredOutput "  --force      - Force execution" "White"
    Write-ColoredOutput ""
    Write-ColoredOutput "📚 Examples:" "Green"
    Write-ColoredOutput "  .\docker-manage.ps1 start --tools" "Gray"
    Write-ColoredOutput "  .\docker-manage.ps1 logs backend" "Gray"
    Write-ColoredOutput "  .\docker-manage.ps1 shell backend" "Gray"
    Write-ColoredOutput "  .\docker-manage.ps1 migrate --force" "Gray"
    Write-ColoredOutput "  .\docker-manage.ps1 new-migration 'Add user tables'" "Gray"
    Write-ColoredOutput "  .\docker-manage.ps1 backup" "Gray"
    Write-ColoredOutput "  .\docker-manage.ps1 reset --force" "Gray"
}

function Test-DockerRunning {
    try {
        docker info | Out-Null
        return $true
    } catch {
        Write-ColoredOutput "❌ Docker is not running. Please start Docker Desktop." "Red"
        exit 1
    }
}

function Setup-Environment {
    Write-ColoredOutput "🚀 Casino-Club F2P Environment Setup..." "Cyan"
    
    # Docker status check
    Test-DockerRunning
    
    # Create required directories
    $directories = @(
        "logs/backend",
        "logs/frontend", 
        "logs/postgres",
        "logs/celery",
        "data/init",
        "data/backup"
    )
    
    foreach ($dir in $directories) {
        if (!(Test-Path $dir)) {
            New-Item -ItemType Directory -Path $dir -Force | Out-Null
            Write-ColoredOutput "📁 Directory created: $dir" "Green"
        } else {
            Write-ColoredOutput "📁 Directory exists: $dir" "Gray"
        }
    }
    
    # Check environment files
    if (!(Test-Path ".env.development")) {
        Write-ColoredOutput "⚠️ .env.development file not found." "Yellow"
        Write-ColoredOutput "Please create .env.development file according to the guide." "Yellow"
    } else {
        Write-ColoredOutput "✅ .env.development file exists" "Green"
    }
    
    # Validate Docker Compose configuration
    Write-ColoredOutput "🔍 Validating Docker Compose configuration..." "Cyan"
    try {
        docker-compose config --quiet
        Write-ColoredOutput "✅ Docker Compose configuration valid" "Green"
    } catch {
        Write-ColoredOutput "❌ Docker Compose configuration error: $($_.Exception.Message)" "Red"
        return
    }
    
    Write-ColoredOutput "✅ Environment setup complete!" "Green"
}

function Start-Services {
    Write-ColoredOutput "🚀 Starting services..." "Cyan"
    
    Test-DockerRunning
    
    $composeArgs = @("up", "-d", "--build")
    
    if ($Tools) {
        $composeArgs += "--profile"
        $composeArgs += "tools"
        Write-ColoredOutput "🛠️ Starting with development tools..." "Yellow"
    }
    
    try {
        & docker-compose @composeArgs
        Start-Sleep -Seconds 5
        Write-ColoredOutput "✅ Services started successfully!" "Green"
        Show-ServiceStatus
    } catch {
        Write-ColoredOutput "❌ Failed to start services: $($_.Exception.Message)" "Red"
        exit 1
    }
}

function Stop-Services {
    Write-ColoredOutput "🛑 Stopping services..." "Cyan"
    
    try {
        docker-compose down
        Write-ColoredOutput "✅ Services stopped successfully!" "Green"
    } catch {
        Write-ColoredOutput "❌ Failed to stop services: $($_.Exception.Message)" "Red"
    }
}

function Show-ServiceStatus {
    Write-ColoredOutput "📊 Service Status:" "Cyan"
    docker-compose ps
    
    Write-ColoredOutput "`n🌐 Service URLs:" "Cyan"
    Write-ColoredOutput "  Frontend:    http://localhost:3000" "Green"
    Write-ColoredOutput "  Backend API: http://localhost:8000" "Green"
    Write-ColoredOutput "  API Docs:    http://localhost:8000/docs" "Green"
    
    if ($Tools) {
        Write-ColoredOutput "  pgAdmin:     http://localhost:5050" "Yellow"
        Write-ColoredOutput "  Redis UI:    http://localhost:8081" "Yellow"
    }
}

function Show-Logs {
    if ($Service) {
        Write-ColoredOutput "📋 $Service logs:" "Cyan"
        docker-compose logs -f $Service
    } else {
        Write-ColoredOutput "📋 All logs:" "Cyan"
        docker-compose logs -f
    }
}

function Enter-Shell {
    if (!$Service) {
        Write-ColoredOutput "❌ Please specify service name." "Red"
        Write-ColoredOutput "Available services: backend, frontend, postgres, redis" "Yellow"
        return
    }
    
    $containerName = switch ($Service.ToLower()) {
        "backend" { "cc_backend" }
        "frontend" { "cc_frontend" }
        "postgres" { "cc_postgres" }
        "redis" { "cc_redis" }
        default { 
            Write-ColoredOutput "❌ Unknown service: $Service" "Red"
            return
        }
    }
    
    Write-ColoredOutput "🔗 Connecting to $Service container..." "Cyan"
    
    # Check container status
    $containerStatus = docker ps --filter "name=$containerName" --format "{{.Status}}"
    if (!$containerStatus) {
        Write-ColoredOutput "❌ $Service container is not running." "Red"
        Write-ColoredOutput "Start services with: .\docker-manage.ps1 start" "Yellow"
        return
    }
    
    # Select appropriate shell
    if ($Service.ToLower() -eq "backend" -or $Service.ToLower() -eq "frontend") {
        docker exec -it $containerName bash
    } elseif ($Service.ToLower() -eq "postgres") {
        Write-ColoredOutput "PostgreSQL container connection (using psql):" "Yellow"
        docker exec -it $containerName psql -U cc_user -d cc_webapp
    } elseif ($Service.ToLower() -eq "redis") {
        Write-ColoredOutput "Redis container connection (using redis-cli):" "Yellow"
        docker exec -it $containerName redis-cli
    }
}

function Run-Migration {
    Write-ColoredOutput "🗄️ Running database migration..." "Cyan"
    
    # Check backend container status
    $containerStatus = docker ps --filter "name=cc_backend" --format "{{.Status}}"
    if (!$containerStatus) {
        Write-ColoredOutput "❌ Backend container is not running." "Red"
        Write-ColoredOutput "Start services with: .\docker-manage.ps1 start" "Yellow"
        return
    }
    
    try {
        Write-ColoredOutput "📜 Checking migration history..." "Yellow"
        docker exec cc_backend alembic history
        
        Write-ColoredOutput "🔍 Checking current revision..." "Yellow" 
        docker exec cc_backend alembic current
        
        if ($Force) {
            Write-ColoredOutput "🚀 Force migration (stamp head)..." "Yellow"
            docker exec cc_backend alembic stamp head
        }
        
        Write-ColoredOutput "🔄 Upgrading migration..." "Yellow"
        docker exec cc_backend alembic upgrade head
        
        Write-ColoredOutput "✅ Migration complete!" "Green"
        
        Write-ColoredOutput "📊 Final status:" "Cyan"
        docker exec cc_backend alembic current --verbose
        
    } catch {
        Write-ColoredOutput "❌ Migration failed: $($_.Exception.Message)" "Red"
        Write-ColoredOutput "💡 Manual check with: .\docker-manage.ps1 shell backend" "Yellow"
    }
}

function Create-Migration {
    param([string]$Message = "Auto-generated migration")
    
    Write-ColoredOutput "🆕 Creating new migration..." "Cyan"
    
    # Check backend container status
    $containerStatus = docker ps --filter "name=cc_backend" --format "{{.Status}}"
    if (!$containerStatus) {
        Write-ColoredOutput "❌ Backend container is not running." "Red"
        return
    }
    
    try {
        Write-ColoredOutput "📝 Creating migration file: $Message" "Yellow"
        docker exec cc_backend alembic revision --autogenerate -m "$Message"
        
        Write-ColoredOutput "📜 Updated history:" "Yellow"
        docker exec cc_backend alembic history | Select-Object -First 3
        
        Write-ColoredOutput "✅ Migration file created successfully!" "Green"
        
    } catch {
        Write-ColoredOutput "❌ Failed to create migration: $($_.Exception.Message)" "Red"
    }
}

function Backup-Database {
    Write-ColoredOutput "💾 Starting database backup..." "Cyan"
    
    # Check PostgreSQL container status
    $containerStatus = docker ps --filter "name=cc_postgres" --format "{{.Status}}"
    if (!$containerStatus) {
        Write-ColoredOutput "❌ PostgreSQL container is not running." "Red"
        Write-ColoredOutput "Start services with: .\docker-manage.ps1 start" "Yellow"
        return
    }
    
    # Generate backup filename with timestamp
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupFile = "data/backup/cc_webapp_backup_$timestamp.sql"
    
    Write-ColoredOutput "📁 Backup file: $backupFile" "Yellow"
    
    # Execute pg_dump
    docker exec cc_postgres pg_dump -U cc_user -d cc_webapp > $backupFile
    
    if (Test-Path $backupFile) {
        $fileSize = [math]::Round((Get-Item $backupFile).Length / 1MB, 2)
        Write-ColoredOutput "✅ Backup complete! (Size: $fileSize MB)" "Green"
    } else {
        Write-ColoredOutput "❌ Backup failed!" "Red"
    }
}

function Reset-Environment {
    if (!$Force) {
        $confirm = Read-Host "⚠️ All data will be deleted. Continue? (y/N)"
        if ($confirm -ne "y" -and $confirm -ne "Y") {
            Write-ColoredOutput "❌ Operation cancelled." "Yellow"
            return
        }
    }
    
    Write-ColoredOutput "🧹 Starting complete reset..." "Red"
    
    # Stop and remove containers
    docker-compose down --volumes --remove-orphans
    
    # Clean images
    docker system prune -f
    
    # Clean log files
    if (Test-Path "logs") {
        Remove-Item -Path "logs\*" -Recurse -Force -ErrorAction SilentlyContinue
    }
    
    # Clean backend DB files
    if (Test-Path "cc-webapp\backend") {
        Remove-Item -Path "cc-webapp\backend\*.db" -Force -ErrorAction SilentlyContinue
    }
    
    Write-ColoredOutput "✅ Complete reset finished!" "Green"
    Write-ColoredOutput "Restart with: .\docker-manage.ps1 setup" "Yellow"
}

# Main execution logic
switch ($Command.ToLower()) {
    "help" { Show-Help }
    "setup" { Setup-Environment }
    "start" { Start-Services }
    "stop" { Stop-Services }
    "restart" { Stop-Services; Start-Services }
    "status" { Show-ServiceStatus }
    "logs" { Show-Logs }
    "shell" { Enter-Shell }
    "migrate" { Run-Migration }
    "new-migration" { 
        $message = if ($args.Count -gt 0) { $args -join " " } else { "Auto-generated migration" }
        Create-Migration -Message $message 
    }
    "backup" { Backup-Database }
    "reset" { Reset-Environment }
    "clean" { Reset-Environment }
    default {
        Write-ColoredOutput "❌ Unknown command: $Command" "Red"
        Show-Help
        exit 1
    }
}
