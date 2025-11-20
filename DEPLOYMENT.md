# Production Deployment Checklist

This checklist ensures the Bible Word app is ready for production deployment.

## Pre-Deployment

### Environment Setup
- [ ] Set `EXPO_PUBLIC_API_URL` environment variable to production API URL (must use HTTPS)
- [ ] For iOS: Set `EXPO_PUBLIC_API_URL_IOS` if using a different iOS API endpoint
- [ ] Verify environment variables are set in EAS Build secrets (if using EAS)
- [ ] Update `eas.json` with Apple App Store and Google Play credentials

### Code Quality
- [x] All TypeScript compilation errors resolved
- [x] No security vulnerabilities found (CodeQL scan passed)
- [x] Debug console statements replaced with production-safe logger
- [x] HTTPS enforced for production API connections

### Documentation
- [x] README.md created with setup instructions
- [x] LICENSE file added (MIT)
- [x] SECURITY.md added with vulnerability reporting process
- [ ] Update README with any app-specific configuration needed

### App Configuration
- [x] Version updated to 1.0.0
- [x] iOS Bundle Identifier configured: `com.bible-word.app`
- [x] Android Package Name configured: `com.bible-word.android`
- [ ] App icons and splash screens finalized
- [ ] Deep linking configured for `bible-word.help` domain

## Build Process

### iOS Build
- [ ] Update Apple App Store credentials in `eas.json`
- [ ] Ensure TestFlight is configured for beta testing
- [ ] Run: `npm run build:prod` or `eas build -p ios --profile production`
- [ ] Submit to App Store: `npm run testflight` or use EAS Submit

### Android Build
- [ ] Update Google Play service account key in `eas.json`
- [ ] Configure signing credentials
- [ ] Run: `npm run build:prod` or `eas build -p android --profile production`
- [ ] Submit to Google Play via EAS Submit or manual upload

### Web Build
- [ ] Run: `npm run build:web`
- [ ] Test production build locally: `npm run serve:web`
- [ ] Deploy to hosting provider (Vercel, Netlify, etc.)

## Post-Deployment

### Testing
- [ ] Test authentication flow on production
- [ ] Verify API connections are working
- [ ] Test offline functionality
- [ ] Verify deep links work correctly
- [ ] Test on multiple devices (iOS, Android, Web)
- [ ] Verify analytics and crash reporting (if configured)

### Monitoring
- [ ] Set up error tracking (Sentry, Bugsnag, etc.)
- [ ] Configure analytics (Google Analytics, Mixpanel, etc.)
- [ ] Monitor API response times and errors
- [ ] Set up alerts for critical errors

### Security
- [ ] Review app permissions requested
- [ ] Ensure sensitive data is encrypted at rest
- [ ] Verify no secrets committed to repository
- [ ] Review third-party dependencies for vulnerabilities
- [ ] Set up regular security updates schedule

## Launch

- [ ] Create release notes for v1.0.0
- [ ] Prepare marketing materials
- [ ] Submit apps for review (iOS App Store, Google Play)
- [ ] Plan soft launch or phased rollout
- [ ] Monitor user feedback and crash reports
- [ ] Prepare hotfix process for critical issues

## Notes

### Security Best Practices
- Always use HTTPS for API endpoints in production
- Never commit API keys or secrets to version control
- Keep dependencies up to date
- Monitor security advisories for used packages
- Follow responsible disclosure for security vulnerabilities

### Support
- Check SECURITY.md for vulnerability reporting
- Monitor GitHub issues for user-reported problems
- Maintain changelog for tracking changes between versions
