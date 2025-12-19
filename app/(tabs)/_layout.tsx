import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#95093F',
      }}
    >
      {/* Ini untuk Home (index.tsx di folder (tabs)) */}
      <Tabs.Screen
        name="Home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Ini untuk LibraryScreen.tsx di folder (tabs) */}
      <Tabs.Screen
        name="Library"
        options={{
          title: 'Library',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="library-outline" size={size} color={color} />
          ),
        }}
      />
      {/* Ini untuk ProfileScreen.tsx di folder (tabs) */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      {/* Screen lain, tidak muncul di tab */}
      <Tabs.Screen name="screen/CreateCourseScreen" options={{ href: null }} />
      <Tabs.Screen name="screen/AddFlashScreen" options={{ href: null }} />
      <Tabs.Screen name="screen/CourseDetailScreen" options={{ href: null }} />
      <Tabs.Screen name="screen/SelectCourseScreen" options={{ href: null }} />
      <Tabs.Screen name="screen/CourseListScreen" options={{ href: null }} />
      <Tabs.Screen name="screen/LibraryCourseDetail" options={{ href: null }} />
      <Tabs.Screen name="screen/EditCourseScreen" options={{ href: null }} />
      <Tabs.Screen name="screen/EditFlashScreen" options={{ href: null }} />
      <Tabs.Screen name="screen/StudyModeScreen" options={{ href: null }} />
    </Tabs>
  );
}
