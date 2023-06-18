import { Box } from "@mui/material"
import  LoadingButton  from "@mui/lab/LoadingButton"
import { useDispatch , useSelector } from "react-redux"
import { setBoards } from "../redux/features/boardSlice"
import { useNavigate } from "react-router-dom"
import boardApi from "../api/boardApi"
import roomApi from "../api/roomApi"
import { useState } from "react"
import authApi from "../api/authApi"
import Lottie from 'react-lottie';
import animationData from '../assets/project-management.json';
import ParticlesBackGround from '../components/ParticlesBackGround'
const Home = () => {

  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user.value)
  const [members, setMembers] = useState([user.id]);
  const [loading, setLoading] = useState(false)

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };


  const createRoom = async (boardId, members) => {
    try {
      await roomApi.createRoom(boardId, members);
      // Handle room creation success
    } catch (error) {
      // Handle error
      console.log(error);
    }
  };

  const createBoard = async () => {
    setLoading(true)
    try {
      const res = await boardApi.create()
      dispatch(setBoards([res]))
      navigate(`/boards/${res.id}`)
      await createRoom(res.id, members);
    } catch (err) {
      alert(err)
    } finally {
      setLoading(false)
    }
  }
  return (
    <Box sx={{
      height:'100%',
      display:'flex',
      alignItems:'center',
      width:'100%',
      justifyContent:'center',
    }}>
    
    <Box>
      <Lottie  options={defaultOptions} width={200} height={200}  sx />
    
   
      <LoadingButton
        variant='outlined' color='success' onClick={createBoard} loading={loading}>
        Click here to create a new board
      </LoadingButton>
      </Box>
      <ParticlesBackGround />
    </Box>
  )
}

export default Home