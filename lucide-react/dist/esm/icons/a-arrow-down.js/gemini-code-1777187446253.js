/**
 * firewall-manager.js
 * Purpose: Automate rule deployment with audit "blame" logs.
 */

const fs = require('fs');

const firewallRules = [
  {
    id: "rule-101",
    action: "ALLOW",
    port: 443,
    source: "0.0.0.0/0",
    description: "HTTPS Public Access",
    assignedBy: "DevOps_User_Alpha" // The "Blame" metadata
  }
];

function applyRule(rule) {
  console.log(`--- Applying Rule: ${rule.id} ---`);
  console.log(`Action: ${rule.action} on Port: ${rule.port}`);
  
  // LOGGING / BLAME COMPONENT
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] RULE CHANGE: ${rule.id} | USER: ${rule.assignedBy} | REASON: ${rule.description}\n`;
  
  fs.appendFileSync('firewall_audit.log', logEntry);
  console.log(`Audit log updated. Blame assigned to: ${rule.assignedBy}`);
}

// Execute
firewallRules.forEach(applyRule);