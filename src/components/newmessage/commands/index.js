const slots = ["💯", "💀", "🧑‍🦼", "🍪", "😂"];
import config from "../../../../config.json";

export async function handleCommand(command) {
    if (command === "/random") {
        return { res: Math.floor(Math.random() * 100), type: "text" };
    }
    if (command === "/coinflip") {
        return {
            res:
                (Math.floor(Math.random() * 2) == 0) == true
                    ? "🪙 Heads"
                    : "🪙 Tails",
            type: "text",
        };
    }
    if (command.startsWith("/slots ")) {
        let slots1 = slots[Math.floor(Math.random() * slots.length)];
        let slots2 = slots[Math.floor(Math.random() * slots.length)];
        let slots3 = slots[Math.floor(Math.random() * slots.length)];
        var status;
        if (slots1 == slots2 && slots2 == slots3 && slots3 == slots1) {
            status = `You made ${config.economyCurrency}${parseInt(command.replace("/slots ", "")) * 10}`;
        } else if (slots1 == slots2 || slots2 == slots3 || slots3 == slots1) {
            status = `You made ${config.economyCurrency}${parseInt(command.replace("/slots ", "")) * 3}`;
        } else {
            status = `You lost ${config.economyCurrency}${command.replace("/slots ", "")}`;
        }

        return {
            res: {
                description: `${status}\\n${slots1} | ${slots2} | ${slots3}`,
                color: "#5865f2",
            },
            type: "embed",
        };
    }

    return {
        res: "Unknown command. Type /help for a list of commands.",
        type: "text",
    };
}
