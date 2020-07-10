const net = require('net');

// Builder，实现通用的方法（不一定是全部都要实现）
class Server {
    setHostname() {}
    setPortNumber() {}
    setOnConnection() {}
    listen() {}
}

// Concrete Builder，Builder的具体的实现
class ServerBuilder extends Server {
    constructor() {
        super();
        this._server = null
        this._hostname = 'localhost'
        this._port = 8080
        this._isHalfOpenedSockedAllowed = false
        this._isPauseOnConnect = false
        this._onConnectionCb = () => {}
    }

    setHostname(hostname) {
        this._hostname = hostname;
        return this
    }

    setPortNumber(portNumber) {
        this._port = portNumber;
        return this
    }

    setOnConnection(cb) {
        this._onConnectionCb = cb;
        return this
    }

    setHalfOpenSocketAllowd() {
        this._isHalfOpenedSockedAllowed = true
        return this
    }

    setPauseOnConnect() {
        this._isPauseOnConnect = true
        return this
    }

    listen(cb) {
        this._server = net.createServer({
            allowHalfOpen: this._isHalfOpenedSockedAllowed,
            pauseOnConnect: this._isPauseOnConnect
        })
        this._server.on("connection", this._onConnectionCb);
        this._server.listen(this._port, this._hostname, cb)
        return this
    }
}

// Director
let serverBuilder = new ServerBuilder();

// Client
serverBuilder
    .setHostname("localhost")
    .setPortNumber(8080)
    .listen();
