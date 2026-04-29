/**
 * 🛠️ LUCIDE-REACT INTEGRATION & FIREWALL AUTOMATOR
 * Purpose: Automates React icon component generation and validates network access.
 */

const fs = require('fs');
const { execSync } = require('child_process');

// 1. CONFIGURATION & FIREWALL AUDIT DATA
const CONFIG = {
    packageName: 'lucide-react',
    outputDir: './src/components/icons',
    firewallRules: [
        { host: 'registry.npmjs.org', port: 443, purpose: 'Package Download' },
        { host: 'raw.githubusercontent.com', port: 443, purpose: 'Icon Source Sync' }
    ]
};

/**
 * 2. FIREWALL VALIDATION LOGIC
 * Checks if the environment can reach the required registries.
 */
function checkNetworkAccess() {
    console.log("🔍 Auditing Firewall Rules...");
    try {
        // Attempt to ping the registry (simple connection test)
        execSync(`curl -I -s --connect-timeout 5 https://${CONFIG.firewallRules[0].host}`, { stdio: 'ignore' });
        console.log("✅ Outbound TCP 443: ACCESSIBLE");
    } catch (error) {
        console.error("❌ FIREWALL ALERT: Outbound access to NPM registry is blocked.");
        console.error("Please whitelist the following ports/hosts in your security group:");
        console.table(CONFIG.firewallRules);
        return false;
    }
    return true;
}

/**
 * 3. COMPONENT GENERATION LOGIC
 * Creates a centralized React export file to manage all icon imports.
 */
async function generateIconWrapper() {
    console.log("🚀 Initializing Lucide-React Component Factory...");

    if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Example of a centralized "IconLoader" component code
    const iconLoaderCode = `
import React, { Suspense, lazy } from 'react';
import { Loader } from 'lucide-react';

/**
 * Dynamic Icon Component
 * Usage: <DynamicIcon name="home" color="red" size={24} />
 */
export const DynamicIcon = ({ name, ...props }) => {
  const Icon = lazy(() => 
    import('lucide-react').then(module => ({ default: module[name] || module['HelpCircle'] }))
  );

  return (
    <Suspense fallback={<Loader className="animate-spin" />}>
      <Icon {...props} />
    </Suspense>
  );
};
`;

    fs.writeFileSync(`${CONFIG.outputDir}/DynamicIcon.js`, iconLoaderCode);
    console.log(`✅ Success! React Icon Wrapper generated at ${CONFIG.outputDir}/DynamicIcon.js`);
}

/**
 * 4. EXECUTION FLOW
 */
async function start() {
    const isNetworkReady = checkNetworkAccess();
    
    if (isNetworkReady) {
        console.log("📦 Installing dependencies...");
        try {
            execSync(`npm install ${CONFIG.packageName}`, { stdio: 'inherit' });
            await generateIconWrapper();
        } catch (err) {
            console.error("❌ Build Failed: Check local file system permissions.");
        }
    } else {
        console.warn("⚠️  Build aborted due to Firewall restrictions. Use offline cached modules.");
    }
}

start();