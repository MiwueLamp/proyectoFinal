import { View, Text, TouchableOpacity, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import * as React from "react";
import { BottomSheetModal, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

function CheckMark({ id, completed, toggleTodo }) {
    async function toggle() {
        const response = await fetch(`http://192.168.0.12:8080/todos/${id}`, {
            method: "PUT",
            body: JSON.stringify({
                value: !completed,
            }),
        });
        const data = await response.json();
        toggleTodo(id);
        console.log(data);
    }
    

  return (
    <Pressable
        onPress={toggle}
      style={[
        styles.CheckMark,
        { backgroundColor: completed === 0 ? "#012E40" : "#3CA6A6" },
      ]}
    ></Pressable>
  );
}

export default function Task({
  id,
  title,
  shared_with_id,
  completed,
  clearTodo,
  toggleTodo,
}) {
  const [isDeleteActive, setIsDeleteActive] = React.useState(false);

  const bottomSheetModalRef = React.useRef(null);  // Añadido
  const sharedBottomSheetRef = React.useRef(null);

  const snapPoints = ["25%", "48%", "75%"];
  const snapPointsShared = ["40%"];

  function handlepresentModal() {
    bottomSheetModalRef.current?.present();
  }
  function handlePresentShared() {
    sharedBottomSheetRef.current?.present();
  }

  async function deleteTodo() {
    const response = await fetch(`http://192.168.0.12:8080/todos/${id}`, {
      method: "DELETE",
    });
    clearTodo(id); 
    console.log(response.status);
  }

  return (
    <TouchableOpacity
      onLongPress={() => setIsDeleteActive(true)}
      onPress={() => setIsDeleteActive(false)}
      activeOpacity={0.8}
      style={[styles.container]}
    >
      <View style={styles.containerTextcheckBox}>
        <CheckMark id={id} completed={completed} toggleTodo={toggleTodo}/>
        <Text style={styles.text}>{title}</Text>
      </View>
      {shared_with_id !== null ? (
        <Feather
          onPress={handlePresentShared}
          name="user"
          size={20}
          color="green"
        />
      ) : (
        <Feather
          onPress={handlepresentModal}
          name="share"
          size={20}
          color="blue"
        />
      )}
      {isDeleteActive && (
        <Pressable onPress={deleteTodo} style={styles.deleteButton}>
          <Text style={{ color: "white", fontWeight: "bold" }}>x</Text>
        </Pressable>
      )}
      <BottomSheetModal
      ref={sharedBottomSheetRef}
      snapPoints={snapPointsShared}
      index={0}
      >
         <View style={{ flex: 1, backgroundColor: "white", borderRadius: 50, borderWidth: 4 }}>
          <Text>
            Hola por fin
          </Text>
        </View>
      </BottomSheetModal>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    display:"flex",
    flexWrap:"wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 21,
    marginBottom: 10,
    backgroundColor:"#F2E3D5"
  },
  row: {
    fontWeight: "900",
    letterSpacing: 0.5,
    fontSize: 16,
  },
  subtitle: {
    color: "#101318",
    fontSize: 14,
    fontWeight: "bold",
  },
  description: {
    color: "#56636F",
    fontSize: 13,
    fontWeight: "normal",
    width: "100%",
  },
  containerTextcheckBox: {
    display:"flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 21,
    marginBottom: 10,
  },
  CheckMark: {
    width: 20, 
    height: 20, 
    borderRadius: 5, 
    borderWidth: 2,
    borderColor: "#000",
    backgroundColor: "#FFF", 
    marginRight: 10,
      
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 5,
    borderRadius: 10,  
    alignItems: "center",  
    justifyContent: "center", 
    width: 30,  
    height: 30,  
  },
  
  text: {
    fontSize: 13,  
    fontWeight: "bold",  
    color: "#333", 
    marginLeft: 10,  
  },
});
