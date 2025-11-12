# Authentication Testing Guide

This document provides a guide for testing the authentication implementation with the Laravel backend.

## Prerequisites

1. **Laravel Backend Setup**
   - Ensure the Laravel backend (kea137/Bible repo) is running
   - Laravel Sanctum is configured
   - CORS is properly configured to allow credentials from your React Native app

2. **Environment Configuration**
   - Create a `.env` file in the root of the Bible-App project
   - Set `EXPO_PUBLIC_API_URL` to your Laravel backend URL (e.g., `http://192.168.1.100:8000`)

## Testing Scenarios

### 1. User Registration

**Test Case: Successful Registration**
1. Navigate to the Register screen
2. Fill in the form:
   - Name: "John Doe"
   - Email: "john@example.com"
   - Password: "SecurePass123"
   - Confirm Password: "SecurePass123"
3. Submit the form
4. Expected Result:
   - Success toast notification
   - Redirect to dashboard
   - User is logged in
   - Logout button appears in header

**Test Case: Password Validation**
1. Navigate to the Register screen
2. Try different password scenarios:
   - Password without uppercase: "securepass123" → Should show validation error
   - Password without lowercase: "SECUREPASS123" → Should show validation error
   - Password without number: "SecurePass" → Should show validation error
   - Password too short: "Pass1" → Should show validation error
   - Mismatched passwords → Should show "Passwords do not match" error

**Test Case: Duplicate Email**
1. Try to register with an email that already exists
2. Expected Result:
   - Error toast with message from backend
   - Field-level error message if backend provides it

### 2. User Login

**Test Case: Successful Login**
1. Navigate to the Login screen
2. Enter valid credentials:
   - Email: "user@example.com"
   - Password: "password123"
3. Optionally check "Remember me"
4. Submit the form
5. Expected Result:
   - Success toast notification
   - Redirect to dashboard
   - User data is loaded
   - Logout button appears in header

**Test Case: Invalid Credentials**
1. Navigate to the Login screen
2. Enter invalid credentials
3. Expected Result:
   - Error toast with message
   - No redirect
   - User remains on login screen

**Test Case: Form Validation**
1. Try to submit the form with:
   - Empty email → Should show "Email is required"
   - Invalid email format → Should show "Invalid email address"
   - Empty password → Should show "Password is required"
   - Short password (< 8 chars) → Should show validation error

### 3. Forgot Password

**Test Case: Request Password Reset**
1. Navigate to Forgot Password screen
2. Enter a registered email address
3. Submit the form
4. Expected Result:
   - Success toast with message
   - Redirect to login screen
   - Email should be sent by backend (check inbox)

**Test Case: Invalid Email**
1. Enter an email that's not registered
2. Expected Result:
   - Error message from backend

### 4. Authentication Persistence

**Test Case: Token Persistence**
1. Log in successfully
2. Close the app completely
3. Reopen the app
4. Expected Result:
   - User should still be logged in
   - Dashboard should be displayed
   - No redirect to login screen

**Test Case: Token Expiry**
1. Log in successfully
2. Wait for token to expire (or manually expire it on backend)
3. Try to make an authenticated request
4. Expected Result:
   - Token is cleared
   - User is redirected to login
   - Toast notification about session expiry (optional)

### 5. Protected Routes

**Test Case: Accessing Protected Route While Logged Out**
1. Ensure user is logged out
2. Try to navigate directly to `/dashboard` or any protected route
3. Expected Result:
   - Redirect to login screen

**Test Case: Accessing Auth Routes While Logged In**
1. Log in successfully
2. Try to navigate to `/auth/login` or `/auth/register`
3. Expected Result:
   - Redirect to dashboard

### 6. Logout

**Test Case: Successful Logout**
1. Log in successfully
2. Click the logout button in the header
3. Expected Result:
   - Success toast notification
   - Redirect to login screen
   - User data is cleared from storage
   - Token is cleared
   - Logout button disappears from header

### 7. CSRF Token Handling

**Test Case: CSRF Token Fetch**
1. Enable network debugging
2. Perform a login
3. Expected Result:
   - First request should be to `/sanctum/csrf-cookie`
   - Subsequent requests should include CSRF token
   - Login request should succeed

**Test Case: CSRF Token Expiry**
1. Log in successfully
2. Invalidate CSRF token on backend
3. Try to perform an action that requires CSRF token
4. Expected Result:
   - New CSRF token should be fetched automatically
   - Request should succeed

## Manual Testing with Mock Backend

If the Laravel backend is not available, you can test with a mock backend:

### Option 1: Modify Service Temporarily

Edit `src/lib/services/auth.service.ts` and replace functions with mock implementations:

```typescript
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Mock response
  return {
    user: {
      id: 1,
      name: 'Test User',
      email: credentials.email,
      email_verified_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    token: 'mock-token-12345',
  };
};
```

### Option 2: Use Mock Service Worker (MSW)

Install MSW and create mock handlers for API endpoints.

## Debugging Tips

### Network Debugging

1. **Enable Network Logging:**
   ```typescript
   // In src/lib/api/client.ts, add console logs
   this.client.interceptors.request.use((config) => {
     console.log('Request:', config.method, config.url, config.data);
     return config;
   });
   
   this.client.interceptors.response.use(
     (response) => {
       console.log('Response:', response.status, response.data);
       return response;
     },
     (error) => {
       console.log('Error:', error.response?.status, error.response?.data);
       return Promise.reject(error);
     }
   );
   ```

2. **Check Storage:**
   ```typescript
   // Add to any component
   import { getAuthToken, getUserData } from '@/lib/storage/auth-storage';
   
   console.log('Token:', getAuthToken());
   console.log('User:', getUserData());
   ```

### Common Issues

1. **CORS Errors:**
   - Ensure Laravel CORS config allows credentials
   - Check that `withCredentials: true` is set in API client
   - Verify the API URL is correct

2. **CSRF Token Mismatch:**
   - Check that cookies are being set and sent
   - Verify domain/path settings in Laravel session config
   - Ensure SameSite cookie settings are correct

3. **Token Not Persisting:**
   - Check MMKV initialization
   - Verify storage permissions
   - Check encryption key consistency

4. **Redirect Loop:**
   - Verify authentication logic in ProtectedRoute
   - Check isAuthenticated and isLoading states
   - Ensure segments detection is working correctly

## Laravel Backend Configuration

### Required CORS Configuration

In `config/cors.php`:

```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register', 'logout', 'forgot-password'],
'allowed_methods' => ['*'],
'allowed_origins' => ['http://localhost:8081', 'http://192.168.1.100:8081'], // Add your dev URLs
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true, // IMPORTANT!
```

### Session Configuration

In `.env`:

```
SESSION_DRIVER=cookie
SESSION_DOMAIN=.yourdomain.com  # Or leave empty for development
SANCTUM_STATEFUL_DOMAINS=localhost:8081,192.168.1.100:8081
```

## Success Criteria

All tests pass when:
- [ ] User can register with valid data
- [ ] User can login with valid credentials
- [ ] User can request password reset
- [ ] User stays logged in after app restart
- [ ] Protected routes redirect to login when not authenticated
- [ ] Auth routes redirect to dashboard when authenticated
- [ ] User can logout successfully
- [ ] Form validation works correctly
- [ ] Error messages are displayed properly
- [ ] Success notifications are shown
- [ ] CSRF tokens are handled automatically
- [ ] No console errors during normal operation
