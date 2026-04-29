/**
 * FIREWALL AUTOMATION TOOL (Single-File Concept)
 * * Dependencies (to be installed via npm): 
 * npm install axios dotenv
 */

// 1. PROJECT CONFIGURATION (The "package.json" equivalent metadata)
const projectConfig = {
    name: "firewall-bot",
    version: "1.0.0",
    author: "DevOps-Team"
};

// 2. THE FIREWALL ENGINE
class FirewallAutomator {
    constructor() {
        this.ruleStore = [];
        this.auditLog = []; // This is your "Blame" layer
    }

    /**
     * @param {string} user - Who is making the change
     * @param {number} port - Destination port
     * @param {string} proto - TCP/UDP
     * @param {string} cidr - Source IP range
     */
    addRule(user, port, proto, cidr) {
        const ruleId = Math.random().toString(36).substring(7);
        const newRule = { id: ruleId, port, proto, cidr, status: 'ACTIVE' };
        
        this.ruleStore.push(newRule);
        
        // Logic for "Blame": Recording metadata for every change
        this.auditLog.push({
            timestamp: new Date().toISOString(),
            actor: user,
            action: "CREATE_RULE",
            details: `Opened ${proto}/${port} for ${cidr}`,
            ruleId: ruleId
        });

        console.log(`[SUCCESS] Rule ${ruleId} deployed by ${user}`);
    }

    showAuditTrail() {
        console.log("\n--- SECURITY AUDIT (BLAME LOG) ---");
        this.auditLog.forEach(entry => {
            console.log(`[${entry.timestamp}] ${entry.actor.toUpperCase()}: ${entry.details}`);
        });
    }
}

// 3. EXECUTION
const bot = new FirewallAutomator();

// Simulating different users for the 'blame' trail
bot.addRule('admin_jane', 443, 'TCP', '0.0.0.0/0');
bot.addRule('dev_bob', 8080, 'TCP', '192.168.1.50/32');

// Output the "Blame" report
bot.showAuditTrail();