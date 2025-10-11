#!/bin/bash

# StatusAt Frontend AWS Deployment Configuration
# Copy this file to config.sh and update with your values

# Project Configuration
export PROJECT_NAME="statusat-frontend"
export ENVIRONMENT="prod"  # dev, staging, prod
export AWS_REGION="us-east-1"  # Required for CloudFront certificates

# GitHub Configuration - REQUIRED
export GITHUB_OWNER=""  # Your GitHub username or organization
export GITHUB_REPO=""   # Your repository name (e.g., "StatusAtFrontend")
export GITHUB_BRANCH="main"  # Branch to deploy from

# Optional: Custom Domain Configuration
export DOMAIN_NAME=""  # e.g., "app.statusat.com" (leave empty for CloudFront domain)
export CERTIFICATE_ARN=""  # ACM certificate ARN in us-east-1 region

# Optional: Build Configuration
export NODE_ENV="production"
export BUILD_TIMEOUT="10"  # Build timeout in minutes

# Example configurations:

# Basic setup (no custom domain):
# export GITHUB_OWNER="yourusername"
# export GITHUB_REPO="StatusAtFrontend"

# With custom domain:
# export DOMAIN_NAME="app.statusat.com"
# export CERTIFICATE_ARN="arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012"

# Multi-environment setup:
# export ENVIRONMENT="staging"
# export GITHUB_BRANCH="develop"
