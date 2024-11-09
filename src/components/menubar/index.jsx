import styles from "./menubar.module.css";
const { ipcRenderer } = require("electron");

export function MenuBar() {
    return (
        <div className={styles["taskbar"]}>
            <div className={styles["taskbar-title"]}>
                <p>Chat V2</p>
            </div>
            <div className={styles["taskbar-controls"]}>
                <div
                    className={styles["taskbar-control"]}
                    id={styles["taskbar-control-min"]}
                    onClick={() => {
                        ipcRenderer.send("min");
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 320 512"
                    >
                        <path d="M0 256c0-13.3 10.7-24 24-24H296c13.3 0 24 10.7 24 24s-10.7 24-24 24H24c-13.3 0-24-10.7-24-24z" />
                    </svg>
                </div>
                <div
                    className={styles["taskbar-control"]}
                    id={styles["taskbar-control-max"]}
                    onClick={() => {
                        ipcRenderer.send("max");
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 448 512"
                    >
                        <path d="M384 80c8.8 0 16 7.2 16 16V416c0 8.8-7.2 16-16 16H64c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64z" />
                    </svg>
                </div>
                <div
                    className={styles["taskbar-control"]}
                    id={styles["taskbar-control-close"]}
                    onClick={() => {
                        ipcRenderer.send("close");
                    }}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 384 512"
                    >
                        <path d="M345 137c9.4-9.4 9.4-24.6 0-33.9s-24.6-9.4-33.9 0l-119 119L73 103c-9.4-9.4-24.6-9.4-33.9 0s-9.4 24.6 0 33.9l119 119L39 375c-9.4 9.4-9.4 24.6 0 33.9s24.6 9.4 33.9 0l119-119L311 409c9.4 9.4 24.6 9.4 33.9 0s9.4-24.6 0-33.9l-119-119L345 137z" />
                    </svg>
                </div>
            </div>
        </div>
    );
}
