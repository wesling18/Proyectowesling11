import React, { useEffect, useState } from "react";
import { View, StyleSheet } from "react-native";
import { db } from "../src/database/firebaseconfig.js";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import ListaProductos from "../componentes/ListaProductos.js"; // Ajustado al nombre correcto
import FormularioProductos from "../componentes/FormularioProductos.js";
import * as Constants from "expo-constants";
import TablaProductos from "../componentes/TablaProductos.js";

const Productos = () => {
  const [Productos, setProductos] = useState([]);

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos:", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos(); // recargar lista
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <View style={styles.containers}>
      <FormularioProductos cargarDatos={cargarDatos} />
      <ListaProductos productos={Productos} eliminarProducto={eliminarProducto} />
      <TablaProductos productos={Productos} eliminarProducto={eliminarProducto} />
    </View>
  );
};

const styles = StyleSheet.create({
  containers: { flex: 1, padding: 20 },
});

export default Productos;