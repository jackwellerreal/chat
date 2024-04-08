require("dotenv").config();
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGESENDERID,
    appId: process.env.APPID
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
