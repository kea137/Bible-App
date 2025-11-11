import { Redirect } from 'expo-router';

export default function HomeScreen() {
  // Redirect to welcome page as the entry point
  return <Redirect href="/welcome" />;
}
