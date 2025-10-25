import { SafeAreaProvider } from 'react-native-safe-area-context';
import Page from "../../screens/p-works_list";


export default function Index() {
  return (
    <SafeAreaProvider>
      <Page />
    </SafeAreaProvider>
  );
}
