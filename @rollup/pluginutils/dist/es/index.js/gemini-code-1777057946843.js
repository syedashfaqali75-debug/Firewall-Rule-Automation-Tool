const firewallManager = require('./lib/firewall-provider');
const logger = require('./lib/logger');

// Configuration for the new rule
const newRule = {
    name: "Allow-HTTPS-Inbound",
    priority: 100,
    direction: "INGRESS",
    action: "ALLOW",
    protocol: "TCP",
    port: 443,
    source: "0.0.0.0/0"
};

async function deployFirewallRule() {
    try {
        console.log(`🚀 Initiating deployment: ${newRule.name}...`);
        
        // 1. Validate rule syntax
        if (!newRule.port) throw new Error("Port definition is required.");

        // 2. Push to Provider (e.g., AWS Security Group or iptables)
        const result = await firewallManager.createRule(newRule);
        
        console.log(`✅ Success: Rule ${result.id} is now active.`);
        
        // 3. Log for "Blame" purposes
        logger.logChange({
            user: process.env.USER || 'system_service',
            action: 'CREATE_RULE',
            ruleName: newRule.name,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(`❌ Deployment failed: ${error.message}`);
        process.exit(1);
    }
}

deployFirewallRule();