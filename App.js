import React , {useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { db } from "./src/database/firebaseconfig";
import { collection, getDocs } from "firebase/firestore";

export default function App() {
  const [Producto, setProductos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Producto"));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Preparación para subcolecciones (se ejecutará solo si existen)
        const productosConSubcoleccion = await Promise.all(data.map(async (item) => {
          const subcoleccionSnapshot = await getDocs(collection(db, "Producto", item.id, "Sabores")).catch(() => []);
          const subcoleccionData = subcoleccionSnapshot.docs.map(subDoc => ({
            id: subDoc.id,
            ...subDoc.data(),
            parentId: item.id,
          }));
          return subcoleccionData.length > 0 ? { ...item, Sabores: subcoleccionData } : item;
        }));

        setProductos(productosConSubcoleccion);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Lista de Productos</Text>
      <FlatList
        data={Producto}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View>
            <Text style={styles.item}>
              {item.nombre} - ${item.precio}
            </Text>
            {item.Sabores && item.Sabores.length > 0 && (
              <FlatList
                data={item.Sabores}
                keyExtractor={(subItem) => subItem.id}
                renderItem={({ item: subItem }) => (
                  <Text style={[styles.item, { marginLeft: 20 }]}>
                    Sabor: {subItem.sabores }
                  </Text>
                )}
              />
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 10 },
  item: { fontSize: 18, marginBottom: 5 },
});
