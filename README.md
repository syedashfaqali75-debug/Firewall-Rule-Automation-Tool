from fabric import Connection, Group

# --- CONFIGURATION ---
# List your server IP addresses or hostnames here
target_hosts = ["192.168.1.10", "192.168.1.11"]

# SSH Credentials (Best practice: use SSH keys!)
config = {
    "user": "admin",
    "connect_kwargs": {
        "key_filename": "/path/to/your/id_rsa",
    }
}

# Define the rules you want to apply
# This example uses UFW (Uncomplicated Firewall) for simplicity
firewall_commands = [
    "sudo ufw default deny incoming",
    "sudo ufw default allow outgoing",
    "sudo ufw allow 22/tcp",  # Keep SSH open!
    "sudo ufw allow 80/tcp",  # HTTP
    "sudo ufw allow 443/tcp", # HTTPS
    "sudo ufw --force enable"
]

def deploy_firewall():
    print(f"🚀 Starting deployment to {len(target_hosts)} hosts...")
    
    # Create a group connection
    group = Group(*target_hosts, user=config["user"], connect_kwargs=config["connect_kwargs"])
    
    for cmd in firewall_commands:
        print(f"🛠️ Executing: {cmd}")
        try:
            # run() executes the command on all hosts in the group
            results = group.run(cmd, hide=True)
            for connection, result in results.items():
                print(f"✅ {connection.host}: Success")
        except Exception as e:
            print(f"❌ Error during execution: {e}")

if __name__ == "__main__":
    deploy_firewall()
    print("✨ Automation complete.")
