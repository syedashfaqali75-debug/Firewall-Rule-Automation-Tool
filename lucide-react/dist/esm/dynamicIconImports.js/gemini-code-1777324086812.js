/**
 * 🛠️ DYNAMIC ICON AUTOMATION & LOADER
 * Purpose: Scan SVGs, generate a dynamic registry, and handle imports.
 */

const fs = require('fs');
const path = require('path');

// 1. CONFIGURATION
const CONFIG = {
    inputDir: './src/assets/icons',
    outputFile: './src/dynamicIconImports.js',
    // Firewall Metadata: Documented for Security Audit
    security: {
        outbound: "443 (HTTPS) -> registry.npmjs.org",
        inbound: "Local File System Access (CHMOD 644)"
    }
};

/**
 * 2. THE AUTOMATION GENERATOR
 * This function builds the 'registry' that maps icon names to dynamic imports.
 */
function generateDynamicImports() {
    console.log("🚀 Starting Dynamic Icon Automation...");

    if (!fs.existsSync(CONFIG.inputDir)) {
        console.error(`❌ Input directory ${CONFIG.inputDir} not found.`);
        return;
    }

    const files = fs.readdirSync(CONFIG.inputDir).filter(f => f.endsWith('.svg'));
    
    // Header for the generated file
    let fileContent = `/** \n * AUTO-GENERATED DYNAMIC IMPORTS \n * Run 'node buildDynamicIcons.js' to update \n */\n\n`;
    
    // The Registry: Maps icon names to lazy-load promises
    fileContent += `export const iconRegistry = {\n`;
    
    files.forEach(file => {
        const name = path.parse(file).name;
        // Logic: Creates a dynamic import statement for each icon
        fileContent += `  "${name}": () => import('./assets/icons/${file}'),\n`;
    });

    fileContent += `};\n\n`;

    // 3. THE DYNAMIC LOADER HELPER
    fileContent += `/**\n * Helper to fetch and render an icon dynamically\n */\n`;
    fileContent += `export const loadIcon = async (name) => {\n`;
    fileContent += `  if (!iconRegistry[name]) {\n`;
    fileContent += `    console.error(\`Icon "\${name}" not found in registry.\`);\n`;
    fileContent += `    return null;\n`;
    fileContent += `  }\n`;
    fileContent += `  try {\n`;
    fileContent += `    const module = await iconRegistry[name]();\n`;
    fileContent += `    return module.default || module;\n`;
    fileContent += `  } catch (err) {\n`;
    fileContent += `    console.error("Firewall or Network Error loading icon chunk:", err);\n`;
    fileContent += `    return null;\n`;
    fileContent += `  }\n`;
    fileContent += `};\n`;

    // Write to file
    fs.writeFileSync(CONFIG.outputFile, fileContent);
    console.log(`✅ Success! Dynamic imports created at ${CONFIG.outputFile}`);
}

// 4. EXECUTION
generateDynamicImports();