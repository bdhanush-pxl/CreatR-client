import React, { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "./AuthContext";

const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState(null)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
    const navigate = useNavigate(); 

    const getCurrentUser = async () => {
        try {
            const response = await fetch(
                API_URL + "/api/users/current-user",
                {
                    method: "GET",
                    credentials: "include", // 🔑 REQUIRED
                }
            );
            console.log("Current User Response:", response);
            if (!response.ok) {
                const errorText = await response.text();
                console.log("Error response:", errorText);
                throw new Error(`Not authenticated: ${response.status}`);
            }
            
            const data = await response.json();
            console.log("User data received:", data);
            return data;
        } catch (error) {
            console.error("getCurrentUser error:", error);
            throw error;
        }
    };

    const login = async (username, password) => {
        try {
            const response = await fetch(API_URL + '/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                setUser(data.data);
                setIsAuthenticated(true);
                return { success: true, data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: error.message };
        }
    };

    const logout = async () => {
        try {
            await fetch(API_URL + '/api/users/logout', {
                method: 'POST',
                credentials: 'include',
            });
            setUser(null);
            setIsAuthenticated(false);
            navigate('/')
        } catch (error) {
            console.error('Logout error:', error);
        }
    };


    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getCurrentUser();
                setUser(data.data); // Backend sends user in data.data
                setIsAuthenticated(true);
                console.log('User authenticated successfully');
            } catch (err) {
                // 401 Unauthorized is expected when no valid session exists
                if (err.message.includes('401')) {
                    console.log('No active session found - user needs to login');
                } else {
                    console.error('Error fetching current user:', err);
                }
                setUser(null);
                setIsAuthenticated(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchUser();
    }, []) // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <AuthContext.Provider value={{ 
            user, 
            isAuthenticated, 
            isLoading, 
            setUser, 
            setIsAuthenticated, 
            getCurrentUser,
            login,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    )
}


export default AuthContextProvider