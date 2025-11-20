# Production Readiness Checklist

Use this checklist before deploying to production.

## Code Quality

- [x] TypeScript compilation passes without errors (`npm run type-check`)
- [x] All console.log/info/debug statements use logger utility or will be removed in production
- [x] No debugger statements in production code
- [x] No TODO/FIXME related to security or production deployment

## Configuration

- [x] Version updated to 1.0.0 in package.json and app.config.ts
- [x] Production environment variables configured (.env.production)
- [x] API URLs use HTTPS (no HTTP in production)
- [x] EAS build configuration reviewed (eas.json)
- [x] Babel configuration includes console removal for production

## Security

- [x] Network security configured for iOS (App Transport Security)
- [x] Network security configured for Android (network_security_config.xml)
- [x] Web security headers configured (vercel.json)
- [x] No hardcoded secrets or API keys in code
- [x] Logger sanitizes sensitive data (tokens, passwords)
- [x] Environment validation checks for HTTPS in production

## Build & Deployment

- [ ] Test development build locally (`npm run build:dev`)
- [ ] Test preview build for QA (`npm run build:preview`)
- [ ] Test production build (`npm run build:prod`)
- [ ] Verify web build works (`npm run build:web` && `npm run serve:web`)
- [ ] Test OTA updates work (`npm run update:ios` or `npm run update:android`)

## App Store Preparation (if applicable)

- [ ] App icons and splash screens are high quality
- [ ] App store metadata prepared (screenshots, descriptions)
- [ ] Privacy policy URL set
- [ ] Terms of service URL set
- [ ] Support email configured
- [ ] Age rating reviewed

## Testing

- [ ] Test on physical iOS device
- [ ] Test on physical Android device
- [ ] Test on web browser
- [ ] Test offline functionality
- [ ] Test with slow network connection
- [ ] Test authentication flow
- [ ] Test Bible reading and navigation
- [ ] Test notes and highlights
- [ ] Test reading plans
- [ ] Test deep linking

## Performance

- [ ] App loads within acceptable time
- [ ] No memory leaks detected
- [ ] Smooth scrolling and animations
- [ ] Images optimized for size
- [ ] Bundle size is reasonable

## Monitoring & Analytics (if applicable)

- [ ] Error tracking service configured (e.g., Sentry)
- [ ] Analytics configured (e.g., Firebase Analytics)
- [ ] Performance monitoring set up
- [ ] Crash reporting tested

## Documentation

- [x] README.md exists with setup instructions
- [x] PRODUCTION.md exists with deployment guide
- [x] SECURITY.md documents security configurations
- [ ] Changelog updated with version 1.0.0 release notes

## Post-Deployment

- [ ] Monitor error tracking service for crashes
- [ ] Check app store reviews
- [ ] Monitor API performance
- [ ] Verify OTA updates deploy successfully
- [ ] Test rollback procedure if needed

## Emergency Rollback Plan

If critical issues are found in production:

1. **OTA Updates**: Deploy hotfix via `npm run update:all`
2. **App Store**: Submit emergency build with fixes
3. **Web**: Revert deployment via hosting platform
4. **Communication**: Notify users if necessary

## Notes

Add any project-specific notes or considerations here:

- Backend API must be deployed and accessible via HTTPS
- Database migrations should be tested in staging first
- Consider phased rollout (e.g., 10% of users first)
- Have rollback plan ready before deploying
