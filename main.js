// Imports and packages

const Store = require("electron-store");
Store.initRenderer();

const { app, BrowserWindow, shell, ipcMain } = require("electron");
const fs = require("node:fs");
const axios = require("axios");
const globalTunnel = require("global-tunnel-ng");

require("dotenv").config();

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

// Firebase Config

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
let name;

// Check if behind proxy or no internet

let proxy = false;
let proxyAuth = [];

async function isBehindProxy() {
    try {
        await axios.get("https://api.ipify.org/?format=json", {
            timeout: 3000,
        });
        return false;
    } catch (error) {
        return true;
    }
}

// Load Windows

app.whenReady().then(async () => {
    // Check if behind proxy.

    if (await isBehindProxy()) {
        // Make window to prompt for password

        const authWindow = new BrowserWindow({
            width: 300,
            height: 250,
            resizable: false,
            title: "Proxy Authentication",
            modal: true,
            parent: null,
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                contextIsolation: false,
            },
            autoHideMenuBar: true,
        });

        authWindow.loadFile("./src/proxy-login.html");

        // Wait for response

        ipcMain.once("proxy-auth", (event, args) => {
            proxyAuth = [args.username, args.password];

            // Make main window

            mainWindow = new BrowserWindow({
                width: 1200,
                height: 800,
                minWidth: 1200,
                minHeight: 800,
                title: "Chat V2",
                icon: "./assets/icon.png",
                webPreferences: {
                    devTools: true,
                    nodeIntegration: true,
                    contextIsolation: false,
                },
                frame: false,
                autoHideMenuBar: true,
            });

            mainWindow.loadFile("./src/index.html");

            // Open links in default browser

            mainWindow.webContents.setWindowOpenHandler(({ url }) => {
                shell.openExternal(url);
                return { action: "deny" };
            });

            // Set the proxy authentication

            app.on(
                "login",
                async (event, webContents, request, authInfo, callback) => {
                    callback(args.username, args.password);
                }
            );

            mainWindow.reload();
            authWindow.close()
        });
    } else {
        // Make main window

        mainWindow = new BrowserWindow({
            width: 1200,
            height: 800,
            minWidth: 1200,
            minHeight: 800,
            title: "Chat V2",
            icon: "./assets/icon.png",
            webPreferences: {
                devTools: true,
                nodeIntegration: true,
                contextIsolation: false,
            },
            frame: false,
            autoHideMenuBar: true,
        });

        mainWindow.loadFile("./src/index.html");

        // Open links in default browser

        mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });
    }
});

// Make user offline when app is quit

app.on("window-all-closed", async () => {
    if (mainWindow) {
        if (await isBehindProxy()) {
            globalTunnel.initialize({
                host: process.env.PROXY.split(":")[0],
                port: process.env.PROXY.split(":")[1],
                proxyAuth: proxyAuth[0] + ":" + proxyAuth[1],
            });
        }

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

        globalTunnel.end();
    }
    app.quit();
});

// Get name form client

ipcMain.on("name", (event, arg) => {
    name = arg;
});

// Window Controls

ipcMain.on("min", () => {
    if (mainWindow) mainWindow.minimize();
});

ipcMain.on("max", () => {
    if (process.platform === "darwin") {
        if (mainWindow) {
            if (mainWindow.isFullScreen()) {
                mainWindow.setFullScreen(false);
            } else {
                mainWindow.setFullScreen(true);
            }
        }
    } else {
        if (mainWindow) {
            if (mainWindow.isMaximized()) {
                mainWindow.restore();
            } else {
                mainWindow.maximize();
            }
        }
    }
});

ipcMain.on("close", async () => {
    mainWindow.close();
});

// Set dock icon

app.dock.setIcon("./assets/icon.png");
