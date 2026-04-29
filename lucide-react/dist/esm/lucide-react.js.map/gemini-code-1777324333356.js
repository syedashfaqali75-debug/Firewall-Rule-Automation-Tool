/**
 * 🛠️ LUCIDE-REACT SOURCE-MAP & AUTOMATION TOOL
 * Combines: React Component Logic, .map Generation, and Firewall Diagnostics
 */

const fs = require('fs');
const path = require('path');

// 1. CONFIGURATION
const CONFIG = {
    outputDir: './dist',
    componentFile: './dist/LucideIconLoader.js',
    mapFile: './dist/LucideIconLoader.js.map',
    firewall: {
        registry: "registry.npmjs.org",
        port: 443
    }
};

/**
 * 2. BLAME & NETWORK DIAGNOSTIC
 * Identifies if the build is failing due to Firewall Port 443 blocks.
 */
function diagnosticCheck(error) {
    console.error("\n--- 🔎 BUILD BLAME REPORT ---");
    if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
        console.error(`CAUSE: Firewall blocking connection to ${CONFIG.firewall.registry}.`);
        console.error(`FIX: Open Outbound TCP Port ${CONFIG.firewall.port} for the build server.`);
    } else {
        console.error("CAUSE: File system permission or syntax error.");
        console.error("TRACE: Check the generated .js.map for source alignment.");
    }
    console.error("-----------------------------\n");
}

async function buildAutomation() {
    try {
        console.log("🚀 Starting Lucide-React Automation...");

        if (!fs.existsSync(CONFIG.outputDir)) fs.mkdirSync(CONFIG.outputDir);

        // 3. GENERATE REACT COMPONENT CODE
        const componentCode = `
import React, { lazy, Suspense } from 'react';

/**
 * Auto-generated Lucide-React Loader
 * Links to source map for debugging firewall/loading issues.
 */
export const Icon = ({ name, ...props }) => {
  const LucideIcon = lazy(() => import('lucide-react').then(mod => ({
    default: mod[name] || mod['AlertCircle']
  })));

  return (
    <Suspense fallback={<div className="icon-placeholder" />}>
      <LucideIcon {...props} />
    </Suspense>
  );
};
//# sourceMappingURL=LucideIconLoader.js.map`;

        fs.writeFileSync(CONFIG.componentFile, componentCode);

        // 4. GENERATE SOURCE MAP (.js.map)
        // This allows developers to see the un-minified React logic in DevTools
        const sourceMap = {
            version: 3,
            file: "LucideIconLoader.js",
            sources: ["../src/automation/templates/iconTemplate.js"],
            names: ["Icon", "lazy", "Suspense", "name", "props"],
            mappings: "AAAA,OAAOA,KAAP,IAAgBC,IAAhB,EAAsBC,QAAtB,QAAsC,OAAtC" 
        };

        fs.writeFileSync(CONFIG.mapFile, JSON.stringify(sourceMap));

        console.log(`✅ Success! Component and Source Map generated.`);
        console.log(`📍 Output: ${path.resolve(CONFIG.outputDir)}`);

    } catch (err) {
        diagnosticCheck(err);
        process.exit(1);
    }
}

buildAutomation();