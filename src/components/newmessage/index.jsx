import { useState, useEffect } from "react";
import styles from "./newmessage.module.css";

import firebaseConfig from "../../firebaseconf.jsx";
import {
    getFirestore,
    doc,
    collection,
    getDoc,
    getDocs,
    addDoc,
    setDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { useChat } from "../../chatcontext";
import { handleCommand } from "./commands";

const database = getFirestore(firebaseConfig);
const auth = getAuth(firebaseConfig);

export function NewMessage() {
    const [user] = useAuthState(auth);
    const { currentServer, currentChannel } = useChat();
    const [message, setMessage] = useState("");
    const [moreChannelInfo, setMoreChannelInfo] = useState({});

    const getMoreChannelInfo = async () => {
        if (!currentServer || !currentChannel) {
            return;
        }

        if (currentServer === "dms") {
            const usersRef = collection(database, `info/users/users`);
            const userDoc = doc(usersRef, currentChannel);
            const usersData = (await getDoc(userDoc)).data();

            setMoreChannelInfo({ type: "user", data: usersData });
        } else {
            const serverRef = collection(database, "info/servers/servers");
            const serverDoc = doc(serverRef, currentServer);
            const serverData = (await getDoc(serverDoc)).data();

            setMoreChannelInfo({
                type: "channel",
                data: serverData.channels.find(
                    (c) => c.name === currentChannel
                ),
            });
        }
    };

    useEffect(() => {
        getMoreChannelInfo();
    }, [currentChannel, currentServer]);

    const sendMessage = async (e) => {
        e.preventDefault();

        if (!message) {
            setMessage("");
            return
        }

        let content;
        let bot = false;
        let embed = false;
        let command;

        if (message.startsWith("/")) {
            let getCommand = await handleCommand(message);
            bot = true;
            if (getCommand.type === "text") {
                content = getCommand.res;
            }
            if (getCommand.type === "embed") {
                embed = true;
                content = getCommand.res;
            }
            command = message;
        } else {
            content = message;
        }

        setMessage("");

        if (currentServer == "dms" && currentChannel) {
            if (currentChannel == user.uid) {
                return;
            }

            const dmsCollection = collection(
                database,
                `dms/${[user.uid, currentChannel].sort().join("-")}/messages`
            );

            await addDoc(dmsCollection, {
                bot: bot ? true : false,
                message: {
                    command: bot ? command : null,
                    content: embed ? null : `${content}`,
                    embed: embed ? content : null,
                },
                timestamp: new Date(),
                uid: user.uid,
            });
        } else if (currentServer && currentChannel) {
            const channelCollection = collection(
                database,
                `${currentServer}/channels/${currentChannel}`
            );

            await addDoc(channelCollection, {
                bot: bot ? true : false,
                message: {
                    command: bot ? command : null,
                    content: embed ? null : `${content}`,
                    embed: embed ? content : null,
                },
                timestamp: new Date(),
                uid: user.uid,
            });
        }
    };

    return (
        <form
            className={styles["create"]}
            onSubmit={sendMessage}
            autoComplete="off"
        >
            <div className={styles["typing-indicator"]}></div>
            <div className={styles["message-create-button"]} id="file-upload">
                <label htmlFor="fileUpload">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                        id="file-upload-icon"
                    >
                        <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM232 344V280H168c-13.3 0-24-10.7-24-24s10.7-24 24-24h64V168c0-13.3 10.7-24 24-24s24 10.7 24 24v64h64c13.3 0 24 10.7 24 24s-10.7 24-24 24H280v64c0 13.3-10.7 24-24 24s-24-10.7-24-24z" />
                    </svg>
                </label>
                <input
                    type="file"
                    id="fileUpload"
                    style={{ display: "none" }}
                    accept="image/*"
                />
            </div>
            <input
                className={styles["message-create"]}
                id="created-message"
                placeholder={
                    currentChannel
                        ? moreChannelInfo != null
                            ? Object.keys(moreChannelInfo).length !== 0
                                ? moreChannelInfo.type == "user"
                                    ? "Message @" +
                                      moreChannelInfo.data.account.username
                                    : "Message #" + moreChannelInfo.data.name
                                : "Message nobody"
                            : "Message nobody"
                        : "Message nobody"
                }
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                autoFocus
            />
            <div className={styles["message-create-button"]} id="gif-picker">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 576 512"
                    id="gif-picker-icon"
                >
                    <path d="M0 96C0 60.7 28.7 32 64 32H512c35.3 0 64 28.7 64 64V416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96zm296 64c-13.3 0-24 10.7-24 24V328c0 13.3 10.7 24 24 24s24-10.7 24-24V184c0-13.3-10.7-24-24-24zm56 24v80 64c0 13.3 10.7 24 24 24s24-10.7 24-24V288h40c13.3 0 24-10.7 24-24s-10.7-24-24-24H400V208h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H376c-13.3 0-24 10.7-24 24zM128 256c0-26.5 21.5-48 48-48c8 0 15.4 1.9 22 5.3c11.8 6.1 26.3 1.5 32.3-10.3s1.5-26.3-10.3-32.3c-13.2-6.8-28.2-10.7-44-10.7c-53 0-96 43-96 96s43 96 96 96c19.6 0 37.5-6.1 52.8-15.8c7-4.4 11.2-12.1 11.2-20.3V264c0-13.3-10.7-24-24-24H184c-13.3 0-24 10.7-24 24s10.7 24 24 24h8v13.1c-5.3 1.9-10.6 2.9-16 2.9c-26.5 0-48-21.5-48-48z" />
                </svg>
            </div>
            <div className={styles["message-create-button"]} id="emoji-picker">
                <div
                    className={styles["emoji-picker-div"]}
                    id="emoji-picker-div"
                ></div>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    id="emoji-picker-icon"
                >
                    <path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zm203.5-95.6c-5.6 9.4-15.8 15.6-27.5 15.6c-17.7 0-32-14.3-32-32c0-9.1 3.8-17.4 10-23.2c-3.3-.5-6.6-.8-10-.8c-35.3 0-64 28.7-64 64v10.3c0 16.4 13.3 29.7 29.7 29.7h68.6c16.4 0 29.7-13.3 29.7-29.7V184c0-8.3-1.6-16.3-4.5-23.6zM384 176c-17.7 0-32-14.3-32-32c0-8.5 3.3-16.3 8.8-22c-5.4-1.3-11-2-16.8-2c-39.8 0-72 32.2-72 72v7.5c0 13.5 11 24.5 24.5 24.5h95.1c13.5 0 24.5-11 24.5-24.5V192c0-10.4-2.2-20.2-6.1-29.1c-5.8 8-15.2 13.1-25.9 13.1zM245.5 447.8c2.7 .1 5.4 .2 8.1 .2h4.9c55.1 0 105.1-26.1 137-67.5c0 0 0 0 0 0c15.7-20.5 27-44.6 32.4-71.3c2.2-11-6.2-21.2-17.4-21.2h0H101.6h0c-11.2 0-19.6 10.2-17.4 21.2c15.6 78.1 82.4 135 161.2 138.6zm-5.4-32.5c1.5-44.1 37.8-79.4 82.2-79.4c19.9 0 38.1 7 52.3 18.7C349 392.1 306.1 416 258.4 416h-4.9c-4.6 0-9.1-.2-13.5-.6z" />
                </svg>
            </div>
        </form>
    );
}
