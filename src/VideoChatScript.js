import React, { useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import Peer from 'peerjs';
import roomApi from './api/roomApi';
import { useNavigate, useParams } from 'react-router-dom'



const ContextProvider = () => {
  const socketRef = useRef();
  const videoGridRef = useRef();
  const myVideoRef = useRef();
  const [user, setUser] = useState('');
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [ROOM_ID, setROOM_ID] = useState('');
  const [messages, setMessages] = useState([]);
  const textRef = useRef();
  const { boardId } = useParams();
  useEffect(() => {
    socketRef.current = io('/');
      const fetchROOM_ID = async () => {
        try {
          const roomResponse = await roomApi.getRoomByBoardId(boardId);
          const ROOM_ID = roomResponse.ROOM_ID;
    
          setROOM_ID(ROOM_ID);
        } catch (error) {
          console.log(error);
        }
      };
      fetchROOM_ID();
    

    
   
  
    
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        setMyVideoStream(stream);
        addVideoStream(myVideoRef.current, stream);

        const peer = new Peer({
          host: '127.0.0.1',
          port: 4000,
          path: '/peerjs',
          config: {
            iceServers: [
              { url: 'stun:stun01.sipphone.com' },
              { url: 'stun:stun.ekiga.net' },
              { url: 'stun:stunserver.org' },
              { url: 'stun:stun.softjoys.com' },
              { url: 'stun:stun.voiparound.com' },
              { url: 'stun:stun.voipbuster.com' },
              { url: 'stun:stun.voipstunt.com' },
              { url: 'stun:stun.voxgratia.org' },
              { url: 'stun:stun.xten.com' },
              {
                url: 'turn:192.158.29.39:3478?transport=udp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808',
              },
              {
                url: 'turn:192.158.29.39:3478?transport=tcp',
                credential: 'JZEOEt2V3Qb0y27GRntt2u2PAYA=',
                username: '28224511:1379330808',
              },
            ],
          },
          debug: 3,
        });

        peer.on('open', (id) => {
          console.log('my id is' + id);
          socketRef.current.emit('join-room', ROOM_ID, id, user);
        });

        peer.on('call', (call) => {
          console.log('someone call me');
          call.answer(stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        const connectToNewUser = (userId, stream) => {
          console.log('I call someone' + userId);
          const call = peer.call(userId, stream);
          const video = document.createElement('video');
          call.on('stream', (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        };

        socketRef.current.on('user-connected', (userId) => {
          connectToNewUser(userId, stream);
        });
      });
  }, []);



  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener('loadedmetadata', () => {
      video.play();
      videoGridRef.current.append(video);
    });
  };

  const handleSend = () => {
    const message = textRef.current.value;
    if (message.length !== 0) {
      socketRef.current.emit('message', message);
      textRef.current.value = '';
    }
  };

  socketRef.current.on('createMessage', (message, userName) => {
    setMessages((prevMessages) => [
      ...prevMessages,
      { message, userName: userName === user ? 'me' : userName },
    ]);
  },[boardId]);

  return (
    <div>
      <div id="video-grid" ref={videoGridRef}></div>
      <video muted ref={myVideoRef} />

      <div className="main__left" style={{ display: 'flex', flex: '1' }}>
        {/* Your left sidebar content */}
      </div>

      <div className="main__right" style={{ display: 'none' }}>
        {/* Your right sidebar content */}
      </div>

      <button className="header__back" style={{ display: 'none' }}>
        Back
      </button>

      <button id="showChat">Show Chat</button>

      <input type="text" id="chat_message" ref={textRef} />
      <button id="send" onClick={handleSend}>
        Send
      </button>

      <div className="messages">
        {messages.map((message, index) => (
          <div key={index} className="message">
            <b>
              <i className="far fa-user-circle"></i>{' '}
              <span>{message.userName}</span>
            </b>
            <span>{message.message}</span>
          </div>
        ))}
      </div>

      <button id="inviteButton">Invite</button>
      <button id="muteButton">Mute</button>
      <button id="stopVideo">Stop Video</button>
    </div>
  );
};

export default ContextProvider;
