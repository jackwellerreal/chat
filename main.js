// Imports and packages

const { app, BrowserWindow, shell, ipcMain } = require("electron");
const fs = require("node:fs");
const axios = require("axios");

const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

// Firebase Config

const config = require("./config.json");

firebase.initializeApp({
    apiKey: config.firebase.apiKey,
    authDomain: config.firebase.authDomain,
    projectId: config.firebase.projectId,
    storageBucket: config.firebase.storageBucket,
    messagingSenderId: config.firebase.messagingSenderId,
    appId: config.firebase.appId,
});
const db = firebase.firestore();

let mainWindow;
let name;

// Check if behind proxy or no internet

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
                devTools: false,
                nodeIntegration: true,
                contextIsolation: false,
            },
            autoHideMenuBar: true,
        });

        authWindow.loadFile("./public/proxy-login.html");

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

            mainWindow.loadURL('http://localhost:3000/app')

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
            authWindow.close();
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

        mainWindow.loadURL('http://localhost:3000/app')

        // Open links in default browser

        mainWindow.webContents.setWindowOpenHandler(({ url }) => {
            shell.openExternal(url);
            return { action: "deny" };
        });
    }
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

// Make user offline when app is quit

ipcMain.on("close", async () => {
    try {
        const onlineRef = db.collection("info").doc("online");
        await onlineRef.update({
            people: (await onlineRef.get())
                .data()
                .people.filter((user) => user.name !== name),
        });
    } catch (error) {
        console.log(error);
    }

    mainWindow.close();
});

app.on("window-all-closed", async () => {
    app.quit();
});
