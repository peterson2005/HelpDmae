import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import Home from './pages/Home'
import NovoChamado from './pages/NovoChamado'
import MeusChamados from './pages/MeusChamados'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <MeusChamados />
    </>
  )
}

export default App
