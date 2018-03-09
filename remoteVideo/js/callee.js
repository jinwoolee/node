var signaling_server;
var servers;
var peerConnection;
var myId;

function showVideoLayout() {
    document.querySelector("#loading_state").style.display = "none";
    document.querySelector("#open_call_state").style.display = "block";
}

function streamSuccess(stream) {
    localStream = stream;
    showVideoLayout();
    var localVideo = document.querySelector("#local_video");
    localVideo.src = URL.createObjectURL(stream);
    localVideo.play();

    makePeerConnection(stream);
}

function streamError(error) {
    console.debug('streamError');
}

function setupMedia() {
    getUserMedia({
        audio: true,
        video: true
    }, streamSuccess, streamError);
}

function iceCandidate(ice_event) {
    if (ice_event.candidate) {
        console.log("callee ICE candidate");
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

function new_description_created(description) {
    console.log('new_description_created');
    peerConnection.setLocalDescription(
        description,
        function () {
            console.log('new_description_created send');
            signaling_server.send(
                JSON.stringify({
                    token: 'room',
                    type: 'new_description',
                    sdp: description
                })
            );
        },
        handleError
    );
}

// handle signals as a caller
function callee_signal_handler(event) {
    var signal = JSON.parse(event.data);
    console.log('signal', signal);

    if (signal.type === "registId")
        myId = signal.id;
    else{    
        if (signal.type === "new_ice_candidate") {
            peerConnection.addIceCandidate(
                new RTCIceCandidate(signal.candidate)
            );
        } else if (signal.type === "new_description") {
            peerConnection.setRemoteDescription(
                new RTCSessionDescription(signal.sdp),
                function () {
                    if (peerConnection.remoteDescription.type == "offer") {
                        peerConnection.createAnswer(new_description_created, handleError);
                    }
                },
                handleError
            );
        } else {
            // extend with your own signal types here
        }
    }
}

function makePeerConnection(stream) {
    /*var stun_server = "stun.l.google.com:19302";
    peerConnection = new RTCPeerConnection({"iceServers": [
        { "url": "stun:" + stun_server },
    ]});*/
    peerConnection = new RTCPeerConnection(servers);
    peerConnection.onicecandidate = iceCandidate;
    peerConnection.addStream(stream);

    // display remote video streams when they arrive using local <video> MediaElement
    peerConnection.onaddstream = function (event) {
        console.log('onaddStream');
        var remoteVideo = document.querySelector("#remote_video");
        remoteVideo.src = URL.createObjectURL(event.stream);
        remoteVideo.play();

        document.getElementById("loading_state").style.display = "none";
        document.getElementById("open_call_state").style.display = "block";
    };

    signaling_server = new WebSocket('ws://localhost:3000');

    signaling_server.onopen = function () {
        console.log('signaling_server open');

        // setup caller signal handler
        signaling_server.onmessage = callee_signal_handler;

        // tell the signaling server you have joined the call 
        signaling_server.send(
            JSON.stringify({
                type: 'join',
                token: 'room',
                id : myId
            })
        );
    };
}

setupMedia();