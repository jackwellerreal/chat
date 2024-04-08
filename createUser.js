require("dotenv").config();
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGESENDERID,
    appId: process.env.APPID,
};

const { initializeApp } = require("firebase/app.js");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth.js");
const prompt = require("prompt-sync")({ sigint: true });
const Colours = require("./colours");
const colours = new Colours();

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

console.log(
    `${colours.FgYellow}Welcome to the ${colours.FgBlue}user creation${colours.FgYellow} wizard!${colours.Reset}`
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

// TODO: make document that has username colour verified etc, for multi device support