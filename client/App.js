import { StatusBar } from 'expo-status-bar';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from "react"; 
import Task from './components/Task';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import 'react-native-gesture-handler';

// ... importaciones

export default function App() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const response = await fetch("http://192.168.0.12:8080/todos/1");

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      setTodos(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  }

  function clearTodo(id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  function toggleTodo(id) {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, completed: todo.completed === 1 ? 0 : 1 }
          : todo
      )
    );
  }

  return (
    <BottomSheetModalProvider>
    <View style={styles.container}>
      <SafeAreaView>
        <FlatList
          data={todos}
          keyExtractor={(todo) => String(todo.id)}  // Utiliza String() para asegurar que sea una cadena
          renderItem={({ item }) => <Task {...item} toggleTodo={toggleTodo} clearTodo={clearTodo} />}
          ListHeaderComponent={() => <Text style={styles.title}>Today</Text>}
          contentContainerStyle={styles.contentContainerStyle}
        />
      </SafeAreaView>
      <StatusBar style="auto" />
    </View>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2E3D5',
  },
  contentContainerStyle: {
    padding: 15,
    backgroundColor: '#E8007F',
  },
  title: {
    fontWeight: '800',
    fontSize: 28,
    marginBottom: 15,
    color: '#fff',
  },
});
