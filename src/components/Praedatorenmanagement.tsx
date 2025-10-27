import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Target, TrendingDown, Shield, AlertTriangle, Users, Calendar } from 'lucide-react';

export const Praedatorenmanagement: React.FC = () => {
  const predators = [
    {
      name: 'Fuchs',
      threat: 'Hoch',
      target: 'Niederwild, Bodenbrüter',
      methods: 'Fallenjagd, Ansitzjagd',
      season: 'Ganzjährig',
      images: [
        '/images/fuchs_praedator_1.jpeg',
        '/images/fuchs_praedator_2.jpeg',
        '/images/fuchs_praedator_3.jpeg'
      ]
    },
    {
      name: 'Waschbär',
      threat: 'Sehr Hoch',
      target: 'Gelege, Jungvögel',
      methods: 'Lebendfallen, Jagd',
      season: 'Ganzjährig',
      images: [
        '/images/waschbaer_praedator_1.jpeg',
        '/images/waschbaer_praedator_2.jpeg',
        '/images/waschbaer_praedator_3.jpeg'
      ]
    },
    {
      name: 'Dachs',
      threat: 'Mittel',
      target: 'Bodenbrüter, Gelege',
      methods: 'Fallenjagd, Baujagd',
      season: 'August - Januar',
      images: [
        '/images/dachs_praedator_1.jpeg',
        '/images/dachs_praedator_2.jpeg'
      ]
    },
    {
      name: 'Steinmarder',
      threat: 'Mittel',
      target: 'Kleinvögel, Eier',
      methods: 'Fallenjagd',
      season: 'Juli - Februar',
      images: [
        '/images/marder_praedator_2.jpeg',
        '/images/marder_praedator_1.png'
      ]
    },
    {
      name: 'Baummarder',
      threat: 'Mittel',
      target: 'Eichhörnchen, Vögel, Eier',
      methods: 'Fallenjagd, Ansitzjagd',
      season: 'Juli - Februar',
      images: [
        '/images/marder_praedator_4.jpeg',
        '/images/marder_praedator_3.webp'
      ]
    },
    {
      name: 'Nutria',
      threat: 'Hoch',
      target: 'Ufervegetation, Wasserpflanzen',
      methods: 'Fallenjagd, Lebendfallen',
      season: 'Ganzjährig',
      images: [
        '/images/nutria_praedator_1.jpeg',
        '/images/nutria_praedator_2.jpeg',
        '/images/nutria_praedator_3.jpeg'
      ]
    }
  ];

  const getThreatColor = (threat: string) => {
    switch (threat) {
      case 'Sehr Hoch': return 'bg-red-100 text-red-800';
      case 'Hoch': return 'bg-orange-100 text-orange-800';
      case 'Mittel': return 'bg-yellow-100 text-yellow-800';
      case 'Niedrig': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section id="praedatorenmanagement" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Prädatorenmanagement</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ein ausgewogenes Prädatorenmanagement ist essentiell für den Schutz unserer heimischen 
            Wildarten und die Erhaltung der Biodiversität in unserem Revier.
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Prädatoren 2024</CardTitle>
              <Target className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">67</div>
              <p className="text-xs text-muted-foreground">Entnommene Prädatoren</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Niederwildbestand</CardTitle>
              <TrendingDown className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">+18%</div>
              <p className="text-xs text-muted-foreground">Zunahme seit 2022</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Fallen aktiv</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">diverse</div>
              <p className="text-xs text-muted-foreground">Strategisch platziert</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erfolgsquote</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73%</div>
              <p className="text-xs text-muted-foreground">Fangeffizienz</p>
            </CardContent>
          </Card>
        </div>

        {/* Hero Image */}
        <div className="mb-12">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img 
              src="/images/praedatoren_1.jpeg" 
              alt="Prädatorenmanagement"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Nachhaltiges Prädatorenmanagement</h3>
                <p className="text-lg">Schutz der heimischen Artenvielfalt</p>
              </div>
            </div>
          </div>
        </div>

        {/* Predator Overview */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Hauptprädatoren in unserem Revier</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {predators.map((predator, index) => (
              <Card key={index} className="overflow-hidden">
                {/* Bildergalerie */}
                {predator.images && predator.images.length > 0 && (
                  <div className="aspect-video relative">
                    <img 
                      src={predator.images[0]} 
                      alt={predator.name}
                      className="w-full h-full object-cover"
                    />
                    {predator.images.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded">
                        +{predator.images.length - 1} weitere
                      </div>
                    )}
                  </div>
                )}
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{predator.name}</CardTitle>
                    <Badge className={getThreatColor(predator.threat)}>
                      {predator.threat}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">Bedrohung für:</span>
                      <span className="text-sm text-gray-600">{predator.target}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">Methoden:</span>
                      <span className="text-sm text-gray-600">{predator.methods}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium text-sm">Jagdzeit:</span>
                      <Badge variant="outline" className="text-xs">{predator.season}</Badge>
                    </div>
                    
                    {/* Zusätzliche Bilder als kleine Thumbnails */}
                    {predator.images && predator.images.length > 1 && (
                      <div className="pt-2 border-t">
                        <div className="flex gap-2 overflow-x-auto">
                          {predator.images.slice(1).map((image, imgIndex) => (
                            <img 
                              key={imgIndex}
                              src={image} 
                              alt={`${predator.name} ${imgIndex + 2}`}
                              className="w-12 h-12 object-cover rounded flex-shrink-0"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Management Strategies */}
          <Card>
            <CardHeader>
              <CardTitle>Unsere Managementstrategien</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-medium">Monitoring</h4>
                  <p className="text-sm text-gray-600">
                    Wildkameras und Spurensuche zur Bestandserfassung
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-medium">Selektive Bejagung</h4>
                  <p className="text-sm text-gray-600">
                    Gezielte Entnahme problematischer Individuen
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-medium">Fallenjagd</h4>
                  <p className="text-sm text-gray-600">
                    Ausschließlich Lebendfallen im Einsatz nach gesetzlichen Vorgaben
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-medium">Habitatmanagement</h4>
                  <p className="text-sm text-gray-600">
                    Schaffung von Schutzräumen für bedrohte Arten
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Framework */}
          <Card>
            <CardHeader>
              <CardTitle>Rechtliche Grundlagen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Jagdgesetz</h4>
                <p className="text-sm text-blue-800">
                  Prädatorenmanagement erfolgt nach den Bestimmungen des Bundesjagdgesetzes 
                  und der Landesjagdverordnung.
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-900 mb-2">Tierschutz</h4>
                <p className="text-sm text-green-800">
                  Alle Maßnahmen werden unter Beachtung des Tierschutzgesetzes 
                  und ethischer Grundsätze durchgeführt.
                </p>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Artenschutz</h4>
                <p className="text-sm text-yellow-800">
                  Schutz bedrohter heimischer Arten hat oberste Priorität 
                  bei allen Managementmaßnahmen.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Stories */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Erfolge des Prädatorenmanagements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-600 mb-2">+35%</div>
                <h4 className="font-medium mb-1">Rebhuhnbestand</h4>
                <p className="text-sm text-gray-600">Zunahme seit Programmbeginn</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-600 mb-2">+42%</div>
                <h4 className="font-medium mb-1">Bodenbrüter</h4>
                <p className="text-sm text-gray-600">Bruterfolg verschiedener Arten</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team and Training */}
        <div className="grid grid-cols-1 gap-8">

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Jahresplanung 2025
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Januar - März</span>
                  <Badge variant="outline">Hauptfangzeit</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">April - Juni</span>
                  <Badge variant="outline">Schonzeit Aufzucht</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Juli - September</span>
                  <Badge variant="outline">Monitoring</Badge>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm font-medium">Oktober - Dezember</span>
                  <Badge variant="outline">Intensive Bejagung</Badge>
                </div>
              </div>
              <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                <p className="text-sm text-orange-800">
                  <strong>Schulung:</strong> Jährliche Fortbildung für alle 
                  Beteiligten am 15. März 2025
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};