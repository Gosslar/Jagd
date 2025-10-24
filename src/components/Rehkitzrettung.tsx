import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users, Zap, Shield, Heart } from 'lucide-react';

export const Rehkitzrettung: React.FC = () => {
  return (
    <section id="rehkitzrettung" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Rehkitzrettung</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Der Schutz von Rehkitzen während der Mahd ist eine wichtige Aufgabe unseres Jagdreviers. 
            Mit modernster Technik und bewährten Methoden retten wir jährlich zahlreiche Jungtiere.
          </p>
        </div>

        {/* Hero Image */}
        <div className="mb-12">
          <div className="aspect-video relative rounded-lg overflow-hidden">
            <img 
              src="/images/rehkitzrettung_1.jpeg" 
              alt="Rehkitzrettung mit Drohne"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              <div className="text-center text-white">
                <h3 className="text-2xl font-bold mb-2">Moderne Rehkitzrettung</h3>
                <p className="text-lg">Technologie im Dienst des Tierschutzes</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Gerettete Kitze 2024</CardTitle>
              <Heart className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">47</div>
              <p className="text-xs text-muted-foreground">+23% zum Vorjahr</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Einsätze</CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">28</div>
              <p className="text-xs text-muted-foreground">Rettungseinsätze</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Helfer</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
              <p className="text-xs text-muted-foreground">Freiwillige Helfer</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Erfolgsquote</CardTitle>
              <Shield className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">94%</div>
              <p className="text-xs text-muted-foreground">Rettungsrate</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Methoden */}
          <Card>
            <CardHeader>
              <CardTitle>Unsere Rettungsmethoden</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">1</Badge>
                <div>
                  <h4 className="font-medium">Drohnen mit Wärmebildkamera</h4>
                  <p className="text-sm text-gray-600">
                    Modernste Technik zur Ortung von Rehkitzen vor der Mahd
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">2</Badge>
                <div>
                  <h4 className="font-medium">Vergrämung</h4>
                  <p className="text-sm text-gray-600">
                    Scheuchen und Duftstoffe zur Vertreibung der Ricken
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">3</Badge>
                <div>
                  <h4 className="font-medium">Absuche zu Fuß</h4>
                  <p className="text-sm text-gray-600">
                    Systematische Suche durch erfahrene Helfer
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Badge variant="secondary" className="mt-1">4</Badge>
                <div>
                  <h4 className="font-medium">Rettung und Umsetzung</h4>
                  <p className="text-sm text-gray-600">
                    Sichere Bergung und Verbringung an geschützte Orte
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Zeitplan */}
          <Card>
            <CardHeader>
              <CardTitle>Rettungssaison 2025</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-green-600" />
                  <span className="font-medium">Hauptsaison</span>
                </div>
                <Badge className="bg-green-100 text-green-800">Mai - Juli</Badge>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Einsatzzeiten</span>
                </div>
                <Badge variant="outline">05:00 - 08:00 Uhr</Badge>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Wichtige Termine:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• 15. April: Helferschulung</li>
                  <li>• 1. Mai: Saisonbeginn</li>
                  <li>• 15. Mai - 15. Juni: Hauptzeit</li>
                  <li>• 31. Juli: Saisonende</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technologie */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Moderne Technologie im Einsatz</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <img 
                  src="/images/rehkitzrettung_2.jpeg" 
                  alt="Wärmebildaufnahme Rehkitz"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="font-medium mb-2">Wärmebildtechnik</h4>
                <p className="text-sm text-gray-600">
                  Unsere Drohnen sind mit hochauflösenden Wärmebildkameras ausgestattet, 
                  die Rehkitze auch bei dichter Vegetation zuverlässig erkennen.
                </p>
              </div>
              <div>
                <img 
                  src="/images/rehkitzrettung_3.jpeg" 
                  alt="Rehkitz in Sicherheit"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="font-medium mb-2">Schonende Bergung</h4>
                <p className="text-sm text-gray-600">
                  Gefundene Kitze werden vorsichtig mit Handschuhen und Gras aufgenommen 
                  und an sichere Orte außerhalb der Mähfläche gebracht.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mitmachen */}
        <Card>
          <CardHeader>
            <CardTitle>Helfer werden</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">So können Sie helfen:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Teilnahme an Rettungseinsätzen</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Drohnenpilot mit Wärmebildkamera</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Koordination und Logistik</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Finanzielle Unterstützung</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-3">Voraussetzungen:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Frühe Aufstehzeiten (ab 5:00 Uhr)</li>
                  <li>• Körperliche Fitness für Feldarbeit</li>
                  <li>• Teilnahme an Einführungsschulung</li>
                  <li>• Zuverlässigkeit und Teamgeist</li>
                </ul>
                <div className="mt-4 p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    <strong>Kontakt:</strong> Melden Sie sich bei unserem Rehkitzrettungs-Team 
                    unter rehkitzrettung@jagd-weetzen.de
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};