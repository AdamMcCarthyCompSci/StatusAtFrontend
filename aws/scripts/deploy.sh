#!/bin/bash

# StatusAt Frontend AWS Deployment Script
# This script deploys the infrastructure and CI/CD pipeline for the React frontend

set -e  # Exit on any error

# Configuration - UPDATE THESE VALUES
PROJECT_NAME="statusat-frontend"
ENVIRONMENT="prod"
GITHUB_OWNER="AdamMcCarthyCompSci"  # TODO: Set your GitHub username
GITHUB_REPO="StatusAtFrontend"   # TODO: Set your repository name
AWS_REGION="us-east-1"  # Required for CloudFront certificates

# Optional: Custom domain configuration
DOMAIN_NAME=""  # e.g., "app.statusat.com"
CERTIFICATE_ARN=""  # ACM certificate ARN in us-east-1

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if AWS CLI is configured
check_aws_cli() {
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS CLI is not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_success "AWS CLI is configured"
}

# Function to validate configuration
validate_config() {
    if [ -z "$GITHUB_OWNER" ] || [ -z "$GITHUB_REPO" ]; then
        print_error "Please set GITHUB_OWNER and GITHUB_REPO in the script"
        print_warning "Edit aws/scripts/deploy.sh and set your GitHub details"
        exit 1
    fi
    
    print_success "Configuration validated"
}

# Function to deploy infrastructure stack
deploy_infrastructure() {
    print_status "Deploying infrastructure stack..."
    
    local stack_name="${PROJECT_NAME}-${ENVIRONMENT}-infrastructure"
    
    aws cloudformation deploy \
        --template-file aws/cloudformation/infrastructure.yaml \
        --stack-name "$stack_name" \
        --parameter-overrides \
            ProjectName="$PROJECT_NAME" \
            Environment="$ENVIRONMENT" \
            DomainName="$DOMAIN_NAME" \
            CertificateArn="$CERTIFICATE_ARN" \
        --region "$AWS_REGION" \
        --no-fail-on-empty-changeset
    
    if [ $? -eq 0 ]; then
        print_success "Infrastructure stack deployed successfully!"
    else
        print_error "Infrastructure deployment failed!"
        exit 1
    fi
}

# Function to deploy pipeline stack
deploy_pipeline() {
    print_status "Deploying CI/CD pipeline stack..."
    
    local stack_name="${PROJECT_NAME}-${ENVIRONMENT}-pipeline"
    local infra_stack_name="${PROJECT_NAME}-${ENVIRONMENT}-infrastructure"
    
    aws cloudformation deploy \
        --template-file aws/cloudformation/pipeline.yaml \
        --stack-name "$stack_name" \
        --parameter-overrides \
            ProjectName="$PROJECT_NAME" \
            Environment="$ENVIRONMENT" \
            GitHubOwner="$GITHUB_OWNER" \
            GitHubRepo="$GITHUB_REPO" \
            InfrastructureStackName="$infra_stack_name" \
        --capabilities CAPABILITY_IAM \
        --region "$AWS_REGION" \
        --no-fail-on-empty-changeset
    
    if [ $? -eq 0 ]; then
        print_success "Pipeline stack deployed successfully!"
    else
        print_error "Pipeline deployment failed!"
        exit 1
    fi
}

# Function to get stack outputs
get_outputs() {
    print_status "Getting deployment outputs..."
    
    local infra_stack_name="${PROJECT_NAME}-${ENVIRONMENT}-infrastructure"
    local pipeline_stack_name="${PROJECT_NAME}-${ENVIRONMENT}-pipeline"
    
    echo ""
    print_success "=== DEPLOYMENT COMPLETE ==="
    echo ""
    
    # Get website URL
    local website_url=$(aws cloudformation describe-stacks \
        --stack-name "$infra_stack_name" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
        --output text 2>/dev/null)
    
    if [ ! -z "$website_url" ]; then
        print_success "Website URL: $website_url"
    fi
    
    # Get CloudFront distribution ID
    local cf_distribution_id=$(aws cloudformation describe-stacks \
        --stack-name "$infra_stack_name" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text 2>/dev/null)
    
    if [ ! -z "$cf_distribution_id" ]; then
        print_success "CloudFront Distribution ID: $cf_distribution_id"
    fi
    
    # Get GitHub connection ARN
    local github_connection=$(aws cloudformation describe-stacks \
        --stack-name "$pipeline_stack_name" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`GitHubConnectionArn`].OutputValue' \
        --output text 2>/dev/null)
    
    echo ""
    print_warning "=== NEXT STEPS ==="
    echo "1. Go to AWS Console > CodePipeline > Connections"
    echo "2. Find the connection '${PROJECT_NAME}-${ENVIRONMENT}-github'"
    echo "3. Complete the GitHub authorization"
    echo "4. Push code to your main branch to trigger the first deployment"
    echo ""
    print_status "GitHub Connection ARN: $github_connection"
}

# Main execution
main() {
    echo ""
    print_status "=== StatusAt Frontend AWS Deployment ==="
    echo ""
    
    # Validate prerequisites
    check_aws_cli
    validate_config
    
    # Deploy stacks
    deploy_infrastructure
    deploy_pipeline
    
    # Show results
    get_outputs
    
    echo ""
    print_success "Deployment script completed successfully!"
    echo ""
}

# Run main function
main "$@"
