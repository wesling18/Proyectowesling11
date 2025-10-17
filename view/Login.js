import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth"; // Importación requerida [cite: 42]
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';
// Login.js
import { auth } from "../src/database/firebaseconfig"; // Ruta corregida
// ...

const Login = ({ onLoginSuccess }) => { // Recibe onLoginSuccess [cite: 42]
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const manejarLogin = async () => {
    // Implemente la lógica dentro del componente [cite: 43]
    if (!email || !password) {
      Alert.alert("Error", "Por favor completa ambos campos.");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(); // Notifica al componente App que el login fue exitoso [cite: 43]
    } catch (error) {
      console.log(error);
      let mensaje = "Error al iniciar sesión.";

      if (error.code === "auth/invalid-email") {
        mensaje = "Correo inválido.";
      } else if (error.code === "auth/user-not-found") {
        mensaje = "Usuario no encontrado.";
      } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        // En versiones recientes de Firebase, "auth/wrong-password" es a menudo "auth/invalid-credential"
        mensaje = "Contraseña incorrecta.";
      }
      
      Alert.alert("Error", mensaje);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <LinearGradient
        colors={['#4c669f', '#3b5998', '#192f6a']}
        style={styles.background}
      />
      <View style={styles.header}>
        <MaterialCommunityIcons name="store-check" size={80} color="white" />
        <Text style={styles.headerText}>Mi Inventario</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.titulo}>Bienvenido</Text>
        
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Correo electrónico"
            placeholderTextColor="#888"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons name="lock-outline" size={24} color="#888" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder="Contraseña"
            placeholderTextColor="#888"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!isPasswordVisible}
          />
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <MaterialCommunityIcons 
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
              size={24} color="#888" />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity style={styles.boton} onPress={manejarLogin}>
          <Text style={styles.textoBoton}>Entrar</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// Defina los estilos [cite: 44]
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: '100%',
  },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    marginTop: 10,
  },
  formContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 25,
    paddingVertical: 40,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 25,
    color: "#333",
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 10,
    paddingRight: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  boton: {
    backgroundColor: "#3b5998",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 5,
  },
  textoBoton: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Login;