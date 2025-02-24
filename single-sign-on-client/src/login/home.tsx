import axios from '../server/axios'
import { FC, useState } from 'react'
import { useNavigate } from 'react-router'

export const Home: FC = () => {
  const [list, setList] = useState([])
  const navigate = useNavigate()

  const handleLogout = () => {
    const token = localStorage.getItem('token')
    axios.post('http://localhost:3000/logout', { token }).then(() => {
      localStorage.removeItem('token')
      localStorage.removeItem('refresh_token')
      navigate('/login')
    })
  }
  
  return (
    <div className='h-screen'>
      <button onClick={() => handleLogout()}>Logout</button>
      <button onClick={() => { axios.get('http://localhost:3000/get/list' ).then((res) => setList(res.data)) }}>获取数据</button>
      <div>{list.map((item: any) => <div key={item.id}>{item.name}</div>)}</div>
    </div>
  )
}
