/**
 * FIREWALL AUTOMATION TOOL
 * License: MIT
 * Description: Single-file automation to push firewall rules via REST API.
 */

const axios = require('axios');

// 1. CONFIGURATION (The "Single Code" Rule Definition)
const firewallConfig = {
    baseUrl: 'https://192.168.1.1/api/v2',
    apiKey: 'your-api-key-here',
    rule: {
        name: "Allow_Internal_API",
        action: "accept",
        srcintf: "internal",
        dstintf: "wan1",
        srcaddr: "10.0.0.5",
        dstaddr: "all",
        service: "HTTPS",
        schedule: "always"
    }
};

// 2. AUTOMATION LOGIC
async function deployFirewallRule() {
    console.log("🚀 Starting Firewall Automation...");

    try {
        const response = await axios.post(`${firewallConfig.baseUrl}/cmdb/firewall/policy`, 
        firewallConfig.rule, {
            headers: { 'Authorization': `Bearer ${firewallConfig.apiKey}` },
            timeout: 5000
        });

        if (response.status === 200 || response.status === 201) {
            console.log("✅ Success: Rule deployed to firewall.");
        }
    } catch (error) {
        console.error("❌ Error: Deployment failed.");
        console.error(error.response ? error.response.data : error.message);
    }
}

// Execute
deployFirewallRule();