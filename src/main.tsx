import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Robuste App-Initialisierung
function initializeApp() {
  try {
    // Root-Element finden oder erstellen
    let rootElement = document.getElementById('root')
    
    if (!rootElement) {
      console.warn('Root element not found, creating one...')
      rootElement = document.createElement('div')
      rootElement.id = 'root'
      document.body.appendChild(rootElement)
    }

    // React App rendern
    const root = createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    
    console.log('✅ Jagdrevier Weetzen App successfully initialized')
  } catch (error) {
    console.error('❌ App initialization failed:', error)
    
    // Fallback-Anzeige
    const fallbackHtml = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2d5a27;">🦌 Jagdrevier Weetzen</h1>
        <div style="background: #ffebee; border: 1px solid #f44336; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h2>Technischer Fehler</h2>
          <p>Die Hauptanwendung konnte nicht geladen werden.</p>
          <p><strong>Fehler:</strong> ${error.message}</p>
        </div>
        <div style="background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; border-radius: 4px;">
          <h3>Alternative Zugänge:</h3>
          <ul>
            <li><a href="/fallback.html" style="color: #2d5a27;">→ Fallback-Version</a></li>
            <li><a href="/static.html" style="color: #2d5a27;">→ Statische Version</a></li>
            <li><a href="/diagnose.html" style="color: #2d5a27;">→ Diagnose-Tool</a></li>
          </ul>
          <p style="margin-top: 15px; font-size: 14px; color: #666;">
            Diese Seite wird automatisch in 5 Sekunden zur Fallback-Version weitergeleitet.
          </p>
        </div>
      </div>
      <script>
        setTimeout(function() {
          if (window.location.pathname === '/') {
            window.location.href = '/fallback.html';
          }
        }, 5000);
      </script>
    `
    document.body.innerHTML = fallbackHtml
  }
}

// Warte auf DOM-Ready und starte App
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}
