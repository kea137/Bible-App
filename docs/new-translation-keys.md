# New Translation Keys Added

These keys have been used in the app and should be present in all locale files (ar, de, en, es, fr, hi, it, ja, ko, ru, sw, zh).

## Keys Already in Locale Files
Most translation keys are already present in the locale files from the web app including:
- Step
- Next  
- Previous
- Saving...
- Email sent
- Loading...
- And 800+ more keys

## Potentially New Keys to Verify
The following keys are used in the mobile app and should be verified to exist in all locale files:

### Onboarding
- "Let's personalize your Bible experience"
- "Select at least one Bible translation"  
- "Customize Your Reading Experience"
- "Skip for now"
- "Complete Setup"

### Auth
- "Password reset link has been sent to your email"
- "Failed to send reset link"
- "Send Reset Link"
- "Remember your password?"

### Dashboard
- "Search verses, highlights, or bibles..."
- "Loading dashboard..."
- "Showing cached data"
- "Failed to load onboarding data. Please try again."
- "Failed to save preferences. Please try again."
- "Total Bibles"
- "Verses Today"  
- "Chapters Done"
- "Pick up where you left off"
- "Start your study Session"
- "Make Reading a Habit"
- "Set aside time each day to read and reflect on the Word"

## How to Add Missing Keys

If any keys are missing from locale files, add them using this format in each locale JSON file:

```json
{
  "Key in English": "Translation in target language"
}
```

For keys that don't have translations yet, temporarily use the English version as a placeholder until proper translations are provided.
