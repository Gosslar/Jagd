import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Dynamischer Import der App-Komponente
async function loadApp() {
  try {
    const { default: App } = await import('./App.tsx')
    return App
  } catch (error) {
    console.error('Failed to load App:', error)
    throw error
  }
}

// Fallback-Komponente
const FallbackApp = () => (
  <div style={{ 
    fontFamily: 'system-ui, -apple-system, sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    lineHeight: '1.6'
  }}>
    <header style={{ 
      textAlign: 'center', 
      marginBottom: '40px',
      padding: '20px',
      backgroundColor: '#2d5a27',
      color: 'white',
      borderRadius: '8px'
    }}>
      <h1 style={{ margin: '0', fontSize: '2.5rem' }}>🦌 Jagdrevier Weetzen</h1>
      <p style={{ margin: '10px 0 0 0', fontSize: '1.2rem' }}>
        Nachhaltige Jagd in Niedersachsen
      </p>
    </header>

    <div style={{ 
      background: '#fff3cd', 
      border: '1px solid #ffeaa7', 
      padding: '15px', 
      borderRadius: '4px',
      marginBottom: '30px'
    }}>
      <h2 style={{ color: '#856404', marginTop: '0' }}>⚠️ Vereinfachte Version</h2>
      <p>Die Hauptanwendung wird geladen. Falls Probleme auftreten, nutzen Sie die Links unten.</p>
    </div>

    <main>
      <section style={{ marginBottom: '30px' }}>
        <h2 style={{ color: '#2d5a27', borderBottom: '2px solid #2d5a27', paddingBottom: '10px' }}>
          Willkommen im Jagdrevier Weetzen
        </h2>
        <p>
          Unser Jagdrevier erstreckt sich über 340 Hektar Wald- und Feldlandschaft 
          in der schönen Region Niedersachsen. Wir praktizieren nachhaltige Jagd 
          und bieten frisches Wildfleisch aus eigener Jagd.
        </p>
      </section>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ color: '#2d5a27', marginTop: '0' }}>🥩 Wildfleisch-Shop</h3>
          <p>Frisches Wildfleisch aus nachhaltiger Jagd. Reh, Wildschwein und Federwild in bester Qualität.</p>
          <p><strong>Verfügbare Produkte:</strong></p>
          <ul>
            <li>Rehfleisch (Keule, Rücken, Gulasch)</li>
            <li>Wildschwein (Schnitzel, Braten, Hackfleisch)</li>
            <li>Federwild (Ente, Gans, Fasan)</li>
          </ul>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ color: '#2d5a27', marginTop: '0' }}>🐕 Jagdhunde</h3>
          <p>Unsere erfahrenen Jagdhunde unterstützen uns bei der nachhaltigen Jagd:</p>
          <ul>
            <li><strong>Deutsche Bracke:</strong> Spezialist für Nachsuche</li>
            <li><strong>Brandlbracke:</strong> Vielseitiger Jagdhelfer</li>
            <li><strong>Alpenländische Dachsbracke:</strong> Experte für schwieriges Gelände</li>
          </ul>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ color: '#2d5a27', marginTop: '0' }}>🦆 Wildarten</h3>
          <p>Vielfältige Wildarten in unserem Revier:</p>
          <ul>
            <li><strong>Rehwild:</strong> Hauptwildart unseres Reviers</li>
            <li><strong>Schwarzwild:</strong> Wildschweine in verschiedenen Altersklassen</li>
            <li><strong>Federwild:</strong> Enten, Gänse, Fasane</li>
            <li><strong>Haarwild:</strong> Hasen und weitere Arten</li>
          </ul>
        </div>

        <div style={{ 
          padding: '20px', 
          backgroundColor: '#f8f9fa', 
          borderRadius: '8px',
          border: '1px solid #e9ecef'
        }}>
          <h3 style={{ color: '#2d5a27', marginTop: '0' }}>🛡️ Prädatorenmanagement</h3>
          <p>Professionelles Management zum Schutz der Wildbestände:</p>
          <ul>
            <li><strong>Fuchs:</strong> Regulierung zum Schutz des Niederwildes</li>
            <li><strong>Dachs:</strong> Bestandskontrolle</li>
            <li><strong>Marder:</strong> Schutz der Bodenbrüter</li>
            <li><strong>Waschbär & Nutria:</strong> Invasive Arten-Management</li>
          </ul>
        </div>
      </div>

      <section style={{ 
        backgroundColor: '#e8f5e8', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#2d5a27', marginTop: '0' }}>🏞️ Weitere Bereiche</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '15px'
        }}>
          <div>
            <h4>🦌 Rehkitzrettung</h4>
            <p>Moderne Drohnentechnologie zum Schutz der Jungtiere während der Mahd.</p>
          </div>
          <div>
            <h4>🏞️ Jagd-Einrichtungen</h4>
            <p>Professionelle Einrichtungen für nachhaltiges Wildtiermanagement.</p>
          </div>
          <div>
            <h4>📊 Revierverwaltung</h4>
            <p>Systematische Erfassung und Verwaltung der Wildbestände.</p>
          </div>
        </div>
      </section>

      <section style={{ 
        backgroundColor: '#fff3cd', 
        padding: '20px', 
        borderRadius: '8px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#856404', marginTop: '0' }}>🔗 Alternative Zugänge</h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '15px'
        }}>
          <a href="/fallback.html" style={{ 
            display: 'block',
            padding: '15px',
            backgroundColor: '#fff',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            textDecoration: 'none',
            color: '#856404',
            textAlign: 'center'
          }}>
            📄 Fallback-Version
          </a>
          <a href="/static.html" style={{ 
            display: 'block',
            padding: '15px',
            backgroundColor: '#fff',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            textDecoration: 'none',
            color: '#856404',
            textAlign: 'center'
          }}>
            📋 Statische Version
          </a>
          <a href="/diagnose.html" style={{ 
            display: 'block',
            padding: '15px',
            backgroundColor: '#fff',
            border: '1px solid #ffeaa7',
            borderRadius: '4px',
            textDecoration: 'none',
            color: '#856404',
            textAlign: 'center'
          }}>
            🔧 Diagnose-Tool
          </a>
        </div>
      </section>
    </main>

    <footer style={{ 
      marginTop: '40px', 
      padding: '20px', 
      textAlign: 'center',
      borderTop: '1px solid #e9ecef',
      color: '#6c757d'
    }}>
      <p>&copy; 2024 Jagdrevier Weetzen - Nachhaltige Jagd in Niedersachsen</p>
      <p style={{ fontSize: '14px', marginTop: '10px' }}>
        <strong>Status:</strong> Vereinfachte Version aktiv | 
        <strong>Datum:</strong> {new Date().toLocaleString('de-DE')}
      </p>
    </footer>
  </div>
)

// Robuste App-Initialisierung
async function initializeApp() {
  try {
    // Root-Element finden oder erstellen
    let rootElement = document.getElementById('root')
    
    if (!rootElement) {
      console.warn('Root element not found, creating one...')
      rootElement = document.createElement('div')
      rootElement.id = 'root'
      document.body.appendChild(rootElement)
    }

    const root = createRoot(rootElement)
    
    // Versuche die Haupt-App zu laden
    try {
      console.log('Loading main application...')
      const App = await loadApp()
      
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      )
      
      console.log('✅ Main Jagdrevier Weetzen App loaded successfully')
    } catch (appError) {
      console.warn('Main app failed to load, using fallback:', appError)
      
      // Fallback zur vereinfachten Version
      root.render(
        <React.StrictMode>
          <FallbackApp />
        </React.StrictMode>
      )
      
      console.log('✅ Fallback Jagdrevier Weetzen App loaded successfully')
    }
    
  } catch (error) {
    console.error('❌ Critical initialization error:', error)
    
    // Letzter Fallback: Direkte HTML-Manipulation
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2d5a27;">🦌 Jagdrevier Weetzen</h1>
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px; margin: 20px 0;">
          <h2>Kritischer Fehler</h2>
          <p>Die Anwendung konnte nicht gestartet werden.</p>
          <p><strong>Fehler:</strong> ${error instanceof Error ? error.message : 'Unbekannter Fehler'}</p>
        </div>
        <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 15px; border-radius: 4px;">
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
