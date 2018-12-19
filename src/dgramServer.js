const dgram = require('dgram');

class dgramServer {
    constructor() {
        this.server = dgram.createSocket('udp4');
        this.isLoopSend = false;
        let that = this;
        this.port = 0;

        this.client = dgram.createSocket('udp4');

        this.server.on('error', (err) => {
            console.log(`server error:\n${err.stack}`);
            server.close();
        });

        this.server.on('message', (msg, rinfo) => {
            // console.log(`server got: ${msg.length} from ${rinfo.address}:${rinfo.port}`);
            let HOST = '192.168.2.72';
            if (that.isLoopSend) {
                that.client.send(msg, 0, msg.length, that.port, HOST, function (err, bytes) {
                    if (err) {
                        console.log('err: ', err);
                    };

                    // console.log('UDP message sent to ' + HOST + ':' + that.port);
                    // client.close();
                });
            }
        });

        this.server.on('listening', () => {
            const address = that.server.address();
            console.log(`server listening ${address.address}:${address.port}`);
        });

        this.server.bind(51600);
        // server listening 0.0.0.0:51600
    }

    sendData(isSend, send2Port) {
        this.isLoopSend = isSend;
        this.port = send2Port;
    }
}

module.exports = dgramServer;