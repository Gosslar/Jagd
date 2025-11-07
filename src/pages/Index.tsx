import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

// Einfache Bestellverwaltung ohne Auth-Hooks
const EinfacheBestellVerwaltung = () => {
  const [bestellungen, setBestellungen] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBestellung, setSelectedBestellung] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    loadBestellungen();
  }, []);

  const loadBestellungen = async () => {
    try {
      console.log('📦 Lade Bestellungen...');
      const { data, error } = await supabase
        .from('simple_bestellungen_2025_11_06_21_00')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Fehler beim Laden:', error);
      } else {
        console.log('✅ Bestellungen geladen:', data?.length);
        setBestellungen(data || []);
      }
    } catch (error) {
      console.error('❌ Unerwarteter Fehler:', error);
    } finally {
      setLoading(false);
    }
  };

  const openPopup = (bestellung) => {
    setSelectedBestellung(bestellung);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setSelectedBestellung(null);
  };

  const generateLieferschein = () => {
    if (!selectedBestellung) return;
    
    // Einfache PDF-Generierung (Platzhalter)
    console.log('📄 Generiere Lieferschein für:', selectedBestellung.bestellnummer);
    alert(`Lieferschein für Bestellung ${selectedBestellung.bestellnummer} wird generiert!\n\nDies ist ein Platzhalter - die echte PDF-Funktion wird implementiert.`);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>📦 Lade Bestellungen...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ color: '#166534', marginBottom: '20px' }}>
        📦 Einfache Bestellverwaltung
      </h2>
      
      <div style={{ 
        backgroundColor: '#dcfce7', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <p style={{ color: '#166534', margin: '0' }}>
          ✅ {bestellungen.length} Bestellungen gefunden - Ohne Auth-System!
        </p>
      </div>

      <div style={{ 
        border: '1px solid #d1d5db', 
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          backgroundColor: '#f9fafb', 
          padding: '15px',
          borderBottom: '1px solid #d1d5db',
          fontWeight: 'bold'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: '15px' }}>
            <span>Bestellnummer</span>
            <span>Kunde</span>
            <span>Datum</span>
            <span>Aktionen</span>
          </div>
        </div>
        
        {bestellungen.map((bestellung, index) => (
          <div key={bestellung.id} style={{ 
            padding: '15px',
            borderBottom: index < bestellungen.length - 1 ? '1px solid #e5e7eb' : 'none',
            backgroundColor: index % 2 === 0 ? 'white' : '#f9fafb'
          }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 100px', gap: '15px', alignItems: 'center' }}>
              <span>{bestellung.bestellnummer || 'N/A'}</span>
              <span>{bestellung.kunde_name || 'N/A'}</span>
              <span>{bestellung.created_at ? new Date(bestellung.created_at).toLocaleDateString('de-DE') : 'N/A'}</span>
              <button
                onClick={() => openPopup(bestellung)}
                style={{
                  backgroundColor: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '8px 12px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                👁️ Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Einfaches Popup */}
      {showPopup && selectedBestellung && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          right: '0',
          bottom: '0',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '30px',
            borderRadius: '10px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <h3 style={{ color: '#166534', marginTop: '0' }}>
              📋 Bestelldetails
            </h3>
            
            <div style={{ marginBottom: '20px' }}>
              <p><strong>Bestellnummer:</strong> {selectedBestellung.bestellnummer}</p>
              <p><strong>Kunde:</strong> {selectedBestellung.kunde_name}</p>
              <p><strong>E-Mail:</strong> {selectedBestellung.kunde_email}</p>
              <p><strong>Datum:</strong> {new Date(selectedBestellung.created_at).toLocaleDateString('de-DE')}</p>
              <p><strong>Gesamtpreis:</strong> {selectedBestellung.gesamtpreis}€</p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={generateLieferschein}
                style={{
                  backgroundColor: '#f59e0b',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                📄 Lieferschein (ohne Preise)
              </button>
              
              <button
                onClick={closePopup}
                style={{
                  backgroundColor: '#6b7280',
                  color: 'white',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '5px',
                  cursor: 'pointer'
                }}
              >
                ❌ Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Index = () => {
  console.log('🚀 SCHRITT 3 - Einfache Bestellverwaltung ohne Auth-Hooks');

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
            ✅ SCHRITT 3: Einfache Bestellverwaltung
          </h2>
          <p style={{ color: '#166534', margin: '0' }}>
            Neue einfache Bestellverwaltung ohne Auth-Hooks!
            Direkte Supabase-Verbindung, Popup mit Lieferschein-Button.
          </p>
        </div>

        {/* Einfache Bestellverwaltung */}
        <EinfacheBestellVerwaltung />
      </div>
    </div>
  );
};

export default Index;