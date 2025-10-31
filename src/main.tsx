import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Robuste Root-Element-Initialisierung
function initializeApp() {
  try {
    let rootElement = document.getElementById('root')
    
    if (!rootElement) {
      console.warn('Root element not found, creating one...')
      rootElement = document.createElement('div')
      rootElement.id = 'root'
      document.body.appendChild(rootElement)
    }

    const root = ReactDOM.createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    
    console.log('✅ App successfully initialized')
  } catch (error) {
    console.error('❌ App initialization failed:', error)
    
    // Fallback: Zeige Fehlermeldung
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #d32f2f;">🦌 Jagdrevier Weetzen</h1>
        <div style="background: #ffebee; border: 1px solid #f44336; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h2>Technischer Fehler</h2>
          <p>Die Website konnte nicht vollständig geladen werden.</p>
          <p><strong>Fehler:</strong> ${error.message}</p>
        </div>
        <div style="background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; border-radius: 4px;">
          <h3>Alternative Zugänge:</h3>
          <ul>
            <li><a href="/fallback.html">Fallback-Version</a></li>
            <li><a href="/static.html">Statische Version</a></li>
            <li><a href="/diagnose.html">Diagnose-Tool</a></li>
          </ul>
        </div>
      </div>
    `
  }
}

// Warte auf DOM-Ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}
