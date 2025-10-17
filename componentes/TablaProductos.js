import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native"; // ¡Importa TouchableOpacity!
import BotonEliminarProducto from "./BotonEliminarProducto.js";

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
                <Text>✏️</Text>
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
    flex: 1,
    padding: 20,
    alignSelf: "stretch",
  },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  fila: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    paddingVertical: 6,
    alignItems: "center",
  },
  encabezado: {
    backgroundColor: "#f0f0f0",
  },
  celda: {
    flex: 1,
    fontSize: 16,
    textAlign: "center",
  },
  celdaAcciones: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  textoEncabezado: {
    fontWeight: "bold",
    fontSize: 17,
    textAlign: "center",
  },
  // Agregue las siguientes sentencias en los estilos del componente TablaProductos
  botonActualizar: {
    padding: 4,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    backgroundColor: "#f3f3f7"
  }
});

export default TablaProductos;