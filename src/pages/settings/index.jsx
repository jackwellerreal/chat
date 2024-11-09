import styles from "./settings.module.css";
import { useNavigate } from "react-router-dom";

import { MenuBar } from "../../components/menubar/index.jsx";

import { getAuth } from "firebase/auth";
import firebaseConfig from "../../firebaseconf.jsx";
const auth = getAuth(firebaseConfig);

export function Settings() {

    return (
        <>
            <MenuBar />
        </>
    );
}
