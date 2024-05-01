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
var proxyconfig;

const proxyfile = "proxyconfig.json";
if (fs.existsSync(proxyfile)) {
    proxyconfig = JSON.parse(fs.readFileSync(proxyfile, "utf8"));
} else {
    fs.writeFileSync(proxyfile, `{"username":"","password":""}`);
}

const ipc = ipcMain;

app.whenReady().then(() => {
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
    ipc.on("close", async () => {
        const onlineRef = db.collection("info").doc("online");
        const onlineDoc = await onlineRef.get();
        const onlineData = onlineDoc.exists ? onlineDoc.data() : {};

        if (onlineData.people && onlineData.people.includes(name)) {
            const index = onlineData.people.indexOf(name);
            if (index > -1) {
                onlineData.people.splice(index, 1);
            }

            await onlineRef.set({ list: onlineData.people });
        }
        app.quit();
    });

    app.dock.setIcon("./assets/icon.png");

    app.on("login", async (event, webContents, request, authInfo, callback) => {
        event.preventDefault();

        callback(proxyconfig.username, proxyconfig.password);
    });
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

        await onlineRef.set({ list: onlineData.people });
    }
    app.quit();
});
