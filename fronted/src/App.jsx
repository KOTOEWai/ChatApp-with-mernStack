import { Route,Routes } from 'react-router-dom'
import Login from './components/login.jsx'
import Chat from './components/chat.jsx'
import SignUp from './components/singUp.jsx'
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
