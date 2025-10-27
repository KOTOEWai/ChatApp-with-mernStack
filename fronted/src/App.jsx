import { Route,Routes } from 'react-router-dom'
import Chat from './page/chat.jsx'
import Login from './page/login.jsx'
import SignUp from './page/SignUp.jsx'
import { AuthContext } from './Auth.jsx'
import { useContext } from 'react'
export default function App() {
  const { user } = useContext(AuthContext)
  return (
    <Routes>
      <Route path='/' element = {<Chat/>} />
      <Route path='/chat' element = { user ? <Chat/> : <Login/> } />
      <Route path='/chat/:id' element = {user ? <Chat /> : <Login />} />
      <Route path='/login' element = {<Login />}/>
      <Route path='/SignUp' element = {<SignUp />}/>
    </Routes>
  )
}
