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
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Naherholungsgebiet Weetzer Stapelteiche */}
        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Naherholungsgebiet Weetzer Stapelteiche</CardTitle>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Die Stapelteichen in Weetzen, einem Ortsteil der Gemeinde Ronnenberg im Landkreis Hannover in Niedersachsen, sind ein faszinierendes Beispiel dafür, wie ehemalige Industrieareale zu attraktiven Naherholungsgebieten umgewandelt werden können. Diese künstlichen Gewässer entstanden im Kontext des Kali-Bergbaus und bieten heute eine Mischung aus Geschichte, Natur und Freizeitmöglichkeiten. In diesem Text werfen wir einen Blick auf ihre Entstehung, ihre Besonderheiten und ihre Bedeutung für die Region.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Entstehung und Historischer Hintergrund</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Die Stapelteichen verdanken ihre Existenz dem Kali-Bergbau, der in der Region um Hannover seit dem 19. Jahrhundert eine wichtige Rolle spielte. In Weetzen und Umgebung wurde Kali (Kaliumsalze) abgebaut, um Düngemittel, Chemikalien und andere Produkte herzustellen. Die Bergwerke, darunter das Kaliwerk Hansa, produzierten große Mengen an Abraum und Salzlaugen, die in sogenannten Absetzbecken gelagert wurden. Diese Becken, die als "Stapelteiche" bekannt sind, entstanden in den 1920er und 1930er Jahren durch das Aufschütten von Halden und das Ableiten von Prozesswässern.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Der Name "Stapelteiche" leitet sich von den gestapelten Halden ab, die die Teiche umgeben. Die Halden bestehen aus Gesteinsresten und Salzen, die aus dem Untergrund gefördert wurden. In den 1970er Jahren wurde der Bergbau in der Region eingestellt, und die Teiche fielen brach. Statt einer Industriebrache entwickelte sich jedoch ein natürliches Ökosystem, das heute unter Naturschutz steht.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Beschreibung und Natürliche Besonderheiten</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Heute umfassen die Stapelteichen ein Areal von etwa 100 Hektar, das aus mehreren Teichen, Halden und umliegenden Wäldern besteht. Die Teiche selbst sind relativ flach und salzhaltig, was eine einzigartige Flora und Fauna begünstigt. Hier finden sich salztolerante Pflanzen wie Salzmiere oder Strandaster, die an brackige Bedingungen angepasst sind. Die Gewässer ziehen zahlreiche Vogelarten an, darunter Enten, Reiher und seltene Watvögel, die die Teiche als Rast- und Brutplatz nutzen.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Die Halden, die bis zu 100 Meter hoch aufragen, bieten beeindruckende Ausblicke über die Landschaft. Sie sind größtenteils bewachsen und stabilisiert, um Erosion zu verhindern. Wanderwege führen um die Teiche herum und auf die Halden hinauf, was das Gebiet zu einem beliebten Ziel für Spaziergänger, Radfahrer und Naturliebhaber macht. Im Sommer laden die Uferbereiche zum Picknicken ein, und es gibt sogar Möglichkeiten zum Angeln (mit entsprechender Genehmigung).
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Ökologische und Kulturelle Bedeutung</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Die Stapelteichen sind nicht nur ein Relikt der Industriegeschichte, sondern auch ein wichtiges Naturschutzgebiet. Sie stehen unter dem Schutz des Landschaftsschutzgebiets "Stapelteiche" und sind Teil des europäischen Natura-2000-Netzwerks. Die salzhaltigen Böden fördern eine seltene Biodiversität, die in Niedersachsen sonst kaum vorkommt. Gleichzeitig erinnern Informationstafeln und ein kleines Bergbaumuseum in der Nähe an die harte Arbeit der Bergleute und die wirtschaftliche Bedeutung des Kali-Abbaus für die Region.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Allerdings gibt es auch Herausforderungen: Die Halden enthalten noch immer Salze, die bei starkem Regen ausgeschwemmt werden könnten und das Grundwasser belasten. Deshalb werden regelmäßige Sanierungsmaßnahmen durchgeführt, um die Umwelt zu schützen.
              </p>

              <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3">Warum die Stapelteiche besuchen?</h4>
              <p className="text-gray-700 leading-relaxed mb-4">
                Die Stapelteiche in Weetzen sind ein perfektes Ausflugsziel für alle, die Industriegeschichte mit Naturerlebnis verbinden möchten. Ob bei einem entspannten Spaziergang, einer Radtour oder einer Vogelbeobachtung – das Gebiet bietet Erholung pur. Es ist leicht erreichbar per Auto oder Bahn (Bahnhof Weetzen) und eignet sich hervorragend für Familienausflüge. Wer mehr über die Bergbaugeschichte erfahren will, kann die nahegelegenen Museen oder geführte Touren nutzen.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                Insgesamt zeigen die Stapelteichen, wie aus industriellen Hinterlassenschaften wertvolle Lebensräume entstehen können – ein Symbol für nachhaltige Umwandlung in einer modernen Welt. Wenn Sie in der Region sind, lohnt ein Besuch auf jeden Fall!
              </p>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                <p className="text-sm text-green-800 font-medium">
                  <strong>Wichtiger Hinweis:</strong> Bitte bleiben Sie auf den Wegen und nutzen Sie die Blühstreifenflächen nicht als Wanderwege! Vielen Dank
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};