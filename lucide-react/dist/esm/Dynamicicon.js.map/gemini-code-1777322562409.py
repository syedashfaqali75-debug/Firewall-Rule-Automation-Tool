import subprocess
import sys

def automate_firewall_rule(action, file_extension=".js.map"):
    """
    Automates an iptables rule to block or allow traffic 
    containing specific string patterns (like .js.map).
    """
    # The string to look for in the packet hex/ascii
    search_string = file_extension
    
    # Constructing the iptables command
    # -I INPUT 1: Insert at the top of the Input chain
    # -p tcp --dport 80: Focus on HTTP traffic
    # -m string: Use the string matching module
    # --algo bm: Use Boyer-Moore search algorithm
    if action == "block":
        command = [
            "sudo", "iptables", "-I", "INPUT", "1", 
            "-p", "tcp", "--dport", "80", 
            "-m", "string", "--string", search_string, 
            "--algo", "bm", "-j", "DROP"
        ]
        status = f"Blocking requests containing: {search_string}"
    elif action == "remove":
        command = [
            "sudo", "iptables", "-D", "INPUT", 
            "-p", "tcp", "--dport", "80", 
            "-m", "string", "--string", search_string, 
            "--algo", "bm", "-j", "DROP"
        ]
        status = f"Removing block rule for: {search_string}"
    else:
        print("Invalid action. Use 'block' or 'remove'.")
        return

    try:
        subprocess.run(command, check=True)
        print(f"Success: {status}")
    except subprocess.CalledProcessError as e:
        print(f"Error: Could not modify firewall. Are you root? \n{e}")

if __name__ == "__main__":
    # Example usage: block dynamicicon.js.map specifically
    automate_firewall_rule("block", "dynamicicon.js.map")