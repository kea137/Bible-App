# Bible Word App

A modern, cross-platform Bible study application built with React Native and Expo.

## Features

- 📖 Read the Bible in multiple translations
- 📝 Take notes and highlights
- 📚 Reading plans and lessons
- 🌐 Cross-platform (iOS, Android, Web)
- 🔒 Secure and privacy-focused
- 🎨 Beautiful, modern UI with dark mode support

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (installed automatically via npx)
- For iOS development: Xcode and CocoaPods
- For Android development: Android Studio

### Installation

```bash
# Clone the repository
git clone https://github.com/kea137/Bible-App.git
cd Bible-App

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env

# Update .env with your API URL
```

### Development

```bash
# Start the development server
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run on iOS device
npm run device:ios

# Run on Android device
npm run device:android
```

## Project Structure

```
Bible-App/
├── app/                    # App screens and routes (Expo Router)
│   ├── auth/              # Authentication screens
│   ├── bibles/            # Bible reading screens
│   ├── highlights/        # Highlights management
│   ├── lessons/           # Lessons and study materials
│   ├── notes/             # Notes management
│   └── onboarding/        # Onboarding flow
├── assets/                # Images, fonts, and other static assets
├── components/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and services
├── locales/              # Internationalization files
├── plugins/              # Expo config plugins
├── src/                  # Source code
│   └── lib/              # Core library code
│       ├── api/          # API client configuration
│       ├── services/     # Business logic services
│       ├── storage/      # Local storage utilities
│       └── utils/        # Helper utilities
├── app.config.ts         # Expo configuration
├── eas.json              # EAS Build configuration
└── package.json          # Dependencies and scripts
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```bash
# Development
EXPO_PUBLIC_API_URL=http://localhost:8000

# Production (use .env.production)
EXPO_PUBLIC_API_URL=https://api.yourdomain.com
```

## Building for Production

See [PRODUCTION.md](./PRODUCTION.md) for detailed production deployment instructions.

### Quick Production Build

```bash
# iOS & Android
npm run build:prod

# Web
npm run build:web
```

## Security

This app implements comprehensive security measures:

- 🔐 HTTPS-only API communication in production
- 🛡️ Network security configurations for iOS and Android
- 🔒 Secure token storage
- 🚫 Automatic console log removal in production
- 🔍 Input sanitization and validation

For detailed security information, see [SECURITY.md](./SECURITY.md).

## Available Scripts

### Development
- `npm start` - Start Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run device:ios` - Run on iOS device
- `npm run device:android` - Run on Android device

### Production
- `npm run build:dev` - Development build via EAS
- `npm run build:preview` - Preview build for internal testing
- `npm run build:prod` - Production build and submit to stores
- `npm run testflight` - Submit to TestFlight

### Web
- `npm run build:web` - Build for web deployment
- `npm run serve:web` - Serve web build locally

### Utilities
- `npm run clean` - Clean build artifacts and dependencies
- `npm run prebuild` - Generate native iOS/Android projects

## Technology Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Navigation**: Expo Router (file-based routing)
- **Styling**: NativeWind (TailwindCSS for React Native)
- **UI Components**: Custom component library with rn-primitives
- **State Management**: React hooks and context
- **Storage**: AsyncStorage
- **Build System**: EAS Build

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For issues and questions, please open an issue on GitHub.
