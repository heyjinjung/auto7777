# File: /casino-club-f2p/casino-club-f2p/docker-manage.ps1

# Enhanced Docker management script for the Casino-Club F2P project

param (
    [string]$action = "status",
    [switch]$tools
)

function Check-Environment {
    Write-Host "Checking Docker environment..."
    docker info | Out-Null
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker is not running. Please start Docker."
        exit
    }
    Write-Host "Docker is running."
}

function Setup-Environment {
    Write-Host "Setting up the environment..."
    docker-compose -f docker-compose.yml -f docker-compose.override.dev.yml up -d --build
}

function Start-Services {
    if ($tools) {
        Write-Host "Starting services with development tools..."
        docker-compose -f docker-compose.yml -f docker-compose.override.dev.yml up -d --build
    } else {
        Write-Host "Starting basic services..."
        docker-compose up -d --build
    }
}

function Check-Status {
    Write-Host "Checking service status..."
    docker-compose ps
}

function Monitor-Services {
    Write-Host "Monitoring services..."
    docker-compose logs -f
}

function Restart-Services {
    Write-Host "Restarting all services..."
    docker-compose restart
}

function Migrate-Database {
    Write-Host "Running database migrations..."
    docker-compose exec backend alembic upgrade head
}

function Seed-Database {
    Write-Host "Seeding test data..."
    docker-compose exec backend python -m app.init_db
}

function Backup-Database {
    Write-Host "Backing up the database..."
    docker-compose exec postgres pg_dump -U cc_user cc_webapp > ./data/backup/$(Get-Date -Format "yyyyMMdd_HHmmss")_backup.sql
}

function Reset-Database {
    Write-Host "Resetting the database..."
    docker-compose exec postgres psql -U cc_user -d cc_webapp -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
}

function Clean-Volumes {
    Write-Host "Cleaning up unused volumes..."
    docker volume prune -f
}

function Show-Help {
    Write-Host "Available commands:"
    Write-Host "  check      - Check Docker environment"
    Write-Host "  setup      - Set up the environment"
    Write-Host "  start      - Start services"
    Write-Host "  status     - Check service status"
    Write-Host "  monitor    - Monitor services"
    Write-Host "  restart    - Restart services"
    Write-Host "  migrate    - Run database migrations"
    Write-Host "  seed       - Seed test data"
    Write-Host "  backup     - Backup the database"
    Write-Host "  reset-db   - Reset the database"
    Write-Host "  clean      - Clean up unused volumes"
}

Check-Environment

switch ($action) {
    "check" { Check-Environment }
    "setup" { Setup-Environment }
    "start" { Start-Services }
    "status" { Check-Status }
    "monitor" { Monitor-Services }
    "restart" { Restart-Services }
    "migrate" { Migrate-Database }
    "seed" { Seed-Database }
    "backup" { Backup-Database }
    "reset-db" { Reset-Database }
    "clean" { Clean-Volumes }
    default { Show-Help }
}