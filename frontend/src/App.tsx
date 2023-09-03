
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Home from './pages/Home.js'
import Profile from './pages/Profile.js'
import Login from './pages/Login.js'
import Register from './pages/Register.js'
import PrivateRoutes from "../utils/PrivateRoutes.tsx";
import { AuthProvider } from "../utils/AuthContext.tsx";

function App() {

  return (
    <Router>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route element={<PrivateRoutes/>}>
              <Route path="/" element={<Home/>}/>
              <Route path="/profile" element={<Profile/>}/>
            </Route>
          </Routes>
          <Header/>
        </AuthProvider>
    </Router>
  )
}

export default App
