/**
 * LICENSE: MIT
 * Tool: Dynamic Icon Loader for Firewall Automation
 * This script dynamically resolves icons for security reports based on the rule provider.
 */

// 1. Define the dynamic import registry
// In a real environment, these paths would point to your SVG or PNG assets.
const IconRegistry = {
  gcp: () => import('./assets/icons/gcp-shield.mjs'),
  aws: () => import('./assets/icons/aws-shield.mjs'),
  azure: () => import('./assets/icons/azure-shield.mjs'),
  default: () => import('./assets/icons/generic-shield.mjs'),
};

/**
 * The Automation Tool Logic
 */
export class FirewallIconAutomator {
  /**
   * Dynamically loads an icon based on the provider name.
   * @param {string} provider - The firewall provider (e.g., 'gcp', 'aws').
   */
  async loadProviderIcon(provider) {
    const loader = IconRegistry[provider.toLowerCase()] || IconRegistry.default;

    try {
      console.log(`[SYSTEM] Dynamically importing icon for: ${provider}...`);
      const iconModule = await loader();
      
      // Return the icon data (e.g., a Base64 string or an SVG path)
      return iconModule.default || iconModule;
    } catch (error) {
      console.error(`[ERROR] Could not load icon for ${provider}:`, error.message);
      return null;
    }
  }

  /**
   * Automates the attachment of visual metadata to a firewall rule set.
   */
  async processRules(rules) {
    const processedRules = await Promise.all(rules.map(async (rule) => {
      const icon = await this.loadProviderIcon(rule.provider);
      return {
        ...rule,
        visualMetadata: { icon, timestamp: new Date().toISOString() }
      };
    }));

    return processedRules;
  }
}

// --- EXECUTION EXAMPLE ---

const automator = new FirewallIconAutomator();

const currentRules = [
  { id: 'rule-101', provider: 'GCP', action: 'ALLOW', port: 443 },
  { id: 'rule-102', provider: 'AWS', action: 'DENY', port: 22 }
];

// Execute automation
const rulesWithIcons = await automator.processRules(currentRules);

console.log('--- Processed Automation Rules ---');
rulesWithIcons.forEach(r => {
  console.log(`ID: ${r.id} | Provider: ${r.provider} | Icon Status: ${r.visualMetadata.icon ? 'Loaded' : 'Failed'}`);
});