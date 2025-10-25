import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from "../screens/p-illustration_select";


export default function Index() {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
}
