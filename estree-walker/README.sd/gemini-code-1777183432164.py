import json
import subprocess
import datetime
import sys
import argparse

class Shield:
    def __init__(self, config_path="rules.json", log_path="firewall.audit"):
        self.config_path = config_path
        self.log_path = log_path

    def _generate_blame(self, rule_id, action, status):
        """Records the 'Blame' trail with high-resolution timestamps."""
        now = datetime.datetime.now().isoformat()
        entry = f"[{now}] RULE:{rule_id} | ACTION:{action} | STATUS:{status}\n"
        with open(self.log_path, "a") as f:
            f.write(entry)

    def apply_policy(self):
        try:
            with open(self.config_path, "r") as f:
                rules = json.load(f)
        except FileNotFoundError:
            print(f"Error: {self.config_path} not found.")
            return

        print(f"🛡️  Shield: Initializing rule deployment...")
        
        for rule in rules:
            # Constructing the system command (iptables example)
            cmd = [
                "sudo", "iptables", "-A", "INPUT",
                "-p", rule["proto"],
                "--dport", str(rule["port"]),
                "-s", rule["src"],
                "-j", rule["action"]
            ]
            
            try:
                # In a real environment, shell=False is safer
                print(f"Applying: {rule['id']} ({rule['description']})")
                # subprocess.run(cmd, check=True) # Uncomment to execute for real
                
                self._generate_blame(rule["id"], "DEPLOY", "SUCCESS")
            except Exception as e:
                print(f"Failed to apply {rule['id']}: {e}")
                self._generate_blame(rule["id"], "DEPLOY", f"FAILED: {e}")

    def view_blame(self):
        """Prints the audit history."""
        print("📜 --- SHIELD AUDIT LOG (BLAME) ---")
        try:
            with open(self.log_path, "r") as f:
                print(f.read())
        except FileNotFoundError:
            print("No audit history found.")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Shield Firewall Automator")
    parser.add_argument("--apply", action="store_true", help="Execute rules from JSON")
    parser.add_argument("--blame", action="store_true", help="Show audit history")
    
    args = parser.parse_args()
    shield = Shield()

    if args.apply:
        shield.apply_policy()
    elif args.blame:
        shield.view_blame()
    else:
        parser.print_help()