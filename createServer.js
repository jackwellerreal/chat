const firebaseConfig = {
    apiKey: "AIzaSyCtX371vSQkQiUkbOznpq4qjN9GRQ4S4iY",
    authDomain: "chat-test-1eb14.firebaseapp.com",
    projectId: "chat-test-1eb14",
    storageBucket: "chat-test-1eb14.appspot.com",
    messagingSenderId: "1008517851206",
    appId: "1:1008517851206:web:0ab44965f13291fe784247",
};

const { initializeApp } = require("firebase/app.js");
const {
    getFirestore,
    collection,
    query,
    doc,
    getDoc,
    orderBy,
    limit,
    onSnapshot,
    addDoc,
    setDoc,
} = require("firebase/firestore.js");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth.js");
const prompt = require("prompt-sync")({ sigint: true });

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const auth = getAuth();

// later