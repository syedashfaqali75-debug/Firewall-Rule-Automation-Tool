/**
 * FIREWALL AUTOMATION TOOL - JSX Runtime Simulation
 * This script "compiles" JSX-like rule components into a 
 * live JSON security policy for network automation.
 */

// 1. THE RUNTIME ENGINE (The 'Compiler')
const FirewallRuntime = {
    // Simulates the jsxDEV function found in jsx-dev-runtime.js
    jsxDEV: (type, props) => {
        return {
            type,
            props: {
                ...props,
                children: props.children || []
            },
            metadata: {
                generatedAt: new Date().toISOString(),
                checksum: Math.random().toString(16).slice(2)
            }
        };
    }
};

// 2. THE COMPONENT LIBRARY (Declarative Rule Definitions)
const Rule = (props) => props; 
const Group = (props) => props;

// 3. THE "SOURCE CODE" (Simulating the compiled JSX output)
// This represents what a developer would write in a .jsx file
const CompiledSecurityPolicy = [
    FirewallRuntime.jsxDEV(Rule, {
        name: "Allow-HTTPS",
        port: 443,
        action: "ACCEPT",
        src: "ANY"
    }),
    FirewallRuntime.jsxDEV(Rule, {
        name: "Block-Legacy-Telnet",
        port: 23,
        action: "REJECT",
        src: "INTERNAL"
    }),
    FirewallRuntime.jsxDEV(Group, {
        name: "Database-Cluster",
        rules: [
            { port: 3306, action: "ACCEPT", src: "App-Tier" }
        ]
    })
];

// 4. AUTOMATION & DEPLOYMENT LOGIC
class AutomationDeployer {
    static deploy(policy) {
        console.log("🚀 Starting JSX-Dev Runtime Deployment...");
        
        policy.forEach(element => {
            const { type, props, metadata } = element;
            
            if (type === Rule) {
                console.log(`[RULE] Deploying: ${props.name} | Port: ${props.port} | Hash: ${metadata.checksum}`);
            } else if (type === Group) {
                console.log(`[GROUP] Deploying Cluster: ${props.name} with ${props.rules.length} sub-rules`);
            }
        });

        console.log("\n✅ Synchronization Complete. Firewall is now live.");
    }
}

// 5. EXECUTION
AutomationDeployer.deploy(CompiledSecurityPolicy);