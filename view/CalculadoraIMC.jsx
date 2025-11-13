import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";

import { ref, set, push, onValue } from "firebase/database";
// Asegúrate que la ruta a tu config de firebase sea correcta
import { realtimeDB } from "../src/database/firebaseconfig";

const CalculadoraIMC = () => {
    const [peso, setPeso] = useState("");
    const [altura, setAltura] = useState("");
    const [registrosIMC, setRegistrosIMC] = useState([]);

    const calcularYGuardarIMC = async () => {
        if (!peso || !altura) {
            Alert.alert("Error", "Rellena ambos campos (peso en kg y altura en metros)");
            return;
        }

        const pesoNum = parseFloat(peso);
        const alturaNum = parseFloat(altura);

        if (isNaN(pesoNum) || isNaN(alturaNum) || alturaNum === 0) {
             Alert.alert("Error", "Ingresa valores numéricos válidos.");
             return;
        }

        const imcCalculado = (pesoNum / (alturaNum * alturaNum)).toFixed(2);

        try {
            const referencia = ref(realtimeDB, "registros_imc");
            const nuevoRef = push(referencia); 

            await set(nuevoRef, {
                peso: pesoNum,
                altura: alturaNum,
                imc: parseFloat(imcCalculado),
                fecha: new Date().toISOString()
            });

            setPeso("");
            setAltura("");

            Alert.alert("Éxito", `IMC calculado y guardado: ${imcCalculado}`);
        } catch (error) {
            console.log("Error al guardar:", error);
            Alert.alert("Error", "No se pudo guardar el registro.");
        }
    };

    const leerRegistrosIMC = () => {
        const referencia = ref(realtimeDB, "registros_imc");

        onValue(referencia, (snapshot) => {
            if (snapshot.exists()) {
                const dataObj = snapshot.val();
                
                const lista = Object.entries(dataObj).map(([id, datos]) => ({
                    id,
                    ...datos,
                }));
                
                // Ordenar por fecha, el más reciente primero
                lista.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                
                setRegistrosIMC(lista);
            } else {
                setRegistrosIMC([]);
            }
        });
    };

    useEffect(() => {
        leerRegistrosIMC(); // Se conecta a los cambios en tiempo real
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Calculadora de IMC</Text>

            <TextInput
                style={styles.input}
                placeholder="Peso (en kg)"
                value={peso}
                onChangeText={setPeso}
                keyboardType="numeric"
            />
            
            <TextInput
                style={styles.input}
                placeholder="Altura (en metros, ej: 1.70)"
                value={altura}
                onChangeText={setAltura}
                keyboardType="decimal-pad"
            />

            <Button title="Calcular y Guardar" onPress={calcularYGuardarIMC} />

            <Text style={styles.subtitulo}>Historial de Registros (Realtime):</Text>

            {registrosIMC.length === 0 ? (
                <Text>No hay registros</Text>
            ) : (
                registrosIMC.map((reg) => (
                    <Text key={reg.id}>
                        • {reg.peso} kg / {reg.altura} m = IMC: {reg.imc}
                    </Text>
                ))
            )}
        </View>
    );
};

// Estilos de la guía
const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, marginTop: 50 },
    titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    subtitulo: { fontSize: 18, marginTop: 20, fontWeight: "bold" },
    input: {
        borderWidth: 1,
        borderColor: "#aaa",
        padding: 8,
        marginBottom: 10,
        borderRadius: 5,
    },
});

export default CalculadoraIMC;