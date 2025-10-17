import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// 1. Importar getAuth de firebase/auth
import { getAuth } from "firebase/auth"; 
import Constants from "expo-constants";

const firebaseConfig = {
  apiKey: Constants.expoConfig.extra.FIREBASE_API_KEY,
  authDomain: Constants.expoConfig.extra.FIREBASE_AUTH_DOMAIN,
  projectId: Constants.expoConfig.extra.FIREBASE_PROJECT_ID,
  messagingSenderId: Constants.expoConfig.extra.FIREBASE_MESSAGING_SENDER_ID,
  appId: Constants.expoConfig.extra.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// 2. Inicializar el objeto de autenticación
const auth = getAuth(app); 

// 3. Exportar db Y auth
export { db, auth };