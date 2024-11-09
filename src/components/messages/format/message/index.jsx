import styles from "./messageformat.module.css";
import reactStringReplace from "react-string-replace";

import firebaseConfig from "../../../../firebaseconf.jsx";
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

import { useChat } from "../../../../chatcontext.jsx";
import { format } from "prettier";

const database = getFirestore(firebaseConfig);

export function MessageFormat({ message, server }) {
    const { changeServer, changeChannel } = useChat();

    String.prototype.replaceJSX = function (find, replace) {
        return this.split(find)
            .flatMap((item) => [item, replace])
            .slice(0, -1);
    };

    if (!message) {
        return <></>;
    }

    if (message.startsWith("raw:")) {
        return <>{message.replace(/raw:/, "")}</>;
    }

    if (message.startsWith("image:")) {
        const url = message.replace(/image:/, "");
        return (
            <a href={url} target="_blank" rel="noopener noreferrer">
                <img
                    src={url}
                    alt="Embedded content"
                    style={{ height: "initial", width: "initial" }}
                />
            </a>
        );
    }

    if (message.startsWith("font:")) {
        const text = message.replace(/^font:[a-zA-Z]+:/, "");
        if (message.startsWith("font:comic:")) {
            return (
                <span
                    style={{
                        fontFamily: "'Comic Sans MS', 'Comic Sans', cursive",
                    }}
                >
                    {text}
                </span>
            );
        }
        if (message.startsWith("font:consolas:")) {
            return (
                <span style={{ fontFamily: "Consolas, monospace" }}>
                    {text}
                </span>
            );
        }
        if (message.startsWith("font:impact:")) {
            return <span style={{ fontFamily: "Impact, serif" }}>{text}</span>;
        }
        if (message.startsWith("font:wingdings:")) {
            return <span style={{ fontFamily: "'Wingdings 3'" }}>{text}</span>;
        }
        if (message.startsWith("font:maths:")) {
            return (
                <span style={{ fontFamily: "Cambria, Georgia, serif" }}>
                    {text}
                </span>
            );
        }
        if (message.startsWith("font:newroman:")) {
            return (
                <span style={{ fontFamily: "'Times New Roman', serif" }}>
                    {text}
                </span>
            );
        }
        if (message.startsWith("font:algerian:")) {
            return (
                <span style={{ fontFamily: "Algerian, fantasy" }}>{text}</span>
            );
        }
        if (message.startsWith("font:faded:")) {
            return <span style={{ opacity: 0.2 }}>{text}</span>;
        }
        if (message.startsWith("font:tiny:")) {
            return <span style={{ fontSize: "10px" }}>{text}</span>;
        }
    }

    if (message.startsWith("colour:")) {
        const text = message.replace(/^colour:[a-z]+:/, "");
        const colorMap = {
            red: "red",
            orange: "orange",
            yellow: "yellow",
            lime: "lime",
            green: "green",
            cyan: "cyan",
            blue: "blue",
            darkblue: "darkblue",
            purple: "purple",
            magenta: "magenta",
            pink: "pink",
        };

        const color = message.split(":")[1];
        return <span style={{ color: colorMap[color] }}>{text}</span>;
    }

    let formattedMessage = message;

    formattedMessage = reactStringReplace(formattedMessage, /\\n/g, () => (
        <br />
    ));

    formattedMessage = reactStringReplace(
        formattedMessage,
        /!important/g,
        (match, i) => (
            <span key={i} className={styles["message-highlight"]}>
                !important
            </span>
        )
    );

    formattedMessage = reactStringReplace(
        formattedMessage,
        /(https?:\/\/)?([a-zA-Z0-9]{1,63}\.)?([a-zA-Z0-9]{1,63})(\.)([a-zA-Z]{2,63})(\:[0-9]{1,5})?(\/)?((?!\.)[a-zA-Z0-9.\-_~!$&'()*+,;=:@]*)?/g,
        (match, i) => (
            <a
                key={i}
                href={
                    !match.startsWith("http") || !match.startsWith("https")
                        ? `https://${match}`
                        : match
                }
                target="_blank"
                rel="noopener noreferrer"
            >
                {match}
            </a>
        )
    );

    formattedMessage = reactStringReplace(
        formattedMessage,
        /(?<!\\)\@([^ ^\!^\#^\$^\^^\||]+)/g,
        (match, i) => {
            return (
                <span
                    key={i}
                    className={styles["message-highlight"]}
                    onClick={async () => {
                        const userCollectionRef = collection(
                            database,
                            `info/users/users`
                        );
                        const userDocs = await getDocs(userCollectionRef);
                        const userData = userDocs.docs.map((doc) => doc.data());

                        const user = userData.find(
                            (user) => user.account.username === match
                        );

                        if (user) {
                            changeServer("dms");
                            changeChannel(user.account.uid);
                        }
                    }}
                >
                    @{match}
                </span>
            );
        }
    );

    formattedMessage = reactStringReplace(
        formattedMessage,
        /(?<!\\)\#([^ ^\!^\@^\$^\^^\||]+)/g,
        (match, i) => {
            return (
                <span
                    key={i}
                    className={styles["message-highlight"]}
                    onClick={() => {
                        if (server === "dms") {
                            return;
                        }
                        changeChannel(match);
                    }}
                >
                    #{match}
                </span>
            );
        }
    );

    formattedMessage = reactStringReplace(
        formattedMessage,
        /\|\|(.*?)\|\|/g,
        (match, i) => (
            <div key={i} className={styles["message-spoiler"]}>
                <span className={styles["message-spoiler-text"]}>{match}</span>
            </div>
        )
    );

    formattedMessage = reactStringReplace(
        formattedMessage,
        /`(.*?)`/g,
        (match, i) => (
            <span key={i} className={styles["message-raw-text"]}>
                {match}
            </span>
        )
    );

    return <>{formattedMessage}</>;
}
