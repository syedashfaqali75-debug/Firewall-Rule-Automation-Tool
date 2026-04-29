/**
 * Unified Automation Tool: Source Map Resolver + Git Blame
 * usage: node utils_blame.js <line> <column>
 */

const fs = require('fs');
const { SourceMapConsumer } = require('source-map');
const { execSync } = require('child_process');

// Configuration
const MAP_FILE_PATH = './dist/utils.js.map';

async function runAutomation() {
    const [line, column] = process.argv.slice(2).map(Number);

    if (!line || !column) {
        console.error("Error: Please provide line and column numbers. (e.g., node script.js 1 5023)");
        process.exit(1);
    }

    if (!fs.existsSync(MAP_FILE_PATH)) {
        console.error(`Error: Map file not found at ${MAP_FILE_PATH}`);
        process.exit(1);
    }

    const rawSourceMap = JSON.parse(fs.readFileSync(MAP_FILE_PATH, 'utf8'));

    try {
        await SourceMapConsumer.with(rawSourceMap, null, (consumer) => {
            // 1. Resolve Minified Code to Source Code
            const pos = consumer.originalPositionFor({ line, column });

            if (!pos.source) {
                throw new Error("Could not map the provided coordinates to a source file.");
            }

            console.log(`\n✅ Match Found:`);
            console.log(`- File:   ${pos.source}`);
            console.log(`- Line:   ${pos.line}`);
            console.log(`- Column: ${pos.column}`);
            console.log(`- Name:   ${pos.name || 'Anonymous'}`);
            console.log(`---`.padEnd(40, '-'));

            // 2. Execute Git Blame for accountability
            try {
                // git blame -L <start>,<end> <file>
                const blame = execSync(
                    `git blame -L ${pos.line},${pos.line} -- ${pos.source}`,
                    { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] }
                ).trim();

                console.log(`Blame Output:\n${blame}\n`);
            } catch (gitErr) {
                console.log(`⚠️ Git Blame failed. Ensure '${pos.source}' exists in the local repo.`);
            }
        });
    } catch (err) {
        console.error(`Processing Error: ${err.message}`);
    }
}

runAutomation();