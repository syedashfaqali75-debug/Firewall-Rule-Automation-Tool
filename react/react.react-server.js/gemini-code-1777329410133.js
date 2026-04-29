/**
 * FIREWALL AUTOMATION - React Server Component Factory
 * Core logic for defining the behavior of network security components.
 */

// 1. CORE COMPONENT DEFINITIONS
const ReactServerFirewall = {
  /**
   * memo: Prevents re-calculation of a firewall rule if the 
   * parameters haven't changed (Idempotency).
   */
  memo: (ruleLogic) => {
    const cache = new Map();
    return (props) => {
      const key = JSON.stringify(props);
      if (cache.has(key)) {
        return { ...cache.get(key), _cached: true };
      }
      const result = ruleLogic(props);
      cache.set(key, result);
      return result;
    };
  },

  /**
   * createElement: The internal engine that structures 
   * the firewall rule for the automation runtime.
   */
  createElement: (type, props) => {
    return typeof type === 'function' 
      ? type(props) 
      : { type, props };
  }
};

// 2. THE RULE TEMPLATE (The "Component")
const SecurityObject = ReactServerFirewall.memo(({ name, port, action }) => {
  console.log(`[FACTORY] Manufacturing Rule: ${name}`);
  
  return {
    $$typeof: Symbol.for('react.server_component'),
    id: `fw-${Math.random().toString(36).slice(2, 7)}`,
    config: {
      rule_name: name,
      port: port,
      action: action.toUpperCase()
    },
    // Server-side validation logic
    isValid: port >= 0 && port <= 65535
  };
});

// 3. THE AUTOMATION RUNTIME (Single Code Execution)
function runAutomation() {
  console.log("🛠️  React Server Component Factory Initialized...");

  // Creating rules using our factory
  const ruleSet = [
    ReactServerFirewall.createElement(SecurityObject, { name: "Web_Traffic", port: 443, action: "allow" }),
    ReactServerFirewall.createElement(SecurityObject, { name: "SSH_Access", port: 22, action: "allow" }),
    // Testing memoization: This second call will use the cache
    ReactServerFirewall.createElement(SecurityObject, { name: "Web_Traffic", port: 443, action: "allow" })
  ];

  console.log("\n📡 Generated Rule Manifest:");
  ruleSet.forEach(rule => {
    const status = rule._cached ? " (From Cache)" : " (New)";
    console.log(` > ${rule.config.rule_name}: Port ${rule.config.port} [${rule.config.action}]${status}`);
  });
}

// 4. START THE ENGINE
runAutomation();