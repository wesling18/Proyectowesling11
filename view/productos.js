import React, { useEffect, useState } from "react";
import { View, StyleSheet, Alert } from "react-native"; // Importar Alert para las validaciones
import { db } from "../src/database/firebaseconfig.js";
// Asegúrate de importar addDoc y updateDoc
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from "firebase/firestore"; // 
import ListaProductos from "../componentes/ListaProductos.js"; 
import FormularioProductos from "../componentes/FormularioProductos.js";
import * as Constants from "expo-constants";
import TablaProductos from "../componentes/TablaProductos.js";

const Productos = () => {
  const [Productos, setProductos] = useState([]);
  
  // 1. Cree la variable de estado para el nuevo producto [cite: 11]
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
  });

  // 2. Cree variables de estado para el modo de edición [cite: 18]
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);

  // 3. Cree el método para el manejo de cambio de estado de valor [cite: 12]
  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  // 4. Cree el método para guardar un producto [cite: 13]
  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });

        cargarDatos(); // Recargar lista
        setNuevoProducto({ nombre: "", precio: "" }); // Resetea el objeto
      } else {
        Alert.alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto:", error);
    }
  };

  // 5. Codifique el método para actualizar el producto [cite: 19]
  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await updateDoc(doc(db, "productos", productoId), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });

        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false); // Volver al modo registro
        setProductoId(null);
        
        cargarDatos(); // Recargar lista
      } else {
        Alert.alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };
  
  // 6. Codifique el método editarProducto [cite: 20]
  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(), // Convierte a string para el TextInput
    });
    setProductoId(producto.id);
    setModoEdicion(true); // Cambia a modo edición
  };

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
      {/* Asegúrate de pasar las tres nuevas propiedades y las de edición al FormularioProductos [cite: 14, 22] */}
      <FormularioProductos 
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto} // Propiedad de actualización
        modoEdicion={modoEdicion} // Propiedad del modo de edición
      />
      
      <ListaProductos productos={Productos} eliminarProducto={eliminarProducto} />
      
      {/* También debe pasarle el método editarProducto al componente TablaProductos [cite: 22] */}
      <TablaProductos 
        productos={Productos} 
        eliminarProducto={eliminarProducto} 
        editarProducto={editarProducto} // Propiedad para iniciar la edición
      />
    </View>
  );
};

const styles = StyleSheet.create({
  containers: { flex: 1, padding: 20 },
});

export default Productos;