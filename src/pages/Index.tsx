import React from 'react';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { JagdrevierInfobox } from '@/components/JagdrevierInfobox';
import { RevierInfo } from '@/components/RevierInfo';
import { Wildarten } from '@/components/Wildarten';
import { Praedatorenmanagement } from '@/components/Praedatorenmanagement';
import { Jagdhunde } from '@/components/Jagdhunde';
import { Rehkitzrettung } from '@/components/Rehkitzrettung';
import { ProfessionalWildfleischShop } from '@/components/ProfessionalWildfleischShop';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { News } from '@/components/News';
import { ShopVerwaltung } from '@/components/ShopVerwaltung';
import { ShopBestellVerwaltung } from '@/components/ShopBestellVerwaltung';
import { BenutzerVerwaltung } from '@/components/BenutzerVerwaltung';
import { ErweiterteBenutzerverwaltung } from '@/components/ErweiterteBenutzerverwaltung';
import { BlogVerwaltungSimple } from '@/components/BlogVerwaltungSimple';
import { KontaktVerwaltung } from '@/components/KontaktVerwaltung';
import { VeranstaltungsVerwaltung } from '@/components/VeranstaltungsVerwaltung';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  console.log('🚀 NOTFALL-VERSION - Keine Auth, alle Bereiche sichtbar');

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-400">
      <Navigation />
      <Hero />
      <JagdrevierInfobox />
      <RevierInfo />
      <News />
      <Wildarten />
      <Praedatorenmanagement />
      <Jagdhunde />
      <Rehkitzrettung />
      <ProfessionalWildfleischShop />
      <Contact />
      
      {/* NOTFALL: Alle Admin-Bereiche IMMER sichtbar */}
      <div className="bg-red-100 p-4 m-4 rounded-lg border-2 border-red-500">
        <p className="text-center font-bold text-red-800">
          🚨 NOTFALL-MODUS: Alle Admin-Bereiche sind ohne Anmeldung sichtbar!
        </p>
        <p className="text-center text-red-700 mt-2">
          Auth-System wird repariert - verwenden Sie die Funktionen zum Testen
        </p>
      </div>
      
      <ShopVerwaltung />
      <ShopBestellVerwaltung />
      <VeranstaltungsVerwaltung />
      <BlogVerwaltungSimple />
      <KontaktVerwaltung />
      <BenutzerVerwaltung />
      <ErweiterteBenutzerverwaltung />

      {/* Footer */}
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;