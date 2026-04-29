/**
 * FIREWALL PARSER & AUTOMATION TOOL (parse.js)
 * Logic: String Parsing -> JSON Structuring -> Constraint Validation
 */

const FirewallTool = {
    // 1. Constraints: Rules the parsed data must follow
    constraints: {
        blockedPorts: [21, 23, 3389], // Block FTP, Telnet, RDP
        minPriority: 100,
        requiredAction: ['ALLOW', 'DENY', 'REJECT']
    },

    // 2. Parser: Converts raw string lines into Objects
    // Expected format: "PRIORITY ACTION PROTOCOL SOURCE_IP PORT"
    // Example: "105 ALLOW TCP 192.168.1.1 443"
    parseRawRule(rawString) {
        const parts = rawString.trim().split(/\s+/);
        
        if (parts.length < 5) return { error: "Malformed rule string" };

        return {
            priority: parseInt(parts[0]),
            action: parts[1].toUpperCase(),
            protocol: parts[2],
            source: parts[3],
            port: parseInt(parts[4])
        };
    },

    // 3. Automation Logic: Validates the parsed rule against constraints
    automateValidation(parsedRule) {
        let status = { valid: true, issues: [] };

        // Check if port is in the danger zone
        if (this.constraints.blockedPorts.includes(parsedRule.port)) {
            status.valid = false;
            status.issues.push(`CRITICAL: Port ${parsedRule.port} is insecure and blocked by policy.`);
        }

        // Check if priority is high enough
        if (parsedRule.priority < this.constraints.minPriority) {
            status.valid = false;
            status.issues.push(`WARNING: Priority ${parsedRule.priority} is below the management threshold of ${this.constraints.minPriority}.`);
        }

        // Check for valid action
        if (!this.constraints.requiredAction.includes(parsedRule.action)) {
            status.valid = false;
            status.issues.push(`INVALID: Action '${parsedRule.action}' is not recognized.`);
        }

        return status;
    },

    // 4. Execution: Runs the full pipeline
    process(input) {
        console.log("--- Starting Firewall Rule Parse ---");
        const rule = this.parseRawRule(input);

        if (rule.error) {
            console.error(`Parser Error: ${rule.error}`);
            return;
        }

        const report = this.automateValidation(rule);

        console.log("Parsed Object:", JSON.stringify(rule, null, 2));
        
        if (report.valid) {
            console.log("✅ AUTOMATION SUCCESS: Rule is compliant and ready for deployment.");
        } else {
            console.log("❌ AUTOMATION FAILED: Rule violates security constraints:");
            report.issues.forEach(issue => console.log(` - ${issue}`));
        }
    }
};

// --- RUNTIME TEST CASES ---

// Case 1: A valid rule
FirewallTool.process("150 ALLOW TCP 10.0.0.5 443");

console.log("\n------------------------------------\n");

// Case 2: An invalid rule (Blocked port and low priority)
FirewallTool.process("50 ALLOW TCP 0.0.0.0 23");