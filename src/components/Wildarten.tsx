import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const Wildarten: React.FC = () => {
  const wildarten = [
    {
      name: 'Rehwild',
      image: '/images/wildarten_2.jpeg',
      description: 'Das Rehwild ist die häufigste Wildart in unserem Revier. Die Population ist stabil und gesund.',
      bestand: 'Hoch',
      jagdzeit: 'Mai - Januar',
      besonderheiten: 'Brunftzeit im Juli/August'
    },
    {
      name: 'Schwarzwild',
      image: '/images/wildarten_3.jpeg',
      description: 'Wildschweine sind ganzjährig bejagbar und wichtig für die Waldpflege und Seuchenprophylaxe.',
      bestand: 'Mittel',
      jagdzeit: 'Ganzjährig',
      besonderheiten: 'Rauschzeit im Winter'
    },
    {
      name: 'Rotwild',
      image: '/images/wildarten_7.jpeg',
      description: 'Majestätische Hirsche durchziehen unser Revier, besonders in den frühen Morgenstunden.',
      bestand: 'Niedrig',
      jagdzeit: 'August - Januar',
      besonderheiten: 'Brunftzeit im September'
    },
    {
      name: 'Damwild',
      image: '/images/wildarten_6.jpeg',
      description: 'Eine kleinere Population von Damwild bereichert die Artenvielfalt unseres Reviers.',
      bestand: 'Niedrig',
      jagdzeit: 'September - Januar',
      besonderheiten: 'Geselliges Rudeltier'
    }
  ];

  const getBestandColor = (bestand: string) => {
    switch (bestand) {
      case 'Hoch': return 'bg-green-100 text-green-800';
      case 'Mittel': return 'bg-yellow-100 text-yellow-800';
      case 'Niedrig': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="wildarten" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Wildarten im Revier</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Unser Revier beherbergt eine vielfältige Wildpopulation. Hier finden Sie Informationen 
            zu den wichtigsten Wildarten und deren Bestand.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {wildarten.map((wild, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video relative">
                <img 
                  src={wild.image} 
                  alt={wild.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{wild.name}</CardTitle>
                  <Badge className={getBestandColor(wild.bestand)}>
                    {wild.bestand}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">{wild.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="font-medium">Jagdzeit:</span>
                    <Badge variant="outline">{wild.jagdzeit}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Besonderheiten:</span>
                    <span className="text-sm text-gray-600">{wild.besonderheiten}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <h3 className="text-xl font-bold text-green-900 mb-4">Wildbestandsmanagement</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 mb-2">~180</div>
              <p className="text-sm text-green-600">Stück Rehwild geschätzt</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 mb-2">~45</div>
              <p className="text-sm text-green-600">Stück Schwarzwild geschätzt</p>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-700 mb-2">~25</div>
              <p className="text-sm text-green-600">Stück Rotwild geschätzt</p>
            </div>
          </div>
          <p className="text-sm text-green-700 mt-4 text-center">
            Bestandszahlen basieren auf Wildkamera-Aufnahmen und Sichtungen der letzten Saison
          </p>
        </div>
      </div>
    </section>
  );
};