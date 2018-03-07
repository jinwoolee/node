var signaling_server;
var servers;
var peerConnection;
var localStream;

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

    makePeerConnection();
}

function streamError(error) {
    console.debug('streamError');
}

function setupMedia() {
    getUserMedia({ audio: true, video: true }, streamSuccess, streamError);
}

function iceCandidate(ice_event) {
    console.debug("caller ICE candidate: \n" + ice_event.candidate.candidate);
    if (ice_event.candidate) {
        signaling_server.send(
            JSON.stringify({
                type: "new_ice_candidate",
                candidate: ice_event.candidate
            })
        );
    }
}

function gotLocalDescription(description) {
    localPeerConnection.setLocalDescription(description);
    console.debug("Offer from localPeerConnection: \n" + description.sdp);
    remotePeerConnection.setRemoteDescription(description);
    remotePeerConnection.createAnswer(gotRemoteDescription, handleError);
}

function handleError(error) {
    console.debug("error ", error);
}

function makePeerConnection() {
    peerConnection = new RTCPeerConnection(servers);
    peerConnection.onicecandidate = iceCandidate;
    peerConnection.addStream(localStream);
    //peerConnection.createOffer(gotLocalDescription, handleError);
}