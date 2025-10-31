import { createRoot } from 'react-dom/client'
import App from './App-simple.tsx'
// import './index.css' // Temporär deaktiviert für Test

console.log('🦌 Jagdrevier Weetzen - main.tsx wird geladen...');

// Einfache, direkte Initialisierung
const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('❌ Root-Element nicht gefunden!');
  document.body.innerHTML = `
    <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
      <h1 style="color: #dc3545;">❌ Fehler</h1>
      <p>Root-Element nicht gefunden.</p>
      <a href="/fallback.html" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Fallback-Version</a>
    </div>
  `;
} else {
  console.log('✅ Root-Element gefunden, starte React-App...');
  
  try {
    const root = createRoot(rootElement);
    root.render(<App />);
    console.log('✅ React-App erfolgreich gestartet!');
  } catch (error) {
    console.error('❌ Fehler beim Starten der React-App:', error);
    rootElement.innerHTML = `
      <div style="padding: 40px; text-align: center; font-family: Arial, sans-serif;">
        <h1 style="color: #dc3545;">❌ React-Fehler</h1>
        <p>Die React-App konnte nicht gestartet werden.</p>
        <p style="color: #666; font-size: 0.9em;">${error.message}</p>
        <div style="margin-top: 20px;">
          <a href="/fallback.html" style="background: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px;">Fallback-Version</a>
          <a href="/diagnose.html" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin: 0 5px;">Diagnose</a>
        </div>
      </div>
    `;
  }
}