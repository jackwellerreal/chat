const Store = require('electron-store');
Store.initRenderer();

const {
    app,
    BrowserWindow,
    globalShortcut,
    shell,
    ipcMain,
} = require("electron");

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

require("dotenv").config()
const firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    projectId: process.env.PROJECTID,
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
        minHeight: 800,
        icon: __dirname + "/assets/icon.png",
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: false,
        autoHideMenuBar: true,
    });

    win.loadFile("./src/index.html");
    win.maximize()
    win.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    ipc.on("name", (event, arg) => {
        name = arg
    })

    ipc.on("min", () => {
        win.minimize()
    })
    ipc.on("max", () => {
        if (win.isMaximized()) {
            win.restore()
        } else {
            win.maximize()
        }
    })
    ipc.on("close", () => {
        win.close()
    })
}

app.whenReady().then(createWindow);

app.on("window-all-closed", async () => {
    if (process.platform !== "darwin") {
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
        peopleList.push(name);

        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
