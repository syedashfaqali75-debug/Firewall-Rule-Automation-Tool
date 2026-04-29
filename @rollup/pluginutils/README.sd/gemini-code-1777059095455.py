import subprocess
import yaml

def get_rule_blame(file_path, rule_name):
    """
    Shows who last modified a specific rule by parsing 
    the git blame output for the YAML file.
    """
    try:
        # Run git blame on the file
        result = subprocess.check_output(['git', 'blame', file_path]).decode('utf-8')
        
        with open(file_path, 'r') as f:
            lines = f.readlines()
            
        print(f"--- Blame Report for Rule: {rule_name} ---")
        for i, line in enumerate(lines):
            if rule_name in line:
                # Print the git blame info for that specific line
                blame_info = subprocess.check_output(['git', 'blame', '-L', f'{i+1},{i+1}', file_path])
                print(blame_info.decode('utf-8').strip())
                
    except Exception as e:
        print(f"Error retrieving blame: {e}. Ensure the file is tracked by Git.")

if __name__ == "__main__":
    # Example usage:
    get_rule_blame('rules/web_tier.yaml', 'Allow-LoadBalancer')