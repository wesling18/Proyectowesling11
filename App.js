import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { View, Button, StyleSheet } from "react-native"; // Importamos Button y StyleSheet

import { auth } from "./src/database/firebaseconfig";

// --- Importar TODAS las vistas ---
import Login from "./view/Login.js";
import Productos from "./view/productos.js";
import ProductosRealtime from "./view/ProductosRealtime.jsx";
import CalculadoraIMC from "./view/CalculadoraIMC.jsx";

export default function App() {
  const [usuario, setUsuario] = useState(null);
  
  // Este estado controlará qué vista mostramos DESPUÉS del login
  const [vistaActual, setVistaActual] = useState('productos');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user);
      // Si el usuario inicia sesión, lo mandamos a la vista principal 'productos'
      if (user) {
        setVistaActual('productos');
      }
    });
    return unsubscribe;
  }, []);

  const cerrarSesion = async () => {
    await signOut(auth);
  };

  // --- LÓGICA DE LOGIN (Sin cambios) ---
  if (!usuario) {
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // --- LÓGICA DE VISTAS (MODIFICADA) ---
  // Si hay usuario, mostramos el menú y la vista seleccionada
  return (
    <View style={{ flex: 1 }}>
      {/* 1. Menú de navegación en la parte superior */}
      <View style={styles.menuNavegacion}>
        <Button title="Productos" onPress={() => setVistaActual('productos')} />
        <Button title="Guía RT" onPress={() => setVistaActual('realtime')} />
        <Button title="Tarea IMC" onPress={() => setVistaActual('imc')} />
        <Button title="Salir" onPress={cerrarSesion} color="#d9534f" />
      </View>

      {/* 2. Contenedor principal que renderiza la vista actual */}
      <View style={styles.containerPrincipal}>
        {vistaActual === 'productos' && <Productos />}
        {vistaActual === 'realtime' && <ProductosRealtime />}
        {vistaActual === 'imc' && <CalculadoraIMC />}
      </View>
    </View>
  );
}

// --- ESTILOS CORREGIDOS ---
const styles = StyleSheet.create({
  containerPrincipal: {
    flex: 1,
  },
  menuNavegacion: {
    // --- Estilos del menú ---
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f9f9f9',

    // Ajustamos los paddings para la parte superior
    paddingTop: 40, // Más espacio para la barra de estado
    paddingBottom: 10
  }
});