const mediasoupClient = require("mediasoup-client");
const protooClient = require('protoo-client');
const Logger = require('./Logger');
const logger = new Logger('RoomClient');
const NodeDevice = require("mediasoup-client/lib-es5/handlers/NodeDevice")

class Client {
    constructor(room, name) {
        const url = 'websdkmediasoup1.3ttech.cn';
        const protooUrl = `wss://${url}:3443/?peerName=${name}&roomId=${room}`;
        const protooTransport = new protooClient.WebSocketTransport(protooUrl, 'protoo', 'https://test.3ttech.cn');

        this._peerName = name;
        // protoo-client Peer instance.
        this._protoo = new protooClient.Peer(protooTransport);

        // Transport for sending.
        this._sendTransport = null;

        // Transport for receiving.
        this._recvTransport = null;

        // Local mic mediasoup Producer.
        this._micProducer = null;

        // Local webcam mediasoup Producer.
        this._webcamProducer = null;

        // Whether simulcast should be used.
        this._useSimulcast = false;

        // Map of webcam MediaDeviceInfos indexed by deviceId.
        // @type {Map<String, MediaDeviceInfos>}
        this._webcams = new Map();

        // Local Webcam. Object with:
        // - {MediaDeviceInfo} [device]
        // - {String} [resolution] - 'qvga' / 'vga' / 'hd'.
        this._webcam =
            {
                device: 'rtp stream',
                resolution: 'hd'
            };

        mediasoupClient.setDeviceHandler(NodeDevice.default, "NodeDevice");
        // mediasoup-client Room instance.
        this._room = new mediasoupClient.Room(
            {
                requestTimeout: 30000
            });

        this._join({ displayName: 'junshan', device: 'nodejs001' });
    }

    _join({ displayName, device }) {
        this._protoo.on('open', () => {
            logger.debug('protoo Peer "open" event');

            this._joinRoom({ displayName, device });
        });

        this._protoo.on('disconnected', () => {
            logger.warn('protoo Peer "disconnected" event');

            // Leave Room.
            try { this._room.remoteClose({ cause: 'protoo disconnected' }); }
            catch (error) { }
        });

        this._protoo.on('close', () => {
            if (this._closed)
                return;

            logger.warn('protoo Peer "close" event');

            this.close();
        });

        // Be ready to receive mediasoup notifications from our remote mediasoup Peer
        // in the server.
        this._protoo.on('message', (message) => {
            if (message.type === 'mediasoup-notification') {
                // Pass the mediasoup notification to the local Room.
                console.log(message.body);
                room.receiveNotification(message.body);
            }
            else {
                // Handle here app custom messages (chat, etc).
                console.log(message.data.peerName, message.method);
            }
        });

        this._protoo.on('request', (request, accept, reject) => {
            logger.debug(
                '_handleProtooRequest() [method:%s, data:%o]',
                request.method, request.data);

            switch (request.method) {
                case 'mediasoup-notification':
                    {
                        accept();

                        const notification = request.data;

                        this._room.receiveNotification(notification);

                        break;
                    }

                case 'active-speaker':
                    {
                        accept();
                        const { peerName } = request.data;
                        logger.debug(peerName)
                        break;
                    }

                case 'display-name-changed':
                    {
                        accept();

                        // eslint-disable-next-line no-shadow
                        const { peerName, displayName, oldDisplayName } = request.data;

                        // NOTE: Hack, we shouldn't do this, but this is just a demo.
                        const peer = this._room.getPeerByName(peerName);

                        if (!peer) {
                            logger.error('peer not found');

                            break;
                        }

                        peer.appData.displayName = displayName;

                        break;
                    }

                default:
                    {
                        logger.error('unknown protoo method "%s"', request.method);

                        reject(404, 'unknown method');
                    }
            }
        });
    }

    _joinRoom({ displayName, device }) {
        logger.debug('_joinRoom()');

        // NOTE: We allow rejoining (room.join()) the same mediasoup Room when Protoo
        // WebSocket re-connects, so we must clean existing event listeners. Otherwise
        // they will be called twice after the reconnection.
        this._room.removeAllListeners();

        this._room.on('close', (originator, appData) => {
            if (originator === 'remote') {
                logger.warn('mediasoup Peer/Room remotely closed [appData:%o]', appData);

                return;
            }
        });

        this._room.on('request', (request, callback, errback) => {
            logger.debug(
                'sending mediasoup request [method:%s]:%o', request.method, request);

            this._protoo.send('mediasoup-request', request)
                .then(callback)
                .catch(errback);
        });

        this._room.on('notify', (notification) => {
            logger.debug(
                'sending mediasoup notification [method:%s]:%o',
                notification.method, notification);

            this._protoo.send('mediasoup-notification', notification)
                .catch((error) => {
                    logger.warn('could not send mediasoup notification:%o', error);
                });
        });

        this._room.on('newpeer', (peer) => {
            logger.debug(
                'room "newpeer" event [name:"%s", peer:%o]', peer.name, peer);

            this._handlePeer(peer);
        });

        this._room.join(this._peerName, { displayName, device })
            .then(() => {
                // Create Transport for sending (unless we are spy).
                this._sendTransport =
                    this._room.createTransport('send', { media: 'SEND_MIC_WEBCAM' });

                this._sendTransport.on('close', (originator) => {
                    logger.debug(
                        'Transport "close" event [originator:%s]', originator);
                });

                // // Create Transport for receiving.
                // this._recvTransport =
                //     this._room.createTransport('recv', { media: 'RECV' });

                // this._recvTransport.on('close', (originator) => {
                //     logger.debug(
                //         'receiving Transport "close" event [originator:%s]', originator);
                // });
            })
            .then(() => {
                // NOTE: Don't depend on this Promise to continue (so we don't do return).
                Promise.resolve()
                    // Add our mic.
                    .then(() => {
                        if (!this._room.canSend('audio'))
                            return;

                        this._setMicProducer()
                            .catch(() => { });
                    })
                    // Add our webcam (unless the cookie says no).
                    .then(() => {
                        if (!this._room.canSend('video'))
                            return;

                        this._setWebcamProducer()
                            .catch(() => { });
                    });
            })
            .then(() => {
                const peers = this._room.peers;

                for (const peer of peers) {
                    this._handlePeer(peer, { notify: false });
                }
            })
            .catch((error) => {
                logger.error('_joinRoom() failed:%o', error);
                this.close();
            });
    }

    _handlePeer(peer) {
        let that = this;
        // Handle all the Consumers in the Peer.
        for (const consumer of peer.consumers) {
            this.handleConsumer(consumer);
        }

        // Event fired when the remote Room or Peer is closed.
        peer.on('close', () => {
            console.log('Peer closed');
        });

        // Event fired when the remote Peer sends a new media to mediasoup server.
        peer.on('newconsumer', (consumer) => {
            console.log('Got a new Consumer');

            // Handle the Consumer.
            that.handleConsumer(consumer);
        });
    }

    _setMicProducer() {
        if (!this._room.canSend('audio')) {
            return Promise.reject(
                new Error('cannot send audio'));
        }

        if (this._micProducer) {
            return Promise.reject(
                new Error('mic Producer already exists'));
        }

        let producer;

        return Promise.resolve()
            .then(() => {
                logger.debug('_setMicProducer() | calling getUserMedia()');
                let track = {
                    contentHint: '',
                    id: '5c1fe6bd-3410-4aa8-ae51-c2328dccd194',
                    kind: 'audio',
                    label: 'mic',
                    readyState: 'live',
                    muted: false,
                    enabled: true,
                    onended: null,
                    onmute: null,
                    onunmute: null
                };
                producer = this._room.createProducer(track, null, { source: 'mic' });

                // Send it.
                return producer.send(this._sendTransport);
            })
            .then(() => {
                this._micProducer = producer;

                producer.on('close', (originator) => {
                    logger.debug(
                        'mic Producer "close" event [originator:%s]', originator);

                    this._micProducer = null;
                });

                producer.on('pause', (originator) => {
                    logger.debug(
                        'mic Producer "pause" event [originator:%s]', originator);
                });

                producer.on('resume', (originator) => {
                    logger.debug(
                        'mic Producer "resume" event [originator:%s]', originator);
                });

                producer.on('handled', () => {
                    logger.debug('mic Producer "handled" event');
                });

                producer.on('unhandled', () => {
                    logger.debug('mic Producer "unhandled" event');
                });
            })
            .then(() => {
                logger.debug('_setMicProducer() succeeded');
            })
            .catch((error) => {
                logger.error('_setMicProducer() failed:%o', error);

                if (producer)
                    producer.close();

                throw error;
            });
    }

    _setWebcamProducer() {
        if (!this._room.canSend('video')) {
            return Promise.reject(
                new Error('cannot send video'));
        }

        if (this._webcamProducer) {
            return Promise.reject(
                new Error('webcam Producer already exists'));
        }

        let producer;

        return Promise.resolve()
            .then(() => {
                const { device, resolution } = this._webcam;

                if (!device)
                    throw new Error('no webcam devices');

                logger.debug('_setWebcamProducer() | calling getUserMedia()');

                let track = {
                    contentHint: '',
                    id: '5c1fe6bd-3410-4aa8-ae51-c2328dccd800',
                    kind: 'video',
                    label: 'webcam',
                    readyState: 'live',
                    muted: false,
                    enabled: true,
                    onended: null,
                    onmute: null,
                    onunmute: null,
                    clone: function() { // ref: https://stackoverflow.com/questions/1833588/javascript-clone-a-function
                        var that = this;
                        var temp = function temporary() { return that.apply(this, arguments); };
                        for(var key in this) {
                            if (this.hasOwnProperty(key)) {
                                temp[key] = this[key];
                            }
                        }
                        return temp;
                    }
                };

                producer = this._room.createProducer(
                    track, { simulcast: this._useSimulcast }, { source: 'webcam' });

                // Send it.
                return producer.send(this._sendTransport);
            })
            .then(() => {
                this._webcamProducer = producer;

                producer.on('close', (originator) => {
                    logger.debug(
                        'webcam Producer "close" event [originator:%s]', originator);

                    this._webcamProducer = null;
                    // this._dispatch(stateActions.removeProducer(producer.id));
                });

                producer.on('pause', (originator) => {
                    logger.debug(
                        'webcam Producer "pause" event [originator:%s]', originator);

                    // this._dispatch(stateActions.setProducerPaused(producer.id, originator));
                });

                producer.on('resume', (originator) => {
                    logger.debug(
                        'webcam Producer "resume" event [originator:%s]', originator);

                    // this._dispatch(stateActions.setProducerResumed(producer.id, originator));
                });

                producer.on('handled', () => {
                    logger.debug('webcam Producer "handled" event');
                });

                producer.on('unhandled', () => {
                    logger.debug('webcam Producer "unhandled" event');
                });
            })
            .then(() => {
                logger.debug('_setWebcamProducer() succeeded');
            })
            .catch((error) => {
                logger.error('_setWebcamProducer() failed:%o', error);

                if (producer)
                    producer.close();

                throw error;
            });
    }

    handleConsumer(consumer) {
        // Receive the media over our receiving Transport.
        // consumer.receive(this._recvTransport)
        //     .then((track) => {
        //         console.log('receiving a new remote MediaStreamTrack');

        //         // Attach the track to a MediaStream and play it.
        //     });

        // Event fired when the Consumer is closed.
        consumer.on('close', () => {
            console.log('Consumer closed');
        });
    }

    close() {
        if (this._closed)
            return;

        this._closed = true;

        logger.debug('close()');

        // Leave the mediasoup Room.
        this._room.leave();

        // Close protoo Peer (wait a bit so mediasoup-client can send
        // the 'leaveRoom' notification).
        setTimeout(() => this._protoo.close(), 250);
    }
}

module.exports = Client;