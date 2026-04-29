// firewall-automation.ts

/** * 1. TYPE DEFINITIONS (Usually in flow.d.ts)
 */
export type Protocol = 'TCP' | 'UDP' | 'ICMP';

export interface FirewallRule {
  name: string;
  priority: number;
  direction: 'Inbound' | 'Outbound';
  protocol: Protocol;
  source: string;
  port: number;
  action: 'allow' | 'deny';
}

/**
 * 2. RULE DEFINITION (The "Source of Truth")
 * This is where 'git blame' is most useful.
 */
const activeRules: FirewallRule[] = [
  {
    name: "Permit-HTTPS",
    priority: 100,
    direction: 'Inbound',
    protocol: 'TCP',
    source: '0.0.0.0/0',
    port: 443,
    action: 'allow'
  },
  {
    name: "Block-SSH-Public",
    priority: 200,
    direction: 'Inbound',
    protocol: 'TCP',
    source: '0.0.0.0/0',
    port: 22,
    action: 'deny'
  }
];

/**
 * 3. AUTOMATION ENGINE (The "Flow")
 * This logic processes the rules and "deploys" them.
 */
class FirewallManager {
  applyRules(rules: FirewallRule[]) {
    console.log("🚀 Starting Firewall Automation Flow...");
    
    rules.sort((a, b) => a.priority - b.priority).forEach(rule => {
      this.deployToCloud(rule);
    });

    console.log("✅ All rules synchronized successfully.");
  }

  private deployToCloud(rule: FirewallRule) {
    // In a real scenario, this would call an AWS/Azure SDK or Terraform
    console.log(`[DEPLOYING] Rule: ${rule.name} | ${rule.protocol} on Port ${rule.port} -> ${rule.action.toUpperCase()}`);
  }
}

// Execution
const manager = new FirewallManager();
manager.applyRules(activeRules);