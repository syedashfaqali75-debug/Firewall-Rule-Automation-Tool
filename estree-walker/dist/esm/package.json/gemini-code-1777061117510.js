import fs from 'fs';
import yaml from 'js-yaml';
import chalk from 'chalk';
import { simpleGit } from 'simple-git';
import { execSync } from 'child_process';

const git = simpleGit();
const RULES_FILE = './rules.yaml';

/**
 * 1. THE ACTION: Applies rules to the system
 */
function applyRules() {
    try {
        const fileContents = fs.readFileSync(RULES_FILE, 'utf8');
        const { rules } = yaml.load(fileContents);

        console.log(chalk.bold.blue("\n🚀 Deploying Firewall Configuration..."));

        rules.forEach(rule => {
            const color = rule.action === 'ALLOW' ? chalk.green : chalk.red;
            console.log(color(`[${rule.action}] Port: ${rule.port} | Source: ${rule.source}`));

            // REAL-WORLD IMPLEMENTATION:
            // const cmd = `ufw ${rule.action.toLowerCase()} from ${rule.source} to any port ${rule.port}`;
            // execSync(cmd); 
        });

        console.log(chalk.blue("✅ All rules synchronized.\n"));
    } catch (e) {
        console.error(chalk.bgRed(" Error reading rules.yaml "), e.message);
    }
}

/**
 * 2. THE AUDIT: Blames the file to see who touched what
 */
async function getBlameAudit() {
    console.log(chalk.bold.yellow("🔍 Running Security Audit (Git Blame):"));
    try {
        const blame = await git.blame(RULES_FILE);
        const lines = blame.split('\n');

        lines.forEach(line => {
            if (line.trim()) {
                // Parsing Git Blame output: Extracting Author and Date
                // Usually looks like: hash (Author Date line_number) content
                const match = line.match(/^\^?(\w+)\s+\((.*?)\s+\d{4}/);
                if (match) {
                    const [_, hash, author] = match;
                    const content = line.split(')').slice(1).join(')');
                    console.log(`${chalk.gray(hash)} | ${chalk.cyan(author.padEnd(15))} |${content}`);
                }
            }
        });
    } catch (e) {
        console.log(chalk.yellow("No git history found. Initialize git to use blame features."));
    }
}

/**
 * EXECUTION FLOW
 */
async function run() {
    // Apply the rules first
    applyRules();
    
    // Then show who is responsible for them
    await getBlameAudit();
}

run();