import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from "../screens/p-work_edit";


export default function Index() {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
}
