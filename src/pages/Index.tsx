import React from 'react';
import { AuthProvider } from '@/components/AuthProvider';
import { Navigation } from '@/components/Navigation';
import { Hero } from '@/components/Hero';
import { RevierInfo } from '@/components/RevierInfo';
import { Wildarten } from '@/components/Wildarten';
import { News } from '@/components/News';
import { Gallery } from '@/components/Gallery';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Navigation />
        <Hero />
        <RevierInfo />
        <Wildarten />
        <News />
        <Gallery />
        <Contact />
        <Footer />
        <Toaster />
      </div>
    </AuthProvider>
  );
};

export default Index;
