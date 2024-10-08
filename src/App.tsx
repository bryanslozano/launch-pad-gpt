import React from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import SignIn from './components/SignIn'
import ChatInterface from './components/ChatInterface'
import UserProfile from './components/UserProfile'
import { User as UserType } from './types'

function App() {
  const [currentUser, setCurrentUser] = React.useState<UserType | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser({
          id: user.uid,
          name: user.displayName || '',
          email: user.email || '',
          customGPTInfo: 'I am a new user interested in AI.',
        })
      } else {
        setCurrentUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <Router>
      <Routes>
        <Route path="/signin" element={currentUser ? <Navigate to="/chat" /> : <SignIn />} />
        <Route
          path="/chat"
          element={
            currentUser ? (
              <div className="min-h-screen bg-gray-100 flex flex-col">
                <main className="flex-grow flex p-4">
                  <div className="max-w-7xl w-full mx-auto flex space-x-4">
                    <div className="w-3/4">
                      <ChatInterface currentUser={currentUser} />
                    </div>
                    <div className="w-1/4">
                      <UserProfile user={currentUser} onUpdateUser={() => {}} />
                    </div>
                  </div>
                </main>
              </div>
            ) : (
              <Navigate to="/signin" />
            )
          }
        />
        <Route path="/" element={<Navigate to="/chat" />} />
      </Routes>
    </Router>
  )
}

export default App