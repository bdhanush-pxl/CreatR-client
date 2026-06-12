import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { BarLoader } from "react-spinners";
import { Button } from "./ui/button";
import { LayoutDashboard } from "lucide-react";
import { useAuth } from "../context/Auth/AuthContext";

function Header(){
    const { user, isAuthenticated, isLoading, logout } = useAuth();
    const { pathname } = useLocation();
    const navigate = useNavigate();
    console.log(user)

    // Redirect authenticated users from landing page to feed
    useEffect(() => {
      if (!isLoading && isAuthenticated && pathname === "/") {
        navigate("/feed");
      }
    }, [isLoading, isAuthenticated, pathname, navigate]);

    // Hide header on dashboard and public profile/post pages
    if (pathname.includes("/dashboard")) return null;

    if (pathname !== "/" && pathname !== "/feed" && pathname.split("/").length >= 2) return null;

  return (
     <header className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-3xl px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-full px-4 sm:px-6 md:px-8 py-3 flex items-center justify-between gap-2">
        {/* Logo */}
        <Link to={isAuthenticated ? "/feed" : "/"} className="shrink-0">
          <img
            src="/logo.png"
            alt="Creatr Logo"
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </Link>

        {/* Auth Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {isAuthenticated ? (
            <>
              {pathname === "/feed" && (
                <Link to="/dashboard">
                  <Button variant="outline" size="sm" className="flex hover:cursor-pointer hover:text-purple-300">
                    <LayoutDashboard className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">Dashboard</span>
                  </Button>
                </Link>
              )}

              <Button className="hover:cursor-pointer hover:text-purple-300" variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="glass" size="sm" className="hover:cursor-pointer hover:text-purple-300 ">
                  Sign In
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="primary" size="sm" className="hover:cursor-pointer hover:text-purple-300">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Loader */}
        {isLoading && (
          <div className="fixed bottom-0 left-0 w-full z-40 flex justify-center">
            <BarLoader width="95%" color="#D8B4FE" />
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
