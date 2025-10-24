import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Shield, Users } from 'lucide-react';

export const RevierInfo: React.FC = () => {
  return (
    <section id="revier" className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Unser Jagdrevier</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Jagd Weetzen erstreckt sich über 340 Hektar naturbelassener Wald- und Feldlandschaft 
            in Niedersachsen und bietet optimale Bedingungen für eine nachhaltige Jagd.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviergröße</CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">340 ha</div>
              <p className="text-xs text-muted-foreground">Wald- und Feldlandschaft</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jagdzeit</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Apr - Feb</div>
              <p className="text-xs text-muted-foreground">Je nach Wildart</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Hochsitze</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Strategisch platziert</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Jagdberechtigte</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">Erfahrene Jäger</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Jagdzeiten und Bestimmungen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-medium">Rehwild</span>
                <Badge variant="secondary">Mai - Januar</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Schwarzwild</span>
                <Badge variant="secondary">Ganzjährig</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Rotwild</span>
                <Badge variant="secondary">August - Januar</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Damwild</span>
                <Badge variant="secondary">September - Januar</Badge>
              </div>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Wichtiger Hinweis:</strong> Alle Jagdzeiten entsprechen den aktuellen 
                  landesrechtlichen Bestimmungen. Bitte beachten Sie zusätzliche Schonzeiten 
                  und Revierbeschränkungen.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revierausstattung</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">8 Hochsitze</h4>
                    <p className="text-sm text-gray-600">Strategisch über das gesamte Revier verteilt</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Wildkameras</h4>
                    <p className="text-sm text-gray-600">Moderne Überwachung des Wildbestands</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Wildäcker</h4>
                    <p className="text-sm text-gray-600">Natürliche Äsungsflächen für das Wild</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <h4 className="font-medium">Jagdhütte</h4>
                    <p className="text-sm text-gray-600">Zentrale Anlaufstelle mit Aufbrechplatz</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};