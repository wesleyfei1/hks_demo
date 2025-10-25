import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from "../screens/p-notification_settings";


export default function Index() {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
}
