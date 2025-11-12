# Authentication Flow Diagram

## Login Flow
```
┌─────────────────┐
│  Login Screen   │
│  (login.tsx)    │
└────────┬────────┘
         │
         │ User enters credentials
         │
         ▼
┌─────────────────┐
│   Zod Schema    │◄─── Validates email format, password length
│   Validation    │
└────────┬────────┘
         │
         │ Valid
         │
         ▼
┌─────────────────┐
│  AuthContext    │
│  login()        │
└────────┬────────┘
         │
         │ Calls service
         │
         ▼
┌─────────────────┐
│  Auth Service   │
│  login()        │
└────────┬────────┘
         │
         │ Makes API request
         │
         ▼
┌─────────────────┐
│   API Client    │◄─── Fetches CSRF token first
│   (axios)       │
└────────┬────────┘
         │
         │ POST /login
         │
         ▼
┌─────────────────┐
│ Laravel Backend │◄─── Sanctum authentication
│  (kea137/Bible) │
└────────┬────────┘
         │
         │ Returns user + token
         │
         ▼
┌─────────────────┐
│ Token Storage   │◄─── Encrypted MMKV storage
│ (auth-storage)  │
└────────┬────────┘
         │
         │ Token saved
         │
         ▼
┌─────────────────┐
│  AuthContext    │◄─── Updates state
│  setUser()      │
└────────┬────────┘
         │
         │ Navigation
         │
         ▼
┌─────────────────┐
│   Dashboard     │
└─────────────────┘
```

## Registration Flow
```
┌─────────────────┐
│ Register Screen │
│ (register.tsx)  │
└────────┬────────┘
         │
         │ User enters details
         │
         ▼
┌─────────────────┐
│   Zod Schema    │◄─── Validates:
│   Validation    │     • Name (min 2 chars)
└────────┬────────┘     • Email format
         │              • Password strength
         │              • Password confirmation match
         │ Valid
         │
         ▼
┌─────────────────┐
│  AuthContext    │
│  register()     │
└────────┬────────┘
         │
         │ Calls service
         │
         ▼
┌─────────────────┐
│  Auth Service   │
│  register()     │
└────────┬────────┘
         │
         │ Makes API request
         │
         ▼
┌─────────────────┐
│   API Client    │◄─── Fetches CSRF token first
│   (axios)       │
└────────┬────────┘
         │
         │ POST /register
         │
         ▼
┌─────────────────┐
│ Laravel Backend │◄─── Creates user account
│  (kea137/Bible) │
└────────┬────────┘
         │
         │ Returns user + token
         │
         ▼
┌─────────────────┐
│ Token Storage   │◄─── Saves auth token
│ (auth-storage)  │
└────────┬────────┘
         │
         │
         ▼
┌─────────────────┐
│   Dashboard     │
└─────────────────┘
```

## Forgot Password Flow
```
┌─────────────────┐
│ Forgot Password │
│   Screen        │
└────────┬────────┘
         │
         │ User enters email
         │
         ▼
┌─────────────────┐
│   Validation    │◄─── Email format check
└────────┬────────┘
         │
         │ Valid
         │
         ▼
┌─────────────────┐
│  Auth Service   │
│ forgotPassword()│
└────────┬────────┘
         │
         │ POST /forgot-password
         │
         ▼
┌─────────────────┐
│ Laravel Backend │◄─── Sends reset email
│  (kea137/Bible) │
└────────┬────────┘
         │
         │ Success message
         │
         ▼
┌─────────────────┐
│  Toast Message  │
│  "Email sent"   │
└────────┬────────┘
         │
         │
         ▼
┌─────────────────┐
│  Login Screen   │
└─────────────────┘
```

## Protected Route Flow
```
┌─────────────────┐
│   App Start     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthContext    │◄─── Initializes from storage
│  Initialize     │
└────────┬────────┘
         │
         │ Check stored token
         │
         ▼
┌─────────────────┐
│ Token Storage   │
└────────┬────────┘
         │
         ├─── Token exists ───┐
         │                    │
         │                    ▼
         │            ┌─────────────────┐
         │            │  Verify Token   │
         │            │  GET /api/user  │
         │            └────────┬────────┘
         │                     │
         │                     ├─── Valid ───────┐
         │                     │                 │
         │                     │                 ▼
         │                     │         ┌─────────────────┐
         │                     │         │  Set User State │
         │                     │         │  isAuth = true  │
         │                     │         └────────┬────────┘
         │                     │                  │
         │            Invalid ─┴──────────────────┤
         │                                        │
         └─── No token ─────────────────────────┬─┘
                                                │
                                                ▼
                                        ┌─────────────────┐
                                        │  Clear Storage  │
                                        │  isAuth = false │
                                        └────────┬────────┘
                                                 │
         ┌───────────────────────────────────────┤
         │                                       │
         │ User navigates to route               │
         │                                       │
         ▼                                       ▼
┌─────────────────┐                    ┌─────────────────┐
│ Protected Route │                    │   Auth Route    │
│  (Dashboard)    │                    │   (Login)       │
└────────┬────────┘                    └────────┬────────┘
         │                                      │
         │ isAuth?                              │ isAuth?
         │                                      │
    Yes  │  No                             No   │  Yes
         │                                      │
         ▼                                      ▼
┌─────────────────┐                    ┌─────────────────┐
│ Show Dashboard  │                    │ Redirect to     │
└─────────────────┘                    │   Dashboard     │
         │                             └─────────────────┘
    No   │
         ▼
┌─────────────────┐
│ Redirect to     │
│     Login       │
└─────────────────┘
```

## Logout Flow
```
┌─────────────────┐
│  User clicks    │
│ Logout Button   │
│  (Header)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthContext    │
│  logout()       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Auth Service   │
│  logout()       │
└────────┬────────┘
         │
         │ POST /logout
         │
         ▼
┌─────────────────┐
│ Laravel Backend │◄─── Invalidate session
│  (kea137/Bible) │
└────────┬────────┘
         │
         │ Even if fails...
         │
         ▼
┌─────────────────┐
│ Clear Storage   │◄─── Remove token & user data
│ (auth-storage)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Reset CSRF      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AuthContext    │◄─── Clear user state
│  setUser(null)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Login Screen   │
└─────────────────┘
```

## Password Requirements
```
┌─────────────────────────────────────┐
│        Password Validation          │
├─────────────────────────────────────┤
│ ✓ Minimum 8 characters              │
│ ✓ At least 1 uppercase letter (A-Z)│
│ ✓ At least 1 lowercase letter (a-z)│
│ ✓ At least 1 number (0-9)           │
│                                     │
│ For Registration:                   │
│ ✓ Password confirmation must match  │
└─────────────────────────────────────┘
```

## Error Handling
```
API Error
   │
   ▼
┌─────────────────┐
│ Error Response  │
└────────┬────────┘
         │
         ├─── Validation Errors (422) ───┐
         │                               │
         │                               ▼
         │                      ┌─────────────────┐
         │                      │ Parse errors    │
         │                      │ object          │
         │                      └────────┬────────┘
         │                               │
         │                               ▼
         │                      ┌─────────────────┐
         │                      │ Display field   │
         │                      │ errors          │
         │                      └─────────────────┘
         │
         ├─── Auth Errors (401/419) ─────┐
         │                               │
         │                               ▼
         │                      ┌─────────────────┐
         │                      │ Clear tokens    │
         │                      └────────┬────────┘
         │                               │
         │                               ▼
         │                      ┌─────────────────┐
         │                      │ Redirect login  │
         │                      └─────────────────┘
         │
         └─── General Errors ────────────┐
                                         │
                                         ▼
                                ┌─────────────────┐
                                │ Show toast      │
                                │ error           │
                                └─────────────────┘
```

## Key Components Interaction
```
┌──────────────────────────────────────────────────────────────┐
│                         App Layout                            │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                    AuthProvider                         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │          React Navigation Stack                  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │           Header (with logout)             │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │              Screen Content                │  │  │  │
│  │  │  │   • Login Screen                           │  │  │  │
│  │  │  │   • Register Screen                        │  │  │  │
│  │  │  │   • Dashboard (Protected)                  │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  │  ┌────────────────────────────────────────────┐  │  │  │
│  │  │  │            Mobile Footer                   │  │  │  │
│  │  │  └────────────────────────────────────────────┘  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────┘  │
│  ┌────────────────────────────────────────────────────────┐  │
│  │                  Toast Notifications                    │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────┘
```
