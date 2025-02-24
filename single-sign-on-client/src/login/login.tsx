import { FC } from 'react'

export const Login: FC = () => {
  return (
    <form onSubmit={(e) => console.log(e)} className='flex'>
      <input type="text" name="username" />
      <input type="password" name="password" />
    </form>
  )
}
