# Bible Word

A modern, cross-platform Bible reading application built with React Native and Expo.

## Features

- 📖 Multiple Bible translations
- 🔍 Advanced scripture search
- 📝 Personal notes and highlights
- 📅 Reading plans
- 🎓 Bible lessons and study materials
- 🌍 Multi-language support (12+ languages)
- 🌓 Dark/Light theme
- 📱 Cross-platform (iOS, Android, Web)
- 🔄 Parallel Bible reading
- 📊 Reading progress tracking

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Expo CLI (`npm install -g expo-cli`)
- For mobile development:
  - iOS: Xcode (macOS only)
  - Android: Android Studio

### Installation

1. Clone the repository:
```bash
git clone https://github.com/kea137/Bible-App.git
cd Bible-App
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure your API URL:
```
EXPO_PUBLIC_API_URL=https://your-api-url.com
```

**Important**: In production, always use HTTPS URLs for security.

### Development

Start the development server:
```bash
npm start
```

Run on specific platforms:
```bash
npm run ios          # iOS simulator
npm run android      # Android emulator
npm run web          # Web browser
```

Run on physical devices:
```bash
npm run device:ios       # iOS device
npm run device:android   # Android device
```

### Building for Production

Build for iOS:
```bash
npm run build:prod
```

Build for Android:
```bash
npm run build:prod
```

Build for Web:
```bash
npm run build:web
```

## Project Structure

```
Bible-App/
├── app/              # App screens and navigation
├── components/       # Reusable UI components
├── src/
│   └── lib/         # Core libraries and utilities
│       ├── api/     # API client and configuration
│       ├── services/ # Business logic services
│       ├── storage/ # Local storage utilities
│       └── utils/   # Utility functions
├── locales/         # Translation files
├── assets/          # Images, fonts, and other assets
└── hooks/           # Custom React hooks
```

## Configuration

### Environment Variables

- `EXPO_PUBLIC_API_URL` - Backend API URL (required in production)
- `EXPO_PUBLIC_API_URL_IOS` - iOS-specific API URL (optional)

### Security

This app implements several security best practices:

- HTTPS-only in production (HTTP blocked except for localhost in development)
- Secure token storage using AsyncStorage
- No sensitive data logged in production
- Environment variable validation
- CSRF protection for web platform

For more information, see [SECURITY.md](SECURITY.md).

## Contributing

We welcome contributions! Please feel free to submit a Pull Request.

### Development Guidelines

1. Follow the existing code style
2. Write meaningful commit messages
3. Add tests for new features
4. Update documentation as needed

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, please open an issue in the GitHub repository.

## Acknowledgments

- Built with [Expo](https://expo.dev)
- UI components from [RN Primitives](https://rn-primitives.com)
- Styled with [NativeWind](https://nativewind.dev)
