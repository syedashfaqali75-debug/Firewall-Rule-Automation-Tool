/**
 * FIREWALL AUTOMATION & AUDIT TOOL (Single-File Solution)
 * This script manages firewall rules and tracks "blame" (attribution).
 */

const shell = require('shelljs'); // npm install shelljs
const chalk = require('chalk');   // npm install chalk@4.1.2

// 1. Rule Configuration with Attribution (Blame)
const policy = [
    { port: 443, proto: 'tcp', action: 'ACCEPT', user: 'dev_ops', reason: 'Production HTTPS' },
    { port: 3306, proto: 'tcp', action: 'DROP', user: 'sec_admin', reason: 'External DB access block' },
    { port: 22, proto: 'tcp', action: 'ACCEPT', user: 'lead_eng', reason: 'Emergency SSH' }
];

/**
 * 2. The Core Automation Logic
 * Applies rules and prints the "Blame" trail.
 */
function syncFirewall() {
    console.log(chalk.bold.yellow('\n--- Firewall Sync Initiated ---\n'));

    policy.forEach(rule => {
        // Constructing the system command (iptables example)
        const command = `iptables -A INPUT -p ${rule.proto} --dport ${rule.port} -j ${rule.action}`;
        
        console.log(chalk.cyan(`[Syncing] Port ${rule.port}...`));

        // Dry run simulation
        const success = true; // In prod: shell.exec(command).code === 0;

        if (success) {
            console.log(chalk.green(`  ✔ Status: ${rule.action}`));
            console.log(chalk.gray(`  └─ Blame: ${rule.user} | "${rule.reason}"\n`));
        } else {
            console.log(chalk.red(`  ✘ Error applying rule for port ${rule.port}`));
        }
    });

    console.log(chalk.bold.yellow('--- Sync Complete ---\n'));
}

// 3. Execution
syncFirewall();

/**
 * PACKAGE.JSON COMPONENT:
 * {
 * "dependencies": {
 * "chalk": "^4.1.2",
 * "shelljs": "^0.8.5"
 * }
 * }
 */