/**
 * FIREWALL AUTOMATION CORE
 * Combines Type Definitions, Logic, and Validation
 */

// --- Type Definitions (The index.d.ts equivalent) ---
export type NetworkProtocol = 'TCP' | 'UDP' | 'ICMP' | 'ANY';
export type RuleAction = 'ALLOW' | 'DENY';
export type Direction = 'INGRESS' | 'EGRESS';

export interface FirewallRule {
  id: string;
  priority: number; // 1-65535, lower is higher priority
  direction: Direction;
  action: RuleAction;
  protocol: NetworkProtocol;
  sourceAddress: string;      // e.g., "10.0.0.0/24"
  destinationAddress: string; // e.g., "0.0.0.0/0"
  destinationPorts: string[]; // e.g., ["80", "443"]
}

// --- Automation Tool Implementation ---
export class FirewallAutomator {
  private activeRules: Map<string, FirewallRule> = new Map();

  /**
   * The "Blame" Logic: Validates the rule before deployment 
   * to prevent "Silent Failures" or security holes.
   */
  private validateRule(rule: FirewallRule): void {
    if (rule.priority < 1 || rule.priority > 65535) {
      throw new Error(`Invalid Priority: ${rule.priority}. Must be 1-65535.`);
    }
    if (rule.destinationPorts.length === 0) {
      throw new Error("Security Risk: Rule must specify at least one port or '*'.");
    }
  }

  async deploy(rule: FirewallRule): Promise<{ success: boolean; msg: string }> {
    try {
      this.validateRule(rule);
      
      // Simulating API Call to Cloud Provider/Hardware
      console.log(`[DEPLOYING] Rule ${rule.id}: ${rule.action} ${rule.protocol} on ports ${rule.destinationPorts}`);
      
      this.activeRules.set(rule.id, rule);
      return { success: true, msg: `Rule ${rule.id} applied successfully.` };
    } catch (error) {
      const err = error as Error;
      console.error(`[FAILURE] ${err.message}`);
      return { success: false, msg: err.message };
    }
  }

  async revoke(ruleId: string): Promise<boolean> {
    return this.activeRules.delete(ruleId);
  }
}

// --- Example Usage ---
const automator = new FirewallAutomator();

automator.deploy({
  id: "web-traffic-01",
  priority: 100,
  direction: "INGRESS",
  action: "ALLOW",
  protocol: "TCP",
  sourceAddress: "0.0.0.0/0",
  destinationAddress: "192.168.1.10",
  destinationPorts: ["80", "443"]
});