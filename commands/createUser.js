require("dotenv").config()
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGESENDERID,
    appId: process.env.APPID,
};

const firebase = require("firebase/compat/app");
require("firebase/compat/auth");

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

const prompt = require("prompt-sync")({ sigint: true });

const Colours = require("./colours");
const colours = new Colours();

console.log(
    `${colours.FgYellow}Welcome to the ${colours.FgBlue}user creation${colours.FgYellow} wizard!${colours.Reset}`
);

const username = prompt(
    `${colours.FgYellow}Please enter a ${colours.FgBlue}username${colours.FgYellow}: ${colours.Reset}`
);
const password = prompt(
    `${colours.FgYellow}Please enter a ${colours.FgBlue}password${colours.FgYellow}: ${colours.Reset}`
);

firebase
    .auth()
    .createUserWithEmailAndPassword(username + "@chat.com", password)
    .then((userCredential) => {
        console.log(
            `${colours.FgGreen}✅ Successfully created a user account${colours.Reset}`
        );
    })
    .catch((error) => {
        console.log(
            `${colours.FgRed}❌ Unsuccessfully created a user account${colours.Reset}`
        );
        console.log(`${error.code}: ${error.message}`);
    });

// TODO: make document that has username colour verified etc, for multi device support
