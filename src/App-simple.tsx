import React from 'react';

// Einfache Test-App
function App() {
  console.log('🦌 App-Komponente wird gerendert...');
  
  return (
    <div style={{
      padding: '40px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      background: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: '#2c5530', marginBottom: '20px' }}>
        🦌 Jagdrevier Weetzen
      </h1>
      <p style={{ color: '#666', marginBottom: '30px' }}>
        Website wird geladen...
      </p>
      
      <div style={{
        background: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        <h2 style={{ color: '#4a7c59', marginBottom: '15px' }}>
          ✅ React-App erfolgreich geladen!
        </h2>
        <p>
          Die grundlegende React-Anwendung funktioniert. 
          Die vollständige Website wird in Kürze verfügbar sein.
        </p>
        
        <div style={{ marginTop: '20px' }}>
          <a 
            href="/fallback.html" 
            style={{
              background: '#28a745',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '0 5px'
            }}
          >
            🏠 Vollständige Website
          </a>
          <a 
            href="/diagnose.html" 
            style={{
              background: '#007bff',
              color: 'white',
              padding: '10px 20px',
              textDecoration: 'none',
              borderRadius: '5px',
              margin: '0 5px'
            }}
          >
            🔍 Diagnose
          </a>
        </div>
      </div>
      
      <div style={{
        marginTop: '30px',
        padding: '15px',
        background: '#d1ecf1',
        borderRadius: '5px',
        border: '1px solid #bee5eb'
      }}>
        <h3 style={{ color: '#0c5460', marginBottom: '10px' }}>
          🔧 Technische Informationen
        </h3>
        <p style={{ color: '#0c5460', fontSize: '0.9em' }}>
          React-Version: {React.version}<br/>
          Geladen um: {new Date().toLocaleTimeString()}<br/>
          User Agent: {navigator.userAgent.substring(0, 50)}...
        </p>
      </div>
    </div>
  );
}

export default App;