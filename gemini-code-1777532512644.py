import json

def check_lockfile_sources(file_path, allowed_domain):
    with open(file_path, 'r') as f:
        data = json.load(f)
    
    # Check packages in the lockfile
    dependencies = data.get('packages', {})
    issues = []

    for name, details in dependencies.items():
        resolved = details.get('resolved', '')
        if resolved and allowed_domain not in resolved:
            issues.append(f"ALERT: {name} is fetching from {resolved}")

    return issues

# Example Usage
violations = check_lockfile_sources('package-lock.json', 'my-internal-repo.com')
for v in violations:
    print(v)