import React, { useState, useEffect } from 'react'
import {
  User,
  Loader2,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useAuth } from '../../../context/Auth/AuthContext'
import { useNavigate } from 'react-router';

const Settings = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';
  const navigate = useNavigate();

  // Set the current username on mount
  useEffect(() => {
    if(!user){
      toast.error('User not authenticated', {
        description: 'Please log in to update your username.',
        icon: <AlertCircle className="w-5 h-5" />
      });
      setTimeout(() => {
        navigate('/login');
      },2000)
      return;
    }
    if (user?.username) {
      setCurrentUsername(user.username);
    }
  }, [user]);

  // Validation function
  const validateUsername = (value) => {
    if (!value) {
      return null;
    }
    if (value.length < 4) {
      return 'Username must be at least 4 characters';
    }
    if (value.length > 20) {
      return 'Username must be at most 20 characters';
    }
    if (!/^[a-zA-Z0-9_-]+$/.test(value)) {
      return 'Only letters, numbers, underscores, and hyphens allowed';
    }
    return null;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setUsername(value);
    setError(validateUsername(value));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate before submission
    const validationError = validateUsername(username);
    if (validationError) {
      setError(validationError);
      console.log('Validation error:', validationError);
      return;
    }

    //check if user is not logged in for some reason
    if(!user || currentUsername===''){
      toast.error('User not authenticated', {
        description: 'Please log in to update your username.',
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    // Check if new username is same as current username
    if (username === currentUsername) {
      console.log('Showing toast - username unchanged');
      toast.error('Username unchanged', {
        description: 'The new username should be different from the previous one.',
        icon: <AlertCircle className="w-5 h-5" />
      });
      return;
    }

    setIsLoading(true);
    try {
        const response = await fetch(API_URL+'/api/users/update-username', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ username })
            });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Failed to update username');
        }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // On success
      setCurrentUsername(username);
      setUsername('');
      setError('');
      console.log('Showing toast - username updated');
      toast.success('Username updated', {
        description: `Your username has been changed to "${username}" successfully.`,
        icon: <CheckCircle className="w-5 h-5" />
      });
    } catch (err) {
      console.log('Error:', err);
      toast.error('Update failed', {
        description: 'Failed to update username. Please try again.',
        icon: <AlertCircle className="w-5 h-5" />
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Check if username is valid for showing success message
  const isUsernameValid = username && !validateUsername(username);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-6">
      <div className="max-w-lg mx-auto">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className='text-3xl font-bold text-white mb-1'>Settings</h1>
          <p className='text-slate-400 text-sm'>Manage your profile and account preferences</p>
        </div>

        {/* Username Settings Card */}
        <Card className='bg-slate-800/50 border-slate-700 hover:border-slate-600 transition-colors duration-300 shadow-xl'>
          <CardHeader className='pb-4'>
            <div className='flex items-center gap-2 mb-2'>
              <div className='p-1.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg'>
                <User className='w-4 h-4 text-white' />
              </div>
              <div>
                <CardTitle className='text-lg text-white'>Username Settings</CardTitle>
              </div>
            </div>
            <CardDescription className='text-slate-400 text-sm'>
              Set your unique username for your public profile
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className='space-y-4'>
              {/* Current Username Display */}
              {currentUsername && (
                <div className='p-3 bg-slate-700/30 border border-slate-600 rounded-lg mb-4'>
                  <p className='text-xs text-slate-400 mb-1'>Current Username</p>
                  <p className='text-base font-semibold text-purple-400'>@{currentUsername}</p>
                </div>
              )}

              {/* Username Input Field */}
              <div className='space-y-2'>
                <Label htmlFor='username' className='text-white text-sm font-semibold'>
                  Username
                </Label>
                <Input
                  id='username'
                  placeholder='Enter your username'
                  value={username}
                  onChange={handleInputChange}
                  className='bg-slate-700/50 border-slate-600 text-white placeholder-slate-500 focus:border-purple-500 focus:ring-purple-500 transition-all duration-300 h-10 text-sm'
                />

                {/* Validation Error Message */}
                {error && (
                  <div className='flex items-center gap-2 mt-2 text-red-400 text-xs'>
                    <AlertCircle className='w-3.5 h-3.5 flex-shrink-0' />
                    <span>{error}</span>
                  </div>
                )}

                {/* Helper Text */}
                <p className='text-slate-400 text-xs mt-2'>
                  4-20 characters, letters, numbers, underscores, and hyphens only
                </p>

                {/* Real-time validation feedback */}
                {isUsernameValid && (
                  <div className='flex items-center gap-2 mt-2 text-green-400 text-xs'>
                    <CheckCircle className='w-3.5 h-3.5 flex-shrink-0' />
                    <span>Username looks good!</span>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type='submit'
                disabled={isLoading}
                className='w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-2 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed h-10 text-sm mt-6'
              >
                {isLoading ? (
                  <div className='flex items-center justify-center gap-2'>
                    <Loader2 className='w-4 h-4 animate-spin' />
                    <span>Updating...</span>
                  </div>
                ) : (
                  'Update Username'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Footer Note */}
        <div className='mt-4 p-3 bg-slate-700/20 border border-slate-600 rounded-lg'>
          <p className='text-slate-400 text-xs flex items-center gap-2'>
            <AlertCircle className='w-3.5 h-3.5 flex-shrink-0' />
            Your username is your unique identifier on the platform.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Settings
