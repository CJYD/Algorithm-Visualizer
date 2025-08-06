# Deployment Guide

This guide covers various deployment options for the Algorithm Visualizer application, from local development to production environments.

## Quick Start (Local Development)

### Prerequisites
- Node.js (v16 or higher)
- Python (v3.8 or higher)  
- pip (Python package manager)
- npm (Node.js package manager)

### Local Setup

#### 1. Clone and Setup Backend
```bash
git clone <repository-url>
cd algorithm-visualizer/backend

# Create virtual environment (recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
uvicorn app.main:app --reload
```

Backend will be available at: `http://localhost:8000`

#### 2. Setup Frontend
```bash
# In a new terminal, navigate to project root
cd algorithm-visualizer

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at: `http://localhost:3000`

### Verification
- Visit `http://localhost:3000` to access the application
- Backend API docs available at `http://localhost:8000/docs`

## Production Deployment

### Option 1: Traditional Server Deployment

#### Backend Deployment
```bash
# Production server setup
pip install gunicorn

# Start with Gunicorn (production ASGI server)
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Or with Uvicorn directly
uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

#### Frontend Deployment
```bash
# Build optimized production bundle
npm run build

# Start production server
npm start

# Or serve static files with nginx/apache
npm run build && npm run export  # For static export
```

### Option 2: Docker Deployment

#### Backend Dockerfile
```dockerfile
# backend/Dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ app/

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

#### Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - PYTHONPATH=/app
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/docs"]
      interval: 30s
      timeout: 10s
      retries: 3

  frontend:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
    depends_on:
      - backend
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 10s
      retries: 3
```

Deploy with Docker:
```bash
# Build and start services
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Cloud Platform Deployment

#### Vercel (Frontend) + Railway/Render (Backend)

**Frontend on Vercel:**
1. Connect GitHub repository to Vercel
2. Configure build settings:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm ci"
   }
   ```
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL=https://your-backend.railway.app`

**Backend on Railway:**
1. Connect GitHub repository to Railway
2. Set Python buildpack
3. Configure start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Environment variables:
   - `PORT=8000`
   - `PYTHON_VERSION=3.9`

#### AWS Deployment

**Backend (AWS Lambda + API Gateway):**
```bash
# Install serverless framework
npm install -g serverless
pip install serverless-wsgi

# Create serverless.yml
service: algorithm-visualizer-api

provider:
  name: aws
  runtime: python3.9
  region: us-east-1

functions:
  app:
    handler: wsgi_handler.handler
    events:
      - http: ANY /
      - http: 'ANY /{proxy+}'

plugins:
  - serverless-wsgi

custom:
  wsgi:
    app: app.main.app
```

**Frontend (AWS S3 + CloudFront):**
```bash
# Build static export
npm run build && npm run export

# Deploy to S3
aws s3 sync out/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

## Environment Configuration

### Backend Environment Variables
```bash
# backend/.env
CORS_ORIGINS=http://localhost:3000,https://your-frontend.vercel.app
DEBUG=false
HOST=0.0.0.0
PORT=8000
```

### Frontend Environment Variables
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_API_TIMEOUT=30000
```

## Performance Optimization

### Backend Optimization
```python
# app/main.py production settings
from fastapi import FastAPI
from fastapi.middleware.gzip import GZipMiddleware

app = FastAPI(
    title="Algorithm Visualizer API",
    docs_url="/docs" if DEBUG else None,  # Disable docs in production
    redoc_url="/redoc" if DEBUG else None
)

# Add compression middleware
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Enable caching headers
@app.middleware("http")
async def add_cache_headers(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/api/"):
        response.headers["Cache-Control"] = "max-age=300"  # 5 minutes
    return response
```

### Frontend Optimization
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: false,
  },
  
  // Optimize images
  images: {
    optimize: true,
  },
  
  // Compress responses
  compress: true,
  
  // Bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks.cacheGroups = {
        ...config.optimization.splitChunks.cacheGroups,
        commons: {
          name: 'commons',
          chunks: 'all',
          minChunks: 2,
        },
      }
    }
    return config
  },
}

module.exports = nextConfig
```

## Monitoring and Logging

### Backend Monitoring
```python
# app/main.py
import logging
import time
from fastapi import Request

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

@app.middleware("http")
async def log_requests(request: Request, call_next):
    start_time = time.time()
    
    response = await call_next(request)
    
    process_time = time.time() - start_time
    logger.info(
        f"{request.method} {request.url.path} - "
        f"{response.status_code} - {process_time:.2f}s"
    )
    
    return response
```

### Frontend Monitoring
```typescript
// pages/_app.tsx
import { useEffect } from 'react'

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    // Log page views
    const handleRouteChange = (url: string) => {
      console.log('Page view:', url)
    }
    
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [])

  return <Component {...pageProps} />
}
```

## Security Configuration

### Backend Security
```python
# app/main.py
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.middleware.httpsredirect import HTTPSRedirectMiddleware

# Force HTTPS in production
if not DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)

# Trusted hosts
app.add_middleware(
    TrustedHostMiddleware, 
    allowed_hosts=["localhost", "your-domain.com", "*.vercel.app"]
)

# CORS configuration for production
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://your-frontend.vercel.app"],
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type"],
)
```

### Frontend Security
```javascript
// next.config.js
const nextConfig = {
  // Security headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}
```

## Troubleshooting

### Common Issues

**Backend Issues:**
```bash
# Port already in use
lsof -ti:8000 | xargs kill -9

# Module not found
export PYTHONPATH="${PYTHONPATH}:/path/to/your/project"

# CORS errors
# Check CORS_ORIGINS environment variable
```

**Frontend Issues:**
```bash
# Clear Next.js cache
rm -rf .next

# Node modules issues
rm -rf node_modules package-lock.json
npm install

# Build issues
npm run build -- --debug
```

### Health Checks
```bash
# Backend health check
curl http://localhost:8000/docs

# Frontend health check  
curl http://localhost:3000

# Docker health check
docker-compose ps
```

## Backup and Maintenance

### Database Backup
Not applicable - the application is stateless and doesn't use persistent storage.

### Log Rotation
```bash
# Setup log rotation for production
sudo nano /etc/logrotate.d/algorithm-visualizer

# Content:
/var/log/algorithm-visualizer/*.log {
    daily
    missingok
    rotate 52
    compress
    delaycompress
    notifempty
    create 644 appuser appuser
}
```

### Update Strategy
1. **Dependencies**: Regular security updates
2. **Algorithm Improvements**: Version controlled changes
3. **UI Enhancements**: A/B testing in production
4. **Zero-downtime Deployment**: Blue-green or rolling updates

## Cost Optimization

### Free Tier Options
- **Vercel**: Free for personal projects
- **Railway**: $5/month hobby tier
- **Render**: Free tier available
- **Netlify**: Free static hosting

### Resource Optimization
- **Frontend**: Static export for CDN delivery
- **Backend**: Serverless functions for cost efficiency
- **Caching**: Reduce API calls with browser caching
- **Bundle Size**: Code splitting and tree shaking