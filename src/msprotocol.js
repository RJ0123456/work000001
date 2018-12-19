class msprotocol {
    constructor() {
    }

    baseResponse(id) {
        const msg = {
            "id": id,
            "data": {},
            "response": true,
            "ok": true
        };

        return msg;
    }

    queryRoom() {
        const msg = {
            "request": true,
            "id": 7520144,
            "method": "mediasoup-request",
            "data": {
                "method": "queryRoom",
                "target": "room"
            }
        };

        return msg;
    }

    joinRoom(peerName) {
        const msg = {
            "request": true,
            "id": 5075952,
            "method": "mediasoup-request",
            "data": {
                "method": "join",
                "target": "room",
                "peerName": peerName,
                "rtpCapabilities": {
                    "codecs": [
                        {
                            "name": "opus",
                            "mimeType": "audio/opus",
                            "kind": "audio",
                            "clockRate": 48000,
                            "preferredPayloadType": 100,
                            "channels": 2,
                            "rtcpFeedback": [],
                            "parameters": {
                                "useinbandfec": 1
                            }
                        },
                        {
                            "name": "H264",
                            "mimeType": "video/H264",
                            "kind": "video",
                            "clockRate": 90000,
                            "preferredPayloadType": 101,
                            "rtcpFeedback": [
                                {
                                    "type": "goog-remb"
                                },
                                {
                                    "type": "ccm",
                                    "parameter": "fir"
                                },
                                {
                                    "type": "nack"
                                },
                                {
                                    "type": "nack",
                                    "parameter": "pli"
                                }
                            ],
                            "parameters": {
                                "packetization-mode": 1
                            }
                        },
                        {
                            "name": "rtx",
                            "mimeType": "video/rtx",
                            "kind": "video",
                            "clockRate": 90000,
                            "preferredPayloadType": 102,
                            "parameters": {
                                "apt": 101
                            }
                        }
                    ],
                    "headerExtensions": [
                        {
                            "kind": "audio",
                            "uri": "urn:ietf:params:rtp-hdrext:ssrc-audio-level",
                            "preferredId": 1
                        },
                        {
                            "kind": "video",
                            "uri": "urn:ietf:params:rtp-hdrext:toffset",
                            "preferredId": 2
                        },
                        {
                            "kind": "video",
                            "uri": "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time",
                            "preferredId": 3
                        },
                        {
                            "kind": "video",
                            "uri": "urn:3gpp:video-orientation",
                            "preferredId": 4
                        }
                    ],
                    "fecMechanisms": []
                },
                "spy": false,
                "appData": {
                    "displayName": peerName,
                    "device": {
                        "flag": "chrome",
                        "name": "Chrome",
                        "version": "70.0",
                        "bowser": {
                            "name": "Chrome",
                            "chrome": true,
                            "version": "70.0",
                            "blink": true,
                            "windows": true,
                            "osname": "Windows",
                            "osversion": "10",
                            "a": true
                        }
                    }
                }
            }
        };

        return msg;
    }

    createSendPlainRTPTransport(id, transId) {
        const msg = {
            "request": true,
            "id": id,
            "method": "mediasoup-request",
            "data": {
                "method": "createTransport",
                "target": "peer",
                "id": transId,
                "appData": {
                    "media": "SEND_MIC_WEBCAM"
                },
                "direction": "send",
                "options": {
                    "udp": true,
                    "tcp": false
                },
                "plainRtpParameters": {
                    "ip" : "192.168.2.72", // remote ip
                    "port": 44000, // destination port
                    "preferIPv4": true,
                    "preferIPV6": false
                }
            }
        };

        return  msg;
    }

    createSendTransport(id, transId) {
        const msg = {
            "request": true,
            "id": id,
            "method": "mediasoup-request",
            "data": {
                "method": "createTransport",
                "target": "peer",
                "id": transId,
                "appData": {
                    "media": "SEND_MIC_WEBCAM"
                },
                "direction": "send",
                "options": {
                    "udp": true,
                    "tcp": false
                },
                "dtlsParameters": {
                    "role": "server",
                    "fingerprints": [
                        {
                            "algorithm": "sha-256",
                            "value": "8E:69:DC:7E:84:81:78:46:FA:E1:4B:77:9B:51:6F:68:2F:AF:ED:9F:B7:83:06:D9:23:8A:21:D9:FA:F4:2A:02"
                        }
                    ]
                }
            }
        };

        return msg;
    }

    createRecvTransport(id, transId) {
        const noDtlsmsg = {
            "request": true,
            "id": id,
            "method": "mediasoup-request",
            "data": {
                "method": "createTransport",
                "target": "peer",
                "appData": {
                    "media": "RECV"
                },
                "id": transId,
                "direction": 'recv',
                "options": {
                    "udp": true,
                    "tcp": false
                }
            }
        };

        return noDtlsmsg;

        const hsaDtlsmsg = {
            "request": true,
            "id": id,
            "method": "mediasoup-request",
            "data": {
                "method": "createTransport",
                "target": "peer",
                "appData": {
                    "media": "RECV"
                },
                "id": transId,
                "direction": 'recv',
                "options": {
                    "udp": true,
                    "tcp": false
                },
                // "plainRtpParameters": {
                //     "preferIPv4": true,
                //     "preferIPv6": false
                // },
                "dtlsParameters": {
                    "role": "server",
                    "fingerprints": [
                        {
                            "algorithm": "sha-256",
                            "value": "7B:71:50:44:DE:4F:49:29:9F:18:79:35:B6:29:41:A3:6C:64:91:41:D1:9A:71:53:3C:60:DF:18:26:FF:13:FA"
                        }
                    ]
                }
            }
        };

        return hsaDtlsmsg;
    }

    updateTransport(id) {
        const msg = {
            "request": true,
            "id": 1313858,
            "method": "mediasoup-notification",
            "data": {
                "method": "updateTransport",
                "target": "peer",
                "id": id,
                "notification": true,
                "dtlsParameters": {
                    "role": "client",
                    "fingerprints": [
                        {
                            "algorithm": "sha-256",
                            "value": "31:6F:20:AB:FE:2E:86:D6:A1:B2:FD:EC:FD:F7:03:A2:7E:E5:CE:C5:FC:2A:88:DA:A6:22:6E:48:6E:BA:11:FD"
                        }
                    ]
                }
            }
        };

        return msg;
    }

    createAudioProducer(sendTransId, ssrc, peerId) {
        const msg = {
            "request": true,
            "id": 5242429,
            "method": "mediasoup-request",
            "data": {
                "method": "createProducer",
                "target": "peer",
                "appData": {
                    "source": "mic"
                },
                "id": peerId,
                "kind": "audio",
                "transportId": sendTransId,
                "rtpParameters": {
                    "muxId": null,
                    "codecs": [
                        {
                            "name": "opus",
                            "mimeType": "audio/opus",
                            "clockRate": 48000,
                            "payloadType": 111,
                            "channels": 2,
                            "rtcpFeedback": [],
                            "parameters": {
                                "useinbandfec": 1
                            }
                        }
                    ],
                    "headerExtensions": [
                        {
                            "uri": "urn:ietf:params:rtp-hdrext:ssrc-audio-level",
                            "id": 1
                        }
                    ],
                    "encodings": [
                        {
                            "ssrc": ssrc
                        }
                    ],
                    "rtcp": {
                        "cname": "rkAvSiaMDSPjuhxX",
                        "reducedSize": true,
                        "mux": true
                    }
                },
                "paused": false
            }
        };

        return msg;
    }

    createVideoProducer(sendTransId, ssrc, peerId) {
        const msg = {
            "request": true,
            "id": 6775714,
            "method": "mediasoup-request",
            "data": {
                "method": "createProducer",
                "target": "peer",
                "appData": {
                    "source": "webcam"
                },
                "id": peerId,
                "kind": "video",
                "transportId": sendTransId,
                "rtpParameters": {
                    "muxId": null,
                    "codecs": [
                        {
                            "name": "H264",
                            "mimeType": "video/H264",
                            "clockRate": 90000,
                            "payloadType": 100,
                            "rtcpFeedback": [
                                {
                                    "type": "goog-remb"
                                },
                                {
                                    "type": "ccm",
                                    "parameter": "fir"
                                },
                                {
                                    "type": "nack"
                                },
                                {
                                    "type": "nack",
                                    "parameter": "pli"
                                }
                            ],
                            "parameters": {
                                "packetization-mode": 1
                            }
                        }
                    ],
                    "headerExtensions": [
                        {
                            "uri": "urn:ietf:params:rtp-hdrext:toffset",
                            "id": 2
                        },
                        {
                            "uri": "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time",
                            "id": 3
                        },
                        {
                            "uri": "urn:3gpp:video-orientation",
                            "id": 4
                        }
                    ],
                    "encodings": [
                        {
                            "ssrc": ssrc,
                            "profile": "high"
                        }
                    ],
                    "rtcp": {
                        "cname": "rkAvSiaMDSPjuhxX",
                        "reducedSize": true,
                        "mux": true
                    }
                },
                "paused": false
            }
        };

        return msg;
    }

    enableConsumer(peerId, transId) {
        const msg = {
            "request": true,
            "id": 5159886,
            "method": "mediasoup-request",
            "data": {
                "method": "enableConsumer",
                "target": "peer",
                "id": peerId,
                "transportId": transId,
                "paused": false,
                "preferredProfile": "default"
            }
        };

        return msg;
    }

    newPeer(peer) {
        //{"request":true,"id":4490017,"method":"mediasoup-notification","data":{"method":"newPeer","target":"peer","notification":true,"consumers":[],"name":"zprirwcn","appData":{"displayName":"Rupert Annicchiarico","device":{"flag":"chrome","name":"Chrome","version":"70.0","bowser":{"name":"Chrome","chrome":true,"version":"70.0","blink":true,"mac":true,"osname":"macOS","osversion":"10.13.6","a":true}}}}}

    }

    newConsume() {
        //{"request":true,"id":6289439,"method":"mediasoup-notification","data":{"method":"newConsumer","target":"peer","notification":true,"id":14762239,"kind":"audio","rtpParameters":{"muxId":null,"codecs":[{"name":"opus","mimeType":"audio/opus","clockRate":48000,"payloadType":100,"channels":2,"rtcpFeedback":[],"parameters":{"useinbandfec":1}}],"headerExtensions":[{"uri":"urn:ietf:params:rtp-hdrext:ssrc-audio-level","id":1}],"encodings":[{"ssrc":38885567}],"rtcp":{"cname":"Q4qKAaq59RqW64HW","reducedSize":true,"mux":true}},"paused":false,"preferredProfile":"default","effectiveProfile":null,"appData":{"source":"mic"},"peerName":"zprirwcn"}}

    }

    response(res) {

    }

    responseCreateTransport(res) {

    }
}

module.exports = msprotocol;