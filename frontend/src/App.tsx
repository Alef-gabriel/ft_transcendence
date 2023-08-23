
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Home from './pages/Home.js'
import Profile from './pages/Profile.js'
import Login from './pages/Login.js'
import Register from './pages/Register.js'

function App() {

  return (
    <Router>
        <Header/>
        <Routes>
          <Route path="/login" element={<Login/>}/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Home/>}/>
          <Route path="/profile" element={<Profile/>}/>
        </Routes>
    </Router>
  )
}

export default App
