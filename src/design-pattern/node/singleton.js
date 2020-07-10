class Server {
    static instance;
    constructor(port) {
        this.port = port
    }

    static getInstance() {
        if (typeof Server.instance === 'object') {
            return Server.instance;
        }
        Server.instance = new Server(8080);
        return Server.instance;
    }

    static init(port) {
        if (typeof Server.instance === 'object') {
            return Server.instance;
        }
        Server.instance = new Server(port);
        return Server.instance;
    }

    status() {
        console.log(`Server listening on port ${this.port}`)
    }
}

Server.getInstance().status();
