import styles from "./settings.module.css";
import { useNavigate } from "react-router-dom";

import { MenuBar } from "../../components/menubar/index.jsx";
import { SettingsContent } from "../../components/settingscontent/index.jsx";

import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import firebaseConfig from "../../firebaseconf.jsx";

import loadingImage from "../../assets/icon.png";

const auth = getAuth(firebaseConfig);

export function Settings() {
    const navigate = useNavigate();
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return (
            <>
                <MenuBar />
                <div className={styles["loading"]}>
                    <img src={loadingImage} />
                </div>
            </>
        );
    }

    if (!user) {
        navigate("/signin");
    } else {
        return (
            <>
                <MenuBar />
                <SettingsContent />
            </>
        );
    }
}
