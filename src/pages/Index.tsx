import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Hero } from '@/components/Hero';
import { Navigation } from '@/components/Navigation';
import { RevierInfo } from '@/components/RevierInfo';
import { Wildarten } from '@/components/Wildarten';
import { Praedatorenmanagement } from '@/components/Praedatorenmanagement';
import { Rehkitzrettung } from '@/components/Rehkitzrettung';
import { WildfleischShop } from '@/components/WildfleischShop';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { News } from '@/components/News';
import { AuthProvider, useAuth } from '@/contexts/AuthProvider';
import { ShopVerwaltung } from '@/components/ShopVerwaltung';
import { ShopBestellVerwaltung } from '@/components/ShopBestellVerwaltung';
import { BenutzerVerwaltung } from '@/components/BenutzerVerwaltung';
import { BlogVerwaltungSimple } from '@/components/BlogVerwaltungSimple';
import { KontaktVerwaltung } from '@/components/KontaktVerwaltung';
import { VeranstaltungsVerwaltung } from '@/components/VeranstaltungsVerwaltung';
import { useAdminStatus } from '@/hooks/useAdminStatus';
import { Toaster } from '@/components/ui/toaster';

const IndexContent = () => {
  const { user } = useAuth();
  const { isAdmin, isLagerAdmin, isSuperAdmin, adminLoading } = useAdminStatus();

  // Admin-Bereiche nur für angemeldete Administratoren anzeigen
  const showAdminAreas = user && isAdmin && !adminLoading;
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50">
      <Navigation />
      <Hero />
      <RevierInfo />
      <News />
      <Wildarten />
      <Praedatorenmanagement />
      <Rehkitzrettung />
      <WildfleischShop />
      <Contact />
      
      {/* Admin-Bereiche - NUR für angemeldete Administratoren */}
      {showAdminAreas && (
        <>
          <ShopVerwaltung />
          <ShopBestellVerwaltung />
          <VeranstaltungsVerwaltung />
          <BlogVerwaltungSimple />
          <KontaktVerwaltung />
          <BenutzerVerwaltung />
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