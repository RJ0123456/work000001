#!/usr/bin/env node
const WebSocketClient = require('websocket').client;
const msprotocol = require('./msprotocol');
const W3CWebSocket = require('websocket').w3cwebsocket;
const stun = require('stun');
// const dtls = require("node-dtls-client");
const dtls = require('@nodertc/dtls');
// var dtls = require( 'dtls' );
const dgramServer = require('./dgramServer');
var fs = require('fs');

const WS_SUBPROTOCOL = 'protoo';

class msproxy {
    constructor() {
        // this.url = 'websdkmediasoup1.3ttech.cn';
        this.url = 'websdktest002.3ttech.cn';
        this.name = 'junshan';
        this.room = 'test000000';
        //this._client = new WebSocketClient();
        this._msprotocol = new msprotocol();
        this._connection = null;

        this.sendId = 5933066; // create transport id send.
        this.recvId = 29561985; //create transport id recv.
        this.recvTransId = 5956765;
        this.sendTransId = 5956766;

        this.audioSSRC = 0;
        this.videoSSRC = 0;

        this.dgram = new dgramServer();
    }

    connect() {
        const protooUrl = `wss://${this.url}:3443/?peerName=${this.name}&roomId=${this.room}`;
        this._client = new W3CWebSocket(protooUrl, WS_SUBPROTOCOL);
        let that = this;

        this._client.onerror = function () {
            console.log('Connection Error');
        };

        this._client.onopen = function () {
            console.log('WebSocket Client Connected');
        };

        this._client.onclose = function () {
            console.log('echo-protocol Client Closed');
        };

        this._client.onmessage = function (e) {
            if (typeof e.data === 'string') {
                console.log("Received: '" + e.data + "'");
                let json = JSON.parse(e.data);
                let peerId = 0;

                if (json.request) {
                    if (json.data.method == 'newPeer') {
                        const msg = that._msprotocol.baseResponse(json.id);
                        that.sendReq(JSON.stringify(msg));
                    } else if (json.data.method == 'newConsumer' && json.data.kind == 'video') {
                        peerId = json.data.id;
                        let msg = that._msprotocol.baseResponse(json.id);
                        that.sendReq(JSON.stringify(msg));

                        // msg = that._msprotocol.enableConsumer(peerId, that.recvTransId);
                        // that.sendReq(JSON.stringify(msg));
                    } else if (json.data.method == 'consumerPreferredProfileSet') {
                        let msg = that._msprotocol.baseResponse(json.id);
                        that.sendReq(JSON.stringify(msg));
                    } else {
                        const msg = that._msprotocol.baseResponse(json.id);
                        that.sendReq(JSON.stringify(msg));
                    }
                }

                if (json.response) {
                    // if(json.hasOwnProperty('peers')) {
                    if (JSON.stringify(json).indexOf('peers') >= 0) {
                        json.data.peers[0].consumers.forEach(element => {
                            if (element.kind == 'video') {
                                peerId = element.id;

                                this.videoSSRC = element.rtpParameters.encodings[0].ssrc;
                                // console.log('0000000000000', peerId);
                                // let msg = that._msprotocol.enableConsumer(peerId, that.recvTransId);
                                // that.sendReq(JSON.stringify(msg));
                            }

                            if (element.kind == 'audio') {
                                this.audioSSRC = element.rtpParameters.encodings[0].ssrc;
                            }
                        });
                    }

                    // response from create transport.
                    // if (json.id == that.recvId) {
                    if (json.id == that.sendId) {
                        // for (var i = 0; i < 10; i++) {
                        //do STUN
                        let port = json.data.iceCandidates[0].port;
                        let userName = json.data.iceParameters.usernameFragment;
                        let password = json.data.iceParameters.password;

                        that.dgram.sendData(true, port);
                        // that.stunQuery(port, userName, password);

                        // setInterval(() => {
                        //     that.stunQuery(port, userName, password);
                        // }, 3000);
                    }
                }
            }
        };
    }

    joinRoom() {
        let msg = this._msprotocol.queryRoom();
        this.sendReq(JSON.stringify(msg));

        msg = this._msprotocol.joinRoom(this.name);
        this.sendReq(JSON.stringify(msg));

        // msg = this._msprotocol.createRecvTransport(this.recvId, this.recvTransId);
        // this.sendReq(JSON.stringify(msg));

        this.createVideoProducer();
    }

    createVideoProducer() {
        let id = this.sendId;
        let sendTransId = 46153434;
        let audioPeerId = 46153333;
        let videoPeerId = 46153444;

        // let msg = this._msprotocol.createSendTransport(id, sendTransId);
        // this.sendReq(JSON.stringify(msg));

        let msg = this._msprotocol.createSendPlainRTPTransport(id, this.sendTransId);
        this.sendReq(JSON.stringify(msg));

        msg = this._msprotocol.createAudioProducer(sendTransId, this.audioSSRC, audioPeerId);
        this.sendReq(JSON.stringify(msg));

        msg = this._msprotocol.createVideoProducer(sendTransId, this.videoSSRC, videoPeerId);
        this.sendReq(JSON.stringify(msg));
    }

    sendReq(msg) {
        var delayInMilliseconds = 300; //1 second

        setTimeout(() => {
            console.log("------send ----- ", msg);
            this._client.send(msg);
        }, delayInMilliseconds);
    }

    stunQuery(port, userName, password) {
        const {
            STUN_BINDING_REQUEST,
            STUN_ATTR_XOR_MAPPED_ADDRESS,
            STUN_EVENT_BINDING_RESPONSE,
        } = stun.constants;

        const server = stun.createServer();
        let request = stun.createMessage(STUN_BINDING_REQUEST);
        request.addUsername(`${userName}:CD05`);
        //request.addIceControlling(0x86);
        request.addUseCandidate();
        request.addPriority(0x24);
        request.addMessageIntegrity(password);
        request.addFingerprint();

        let that = this;

        server.once(STUN_EVENT_BINDING_RESPONSE, stunMsg => {
            console.log('-----your ip, port:------', stunMsg.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value.address,
                stunMsg.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value.port);

            // that.dtlsConnection(stunMsg.getAttribute(STUN_ATTR_XOR_MAPPED_ADDRESS).value.port);
            // that.dtlsConnection(port);

            server.close()
        })

        server.send(request, port, this.url);
    }

    dtlsConnection(port) {
        console.log("dtl port:", port);
        // const socket = dtls.connect({
        //     remotePort: port,
        //     remoteAddress: "114.116.84.241",
        //     type: 'udp4'
        //   });

        // dtls.setLogLevel( dtls.logLevel.FINE );
        var pem = fs.readFileSync('E:/work/shell/certs/GW.key');
        var key = fs.readFileSync('E:/work/shell/certs/GW.pem');

        var server = dtls.createServer({ type: 'udp4', key: pem, cert: pem });
        server.bind(port);

        server.on('secureConnection', function (socket) {

            console.log('New connection from ' +
                [socket.rinfo.address, socket.rinfo.port].join(':'));

            socket.on('message', function (message) {
                // Echo the message back
                //socket.send( message );
                console.log('got message "%s"', data.length);
            });
        });

        // var socket = dtls.connect({
        //     remotePort: port, remoteAddress: '114.116.84.241',
        //     key: key,
        //     cert: pem,
        //     type: 'udp4'
        // }, () => {
        //     //socket.send( new Buffer( 'foo\n' ) );
        //     console.log("connect");
        // });

        // socket.on('error', err => {
        //     console.error(err);
        // });

        // socket.on('data', data => {
        //     console.log('got message "%s"', data.length);
        //     //socket.close();
        // });

        //   socket.once('connect', () => {
        //     socket.write('Hello from Node.js!');
        //   });

        // let options = {
        //     type: "udp4",
        //     address: "websdkmediasoup1.3ttech.cn",
        //     port: port,
        //     psk: { "psk_hint": "PSK" },
        //     timeout: 3000, // in ms, optional, minimum 100, default 1000
        //     ciphers: [
        //         // "TLS_PSK_WITH_AES_128_CBC_SHA256",
        //         // "TLS_PSK_WITH_AES_128_GCM_SHA256",
        //         // "TLS_PSK_WITH_3DES_EDE_CBC_SHA",
        //         // "TLS_PSK_WITH_AES_128_CBC_SHA",
        //         // "TLS_PSK_WITH_AES_256_CBC_SHA",
        //         // "TLS_PSK_WITH_AES_256_CBC_SHA384",
        //         // "TLS_PSK_WITH_AES_256_GCM_SHA384",
        //         // "TLS_PSK_WITH_AES_128_CCM_8",
        //         // "TLS_PSK_WITH_AES_256_CCM_8"
        //     ] // optional array of (D)TLS cipher suites, e.g. ["TLS_PSK_WITH_AES_128_CCM"]
        // };

        // let socket = dtls.dtls
        //     // create a socket and initialize the secure connection
        //     .createSocket(options /* DtlsOptions */)
        //     // subscribe events
        //     .on("connected", () => {/* start sending data */
        //         console.log("DTLS connected!");
        //     })
        //     .on("error", (e /* Error */) => {
        //         console.log("DTLS error!", e);
        //     })
        //     .on("message", (msg /* Buffer */) => {
        //         console.log("msg: ", msg.length);
        //     })
        //     .on("close", () => {
        //         console.log("DTLS close!");
        //     })
        //     ;
    }
}

module.exports = msproxy;