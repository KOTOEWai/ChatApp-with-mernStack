import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Route,Routes } from 'react-router-dom'
import Login from './components/login.jsx'
import Chat from './components/chat.jsx'
import SignUp from './components/singUp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
    <Routes>
      <Route path='/chat' element = {<Chat />}/>
      <Route path='/chat/:id' element = {<Chat />}/>
      <Route path='/login' element = {<Login />}/>
      <Route path='/SignUp' element = {<SignUp />}/>
    </Routes>
    </BrowserRouter>
  </StrictMode>,
)
