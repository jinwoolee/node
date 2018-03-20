function qs(search_for) {
    var query = window.location.search.substring(1);
    var parms = query.split('&');
    for (var i=0; i<parms.length; i++) {
        var pos = parms[i].indexOf('=');
        if (pos > 0  && search_for == parms[i].substring(0,pos)) {
            return parms[i].substring(pos+1);;
        }
    }
    return "";
}

var signaling_server;
var servers;
var roomNo = qs("roomNo");
var userId = qs("userId");
var peerConnections = [];
var connectionId = {};
var currentCalleeId;
var callerDescription;

function showVideoLayout() {
    document.querySelector("#loading_state").style.display = "none";
    document.querySelector("#open_call_state").style.display = "block";
}

function setupMedia() {
    getUserMedia({
        audio: true,
        video: true
    }, streamSuccess, streamError);
}

function streamSuccess(stream) {
    showVideoLayout();
    var localVideo = document.querySelector("#local_video");
    localVideo.src = URL.createObjectURL(stream);
    localVideo.play();

    makePeerConnection(stream);
}

function streamError(error) {
    console.debug('streamError');
}

function iceCandidate(ice_event) {
    if (ice_event.candidate) {
        console.log("caller ICE candidate");
        signaling_server.send(
            JSON.stringify({
                type: "new_ice_candidate",
                candidate: ice_event.candidate
            })
        );
    }
}

function handleError(error) {
    console.debug("error ", error);
}

function makePeerConnection(stream) {
    /*var stun_server = "stun.l.google.com:19302";
    peerConnection = new RTCPeerConnection({"iceServers": [
        { "url": "stun:" + stun_server },
    ]});*/

    for (var i = 0; i < 3; i++) {
        var peerConnection = new RTCPeerConnection(servers);
        peerConnection.use = false;
        peerConnection.onicecandidate = iceCandidate;
        peerConnection.addStream(stream);

        // display remote video streams when they arrive using local <video> MediaElement
        peerConnection.onaddstream = function (event) {
            console.log('onaddStream');

            var remoteVideo = document.querySelector("#remote_video");
            var remoteVideo2 = document.querySelector("#remote_video2");

            if (remoteVideo.src == "") {
                remoteVideo.id = this.id;
                remoteVideo.src = URL.createObjectURL(event.stream);
                remoteVideo.play();
                console.log('this.id : ', this.id, ' / remoteVideo.id : ', remoteVideo.id);
            } else {
                remoteVideo2.id = this.id;
                remoteVideo2.src = URL.createObjectURL(event.stream);
                remoteVideo2.play();
                console.log('this.id : ', this.id, ' / remoteVideo2.id : ', remoteVideo2.id);
            }

            document.getElementById("loading_state").style.display = "none";
            document.getElementById("open_call_state").style.display = "block";

        };
        peerConnections.push(peerConnection);
    }

    signaling_server = new WebSocket('ws://localhost:3000');

    signaling_server.onopen = function () {
        console.log('signaling_server open');

        // setup caller signal handler
        signaling_server.onmessage = caller_signal_handler;

        // tell the signaling server you have joined the call 
        signaling_server.send(
            JSON.stringify({
                type: 'join',
                token: 'room',
                roomNo: roomNo,
                id: userId
            })
        );
    };
}

function getConnection(id) {
    var peerConnection = connectionId[id];

    if (peerConnection == undefined) {
        for (var i = 0; i < peerConnections.length; i++) {
            var item = peerConnections[i];
            if (item.use == false) {
                item.use = true;
                peerConnection = item;
                peerConnection.id = id;
                connectionId[id] = peerConnection;
                break;
            }
        }
    }
    return peerConnection;
}

// handle signals as a caller
function caller_signal_handler(event) {
    var signal = JSON.parse(event.data);
    console.log('signal', signal);

    var peerConnection = getConnection(signal.id);
    console.log('caller_signal_handler  signal.type : ' , signal.type, ' / conn.id : ', signal.id);

    if (signal.type === "close") {
    }
    else if (signal.type === "join") {
        
        peerConnection.createOffer(
            function (description) {
                peerConnection.setLocalDescription(
                    description,
                    function () {
                        console.log('new_description_created send');
                        signaling_server.send(
                            JSON.stringify({
                                token: 'room',
                                type: 'new_description',
                                reqType: 'request',
                                from: userId,
                                to: signal.id,
                                sdp: description
                            })
                        );
                    },
                    handleError
                );
            },
            handleError
        );
    } else if (signal.type === "new_ice_candidate") {
        peerConnection.addIceCandidate(
            new RTCIceCandidate(signal.candidate)
        );
    } else if (signal.type === "new_description") {
        if(signal.reqType == 'request'){
            peerConnection.setRemoteDescription(
                new RTCSessionDescription(signal.sdp),
                function () {
                    peerConnection.createAnswer(function (description) {
                        peerConnection.setLocalDescription(
                            description,
                            function () {
                                console.log('new_description_created send');
                                signaling_server.send(
                                    JSON.stringify({
                                        token: 'room',
                                        type: 'new_description',
                                        reqType: 'response',
                                        from: userId,
                                        to: signal.id,
                                        sdp: description
                                    })
                                );
                            },
                            handleError
                        );
                    }, handleError);
                },
                handleError
            );
        }
        else if (signal.reqType == 'response'){
            peerConnection.setRemoteDescription(
                new RTCSessionDescription(signal.sdp),
                function () {
                    console.log('peerConnection.remoteDescription.type == "answer"');                        
                },
                handleError
            );
        }
    }
}

setupMedia();