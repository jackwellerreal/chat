import { useState, useEffect } from "react";
import styles from "./channellist.module.css";

import firebaseConfig from "../../firebaseconf.jsx";
import {
    getFirestore,
    doc,
    collection,
    getDoc,
    getDocs,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

import { ProfilePicture } from "../profilepicture";

import { useChat } from "../../chatcontext";

const database = getFirestore(firebaseConfig);
const auth = getAuth(firebaseConfig);

export function ChannelList() {
    const [user] = useAuthState(auth);
    const { currentServer, currentChannel, changeChannel } = useChat();
    const [currentServerDoc, setCurrentServerDoc] = useState({});
    const [usersList, setUsersList] = useState([]);

    const getServerDoc = async (serverId) => {
        const serverRef = doc(database, "info/servers/servers", serverId);
        const serverDoc = await getDoc(serverRef);
        return serverDoc.data();
    };

    const getUsers = async (serverId) => {
        const userCollectionRef = collection(database, `info/users/users`);
        const userDocs = await getDocs(userCollectionRef);
        const userData = userDocs.docs.map((doc) => doc.data());

        return userData || [];
    };

    useEffect(() => {
        const fetchData = async () => {
            const serverData = await getServerDoc(currentServer);
            setCurrentServerDoc(serverData);
        };
        fetchData();
    }, [currentServer]);

    useEffect(() => {
        const fetchData = async () => {
            const userData = await getUsers();
            setUsersList(userData);
        };
        fetchData();
    }, []);

    return (
        <div className={styles["channel-sidebar"]}>
            <div>
                {currentServer !== "dms" && currentServerDoc ? (
                    <>
                        <div
                            className={styles["server-banner"]}
                            id={styles["server-banner"]}
                            style={{
                                backgroundImage: `url(${currentServerDoc.info.banner})`,
                                backgroundSize: "cover",
                                backgroundPosition: "center center",
                            }}
                        >
                            <h1 id={styles["server-name"]}>
                                {currentServerDoc.info.name}
                            </h1>
                        </div>
                        <p id={styles["server-description"]}>
                            {currentServerDoc.info.description}
                        </p>
                        <div id={styles["channels"]}>
                            {currentServerDoc.channels &&
                                currentServerDoc.channels.map((channel) => (
                                    <div
                                        key={channel.name}
                                        className={`${styles["channel-sidebar-item"]} ${channel.name == currentChannel ? styles["channels-current"] : ""}`}
                                        onClick={() =>
                                            changeChannel(channel.name)
                                        }
                                    >
                                        <span>
                                            {channel.type === "text" ? (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="16px"
                                                    style={{
                                                        verticalAlign: "-0.2em",
                                                        marginRight: "4px",
                                                    }}
                                                    viewBox="0 0 448 512"
                                                >
                                                    <path d="M424 136l-74.01-.0254l13.63-75.76c2.344-13.03-6.312-25.53-19.38-27.88c-13-2.188-25.5 6.344-27.88 19.38l-15.16 84.26h-111.2l13.63-75.76c2.344-13.03-6.312-25.53-19.38-27.88C171.2 30.15 158.7 38.69 156.4 51.72l-15.16 84.26H56c-13.25 0-24 10.78-24 24.03c0 13.25 10.75 23.97 24 23.97h76.57l-25.92 144H24c-13.25 0-24 10.76-24 24.01C0 365.3 10.75 376 24 376l74.01-.0078l-13.63 75.76c-2.344 13.03 6.312 25.53 19.38 27.88C105.2 479.9 106.6 480 108 480c11.38 0 21.5-8.158 23.59-19.75l15.16-84.26h111.2l-13.63 75.76c-2.344 13.03 6.312 25.53 19.38 27.88C265.2 479.9 266.6 480 268 480c11.38 0 21.5-8.158 23.59-19.75l15.16-84.26L392 376c13.25 0 24-10.75 24-23.1c0-13.25-10.75-24.01-24-24.01h-76.57l25.92-144L424 184c13.25 0 24-10.75 24-23.1C448 146.8 437.3 136 424 136zM266.7 327.1h-111.2l25.92-144h111.2L266.7 327.1z" />
                                                </svg>
                                            ) : (
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    height="16px"
                                                    style={{
                                                        verticalAlign: "-0.2em",
                                                        marginRight: "4px",
                                                    }}
                                                    viewBox="0 0 640 512"
                                                >
                                                    <path d="M533.6 32.5C598.5 85.2 640 165.8 640 256s-41.5 170.7-106.4 223.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C557.5 398.2 592 331.2 592 256s-34.5-142.2-88.7-186.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM473.1 107c43.2 35.2 70.9 88.9 70.9 149s-27.7 113.8-70.9 149c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C475.3 341.3 496 301.1 496 256s-20.7-85.3-53.2-111.8c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zm-60.5 74.5C434.1 199.1 448 225.9 448 256s-13.9 56.9-35.4 74.5c-10.3 8.4-25.4 6.8-33.8-3.5s-6.8-25.4 3.5-33.8C393.1 284.4 400 271 400 256s-6.9-28.4-17.7-37.3c-10.3-8.4-11.8-23.5-3.5-33.8s23.5-11.8 33.8-3.5zM301.1 34.8C312.6 40 320 51.4 320 64V448c0 12.6-7.4 24-18.9 29.2s-25 3.1-34.4-5.3L131.8 352H64c-35.3 0-64-28.7-64-64V224c0-35.3 28.7-64 64-64h67.8L266.7 40.1c9.4-8.4 22.9-10.4 34.4-5.3z" />
                                                </svg>
                                            )}
                                            {channel.name}
                                        </span>
                                    </div>
                                ))}
                        </div>
                    </>
                ) : (
                    <>
                        <div
                            className={styles["server-banner"]}
                            id={styles["server-banner"]}
                            style={{
                                height: "57px",
                                aspectRatio: "initial",
                            }}
                        >
                            <h1 id={styles["server-name"]}>Direct Messages</h1>
                        </div>
                        <div id={styles["channels"]}>
                            {usersList.map((dmUser) => {
                                if (dmUser.account.uid === user.uid) return;

                                return (
                                    <div
                                        key={dmUser.account.uid}
                                        className={`${styles["channel-sidebar-item"]} ${currentChannel == dmUser.account.uid ? styles["channels-current"] : ""}`}
                                        onClick={() =>
                                            changeChannel(dmUser.account.uid)
                                        }
                                    >
                                        <span
                                            className={
                                                styles["channel-sidebar-user"]
                                            }
                                            style={{
                                                color: dmUser.profile.color,
                                            }}
                                        >
                                            <ProfilePicture
                                                name={
                                                    dmUser.profile.displayname
                                                }
                                                color={dmUser.profile.color}
                                            />
                                            {dmUser.profile.displayname}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
