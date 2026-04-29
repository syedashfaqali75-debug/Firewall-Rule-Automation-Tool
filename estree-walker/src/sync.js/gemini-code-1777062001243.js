const { execSync } = require('child_process');
const fs = require('fs');

/**
 * CONFIGURATION
 * Ensure 'rules.json' exists in the same directory and is tracked by Git.
 */
const CONFIG = {
    file: './rules.json',
    mockApiEndpoint: 'https://api.firewall.internal/v1/sync'
};

/**
 * THE BLAMER
 * Extracts the git author email for a specific rule ID.
 */
function getRuleOwner(ruleId) {
    try {
        // Find line number of the rule ID
        const lineNo = execSync(`grep -n "${ruleId}" ${CONFIG.file}`).toString().split(':')[0];
        // Get git author email for that specific line
        const email = execSync(`git blame -L ${lineNo},${lineNo} --porcelain ${CONFIG.file}`)
            .toString()
            .match(/^author-mail <(.*)>$/m)[1];
        return email;
    } catch (e) {
        return 'system-default';
    }
}

/**
 * THE SYNC
 * Orchestrates reading, blaming, and "uploading"
 */
async function runSync() {
    console.log(`--- 🛡️ Firewall Sync Started: ${new Date().toISOString()} ---`);

    if (!fs.existsSync(CONFIG.file)) {
        console.error("❌ Error: rules.json not found. Create it first.");
        return;
    }

    const rules = JSON.parse(fs.readFileSync(CONFIG.file, 'utf8'));

    for (const rule of rules) {
        const owner = getRuleOwner(rule.id);
        
        // Construct the final object to send to your firewall API
        const syncPayload = {
            ...rule,
            metadata: {
                blame: owner,
                sync_date: new Date().toISOString(),
                source: "automation-tool-sync.js"
            }
        };

        // Simulated API Call
        console.log(`\n[SYNCING] Rule: ${rule.id}`);
        console.log(`[OWNER]   ${owner}`);
        console.log(`[PAYLOAD] ${JSON.stringify(syncPayload)}`);
        
        // In a real scenario, use: await fetch(CONFIG.mockApiEndpoint, { method: 'POST', body: JSON.stringify(syncPayload) });
    }

    console.log("\n✅ Sync process finished successfully.");
}

runSync();