import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Importiere die App-Komponente mit Error Boundary
let App: React.ComponentType

try {
  App = require('./App.tsx').default
} catch (error) {
  console.error('Failed to load App component:', error)
  // Fallback App
  App = () => (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🦌 Jagdrevier Weetzen</h1>
      <p>Die Website wird geladen...</p>
      <p><a href="/fallback.html">→ Zur Fallback-Version</a></p>
    </div>
  )
}

// Error Boundary Komponente
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          fontFamily: 'Arial, sans-serif',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          <h1 style={{ color: '#2d5a27' }}>🦌 Jagdrevier Weetzen</h1>
          <div style={{ 
            background: '#ffebee', 
            border: '1px solid #f44336', 
            padding: '15px', 
            borderRadius: '4px',
            margin: '20px 0'
          }}>
            <h2>Technischer Fehler</h2>
            <p>Die Hauptanwendung konnte nicht geladen werden.</p>
            {this.state.error && (
              <details>
                <summary>Fehlerdetails</summary>
                <pre style={{ fontSize: '12px', overflow: 'auto' }}>
                  {this.state.error.message}
                </pre>
              </details>
            )}
          </div>
          <div style={{ 
            background: '#e8f5e8', 
            border: '1px solid #4caf50', 
            padding: '15px', 
            borderRadius: '4px'
          }}>
            <h3>Alternative Zugänge:</h3>
            <ul>
              <li><a href="/fallback.html" style={{ color: '#2d5a27' }}>→ Fallback-Version</a></li>
              <li><a href="/static.html" style={{ color: '#2d5a27' }}>→ Statische Version</a></li>
              <li><a href="/diagnose.html" style={{ color: '#2d5a27' }}>→ Diagnose-Tool</a></li>
            </ul>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

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

    // React App mit Error Boundary rendern
    const root = createRoot(rootElement)
    root.render(
      <React.StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </React.StrictMode>
    )
    
    console.log('✅ Jagdrevier Weetzen App successfully initialized')
  } catch (error) {
    console.error('❌ Critical initialization error:', error)
    
    // Letzter Fallback: Direkte HTML-Manipulation
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2d5a27;">🦌 Jagdrevier Weetzen</h1>
        <div style="background: #ffebee; border: 1px solid #f44336; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h2>Kritischer Fehler</h2>
          <p>Die Anwendung konnte nicht gestartet werden.</p>
          <p><strong>Fehler:</strong> ${error instanceof Error ? error.message : 'Unbekannter Fehler'}</p>
        </div>
        <div style="background: #e8f5e8; border: 1px solid #4caf50; padding: 15px; border-radius: 4px;">
          <h3>Alternative Zugänge:</h3>
          <ul>
            <li><a href="/fallback.html" style="color: #2d5a27;">→ Fallback-Version</a></li>
            <li><a href="/static.html" style="color: #2d5a27;">→ Statische Version</a></li>
            <li><a href="/diagnose.html" style="color: #2d5a27;">→ Diagnose-Tool</a></li>
          </ul>
          <p style="margin-top: 15px; font-size: 14px; color: #666;">
            Diese Seite wird automatisch in 10 Sekunden zur Fallback-Version weitergeleitet.
          </p>
        </div>
      </div>
      <script>
        setTimeout(function() {
          if (window.location.pathname === '/') {
            window.location.href = '/fallback.html';
          }
        }, 10000);
      </script>
    `
  }
}

// Warte auf DOM-Ready und starte App
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp)
} else {
  initializeApp()
}
