import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { AlertTriangle, Car, Users, Lightbulb } from 'lucide-react';

export const JagdrevierInfobox: React.FC = () => {
  return (
    <section className="py-8 bg-gradient-to-r from-green-100 to-green-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="border-l-4 border-l-green-600 shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <AlertTriangle className="h-8 w-8 text-green-700" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Jagdrevier im Spannungsfeld: Eine Kurzübersicht
                </h3>
                
                <div className="prose prose-gray max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Unser lokales Jagdrevier steht unter doppeltem Druck: Die Zerschneidung durch Verkehrswege wie die B217 führt zu einer alarmierend hohen Zahl an Wildunfällen (Fallwild), die eine Gefahr für Tier und Mensch darstellen.
                  </p>
                  
                  <p className="text-gray-700 leading-relaxed mb-6">
                    Gleichzeitig sorgt der wachsende Freizeitdruck durch die Stadtbevölkerung für ständige Beunruhigung. Aktivitäten wie freilaufende Hunde oder das Verlassen der Wege stören die Wildtiere, schränken ihren Lebensraum ein und drängen sie in riskantere Gebiete nahe der Straßen.
                  </p>
                  
                  <div className="bg-white rounded-lg p-4 border border-green-200">
                    <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-700" />
                      Ein gemeinsames Handeln ist erforderlich. Wichtige Lösungsansätze sind:
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                        <Car className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-red-900 mb-1">Verkehrssicherheit</h5>
                          <p className="text-sm text-red-800">
                            Einsatz von Wildwarnreflektoren und Prüfung von Grünbrücken.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <Users className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-green-900 mb-1">Rücksichtsvolle Erholung</h5>
                          <p className="text-sm text-green-800">
                            Hunde anleinen, auf den Wegen bleiben und die Dämmerungsstunden meiden.
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <Lightbulb className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <h5 className="font-medium text-blue-900 mb-1">Aufklärung</h5>
                          <p className="text-sm text-blue-800">
                            Ein geschärftes Bewusstsein bei Anwohnern und Erholungssuchenden ist der Schlüssel zum Schutz unserer heimischen Tierwelt.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};