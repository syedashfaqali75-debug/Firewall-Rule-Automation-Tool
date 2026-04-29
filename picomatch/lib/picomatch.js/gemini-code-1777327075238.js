/**
 * FIREWALL AUTOMATION TOOL (picomatch.js)
 * Logic: Glob Pattern Matching for Security Compliance
 */

// In a real environment, you'd use: const pm = require('picomatch');
// Here, we simulate the logic to show the integration.
const picomatch = require('picomatch');

const FirewallManager = {
    // 1. Constraints using Glob Patterns
    constraints: {
        // Only allow IPs from the internal 10.x range
        allowedSources: '10.0.*.*', 
        // Only allow names starting with 'prod-' or 'shared-'
        validRuleNames: '(prod|shared)-*', 
        // Strict port restrictions
        forbiddenPorts: [21, 23, 3389]
    },

    // 2. The Logic Engine
    processRule(rule) {
        console.log(`--- Processing Rule: ${rule.name} ---`);

        const isSourceAllowed = picomatch(this.constraints.allowedSources);
        const isNameValid = picomatch(this.constraints.validRuleNames);
        
        const results = {
            nameCheck: isNameValid(rule.name),
            sourceCheck: isSourceAllowed(rule.source),
            portCheck: !this.constraints.forbiddenPorts.includes(rule.port),
            errors: []
        };

        // Aggregating Errors
        if (!results.nameCheck) {
            results.errors.push(`Naming Violation: '${rule.name}' does not match pattern ${this.constraints.validRuleNames}`);
        }
        if (!results.sourceCheck) {
            results.errors.push(`Source Violation: IP ${rule.source} is outside authorized range ${this.constraints.allowedSources}`);
        }
        if (!results.portCheck) {
            results.errors.push(`Security Violation: Port ${rule.port} is on the forbidden list.`);
        }

        this.report(results);
    },

    // 3. Automation Output
    report(results) {
        if (results.errors.length === 0) {
            console.log("✅ RESULT: Rule matches all patterns. Deploying to Firewall...");
        } else {
            console.log("❌ RESULT: Rule rejected due to the following:");
            results.errors.forEach(err => console.log(`  > ${err}`));
        }
        console.log("\n");
    }
};

// --- TEST SUITE ---

// 1. A Rule that passes all glob constraints
FirewallManager.processRule({
    name: "prod-web-server",
    source: "10.0.1.50",
    port: 443
});

// 2. A Rule that fails (bad name, external IP, forbidden port)
FirewallManager.processRule({
    name: "temp-access-rule",
    source: "192.168.1.1",
    port: 23
});