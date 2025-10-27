import React from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthDialog } from './AuthDialog';
import { LogOut, User } from 'lucide-react';
const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
};
export const Navigation: React.FC = () => {
  const {
    user,
    signOut
  } = useAuth();

  // Debug: Benutzer-Status loggen
  console.log('Navigation - User:', user ? user.email : 'Nicht angemeldet');
  return <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Jagd Weetzen</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={() => scrollToSection('home')} className="hover:text-green-200 transition-colors">Start</button>
            <button onClick={() => scrollToSection('revier')} className="hover:text-green-200 transition-colors">Revier</button>
            <button onClick={() => scrollToSection('wildarten')} className="hover:text-green-200 transition-colors">Wildarten</button>
            <button onClick={() => scrollToSection('praedatorenmanagement')} className="hover:text-green-200 transition-colors">Prädatoren</button>
            <button onClick={() => scrollToSection('rehkitzrettung')} className="hover:text-green-200 transition-colors">Rehkitzrettung</button>
            <button onClick={() => scrollToSection('wildfleisch-shop')} className="bg-green-600 border-2 border-yellow-400 px-3 py-1 rounded-full font-bold hover:bg-green-500 transition-colors">Wildfleisch Shop</button>
            <button onClick={() => scrollToSection('news')} className="hover:text-green-200 transition-colors">Aktuelles</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-green-200 transition-colors">Kontakt</button>
            {user ? <div className="flex items-center space-x-2">
                <span className="text-sm flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {user.email}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={signOut} 
                  className="text-white border-white hover:bg-white hover:text-green-800 bg-transparent"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Abmelden
                </Button>
              </div> : <AuthDialog />}
          </div>
        </div>
      </div>
    </nav>;
};