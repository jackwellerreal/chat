const { app, BrowserWindow, globalShortcut } = require("electron");
const firebase = require("firebase/compat/app");
require("firebase/compat/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyC3bVHFPlQlqFRVNpgACjEZnGoFlB5Dbjs",
    authDomain: "chat-v2-654bb.firebaseapp.com",
    projectId: "chat-v2-654bb",
    storageBucket: "chat-v2-654bb.appspot.com",
    messagingSenderId: "996020677176",
    appId: "1:996020677176:web:753898bbd6fb1acc7014cd",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

var name;

app.whenReady().then(() => {
    const win = new BrowserWindow({
        minWidth: 1200,
        minHeight: 800,
        icon: __dirname + "/assets/icon.png",
        webPreferences: {
            nodeIntegration: true,
        },
        autoHideMenuBar: true,
    });

    win.loadFile("./src/index.html");
    win.maximize();
    win.webContents
        .executeJavaScript('localStorage.getItem("name");', true)
        .then((result) => {
            name = result;
        });
});

app.on("window-all-closed", async () => {
    if (process.platform !== "darwin") {
        const onlineRef = db.collection("info").doc("online");
        const onlineDoc = await onlineRef.get()
        const onlineData = onlineDoc.exists
            ? onlineDoc.data()
            : {};

        if (onlineData.people && onlineData.people.includes(name)) {
            const index = onlineData.people.indexOf(name);
            if (index > -1) {
                onlineData.people.splice(index, 1);
            }

            await onlineRef.set({ people: onlineData.people });
        }

        console.log(name, onlineData.people)

        app.quit();
    }
});

app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
