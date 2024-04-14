// compiler v2 bc files got lost 😭

require("dotenv").config();
const JavaScriptObfuscator = require("javascript-obfuscator");
const fs = require("fs");
const prettier = require("@prettier/sync");

const Colours = require("./colours");
const colours = new Colours();

console.log(
    `${colours.FgYellow}Welcome to the ${colours.FgBlue}code compiler${colours.FgYellow} wizard!${colours.Reset}`
);

try {
    let htmlContent = fs.readFileSync("./src/index.html", "utf8");
    let jsContent = fs.readFileSync("./src/index.js", "utf8");

    /*

    // Insert enviroment variables
    
    let envTagIndex = jsContent.indexOf("// config here");
    if (envTagIndex !== -1) {
        let envContent = jsContent.substring(
            envTagIndex + "// config here".length
        );
        jsContent =
            jsContent.substring(0, envTagIndex) +
            `
            const firebaseConfig = {
                apiKey: "${process.env.APIKEY}",
                authDomain: "${process.env.AUTHDOMAIN}",
                projectId: "${process.env.PROJECTID}",
                storageBucket: "${process.env.STORAGEBUCKET}",
                messagingSenderId: "${process.env.MESSAGESENDERID}",
                appId: "${process.env.APPID}",
            };
            ` +
            envContent;
    } else {
        console.log(
            `${colours.FgRed}❌ Firebase config tag not found in the JS file${colours.Reset}`
        );
        return;
    }
    */

    // Obfuscate code

    var obfuscationResult = JavaScriptObfuscator.obfuscate(jsContent, {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1,
    }).getObfuscatedCode();

    // Insert obfuscated javascript

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
        console.log(
            `${colours.FgRed}❌ Script tag not found in the HTML file${colours.Reset}`
        );
        return;
    }

    // Insert css

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
        console.log(
            `${colours.FgRed}❌ Style tag not found in the HTML file${colours.Reset}`
        );
        return;
    }

    // Insert developer warning

    let devTagIndex = htmlContent.indexOf("// dev tag here");
    if (devTagIndex !== -1) {
        let devContent = htmlContent.substring(
            devTagIndex + "// dev tag here".length
        );
        htmlContent =
            htmlContent.substring(0, devTagIndex) +
            `
            for (let index = 0; index < 50; index++) {
                setTimeout(() => {
                    console.log("%cStop!", "color:red;font-family:system-ui;font-size:3rem;-webkit-text-stroke: 1px black;font-weight:bold");
                    console.log("%cThis is a browser feature intended for developers. If someone told you to copy-paste something here it is a scam and will allow them to run code on your computer.", "color:white;font-family:system-ui;font-size:1rem;font-weight:bold");
                }, 1000);
            }
            ` +
            devContent;
    } else {
        console.log(
            `${colours.FgRed}❌ Developer tag not found in the HTML file${colours.Reset}`
        );
        return;
    }

    // Format code using prettier

    try {
        htmlContent = prettier.format(htmlContent, {
            trailingComma: "es5",
            tabWidth: 4,
            semi: true,
            parser: "html",
        });
    } catch (error) {
        console.log(
            `${colours.FgRed}❌ Unsuccessfully formatted code${colours.Reset}`
        );
        console.log(`${error}`);
        return;
    }
    // Write to final file

    fs.writeFileSync("./final.html", htmlContent);

    console.log(`${colours.FgGreen}✅ Successfully compiled${colours.Reset}`);
} catch (error) {
    console.log(`${colours.FgRed}❌ Unsuccessfully compiled${colours.Reset}`);
    console.log(`${error}`);
}
