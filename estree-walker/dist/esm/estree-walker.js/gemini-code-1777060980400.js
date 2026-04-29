const acorn = require('acorn');
const { walk } = require('estree-walker');
const { execSync } = require('child_process');

const code = `
const firewallConfig = {
  port: 8080,
  action: "ALLOW"
};
`;

// 1. Parse the code into an AST
const ast = acorn.parse(code, { ecmaVersion: 2020, locations: true });

// 2. Walk the tree to find our firewall rules
walk(ast, {
  enter(node) {
    if (
      node.type === 'VariableDeclarator' && 
      node.id.name === 'firewallConfig'
    ) {
      const line = node.loc.start.line;
      console.log(`Found firewall rule on line: ${line}`);
      
      // 3. Get the "Blame" from Git
      try {
        // We use --line-porcelain to get detailed metadata including the author
        const blame = execSync(`git blame -L ${line},${line} --porcelain path/to/your/file.js`).toString();
        const author = blame.match(/^author (.+)$/m)[1];
        
        console.log(`⚠️ Security Alert: Rule modified by ${author}`);
      } catch (err) {
        console.log("Could not fetch Git blame. Are you in a git repo?");
      }
    }
  }
});