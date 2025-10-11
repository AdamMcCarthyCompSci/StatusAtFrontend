# StatusAt Frontend AWS Deployment

This directory contains all the necessary files to deploy the StatusAt React frontend to AWS using CloudFormation and CI/CD pipelines.

## Architecture Overview

- **S3 Bucket**: Static website hosting
- **CloudFront**: CDN for global performance and HTTPS
- **CodePipeline**: CI/CD orchestration from GitHub
- **CodeBuild**: Builds and tests the React application
- **IAM Roles**: Secure service permissions

## Prerequisites

1. **AWS CLI** installed and configured
   ```bash
   aws configure
   ```

2. **GitHub Repository** with your React code

3. **AWS Account** with appropriate permissions

## Quick Start

### 1. Configure Deployment

Edit `aws/scripts/deploy.sh` and set your GitHub details:

```bash
GITHUB_OWNER="your-github-username"
GITHUB_REPO="your-repo-name"
```

### 2. Deploy Infrastructure

```bash
cd aws/scripts
./deploy.sh
```

### 3. Complete GitHub Authorization

1. Go to AWS Console → CodePipeline → Connections
2. Find the connection `statusat-frontend-prod-github`
3. Click "Update pending connection"
4. Authorize with GitHub

### 4. Test Deployment

Push code to your `main` branch - the pipeline will automatically:
1. Pull code from GitHub
2. Run tests
3. Build the React app
4. Deploy to S3
5. Invalidate CloudFront cache

## File Structure

```
aws/
├── cloudformation/
│   ├── infrastructure.yaml    # S3, CloudFront, Route 53
│   └── pipeline.yaml         # CodePipeline, CodeBuild
├── scripts/
│   └── deploy.sh            # Deployment script
└── README.md               # This file
```

## Configuration Options

### Custom Domain (Optional)

To use a custom domain, update `deploy.sh`:

```bash
DOMAIN_NAME="app.yourdomain.com"
CERTIFICATE_ARN="arn:aws:acm:us-east-1:123456789:certificate/abc123"
```

**Note**: Certificate must be in `us-east-1` region for CloudFront.

### Environment Variables

The build process automatically sets:
- `NODE_ENV=production`
- `S3_BUCKET` (for deployment)
- `CLOUDFRONT_DISTRIBUTION_ID` (for cache invalidation)

## Monitoring & Troubleshooting

### View Pipeline Status
```bash
aws codepipeline get-pipeline-state --name statusat-frontend-prod-pipeline
```

### View Build Logs
```bash
aws logs describe-log-groups --log-group-name-prefix /aws/codebuild/statusat-frontend
```

### Manual Deployment
```bash
# Build locally
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### Common Issues

1. **Build Fails**: Check CodeBuild logs in AWS Console
2. **Tests Fail**: Ensure all tests pass locally first
3. **GitHub Connection**: Must authorize connection in AWS Console
4. **Permissions**: Ensure AWS CLI has sufficient permissions

## Security Features

- **Origin Access Control**: Secure S3 access via CloudFront only
- **HTTPS Only**: All traffic redirected to HTTPS
- **Security Headers**: Managed CloudFront security policy
- **IAM Least Privilege**: Minimal required permissions

## Performance Optimizations

- **Chunk Splitting**: Vendor, router, UI libraries separated
- **Compression**: Gzip enabled by default
- **Caching**: Optimized cache policies for static assets
- **CDN**: Global edge locations via CloudFront

## Scaling Considerations

The current setup can handle:
- **Storage**: Virtually unlimited (S3)
- **Bandwidth**: Scales automatically (CloudFront)
- **Requests**: Millions per month without changes

For higher traffic, consider:
- Upgrading CloudFront price class
- Adding Route 53 health checks
- Implementing blue/green deployments

## Cleanup

To remove all resources:

```bash
# Delete pipeline stack
aws cloudformation delete-stack --stack-name statusat-frontend-prod-pipeline

# Delete infrastructure stack (after pipeline is deleted)
aws cloudformation delete-stack --stack-name statusat-frontend-prod-infrastructure
```

## Support

For issues or questions:
1. Check AWS CloudFormation events in the console
2. Review CodeBuild logs for build failures
3. Verify GitHub connection status
4. Ensure AWS CLI permissions are correct

## Next Steps

After successful deployment:
1. Set up monitoring with CloudWatch
2. Configure custom domain with Route 53
3. Add staging environment
4. Implement blue/green deployments
5. Set up automated testing in pipeline
