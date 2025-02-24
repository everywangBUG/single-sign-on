import axios from '../server/axios'
import { FC } from 'react'
import { useNavigate } from 'react-router';


export const Login: FC = () => {
  const navigate = useNavigate();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const username = formData.get('username') as string
    const password = formData.get('password') as string
    axios.post('http://localhost:3000/login', { username, password }).then((res) => {
      // 存储access_token
      localStorage.setItem('token', res.data.access_token)
      // 存储刷新token
      localStorage.setItem('refresh_token', res.data.refresh_token)
      navigate('/home')
    })
  }
  
  return (
    <form onSubmit={(e) => handleSubmit(e)} className='flex flex-col h-screen justify-center items-center'>
      <input className='m-2' type="text" name="username" defaultValue={'admin'}/>
      <input className='mt-2' type="password" name="password" defaultValue={'password'} />
      <button className='mt-2' type="submit">Login</button>
    </form>
  )
}
