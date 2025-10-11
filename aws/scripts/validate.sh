#!/bin/bash

# StatusAt Frontend Deployment Validation Script
# Run this before deploying to check prerequisites

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[CHECK]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[PASS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[FAIL]${NC} $1"
}

VALIDATION_FAILED=false

echo ""
echo -e "${BLUE}=== StatusAt Frontend Deployment Validation ===${NC}"
echo ""

# Check AWS CLI
print_status "Checking AWS CLI installation..."
if command -v aws &> /dev/null; then
    AWS_VERSION=$(aws --version 2>&1 | cut -d/ -f2 | cut -d' ' -f1)
    print_success "AWS CLI installed (version $AWS_VERSION)"
else
    print_error "AWS CLI not found. Install from: https://aws.amazon.com/cli/"
    VALIDATION_FAILED=true
fi

# Check AWS credentials
print_status "Checking AWS credentials..."
if aws sts get-caller-identity &> /dev/null; then
    AWS_ACCOUNT=$(aws sts get-caller-identity --query Account --output text)
    AWS_USER=$(aws sts get-caller-identity --query Arn --output text | cut -d'/' -f2)
    print_success "AWS credentials configured (Account: $AWS_ACCOUNT, User: $AWS_USER)"
else
    print_error "AWS credentials not configured. Run: aws configure"
    VALIDATION_FAILED=true
fi

# Check Node.js and npm
print_status "Checking Node.js installation..."
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    print_success "Node.js installed ($NODE_VERSION)"
else
    print_error "Node.js not found. Install from: https://nodejs.org/"
    VALIDATION_FAILED=true
fi

print_status "Checking npm installation..."
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    print_success "npm installed (version $NPM_VERSION)"
else
    print_error "npm not found. Install Node.js which includes npm"
    VALIDATION_FAILED=true
fi

# Check project dependencies
print_status "Checking project dependencies..."
if [ -f "package.json" ]; then
    print_success "package.json found"
    if [ -d "node_modules" ]; then
        print_success "node_modules directory exists"
    else
        print_warning "node_modules not found. Run: npm install"
    fi
else
    print_error "package.json not found. Are you in the project root?"
    VALIDATION_FAILED=true
fi

# Check build capability
print_status "Testing build process..."
if [ -f "package.json" ] && command -v npm &> /dev/null; then
    if npm run build --silent &> /dev/null; then
        print_success "Build process works"
        if [ -d "dist" ]; then
            DIST_SIZE=$(du -sh dist 2>/dev/null | cut -f1)
            print_success "Build output created (size: $DIST_SIZE)"
        fi
    else
        print_error "Build process failed. Check your build configuration"
        VALIDATION_FAILED=true
    fi
fi

# Check deployment script configuration
print_status "Checking deployment configuration..."
if [ -f "aws/scripts/deploy.sh" ]; then
    print_success "Deployment script found"
    
    # Check if GitHub details are configured
    if grep -q 'GITHUB_OWNER=""' aws/scripts/deploy.sh; then
        print_error "GITHUB_OWNER not configured in aws/scripts/deploy.sh"
        VALIDATION_FAILED=true
    else
        print_success "GITHUB_OWNER configured"
    fi
    
    if grep -q 'GITHUB_REPO=""' aws/scripts/deploy.sh; then
        print_error "GITHUB_REPO not configured in aws/scripts/deploy.sh"
        VALIDATION_FAILED=true
    else
        print_success "GITHUB_REPO configured"
    fi
else
    print_error "Deployment script not found at aws/scripts/deploy.sh"
    VALIDATION_FAILED=true
fi

# Check CloudFormation templates
print_status "Checking CloudFormation templates..."
if [ -f "aws/cloudformation/infrastructure.yaml" ]; then
    print_success "Infrastructure template found"
else
    print_error "Infrastructure template not found"
    VALIDATION_FAILED=true
fi

if [ -f "aws/cloudformation/pipeline.yaml" ]; then
    print_success "Pipeline template found"
else
    print_error "Pipeline template not found"
    VALIDATION_FAILED=true
fi

# Check AWS permissions (basic)
print_status "Checking AWS permissions..."
if aws iam get-user &> /dev/null || aws sts get-caller-identity &> /dev/null; then
    print_success "Basic AWS access confirmed"
    
    # Test CloudFormation permissions
    if aws cloudformation list-stacks --stack-status-filter CREATE_COMPLETE UPDATE_COMPLETE &> /dev/null; then
        print_success "CloudFormation access confirmed"
    else
        print_warning "CloudFormation access may be limited"
    fi
    
    # Test S3 permissions
    if aws s3 ls &> /dev/null; then
        print_success "S3 access confirmed"
    else
        print_warning "S3 access may be limited"
    fi
else
    print_error "Cannot verify AWS permissions"
    VALIDATION_FAILED=true
fi

echo ""
if [ "$VALIDATION_FAILED" = true ]; then
    print_error "=== VALIDATION FAILED ==="
    echo "Please fix the issues above before deploying."
    exit 1
else
    print_success "=== VALIDATION PASSED ==="
    echo "Your environment is ready for deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Edit aws/scripts/deploy.sh with your GitHub details"
    echo "2. Run: ./aws/scripts/deploy.sh"
    echo "3. Complete GitHub authorization in AWS Console"
fi
echo ""
