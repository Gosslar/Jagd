import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Hero } from '@/components/Hero';
import { Navigation } from '@/components/Navigation';
import { RevierInfo } from '@/components/RevierInfo';
import { JagdrevierInfobox } from '@/components/JagdrevierInfobox';
import { Wildarten } from '@/components/Wildarten';
import { Praedatorenmanagement } from '@/components/Praedatorenmanagement';
import { Jagdhunde } from '@/components/Jagdhunde';
import { Rehkitzrettung } from '@/components/Rehkitzrettung';
import { ProfessionalWildfleischShop } from '@/components/ProfessionalWildfleischShop';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { News } from '@/components/News';
import { AuthProvider, useAuth } from '@/contexts/AuthProvider';
import { ShopVerwaltung } from '@/components/ShopVerwaltung';
import { ShopBestellVerwaltung } from '@/components/ShopBestellVerwaltung';
import { BenutzerVerwaltung } from '@/components/BenutzerVerwaltung';
import { ErweiterteBenutzerverwaltung } from '@/components/ErweiterteBenutzerverwaltung';

import { BlogVerwaltungSimple } from '@/components/BlogVerwaltungSimple';
import { KontaktVerwaltung } from '@/components/KontaktVerwaltung';
import { VeranstaltungsVerwaltung } from '@/components/VeranstaltungsVerwaltung';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Toaster } from '@/components/ui/toaster';

const IndexContent = () => {
  const { user, loading } = useAuth();
  const { isAdmin, isLagerAdmin, isSuperAdmin, adminLoading } = useAdminStatus();

  console.log('📊 Index render state:', { user: !!user, loading, adminLoading, isAdmin });
  
  // Zeige Loading-Spinner während Auth lädt
  if (loading) {
    console.log('⏳ Auth loading...');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-green-800 font-semibold">Lade Jagd Weetzen...</p>
        </div>
      </div>
    );
  }

  // Admin-Bereiche nur für angemeldete Administratoren anzeigen
  const showAdminAreas = user && isAdmin && !adminLoading;
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
      

      {/* Admin-Bereiche - NUR für angemeldete Administratoren */}
      {showAdminAreas && (
        <>
          <ShopVerwaltung />
          <ShopBestellVerwaltung />
          <VeranstaltungsVerwaltung />
          <BlogVerwaltungSimple />
          <KontaktVerwaltung />
          <ErweiterteBenutzerverwaltung />
        </>
      )}
      
      {/* Footer */}
      <Footer />
      <Toaster />
    </div>
  );
};

const Index = () => {
  return (
    <AuthProvider>
      <IndexContent />
    </AuthProvider>
  );
};

export default Index;