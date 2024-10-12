const config = require("../config.json");
const firebaseConfig = {
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
};

const firebase = require("firebase/compat/app");
require("firebase/compat/auth");
require("firebase/compat/firestore");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
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
const admin = prompt(
    `${colours.FgYellow}Should this user have ${colours.FgBlue}admin${colours.FgYellow} privileges (y/n): ${colours.Reset}`
) == "y" ? true : false;

async function createUser() {
    try {
        const userCredential = await auth.createUserWithEmailAndPassword(username + "@chat.com", password);
        const user = userCredential.user;
        console.log(`${colours.FgGreen}✅ Successfully created user auth${colours.Reset}`);

        const usersRef = db.collection("info/users/users").doc(user.uid);
        const data = {
            account: {
                uid: user.uid,
                username: username,
                admin: admin,
                banned: false,
            },
            profile: {
                color: "#ffffff",
                displayname: username,
                verified: false, 
                status: "",
            },
            servers: [],
        };

        await usersRef.set(data);
        console.log(`${colours.FgGreen}✅ Successfully created user doc${colours.Reset}`);

        console.log(`${colours.FgGreen}✅ Successfully created user${colours.Reset}`);
        process.exit();
    } catch (error) {
        console.log(`${colours.FgRed}❌ Unsuccessfully created user${colours.Reset}`);
        console.log(`${error.code}: ${error.message}`);
    }
}

createUser();
