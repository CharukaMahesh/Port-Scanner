class PortScanner {
    constructor(target, startPort, endPort, timeout = 1000, scanType = "tcp") {
        this.target = target;
        this.startPort = startPort;
        this.endPort = endPort;
        this.timeout = timeout;
        this.scanType = scanType.toLowerCase();
    }

    async scan() {
        console.log(`Scanning target ${this.target}...`);
        let openPorts = [];
        try {
            for (let port = this.startPort; port <= this.endPort; port++) {
                try {
                    let socket = new WebSocket(`ws://${this.target}:${port}`);
                    await Promise.race([
                        new Promise((resolve) => socket.onopen = resolve),
                        new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), this.timeout))
                    ]);
                    openPorts.push(port);
                    socket.close();
                } catch (error) {
                    // Handle specific errors
                    if (error instanceof DOMException) {
                        console.log(`Port ${port} is closed`);
                    } else {
                        console.log(`An error occurred while scanning port ${port}: ${error.message}`);
                    }
                }
            }
            console.log("Scan completed. Open ports:", openPorts);
            return openPorts;
        } catch (error) {
            console.log(`An error occurred: ${error.message}`);
            return [];
        }
    }
}

// Example usage:
const scanner = new PortScanner("127.0.0.1", 1, 100);
scanner.scan().then((openPorts) => {
    console.log("Open ports:", openPorts);
}).catch((error) => {
    console.log("Scan failed:", error.message);
});
