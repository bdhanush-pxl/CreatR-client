import React from 'react'
import { useAuth } from '../context/Auth/AuthContext';
import { useNavigate } from 'react-router-dom';

function ProtectedComponent({children}) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    if (!isAuthenticated) {
        navigate('/login');
        return null; // or a loading spinner
    }
  return (
    <div>
      {children}
    </div>
  )
}

export default ProtectedComponent
