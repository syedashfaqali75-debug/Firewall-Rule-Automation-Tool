/**
 * FIREWALL AUTOMATOR & AUDIT TOOL
 * * Dependencies (to install):
 * npm install axios dotenv
 */

const axios = require('axios');

// Mock Configuration (In a real app, use process.env)
const CONFIG = {
    API_KEY: 'your_api_key_here',
    ENDPOINT: 'https://api.your-firewall.com/v1/rules'
};

/**
 * The Rule Object
 * Includes a 'reason' field to act as an internal "git blame" 
 * for security audits.
 */
const firewallRule = {
    id: "rule_8821",
    action: "BLOCK",
    protocol: "TCP",
    port: 443,
    source: "192.168.1.1",
    metadata: {
        author: "System_Admin",
        reason: "Suspected DDoS activity from source", // The "Blame" context
        timestamp: new Date().toISOString()
    }
};

/**
 * Automation Logic
 */
async function syncFirewall(rule) {
    console.log(`--- Initializing Firewall Sync ---`);
    console.log(`Author: ${rule.metadata.author}`);
    console.log(`Reason: ${rule.metadata.reason}`);

    try {
        // In a real scenario, this would be an Axios call:
        // await axios.post(CONFIG.ENDPOINT, rule);
        
        console.log("Status: [SUCCESS] Rule propagated to all edge nodes.");
        console.table([rule]); // Visualizes the rule in the console
    } catch (error) {
        console.error("Status: [FAILED] sync aborted.", error.message);
    }
}

// Execute
syncFirewall(firewallRule);

/*
================================================================
  ACCOMPANYING PACKAGE.JSON (Inline Reference)
================================================================
{
  "name": "firewall-automation",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "axios": "^1.6.0",
    "dotenv": "^16.3.0"
  }
}
*/