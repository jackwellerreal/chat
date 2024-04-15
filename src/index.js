const clientVersion = "TR 2.0 1";

const firebaseConfig = {
    apiKey: "AIzaSyC3bVHFPlQlqFRVNpgACjEZnGoFlB5Dbjs",
    authDomain: "chat-v2-654bb.firebaseapp.com",
    projectId: "chat-v2-654bb",
    storageBucket: "chat-v2-654bb.appspot.com",
    messagingSenderId: "996020677176",
    appId: "1:996020677176:web:753898bbd6fb1acc7014cd",
};

// Make sure to remove the firebase config before compiling and pushing to github

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import {
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
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-storage.js";
import {
    getAuth,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
const { ipcRenderer } = require("electron");

const ipc = ipcRenderer;

document.querySelector("#taskbar-control-min").addEventListener("click", () => {
    ipc.send("min");
});
document.querySelector("#taskbar-control-max").addEventListener("click", () => {
    ipc.send("max");
});
document
    .querySelector("#taskbar-control-close")
    .addEventListener("click", () => {
        ipc.send("close");
    });

const app = initializeApp(firebaseConfig);
const slots = ["💯", "💀", "🧑‍🦼", "🍪", "😂"];

const db = getFirestore(app);
const storage = getStorage();
const auth = getAuth();
const urlParams = new URLSearchParams(window.location.search);

// Define elements

const overlayForm = document.querySelector("#overlay");
const pageTitle = document.querySelector("#title");
const favicon = document.querySelector("#favicon");

const serverName = document.querySelector("#server-name");
const serverDesc = document.querySelector("#server-description");
const serverBanner = document.querySelector("#server-banner");

const channelSidebar = document.querySelector(".channel-sidebar");
const editSettings = document.querySelector(".settings-settings");

const onlineList = document.querySelector("#online-list");

const messageInput = document.querySelector("#created-message");
const messagesDiv = document.querySelector("#messages");

const emojiIcon = document.querySelector("#emoji-picker-icon");
const gifIcon = document.querySelector("#gif-picker-icon");
const folderIcon = document.querySelector("#file-upload-icon");
const fileUpload = document.querySelector("#fileUpload");
const emojiPicker = document.querySelector("#emoji-picker-div");
const form = document.querySelector("#create");

// Get info on chat

const infoRef = await getDoc(doc(db, "info", "info"));
const info = infoRef.data();

// Get info on server

const serversRef = await getDoc(doc(db, "info", "servers"));
const servers = serversRef.data().list;

const server =
    urlParams.get("server-id") == null
        ? servers.find((obj) => obj.id === "40a2eee5") // you can change the id to any server id
        : servers.find((obj) => obj.id === urlParams.get("server-id"));

// List all servers

servers.forEach((serverList) => {
    let localServerList =
        localStorage.getItem("servers") == null
            ? []
            : localStorage.getItem("servers").split(",");
    if (
        serverList.private == false ||
        localServerList.includes(serverList.id)
    ) {
        const url = new URL(window.location.href);
        url.searchParams.set("server-id", serverList.id);
        const serverElement = document.createElement("a");
        serverElement.className = "server-sidebar-icon";
        serverElement.innerHTML = `<img src="${serverList.icon}">`;
        serverElement.href = url;
        document.getElementById("server-list").appendChild(serverElement);
    }
});

document
    .getElementById("server-list")
    .insertAdjacentHTML(
        "beforeend",
        `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 448 512" id="addServer" class="server-sidebar-plus"><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z" /></svg>`
    );

document
    .getElementById("server-list")
    .insertAdjacentHTML(
        "beforeend",
        `<svg xmlns="http://www.w3.org/2000/svg" viewbox="0 0 512 512" id="findServer" class="server-sidebar-plus"><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>`
    );

document.querySelector("#addServer").addEventListener("click", () => {
    overlayForm.style.display = "flex";

    const formElement = document.createElement("div");
    formElement.className = "overlay-form";
    formElement.innerHTML = `
    <div class="overlay-form-content">
        <h1>Join a Server</h1>
        <p>Enter an invite below to join an existing server</p>
    </div>
    <div class="overlay-form-questions">
        <h2>Server ID</h2>
        <input id="form-id" placeholder="40a2eee5" />
    </div>
    <div class="overlay-form-confirm">
        <button id="button-exit">Cancel</button>
        <button id="button-confirm">Join Server</button>
    </div>
    `;
    overlayForm.appendChild(formElement);

    document.querySelector("#button-exit").addEventListener("click", () => {
        formElement.remove();
        overlayForm.style.display = "none";
    });

    document.querySelector("#button-confirm").addEventListener("click", () => {
        const serverID = document.querySelector("#form-id").value;

        formElement.remove();
        overlayForm.style.display = "none";

        if (localStorage.getItem("servers") == null) {
            let servers = `${serverID}`;
            localStorage.setItem("servers", servers);
        } else {
            let servers = localStorage.getItem("servers") + `,${serverID}`;
            localStorage.setItem("servers", servers);
        }
    });
});

document.querySelector("#findServer").addEventListener("click", () => {
    alert("This button does nothing yet...");
});

// List channels for selected server

const channels = server.channels;

const channel = urlParams.get("channel")
    ? channels.find((obj) => obj.name === urlParams.get("channel"))
    : channels.find((obj) => obj.name === server.mainChannel);

channels.forEach((channelList) => {
    const url = new URL(window.location.href);
    const icon =
        channelList.type === "text"
            ? `<svg xmlns="http://www.w3.org/2000/svg" height="16px" style="vertical-align: -0.125em; margin-right: 4px;" viewBox="0 0 448 512"><path d="M424 136l-74.01-.0254l13.63-75.76c2.344-13.03-6.312-25.53-19.38-27.88c-13-2.188-25.5 6.344-27.88 19.38l-15.16 84.26h-111.2l13.63-75.76c2.344-13.03-6.312-25.53-19.38-27.88C171.2 30.15 158.7 38.69 156.4 51.72l-15.16 84.26H56c-13.25 0-24 10.78-24 24.03c0 13.25 10.75 23.97 24 23.97h76.57l-25.92 144H24c-13.25 0-24 10.76-24 24.01C0 365.3 10.75 376 24 376l74.01-.0078l-13.63 75.76c-2.344 13.03 6.312 25.53 19.38 27.88C105.2 479.9 106.6 480 108 480c11.38 0 21.5-8.158 23.59-19.75l15.16-84.26h111.2l-13.63 75.76c-2.344 13.03 6.312 25.53 19.38 27.88C265.2 479.9 266.6 480 268 480c11.38 0 21.5-8.158 23.59-19.75l15.16-84.26L392 376c13.25 0 24-10.75 24-23.1c0-13.25-10.75-24.01-24-24.01h-76.57l25.92-144L424 184c13.25 0 24-10.75 24-23.1C448 146.8 437.3 136 424 136zM266.7 327.1h-111.2l25.92-144h111.2L266.7 327.1z"/></svg>`
            : `<svg xmlns="http://www.w3.org/2000/svg" height="16px" style="vertical-align: -0.125em; margin-right: 4px;" viewBox="0 0 640 512"><path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z"/></svg>`;
    const channelElement = document.createElement("div");

    url.searchParams.set("channel", channelList.name);
    channelElement.innerHTML = `<a href="${url}">${icon}${channelList.name}</a>`;
    channelElement.classList = `channel-sidebar-item${channelList == channel ? " channels-current" : ""}`;
    document.getElementById("channels").appendChild(channelElement);
});

// When user scrolls add background to server title

channelSidebar.addEventListener("scroll", function () {
    var scrollPosition = this.scrollTop;
    if (scrollPosition == 0) {
        serverName.style.backgroundColor = "transparent";
        serverName.style.borderBottom = "none";
        serverName.style.filter = "drop-shadow(2px 2px 3px #000)";
    }
    if (scrollPosition != 0) {
        serverName.style.backgroundColor = "#2b2d31";
        serverName.style.borderBottom = "2.5px solid #3b3d44";
        serverName.style.filter = "none";
    }
});

// Provide information on server

pageTitle.innerHTML = `${server.name} - #${channel.name}`;
favicon.href = server.icon;
serverName.innerHTML = `${server.name} <div id="server-info" style="display: flex;align-items: center;height: 25px;"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" style="height: 16px;fill: #ffffff;"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg></div>`;
serverDesc.innerHTML = server.description;
serverBanner.style.background = `url(${server.banner})`;
serverBanner.style.backgroundPosition = `center center`;
serverBanner.style.backgroundSize = `cover`;

serverName.addEventListener("click", () => {
    alert(
        `Owned by: ${server.owner}\nManaged by: ${info.manager}\nVersion: ${clientVersion}\nShowing ${info.messageCount} messages\n${localStorage.getItem("verified") ? "You are verified!" : ""}`
    );
});

// Show online users

const onlineDocRef = doc(db, "info", "online");

async function setOnline() {
    const name = localStorage.getItem("name");
    if (name == "Unnamed_User") {
        return;
    }

    const onlineDocSnapshot = await getDoc(onlineDocRef);
    const onlineDocData = onlineDocSnapshot.exists()
        ? onlineDocSnapshot.data()
        : [];

    const peopleList = onlineDocData.people ? onlineDocData.people : [];
    if (peopleList.includes(name)) return;
    peopleList.push(name);

    await setDoc(onlineDocRef, { people: peopleList });
}

onSnapshot(onlineDocRef, async () => {
    onlineList.innerHTML = "";

    const onlineDocSnapshot = await getDoc(onlineDocRef);
    const onlineDocData = onlineDocSnapshot.exists()
        ? onlineDocSnapshot.data()
        : [];

    onlineDocData.people.forEach((user) => {
        const userElement = document.createElement("div");
        userElement.className = "online-user";
        userElement.innerHTML = `
            <svg width="32" height="32" viewBox="0 0 32 32">
                <mask id=":r4:" width="32" height="32">
                    <circle cx="16" cy="16" r="16" fill="white"></circle>
                    <rect color="black" x="19" y="19" width="16" height="16" rx="8" ry="8"></rect>
                </mask>
                <foreignObject x="0" y="0" width="32" height="32" mask="url(#:r4:)">
                    <div>
                        <img src="https://source.boringavatars.com/beam/40/${user}?colors=ED4245,FEE75C,57F287,5865F2,EB459E" />
                    </div>
                </foreignObject>
                <svg x="14.5" y="17" width="25" height="15" viewBox="0 0 25 15">
                    <mask id=":r5:">
                        <rect x="7.5" y="5" width="10" height="10" rx="5" ry="5" fill="white"></rect>
                        <rect x="12.5" y="10" width="0" height="0" rx="0" ry="0" fill="black"></rect>
                        <polygon points="-2.16506,-2.5 2.16506,0 -2.16506,2.5" fill="black"
                            transform="scale(0) translate(13.125 10)"></polygon>
                        <circle fill="black" cx="12.5" cy="10" r="0"></circle>
                    </mask>
                    <rect fill="#23a55a" width="25" height="15" mask="url(#:r5:)"></rect>
                </svg>
            </svg>

            <p >${user}</p>
        `;
        onlineList.appendChild(userElement);
    });

    document.querySelector("#online-title").innerText =
        `Online - ${onlineDocData.people.length}`;
});

setOnline();

// Get the refrence to the messages

const messageRef = collection(db, `${server.id}/channels/${channel.name}`);
const q = query(
    messageRef,
    orderBy("timestamp", "desc"),
    limit(server.messageCount)
);

// Format Messages

function checkMessage(string) {
    if (string.startsWith("raw:")) {
        if (string.startsWith("raw:embed:")) {
            return `<div class="message-content-embed" style="border-color: var(--blue);">${string
                .replace(/raw\:embed\:/, "")
                .replace("\\n", "<br>")}</div>`;
        } else {
            return string.replace(/raw\:/, "");
        }
    }
    if (string.startsWith("image:")) {
        const url = string.replace(/image\:/, "");
        return `<a href=${url} target="_blank"><img src="${url}" name="message-image" style="height:initial;width:initial;"></a>`;
    }
    if (string.startsWith("url:")) {
        return `<a href=${string.replace(
            /url\:/,
            ""
        )} target="_blank">${string.replace(/url\:/, "")}</a>`;
    }
    if (string.startsWith("font:")) {
        if (string.startsWith("font:comic:")) {
            return `<span style="font-family: 'Comic Sans MS', 'Comic Sans', cursive;">${string.replace(
                "font:comic:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:consolas:")) {
            return `<span style="font-family: Consolas, monospace;">${string.replace(
                "font:consolas:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:impact:")) {
            return `<span style="font-family: Impact, serif;">${string.replace(
                "font:impact:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:wingdings:")) {
            return `<span style="font-family: 'Wingdings 3'";>${string.replace(
                "font:wingdings:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:maths:")) {
            return `<span style="font-family: Cambria, Georgia, serif;";>${string.replace(
                "font:maths:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:newroman:")) {
            return `<span style="font-family: 'Times New Roman', serif;";>${string.replace(
                "font:newroman:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:algerian:")) {
            return `<span style="font-family: Algerian, fantasy;";>${string.replace(
                "font:algerian:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:faded:")) {
            return `<span style="opacity: 20%;">${string.replace(
                "font:faded:",
                ""
            )}</span>`;
        }
        if (string.startsWith("font:tiny:")) {
            return `<span style="font-size: 10px">${string.replace(
                "font:tiny:",
                ""
            )}</span>`;
        }
    }
    if (string.startsWith("colour:")) {
        if (string.startsWith("colour:red:")) {
            return `<span style="color: red;">${string.replace(
                "colour:red:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:orange:")) {
            return `<span style="color: orange;">${string.replace(
                "colour:orange:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:yellow:")) {
            return `<span style="color: yellow;">${string.replace(
                "colour:yellow:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:lime:")) {
            return `<span style="color: lime;">${string.replace(
                "colour:lime:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:green:")) {
            return `<span style="color: green;">${string.replace(
                "colour:green:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:cyan:")) {
            return `<span style="color: cyan;">${string.replace(
                "colour:cyan:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:blue:")) {
            return `<span style="color: blue;">${string.replace(
                "colour:blue:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:darkblue:")) {
            return `<span style="color: darkblue;">${string.replace(
                "colour:darkblue:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:purple:")) {
            return `<span style="color: purple;">${string.replace(
                "colour:purple:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:magenta:")) {
            return `<span style="color: magenta;">${string.replace(
                "colour:magenta:",
                ""
            )}</span>`;
        }
        if (string.startsWith("colour:pink:")) {
            return `<span style="color: pink;">${string.replace(
                "colour:pink:",
                ""
            )}</span>`;
        }
    }
    if (string.startsWith("spoiler:")) {
        return `<div class="message-spoiler"><span class="message-spoiler-text">${string.replace(
            "spoiler:",
            ""
        )}</span></div>`;
    } else {
        var replaced = string
            .replace(/\\n/g, "<br>")
            .replace("!important", `<span class="message-highlight">$&</span>`)
            .replace(
                /(?<!\\)\@([^ ^\!^\#^\$^\^]+)/g,
                `<span class="message-highlight">$&</span>`
            )
            .replace(
                /(?<!\\)\#([^ ^\!^\@^\$^\^]+)/g,
                `<a class="message-highlight" href="?text-channel=${string
                    .match(/\#([^ ^\!^\@^\$^\^]+)/g)
                    ?.map((match) => match.replace("#", ""))}">$&</a>`
            )
            .replace(
                /(?<!\\)\$([^ ^\!^\@^\#^\^]+)/g,
                `<a class="message-highlight" href="https://www.google.com/finance/quote/${string
                    .match(/\$([^ ^\!^\@^\#^\^]+)/g)
                    ?.map((match) =>
                        match.replace("$", "")
                    )}" target="_blank">$&</a>`
            )
            .replace(
                /(?<!\\)\^([^ ^\!^\@^\#^\$]+)/g,
                `<a class="message-highlight" href="https://google.com/search?q=${string
                    .match(/\^([^ ^\!^\@^\#^\$]+)/g)
                    ?.map((match) =>
                        match.replace("^", "").replace("_", " ")
                    )}" target="_blank">$&</a>`
            )
            .replace(
                /(?<![^ ^])\/([^ ^\!^\#^\$^\^]+)/g,
                `<span class="message-highlight" onclick="
          document.getElementById('created-message').value = 
          '${string}'.match(/(?<![^ ^])\\/([^ ^\!^\#^\$^\^]+)/g)
        ">$&</span>`
            );
        return replaced;
    }
}

// Display Messages

async function displayPosts(posts) {
    messagesDiv.innerHTML = "";
    posts.forEach((post, i) => {
        // time
        var momentObj = moment.unix(post.timestamp.seconds);
        var today = moment().startOf("day");
        var yesterday = moment().subtract(1, "days").startOf("day");
        var time;
        if (momentObj.isSame(today, "day")) {
            time = "Today at " + momentObj.format("HH:mm");
        } else if (momentObj.isSame(yesterday, "day")) {
            time = "Yesterday at " + momentObj.format("HH:mm");
        } else {
            time = momentObj.format("DD/MM/YYYY HH:mm");
        }

        var name = post.user.name;
        const verified = post.user.verified;
        const bot = post.user.bot;
        const message = twemoji.parse(
            checkMessage(
                bot === true
                    ? "raw:" + post.message.content
                    : post.message.content
            ),
            {
                size: "svg",
                ext: ".svg",
            }
        );
        const color = post.user.colour;
        const command = post.message.command;

        const messageElement = document.createElement("div");
        const mention =
            message.match(/(?<!\\)@everyone/) ||
            message.match(
                new RegExp(`(?<!\\\\)@${localStorage.getItem("name")}`)
            )
                ? "message-mention"
                : "";

        const important = message.toLowerCase().includes(`!important`)
            ? "message-important"
            : "";

        name += ` ${
            verified === true
                ? '<svg xmlns="http://www.w3.org/2000/svg" style="fill: ' +
                  color +
                  ';" viewBox="0 0 24 24" ><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>'
                : ""
        }`;

        messageElement.className = `message${" " + mention}${" " + important}`;
        messageElement.id = post.id;

        messageElement.innerHTML = `
            <div style="height: 60px;display: flex;align-items: center;">
                <img src="https://source.boringavatars.com/beam/120/${post.user.name}?colors=ED4245,FEE75C,57F287,5865F2,EB459E" class="message-pfp">
            </div>
            <div>
                <div class="message-sender">
                    ${
                        bot === true
                            ? '<span style="color: ' +
                              color +
                              ';">' +
                              name +
                              '</span> <span style="font-weight: 400;">used</span> <span class="message-highlight" style="font-weight: 400;" onclick="document.getElementById(\'created-message\').value = \'' +
                              command +
                              "'.match(/\\/([^ ^!^@^#^$]+)/g) \">" +
                              command +
                              "</span>"
                            : '<span id="message-name" style="color: ' +
                              color +
                              '">' +
                              name +
                              "</span>"
                    }
                    <span class="message-time">${time}</span>
                </div>
                <span class="message-content">${message}</span>
            </div>
        `;
        messageElement.setAttribute("bot", bot ? "true" : "false");
        messagesDiv.appendChild(messageElement);

        const previousMessage = messagesDiv.children[i - 1];
        if (previousMessage) {
            const previousMessageName =
                previousMessage.children[1].children[0].children[0].innerHTML.split(
                    " "
                )[0];
            if (
                previousMessageName == post.user.name &&
                !bot &&
                previousMessage.getAttribute("bot") == "false"
            ) {
                previousMessage.children[1].children[0].remove();
                previousMessage.children[0].remove();

                previousMessage.setAttribute("og-name", previousMessageName);

                const multiTime = document.createElement("span");
                multiTime.className = "message-time-multi";
                multiTime.innerHTML = `${moment.unix(post.timestamp.seconds).format("HH:mm")}`;

                previousMessage.appendChild(multiTime);
                previousMessage.appendChild(
                    previousMessage.children[0].children[0]
                );
                previousMessage.children[0].parentNode.removeChild(
                    previousMessage.children[0]
                );
            }
        }
    });
    const messageElement = document.createElement("div");
    messageElement.className = "greating";
    messageElement.innerHTML = `<p class="greeting-title">You are in #${channel.name}</p><p class="greeting-desc">${channel.description}</p>`;
    messagesDiv.appendChild(messageElement);
}

// Get Messages & Display them

function loadData() {
    onSnapshot(q, (querySnapshot) => {
        const posts = [];
        querySnapshot.forEach((doc) => {
            posts.push({ ...doc.data(), id: doc.id });
        });
        displayPosts(posts).then(() => {
            messagesDiv.scroll({
                top: messagesDiv.scrollHeight,
            });
        });
    });
}

// Load Voice Channel & Manage Calls

async function loadVoice() {
    const create = document.getElementById("create");
    const newCreate = document.createElement("div");
    newCreate.id = create.id;
    newCreate.className = create.className;
    newCreate.innerHTML = create.innerHTML;
    create.parentNode.replaceChild(newCreate, create);
    const videoDiv = document.createElement("div");
    const localVideo = document.createElement("video");
    const remoteVideo = document.createElement("video");
    videoDiv.className = "video";
    videoDiv.id = "videoDiv";
    localVideo.id = "localVideo";
    localVideo.muted = true;
    localVideo.playsInline = true;
    localVideo.autoplay = true;
    remoteVideo.id = "remoteVideo";
    remoteVideo.playsInline = true;
    remoteVideo.autoplay = true;
    document.getElementById("messages").appendChild(videoDiv);
    document.getElementById("videoDiv").appendChild(localVideo);
    document.getElementById("videoDiv").appendChild(remoteVideo);
    document.getElementById("create").innerHTML = `
  <div style="display: flex;justify-content: space-evenly;width:100%;">
    <button class="message-create-button" id="start-video" style="margin: 0;" title="Start Video">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="fill: white;">
        <path d="M448 96h-72l-8.457-22.51C358.2 48.51 334.3 32 307.6 32H204.4C177.7 32 153.9 48.51 144.5 73.45L136 96H64C28.65 96 0 124.7 0 160v256c0 35.35 28.65 64 64 64h384c35.35 0 64-28.65 64-64V160C512 124.7 483.3 96 448 96zM464 416c0 8.822-7.178 16-16 16H64c-8.822 0-16-7.178-16-16V160c0-8.822 7.178-16 16-16h105.2l20.19-53.64C191.7 84.16 197.8 80 204.4 80h103.3c6.631 0 12.65 4.172 14.98 10.38L342.7 144H448c8.822 0 16 7.178 16 16V416zM256 176C194.1 176 144 226.1 144 288c0 61.86 50.14 112 112 112s112-50.14 112-112C368 226.1 317.9 176 256 176zM256 352c-35.29 0-64-28.71-64-64c0-35.29 28.71-64 64-64s64 28.71 64 64C320 323.3 291.3 352 256 352z"/>
      </svg>
    </button>
    <button class="message-create-button" id="start-voice" style="margin: 0;" title="Create Call" disabled>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="fill: white;">
        <path d="M480.3 320.3l-98.2-42.08c-21.4-9.281-46.64-3.109-61.2 14.95l-27.44 33.5C248.7 300.9 211.2 263.4 185.4 218.6l33.55-27.48C236.9 176.5 243.1 151.4 233.1 130.1L191.7 31.53C181.6 8.33 156.4-4.326 131.9 1.346L40.61 22.41C16.7 27.86 0 48.83 0 73.39C0 315.3 196.7 512 438.6 512c24.56 0 45.53-16.69 51-40.53l21.06-91.34C516.4 355.5 503.6 330.3 480.3 320.3zM463.9 369.3l-21.09 91.41C442.3 462.7 440.7 464 438.6 464C223.2 464 47.1 288.8 47.1 73.39c0-2.094 1.297-3.734 3.344-4.203L142.7 48.11c.3125-.0781 .6406-.1094 .9531-.1094c1.734 0 3.359 1.047 4.047 2.609l42.14 98.33C190.6 150.7 190.1 152.8 188.6 154l-48.78 39.97C131.2 201 128.5 213.1 133.4 223.1c33.01 67.23 88.26 122.5 155.5 155.5c9.998 4.906 22.09 2.281 29.15-6.344l40.02-48.88c1.109-1.406 3.186-1.938 4.92-1.125l98.26 42.09C463.2 365.2 464.3 367.3 463.9 369.3zM343.1 119.1H392v48C392 181.3 402.8 192 416 192s23.1-10.75 23.1-23.1V119.1h48C501.3 119.1 512 109.3 512 96s-10.75-23.1-23.1-23.1H439.1V23.1C439.1 10.75 429.3 0 416 0s-23.1 10.75-23.1 23.1v48H343.1C330.7 72 320 82.75 320 96S330.7 119.1 343.1 119.1z"/>
      </svg>
    </button>
    <input id="callID" placeholder="Call ID" class="message-create" style="flex-grow: 0;"/>
    <button class="message-create-button" id="join-voice" style="margin: 0;" title="Join Call from ID" disabled>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" style="fill: white;">
        <path d="M480.3 320.3l-98.2-42.08c-21.4-9.281-46.64-3.109-61.2 14.95l-27.44 33.5C248.7 300.9 211.2 263.4 185.4 218.6l33.55-27.48C236.9 176.5 243.1 151.4 233.1 130.1L191.7 31.53C181.6 8.33 156.4-4.326 131.9 1.346L40.61 22.41C16.7 27.86 0 48.83 0 73.39C0 315.3 196.7 512 438.6 512c24.56 0 45.53-16.69 51-40.53l21.06-91.34C516.4 355.5 503.6 330.3 480.3 320.3zM463.9 369.3l-21.09 91.41C442.3 462.7 440.7 464 438.6 464C223.2 464 47.1 288.8 47.1 73.39c0-2.094 1.297-3.734 3.344-4.203L142.7 48.11c.3125-.0781 .6406-.1094 .9531-.1094c1.734 0 3.359 1.047 4.047 2.609l42.14 98.33C190.6 150.7 190.1 152.8 188.6 154l-48.78 39.97C131.2 201 128.5 213.1 133.4 223.1c33.01 67.23 88.26 122.5 155.5 155.5c9.998 4.906 22.09 2.281 29.15-6.344l40.02-48.88c1.109-1.406 3.186-1.938 4.92-1.125l98.26 42.09C463.2 365.2 464.3 367.3 463.9 369.3zM488 0h-112C362.8 0 352 10.75 352 24s10.75 24 24 24h54.06l-135 135c-9.375 9.375-9.375 24.56 0 33.94s24.56 9.375 33.94 0L464 81.94V136C464 149.3 474.8 160 488 160S512 149.3 512 136v-112C512 10.75 501.3 0 488 0z"/>
      </svg>
    </button>
    <button class="message-create-button" id="leave-voice" style="margin: 0;" title="Leave Voice" disabled>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" style="fill: white;">
        <path d="M11.7 266.3l41.9 94.3c6.1 13.7 20.8 21.3 35.5 18.4l109.2-21.8c15-3 25.7-16.1 25.7-31.4V240c62.3-20.8 129.7-20.8 192 0v85.8c0 15.3 10.8 28.4 25.7 31.4L550.9 379c14.7 2.9 29.4-4.7 35.5-18.4l41.9-94.3c7.2-16.2 5.1-35.1-7.4-47.7C570.8 168.1 464.2 96 320 96S69.2 168.1 19.1 218.6c-12.5 12.6-14.6 31.5-7.4 47.7z"/>
      </svg>
    </button>
  </div>
`;

    const webcamButton = document.getElementById("start-video");
    const startButton = document.getElementById("start-voice");
    const joinButton = document.getElementById("join-voice");
    const leaveButton = document.getElementById("leave-voice");
    const idInput = document.getElementById("callID");
    const localStreamDiv = document.getElementById("localVideo");
    const remoteStreamDiv = document.getElementById("remoteVideo");

    // v WEBRTC v

    const pc = new RTCPeerConnection({
        iceServers: [
            {
                urls: [
                    "stun:stun.services.mozilla.com",
                    "stun:stun.l.google.com:19302",
                    "stun:stun1.l.google.com:19302",
                    "stun:stun3.l.google.com:19302",
                    "stun:stun4.l.google.com:19302",
                    "stun:stun.ekiga.net",
                ],
            },
        ],
        iceCandidatePoolSize: 10,
    });

    let localStream = null;
    let remoteStream = null;

    async function startWebcam() {
        localStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
        });

        localStream.getTracks().forEach((track) => {
            pc.addTrack(track, localStream);
        });

        remoteStream = new MediaStream();

        pc.ontrack = (event) => {
            event.streams[0].getTracks().forEach((track) => {
                remoteStream.addTrack(track);
                console.log(track);
            });
        };

        localStreamDiv.srcObject = localStream;
        remoteStreamDiv.srcObject = remoteStream;
    }

    async function createCall() {
        const id = Math.floor(100000 + Math.random() * 900000);
        console.log(id);
        const callDoc = doc(collection(db, "calls"), `${id}`);

        const offerCandidates = collection(callDoc, "offerCandidates");
        const answerCandidates = collection(callDoc, "answerCandidates");

        idInput.value = callDoc.id;

        pc.onicecandidate = (event) => {
            event.candidate &&
                addDoc(offerCandidates, event.candidate.toJSON());
        };

        const offerDescription = await pc.createOffer();
        await pc.setLocalDescription(offerDescription);

        const offer = {
            sdp: offerDescription.sdp,
            type: offerDescription.type,
        };

        await setDoc(callDoc, {
            offer,
        });

        onSnapshot(callDoc, (snapshot) => {
            const data = snapshot.data();
            if (!pc.currentRemoteDescription && data?.answer) {
                const answerDescription = new RTCSessionDescription(
                    data.answer
                );
                pc.setRemoteDescription(answerDescription);
            }
        });

        onSnapshot(answerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const candidate = new RTCIceCandidate(change.doc.data());
                    pc.addIceCandidate(candidate);
                }
            });
        });
    }

    async function joinCall() {
        const callID = idInput.value;
        const callDoc = doc(collection(db, "calls"), callID);
        const offerCandidates = collection(callDoc, "offerCandidates");
        const answerCandidates = collection(callDoc, "answerCandidates");

        pc.onicecandidate = (event) => {
            event.candidate &&
                addDoc(answerCandidates, event.candidate.toJSON());
        };

        const callData = (await getDoc(callDoc)).data();

        const offerDescription = callData.offer;
        await pc.setRemoteDescription(
            new RTCSessionDescription(offerDescription)
        );

        const answerDescription = await pc.createAnswer();
        await pc.setLocalDescription(answerDescription);

        const answer = {
            type: answerDescription.type,
            sdp: answerDescription.sdp,
        };

        setDoc(callDoc, { answer });

        onSnapshot(offerCandidates, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    let data = change.doc.data();
                    pc.addIceCandidate(new RTCIceCandidate(data));
                }
            });
        });
    }

    webcamButton.onclick = async () => {
        try {
            await startWebcam();
            startButton.disabled = false;
            joinButton.disabled = false;
        } catch (error) {
            alert("An error occured, please report this to " + server.manager);
            console.error(error);
        }
    };

    startButton.onclick = async () => {
        try {
            await createCall();
            leaveButton.disabled = false;
        } catch (error) {
            alert("An error occured, please report this to " + server.manager);
            console.error(error);
        }
    };

    joinButton.onclick = async () => {
        try {
            await joinCall();
            leaveButton.disabled = false;
        } catch (error) {
            alert("An error occured, please report this to " + server.manager);
            console.error(error);
        }
    };

    leaveButton.onclick = async () => {
        try {
            location.reload();
        } catch (error) {
            alert("An error occured, please report this to " + server.manager);
            console.error(error);
        }
    };
}

// Check for version, auth then show messsages/voice

if (info.version == clientVersion) {
    if (auth.currentUser) {
        if (urlParams.get("channel") == "voice") {
            loadVoice();
        } else {
            loadData();
        }
    } else {
        const messageElement = document.createElement("div");
        messageElement.className = "message";
        messageElement.innerHTML = `
        <div style="display: flex;">
            <div style="height: 60px;display: flex;align-items: center;">
                <img src="https://em-content.zobj.net/source/apple/391/robot_1f916.png" class="message-pfp">
            </div>
            <div>
                <div class="message-sender">
                    <span style="color: #ffff00">Bot <svg xmlns="http://www.w3.org/2000/svg" style="fill: #ffff00;" viewBox="0 0 24 24" ><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                    <span class="message-time">00:00</span></span>
                </div>
                <span class="message-content">You are not signed in. You will not be able to view, send, or interact with messages until you update.<br><button id="sign-in" class="sign-in">Sign in</button><br>Don't have an account? Contact a developer!</span>
            </div>
        </div>
        `;
        messagesDiv.appendChild(messageElement);

        document
            .querySelector("#sign-in")
            .addEventListener("click", function (event) {
                overlayForm.style.display = "flex";

                const formElement = document.createElement("div");
                formElement.className = "overlay-form";
                formElement.innerHTML = `
                <div class="overlay-form-content">
                    <h1>Sign In</h1>
                    <p>Please enter your username and password</p>
                </div>
                <div class="overlay-form-questions">
                    <h2>Username</h2>
                    <input id="form-username" type="text" />
                    <h2>Password</h2>
                    <input id="form-password" type="password" />
                </div>
                <div class="overlay-form-confirm">
                    <button id="button-exit">Cancel</button>
                    <button id="button-confirm">Sign-In</button>
                </div>
                `;
                overlayForm.appendChild(formElement);

                document
                    .querySelector("#button-exit")
                    .addEventListener("click", () => {
                        formElement.remove();
                        overlayForm.style.display = "none";
                    });

                document
                    .querySelector("#button-confirm")
                    .addEventListener("click", () => {
                        const username =
                            document.querySelector("#form-username").value;
                        const password =
                            document.querySelector("#form-password").value;

                        formElement.remove();
                        overlayForm.style.display = "none";

                        signInWithEmailAndPassword(
                            auth,
                            username + "@chat.com",
                            password
                        )
                            .then((userCredential) => {
                                console.log(userCredential);
                                window.location.reload();
                            })
                            .catch((error) => {
                                alert(
                                    `An error occured, please send this to a developer:\n${error}`
                                );
                            });
                    });
            });
    }
} else {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.innerHTML = `
    <div style="display: flex;">
        <div style="height: 60px;display: flex;align-items: center;">
            <img src="https://em-content.zobj.net/source/apple/391/robot_1f916.png" class="message-pfp">
        </div>
        <div>
            <div class="message-sender">
                <span style="color: #ffff00">Bot <svg xmlns="http://www.w3.org/2000/svg" style="fill: #ffff00;" viewBox="0 0 24 24" ><path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z"/></svg>
                <span class="message-time">00:00</span></span>
            </div>
            <span class="message-content">You are using an outdated client. You will not be able to view, send, or interact with messages until you update.</span>
        </div>
    </div>
    `;
    messagesDiv.appendChild(messageElement);
}

// Change message input placeholder

messageInput.placeholder = `Message #${channel.name}`;

// Emoji Picker

const pickerOptions = {
    onEmojiSelect: (value) => {
        messageInput.value = messageInput.value + value.native;
    },
    set: "twitter",
    previewPosition: "none",
    navPosition: "bottom",
};
const picker = new EmojiMart.Picker(pickerOptions);
emojiPicker.appendChild(picker);
emojiPicker.style.display = "none";

emojiIcon.addEventListener("click", async (e) => {
    if (window.getComputedStyle(emojiPicker).display == "none") {
        emojiPicker.style.display = "block";
    } else if (window.getComputedStyle(emojiPicker).display == "block") {
        emojiPicker.style.display = "none";
    }
});

// File Upload

fileUpload.onchange = () => {
    messageInput.value = "&file&";
};

// GIF Picker

gifIcon.addEventListener("click", async (e) => {
    fetch(
        `https://tenor.googleapis.com/v2/search?q=${messageInput.value}&key=AIzaSyAA3cmMrIrv4T2QgdiyIsHF3lx8llmLy6U&client_key=my_test_app&limit=1`,
        { method: "GET" }
    )
        .then((response) => response.json())
        .then((response) => {
            messageInput.value = `image:${response.results[0].media_formats.gif.url}`;
        })
        .catch((err) => console.error(err));
});

// Edit user information

editSettings.addEventListener("click", async (e) => {
    overlayForm.style.display = "flex";

    const formElement = document.createElement("div");
    formElement.className = "overlay-form";
    formElement.innerHTML = `
    <div class="overlay-form-content">
        <h1>Settings</h1>
        <p>TIP: Leave the form blank to not change that field</p>
    </div>
    <div class="overlay-form-questions">
        <h2>Username</h2>
        <input id="form-name" placeholder="${localStorage.getItem("name")}" />
        <h2>Colour</h2>
        <input id="form-colour" placeholder="${localStorage.getItem("colour")}" />
    </div>
    <div class="overlay-form-confirm">
        <button id="button-exit">Cancel</button>
        <button id="button-confirm">Confirm</button>
    </div>
    `;
    overlayForm.appendChild(formElement);

    document.querySelector("#button-exit").addEventListener("click", () => {
        formElement.remove();
        overlayForm.style.display = "none";
    });

    document
        .querySelector("#button-confirm")
        .addEventListener("click", async () => {
            const name = document.querySelector("#form-name").value;
            const colour = document.querySelector("#form-colour").value;

            if (name) {
                localStorage.setItem("name", name);
            }
            if (colour) {
                localStorage.setItem("colour", colour);
            }

            const onlineDocSnapshot = await getDoc(onlineDocRef);
            const onlineDocData = onlineDocSnapshot.exists()
                ? onlineDocSnapshot.data()
                : [];

            if (onlineDocData.people && onlineDocData.people.includes(name)) {
                const index = onlineDocData.people.indexOf(name);
                if (index > -1) {
                    onlineDocData.people.splice(index, 1);
                }

                await setDoc(onlineDocRef, { people: onlineDocData.people });
            }

            formElement.remove();
            overlayForm.style.display = "none";
            window.location.reload();
        });
});

// Show whos typing

const typingDocRef = doc(db, `${server.id}/channels/${channel.name}`, "typing");

onSnapshot(typingDocRef, (doc) => {
    if (doc.data()) {
        if (doc.data().people.length !== 0) {
            document.querySelector(".typing-indicator").innerHTML =
                `
            <div>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path d="M256 116a52 52 0 1 1 0-104 52 52 0 1 1 0 104zm0 364a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM448 288a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM32 256a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm399.4-96.2A56 56 0 1 1 352.2 80.6a56 56 0 1 1 79.2 79.2zM97.6 414.4a32 32 0 1 1 45.3-45.3A32 32 0 1 1 97.6 414.4zm271.5 0a32 32 0 1 1 45.3-45.3 32 32 0 1 1 -45.3 45.3zM86.3 86.3a48 48 0 1 1 67.9 67.9A48 48 0 1 1 86.3 86.3z"/>
                </svg>
            </div>` +
                `<div>
                <span style="font-weight:bold">${doc.data().people}</span> is typing...
            </div>`;
        }
        if (doc.data().people.length === 0) {
            document.querySelector(".typing-indicator").innerHTML = ``;
        }
    }
});

// Typing indicator

let typingTimeout;

messageInput.addEventListener("input", async (e) => {
    const name = localStorage.getItem("name");

    const typingDocSnapshot = await getDoc(typingDocRef);
    const typingDocData = typingDocSnapshot.exists()
        ? typingDocSnapshot.data()
        : {};

    const peopleList = typingDocData.people ? typingDocData.people : [];
    if (peopleList.includes(name)) return;
    peopleList.push(name);

    await setDoc(typingDocRef, { people: peopleList });

    // Reset the timeout
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(async () => {
        const currentDocSnapshot = await getDoc(typingDocRef);
        const currentDocData = currentDocSnapshot.exists()
            ? currentDocSnapshot.data()
            : {};

        if (currentDocData.people && currentDocData.people.includes(name)) {
            const index = currentDocData.people.indexOf(name);
            if (index > -1) {
                currentDocData.people.splice(index, 1);
            }

            await setDoc(typingDocRef, { people: currentDocData.people });
        }
    }, 10000);
});

// Send Message

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (urlParams.get("voice-channel")) {
        return;
    }
    console.log("form submitted");
    const name = localStorage.getItem("name");
    const message = messageInput.value;
    const color = localStorage.getItem("colour");
    const ip = await fetch("https://api.ipify.org/?format=json")
        .then((response) => response.json())
        .then((data) => {
            return data.ip;
        });

    messageInput.value = "";
    if (info.version == clientVersion) {
        if (auth.currentUser) {
            if (name === "") {
                name = "Unnamed_User";
            }

            // File Uploading

            if (fileUpload.files[0]) {
                const file = fileUpload.files[0];
                const fileName = `file_${Math.random()
                    .toString(36)
                    .replace("0.", "")}.jpg`;
                const storageRef = ref(storage, fileName);

                uploadBytes(storageRef, file).then((snapshot) => {
                    getDownloadURL(storageRef)
                        .then(async (url) => {
                            await addDoc(messageRef, {
                                user: {
                                    auth: {
                                        id: auth.currentUser.uid,
                                        ip: ip,
                                        userAgent: navigator.userAgent,
                                    },
                                    bot: false,
                                    verified:
                                        localStorage.getItem("verified") ==
                                        "true"
                                            ? true
                                            : false,
                                    colour: color,
                                    name: name,
                                },
                                message: {
                                    content: `image:${url}`,
                                },
                                timestamp: new Date(),
                            });
                        })
                        .catch((error) => {
                            console.log("Error getting image URL:", error);
                        });
                });

                fileUpload.value = null;
                return;
            }

            // Check Message

            if (message === "" || color === "") {
                alert("Messages cannot be empty!");
                return;
            }
            if (message.length > 175) {
                alert("Messages cannot be longer than 175 characters!");
                return;
            }
            if (message.includes("<") || message.includes(">")) {
                alert("Messages cannot include '<' or '>'!");
                return;
            }

            // Bot Commands

            if (message.startsWith("/")) {
                if (channel.name.includes("bot")) {
                    if (message.startsWith("/verify")) {
                        if (
                            info.codes.includes(message.replace("/verify ", ""))
                        ) {
                            localStorage.setItem("verified", true);
                            alert("You are now Verified");
                        } else {
                            alert("Invalid Verification Code");
                        }
                        return;
                    }
                    if (message.startsWith("/random")) {
                        await addDoc(messageRef, {
                            user: {
                                auth: {
                                    id: auth.currentUser.uid,
                                    ip: ip,
                                    userAgent: navigator.userAgent,
                                },
                                bot: true,
                                verified:
                                    localStorage.getItem("verified") == "true"
                                        ? true
                                        : false,
                                colour: color,
                                name: name,
                            },
                            message: {
                                content: `${Math.floor(Math.random() * 100)}`,
                                command: message,
                            },
                            timestamp: new Date(),
                        });
                        return;
                    }
                    if (message.startsWith("/test")) {
                        if (localStorage.getItem("verified") == "true") {
                            await addDoc(messageRef, {
                                user: {
                                    auth: {
                                        id: auth.currentUser.uid,
                                        ip: ip,
                                        userAgent: navigator.userAgent,
                                    },
                                    bot: true,
                                    verified:
                                        localStorage.getItem("verified") ==
                                        "true"
                                            ? true
                                            : false,
                                    colour: color,
                                    name: name,
                                },
                                message: {
                                    content: `embed:test`,
                                    command: message,
                                },
                                timestamp: new Date(),
                            });
                        } else {
                            alert("No permission");
                        }
                        return;
                    }
                    if (message.startsWith("/coinflip")) {
                        await addDoc(messageRef, {
                            user: {
                                auth: {
                                    id: auth.currentUser.uid,
                                    ip: ip,
                                    userAgent: navigator.userAgent,
                                },
                                bot: true,
                                verified:
                                    localStorage.getItem("verified") == "true"
                                        ? true
                                        : false,
                                colour: color,
                                name: name,
                            },
                            message: {
                                content: `embed:${
                                    (Math.floor(Math.random() * 2) == 0) == true
                                        ? "🪙 Heads"
                                        : "🪙 Tails"
                                }`,
                                command: message,
                            },
                            timestamp: new Date(),
                        });
                    }
                    if (message.startsWith("/slots")) {
                        if (message.replace("/slots ", "") != "/slots") {
                            let slots1 =
                                slots[Math.floor(Math.random() * slots.length)];
                            let slots2 =
                                slots[Math.floor(Math.random() * slots.length)];
                            let slots3 =
                                slots[Math.floor(Math.random() * slots.length)];
                            var status;
                            if (
                                slots1 == slots2 &&
                                slots2 == slots3 &&
                                slots3 == slots1
                            ) {
                                status =
                                    "omg u made like " +
                                    parseInt(message.replace("/slots ", "")) *
                                        10 +
                                    " moneys wow gg bro";
                            } else if (
                                slots1 == slots2 ||
                                slots2 == slots3 ||
                                slots3 == slots1
                            ) {
                                status =
                                    "u made " +
                                    parseInt(message.replace("/slots ", "")) *
                                        3 +
                                    " moneys gg";
                            } else {
                                status =
                                    "u lost " +
                                    message.replace("/slots ", "") +
                                    " moneys lol";
                            }
                            await addDoc(messageRef, {
                                user: {
                                    auth: {
                                        id: auth.currentUser.uid,
                                        ip: ip,
                                        userAgent: navigator.userAgent,
                                    },
                                    bot: true,
                                    verified:
                                        localStorage.getItem("verified") ==
                                        "true"
                                            ? true
                                            : false,
                                    colour: color,
                                    name: name,
                                },
                                message: {
                                    content: `embed:${status}\\n${slots1} | ${slots2} | ${slots3}`,
                                    command: message,
                                },
                                timestamp: new Date(),
                            });
                            return;
                        } else {
                            alert("Invalid Bet Amount");
                        }
                    }
                    if (message.startsWith("/joke")) {
                        await fetch("https://icanhazdadjoke.com/", {
                            headers: {
                                Accept: "application/json",
                            },
                        })
                            .then((response) => response.json())
                            .then(async (data) => {
                                await addDoc(messageRef, {
                                    user: {
                                        auth: {
                                            id: auth.currentUser.uid,
                                            ip: ip,
                                            userAgent: navigator.userAgent,
                                        },
                                        bot: true,
                                        verified:
                                            localStorage.getItem("verified") ==
                                            "true"
                                                ? true
                                                : false,
                                        colour: color,
                                        name: name,
                                    },
                                    message: {
                                        content: `${data.joke}`,
                                        command: message,
                                    },
                                    timestamp: new Date(),
                                });
                            })
                            .catch(async (error) => {
                                await addDoc(messageRef, {
                                    user: {
                                        auth: {
                                            id: auth.currentUser.uid,
                                            ip: ip,
                                            userAgent: navigator.userAgent,
                                        },
                                        bot: true,
                                        verified:
                                            localStorage.getItem("verified") ==
                                            "true"
                                                ? true
                                                : false,
                                        colour: color,
                                        name: name,
                                    },
                                    message: {
                                        content: `Unable to fetch API: ${error}`,
                                        command: message,
                                    },
                                    timestamp: new Date(),
                                });
                            });
                        return;
                    }
                    if (message.startsWith("/fact")) {
                        await fetch(
                            "https://uselessfacts.jsph.pl/api/v2/facts/random",
                            {
                                headers: {
                                    Accept: "application/json",
                                },
                            }
                        )
                            .then((response) => response.json())
                            .then(async (data) => {
                                await addDoc(messageRef, {
                                    user: {
                                        auth: {
                                            id: auth.currentUser.uid,
                                            ip: ip,
                                            userAgent: navigator.userAgent,
                                        },
                                        bot: true,
                                        verified:
                                            localStorage.getItem("verified") ==
                                            "true"
                                                ? true
                                                : false,
                                        colour: color,
                                        name: name,
                                    },
                                    message: {
                                        content: `${data.text.replace("`", "'")}`,
                                        command: message,
                                    },
                                    timestamp: new Date(),
                                });
                            })
                            .catch(async (error) => {
                                await addDoc(messageRef, {
                                    user: {
                                        auth: {
                                            id: auth.currentUser.uid,
                                            ip: ip,
                                            userAgent: navigator.userAgent,
                                        },
                                        bot: true,
                                        verified:
                                            localStorage.getItem("verified") ==
                                            "true"
                                                ? true
                                                : false,
                                        colour: color,
                                        name: name,
                                    },
                                    message: {
                                        content: `Unable to fetch API: ${error}`,
                                        command: message,
                                    },
                                    timestamp: new Date(),
                                });
                            });
                        return;
                    } else {
                        return;
                    }
                } else {
                    alert("Please use #bot-spam");
                }
            }

            // Anonymous Channel

            if (channel == "anonymous") {
                try {
                    await addDoc(messageRef, {
                        user: {
                            auth: {
                                id: null,
                                ip: null,
                                userAgent: null,
                            },
                            bot: false,
                            verified: false,
                            colour: `#${Math.floor(
                                Math.random() * 16777215
                            ).toString(16)}`,
                            name: "Anonymous",
                        },
                        message: {
                            content: message,
                        },
                        timestamp: new Date(),
                    });
                } catch (error) {
                    console.error("Error adding document: ", error);
                }
                return;
            }

            // Main

            try {
                await addDoc(messageRef, {
                    user: {
                        auth: {
                            id: auth.currentUser.uid,
                            ip: ip,
                            userAgent: navigator.userAgent,
                        },
                        bot: false,
                        verified:
                            localStorage.getItem("verified") == "true"
                                ? true
                                : false,
                        colour: color,
                        name: name,
                    },
                    message: {
                        content: message,
                    },
                    timestamp: new Date(),
                });
            } catch (error) {
                console.error("Error adding document: ", error);
            }
        }
    }
    const currentDocSnapshot = await getDoc(typingDocRef);
    const currentDocData = currentDocSnapshot.exists()
        ? currentDocSnapshot.data()
        : {};

    if (currentDocData.people && currentDocData.people.includes(name)) {
        const index = currentDocData.people.indexOf(name);
        if (index > -1) {
            currentDocData.people.splice(index, 1);
        }

        await setDoc(typingDocRef, { people: currentDocData.people });
    }
});
