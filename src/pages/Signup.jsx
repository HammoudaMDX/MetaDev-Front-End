import { Box, Button, TextField, Select, MenuItem ,FormControl,InputLabel } from '@mui/material'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingButton from '@mui/lab/LoadingButton'
import authApi from '../api/authApi'
import ParticlesBackGround from '../components/ParticlesBackGround'

const Signup = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [usernameErrText, setUsernameErrText] = useState('')
  const [passwordErrText, setPasswordErrText] = useState('')
  const [confirmPasswordErrText, setConfirmPasswordErrText] = useState('')
  const [emailErrText, setEmailErrText] = useState('')
  const [phoneNumberErrText, setPhoneNumberErrText] = useState('');
  const [role, setRole] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setUsernameErrText('')
    setPasswordErrText('')
    setConfirmPasswordErrText('')
    setEmailErrText('')
    setPhoneNumberErrText('')
    setRole('')


    const data = new FormData(e.target)
    const username = data.get('username').trim()
    const password = data.get('password').trim()
    const confirmPassword = data.get('confirmPassword').trim()
    const email = data.get('email').trim()
    const number = Number(data.get('phoneNumber').trim());
    const role = data.get('role').trim() 

    let err = false

    if (username === '') {
      err = true
      setUsernameErrText('Please fill this field')
    }
    if (password === '') {
      err = true
      setPasswordErrText('Please fill this field')
    }
    if (confirmPassword === '') {
      err = true
      setConfirmPasswordErrText('Please fill this field')
    }
    if (email === '') {
      err = true
      setEmailErrText('Please fill this field')
    }
    if (password !== confirmPassword) {
      err = true
      setConfirmPasswordErrText('Confirm password does not match')
    }
    if (number === '' || isNaN(number) || number.toString().length !== 8) {
      err = true;
      setPhoneNumberErrText('Please enter a valid phone number');
    }
    if (role === '') {
      err = true
      setRole('Please select a role')
    }
    

    if (err) return

    setLoading(true)

    try {
      const res = await authApi.signup({
        username,
        password,
        confirmPassword,
        email,
        number,
        teams: [],
        role,
      })
      setLoading(false)
      localStorage.setItem('token', res.token)
      navigate('/')
    } catch (err) {
      const errors = err.data.errors
      errors.forEach(e => {
        if (e.param === 'username') {
          setUsernameErrText(e.msg)
        }
        if (e.param === 'password') {
          setPasswordErrText(e.msg)
        }
        if (e.param === 'confirmPassword') {
          setConfirmPasswordErrText(e.msg)
        }
        if (e.param === 'email') {
          setEmailErrText(e.msg)
        }
        if (e.param === 'phoneNumber') {
          setPhoneNumberErrText(e.msg);
        }
      })
      setLoading(false)
    }
  }

  return (
    <>
       <ParticlesBackGround />
      <Box
        component='form'
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
        noValidate
      >
        <TextField
          margin='normal'
          required
          fullWidth
          id='username'
          label='Username'
          name='username'
          disabled={loading}
          error={usernameErrText !== ''}
          helperText={usernameErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          name='password'
          type='password'
          disabled={loading}
          error={passwordErrText !== ''}
          helperText={passwordErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='confirmPassword'
          label='Confirm Password'
          name='confirmPassword'
          type='password'
          disabled={loading}
          error={confirmPasswordErrText !== ''}
          helperText={confirmPasswordErrText}
        />
        <TextField
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email'
          name='email'
          disabled={loading}
          error={emailErrText !== ''}
          helperText={emailErrText}
        />
        <TextField
         margin="normal"
         required
          fullWidth
         id="phoneNumber"
         label="Phone Number"
         name="phoneNumber"
          disabled={loading}
         error={phoneNumberErrText !== ''}
         helperText={phoneNumberErrText}
          />
          <FormControl fullWidth>
       <InputLabel id="demo-simple-select-label">Role</InputLabel>
        <Select
          margin='normal'
          required
          fullWidth
          id='role'
          label='Role'
          name='role'
          value={role}
          disabled={loading}
          onChange={(e) => setRole(e.target.value)}
         
        >
          <MenuItem value='Front-End Developer'>Front-End Developer</MenuItem>
          <MenuItem value='Back-End Developer'>Back-End Developer</MenuItem>
          <MenuItem value='UI Designer'>UI Designer</MenuItem>
          <MenuItem value='UX Designer'>UX Designer</MenuItem>
        </Select>
        </FormControl >
        <LoadingButton
          sx={{ mt: 3, mb: 2 }}
          variant='outlined'
          fullWidth
          color='success'
          type='submit'
          loading={loading}
        >
          Signup
        </LoadingButton>
      </Box>
      <Button
        component={Link}
        to='/login'
        sx={{ textTransform: 'none' }}
      >
        Already have an account? Login
      </Button>
    </>
  )
}

export default Signup
