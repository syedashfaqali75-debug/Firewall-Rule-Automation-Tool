/**
 * FIREWALL AUTOMATION UTILITIES (utils.js)
 * Purpose: Helper functions for IP validation, port parsing, and rule sanitization.
 */

const FirewallUtils = {
    // 1. IP & CIDR Utilities
    // Checks if a string is a valid IPv4 or CIDR block
    isValidIP(ip) {
        const cidrRegex = /^(\d{1,3}\.){3}\d{1,3}(\/([0-9]|[1-2][0-9]|3[0-2]))?$/;
        return cidrRegex.test(ip);
    },

    // 2. Port Normalization
    // Converts strings, arrays, or ranges into a consistent array of numbers
    normalizePorts(input) {
        if (typeof input === 'number') return [input];
        if (Array.isArray(input)) return input.map(Number);
        if (typeof input === 'string') {
            // Handle ranges like "80-85"
            if (input.includes('-')) {
                const [start, end] = input.split('-').map(Number);
                const range = [];
                for (let i = start; i <= end; i++) range.push(i);
                return range;
            }
            return [parseInt(input)];
        }
        return [];
    },

    // 3. Rule Sanitization
    // Trims whitespace, uppercases protocols, and ensures defaults exist
    sanitizeRule(rule) {
        return {
            name: rule.name?.trim().toLowerCase().replace(/\s+/g, '-') || 'unnamed-rule',
            protocol: rule.protocol?.toUpperCase() || 'TCP',
            source: rule.source || '0.0.0.0/0',
            port: this.normalizePorts(rule.port),
            action: rule.action?.toUpperCase() === 'ALLOW' ? 'ALLOW' : 'DENY',
            timestamp: new Date().toISOString()
        };
    },

    // 4. Difference Engine (Automation Tooling)
    // Compares two rules to see if an update is actually necessary
    hasChanges(oldRule, newRule) {
        const cleanOld = JSON.stringify(this.sanitizeRule(oldRule));
        const cleanNew = JSON.stringify(this.sanitizeRule(newRule));
        return cleanOld !== cleanNew;
    }
};

// --- EXAMPLE USAGE ---

// Raw, messy input from a user or form
const rawInput = {
    name: "  Web Server Access  ",
    protocol: "tcp",
    port: "80-82",
    source: "192.168.1.1/24",
    action: "allow"
};

// 1. Sanitize the data
const cleanRule = FirewallUtils.sanitizeRule(rawInput);
console.log("Sanitized Rule:", cleanRule);

// 2. Validate IP
console.log("Is Source Valid?", FirewallUtils.isValidIP(cleanRule.source));

// 3. Check for Changes (Simulating an idempotent automation update)
const existingRule = { name: "web-server-access", protocol: "TCP", port: [80, 81, 82], source: "192.168.1.1/24", action: "ALLOW" };
const needsUpdate = FirewallUtils.hasChanges(existingRule, rawInput);
console.log("Needs API Update?", needsUpdate ? "Yes" : "No (Idempotent)");