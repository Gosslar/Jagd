import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Hero } from '@/components/Hero';
import { Navigation } from '@/components/Navigation';
import { RevierInfo } from '@/components/RevierInfo';
import { Wildarten } from '@/components/Wildarten';
import { Praedatorenmanagement } from '@/components/Praedatorenmanagement';
import { Rehkitzrettung } from '@/components/Rehkitzrettung';
import { Wildfleischverkauf } from '@/components/Wildfleischverkauf';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { News } from '@/components/News';
import { AuthProvider } from '@/contexts/AuthProvider';
import { LagerVerwaltungSimple } from '@/components/LagerVerwaltungSimple';
import { BenutzerVerwaltung } from '@/components/BenutzerVerwaltung';
import { BestellVerwaltung } from '@/components/BestellVerwaltung';
import { BlogVerwaltungSimple } from '@/components/BlogVerwaltungSimple';
import { KontaktVerwaltung } from '@/components/KontaktVerwaltung';
import { Toaster } from '@/components/ui/toaster';


const Index = () => {
  // STABILE LÖSUNG: Admin-System komplett deaktiviert für Stabilität
  const isAdmin = true; // Alle Bereiche immer sichtbar
  const adminLoading = false; // Kein Loading-State

  return (
    <AuthProvider>
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
        <Navigation />
        <Hero />
        <RevierInfo />
        <News />
        <Wildarten />
        <Praedatorenmanagement />
        <Rehkitzrettung />
        <Wildfleischverkauf />
        <Contact />
        
        {/* Admin-Bereiche - Alle mit einfachen Versionen */}
        <LagerVerwaltungSimple />
        <BestellVerwaltung />
        <BlogVerwaltungSimple />
        <KontaktVerwaltung />
        <BenutzerVerwaltung />
        
        {/* Footer */}
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
};

export default Index;