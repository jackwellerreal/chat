const Store = require("electron-store");
Store.initRenderer();

const {
    app,
    session,
    BrowserWindow,
    globalShortcut,
    shell,
    ipcMain,
    dialog,
} = require("electron");
const fs = require("node:fs");

require("dotenv").config();
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

var name;

const ipc = ipcMain;

app.whenReady().then(async () => {
    const win = new BrowserWindow({
        minWidth: 1000,
        minHeight: 600,
        title: "Chat V2",
        icon: "./assets/icon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
        autoHideMenuBar: true,
    });

    win.loadFile("./src/index.html");

    win.maximize();
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    ipc.on("name", (event, arg) => {
        name = arg;
    });

    ipc.on("min", () => {
        win.minimize();
    });
    ipc.on("max", () => {
        if (win.isMaximized()) {
            win.restore();
        } else {
            win.maximize();
        }
    });

    // ! Proxy auth security
    // ! I understand getting proxy auth is unsecure and I plan on fixing in the future.
    // ! If you can make it more secure please make a pull request or post an answer here:
    // ! https://stackoverflow.com/questions/78416735/getting-user-authentication-for-a-network-proxy-in-electron-29-3

    // todo Make proxy sign in more secure

    const proxyUser = "user";
    const proxyPass = "pass";

    app.on("login", async (event, webContents, request, authInfo, callback) => {
        callback(proxyUser, proxyPass);
    });

    ipc.on("close", async () => {
        const onlineRef = db.collection("info").doc("online");
        const onlineDoc = await onlineRef.get();
        const onlineData = onlineDoc.exists ? onlineDoc.data() : {};

        if (onlineData.people && onlineData.people.includes(name)) {
            const index = onlineData.people.indexOf(name);
            if (index > -1) {
                onlineData.people.splice(index, 1);
            }

            await onlineRef.set({ people: onlineData.people });
        }
        app.quit();
    });

    app.dock.setIcon("./assets/icon.png");

    const onlineRef = db.collection("info").doc("online");
    const onlineDoc = await onlineRef.get();
    const onlineData = onlineDoc.exists ? onlineDoc.data() : {};

    const peopleList = onlineData.people ? onlineData.people : [];
    if (peopleList.includes(name)) return;

    peopleList.push(name);
    await onlineRef.set({ people: peopleList });
});

app.on("window-all-closed", async () => {
    const onlineRef = db.collection("info").doc("online");
    const onlineDoc = await onlineRef.get();
    const onlineData = onlineDoc.exists ? onlineDoc.data() : {};

    if (onlineData.people && onlineData.people.includes(name)) {
        const index = onlineData.people.indexOf(name);
        if (index > -1) {
            onlineData.people.splice(index, 1);
        }

        await onlineRef.set({ people: onlineData.people });
    }
    app.quit();
});
