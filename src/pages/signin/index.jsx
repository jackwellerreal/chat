import styles from "./signin.module.css";
import { useNavigate } from "react-router-dom";

import { MenuBar } from "../../components/menubar/index.jsx";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import firebaseConfig from "../../firebaseconf.jsx";
const auth = getAuth(firebaseConfig);

export function SignIn() {
    const FormComplete = async (e) => {
        e.preventDefault();

        signInWithEmailAndPassword(
            auth,
            e.target[0].value + "@chat.com",
            e.target[1].value
        )
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                console.log(errorCode, errorMessage);
            });

        window.location.reload();
    };

    return (
        <>
            <MenuBar />
            <div className={styles["overlay"]}>
                <form
                    className={styles["overlay-form"]}
                    id="overlay"
                    onSubmit={FormComplete}
                >
                    <div className={styles["overlay-form-content"]}>
                        <h1>Sign In</h1>
                        <p>Please enter your username and password</p>
                    </div>
                    <div className={styles["overlay-form-questions"]}>
                        <h2>Username</h2>
                        <input
                            id="form-username"
                            type="text"
                            required
                            autoFocus
                        />
                        <h2>Password</h2>
                        <input id="form-password" type="password" required />
                    </div>
                    <div className={styles["overlay-form-confirm"]}>
                        <button id="button-exit">Exit</button>
                        <input
                            id="button-confirm"
                            type="submit"
                            value="Sign-In"
                        />
                    </div>
                </form>
            </div>
        </>
    );
}
