import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from "../screens/p-account_settings";


export default function Index() {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
}
