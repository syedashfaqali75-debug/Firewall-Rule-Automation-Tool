import { parse } from 'acorn';
import { walk } from 'estree-walker';

// This represents the code we are auditing
const code = `
  const api = "https://safe-api.com/data";
  const internal = "http://192.168.1.50/admin"; // Firewall should block this
  
  fetch(internal).then(res => res.json());
`;

// 1. Convert code to an Abstract Syntax Tree (AST)
const ast = parse(code, { ecmaVersion: 2020, locations: true });

// 2. Define our "Firewall Rule" (Restricted IP)
const RESTRICTED_IP = "192.168.1.50";

console.log("--- Starting Security Scan ---");

walk(ast, {
  enter(node) {
    // We are looking for string literals that contain our restricted IP
    if (node.type === 'Literal' && typeof node.value === 'string') {
      if (node.value.includes(RESTRICTED_IP)) {
        
        // 3. The "Blame" Logic
        const line = node.loc.start.line;
        const column = node.loc.start.column;
        
        console.error(`[FIREWALL VIOLATION]`);
        console.error(`Rule: No direct access to ${RESTRICTED_IP}`);
        console.error(`Location: Line ${line}, Column ${column}`);
        console.error(`Snippet: "${node.value}"`);
        console.error(`------------------------------`);
      }
    }
  }
});