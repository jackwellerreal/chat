// compiler v2 bc files got lost 😭

const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");

const Colours = require("./colours");
const colours = new Colours();

console.log(
    `${colours.FgYellow}Welcome to the ${colours.FgBlue}code compiler${colours.FgYellow} wizard!${colours.Reset}`
);

try {
    var obfuscationResult = JavaScriptObfuscator.obfuscate(
        fs.readFileSync("./src/index.js", "utf8"),
        {
            compact: true,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1,
        }
    ).getObfuscatedCode();

    let htmlContent = fs.readFileSync("./src/index.html", "utf8");

    let scriptTagIndex = htmlContent.indexOf(
        '<script src="index.js" type="module" defer></script>'
    );
    if (scriptTagIndex !== -1) {
        let scriptContent = htmlContent.substring(
            scriptTagIndex +
                '<script src="index.js" type="module" defer></script>'.length
        );
        htmlContent =
            htmlContent.substring(0, scriptTagIndex) +
            '<script type="module" defer>' +
            obfuscationResult +
            "</script>" +
            scriptContent;
    } else {
        console.log("Script tag not found in the HTML file.");
    }

    let styleTagIndex = htmlContent.indexOf(
        '<link rel="stylesheet" href="styles.css">'
    );
    if (styleTagIndex !== -1) {
        let styleContent = htmlContent.substring(
            styleTagIndex + '<link rel="stylesheet" href="styles.css">'.length
        );
        htmlContent =
            htmlContent.substring(0, styleTagIndex) +
            "<style>" +
            fs.readFileSync("./src/styles.css", "utf8") +
            "</style>" +
            styleContent;
    } else {
        console.log("Style tag not found in the HTML file.");
    }

    fs.writeFileSync("./final.html", htmlContent);

    console.log(`${colours.FgGreen}✅ Successfully compiled${colours.Reset}`);
} catch (error) {
    console.log(`${colours.FgRed}❌ Unsuccessfully compiled${colours.Reset}`);
    console.log(`${error}`);
}
