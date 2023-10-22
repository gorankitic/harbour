// react
import React from 'react'
import ReactDOM from 'react-dom/client'
// components
import App from './App.jsx'
// context
import { AuthContextProvider } from './context/AuthContext.jsx'

// styles
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  // <React.StrictMode>
    <AuthContextProvider>
      <App />
    </AuthContextProvider>
  // </React.StrictMode>
)
