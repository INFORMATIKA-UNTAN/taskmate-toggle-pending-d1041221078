import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'TASKMATE_TASKS';

export const saveTasks = async (tasks) => {
  try {
    const jsonTasks = JSON.stringify(tasks);
    console.log("MENYIMPAN DATA:", jsonTasks); 
    await AsyncStorage.setItem(STORAGE_KEY, jsonTasks);
  } catch (error) {
    console.error('GAGAL MENYIMPAN:', error);
  }
};

export const loadTasks = async () => {
  try {
    const jsonTasks = await AsyncStorage.getItem(STORAGE_KEY);
    console.log("MEMBACA DATA:", jsonTasks); 
    return jsonTasks ? JSON.parse(jsonTasks) : [];
  } catch (error) {
    console.error('GAGAL MEMBACA:', error);
    return [];
  }
};