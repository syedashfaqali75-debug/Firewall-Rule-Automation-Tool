const { execSync } = require('child_process');

class FirewallManager {
    constructor() {
        this.currentRules = this.fetchActiveRules();
    }

    // Fetches existing iptables rules to prevent duplicates
    fetchActiveRules() {
        try {
            return execSync('sudo iptables -L INPUT -n').toString();
        } catch (e) {
            return "";
        }
    }

    /**
     * validates and applies a rule
     * @param {string} proto - tcp/udp
     * @param {number} port - 1-65535
     * @param {string} target - ACCEPT/DROP/REJECT
     */
    addRule(proto, port, target) {
        // Validation Layer
        if (port < 1 || port > 65535) throw new Error(`Invalid port: ${port}`);
        
        // Idempotency Check: Don't add if it already exists
        if (this.currentRules.includes(`dpt:${port}`)) {
            console.warn(`⚠️  Rule for port ${port} already exists. Skipping.`);
            return;
        }

        const cmd = `sudo iptables -A INPUT -p ${proto} --dport ${port} -j ${target}`;
        
        try {
            execSync(cmd);
            console.log(`✅ Applied: ${target} ${proto} on port ${port}`);
        } catch (err) {
            console.error(`❌ Failed: ${err.message}`);
        }
    }
}

// --- Automation Execution ---
const firewall = new FirewallManager();

const securityPolicy = [
    { proto: 'tcp', port: 3000, target: 'ACCEPT' }, // Node App
    { proto: 'tcp', port: 8080, target: 'ACCEPT' }, // Dev Proxy
    { proto: 'udp', port: 53,   target: 'ACCEPT' }  // DNS
];

securityPolicy.forEach(r => firewall.addRule(r.proto, r.port, r.target));