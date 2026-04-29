const shell = require('shelljs');

/**
 * Sets up a one-way rule: 
 * Allows internal network to access the web, 
 * but prevents external entities from starting connections.
 */
function setOneWayRule(internalInterface, externalInterface) {
    // 1. Allow established traffic (the "return" journey of a request)
    shell.exec(`sudo iptables -A FORWARD -i ${externalInterface} -o ${internalInterface} -m state --state ESTABLISHED,RELATED -j ACCEPT`);

    // 2. Allow outgoing traffic (the "outbound" journey)
    shell.exec(`sudo iptables -A FORWARD -i ${internalInterface} -o ${externalInterface} -j ACCEPT`);

    // 3. Drop everything else (The "one-way" wall)
    shell.exec(`sudo iptables -P FORWARD DROP`);
    
    console.log("One-way traffic flow established: Internal -> External only.");
}

setOneWayRule('eth1', 'eth0');