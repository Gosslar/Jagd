import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-green-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Jagdrevier Waldfrieden</h3>
            <p className="text-green-200 text-sm">
              Nachhaltige Jagd in naturbelassener Landschaft. 
              Tradition und Respekt vor der Natur seit über 50 Jahren.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Schnelllinks</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' })} className="text-green-200 hover:text-white transition-colors">Start</button></li>
              <li><button onClick={() => document.getElementById('revier')?.scrollIntoView({ behavior: 'smooth' })} className="text-green-200 hover:text-white transition-colors">Revier</button></li>
              <li><button onClick={() => document.getElementById('wildarten')?.scrollIntoView({ behavior: 'smooth' })} className="text-green-200 hover:text-white transition-colors">Wildarten</button></li>
              <li><button onClick={() => document.getElementById('news')?.scrollIntoView({ behavior: 'smooth' })} className="text-green-200 hover:text-white transition-colors">Aktuelles</button></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-2 text-sm text-green-200">
              <li>Waldstraße 123</li>
              <li>12345 Waldfrieden</li>
              <li>Tel: +49 (0) 123 456 789</li>
              <li>info@jagdrevier-waldfrieden.de</li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Rechtliches</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Impressum</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">Datenschutz</a></li>
              <li><a href="#" className="text-green-200 hover:text-white transition-colors">AGB</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-200">
          <p>&copy; 2024 Jagdrevier Waldfrieden. Alle Rechte vorbehalten.</p>
        </div>
      </div>
    </footer>
  );
};