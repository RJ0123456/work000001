"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _sdpTransform = _interopRequireDefault(require("sdp-transform"));

var _Logger = _interopRequireDefault(require("../Logger"));

var _EnhancedEventEmitter2 = _interopRequireDefault(require("../EnhancedEventEmitter"));

var utils = _interopRequireWildcard(require("../utils"));

var ortc = _interopRequireWildcard(require("../ortc"));

var sdpCommonUtils = _interopRequireWildcard(require("./sdp/commonUtils"));

var sdpUnifiedPlanUtils = _interopRequireWildcard(require("./sdp/unifiedPlanUtils"));

var _RemoteUnifiedPlanSdp = _interopRequireDefault(require("./sdp/RemoteUnifiedPlanSdp"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var logger = new _Logger.default('NodeDevice');

var sdp = require('./sdpconf').sdp;
var sdp_rtp = require('./sdpconf').sdp_rtp;
var rtpAudioParameters = require('./sdpconf').rtpAudioParameters;
var rtpVideoParameters = require('./sdpconf').rtpVideoParameters;
var sdp_offer = require('./sdpconf').sdp_offer;

var Handler =
  /*#__PURE__*/
  function (_EnhancedEventEmitter) {
    _inherits(Handler, _EnhancedEventEmitter);

    function Handler(direction, rtpParametersByKind, settings) {
      var _this;
      _classCallCheck(this, Handler);
      _this = _possibleConstructorReturn(this, _getPrototypeOf(Handler).call(this, logger));

      _this._rtpParametersByKind = rtpParametersByKind; // Remote SDP handler.
      // @type {RemoteUnifiedPlanSdp}

      _this._remoteSdp = new _RemoteUnifiedPlanSdp.default(direction, rtpParametersByKind); // Handle RTCPeerConnection connection status.

      // @type {RemoteUnifiedPlanSdp}
      return _this;
    }

    _createClass(Handler, [{
      key: "close",
      value: function close() {
        logger.debug('close()'); // Close RTCPeerConnection.
      }
    }, {
      key: "remoteClosed",
      value: function remoteClosed() {
        logger.debug('remoteClosed()');
        this._transportReady = false;
        if (this._transportUpdated) this._transportUpdated = false;
      }
    }]);

    return Handler;
  }(_EnhancedEventEmitter2.default);

var SendHandler =
  /*#__PURE__*/
  function (_Handler) {
    _inherits(SendHandler, _Handler);

    function SendHandler(rtpParametersByKind, settings) {
      var _this2;

      _classCallCheck(this, SendHandler);

      _this2 = _possibleConstructorReturn(this, _getPrototypeOf(SendHandler).call(this, 'send', rtpParametersByKind, settings)); // Got transport local and remote parameters.
      // @type {Boolean}

      _this2._transportReady = false; // Ids of alive local tracks.
      // @type {Set<Number>}

      _this2._trackIds = new Set();
      return _this2;
    }

    _createClass(SendHandler, [{
      key: "addProducer",
      value: function addProducer(producer) {
        var _this3 = this;

        var track = producer.track;
        logger.debug('addProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);
        if (this._trackIds.has(track.id)) return Promise.reject(new Error('track already added'));
        var transceiver;
        var localSdpObj; // Add the track id to the Set.
  
        this._trackIds.add(track.id);
  
        return Promise.resolve().then(function () {
          return sdp_offer;
        }).then(function (offer) {
          // If simulcast is set, mangle the offer.
          if (producer.simulcast) {
            logger.debug('addProducer() | enabling simulcast');
  
            var sdpObject = _sdpTransform.default.parse(offer.sdp);
  
            sdpUnifiedPlanUtils.addPlanBSimulcast(sdpObject, track, {
              mid: transceiver.mid
            });
  
            var offerSdp = _sdpTransform.default.write(sdpObject);
  
            offer = {
              type: 'offer',
              sdp: offerSdp
            };
          }
  
          logger.debug('addProducer() | calling pc.setLocalDescription() [offer:%o]', offer);
          return;
        }).then(function () {
          if (!_this3._transportReady) return _this3._setupTransport();
        }).then(function () {
          localSdpObj = _sdpTransform.default.parse(sdp_offer.sdp);
  
          var remoteSdp = _this3._remoteSdp.createAnswerSdp(localSdpObj);
  
          var answer = {
            type: 'answer',
            sdp: remoteSdp
          };
          logger.debug('addProducer() | calling pc.setRemoteDescription() [answer:%o]', answer);
          return answer;
        }).then(function () {
          var rtpParameters = utils.clone(_this3._rtpParametersByKind[producer.kind]);
          sdpUnifiedPlanUtils.fillRtpParametersForTrack(rtpParameters, localSdpObj, track, {
            mid: '1'
          });
          //return rtpParameters;
          if(producer.kind === 'audio') {
            return JSON.parse(rtpAudioParameters);
          }
          if(producer.kind === 'video') {
            return JSON.parse(rtpVideoParameters);
          }
        }).catch(function (error) {
          // Panic here. Try to undo things.
          _this3._trackIds.delete(track.id);
  
          throw error;
        });
      }
    }, {
      key: "removeProducer",
      value: function removeProducer(producer) {
        var track = producer.track;
        if (!this._trackIds.has(track.id)) return Promise.reject(new Error('track not found'));
        logger.debug('removeProducer() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);
      }
    }, {
      key: "replaceProducerTrack",
      value: function replaceProducerTrack(producer, track) {
        logger.debug('replaceProducerTrack() [id:%s, kind:%s, trackId:%s]', producer.id, producer.kind, track.id);
      }
    }, {
      key: "restartIce",
      value: function restartIce(remoteIceParameters) {
        logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.
      }
    }, {
      key: "_setupTransport",
      value: function _setupTransport() {
        var _this7 = this;

        logger.debug('_setupTransport()');
        return Promise.resolve().then(function () {
          // Get our local DTLS parameters.
          var transportLocalParameters = {};

          var sdpObj = _sdpTransform.default.parse(sdp);

          var dtlsParameters = sdpCommonUtils.extractDtlsParameters(sdpObj); // Let's decide that we'll be DTLS server (because we can).

          dtlsParameters.role = 'server';
          transportLocalParameters.dtlsParameters = dtlsParameters; // Provide the remote SDP handler with transport local parameters.

          _this7._remoteSdp.setTransportLocalParameters(transportLocalParameters); // We need transport remote parameters.

          return _this7.safeEmitAsPromise('@needcreatetransport', transportLocalParameters);
        }).then(function (transportRemoteParameters) {
          // Provide the remote SDP handler with transport remote parameters.
          _this7._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

          _this7._transportReady = true;
        });
      }
    }]);

    return SendHandler;
  }(Handler);

var RecvHandler =
  /*#__PURE__*/
  function (_Handler2) {
    _inherits(RecvHandler, _Handler2);

    function RecvHandler(rtpParametersByKind, settings) {
      var _this8;

      _classCallCheck(this, RecvHandler);

      _this8 = _possibleConstructorReturn(this, _getPrototypeOf(RecvHandler).call(this, 'recv', rtpParametersByKind, settings)); // Got transport remote parameters.
      // @type {Boolean}

      _this8._transportCreated = false; // Got transport local parameters.
      // @type {Boolean}

      _this8._transportUpdated = false; // Map of Consumers information indexed by consumer.id.
      // - mid {String}
      // - kind {String}
      // - closed {Boolean}
      // - trackId {String}
      // - ssrc {Number}
      // - rtxSsrc {Number}
      // - cname {String}
      // @type {Map<Number, Object>}

      _this8._consumerInfos = new Map();
      return _this8;
    }

    _createClass(RecvHandler, [{
      key: "addConsumer",
      value: function addConsumer(consumer) {
        logger.debug('addConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);
        if (this._consumerInfos.has(consumer.id)) return Promise.reject(new Error('Consumer already added'));
        var encoding = consumer.rtpParameters.encodings[0];
        var cname = consumer.rtpParameters.rtcp.cname;
        var consumerInfo = {
          mid: "".concat(consumer.kind[0]).concat(consumer.id),
          kind: consumer.kind,
          closed: consumer.closed,
          streamId: "recv-stream-".concat(consumer.id),
          trackId: "consumer-".concat(consumer.kind, "-").concat(consumer.id),
          ssrc: encoding.ssrc,
          cname: cname
        };
        if (encoding.rtx && encoding.rtx.ssrc) consumerInfo.rtxSsrc = encoding.rtx.ssrc;

        this._consumerInfos.set(consumer.id, consumerInfo);
      }
    }, {
      key: "removeConsumer",
      value: function removeConsumer(consumer) {
        logger.debug('removeConsumer() [id:%s, kind:%s]', consumer.id, consumer.kind);

        var consumerInfo = this._consumerInfos.get(consumer.id);

        if (!consumerInfo) return Promise.reject(new Error('Consumer not found'));
        consumerInfo.closed = true;
      }
    }, {
      key: "restartIce",
      value: function restartIce(remoteIceParameters) {
        logger.debug('restartIce()'); // Provide the remote SDP handler with new remote ICE parameters.
      }
    }, {
      key: "_setupTransport",
      value: function _setupTransport() {
        var _this12 = this;

        logger.debug('_setupTransport()');
        return Promise.resolve().then(function () {
          // We need transport remote parameters.
          return _this12.safeEmitAsPromise('@needcreatetransport', null);
        }).then(function (transportRemoteParameters) {
          // Provide the remote SDP handler with transport remote parameters.
          _this12._remoteSdp.setTransportRemoteParameters(transportRemoteParameters);

          _this12._transportCreated = true;
        });
      }
    }, {
      key: "_updateTransport",
      value: function _updateTransport() {
        logger.debug('_updateTransport()'); // Get our local DTLS parameters.
        // const transportLocalParameters = {};
      }
    }]);

    return RecvHandler;
  }(Handler);

var NodeDevice =
  /*#__PURE__*/
  function () {
    _createClass(NodeDevice, null, [{
      key: "getNativeRtpCapabilities",
      value: function getNativeRtpCapabilities() {
        logger.debug('getNativeRtpCapabilities()');
        var sdpObj = _sdpTransform.default.parse(sdp);
        var nativeRtpCapabilities = sdpCommonUtils.extractRtpCapabilities(sdpObj);
        return nativeRtpCapabilities;
      }
    }, {
      key: "tag",
      get: function get() {
        return 'NodeDevice';
      }
    }]);

    function NodeDevice(direction, extendedRtpCapabilities, settings) {
      _classCallCheck(this, NodeDevice);

      logger.debug('constructor() [direction:%s, extendedRtpCapabilities:%o]', direction, extendedRtpCapabilities);
      var rtpParametersByKind;

      switch (direction) {
        case 'send':
          {
            rtpParametersByKind = {
              audio: ortc.getSendingRtpParameters('audio', extendedRtpCapabilities),
              video: ortc.getSendingRtpParameters('video', extendedRtpCapabilities)
            };
            return new SendHandler(rtpParametersByKind, settings);
          }

        case 'recv':
          {
            rtpParametersByKind = {
              audio: ortc.getReceivingFullRtpParameters('audio', extendedRtpCapabilities),
              video: ortc.getReceivingFullRtpParameters('video', extendedRtpCapabilities)
            };
            return new RecvHandler(rtpParametersByKind, settings);
          }
      }
    }

    return NodeDevice;
  }();

exports.default = NodeDevice;