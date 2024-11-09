import styles from "./app.module.css";

import { MenuBar } from "./components/menubar";
import { ServerList } from "./components/serverlist";
import { ChannelList } from "./components/channellist";
import { Settings } from "./components/settings";
import { Messages } from "./components/messages";
import { NewMessage } from "./components/newmessage";
import { Online } from "./components/online";
import { SignIn } from "./components/signin";

import firebaseConfig from "./firebaseconf.jsx";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ChatProvider } from "./chatcontext.jsx";

import loadingImage from "./assets/icon.png"

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
        return (
            <>
                <MenuBar />
                <SignIn />
            </>
        );
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
