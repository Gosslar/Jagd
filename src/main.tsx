import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'

const JagdrevierWeetzenProfessional = () => {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      lineHeight: '1.6',
      color: '#333',
      margin: '0',
      padding: '0'
    }}>
      {/* Fixed Navigation */}
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
          <div style={{ 
            display: 'flex', 
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            <a href="#home" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Home</a>
            <a href="#wildfleisch" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Wildfleisch</a>
            <a href="#jagdhunde" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Jagdhunde</a>
            <a href="#wildarten" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Wildarten</a>
            <a href="#kontakt" style={{ color: 'white', textDecoration: 'none', padding: '0.5rem' }}>Kontakt</a>
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
        paddingTop: '80px'
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
          <div style={{
            backgroundColor: '#90EE90',
            color: '#2d5a27',
            display: 'inline-block',
            padding: '1rem 2rem',
            fontSize: '1.2rem',
            borderRadius: '50px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            cursor: 'pointer'
          }}>
            🥩 Wildfleisch aus nachhaltiger Jagd
          </div>
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
            {/* Rehfleisch */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                🦌 Rehfleisch
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Zartes, mageres Fleisch aus nachhaltiger Jagd
              </p>
              <ul style={{
                listStyle: 'none',
                padding: '0',
                marginBottom: '1.5rem'
              }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Rehkeule (2-3 kg)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Rehrücken (1-2 kg)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Rehgulasch (1 kg)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Rehschnitzel (500g)</li>
              </ul>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#2d5a27'
              }}>
                ab 18€/kg
              </div>
            </div>

            {/* Wildschwein */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                🐗 Wildschwein
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Kräftiges, aromatisches Fleisch vom Schwarzwild
              </p>
              <ul style={{
                listStyle: 'none',
                padding: '0',
                marginBottom: '1.5rem'
              }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Wildschweingulasch (1 kg)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Wildschweinschnitzel (500g)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Wildschweinhackfleisch (500g)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Wildschweinbraten (2-4 kg)</li>
              </ul>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#2d5a27'
              }}>
                ab 15€/kg
              </div>
            </div>

            {/* Federwild */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                🦆 Federwild
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Delikates Geflügel aus freier Wildbahn
              </p>
              <ul style={{
                listStyle: 'none',
                padding: '0',
                marginBottom: '1.5rem'
              }}>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Wildente (ganz)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Wildgans (ganz)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Fasan (ganz)</li>
                <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>• Wildentenbrust (300g)</li>
              </ul>
              <div style={{
                fontSize: '1.3rem',
                fontWeight: 'bold',
                color: '#2d5a27'
              }}>
                ab 25€/kg
              </div>
            </div>
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
            {/* Deutsche Bracke */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                🐕 Deutsche Bracke
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Spezialist für Nachsuche und Spurarbeit. Zuverlässiger Partner bei der Nachsuche auf verletztes Wild.
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
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Ausgezeichneter Spürsinn</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Ruhiges Wesen</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Ausdauernd</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Führig</li>
              </ul>
            </div>

            {/* Brandlbracke */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                🐕 Brandlbracke
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Vielseitiger Jagdhelfer für alle Wildarten. Besonders geeignet für die Jagd im Gebirge und schwierigem Gelände.
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
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Vielseitig einsetzbar</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Trittsicher</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Spurlaut</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Robust</li>
              </ul>
            </div>

            {/* Alpenländische Dachsbracke */}
            <div style={{
              backgroundColor: '#f8f9fa',
              padding: '2rem',
              borderRadius: '12px',
              border: '2px solid #e9ecef'
            }}>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                🐕 Alpenländische Dachsbracke
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Experte für schwieriges Gelände und Nachsuche. Kompakter, wendiger Jagdhund mit ausgezeichneter Nase.
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
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Kompakt und wendig</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Hervorragende Nase</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Geländegängig</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>✓ Zuverlässig</li>
              </ul>
            </div>
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
            {/* Rehwild */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                🦌
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                Rehwild
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Hauptwildart unseres Reviers mit gesunden Beständen
              </p>
              <ul style={{
                listStyle: 'none',
                padding: '0'
              }}>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Rehböcke</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Ricken</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Kitze</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Ganzjährige Beobachtung</li>
              </ul>
            </div>

            {/* Schwarzwild */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                🐗
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                Schwarzwild
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Wildschweine in verschiedenen Altersklassen
              </p>
              <ul style={{
                listStyle: 'none',
                padding: '0'
              }}>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Keiler</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Bachen</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Frischlinge</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Überläufer</li>
              </ul>
            </div>

            {/* Federwild */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                🦆
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                Federwild
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Vielfältige Vogelarten in unserem Revier
              </p>
              <ul style={{
                listStyle: 'none',
                padding: '0'
              }}>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Stockenten</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Wildgänse</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Fasane</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Rebhühner</li>
              </ul>
            </div>

            {/* Haarwild */}
            <div style={{
              backgroundColor: 'white',
              padding: '2rem',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '4rem',
                marginBottom: '1rem'
              }}>
                🐰
              </div>
              <h3 style={{
                fontSize: '1.8rem',
                marginBottom: '1rem',
                color: '#2d5a27'
              }}>
                Haarwild
              </h3>
              <p style={{
                marginBottom: '1.5rem',
                color: '#666'
              }}>
                Weitere Haarwildarten des Reviers
              </p>
              <ul style={{
                listStyle: 'none',
                padding: '0'
              }}>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Feldhasen</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Kaninchen</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Dachse</li>
                <li style={{ padding: '0.3rem 0', color: '#555' }}>• Füchse</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Prädatorenmanagement Section */}
      <section style={{
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
            {/* Fuchs */}
            <div style={{
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
                🦊
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#2d5a27',
                textAlign: 'center'
              }}>
                Fuchs
              </h3>
              <p style={{
                marginBottom: '1rem',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                Regulierung zum Schutz des Niederwildes und der Bodenbrüter
              </p>
              <div>
                <strong style={{ color: '#2d5a27', fontSize: '0.9rem' }}>Methoden:</strong>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  marginTop: '0.5rem'
                }}>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Ansitzjagd</li>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Fallenjagd</li>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Baujagd</li>
                </ul>
              </div>
            </div>

            {/* Dachs */}
            <div style={{
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
                🦡
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#2d5a27',
                textAlign: 'center'
              }}>
                Dachs
              </h3>
              <p style={{
                marginBottom: '1rem',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                Bestandskontrolle und Habitatmanagement
              </p>
              <div>
                <strong style={{ color: '#2d5a27', fontSize: '0.9rem' }}>Methoden:</strong>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  marginTop: '0.5rem'
                }}>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Ansitzjagd</li>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Baujagd</li>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Monitoring</li>
                </ul>
              </div>
            </div>

            {/* Marder */}
            <div style={{
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
                🦫
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                marginBottom: '1rem',
                color: '#2d5a27',
                textAlign: 'center'
              }}>
                Marder
              </h3>
              <p style={{
                marginBottom: '1rem',
                color: '#666',
                fontSize: '0.9rem'
              }}>
                Schutz der Bodenbrüter und Niederwildbestände
              </p>
              <div>
                <strong style={{ color: '#2d5a27', fontSize: '0.9rem' }}>Methoden:</strong>
                <ul style={{
                  listStyle: 'none',
                  padding: '0',
                  marginTop: '0.5rem'
                }}>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Fallenjagd</li>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Lebendfallen</li>
                  <li style={{ padding: '0.2rem 0', color: '#555', fontSize: '0.85rem' }}>• Monitoring</li>
                </ul>
              </div>
            </div>
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
              ✅ Professionelle Jagdrevier-Website
            </h3>
            <p style={{ opacity: '0.8' }}>
              <strong>Status:</strong> Vollständig geladen | 
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
    root.render(<JagdrevierWeetzenProfessional />)
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
