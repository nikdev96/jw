# Production Deployment Guide

## 🎯 Architecture Overview

Production deployment uses **separated services** architecture:
- **Database**: Docker Compose (docker-compose.yml)
- **Backend/Frontend**: Cloud services (Kubernetes/VMs/Serverless)

This is the industry standard for scalable production deployments.

## 🚀 Quick Start

### 1. Setup Environment
```bash
# Copy production template
cp .env.prod.example .env.prod

# Edit with real values
nano .env.prod
```

### 2. Start Production Database
```bash
# Start PostgreSQL container
make prod

# Check status
make prod-status

# View logs
make prod-logs
```

### 3. Deploy Backend (Cloud Service)
Your backend connects to: `postgresql+asyncpg://postgres:your_production_password@postgres:5432/botshop`

Replace `postgres:5432` with your database host:port in production cloud environment.

### 4. Deploy Frontend (CDN/Static Hosting)
Frontend connects to your backend API at: `http://your-backend-host:8000/api/v1`

Set `VITE_API_URL` environment variable to your production backend URL.

## 📋 Commands Reference

| Command | Description |
|---------|-------------|
| `make prod` | Start production database |
| `make prod-stop` | Stop production database |
| `make prod-logs` | View database logs |
| `make prod-status` | Check service status |

## 🏗️ Production Database Details

**Container**: `botshop_postgres`  
**Image**: `postgres:15-alpine`  
**Port**: `5432` (exposed to host)  
**Volume**: `postgres_data` (persistent)  
**Health Check**: Every 5 seconds with pg_isready

## 🔧 Environment Variables

### Required for Production
```bash
DATABASE_URL=postgresql+asyncpg://postgres:PASSWORD@postgres:5432/botshop
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
MANAGER_CHAT_ID=your_manager_chat_id
```

### Optional
```bash
FRONTEND_URL=https://your-production-domain.com
FRONTEND_DEV_URL=https://your-production-domain.com
DEBUG=false
```

## 🚀 Deployment Scenarios

### Scenario A: Single VM
```bash
# On production server
git clone your-repo
cd botshop
cp .env.prod.example .env.prod
# Edit .env.prod with real values
make prod
# Deploy backend to same VM (port 8000)
# Deploy frontend to same VM (port 80/443)
```

### Scenario B: Kubernetes
```bash
# Database: Use StatefulSet with PVC
# Backend/Frontend: Deploy as Deployments
# DATABASE_URL: k8s-service-name:5432
```

### Scenario C: Cloud Services
```bash
# Database: Docker Compose on small VM
# Backend: Heroku, Railway, Render
# Frontend: Vercel, Netlify, CloudFlare Pages
```

## 🔍 Verification

### Check Database Connection
```bash
docker exec -it botshop_postgres psql -U postgres -d botshop -c "\dt"
```

### Test API Health
```bash
curl -f http://localhost:8000/health
```

### Check Environment Variables
```bash
docker exec -it botshop_postgres printenv | grep DATABASE_URL
```

## 📊 Monitoring

### Database Logs
```bash
make prod-logs
```

### Container Stats
```bash
docker stats botshop_postgres
```

### Health Checks
```bash
curl -f http://localhost:5432  # Database
curl -f http://localhost:8000/health  # Backend
```

## 🔄 Development vs Production

| Aspect | Development | Production |
|--------|-------------|-------------|
| Docker Compose | `docker-compose.dev.yml` (all services) | `docker-compose.yml` (database only) |
| Environment File | `.env.dev` | `.env.prod` |
| Debug Mode | `DEBUG=true` | `DEBUG=false` |
| Services | Backend + Frontend + Database | Database (Backend/Frontend in cloud) |
| Hot Reload | Enabled | Disabled |

## 🛠️ Troubleshooting

### Common Issues

#### Database Connection Failed
```bash
# Check if database is running
make prod-status

# Check logs
make prod-logs

# Test connection locally
docker exec -it botshop_postgres psql -U postgres -d botshop
```

#### Permission Denied
```bash
# Check .env.prod permissions
ls -la .env.prod

# Ensure DATABASE_URL is correct
grep DATABASE_URL .env.prod
```

#### Port Conflicts
```bash
# Check port usage
netstat -tulpn | grep 5432
```

## 📞 Support

For production deployment issues:
1. Check this guide first
2. Review logs with `make prod-logs`
3. Verify environment variables
4. Test database connectivity

---

## 🎯 Production Best Practices

1. **Security**: Use real passwords, not defaults
2. **Backups**: Configure database backups
3. **Monitoring**: Set up health checks
4. **SSL**: Use HTTPS in production
5. **Resources**: Monitor resource usage
6. **Updates**: Test deployments in staging first