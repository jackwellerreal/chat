const firebaseConfig = {
    apiKey: "AIzaSyCtX371vSQkQiUkbOznpq4qjN9GRQ4S4iY",
    authDomain: "chat-test-1eb14.firebaseapp.com",
    projectId: "chat-test-1eb14",
    storageBucket: "chat-test-1eb14.appspot.com",
    messagingSenderId: "1008517851206",
    appId: "1:1008517851206:web:0ab44965f13291fe784247",
};

const { initializeApp } = require("firebase/app.js");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth.js");
const prompt = require("prompt-sync")({ sigint: true });
const Colours = require("./colours");

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const colours = new Colours();

console.log(
    `${colours.FgYellow}Welcome to the ${colours.FgBlue}muser creation${colours.FgYellow} wizard!${colours.Reset}`
);

const username = prompt(
    `${colours.FgYellow}Please enter a username: ${colours.Reset}`
);
const password = prompt(
    `${colours.FgYellow}Please enter a password: ${colours.Reset}`
);

createUserWithEmailAndPassword(auth, username, password)
    .then((userCredential) => {
        console.log(
            `${colours.FgGreen}✅ Successfully created a user account${colours.Reset}`
        );
        console.log(userCredential.user);
    })
    .catch((error) => {
        console.log(
            `${colours.FgRed}❌ Unsuccessfully created a user account${colours.Reset}`
        );
        console.log(`${error.code}: ${error.message}`);
    });
