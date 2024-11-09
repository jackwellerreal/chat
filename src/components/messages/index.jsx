import { useState, useEffect } from "react";
import styles from "./messages.module.css";

import moment from "moment";

import firebaseConfig from "../../firebaseconf.jsx";
import {
    getFirestore,
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    onSnapshot,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { ProfilePicture } from "../profilepicture";
import { MessageFormat } from "./format/message";
import { EmbedFormat } from "./format/embed";

import { useChat } from "../../chatcontext";

const database = getFirestore(firebaseConfig);
const auth = getAuth(firebaseConfig);

export function Messages() {
    const [user] = useAuthState(auth);
    const { currentServer, currentChannel } = useChat();
    const [messages, setMessages] = useState({});
    const [usersList, setUsersList] = useState([]);
    const [moreChannelInfo, setMoreChannelInfo] = useState({});

    const fetchMessagesRealTime = (server, channel) => {
        let collectionRef;

        if (server === "dms") {
            collectionRef = collection(
                database,
                `dms/${[user.uid, channel].sort().join("-")}/messages`
            );
        } else {
            collectionRef = collection(
                database,
                `${server}/channels/${channel}`
            );
        }

        const orderedQuery = query(collectionRef, orderBy("timestamp", "desc"));

        return onSnapshot(orderedQuery, (snapshot) => {
            const messages = {};
            snapshot.forEach((doc) => {
                if (doc.id !== "typing") {
                    messages[doc.id] = doc.data();
                }
            });
            setMessages(messages);
        });
    };

    const getUsers = async () => {
        const userCollectionRef = collection(database, `info/users/users`);
        const userDocs = await getDocs(userCollectionRef);
        const userData = userDocs.docs.map((doc) => doc.data());
        setUsersList(userData || []);
    };

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
        const unsubscribe = fetchMessagesRealTime(
            currentServer,
            currentChannel
        );

        return () => unsubscribe();
    }, [currentServer, currentChannel]);

    useEffect(() => {
        getUsers();
    }, []);

    useEffect(() => {
        getMoreChannelInfo();
    }, [currentServer, currentChannel]);

    return (
        <div className={styles["messages"]} id="messages">
            {Object.keys(messages).map((messageId) => {
                const message = messages[messageId];
                const user = usersList.find(
                    (user) => user.account.uid === message.uid
                );

                const momentObj = moment.unix(message.timestamp.seconds);
                const today = moment().startOf("day");
                const yesterday = moment().subtract(1, "days").startOf("day");

                let time;
                if (momentObj.isSame(today, "day")) {
                    time = "Today at " + momentObj.format("HH:mm");
                } else if (momentObj.isSame(yesterday, "day")) {
                    time = "Yesterday at " + momentObj.format("HH:mm");
                } else {
                    time = momentObj.format("DD/MM/YYYY HH:mm");
                }

                return (
                    <div key={messageId} className={styles["message"]}>
                        <div className={styles["message-pfp"]}>
                            <ProfilePicture
                                name={user.profile.displayname}
                                color={user.profile.color}
                            />
                        </div>
                        <div>
                            <div className={styles["message-sender"]}>
                                <span
                                    style={{
                                        color: user.profile.color,
                                    }}
                                    title={`@${user.profile.displayname}`}
                                >
                                    {user.profile.displayname}
                                </span>
                                {user.profile.verified && (
                                    <div
                                        className={
                                            styles["message-sender-verified"]
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ fill: user.profile.color }}
                                            viewBox="0 0 24 24"
                                        >
                                            <title>Verified</title>
                                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                                        </svg>
                                    </div>
                                )}
                                {user.account.admin && (
                                    <div
                                        className={
                                            styles["message-sender-verified"]
                                        }
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ fill: user.profile.color }}
                                            viewBox="0 0 640 512"
                                        >
                                            <title>Admin</title>
                                            <path d="M256 0c4.6 0 9.2 1 13.4 2.9L457.7 82.8c22 9.3 38.4 31 38.3 57.2c-.5 99.2-41.3 280.7-213.6 363.2c-16.7 8-36.1 8-52.8 0C57.3 420.7 16.5 239.2 16 140c-.1-26.2 16.3-47.9 38.3-57.2L242.7 2.9C246.8 1 251.4 0 256 0zm0 66.8l0 378.1C394 378 431.1 230.1 432 141.4L256 66.8s0 0 0 0z" />
                                        </svg>
                                    </div>
                                )}
                                <span className={styles["message-time"]}>
                                    {time}
                                </span>
                            </div>
                            <span className={styles["message-content"]}>
                                <MessageFormat
                                    message={message.message.content}
                                    server={currentServer}
                                />
                                {message.message.embed ? (
                                    <EmbedFormat
                                        embed={message.message.embed}
                                    />
                                ) : (
                                    ""
                                )}
                            </span>
                        </div>
                    </div>
                );
            })}
            {currentChannel ? (
                moreChannelInfo != null ? (
                    Object.keys(moreChannelInfo).length !== 0 ? (
                        moreChannelInfo.type == "user" ? (
                            <div className={styles["greating"]}>
                                <p className={styles["greeting-title"]}>
                                    You are messaging @
                                    {moreChannelInfo.data.account.username}
                                </p>
                                <p className={styles["greeting-desc"]}>
                                    Welcome to your conversation with{" "}
                                    {moreChannelInfo.data.profile.displayname}
                                </p>
                            </div>
                        ) : (
                            <div className={styles["greating"]}>
                                <p className={styles["greeting-title"]}>
                                    Welcome to #{moreChannelInfo.data.name}
                                </p>
                                <p className={styles["greeting-desc"]}>
                                    {moreChannelInfo.data.description}
                                </p>
                            </div>
                        )
                    ) : (
                        ""
                    )
                ) : (
                    ""
                )
            ) : (
                ""
            )}
        </div>
    );
}
