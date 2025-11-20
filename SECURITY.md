# Security Hardening Changes

This document outlines the security improvements made to the Bible-App to protect user data and ensure secure communications across all platforms (iOS, Android, and Web).

## Overview

The security hardening addresses the following areas:
1. Network transport security (iOS and Android)
2. Web security headers
3. Production-safe logging
4. Environment variable validation

## 1. iOS App Transport Security (ATS)

**File:** `app.config.ts`

### Changes:
- Disabled `NSAllowsArbitraryLoads` (was `true`, now `false`)
- Only allows HTTP connections to `localhost` for development
- All production API calls must use HTTPS

### Impact:
- **Critical Security Improvement**: Prevents man-in-the-middle attacks by requiring HTTPS for all network requests except localhost
- Ensures data encryption in transit
- Complies with Apple's App Store security requirements

### Configuration:
```typescript
NSAppTransportSecurity: {
  NSAllowsArbitraryLoads: false,  // Changed from true
  NSExceptionDomains: {
    'localhost': { 
      NSExceptionAllowsInsecureHTTPLoads: true, 
      NSIncludesSubdomains: true 
    },
  },
}
```

## 2. Android Network Security Configuration

**File:** `plugins/androidNetworkSecurityPlugin.js`

### Changes:
- Created Expo config plugin to generate network security configuration
- Restricts cleartext (HTTP) traffic to localhost only
- Automatically generates `network_security_config.xml` during build

### Impact:
- Prevents cleartext HTTP traffic except for localhost development
- Protects against downgrade attacks
- Ensures all production API calls use HTTPS

### Configuration:
The plugin generates:
```xml
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">127.0.0.1</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

## 3. Web Security Headers

**File:** `vercel.json`

### Changes:
Added comprehensive security headers for all web routes:

- **X-Content-Type-Options: nosniff** - Prevents MIME type sniffing
- **X-Frame-Options: DENY** - Prevents clickjacking attacks
- **X-XSS-Protection: 1; mode=block** - Enables XSS filtering
- **Referrer-Policy: strict-origin-when-cross-origin** - Controls referrer information
- **Permissions-Policy** - Disables unnecessary browser features (camera, microphone, geolocation)
- **Content-Security-Policy (CSP)** - Restricts resource loading to prevent XSS and data injection attacks

### Impact:
- Protects against XSS (Cross-Site Scripting) attacks
- Prevents clickjacking
- Reduces information leakage
- Blocks unauthorized resource loading

### CSP Policy:
```
default-src 'self'; 
script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
style-src 'self' 'unsafe-inline'; 
img-src 'self' data: https:; 
font-src 'self' data:; 
connect-src 'self' https://u.expo.dev https://api.expo.dev; 
frame-ancestors 'none'; 
base-uri 'self'; 
form-action 'self'
```

## 4. Production-Safe Logging

**Files:** 
- `src/lib/utils/logger.ts` (new)
- `src/lib/api/client.ts` (updated)
- `src/lib/storage/auth-storage.ts` (updated)

### Changes:
- Created secure logger utility that only logs in development mode
- Sanitizes sensitive data (tokens, passwords) before logging
- Replaced all `console.log` calls with secure logger
- Always logs warnings and errors (sanitized)
- Only logs debug/info in development

### Impact:
- Prevents sensitive data leakage in production logs
- Reduces attack surface by limiting information exposure
- Maintains debugging capabilities in development

### Sanitization:
The logger automatically redacts:
- Bearer tokens: `Bearer [REDACTED]`
- Passwords in JSON: `"password":"[REDACTED]"`
- Tokens in JSON: `"token":"[REDACTED]"`

### Usage:
```typescript
import { logger } from '../utils/logger';

logger.debug('[API] → GET /api/user');  // Only in development
logger.info('User logged in');          // Only in development
logger.warn('API rate limit approaching'); // Always (sanitized)
logger.error('API request failed:', error); // Always (sanitized)
```

## 5. Environment Variable Validation

**Files:**
- `src/lib/env.ts` (new)
- `src/lib/api/config.ts` (updated)
- `.env.example` (updated)

### Changes:
- Created environment configuration module with validation
- Validates API URLs on startup
- Warns when non-HTTPS URLs are used in production
- Centralized environment variable access

### Impact:
- Prevents misconfiguration in production
- Ensures HTTPS is used for production API calls
- Provides early warning of security issues

### Validation:
- Checks if API URL uses HTTPS in production
- Warns about missing environment variables
- Provides fallback values for development

### Example Warning:
```
Security Warning: API URL should use HTTPS in production. Current URL: http://api.example.com
```

## Migration Guide

### For Developers:

1. **Update Environment Variables:**
   - Ensure `EXPO_PUBLIC_API_URL` uses HTTPS for production
   - Copy `.env.example` to `.env` and configure appropriately

2. **Replace console.log:**
   - Use `logger.debug()` for debug messages
   - Use `logger.info()` for informational messages
   - Use `logger.warn()` for warnings
   - Use `logger.error()` for errors

3. **Build/Prebuild:**
   - Run `npm run prebuild` to regenerate native projects with security configurations
   - The Android network security config will be automatically generated

### For Production Deployment:

1. **API URL Configuration:**
   ```bash
   # Set this in your production environment
   EXPO_PUBLIC_API_URL=https://api.yourdomain.com
   ```

2. **Verify HTTPS:**
   - All API endpoints must use HTTPS
   - SSL/TLS certificates must be valid
   - Certificate pinning is recommended for additional security

3. **Web Deployment:**
   - Vercel will automatically apply security headers
   - Verify CSP doesn't block required resources
   - Test all functionality after deployment

## Testing

### Manual Testing:

1. **iOS:**
   - Verify HTTP requests to non-localhost domains are blocked
   - Verify HTTPS requests work correctly
   - Test localhost development setup

2. **Android:**
   - Verify cleartext traffic is blocked for non-localhost domains
   - Verify HTTPS requests work correctly
   - Test on both emulator and physical device

3. **Web:**
   - Verify security headers are present (check browser DevTools)
   - Verify CSP doesn't block legitimate resources
   - Test all features work correctly

### Automated Testing:

Run TypeScript compilation to verify no errors:
```bash
npx tsc --noEmit
```

## Security Checklist

- [x] iOS App Transport Security configured
- [x] Android Network Security configuration added
- [x] Web security headers implemented
- [x] Console.log replaced with secure logger
- [x] Environment variable validation added
- [x] HTTPS warnings for production
- [x] Sensitive data sanitization
- [x] TypeScript compilation passes
- [x] CodeQL security scan passes (0 vulnerabilities)

## Additional Recommendations

1. **Certificate Pinning:** Consider implementing certificate pinning for critical API endpoints
2. **Biometric Authentication:** Consider adding biometric authentication for sensitive operations
3. **Secure Storage:** Consider using encrypted storage for sensitive data
4. **API Rate Limiting:** Ensure backend implements rate limiting
5. **Security Audits:** Conduct regular security audits and penetration testing
6. **Dependency Scanning:** Regularly run `npm audit` and update dependencies

## References

- [iOS App Transport Security](https://developer.apple.com/documentation/security/preventing_insecure_network_connections)
- [Android Network Security Configuration](https://developer.android.com/training/articles/security-config)
- [OWASP Mobile Security](https://owasp.org/www-project-mobile-security/)
- [Content Security Policy](https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP)
