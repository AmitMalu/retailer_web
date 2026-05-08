# Environment Setup Guide

This project uses multiple environment files to separate configurations for different deployment environments.

## Environment Files

- `.env.example` - Template file showing all required environment variables
- `.env.development` - Development environment configuration
- `.env.production` - Production environment configuration

## Setup Instructions

### 1. Copy the Example File
```bash
# For development
cp .env.example .env.development

# For production
cp .env.example .env.production
```

### 2. Update Environment Variables
Edit the copied files and replace the placeholder values with your actual environment-specific values:

- `VITE_SERVER_URL` - Your API server URL
- `VITE_APP_BASE_PATH` - Base path for the application
- `VITE_SECRET_KEY` - Secret key for encryption
- `VITE_DMT_PAYSPRINT_LIVE_ENC_KEY` - DMT Paysprint encryption key
- `VITE_DMT_PAYSPRINT_LIVE_ENC_IV` - DMT Paysprint encryption IV
- `VITE_AEPS_FINGPAY_LIVE_WADH` - AEPS Fingpay WADH value
- `VITE_DMT_PAYSPRINT_LIVE_WADH` - DMT Paysprint WADH value

## Available Scripts

### Development
```bash
# Run development server with development environment
npm run dev

# Run development server with production environment (for testing)
npm run dev:prod
```

### Building
```bash
# Build for production (default)
npm run build

# Build for development environment
npm run build:dev
```

### WAR Creation
```bash
# Create production WAR file
npm run war

# Create development WAR file
npm run war:dev
```

### Preview
```bash
# Preview production build
npm run preview

# Preview development build
npm run preview:dev
```

## Environment Detection

The application automatically detects the current environment based on:
1. The `--mode` flag passed to Vite commands
2. Defaults to `development` if no mode is specified

## Git Configuration

- `.env.example` is tracked in Git (serves as template)
- `.env.development` and `.env.production` are ignored by Git
- Never commit actual environment files with sensitive data

## Deployment Safety

This setup prevents accidental deployment with wrong URLs:
- Development commands use `.env.development`
- Production commands use `.env.production`
- Environment-specific builds ensure correct API URLs

## Troubleshooting

### Environment Variables Not Loading
1. Ensure you're using the correct npm script
2. Check that the environment file exists
3. Verify all variables have `VITE_` prefix
4. Restart the development server after changing environment files

### Build Issues
1. Clear the dist folder: `rm -rf dist`
2. Clear node_modules and reinstall: `rm -rf node_modules && npm install`
3. Check for syntax errors in environment files

### Wrong API URLs in Production
1. Use `npm run build` (not `npm run build:dev`) for production
2. Verify `.env.production` contains correct URLs
3. Check that the deployment script uses the correct npm command
