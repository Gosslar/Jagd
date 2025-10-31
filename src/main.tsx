import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

// Professionelle Jagdrevier Weetzen Website
const JagdrevierWeetzenApp = () => {
  const [activeSection, setActiveSection] = React.useState('home')

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setActiveSection(sectionId)
    }
  }

  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      margin: '0',
      padding: '0'
    }}>
      {/* Navigation */}
      <nav style={{
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        backgroundColor: '#2d5a27',
        padding: '1rem 0',
        zIndex: '1000',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem'
        }}>
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            color: 'white'
          }}>
            🦌 Jagdrevier Weetzen
          </div>
          <div style={{ display: 'flex', gap: '2rem' }}>
            {[
              { id: 'home', label: 'Home' },
              { id: 'wildfleisch', label: 'Wildfleisch' },
              { id: 'jagdhunde', label: 'Jagdhunde' },
              { id: 'wildarten', label: 'Wildarten' },
              { id: 'praedatoren', label: 'Prädatoren' },
              { id: 'kontakt', label: 'Kontakt' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeSection === item.id ? '#90EE90' : 'white',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  borderRadius: '4px',
                  transition: 'all 0.3s ease',
                  textDecoration: activeSection === item.id ? 'underline' : 'none'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #2d5a27 0%, #4a7c59 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white',
        position: 'relative'
      }}>
        <div style={{
          maxWidth: '800px',
          padding: '2rem'
        }}>
          <h1 style={{
            fontSize: '4rem',
            marginBottom: '1rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🦌 Jagdrevier Weetzen
          </h1>
          <h2 style={{
            fontSize: '2rem',
            marginBottom: '2rem',
            fontWeight: '300',
            opacity: '0.9'
          }}>
            Nachhaltige Jagd in Niedersachsen
          </h2>
          <p style={{
            fontSize: '1.3rem',
            marginBottom: '3rem',
            opacity: '0.8'
          }}>
            340 Hektar Wald- und Feldlandschaft • Professionelles Wildtiermanagement • Frisches Wildfleisch
          </p>
          <button
            onClick={() => scrollToSection('wildfleisch')}
            style={{
              backgroundColor: '#90EE90',
              color: '#2d5a27',
              border: 'none',
              padding: '1rem 2rem',
              fontSize: '1.2rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)'
              e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)'
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)'
              e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            🥩 Zum Wildfleisch-Shop
          </button>
        </div>
      </section>

      {/* Wildfleisch Section */}
      <section id="wildfleisch" style={{
        padding: '5rem 2rem',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2d5a27'
          }}>
            🥩 Wildfleisch-Shop
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
            gap: '2rem',
            marginBottom: '3rem'
          }}>
            {[
              {
                title: 'Rehfleisch',
                description: 'Zartes, mageres Fleisch aus nachhaltiger Jagd',
                products: ['Rehkeule (2-3 kg)', 'Rehrücken (1-2 kg)', 'Rehgulasch (1 kg)', 'Rehschnitzel (500g)'],
                price: 'ab 18€/kg'
              },
              {
                title: 'Wildschwein',
                description: 'Kräftiges, aromatisches Fleisch vom Schwarzwild',
                products: ['Wildschweingulasch (1 kg)', 'Wildschweinschnitzel (500g)', 'Wildschweinhackfleisch (500g)', 'Wildschweinbraten (2-4 kg)'],
                price: 'ab 15€/kg'
              },
              {
                title: 'Federwild',
                description: 'Delikates Geflügel aus freier Wildbahn',
                products: ['Wildente (ganz)', 'Wildgans (ganz)', 'Fasan (ganz)', 'Wildentenbrust (300g)'],
                price: 'ab 25€/kg'
              }
            ].map((product, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem',
                  color: '#2d5a27'
                }}>
                  {product.title}
                </h3>
                <p style={{
                  marginBottom: '1.5rem',
                  color: '#666'
                }}>
                  {product.description}
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  marginBottom: '1.5rem'
                }}>
                  {product.products.map((item, i) => (
                    <li key={i} style={{
                      padding: '0.5rem 0',
                      borderBottom: '1px solid #eee'
                    }}>
                      • {item}
                    </li>
                  ))}
                </ul>
                <div style={{
                  fontSize: '1.3rem',
                  fontWeight: 'bold',
                  color: '#2d5a27'
                }}>
                  {product.price}
                </div>
              </div>
            ))}
          </div>
          <div style={{
            textAlign: 'center',
            backgroundColor: '#e8f5e8',
            padding: '2rem',
            borderRadius: '12px'
          }}>
            <h3 style={{ color: '#2d5a27', marginBottom: '1rem' }}>
              📞 Bestellung & Kontakt
            </h3>
            <p style={{ marginBottom: '1rem' }}>
              Alle Produkte sind frisch und werden nach Bestellung zubereitet.
            </p>
            <p style={{ fontWeight: 'bold', color: '#2d5a27' }}>
              Kontakt: jagd@soliso.de | Abholung nach Vereinbarung
            </p>
          </div>
        </div>
      </section>

      {/* Jagdhunde Section */}
      <section id="jagdhunde" style={{
        padding: '5rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2d5a27'
          }}>
            🐕 Unsere Jagdhunde
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'Deutsche Bracke',
                description: 'Spezialist für Nachsuche und Spurarbeit. Zuverlässiger Partner bei der Nachsuche auf verletztes Wild.',
                eigenschaften: ['Ausgezeichneter Spürsinn', 'Ruhiges Wesen', 'Ausdauernd', 'Führig']
              },
              {
                name: 'Brandlbracke',
                description: 'Vielseitiger Jagdhelfer für alle Wildarten. Besonders geeignet für die Jagd im Gebirge und schwierigem Gelände.',
                eigenschaften: ['Vielseitig einsetzbar', 'Trittsicher', 'Spurlaut', 'Robust']
              },
              {
                name: 'Alpenländische Dachsbracke',
                description: 'Experte für schwieriges Gelände und Nachsuche. Kompakter, wendiger Jagdhund mit ausgezeichneter Nase.',
                eigenschaften: ['Kompakt und wendig', 'Hervorragende Nase', 'Geländegängig', 'Zuverlässig']
              }
            ].map((hund, index) => (
              <div key={index} style={{
                backgroundColor: '#f8f9fa',
                padding: '2rem',
                borderRadius: '12px',
                border: '2px solid #e9ecef',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#2d5a27'
                e.currentTarget.style.backgroundColor = '#f0f8f0'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e9ecef'
                e.currentTarget.style.backgroundColor = '#f8f9fa'
              }}
              >
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem',
                  color: '#2d5a27'
                }}>
                  {hund.name}
                </h3>
                <p style={{
                  marginBottom: '1.5rem',
                  color: '#666'
                }}>
                  {hund.description}
                </p>
                <h4 style={{
                  marginBottom: '1rem',
                  color: '#2d5a27'
                }}>
                  Eigenschaften:
                </h4>
                <ul style={{
                  listStyle: 'none',
                  padding: '0'
                }}>
                  {hund.eigenschaften.map((eigenschaft, i) => (
                    <li key={i} style={{
                      padding: '0.3rem 0',
                      color: '#555'
                    }}>
                      ✓ {eigenschaft}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wildarten Section */}
      <section id="wildarten" style={{
        padding: '5rem 2rem',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2d5a27'
          }}>
            🦆 Wildarten in unserem Revier
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                kategorie: 'Rehwild',
                icon: '🦌',
                beschreibung: 'Hauptwildart unseres Reviers mit gesunden Beständen',
                details: ['Rehböcke', 'Ricken', 'Kitze', 'Ganzjährige Beobachtung']
              },
              {
                kategorie: 'Schwarzwild',
                icon: '🐗',
                beschreibung: 'Wildschweine in verschiedenen Altersklassen',
                details: ['Keiler', 'Bachen', 'Frischlinge', 'Überläufer']
              },
              {
                kategorie: 'Federwild',
                icon: '🦆',
                beschreibung: 'Vielfältige Vogelarten in unserem Revier',
                details: ['Stockenten', 'Wildgänse', 'Fasane', 'Rebhühner']
              },
              {
                kategorie: 'Haarwild',
                icon: '🐰',
                beschreibung: 'Weitere Haarwildarten des Reviers',
                details: ['Feldhasen', 'Kaninchen', 'Dachse', 'Füchse']
              }
            ].map((wildart, index) => (
              <div key={index} style={{
                backgroundColor: 'white',
                padding: '2rem',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                textAlign: 'center',
                transition: 'transform 0.3s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <div style={{
                  fontSize: '4rem',
                  marginBottom: '1rem'
                }}>
                  {wildart.icon}
                </div>
                <h3 style={{
                  fontSize: '1.8rem',
                  marginBottom: '1rem',
                  color: '#2d5a27'
                }}>
                  {wildart.kategorie}
                </h3>
                <p style={{
                  marginBottom: '1.5rem',
                  color: '#666'
                }}>
                  {wildart.beschreibung}
                </p>
                <ul style={{
                  listStyle: 'none',
                  padding: '0'
                }}>
                  {wildart.details.map((detail, i) => (
                    <li key={i} style={{
                      padding: '0.3rem 0',
                      color: '#555'
                    }}>
                      • {detail}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prädatoren Section */}
      <section id="praedatoren" style={{
        padding: '5rem 2rem',
        backgroundColor: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '3rem',
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#2d5a27'
          }}>
            🛡️ Prädatorenmanagement
          </h2>
          <div style={{
            marginBottom: '3rem',
            textAlign: 'center',
            backgroundColor: '#fff3cd',
            padding: '2rem',
            borderRadius: '12px',
            border: '1px solid #ffeaa7'
          }}>
            <h3 style={{ color: '#856404', marginBottom: '1rem' }}>
              Professionelles Wildtiermanagement
            </h3>
            <p style={{ color: '#856404' }}>
              Zum Schutz der heimischen Wildbestände führen wir ein verantwortungsvolles 
              Prädatorenmanagement durch, das auf wissenschaftlichen Erkenntnissen basiert.
            </p>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              {
                name: 'Fuchs',
                icon: '🦊',
                management: 'Regulierung zum Schutz des Niederwildes und der Bodenbrüter',
                methoden: ['Ansitzjagd', 'Fallenjagd', 'Baujagd']
              },
              {
                name: 'Dachs',
                icon: '🦡',
                management: 'Bestandskontrolle und Habitatmanagement',
                methoden: ['Ansitzjagd', 'Baujagd', 'Monitoring']
              },
              {
                name: 'Marder',
                icon: '🦫',
                management: 'Schutz der Bodenbrüter und Niederwildbestände',
                methoden: ['Fallenjagd', 'Lebendfallen', 'Monitoring']
              },
              {
                name: 'Waschbär',
                icon: '🦝',
                management: 'Management invasiver Arten zum Ökosystemschutz',
                methoden: ['Fallenjagd', 'Ansitzjagd', 'Bestandserfassung']
              },
              {
                name: 'Nutria',
                icon: '🦫',
                management: 'Kontrolle invasiver Arten an Gewässern',
                methoden: ['Fallenjagd', 'Ansitzjagd', 'Habitatmanagement']
              }
            ].map((praedator, index) => (
              <div key={index} style={{
                backgroundColor: '#f8f9fa',
                padding: '1.5rem',
                borderRadius: '12px',
                border: '1px solid #e9ecef'
              }}>
                <div style={{
                  textAlign: 'center',
                  fontSize: '3rem',
                  marginBottom: '1rem'
                }}>
                  {praedator.icon}
                </div>
                <h3 style={{
                  fontSize: '1.5rem',
                  marginBottom: '1rem',
                  color: '#2d5a27',
                  textAlign: 'center'
                }}>
                  {praedator.name}
                </h3>
                <p style={{
                  marginBottom: '1rem',
                  color: '#666',
                  fontSize: '0.9rem'
                }}>
                  {praedator.management}
                </p>
                <div>
                  <strong style={{ color: '#2d5a27', fontSize: '0.9rem' }}>Methoden:</strong>
                  <ul style={{
                    listStyle: 'none',
                    padding: '0',
                    marginTop: '0.5rem'
                  }}>
                    {praedator.methoden.map((methode, i) => (
                      <li key={i} style={{
                        padding: '0.2rem 0',
                        color: '#555',
                        fontSize: '0.85rem'
                      }}>
                        • {methode}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Kontakt Section */}
      <section id="kontakt" style={{
        padding: '5rem 2rem',
        backgroundColor: '#2d5a27',
        color: 'white'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '3rem',
            marginBottom: '3rem'
          }}>
            📞 Kontakt & Information
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '3rem',
            marginBottom: '3rem'
          }}>
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>
                🦌 Jagdrevier Weetzen
              </h3>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Größe:</strong> 340 Hektar
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Lage:</strong> Niedersachsen, Deutschland
              </p>
              <p>
                <strong>Typ:</strong> Wald- und Feldlandschaft
              </p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>
                📧 Kontakt
              </h3>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>E-Mail:</strong> jagd@soliso.de
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                <strong>Wildfleisch:</strong> Nach Vereinbarung
              </p>
              <p>
                <strong>Abholung:</strong> Vor Ort möglich
              </p>
            </div>
            <div>
              <h3 style={{ marginBottom: '1rem', fontSize: '1.8rem' }}>
                🌿 Unsere Mission
              </h3>
              <p style={{ marginBottom: '0.5rem' }}>
                Nachhaltige Jagdpraxis
              </p>
              <p style={{ marginBottom: '0.5rem' }}>
                Wildtiermanagement
              </p>
              <p>
                Naturschutz & Arterhaltung
              </p>
            </div>
          </div>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '2rem',
            borderRadius: '12px'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>
              ✅ Website erfolgreich geladen
            </h3>
            <p style={{ opacity: '0.8' }}>
              <strong>Status:</strong> Professionelle Jagdrevier-Website aktiv | 
              <strong>Datum:</strong> {new Date().toLocaleString('de-DE')} | 
              <strong>Bereit für:</strong> Alfahosting Upload
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        backgroundColor: '#1a3d1a',
        color: 'white',
        padding: '2rem',
        textAlign: 'center'
      }}>
        <p style={{ margin: '0', opacity: '0.8' }}>
          &copy; 2024 Jagdrevier Weetzen - Nachhaltige Jagd in Niedersachsen
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
    root.render(<JagdrevierWeetzenApp />)
    console.log('✅ Professionelle Jagdrevier Weetzen Website geladen')
  } catch (error) {
    console.error('❌ Fehler beim Laden:', error)
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
