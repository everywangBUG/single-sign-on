import axios from 'axios'
import { FC } from 'react'
import { useNavigate } from 'react-router'

export const Home: FC = () => {
  const navigate = useNavigate()

  const handleLogout = () => {
    const token = localStorage.getItem('token')
    axios.post('http://localhost:3000/logout', { token }).then(() => {
      localStorage.removeItem('token')
      navigate('/login')
    })
  }
  
  return (
    <div className='h-screen'>
      <button onClick={() => handleLogout()}>Logout</button>
    </div>
  )
}
