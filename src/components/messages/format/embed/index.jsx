import styles from "./embedformatt.module.css";
import reactStringReplace from "react-string-replace";

export function EmbedFormat({ embed }) {
    if (!embed) {
        return null;
    }

    return (
        <div
            className={styles["message-embed"]}
            style={{
                borderLeftColor: embed.color,
            }}
        >
            {embed.title && (
                <a
                    className={styles["message-embed-title"]}
                    href={embed.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {embed.title}
                </a>
            )}
            {embed.description && (
                <div className={styles["message-embed-description"]}>
                    {reactStringReplace(embed.description, /(\\n)/g, () => (
                        <br />
                    ))}
                </div>
            )}

            {embed.image && (
                <img
                    src={embed.image}
                    alt="Embedded content"
                    className={styles["message-embed-image"]}
                />
            )}
            {embed.footer && (
                <div className={styles["message-embed-footer"]}>
                    {embed.footer}
                </div>
            )}
        </div>
    );
}
