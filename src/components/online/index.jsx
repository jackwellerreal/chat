import { useState, useEffect } from "react";
import styles from "./online.module.css";

import firebaseConfig from "../../firebaseconf.jsx";
import { getFirestore, doc, getDoc } from "firebase/firestore";

import { ProfilePicture } from "../profilepicture";

const database = getFirestore(firebaseConfig);

export function Online() {
    const [onlineUsers, setOnlineUsers] = useState({});

    const getOnlineUsers = async () => {
        const onlineUsersRef = doc(database, "info", "online");
        const onlineUsersDoc = await getDoc(onlineUsersRef);
        return onlineUsersDoc.data();
    };

    useEffect(() => {
        const fetchData = async () => {
            const onlineUsersData = await getOnlineUsers();
            setOnlineUsers(onlineUsersData);
        };
        fetchData();
    }, []);

    return (
        <div className={styles["online-sidebar"]}>
            <span className={styles["online-title"]} id="online-title">
                Online - 0
            </span>
            <div className={styles["online-list"]} id="online-list">
                {onlineUsers.people &&
                    onlineUsers.people.map((user) => (
                        <div key={user.name} className={styles["online-user"]}>
                            <svg width="32" height="32" viewBox="0 0 32 32">
                                <mask id=":r4:" width="32" height="32">
                                    <circle
                                        cx="16"
                                        cy="16"
                                        r="16"
                                        fill="white"
                                    ></circle>
                                    <rect
                                        color="black"
                                        x="19"
                                        y="19"
                                        width="16"
                                        height="16"
                                        rx="8"
                                        ry="8"
                                    ></rect>
                                </mask>
                                <foreignObject
                                    x="0"
                                    y="0"
                                    width="32"
                                    height="32"
                                    mask="url(#:r4:)"
                                >
                                    <ProfilePicture
                                        name={user.name}
                                        color={user.color}
                                    />
                                </foreignObject>
                                <svg
                                    x="14.5"
                                    y="17"
                                    width="25"
                                    height="15"
                                    viewBox="0 0 25 15"
                                >
                                    <mask id=":r5:">
                                        <rect
                                            x="7.5"
                                            y="5"
                                            width="10"
                                            height="10"
                                            rx="5"
                                            ry="5"
                                            fill="white"
                                        ></rect>
                                        <rect
                                            x="12.5"
                                            y="10"
                                            width="0"
                                            height="0"
                                            rx="0"
                                            ry="0"
                                            fill="black"
                                        ></rect>
                                        <polygon
                                            points="-2.16506,-2.5 2.16506,0 -2.16506,2.5"
                                            fill="black"
                                            transform="scale(0) translate(13.125 10)"
                                        ></polygon>
                                        <circle
                                            fill="black"
                                            cx="12.5"
                                            cy="10"
                                            r="0"
                                        ></circle>
                                    </mask>
                                    <rect
                                        fill="#3BA55C"
                                        width="25"
                                        height="15"
                                        mask="url(#:r5:)"
                                    ></rect>
                                </svg>
                            </svg>
                            <div>
                                <p
                                    style={{
                                        color: user.color,
                                    }}
                                >
                                    {user.name}
                                    {user.verified ? (
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            style={{ fill: user.color }}
                                            className={
                                                styles["online-user-verified"]
                                            }
                                            viewBox="0 0 24 24"
                                        >
                                            <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.9-.81-3.91s-2.52-1.27-3.91-.81c-.66-1.31-1.91-2.19-3.34-2.19s-2.67.88-3.33 2.19c-1.4-.46-2.91-.2-3.92.81s-1.26 2.52-.8 3.91c-1.31.67-2.2 1.91-2.2 3.34s.89 2.67 2.2 3.34c-.46 1.39-.21 2.9.8 3.91s2.52 1.26 3.91.81c.67 1.31 1.91 2.19 3.34 2.19s2.68-.88 3.34-2.19c1.39.45 2.9.2 3.91-.81s1.27-2.52.81-3.91c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2L6.8 12.46l1.41-1.42 2.26 2.26 4.8-5.23 1.47 1.36-6.2 6.77z" />
                                        </svg>
                                    ) : (
                                        ""
                                    )}
                                </p>
                                <p
                                    style={{
                                        fontSize: "14px",
                                        fontWeight: "normal",
                                    }}
                                >
                                    {user.status}
                                </p>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
}
