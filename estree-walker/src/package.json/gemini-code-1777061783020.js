#!/usr/bin/env node

/**
 * Firewall Automation Tool
 * Features: Rule deployment, Audit Logging (Blame), and Error Handling.
 */

const { program } = require('commander');
const shell = require('shelljs');
const chalk = require('chalk');
const fs = require('fs');

// Configuration
const LOG_FILE = 'firewall_blame.log';

// Helper: Blame/Audit Logger
const logAction = (action, ip, status) => {
    const timestamp = new Date().toISOString();
    const user = process.env.USER || 'unknown_user';
    const logEntry = `[${timestamp}] USER: ${user} | ACTION: ${action} | TARGET: ${ip} | STATUS: ${status}\n`;
    
    fs.appendFileSync(LOG_FILE, logEntry);
};

program
  .version('1.0.0')
  .description('A simple CLI to manage and track iptables rules');

/**
 * Command: Block an IP
 */
program
  .command('block <ip>')
  .description('Block an IP address and log the change')
  .action((ip) => {
    console.log(chalk.bold.cyan(`\n🚀 Initializing block for: ${ip}`));

    // Check for root privileges
    if (shell.exec('id -u', { silent: true }).stdout.trim() !== '0') {
        console.error(chalk.red('❌ Error: This tool requires sudo/root privileges.'));
        logAction('BLOCK', ip, 'FAILED - Insufficient Permissions');
        return;
    }

    // Execute iptables command
    const result = shell.exec(`iptables -A INPUT -s ${ip} -j DROP`, { silent: true });

    if (result.code === 0) {
        console.log(chalk.green(`✅ Success: ${ip} is now blocked.`));
        logAction('BLOCK', ip, 'SUCCESS');
    } else {
        console.error(chalk.red(`❌ System Error: ${result.stderr}`));
        logAction('BLOCK', ip, `FAILED - ${result.stderr.trim()}`);
    }
});

/**
 * Command: View Blame Log
 */
program
  .command('blame')
  .description('Show the audit history of firewall changes')
  .action(() => {
    if (!fs.existsSync(LOG_FILE)) {
        console.log(chalk.yellow('No history found.'));
        return;
    }
    console.log(chalk.bold.white('\n--- Firewall Audit Log (Blame) ---'));
    console.log(fs.readFileSync(LOG_FILE, 'utf8'));
  });

program.parse(process.argv);