import { useState } from 'react'

import './App.css'
import LandingPage from './app/landingpage/LandingPage'
import Navbar from './components/Navbar'

function App() {
  const [darkMode, setDarkMode] = useState(false)

  return (
    <>
      <Navbar/>
      <LandingPage />

    
    </>
  )
}

export default App
