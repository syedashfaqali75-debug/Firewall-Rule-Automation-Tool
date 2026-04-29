/**
 * LICENSE: MIT
 * Purpose: Provides a type-safe interface for dynamic firewall rule generation.
 */

// --- START dynamic.d.ts SECTION ---
// This defines the structure for any firewall provider (AWS, Azure, GCP)
export interface FirewallRule {
  name: string;
  action: 'ALLOW' | 'DENY';
  direction: 'INGRESS' | 'EGRESS';
  priority: number;
  protocol: 'TCP' | 'UDP' | 'ICMP' | 'ALL';
  ports: string[];
  sourceRanges: string[];
}

export type AutomationManifest = {
  version: string;
  environment: 'production' | 'staging' | 'development';
  rules: FirewallRule[];
};
// --- END dynamic.d.ts SECTION ---

// --- AUTOMATION ENGINE ---
class FirewallAutomator {
  private manifest: AutomationManifest;

  constructor(config: AutomationManifest) {
    this.manifest = config;
  }

  public async deploy(): Promise<void> {
    console.log(`🚀 Starting deployment for [${this.manifest.environment}]`);
    
    this.manifest.rules.forEach((rule) => {
      console.log(`🛠 Applying ${rule.action} rule: ${rule.name} on ports [${rule.ports.join(', ')}]`);
      // Here you would call your Cloud API (e.g., AWS SDK or Google Cloud SDK)
    });

    console.log('✅ Deployment Complete.');
  }
}

// --- USAGE ---
const myRules: AutomationManifest = {
  version: "1.0.0",
  environment: "production",
  rules: [
    {
      name: "allow-secure-web",
      action: "ALLOW",
      direction: "INGRESS",
      priority: 100,
      protocol: "TCP",
      ports: ["443"],
      sourceRanges: ["0.0.0.0/0"]
    }
  ]
};

const bot = new FirewallAutomator(myRules);
bot.deploy();