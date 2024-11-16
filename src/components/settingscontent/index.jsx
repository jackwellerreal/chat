import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./settingscontent.module.css";

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

const database = getFirestore(firebaseConfig);
const auth = getAuth(firebaseConfig);

import { ProfilePicture } from "../profilepicture";

export function SettingsContent() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState();

    const getUserInfo = async () => {
        const usersRef = collection(database, `info/users/users`);
        const userDoc = doc(usersRef, auth.currentUser.uid);
        const usersData = (await getDoc(userDoc)).data();

        setCurrentUser(usersData);
    };

    useEffect(() => {
        getUserInfo();
    }, []);

    return (
        <div className={styles["settings"]}>
            <div className={styles["settings-sidebar"]}>
                <div className={styles["settings-sidebar-items"]}>
                    <div className={styles["settings-sidebar-title"]}>
                        User Settings
                    </div>
                    <div className={styles["settings-sidebar-item"]}>
                        My Account
                    </div>
                    <div className={styles["settings-sidebar-item"]}>
                        Security
                    </div>
                </div>
            </div>
            <div className={styles["settings-main"]}>
                <div className={styles["settings-main-card"]}>
                    <div className={styles["settings-main-card-title"]}>
                        {currentUser ? (
                            <ProfilePicture
                                name={currentUser.profile.displayname}
                                color={currentUser.profile.color}
                            />
                        ) : null}
                        <h1>
                            @{currentUser ? currentUser.account.username : null}
                        </h1>
                    </div>
                    <div className={styles["settings-main-card-content"]}>
                        <div className={styles["settings-main-card-item"]}>
                            {currentUser
                                ? currentUser.profile.displayname
                                : null}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
