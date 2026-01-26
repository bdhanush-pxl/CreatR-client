import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Home from './pages/Home'
import Feed from './pages/Feed'
import Header from './components/Header'
import AuthContextProvider from './context/Auth/AuthContextProvider.jsx'
import Dashboard from './pages/Dashboard'
import ProtectedComponent from './components/ProtectedComponent.jsx'

const App = () => {

  return (
    <div>
      <BrowserRouter>
      <AuthContextProvider>
        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<ProtectedComponent><Feed /></ProtectedComponent>} />
        <Route path="/dashboard" element={<ProtectedComponent><Dashboard /></ProtectedComponent>} />
        </Routes>
      </AuthContextProvider>
      </BrowserRouter>
      
    </div>
  )
}

export default App
