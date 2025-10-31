import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, Award, Search } from 'lucide-react';

export const Jagdhunde: React.FC = () => {
  const jagdhunde = [
    {
      name: "Aron",
      rasse: "Alpenländische Dachsbracke",
      bild: "./images/alpenlaendische_dachsbracke_1.jpeg",
      beschreibung: "Die Alpenländische Dachsbracke ist ein robuster, mittelgroßer Jagdhund aus Österreich. Sie zeichnet sich durch ihre Ausdauer und ihren ausgeprägten Spürsinn aus.",
      eigenschaften: ["Spurlaut", "Ausdauernd", "Robust", "Vielseitig"],
      spezialisierung: "Nachsuche und Stöberjagd",
      farbe: "bg-amber-100 text-amber-800"
    },
    {
      name: "Atros", 
      rasse: "Brandlbracke",
      bild: "./images/brandlbracke_1.jpeg",
      beschreibung: "Die Brandlbracke, auch Österreichische Glatthaarige Bracke genannt, ist ein eleganter Jagdhund mit hervorragenden Spurarbeits-Fähigkeiten.",
      eigenschaften: ["Spurlaut", "Intelligent", "Arbeitsfreudig", "Zuverlässig"],
      spezialisierung: "Schweißarbeit und Nachsuche",
      farbe: "bg-green-100 text-green-800"
    },
    {
      name: "Bruno",
      rasse: "Deutsche Bracke", 
      bild: "./images/deutsche_bracke_1.jpeg",
      beschreibung: "Die Deutsche Bracke ist ein traditioneller deutscher Jagdhund, bekannt für ihre Zuverlässigkeit und ihren ausgezeichneten Spürsinn bei der Nachsuche.",
      eigenschaften: ["Spurlaut", "Gründlich", "Ausdauernd", "Gehorsam"],
      spezialisierung: "Nachsuche und Schweißarbeit",
      farbe: "bg-blue-100 text-blue-800"
    }
  ];

  return (
    <section id="jagdhunde" className="py-16 bg-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unsere geprüften Jagdhunde</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Lernen Sie unsere erfahrenen Jagdhunde kennen. Jeder von ihnen ist speziell ausgebildet 
            und geprüft für verschiedene Jagdaufgaben und unterstützt uns bei der waidgerechten Jagd.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {jagdhunde.map((hund, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={hund.bild}
                  alt={`${hund.name} - ${hund.rasse}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className={`${hund.farbe} font-semibold`}>
                    <Heart className="h-3 w-3 mr-1" />
                    {hund.name}
                  </Badge>
                </div>
              </div>
              
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-green-600" />
                  {hund.rasse}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                  {hund.beschreibung}
                </p>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Search className="h-4 w-4 text-green-600" />
                    Spezialisierung
                  </h4>
                  <Badge variant="outline" className="text-green-700 border-green-300">
                    {hund.spezialisierung}
                  </Badge>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Eigenschaften</h4>
                  <div className="flex flex-wrap gap-2">
                    {hund.eigenschaften.map((eigenschaft, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {eigenschaft}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 shadow-sm">
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Professionelle Jagdhundearbeit
            </h3>
            <p className="text-gray-600 max-w-4xl mx-auto">
              Unsere Jagdhunde sind nicht nur treue Begleiter, sondern auch hochspezialisierte Arbeitspartner. 
              Sie unterstützen uns bei der Nachsuche verletzten Wildes, der Stöberjagd und anderen jagdlichen Aufgaben. 
              Alle unsere Hunde haben erfolgreich ihre Brauchbarkeitsprüfungen absolviert und werden kontinuierlich 
              weitergebildet, um höchste Standards in der waidgerechten Jagd zu gewährleisten.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Geprüfte Qualität</h4>
              <p className="text-sm text-gray-600">
                Alle Hunde haben erfolgreich ihre Brauchbarkeitsprüfungen bestanden
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Search className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Spezialisierte Ausbildung</h4>
              <p className="text-sm text-gray-600">
                Jeder Hund ist auf spezielle Jagdaufgaben trainiert und ausgebildet
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Waidgerechte Jagd</h4>
              <p className="text-sm text-gray-600">
                Unterstützung bei ethischer und nachhaltiger Jagdpraxis
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};