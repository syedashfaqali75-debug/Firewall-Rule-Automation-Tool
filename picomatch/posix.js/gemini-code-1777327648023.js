/**
 * POSIX Firewall Automation Tool
 * License: MIT
 * Description: Automates local Linux firewall rules using POSIX system calls.
 */

const { exec } = require('child_process');

// 1. RULE CONFIGURATION
const rules = [
    { action: '-A', chain: 'INPUT', proto: 'tcp', port: '443', target: 'ACCEPT', comment: 'Allow HTTPS' },
    { action: '-A', chain: 'INPUT', proto: 'tcp', port: '22', target: 'ACCEPT', comment: 'Allow SSH' },
    { action: '-P', chain: 'INPUT', target: 'DROP', comment: 'Default Deny' }
];

// 2. AUTOMATION ENGINE
function applyRules() {
    console.log("🛠️  Applying POSIX Firewall Rules...");

    rules.forEach(rule => {
        // Construct standard iptables command
        const cmd = rule.proto 
            ? `sudo iptables ${rule.action} ${rule.chain} -p ${rule.proto} --dport ${rule.port} -j ${rule.target}`
            : `sudo iptables ${rule.action} ${rule.chain} -j ${rule.target}`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`❌ Failed: ${rule.comment} -> ${error.message}`);
                return;
            }
            console.log(`✅ Success: ${rule.comment}`);
        });
    });
}

// 3. PERSISTENCE (Standard POSIX Save)
function saveRules() {
    exec('sudo iptables-save | sudo tee /etc/iptables/rules.v4', (error) => {
        if (!error) console.log("💾 Rules persisted to POSIX storage.");
    });
}

// Run the automation
applyRules();
// saveRules(); // Uncomment to make permanent