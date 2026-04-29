import java.io.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Firewall Rule Automation Tool
 * License: Apache 2.0
 * Author: Syed Ashfaq Ali
 */
public class FirewallAutomationTool {

    // Internal class to represent a Firewall Rule
    static class Rule {
        String id;
        String ip;
        String port;
        String action;

        Rule(String id, String ip, String port, String action) {
            this.id = id;
            this.ip = ip;
            this.port = port;
            this.action = action;
        }
    }

    public static void main(String[] args) {
        System.out.println("--- Initializing Firewall Automation ---");

        // 1. Define Rules (In a real scenario, these could be loaded from a file)
        List<Rule> ruleList = new ArrayList<>();
        ruleList.add(new Rule("RULE-001", "192.168.1.100", "80", "ACCEPT"));
        ruleList.add(new Rule("RULE-002", "10.0.0.5", "22", "DROP"));

        // 2. Process and Automate
        for (Rule rule : ruleList) {
            boolean success = executeIptablesCommand(rule);
            
            // 3. Blame/Audit System
            logAuditTrail("Admin_User", rule, success ? "SUCCESS" : "FAILED");
        }
    }

    /**
     * Executes the system-level command to update firewall rules.
     */
    private static boolean executeIptablesCommand(Rule rule) {
        try {
            // Standard Linux iptables syntax
            String command = String.format("sudo iptables -A INPUT -s %s -p tcp --dport %s -j %s",
                    rule.ip, rule.port, rule.action);

            System.out.println("Executing: " + command);
            
            Process process = Runtime.getRuntime().exec(command);
            int exitCode = process.waitFor();
            
            return exitCode == 0;
        } catch (Exception e) {
            System.err.println("Execution Error: " + e.getMessage());
            return false;
        }
    }

    /**
     * Logs every action for accountability (The Blame System).
     */
    private static void logAuditTrail(String user, Rule rule, String status) {
        String logEntry = String.format("[%s] USER: %s | RULE: %s | TARGET: %s:%s | STATUS: %s",
                LocalDateTime.now(), user, rule.id, rule.ip, rule.port, status);

        try (PrintWriter out = new PrintWriter(new BufferedWriter(new FileWriter("firewall_audit.log", true)))) {
            out.println(logEntry);
            System.out.println("Audit log updated for " + rule.id);
        } catch (IOException e) {
            System.err.println("Audit Logging Failed: " + e.getMessage());
        }
    }
}