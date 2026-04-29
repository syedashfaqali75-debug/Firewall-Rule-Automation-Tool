import { execSync } from 'child_process';

/**
 * Interface representing a Firewall Configuration
 * This would be validated during the build process facilitated by tsconfig.tsbuildinfo
 */
interface FirewallRule {
  port: number;
  protocol: 'tcp' | 'udp';
  cidr: string;
}

/**
 * 1. Automation: Updates the Firewall Rule
 */
function updateFirewall(rule: FirewallRule): void {
  console.log(`🚀 Automating firewall update: Allowing ${rule.protocol} on port ${rule.port}...`);
  // In a real scenario, this would call AWS, Azure, or Google Cloud APIs
  // Example: cloudProvider.updateSecurityGroup(rule);
}

/**
 * 2. Blame: Programmatically checking the last person to touch the config
 */
function getRuleMetadata(filePath: string): string {
  try {
    // Executes 'git blame' to find the author of the last change
    const blameOutput = execSync(`git blame ${filePath} -L 1,1 --porcelain`).toString();
    const author = blameOutput.split('\n').find(line => line.startsWith('author '))?.replace('author ', '');
    return author || 'Unknown';
  } catch (err) {
    return 'Not a git repository';
  }
}

// --- Execution Flow ---

const configPath = './firewall-config.ts';
const currentRule: FirewallRule = {
  port: 443,
  protocol: 'tcp',
  cidr: '0.0.0.0/0'
};

const lastEditedBy = getRuleMetadata(configPath);

console.log(`--- Security Audit ---`);
console.log(`Last modified by: ${lastEditedBy}`);

if (currentRule.port === 443) {
  updateFirewall(currentRule);
  console.log('✅ Rule deployed successfully.');
} else {
  console.error('❌ Build failed: Non-standard port detected.');
  process.exit(1);
}