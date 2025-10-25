import { Tabs } from "expo-router";
import { FontAwesome6 } from '@expo/vector-icons';


export default function Layout() {
  return (
    <Tabs 
      backBehavior="order"
      screenOptions={{ 
          tabBarActiveTintColor: "#6366f1",
          tabBarInactiveTintColor: "#6b7280",
          tabBarStyle: {
            backgroundColor: "#ffffff"
          }
      }}>

        <Tabs.Screen
            name="index"
            options={{href: null}}
        />

        <Tabs.Screen name="p-works_list" options={{
            title: '作品', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="folder" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-new_work" options={{
            title: '创造', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="wand-magic-sparkles" size={20} color={color} />
            )
        }}/>

        <Tabs.Screen name="p-settings" options={{
            title: '设置', 
            headerShown: false,
            tabBarIcon: ({ color }) => (
                <FontAwesome6 name="gear" size={20} color={color} />
            )
        }}/>
    </Tabs>
  );
}