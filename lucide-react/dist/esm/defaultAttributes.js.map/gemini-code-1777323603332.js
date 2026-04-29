const fs = require('fs');
const path = require('path');

/** * 1. defaultAttributes.js Configuration
 * Defines the standard firewall-compliant SVG properties
 */
const defaultAttributes = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    "stroke-width": 2,
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
};

/** * 2. Firewall Rule Context
 * If running in a CI/CD pipeline, ensure:
 * ALLOW Outbound TCP 443 -> github.com (to fetch lucide source)
 * ALLOW Outbound TCP 443 -> npmjs.org (to install dependencies)
 */

const paths = {
    input: './svgs',
    output: './dist/icons.js',
    map: './dist/icons.js.map'
};

async function runAutomation() {
    console.log("🛠️  Starting Icon Build with defaultAttributes...");

    if (!fs.existsSync(paths.input)) {
        fs.mkdirSync(paths.input);
        console.log(`⚠️  Created ${paths.input} folder. Add your SVGs there.`);
        return;
    }

    const files = fs.readdirSync(paths.input).filter(f => f.endsWith('.svg'));
    const iconData = {};

    files.forEach(file => {
        const name = path.parse(file).name;
        let content = fs.readFileSync(path.join(paths.input, file), 'utf8');

        // Extract path data and merge with defaultAttributes
        const pathData = content.match(/<path.*?\/>|<circle.*?\/>/g) || [];
        iconData[name] = {
            attrs: defaultAttributes,
            content: pathData.join('')
        };
    });

    // 3. Output Generation
    const jsOutput = `
/* Auto-generated - do not edit manually */
export const defaultAttributes = ${JSON.stringify(defaultAttributes, null, 2)};
export const Icons = ${JSON.stringify(iconData, null, 2)};
//# sourceMappingURL=icons.js.map`;

    if (!fs.existsSync('./dist')) fs.mkdirSync('./dist');
    fs.writeFileSync(paths.output, jsOutput);

    // 4. Source Map (.js.map) Generation
    const sourceMap = {
        version: 3,
        file: "icons.js",
        sources: files.map(f => `../svgs/${f}`),
        mappings: "" // Basic mapping for internal tool tracking
    };
    fs.writeFileSync(paths.map, JSON.stringify(sourceMap));

    console.log(`✅ Success! Generated ${files.length} icons in ./dist/icons.js`);
}

runAutomation().catch(console.error);