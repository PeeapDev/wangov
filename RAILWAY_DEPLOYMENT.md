# WanGov Railway Deployment Guide

This guide explains how to deploy the WanGov multi-service architecture to Railway with proper subdomain configuration.

## Services Setup

Each service has been configured with:
1. `Dockerfile` - For containerized deployment
2. `railway.json` - Railway-specific configuration
3. `.env.railway` - Environment variables template

## Deployment Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Add Railway deployment configuration"
git push
```

### 2. Create New Project on Railway

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your WanGov repository
4. For the first service (e.g., wangov-id):
   - Set root directory to "/wangov-id"
   - Railway will detect the Dockerfile

### 3. Set Up Environment Variables

1. In your Railway project, go to "Variables" tab
2. Import variables from the `.env.railway` file for each service
3. Update all placeholder values with actual production values
4. Make sure database connection strings are correct

### 4. Deploy Additional Services

For each additional service (wangov-sso, wangov-ncra, etc.):
1. In your project dashboard, click "New Service" → "GitHub Repo"
2. Select the same repo but with different root directories:
   - "/wangov-sso"
   - "/wangov-ncra"
   - etc.

### 5. Configure Custom Domains

For each service:
1. Go to the service settings → "Domains" tab
2. Add your custom domain:
   - Main app: `wangov.gov.sl`
   - SSO: `sso.wangov.gov.sl`
   - NCRA: `ncra.wangov.gov.sl`
   - Finance: `finance.wangov.gov.sl`
   - Tax: `tax.wangov.gov.sl`
3. Follow Railway's DNS configuration instructions
4. Wait for SSL certificates to provision (usually 5-10 minutes)

### 6. Connect Services Together

Use Railway's internal networking:
- Each service can access others via `[service-name].railway.internal`
- These internal URLs are already configured in the `.env.railway` files

## Troubleshooting

If deployment fails:
1. Check build logs for errors
2. Verify package.json has correct start scripts
3. Make sure all required environment variables are set
4. Check if there are any port conflicts

## Database Setup

For shared database:
1. Create a PostgreSQL database in Railway
2. Connect all services to it by setting the DATABASE_URL variable
3. Each service can use a different schema or database name

## Monitoring & Scaling

- Railway provides basic monitoring in the service dashboard
- To scale, increase replicas in the service settings
- Set up logging and monitoring through Railway integrations

## Remember

- Protect your production environment variables
- Set proper CORS settings for cross-domain requests
- Test thoroughly after deployment
- Set up automatic database backups
