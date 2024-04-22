const APP_ID = '95e41ab7c7c940b59e8ef54023b0968c';
const CHANNEL = sessionStorage.getItem('room');
const TOKEN = sessionStorage.getItem('room');
let UID= Number(sessionStorage.getItem('room'));    

const client = AgoraRTC.createClient({mode: 'rtc', codec:'vp8'})

let localTracks = []
let remoteUsers = {}
let joinAndDisplayLocalStream = async () => {
    document.getElementById('room-name').innerText = CHANNEL
    client.on('user-published', handleUserJoined)
    client.on('user-left',handleUserLeft)

    try{
    await client.join(APP_ID, CHANNEL, TOKEN, UID)
    }catch(error){
        console.error()
        window.open('/', '_self')
    }
    localTracks =  await AgoraRTC.createMicrophoneAndCameraTracks()

    let player = `<div class="video-container" id="user-container-${UID}">
    <div class="username-wrapper"><span class="user-name">My Name</span></div>
    <div class="video-player" id="user-${UID}"></div>
</div>`
document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
   localTracks[1].play(`user-${UID}`)

   await client.publish([localTracks[0],localTracks[1]])
let handleUserJoined = async (user, mediaType) => {
    remoteUsers[UID] = user
    await client.subscribe(user,mediaType)

    if(mediaType === 'video'){
       let player = document.getElementById(`user-container-${UID}`)
       if(player !== null){
           player.remove()
       }
       player = `<div class="video-container" id="user-container-${UID}">
   <div class="username-wrapper"><span class="user-name">My Name</span></div>
   <div class="video-player" id="user-${UID}"></div>
</div>`
     document.getElementById('video-streams').insertAdjacentHTML('beforeend',player)
     user.videoTrack.play(`user-${UID}`)
    }
}  
}
let handleUserLeft = async(user) => {
    delete remoteUsers[UID]
    document.getElementById(`user-container-${UID}`).remove
}
let leaveAndRemoveLocalStream = async () => {
    for(let i=0; localTracks.length>i;i++) {
        localTracks[i].stop()
        localTracks[i].close()
    }
    await client.leave()
    window.open('/','_self')
}
let toggleCamera = async (e) => {
    console.log('TOGGLE CAMERA TRIGGERED')
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[1].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

let toggleMic = async (e) => {
    console.log('TOGGLE MIC TRIGGERED')
    if(localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.style.backgroundColor = '#fff'
    }else{
        await localTracks[0].setMuted(true)
        e.target.style.backgroundColor = 'rgb(255, 80, 80, 1)'
    }
}

joinAndDisplayLocalStream()
document.getElementById('leave-btn').addEventListener('click',leaveAndRemoveLocalStream)
document.getElementById('camera-btn').addEventListener('click',toggleCamera)
document.getElementById('mic-btn').addEventListener('click',toggleMic)