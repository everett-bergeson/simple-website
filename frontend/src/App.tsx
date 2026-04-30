import { useState, useEffect } from 'react'
import Login from './components/Login'
import Dashboard from './components/Dashboard'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Basic check to see if we have a token stored
    const token = localStorage.getItem('token')
    if (token) {
      setIsAuthenticated(true)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    setIsAuthenticated(false)
  }

  return (
    <div style={{ fontFamily: 'sans-serif' }}>
      {isAuthenticated ? (
        <Dashboard logout={handleLogout} />
      ) : (
        <Login setLoggedIn={() => setIsAuthenticated(true)} />
      )}
    </div>
  )
}

export default App
