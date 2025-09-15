import { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    Alert,
    TouchableOpacity
} from 'react-native';
import { useRouter } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';

export default function AddTaskScreen() {
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');

    const handleAddTask = async () => {
        if (!title.trim()) {
            Alert.alert('Input Tidak Valid', 'Judul tugas wajib diisi.');
            return;
        }

        const existingTasks = await loadTasks();

        const newTask = {
            id: uuidv4(),
            title: title.trim(),
            description: description.trim(),
            category: 'Mobile',
            dueDate: '2025-09-20',
            status: 'todo',
        };

        const updatedTasks = [newTask, ...existingTasks];

        await saveTasks(updatedTasks);

        router.replace('/');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Tambah Tugas Baru ✍️</Text>

            <Text style={styles.label}>Judul Tugas</Text>
            <TextInput
                style={styles.input}
                placeholder="Contoh: Selesaikan UI/UX Design"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Deskripsi (Opsional)</Text>
            <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Contoh: Buat wireframe dan high-fidelity prototype di Figma."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
            />

            <TouchableOpacity style={styles.button} onPress={handleAddTask}>
                <Text style={styles.buttonText}>Simpan Tugas</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8fafc',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24,
        color: '#1e293b',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#475569',
    },
    input: {
        borderWidth: 1,
        borderColor: '#cbd5e1',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 20,
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    button: {
        backgroundColor: '#3b82f6',
        paddingVertical: 14,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 16,
    },
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});