import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

// Minimale funktionsfähige App
function JagdWeetzenApp() {
  return (
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
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#2d5a27', marginTop: '0' }}>🐕 Jagdhunde</h3>
            <p>Unsere erfahrenen Jagdhunde: Deutsche Bracke, Brandlbracke und Alpenländische Dachsbracke.</p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#2d5a27', marginTop: '0' }}>🦆 Wildarten</h3>
            <p>Rehwild, Schwarzwild, Federwild und weitere Wildarten in unserem Revier.</p>
          </div>

          <div style={{ 
            padding: '20px', 
            backgroundColor: '#f8f9fa', 
            borderRadius: '8px',
            border: '1px solid #e9ecef'
          }}>
            <h3 style={{ color: '#2d5a27', marginTop: '0' }}>🛡️ Prädatorenmanagement</h3>
            <p>Professionelles Management von Fuchs, Dachs, Marder und anderen Prädatoren.</p>
          </div>
        </div>

        <section style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#2d5a27', marginTop: '0' }}>✅ Website erfolgreich geladen!</h2>
          <p><strong>Status:</strong> Die Website funktioniert korrekt</p>
          <p><strong>Datum:</strong> {new Date().toLocaleString('de-DE')}</p>
          <p><strong>Für Alfahosting:</strong> Diese Version ist bereit für den Upload</p>
        </section>

        <section>
          <h2 style={{ color: '#2d5a27' }}>Kontakt & Information</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px'
          }}>
            <div>
              <h3>Jagdrevier Weetzen</h3>
              <p>340 Hektar Wald- und Feldlandschaft<br/>
              Niedersachsen, Deutschland</p>
            </div>
            <div>
              <h3>Nachhaltige Jagd</h3>
              <p>Verantwortungsvolle Jagdpraxis<br/>
              Wildtiermanagement<br/>
              Naturschutz</p>
            </div>
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
      </footer>
    </div>
  )
}

// Robuste Initialisierung
function initApp() {
  try {
    const container = document.getElementById('root') || document.body
    const root = ReactDOM.createRoot(container)
    root.render(<JagdWeetzenApp />)
    console.log('✅ Jagdrevier Weetzen App loaded successfully')
  } catch (error) {
    console.error('❌ Error loading app:', error)
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2d5a27;">🦌 Jagdrevier Weetzen</h1>
        <div style="background: #ffebee; border: 1px solid #f44336; padding: 15px; border-radius: 4px;">
          <h2>Technischer Fehler</h2>
          <p>Die Website konnte nicht vollständig geladen werden.</p>
          <p><a href="/fallback.html">→ Zur Fallback-Version</a></p>
        </div>
      </div>
    `
  }
}

// App starten
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
