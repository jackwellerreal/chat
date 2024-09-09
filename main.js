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
const axios = require('axios'); 
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

require("dotenv").config();

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

let mainWindow;

async function isBehindProxy() {
    try {
        await axios.get('https://example.org/');
        return false;
    } catch (error) {
        return true;
    }
}

app.whenReady().then(async () => {
    const createMainWindow = () => {
        mainWindow = new BrowserWindow({
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
    
        mainWindow.loadFile('./src/index.html');
        mainWindow.maximize();
    
        mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });
    };

    createMainWindow();
});

app.on('window-all-closed', async () => {
    if (mainWindow) {
        const onlineRef = db.collection('info').doc('online');
        const onlineDoc = await onlineRef.get();
        const onlineData = onlineDoc.exists ? onlineDoc.data() : {};

        if (onlineData.people && onlineData.people.includes(name)) {
            const index = onlineData.people.indexOf(name);
            if (index > -1) {
                onlineData.people.splice(index, 1);
            }
            await onlineRef.set({ people: onlineData.people });
        }
    }
    app.quit();
});

ipcMain.on('name', (event, arg) => {
    name = arg;
});

ipcMain.on('min', () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on('max', () => {
    if (mainWindow) {
        if (mainWindow.isMaximized()) {
            mainWindow.restore();
        } else {
            mainWindow.maximize();
        }
    }
});

ipcMain.on('close', async () => {
    if (mainWindow) {
        const onlineRef = db.collection('info').doc('online');
        const onlineDoc = await onlineRef.get();
        const onlineData = onlineDoc.exists ? onlineDoc.data() : {};

        if (onlineData.people && onlineData.people.includes(name)) {
            const index = onlineData.people.indexOf(name);
            if (index > -1) {
                onlineData.people.splice(index, 1);
            }
            await onlineRef.set({ people: onlineData.people });
        }
    }
    app.quit();
});

app.dock.setIcon('./assets/icon.png');
