/**
 * FIREWALL AUTOMATION & CONSTRAINTS
 * Purpose: Validate firewall rule objects against organizational security policies.
 */

const FirewallAutomation = {
    // 1. Define your constraints (The "Source of Truth")
    constraints: {
        allowedPorts: [80, 443, 22, 8080],
        restrictedIPs: ['0.0.0.0/0'], // No global "Any" allowed for sensitive zones
        maxPriority: 1000,
        requiredTags: ['env', 'owner']
    },

    // 2. The Validation Engine
    validateRule(rule) {
        const errors = [];

        // Check Port Constraints
        if (!this.constraints.allowedPorts.includes(rule.port)) {
            errors.push(`Port ${rule.port} is not in the approved list.`);
        }

        // Check IP Safety (Strictly prevent "Any" source on sensitive rules)
        if (rule.source === '0.0.0.0/0' && rule.isSensitive) {
            errors.push("Security Risk: Global access (0.0.0.0/0) forbidden for sensitive assets.");
        }

        // Check Metadata Requirements
        this.constraints.requiredTags.forEach(tag => {
            if (!rule.tags || !rule.tags[tag]) {
                errors.push(`Missing mandatory tag: ${tag}`);
            }
        });

        return {
            isValid: errors.length === 0,
            errors: errors,
            timestamp: new Date().toISOString()
        };
    }
};

// --- EXAMPLE USAGE ---

const proposedRule = {
    name: "Web-Traffic-Inbound",
    port: 443,
    source: "0.0.0.0/0",
    isSensitive: true, // Triggering a constraint violation
    tags: { env: "prod" } // Missing 'owner' tag
};

const result = FirewallAutomation.validateRule(proposedRule);

if (result.isValid) {
    console.log("✅ Rule passed constraints. Deploying via API...");
} else {
    console.error("❌ Rule Rejected:");
    result.errors.forEach(err => console.log(` - ${err}`));
}