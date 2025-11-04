import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthProvider';
import { AuthDialog } from './AuthDialog';
import { LogOut, User, Menu, X } from 'lucide-react';

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth'
    });
  }
};

export const Navigation: React.FC = () => {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Debug: Benutzer-Status loggen
  console.log('Navigation - User:', user ? user.email : 'Nicht angemeldet');

  const handleMenuClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setMobileMenuOpen(false); // Schließe Mobile-Menü nach Klick
  };

  const menuItems = [
    { id: 'home', label: 'Start' },
    { id: 'revier', label: 'Revier' },
    { id: 'wildarten', label: 'Wildarten' },
    { id: 'praedatorenmanagement', label: 'Prädatoren' },
    { id: 'jagdhunde', label: 'Jagdhunde' },
    { id: 'rehkitzrettung', label: 'Rehkitzrettung' },
    { id: 'wildfleisch-shop', label: 'Wildfleisch Shop', special: true },
    { id: 'news', label: 'Aktuelles' },
    { id: 'contact', label: 'Kontakt' }
  ];

  return (
    <nav className="bg-green-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <h1 className="text-xl font-bold">Jagd Weetzen</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-4">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={
                  item.special
                    ? "bg-green-600 border-2 border-yellow-400 px-3 py-1 rounded-full font-bold hover:bg-green-500 transition-colors"
                    : "hover:text-green-200 transition-colors"
                }
              >
                {item.label}
              </button>
            ))}
            
            {/* Auth Section */}
            {user ? (
              <div className="flex items-center space-x-2">
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
              </div>
            ) : (
              <AuthDialog />
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-green-200 focus:outline-none focus:text-green-200"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-green-800 border-t border-green-700">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuClick(item.id)}
                  className={
                    item.special
                      ? "block w-full text-left px-3 py-2 bg-green-600 border-2 border-yellow-400 rounded-lg font-bold hover:bg-green-500 transition-colors"
                      : "block w-full text-left px-3 py-2 hover:bg-green-700 hover:text-green-200 transition-colors rounded-md"
                  }
                >
                  {item.label}
                </button>
              ))}
              
              {/* Mobile Auth Section */}
              <div className="border-t border-green-700 pt-3 mt-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-3 py-2 text-sm flex items-center gap-2">
                      <User className="h-4 w-4" />
                      {user.email}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-white border-white hover:bg-white hover:text-green-800 bg-transparent"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Abmelden
                    </Button>
                  </div>
                ) : (
                  <div className="px-3">
                    <AuthDialog />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};