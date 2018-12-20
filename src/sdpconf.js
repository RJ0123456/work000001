const utils = require('../utils');

function randmoNum() {
  let num = utils.randomNumber();
  num = num % 1000000;
  return num;
}

let ssrc1 = randmoNum();
let ssrc2 = randmoNum();
let ssrc3 = randmoNum();

const sdp = `\
v=0\r\n\
o=- 8651593276701611643 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE 0 1\r\n\
a=msid-semantic: WMS\r\n\
m=audio 9 UDP/TLS/RTP/SAVPF 111 103 104 9 0 8 106 105 13 110 112 113 126\r\n\
c=IN IP4 0.0.0.\r\n\
a=rtcp:9 IN IP4 0.0.0.\r\n\
a=ice-ufrag:kaR\r\n\
a=ice-pwd:OPf5nuahPo0IasxNVPSqZJw\r\n\
a=ice-options:trickl\r\n\
a=fingerprint:sha-256 B5:53:E1:47:30:E4:BC:EC:C7:5C:AC:6B:40:83:98:E3:07:24:B6:68:82:F4:45:1C:D6:72:94:C9:64:D3:F3:4\r\n\
a=setup:actpas\r\n\
a=mid:\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-leve\r\n\
a=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mi\r\n\
a=sendrec\r\n\
a=msid:- 44784880-a57d-4134-9fc1-03be18835f8\r\n\
a=rtcp-mu\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp-fb:111 transport-c\r\n\
a=fmtp:111 minptime=10;useinbandfec=\r\n\
a=rtpmap:103 ISAC/1600\r\n\
a=rtpmap:104 ISAC/3200\r\n\
a=rtpmap:9 G722/800\r\n\
a=rtpmap:0 PCMU/800\r\n\
a=rtpmap:8 PCMA/800\r\n\
a=rtpmap:106 CN/3200\r\n\
a=rtpmap:105 CN/1600\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:110 telephone-event/4800\r\n\
a=rtpmap:112 telephone-event/32000\r\n\
a=rtpmap:113 telephone-event/16000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=ssrc:${ssrc1} cname:pEjDhSaMVBG5QwrO\r\n\
a=ssrc:${ssrc1} msid: 44784880-a57d-4134-9fc1-03be18835f83\r\n\
a=ssrc:${ssrc1} mslabel:\r\n\
a=ssrc:${ssrc1} label:44784880-a57d-4134-9fc1-03be18835f83\r\n\
m=video 9 UDP/TLS/RTP/SAVPF 96 97 98 99 100 101 102 123 127 122 125 107 108 109 124\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:kaR1\r\n\
a=ice-pwd:OPf5nuahPo0IasxNVPSqZJw2\r\n\
a=ice-options:trickle\r\n\
a=fingerprint:sha-256 B5:53:E1:47:30:E4:BC:EC:C7:5C:AC:6B:40:83:98:E3:07:24:B6:68:82:F4:45:1C:D6:72:94:C9:64:D3:F3:42\r\n\
a=setup:actpass\r\n\
a=mid:1\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=extmap:5 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\n\
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\n\
a=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\n\
a=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\n\
a=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\n\
a=sendrecv\r\n\
a=msid:- 083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n\
a=rtpmap:96 VP8/90000\r\n\
a=rtcp-fb:96 goog-remb\r\n\
a=rtcp-fb:96 transport-cc\r\n\
a=rtcp-fb:96 ccm fir\r\n\
a=rtcp-fb:96 nack\r\n\
a=rtcp-fb:96 nack pli\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=fmtp:97 apt=96\r\n\
a=rtpmap:98 VP9/90000\r\n\
a=rtcp-fb:98 goog-remb\r\n\
a=rtcp-fb:98 transport-cc\r\n\
a=rtcp-fb:98 ccm fir\r\n\
a=rtcp-fb:98 nack\r\n\
a=rtcp-fb:98 nack pli\r\n\
a=fmtp:98 x-google-profile-id=0\r\n\
a=rtpmap:99 rtx/90000\r\n\
a=fmtp:99 apt=98\r\n\
a=rtpmap:100 H264/90000\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=fmtp:100 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\n\
a=rtpmap:101 rtx/90000\r\n\
a=fmtp:101 apt=100\r\n\
a=rtpmap:102 H264/90000\r\n\
a=rtcp-fb:102 goog-remb\r\n\
a=rtcp-fb:102 transport-cc\r\n\
a=rtcp-fb:102 ccm fir\r\n\
a=rtcp-fb:102 nack\r\n\
a=rtcp-fb:102 nack pli\r\n\
a=fmtp:102 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\n\
a=rtpmap:123 rtx/90000\r\n\
a=fmtp:123 apt=102\r\n\
a=rtpmap:127 H264/90000\r\n\
a=rtcp-fb:127 goog-remb\r\n\
a=rtcp-fb:127 transport-cc\r\n\
a=rtcp-fb:127 ccm fir\r\n\
a=rtcp-fb:127 nack\r\n\
a=rtcp-fb:127 nack pli\r\n\
a=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\n\
a=rtpmap:122 rtx/90000\r\n\
a=fmtp:122 apt=127\r\n\
a=rtpmap:125 H264/90000\r\n\
a=rtcp-fb:125 goog-remb\r\n\
a=rtcp-fb:125 transport-cc\r\n\
a=rtcp-fb:125 ccm fir\r\n\
a=rtcp-fb:125 nack\r\n\
a=rtcp-fb:125 nack pli\r\n\
a=fmtp:125 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\n\
a=rtpmap:107 rtx/90000\r\n\
a=fmtp:107 apt=125\r\n\
a=rtpmap:108 red/90000\r\n\
a=rtpmap:109 rtx/90000\r\n\
a=fmtp:109 apt=108\r\n\
a=rtpmap:124 ulpfec/90000\r\n\
a=ssrc-group:FID ${ssrc2} ${ssrc3}\r\n\
a=ssrc:${ssrc2} cname:pEjDhSaMVBG5QwrO\r\n\
a=ssrc:${ssrc2} msid: 083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=ssrc:${ssrc2} mslabel:\r\n\
a=ssrc:${ssrc2} label:083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=ssrc:${ssrc3} cname:pEjDhSaMVBG5QwrO\r\n\
a=ssrc:${ssrc3} msid: 083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=ssrc:${ssrc3} mslabel:\r\n\
a=ssrc:${ssrc3} label:083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
`;

const sdp_rtp = '\r\n\
v=0\r\n\
o=- 8651593276701611655 2 IN IP4 127.0.0.1\r\n\
s=-\r\n\
t=0 0\r\n\
a=group:BUNDLE 0 1\r\n\
a=msid-semantic: WMS\r\n\
m=audio 9 RTP/AVP 111 103 104 9 0 8 106 105 13 110 112 113 126\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:kaR\r\n\
a=ice-pwd:OPf5nuahPo0IasxNVPSqZJw\r\n\
a=ice-options:trickl\r\n\
a=fingerprint:sha-256 B5:53:E1:47:30:E4:BC:EC:C7:5C:AC:6B:40:83:98:E3:07:24:B6:68:82:F4:45:1C:D6:72:94:C9:64:D3:F3:4\r\n\
a=setup:actpass\r\n\
a=mid:0\r\n\
a=extmap:1 urn:ietf:params:rtp-hdrext:ssrc-audio-level\r\n\
a=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\
a=sendrecv\r\n\
a=msid:- 44784880-a57d-4134-9fc1-03be18835f83\r\n\
a=rtcp-mux\r\n\
a=rtpmap:111 opus/48000/2\r\n\
a=rtcp-fb:111 transport-cc\r\n\
a=fmtp:111 minptime=10;useinbandfec=1\r\n\
a=rtpmap:103 ISAC/16000\r\n\
a=rtpmap:104 ISAC/32000\r\n\
a=rtpmap:9 G722/8000\r\n\
a=rtpmap:0 PCMU/8000\r\n\
a=rtpmap:8 PCMA/8000\r\n\
a=rtpmap:106 CN/32000\r\n\
a=rtpmap:105 CN/16000\r\n\
a=rtpmap:13 CN/8000\r\n\
a=rtpmap:110 telephone-event/48000\r\n\
a=rtpmap:112 telephone-event/32000\r\n\
a=rtpmap:113 telephone-event/16000\r\n\
a=rtpmap:126 telephone-event/8000\r\n\
a=ssrc:3752582766 cname:pEjDhSaMVBG5QwrO\r\n\
a=ssrc:3752582766 msid: 44784880-a57d-4134-9fc1-03be18835f83\r\n\
a=ssrc:3752582766 mslabel:\r\n\
a=ssrc:3752582766 label:44784880-a57d-4134-9fc1-03be18835f83\r\n\
m=video 9 RTP/AVP 96 97 98 99 100 101 102 123 127 122 125 107 108 109 124\r\n\
c=IN IP4 0.0.0.0\r\n\
a=rtcp:9 IN IP4 0.0.0.0\r\n\
a=ice-ufrag:kaR1\r\n\
a=ice-pwd:OPf5nuahPo0IasxNVPSqZJw2\r\n\
a=ice-options:trickle\r\n\
a=fingerprint:sha-256 B5:53:E1:47:30:E4:BC:EC:C7:5C:AC:6B:40:83:98:E3:07:24:B6:68:82:F4:45:1C:D6:72:94:C9:64:D3:F3:42\r\n\
a=setup:actpass\r\n\
a=mid:1\r\n\
a=extmap:2 urn:ietf:params:rtp-hdrext:toffset\r\n\
a=extmap:3 http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time\r\n\
a=extmap:4 urn:3gpp:video-orientation\r\n\
a=extmap:5 http://www.ietf.org/id/draft-holmer-rmcat-transport-wide-cc-extensions-01\r\n\
a=extmap:6 http://www.webrtc.org/experiments/rtp-hdrext/playout-delay\r\n\
a=extmap:7 http://www.webrtc.org/experiments/rtp-hdrext/video-content-type\r\n\
a=extmap:8 http://www.webrtc.org/experiments/rtp-hdrext/video-timing\r\n\
a=extmap:9 urn:ietf:params:rtp-hdrext:sdes:mid\r\n\
a=sendrecv\r\n\
a=msid:- 083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=rtcp-mux\r\n\
a=rtcp-rsize\r\n\
a=rtpmap:96 VP8/90000\r\n\
a=rtcp-fb:96 goog-remb\r\n\
a=rtcp-fb:96 transport-cc\r\n\
a=rtcp-fb:96 ccm fir\r\n\
a=rtcp-fb:96 nack\r\n\
a=rtcp-fb:96 nack pli\r\n\
a=rtpmap:97 rtx/90000\r\n\
a=fmtp:97 apt=96\r\n\
a=rtpmap:98 VP9/90000\r\n\
a=rtcp-fb:98 goog-remb\r\n\
a=rtcp-fb:98 transport-cc\r\n\
a=rtcp-fb:98 ccm fir\r\n\
a=rtcp-fb:98 nack\r\n\
a=rtcp-fb:98 nack pli\r\n\
a=fmtp:98 x-google-profile-id=0\r\n\
a=rtpmap:99 rtx/90000\r\n\
a=fmtp:99 apt=98\r\n\
a=rtpmap:100 H264/90000\r\n\
a=rtcp-fb:100 goog-remb\r\n\
a=rtcp-fb:100 transport-cc\r\n\
a=rtcp-fb:100 ccm fir\r\n\
a=rtcp-fb:100 nack\r\n\
a=rtcp-fb:100 nack pli\r\n\
a=fmtp:100 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42001f\r\n\
a=rtpmap:101 rtx/90000\r\n\
a=fmtp:101 apt=100\r\n\
a=rtpmap:102 H264/90000\r\n\
a=rtcp-fb:102 goog-remb\r\n\
a=rtcp-fb:102 transport-cc\r\n\
a=rtcp-fb:102 ccm fir\r\n\
a=rtcp-fb:102 nack\r\n\
a=rtcp-fb:102 nack pli\r\n\
a=fmtp:102 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42001f\r\n\
a=rtpmap:123 rtx/90000\r\n\
a=fmtp:123 apt=102\r\n\
a=rtpmap:127 H264/90000\r\n\
a=rtcp-fb:127 goog-remb\r\n\
a=rtcp-fb:127 transport-cc\r\n\
a=rtcp-fb:127 ccm fir\r\n\
a=rtcp-fb:127 nack\r\n\
a=rtcp-fb:127 nack pli\r\n\
a=fmtp:127 level-asymmetry-allowed=1;packetization-mode=1;profile-level-id=42e01f\r\n\
a=rtpmap:122 rtx/90000\r\n\
a=fmtp:122 apt=127\r\n\
a=rtpmap:125 H264/90000\r\n\
a=rtcp-fb:125 goog-remb\r\n\
a=rtcp-fb:125 transport-cc\r\n\
a=rtcp-fb:125 ccm fir\r\n\
a=rtcp-fb:125 nack\r\n\
a=rtcp-fb:125 nack pli\r\n\
a=fmtp:125 level-asymmetry-allowed=1;packetization-mode=0;profile-level-id=42e01f\r\n\
a=rtpmap:107 rtx/90000\r\n\
a=fmtp:107 apt=125\r\n\
a=rtpmap:108 red/90000\r\n\
a=rtpmap:109 rtx/90000\r\n\
a=fmtp:109 apt=108\r\n\
a=rtpmap:124 ulpfec/90000\r\n\
a=ssrc-group:FID 3745581824 389179028\r\n\
a=ssrc:3745581824 cname:pEjDhSaMVBG5QwrO\r\n\
a=ssrc:3745581824 msid: 083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=ssrc:3745581824 mslabel:\r\n\
a=ssrc:3745581824 label:083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=ssrc:389179028 cname:pEjDhSaMVBG5QwrO\r\n\
a=ssrc:389179028 msid: 083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
a=ssrc:389179028 mslabel:\r\n\
a=ssrc:389179028 label:083539cf-413e-4a6b-b03f-9ce29796bb2a\r\n\
';

rtpAudioParameters = `\
{\
    "muxId": "0",\
    "codecs": [\
      {\
        "name": "opus",\
        "mimeType": "audio/opus",\
        "clockRate": 48000,\
        "payloadType": 111,\
        "rtcpFeedback": [],\
        "parameters": {\
          "useinbandfec": 1\
        },\
        "channels": 2\
      }\
    ],\
    "headerExtensions": [\
      {\
        "uri": "urn:ietf:params:rtp-hdrext:ssrc-audio-level",\
        "id": 1\
      },\
      {\
        "uri": "urn:ietf:params:rtp-hdrext:sdes:mid",\
        "id": 9\
      }\
    ],\
    "encodings": [\
      {\
        "ssrc": ${randmoNum()}\
      }\
    ],\
    "rtcp": {\
      "cname": "sj5brmpoiIUJkEqu",\
      "reducedSize": true,\
      "mux": true\
    }\
  }\
`;

const rtpVideoParameters = `\
{\
  "muxId": "1",\
  "codecs": [\
    {\
      "name": "H264",\
      "mimeType": "video/H264",\
      "clockRate": 90000,\
      "payloadType": 100,\
      "rtcpFeedback": [\
        {\
          "type": "goog-remb"\
        },\
        {\
          "type": "ccm",\
          "parameter": "fir"\
        },\
        {\
          "type": "nack"\
        },\
        {\
          "type": "nack",\
          "parameter": "pli"\
        }\
      ],\
      "parameters": {\
        "packetization-mode": 1\
      }\
    },\
    {\
      "name": "rtx",\
      "mimeType": "video/rtx",\
      "clockRate": 90000,\
      "payloadType": 101,\
      "parameters": {\
        "apt": 100\
      }\
    }\
  ],\
  "headerExtensions": [\
    {\
      "uri": "urn:ietf:params:rtp-hdrext:toffset",\
      "id": 2\
    },\
    {\
      "uri": "http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time",\
      "id": 3\
    },\
    {\
      "uri": "urn:3gpp:video-orientation",\
      "id": 4\
    },\
    {\
      "uri": "urn:ietf:params:rtp-hdrext:sdes:mid",\
      "id": 9\
    }\
  ],\
  "encodings": [\
    {\
      "ssrc": ${ssrc1},\
      "rtx": {\
        "ssrc": ${ssrc2}\
      },\
      "profile": "low"\
    },\
    {\
      "ssrc": ${ssrc1 + 1},\
      "rtx": {\
        "ssrc": ${ssrc2 + 1}\
      },\
      "profile": "medium"\
    },\
    {\
      "ssrc": ${ssrc1 + 2},\
      "rtx": {\
        "ssrc": ${ssrc2 + 2}\
      },\
      "profile": "high"\
    }\
  ],\
  "rtcp": {\
    "cname": "sj5brmpoiIUJkEqu",\
    "reducedSize": true,\
    "mux": true\
  }\
}\
`;

sdp_offer = {
  type: 'offer',
  sdp: sdp
};

module.exports = sdpconf = {
    sdp,
    sdp_rtp,
    sdp_offer,
    rtpAudioParameters, // need custom ssrc, cname, but the cname must the same with rtpVideoParameters.
    rtpVideoParameters  // need custom ssrc, cname, but the cname must the same with rtpVideoParameters.
}
