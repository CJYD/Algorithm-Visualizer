# Render Deployment Guide

## Deployed Services

- **Backend API**: https://algorithm-visualizer-api-aa5n.onrender.com
- **Frontend Web**: https://algorithm-visualizer-web.onrender.com

## Quick Start

Your application is configured for automatic deployment to Render. Simply push to your main branch:

```bash
git add .
git commit -m "Your commit message"
git push
```

Both services will automatically rebuild and deploy.

## Configuration Files

### render.yaml
Defines both services with all necessary configuration:
- Backend: FastAPI service with Python 3.9.18
- Frontend: Next.js service with Node 18
- Environment variables pre-configured
- Health checks enabled

### next.config.js
Next.js production configuration:
- Standalone output for optimization
- Security headers
- Compression enabled

## Environment Variables

### Backend Service
- `PYTHON_VERSION`: 3.9.18
- `PYTHONPATH`: /opt/render/project/src/backend
- `CORS_ORIGINS`: Configured for both localhost and production frontend

### Frontend Service
- `NODE_VERSION`: 18
- `PYTHON_BACKEND_URL`: https://algorithm-visualizer-api-aa5n.onrender.com

## Verification Steps

### 1. Check Backend Health
Visit: https://algorithm-visualizer-api-aa5n.onrender.com/docs

You should see the FastAPI interactive documentation (Swagger UI).

### 2. Test Backend API
```bash
curl -X POST https://algorithm-visualizer-api-aa5n.onrender.com/api/algorithm/bubble \
  -H "Content-Type: application/json" \
  -d '{"array_size": 20, "sort_direction": "asc"}'
```

Should return algorithm steps in JSON format.

### 3. Check Frontend
Visit: https://algorithm-visualizer-web.onrender.com

The algorithm visualizer UI should load and be fully functional.

### 4. Test End-to-End
1. Open the frontend URL
2. Select an algorithm (e.g., Bubble Sort)
3. Click "Run"
4. Verify the visualization plays correctly

## Troubleshooting

### Frontend can't connect to backend
- Check that `PYTHON_BACKEND_URL` is set correctly in Render dashboard
- Verify CORS origins in backend include frontend URL
- Check browser console for CORS errors

### Backend deployment fails
- Verify `PYTHON_VERSION` is in major.minor.patch format (3.9.18)
- Check that all dependencies in `backend/requirements.txt` install correctly
- Review build logs in Render dashboard

### Frontend deployment fails
- Ensure `package.json` has all required dependencies
- Check that `next.config.js` is valid JavaScript
- Review build logs in Render dashboard

### Cold Start Delays
Free tier services sleep after 15 minutes of inactivity. First request may take 30-60 seconds.

## Manual Environment Variable Updates

If you need to update environment variables manually:

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Select the service (backend or frontend)
3. Go to "Environment" tab
4. Add/update variables
5. Click "Save Changes" (triggers automatic redeploy)

## Monitoring

### Backend Logs
```bash
# View in Render Dashboard > algorithm-visualizer-api > Logs
```

### Frontend Logs
```bash
# View in Render Dashboard > algorithm-visualizer-web > Logs
```

## Cost

Both services are configured for the **free tier**:
- 750 hours/month of runtime
- Automatic sleep after 15 min inactivity
- 0.1 CPU, 512MB RAM per service

## Updating Your Deployment

### Update Dependencies
```bash
# Backend
cd backend
# Update requirements.txt
git add requirements.txt
git commit -m "Update Python dependencies"
git push

# Frontend
# Update package.json
npm install
git add package.json package-lock.json
git commit -m "Update Node dependencies"
git push
```

### Update Environment Variables
Edit `render.yaml` and push changes, or update directly in Render Dashboard.

### Rollback
In Render Dashboard:
1. Go to service
2. Click "Events" tab
3. Find previous deployment
4. Click "Redeploy"

## Production Checklist

- [x] CORS configured for production frontend URL
- [x] Environment variables set correctly
- [x] Health checks configured
- [x] Security headers enabled
- [x] Compression enabled
- [x] Standalone Next.js build for optimization
- [x] Auto-deployment on git push enabled

## Support

- Render Documentation: https://render.com/docs
- Render Community: https://community.render.com

## Next Steps

Consider upgrading to paid tier for:
- No sleep/cold starts
- More resources (CPU/RAM)
- Custom domains
- Better performance
