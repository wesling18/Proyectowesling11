import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from "react-native";
// Eliminadas: importaciones de firebaseconfig, collection, addDoc

// Asegurarse que el componente reciba estos 5 parámetros [cite: 7, 23]
const FormularioProductos = ({ 
  nuevoProducto, 
  manejoCambio, 
  guardarProducto, 
  actualizarProducto, 
  modoEdicion 
}) => {
  // Eliminadas: variables de estado y método GuardarProducto [cite: 6]
  
  return (
    <View style={styles.container}>
      {/* Modificación del título del formulario con validación según modoEdicion [cite: 24] */}
      <Text style={styles.titulo}>
        {modoEdicion ? "Actualizar Producto" : "Registro de Producto"}
      </Text>
      
      {/* Modificación de TextInput para Nombre: emplea nuevoProducto y manejoCambio [cite: 8, 9] */}
      <TextInput
        style={styles.input}
        placeholder="Nombre del producto"
        value={nuevoProducto.nombre}
        onChangeText={(nombre) => manejoCambio("nombre", nombre)}
      />
      
      {/* Modificación de TextInput para Precio: emplea nuevoProducto y manejoCambio [cite: 8, 9] */}
      <TextInput
        style={styles.input}
        placeholder="Precio"
        value={nuevoProducto.precio}
        onChangeText={(precio) => manejoCambio("precio", precio)}
        keyboardType="numeric"
      />
      
      {/* Actualización del texto del botón y método según modoEdicion [cite: 25] */}
      <TouchableOpacity
        style={styles.boton}
        onPress={modoEdicion ? actualizarProducto : guardarProducto}
      >
        <Text style={styles.textoBoton}>
          {modoEdicion ? "Actualizar Producto" : "Guardar Producto"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  input: {
    backgroundColor: "#f4f6f9",
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  boton: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  textoBoton: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default FormularioProductos;