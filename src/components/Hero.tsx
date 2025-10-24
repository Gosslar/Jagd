import React from 'react';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative h-screen flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url('/images/weetzen.jpg')`
        }}
      />
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-6xl md:text-7xl font-bold mb-6 text-shadow-lg drop-shadow-2xl">
          Jagd Weetzen
        </h1>
        <p className="text-xl md:text-2xl mb-8 leading-relaxed font-medium text-shadow drop-shadow-lg">
          Erleben Sie nachhaltige Jagd in 340 Hektar naturbelassener Wald- und Feldlandschaft. 
          Tradition, Respekt vor der Natur und verantwortungsvolle Hege stehen im Mittelpunkt 
          unserer jagdlichen Aktivitäten.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={() => document.getElementById('revier')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Revier erkunden
          </button>
          <button 
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-transparent border-2 border-white hover:bg-white hover:text-green-800 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Kontakt aufnehmen
          </button>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-white animate-bounce">
        <svg className="w-6 h-6 drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
};