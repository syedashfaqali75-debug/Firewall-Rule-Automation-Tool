const async = require('async');

// Mock function representing a firewall API call
function applyFirewallRule(rule, callback) {
    console.log(`Applying rule: ${rule.name}...`);
    
    // Simulating an async network request
    setTimeout(() => {
        if (rule.id === 'invalid-123') {
            return callback(new Error(`Failed to apply ${rule.name}: Invalid ID`));
        }
        console.log(`Successfully applied ${rule.name}`);
        callback(null, { status: 'applied', id: rule.id });
    }, 1000);
}

const rulesToApply = [
    { id: 'rule-001', name: 'Allow SSH' },
    { id: 'rule-002', name: 'Allow HTTP' },
    { id: 'invalid-123', name: 'Block Malicious IP' } // This will trigger an error
];

// Execution Logic
async.series([
    (callback) => applyFirewallRule(rulesToApply[0], callback),
    (callback) => applyFirewallRule(rulesToApply[1], callback),
    (callback) => applyFirewallRule(rulesToApply[2], callback)
], (err, results) => {
    if (err) {
        console.error('--- THE BLAME LOG ---');
        console.error(`Automation halted due to error: ${err.message}`);
    } else {
        console.log('All rules applied successfully:', results);
    }
});