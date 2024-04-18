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
require("firebase/compat/firestore");

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

const prompt = require("prompt-sync")({ sigint: true });

const Colours = require("./colours");
const colours = new Colours();

async function initializeFirebase() {
    const manager = prompt(
        `${colours.FgYellow}What is the ${colours.FgBlue}manager${colours.FgYellow} for the chat: ${colours.Reset}`
    );
    const messageCount = prompt(
        `${colours.FgYellow}What is the amount of ${colours.FgBlue}messages shown${colours.FgYellow}: ${colours.Reset}`
    );

    const infoRef = db.collection("info").doc("info");
    await infoRef.set({
        manager: manager,
        messageCount: messageCount,
        codes: [
            "add codes for the verification in this array"
        ]
    });
}

try {
    console.log(
        `${colours.FgYellow}Welcome to the ${colours.FgBlue}initialize firebase${colours.FgYellow} wizard!${colours.Reset}`
    );

    initializeFirebase()

    console.log(
        `${colours.FgGreen}✅ Successfully initialized firebase${colours.Reset}`
    );
    return
} catch (error) {
    console.log(
        `${colours.FgRed}❌ Unsuccessfully initialized firebase${colours.Reset}`
    );
    console.log(error);
    return
}
