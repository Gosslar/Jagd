import React from 'react';

const Index = () => {
  console.log('🚀 MINIMAL VERSION - Nur Text, keine komplexen Komponenten');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #bbf7d0, #4ade80)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '800px', 
        margin: '0 auto', 
        backgroundColor: 'white', 
        padding: '40px', 
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
      }}>
        <h1 style={{ 
          color: '#166534', 
          textAlign: 'center', 
          marginBottom: '30px',
          fontSize: '2.5rem'
        }}>
          🦌 Jagd Weetzen
        </h1>
        
        <div style={{ 
          backgroundColor: '#fef3c7', 
          padding: '20px', 
          borderRadius: '8px',
          border: '2px solid #f59e0b',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#92400e', margin: '0 0 10px 0' }}>
            🔧 MINIMAL-TEST-VERSION
          </h2>
          <p style={{ color: '#92400e', margin: '0' }}>
            Diese einfache Version testet, ob JavaScript grundsätzlich funktioniert.
            Wenn Sie diesen Text sehen, lädt die Website korrekt.
          </p>
        </div>

        <div style={{ 
          backgroundColor: '#dcfce7', 
          padding: '20px', 
          borderRadius: '8px',
          border: '2px solid #16a34a',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#166534', margin: '0 0 15px 0' }}>
            ✅ Website-Status
          </h3>
          <ul style={{ color: '#166534', margin: '0', paddingLeft: '20px' }}>
            <li>JavaScript lädt korrekt</li>
            <li>React funktioniert</li>
            <li>Styling wird angezeigt</li>
            <li>Keine weißen Seiten mehr</li>
          </ul>
        </div>

        <div style={{ 
          backgroundColor: '#fef2f2', 
          padding: '20px', 
          borderRadius: '8px',
          border: '2px solid #dc2626',
          marginBottom: '30px'
        }}>
          <h3 style={{ color: '#dc2626', margin: '0 0 15px 0' }}>
            🚨 Nächste Schritte
          </h3>
          <p style={{ color: '#dc2626', margin: '0' }}>
            Wenn diese Seite korrekt lädt, können wir schrittweise die Komponenten hinzufügen.
            Das Auth-System war das Problem - wir bauen es neu auf.
          </p>
        </div>

        <div style={{ 
          textAlign: 'center',
          padding: '20px',
          backgroundColor: '#f3f4f6',
          borderRadius: '8px'
        }}>
          <p style={{ 
            color: '#374151', 
            fontSize: '1.1rem',
            margin: '0 0 10px 0'
          }}>
            🎯 <strong>Test erfolgreich!</strong>
          </p>
          <p style={{ 
            color: '#6b7280', 
            margin: '0'
          }}>
            Die Website lädt jetzt ohne Fehler. Wir können die Funktionen schrittweise hinzufügen.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;