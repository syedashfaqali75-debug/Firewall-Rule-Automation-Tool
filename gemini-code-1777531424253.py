import os
import subprocess
import sys

# 1. THE AUTOMATION LOGIC
def apply_rule(proto, port, action="ACCEPT"):
    """Applies iptables rules to the host/container network."""
    cmd = ["iptables", "-A", "INPUT", "-p", proto, "--dport", port, "-j", action]
    try:
        print(f"[*] Running: {' '.join(cmd)}")
        subprocess.run(cmd, check=True)
        print(f"[+] Success: {action} {proto}/{port}")
    except subprocess.CalledProcessError:
        print("[-] Error: Ensure you have NET_ADMIN privileges.")
    except FileNotFoundError:
        print("[-] Error: iptables not found. Install it via 'apt install iptables'.")

# 2. THE DOCKERFILE GENERATOR
DOCKERFILE_CONTENT = """
FROM python:3.11-slim
RUN apt-get update && apt-get install -y iptables && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY firewall_master.py .
ENTRYPOINT ["python", "firewall_master.py"]
"""

def create_dockerfile():
    with open("Dockerfile", "w") as f:
        f.write(DOCKERFILE_CONTENT.strip())
    print("[+] Dockerfile generated successfully.")

# 3. CLI HANDLER
if __name__ == "__main__":
    if len(sys.argv) == 1:
        print("--- Firewall Automation Tool ---")
        print("To generate Dockerfile: python firewall_master.py setup")
        print("To apply rule:         python firewall_master.py <proto> <port> <action>")
        sys.exit(1)

    if sys.argv[1] == "setup":
        create_dockerfile()
    elif len(sys.argv) >= 3:
        protocol = sys.argv[1]
        port_num = sys.argv[2]
        act = sys.argv[3] if len(sys.argv) > 3 else "ACCEPT"
        apply_rule(protocol, port_num, act)