import React, { useEffect, useState } from "react"; // Importar hooks de estado y efecto [cite: 45]
import { onAuthStateChanged, signOut } from "firebase/auth"; // Importar métodos de autenticación [cite: 45]
import { View } from "react-native"; // Importar View para el contenedor [cite: 45]

// Importar el objeto de autenticación de Firebase (ajusta la ruta si es necesario// App.js
// ...
import { auth } from "./src/database/firebaseconfig"; // Entra directamente a 'src' 

// Importar vistas
import Login from "./view/Login.js"; // Se asume esta ruta para Login.js
import Productos from "./view/productos.js"; // Ruta de Productos

export default function App() {
  const [usuario, setUsuario] = useState(null); // Estado para almacenar el usuario autenticado [cite: 45]

  useEffect(() => {
    // Escucha los cambios en la autenticación (login/logout) [cite: 45]
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUsuario(user); // [cite: 45]
    });
    return unsubscribe; // Retorna la función para desuscribirse [cite: 45]
  }, []); // El array de dependencia vacío asegura que se ejecute una sola vez

  // Función para cerrar sesión
  const cerrarSesion = async () => {
    await signOut(auth);
  };

  if (!usuario) {
    // Si no hay usuario autenticado, mostrar login [cite: 45]
    // Se pasa onLoginSuccess para actualizar el estado 'usuario' tras un login exitoso.
    return <Login onLoginSuccess={() => setUsuario(auth.currentUser)} />;
  }

  // Si sí hay usuario autenticado, mostrar productos
  return (
    <View style={{ flex: 1 }}>
      {/* Pasar el método cerrarSesion a la vista Productos [cite: 45] */}
      <Productos cerrarSesion={cerrarSesion} />
    </View>
  );
}