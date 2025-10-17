import React, { useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, Text, Alert, ScrollView, SafeAreaView } from "react-native";
import { db } from "../src/database/firebaseconfig.js";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc } from "firebase/firestore";

import FormularioProductos from "../componentes/FormularioProductos.js";
import TablaProductos from "../componentes/TablaProductos.js";
import { MaterialCommunityIcons } from '@expo/vector-icons';

// El componente Productos debe recibir cerrarSesion por parámetro
const Productos = ({ cerrarSesion }) => { // Recibe cerrarSesion [cite: 46]
  const [productos, setProductos] = useState([]);
  const [nuevoProducto, setNuevoProducto] = useState({ nombre: "", precio: "" });
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);

  // Cargar productos desde Firestore al iniciar
  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "productos"));
        const productosData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProductos(productosData);
      } catch (error) {
        console.error("Error al cargar productos: ", error);
        Alert.alert("Error", "No se pudieron cargar los productos.");
      }
    };
    cargarDatos();
  }, []);

  // Maneja cambios en los inputs del formulario
  const manejoCambio = (name, value) => {
    setNuevoProducto({ ...nuevoProducto, [name]: value });
  };

  // Guarda un nuevo producto
  const guardarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    try {
      const docRef = await addDoc(collection(db, "productos"), nuevoProducto);
      setProductos([...productos, { id: docRef.id, ...nuevoProducto }]);
      setNuevoProducto({ nombre: "", precio: "" }); // Limpiar formulario
    } catch (error) {
      console.error("Error al guardar producto: ", error);
    }
  };

  // Elimina un producto
  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      setProductos(productos.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error al eliminar producto: ", error);
    }
  };

  // Prepara el formulario para editar un producto
  const editarProducto = (producto) => {
    setModoEdicion(true);
    setProductoId(producto.id);
    setNuevoProducto({ nombre: producto.nombre, precio: producto.precio });
  };

  // Actualiza un producto existente
  const actualizarProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }
    try {
      const productoDoc = doc(db, "productos", productoId);
      await updateDoc(productoDoc, nuevoProducto);
      setProductos(
        productos.map((p) => (p.id === productoId ? { id: productoId, ...nuevoProducto } : p))
      );
      setModoEdicion(false);
      setProductoId(null);
      setNuevoProducto({ nombre: "", precio: "" });
    } catch (error) {
      console.error("Error al actualizar producto: ", error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Gestión de Productos</Text>
          <TouchableOpacity style={styles.botonCerrarSesion} onPress={cerrarSesion}>
            <MaterialCommunityIcons name="logout" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <FormularioProductos
          nuevoProducto={nuevoProducto}
          manejoCambio={manejoCambio}
          guardarProducto={guardarProducto}
          actualizarProducto={actualizarProducto}
          modoEdicion={modoEdicion}
        />
        <TablaProductos productos={productos} eliminarProducto={eliminarProducto} editarProducto={editarProducto} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  safeArea: {
    flex: 1,
    backgroundColor: "#f4f6f9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  botonCerrarSesion: {
    backgroundColor: "#3b5998", // Mismo color que el login para consistencia
    padding: 8,
    borderRadius: 8,
    elevation: 3,
  },
});

export default Productos;