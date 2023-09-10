
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.js'
import Home from './pages/Home.js'
import Profile from './pages/Profile.js'
import Login from './pages/Login.js'
import Register2FA from './pages/Register2FA.tsx'
import PrivateRoutes from "../utils/PrivateRoutes.tsx";
import { AuthProvider } from "../utils/AuthContext.tsx";
import ValidateOTP from "./pages/ValidateOTP.tsx";
import NotFound from "./pages/NotFound.tsx";
import ErrorBoundary from "./pages/ErrorBoundary.tsx";

function App() {

  //Todo:
  // Adicionar as rotas em um arquivo Routes.tsx
  // Adicionar pagina de 404

  return (
    <Router>
        <ErrorBoundary>
          <AuthProvider>
            <Header/>
            <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route element={<PrivateRoutes/>}>
                <Route path="/" element={<Home/>}/>
                <Route path="/profile" element={<Profile/>}/>
                <Route path="/register-2fa" element={<Register2FA/>}/>
                <Route path="/validate-otp" element={<ValidateOTP/>}/>
              </Route>
              <Route path="*" element={<NotFound/>}/>
            </Routes>
          </AuthProvider>
        </ErrorBoundary>
    </Router>
  )
}

export default App;
