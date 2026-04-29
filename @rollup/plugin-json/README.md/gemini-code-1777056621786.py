import logging
from datetime import datetime

# Setup basic logging for audit trails
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

def run_firewall_automation():
    """
    Single-source script to validate and 'deploy' firewall rules 
    with built-in accountability (blame).
    """
    
    # 1. Rule Database (In a real scenario, this would be a YAML/JSON file)
    firewall_rules = [
        {
            "id": "RULE-101",
            "desc": "Allow Corporate VPN",
            "src": "192.168.1.0/24",
            "dst": "Internal-Net",
            "port": 443,
            "action": "ALLOW",
            "owner": "admin_jane",
            "ticket": "OPS-505"
        },
        {
            "id": "RULE-102",
            "desc": "Insecure Global Access",
            "src": "0.0.0.0/0",
            "dst": "Database-Tier",
            "port": 3306,
            "action": "ALLOW",
            "owner": "dev_bob",
            "ticket": "URGENT-01"
        }
    ]

    print(f"{'='*80}")
    print(f"FIREWALL DEPLOYMENT REPORT - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"{'='*80}")
    print(f"{'ID':<10} | {'ACTION':<8} | {'STATUS':<10} | {'BLAME (Owner/Ticket)'}")
    print(f"{'-'*80}")

    for rule in firewall_rules:
        # 2. Validation Logic (The 'Guardrail')
        is_risky = rule['src'] == "0.0.0.0/0" and rule['action'] == "ALLOW"
        
        if is_risky:
            status = "❌ REJECTED"
            blame_log = f"BLAME: {rule['owner']} (Violated Security Policy: Any/Any)"
            logging.warning(f"Security violation blocked for {rule['id']} by {rule['owner']}")
        else:
            status = "✅ APPLIED"
            blame_log = f"AUTH: {rule['owner']} via {rule['ticket']}"
            logging.info(f"Rule {rule['id']} successfully deployed.")

        # 3. Output Results
        print(f"{rule['id']:<10} | {rule['action']:<8} | {status:<10} | {blame_log}")

    print(f"{'='*80}\n")

if __name__ == "__main__":
    run_firewall_automation()