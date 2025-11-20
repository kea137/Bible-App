# Production Deployment Guide

This guide covers deploying the Bible App to production environments.

## Pre-deployment Checklist

- [ ] Update version number in `package.json` and `app.config.ts`
- [ ] Configure production environment variables in `.env.production`
- [ ] Verify API endpoints use HTTPS
- [ ] Test production builds locally
- [ ] Review security configurations
- [ ] Update app store metadata (if applicable)

## Environment Configuration

### Required Environment Variables

Create a `.env.production` file with the following variables:

```bash
# API Configuration - Must use HTTPS in production
EXPO_PUBLIC_API_URL=https://api.yourdomain.com

# Environment
NODE_ENV=production
```

### iOS-specific Configuration (Optional)

```bash
EXPO_PUBLIC_API_URL_IOS=https://api.yourdomain.com
```

## Build Commands

### Development Build
```bash
npm run build:dev
```

### Preview Build (Internal Testing)
```bash
npm run build:preview
```

### Production Build (App Stores)
```bash
npm run build:prod
```

This command will:
- Build the app with production optimizations
- Strip console.log/console.info/console.debug statements (keeps error/warn)
- Auto-increment build numbers
- Submit to app stores (if configured)

## Platform-specific Builds

### iOS Production Build
```bash
# Run on device
npm run ios:prod

# Submit to TestFlight
npm run testflight
```

### Android Production Build
```bash
# Run on device
npm run android:prod
```

### Web Production Build
```bash
# Build for web
npm run build:web

# Serve locally to test
npm run serve:web
```

## Over-the-Air (OTA) Updates

Update the production app without going through app stores:

```bash
# iOS OTA update
npm run update:ios

# Note: Make sure to update the channel in eas.json if needed
```

## Security Considerations

### Network Security

The app is configured with strict network security:

1. **iOS (App Transport Security)**
   - Requires HTTPS for all network requests
   - Only allows HTTP for localhost (development)
   
2. **Android (Network Security Config)**
   - Restricts cleartext traffic to localhost only
   - All production API calls must use HTTPS

3. **Web (Security Headers)**
   - CSP, X-Frame-Options, and other security headers configured in `vercel.json`

### API Security

- **Always use HTTPS** for production API URLs
- The app will show warnings if HTTP is used in production
- Tokens and passwords are automatically redacted from logs

## Production Optimizations

### Automatic Optimizations

1. **Console Statement Removal**
   - `console.log`, `console.info`, `console.debug` are removed in production
   - `console.error` and `console.warn` are preserved for monitoring

2. **Source Maps**
   - Generated for better error tracking in production
   - Helps with debugging crash reports

3. **Code Minification**
   - Handled automatically by Expo/React Native

### Performance Monitoring

Consider integrating:
- Sentry for error tracking
- Firebase Analytics for user behavior
- Performance monitoring tools

## Deployment Platforms

### Mobile Apps (EAS Build)

The app uses Expo Application Services (EAS) for builds:

- **Development**: Internal testing builds
- **Preview**: Internal distribution for QA
- **Production**: App store submissions

Configuration is in `eas.json`.

### Web Deployment (Vercel)

The app is configured for Vercel deployment:

1. Push to your repository
2. Vercel will automatically build and deploy
3. Security headers are configured in `vercel.json`

## Version Management

- **Version**: Managed in `package.json` and `app.config.ts`
- **Build Numbers**: Auto-incremented via EAS (configured in `eas.json`)
- **Runtime Version**: Follows app version (for OTA compatibility)

## Post-deployment

### Monitoring

1. Check error tracking service for crashes
2. Monitor API performance
3. Review user feedback
4. Check app store reviews

### Rollback

If issues are found:

1. **OTA Updates**: Push a new update to revert changes
2. **App Store**: Submit new build with fixes
3. **Web**: Deploy previous version via Vercel

## Troubleshooting

### Common Issues

**Issue**: "HTTPS required" error on production
- **Solution**: Verify `EXPO_PUBLIC_API_URL` uses `https://`

**Issue**: Build fails with "console is not defined"
- **Solution**: Check that you're using the `logger` utility instead of direct console calls

**Issue**: Source maps not working
- **Solution**: Ensure metro.config.js production settings are applied

## Support

For issues or questions:
1. Check the SECURITY.md file for security-related configurations
2. Review EAS documentation: https://docs.expo.dev/eas/
3. Check Expo forums: https://forums.expo.dev/
