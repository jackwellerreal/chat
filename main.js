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

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

require("dotenv").config();

const fs = require("node:fs");

const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID2,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGESENDERID,
    appId: process.env.APPID,
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var name;

const ipc = ipcMain;

function createWindow() {
    const win = new BrowserWindow({
        minWidth: 1200,
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
    ipc.on("close", () => {
        app.quit();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.dock.setIcon("./assets/icon.png");

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    const proxySettings = session.defaultSession.proxySettings;

    if (proxySettings) {
        const proxyConfig = `${proxySettings.proxyType}://${proxySettings.proxy}`;
        if (proxySettings.proxyAuthorization) {
            dialog
                .showMessageBox(mainWindow, {
                    type: "question",
                    buttons: ["OK"],
                    defaultId: 0,
                    title: "Proxy Authentication",
                    message: "Please enter your proxy credentials.",
                })
                .then(() => {
                    session.defaultSession.setProxy({
                        proxyRules: proxyConfig,
                        proxyAuth: `${proxySettings.username}:${proxySettings.password}`,
                    });

                    mainWindow.reload();
                })
                .catch((error) => {
                    console.error(
                        "Error prompting for proxy credentials:",
                        error
                    );
                });
        }
    }
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
