/** * FIREWALL RULE AUTOMATION & ATTRIBUTION TOOL
 * Combines types, walking logic, and blame reporting.
 */

// 1. Schema Definitions
interface FirewallRule {
  id: string;
  name: string;
  source: string;
  destination: string;
  port: number | "ANY";
  protocol: "TCP" | "UDP" | "ICMP" | "ALL";
  action: "ALLOW" | "DENY";
  metadata: {
    createdBy: string;
    createdAt: string;
    commitHash: string;
  };
}

// 2. The "Walker" Engine
// Iterates through rules and executes an audit function
const ruleWalker = (rules: FirewallRule[], auditor: (r: FirewallRule) => void) => {
  rules.forEach(rule => auditor(rule));
};

// 3. Mock Data (The Ruleset)
const ruleset: FirewallRule[] = [
  {
    id: "rule-001",
    name: "Standard Web",
    source: "0.0.0.0/0",
    destination: "10.0.0.5",
    port: 443,
    protocol: "TCP",
    action: "ALLOW",
    metadata: { createdBy: "Alice", createdAt: "2023-10-01", commitHash: "a1b2c3d" }
  },
  {
    id: "rule-002",
    name: "YOLO Access",
    source: "0.0.0.0/0",
    destination: "0.0.0.0/0",
    port: "ANY",
    protocol: "ALL",
    action: "ALLOW",
    metadata: { createdBy: "Bob", createdAt: "2023-11-15", commitHash: "f9e8d7c" }
  }
];

// 4. Execution & Blame Logic
console.log("--- SEC-AUDIT START ---");

ruleWalker(ruleset, (rule) => {
  const isTooPermissive = rule.source === "0.0.0.0/0" && rule.port === "ANY";

  if (isTooPermissive && rule.action === "ALLOW") {
    console.error(`[!] SECURITY VIOLATION: ${rule.name}`);
    console.warn(`    Status: Critical Risk`);
    console.warn(`    Blame: ${rule.metadata.createdBy} (Commit: ${rule.metadata.commitHash})`);
    console.warn(`    Reason: "Any/Any" allow rule detected.`);
  } else {
    console.log(`[✓] Rule ${rule.id} passed validation.`);
  }
});

console.log("--- SEC-AUDIT COMPLETE ---");