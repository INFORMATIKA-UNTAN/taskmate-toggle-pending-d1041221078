import { useEffect, useState, useCallback } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    Text,
    FlatList,
    View,
    TouchableOpacity,
    Alert
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { loadTasks, saveTasks } from '../src/storage/taskStorage';
import TaskItem from '../src/components/TaskItem'; 

export default function HomeScreen() {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState('All');

    useFocusEffect(
        useCallback(() => {
            const fetchTasks = async () => {
                const loadedTasks = await loadTasks();
                setTasks(loadedTasks);
            };
            fetchTasks();
        }, [])
    );

    
    const handleToggle = async (task) => {
        const getNextStatus = (currentStatus) => {
            if (currentStatus === 'todo') return 'pending';
            if (currentStatus === 'pending') return 'done';
            if (currentStatus === 'done') return 'pending'; 
            return 'todo'; 
        };

        const updatedTasks = tasks.map(t =>
            t.id === task.id
                ? { ...t, status: getNextStatus(t.status) }
                : t
        );
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
    };

    const handleDelete = async (taskToDelete) => {
        const updatedTasks = tasks.filter(t => t.id !== taskToDelete.id);
        setTasks(updatedTasks);
        await saveTasks(updatedTasks);
    };
    
    const confirmDelete = (task) => {
        Alert.alert(
            "Hapus Tugas",
            `Apakah Anda yakin ingin menghapus "${task.title}"?`,
            [
                { text: "Batal", style: "cancel" },
                { text: "Hapus", style: "destructive", onPress: () => handleDelete(task) }
            ]
        );
    };


    const filteredTasks = tasks.filter(task => {
        if (filter === 'All') return true;
        if (filter === 'Todo') return task.status === 'todo';
        if (filter === 'Pending') return task.status === 'pending';
        if (filter === 'Done') return task.status === 'done';
        return true;
    });
    
    const filterOptions = ['All', 'Todo', 'Pending', 'Done'];

    const categoryColors = {
        Mobile: '#3b82f6',
        RPL: '#16a34a',
        IoT: '#7c3aed',
        Default: '#64748b'
    };

    const renderTaskItem = ({ item }) => {
        const isDone = item.status === 'done';

        const getStatusBadge = (status) => {
            switch (status) {
                case 'todo':
                    return { text: 'To Do', style: styles.todoBadge };
                case 'pending':
                    return { text: 'Pending', style: styles.pendingBadge };
                case 'done':
                    return { text: 'Done', style: styles.doneBadge };
                default:
                    return { text: 'To Do', style: styles.todoBadge };
            }
        };

        const statusBadge = getStatusBadge(item.status);
        const categoryColor = categoryColors[item.category] || categoryColors.Default;

        return (
            <TouchableOpacity 
                onPress={() => handleToggle(item)}
                onLongPress={() => confirmDelete(item)}
                style={[styles.taskItem, isDone && styles.taskItemDone]}
            >
                <View>
                    <View style={styles.badgesContainer}>
                        <View style={[styles.badge, { backgroundColor: categoryColor }]}>
                            <Text style={styles.badgeText}>{item.category}</Text>
                        </View>
                        <View style={[styles.badge, statusBadge.style]}>
                            <Text style={styles.badgeText}>{statusBadge.text}</Text>
                        </View>
                    </View>

                    <Text style={[styles.taskTitle, isDone && styles.taskTitleDone]}>
                        {item.title}
                    </Text>
                    
                    {item.description && (
                        <Text style={[styles.taskDescription, isDone && styles.taskTitleDone]}>
                            {item.description}
                        </Text>
                    )}

                    {item.dueDate && (
                        <View style={styles.dueDateContainer}>
                            <Text style={styles.dueDateIcon}>🗓️</Text>
                            <Text style={[styles.dueDateText, isDone && styles.taskTitleDone]}>
                                {item.dueDate}
                            </Text>
                        </View>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>TaskMate – Daftar Tugas</Text>

            <View style={styles.filterContainer}>
                {filterOptions.map((option) => (
                    <TouchableOpacity
                        key={option}
                        style={[
                            styles.filterButton,
                            filter === option && styles.activeFilterButton
                        ]}
                        onPress={() => setFilter(option)}
                    >
                        <Text style={[
                            styles.filterText,
                            filter === option && styles.activeFilterText
                        ]}>
                            {option}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredTasks}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
                renderItem={renderTaskItem}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>Tidak ada tugas. ✨</Text>
                        <Text style={styles.emptySubText}>Silakan tambahkan tugas baru.</Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc'
    },
    header: {
        fontSize: 20,
        fontWeight: '700',
        padding: 16
    },
    filterContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    filterButton: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#e2e8f0',
    },
    activeFilterButton: {
        backgroundColor: '#3b82f6',
    },
    filterText: {
        fontWeight: '600',
        color: '#475569',
    },
    activeFilterText: {
        color: '#ffffff',
    },
    taskItem: {
        backgroundColor: '#ffffff',
        padding: 16,
        marginBottom: 12,
        borderRadius: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    taskItemDone: {
        backgroundColor: '#f1f5f9',
    },
    badgesContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    badge: {
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
        marginLeft: 6,
    },
    badgeText: {
        color: '#ffffff',
        fontSize: 10,
        fontWeight: '700',
    },
   
    todoBadge: {
        backgroundColor: '#94a3b8', 
    },
    pendingBadge: {
        backgroundColor: '#f97316', 
    },
    doneBadge: {
        backgroundColor: '#16a34a', 
    },
    taskTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1e293b',
    },
    taskTitleDone: {
        textDecorationLine: 'line-through',
        color: '#94a3b8',
    },
    taskDescription: {
        fontSize: 14,
        color: '#64748b',
        marginTop: 4,
    },
    dueDateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    dueDateIcon: {
        fontSize: 14,
    },
    dueDateText: {
        fontSize: 12,
        color: '#ef4444',
        fontWeight: '600',
        marginLeft: 6,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 80,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#475569',
    },
    emptySubText: {
        fontSize: 14,
        color: '#94a3b8',
        marginTop: 8,
    },
});