// compiler v2 bc files got lost 😭

const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');

var obfuscationResult = JavaScriptObfuscator.obfuscate(
    fs.readFileSync('./src/index.js', 'utf8'),
    {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        numbersToExpressions: true,
        simplify: true,
        stringArrayShuffle: true,
        splitStrings: true,
        stringArrayThreshold: 1
    }
).getObfuscatedCode();

let htmlContent = fs.readFileSync('./src/index.html', 'utf8');

// Find the position of the script tag in the HTML content
let scriptTagIndex = htmlContent.indexOf('<script src="index.js" type="module" defer></script>');
if (scriptTagIndex !== -1) {
    // Extract content after the script tag
    let scriptContent = htmlContent.substring(scriptTagIndex + '<script src="index.js" type="module" defer></script>'.length);
    
    // Construct final HTML content with obfuscated script and remaining content
    htmlContent = htmlContent.substring(0, scriptTagIndex) + '<script type="module" defer>' + obfuscationResult + '</script>' + scriptContent;
} else {
    console.log("Script tag not found in the HTML file.");
}

// Find the position of the style tag in the HTML content
let styleTagIndex = htmlContent.indexOf('<link rel="stylesheet" href="styles.css">');
if (styleTagIndex !== -1) {
    // Extract content after the style tag
    let styleContent = htmlContent.substring(styleTagIndex + '<link rel="stylesheet" href="styles.css">'.length);
    
    // Insert style content into the final HTML content
    htmlContent = htmlContent.substring(0, styleTagIndex) + '<style>' + fs.readFileSync('./src/styles.css', 'utf8') + '</style>' + styleContent;
} else {
    console.log("Style tag not found in the HTML file.");
}

// Write final HTML content to file
fs.writeFileSync('./final.html', htmlContent);
