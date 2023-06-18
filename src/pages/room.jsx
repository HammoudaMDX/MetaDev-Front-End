import React, { useRef, useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useSelector } from 'react-redux';
import roomApi from '../api/roomApi';
import { useNavigate, useParams } from 'react-router-dom';
import boardApi from '../api/boardApi';
import authApi from '../api/authApi';
import Board from './Board';




const styles = {
  root: {
    flexGrow: 1,
  },
  header: {
    height: '5vh',
    position: 'relative',
    backgroundColor: '#1d2635',
    justifyContent:'center'
  },
  logo: {
    color: '#eeeeee',
  },
  main: {
    overflow: 'hidden',
    height: '89vh',
    display: 'flex',
  },
  mainLeft: {
    flex: 0.7,
    display: 'flex',
    flexDirection: 'column',
  },
  videosGroup: {
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#161d29',
  },
  video: {
    height: '300px',
    borderRadius: '1rem',
    margin: '0.5rem',
    width: '400px',
    objectFit: 'cover',
    transform: 'rotateY(180deg)',
    '-webkit-transform': 'rotateY(180deg)',
    '-moz-transform': 'rotateY(180deg)',
  },
  options: {
    padding: '1rem',
    display: 'flex',
    backgroundColor: '#1d2635',
  },
  optionsLeft: {
    display: 'flex',
  },
  optionsRight: {
    marginLeft: 'auto',
  },
  optionsButton: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#2f80ec',
    height: '50px',
    borderRadius: '5px',
    color: '#eeeeee',
    fontSize: '1.2rem',
    width: '50px',
    margin: '0 0.5rem',
  },
  backgroundRed: {
    backgroundColor: '#f6484a',
  },
  mainRight: {
    display: 'flex',
    flexDirection: 'column',
    flex: 0.3,
    backgroundColor: '#242f41',
  },
  mainChatWindow: {
    flexGrow: 1,
    overflowY: 'scroll',
  },
  mainMessageContainer: {
    padding: '1rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainMessageInput: {
    height: '50px',
    flex: 1,
    fontSize: '1rem',
    borderRadius: '5px',
    paddingLeft: '20px',
    border: 'none',
  },
  messages: {
    display: 'flex',
    flexDirection: 'column',
    margin: '1.5rem',
  },
  message: {
    display: 'flex',
    flexDirection: 'column',
  },
  messageTitle: {
    color: '#eeeeee',
    display: 'flex',
    alignItems: 'center',
    textTransform: 'capitalize',
  },
  messageIcon: {
    marginRight: '0.7rem',
    fontSize: '1.5rem',
  },
  messageText: {
    backgroundColor: '#eeeeee',
    margin: '1rem 0',
    padding: '1rem',
    borderRadius: '5px',
  },
};

const Room = () => {


  const { boardId } = useParams();
  const [boardTitle, setBoardTitle] = useState('');
  const [roomId, setRoomId] = useState('');
  const user = useSelector((state) => state.user.value);
  const boards = useSelector((state) => state.board.value)
  const [users, setUsers] = useState([]);
  const userName = user.username;
  const navigate = useNavigate()
  

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const boardResponse = await boardApi.getOne(boardId); // Fetch board by ID
        const userIds = boardResponse.users; // Extract user IDs from the board response
        const boardTitle = boardResponse.title; // Extract board title from the board response
        console.log(boardResponse.title)
  
        const response = await authApi.getAllUsers(); // Fetch all users
        const filteredUsers = response.filter(user => userIds.includes(user.id)); // Filter users by matching IDs
    
        setUsers(filteredUsers);
        setBoardTitle(boardTitle); // Set the board title in state
      
      } catch (error) {
        console.log(error);
      }
    };
    fetchUsers();

    const fetchRoomId = async () => {
      try {
        const roomResponse = await roomApi.getRoomByBoardId(boardId);
        const roomId = roomResponse.roomId;
  
        setRoomId(roomId);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRoomId();
    
 
  }, [boardId]);

  const MyMeeting = async (element) => {
    
    const appID = 1500721757;
    const serverSecret = "bf716ac30033633f1726fc3c96d57805";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appID, serverSecret, boardId.toString(), Date.now().toString(),user.username.toString());
    console.log(boardTitle,user.username,user.id)

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      showPreJoinView: false,
      container:element,
      onUserAvatarSetter:(userList) => {
        userList.forEach(user => {
            user.setUserAvatar(`https://robohash.org/${user.username}`)
        })
    },
    onLeaveRoom: () => {
      navigate(`/boards/${boardId}`);
    },
      scenario:{
        mode: ZegoUIKitPrebuilt.VideoConference,
      }
      
    })
    return () => {
      // Leave the room when the component is unmounted
      zp.leaveRoom();
    };

  }

  return (
    <Box sx={styles.root}>
      <CssBaseline />
      <AppBar position="static" sx={styles.header}>
        <Toolbar>
        <Typography>{boardTitle}</Typography>
        </Toolbar>
      </AppBar>

      <Box ref={MyMeeting}  sx={styles.main}>
     

      
      </Box>
    </Box>
  );
};

export default Room;
