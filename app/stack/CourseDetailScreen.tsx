import { Entypo, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Flashcard = {
  front: string;
  back: string;
};

export default function CourseDetailScreen() {
  const { courseName: initialCourseName, singleFlashcard } = useLocalSearchParams<{
    courseName: string;
    singleFlashcard?: string;
  }>();
  const [courseName, setCourseName] = useState(initialCourseName);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [editCourseModalVisible, setEditCourseModalVisible] = useState(false);
  const [newCourseName, setNewCourseName] = useState(courseName);

  const router = useRouter();

  const isSingleMode = !!singleFlashcard;

  useEffect(() => {
    const loadFlashcards = async () => {
      if (isSingleMode && singleFlashcard) {
        setFlashcards([JSON.parse(singleFlashcard)]);
      } else {
        try {
          const data = await AsyncStorage.getItem(`flashcards_${courseName}`);
          if (data) {
            setFlashcards(JSON.parse(data));
          } else {
            setFlashcards([]);
          }
        } catch (e) {
          console.error('Gagal mengambil flashcards:', e);
        }
      }
    };

    loadFlashcards();
  }, [courseName, singleFlashcard]);

  const saveFlashcards = async (newData: Flashcard[]) => {
    setFlashcards(newData);
    await AsyncStorage.setItem(`flashcards_${courseName}`, JSON.stringify(newData));
  };

  // Fungsi untuk mengganti nama course
  const handleRenameCourse = async () => {
    if (!newCourseName.trim()) {
      Alert.alert('Nama course tidak boleh kosong');
      return;
    }
    if (newCourseName === courseName) {
      setEditCourseModalVisible(false);
      return; // tidak ada perubahan
    }

    try {
      // Ambil flashcards lama
      const oldData = await AsyncStorage.getItem(`flashcards_${courseName}`);
      // Simpan flashcards ke key baru
      if (oldData) {
        await AsyncStorage.setItem(`flashcards_${newCourseName}`, oldData);
      }
      // Hapus key lama
      await AsyncStorage.removeItem(`flashcards_${courseName}`);

      // Update state dan close modal
      setCourseName(newCourseName);
      setEditCourseModalVisible(false);

      // Redirect ke halaman baru dengan nama course baru supaya URL juga berubah
      router.replace({
        pathname: '/stack/CourseDetailScreen',
        params: { courseName: newCourseName },
      });
    } catch (e) {
      console.error('Gagal rename course:', e);
      Alert.alert('Gagal mengganti nama course. Coba lagi.');
    }
  };

  const handleAddFlashcard = () => {
    router.push({
      pathname: '/stack/AddFlashScreen',
      params: { courseName },
    });
  };

  const handleStartStudy = () => {
    if (flashcards.length === 0) {
      alert('Belum ada flashcard untuk dipelajari!');
      return;
    }
    router.push({
      pathname: '/stack/StudyModeScreen',
      params: { courseName },
    });
  };

  const handleEdit = () => {
    if (selectedIndex === null) return;
    const card = flashcards[selectedIndex];
    setModalVisible(false);
    router.push({
      pathname: '/stack/EditFlashScreen',
      params: {
        courseName,
        index: selectedIndex.toString(),
        front: card.front,
        back: card.back,
      },
    });
  };

  const handleDelete = () => {
    if (selectedIndex === null) return;
    Alert.alert('Konfirmasi', 'Yakin ingin menghapus flashcard ini?', [
      { text: 'Batal' },
      {
        text: 'Hapus',
        style: 'destructive',
        onPress: async () => {
          const updated = flashcards.filter((_, i) => i !== selectedIndex);
          await saveFlashcards(updated);
          setModalVisible(false);
        },
      },
    ]);
  };

  const renderCard = ({ item, index }: { item: Flashcard; index: number }) => {
    const isFlipped = flippedIndex === index;

    return (
      <View style={styles.cardWrapper}>
        <TouchableOpacity
          style={styles.card}
          onPress={() =>
            setFlippedIndex((prev) => (prev === index ? null : index))
          }
        >
          <Text style={styles.cardText}>
            {isFlipped ? item.back : item.front}
          </Text>
        </TouchableOpacity>
        {!isSingleMode && (
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => {
              setSelectedIndex(index);
              setModalVisible(true);
            }}
          >
            <Entypo name="dots-three-vertical" size={16} color="#444" />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Bar dengan judul dan tombol edit nama course */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>{courseName}</Text>
        {!isSingleMode && (
          <TouchableOpacity
            style={styles.editCourseButton}
            onPress={() => {
              setNewCourseName(courseName);
              setEditCourseModalVisible(true);
            }}
          >
            <Entypo name="edit" size={22} color="#95093F" />
          </TouchableOpacity>
        )}
      </View>

      {!isSingleMode && (
        <>
          <TouchableOpacity style={styles.button} onPress={handleAddFlashcard}>
            <Text style={styles.buttonText}>Tambah Flashcard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.studyButton]}
            onPress={handleStartStudy}
          >
            <Text style={styles.buttonText}>Mulai Belajar</Text>
          </TouchableOpacity>
        </>
      )}

      {flashcards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons
            name="book-outline"
            size={64}
            color="#ccc"
            style={{ marginBottom: 12 }}
          />
          <Text style={styles.noCardText}>Belum ada flashcard untuk course ini.</Text>
          <Text style={styles.noCardSubtext}>Yuk tambahkan satu sekarang!</Text>
        </View>
      ) : (
        <FlatList
          data={flashcards}
          renderItem={renderCard}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          numColumns={2}
        />
      )}

      {!isSingleMode && (
        <Modal
          transparent
          animationType="fade"
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
            <View style={styles.modalContainer}>
              <TouchableOpacity onPress={handleEdit}>
                <Text style={styles.modalOption}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete}>
                <Text style={[styles.modalOption, { color: 'red' }]}>🗑️ Hapus</Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Modal>
      )}

      {/* Modal edit nama course */}
      <Modal
        transparent
        animationType="fade"
        visible={editCourseModalVisible}
        onRequestClose={() => setEditCourseModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setEditCourseModalVisible(false)}
        >
          <View style={styles.editCourseModalContainer}>
            <Text style={styles.modalTitle}>Edit Nama Course</Text>
            <TextInput
              style={styles.input}
              value={newCourseName}
              onChangeText={setNewCourseName}
              autoFocus
              placeholder="Masukkan nama course baru"
            />
            <View style={styles.editCourseButtonRow}>
              <TouchableOpacity
                style={[styles.button, { flex: 1, marginRight: 8 }]}
                onPress={handleRenameCourse}
              >
                <Text style={styles.buttonText}>Simpan</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton, { flex: 1 }]}
                onPress={() => setEditCourseModalVisible(false)}
              >
                <Text style={[styles.buttonText, { color: '#95093F' }]}>Batal</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#95093F',
    flex: 1,
  },
  editCourseButton: {
    padding: 6,
  },
  button: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#FDEDED',
  },
  studyButton: {
    backgroundColor: '#3B82F6',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cardWrapper: {
    flex: 1,
    margin: 6,
    position: 'relative',
  },
  card: {
    backgroundColor: '#FEEDFA',
    borderRadius: 12,
    padding: 20,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
  },
  cardText: {
    fontSize: 16,
    color: '#95093F',
    textAlign: 'center',
  },
  menuButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    padding: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  noCardText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#777',
    textAlign: 'center',
  },
  noCardSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 24,
    width: 200,
    elevation: 5,
  },
  modalOption: {
    fontSize: 16,
    paddingVertical: 10,
    fontWeight: '500',
  },
  editCourseModalContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    width: '85%',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#95093F',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#95093F',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    fontSize: 16,
    color: '#333',
  },
  editCourseButtonRow: {
    flexDirection: 'row',
  },
});
