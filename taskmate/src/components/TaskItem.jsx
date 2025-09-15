import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';


export default function TaskItem({ task, onToggle, onConfirmDelete }) {
    const isDone = task.status === 'done';

    return (

        <TouchableOpacity
            onPress={() => onToggle?.(task)}
            onLongPress={() => onConfirmDelete?.(task)}
            style={[styles.card, isDone && styles.cardDone]}
        >
            <View style={{ flex: 1 }}>
                <Text style={[styles.title, isDone && styles.strike]}>
                    {task.title}
                </Text>

                {!!task.description && (
                    <Text style={[styles.desc, isDone && styles.strike]}>
                        {task.description}
                    </Text>
                )}

                <View style={styles.metaContainer}>
                    <Text style={styles.meta}>
                        Kategori: {task.category ?? 'Umum'}
                    </Text>


                    {task.dueDate && (
                        <Text style={[styles.meta, styles.dueDate]}>
                            🗓️ {task.dueDate}
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#fff',
        marginBottom: 12,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 5,
        shadowOffset: { width: 0, height: 2 },
    },
    cardDone: {
        backgroundColor: '#f8fafc'
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
        color: '#0f172a'
    },
    strike: {
        textDecorationLine: 'line-through',
        color: '#94a3b8'
    },
    desc: {
        color: '#475569',
        marginBottom: 8, 
        fontSize: 14,
        lineHeight: 20,
    },
    metaContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 8,
    },
    meta: {
        fontSize: 12,
        color: '#64748b',
    },
    dueDate: {
        color: '#ef4444', 
        fontWeight: '500',
    },
});