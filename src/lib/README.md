# Authentication Implementation

This directory contains the authentication implementation for the Bible App, designed to work with a Laravel backend using Sanctum.

## Structure

```
src/lib/
├── api/
│   ├── client.ts       # Axios client with Sanctum support
│   └── config.ts       # API configuration and endpoints
├── contexts/
│   └── AuthContext.tsx # React context for auth state management
├── services/
│   └── auth.service.ts # Authentication service layer
├── storage/
│   └── auth-storage.ts # Token persistence using MMKV
├── validation/
│   └── auth.validation.ts # Zod validation schemas
└── auth.ts             # Central exports
```

## Features

### 1. Laravel Sanctum Integration
- **CSRF Token Management**: Automatically fetches and manages CSRF tokens for state-changing requests
- **Cookie-based Sessions**: Supports Laravel's cookie-based session authentication
- **Token-based Auth**: Also supports Bearer token authentication

### 2. Authentication Flows
- **Login**: Email and password authentication with "remember me" option
- **Register**: User registration with password confirmation validation
- **Forgot Password**: Request password reset link via email
- **Logout**: Secure logout with token cleanup

### 3. Form Validation
- **Zod Schemas**: Type-safe form validation using Zod
- **Password Strength**: Enforces strong passwords (min 8 chars, uppercase, lowercase, number)
- **Password Confirmation**: Ensures passwords match during registration/reset

### 4. State Management
- **AuthContext**: Global authentication state using React Context
- **Token Persistence**: Secure token storage using react-native-mmkv
- **Auto-initialization**: Restores auth state on app launch

### 5. Error Handling
- **API Error Parsing**: Converts Laravel validation errors to user-friendly messages
- **Toast Notifications**: User feedback for success/error states
- **Field-level Errors**: Displays validation errors next to form fields

## Setup

### 1. Environment Configuration

Create a `.env` file in the root directory:

```bash
EXPO_PUBLIC_API_URL=http://your-laravel-backend-url
```

### 2. Laravel Backend Requirements

Your Laravel backend should have the following endpoints configured with Sanctum:

```php
// CSRF Cookie endpoint (Sanctum)
GET /sanctum/csrf-cookie

// Authentication endpoints
POST /login
POST /register
POST /logout
POST /forgot-password
POST /reset-password

// User endpoint (protected)
GET /api/user
```

### 3. Expected API Responses

#### Login/Register Response
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "email_verified_at": "2024-01-01T00:00:00.000000Z",
    "created_at": "2024-01-01T00:00:00.000000Z",
    "updated_at": "2024-01-01T00:00:00.000000Z"
  },
  "token": "optional-bearer-token"
}
```

#### Forgot Password Response
```json
{
  "message": "Password reset link sent to your email"
}
```

#### Error Response
```json
{
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password field is required."]
  }
}
```

## Usage

### Using the Auth Context

```tsx
import { useAuth } from '@/lib/contexts/AuthContext';

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  // Check if user is authenticated
  if (isAuthenticated) {
    return <Text>Welcome, {user?.name}!</Text>;
  }

  // Login
  const handleLogin = async () => {
    try {
      await login({
        email: 'user@example.com',
        password: 'password123',
        remember: true,
      });
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Logout
  const handleLogout = async () => {
    await logout();
  };

  return <LoginForm onLogin={handleLogin} />;
}
```

### Direct Service Usage

```tsx
import * as authService from '@/lib/services/auth.service';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123',
});

// Register
const response = await authService.register({
  name: 'John Doe',
  email: 'john@example.com',
  password: 'SecurePass123',
  password_confirmation: 'SecurePass123',
});

// Forgot Password
const response = await authService.forgotPassword({
  email: 'user@example.com',
});
```

## Security Considerations

1. **CSRF Protection**: The API client automatically handles CSRF tokens for Laravel Sanctum
2. **Secure Storage**: Auth tokens are encrypted using react-native-mmkv
3. **Token Expiry**: Invalid tokens (401/419 responses) are automatically cleared
4. **Password Validation**: Enforces strong password requirements
5. **HTTPS**: Always use HTTPS in production for API communication

## Testing with Mock Backend

For development without a Laravel backend, you can modify the service to return mock data:

```typescript
// In auth.service.ts (for testing only)
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // Mock response for testing
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

## Troubleshooting

### CSRF Token Issues
If you encounter CSRF token errors:
1. Ensure `withCredentials: true` is set in the API client
2. Verify your Laravel backend allows credentials in CORS configuration
3. Check that cookies are being set correctly

### Token Not Persisting
If tokens aren't persisting across app restarts:
1. Verify MMKV is properly initialized
2. Check that storage permissions are granted
3. Ensure the encryption key is consistent

### Network Errors
For network-related issues:
1. Verify the API URL is correct
2. Check that the backend is running and accessible
3. Ensure CORS is properly configured on the backend
4. Use the correct URL format (include http:// or https://)
