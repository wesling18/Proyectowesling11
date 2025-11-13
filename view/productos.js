import React, { useEffect, useState } from "react";
import { View, StyleSheet, Button, Alert } from "react-native";
import { db } from "../src/database/firebaseconfig.js";
import {
  collection, getDocs, doc, deleteDoc, addDoc, updateDoc,
  query, where, orderBy, limit
} from "firebase/firestore";
import FormularioProductos from "../componentes/FormularioProductos";
import TablaProductos from "../componentes/TablaProductos.js";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";
import * as Clipboard from "expo-clipboard";
import { encode as btoa } from "base-64"; 

const colecciones = ["productos", "usuarios", "edades", "ciudades"];

// Cargar datos de una colección
const cargarDatosFirebase = async (nombreColeccion) => {
  try {
    const snapshot = await getDocs(collection(db, nombreColeccion));
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error(`Error cargando datos de ${nombreColeccion}:`, error);
    return [];
  }
};

// Cargar todas las colecciones
const cargarTodasColecciones = async () => {
  const datosTotales = {};
  for (const nombre of colecciones) {
    datosTotales[nombre] = await cargarDatosFirebase(nombre);
  }
  return datosTotales;
};

// Exportar una colección individual 
const exportarColeccionIndividual = async (nombreColeccion) => {
  try {
    const datos = await cargarDatosFirebase(nombreColeccion);
    const jsonString = JSON.stringify({ [nombreColeccion]: datos }, null, 2);
    const fileUri = FileSystem.cacheDirectory + `${nombreColeccion}.txt`;

    await Clipboard.setStringAsync(jsonString);
    await FileSystem.writeAsStringAsync(fileUri, jsonString);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: `Exportar ${nombreColeccion} de Firebase`,
      });
    }
    Alert.alert("Éxito", `Datos de ${nombreColeccion} exportados correctamente.`);
  } catch (error) {
    console.error(`Error al exportar ${nombreColeccion}:`, error);
    Alert.alert("Error", `No se pudo exportar la colección de ${nombreColeccion}.`);
  }
};

// Exportar todas las colecciones (TXT)
const exportarTodasColecciones = async () => {
  try {
    const datos = await cargarTodasColecciones();
    const jsonString = JSON.stringify(datos, null, 2);
    const fileUri = FileSystem.cacheDirectory + "todas_las_colecciones.txt";

    await Clipboard.setStringAsync(jsonString);
    await FileSystem.writeAsStringAsync(fileUri, jsonString);

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: "text/plain",
        dialogTitle: "Exportar todas las colecciones",
      });
    }
    Alert.alert("Éxito", "Todas las colecciones fueron exportadas correctamente.");
  } catch (error) {
    console.error("Error al exportar todas las colecciones:", error);
    Alert.alert("Error", "No se pudieron exportar todas las colecciones.");
  }
};

// --- CÓDIGO excel

// Función 
const arrayBufferToBase64 = (buffer) => {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

// FUNCIÓN PARA PRODUCTOS
const generarExcelProductos = async (productos) => {
  try {
    if (!productos || productos.length === 0) {
      throw new Error("No hay productos en la lista para exportar.");
    }
    console.log("Productos para Excel:", productos);

    const response = await fetch(
      "https://2sonisoe31.execute-api.us-east-2.amazonaws.com/generarexcel",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ datos: productos }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error HTTP: ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const base64 = arrayBufferToBase64(arrayBuffer);
    const fileUri = FileSystem.documentDirectory + "reporte_productos.xlsx";

    await FileSystem.writeAsStringAsync(fileUri, base64, {
      encoding: FileSystem.EncodingType.Base64,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        dialogTitle: "Descargar Reporte de Productos",
      });
    } else {
      alert("Compartir no disponible.");
    }

    Alert.alert("Éxito", "Excel de productos generado y listo para descargar.");
  } catch (error) {
    console.error("Error generando Excel de Productos:", error);
    Alert.alert("Error", "Error: " + error.message);
  }
};

// --- TU COMPONENTE PRINCIPAL ---

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [productoId, setProductoId] = useState(null);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
  });

  const cargarDatos = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "productos"));
      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProductos(data);
    } catch (error) {
      console.error("Error al obtener documentos: ", error);
    }
  };

  const eliminarProducto = async (id) => {
    try {
      await deleteDoc(doc(db, "productos", id));
      cargarDatos();
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const manejoCambio = (nombre, valor) => {
    setNuevoProducto((prev) => ({
      ...prev,
      [nombre]: valor,
    }));
  };

  const guardarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await addDoc(collection(db, "productos"), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        cargarDatos();
        setNuevoProducto({ nombre: "", precio: "" });
      } else {
        alert("Por favor, complete todos los campos.");
      }
    } catch (error) {
      console.error("Error al registrar producto: ", error);
    }
  };

  const actualizarProducto = async () => {
    try {
      if (nuevoProducto.nombre && nuevoProducto.precio) {
        await updateDoc(doc(db, "productos", productoId), {
          nombre: nuevoProducto.nombre,
          precio: parseFloat(nuevoProducto.precio),
        });
        setNuevoProducto({ nombre: "", precio: "" });
        setModoEdicion(false);
        setProductoId(null);
        cargarDatos();
      } else {
        alert("Por favor, complete todos los campos");
      }
    } catch (error) {
      console.error("Error al actualizar producto: ", error);
    }
  };

  const editarProducto = (producto) => {
    setNuevoProducto({
      nombre: producto.nombre,
      precio: producto.precio.toString(),
    });
    setProductoId(producto.id);
    setModoEdicion(true);
  };

  // Prueba de consulta básica (2 ciudades más pobladas de Guatemala)
  const pruebaConsulta1 = async () => {
    try {
      const q = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const snapshot = await getDocs(q);
      snapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}, Nombre: ${data.nombre}`);
      });
    } catch (error) {
      console.error("Error en pruebaConsulta1:", error);
    }
  };

  // Consultas complejas
  const ejecutarConsultasSolicitadas = async () => {
    try {
      const q1 = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(2)
      );
      const s1 = await getDocs(q1);
      s1.forEach((d) => console.log(d.id, d.data()));

      const q2 = query(
        collection(db, "ciudades"),
        where("pais", "==", "Honduras"),
        where("poblacion", ">", 700000)
      );
      const s2 = await getDocs(q2);
      const arr2 = s2.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr2.sort((a, b) => a.nombre.localeCompare(b.nombre));
      arr2.slice(0, 3).forEach((d) => console.log(d.id, d));

      const paisesCA = [
        "Guatemala",
        "Honduras",
        "El Salvador",
        "Nicaragua",
        "Costa Rica",
        "Panama",
        "Belize",
      ];
      const q4 = query(
        collection(db, "ciudades"),
        where("poblacion", "<=", 300000),
        where("pais", "in", paisesCA)
      );
      const s4 = await getDocs(q4);
      const arr4 = s4.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr4.sort((a, b) => b.pais.localeCompare(a.pais));
      arr4.slice(0, 4).forEach((d) => console.log(d.id, d));

      const q5 = query(
        collection(db, "ciudades"),
        where("poblacion", ">", 900000)
      );
      const s5 = await getDocs(q5);
      const arr5 = s5.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr5.sort((a, b) => a.nombre.localeCompare(b.nombre));
      arr5.slice(0, 3).forEach((d) => console.log(d.id, d));

      const q6 = query(
        collection(db, "ciudades"),
        where("pais", "==", "Guatemala"),
        orderBy("poblacion", "desc"),
        limit(5)
      );
      const s6 = await getDocs(q6);
      s6.forEach((d) => console.log(d.id, d.data()));

      const q7 = query(
        collection(db, "ciudades"),
        where("poblacion", ">=", 200000),
        where("poblacion", "<=", 600000)
      );
      const s7 = await getDocs(q7);
      const arr7 = s7.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr7.sort((a, b) => a.pais.localeCompare(b.pais));
      arr7.slice(0, 5).forEach((d) => console.log(d.id, d));

      const s8 = await getDocs(collection(db, "ciudades"));
      const arr8 = s8.docs.map((d) => ({ id: d.id, ...d.data() }));
      arr8.sort((a, b) => {
        const regA = a.region || a.pais || "";
        const regB = b.region || b.pais || "";
        if (regA !== regB) return regB.localeCompare(regA);
        return (b.poblacion || 0) - (a.poblacion || 0);
      });
      arr8.slice(0, 5).forEach((d) => console.log(d.id, d));
    } catch (error) {
      console.error("Error ejecutando consultas:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
    pruebaConsulta1();
  }, []);

  useEffect(() => {
    ejecutarConsultasSolicitadas();
  }, []);

  return (
    <View style={styles.container}>
      <FormularioProductos
        nuevoProducto={nuevoProducto}
        manejoCambio={manejoCambio}
        guardarProducto={guardarProducto}
        actualizarProducto={actualizarProducto}
        modoEdicion={modoEdicion}
      />

      <View style={{ marginVertical: 5, marginTop: 15 }}>
        <Button
          title="Exportar Productos "
          onPress={() => exportarColeccionIndividual("productos")}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Button
          title="Exportar Usuarios "
          onPress={() => exportarColeccionIndividual("usuarios")}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Button
          title="Exportar Edades "
          onPress={() => exportarColeccionIndividual("edades")}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Button
          title="Exportar Ciudades "
          onPress={() => exportarColeccionIndividual("ciudades")}
        />
      </View>

      <View
        style={{
          marginVertical: 10,
          marginTop: 15,
          borderTopWidth: 1,
          borderColor: "#ccc",
          paddingTop: 10,
        }}
      >
        <Button
          title="Exportar Todas las Colecciones "
          onPress={exportarTodasColecciones}
        />
      </View>

      <View
        style={{
          marginVertical: 10,
          marginTop: 10,
          borderColor: "green",
          borderWidth: 1,
          paddingTop: 5,
        }}
      >
        <Button
          title="Generar Excel de Productos "
          onPress={() => generarExcelProductos(productos)}
          color="#28a745"
        />
      </View>

      <TablaProductos
        productos={productos}
        eliminarProducto={eliminarProducto}
        editarProducto={editarProducto}
        cargarDatos={cargarDatos}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
});

export default Productos;

