const firebaseConfig = {
    apiKey: "AIzaSyC3bVHFPlQlqFRVNpgACjEZnGoFlB5Dbjs",
    authDomain: "chat-v2-654bb.firebaseapp.com",
    projectId: "chat-v2-654bb",
    storageBucket: "chat-v2-654bb.appspot.com",
    messagingSenderId: "996020677176",
    appId: "1:996020677176:web:753898bbd6fb1acc7014cd",
};

const { initializeApp } = require("firebase/app");
const { getAuth, createUserWithEmailAndPassword } = require("firebase/auth");
const prompt = require("prompt-sync")({ sigint: true });
const Colours = require("./colours");

const app = initializeApp(firebaseConfig);
const auth = getAuth();
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

createUserWithEmailAndPassword(auth, username + "@chat.com", password)
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
