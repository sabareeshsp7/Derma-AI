#!/bin/bash
# AWS Migration Helper Script for DermaSense AI
# This script helps you set up AWS services step by step

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to check if AWS CLI is installed
check_aws_cli() {
    print_header "Checking Prerequisites"
    
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed!"
        print_info "Install it from: https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html"
        echo ""
        print_info "Quick install commands:"
        echo "  macOS: brew install awscli"
        echo "  Linux: curl 'https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip' -o 'awscliv2.zip' && unzip awscliv2.zip && sudo ./aws/install"
        echo "  Windows: Download MSI installer from AWS website"
        exit 1
    fi
    
    print_success "AWS CLI is installed ($(aws --version))"
}

# Function to check if user is configured
check_aws_config() {
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured!"
        echo ""
        print_info "Run the following command to configure:"
        echo "  aws configure"
        echo ""
        print_info "You'll need:"
        echo "  - AWS Access Key ID"
        echo "  - AWS Secret Access Key"
        echo "  - Default region (e.g., ap-south-1 for Mumbai)"
        echo "  - Output format (json)"
        exit 1
    fi
    
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    CURRENT_USER=$(aws sts get-caller-identity --query Arn --output text)
    CURRENT_REGION=$(aws configure get region)
    
    print_success "AWS CLI is configured"
    print_info "Account ID: $ACCOUNT_ID"
    print_info "User/Role: $CURRENT_USER"
    print_info "Region: $CURRENT_REGION"
}

# Function to check Node.js and npm
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        print_info "Install from: https://nodejs.org/"
        exit 1
    fi
    
    print_success "Node.js is installed ($(node --version))"
    print_success "npm is installed ($(npm --version))"
}

# Function to create .env.local from template
create_env_file() {
    print_header "Environment Configuration"
    
    if [ -f ".env.local" ]; then
        print_warning ".env.local already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Skipping environment file creation"
            return
        fi
    fi
    
    if [ ! -f ".env.aws.template" ]; then
        print_error ".env.aws.template not found!"
        exit 1
    fi
    
    cp .env.aws.template .env.local
    print_success "Created .env.local from template"
    print_warning "Please edit .env.local and fill in your AWS credentials!"
}

# Function to install dependencies
install_dependencies() {
    print_header "Installing Dependencies"
    
    print_info "Removing old Supabase packages..."
    npm uninstall @supabase/supabase-js @supabase/auth-helpers-nextjs 2>/dev/null || true
    
    print_info "Installing AWS SDK and dependencies..."
    npm install pg @types/pg amazon-cognito-identity-js @aws-sdk/client-s3 @aws-sdk/s3-request-presigner
    
    print_success "Dependencies installed successfully"
}

# Function to test database connection
test_database() {
    print_header "Testing Database Connection"
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL not set in .env.local"
        return 1
    fi
    
    print_info "Attempting to connect to RDS..."
    
    # Extract database details from connection string
    DB_HOST=$(echo $DATABASE_URL | sed -n 's/.*@\([^:]*\):.*/\1/p')
    
    if command -v psql &> /dev/null; then
        echo "Testing connection with psql..."
        if psql "$DATABASE_URL" -c "SELECT version();" &> /dev/null; then
            print_success "Database connection successful!"
        else
            print_error "Failed to connect to database"
            print_info "Check your DATABASE_URL and security group settings"
        fi
    else
        print_warning "psql not installed, skipping database connection test"
        print_info "You can test manually with: psql \"$DATABASE_URL\" -c 'SELECT version();'"
    fi
}

# Function to create database schema
create_database_schema() {
    print_header "Creating Database Schema"
    
    if [ -z "$DATABASE_URL" ]; then
        print_error "DATABASE_URL not set in .env.local"
        return 1
    fi
    
    if [ ! -f "database/schema.sql" ]; then
        print_warning "database/schema.sql not found"
        print_info "You'll need to create the database schema manually"
        print_info "See AWS_MIGRATION_PLAN.md for the SQL schema"
        return 0
    fi
    
    if command -v psql &> /dev/null; then
        print_info "Applying database schema..."
        if psql "$DATABASE_URL" -f database/schema.sql; then
            print_success "Database schema created successfully!"
        else
            print_error "Failed to create database schema"
        fi
    else
        print_warning "psql not installed"
        print_info "Apply schema manually: psql \"$DATABASE_URL\" -f database/schema.sql"
    fi
}

# Function to verify AWS resources
verify_aws_resources() {
    print_header "Verifying AWS Resources"
    
    # Check RDS
    print_info "Checking RDS instances..."
    RDS_COUNT=$(aws rds describe-db-instances --query 'length(DBInstances)' --output text 2>/dev/null || echo "0")
    if [ "$RDS_COUNT" -gt 0 ]; then
        print_success "Found $RDS_COUNT RDS instance(s)"
        aws rds describe-db-instances --query 'DBInstances[*].[DBInstanceIdentifier,Endpoint.Address,DBInstanceStatus]' --output table
    else
        print_warning "No RDS instances found"
    fi
    
    # Check S3 buckets
    print_info "Checking S3 buckets..."
    S3_COUNT=$(aws s3 ls | grep dermasense | wc -l)
    if [ "$S3_COUNT" -gt 0 ]; then
        print_success "Found $S3_COUNT S3 bucket(s)"
        aws s3 ls | grep dermasense
    else
        print_warning "No S3 buckets found with 'dermasense' in the name"
    fi
    
    # Check Cognito User Pools
    print_info "Checking Cognito User Pools..."
    COGNITO_POOLS=$(aws cognito-idp list-user-pools --max-results 10 --query 'UserPools[*].[Name,Id]' --output table 2>/dev/null || echo "")
    if [ -n "$COGNITO_POOLS" ]; then
        print_success "Cognito User Pools found:"
        echo "$COGNITO_POOLS"
    else
        print_warning "No Cognito User Pools found"
    fi
    
    # Check Lambda functions
    print_info "Checking Lambda functions..."
    LAMBDA_COUNT=$(aws lambda list-functions --query 'length(Functions)' --output text 2>/dev/null || echo "0")
    if [ "$LAMBDA_COUNT" -gt 0 ]; then
        print_success "Found $LAMBDA_COUNT Lambda function(s)"
        aws lambda list-functions --query 'Functions[*].[FunctionName,Runtime,LastModified]' --output table
    else
        print_warning "No Lambda functions found"
    fi
}

# Function to display next steps
show_next_steps() {
    print_header "Next Steps"
    
    echo "1. Edit .env.local and fill in your AWS credentials"
    echo "2. Create AWS resources as per AWS_MIGRATION_PLAN.md:"
    echo "   - RDS PostgreSQL database"
    echo "   - Cognito User Pool"
    echo "   - S3 bucket"
    echo "   - Lambda functions"
    echo "   - API Gateway"
    echo ""
    echo "3. Create database schema:"
    echo "   psql \"\$DATABASE_URL\" -f database/schema.sql"
    echo ""
    echo "4. Test the application locally:"
    echo "   npm run dev"
    echo ""
    echo "5. Deploy to AWS Amplify or Vercel"
    echo ""
    print_info "For detailed instructions, see:"
    echo "  - AWS_MIGRATION_PLAN.md (comprehensive guide)"
    echo "  - AWS_SETUP_CHECKLIST.md (step-by-step checklist)"
}

# Main execution
main() {
    clear
    print_header "DermaSense AI - AWS Migration Helper"
    
    echo "This script will help you prepare your project for AWS migration."
    echo "It will check prerequisites, install dependencies, and guide you through setup."
    echo ""
    read -p "Press Enter to continue..."
    
    # Run checks
    check_aws_cli
    check_aws_config
    check_node
    
    # Setup
    create_env_file
    
    # Ask if user wants to install dependencies
    echo ""
    read -p "Install/update npm dependencies? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [ -z $REPLY ]; then
        install_dependencies
    fi
    
    # Load environment variables if .env.local exists
    if [ -f ".env.local" ]; then
        print_info "Loading environment variables from .env.local..."
        set -a
        source .env.local
        set +a
        
        # Test database connection
        echo ""
        read -p "Test database connection? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            test_database
        fi
    fi
    
    # Verify AWS resources
    echo ""
    read -p "Check existing AWS resources? (Y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]] || [ -z $REPLY ]; then
        verify_aws_resources
    fi
    
    # Show next steps
    echo ""
    show_next_steps
    
    print_success "Setup complete!"
    print_info "Good luck with your AWS migration! 🚀"
}

# Run main function
main
