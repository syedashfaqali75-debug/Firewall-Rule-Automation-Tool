const fs = require('fs-extra');
const path = require('path');

// Configuration
const SVG_DIR = path.join(__dirname, 'src/assets/svgs');
const OUTPUT_FILE = path.join(__dirname, 'src/icons.js');

async function generateIcons() {
  try {
    const files = await fs.readdir(SVG_DIR);
    const svgFiles = files.filter(file => file.endsWith('.svg'));

    const iconData = {};

    for (const file of svgFiles) {
      const name = path.parse(file).name;
      const content = await fs.readFile(path.join(SVG_DIR, file), 'utf8');
      
      // Basic cleanup: remove newlines and extra spaces
      const cleanSvg = content.replace(/\r?\n|\r/g, "").trim();
      iconData[name] = cleanSvg;
    }

    const template = `export const IconLibrary = ${JSON.stringify(iconData, null, 2)};`;
    
    await fs.writeFile(OUTPUT_FILE, template);
    console.log(`Successfully generated ${svgFiles.length} icons at ${OUTPUT_FILE}`);
  } catch (err) {
    console.error("Error generating icons:", err);
  }
}

generateIcons();