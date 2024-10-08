import React, { useState } from 'react';
import { signInWithPopup, signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SignIn: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    try {
      setError(null);
      await signInWithPopup(auth, googleProvider);
      navigate('/chat');
    } catch (error: any) {
      if (error.code === 'auth/popup-blocked') {
        try {
          // If popup is blocked, try redirect method
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectError: any) {
          handleSignInError(redirectError);
        }
      } else {
        handleSignInError(error);
      }
    }
  };

  const handleSignInError = (error: any) => {
    console.error('Error signing in with Google:', error);
    switch (error.code) {
      case 'auth/unauthorized-domain':
        setError('This domain is not authorized for sign-in. Please contact the administrator.');
        break;
      case 'auth/popup-closed-by-user':
        setError('Sign-in popup was closed. Please try again.');
        break;
      default:
        setError('Error signing in. Please try again.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to The Launch Pad Chat</h2>
        <p className="mb-4 text-center">Sign in to start chatting with your personalized AI assistant.</p>
        {error && (
          <p className="mb-4 text-center text-red-500">{error}</p>
        )}
        <button
          onClick={signInWithGoogle}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center justify-center"
        >
          <LogIn className="mr-2" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default SignIn;