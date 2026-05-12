import React from 'react'
import {BrowserRouter,Route,Routes} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Home from './pages/Home'
import Feed from './pages/Feed'
import Header from './components/Header'
import AuthContextProvider from './context/Auth/AuthContextProvider.jsx'
import Dashboard from './pages/Dashboard/Dashboard'
import ProtectedComponent from './components/ProtectedComponent.jsx'
import Testimonials from './pages/Testimonials'
import Feature from './pages/Feature'
import DashboardLayout from './layouts/DashboardLayout'
import Settings from './pages/Dashboard/Settings/Settings'
import { Toaster } from "sonner";


const App = () => {

  return (
    <div>
      <Toaster />
      <BrowserRouter>
      <AuthContextProvider>
        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/dashboard" element={<DashboardLayout><Dashboard /></DashboardLayout>} />
        <Route path="/dashboard/settings" element={<DashboardLayout><Settings /></DashboardLayout>} />
        <Route path="/testimonials" element={<Testimonials />} />
        <Route path="/feature" element={<Feature />} />
        </Routes>
      </AuthContextProvider>
      </BrowserRouter>
      
    </div>
  )
}

export default App
