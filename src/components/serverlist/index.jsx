import { useState, useEffect } from "react";
import styles from "./serverlist.module.css";

import firebaseConfig from "../../firebaseconf.jsx";
import {
    getFirestore,
    doc,
    collection,
    getDoc,
    getDocs,
} from "firebase/firestore";
import { useChat } from "../../chatcontext";

const database = getFirestore(firebaseConfig);

export function ServerList() {
    const { changeServer, changeChannel } = useChat();
    const [serverList, setServerList] = useState([]);
    const [infoDoc, setInfoDoc] = useState({});

    const getInfoDoc = async () => {
        const infoRef = doc(database, "info", "info");
        const infoData = (await getDoc(infoRef)).data();
        return infoData || {};
    };

    const getServerList = async () => {
        const serverCollectionRef = collection(
            database,
            `info/servers/servers`
        );
        const serverDocs = await getDocs(serverCollectionRef);
        const serverData = serverDocs.docs.map((doc) => doc.data());

        return serverData || [];
    };

    useEffect(() => {
        const fetchData = async () => {
            const infoData = await getInfoDoc();
            setInfoDoc(infoData);

            const serverData = await getServerList();
            setServerList(serverData);
        };
        fetchData();
    }, []);

    return (
        <div className={styles["server-sidebar"]} id="server-list">
            <div
                className={styles["server-sidebar-icon"]}
                key="dms"
                onClick={() => {
                    changeServer("dms");
                    changeChannel("");
                }}
            >
                <img src={infoDoc.appIcon} alt={`DMs`} />
            </div>
            {serverList.map((server) => (
                <div
                    className={styles["server-sidebar-icon"]}
                    key={server.config.id}
                    onClick={() => {
                        changeServer(server.config.id);
                        changeChannel(server.config.mainchannel);
                    }}
                >
                    <img src={server.info.icon} alt={server.info.name} />
                </div>
            ))}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 448 512"
                id="addServer"
                className={styles["server-sidebar-plus"]}
            >
                <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32v144H48c-17.7 0-32 14.3-32 32s14.3 32 32 32h144v144c0 17.7 14.3 32 32 32s32-14.3 32-32V288h144c17.7 0 32-14.3 32-32s-14.3-32-32-32H256z" />
            </svg>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                id="findServer"
                className={styles["server-sidebar-plus"]}
            >
                <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z" />
            </svg>
        </div>
    );
}
