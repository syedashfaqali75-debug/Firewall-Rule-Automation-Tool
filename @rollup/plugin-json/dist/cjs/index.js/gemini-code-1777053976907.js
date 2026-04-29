const { execSync } = require('child_process');

/**
 * Automates the creation of a Firewall Rule
 * @param {string} action - 'APPEND' or 'DELETE'
 * @param {object} rule - Rule configuration
 */
function manageFirewallRule(action, rule) {
    const flag = action === 'APPEND' ? '-A' : '-D';
    const command = `sudo iptables ${flag} INPUT -p ${rule.protocol} --dport ${rule.port} -j ${rule.policy}`;

    try {
        execSync(command);
        console.log(`Successfully ${action.toLowerCase()}ed rule: ${rule.protocol} port ${rule.port} -> ${rule.policy}`);
    } catch (error) {
        console.error(`Failed to ${action} rule: ${error.message}`);
    }
}

// Configuration Index
const rulesToApply = [
    { protocol: 'tcp', port: 80, policy: 'ACCEPT' },
    { protocol: 'tcp', port: 443, policy: 'ACCEPT' },
    { protocol: 'tcp', port: 22, policy: 'DROP' } // Security first!
];

// Execution Loop
console.log("--- Starting Firewall Automation ---");
rulesToApply.forEach(rule => manageFirewallRule('APPEND', rule));