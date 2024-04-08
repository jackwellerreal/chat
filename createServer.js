require("dotenv").config();
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGESENDERID,
    appId: process.env.APPID,
};

const { initializeApp } = require("firebase/app");
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
} = require("firebase/firestore");
const prompt = require("prompt-sync")({ sigint: true });
const Colours = require("./colours");

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const colours = new Colours();

try {
    console.log(
        `${colours.FgYellow}Welcome to the ${colours.FgBlue}server creation${colours.FgYellow} wizard!${colours.Reset}`
    );

    const name = prompt(
        `${colours.FgYellow}What is the ${colours.FgBlue}name${colours.FgYellow} for the server: ${colours.Reset}`
    );
    const description = prompt(
        `${colours.FgYellow}What is the ${colours.FgBlue}description${colours.FgYellow} for the server: ${colours.Reset}`
    );
    const owner = prompt(
        `${colours.FgYellow}Who is the ${colours.FgBlue}server owner${colours.FgYellow}: ${colours.Reset}`
    );
    const privateserver = prompt(
        `${colours.FgYellow}Is this a ${colours.FgBlue}private${colours.FgYellow} server (y/n): ${colours.Reset}`
    );
    const mainchannel = prompt(
        `${colours.FgYellow}What is the ${colours.FgBlue}default server${colours.FgYellow} for the server (eg general): ${colours.Reset}`
    );
    const icon = prompt(
        `${colours.FgYellow}Please enter the ${colours.FgBlue}url${colours.FgYellow} for the ${colours.FgBlue}server icon${colours.FgYellow}: ${colours.Reset}`
    );
    const banner = prompt(
        `${colours.FgYellow}Please enter the ${colours.FgBlue}url${colours.FgYellow} for the ${colours.FgBlue}server banner${colours.FgYellow}: ${colours.Reset}`
    );
    const channelNames = prompt(
        `${colours.FgYellow}Please enter all the ${colours.FgBlue}channels${colours.FgYellow} for the server (eg general;bot-spam;memes): ${colours.Reset}`
    ).split(";");

    var channelDescs = [];

    for (let index = 0; index < channelNames.length; index++) {
        let desc = prompt(
            `${colours.FgYellow}Please enter a description for the channel, ${colours.FgBlue}${channelNames[index]}${colours.FgYellow} for the server (eg A place to chat about anything): ${colours.Reset}`
        );
        channelDescs.push(desc);
    }

    var channelTypes = [];

    for (let index = 0; index < channelNames.length; index++) {
        let desc = prompt(
            `${colours.FgYellow}Please enter what type the channel, ${colours.FgBlue}${channelNames[index]}${colours.FgYellow} is (text or voice): ${colours.Reset}`
        );
        channelTypes.push(desc);
    }

    var channels = [];

    for (let index = 0; index < channelNames.length; index++) {
        channels.push({
            name: channelNames[index],
            type: channelTypes[index],
            description: channelDescs[index],
        });
    }

    const char = [
        "a",
        "b",
        "c",
        "d",
        "e",
        "f",
        "g",
        "h",
        "i",
        "j",
        "k",
        "l",
        "m",
        "n",
        "o",
        "p",
        "q",
        "r",
        "s",
        "t",
        "u",
        "v",
        "w",
        "x",
        "y",
        "z",
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
    ];
    var id = "";

    for (let index = 0; index < 8; index++) {
        id += char[Math.floor(Math.random() * char.length)];
    }

    let serverJSON = {
        owner: owner,
        icon: icon,
        banner: banner,
        id: id,
        private:
            privateserver.toLocaleLowerCase == "y" ||
            privateserver.toLowerCase() == "yes" ||
            privateserver.toLowerCase() == "true"
                ? true
                : false,
        description: description,
        mainChannel: mainchannel,
        name: name,
        channels: channels,
    };

    // TODO: Make new server thing
    console.log(serverJSON);
} catch (error) {
    console.log(
        `${colours.FgRed}❌ Unsuccessfully created a server${colours.Reset}`
    );
    console.log(error);
}
