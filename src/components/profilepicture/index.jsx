import config from "../../../config.json";

export function ProfilePicture(args) {
    return (
        <img
            src={config.profilePicAPI
                .replace("{NAME}", args.name)
                .replace("{COLOR}", args.color.replace("#", ""))}
            style={{
                borderRadius: "50%",
            }}
        />
    );
}
