import React from "react";
import { View, TextInput, Button, StyleSheet, Text } from "react-native";
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
      <Button 
        title={modoEdicion ? "Actualizar" : "Guardar"}
        onPress={modoEdicion ? actualizarProducto : guardarProducto} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 10 },
});

export default FormularioProductos;