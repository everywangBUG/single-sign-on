import axios from 'axios'
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
      localStorage.setItem('token', res.data.token)
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
