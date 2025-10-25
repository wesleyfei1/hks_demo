import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from "../screens/p-reading_view";


export default function Index() {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
}
