/**
 * FIREWALL RULE AUTOMATION & COMPILER RUNTIME
 * Description: Compiles JSON-based security policies into an active 
 * runtime engine to filter traffic and automate rule deployment.
 */

// 1. THE COMPILER: Processes raw policy into executable logic
const FirewallCompiler = {
    compile: (rawPolicy) => {
        console.log("🛠️  Compiling firewall policies...");
        return rawPolicy.map(rule => ({
            ...rule,
            id: `rule-${Math.random().toString(36).substr(2, 9)}`,
            timestamp: new Date().toISOString(),
            matcher: (packet) => {
                const portMatch = rule.port === "*" || rule.port === packet.port;
                const ipMatch = rule.src === "*" || rule.src === packet.src;
                return portMatch && ipMatch;
            }
        }));
    }
};

// 2. THE RUNTIME: Executes the compiled rules against incoming traffic
class FirewallRuntime {
    constructor(compiledRules) {
        this.rules = compiledRules;
        this.logs = [];
    }

    processPacket(packet) {
        console.log(`\n🔍 Inspecting packet: [${packet.src} -> Port ${packet.port}]`);
        
        // Find the first matching rule (Priority based)
        const match = this.rules.find(rule => rule.matcher(packet));

        if (match) {
            console.log(`✅ MATCH FOUND: "${match.name}" -> Action: ${match.action}`);
            this._logActivity(packet, match);
            return match.action;
        }

        console.log("⚠️  NO MATCH: Defaulting to DROP");
        return "DROP";
    }

    _logActivity(packet, rule) {
        this.logs.push({ event: "FILTER", packet, rule: rule.name, time: new Date() });
    }
}

// 3. AUTOMATION & EXECUTION (Single Code Entry Point)
const RAW_POLICIES = [
    { name: "Allow-Web", port: 443, src: "*", action: "ALLOW" },
    { name: "Block-SSH-Internal", port: 22, src: "192.168.1.50", action: "BLOCK" },
    { name: "Global-DNS", port: 53, src: "*", action: "ALLOW" }
];

// Compile and Start Runtime
const activeRules = FirewallCompiler.compile(RAW_POLICIES);
const engine = new FirewallRuntime(activeRules);

// Simulation: Testing the automation
const traffic = [
    { src: "10.0.0.1", port: 443 },  // Should ALLOW
    { src: "192.168.1.50", port: 22 }, // Should BLOCK
    { src: "8.8.8.8", port: 999 }     // Should DROP (No match)
];

traffic.forEach(p => engine.processPacket(p));

console.log("\n📊 Automation Audit Log:", JSON.stringify(engine.logs, null, 2));