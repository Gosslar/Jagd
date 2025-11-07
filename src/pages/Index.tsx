import React from 'react';
import { ShopBestellVerwaltung } from '@/components/ShopBestellVerwaltung';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  console.log('🚀 SCHRITT 2 - Bestellverwaltung ohne Auth hinzufügen');

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(to bottom right, #bbf7d0, #4ade80)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ 
        maxWidth: '1200px', 
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
          🦌 Jagd Weetzen - Bestellverwaltung
        </h1>
        
        <div style={{ 
          backgroundColor: '#dcfce7', 
          padding: '20px', 
          borderRadius: '8px',
          border: '2px solid #16a34a',
          marginBottom: '30px'
        }}>
          <h2 style={{ color: '#166534', margin: '0 0 10px 0' }}>
            ✅ SCHRITT 2: Bestellverwaltung hinzugefügt
          </h2>
          <p style={{ color: '#166534', margin: '0' }}>
            Bestellverwaltung ist jetzt verfügbar - OHNE Auth-System!
            Alle Funktionen sollten arbeiten: Bestellliste, Popup, Lieferschein-PDF.
          </p>
        </div>

        {/* Bestellverwaltung ohne Auth-Checks */}
        <div style={{ marginTop: '40px' }}>
          <ShopBestellVerwaltung />
        </div>
      </div>
      
      <Toaster />
    </div>
  );
};

export default Index;