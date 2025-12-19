import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  Pressable,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function LibraryScreen() {
  const [courses, setCourses] = useState<string[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [courseNameInput, setCourseNameInput] = useState('');
  const router = useRouter();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const courseKeys = keys.filter((key) => key.startsWith('flashcards_'));
      const courseNames = courseKeys.map((key) => key.replace('flashcards_', ''));
      setCourses(courseNames);
    } catch (e) {
      console.error('Gagal load courses:', e);
    }
  };

  const saveCourse = async (name: string) => {
    if (!name.trim()) {
      Alert.alert('Nama course tidak boleh kosong.');
      return false;
    }
    if (courses.includes(name)) {
      Alert.alert('Nama course sudah ada.');
      return false;
    }
    try {
      await AsyncStorage.setItem(`flashcards_${name}`, JSON.stringify([]));
      setCourses((prev) => [...prev, name]);
      return true;
    } catch (e) {
      console.error('Gagal menyimpan course:', e);
      Alert.alert('Terjadi kesalahan saat menyimpan course.');
      return false;
    }
  };

  const handleAddCourse = async () => {
    if (await saveCourse(courseNameInput)) {
      setCourseNameInput('');
      setModalVisible(false);
    }
  };

  const handleDeleteCourse = (name: string) => {
    Alert.alert(
      'Konfirmasi',
      `Yakin ingin menghapus course "${name}"? Semua flashcard di dalamnya juga akan dihapus.`,
      [
        { text: 'Batal' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem(`flashcards_${name}`);
              setCourses((prev) => prev.filter((c) => c !== name));
              setModalVisible(false);
            } catch (e) {
              console.error('Gagal hapus course:', e);
              Alert.alert('Gagal menghapus course.');
            }
          },
        },
      ]
    );
  };

  const openCourseOptions = (name: string) => {
    setSelectedCourse(name);
    setEditMode(false);
    setCourseNameInput(name);
    setModalVisible(true);
  };

  const handleRenameCourse = async () => {
    if (!selectedCourse) return;
    if (!courseNameInput.trim()) {
      Alert.alert('Nama course tidak boleh kosong.');
      return;
    }
    if (courseNameInput === selectedCourse) {
      Alert.alert('Nama course belum diubah.');
      return;
    }
    if (courses.includes(courseNameInput)) {
      Alert.alert('Nama course sudah digunakan.');
      return;
    }
    try {
      const oldData = await AsyncStorage.getItem(`flashcards_${selectedCourse}`);
      await AsyncStorage.setItem(`flashcards_${courseNameInput}`, oldData || '[]');
      await AsyncStorage.removeItem(`flashcards_${selectedCourse}`);
      setCourses((prev) =>
        prev.map((c) => (c === selectedCourse ? courseNameInput : c))
      );
      setSelectedCourse(null);
      setCourseNameInput('');
      setModalVisible(false);
    } catch (e) {
      console.error('Gagal mengganti nama course:', e);
      Alert.alert('Terjadi kesalahan saat mengganti nama course.');
    }
  };

  const renderCourse = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={styles.courseCard}
      onPress={() => router.push({ pathname: '/stack/CourseDetailScreen', params: { courseName: item } })}
      onLongPress={() => openCourseOptions(item)}
    >
      <Text style={styles.courseName}>{item}</Text>
      <Ionicons name="chevron-forward" size={20} color="#95093F" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Courses</Text>
      <FlatList
        data={courses}
        renderItem={renderCourse}
        keyExtractor={(item) => item}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Belum ada course.</Text>
          </View>
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 80 }}
      />

      <TouchableOpacity
        style={styles.fab}
        onPress={() => {
          setEditMode(false);
          setCourseNameInput('');
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>

      <Modal
        transparent
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedCourse && !editMode
                ? `Course: ${selectedCourse}`
                : editMode
                ? 'Ubah Nama Course'
                : 'Tambah Course Baru'}
            </Text>

            {(selectedCourse && !editMode) && (
              <>
                <TouchableOpacity style={styles.modalButton} onPress={() => setEditMode(true)}>
                  <Text style={styles.modalButtonText}>✏️ Ubah Nama</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#f87171' }]}
                  onPress={() => handleDeleteCourse(selectedCourse)}
                >
                  <Text style={[styles.modalButtonText, { color: 'white' }]}>🗑️ Hapus Course</Text>
                </TouchableOpacity>
              </>
            )}

            {(editMode || !selectedCourse) && (
              <>
                <TextInput
                  style={styles.input}
                  placeholder="Nama course"
                  value={courseNameInput}
                  onChangeText={setCourseNameInput}
                />
                <TouchableOpacity
                  style={[styles.modalButton, { backgroundColor: '#10B981' }]}
                  onPress={selectedCourse ? handleRenameCourse : handleAddCourse}
                >
                  <Text style={[styles.modalButtonText, { color: 'white' }]}>
                    Simpan
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#95093F',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  courseCard: {
    backgroundColor: '#FEEDFA',
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  courseName: {
    fontSize: 18,
    color: '#95093F',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 40,
  },
  emptyText: {
    fontSize: 16,
    color: '#888',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    backgroundColor: '#10B981',
    padding: 16,
    borderRadius: 50,
    elevation: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 320,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#95093F',
  },
  modalButton: {
    paddingVertical: 12,
    marginBottom: 12,
    backgroundColor: '#ddd',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 16,
  },
});
