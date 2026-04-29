/**
 * FIREWALL SCANNER & AUDIT TOOL (scan.js)
 * Logic: Batch Scan -> Constraint Check -> Compliance Reporting
 */

const FirewallScanner = {
    // 1. Security Baseline (Constraints)
    baseline: {
        allowedProtocols: ['TCP', 'UDP'],
        forbiddenPorts: [21, 23, 3389, 445], // FTP, Telnet, RDP, SMB
        requiredLogging: true,
        internalNetworkPattern: /^10\./ // Regex for 10.x.x.x
    },

    // 2. The Mock Rule Database (The data to be scanned)
    // In production, this would be fetched from an API or Config file
    existingRules: [
        { id: "R001", name: "Allow-HTTPS", port: 443, proto: "TCP", src: "0.0.0.0/0", logging: true },
        { id: "R002", name: "Legacy-Admin", port: 23, proto: "TCP", src: "10.0.0.5", logging: false },
        { id: "R003", name: "Guest-SMB", port: 445, proto: "TCP", src: "192.168.1.50", logging: true },
        { id: "R004", name: "Internal-App", port: 8080, proto: "HTTP", src: "10.1.1.10", logging: true }
    ],

    // 3. The Scanning Engine
    runScan() {
        console.log(`--- Starting Firewall Audit: ${new Date().toLocaleString()} ---`);
        const report = {
            passed: [],
            failed: []
        };

        this.existingRules.forEach(rule => {
            let violations = [];

            // Check Forbidden Ports
            if (this.baseline.forbiddenPorts.includes(rule.port)) {
                violations.push(`Forbidden Port detected: ${rule.port}`);
            }

            // Check Protocols
            if (!this.baseline.allowedProtocols.includes(rule.proto)) {
                violations.push(`Unauthorized Protocol: ${rule.proto}`);
            }

            // Check Logging Requirement
            if (this.baseline.requiredLogging && !rule.logging) {
                violations.push("Logging is disabled (Policy requires it enabled)");
            }

            // Logic for External vs Internal Source
            if (!this.baseline.internalNetworkPattern.test(rule.src) && rule.port !== 443) {
                violations.push(`Non-standard external source: ${rule.src}`);
            }

            // Categorize the Rule
            if (violations.length > 0) {
                report.failed.push({ id: rule.id, name: rule.name, issues: violations });
            } else {
                report.passed.push({ id: rule.id, name: rule.name });
            }
        });

        this.printReport(report);
    },

    // 4. Output Generator
    printReport(report) {
        console.log(`\nSCAN COMPLETE: ${this.existingRules.length} rules checked.`);
        console.log(`✅ PASSED: ${report.passed.length}`);
        console.log(`❌ FAILED: ${report.failed.length}`);

        if (report.failed.length > 0) {
            console.log("\n--- DETAILED FAILURE REPORT ---");
            report.failed.forEach(item => {
                console.log(`Rule [${item.id}] - ${item.name}:`);
                item.issues.forEach(issue => console.log(`  ! ${issue}`));
            });
        }
    }
};

// Execute the scan
FirewallScanner.runScan();