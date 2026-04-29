const fs = require('fs');

// Simple "database" to store rules and blame info
const DB_FILE = './firewall_audit.json';

/**
 * Adds a firewall rule and records who is responsible.
 * @param {string} user - The person/service adding the rule (the "blame").
 * @param {object} rule - Rule details (port, protocol, action).
 */
function addFirewallRule(user, rule) {
    const timestamp = new Date().toISOString();
    
    const ruleEntry = {
        id: Date.now(),
        addedBy: user,
        createdAt: timestamp,
        rule: rule,
        status: 'active'
    };

    // 1. Logic to apply the rule to the actual system
    const success = applyRuleToSystem(rule);

    if (success) {
        // 2. Log the change for "Blame" tracking
        saveToAuditLog(ruleEntry);
        console.log(`✅ Rule applied successfully by ${user}`);
    } else {
        console.error(`❌ Failed to apply rule.`);
    }
}

function applyRuleToSystem(rule) {
    // Placeholder: This is where you'd call AWS SDK, Azure API, or local shell commands
    // Example: `ufw allow from ${rule.ip} to any port ${rule.port}`
    console.log(`[SYSTEM] Executing: ALLOW ${rule.protocol} on PORT ${rule.port} for IP ${rule.ip}`);
    return true; 
}

function saveToAuditLog(entry) {
    let data = [];
    if (fs.existsSync(DB_FILE)) {
        data = JSON.parse(fs.readFileSync(DB_FILE));
    }
    data.push(entry);
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// --- EXAMPLE USAGE ---
const newRule = {
    ip: '192.168.1.50',
    port: 8080,
    protocol: 'TCP'
};

addFirewallRule('DevOps_Admin_Sarah', newRule);