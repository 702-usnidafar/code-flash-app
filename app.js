import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SplashScreen from './screen/SplashScreen';
import Dashboard from './screen/Dashboard';
import CreateCourseScreen from './screen/CreateCourseScreen';
import CourseDetailScreen from './screen/CourseDetailScreen';
import AddFlashcardScreen from './screen/AddFlashcardScreen';
import LibraryScreen from './screen/LibraryScreen';
import LibraryCourseDetailScreen from './screen/LibraryCourseDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen
          name="CreateCourse"
          component={CreateCourseScreen}
          options={{ title: 'Buat Course' }}
        />
        <Stack.Screen
          name="CourseDetail"
          component={CourseDetailScreen}
          options={({ route }) => ({ title: route.params.courseName })}
        />
        <Stack.Screen
          name="AddFlashcard"
          component={AddFlashcardScreen}
          options={{ title: 'Tambah Flashcard' }}
        />
        <Stack.Screen
          name="Library"
          component={LibraryScreen}
          options={{ title: 'Perpustakaan' }}
        />
        <Stack.Screen
          name="LibraryCourseDetail"
          component={LibraryCourseDetailScreen}
          options={{ title: 'Flashcard Course' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
