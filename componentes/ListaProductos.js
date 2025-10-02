import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import BotonEliminarProducto from "./BotonEliminarProducto.js";

const ListaProductos = ({ productos, eliminarProducto }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de productos</Text>
      <FlatList
        data={productos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.item}>
              {item.nombre} - ${item.precio}
            </Text>
            <BotonEliminarProducto id={item.id} eliminarProducto={eliminarProducto} />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  itemContainer: { flexDirection: "row", justifyContent: "space-between", padding: 5 },
  item: { fontSize: 18, marginBottom: 5 },
});

export default ListaProductos;