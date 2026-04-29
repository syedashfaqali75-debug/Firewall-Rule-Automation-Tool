/** * FIREWALL AUTOMATION TOOL
 * Combines Rule Definitions & Audit (Blame) Logic
 */

// --- 1. Type Definitions (The 'index.d.ts' equivalent) ---
export type TrafficDirection = 'ingress' | 'egress';
export type RuleAction = 'allow' | 'deny';

export interface AuditTrail {
  author: string;
  timestamp: string;
  reason: string;
}

export interface FirewallRule {
  id: string;
  name: string;
  direction: TrafficDirection;
  action: RuleAction;
  port: number;
  protocol: 'TCP' | 'UDP' | 'ICMP';
  blame: AuditTrail; // Tracking who did what
}

// --- 2. Automation & Blame Logic ---
class FirewallEngine {
  private activeRules: Map<string, FirewallRule> = new Map();

  /**
   * Deploys rules and logs the "Blame" metadata
   */
  public deploy(rules: FirewallRule[]): void {
    console.log("--- Deploying Configuration ---");
    rules.forEach(rule => {
      this.activeRules.set(rule.id, rule);
      console.log(`[DEPLOYED] ${rule.name} on Port ${rule.port}`);
    });
  }

  /**
   * Blame function: identifies the culprit/author of a rule
   */
  public blame(ruleId: string): void {
    const rule = this.activeRules.get(ruleId);
    if (!rule) {
      console.log(`Error: Rule ${ruleId} not found.`);
      return;
    }

    const { author, timestamp, reason } = rule.blame;
    console.log(`\n--- BLAME REPORT: ${ruleId} ---`);
    console.log(`Responsible Party: ${author}`);
    console.log(`Applied At:        ${timestamp}`);
    console.log(`Justification:     "${reason}"`);
    console.log(`Technical Spec:    ${rule.action.toUpperCase()} ${rule.protocol} from ${rule.direction}`);
  }
}

// --- 3. Execution ---
const engine = new FirewallEngine();

const securityConfig: FirewallRule[] = [
  {
    id: "fw-101",
    name: "DB-Access",
    direction: "ingress",
    action: "allow",
    port: 5432,
    protocol: "TCP",
    blame: {
      author: "admin_sarah",
      timestamp: "2026-04-25T10:00:00Z",
      reason: "Allowing app server to reach PostgreSQL"
    }
  }
];

// Run the automation
engine.deploy(securityConfig);

// Find out who to blame for this rule
engine.blame("fw-101");