const fs = require('fs');
const path = require('path');

/**
 * CONFIGURATION
 * Place your rule JSON files in a folder named './rules'
 * Example rule: { "name": "SSH", "port": 22, "owner": "Admin-Dan" }
 */
const RULES_DIR = path.join(__dirname, 'rules');
const LOG_FILE = path.join(__dirname, 'firewall_blame.log');

// 1. The "Blame" Logger
const logBlame = (ruleName, owner) => {
    const timestamp = new Date().toISOString();
    const entry = `[${timestamp}] RULE: ${ruleName} | APPLIED BY: ${owner}\n`;
    fs.appendFileSync(LOG_FILE, entry);
};

// 2. The "Walker" Engine
const runFirewallWalker = (directory) => {
    if (!fs.existsSync(directory)) {
        console.error("Error: 'rules' directory not found.");
        return;
    }

    const items = fs.readdirSync(directory);

    items.forEach(item => {
        const fullPath = path.join(directory, item);
        
        if (fs.statSync(fullPath).isDirectory()) {
            runFirewallWalker(fullPath); // Recursive walk
        } else if (item.endsWith('.json')) {
            try {
                const rule = JSON.parse(fs.readFileSync(fullPath, 'utf8'));
                
                // Simulation of applying the rule
                console.log(`>>> Deploying: ${rule.name} on Port ${rule.port}`);
                
                // Record the blame
                logBlame(rule.name, rule.owner || "Unknown");
                
            } catch (err) {
                console.error(`Failed to process ${item}: ${err.message}`);
            }
        }
    });
};

// EXECUTE
console.log("--- Starting Walker.js Automation ---");
runFirewallWalker(RULES_DIR);
console.log(`--- Done. Check ${LOG_FILE} for blame history. ---`);