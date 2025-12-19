import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, SafeAreaView, Switch } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Profile() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [editing, setEditing] = useState(false);
  const [isOffline, setIsOffline] = useState(false); // State untuk toggle course offline

  useEffect(() => {
    const loadUserData = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      const storedOffline = await AsyncStorage.getItem('courseOffline');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        setEmail(user.email);
        setPassword(user.password);
      } else {
        router.replace('/stack/LoginScreen');
      }
      if (storedOffline !== null) {
        setIsOffline(storedOffline === 'true');
      }
    };
    loadUserData();
  }, []);

  const handleSave = async () => {
    if (email && password) {
      await AsyncStorage.setItem('user', JSON.stringify({ email, password }));
      await AsyncStorage.setItem('courseOffline', isOffline.toString());
      setEditing(false);
      Alert.alert('Success', 'Profile updated!');
    } else {
      Alert.alert('Error', 'Please fill all fields.');
    }
  };

  const handleLogout = async () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout', style: 'destructive', onPress: async () => {
            await AsyncStorage.removeItem('user');
            router.replace('/stack/LoginScreen');
          }
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Email</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          ) : (
            <Text style={styles.cardValue}>{email}</Text>
          )}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Password</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          ) : (
            <Text style={styles.cardValue}>{'*'.repeat(password.length)}</Text>
          )}
        </View>

        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.cardTitle}>Course Offline</Text>
            <Switch
              value={isOffline}
              onValueChange={setIsOffline}
              style={styles.switch}
            />
          </View>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => (editing ? handleSave() : setEditing(true))}
        >
          <Text style={styles.buttonText}>{editing ? 'Save Changes' : 'Edit Profile'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#EF4444', marginTop: 10 }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#95093F', marginBottom: 16 },
  card: { backgroundColor: '#95093F', borderRadius: 15, padding: 20, marginBottom: 16, width: '100%' },
  cardTitle: { color: 'white', fontSize: 16 },
  cardValue: { color: 'white', fontSize: 20, fontWeight: 'bold', marginTop: 8 },
  input: { backgroundColor: 'white', borderRadius: 8, padding: 10, marginTop: 8 },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  switch: { transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }] }, // Memperkecil ukuran Switch
  button: { backgroundColor: '#10B981', paddingVertical: 14, borderRadius: 10, alignItems: 'center', width: '100%' },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});
