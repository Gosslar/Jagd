import React from 'react';
export const Hero: React.FC = () => {
  return <section id="home" className="relative h-screen flex items-center justify-center">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url('/images/jagd_wildlife_3.jpeg')`
    }} />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">Jagdrevier Weetzen</h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed">Erleben Sie nachhaltige Jagd in 340 Hektar naturbelassener Wald- und Feldlandschaft. Tradition, Respekt vor der Natur und verantwortungsvolle Hege stehen im Mittelpunkt unserer jagdlichen Aktivitäten.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={() => document.getElementById('revier')?.scrollIntoView({
          behavior: 'smooth'
        })} className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Revier erkunden
          </button>
          <button onClick={() => document.getElementById('contact')?.scrollIntoView({
          behavior: 'smooth'
        })} className="bg-transparent border-2 border-white hover:bg-white hover:text-gray-900 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            Kontakt aufnehmen
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>;
};