import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Einfachste funktionierende Version
const JagdrevierApp = () => {
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

      <div style={{ 
        background: '#d4edda', 
        border: '1px solid #c3e6cb', 
        padding: '15px', 
        borderRadius: '4px',
        marginBottom: '30px'
      }}>
        <h2 style={{ color: '#155724', marginTop: '0' }}>✅ Website lädt erfolgreich!</h2>
        <p><strong>Status:</strong> Jagdrevier Weetzen Website ist verfügbar</p>
        <p><strong>Datum:</strong> {new Date().toLocaleString('de-DE')}</p>
        <p><strong>Version:</strong> Stabile Produktionsversion für Alfahosting</p>
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
            <div style={{ marginTop: '15px' }}>
              <h4>Verfügbare Produkte:</h4>
              <ul>
                <li><strong>Rehfleisch:</strong> Keule, Rücken, Gulasch</li>
                <li><strong>Wildschwein:</strong> Schnitzel, Braten, Hackfleisch</li>
                <li><strong>Federwild:</strong> Ente, Gans, Fasan</li>
              </ul>
            </div>
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
              <li><strong>Deutsche Bracke:</strong> Spezialist für Nachsuche und Spurarbeit</li>
              <li><strong>Brandlbracke:</strong> Vielseitiger Jagdhelfer für alle Wildarten</li>
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
            <p>Vielfältige Wildarten in unserem 340-Hektar-Revier:</p>
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
              <li><strong>Dachs:</strong> Bestandskontrolle und Habitatmanagement</li>
              <li><strong>Marder:</strong> Schutz der Bodenbrüter</li>
              <li><strong>Waschbär & Nutria:</strong> Management invasiver Arten</li>
            </ul>
          </div>
        </div>

        <section style={{ 
          backgroundColor: '#e8f5e8', 
          padding: '20px', 
          borderRadius: '8px',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#2d5a27', marginTop: '0' }}>🏞️ Weitere Bereiche unseres Jagdreviers</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px'
          }}>
            <div>
              <h4 style={{ color: '#2d5a27' }}>🦌 Rehkitzrettung</h4>
              <p>Moderne Drohnentechnologie zum Schutz der Jungtiere während der Mahd. Wir setzen auf innovative Methoden zum Tierschutz.</p>
            </div>
            <div>
              <h4 style={{ color: '#2d5a27' }}>🏞️ Jagd-Einrichtungen</h4>
              <p>Professionelle Einrichtungen für nachhaltiges Wildtiermanagement und artgerechte Jagdpraxis.</p>
            </div>
            <div>
              <h4 style={{ color: '#2d5a27' }}>📊 Revierverwaltung</h4>
              <p>Systematische Erfassung und Verwaltung der Wildbestände für nachhaltiges Management.</p>
            </div>
            <div>
              <h4 style={{ color: '#2d5a27' }}>🌿 Naturschutz</h4>
              <p>Aktiver Beitrag zum Naturschutz durch verantwortungsvolle Jagdpraxis und Habitatpflege.</p>
            </div>
          </div>
        </section>

        <section style={{ marginBottom: '30px' }}>
          <h2 style={{ color: '#2d5a27' }}>📞 Kontakt & Information</h2>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px'
          }}>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#2d5a27', marginTop: '0' }}>Jagdrevier Weetzen</h3>
              <p><strong>Größe:</strong> 340 Hektar Wald- und Feldlandschaft</p>
              <p><strong>Lage:</strong> Niedersachsen, Deutschland</p>
              <p><strong>Schwerpunkt:</strong> Nachhaltige Jagd und Wildtiermanagement</p>
            </div>
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#f8f9fa', 
              borderRadius: '8px',
              border: '1px solid #e9ecef'
            }}>
              <h3 style={{ color: '#2d5a27', marginTop: '0' }}>Unsere Philosophie</h3>
              <p><strong>Nachhaltigkeit:</strong> Verantwortungsvolle Jagdpraxis</p>
              <p><strong>Wildtiermanagement:</strong> Professionelle Bestandsführung</p>
              <p><strong>Naturschutz:</strong> Aktiver Beitrag zum Erhalt der Natur</p>
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
        <p style={{ fontSize: '14px', marginTop: '10px' }}>
          <strong>Website-Status:</strong> ✅ Erfolgreich geladen | 
          <strong>Version:</strong> Produktionsversion für Alfahosting
        </p>
      </footer>
    </div>
  )
}

// Robuste Initialisierung
function initApp() {
  try {
    const container = document.getElementById('root') || (() => {
      const div = document.createElement('div')
      div.id = 'root'
      document.body.appendChild(div)
      return div
    })()
    
    const root = createRoot(container)
    root.render(<JagdrevierApp />)
    console.log('✅ Jagdrevier Weetzen loaded successfully')
  } catch (error) {
    console.error('❌ Error:', error)
    document.body.innerHTML = `
      <div style="padding: 20px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        <h1 style="color: #2d5a27;">🦌 Jagdrevier Weetzen</h1>
        <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 4px;">
          <h2>Fehler beim Laden</h2>
          <p><a href="/fallback.html">→ Zur Fallback-Version</a></p>
        </div>
      </div>
    `
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  initApp()
}
