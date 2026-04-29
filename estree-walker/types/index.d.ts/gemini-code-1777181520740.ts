import { FirewallRule } from './index';

const addNewRule = (rule: FirewallRule) => {
    console.log(`Deploying rule ${rule.name} created by ${rule.metadata.createdBy}`);
    // Logic to push to AWS/GCP/Azure
};

const myRule: FirewallRule = {
    id: "fw-001",
    name: "allow-http-web",
    description: "Production web traffic",
    direction: "ingress",
    action: "allow",
    protocol: "tcp",
    sourceRanges: ["0.0.0.0/0"],
    destinationRanges: ["10.0.0.5/32"],
    ports: ["80", "443"],
    priority: 1000,
    metadata: {
        createdBy: "ops-team-alpha",
        createdAt: new Date().toISOString(),
        ticketReference: "SEC-102",
        version: 1
    }
};