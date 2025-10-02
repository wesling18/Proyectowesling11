import React, { useState } from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
import { db } from "../src/database/firebaseconfig.js";
import { collection, addDoc } from "firebase/firestore";

const FormularioProductos = ({ cargarDatos }) => {
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");

  const guardarProducto = async () => {
    if (nombre && precio) {
      try {
        await addDoc(collection(db, "productos"), {
          nombre: nombre,
          precio: parseFloat(precio),
        });
        setNombre("");
        setPrecio("");
        cargarDatos(); // Volver a cargar la lista
      } catch (error) {
        console.log("Error al registrar producto:", error);
      }
    } else {
      alert("Por favor, complete todos los datos");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registro de Productos</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nombre}
        onChangeText={setNombre}
      />
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={precio}
        onChangeText={setPrecio}
        keyboardType="numeric"
      />
      <Button title="Guardar" onPress={guardarProducto} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioProductos;