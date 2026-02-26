import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "@fontsource/kantumruy-pro"; // Defaults to weight 400
import "@fontsource/kantumruy-pro/700.css"; // For bold


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
