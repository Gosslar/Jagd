import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Robuste React-App Initialisierung
function initializeApp() {
  console.log('🦌 Jagdrevier Weetzen - Initialisiere React-App...');
  
  // Warte bis DOM geladen ist
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
    return;
  }
  
  // Suche Root-Element
  let rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('❌ Root-Element nicht gefunden! Erstelle neues Root-Element...');
    
    // Erstelle Root-Element falls es nicht existiert
    rootElement = document.createElement('div');
    rootElement.id = 'root';
    document.body.appendChild(rootElement);
    
    console.log('✅ Root-Element erstellt');
  } else {
    console.log('✅ Root-Element gefunden');
  }
  
  // Entferne Lade-Indikator falls vorhanden
  const loadingIndicator = document.getElementById('loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.remove();
    console.log('✅ Lade-Indikator entfernt');
  }
  
  try {
    // Erstelle React-Root und rendere App
    const root = createRoot(rootElement);
    root.render(<App />);
    
    console.log('✅ React-App erfolgreich gestartet!');
    
    // Benachrichtige Parent-Window falls in iframe
    if (window.parent !== window) {
      window.parent.postMessage({ type: 'REACT_APP_LOADED' }, '*');
    }
    
  } catch (error: any) {
    console.error('❌ Fehler beim Starten der React-App:', error);
    
    // Fallback: Zeige Fehlermeldung
    rootElement.innerHTML = `
      <div style="
        padding: 40px;
        text-align: center;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background: #f8f9fa;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
      ">
        <h1 style="color: #dc3545; margin-bottom: 20px;">⚠️ Fehler beim Laden</h1>
        <p style="color: #666; margin-bottom: 30px;">Die React-Anwendung konnte nicht gestartet werden.</p>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-bottom: 20px;">
          <strong>Fehlerdetails:</strong><br>
          <code style="color: #dc3545;">${error.message}</code>
        </div>
        <div>
          <a href="/diagnose.html" style="
            background: #007bff;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 10px;
          ">🔍 Diagnose ausführen</a>
          <a href="/fallback.html" style="
            background: #28a745;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 10px;
          ">🏠 Fallback-Version</a>
          <a href="javascript:location.reload()" style="
            background: #6c757d;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 5px;
            margin: 0 10px;
          ">🔄 Neu laden</a>
        </div>
      </div>
    `;
  }
}

// Starte Initialisierung
initializeApp();
