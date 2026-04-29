public class RuleEngine {
    public void applyRule(FirewallRule rule) {
        // Logic to translate rule object to system command
        String command = String.format("sudo iptables -A %s -p %s --dport %d -j %s",
                rule.getChain(), rule.getProtocol(), rule.getPort(), rule.getAction());
        
        System.out.println("Executing: " + command);
        // Runtime.getRuntime().exec(command);
    }
}