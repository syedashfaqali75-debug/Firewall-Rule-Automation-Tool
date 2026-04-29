/**
 * FIREWALL SYNC CORE
 * Definitions and Logic Engine
 */

// --- 1. SCHEMAS (sync.d.ts equivalent) ---
export interface FirewallRule {
  id: string;
  name: string;
  action: 'ALLOW' | 'DENY';
  priority: number;
  source: string;
}

export interface SyncResult {
  added: string[];
  updated: string[];
  deleted: string[];
}

// --- 2. THE ENGINE ---
class FirewallAutomator {
  /**
   * Reconciles the difference between Desired State (Git/Terraform) 
   * and Current State (Actual Firewall)
   */
  async sync(desired: FirewallRule[], current: FirewallRule[]): Promise<SyncResult> {
    const result: SyncResult = { added: [], updated: [], deleted: [] };
    const desiredIds = new Set(desired.map(r => r.id));

    // Identify Adds and Updates
    desired.forEach(dRule => {
      const existing = current.find(c => c.id === dRule.id);
      if (!existing) {
        result.added.push(dRule.name);
      } else if (JSON.stringify(dRule) !== JSON.stringify(existing)) {
        result.updated.push(dRule.name);
      }
    });

    // Identify Deletions (Rules in firewall but not in source)
    current.forEach(cRule => {
      if (!desiredIds.has(cRule.id)) {
        result.deleted.push(cRule.name);
      }
    });

    return result;
  }
}

// --- 3. EXECUTION & BLAME ANALYSIS ---
const runSync = async () => {
  const engine = new FirewallAutomator();

  // What your code says should exist
  const gitSource: FirewallRule[] = [
    { id: '1', name: 'Allow_HTTPS', action: 'ALLOW', priority: 100, source: '0.0.0.0/0' },
    { id: '2', name: 'Allow_SSH', action: 'ALLOW', priority: 200, source: '10.0.0.5/32' }
  ];

  // What is actually on the firewall right now
  const actualFirewall: FirewallRule[] = [
    { id: '1', name: 'Allow_HTTPS', action: 'ALLOW', priority: 100, source: '0.0.0.0/0' },
    { id: '99', name: 'ROGUE_RULE', action: 'ALLOW', priority: 1, source: 'any' } // "Blame" this!
  ];

  const report = await engine.sync(gitSource, actualFirewall);

  console.log('--- SYNC REPORT ---');
  console.log('Created:', report.added);
  console.log('Updated:', report.updated);
  console.log('Deleted (Drift Cleaned):', report.deleted);
};

runSync();