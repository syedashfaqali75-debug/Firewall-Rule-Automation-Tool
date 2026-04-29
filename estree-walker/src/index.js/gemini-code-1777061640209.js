/**
 * Firewall Automation Script
 * Purpose: Automate the creation of inbound security rules.
 */

const axios = require('axios');

const CONFIG = {
  API_TOKEN: 'your_secret_token_here',
  BASE_URL: 'https://api.cloudprovider.com/v1/firewalls',
  FIREWALL_ID: 'fw-12345'
};

async function addFirewallRule(protocol, port, cidr) {
  const rule = {
    protocol: protocol,
    ports: port.toString(),
    sources: {
      addresses: [cidr]
    }
  };

  try {
    console.log(`[ACTION] Adding rule: Allow ${protocol} on port ${port} from ${cidr}...`);
    
    const response = await axios.post(`${CONFIG.BASE_URL}/${CONFIG.FIREWALL_ID}/rules`, {
      inbound_rules: [rule]
    }, {
      headers: { 'Authorization': `Bearer ${CONFIG.API_TOKEN}` }
    });

    if (response.status === 202 || response.status === 201) {
      console.log(' [SUCCESS] Rule applied successfully.');
    }
  } catch (error) {
    console.error(' [ERROR] Failed to apply rule:', error.response ? error.response.data : error.message);
  }
}

// Example Usage: Open port 443 for everyone
addFirewallRule('tcp', 443, '0.0.0.0/0');