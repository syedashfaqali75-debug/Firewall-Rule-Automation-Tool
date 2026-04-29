/**
 * LICENSE: MIT
 * Firewall Rule Automation: Dynamic Icon Mapping & Type Safety
 */

// --- START dynamiciconImports.d.ts SECTION ---
/**
 * Represents the available icon assets for different firewall types.
 * This allows the automation tool to dynamically import the correct visual.
 */
export type FirewallIconType = 'shield-cloud' | 'shield-check' | 'shield-alert' | 'server-lock';

export interface IconRegistry {
  [key: string]: {
    path: string;
    lazyLoad: () => Promise<any>;
    category: 'provider' | 'status' | 'security';
  };
}

// Global declaration for the dynamic import manifest
export declare const IconManifest: IconRegistry;
// --- END dynamiciconImports.d.ts SECTION ---


// --- AUTOMATION ENGINE IMPLEMENTATION ---

/**
 * Registry of dynamic imports. 
 * In a real build (Vite/Webpack), these would be actual dynamic import() calls.
 */
const IconManifest: IconRegistry = {
  'GCP': { 
    path: './icons/gcp-shield.svg', 
    lazyLoad: () => import('./icons/gcp-shield.svg'), 
    category: 'provider' 
  },
  'AWS': { 
    path: './icons/aws-shield.svg', 
    lazyLoad: () => import('./icons/aws-shield.svg'), 
    category: 'provider' 
  },
  'ALERT': { 
    path: './icons/alert.svg', 
    lazyLoad: () => import('./icons/alert.svg'), 
    category: 'status' 
  }
};

/**
 * Class to handle firewall rule logic with dynamic visual metadata
 */
class DynamicFirewallTool {
  /**
   * Resolves the icon for a rule based on the provider dynamically.
   */
  public async getRuleIcon(provider: string): Promise<string> {
    const iconEntry = IconManifest[provider] || IconManifest['ALERT'];
    
    console.log(`🔍 Fetching icon from: ${iconEntry.path}`);
    // Simulate dynamic loading of the icon asset
    await iconEntry.lazyLoad(); 
    
    return iconEntry.path;
  }

  public automate(ruleName: string, provider: 'GCP' | 'AWS') {
    console.log(`🛠 Automating ${ruleName} on ${provider}...`);
    this.getRuleIcon(provider).then(path => {
      console.log(`✅ Rule deployed. Dashboard Icon set to: ${path}`);
    });
  }
}

// --- EXECUTION ---
const tool = new DynamicFirewallTool();
tool.automate("Allow-HTTPS-Global", "GCP");