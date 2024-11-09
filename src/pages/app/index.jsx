import styles from "./app.module.css";
import { useNavigate } from "react-router-dom";

import { MenuBar } from "../../components/menubar/index.jsx";
import { ServerList } from "../../components/serverlist/index.jsx";
import { ChannelList } from "../../components/channellist/index.jsx";
import { Settings } from "../../components/settings/index.jsx";
import { Messages } from "../../components/messages/index.jsx";
import { NewMessage } from "../../components/newmessage/index.jsx";
import { Online } from "../../components/online/index.jsx";
import { SignIn } from "../signin/index.jsx";

import firebaseConfig from "../../firebaseconf.jsx";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChatProvider } from "../../chatcontext.jsx";

import loadingImage from "../../assets/icon.png";

const auth = getAuth(firebaseConfig);

export function App() {
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
        const navigate = useNavigate();
        navigate("/signin");
    } else {
        return (
            <ChatProvider>
                <>
                    <MenuBar />
                    <div className={styles["content"]}>
                        <div className={styles["sidebar"]}>
                            <ServerList />
                            <ChannelList />
                            <Settings />
                        </div>
                        <div className={styles["main"]}>
                            <Messages />
                            <NewMessage />
                        </div>
                        <Online />
                    </div>
                </>
            </ChatProvider>
        );
    }
}
