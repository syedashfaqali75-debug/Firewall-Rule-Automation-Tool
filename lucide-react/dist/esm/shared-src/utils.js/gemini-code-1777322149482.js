/**
 * utils.js - Firewall Automation & Blame Tracking
 */

const FirewallUtils = {
  /**
   * Generates a complete rule with a "blame" metadata layer.
   * @param {string} user - Who is creating the rule (e.g., 'admin', 'ci-bot')
   * @param {Object} config - The firewall parameters
   */
  createRuleWithBlame: (user, config = {}) => {
    const { 
      proto = 'tcp', 
      port, 
      src = '0.0.0.0/0', 
      action = 'ALLOW', 
      reason = 'No reason provided' 
    } = config;

    // 1. Basic Validation
    if (!port || isNaN(port)) {
      throw new Error("Automation Error: A valid port must be defined.");
    }

    // 2. The "Blame" Metadata Object
    const blame = {
      author: user,
      timestamp: new Date().toISOString(),
      justification: reason,
      version: "1.0-stable",
      origin: "Firewall-Auto-Tool"
    };

    // 3. Return the merged rule object
    return {
      rule: {
        protocol: proto.toLowerCase(),
        destination_port: port,
        source_address: src,
        action: action.toUpperCase()
      },
      blame: blame,
      raw: `${proto.toLowerCase()}:${port}:${action.toUpperCase()}`
    };
  },

  /**
   * Simple helper to check if a rule exists in a list (Audit helper)
   */
  findRuleByPort: (ruleList, port) => {
    return ruleList.find(r => r.rule.destination_port === port) || null;
  }
};

// --- Quick Example Usage ---
// const myRule = FirewallUtils.createRuleWithBlame('DevOps-Lead', {
//   port: 8080,
//   proto: 'tcp',
//   reason: 'Deploying legacy web service'
// });
// console.log(myRule);

module.exports = FirewallUtils;