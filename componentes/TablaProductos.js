import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import BotonEliminarProducto from "./BotonEliminarProducto.js";
import { Feather } from '@expo/vector-icons';

// Asegúrate de recibir editarProducto
const TablaProductos = ({ productos, eliminarProducto, editarProducto }) => { 
  return (
    <View style={styles.containers}>
      <Text style={styles.titulo}>Tabla de productos</Text>
      <View style={[styles.fila, styles.encabezado]}>
        <Text style={[styles.celda, styles.textoEncabezado]}>Nombre</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Precio</Text>
        <Text style={[styles.celda, styles.textoEncabezado]}>Acciones</Text>
      </View>
      <ScrollView>
        {productos.map((item) => (
          <View key={item.id} style={styles.fila}>
            <Text style={styles.celda}>{item.nombre}</Text>
            <Text style={styles.celda}>${item.precio}</Text>
            <View style={styles.celdaAcciones}>
              {/* Codifique el botón de edición (Actualizar) */}
              <TouchableOpacity
                style={styles.botonActualizar} // Nuevo estilo
                onPress={() => editarProducto(item)} // Llama a editarProducto con el ítem completo
              >
                <Feather name="edit-2" size={18} color="white" />
              </TouchableOpacity>

              <BotonEliminarProducto
                id={item.id}
                eliminarProducto={eliminarProducto}
              />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containers: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  titulo: { fontSize: 20, fontWeight: "bold", marginBottom: 15, color: "#333" },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#eee",
    paddingVertical: 12,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f8f9fa",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingVertical: 15,
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
    color: "#555",
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 15,
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    color: "#333",
  },
  // Agregue las siguientes sentencias en los estilos del componente TablaProductos
  botonActualizar: {
    padding: 8,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#28a745", // Un verde para editar
  }
});

export default TablaProductos;