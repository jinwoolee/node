var signaling_server;
var servers;
var myId;
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
                candidate: ice_event.candidate,
                id : myId
            })
        );
    }
}

function handleError(error) {
    console.debug("error ", error);
}

function new_description_created(description) {
    console.log('new_description_created');
    var peerConnection = connectionId[currentCalleeId];
    
    peerConnection.setLocalDescription(
        description,
        function () {
            console.log('new_description_created send');
            signaling_server.send(
                JSON.stringify({
                    token: 'room',
                    type: 'new_description',
                    sdp: description,
                    id : myId
                })
            );
        },
        handleError
    );
}
function makePeerConnection(stream) {
    /*var stun_server = "stun.l.google.com:19302";
    peerConnection = new RTCPeerConnection({"iceServers": [
        { "url": "stun:" + stun_server },
    ]});*/

    for(var i = 0; i < 3; i++){
        var peerConnection = new RTCPeerConnection(servers);
        peerConnection.use = false;
        peerConnection.onicecandidate = iceCandidate;
        peerConnection.addStream(stream);

        // display remote video streams when they arrive using local <video> MediaElement
        peerConnection.onaddstream = function (event) {
            console.log('onaddStream');
            
            var remoteVideo = document.querySelector("#remote_video");
            var remoteVideo2 = document.querySelector("#remote_video2");

            if(remoteVideo.src == ""){
                remoteVideo.src = URL.createObjectURL(event.stream);
                remoteVideo.play();
            }
            else{
                remoteVideo2.src = URL.createObjectURL(event.stream);
                remoteVideo2.play();
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
                id : myId
            })
        );
    };
}


// handle signals as a caller
function caller_signal_handler(event) {
    var signal = JSON.parse(event.data);
    console.log('signal', signal);

    if (signal.type === "registId")
        myId = signal.id;
    else{
        
        var peerConnection = connectionId[signal.id];
        
        if(peerConnection == null){
            for(var i = 0; i < peerConnections.length; i++){
                var item =  peerConnections[i];
                if(item.use == false){
                    item.use = true;
                    peerConnection = item;
                    currentCalleeId = signal.id;
                    connectionId[signal.id] = peerConnection;
                    break;
                }
            }
        }
        console.log('caller_signal_handler : ', signal.id, ' / peerConneion is null?' , peerConnection == undefined);

        if (signal.type === "join") {
            console.log('join from : ', signal.id);
            peerConnection.id = signal.id;
            peerConnection.createOffer(
                new_description_created,
                handleError
            );
        }
        else if (signal.type === "new_ice_candidate") {
            console.log('new_ice_candidate : ', signal.id);
            peerConnection.addIceCandidate(
                new RTCIceCandidate(signal.candidate)
            );
        }
        else if (signal.type === "new_description") {
            console.log("caller signal handler : new_description");
            peerConnection.setRemoteDescription(
                new RTCSessionDescription(signal.sdp),
                function () {
                    if (peerConnection.remoteDescription.type == "answer") {
                        console.log('peerConnection.remoteDescription.type == "answer"');
                        // extend with your own custom answer handling here
                    }
                },
                handleError
            );
        } else {
            // extend with your own signal types here
        }
    }
}

setupMedia();