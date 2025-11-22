import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx' // Explicitly import the .jsx file
import './styles.css' 

// Standard React 18 rendering using JSX
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)