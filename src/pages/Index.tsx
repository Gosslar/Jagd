import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
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
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🚀 NEUE EINFACHE AUTH - Index gestartet');
    
    // Einfache Auth-Logik ohne komplexe Provider
    const initAuth = async () => {
      try {
        console.log('🔍 Prüfe aktuelle Session...');
        
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('❌ Session-Fehler:', error);
        } else {
          console.log('✅ Session gefunden:', !!session?.user, session?.user?.email);
          setUser(session?.user || null);
        }
        
        // Auth-State-Listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log('🔑 Auth-Änderung:', event, !!session?.user);
            setUser(session?.user || null);
          }
        );
        
        setLoading(false);
        console.log('✅ Auth-Initialisierung abgeschlossen');
        
        return () => subscription.unsubscribe();
        
      } catch (error) {
        console.error('❌ Auth-Initialisierung fehlgeschlagen:', error);
        setLoading(false);
        setUser(null);
      }
    };
    
    initAuth();
  }, []);

  console.log('📊 Render-Status:', { user: !!user, loading, timestamp: new Date().toISOString() });

  if (loading) {
    console.log('⏳ Zeige Loading-Spinner');
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-200 to-green-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-800 mx-auto"></div>
          <p className="mt-4 text-green-800 font-semibold">Lade Jagd Weetzen...</p>
          <p className="mt-2 text-green-700 text-sm">Einfache Auth wird initialisiert...</p>
        </div>
      </div>
    );
  }

  console.log('🏠 Zeige Hauptinhalt - User:', !!user);

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
      
      {/* Admin-Bereiche - Für alle angemeldeten Benutzer */}
      {user && (
        <>
          <div className="bg-yellow-100 p-4 m-4 rounded-lg">
            <p className="text-center font-bold text-green-800">
              🔑 ADMIN-BEREICHE - Angemeldet als: {user.email}
            </p>
          </div>
          <ShopVerwaltung />
          <ShopBestellVerwaltung />
          <VeranstaltungsVerwaltung />
          <BlogVerwaltungSimple />
          <KontaktVerwaltung />
          <BenutzerVerwaltung />
          <ErweiterteBenutzerverwaltung />
        </>
      )}

      {/* Footer */}
      <Footer />
      <Toaster />
    </div>
  );
};

export default Index;