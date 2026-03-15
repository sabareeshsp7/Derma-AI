# DermaSense AI - AWS Migration Helper Script (PowerShell)
# For Windows users

# Colors
$ESC = [char]27
$RED = "$ESC[31m"
$GREEN = "$ESC[32m"
$YELLOW = "$ESC[33m"
$BLUE = "$ESC[34m"
$NC = "$ESC[0m"

function Print-Info {
    param($message)
    Write-Host "$BLUE`u{2139}  $message$NC"
}

function Print-Success {
    param($message)
    Write-Host "$GREEN`u{2705} $message$NC"
}

function Print-Warning {
    param($message)
    Write-Host "$YELLOW`u{26A0}  $message$NC"
}

function Print-Error {
    param($message)
    Write-Host "$RED`u{274C} $message$NC"
}

function Print-Header {
    param($message)
    Write-Host ""
    Write-Host "$BLUE═══════════════════════════════════════════════════$NC"
    Write-Host "$BLUE  $message$NC"
    Write-Host "$BLUE═══════════════════════════════════════════════════$NC"
    Write-Host ""
}

# Check if AWS CLI is installed
function Check-AWSCli {
    Print-Header "Checking Prerequisites"
    
    try {
        $awsVersion = aws --version 2>&1
        Print-Success "AWS CLI is installed ($awsVersion)"
    }
    catch {
        Print-Error "AWS CLI is not installed!"
        Print-Info "Install from: https://aws.amazon.com/cli/"
        Write-Host ""
        Print-Info "For Windows: Download and run the MSI installer"
        exit 1
    }
}

# Check if AWS is configured
function Check-AWSConfig {
    try {
        $identity = aws sts get-caller-identity --output json | ConvertFrom-Json
        $accountId = $identity.Account
        $currentUser = $identity.Arn
        $region = aws configure get region
        
        Print-Success "AWS CLI is configured"
        Print-Info "Account ID: $accountId"
        Print-Info "User/Role: $currentUser"
        Print-Info "Region: $region"
    }
    catch {
        Print-Error "AWS CLI is not configured!"
        Write-Host ""
        Print-Info "Run the following command to configure:"
        Write-Host "  aws configure"
        Write-Host ""
        Print-Info "You'll need:"
        Write-Host "  - AWS Access Key ID"
        Write-Host "  - AWS Secret Access Key"
        Write-Host "  - Default region (e.g., ap-south-1 for Mumbai)"
        Write-Host "  - Output format (json)"
        exit 1
    }
}

# Check Node.js and npm
function Check-Node {
    try {
        $nodeVersion = node --version
        $npmVersion = npm --version
        Print-Success "Node.js is installed ($nodeVersion)"
        Print-Success "npm is installed ($npmVersion)"
    }
    catch {
        Print-Error "Node.js is not installed!"
        Print-Info "Install from: https://nodejs.org/"
        exit 1
    }
}

# Create .env.local from template
function Create-EnvFile {
    Print-Header "Environment Configuration"
    
    if (Test-Path ".env.local") {
        Print-Warning ".env.local already exists"
        $overwrite = Read-Host "Do you want to overwrite it? (y/N)"
        if ($overwrite -ne 'y' -and $overwrite -ne 'Y') {
            Print-Info "Skipping environment file creation"
            return
        }
    }
    
    if (-not (Test-Path ".env.aws.template")) {
        Print-Error ".env.aws.template not found!"
        exit 1
    }
    
    Copy-Item ".env.aws.template" ".env.local"
    Print-Success "Created .env.local from template"
    Print-Warning "Please edit .env.local and fill in your AWS credentials!"
}

# Install dependencies
function Install-Dependencies {
    Print-Header "Installing Dependencies"
    
    Print-Info "Removing old Supabase packages..."
    npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs 2>$null
    
    Print-Info "Installing AWS SDK and dependencies..."
    npm install pg @types/pg amazon-cognito-identity-js @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
    
    Print-Success "Dependencies installed successfully"
}

# Test database connection
function Test-Database {
    Print-Header "Testing Database Connection"
    
    # Load .env.local
    if (Test-Path ".env.local") {
        Get-Content ".env.local" | ForEach-Object {
            if ($_ -match '^([^=]+)=(.*)$') {
                $name = $matches[1].Trim()
                $value = $matches[2].Trim()
                Set-Item -Path "env:$name" -Value $value
            }
        }
    }
    
    $dbUrl = $env:DATABASE_URL
    
    if (-not $dbUrl) {
        Print-Error "DATABASE_URL not set in .env.local"
        return
    }
    
    Print-Info "Attempting to connect to RDS..."
    
    # Check if psql is available
    try {
        $psqlVersion = psql --version 2>&1
        Print-Info "Testing connection with psql..."
        
        $testQuery = "SELECT version();"
        $result = & psql $dbUrl -c $testQuery 2>&1
        
        if ($LASTEXITCODE -eq 0) {
            Print-Success "Database connection successful!"
        }
        else {
            Print-Error "Failed to connect to database"
            Print-Info "Check your DATABASE_URL and security group settings"
        }
    }
    catch {
        Print-Warning "psql not installed, skipping database connection test"
        Print-Info "Install PostgreSQL client to test connection"
    }
}

# Verify AWS resources
function Verify-AWSResources {
    Print-Header "Verifying AWS Resources"
    
    # Check RDS
    Print-Info "Checking RDS instances..."
    try {
        $rdsInstances = aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,Endpoint.Address,DBInstanceStatus]' --output table
        if ($rdsInstances) {
            Print-Success "RDS instances found:"
            Write-Host $rdsInstances
        }
        else {
            Print-Warning "No RDS instances found"
        }
    }
    catch {
        Print-Warning "Could not check RDS instances"
    }
    
    # Check S3 buckets
    Print-Info "Checking S3 buckets..."
    try {
        $s3Buckets = aws s3 ls | Select-String "dermasense"
        if ($s3Buckets) {
            Print-Success "S3 buckets found:"
            Write-Host $s3Buckets
        }
        else {
            Print-Warning "No S3 buckets found with 'dermasense' in the name"
        }
    }
    catch {
        Print-Warning "Could not check S3 buckets"
    }
    
    # Check Cognito User Pools
    Print-Info "Checking Cognito User Pools..."
    try {
        $cognitoPools = aws cognito-idp list-user-pools --max-results 10 --query 'UserPools[*].[Name,Id]' --output table
        if ($cognitoPools) {
            Print-Success "Cognito User Pools found:"
            Write-Host $cognitoPools
        }
        else {
            Print-Warning "No Cognito User Pools found"
        }
    }
    catch {
        Print-Warning "Could not check Cognito User Pools"
    }
    
    # Check Lambda functions
    Print-Info "Checking Lambda functions..."
    try {
        $lambdaFunctions = aws lambda list-functions --query 'Functions[*].[FunctionName,Runtime,LastModified]' --output table
        if ($lambdaFunctions) {
            Print-Success "Lambda functions found:"
            Write-Host $lambdaFunctions
        }
        else {
            Print-Warning "No Lambda functions found"
        }
    }
    catch {
        Print-Warning "Could not check Lambda functions"
    }
}

# Show next steps
function Show-NextSteps {
    Print-Header "Next Steps"
    
    Write-Host "1. Edit .env.local and fill in your AWS credentials"
    Write-Host "2. Create AWS resources as per AWS_MIGRATION_PLAN.md:"
    Write-Host "   - RDS PostgreSQL database"
    Write-Host "   - Cognito User Pool"
    Write-Host "   - S3 bucket"
    Write-Host "   - Lambda functions"
    Write-Host "   - API Gateway"
    Write-Host ""
    Write-Host "3. Create database schema:"
    Write-Host "   psql `$env:DATABASE_URL -f database/schema.sql"
    Write-Host ""
    Write-Host "4. Test the application locally:"
    Write-Host "   npm run dev"
    Write-Host ""
    Write-Host "5. Deploy to AWS Amplify or Vercel"
    Write-Host ""
    Print-Info "For detailed instructions, see:"
    Write-Host "  - AWS_MIGRATION_PLAN.md (comprehensive guide)"
    Write-Host "  - AWS_SETUP_CHECKLIST.md (step-by-step checklist)"
}

# Main execution
function Main {
    Clear-Host
    Print-Header "DermaSense AI - AWS Migration Helper"
    
    Write-Host "This script will help you prepare your project for AWS migration."
    Write-Host "It will check prerequisites, install dependencies, and guide you through setup."
    Write-Host ""
    Read-Host "Press Enter to continue..."
    
    # Run checks
    Check-AWSCli
    Check-AWSConfig
    Check-Node
    
    # Setup
    Create-EnvFile
    
    # Ask if user wants to install dependencies
    Write-Host ""
    $installDeps = Read-Host "Install/update npm dependencies? (Y/n)"
    if ($installDeps -eq '' -or $installDeps -eq 'y' -or $installDeps -eq 'Y') {
        Install-Dependencies
    }
    
    # Test database connection
    if (Test-Path ".env.local") {
        Write-Host ""
        $testDb = Read-Host "Test database connection? (y/N)"
        if ($testDb -eq 'y' -or $testDb -eq 'Y') {
            Test-Database
        }
    }
    
    # Verify AWS resources
    Write-Host ""
    $verifyRes = Read-Host "Check existing AWS resources? (Y/n)"
    if ($verifyRes -eq '' -or $verifyRes -eq 'y' -or $verifyRes -eq 'Y') {
        Verify-AWSResources
    }
    
    # Show next steps
    Write-Host ""
    Show-NextSteps
    
    Print-Success "Setup complete!"
    Print-Info "Good luck with your AWS migration! 🚀"
}

# Run main function
Main
